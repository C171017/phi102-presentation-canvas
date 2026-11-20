// Renders the original paper to lossless WebP and records passage, highlight, and glossary coordinates.
//
//   swift scripts/render-paper-pages.swift <paper.pdf> <anchors.json> <output-dir> [pixel-width]
//
// Uses macOS PDFKit and cwebp. The generated files under public/readings/ are tracked so
// production builds can copy them without running this script.
import Foundation
import PDFKit
import ImageIO
import UniformTypeIdentifiers

var stagingToClean: URL?
func fail(_ message: String) -> Never {
  FileHandle.standardError.write(Data("error: \(message)\n".utf8))
  if let stagingToClean { try? FileManager.default.removeItem(at: stagingToClean) }
  exit(1)
}

let args = CommandLine.arguments
guard args.count >= 4 else {
  fail("usage: render-paper-pages.swift <paper.pdf> <anchors.json> <output-dir> [pixel-width]")
}
let pdfURL = URL(fileURLWithPath: args[1])
let anchorsURL = URL(fileURLWithPath: args[2])
let outputURL = URL(fileURLWithPath: args[3], isDirectory: true)
let pixelWidth = args.count > 4 ? Int(args[4]) ?? 0 : 1500
guard (400...4000).contains(pixelWidth) else { fail("pixel-width must be between 400 and 4000") }

guard let document = PDFDocument(url: pdfURL) else { fail("cannot open \(pdfURL.path)") }
guard let anchorData = try? Data(contentsOf: anchorsURL),
      let config = try? JSONSerialization.jsonObject(with: anchorData) as? [String: Any],
      let title = config["title"] as? String,
      let anchorList = config["anchors"] as? [[String: String]] else {
  fail("cannot read \(anchorsURL.path): expected { \"title\": ..., \"anchors\": [{ \"id\", \"find\" }] }")
}
struct GlossaryTerm: Decodable {
  let id: String
  let aliases: [String]
}

let glossaryURL = URL(fileURLWithPath: #filePath).deletingLastPathComponent().deletingLastPathComponent()
  .appendingPathComponent("src/paper-glossary-data.json")
guard let glossaryData = try? Data(contentsOf: glossaryURL),
      let glossary = try? JSONDecoder().decode([GlossaryTerm].self, from: glossaryData) else {
  fail("cannot read \(glossaryURL.path)")
}

func glossaryPattern(_ alias: String) -> String {
  let lineBreak = #"[-‐\u00ad][\t ]*\R[\t ]*"#
  let characters = Array(alias)
  return #"(?<!\p{L})"# + characters.enumerated().map { index, character in
    switch character {
    case " ": return #"\s+"#
    case "-": return #"[-‐‑\u00ad]\u00ad?[\t ]*(?:\R[\t ]*)?"#
    default:
      let literal = NSRegularExpression.escapedPattern(for: String(character))
      if character.isLetter, index + 1 < characters.count, characters[index + 1].isLetter {
        return literal + "(?:\(lineBreak))?"
      }
      return literal
    }
  }.joined() + #"(?!\p{L})"#
}

let glossaryPatterns = glossary.flatMap { term in
  term.aliases.map { alias in
    (id: term.id, regex: try! NSRegularExpression(pattern: glossaryPattern(alias), options: .caseInsensitive))
  }
}

struct GlossaryOccurrence: Encodable {
  let term: String
  let boxes: [[Int]]
}

// PDFKit can insert newlines between fragments on the same printed line, for
// example around italic letters. Merge using the actual positions.
func glossaryBounds(_ selection: PDFSelection, on page: PDFPage) -> [CGRect] {
  var lines: [CGRect] = []
  for line in selection.selectionsByLine() {
    let rect = line.bounds(for: page)
    guard !rect.isEmpty else { continue }
    if let previous = lines.last, abs(rect.midY - previous.midY) < min(rect.height, previous.height) / 3 {
      lines[lines.count - 1] = previous.union(rect)
    } else {
      lines.append(rect)
    }
  }
  return lines
}

func glossaryOccurrences(_ page: PDFPage, in box: CGRect, beforeBibliography: inout Bool) -> [GlossaryOccurrence] {
  guard beforeBibliography, let text = page.string else { return [] }
  let source = text as NSString
  let bibliography = source.range(of: "\nBibliography\n")
  beforeBibliography = bibliography.location == NSNotFound
  let searchRange = NSRange(location: 0, length: beforeBibliography ? source.length : bibliography.location)
  let matches = glossaryPatterns.flatMap { pattern in
    pattern.regex.matches(in: text, range: searchRange).map { (term: pattern.id, range: $0.range) }
  }.sorted { first, second in
    if first.range.location != second.range.location { return first.range.location < second.range.location }
    return first.range.length > second.range.length
  }
  // PDFKit applies this transform inside draw(with:to:), in addition to the
  // renderer's explicit crop-origin translation. Selections lack that transform.
  let drawingTransform = page.transform(for: .cropBox)
  var occurrences: [GlossaryOccurrence] = []
  var endOfPrevious = 0
  for match in matches {
    guard match.range.location >= endOfPrevious, let selection = page.selection(for: match.range) else { continue }
    let boxes = glossaryBounds(selection, on: page)
      .map { normalizedBounds($0.applying(drawingTransform), in: box) }
      .filter { $0[0] < $0[2] && $0[1] < $0[3] }
    guard !boxes.isEmpty else { continue }
    occurrences.append(GlossaryOccurrence(term: match.term, boxes: boxes))
    endOfPrevious = NSMaxRange(match.range)
  }
  return occurrences
}

// Render into a sibling folder first so a failed run never leaves a half-written set.
let fileManager = FileManager.default
let stagingURL = outputURL.deletingLastPathComponent().appendingPathComponent(outputURL.lastPathComponent + ".tmp-" + UUID().uuidString, isDirectory: true)
stagingToClean = stagingURL
do { try fileManager.createDirectory(at: stagingURL, withIntermediateDirectories: true) }
catch { fail("cannot create \(stagingURL.path): \(error.localizedDescription)") }

func writePage(_ image: CGImage, to url: URL) throws {
  let png = url.deletingPathExtension().appendingPathExtension("png")
  defer { try? fileManager.removeItem(at: png) }
  guard let destination = CGImageDestinationCreateWithURL(png as CFURL, UTType.png.identifier as CFString, 1, nil) else {
    throw CocoaError(.fileWriteUnknown)
  }
  CGImageDestinationAddImage(destination, image, nil)
  guard CGImageDestinationFinalize(destination) else { throw CocoaError(.fileWriteUnknown) }

  let encoder = Process()
  encoder.executableURL = URL(fileURLWithPath: "/usr/bin/env")
  encoder.arguments = ["cwebp", "-quiet", "-lossless", "-z", "6", "-exact", "-metadata", "icc", png.path, "-o", url.path]
  try encoder.run()
  encoder.waitUntilExit()
  guard encoder.terminationStatus == 0 else { throw CocoaError(.fileWriteUnknown) }
}

var pages: [[String: Any]] = []
var pageWords: [String: [[[Int]]]] = [:]
var pageGlossary: [String: [GlossaryOccurrence]] = [:]
var beforeBibliography = true
let wordPattern = try! NSRegularExpression(pattern: #"\S+"#)

// Match the pane's image coordinates, with the origin at the top left.
func normalizedBounds(_ rect: CGRect, in box: CGRect) -> [Int] {
  [
    (rect.minX - box.minX) / box.width, (box.maxY - rect.maxY) / box.height,
    (rect.maxX - box.minX) / box.width, (box.maxY - rect.minY) / box.height,
  ].map { Int(($0 * 10000).rounded()) }
}

func wordBounds(_ page: PDFPage, in box: CGRect) -> [[[Int]]] {
  guard let text = page.string else { return [] }
  let string = text as NSString
  let matches = wordPattern.matches(in: text, range: NSRange(location: 0, length: string.length))
  var words: [[[Int]]] = []
  var previous: (range: NSRange, text: String, rect: CGRect)?
  for match in matches {
    guard let rect = page.selection(for: match.range)?.bounds(for: page), !rect.isEmpty else { continue }
    let token = string.substring(with: match.range)
    let bounds = normalizedBounds(rect, in: box)

    // A typeset line break can split a word into two rectangles. Include both
    // when either half is selected. PDFKit also inserts newlines on the same
    // visual line, so require a move down and back to the left.
    if let previous, previous.text.last.map({ "-‐\u{00ad}".contains($0) }) == true,
       previous.text.dropLast().last?.isLetter == true, token.first?.isLowercase == true,
       rect.minX < previous.rect.midX,
       (0.6...1.5).contains((previous.rect.midY - rect.midY) / previous.rect.height),
       string.substring(with: NSRange(location: NSMaxRange(previous.range),
                                     length: match.range.location - NSMaxRange(previous.range)))
         .rangeOfCharacter(from: .newlines) != nil {
      words[words.count - 1].append(bounds)
    } else {
      words.append([bounds])
    }
    previous = (match.range, token, rect)
  }
  return words
}

for index in 0..<document.pageCount {
  guard let page = document.page(at: index) else { fail("cannot read page \(index + 1)") }
  guard page.rotation == 0 else { fail("page \(index + 1) is rotated; this script renders upright pages only") }
  // Remove highlight annotations from the in-memory rendering source only.
  for annotation in page.annotations where annotation.type == "Highlight" {
    page.removeAnnotation(annotation)
  }
  let box = page.bounds(for: .cropBox)
  let scale = CGFloat(pixelWidth) / box.width
  let pixelHeight = Int((box.height * scale).rounded())
  guard let colorSpace = CGColorSpace(name: CGColorSpace.sRGB),
        let context = CGContext(data: nil, width: pixelWidth, height: pixelHeight, bitsPerComponent: 8, bytesPerRow: 0,
                                space: colorSpace, bitmapInfo: CGImageAlphaInfo.noneSkipLast.rawValue) else {
    fail("cannot create a bitmap for page \(index + 1)")
  }
  context.setFillColor(CGColor(red: 1, green: 1, blue: 1, alpha: 1))
  context.fill(CGRect(x: 0, y: 0, width: pixelWidth, height: pixelHeight))
  context.interpolationQuality = .high
  context.scaleBy(x: scale, y: scale)
  context.translateBy(x: -box.origin.x, y: -box.origin.y)
  page.draw(with: .cropBox, to: context)

  let file = String(format: "page-%02d.webp", index + 1)
  pageWords[file] = wordBounds(page, in: box)
  let rasterBounds = CGRect(x: box.minX, y: box.minY, width: box.width, height: CGFloat(pixelHeight) / scale)
  let occurrences = glossaryOccurrences(page, in: rasterBounds, beforeBibliography: &beforeBibliography)
  if !occurrences.isEmpty { pageGlossary[file] = occurrences }
  guard let image = context.makeImage() else { fail("cannot make an image for \(file)") }
  do { try writePage(image, to: stagingURL.appendingPathComponent(file)) }
  catch { fail("cannot encode \(file) with cwebp: \(error.localizedDescription)") }

  // The printed page number is the last three-digit line of the page text.
  let lines = (page.string ?? "").split(whereSeparator: \.isNewline).map { $0.trimmingCharacters(in: .whitespaces) }
  let printed = lines.last(where: { $0.count == 3 && $0.allSatisfy(\.isNumber) }) ?? String(index + 1)
  pages.append(["file": file, "width": pixelWidth, "height": pixelHeight, "printed": printed])
}

// A passage shares its first line when another sentence ends to its left.
// Place the color change between the two, using the same coordinates as the page image.
func sharedLineSplit(_ selection: PDFSelection, on page: PDFPage, rect: CGRect, in box: CGRect) -> [String: Double]? {
  guard let text = page.string, selection.numberOfTextRanges(on: page) > 0 else { return nil }
  let start = selection.range(at: 0, on: page).location
  guard start > 0, start <= (text as NSString).length else { return nil }
  let previousCharacter = (text as NSString).rangeOfCharacter(
    from: .whitespacesAndNewlines.inverted, options: .backwards, range: NSRange(location: 0, length: start)
  )
  guard previousCharacter.location != NSNotFound,
        let previous = page.selection(for: previousCharacter)?.bounds(for: page),
        !previous.isEmpty, previous.maxX <= rect.minX,
        abs(previous.midY - rect.midY) < rect.height / 2 else { return nil }
  let x = ((previous.maxX + rect.minX) / 2 - box.minX) / box.width
  let bottom = (box.maxY - min(previous.minY, rect.minY)) / box.height
  return ["x": (x * 10000).rounded() / 10000, "bottom": (bottom * 10000).rounded() / 10000]
}

// y is the fraction of the page height from its top edge to the first line of the passage.
var anchors: [String: [String: Any]] = [:]
for entry in anchorList {
  guard let id = entry["id"], let phrase = entry["find"] else { fail("every anchor needs an id and a find phrase") }
  let matches = document.findString(phrase, withOptions: .literal)
  guard let match = matches.first, let line = match.selectionsByLine().first, let page = line.pages.first else {
    fail("anchor \(id): could not find \"\(phrase)\" in the PDF")
  }
  let box = page.bounds(for: .cropBox)
  let rect = line.bounds(for: page)
  let y = ((box.maxY - rect.maxY) / box.height * 10000).rounded() / 10000
  let pageIndex = document.index(for: page)
  anchors[id] = ["page": pageIndex, "y": y]
  if let split = sharedLineSplit(match, on: page, rect: rect, in: box) {
    anchors[id]?["split"] = split
  }
  let note = matches.count > 1 ? " (\(matches.count) matches, using the first)" : ""
  let label = id.padding(toLength: 24, withPad: " ", startingAt: 0)
  print("  \(label) page \(String(format: "%2ld", pageIndex + 1))  y \(String(format: "%.3f", y))  \(phrase)\(note)")
}

let manifest: [String: Any] = [
  "version": 1, "title": title, "source": pdfURL.lastPathComponent, "pages": pages, "anchors": anchors,
]
let indexedTerms = Set(pageGlossary.values.flatMap { $0.map(\.term) })
let missingTerms = glossary.map(\.id).filter { !indexedTerms.contains($0) }
if !missingTerms.isEmpty { fail("no paper matches for glossary terms: \(missingTerms.joined(separator: ", "))") }
do {
  let json = try JSONSerialization.data(withJSONObject: manifest, options: [.prettyPrinted, .sortedKeys])
  try json.write(to: stagingURL.appendingPathComponent("manifest.json"))
  let words = try JSONSerialization.data(withJSONObject: pageWords, options: [.sortedKeys])
  try words.write(to: stagingURL.appendingPathComponent("words.json"))
  let glossaryEncoder = JSONEncoder()
  glossaryEncoder.outputFormatting = [.sortedKeys]
  let glossaryIndex = try glossaryEncoder.encode(pageGlossary)
  try glossaryIndex.write(to: stagingURL.appendingPathComponent("glossary.json"))
  if fileManager.fileExists(atPath: outputURL.path) {
    _ = try fileManager.replaceItemAt(outputURL, withItemAt: stagingURL)
  } else {
    try fileManager.createDirectory(at: outputURL.deletingLastPathComponent(), withIntermediateDirectories: true)
    try fileManager.moveItem(at: stagingURL, to: outputURL)
  }
} catch {
  fail("cannot finish \(outputURL.path): \(error.localizedDescription)")
}
print("Rendered \(document.pageCount) pages at \(pixelWidth)px wide to \(outputURL.path)")
