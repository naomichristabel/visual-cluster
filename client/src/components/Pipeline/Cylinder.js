// RING EXTRUDED TO FORM CYLINDER - TEXTURE IS ALSO BEING EXTRUDED
import React, { useEffect, useRef } from "react";
import { useLoader } from "react-three-fiber";
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import * as THREE from 'three';
import { PIPE_CONSTANTS } from "../../utils/Contants";

const drawCircle = (centerX,centerY,radius,segments) => {

const shape = new THREE.Shape();

// Calculate the angle increment based on the number of segments
const angleIncrement = (Math.PI * 2) / segments;

// Add points to the shape to approximate the circle
for (let i = 0; i < segments; i++) {
  const angle = i * angleIncrement;
  const x = centerX + radius * Math.cos(angle);
  const y = centerY + radius * Math.sin(angle);
  if (i === 0) {
    shape.moveTo(x, y);
  } else {
    shape.lineTo(x, y);
  }
}
shape.closePath();

return shape;
}

const Cylinder = ({ height }) => {
  const outerShape = drawCircle(0, 0, PIPE_CONSTANTS.pipeOuterRadius, 128);
  const innerShape = drawCircle(0, 0, PIPE_CONSTANTS.pipeInnerRadius, 64);
  outerShape.holes.push(innerShape); // Push inner circle as a hole to the outer circle

  const extrudeSettings = {
    steps: 1,
    depth: height,
    bevelEnabled: false
  };

  const geometry = new THREE.ExtrudeGeometry(outerShape, extrudeSettings);

    const myref = useRef();

    const colorMap = useLoader(TextureLoader, 'textures/Metal041A_1K-PNG_Color.png')

     useEffect(() => {
    // Rotate the cylinder to lie flat on the ground and face the other way
      // myref.current.rotation.x = Math.PI / 2 ; // -90 degrees in radians
      myref.current.rotation.y = Math.PI / 2;
      // myref.current.rotation.z = Math.PI / 2;
   }, []);
   

  return (
    
      <mesh ref={myref}>
        <primitive attach="geometry" object={geometry} />
        <meshStandardMaterial attach="material" transparent opacity={0.5} map={colorMap} />
      </mesh>
    
  );
};

export default Cylinder;

// ----------------------------------------------------------------------

// SOLID CYLINDER
// import React, { useEffect, useRef } from "react";
// import { Canvas, useFrame, useLoader } from "react-three-fiber";
// import { TextureLoader } from 'three/src/loaders/TextureLoader'

// const Cylinder = () => {

//    const myref = useRef();
//    const colorMap = useLoader(TextureLoader, 'textures/Metal022_1K-PNG_Color.png')

//    useEffect(() => {
//     // Rotate the cylinder to lie flat on the ground and face the other way
//       myref.current.rotation.x = Math.PI / 2 ; // -90 degrees in radians
//       myref.current.rotation.z = Math.PI /2;
//    }, []);
   

//    return (
//       <mesh ref={myref}>
//          <cylinderBufferGeometry attach="geometry" args={[5, 5, 40, 32]} />
//          <meshBasicMaterial attach="material" transparent opacity={0.4} map={colorMap} />
//       </mesh>
//    );
// }

// export default Cylinder

// -------------------------------------------------------------------

// TWO CYLINDER GEOMETRIES - FOR A HOLLOW CYLINDER - THIS FLICKERS
// import React from 'react';
// import { Canvas } from 'react-three-fiber';
// import * as THREE from 'three';

// const Cylinder = () => {
//   const outerRadius = 2; // Outer radius of the cylinder
//   const innerRadius = 1; // Inner radius of the cylinder
//   const height = 2; // Height of the cylinder
//   const radialSegments = 64; // Number of radial segments

//   // Create material for outer cylinder
//   const outerMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });

//   // Create material for inner cylinder (black)
//   const innerMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });

//   // Create outer cylinder geometry
//   const outerGeometry = new THREE.CylinderBufferGeometry(outerRadius, outerRadius, height, radialSegments);

//   // Create inner cylinder geometry
//   const innerGeometry = new THREE.CylinderBufferGeometry(innerRadius, innerRadius, height, radialSegments);

//   // Create mesh for outer cylinder
//   const outerMesh = new THREE.Mesh(outerGeometry, outerMaterial);

//   // Create mesh for inner cylinder
//   const innerMesh = new THREE.Mesh(innerGeometry, innerMaterial);

//   // Set position and rotation for inner cylinder
//   innerMesh.position.set(0, 0, 0);
//   innerMesh.rotation.set(Math.PI, 0, 0); // Flip inner cylinder

//   // Create group to hold both cylinder meshes
//   const group = new THREE.Group();
//   group.add(outerMesh);
//   group.add(innerMesh);

//   return (
   
//       <group>
//         <primitive object={group} />
//       </group>
   
//   );
// };

// export default Cylinder;
