import { Component, Suspense, useMemo, useRef, type ReactNode } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, MeshReflectorMaterial, useTexture } from '@react-three/drei';
import type { MotionValue } from 'framer-motion';
import * as THREE from 'three';
import office from '../../assets/Commercial/Office/E.png';
import classicIndian from '../../assets/Residential/Classic Indian/H.png';
import threeBhk from '../../assets/Residential/3BHK Apartment/F.png';

const portalDepths = [4, 1, -2, -5, -8, -11, -14];

function Portal({ z, index }: { z: number; index: number }) {
    const pale = index % 3 === 0;
    const material = pale ? '#d9d6cd' : index % 3 === 1 ? '#1c2721' : '#b47d3f';
    return <group position={[0, 0, z]} rotation={[0, (index % 2 ? -1 : 1) * 0.035, 0]}>
        <mesh position={[-3.5, 1.85, 0]} castShadow><boxGeometry args={[0.12, 3.7, 0.18]} /><meshStandardMaterial color={material} roughness={0.55} metalness={pale ? 0.05 : 0.24} /></mesh>
        <mesh position={[3.5, 1.85, 0]} castShadow><boxGeometry args={[0.12, 3.7, 0.18]} /><meshStandardMaterial color={material} roughness={0.55} metalness={pale ? 0.05 : 0.24} /></mesh>
        <mesh position={[0, 3.68, 0]} castShadow><boxGeometry args={[7.12, 0.12, 0.18]} /><meshStandardMaterial color={material} roughness={0.55} metalness={pale ? 0.05 : 0.24} /></mesh>
    </group>;
}

function ProjectPlane({ texture, position, rotation, index, progress, start }: { texture: THREE.Texture; position: [number, number, number]; rotation: [number, number, number]; index: number; progress: MotionValue<number>; start: number }) {
    const group = useRef<THREE.Group>(null);
    const imageMaterial = useRef<THREE.MeshBasicMaterial>(null);
    const backingMaterial = useRef<THREE.MeshStandardMaterial>(null);
    useFrame(() => {
        const local = THREE.MathUtils.smoothstep(THREE.MathUtils.clamp((progress.get() - start) / 0.25, 0, 1), 0, 1);
        if (group.current) {
            group.current.visible = local > 0.002;
            group.current.position.y = position[1] + (1 - local) * 1.35;
            group.current.scale.setScalar(0.84 + local * 0.16);
        }
        if (imageMaterial.current) imageMaterial.current.opacity = local;
        if (backingMaterial.current) backingMaterial.current.opacity = local;
    });
    return <Float speed={0.7 + index * 0.12} rotationIntensity={0.08} floatIntensity={0.12}>
        <group ref={group} position={position} rotation={rotation} visible={false}>
            <mesh position={[0, 0, -0.08]} castShadow><boxGeometry args={[3.95, 2.58, 0.12]} /><meshStandardMaterial ref={backingMaterial} color="#101713" roughness={0.7} transparent opacity={0} /></mesh>
            <mesh><planeGeometry args={[3.76, 2.36]} /><meshBasicMaterial ref={imageMaterial} map={texture} toneMapped={false} transparent opacity={0} /></mesh>
            <mesh position={[-1.94, -1.37, 0.04]}><sphereGeometry args={[0.065, 16, 16]} /><meshStandardMaterial color="#d6a15c" metalness={0.75} roughness={0.22} emissive="#6a3b16" emissiveIntensity={0.35} /></mesh>
        </group>
    </Float>;
}

function DrawingLines() {
    const geometry = useMemo(() => {
        const points: number[] = [];
        for (let x = -5; x <= 5; x += 1) points.push(x, 0, 8, x, 0, -18);
        for (let z = 8; z >= -18; z -= 1) points.push(-5, 0, z, 5, 0, z);
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
        return geo;
    }, []);
    return <lineSegments geometry={geometry} position={[0, 0.005, 0]}><lineBasicMaterial color="#b8c0b5" transparent opacity={0.13} /></lineSegments>;
}

function GoldTrace({ progress }: { progress: MotionValue<number> }) {
    const geometry = useMemo(() => {
        const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-3.8, 0.035, 7), new THREE.Vector3(2.8, 0.035, 4),
            new THREE.Vector3(-2.4, 0.035, 0), new THREE.Vector3(2.6, 0.035, -4),
            new THREE.Vector3(-2.2, 0.035, -8), new THREE.Vector3(0, 0.035, -16),
        ]);
        return new THREE.BufferGeometry().setFromPoints(curve.getPoints(260));
    }, []);
    const line = useMemo(() => new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: '#e4ad64' })), [geometry]);
    useFrame(() => geometry.setDrawRange(0, Math.max(2, Math.floor(progress.get() * 261))));
    return <primitive object={line} />;
}

function Dust() {
    const points = useRef<THREE.Points>(null);
    const positions = useMemo(() => {
        const values = new Float32Array(270);
        for (let i = 0; i < values.length; i += 3) {
            values[i] = Math.sin(i * 12.91) * 5.2;
            values[i + 1] = 0.4 + Math.abs(Math.cos(i * 4.17)) * 4.2;
            values[i + 2] = 7 - (i / values.length) * 26;
        }
        return values;
    }, []);
    useFrame((_, delta) => { if (points.current) points.current.rotation.y += delta * 0.006; });
    return <points ref={points}><bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry><pointsMaterial color="#efe9db" size={0.025} transparent opacity={0.38} sizeAttenuation /></points>;
}

function SpatialFilm({ progress, still }: { progress: MotionValue<number>; still: boolean }) {
    const portals = useRef<THREE.Group>(null);
    const slabs = useRef<THREE.Group>(null);
    const textures = useTexture([office, classicIndian, threeBhk]);
    textures.forEach((texture) => { texture.colorSpace = THREE.SRGBColorSpace; texture.anisotropy = 8; });
    const cameraPath = useMemo(() => new THREE.CatmullRomCurve3([
        new THREE.Vector3(7.2, 3.35, 10.5), new THREE.Vector3(4.8, 3.05, 6.2),
        new THREE.Vector3(1.7, 2.55, 2.8), new THREE.Vector3(-1.25, 2.25, -1.1),
        new THREE.Vector3(1.3, 2.15, -5.1), new THREE.Vector3(-1.1, 2.2, -9.1),
        new THREE.Vector3(0.2, 2.3, -13.2),
    ]), []);

    useFrame(({ camera, pointer }, delta) => {
        const p = progress.get();
        const smooth = (v: number) => THREE.MathUtils.smoothstep(v, 0, 1);
        portals.current?.children.forEach((portal, i) => {
            const resting = i === 0 ? 0.82 : i === 1 ? 0.42 : 0;
            const local = Math.max(resting, smooth(THREE.MathUtils.clamp((p - i * 0.075) / 0.2, 0, 1)));
            portal.scale.y = 0.04 + local * 0.96;
            portal.position.y = (1 - local) * -1.8;
            portal.rotation.z = (1 - local) * (i % 2 ? -0.08 : 0.08);
        });
        slabs.current?.children.forEach((slab, i) => {
            const local = smooth(THREE.MathUtils.clamp((p - (0.1 + i * 0.08)) / 0.24, 0, 1));
            slab.position.x = (i % 2 ? 1 : -1) * (5.7 - local * 1.9);
            slab.rotation.z = (1 - local) * (i % 2 ? 0.12 : -0.12);
        });

        const desired = cameraPath.getPointAt(Math.min(0.995, p));
        const target = cameraPath.getPointAt(Math.min(1, p + 0.055));
        if (!still) {
            desired.x += pointer.x * 0.18;
            desired.y += pointer.y * 0.1;
        }
        camera.position.lerp(desired, 1 - Math.exp(-delta * 3.3));
        camera.lookAt(target.x, target.y - 0.35, target.z);
    });

    return <>
        <group ref={portals}>{portalDepths.map((z, i) => <Portal key={z} z={z} index={i} />)}</group>
        <group>
            <ProjectPlane texture={textures[0]} position={[-1.85, 1.85, -0.35]} rotation={[0, 0.34, 0]} index={0} progress={progress} start={0.15} />
            <ProjectPlane texture={textures[1]} position={[1.8, 1.85, -6.25]} rotation={[0, -0.34, 0]} index={1} progress={progress} start={0.39} />
            <ProjectPlane texture={textures[2]} position={[-1.7, 1.85, -12.25]} rotation={[0, 0.3, 0]} index={2} progress={progress} start={0.65} />
        </group>
        <group ref={slabs}>
            {[-1, -4, -7, -10].map((z, i) => <mesh key={z} position={[i % 2 ? 4 : -4, 1.25 + (i % 2) * 1.15, z]} castShadow><boxGeometry args={[3.1, 0.1, 1.4]} /><meshStandardMaterial color={i % 2 ? '#d4d1c7' : '#26332b'} roughness={0.62} metalness={0.08} /></mesh>)}
        </group>
        <GoldTrace progress={progress} />
        <DrawingLines />
        <Dust />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.045, -5]} receiveShadow>
            <planeGeometry args={[14, 34]} />
            <MeshReflectorMaterial color="#101713" roughness={0.72} metalness={0.2} blur={[280, 90]} resolution={512} mixBlur={1.1} mixStrength={0.22} depthScale={0.35} minDepthThreshold={0.7} maxDepthThreshold={1.4} />
        </mesh>
    </>;
}

class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
    state = { failed: false };
    static getDerivedStateFromError() { return { failed: true }; }
    render() { return this.state.failed ? <div className="scene-fallback-grid" /> : this.props.children; }
}

export function CubeScene({ progress, still = false }: { progress: MotionValue<number>; still?: boolean }) {
    return <SceneBoundary><Canvas dpr={[1, 1.5]} shadows camera={{ position: [7.2, 3.35, 10.5], fov: 44, near: 0.1, far: 80 }} gl={{ antialias: true, powerPreference: 'high-performance', toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 0.95 }}>
        <color attach="background" args={['#141b17']} />
        <fog attach="fog" args={['#141b17', 12, 30]} />
        <hemisphereLight args={['#d9ded5', '#08100b', 0.82]} />
        <directionalLight position={[6, 9, 8]} intensity={2.1} color="#ffe3b9" castShadow shadow-mapSize={[1024, 1024]} />
        <directionalLight position={[-5, 4, -6]} intensity={0.75} color="#9cc1ac" />
        <Suspense fallback={null}><SpatialFilm progress={progress} still={still} /><Environment preset="city" environmentIntensity={0.1} /></Suspense>
    </Canvas></SceneBoundary>;
}
