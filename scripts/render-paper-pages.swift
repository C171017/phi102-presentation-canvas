// Renders the reading PDF for the original-paper pane and records where each
// slide's passage starts on its page.
//
//   swift scripts/render-paper-pages.swift <paper.pdf> <anchors.json> <output-dir> [pixel-width]
//
// Uses macOS PDFKit. The generated pages and manifest under public/readings/
// are tracked so production builds can copy them without running this script.
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
