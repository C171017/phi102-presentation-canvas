"""Render the canvas hinge. Run with blender -b -P scripts/render-hinge-door.py."""
import math
from pathlib import Path
import subprocess
import tempfile

import bpy
from mathutils import Vector

ROOT = Path(__file__).resolve().parents[1]
ATLAS = ROOT / "src/assets/hinge-door/hinge-poses.webp"
POSES = 30
bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene


def material(name, rgb, metallic=0):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    shader = mat.node_tree.nodes.get("Principled BSDF")
    rgb = tuple(((v / 255 + .055) / 1.055) ** 2.4 for v in rgb)
    shader.inputs["Base Color"].default_value = (*rgb, 1)
    shader.inputs["Roughness"].default_value = .79
    shader.inputs["Metallic"].default_value = metallic
    return mat


oak = material("Cut oak", (181, 137, 89))
sand = material("Sandstone top", (221, 183, 124))
teal = material("Painted pine", (62, 110, 101))
deep_teal = material("Recess", (46, 79, 72))
ivory = material("Ivory paint", (249, 232, 194))
edge = material("Ochre edge", (184, 137, 83))
brass = material("Satin brass", (223, 180, 102), .17)
brass_edge = material("Cast brass collar", (172, 125, 64), .15)
ink = material("Warm black lettering", (61, 50, 36))
regular = bpy.data.fonts.load("/System/Library/Fonts/Supplemental/Georgia.ttf")
bold = bpy.data.fonts.load("/System/Library/Fonts/Supplemental/Georgia Bold.ttf")


def slab(name, loc, dims, mat, bevel, parent=None):
    bpy.ops.mesh.primitive_cube_add(size=1)
    obj = bpy.context.object
    obj.name = name
    for v in obj.data.vertices:
        for axis in range(3):
            v.co[axis] *= dims[axis]
    obj.data.materials.append(mat)
    chamfer = obj.modifiers.new("Planed corners", "BEVEL")
    chamfer.width = bevel
    chamfer.segments = 1
    chamfer.affect = "EDGES"
    obj.modifiers.new("Plane normals", "WEIGHTED_NORMAL")
    obj.parent = parent
    obj.location = loc
    return obj


def cylinder(name, loc, radius, length, rotation, mat, sides, parent=None):
    bpy.ops.mesh.primitive_cylinder_add(vertices=sides, radius=radius, depth=length)
    obj = bpy.context.object
    obj.name = name
    obj.data.materials.append(mat)
    obj.parent = parent
    obj.location = loc
    obj.rotation_euler = rotation
    return obj


def inscription(name, text, pos, font, size, max_width, parent=None, tilt=90):
    curve = bpy.data.curves.new(name, "FONT")
    curve.body, curve.font, curve.size = text, font, size
    curve.align_x, curve.align_y = "CENTER", "CENTER"
    curve.space_line = .85
    obj = bpy.data.objects.new(name, curve)
    scene.collection.objects.link(obj)
    bpy.context.view_layer.update()
    scale = min(1, max_width / obj.dimensions.x)
    obj.scale = (scale,) * 3
    obj.parent = parent
    obj.location = pos
    obj.rotation_euler.x = math.radians(tilt)
    curve.materials.append(ink)


# The reading table has clipped plan corners and a narrow bevel between its
# tan surface and darker edge. Give the plinth the same three distinct planes.
outline = [(-2.41,-1.53), (2.41,-1.53), (2.65,-1.29), (2.65,1.08),
           (2.41,1.33), (-2.41,1.33), (-2.65,1.08), (-2.65,-1.29)]
rings = [(.995,.05), (1,.24), (1,.32), (.987,.375)]
vertices = [(x*s,y*s,z) for s,z in rings for x,y in outline]
count = len(outline)
surfaces = [tuple(reversed(range(count)))]
for layer in range(len(rings)-1):
    for i in range(count):
        j = (i+1) % count
        base = layer * count
        surfaces.append((base+i,base+j,base+j+count,base+i+count))
surfaces.append(tuple(range(count*3,count*4)))
deck = bpy.data.meshes.new("Clipped tabletop")
deck.from_pydata(vertices, [], surfaces)
deck.update()
scene.collection.objects.link(bpy.data.objects.new("Display plinth",deck))
deck.materials.append(oak)
deck.materials.append(sand)
for face in list(deck.polygons)[count+1:]:
    face.material_index = 1
slab("Rear bed", (0, .22, 1.60), (3.63, .20, 2.53), deep_teal, .07)
for x in (-1.88, 1.88):
    slab("Foot", (x, .17, .48), (.53, .92, .18), oak, .055)
    slab("Upright", (x, .18, 1.87), (.29, .36, 2.77), teal, .05)
slab("Fixed upper leaf", (0, .12, 3.08), (4.04, .36, .65), teal, .065)

# The six paint pans are inset from all four edges of the closed door.
# They and the two faces of the door are rendered together for correct occlusion.
slab("Palette tray", (0, .050, 1.74), (3.04, .12, 1.48), ivory, .05)
paints = [
    ("Vermilion", (202, 75, 57)), ("Marigold", (239, 177, 48)), ("Leaf", (95, 154, 95)),
    ("Turquoise", (48, 155, 162)), ("Ultramarine", (74, 109, 181)), ("Violet", (155, 99, 159)),
]
for i, (name, rgb) in enumerate(paints):
    x, z = (i % 3 - 1) * .96, 2.085 - (i // 3) * .69
    slab(name + " pan", (x, -.030, z), (.90, .055, .60), deep_teal, .05)
    slab(name + " pigment", (x, -.066, z), (.83, .035, .53), material(name, rgb), .042)

pin_z, pin_y = 2.79, -.18
pivot = bpy.data.objects.new("Horizontal hinge axis", None)
scene.collection.objects.link(pivot)
pivot.location = (0, pin_y, pin_z)
slab("Moving leaf edge", (0, .0, -1.02), (3.49, .20, 2.06), edge, .075, pivot)
slab("Painted question face", (0, -.102, -1.02), (3.44, .067, 2.0), ivory, .032, pivot)
inscription("Question", "What colour\ndo you see?", (0, -.139, -1.03), regular, .51, 2.83, pivot)
slab("Reverse face", (0, .103, -1.02), (3.44, .055, 2.0), ivory, .026, pivot)
inscription("Question when open", "What colour\ndo you see?", (0, .134, -1.03),
            regular, .51, 2.83, pivot, tilt=-90)
cylinder("Pull", (0, -.165, -1.78), .082, .095, (math.pi/2, 0, 0), brass, 10, pivot)

# Both halves are physically attached to one horizontal spindle. The inscription
# lies on its forward, upward-facing flat rather than on a separate nameplate.
for x in (-1.52, 1.52):
    slab("Upper hinge strap", (x, -.09, 3.03), (.19, .08, .45), brass_edge, .024)
    cylinder("Upper fastener", (x, -.142, 3.16), .052, .037, (math.pi/2, 0, 0), brass, 6)
    slab("Lower hinge strap", (x, -.158, -.22), (.19, .07, .43), brass_edge, .02, pivot)
    cylinder("Lower fastener", (x, -.20, -.342), .046, .029, (math.pi/2, 0, 0), brass, 6, pivot)

# Broad front flat lets the lettering sit flush without floating above the barrel.
cross_section = [(-.27,-.075),(-.245,.115),(-.14,.197),(.14,.197),(.237,.09),
                 (.237,-.10),(.135,-.19),(-.15,-.19)]
verts = [(x, pin_y+y, pin_z+z) for x in (-1.85,1.85) for y,z in cross_section]
n=len(cross_section)
faces=[tuple(range(n)),tuple(reversed(range(n,2*n)))]
faces += [(i,n+i,n+(i+1)%n,(i+1)%n) for i in range(n)]
mesh=bpy.data.meshes.new("Cast spindle facets")
mesh.from_pydata(verts,[],faces)
mesh.update()
obj=bpy.data.objects.new("Fixed engraved spindle",mesh)
scene.collection.objects.link(obj)
mesh.materials.append(brass)
inscription("Hinge belief", "Understand English", (0,pin_y-.265,pin_z+.02),
            bold,.26,3.12,tilt=82.5)
for x in (-1.76,1.76):
    cylinder("Faceted collar", (x,pin_y,pin_z), .296,.16,(0,math.pi/2,0),brass_edge,12)
    cylinder("Pin end", (math.copysign(1.875,x),pin_y,pin_z), .196,.07,(0,math.pi/2,0),brass,10)


def aim(obj, at):
    obj.rotation_euler=(Vector(at)-obj.location).to_track_quat("-Z","Y").to_euler()


def softbox(name, pos, power, size):
    light=bpy.data.lights.new(name,"AREA")
    light.energy, light.shape, light.size=power,"DISK",size
    obj=bpy.data.objects.new(name,light)
    scene.collection.objects.link(obj)
    obj.location=pos
    aim(obj,(0,0,1.4))


softbox("Upper left key",(-4,-5,9),780,3.0)
softbox("Warm fill",(5,-3,5),220,5.0)
softbox("Top rim",(1,4,7),420,4.0)
scene.world=bpy.data.worlds.new("Studio ambient")
scene.world.use_nodes=True
scene.world.node_tree.nodes["Background"].inputs[1].default_value=.38
bpy.ops.object.camera_add(location=(3.1,-11.5,7.02))
cam=bpy.context.object
aim(cam,(0,-.05,2.31))
cam.data.type="ORTHO"
cam.data.ortho_scale=6.26
scene.camera=cam
scene.render.engine="CYCLES"
scene.cycles.samples=12
scene.cycles.use_denoising=True
scene.cycles.seed=9
scene.render.resolution_x,scene.render.resolution_y=640,600
scene.render.resolution_percentage=100
scene.render.film_transparent=True
scene.render.image_settings.color_mode="RGBA"
scene.render.image_settings.file_format="PNG"
scene.view_settings.view_transform="Standard"
scene.view_settings.exposure=-.14
ATLAS.parent.mkdir(parents=True,exist_ok=True)
with tempfile.TemporaryDirectory() as temp:
    for i in range(POSES):
        pivot.rotation_euler.x=math.radians(-170*i/(POSES-1))
        scene.render.filepath=str(Path(temp)/f"pose-{i:02d}.png")
        bpy.ops.render.render(write_still=True)
    subprocess.run(["ffmpeg","-loglevel","error","-y","-i",str(Path(temp)/"pose-%02d.png"),
                    "-vf","tile=6x5","-frames:v","1","-c:v","libwebp",
                    "-quality","93",str(ATLAS)],check=True)
