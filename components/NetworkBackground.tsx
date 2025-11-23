import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

const NetworkBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // --- SCENE SETUP ---
    const scene = new THREE.Scene();
    // Dark fog for depth
    scene.fog = new THREE.FogExp2(0x000000, 0.001);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.z = 100;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // --- PARTICLE SYSTEM CONFIG ---
    const particleCount = 2500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    
    // We will store target positions for different shapes here
    const shapes: { [key: string]: Float32Array } = {
      cosmos: new Float32Array(particleCount * 3),
      blackHole: new Float32Array(particleCount * 3),
      dna: new Float32Array(particleCount * 3),
      solar: new Float32Array(particleCount * 3),
      constellation: new Float32Array(particleCount * 3),
    };

    // --- GENERATE SHAPES ---
    
    // 1. COSMOS (Random Cloud)
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const r = 400;
      shapes.cosmos[i3] = (Math.random() - 0.5) * r * 2;
      shapes.cosmos[i3 + 1] = (Math.random() - 0.5) * r * 2;
      shapes.cosmos[i3 + 2] = (Math.random() - 0.5) * r * 2;
      
      // Initialize current positions
      positions[i3] = shapes.cosmos[i3];
      positions[i3 + 1] = shapes.cosmos[i3 + 1];
      positions[i3 + 2] = shapes.cosmos[i3 + 2];
    }

    // 2. BLACK HOLE (Spiral Disc + Jet)
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const angle = i * 0.1;
      const radius = 10 + Math.random() * 150;
      // Spiral
      shapes.blackHole[i3] = Math.cos(angle) * radius; // X
      shapes.blackHole[i3 + 2] = Math.sin(angle) * radius; // Z (flat plane)
      // Accretion disk thickness or Jet
      if (i % 10 === 0) {
         // Vertical Jet
         shapes.blackHole[i3] = (Math.random() - 0.5) * 5;
         shapes.blackHole[i3 + 2] = (Math.random() - 0.5) * 5;
         shapes.blackHole[i3 + 1] = (Math.random() - 0.5) * 300; // Height
      } else {
         shapes.blackHole[i3 + 1] = (Math.random() - 0.5) * 10; // Flat disk
      }
    }

    // 3. DNA HELIX
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const strand = i % 2 === 0 ? 1 : -1;
      const t = (i / particleCount) * 20; // Length
      const radius = 30;
      
      shapes.dna[i3] = Math.cos(t * 2) * radius * strand; // X
      shapes.dna[i3 + 1] = (i / particleCount) * 200 - 100; // Y (Height)
      shapes.dna[i3 + 2] = Math.sin(t * 2) * radius * strand; // Z
    }

    // 4. SOLAR SYSTEM (Concentri Circles)
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      // Sun in center
      if (i < 200) {
        shapes.solar[i3] = (Math.random() - 0.5) * 20;
        shapes.solar[i3 + 1] = (Math.random() - 0.5) * 20;
        shapes.solar[i3 + 2] = (Math.random() - 0.5) * 20;
      } else {
        // Planets/Orbits
        const orbit = 40 + Math.random() * 200;
        const angle = Math.random() * Math.PI * 2;
        shapes.solar[i3] = Math.cos(angle) * orbit;
        shapes.solar[i3 + 1] = (Math.random() - 0.5) * 2; // Flat plane
        shapes.solar[i3 + 2] = Math.sin(angle) * orbit;
      }
    }

    // 5. CONSTELLATION (Big Dipper + Polaris approximate)
    const starPoints = [
      [0, 80, 0], // Polaris
      [-30, 40, 0], // Pointer 1
      [-60, 30, 0], // Pointer 2
      [-70, 0, 0], // Bowl 1
      [-40, -10, 0], // Bowl 2
      [-30, -40, 0], // Handle 1
      [-20, -70, 0], // Handle 2
      [-80, -90, 0], // Handle 3
    ];
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      // Main stars get more density
      if (i < 800) {
        const starIdx = i % starPoints.length;
        const star = starPoints[starIdx];
        // Jitter around star point
        shapes.constellation[i3] = star[0] + (Math.random() - 0.5) * 10;
        shapes.constellation[i3 + 1] = star[1] + (Math.random() - 0.5) * 10;
        shapes.constellation[i3 + 2] = star[2] + (Math.random() - 0.5) * 10;
      } else {
        // Background stars
        shapes.constellation[i3] = (Math.random() - 0.5) * 500;
        shapes.constellation[i3 + 1] = (Math.random() - 0.5) * 500;
        shapes.constellation[i3 + 2] = (Math.random() - 0.5) * 200 - 100;
      }
    }

    // Set attributes
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    // Material
    const material = new THREE.PointsMaterial({
      size: 1.5,
      color: 0x00ff00,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // --- ANIMATION LOGIC ---
    const phases = ['cosmos', 'blackHole', 'dna', 'solar', 'constellation'];
    let currentPhaseIndex = 0;

    const animateToShape = (shapeName: string) => {
      const targetPositions = shapes[shapeName];
      const currentPositions = geometry.attributes.position.array as Float32Array;

      // We tween a proxy object, and update the geometry in the onUpdate callback
      const dummy = { val: 0 };
      
      // Store start positions to interpolate from
      const startPositions = new Float32Array(currentPositions);

      gsap.to(dummy, {
        val: 1,
        duration: 2.5, // Transition time
        ease: "power2.inOut",
        onUpdate: () => {
          for (let i = 0; i < particleCount * 3; i++) {
            currentPositions[i] = startPositions[i] + (targetPositions[i] - startPositions[i]) * dummy.val;
          }
          geometry.attributes.position.needsUpdate = true;
        }
      });

      // Update Phase Text via Custom Event or simple DOM manipulation if needed
      // (Handled by component state below if we wanted to sync text)
    };

    // Cycle every 5 seconds
    const interval = setInterval(() => {
      currentPhaseIndex = (currentPhaseIndex + 1) % phases.length;
      animateToShape(phases[currentPhaseIndex]);
      
      // Color shifts
      let targetColor = new THREE.Color(0x00ff00);
      if (phases[currentPhaseIndex] === 'blackHole') targetColor.setHex(0xff4400);
      if (phases[currentPhaseIndex] === 'solar') targetColor.setHex(0xffff00);
      if (phases[currentPhaseIndex] === 'dna') targetColor.setHex(0x00ffff);
      if (phases[currentPhaseIndex] === 'cosmos') targetColor.setHex(0xffffff);

      gsap.to(material.color, {
        r: targetColor.r,
        g: targetColor.g,
        b: targetColor.b,
        duration: 2
      });

    }, 5000);


    // --- RENDER LOOP ---
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX - window.innerWidth / 2) * 0.05;
      mouseY = (e.clientY - window.innerHeight / 2) * 0.05;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      requestAnimationFrame(animate);

      // Gentle rotation
      particles.rotation.y += 0.001;
      particles.rotation.x += 0.0005;

      // Mouse parallax
      camera.position.x += (mouseX - camera.position.x) * 0.05;
      camera.position.y += (-mouseY - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      clearInterval(interval);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none"
      aria-hidden="true"
    />
  );
};

export default NetworkBackground;