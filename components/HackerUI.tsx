import React from 'react';

interface GlitchTextProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'span' | 'div';
  className?: string;
}

export const GlitchText: React.FC<GlitchTextProps> = ({ text, as: Component = 'div', className = '' }) => {
  return (
    <Component className={`glitch-wrapper relative inline-block ${className}`} data-text={text}>
      {text}
    </Component>
  );
};

interface CyberButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

export const CyberButton: React.FC<CyberButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyles = "relative px-8 py-3 font-bold font-mono uppercase tracking-wider transition-all duration-300 clip-corner-1 group overflow-hidden";
  const variants = {
    primary: "bg-green-600 text-black hover:bg-green-500 hover:shadow-[0_0_20px_rgba(0,255,0,0.6)]",
    secondary: "bg-transparent border border-green-500/50 text-green-500 hover:bg-green-900/20 hover:border-green-400 hover:text-green-300"
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-white/30 group-hover:border-white transition-colors"></div>
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-white/30 group-hover:border-white transition-colors"></div>
    </button>
  );
};

export const SectionHeader: React.FC<{ title: string; subtitle: string }> = ({ title, subtitle }) => (
  <div className="mb-16 relative inline-block">
     <h2 className="text-4xl md:text-5xl font-tech font-bold text-white mb-2">
       <span className="text-green-600 opacity-50 mr-2">{'>>'}</span>
       <GlitchText text={title} as="span" />
     </h2>
     <div className="h-1 w-full bg-gradient-to-r from-green-500 to-transparent mb-2"></div>
     <p className="text-green-400 font-mono text-sm tracking-[0.2em] uppercase">{subtitle}</p>
  </div>
);

export const BootSequence: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
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
      delay += Math.random() * 300 + 200;
      setTimeout(() => {
        setLines(prev => [...prev, line]);
        if (index === sequence.length - 1) {
          setTimeout(onComplete, 800);
        }
      }, delay);
    });
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black z-[100] flex items-center justify-center font-mono text-green-500 p-8">
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
