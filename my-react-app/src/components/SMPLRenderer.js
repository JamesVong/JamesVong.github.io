import React, { useRef } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from '@react-three/drei';

function Model() {
  const gltf = useLoader(GLTFLoader, '/path/to/your/model.gltf');
  return <primitive object={gltf.scene} />;
}

const SMPLRenderer = () => (
  <div style={{ height: '500px', width: '100%' }}>
    <Canvas>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Model />
      <OrbitControls />
    </Canvas>
  </div>
);

export default SMPLRenderer;