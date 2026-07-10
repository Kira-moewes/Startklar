import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Echtzeit-3D-Flugwelt (low-poly): ein Papierflieger dreht durch eine räumliche
// Wolken-/Inselwelt. Bewusst schlank (wenige, grobe Meshes, kein Schatten-Map,
// begrenzte Pixeldichte), damit es auch auf schwachen Geräten läuft. Wird per
// FlugWeltHero nur bei Bedarf geladen (eigener Chunk) – mit 2D-Fallback.

// Theme-Farbe aus einer CSS-Variablen lesen (fällt auf Default zurück).
function cssFarbe(name: string, fallback: string): string {
  if (typeof window === 'undefined') return fallback
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return v || fallback
}

// Papierflieger-Geometrie – Nase zeigt in -Z (passt zu group.lookAt).
function fliegerGeometrie(): THREE.BufferGeometry {
  const N = [0, 0, -1.5]
  const T = [0, 0.06, 1.1]
  const L = [1.0, 0, 0.9]
  const R = [-1.0, 0, 0.9]
  const K = [0, -0.42, 0.7]
  const tris = [
    [N, T, L], // linker Flügel
    [N, R, T], // rechter Flügel
    [N, K, T], // Kiel unten
  ]
  const pos: number[] = []
  for (const [a, b, c] of tris) pos.push(...a, ...b, ...c)
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  g.computeVertexNormals()
  return g
}

function Flieger({ farbe }: { farbe: string }) {
  const ref = useRef<THREE.Group>(null)
  const geom = useMemo(fliegerGeometrie, [])
  const ziel = useMemo(() => new THREE.Vector3(), [])
  const r = 3.1

  useFrame(({ clock }) => {
    const t = clock.elapsedTime * 0.32
    const g = ref.current
    if (!g) return
    g.position.set(r * Math.cos(t), 0.3 + Math.sin(t * 2) * 0.35, r * Math.sin(t))
    const tn = t + 0.05
    ziel.set(r * Math.cos(tn), 0.3 + Math.sin(tn * 2) * 0.35, r * Math.sin(tn))
    g.lookAt(ziel)
    g.rotateZ(Math.sin(t) * 0.32) // Kurvenlage
  })

  return (
    <group ref={ref}>
      <mesh geometry={geom}>
        <meshStandardMaterial color={farbe} flatShading side={THREE.DoubleSide} roughness={0.7} metalness={0.05} />
      </mesh>
    </group>
  )
}

function Insel({ position, gras, fels, phase }: { position: [number, number, number]; gras: string; fels: string; phase: number }) {
  const ref = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (ref.current) ref.current.position.y = position[1] + Math.sin(clock.elapsedTime * 0.6 + phase) * 0.18
  })
  return (
    <group ref={ref} position={position}>
      {/* Grasdeckel */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[1.15, 1.0, 0.45, 7]} />
        <meshStandardMaterial color={gras} flatShading roughness={0.9} />
      </mesh>
      {/* Felskegel */}
      <mesh position={[0, -0.8, 0]}>
        <coneGeometry args={[1.0, 1.5, 7]} />
        <meshStandardMaterial color={fels} flatShading roughness={1} />
      </mesh>
    </group>
  )
}

function Wolke({ position, farbe, drift }: { position: [number, number, number]; farbe: string; drift: number }) {
  const ref = useRef<THREE.Group>(null)
  const start = position[0]
  useFrame(({ clock }) => {
    if (!ref.current) return
    const x = ((start + clock.elapsedTime * drift + 12) % 24) - 12
    ref.current.position.x = x
  })
  const kugeln: [number, number, number, number][] = [
    [0, 0, 0, 0.9], [0.8, -0.1, 0.1, 0.7], [-0.8, -0.05, -0.1, 0.65], [0.3, 0.35, 0, 0.6],
  ]
  return (
    <group ref={ref} position={position}>
      {kugeln.map((k, i) => (
        <mesh key={i} position={[k[0], k[1], k[2]]}>
          <icosahedronGeometry args={[k[3], 0]} />
          <meshStandardMaterial color={farbe} flatShading transparent opacity={0.85} roughness={1} />
        </mesh>
      ))}
    </group>
  )
}

function Szene() {
  const f = useMemo(() => ({
    akzent: cssFarbe('--t-akzent', '#8FA35A'),
    gras: cssFarbe('--insel', '#92A758'),
    fels: cssFarbe('--fels', '#7C6A52'),
    wolke: cssFarbe('--cloud', '#FFFDF4'),
    himmel: cssFarbe('--sky-2', '#F1D9A8'),
    tief: cssFarbe('--sky-3', '#E8C48C'),
  }), [])

  return (
    <>
      <color attach="background" args={[f.himmel]} />
      <fog attach="fog" args={[f.tief, 9, 22]} />
      <ambientLight intensity={0.85} />
      <directionalLight position={[4, 8, 3]} intensity={1.1} />
      <hemisphereLight args={[f.himmel, f.fels, 0.5]} />

      <Flieger farbe={f.akzent} />

      <Insel position={[-3.4, -0.6, -2]} gras={f.gras} fels={f.fels} phase={0} />
      <Insel position={[3.6, -1.1, -3]} gras={f.gras} fels={f.fels} phase={1.7} />
      <Insel position={[0.4, -1.6, -6]} gras={f.gras} fels={f.fels} phase={3.1} />

      <Wolke position={[-5, 1.8, -4]} farbe={f.wolke} drift={0.5} />
      <Wolke position={[4, 2.4, -6]} farbe={f.wolke} drift={0.35} />
      <Wolke position={[0, -0.4, -8]} farbe={f.wolke} drift={0.28} />
    </>
  )
}

export default function FlugWelt3D() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 2.6, 8.5], fov: 46 }}
      gl={{ antialias: true, powerPreference: 'low-power' }}
      style={{ width: '100%', height: '100%' }}
    >
      <Szene />
    </Canvas>
  )
}
