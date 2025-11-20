
import React, { useState } from 'react';
import { SectionHeader, CyberButton } from './HackerUI';
import { Product } from '../types';
import { Bot, Shield, Cpu, Globe, ExternalLink, Zap, Lock, Activity, Database, Code, Box } from 'lucide-react';

const MOCK_PRODUCTS: Product[] = [
  {
    id: 'PROD_001',
    name: 'NEURAL_TRADER_X',
    description: 'Autonomous crypto trading bot powered by reinforcement learning. Analyzes market sentiment and on-chain data in real-time.',
    category: 'AI_AGENTS',
    version: 'v2.4.1',
    status: 'ONLINE',
    icon: Activity,
    link: '#',
    priceLabel: 'SAAS / ENT'
  },
  {
    id: 'PROD_002',
    name: 'SENTINEL_AUDIT',
    description: 'Automated smart contract vulnerability scanner. Detects reentrancy, overflow, and logic errors before deployment.',
    category: 'SECURITY',
    version: 'v1.0.5',
    status: 'ONLINE',
    icon: Shield,
    link: '#',
    priceLabel: 'FREE / PRO'
  },
  {
    id: 'PROD_003',
    name: 'GEN_X_CONTENT',
    description: 'Enterprise-grade LLM engine for generating SEO-optimized technical documentation and marketing copy.',
    category: 'AI_AGENTS',
    version: 'v3.0.0-beta',
    status: 'BETA',
    icon: Bot,
    link: '#',
    priceLabel: 'SUBSCRIPTION'
  },
  {
    id: 'PROD_004',
    name: 'CHAIN_INDEXER',
    description: 'High-performance blockchain data indexing layer. Query any EVM chain with SQL-like syntax.',
    category: 'BLOCKCHAIN',
    version: 'v1.2.0',
    status: 'ONLINE',
    icon: Database,
    link: '#',
    priceLabel: 'PAY_PER_REQ'
  },
  {
    id: 'PROD_005',
    name: 'ZERO_K_WALLET',
    description: 'Non-custodial wallet with built-in ZK-privacy features and biometric recovery protocols.',
    category: 'TOOLS',
    version: 'v0.9.0',
    status: 'DEV',
    icon: Lock,
    link: '#',
    priceLabel: 'OPEN_SOURCE'
  },
  {
    id: 'PROD_006',
    name: 'DAPP_BUILDER_CLI',
    description: 'Command line interface for scaffolding secure dApps with React, Tailwind, and Hardhat.',
    category: 'TOOLS',
    version: 'v4.1.2',
    status: 'ONLINE',
    icon: Code,
    link: '#',
    priceLabel: 'FREE'
  }
];

const CATEGORIES = ['ALL', 'AI_AGENTS', 'BLOCKCHAIN', 'SECURITY', 'TOOLS'];

const ProductShowcase: React.FC = () => {
  const [filter, setFilter] = useState('ALL');

  const filteredProducts = filter === 'ALL' 
    ? MOCK_PRODUCTS 
    : MOCK_PRODUCTS.filter(p => p.category === filter);

  return (
    <section id="products" className="py-32 relative bg-black">
       <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5"></div>
       
       <div className="container mx-auto px-4 relative z-10">
         <SectionHeader title="DIGITAL_ARSENAL" subtitle="DEPLOYED SOLUTIONS" />

         {/* Filter Bar */}
         <div className="flex flex-wrap justify-center gap-4 mb-16">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2 font-mono text-sm border transition-all duration-300 clip-corner-1 ${
                  filter === cat 
                    ? 'bg-green-600 text-black border-green-500 font-bold shadow-[0_0_15px_rgba(0,255,0,0.4)]' 
                    : 'bg-black text-green-500/70 border-green-900 hover:text-green-400 hover:border-green-500/50'
                }`}
              >
                [{cat}]
              </button>
            ))}
         </div>

         {/* Product Grid */}
         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div key={product.id} className="group relative bg-gray-900/20 border border-green-900/50 hover:border-green-500 transition-all duration-300 flex flex-col h-full overflow-hidden">
                 
                 {/* Product Header / Image Placeholder */}
                 <div className="h-48 bg-black/50 border-b border-green-900/50 relative flex items-center justify-center group-hover:bg-green-900/10 transition-colors overflow-hidden">
                    <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity">
                       <div className="w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(0,255,0,0.1)_25%,rgba(0,255,0,0.1)_50%,transparent_50%,transparent_75%,rgba(0,255,0,0.1)_75%,rgba(0,255,0,0.1)_100%)] bg-[length:20px_20px]"></div>
                    </div>
                    <product.icon size={64} className="text-green-700 group-hover:text-green-400 transition-all duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(0,255,0,0.5)]" />
                    
                    {/* Status Badge */}
                    <div className={`absolute top-4 right-4 text-[10px] font-bold px-2 py-1 border font-mono tracking-wider ${
                      product.status === 'ONLINE' ? 'text-green-400 border-green-500 bg-green-900/20' :
                      product.status === 'BETA' ? 'text-yellow-400 border-yellow-500 bg-yellow-900/20' :
                      'text-red-400 border-red-500 bg-red-900/20'
                    }`}>
                      {product.status}
                    </div>
                 </div>

                 {/* Content */}
                 <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                       <h3 className="text-xl font-tech font-bold text-white group-hover:text-green-300 transition-colors">{product.name}</h3>
                       <span className="text-xs font-mono text-gray-600">{product.version}</span>
                    </div>
                    
                    <p className="text-gray-400 text-sm font-mono mb-6 leading-relaxed flex-1">
                      {product.description}
                    </p>

                    {/* Meta Specs */}
                    <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-gray-500 mb-6 border-t border-dashed border-green-900/50 pt-4">
                       <div className="flex items-center gap-2">
                          <Cpu size={12} /> <span>ARCH: x64/WASM</span>
                       </div>
                       <div className="flex items-center gap-2">
                          <Globe size={12} /> <span>NET: MAINNET</span>
                       </div>
                       <div className="flex items-center gap-2">
                          <Box size={12} /> <span>TYPE: {product.category}</span>
                       </div>
                       <div className="flex items-center gap-2">
                          <Zap size={12} /> <span>LATENCY: &lt;50ms</span>
                       </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between mt-auto">
                       <span className="text-green-500 font-bold font-mono text-sm">{product.priceLabel}</span>
                       <a 
                         href={product.link} 
                         target="_blank" 
                         rel="noreferrer"
                         className="relative inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-black font-bold font-mono text-xs uppercase hover:bg-green-400 transition-colors clip-corner-1"
                       >
                         Access_Tool <ExternalLink size={12} />
                       </a>
                    </div>
                 </div>
              </div>
            ))}
         </div>
       </div>
    </section>
  );
};

export default ProductShowcase;
