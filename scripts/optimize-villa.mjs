import fs from 'node:fs/promises';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

// GLTFExporter uses FileReader in browsers; Node supplies Blob but not FileReader.
globalThis.FileReader = class {
    result = null;
    listeners = new Map();
    addEventListener(type, listener) { this.listeners.set(type, listener); }
    async readAsArrayBuffer(blob) {
        this.result = await blob.arrayBuffer();
        this.listeners.get('loadend')?.();
        this.onloadend?.();
    }
};

const source = new URL('../../src/assets/Pune%20Villa%20Elevation%20%20main.glb', import.meta.url);
const destination = new URL('../public/pune-villa-web.glb', import.meta.url);
const data = await fs.readFile(source);
const gltf = await new GLTFLoader().parseAsync(data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength), '');
gltf.scene.updateMatrixWorld(true);

const buckets = new Map();
let sourceMeshes = 0;

gltf.scene.traverse((object) => {
    if (!object.isMesh || !object.geometry?.attributes.position || Array.isArray(object.material)) return;
    sourceMeshes += 1;
    const geometry = object.geometry.clone().applyMatrix4(object.matrixWorld);
    const signature = Object.entries(geometry.attributes)
        .map(([name, attribute]) => `${name}:${attribute.itemSize}:${attribute.normalized}`)
        .sort()
        .join('|');
    // Transparent CAD faces cannot all become one mesh: WebGL sorts transparent
    // *objects*, not individual triangles. Split those faces into local cells so
    // the browser can order them correctly while opaque geometry stays compact.
    geometry.computeBoundingBox();
    const position = geometry.boundingBox.getCenter(new THREE.Vector3());
    const cell = `${Math.floor(position.x / 650)}:${Math.floor(position.y / 650)}:${Math.floor(position.z / 650)}`;
    const key = `${object.material.uuid}::${signature}::${cell}`;
    if (!buckets.has(key)) buckets.set(key, { material: object.material.clone(), geometries: [] });
    buckets.get(key).geometries.push(geometry);
});

const optimized = new THREE.Group();
for (const { material, geometries } of buckets.values()) {
    const merged = mergeGeometries(geometries, false);
    if (merged) optimized.add(new THREE.Mesh(merged, material));
    geometries.forEach((geometry) => geometry.dispose());
}

const box = new THREE.Box3().setFromObject(optimized);
const center = box.getCenter(new THREE.Vector3());
optimized.position.sub(center);
const size = box.getSize(new THREE.Vector3());
const exporter = new GLTFExporter();
const result = await exporter.parseAsync(optimized, { binary: true, onlyVisible: true });
await fs.writeFile(destination, Buffer.from(result));

console.log(JSON.stringify({
    sourceMeshes,
    optimizedMeshes: optimized.children.length,
    dimensions: size.toArray().map((value) => Number(value.toFixed(2))),
    output: destination.pathname,
    bytes: result.byteLength,
}, null, 2));
