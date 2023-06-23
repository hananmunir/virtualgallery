import logo from "./logo.svg";
import "./App.css";
import { useRef, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { suspend } from "suspend-react";
import { Model } from "./Gallery";
import {
  useGLTF,
  useCursor,
  useTexture,
  Text,
  Decal,
  Environment,
  OrbitControls,
  RenderTexture,
  RandomizedLight,
  PerspectiveCamera,
  AccumulativeShadows,
  Html,
  Sky,
  PresentationControls,
} from "@react-three/drei";
import { useControls } from "leva";
import * as THREE from "three";

function App() {
  const { position } = useControls({
    position: { value: [-9, -1, -1], step: 1 },
  });
  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        backgroundColor: "#000",
      }}
    >
      <Canvas
        shadows
        camera={{ fov: 75, near: 0.1, far: 1000, position: [0, 0, 5] }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight castShadow intensity={0.5} position={[47, 45, 100]} />
        <pointLight position={position} />
        <Suspense>
          <PresentationControls polar={[0, 0]}>
            <Model position={position} />
          </PresentationControls>
        </Suspense>

        <Environment preset='apartment' />
      </Canvas>
    </div>
  );
}

export default App;
