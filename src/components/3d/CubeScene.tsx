import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

function FloatingCube({ position, size, wireframe, color }: { position: [number, number, number], size: number, wireframe?: boolean, color?: string }) {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame(() => {
        if (!meshRef.current) return;
        // Slow rotation
        meshRef.current.rotation.x += 0.002;
        meshRef.current.rotation.y += 0.003;
    });

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={1}>
            <mesh ref={meshRef} position={position}>
                <boxGeometry args={[size, size, size]} />
                <meshStandardMaterial
                    color={color || "#ffffff"}
                    wireframe={wireframe}
                    transparent
                    opacity={wireframe ? 0.8 : 1} // Increased from 0.3
                    metalness={0.8} // Increased for more reflection
                    roughness={0.1} // Decreased for more shine
                />
            </mesh>
        </Float>
    );
}

function AnimatedGroup({ cubes }: { cubes: any[] }) {
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (!groupRef.current) return;
        // Smoothly interpolate rotation based on mouse position
        const { x, y } = state.pointer;
        // Increased sensitivity (0.5 instead of 0.2)
        groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, y * 0.5, 0.1);
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, x * 0.5, 0.1);
    });

    return (
        <group ref={groupRef}>
            {cubes.map((cube) => (
                <FloatingCube
                    key={cube.key}
                    position={cube.position}
                    size={cube.size}
                    wireframe={cube.wireframe}
                    color={cube.color}
                />
            ))}
        </group>
    );
}

export function CubeScene() {
    const cubes = useMemo(() => {
        const items = [];
        // Increased count to 80
        for (let i = 0; i < 80; i++) {
            items.push({
                position: [
                    (Math.random() - 0.5) * 25, // Wider spread
                    (Math.random() - 0.5) * 15,
                    (Math.random() - 0.5) * 12 - 4 // Closer to camera
                ] as [number, number, number],
                size: Math.random() * 1.5 + 0.8, // Slightly larger minimum size
                wireframe: Math.random() > 0.5,
                color: Math.random() > 0.8 ? "#aaaaaa" : "#ffffff",
                key: i
            });
        }
        return items;
    }, []);

    return (
        <div className="absolute inset-0 z-0 h-full w-full pointer-events-none">
            <Canvas eventSource={document.body}>
                <PerspectiveCamera makeDefault position={[0, 0, 15]} />
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <pointLight position={[-10, -5, -5]} intensity={2} color="#444" />

                <AnimatedGroup cubes={cubes} />

                <Environment preset="city" />
                <fog attach="fog" args={['#000000', 5, 25]} />
            </Canvas>
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80" />
        </div>
    );
}
