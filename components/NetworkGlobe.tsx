import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const NetworkGlobe: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // --- SCENE SETUP ---
    const scene = new THREE.Scene();
    // Deep cosmic fog for depth
    scene.fog = new THREE.FogExp2(0x020205, 0.02);

    const camera = new THREE.PerspectiveCamera(45, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 2000);
    camera.position.z = 22;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // --- 1. PARALLEL UNIVERSES (Ghost Globes) ---
    // Dimension Alpha (Cyan Echo)
    const geometryEcho1 = new THREE.IcosahedronGeometry(7, 1);
    const materialEcho1 = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        wireframe: true,
        transparent: true,
        opacity: 0.03,
        blending: THREE.AdditiveBlending,
    });
    const echo1 = new THREE.Mesh(geometryEcho1, materialEcho1);
    mainGroup.add(echo1);

    // Dimension Beta (Purple Echo)
    const geometryEcho2 = new THREE.IcosahedronGeometry(7.8, 1);
    const materialEcho2 = new THREE.MeshBasicMaterial({
        color: 0xff00ff,
        wireframe: true,
        transparent: true,
        opacity: 0.02,
        blending: THREE.AdditiveBlending,
    });
    const echo2 = new THREE.Mesh(geometryEcho2, materialEcho2);
    mainGroup.add(echo2);

    // --- 2. MAIN CORE GLOBE (Green) ---
    const globeGroup = new THREE.Group();
    mainGroup.add(globeGroup);

    const geometry = new THREE.IcosahedronGeometry(6, 2);
    const material = new THREE.MeshBasicMaterial({
      color: 0x003300,
      wireframe: true,
      transparent: true,
      opacity: 0.1,
    });
    const globe = new THREE.Mesh(geometry, material);
    globeGroup.add(globe);

    // --- 3. NETWORK NODES & CONNECTIONS ---
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
    globeGroup.add(particles);

    const lineMat = new THREE.LineBasicMaterial({
        color: 0x00ff00,
        transparent: true,
        opacity: 0.15,
        blending: THREE.AdditiveBlending
    });
    const lineGeo = new THREE.BufferGeometry();
    const linePositions: number[] = [];

    for (let i = 0; i < globePoints.length; i++) {
        const p1 = globePoints[i];
        let connections = 0;
        for (let j = i + 1; j < globePoints.length; j++) {
            if (connections >= 2) break;
            const p2 = globePoints[j];
            const dist = p1.distanceTo(p2);
            if (dist < 2.5) {
                linePositions.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
                connections++;
            }
        }
    }
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    const lines = new THREE.LineSegments(lineGeo, lineMat);
    globeGroup.add(lines);

    // --- 4. ATMOSPHERE GLOW (Cyberpunk) ---
    const glowGeo = new THREE.SphereGeometry(6, 32, 32);
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
    glowMesh.scale.set(1.1, 1.1, 1.1);
    globeGroup.add(glowMesh);


    // --- 5. THE UNIVERSE (Starfield) ---
    const starGeo = new THREE.BufferGeometry();
    const starCount = 1500;
    const starPos = new Float32Array(starCount * 3);
    for(let i=0; i<starCount; i++) {
        // Distribute stars in a sphere from radius 20 to 80
        const r = 20 + Math.random() * 60;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        starPos[i*3] = r * Math.sin(phi) * Math.cos(theta);
        starPos[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
        starPos[i*3+2] = r * Math.cos(phi);
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
        color: 0x8899aa, // Bluish white
        size: 0.1,
        transparent: true,
        opacity: 0.4,
    });
    const starField = new THREE.Points(starGeo, starMat);
    mainGroup.add(starField);


    // --- 6. DIMENSIONAL RINGS ---
    const ringGeo = new THREE.TorusGeometry(14, 0.02, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.15, blending: THREE.AdditiveBlending });
    
    const ring1 = new THREE.Mesh(ringGeo, ringMat);
    ring1.rotation.x = Math.PI / 2;
    mainGroup.add(ring1);

    const ring2 = new THREE.Mesh(ringGeo, ringMat);
    ring2.rotation.y = Math.PI / 2;
    ring2.scale.set(0.8, 0.8, 0.8);
    mainGroup.add(ring2);


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

        // 1. Core Spin
        globeGroup.rotation.y += 0.002;

        // 2. Parallel Universe Spin (Different axes/speeds)
        echo1.rotation.y -= 0.001;
        echo1.rotation.z += 0.0005;

        echo2.rotation.y += 0.0015;
        echo2.rotation.x -= 0.0005;

        // 3. Ring Rotation (Gyroscopic)
        ring1.rotation.z += 0.001;
        ring1.rotation.x += 0.0005;
        
        ring2.rotation.z -= 0.001;
        ring2.rotation.y += 0.0005;

        // 4. Universe Drift
        starField.rotation.y -= 0.0002;

        // 5. Mouse Interaction
        targetRotationY += (mouseX - targetRotationY) * 0.05;
        targetRotationX += (mouseY - targetRotationX) * 0.05;

        mainGroup.rotation.y += targetRotationY;
        mainGroup.rotation.x += targetRotationX;

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
        // Disposables
        [geometry, material, particleGeo, particleMat, lineGeo, lineMat, 
         geometryEcho1, materialEcho1, geometryEcho2, materialEcho2, 
         starGeo, starMat, ringGeo, ringMat, glowGeo, glowMat].forEach(r => r.dispose());
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