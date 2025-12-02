
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

const NetworkBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // --- SETUP ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.0015); // Darker, denser fog for depth

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.z = 120;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // --- ASSET GENERATION ---
    // Generate a soft glow texture programmatically to avoid external asset loading issues
    const getGlowTexture = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const context = canvas.getContext('2d');
        if (context) {
            const gradient = context.createRadialGradient(16, 16, 0, 16, 16, 16);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
            gradient.addColorStop(0.2, 'rgba(0, 255, 100, 0.8)'); // Cyan-Green
            gradient.addColorStop(0.5, 'rgba(0, 50, 0, 0.2)');
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            context.fillStyle = gradient;
            context.fillRect(0, 0, 32, 32);
        }
        const texture = new THREE.CanvasTexture(canvas);
        return texture;
    };
    const particleTexture = getGlowTexture();

    // --- LAYER 1: MORPHING PARTICLE SYSTEM (Background) ---
    const particleCount = 6000; // Increased density
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    // Target positions for shapes
    const shapes: { [key: string]: Float32Array } = {
      cosmos: new Float32Array(particleCount * 3),
      blackHole: new Float32Array(particleCount * 3),
      solar: new Float32Array(particleCount * 3),
      constellation: new Float32Array(particleCount * 3),
    };

    const color = new THREE.Color();

    // GENERATE SHAPES
    
    // 1. COSMOS (Galaxy Cloud)
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const r = Math.random() * 300;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      shapes.cosmos[i3] = r * Math.sin(phi) * Math.cos(theta);
      shapes.cosmos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      shapes.cosmos[i3 + 2] = r * Math.cos(phi);

      // Init positions
      positions[i3] = shapes.cosmos[i3];
      positions[i3 + 1] = shapes.cosmos[i3 + 1];
      positions[i3 + 2] = shapes.cosmos[i3 + 2];

      // Vertex Colors (Green/Cyan/White mix)
      const mixedColor = i % 5 === 0 ? 0xffffff : (i % 2 === 0 ? 0x00ff88 : 0x00aa00);
      color.setHex(mixedColor);
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    // 2. BLACK HOLE (Vortex)
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const armIndex = i % 3; 
      const radius = Math.random() * 150 + 10;
      const spin = radius * 0.2;
      const angle = armIndex * (Math.PI * 2 / 3) + spin; 
      
      shapes.blackHole[i3] = Math.cos(angle) * radius;
      shapes.blackHole[i3 + 1] = (Math.random() - 0.5) * (radius * 0.2); // Flat disc
      shapes.blackHole[i3 + 2] = Math.sin(angle) * radius;

      // Event Horizon (Center density)
      if (i < 500) {
          shapes.blackHole[i3] *= 0.1;
          shapes.blackHole[i3 + 2] *= 0.1;
          shapes.blackHole[i3 + 1] = (Math.random() - 0.5) * 80; // Vertical Jet
      }
    }

    // 3. SOLAR SYSTEM (Orbits)
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      if (i < 500) {
        // Sun
        const r = Math.random() * 15;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        shapes.solar[i3] = r * Math.sin(phi) * Math.cos(theta);
        shapes.solar[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        shapes.solar[i3 + 2] = r * Math.cos(phi);
      } else {
        // Planar Orbits
        const orbitRadius = 30 + Math.random() * 120;
        const angle = Math.random() * Math.PI * 2;
        shapes.solar[i3] = Math.cos(angle) * orbitRadius;
        shapes.solar[i3 + 1] = (Math.random() - 0.5) * 2;
        shapes.solar[i3 + 2] = Math.sin(angle) * orbitRadius;
      }
    }

    // 4. CONSTELLATION (Big Dipper)
    const starPoints = [
        [0, 60, 0], [-20, 30, 0], [-40, 20, 0], [-50, -10, 0], // Bowl
        [-20, -20, 0], [-10, -50, 0], [10, -80, 0] // Handle
    ];
    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        if (i < 2000) {
            // Stars
            const star = starPoints[i % starPoints.length];
            const jitter = 5;
            shapes.constellation[i3] = star[0] + (Math.random() - 0.5) * jitter;
            shapes.constellation[i3 + 1] = star[1] + (Math.random() - 0.5) * jitter;
            shapes.constellation[i3 + 2] = star[2] + (Math.random() - 0.5) * jitter;
        } else {
            // Background field
            shapes.constellation[i3] = (Math.random() - 0.5) * 400;
            shapes.constellation[i3 + 1] = (Math.random() - 0.5) * 400;
            shapes.constellation[i3 + 2] = (Math.random() - 0.5) * 200;
        }
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 1.2,
      map: particleTexture, // Use the generated glow texture
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);


    // --- LAYER 2: INTERACTIVE FOREGROUND NETWORK ---
    // A smaller set of nodes that connect with lines and react to mouse
    const netCount = 80;
    const netGeo = new THREE.BufferGeometry();
    const netPos = new Float32Array(netCount * 3);
    const netVel = []; // Velocities
    
    for(let i=0; i<netCount; i++) {
        netPos[i*3] = (Math.random() - 0.5) * 150;
        netPos[i*3+1] = (Math.random() - 0.5) * 100;
        netPos[i*3+2] = (Math.random() - 0.5) * 50 + 50; // Closer to camera
        netVel.push({
            x: (Math.random() - 0.5) * 0.05,
            y: (Math.random() - 0.5) * 0.05,
            z: (Math.random() - 0.5) * 0.05
        });
    }
    netGeo.setAttribute('position', new THREE.BufferAttribute(netPos, 3));
    const netMat = new THREE.PointsMaterial({
        color: 0x00ff00,
        size: 2,
        map: particleTexture,
        transparent: true,
        opacity: 0.8
    });
    const netPoints = new THREE.Points(netGeo, netMat);
    scene.add(netPoints);

    // Line segments for connections
    const lineMat = new THREE.LineBasicMaterial({
        color: 0x00ff00,
        transparent: true,
        opacity: 0.15,
        blending: THREE.AdditiveBlending
    });
    const lineGeo = new THREE.BufferGeometry();
    const lineMesh = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lineMesh);


    // --- ANIMATION CONTROLLER ---
    const phases = ['cosmos', 'blackHole', 'solar', 'constellation'];
    let currentPhaseIndex = 0;

    const animateShape = (target: string) => {
        const targetPos = shapes[target];
        const currentPos = geometry.attributes.position.array as Float32Array;
        
        // Use a proxy object for GSAP to tween
        const tweenObj = { t: 0 };
        const startPos = new Float32Array(currentPos); // Snapshot start state

        gsap.to(tweenObj, {
            t: 1,
            duration: 3.5,
            ease: "power2.inOut",
            onUpdate: () => {
                for(let i=0; i < particleCount * 3; i++) {
                    // Linear interpolation plus a little noise for organic feel
                    const noise = (Math.random() - 0.5) * 0.2 * (1 - tweenObj.t); 
                    currentPos[i] = startPos[i] + (targetPos[i] - startPos[i]) * tweenObj.t + noise;
                }
                geometry.attributes.position.needsUpdate = true;
            }
        });
    };

    const phaseInterval = setInterval(() => {
        currentPhaseIndex = (currentPhaseIndex + 1) % phases.length;
        animateShape(phases[currentPhaseIndex]);
        
        // Subtle color shift based on phase
        const c = new THREE.Color();
        if(phases[currentPhaseIndex] === 'blackHole') c.setHex(0xffaa00); // Orange tint
        else c.setHex(0x00ff88); // Default Green
        
        gsap.to(color, {
            r: c.r, g: c.g, b: c.b,
            duration: 2,
            onUpdate: () => {
                // Update vertex colors gradually? Expensive. 
                // Better to just update global material color tint
                // But material.color multiplies with vertex colors.
            }
        });

    }, 5000);

    // --- RENDER LOOP ---
    const clock = new THREE.Clock();
    let mouse = new THREE.Vector2(0, 0);

    const onMouseMove = (e: MouseEvent) => {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMouseMove);

    const animate = () => {
        const delta = clock.getDelta();
        const time = clock.getElapsedTime();

        // 1. Rotate Background
        particles.rotation.y = time * 0.05;

        // 2. Update Foreground Network
        const nPos = netGeo.attributes.position.array as Float32Array;
        const linePositions = [];
        
        for(let i=0; i<netCount; i++) {
            // Apply Velocity
            nPos[i*3] += netVel[i].x;
            nPos[i*3+1] += netVel[i].y;
            nPos[i*3+2] += netVel[i].z;

            // Bounce bounds
            if(Math.abs(nPos[i*3]) > 80) netVel[i].x *= -1;
            if(Math.abs(nPos[i*3+1]) > 50) netVel[i].y *= -1;

            // Mouse Repulsion (Fake 2D projection check)
            // This creates the "interactive" feel
            const dx = nPos[i*3] - (mouse.x * 100);
            const dy = nPos[i*3+1] - (mouse.y * 60);
            const dist = Math.sqrt(dx*dx + dy*dy);
            if(dist < 20) {
                nPos[i*3] += dx * 0.05;
                nPos[i*3+1] += dy * 0.05;
            }

            // Check connections for lines
            for(let j=i+1; j<netCount; j++) {
                const dx2 = nPos[i*3] - nPos[j*3];
                const dy2 = nPos[i*3+1] - nPos[j*3+1];
                const dz2 = nPos[i*3+2] - nPos[j*3+2];
                const d2 = Math.sqrt(dx2*dx2 + dy2*dy2 + dz2*dz2);
                
                if(d2 < 25) {
                    linePositions.push(
                        nPos[i*3], nPos[i*3+1], nPos[i*3+2],
                        nPos[j*3], nPos[j*3+1], nPos[j*3+2]
                    );
                }
            }
        }
        netGeo.attributes.position.needsUpdate = true;
        
        // Update Lines
        lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));

        // 3. Parallax Camera
        camera.position.x += (mouse.x * 5 - camera.position.x) * 0.05;
        camera.position.y += (mouse.y * 5 - camera.position.y) * 0.05;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    };

    animate();

    const onResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
        clearInterval(phaseInterval);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('resize', onResize);
        if (mountRef.current) mountRef.current.removeChild(renderer.domElement);
        geometry.dispose();
        material.dispose();
        netGeo.dispose();
        netMat.dispose();
        lineGeo.dispose();
        lineMat.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none"
    />
  );
};

export default NetworkBackground;
