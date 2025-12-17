import React, { useEffect, useRef } from 'react';

const HackerCursor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const positionRef = useRef({ x: 0, y: 0 });
  const trailRef = useRef<{x: number, y: number, char: string, life: number, color: string}[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateSize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    updateSize();
    window.addEventListener('resize', updateSize);

    const onMouseMove = (e: MouseEvent) => {
        positionRef.current = { x: e.clientX, y: e.clientY };
        
        // Spawn particles less frequently to avoid clutter
        if (Math.random() > 0.3) {
            const chars = "01";
            trailRef.current.push({
                x: e.clientX,
                y: e.clientY,
                char: chars[Math.floor(Math.random() * chars.length)],
                life: 1.0,
                color: Math.random() > 0.9 ? '#fff' : '#0f0' // Occasional white spark
            });
        }
    };
    window.addEventListener('mousemove', onMouseMove);

    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const { x, y } = positionRef.current;
        
        // Draw Crosshair
        ctx.beginPath();
        ctx.strokeStyle = '#0f0';
        ctx.lineWidth = 1;
        
        // Horizontal line
        ctx.moveTo(x - 15, y);
        ctx.lineTo(x + 15, y);
        
        // Vertical line
        ctx.moveTo(x, y - 15);
        ctx.lineTo(x, y + 15);
        ctx.stroke();

        // Draw Circle around cursor
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.stroke();
        
        // Update and Draw Trail
        ctx.font = '10px monospace';
        for (let i = trailRef.current.length - 1; i >= 0; i--) {
            const p = trailRef.current[i];
            
            ctx.globalAlpha = p.life;
            ctx.fillStyle = p.color;
            ctx.fillText(p.char, p.x + 12, p.y + 12); // Offset from cursor
            ctx.globalAlpha = 1;

            p.life -= 0.03;
            p.y += 0.5; // Gravity
            
            if (p.life <= 0) {
                trailRef.current.splice(i, 1);
            }
        }
        
        requestAnimationFrame(animate);
    };
    const animId = requestAnimationFrame(animate);

    return () => {
        window.removeEventListener('resize', updateSize);
        window.removeEventListener('mousemove', onMouseMove);
        cancelAnimationFrame(animId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-[9999] pointer-events-none mix-blend-screen" />;
};

export default HackerCursor;