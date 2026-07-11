import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useMemo, useRef } from 'react'

const steel = '#2b302f'
const concrete = '#a8a59b'
const plaster = '#d8d1bf'
const accent = '#d78536'
const navy = '#14273a'
const glass = '#6f9297'
const wood = '#7a4328'
const charcoal = '#202625'
const boxGeometry = new THREE.BoxGeometry()
const materialCache = new Map()

function materialFor(color) {
  if (!materialCache.has(color)) {
    materialCache.set(color, new THREE.MeshStandardMaterial({
      color,
      roughness: color === glass ? 0.12 : color === steel || color === charcoal ? 0.48 : 0.76,
      metalness: color === steel || color === charcoal ? 0.38 : color === glass ? 0.18 : 0.03,
      transparent: color === glass,
      opacity: color === glass ? 0.72 : 1,
    }))
  }
  return materialCache.get(color)
}

function Block({ position, scale, color = concrete, rotation }) {
  return <mesh castShadow receiveShadow position={position} scale={scale} rotation={rotation} geometry={boxGeometry} material={materialFor(color)} />
}

function Window({ position, scale = [1.1, 1.05, 0.06], rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      <Block position={[0, 0, 0]} scale={scale} color={navy} />
      <Block position={[0, 0, 0.045]} scale={[scale[0] * 0.82, scale[1] * 0.82, scale[2] + 0.015]} color={glass} />
      <Block position={[0, 0, 0.13]} scale={[0.045, scale[1] * 0.82, 0.025]} color={navy} />
      <Block position={[0, 0, 0.13]} scale={[scale[0] * 0.82, 0.035, 0.025]} color={navy} />
    </group>
  )
}

function Door({ position, rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      <Block position={[0, 0, 0]} scale={[1.12, 2.05, 0.12]} color={charcoal} />
      <Block position={[0, 0, 0.08]} scale={[0.92, 1.85, 0.06]} color={wood} />
      {[0.46, 0, -0.46].map((y) => <Block key={y} position={[0, y, 0.13]} scale={[0.78, 0.025, 0.025]} color="#b87b43" />)}
      <Block position={[0.3, 0, 0.16]} scale={[0.035, 0.035, 0.035]} color="#d7ad62" />
    </group>
  )
}

function GlassRail({ x, width }) {
  return (
    <group position={[x, 3.45, 3.62]}>
      <Block position={[0, 0, 0]} scale={[width, 0.66, 0.045]} color={glass} />
      <Block position={[0, 0.36, 0]} scale={[width + 0.1, 0.055, 0.08]} color={charcoal} />
      <Block position={[-width / 2, 0, 0]} scale={[0.055, 0.74, 0.08]} color={charcoal} />
      <Block position={[width / 2, 0, 0]} scale={[0.055, 0.74, 0.08]} color={charcoal} />
    </group>
  )
}

function ConstructionHouse({ progress }) {
  const house = useRef()
  const stageRefs = useRef([])
  const stages = [0, 0.08, 0.18, 0.3, 0.44, 0.6, 0.76]

  useFrame((_, delta) => {
    const p = progress.current
    const buildProgress = Math.min(1, p / 0.21)
    if (house.current) {
      house.current.rotation.y = THREE.MathUtils.damp(house.current.rotation.y, -0.46 + p * 0.72, 3, delta)
      house.current.position.x = THREE.MathUtils.damp(house.current.position.x, 1.5 - p * 0.65, 3, delta)
      house.current.position.y = THREE.MathUtils.damp(house.current.position.y, -1.35 + p * 0.18, 3, delta)
    }
    stageRefs.current.forEach((group, index) => {
      if (!group) return
      const reveal = THREE.MathUtils.smoothstep(buildProgress, stages[index], stages[index] + 0.15)
      group.visible = reveal > 0
      if (buildProgress >= 0.995) {
        group.scale.y = 1
        group.position.y = 0
      } else {
        group.scale.y = THREE.MathUtils.damp(group.scale.y, reveal, 5, delta)
        group.position.y = THREE.MathUtils.damp(group.position.y, (1 - reveal) * 1.2, 4, delta)
      }
    })
  })

  const stageRef = (index) => (node) => { stageRefs.current[index] = node }

  return (
    <group ref={house} position={[1.5, -1.35, 0]} rotation={[0, -0.46, 0]}>
      <group ref={stageRef(0)} scale={[1, 0, 1]} visible={false}>
        <Block position={[0, 0.12, 0]} scale={[7.8, 0.24, 5.9]} color="#686b65" />
        <Block position={[0, 0.32, 0]} scale={[7.35, 0.18, 5.45]} color={concrete} />
        <Block position={[0, 0.43, 2.82]} scale={[7.65, 0.12, 0.35]} color={charcoal} />
      </group>

      <group ref={stageRef(1)} scale={[1, 0, 1]} visible={false}>
        <Block position={[0, 1.48, -2.55]} scale={[7.05, 2.18, 0.2]} color={plaster} />
        <Block position={[-3.42, 1.48, 0]} scale={[0.2, 2.18, 5.0]} color={plaster} />
        <Block position={[3.42, 1.48, 0]} scale={[0.2, 2.18, 5.0]} color={plaster} />
        <Block position={[0, 1.48, 2.5]} scale={[6.65, 2.18, 0.2]} color={plaster} />
        <Block position={[0, 2.62, 0]} scale={[7.35, 0.2, 5.35]} color={concrete} />
      </group>

      <group ref={stageRef(2)} scale={[1, 0, 1]} visible={false}>
        <Door position={[-2.15, 1.35, 2.63]} />
        <Window position={[-0.35, 1.48, 2.63]} scale={[1.05, 1.05, 0.07]} />
        <Window position={[2.05, 1.48, 2.63]} scale={[1.2, 1.05, 0.07]} />
        <Window position={[3.55, 1.5, 0.5]} scale={[1.0, 0.9, 0.07]} rotation={[0, Math.PI / 2, 0]} />
        <Block position={[-2.15, 2.35, 3.0]} scale={[1.65, 0.12, 1.05]} color={charcoal} />
        <Block position={[-2.82, 1.36, 2.98]} scale={[0.14, 2.0, 0.14]} color={accent} />
        <Block position={[-1.48, 1.36, 2.98]} scale={[0.14, 2.0, 0.14]} color={charcoal} />
        <Block position={[2.92, 1.48, 2.64]} scale={[0.22, 2.2, 0.12]} color={accent} />
      </group>

      <group ref={stageRef(3)} scale={[1, 0, 1]} visible={false}>
        <Block position={[0, 3.76, -2.52]} scale={[7.0, 2.05, 0.2]} color={plaster} />
        <Block position={[-3.4, 3.76, 0]} scale={[0.2, 2.05, 5.0]} color={plaster} />
        <Block position={[3.4, 3.76, 0]} scale={[0.2, 2.05, 5.0]} color={plaster} />
        <Block position={[0, 3.76, 2.5]} scale={[6.62, 2.05, 0.2]} color={plaster} />
        <Block position={[0, 4.86, 0]} scale={[7.35, 0.2, 5.35]} color={concrete} />
      </group>

      <group ref={stageRef(4)} scale={[1, 0, 1]} visible={false}>
        <Window position={[-2.15, 3.74, 2.63]} scale={[1.15, 1.05, 0.07]} />
        <Window position={[0.35, 3.74, 2.63]} scale={[1.4, 1.05, 0.07]} />
        <Window position={[2.35, 3.74, 2.63]} scale={[0.88, 1.05, 0.07]} />
        <Window position={[3.54, 3.72, -0.35]} scale={[1.15, 0.92, 0.07]} rotation={[0, Math.PI / 2, 0]} />
        <Block position={[-0.7, 2.9, 3.08]} scale={[4.65, 0.16, 1.15]} color={concrete} />
        <GlassRail x={-1.82} width={1.95} />
        <GlassRail x={0.35} width={1.95} />
        <Block position={[-2.88, 3.45, 3.62]} scale={[0.08, 0.8, 0.08]} color={charcoal} />
        <Block position={[1.42, 3.45, 3.62]} scale={[0.08, 0.8, 0.08]} color={charcoal} />
      </group>

      <group ref={stageRef(5)} scale={[1, 0, 1]} visible={false}>
        <Block position={[0, 5.08, 0]} scale={[7.15, 0.34, 5.15]} color={plaster} />
        <Block position={[0, 5.2, 2.64]} scale={[7.25, 0.18, 0.12]} color={charcoal} />
        <Block position={[1.0, 5.22, 2.73]} scale={[4.8, 0.1, 0.1]} color={accent} />
        <Block position={[-2.75, 5.22, 2.73]} scale={[1.05, 0.1, 0.1]} color={charcoal} />
      </group>

      <group ref={stageRef(6)} scale={[1, 0, 1]} visible={false}>
        <Block position={[3.54, 2.72, 1.65]} scale={[0.18, 4.85, 0.65]} color={accent} />
        <Block position={[3.64, 2.72, 0.75]} scale={[0.08, 4.7, 0.08]} color={charcoal} />
        <Block position={[0, 2.68, 2.67]} scale={[7.1, 0.1, 0.12]} color={charcoal} />
        <Block position={[-1.7, 4.95, 2.73]} scale={[3.0, 0.12, 0.16]} color={accent} />
        <Block position={[-3.0, 3.82, 2.7]} scale={[0.08, 1.7, 0.08]} color={wood} />
        <Block position={[-2.72, 3.82, 2.7]} scale={[0.08, 1.7, 0.08]} color={wood} />
      </group>

    </group>
  )
}

function BackgroundBlock({ x, z, h, w, d }) {
  return <Block position={[x, h / 2 - 1.5, z]} scale={[w, h, d]} color="#151918" />
}

function Scene({ progress }) {
  const cameraTarget = useRef(new THREE.Vector3(0.6, 1.8, 0))
  const surroundings = useMemo(() => [
    [-9, -8, 3, 3, 2.5], [-4.5, -10, 4, 2.5, 2.3], [6, -10, 3.4, 3, 2.4], [10, -7, 4, 3, 2.6], [-11, -3, 3.2, 2.5, 3],
  ], [])

  useFrame((state, delta) => {
    const p = progress.current
    const angle = 0.5 + p * Math.PI * 0.62
    const completedReveal = THREE.MathUtils.smoothstep(p, 0.12, 0.24)
    const narrowScreenPullback = Math.max(0, 0.9 - state.camera.aspect) * 12
    const radius = 14.4 + completedReveal * 2.6 + narrowScreenPullback
    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, Math.cos(angle) * radius, 2.6, delta)
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, 2.8 + p * 2, 2.6, delta)
    state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, Math.sin(angle) * radius, 2.6, delta)
    cameraTarget.current.set(0.5, 1.4 + p * 0.6, 0)
    state.camera.lookAt(cameraTarget.current)
  })

  return (
    <>
      <color attach="background" args={['#0a0d0d']} />
      <fog attach="fog" args={['#0a0d0d', 14, 29]} />
      <hemisphereLight intensity={1.1} color="#d9dfd4" groundColor="#161917" />
      <directionalLight castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} shadow-camera-far={32} position={[-6, 10, 8]} intensity={3.5} color="#ffe2b6" />
      <pointLight position={[6, 5, 4]} intensity={36} color={accent} distance={14} />
      <ConstructionHouse progress={progress} />
      {surroundings.map((block, index) => <BackgroundBlock key={index} x={block[0]} z={block[1]} h={block[2]} w={block[3]} d={block[4]} />)}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]}>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#101313" roughness={0.92} />
      </mesh>
      <gridHelper args={[60, 60, '#30332f', '#191c1a']} position={[0, -1.47, 0]} />
    </>
  )
}

export default function BuildingScene({ progress }) {
  return (
    <div className="canvas-wrap" aria-hidden="true">
      <Canvas shadows dpr={[0.75, 1.1]} camera={{ position: [8.2, 3.6, 12.5], fov: 40 }} gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}>
        <Scene progress={progress} />
      </Canvas>
    </div>
  )
}
