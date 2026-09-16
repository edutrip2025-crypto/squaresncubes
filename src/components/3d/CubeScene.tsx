import { Component, Suspense, useMemo, useRef, type ReactNode } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, MeshReflectorMaterial, useTexture } from '@react-three/drei';
import type { MotionValue } from 'framer-motion';
import * as THREE from 'three';
import office from '../../assets/Commercial/Office/E.png';
import classicIndian from '../../assets/Residential/Classic Indian/H.png';
import threeBhk from '../../assets/Residential/3BHK Apartment/F.png';

const portalDepths = [4, 1, -2, -5, -8, -11, -14];

// Each quadrilateral follows a stroke of the supplied mark. These same vertices
// straighten into the first three portals; no image slices or crossfade are used.
const logoStrokes = [
    [[70,135],[249,35],[247,106],[136,168]],
    [[249,35],[369,100],[303,136],[247,106]],
    [[70,135],[136,168],[136,237],[70,204]],
    [[70,204],[136,168],[300,255],[240,296]],
    [[240,296],[300,255],[300,423],[240,387]],
    [[70,277],[240,367],[240,387],[70,347]],
    [[70,347],[240,387],[300,423],[253,450]],
    [[307,351],[437,277],[437,347],[307,423]],
    [[330,138],[376,113],[420,138],[375,163]],
    // Upper-right return of the C, below the gold inset.
    [[378,177],[438,143],[438,208],[408,192.5]],
    // The inset's surrounding face sits behind the gold diamond.
    [[312,138],[376,102],[438,137],[375,174]],
];

function LogoStroke({ index, progress }: { index: number; progress: MotionValue<number> }) {
    const geometry = useMemo(() => {
        const result = new THREE.BufferGeometry();
        result.setAttribute('position', new THREE.BufferAttribute(new Float32Array(24), 3).setUsage(THREE.DynamicDrawUsage));
        result.setIndex([0,1,2,0,2,3, 4,6,5,4,7,6, 0,4,5,0,5,1, 1,5,6,1,6,2, 2,6,7,2,7,3, 3,7,4,3,4,0]);
        return result;
    }, []);
    useFrame(({ size }) => {
        const unfold = THREE.MathUtils.smoothstep(progress.get(), 0.045 + index * 0.006, 0.23 + index * 0.006);
        const settle = THREE.MathUtils.smoothstep(progress.get(), 0.22, 0.34);
        const scale = size.width < 600 ? 0.005 : 0.008;
        const slot = index % 3;
        const z = 4 - Math.floor(index / 3) * 3;
        const extra = index >= 9;
        const x = extra ? (index === 9 ? -3.5 : 3.5) : slot === 0 ? -3.5 : slot === 1 ? 3.5 : 0;
        const y = extra ? 1.85 : slot === 2 ? 3.68 : 1.85;
        const w = extra ? 0.12 : slot === 2 ? 7.12 : 0.12;
        const h = extra ? 3.7 : slot === 2 ? 0.12 : 3.7;
        const corners = [[-1,1],[1,1],[1,-1],[-1,-1]];
        const positions = geometry.getAttribute('position') as THREE.BufferAttribute;
        for (let vertex = 0; vertex < 8; vertex++) {
            const corner = vertex % 4;
            const point = logoStrokes[index][corner];
            const side = vertex < 4 ? 1 : -1;
            const fromX = (point[0] - 250) * scale;
            const fromY = 2.1 + (250 - point[1]) * scale;
            // Open into separated straight strokes before arranging them in depth.
            const openX = x * 0.65 + corners[corner][0] * w / 2;
            const openY = y + corners[corner][1] * h / 2;
            positions.setXYZ(vertex,
                THREE.MathUtils.lerp(fromX, THREE.MathUtils.lerp(openX, x + corners[corner][0] * w / 2, settle), unfold),
                THREE.MathUtils.lerp(fromY, openY, unfold),
                THREE.MathUtils.lerp(4 + side * 0.04 - (index === 10 ? 0.006 : 0), THREE.MathUtils.lerp(4, z, settle) + side * 0.09, unfold));
        }
        positions.needsUpdate = true;
        geometry.computeVertexNormals();
    });
    return <mesh geometry={geometry} frustumCulled={false} castShadow={index !== 8}>
        {index === 8
            ? <meshBasicMaterial color="#e8b97e" toneMapped={false} side={THREE.DoubleSide} />
            : <meshStandardMaterial color="#f1eee7" flatShading roughness={0.5} metalness={0.08} side={THREE.DoubleSide} />}
    </mesh>;
}

function LogoBreak({ progress }: { progress: MotionValue<number> }) {
    return <group>{logoStrokes.map((_, index) => <LogoStroke key={index} index={index} progress={progress} />)}</group>;
}

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
    useFrame(({ size }) => {
        const p = progress.get();
        const local = THREE.MathUtils.smoothstep(p, start, start + 0.10);
        const fadeOut = index === 2 ? 1 : 1 - THREE.MathUtils.smoothstep(p, index === 0 ? 0.50 : 0.72, index === 0 ? 0.56 : 0.78);
        if (group.current) {
            group.current.visible = local * fadeOut > 0.002;
            group.current.position.y = position[1] + (1 - local) * 1.35;
            const responsiveScale = size.width < 600 ? 0.62 : 1;
            group.current.scale.setScalar((0.84 + local * 0.16) * responsiveScale);
        }
        if (imageMaterial.current) imageMaterial.current.opacity = local * fadeOut;
        if (backingMaterial.current) backingMaterial.current.opacity = local * fadeOut;
    });
    const image = texture.image as { width?: number; height?: number } | undefined;
    const aspect = image?.width && image?.height ? image.width / image.height : 1.6;
    const imageWidth = 3.3;
    const imageHeight = imageWidth / aspect;
    return <Float speed={0.7 + index * 0.12} rotationIntensity={0.055} floatIntensity={0.08}>
        <group ref={group} position={position} rotation={rotation} visible={false}>
            <mesh position={[0, 0, -0.08]} castShadow><boxGeometry args={[imageWidth + 0.2, imageHeight + 0.2, 0.12]} /><meshStandardMaterial ref={backingMaterial} color="#101713" roughness={0.7} transparent opacity={0} /></mesh>
            <mesh><planeGeometry args={[imageWidth, imageHeight]} /><meshBasicMaterial ref={imageMaterial} map={texture} toneMapped={false} transparent opacity={0} side={THREE.DoubleSide} /></mesh>
            <mesh position={[-imageWidth / 2 - 0.04, -imageHeight / 2 - 0.08, 0.04]}><sphereGeometry args={[0.055, 16, 16]} /><meshStandardMaterial color="#d6a15c" metalness={0.75} roughness={0.22} emissive="#6a3b16" emissiveIntensity={0.35} /></mesh>
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
    useFrame(({ camera, pointer, size }) => {
        const p = progress.get();
        const travel = THREE.MathUtils.clamp((p - 0.34) / 0.66, 0, 1);
        const smooth = (v: number) => THREE.MathUtils.smoothstep(v, 0, 1);
        portals.current?.children.forEach((portal, i) => {
            const local = smooth(THREE.MathUtils.clamp((p - 0.28 - i * 0.055) / 0.2, 0, 1));
            portal.visible = local > 0.001;
            portal.scale.y = 0.04 + local * 0.96;
            portal.position.y = (1 - local) * -1.8;
            portal.rotation.z = (1 - local) * (i % 2 ? -0.08 : 0.08);
        });
        slabs.current?.children.forEach((slab, i) => {
            slab.visible = p > 0.30 && p < 0.38;
            const local = smooth(THREE.MathUtils.clamp((travel - (0.1 + i * 0.08)) / 0.24, 0, 1));
            slab.position.x = (i % 2 ? 1 : -1) * (5.7 - local * 1.9);
            slab.rotation.z = (1 - local) * (i % 2 ? 0.12 : -0.12);
        });

        // Frame each complete image, including portrait screens, rather than
        // looking along a tunnel tangent and passing beside the artwork.
        const centers = [[-1.2, 1.85, -0.35], [1.15, 1.85, -6.25], [-1.1, 1.85, -12.25]];
        const stops = centers.map((center, index) => {
            const image = textures[index].image as { width: number; height: number };
            const scale = size.width < 600 ? 0.62 : 1;
            const halfWidth = (3.3 + 0.2) * scale / 2;
            const halfHeight = (3.3 / (image.width / image.height) + 0.2) * scale / 2;
            const tangent = Math.tan(THREE.MathUtils.degToRad(44 / 2));
            const distance = Math.max(halfHeight / tangent, halfWidth / (tangent * size.width / size.height)) * 1.65;
            return { position: new THREE.Vector3(center[0], center[1], center[2] + distance), target: new THREE.Vector3(...center) };
        });
        const intro = { position: new THREE.Vector3(0, 2.1, 10), target: new THREE.Vector3(0, 2.1, 4) };
        const keys = [
            { p: 0, ...intro }, { p: 0.30, ...intro },
            { p: 0.42, ...stops[0] }, { p: 0.50, ...stops[0] },
            { p: 0.64, ...stops[1] }, { p: 0.72, ...stops[1] },
            { p: 0.86, ...stops[2] }, { p: 1, ...stops[2] },
        ];
        const next = keys.findIndex((key) => key.p >= p);
        const upper = Math.max(1, next < 0 ? keys.length - 1 : next);
        const a = keys[upper - 1], b = keys[upper];
        const mix = smooth(THREE.MathUtils.clamp((p - a.p) / (b.p - a.p), 0, 1));
        const desired = a.position.clone().lerp(b.position, mix);
        const target = a.target.clone().lerp(b.target, mix);
        if (!still && size.width >= 600) {
            desired.x += pointer.x * 0.06;
            desired.y += pointer.y * 0.04;
        }
        camera.position.copy(desired);
        camera.lookAt(target);
    });

    return <>
        <LogoBreak progress={progress} />
        <group ref={portals}>{portalDepths.slice(3).map((z, i) => <Portal key={z} z={z} index={i + 3} />)}</group>
        <group>
            <ProjectPlane texture={textures[0]} position={[-1.2, 1.85, -0.35]} rotation={[0, 0.2, 0]} index={0} progress={progress} start={0.25} />
            <ProjectPlane texture={textures[1]} position={[1.15, 1.85, -6.25]} rotation={[0, -0.2, 0]} index={1} progress={progress} start={0.5} />
            <ProjectPlane texture={textures[2]} position={[-1.1, 1.85, -12.25]} rotation={[0, 0.18, 0]} index={2} progress={progress} start={0.73} />
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
    return <SceneBoundary><Canvas dpr={[1, 2]} shadows camera={{ position: [0, 2.1, 10], fov: 44, near: 0.1, far: 80 }} gl={{ antialias: true, powerPreference: 'high-performance', toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 0.95 }}>
        <color attach="background" args={['#141b17']} />
        <fog attach="fog" args={['#141b17', 12, 30]} />
        <hemisphereLight args={['#d9ded5', '#08100b', 0.82]} />
        <directionalLight position={[6, 9, 8]} intensity={2.1} color="#ffe3b9" castShadow shadow-mapSize={[1024, 1024]} />
        <directionalLight position={[-5, 4, -6]} intensity={0.75} color="#9cc1ac" />
        <Suspense fallback={null}><SpatialFilm progress={progress} still={still} /><Environment preset="city" environmentIntensity={0.1} /></Suspense>
    </Canvas></SceneBoundary>;
}
