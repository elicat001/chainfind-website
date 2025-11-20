
import React, { useState, useEffect } from 'react';
    import { Terminal, Cpu, Wifi, Battery, Activity } from 'lucide-react';
    
    const Navbar: React.FC = () => {
      const [time, setTime] = useState(new Date().toLocaleTimeString());
      const [scrolled, setScrolled] = useState(false);
      const [memory, setMemory] = useState(32);
    
      useEffect(() => {
        const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
        const memTimer = setInterval(() => setMemory(Math.floor(Math.random() * (64 - 30 + 1) + 30)), 2000);
        
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        
        return () => {
          clearInterval(timer);
          clearInterval(memTimer);
          window.removeEventListener('scroll', handleScroll);
        };
      }, []);
    
      const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      };
    
      return (
        <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b ${
          scrolled ? 'bg-black/90 border-green-500/50 py-2' : 'bg-transparent border-transparent py-4'
        }`}>
          <div className="container mx-auto px-4 flex justify-between items-center">
            {/* Left HUD */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-green-500 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <div className="p-1 border border-green-500 group-hover:bg-green-500 group-hover:text-black transition-colors">
                   <Terminal size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="font-tech text-xl tracking-[0.2em] font-bold text-glow leading-none">CHAINFIND</span>
                  <span className="text-[10px] opacity-70 tracking-widest">SYS.SECURE.V2</span>
                </div>
              </div>
              
              <div className="hidden lg:flex items-center gap-2 text-[10px] text-green-500/60 border-l border-green-500/30 pl-4">
                 <div className="flex flex-col">
                    <span>IP: 192.168.X.X</span>
                    <span>PORT: 443 [OPEN]</span>
                 </div>
              </div>
            </div>
            
            {/* Center Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {['SERVICES', 'ABOUT', 'BLOG', 'SYSTEM_ACCESS', 'CONTACT'].map((item) => (
                <button 
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className="relative px-4 py-2 text-xs font-mono font-bold text-green-500/80 hover:text-green-400 transition-all group overflow-hidden"
                >
                  <span className="relative z-10 group-hover:text-glow">
                    {`[ ${item} ]`}
                  </span>
                  <div className="absolute inset-0 bg-green-500/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-200 clip-corner-1"></div>
                </button>
              ))}
            </div>
    
            {/* Right HUD */}
            <div className="flex items-center gap-4 text-green-500 font-mono text-xs">
               <div className="hidden sm:flex flex-col items-end">
                  <span className="flex items-center gap-2">
                    MEM: {memory}% <Cpu size={10} />
                  </span>
                  <span className="flex items-center gap-2">
                    NET: ONLINE <Wifi size={10} className="animate-pulse"/>
                  </span>
               </div>
               <div className="bg-green-900/20 border border-green-500/30 px-3 py-1 rounded clip-corner-1">
                 {time}
               </div>
            </div>
          </div>
          
          {/* HUD Decor Lines */}
          <div className="absolute bottom-0 left-0 w-4 h-[1px] bg-green-500"></div>
          <div className="absolute bottom-0 right-0 w-4 h-[1px] bg-green-500"></div>
        </nav>
      );
    };
    
    export default Navbar;
