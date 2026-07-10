// Startklar Iglu-Szene — eigenständige Nachbildung des Scroll-Erlebnisses von igloo.inc
// (Original: Abeto/Bureaux). Komplett eigener Code auf Three.js-Basis:
// Ein Iglu aus einzelnen Eis-Steinen (InstancedMesh) setzt sich beim Scrollen
// Stein auf Stein zusammen, die Kamera fliegt durch den Eingangstunnel ins
// Innere zu einem leuchtenden Eiskern. Dazu Schnee, Nebel und Maus-Parallaxe.
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

// ── Abstimmbare Parameter ────────────────────────────────────────────────────
const DOME_RADIUS = 3
const DOME_ROWS = 12
const BRICK_W = 0.42
const BRICK_D = 0.3
const DOOR_THETA = Math.PI / 2 // Eingang zeigt Richtung +z (Startposition der Kamera)
const DOOR_HALF_ANGLE = 0.34
const TUNNEL_RINGS = 4
const TUNNEL_ARCH_R = 0.95
const SNOW_COUNT = 1200
const ASSEMBLY_END = 0.5 // Anteil des Scrollwegs, nach dem das Iglu fertig steht

const BG = new THREE.Color('#eef3f6')

type Keyframe = { s: number; r: number; th: number; h: number; ty: number; tz: number }

// Kamerafahrt: weit draußen → Umrundung → frontal vor den Eingang → durch den
// Tunnel (Theta bleibt fix, damit die Fahrt exakt auf der Tunnelachse liegt).
const CAM_PATH: Keyframe[] = [
  { s: 0.0, r: 14.0, th: DOOR_THETA + 0.9, h: 4.5, ty: 1.6, tz: 0 },
  { s: 0.22, r: 9.0, th: DOOR_THETA + 0.35, h: 2.6, ty: 1.3, tz: 0 },
  { s: 0.45, r: 6.6, th: DOOR_THETA - 0.35, h: 1.6, ty: 1.1, tz: 0 },
  { s: 0.66, r: 5.2, th: DOOR_THETA, h: 0.95, ty: 0.9, tz: 0 },
  { s: 0.82, r: 3.4, th: DOOR_THETA, h: 0.72, ty: 0.75, tz: -0.5 },
  { s: 1.0, r: 0.6, th: DOOR_THETA, h: 0.9, ty: 1.05, tz: -0.9 },
]

const smoothstep = (t: number) => t * t * (3 - 2 * t)
const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

type Brick = {
  target: THREE.Vector3
  targetQuat: THREE.Quaternion
  scatter: THREE.Vector3
  scatterQuat: THREE.Quaternion
  scale: THREE.Vector3
  delay: number
}

// Kleinster Winkelabstand zweier Azimut-Winkel
function angleDist(a: number, b: number) {
  const d = Math.abs(a - b) % (Math.PI * 2)
  return d > Math.PI ? Math.PI * 2 - d : d
}

function buildBricks(): Brick[] {
  const bricks: Brick[] = []
  const rng = mulberry32(20260710)
  const scatterFor = (bias: number) => {
    // Startposition: weit verstreut auf einer großen Kugelschale, leicht nach oben
    const dir = new THREE.Vector3(rng() * 2 - 1, rng() * 1.4 + 0.2, rng() * 2 - 1).normalize()
    return dir.multiplyScalar(9 + rng() * 6 + bias)
  }

  // Kuppel: Ringe aus Steinen, von unten nach oben, mit Aussparung für den Eingang
  const maxPhi = Math.PI / 2 - 0.14
  for (let row = 0; row < DOME_ROWS; row++) {
    const phi = ((row + 0.5) / DOME_ROWS) * maxPhi
    const ringR = DOME_RADIUS * Math.cos(phi)
    const y = DOME_RADIUS * Math.sin(phi)
    const count = Math.max(4, Math.round((Math.PI * 2 * ringR) / BRICK_W))
    const rowOffset = (row % 2) * (Math.PI / count) // versetzte Fugen wie beim echten Iglu
    const brickH = ((maxPhi * DOME_RADIUS) / DOME_ROWS) * 1.04

    for (let i = 0; i < count; i++) {
      const theta = (i / count) * Math.PI * 2 + rowOffset
      // Türöffnung in den unteren Reihen freilassen
      if (row < 3 && angleDist(theta, DOOR_THETA) < DOOR_HALF_ANGLE) continue

      const pos = new THREE.Vector3(ringR * Math.cos(theta), y, ringR * Math.sin(theta))
      // Basis: x tangential am Ring, z zeigt nach außen (Normale), y entlang des Meridians
      const normal = pos.clone().normalize()
      const tangent = new THREE.Vector3(-Math.sin(theta), 0, Math.cos(theta))
      const bitangent = new THREE.Vector3().crossVectors(normal, tangent)
      const m = new THREE.Matrix4().makeBasis(tangent, bitangent, normal)
      const quat = new THREE.Quaternion().setFromRotationMatrix(m)

      bricks.push({
        target: pos,
        targetQuat: quat,
        scatter: scatterFor(row * 0.1),
        scatterQuat: new THREE.Quaternion().setFromEuler(
          new THREE.Euler(rng() * Math.PI * 2, rng() * Math.PI * 2, rng() * Math.PI * 2),
        ),
        scale: new THREE.Vector3(
          ((Math.PI * 2 * ringR) / count) * 0.9,
          brickH * (0.92 + rng() * 0.12),
          BRICK_D,
        ),
        delay: (row / DOME_ROWS) * 0.55 + rng() * 0.12,
      })
    }
  }

  // Eingangstunnel: Halbbögen, die vom Kuppelrand nach außen führen
  const doorDir = new THREE.Vector3(Math.cos(DOOR_THETA), 0, Math.sin(DOOR_THETA))
  for (let ring = 0; ring < TUNNEL_RINGS; ring++) {
    const dist = DOME_RADIUS * 0.98 + 0.18 + ring * (BRICK_D + 0.04)
    const segs = 9
    for (let i = 0; i < segs; i++) {
      const a = (i / (segs - 1)) * Math.PI // 0..π, Bogen über dem Boden
      const local = new THREE.Vector2(Math.cos(a) * TUNNEL_ARCH_R, Math.sin(a) * TUNNEL_ARCH_R + 0.1)
      // Bogen liegt quer zur Türrichtung
      const side = new THREE.Vector3(-doorDir.z, 0, doorDir.x)
      const pos = new THREE.Vector3()
        .addScaledVector(side, local.x)
        .add(new THREE.Vector3(0, local.y, 0))
        .addScaledVector(doorDir, dist)
      const outward = new THREE.Vector3().addScaledVector(side, Math.cos(a)).add(new THREE.Vector3(0, Math.sin(a), 0))
      const along = doorDir.clone()
      const tangent = new THREE.Vector3().crossVectors(outward, along)
      const m = new THREE.Matrix4().makeBasis(tangent, outward, along)

      bricks.push({
        target: pos,
        targetQuat: new THREE.Quaternion().setFromRotationMatrix(m),
        scatter: scatterFor(1),
        scatterQuat: new THREE.Quaternion().setFromEuler(
          new THREE.Euler(rng() * Math.PI * 2, rng() * Math.PI * 2, rng() * Math.PI * 2),
        ),
        scale: new THREE.Vector3(0.34, 0.34, BRICK_D * 1.1),
        delay: 0.12 + ring * 0.05 + rng() * 0.08,
      })
    }
  }

  return bricks
}

// Deterministischer Zufall, damit das Iglu bei jedem Laden identisch aussieht
function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Weicher Kontaktschatten unter dem Iglu als Canvas-Textur
function makeShadowTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 256
  const ctx = c.getContext('2d')!
  const g = ctx.createRadialGradient(128, 128, 10, 128, 128, 128)
  g.addColorStop(0, 'rgba(120, 145, 165, 0.4)')
  g.addColorStop(0.6, 'rgba(120, 145, 165, 0.15)')
  g.addColorStop(1, 'rgba(120, 145, 165, 0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 256, 256)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

export default function IglooScene() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const reduceMotion =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      document.documentElement.getAttribute('data-motion') === 'reduziert'

    // ── Grundgerüst ──────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    scene.background = BG
    scene.fog = new THREE.Fog(BG, 9, 26)

    const camera = new THREE.PerspectiveCamera(50, mount.clientWidth / mount.clientHeight, 0.1, 60)

    scene.add(new THREE.HemisphereLight(0xffffff, 0xd4e2ec, 1.15))
    const sun = new THREE.DirectionalLight(0xffffff, 1.5)
    sun.position.set(5, 8, 4)
    scene.add(sun)

    // ── Boden + Kontaktschatten ──────────────────────────────────────────────
    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(40, 48),
      new THREE.MeshStandardMaterial({ color: 0xf4f8fa, roughness: 1 }),
    )
    ground.rotation.x = -Math.PI / 2
    scene.add(ground)

    const shadowTex = makeShadowTexture()
    const shadow = new THREE.Mesh(
      new THREE.CircleGeometry(4.6, 32),
      new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false }),
    )
    shadow.rotation.x = -Math.PI / 2
    shadow.position.y = 0.01
    scene.add(shadow)

    // ── Eis-Steine als InstancedMesh ─────────────────────────────────────────
    const bricks = buildBricks()
    const brickGeo = new THREE.BoxGeometry(1, 1, 1)
    const brickMat = new THREE.MeshStandardMaterial({
      color: 0xf4f8fa,
      roughness: 0.55,
      metalness: 0.05,
      flatShading: true,
    })
    const instanced = new THREE.InstancedMesh(brickGeo, brickMat, bricks.length)
    instanced.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    const tint = new THREE.Color()
    const rng = mulberry32(7)
    for (let i = 0; i < bricks.length; i++) {
      tint.setHSL(0.56, 0.18 + rng() * 0.1, 0.9 + rng() * 0.07)
      instanced.setColorAt(i, tint)
    }
    scene.add(instanced)

    // ── Leuchtender Eiskern im Inneren ───────────────────────────────────────
    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.32, 1),
      new THREE.MeshStandardMaterial({
        color: 0xdff4ff,
        emissive: 0x7fd4ff,
        emissiveIntensity: 1.6,
        roughness: 0.2,
        flatShading: true,
      }),
    )
    core.position.set(0, 1.0, -0.9)
    core.scale.setScalar(0.0001)
    scene.add(core)

    const coreLight = new THREE.PointLight(0xa8dcff, 0, 7, 2)
    coreLight.position.copy(core.position)
    scene.add(coreLight)

    // ── Schnee ───────────────────────────────────────────────────────────────
    const snowGeo = new THREE.BufferGeometry()
    const snowPos = new Float32Array(SNOW_COUNT * 3)
    const snowSpeed = new Float32Array(SNOW_COUNT)
    const srng = mulberry32(99)
    for (let i = 0; i < SNOW_COUNT; i++) {
      snowPos[i * 3] = (srng() - 0.5) * 24
      snowPos[i * 3 + 1] = srng() * 10
      snowPos[i * 3 + 2] = (srng() - 0.5) * 24
      snowSpeed[i] = 0.4 + srng() * 0.9
    }
    snowGeo.setAttribute('position', new THREE.BufferAttribute(snowPos, 3))
    const snow = new THREE.Points(
      snowGeo,
      new THREE.PointsMaterial({
        color: 0xa8c4d4,
        size: 0.05,
        transparent: true,
        opacity: 0.75,
        depthWrite: false,
      }),
    )
    scene.add(snow)

    // ── Scroll, Maus, Loop ───────────────────────────────────────────────────
    let targetScroll = 0
    let smoothScroll = 0
    const readScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      targetScroll = max > 0 ? clamp01(window.scrollY / max) : 0
    }
    readScroll()
    window.addEventListener('scroll', readScroll, { passive: true })

    const mouse = { x: 0, y: 0, sx: 0, sy: 0 }
    const onMouse = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    if (!reduceMotion) window.addEventListener('mousemove', onMouse, { passive: true })

    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mount.clientWidth, mount.clientHeight)
    }
    window.addEventListener('resize', onResize)

    const dummy = new THREE.Object3D()
    const tmpQuat = new THREE.Quaternion()
    const tmpPos = new THREE.Vector3()
    let lastAssembly = -1

    const updateBricks = (p: number) => {
      if (Math.abs(p - lastAssembly) < 1e-5) return
      lastAssembly = p
      for (let i = 0; i < bricks.length; i++) {
        const b = bricks[i]
        const lp = clamp01((p - b.delay) / 0.33)
        const e = 1 - Math.pow(1 - lp, 3)
        tmpPos.lerpVectors(b.scatter, b.target, e)
        tmpQuat.slerpQuaternions(b.scatterQuat, b.targetQuat, e)
        dummy.position.copy(tmpPos)
        dummy.quaternion.copy(tmpQuat)
        dummy.scale.copy(b.scale).multiplyScalar(Math.max(e, 0.0001))
        dummy.updateMatrix()
        instanced.setMatrixAt(i, dummy.matrix)
      }
      instanced.instanceMatrix.needsUpdate = true
    }

    const placeCamera = (s: number) => {
      let a = CAM_PATH[0]
      let b = CAM_PATH[CAM_PATH.length - 1]
      for (let i = 0; i < CAM_PATH.length - 1; i++) {
        if (s >= CAM_PATH[i].s && s <= CAM_PATH[i + 1].s) {
          a = CAM_PATH[i]
          b = CAM_PATH[i + 1]
          break
        }
      }
      const t = b.s === a.s ? 0 : smoothstep(clamp01((s - a.s) / (b.s - a.s)))
      const r = THREE.MathUtils.lerp(a.r, b.r, t)
      const th = THREE.MathUtils.lerp(a.th, b.th, t)
      const h = THREE.MathUtils.lerp(a.h, b.h, t)
      camera.position.set(r * Math.cos(th), h, r * Math.sin(th))
      const look = new THREE.Vector3(0, THREE.MathUtils.lerp(a.ty, b.ty, t), THREE.MathUtils.lerp(a.tz, b.tz, t))
      // Maus-Parallaxe nur auf das Blickziel, damit die Tunnelachse frei bleibt
      look.x += mouse.sx * 0.35
      look.y -= mouse.sy * 0.22
      camera.lookAt(look)
    }

    const clock = new THREE.Clock()
    let raf = 0
    const loop = () => {
      raf = requestAnimationFrame(loop)
      const dt = Math.min(clock.getDelta(), 0.05)

      smoothScroll += (targetScroll - smoothScroll) * (reduceMotion ? 1 : 0.07)
      mouse.sx += (mouse.x - mouse.sx) * 0.05
      mouse.sy += (mouse.y - mouse.sy) * 0.05

      const s = smoothScroll
      updateBricks(reduceMotion ? 1 : clamp01(s / ASSEMBLY_END))
      placeCamera(s)

      // Kern und Innenlicht blenden beim Eintauchen auf
      const coreT = smoothstep(clamp01((s - 0.68) / 0.24))
      core.scale.setScalar(Math.max(coreT, 0.0001))
      core.rotation.y += dt * 0.6
      core.rotation.x += dt * 0.25
      coreLight.intensity = coreT * 16

      if (!reduceMotion) {
        const pos = snowGeo.attributes.position as THREE.BufferAttribute
        for (let i = 0; i < SNOW_COUNT; i++) {
          let y = pos.getY(i) - snowSpeed[i] * dt
          if (y < 0) y = 10
          pos.setY(i, y)
          pos.setX(i, pos.getX(i) + Math.sin(y * 2 + i) * dt * 0.12)
        }
        pos.needsUpdate = true
      }

      renderer.render(scene, camera)
    }
    onResize()
    loop()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', readScroll)
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('resize', onResize)
      mount.removeChild(renderer.domElement)
      renderer.dispose()
      brickGeo.dispose()
      brickMat.dispose()
      snowGeo.dispose()
      ;(snow.material as THREE.Material).dispose()
      ground.geometry.dispose()
      ;(ground.material as THREE.Material).dispose()
      shadow.geometry.dispose()
      ;(shadow.material as THREE.Material).dispose()
      shadowTex.dispose()
      core.geometry.dispose()
      ;(core.material as THREE.Material).dispose()
    }
  }, [])

  return <div ref={mountRef} className="iglu-canvas" aria-hidden="true" />
}
