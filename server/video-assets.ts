// The Workers asset binding serves whole files. Safari needs a real 206 and
// Content-Length for its byte probe and seeks.
export async function serveVideo(request: Request, assets: Fetcher, size: number): Promise<Response> {
  const range = request.method === 'GET' && request.headers.get('Range');
  const match = range && /^bytes=(\d*)-(\d*)$/i.exec(range.trim());
  if (!match || (!match[1] && !match[2])) return assets.fetch(request);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.delete('Range');
  requestHeaders.delete('If-Range');
  requestHeaders.set('Accept-Encoding', 'identity');
  const asset = await assets.fetch(new Request(request, { headers: requestHeaders }));
  if (asset.status !== 200 || !asset.body || !asset.headers.get('Content-Type')?.startsWith('video/mp4')) return asset;

  const ifRange = request.headers.get('If-Range');
  if (ifRange && ifRange !== asset.headers.get('ETag') && ifRange !== asset.headers.get('Last-Modified')) return asset;

  const start = match[1] ? Number(match[1]) : Math.max(0, size - Number(match[2]));
  const end = match[1] && match[2] ? Math.min(size - 1, Number(match[2])) : size - 1;
  const headers = new Headers(asset.headers);
  headers.set('Accept-Ranges', 'bytes');
  if (start > end) {
    void asset.body.cancel().catch(() => {});
    headers.delete('Content-Length');
    headers.set('Content-Range', `bytes */${size}`);
    return new Response(null, { status: 416, headers });
  }

  const length = end - start + 1;
  const { readable, writable } = new FixedLengthStream(length);
  headers.set('Content-Range', `bytes ${start}-${end}/${size}`);
  headers.set('Content-Length', String(length));
  void writeBytes(asset.body, writable, start, end + 1);
  return new Response(readable, { status: 206, headers });
}

async function writeBytes(body: ReadableStream<Uint8Array>, stream: WritableStream<Uint8Array>, start: number, end: number) {
  const writer = stream.getWriter();
  let offset = 0;
  try {
    for await (const chunk of body) {
      const next = offset + chunk.byteLength;
      if (next > start) await writer.write(chunk.subarray(Math.max(0, start - offset), end - offset));
      if (next >= end) break;
      offset = next;
    }
    await writer.close();
  } catch (error) {
    await writer.abort(error).catch(() => {});
  }
}
