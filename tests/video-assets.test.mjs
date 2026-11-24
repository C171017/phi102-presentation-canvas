import assert from 'node:assert/strict';
import { test } from 'node:test';
import { serveVideo } from '../server/video-assets.ts';

globalThis.FixedLengthStream = class extends TransformStream { constructor() { super(); } };

function requestVideo(range, ifRange) {
  const headers = { Range: range, ...(ifRange && { 'If-Range': ifRange }) };
  return serveVideo(new Request('https://example.test/media/opening.mp4', { headers }), {
    fetch(request) {
      assert.equal(request.headers.get('Range'), null);
      assert.equal(request.headers.get('If-Range'), null);
      const encoder = new TextEncoder();
      const body = new ReadableStream({
        start(controller) {
          for (const chunk of ['012', '345', '6789']) controller.enqueue(encoder.encode(chunk));
          controller.close();
        },
      });
      return new Response(body, {
        headers: { 'Content-Type': 'video/mp4', ETag: '"video"' },
      });
    },
  }, 10);
}

test('Safari’s two-byte probe and seeks return the requested bytes and length', async () => {
  for (const [range, expected, contentRange] of [
    ['bytes=0-1', '01', 'bytes 0-1/10'],
    ['bytes=2-6', '23456', 'bytes 2-6/10'],
    ['bytes=8-', '89', 'bytes 8-9/10'],
    ['bytes=-3', '789', 'bytes 7-9/10'],
  ]) {
    const response = await requestVideo(range, '"video"');
    assert.equal(response.status, 206);
    assert.equal(response.headers.get('Content-Range'), contentRange);
    assert.equal(response.headers.get('Content-Length'), String(expected.length));
    assert.equal(response.headers.get('Accept-Ranges'), 'bytes');
    assert.equal(await response.text(), expected);
  }
});

test('video ranges handle stale validators and out-of-bounds offsets', async () => {
  const stale = await requestVideo('bytes=0-1', '"old"');
  assert.equal(stale.status, 200);
  assert.equal(await stale.text(), '0123456789');

  const invalid = await requestVideo('bytes=10-');
  assert.equal(invalid.status, 416);
  assert.equal(invalid.headers.get('Content-Range'), 'bytes */10');
});
