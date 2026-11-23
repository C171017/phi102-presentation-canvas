"""Build dialogue-only focus plates from the approved 16:9 artwork."""
import json
from speaker_lighting import spotlight
from pathlib import Path
from PIL import Image, ImageChops, ImageDraw, ImageFilter

root = Path(__file__).resolve().parents[1]
assets = root / 'archive/ink-ocean/backgrounds'
# Outline coordinates use a 300 x 169 design grid. Group listeners under *.
plates = {
 'L1-01-guardian': {
  '*': [(0,20),(53,25),(62,56),(52,101),(17,117),(0,110)],
  'Villager': [(57,84),(64,42),(78,22),(71,12),(86,1),(109,5),(111,20),(123,24),(142,20),(148,36),(139,47),(118,49),(119,83)],
  'Woman': [(144,83),(154,55),(164,45),(162,31),(180,20),(190,23),(184,48),(190,74),(181,85)],
  'Baby': [(208,41),(221,42),(222,53),(215,62),(205,60),(202,50)],
  'Guardian': [(213,18),(219,4),(237,1),(255,5),(262,19),(256,33),(243,46),(242,54),(230,54),(230,41),(245,23),(240,15),(227,17),(225,28),(213,26)],
  'parent':[(191,83),(191,51),(197,33),(207,28),(214,35),(210,41),(201,51),(207,62),(218,62),(216,83)]},
 'L1-02-first-questions':{'*':[(69,26),(121,6),(223,1),(282,20),(281,74),(68,75)]},
 'L3-01-whypocalypse':{'*':[(89,58),(103,20),(122,0),(136,0),(148,18),(153,53),(163,37),(172,16),(188,12),(193,25),(177,67),(166,72),(160,65),(151,75),(138,66),(119,66),(106,60)],'others':[(202,83),(216,54),(226,45),(236,52),(228,79),(212,89)]},
 'L4-00-answerers':{'*':[(0,55),(38,51),(53,32),(82,29),(102,57),(111,38),(133,13),(159,12),(184,32),(186,55),(200,47),(210,31),(234,30),(249,55),(299,45),(299,121),(0,126)]},
 'L4-01-pyrrho':{'Pyrrho':[(98,101),(107,82),(117,71),(141,52),(145,44),(140,32),(144,20),(155,15),(172,26),(166,38),(159,43),(168,53),(179,55),(176,70),(169,87),(173,104),(157,106),(149,94),(121,110)] , '*':[(0,104),(8,82),(21,65),(18,51),(24,36),(41,42),(48,61),(56,62),(64,51),(78,47),(94,54),(96,68),(120,57),(127,63),(109,75),(122,76),(114,87),(94,99),(78,104),(48,98),(23,109)]},
 'L4-02-peirce':{'Peirce':[(29,37),(24,28),(28,14),(41,30),(53,18),(50,9),(65,4),(80,13),(91,40),(99,69),(89,106),(52,105),(44,80),(47,56)],'*':[(0,53),(19,43),(39,46),(49,74),(42,113),(0,119)],'scholars':[(133,47),(143,26),(159,20),(156,46),(169,33),(180,44),(177,65),(140,74)]},
 'L4-03-neurath':{'Neurath':[(141,84),(158,68),(171,53),(181,32),(194,22),(210,24),(221,32),(244,37),(258,57),(248,77),(216,90),(197,100),(194,92),(208,73),(191,62),(172,81),(154,87)]},
 'L5-01-descartes':{'Descartes':[(25,104),(47,61),(86,41),(88,26),(109,0),(194,0),(204,21),(186,56),(167,73),(181,113),(189,125),(52,125)]},
 'L5b-01-one-grain-one-ocean':{'*':[(199,74),(206,47),(218,40),(221,25),(232,28),(233,47),(248,35),(256,53),(269,27),(279,30),(285,65),(263,76),(223,72)]},
 'L6-00-choice':{'Sect disciple':[(66,7),(130,7),(128,99),(65,105)],'Fleet lookout':[(172,6),(235,5),(234,97),(171,107)]},
 'L6-A1-tower':{'New disciple|Disciple':[(108,1),(140,0),(133,19),(120,25),(106,19)],'Sect examiner':[(108,22),(137,20),(128,47),(114,42)],'*':[(106,46),(133,44),(130,96),(118,115),(108,98)]},
 'L6-B1-fleet':{'Fleet examiner':[(183,124),(182,89),(201,65),(211,50),(227,48),(240,62),(234,80),(251,104),(242,128)],'New lookout|Lookout':[(243,102),(249,71),(263,56),(275,62),(277,77),(297,98),(288,106)],'*':[(22,110),(36,90),(46,99),(43,113)]},
 'L6-A2-challenge':{'Disciple, from a rowboat':[(0,157),(0,117),(20,83),(39,68),(54,63),(65,73),(72,69),(86,95),(83,122),(65,146)],'Fleet lookout, across the water':[(130,48),(137,38),(142,19),(151,18),(158,30),(159,46)],'*':[(95,51),(96,37),(111,33),(118,46),(120,52)]},
 'L6-B2-challenge':{'Fleet lookout':[(0,133),(0,77),(51,51),(60,29),(60,15),(82,9),(99,24),(102,43),(91,50),(115,70),(139,80),(149,73),(155,80),(140,93),(112,94),(91,125),(60,141)],'Heckler, from a rowboat':[(181,76),(184,62),(197,50),(200,39),(210,39),(215,49),(223,67),(214,76)]},
}
# In these shots the questioning bubble speaks from just beside the master.
bubble_at={'L4-01-pyrrho':(204,39),'L4-02-peirce':(110,12),'L4-03-neurath':(121,15),'L5-01-descartes':(216,24)}
atlas=Image.open(root/'src/assets/regress/sowatt-poses.webp').convert('RGBA')
bubble=atlas.crop((2,2,145,157))
mapping={}
for plate,groups in plates.items():
    original=Image.open(assets/(plate+'.webp')).convert('RGB')
    sx,sy=original.width/300,original.height/169
    masks={}
    for name,points in groups.items():
        mask=Image.new('L',original.size)
        ImageDraw.Draw(mask).polygon([(round(x*sx),round(y*sy)) for x,y in points],fill=255)
        masks[name]=mask.filter(ImageFilter.GaussianBlur(4*sx))
    mapping[plate]={}
    for i,active in enumerate(['Narrator']+[n for n in groups if n not in ('*','parent','others','scholars')]+(['Y'] if plate in bubble_at else [])):
        frame=original
        subject=masks.get(active)
        if active=='Y':
            x,y=bubble_at[plate];cut=bubble.resize((round(29*sx),round(32*sy)),Image.Resampling.LANCZOS)
            position=(round(x*sx),round(y*sy))
            frame=original.copy()
            frame.paste(cut,position,cut)
            subject=Image.new('L',frame.size)
            subject.paste(cut.getchannel('A'),position)
        frame=spotlight(frame,subject)
        file=f'{plate}-focus-{i}.webp'
        frame.save(assets/file,quality=86,method=4)
        for alias in active.split('|'): mapping[plate][alias]=file
(root/'archive/ink-ocean/ink-ocean-focus.json').write_text(json.dumps(mapping,indent=2)+'\n')

# L2 uses individual cue plates for its four consecutive Y voices.
hand = Image.open(assets/'L2-01-the-hand.webp').convert('RGB')
w,h = hand.size
outlines = {
    'woman': [(0,0),(211,0),(264,88),(248,149),(186,222),(162,211),(181,249),(234,211),(324,175),(398,183),(478,221),(489,279),(481,365),(442,365),(440,278),(412,244),(390,305),(344,319),(323,251),(276,258),(266,323),(160,354),(112,398),(0,398)],
    'y1':[(317,0),(424,0),(424,104),(317,104)],
    'y2':[(429,0),(531,0),(531,105),(429,105)],
    'y3':[(531,7),(623,7),(623,111),(531,111)],
    'y4':[(625,38),(714,38),(714,125),(625,125)],
    'sowhat':[(710,81),(771,81),(771,147),(710,147)],
}
for voice,pts in outlines.items():
    mask=Image.new('L',hand.size)
    if voice=='woman':
        ImageDraw.Draw(mask).polygon([(round(x*w/836),round(y*h/470)) for x,y in pts],fill=255)
    else:
        x,y=pts[0];right,bottom=pts[2]
        ImageDraw.Draw(mask).ellipse((x*w/836,y*h/470,right*w/836,bottom*h/470),fill=255)
    spotlight(hand,mask).save(assets/f'L2-speaking-{voice}.webp',quality=89)

spotlight(hand).save(assets/'L2-narration.webp',quality=89)
