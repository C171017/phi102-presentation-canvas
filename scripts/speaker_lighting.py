"""Stage lighting for the paper-cut cast; keep the ink texture in the shadows."""
from PIL import Image, ImageEnhance, ImageFilter, ImageOps

def spotlight(frame, subject=None):
    shadow = ImageOps.colorize(ImageOps.grayscale(frame), '#151820', '#929299')
    shadow = Image.blend(shadow, frame, .08)
    if subject is None:
        return shadow
    light = ImageEnhance.Color(frame).enhance(1.32)
    light = ImageEnhance.Brightness(light).enhance(1.12)
    # Feather past the outline so the face and clothing stay fully lit.
    spread = max(3, 2 * round(frame.width / 180) + 1)
    mask = subject.filter(ImageFilter.MaxFilter(spread)).filter(
        ImageFilter.GaussianBlur(frame.width / 225))
    return Image.composite(light, shadow, mask)
