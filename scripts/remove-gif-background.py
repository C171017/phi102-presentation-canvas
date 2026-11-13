"""Remove connected paper background, preserving enclosed circle/bubble fills.

Uses local ffmpeg; source GIF remains unchanged. No image generation is involved.
"""
from collections import deque
from pathlib import Path
import json
import subprocess

root = Path(__file__).resolve().parents[1]
folder = root / 'public/generated/contextualism/orbit-five-sunburst'
source = folder / 'orbit-five-sunburst-2026-11-13T04-37-36-474Z-half-speed.gif'
target = folder / 'orbit-five-sunburst-transparent-half-speed.gif'
ffmpeg = '/opt/homebrew/bin/ffmpeg'
probe = json.loads(subprocess.check_output(['/opt/homebrew/bin/ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height,nb_frames:format=duration', '-of', 'json', str(source)]))
width, height = (probe['streams'][0][k] for k in ('width', 'height'))
count = int(probe['streams'][0]['nb_frames'])
duration = float(probe['format']['duration'])
raw = bytearray(subprocess.check_output([ffmpeg, '-v', 'error', '-i', str(source), '-f', 'rawvideo', '-pix_fmt', 'rgba', '-']))
frame_bytes = width * height * 4
assert len(raw) == count * frame_bytes
for frame in range(count):
    offset = frame * frame_bytes
    allowed = bytearray(width * height)
    for pixel in range(width * height):
        i = offset + pixel * 4
        r, g, b = raw[i:i+3]
        allowed[pixel] = min(r, g, b) > 155 and max(r, g, b) - min(r, g, b) < 44
    queue = deque()
    def enqueue(pixel):
        if allowed[pixel]:
            allowed[pixel] = 0
            raw[offset + pixel * 4 + 3] = 0
            queue.append(pixel)
    # Discard the generated image's faint one-pixel rectangular frame too.
    for y in range(height):
        for x in range(width):
            if x < 2 or y < 2 or x >= width - 2 or y >= height - 2:
                raw[offset + (y * width + x) * 4 + 3] = 0
    for x in range(2, width - 2):
        enqueue(2 * width + x)
        enqueue((height - 3) * width + x)
    for y in range(2, height - 2):
        enqueue(y * width + 2)
        enqueue(y * width + width - 3)
    while queue:
        pixel = queue.popleft()
        x, y = pixel % width, pixel // width
        if x: enqueue(pixel - 1)
        if x + 1 < width: enqueue(pixel + 1)
        if y: enqueue(pixel - width)
        if y + 1 < height: enqueue(pixel + width)
temp = target.with_name('transparent-building.gif')
subprocess.run([ffmpeg, '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgba', '-s', f'{width}x{height}', '-framerate', str(count / duration), '-i', 'pipe:0', '-filter_complex', '[0:v]split[a][b];[a]palettegen=reserve_transparent=1[p];[b][p]paletteuse=alpha_threshold=128:dither=none', '-loop', '0', str(temp)], input=raw, check=True)
temp.replace(target)
print(f'Saved transparent GIF: {count} frames, {duration:g} seconds; original preserved.')
