// Renders every page of the reading PDF to a PNG for the local-dev "Original
// paper" pane, and records passage anchors and word bounds for highlighting.
//
//   swift scripts/render-paper-pages.swift <paper.pdf> <anchors.json> <output-dir> [pixel-width]
//
// Uses macOS PDFKit, so no extra tools are needed. The output is only ever read
// by `npm run dev`; it lives outside `public/` so Vite never copies it into a
// build.
import Foundation
import PDFKit
import ImageIO
import UniformTypeIdentifiers

func fail(_ message: String) -> Never {
  FileHandle.standardError.write(Data("error: \(message)\n".utf8))
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

// Render into a sibling folder first so a failed run never leaves a half-written set.
let fileManager = FileManager.default
let stagingURL = outputURL.deletingLastPathComponent().appendingPathComponent(outputURL.lastPathComponent + ".tmp", isDirectory: true)
try? fileManager.removeItem(at: stagingURL)
do { try fileManager.createDirectory(at: stagingURL, withIntermediateDirectories: true) }
catch { fail("cannot create \(stagingURL.path): \(error.localizedDescription)") }

var pages: [[String: Any]] = []
var pageWords: [String: [[[Int]]]] = [:]
let wordPattern = try! NSRegularExpression(pattern: #"\S+"#)

// Match the pane's image coordinates, with the origin at the top left.
func wordBounds(_ page: PDFPage, in box: CGRect) -> [[[Int]]] {
  guard let text = page.string else { return [] }
  let string = text as NSString
  let matches = wordPattern.matches(in: text, range: NSRange(location: 0, length: string.length))
  var words: [[[Int]]] = []
  var previous: (range: NSRange, text: String, rect: CGRect)?
  for match in matches {
    guard let rect = page.selection(for: match.range)?.bounds(for: page), !rect.isEmpty else { continue }
    let token = string.substring(with: match.range)
    let bounds = [
      (rect.minX - box.minX) / box.width, (box.maxY - rect.maxY) / box.height,
      (rect.maxX - box.minX) / box.width, (box.maxY - rect.minY) / box.height,
    ].map { Int(($0 * 10000).rounded()) }

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

  let file = String(format: "page-%02d.png", index + 1)
  pageWords[file] = wordBounds(page, in: box)
  guard let image = context.makeImage(),
        let destination = CGImageDestinationCreateWithURL(stagingURL.appendingPathComponent(file) as CFURL, UTType.png.identifier as CFString, 1, nil) else {
    fail("cannot encode \(file)")
  }
  CGImageDestinationAddImage(destination, image, nil)
  guard CGImageDestinationFinalize(destination) else { fail("cannot write \(file)") }

  // The printed page number is the last three-digit line of the page text.
  let lines = (page.string ?? "").split(whereSeparator: \.isNewline).map { $0.trimmingCharacters(in: .whitespaces) }
  let printed = lines.last(where: { $0.count == 3 && $0.allSatisfy(\.isNumber) }) ?? String(index + 1)
  pages.append(["file": file, "width": pixelWidth, "height": pixelHeight, "printed": printed])
}

// y is the fraction of the page height from its top edge to the first line of the passage.
var anchors: [String: [String: Any]] = [:]
for entry in anchorList {
  guard let id = entry["id"], let phrase = entry["find"] else { fail("every anchor needs an id and a find phrase") }
  let matches = document.findString(phrase, withOptions: .literal)
  guard let line = matches.first?.selectionsByLine().first, let page = line.pages.first else {
    fail("anchor \(id): could not find \"\(phrase)\" in the PDF")
  }
  let box = page.bounds(for: .cropBox)
  let rect = line.bounds(for: page)
  let y = ((box.maxY - rect.maxY) / box.height * 10000).rounded() / 10000
  let pageIndex = document.index(for: page)
  anchors[id] = ["page": pageIndex, "y": y]
  let note = matches.count > 1 ? " (\(matches.count) matches, using the first)" : ""
  let label = id.padding(toLength: 24, withPad: " ", startingAt: 0)
  print("  \(label) page \(String(format: "%2ld", pageIndex + 1))  y \(String(format: "%.3f", y))  \(phrase)\(note)")
}

let manifest: [String: Any] = [
  "version": 1, "title": title, "source": pdfURL.lastPathComponent, "pages": pages, "anchors": anchors,
]
do {
  let json = try JSONSerialization.data(withJSONObject: manifest, options: [.prettyPrinted, .sortedKeys])
  try json.write(to: stagingURL.appendingPathComponent("manifest.json"))
  let words = try JSONSerialization.data(withJSONObject: pageWords, options: [.sortedKeys])
  try words.write(to: stagingURL.appendingPathComponent("words.json"))
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
