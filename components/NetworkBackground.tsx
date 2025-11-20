import React, { useEffect, useRef } from 'react';

// Animation Phases
enum Phase {
  COSMOS = 0,
  BLACK_HOLE = 1,
  DNA_HELIX = 2,
  SOLAR_SYSTEM = 3,
  CONSTELLATION = 4
}

const PHASE_DURATION = 5000; // 5 seconds per phase

const NetworkBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    
    // State
    let phaseStartTime = Date.now();
    let currentPhase = Phase.COSMOS;
    let animationFrameId: number;

    // Particle setup
    const particleCount = 600;
    const particles: Particle[] = [];

    // Constellation Data (Big Dipper + Polaris) - Normalized Coordinates (-1 to 1)
    const constellationStars = [
        { x: -0.6, y: -0.2, z: 0 }, // Alkaid
        { x: -0.45, y: -0.1, z: 0 }, // Mizar
        { x: -0.35, y: -0.05, z: 0 }, // Alioth
        { x: -0.2, y: 0.1, z: 0 },   // Megrez
        { x: -0.2, y: 0.25, z: 0 },  // Dubhe
        { x: -0.1, y: 0.1, z: 0 },   // Phecda
        { x: -0.05, y: 0.23, z: 0 }, // Merak
        { x: 0.6, y: 0.4, z: 0 },    // Polaris (North Star)
    ];

    class Particle {
      x: number = 0;
      y: number = 0;
      z: number = 0;
      vx: number = 0;
      vy: number = 0;
      vz: number = 0;
      size: number = 1;
      color: string = '#0f0';
      baseX: number = (Math.random() - 0.5) * 2000;
      baseY: number = (Math.random() - 0.5) * 2000;
      baseZ: number = (Math.random() - 0.5) * 2000;
      offset: number = Math.random() * Math.PI * 2; // For wave functions
      index: number;

      constructor(i: number) {
        this.index = i;
        this.reset();
      }

      reset() {
        this.x = (Math.random() - 0.5) * width * 2;
        this.y = (Math.random() - 0.5) * height * 2;
        this.z = (Math.random() - 0.5) * 1000;
      }

      update(time: number, phase: Phase, progress: number) {
        const speed = 0.05; // Interpolation speed

        let targetX = this.x;
        let targetY = this.y;
        let targetZ = this.z;
        let targetColor = '#00ff00';
        let targetSize = 1.5;

        switch (phase) {
          case Phase.COSMOS:
            // Drift outward
            this.z -= 2;
            if (this.z < -1000) this.z = 1000;
            targetX = this.baseX;
            targetY = this.baseY;
            targetZ = this.z;
            targetColor = '#ffffff';
            break;

          case Phase.BLACK_HOLE:
             // Spiral into center
             const angle = time * 0.001 + this.offset;
             const radius = 200 + (this.index % 20) * 15;
             targetX = Math.cos(angle) * radius;
             targetZ = Math.sin(angle) * radius;
             targetY = (Math.sin(angle * 2) * 50) + (this.index % 100 - 50); // Disc thickness
             
             // Event horizon glow
             if (Math.random() > 0.9) targetColor = '#ff4400';
             else targetColor = '#330000';
             break;

          case Phase.DNA_HELIX:
             // Double Helix
             const strand = this.index % 2;
             const yPos = ((this.index * 2) % height) - height/2;
             const dnaRadius = 150;
             const twist = (yPos * 0.01) + (time * 0.002);
             const strandOffset = strand === 0 ? 0 : Math.PI;
             
             targetX = Math.cos(twist + strandOffset) * dnaRadius;
             targetZ = Math.sin(twist + strandOffset) * dnaRadius;
             targetY = yPos;
             targetColor = strand === 0 ? '#00ff00' : '#00ffff';
             break;

          case Phase.SOLAR_SYSTEM:
             const t = time * 0.001;
             if (this.index === 0) {
                // Sun
                targetX = 0; targetY = 0; targetZ = 0;
                targetSize = 30;
                targetColor = '#ffff00';
             } else if (this.index < 50) {
                // Earth cluster
                const earthOrbit = 300;
                targetX = Math.cos(t) * earthOrbit + (Math.random()-0.5)*20;
                targetZ = Math.sin(t) * earthOrbit + (Math.random()-0.5)*20;
                targetY = (Math.random()-0.5)*20;
                targetColor = '#0000ff';
                targetSize = 3;
             } else if (this.index < 70) {
                // Moon cluster
                const earthOrbit = 300;
                const earthX = Math.cos(t) * earthOrbit;
                const earthZ = Math.sin(t) * earthOrbit;
                const moonOrbit = 60;
                const mt = t * 3; // Moon moves faster
                targetX = earthX + Math.cos(mt) * moonOrbit;
                targetZ = earthZ + Math.sin(mt) * moonOrbit;
                targetY = 0;
                targetColor = '#aaaaaa';
             } else {
                // Distant stars
                targetX = this.baseX * 2;
                targetY = this.baseY * 2;
                targetZ = -1000;
                targetColor = '#ffffff';
             }
             break;

          case Phase.CONSTELLATION:
             if (this.index < constellationStars.length) {
                // Form the constellation
                const star = constellationStars[this.index];
                const scale = 300;
                targetX = star.x * scale;
                targetY = star.y * scale; // Flip Y for canvas
                targetZ = 0;
                targetSize = this.index === 7 ? 6 : 4; // Polaris bigger
                targetColor = '#ffffff';
             } else {
                // Background noise
                targetX = this.baseX + Math.sin(time*0.0001 + this.index)*100;
                targetY = this.baseY + Math.cos(time*0.0001 + this.index)*100;
                targetZ = this.baseZ;
                targetColor = 'rgba(0, 255, 0, 0.1)';
             }
             break;
        }

        // Lerp towards target (Smooth transition)
        this.x += (targetX - this.x) * speed;
        this.y += (targetY - this.y) * speed;
        this.z += (targetZ - this.z) * speed;
        this.color = targetColor;
        this.size += (targetSize - this.size) * speed;
      }

      draw(ctx: CanvasRenderingContext2D) {
        // 3D Projection
        const fov = 300;
        const scale = fov / (fov + this.z + 1000); // Simple projection
        const x2d = this.x * scale + width / 2;
        const y2d = this.y * scale + height / 2;

        if (scale > 0 && x2d > 0 && x2d < width && y2d > 0 && y2d < height) {
          ctx.fillStyle = this.color;
          ctx.beginPath();
          ctx.arc(x2d, y2d, this.size * scale, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle(i));
    }

    const animate = () => {
      const now = Date.now();
      const timeSincePhaseStart = now - phaseStartTime;

      // Check for phase change
      if (timeSincePhaseStart > PHASE_DURATION) {
        currentPhase = (currentPhase + 1) % 5;
        phaseStartTime = now;
      }

      const progress = Math.min(timeSincePhaseStart / 2000, 1); // 2s transition clamp

      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'; // Trails
      ctx.fillRect(0, 0, width, height);

      // Draw phase name (HUD)
      ctx.font = '12px monospace';
      ctx.fillStyle = '#00ff00';
      ctx.fillText(`VISUAL_SYS: ${Phase[currentPhase]}`, 20, 30);
      ctx.fillText(`TIME_VAL: ${(timeSincePhaseStart/1000).toFixed(2)}s`, 20, 50);

      // Connect stars in Constellation phase
      if (currentPhase === Phase.CONSTELLATION) {
          const fov = 300;
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(255,255,255,0.2)';
          for(let i=0; i<constellationStars.length - 2; i++) {
              // A very simplified linking for demo (0-1-2-3-4-5-6) Big Dipper
              const p1 = particles[i];
              const p2 = particles[i+1];
              
              const s1 = fov / (fov + p1.z + 1000);
              const s2 = fov / (fov + p2.z + 1000);
              
              ctx.moveTo(p1.x * s1 + width/2, p1.y * s1 + height/2);
              ctx.lineTo(p2.x * s2 + width/2, p2.y * s2 + height/2);
          }
          // Connect pointers to Polaris (Merak/Dubhe -> Polaris) - simplified visual
          const dubhe = particles[4];
          const polaris = particles[7];
          const s1 = fov / (fov + dubhe.z + 1000);
          const s2 = fov / (fov + polaris.z + 1000);
          ctx.moveTo(dubhe.x * s1 + width/2, dubhe.y * s1 + height/2);
          ctx.lineTo(polaris.x * s2 + width/2, polaris.y * s2 + height/2);
          ctx.stroke();
      }

      // Update and draw all particles
      particles.forEach(p => {
        p.update(now, currentPhase, progress);
        p.draw(ctx);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    handleResize();
    animate();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
    />
  );
};

export default NetworkBackground;