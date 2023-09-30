import React, { useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const My3DModel = () => {
  useEffect(() => {
    // Initialize Three.js scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    
    // Set background color to beige
    scene.background = new THREE.Color(0xF5F5DC);

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('three-container').appendChild(renderer.domElement);

    // Initialize GLTFLoader
    const loader = new GLTFLoader();

    // Load the .glb model
    loader.load(
      '/models/monstera.glb',  // Update the path based on your file's location
      (gltf) => {
        gltf.scene.scale.set(10, 10, 10); // Scale it up by 10 times in all dimensions
        scene.add(gltf.scene);
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
      },
      (error) => {
        console.log('An error happened:', error);
      }
    );

    // Position camera
    camera.position.z = 5;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();
  }, []);

  return (
    <div id="three-container" style={{ width: '100%', height: '100%' }}></div>
  );
};

export default My3DModel;