import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "react-three-fiber";
import {
  softShadows,
  MeshWobbleMaterial,
  OrbitControls,
} from "@react-three/drei";

import { useSpring, a } from "@react-spring/three";

import normalRain from "./normal-rain.mp3";

import "./App.scss";

softShadows();

const normalRainInstance = new Audio(normalRain);

const SpinningMesh = ({ position, meshRef, args, color, speed }) => {
  const [expand, setExpand] = useState(false);

  useEffect(() => {
    // normalRainInstance.loop = true;
    expand ? normalRainInstance.play() : normalRainInstance.pause();
  }, [expand]);

  useFrame(() => {
    meshRef.current.rotation.x = meshRef.current.rotation.y += 0.005;
  });

  const props = useSpring({
    scale: expand ? [1.4, 1.4, 1.4] : [1, 1, 1],
  });

  return (
    <a.mesh
      onClick={() => setExpand(!expand)}
      scale={props.scale}
      castShadow
      position={position}
      ref={meshRef}
    >
      <boxGeometry args={args} />
      <MeshWobbleMaterial color={color} speed={speed} factor={0.6} />
    </a.mesh>
  );
};

function App() {
  const leftMesh = useRef(null);
  const centerMesh = useRef(null);
  const rightMesh = useRef(null);

  return (
    <>
      <Canvas shadows camera={{ position: [-5, 2, 10], fov: 60 }}>
        <OrbitControls />
        <ambientLight intensity={0.3} />
        <directionalLight
          castShadow
          position={[0, 10, 0]}
          intensity={1.5}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        <pointLight position={[-10, 0, -20]} intensity={0.5} />
        <pointLight position={[0, -10, 0]} intensity={1.5} />

        <SpinningMesh
          position={[0, 1, 0]}
          meshRef={centerMesh}
          args={[3, 2, 1]}
          color="lightblue"
          speed={2}
        />
        <SpinningMesh
          position={[-2, 1, -5]}
          meshRef={leftMesh}
          color="pink"
          speed={6}
        />
        <SpinningMesh
          position={[5, 1, -2]}
          meshRef={rightMesh}
          color="pink"
          speed={6}
        />

        <group>
          <mesh
            receiveShadow
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -3, 0]}
          >
            <planeGeometry args={[100, 100]} />
            {/* <meshStandardMaterial color="yellow" /> */}
            <shadowMaterial opacity={0.3} />
          </mesh>
        </group>
      </Canvas>
    </>
  );
}

export default App;
