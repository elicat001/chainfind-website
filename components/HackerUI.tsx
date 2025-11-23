import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

interface GlitchTextProps {
  text: string;
  as?: any;
  className?: string;
  triggerOnScroll?: boolean;
}

export const GlitchText: React.FC<GlitchTextProps> = ({ text, as: Component = 'div', className = '', triggerOnScroll = false }) => {
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";
    const originalText = text;
    
    // Animation definition
    const scramble = () => {
      let iter = 0;
      gsap.to(el, {
        duration: 1.5,
        onUpdate: () => {
          el.innerText = originalText
            .split("")
            .map((letter, index) => {
              if (index < iter) {
                return originalText[index];
              }
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join("");
          iter += 1 / 2; // Speed of decoding
        }
      });
    };

    if (triggerOnScroll) {
      ScrollTrigger.create({
        trigger: el,
        start: "top 80%",
        onEnter: scramble
      });
    } else {
      scramble();
    }

    return () => {
      // Cleanup scroll triggers if any (handled globally usually, but safe to ignore for simple cases)
    };
  }, [text, triggerOnScroll]);

  return (
    <Component ref={elementRef} className={`font-mono ${className}`}>
      {text}
    </Component>
  );
};

interface CyberButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

export const CyberButton: React.FC<CyberButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
  const btnRef = useRef<HTMLButtonElement>(null);
  
  const handleMouseEnter = () => {
    gsap.to(btnRef.current, { scale: 1.05, duration: 0.2, ease: "power1.out" });
  };
  
  const handleMouseLeave = () => {
    gsap.to(btnRef.current, { scale: 1, duration: 0.2, ease: "power1.out" });
  };

  const baseStyles = "relative px-8 py-3 font-bold font-mono uppercase tracking-wider transition-all duration-300 clip-corner-1 group overflow-hidden";
  const variants = {
    primary: "bg-green-600 text-black hover:bg-green-500 hover:shadow-[0_0_20px_rgba(0,255,0,0.6)]",
    secondary: "bg-transparent border border-green-500/50 text-green-500 hover:bg-green-900/20 hover:border-green-400 hover:text-green-300"
  };

  return (
    <button 
      ref={btnRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`${baseStyles} ${variants[variant]} ${className}`} 
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-white/30 group-hover:border-white transition-colors"></div>
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-white/30 group-hover:border-white transition-colors"></div>
    </button>
  );
};

export const SectionHeader: React.FC<{ title: string; subtitle: string }> = ({ title, subtitle }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    gsap.fromTo(el, 
      { opacity: 0, x: -50 },
      { 
        opacity: 1, 
        x: 0, 
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
        }
      }
    );
  }, []);

  return (
    <div ref={containerRef} className="mb-16 relative inline-block">
       <h2 className="text-4xl md:text-5xl font-tech font-bold text-white mb-2">
         <span className="text-green-600 opacity-50 mr-2">{'>>'}</span>
         <GlitchText text={title} as="span" triggerOnScroll />
       </h2>
       <div className="h-1 w-full bg-gradient-to-r from-green-500 to-transparent mb-2 origin-left scale-x-0 animate-grow-line"></div>
       <p className="text-green-400 font-mono text-sm tracking-[0.2em] uppercase">{subtitle}</p>
    </div>
  );
};

export const BootSequence: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lines, setLines] = React.useState<string[]>([]);
  
  React.useEffect(() => {
    const sequence = [
      "INITIALIZING_CHAIN_CORE...",
      "LOADING_KERNEL_MODULES [OK]",
      "MOUNTING_FILE_SYSTEM [OK]",
      "CONNECTING_TO_SATELLITE_UPLINK...",
      "ESTABLISHING_SECURE_HANDSHAKE...",
      "DECRYPTING_USER_INTERFACE...",
      "ACCESS_GRANTED."
    ];
    
    let delay = 0;
    sequence.forEach((line, index) => {
      delay += Math.random() * 200 + 100;
      setTimeout(() => {
        setLines(prev => [...prev, line]);
        if (index === sequence.length - 1) {
          // Fade out transition
          gsap.to(containerRef.current, {
            opacity: 0,
            duration: 1,
            delay: 0.5,
            onComplete: onComplete
          });
        }
      }, delay);
    });
  }, [onComplete]);

  return (
    <div ref={containerRef} className="fixed inset-0 bg-black z-[100] flex items-center justify-center font-mono text-green-500 p-8">
       <div className="w-full max-w-lg">
          {lines.map((line, i) => (
            <div key={i} className="mb-1">
              <span className="opacity-50 mr-2">
                {new Date().toLocaleTimeString()} :: 
              </span>
              {line}
            </div>
          ))}
          <div className="animate-blink mt-2 inline-block w-3 h-5 bg-green-500"></div>
       </div>
    </div>
  );
};