// Illustrative Even Realities G2 A (Crown Panto), built in code from the official product photos.
// Ported from the Footnote demo video. Units are millimetres. The front faces +z; temples run
// toward -z. Not an official CAD model.
import {
  CylinderGeometry,
  ExtrudeGeometry,
  Group,
  Mesh,
  MeshPhysicalMaterial,
  Path,
  Shape,
  ShapeGeometry,
  SphereGeometry,
  Vector2,
  Vector3,
  type BufferGeometry,
} from "three"

const LENS_W = 46
const LENS_H = 39.5
const GAP = 19
const RIM = 3.1
const DEPTH = 5.0
const CX = (LENS_W + GAP) / 2 // lens centre offset from the bridge
const WRAP = 0.0022 // front curvature: z -= WRAP * x^2

// Crown panto lens: round lower half, flatter top with a straight brow.
function lensOutline(side: number, inflate = 0, steps = 120): Vector2[] {
  const pts: Vector2[] = []
  const a = LENS_W / 2
  const b = LENS_H / 2
  for (let i = 0; i < steps; i++) {
    const th = (i / steps) * Math.PI * 2
    const c = Math.cos(th)
    const s = Math.sin(th)
    // the exponent blends smoothly from a round bottom (2.0) to a flatter brow (2.9)
    const k = s > 0 ? s * s * (3 - 2 * s) : 0
    const n = 2.05 + 1.5 * k
    const r = 1 / Math.pow(Math.pow(Math.abs(c), n) + Math.pow(Math.abs(s), n), 1 / n)
    const x = a * r * c
    let y = b * r * s * (1 - 0.06 * k)
    // the brow rises slightly toward the hinge
    y += (1.1 * k * (x * side)) / a
    pts.push(new Vector2(x, y))
  }
  if (!inflate) return pts
  return pts.map((p, i) => {
    const p0 = pts[(i - 1 + pts.length) % pts.length]
    const p1 = pts[(i + 1) % pts.length]
    const tx = p1.x - p0.x
    const ty = p1.y - p0.y
    const len = Math.hypot(tx, ty) || 1
    return new Vector2(p.x + (ty / len) * inflate, p.y - (tx / len) * inflate)
  })
}

// Curve the front around the face and rotate the existing normals to match, so the
// extruded caps keep smooth shading instead of showing their triangulation.
function bend<T extends BufferGeometry>(geometry: T, offsetX = 0): T {
  const p = geometry.attributes.position
  const nrm = geometry.attributes.normal
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i) + offsetX
    p.setZ(i, p.getZ(i) - WRAP * x * x)
    if (nrm) {
      const phi = Math.atan(2 * WRAP * x)
      const nx = nrm.getX(i)
      const nz = nrm.getZ(i)
      nrm.setXYZ(i, nx * Math.cos(phi) + nz * Math.sin(phi), nrm.getY(i), -nx * Math.sin(phi) + nz * Math.cos(phi))
    }
  }
  p.needsUpdate = true
  if (nrm) nrm.needsUpdate = true
  else geometry.computeVertexNormals()
  return geometry
}

function roundedRectShape(w: number, h: number, r: number): Shape {
  const s = new Shape()
  s.moveTo(-w / 2 + r, -h / 2)
  s.lineTo(w / 2 - r, -h / 2)
  s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r)
  s.lineTo(w / 2, h / 2 - r)
  s.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2)
  s.lineTo(-w / 2 + r, h / 2)
  s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r)
  s.lineTo(-w / 2, -h / 2 + r)
  s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2)
  return s
}

export function g2Materials() {
  return {
    frame: new MeshPhysicalMaterial({ color: 0x1c1e20, roughness: 0.5, metalness: 0.3, clearcoat: 0.25, clearcoatRoughness: 0.6 }),
    temple: new MeshPhysicalMaterial({ color: 0x2c2f32, roughness: 0.38, metalness: 0.75 }),
    pod: new MeshPhysicalMaterial({ color: 0x1e2022, roughness: 0.6, metalness: 0.15 }),
    inset: new MeshPhysicalMaterial({ color: 0x4a4e51, roughness: 0.3, metalness: 0.7 }),
    lens: new MeshPhysicalMaterial({ color: 0xe9f1ec, roughness: 0.04, metalness: 0, transparent: true, opacity: 0.09, clearcoat: 1, clearcoatRoughness: 0.05, envMapIntensity: 1.6, depthWrite: false }),
    pad: new MeshPhysicalMaterial({ color: 0xdfe6e2, roughness: 0.15, transparent: true, opacity: 0.55 }),
    wire: new MeshPhysicalMaterial({ color: 0x8c9194, roughness: 0.25, metalness: 0.9 }),
  }
}

export type G2Materials = ReturnType<typeof g2Materials>

/** The glasses, plus the two temple arms separately so the wearer's view can fade them. */
export function buildG2(mat: G2Materials = g2Materials()) {
  const g = new Group()
  const temples: Group[] = []
  const bevel = { depth: DEPTH - 1.2, bevelEnabled: true, bevelThickness: 0.6, bevelSize: 0.5, bevelSegments: 4, curveSegments: 64, steps: 1 }

  for (const side of [-1, 1]) {
    const cx = side * CX
    // Rim: the outer contour with the lens as a hole.
    const shape = new Shape(lensOutline(side, RIM))
    shape.holes.push(new Path(lensOutline(side).slice().reverse()))
    const rimGeo = new ExtrudeGeometry(shape, bevel)
    rimGeo.translate(0, 0, -DEPTH / 2 + 0.6)
    bend(rimGeo, cx)
    const rim = new Mesh(rimGeo, mat.frame)
    rim.position.x = cx
    g.add(rim)

    // Lens: thin, slightly curved, inset in the rim.
    const lensGeo = new ShapeGeometry(new Shape(lensOutline(side, 0.6)), 48)
    const lp = lensGeo.attributes.position
    for (let i = 0; i < lp.count; i++) {
      const x = lp.getX(i)
      const y = lp.getY(i)
      lp.setZ(i, 0.3 - 0.0035 * (x * x + y * y) * 0.25)
    }
    bend(lensGeo, cx)
    const lens = new Mesh(lensGeo, mat.lens)
    lens.position.x = cx
    lens.renderOrder = 2
    g.add(lens)

    // Hinge block at the outer top corner, with a lighter inset on the front face.
    const endX = side * (CX + LENS_W / 2 + RIM - 1.2)
    const endY = LENS_H / 2 - 7.5
    const blockGeo = new ExtrudeGeometry(roundedRectShape(7.2, 9.5, 2.2), { depth: 9, bevelEnabled: true, bevelThickness: 0.8, bevelSize: 0.8, bevelSegments: 3, curveSegments: 12 })
    blockGeo.translate(0, 0, -9)
    const block = new Mesh(blockGeo, mat.frame)
    block.position.set(endX, endY, 2.2 - WRAP * endX * endX)
    g.add(block)
    const inset = new Mesh(new ExtrudeGeometry(roundedRectShape(2.6, 3.8, 0.7), { depth: 0.4, bevelEnabled: false }), mat.inset)
    inset.position.set(endX + side * 0.2, endY + 0.6, 2.85 - WRAP * endX * endX)
    g.add(inset)

    // Temple: an ordinary flat temple seen in side profile (z, y), extruded across its
    // thickness, bending down behind the ear. Only the tip is a little thicker, where G2
    // houses the touch controls.
    const z0 = -6.5 - WRAP * endX * endX
    const prof = new Shape()
    const len = 104
    const drop = 11
    const h0 = 5.6
    const h1 = 4.4
    prof.moveTo(0, h0 / 2)
    prof.lineTo(-len, h1 / 2 - 0.8)
    prof.quadraticCurveTo(-len - 14, h1 / 2 - 1.2, -len - 22, -drop + h1 / 2)
    prof.lineTo(-len - 22 + 1.2, -drop - h1 / 2)
    prof.quadraticCurveTo(-len - 12, -h1 / 2 - 1.6, -len, -h1 / 2 - 0.8)
    prof.lineTo(0, -h0 / 2)
    prof.closePath()
    const templeGeo = new ExtrudeGeometry(prof, { depth: 1.8, bevelEnabled: true, bevelThickness: 0.35, bevelSize: 0.35, bevelSegments: 2, curveSegments: 24 })
    templeGeo.translate(0, 0, -0.9)
    const profile = new Group() // works in profile coordinates
    profile.rotation.y = -Math.PI / 2 // profile x -> world -z, extrusion depth -> world x
    profile.add(new Mesh(templeGeo, mat.temple))
    // Thicker tip along the ear bend: the temple's bent end, about twice as thick.
    const TIP_T = 3.4
    const tipGeo = new ExtrudeGeometry(roundedRectShape(30, 7.4, 3.5), { depth: TIP_T, bevelEnabled: true, bevelThickness: 0.6, bevelSize: 0.6, bevelSegments: 4, curveSegments: 20 })
    tipGeo.translate(0, 0, -TIP_T / 2)
    const tip = new Mesh(tipGeo, mat.pod)
    tip.position.set(-len - 12.5, -5.6, 0)
    tip.rotation.z = Math.atan2(drop, 22) * 0.92
    profile.add(tip)
    // Touch area on the outer face of the tip.
    const panelGeo = new ExtrudeGeometry(roundedRectShape(15, 3.6, 1.8), { depth: 0.3, bevelEnabled: false })
    panelGeo.translate(0, 0, -0.15)
    const panel = new Mesh(panelGeo, mat.inset)
    panel.position.set(-len - 13.5, -6.1, -side * (TIP_T / 2 + 0.6))
    panel.rotation.z = tip.rotation.z
    profile.add(panel)
    const templeArm = new Group()
    templeArm.add(profile)
    templeArm.position.set(endX + side * 0.4, endY, z0)
    templeArm.rotation.y = side * 0.05 // slight outward splay
    g.add(templeArm)
    temples.push(templeArm)

    // Nose pad on a short wire arm behind the rim, near the bridge.
    const pad = new Mesh(new SphereGeometry(1, 24, 16), mat.pad)
    const padX = side * (GAP / 2 + 3.2)
    pad.scale.set(2.4, 4.6, 1.1)
    pad.position.set(padX, -4, -7 - WRAP * padX * padX)
    pad.rotation.set(0, side * -0.6, side * 0.25)
    g.add(pad)
    const wire = new Mesh(new CylinderGeometry(0.45, 0.45, 7.5, 10), mat.wire)
    wire.position.set(side * (GAP / 2 + 1.2), -1.2, -4 - WRAP * padX * padX)
    wire.rotation.set(1.0, 0, side * 0.5)
    g.add(wire)
  }

  // Bridge: a solid bar across the upper third, following the shallow arch of the brow.
  const bridgeLen = GAP + 2 * RIM + 2
  const bridgeGeo = new ExtrudeGeometry(roundedRectShape(bridgeLen, 5.2, 2.2), { depth: DEPTH - 1.6, bevelEnabled: true, bevelThickness: 0.7, bevelSize: 0.6, bevelSegments: 4, curveSegments: 16 })
  bridgeGeo.translate(0, LENS_H / 2 - 9.5, -DEPTH / 2 + 0.8)
  const bp = bridgeGeo.attributes.position
  for (let i = 0; i < bp.count; i++) {
    const x = bp.getX(i)
    bp.setY(i, bp.getY(i) + 1.2 * (1 - Math.min(1, Math.abs(x) / (bridgeLen / 2)) ** 2))
  }
  bend(bridgeGeo, 0)
  g.add(new Mesh(bridgeGeo, mat.frame))

  return { group: g, temples }
}

/** Centre of the +x lens's inner surface, where the display sits. */
export const LENS_CENTRE = new Vector3(CX, 0, 0.4 - WRAP * CX * CX)
export const G2_DIMENSIONS = { LENS_W, LENS_H, CX, WRAP }
