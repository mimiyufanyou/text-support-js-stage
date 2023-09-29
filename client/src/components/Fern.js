// Fern.js
import React, { useEffect } from 'react';
import * as THREE from 'three';

const Fern = () => {
  useEffect(() => {
    // Initialize Three.js scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // Attach renderer to DOM
    document.getElementById('fern-container').appendChild(renderer.domElement);

    // Initialize geometry and material (add your fern code here)
    // ...
    // Initialize geometry and material
const geometry = new THREE.BufferGeometry();
const vertices = [];
const material = new THREE.PointsMaterial({ size: 0.01, color: 0x00ff00 });

// Barnsley Fern Algorithm
let x = 0, y = 0;
for (let i = 0; i < 50000; i++) {
  const r = Math.random();
  let nextX, nextY;

  if (r < 0.01) {
    nextX = 0;
    nextY = 0.16 * y;
  } else if (r < 0.86) {
    nextX = 0.85 * x + 0.04 * y;
    nextY = -0.04 * x + 0.85 * y + 1.6;
  } else if (r < 0.93) {
    nextX = 0.2 * x - 0.26 * y;
    nextY = 0.23 * x + 0.22 * y + 1.6;
  } else {
    nextX = -0.15 * x + 0.28 * y;
    nextY = 0.26 * x + 0.24 * y + 0.44;
  }

  x = nextX;
  y = nextY;

  // Scale and translate the points so that they fit nicely in the view
  vertices.push(0.25 * x, 0.25 * y, 0);
}

geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

// Initialize points and add to scene
const points = new THREE.Points(geometry, material);
scene.add(points);
    

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();
  }, []);

  return (
    <div id="fern-container" style={{ width: '100%', height: '100%' }}></div>
  );
};

export default Fern;