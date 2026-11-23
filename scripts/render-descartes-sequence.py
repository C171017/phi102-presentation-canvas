"""Composite the approved chorus into the existing stove-room shot, using one camera."""
from pathlib import Path
from speaker_lighting import spotlight
from PIL import Image, ImageDraw, ImageFilter

root = Path(__file__).resolve().parents[1]
art = root/'archive/ink-ocean/backgrounds'
original = Image.open(art/'L5-01-descartes.webp').convert('RGB')

atlas = Image.open(root/'src/assets/regress/sowatt-poses.webp').convert('RGBA')
scale = original.width/600
def pixels(box): return tuple(round(v*scale) for v in box)
voices = [atlas.crop((x,2,x+w,2+h)) for x,w,h in [(2,143,155),(149,118,123),(271,113,128),(388,108,120),(500,93,148)]]
def chorus(frame,x,y,width,subject,active=None,small=False):
    for i,voice in enumerate(voices):
        w=width*(1-.11*i); piece=voice.resize(pixels((w,w*voice.height/voice.width)),Image.Resampling.LANCZOS)

        frame.paste(piece,pixels((x,y+i*(.7 if small else 2))),piece)
        x+=w*.92
# The window carries the parent chorus. One matching offspring comes inside.
shots=[('parent',None),('budding',None),('local-narration',None),('copy','Y'),('reply','Descartes'),('challenge','SOWHAT'),('hardens','Descartes'),('falls',None),('lands',None)]
for beat,speaker in shots:
    frame=original.copy()
    subject=Image.new('L',frame.size)
    if speaker=='Descartes':
        outline=[(25,104),(47,61),(86,41),(88,26),(109,0),(194,0),(204,21),(186,56),(167,73),(181,113),(189,125),(52,125)]
        ImageDraw.Draw(subject).polygon([pixels((2*x,2*y)) for x,y in outline],fill=255)
        subject=subject.filter(ImageFilter.GaussianBlur(8*scale))
    if beat!='lands':
        box=pixels((351,158,361,170)); patch=original.crop(pixels((340,158,350,170)))
        frame.paste(patch,box)
    chorus(frame,10,47,22,subject,small=True)
    if beat=='budding':
        draw=ImageDraw.Draw(frame)
        for i in range(5):
            x=23+i*16;draw.line(pixels((x,66,x+7,80)),fill='#342b22',width=round(2*scale))
        chorus(frame,23,76,13,subject,small=True)
    elif beat!='parent':
        chorus(frame,336,93,35,subject,0 if speaker=='Y' else 4 if speaker=='SOWHAT' else None)
        # One fragment visibly changes from a wet filament to a faceted solid.
        draw=ImageDraw.Draw(frame)
        if beat in ('copy','reply','challenge'):
            draw.line(pixels((357,126,358,132,356,138)),fill='#251e1b',width=round(2*scale))
            draw.ellipse(pixels((354,136,359,142)),fill='#332925')
        elif beat in ('hardens','falls'):
            y=133 if beat=='hardens' else 149
            draw.polygon([pixels(p) for p in [(356,y-4),(360,y-1),(358,y+5),(353,y+3),(352,y)]],fill='#34291d',outline='#e7b460',width=round(scale))
            draw.line(pixels((353,y,358,y-2)),fill='#f9d791',width=round(scale))
    lit=spotlight(frame,subject if speaker else None)
    if beat in ('hardens','falls','lands'):
        crop=pixels((176,32,516,223))
        frame=frame.crop(crop).resize(original.size,Image.Resampling.LANCZOS)
        lit=lit.crop(crop).resize(original.size,Image.Resampling.LANCZOS)
    lit.save(art/('L5-'+beat+'.webp'),quality=89)
    # The copy, reply and challenge use the same composition with different lighting.
    if beat in ('parent','budding','copy','hardens','falls','lands'):
        frame.save(art/('L5-'+beat+'-color.webp'),quality=89)
