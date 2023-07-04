import logo from "./logo.svg";
import "./App.css";
import { useRef, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Model } from "./Gallery";
import { Environment, PresentationControls } from "@react-three/drei";
import { useControls } from "leva";
import Character from "./Character";

function App() {
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
          <Model position={[-9, -1, -1]} />
          <Character />
        </Suspense>

        <Environment preset='apartment' />
      </Canvas>
    </div>
  );
}

export default App;
