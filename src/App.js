import logo from "./logo.svg";
import "./App.css";
import { Debug, useContactMaterial } from "@react-three/cannon";
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
  PointerLockControls,
} from "@react-three/drei";
import { useControls } from "leva";
import * as THREE from "three";
import Character from "./Character";

function App() {
  const { position, rotation } = useControls({
    position: { value: [0, 115, 199], step: 1 },
    rotation: { value: [0, 0, 0], step: 0.1 },
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
        camera={{ fov: 40, near: 0.1, far: 10000, position: [0, 0, 5] }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight castShadow intensity={0.5} position={[47, 45, 100]} />

        <Suspense>
          <PresentationControls
            enabled={false}
            polar={[0, 0]}
          ></PresentationControls>

          {/* <Floor rotation={[-Math.PI / 2, 0, 0]} material={"ground"} /> */}
          <Model position={[-9, -1, -1]} />
          <Character position={position} rotation={rotation} />
        </Suspense>

        <Environment preset='apartment' />
      </Canvas>
    </div>
  );
}

export default App;
