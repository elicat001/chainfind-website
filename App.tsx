
import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from './components/Navbar';
import TerminalChat from './components/TerminalChat';
import MatrixRain from './components/MatrixRain';
import NetworkBackground from './components/NetworkBackground';
import NetworkGlobe from './components/NetworkGlobe';
import BlogSection from './components/BlogSection';
import ProductShowcase from './components/ProductShowcase';
import { GlitchText, CyberButton, SectionHeader, BootSequence } from './components/HackerUI';
import { StructuredData } from './components/StructuredData';
import { ShieldCheck, Bot, Link, Layers, Code, Server, ChevronDown, Hexagon, Lock, Activity, Database } from 'lucide-react';

// Register Plugin
gsap.registerPlugin(ScrollTrigger);

const App: React.FC = () => {
  const [booting, setBooting] = useState(true);
  const [mounted, setMounted] = useState(false);
  
  // Refs for ScrollTriggers
  const heroRef = useRef<HTMLElement>(null);
  const servicesRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const systemAccessRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize Scroll Animations after boot
  useEffect(() => {
    if (!booting && mounted) {
        const sections = [servicesRef.current, aboutRef.current, systemAccessRef.current];
        
        sections.forEach(sec => {
            if (sec) {
                gsap.fromTo(sec, 
                    { opacity: 0, y: 100 },
                    { 
                        opacity: 1, 
                        y: 0, 
                        duration: 1, 
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: sec,
                            start: "top 90%",
                        }
                    }
                );
            }
        });
    }
  }, [booting, mounted]);

  if (!mounted) return null;

  if (booting) {
    return <BootSequence onComplete={() => setBooting(false)} />;
  }

  return (
    <div className="min-h-screen bg-dark-bg text-green-400 font-mono selection:bg-green-500 selection:text-black relative overflow-hidden">
      <StructuredData />
      <MatrixRain />
      <Navbar />

      <main className="relative z-10">
        
        {/* HERO SECTION */}
        <section ref={heroRef} id="hero" className="min-h-screen flex flex-col justify-center items-center text-center relative px-4 overflow-hidden">
          {/* Global Background still exists, but we add the Globe specifically to Hero */}
          <NetworkBackground />
          <NetworkGlobe />
          
          <div className="relative z-20 max-w-5xl mx-auto">
            <div className="mb-6 flex justify-center">
               <div className="px-4 py-1 border border-green-500/30 bg-black/50 backdrop-blur text-xs tracking-[0.3em] animate-pulse-fast flex items-center gap-2 clip-corner-1">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  SYSTEM_STATUS: OPTIMIZED
               </div>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold font-tech mb-6 text-white tracking-tighter leading-none">
              <GlitchText text="CHAINFIND" />
            </h1>
            
            <p className="text-xl md:text-2xl text-green-400 font-mono mb-2 tracking-widest">
              <span className="opacity-50">&lt;</span> SECURITY / AI / WEB3 <span className="opacity-50">/&gt;</span>
            </p>
            <p className="max-w-2xl mx-auto text-gray-400 mb-12 text-sm md:text-base border-l-2 border-green-500/30 pl-4 text-left">
              "We engineer the future. From <strong>AI Agents</strong> and <strong>Blockchain Protocols</strong> to elite <strong>Cybersecurity</strong>. We build the invisible walls that protect your data and the intelligent engines that power your growth."
            </p>

            <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
              <CyberButton 
                variant="primary"
                onClick={() => document.getElementById('system_access')?.scrollIntoView({behavior: 'smooth'})}
                aria-label="Initialize Core System"
              >
                INITIALIZE_CORE
              </CyberButton>
              <CyberButton 
                variant="secondary"
                onClick={() => document.getElementById('products')?.scrollIntoView({behavior: 'smooth'})}
                aria-label="Browse Services"
              >
                BROWSE_ARSENAL
              </CyberButton>
            </div>
          </div>
          
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-green-500/50 cursor-pointer"
               onClick={() => document.getElementById('services')?.scrollIntoView({behavior: 'smooth'})}
               aria-label="Scroll Down"
          >
             <ChevronDown size={32} />
          </div>

          {/* Decorative Corner Elements */}
          <div className="absolute top-32 left-10 w-32 h-32 border-l-2 border-t-2 border-green-500/20 hidden md:block"></div>
          <div className="absolute bottom-20 right-10 w-32 h-32 border-r-2 border-b-2 border-green-500/20 hidden md:block"></div>
        </section>

        {/* SERVICES SECTION */}
        <section ref={servicesRef} id="services" className="py-32 relative">
           <div className="container mx-auto px-4 text-center mb-16">
              <SectionHeader title="ACTIVE_PROTOCOLS" subtitle="CORE SERVICES" />
           </div>

          <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8">
             {[
               { 
                 title: 'CYBER_DEFENSE', 
                 icon: <ShieldCheck size={48} />,
                 desc: 'Advanced penetration testing, real-time intrusion detection, and zero-trust architecture implementation for enterprise security.',
                 code: '0x1A4F...SECURE'
               },
               { 
                 title: 'AI_ARCHITECT', 
                 icon: <Bot size={48} />,
                 desc: 'Development of custom AI tools, LLM integration, and autonomous agents designed to automate complex workflows.',
                 code: 'MODEL.TRAIN()'
               },
               { 
                 title: 'BLOCKCHAIN_CORE', 
                 icon: <Link size={48} />,
                 desc: 'Smart contract development, private chain deployment, and consensus algorithm implementation for secure ledgers.',
                 code: 'BLOCK_HEIGHT++'
               },
               { 
                 title: 'WEB3_NEXUS', 
                 icon: <Layers size={48} />,
                 desc: 'Building the decentralized web. dApps, DeFi protocols, and wallet integration for the next generation of the internet.',
                 code: 'WEB3.CONNECT()'
               },
               { 
                 title: 'SOFTWARE_FORGE', 
                 icon: <Code size={48} />,
                 desc: 'Bespoke software solutions engineered for speed and scalability. Full-stack development with modern frameworks.',
                 code: 'git commit -m "feat"'
               },
               { 
                 title: 'NET_INFRASTRUCTURE', 
                 icon: <Server size={48} />,
                 desc: 'Cloud migration, decentralized storage meshes, and high-availability server management for global scaling.',
                 code: 'PING 127.0.0.1'
               },
             ].map((service, idx) => (
               <article key={idx} className="group relative bg-black border border-green-900 p-8 transition-all duration-300 hover:border-green-500 hover:-translate-y-2 overflow-hidden">
                 {/* Hover Background Effect */}
                 <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-0 group-hover:opacity-10 transition-opacity"></div>
                 
                 <div className="relative z-10">
                   <div className="mb-6 text-green-600 group-hover:text-green-400 group-hover:drop-shadow-[0_0_10px_rgba(0,255,0,0.5)] transition-all duration-300">
                     {service.icon}
                   </div>
                   <h3 className="text-2xl font-tech font-bold text-white mb-4 group-hover:text-green-300">{service.title}</h3>
                   <p className="text-gray-500 group-hover:text-gray-300 mb-6 leading-relaxed text-sm">
                     {service.desc}
                   </p>
                   <div className="border-t border-green-900 pt-4 flex justify-between items-center text-xs font-mono text-green-700 group-hover:text-green-500">
                     <span>STATUS: ACTIVE</span>
                     <code>{service.code}</code>
                   </div>
                 </div>
                 
                 {/* Corner Accents */}
                 <div className="absolute top-0 right-0 w-0 h-0 border-t-[20px] border-r-[20px] border-t-transparent border-r-green-900 group-hover:border-r-green-500 transition-colors"></div>
               </article>
             ))}
          </div>
        </section>

        {/* PRODUCT SHOWCASE SECTION */}
        <ProductShowcase />

        {/* ABOUT SECTION */}
        <section ref={aboutRef} id="about" className="py-32 relative bg-black/80 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                 <SectionHeader title="IDENTITY_MATRIX" subtitle="ABOUT CHAINFIND" />
                 
                 <div className="bg-gray-900/50 p-6 border-l-4 border-green-500 clip-corner-2 relative group">
                   <div className="absolute -inset-1 bg-green-500/10 blur transition-opacity opacity-0 group-hover:opacity-100"></div>
                   <p className="text-gray-300 leading-relaxed font-mono relative z-10">
                     <strong>Chainfind</strong> is an elite collective of technologists operating at the intersection of <strong>Artificial Intelligence</strong>, <strong>Blockchain</strong>, and <strong>Network Security</strong>. We don't just build software; we architect decentralized ecosystems and intelligent agents that operate securely in the shadows of the digital infrastructure.
                   </p>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: "AI MODELS", val: "TRAINED" },
                      { label: "BLOCKS", val: "VERIFIED" },
                      { label: "LATENCY", val: "<12ms" },
                      { label: "THREATS", val: "NEUTRALIZED" }
                    ].map((stat, i) => (
                      <div key={i} className="border border-green-500/20 p-4 bg-black/40 hover:bg-green-900/20 transition-colors">
                        <div className="text-xs text-gray-500 mb-1">{stat.label}</div>
                        <div className="text-xl text-green-400 font-bold font-tech">{stat.val}</div>
                      </div>
                    ))}
                 </div>
              </div>
              
              <div className="relative">
                 <div className="absolute inset-0 bg-green-500/20 blur-3xl rounded-full opacity-20"></div>
                 <div className="border border-green-500/30 bg-black/90 p-1 relative">
                   {/* Fake Terminal Window */}
                   <div className="bg-gray-900 p-2 flex gap-2 border-b border-gray-800">
                     <div className="w-3 h-3 rounded-full bg-red-500"></div>
                     <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                     <div className="w-3 h-3 rounded-full bg-green-500"></div>
                   </div>
                   <div className="p-6 font-mono text-xs md:text-sm text-green-300 space-y-2">
                     <div className="flex"><span className="text-blue-400 mr-2">root@chainfind:~$</span> ./deploy_smart_contract.sh</div>
                     <div className="text-gray-400">Compiling Solidity v0.8.20... [OK]</div>
                     <div className="text-gray-400">Training Neural Net... [EPOCH 100/100]</div>
                     <div className="text-gray-400">Auditing Security Protocols... [PASSED]</div>
                     <div className="text-green-500 font-bold mt-4">&gt;&gt;&gt; DEPLOYMENT SUCCESSFUL. HASH: 0x7f...3a2</div>
                     <div className="animate-pulse mt-2">_</div>
                   </div>
                   
                   {/* Decorative Grid */}
                   <div className="absolute -bottom-6 -right-6 text-green-800/40">
                     <Hexagon size={120} strokeWidth={1} />
                   </div>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* BLOG SECTION */}
        <BlogSection />

        {/* AI TERMINAL SECTION */}
        <section ref={systemAccessRef} id="system_access" className="py-32 bg-black relative border-y border-green-900/50">
          <div className="absolute inset-0 bg-green-900/5 pattern-grid-lg opacity-20"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-12">
              <GlitchText text="CHAIN_CORE V2.5" as="h2" className="text-4xl font-bold text-white font-tech mb-4" />
              <p className="text-green-500/60 text-sm font-mono uppercase tracking-widest">Direct Uplink Established // Type <span className="text-white font-bold">/signal</span> to contact</p>
            </div>
            
            <div className="relative">
               {/* Decorative connector lines */}
               <div className="hidden md:block absolute top-1/2 -left-10 w-10 h-[1px] bg-green-500/30"></div>
               <div className="hidden md:block absolute top-1/2 -right-10 w-10 h-[1px] bg-green-500/30"></div>
               
               <TerminalChat />
            </div>
            
            <div className="mt-8 flex justify-center gap-8 text-xs text-gray-600 font-mono uppercase">
               <span className="flex items-center gap-2"><Lock size={12}/> 256-BIT ENCRYPTION</span>
               <span className="flex items-center gap-2"><Activity size={12}/> NEURAL ENGINE ACTIVE</span>
               <span className="flex items-center gap-2"><Database size={12}/> LOGS: SECURE</span>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="py-8 border-t border-green-900/30 bg-black text-center relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-50"></div>
           <div className="container mx-auto px-4">
             <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-600 font-mono">
               <p>&copy; {new Date().getFullYear()} CHAINFIND SYSTEMS. ELITE NETWORK SECURITY & SOFTWARE DEVELOPMENT.</p>
               <div className="flex gap-4 mt-4 md:mt-0">
                 <span className="hover:text-green-500 cursor-pointer">PRIVACY_PROTOCOL</span>
                 <span className="hover:text-green-500 cursor-pointer">TERMS_OF_ENGAGEMENT</span>
               </div>
             </div>
             <p className="mt-4 text-[10px] text-green-900">UNAUTHORIZED ACCESS IS A FEDERAL OFFENSE UNDER THE COMPUTER FRAUD AND ABUSE ACT.</p>
           </div>
        </footer>

      </main>
    </div>
  );
};

export default App;
