import {
  ACESFilmicToneMapping,
  Color,
  DirectionalLight,
  Mesh,
  PerspectiveCamera,
  PMREMGenerator,
  PointLight,
  Scene,
  SRGBColorSpace,
  Vector3,
  WebGLRenderer,
  type Material,
} from "three"
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js"
import { buildG2, LENS_CENTRE } from "./g2Model"

/*
 * The glasses scene behind the Footnote figure. Loaded with import() only when
 * the figure nears the viewport, so three.js stays out of the route's first JS.
 *
 * It renders on demand: a frame is drawn while the camera is moving and once
 * after a resize or theme change, then it sleeps. The G2 display itself is
 * HTML laid over the canvas, pinned to the lens with a CSS matrix3d so its
 * text stays crisp at any size.
 */

type Pose = { az: number; el: number; dist: number; target: Vector3 }

// The display rectangle inside the +x lens, in millimetres. Ordered as the
// wearer sees it: from behind, +x lands on the left of the screen.
const HX = 19
const HY = 9.5
const DY = 1
const LZ = LENS_CENTRE.z - 0.8
const CORNERS = [
  [LENS_CENTRE.x + HX, DY + HY],
  [LENS_CENTRE.x - HX, DY + HY],
  [LENS_CENTRE.x + HX, DY - HY],
  [LENS_CENTRE.x - HX, DY - HY],
].map(([x, y]) => new Vector3(x, y, LZ))
const LENS = new Vector3(LENS_CENTRE.x, DY, LZ)
const UNDER = new Vector3(LENS_CENTRE.x - 2, DY - HY - 5, LZ)
const ORIGIN = new Vector3(0, 0, -45)

// The display is laid out on the G2's real 576 x 288 grid.
export const DISPLAY_W = 576
export const DISPLAY_H = 288

const FOV = 22
const TAN = 2 * Math.tan((FOV / 2) * (Math.PI / 180))

/**
 * Outside, three quarters from the front, framed like the 16:9 server-rendered poster.
 * A narrower stage pulls the camera back by the same factor the poster shrinks to fit,
 * so the poster and the first frame still line up.
 */
const outside = (w: number, h: number): Pose => ({ az: 0.6, el: 0.18, dist: 245 * Math.max(1, 16 / 9 / (w / h)), target: ORIGIN.clone() })

/** Behind the lens. Close enough that the display spans most of a narrow stage. */
function inside(w: number, h: number): Pose {
  const aspect = w / h
  // On a phone the display gets nearly the whole width, so its text stays readable.
  const fraction = Math.min(420, (w < 500 ? 0.96 : 0.86) * w) / w
  return { az: Math.PI, el: 0.02, dist: (2 * HX) / (fraction * TAN * aspect), target: LENS.clone() }
}

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))

// CSS homography: the matrix3d that maps a w x h box onto four screen points.
type M3 = number[]
const adj = (m: M3): M3 => [
  m[4] * m[8] - m[5] * m[7], m[2] * m[7] - m[1] * m[8], m[1] * m[5] - m[2] * m[4],
  m[5] * m[6] - m[3] * m[8], m[0] * m[8] - m[2] * m[6], m[2] * m[3] - m[0] * m[5],
  m[3] * m[7] - m[4] * m[6], m[1] * m[6] - m[0] * m[7], m[0] * m[4] - m[1] * m[3],
]
function mul(a: M3, b: M3): M3 {
  const c = new Array<number>(9)
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++) {
      let s = 0
      for (let k = 0; k < 3; k++) s += a[3 * i + k] * b[3 * k + j]
      c[3 * i + j] = s
    }
  return c
}
function basis(p: number[]): M3 {
  const m = [p[0], p[2], p[4], p[1], p[3], p[5], 1, 1, 1]
  const a = adj(m)
  const v = [a[0] * p[6] + a[1] * p[7] + a[2], a[3] * p[6] + a[4] * p[7] + a[5], a[6] * p[6] + a[7] * p[7] + a[8]]
  return mul(m, [v[0], 0, 0, 0, v[1], 0, 0, 0, v[2]])
}
function matrix3d(q: { x: number; y: number }[]): string {
  const t = mul(basis(q.flatMap((p) => [p.x, p.y])), adj(basis([0, 0, DISPLAY_W, 0, 0, DISPLAY_H, DISPLAY_W, DISPLAY_H])))
  for (let i = 0; i < 9; i++) t[i] /= t[8]
  return `matrix3d(${t[0]},${t[3]},0,${t[6]},${t[1]},${t[4]},0,${t[7]},0,0,1,0,${t[2]},${t[5]},0,${t[8]})`
}

export function createGlassesScene(canvas: HTMLCanvasElement, accent: string) {
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.toneMapping = ACESFilmicToneMapping
  renderer.outputColorSpace = SRGBColorSpace

  const scene = new Scene()
  const pmrem = new PMREMGenerator(renderer)
  const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
  scene.environment = env

  const key = new DirectionalLight(0xffffff, 2.4)
  key.position.set(120, 160, 220)
  const rim = new DirectionalLight(new Color(accent), 1.4)
  rim.position.set(-200, 60, -200)
  const back = new DirectionalLight(0xffffff, 1.6)
  back.position.set(220, 40, -160)
  scene.add(key, rim, back)

  const camera = new PerspectiveCamera(FOV, 16 / 9, 1, 6000)
  camera.add(new PointLight(0xffffff, 0.45, 0, 0))
  scene.add(camera)

  const { group: glasses, temples } = buildG2()
  scene.add(glasses)
  // Temples sit beside your head when you wear them, so they fade out in the wearer's view.
  const templeMaterials: Material[] = []
  for (const arm of temples)
    arm.traverse((o) => {
      if (o instanceof Mesh) {
        o.material = (o.material as Material).clone()
        o.material.transparent = true
        templeMaterials.push(o.material)
      }
    })

  let w = 1
  let h = 1
  let pose = outside(16, 9)
  let tween: { from: Pose; to: Pose; t0: number; ms: number } | null = null
  let isInside = false

  function place() {
    const { az, el, dist, target } = pose
    camera.position.set(
      target.x + dist * Math.sin(az) * Math.cos(el),
      target.y + dist * Math.sin(el),
      target.z + dist * Math.cos(az) * Math.cos(el),
    )
    camera.lookAt(target)
    camera.updateMatrixWorld()
    const fade = 1 - clamp((az - 2.35) / 0.6)
    for (const m of templeMaterials) m.opacity = fade
    for (const arm of temples) arm.visible = fade > 0.01
  }

  function project(v: Vector3) {
    const p = v.clone().project(camera)
    return { x: ((p.x + 1) / 2) * w, y: ((1 - p.y) / 2) * h }
  }

  return {
    resize(width: number, height: number) {
      w = Math.max(1, width)
      h = Math.max(1, height)
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      if (!tween) pose = isInside ? inside(w, h) : outside(w, h)
    },
    setAccent(color: string) {
      rim.color.set(color)
    },
    /** Move the camera outside or behind the lens; ms = 0 jumps. */
    goTo(where: "outside" | "inside", ms: number) {
      isInside = where === "inside"
      const to = isInside ? inside(w, h) : outside(w, h)
      if (ms <= 0) {
        pose = to
        tween = null
      } else {
        tween = { from: { ...pose, target: pose.target.clone() }, to, t0: performance.now(), ms }
      }
    },
    /** Advances the camera. Returns true while it is still moving. */
    tick(now: number) {
      if (!tween) return false
      const k = ease(clamp((now - tween.t0) / tween.ms))
      const { from, to } = tween
      pose = {
        az: from.az + (to.az - from.az) * k,
        el: from.el + (to.el - from.el) * k,
        dist: from.dist + (to.dist - from.dist) * k,
        target: from.target.clone().lerp(to.target, k),
      }
      if (k >= 1) tween = null
      return true
    },
    render() {
      place()
      renderer.render(scene, camera)
    },
    /** How far round the camera is, 0 outside to 1 fully behind the lens. */
    behind() {
      return clamp((pose.az - 2.7) / 0.35)
    },
    displayTransform() {
      return matrix3d(CORNERS.map((v) => project(glasses.localToWorld(v.clone()))))
    },
    gesturePoint() {
      const p = project(glasses.localToWorld(UNDER.clone()))
      // Close up on a narrow stage this lands near the bottom edge, so keep the label inside.
      return { x: p.x, y: Math.min(p.y, h - 28) }
    },
    dispose() {
      scene.traverse((o) => {
        if (o instanceof Mesh) {
          o.geometry.dispose()
          const mats = Array.isArray(o.material) ? o.material : [o.material]
          mats.forEach((m) => m.dispose())
        }
      })
      env.dispose()
      pmrem.dispose()
      renderer.dispose()
      renderer.forceContextLoss()
    },
  }
}

export type GlassesScene = ReturnType<typeof createGlassesScene>
