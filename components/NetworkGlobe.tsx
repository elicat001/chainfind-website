
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const NetworkGlobe: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // --- SCENE SETUP ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    camera.position.z = 18;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // --- GLOBE MESH (Wireframe) ---
    const geometry = new THREE.IcosahedronGeometry(6, 2); // Radius 6, Detail 2
    const material = new THREE.MeshBasicMaterial({
      color: 0x003300,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    });
    const globe = new THREE.Mesh(geometry, material);
    group.add(globe);

    // --- NETWORK POINTS (Nodes) ---
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);

    const getPointOnSphere = (r: number) => {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        return {
            x: r * Math.sin(phi) * Math.cos(theta),
            y: r * Math.sin(phi) * Math.sin(theta),
            z: r * Math.cos(phi)
        };
    };

    const globePoints: THREE.Vector3[] = [];

    for (let i = 0; i < particleCount; i++) {
        const p = getPointOnSphere(6);
        particlePos[i * 3] = p.x;
        particlePos[i * 3 + 1] = p.y;
        particlePos[i * 3 + 2] = p.z;
        globePoints.push(new THREE.Vector3(p.x, p.y, p.z));
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
        color: 0x00ff00,
        size: 0.15,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    group.add(particles);

    // --- CONNECTIONS (Lines) ---
    // Create random connections between nearby points
    const lineMat = new THREE.LineBasicMaterial({
        color: 0x00ff00,
        transparent: true,
        opacity: 0.15,
        blending: THREE.AdditiveBlending
    });
    const lineGeo = new THREE.BufferGeometry();
    const linePositions: number[] = [];

    // Simple distance check to connect nodes
    for (let i = 0; i < globePoints.length; i++) {
        const p1 = globePoints[i];
        // Connect to 2 nearest neighbors
        let connections = 0;
        for (let j = i + 1; j < globePoints.length; j++) {
            if (connections >= 2) break;
            const p2 = globePoints[j];
            const dist = p1.distanceTo(p2);
            if (dist < 2.5) { // Threshold for connection
                linePositions.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
                connections++;
            }
        }
    }
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    const lines = new THREE.LineSegments(lineGeo, lineMat);
    group.add(lines);

    // --- ATMOSPHERE GLOW (Fake Volumetric) ---
    const glowGeo = new THREE.SphereGeometry(6, 32, 32);
    // Custom shader material for glow
    const vertexShader = `
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;
    const fragmentShader = `
      varying vec3 vNormal;
      void main() {
        float intensity = pow(0.6 - dot(vNormal, vec3(0, 0, 1.0)), 4.0);
        gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0) * intensity;
      }
    `;
    
    const glowMat = new THREE.ShaderMaterial({
        uniforms: {},
        vertexShader,
        fragmentShader,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true
    });
    const glowMesh = new THREE.Mesh(glowGeo, glowMat);
    glowMesh.scale.set(1.1, 1.1, 1.1); // Slightly larger
    group.add(glowMesh);


    // --- ANIMATION & INTERACTION ---
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    const handleMouseMove = (e: MouseEvent) => {
        const windowHalfX = window.innerWidth / 2;
        const windowHalfY = window.innerHeight / 2;
        mouseX = (e.clientX - windowHalfX) * 0.0001;
        mouseY = (e.clientY - windowHalfY) * 0.0001;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
        requestAnimationFrame(animate);

        // Constant spin
        group.rotation.y += 0.002;

        // Mouse interaction smoothing
        targetRotationY += (mouseX - targetRotationY) * 0.05;
        targetRotationX += (mouseY - targetRotationX) * 0.05;

        // Apply mouse influence
        group.rotation.y += targetRotationY;
        group.rotation.x += targetRotationX;

        renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
        if (!mountRef.current) return;
        camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', handleResize);
        if (mountRef.current) mountRef.current.removeChild(renderer.domElement);
        geometry.dispose();
        material.dispose();
        particleGeo.dispose();
        particleMat.dispose();
        lineGeo.dispose();
        lineMat.dispose();
        glowGeo.dispose();
        glowMat.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="absolute top-0 left-0 w-full h-full z-0 opacity-80 pointer-events-none mix-blend-screen" 
    />
  );
};

export default NetworkGlobe;
