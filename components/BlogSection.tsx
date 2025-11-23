
import React, { useState, useEffect } from 'react';
import { SectionHeader, CyberButton } from './HackerUI';
import { FileText, X, Hash, Calendar, User, Clock, Terminal, ChevronRight, Settings, Clipboard, Check } from 'lucide-react';
import { BlogPost } from '../types';
import { blogService } from '../services/blogService';
import { BlogAdmin } from './BlogAdmin';

// --- Code Block Component with Syntax Highlighting & Copy ---
const CodeBlock: React.FC<{ code: string; language: string }> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const highlight = (line: string) => {
    // Basic tokenizer regex for JS/TS/Solidity/Python/CSS/HTML
    // Matches keywords, strings, comments
    const tokenRegex = /(\b(?:const|let|var|function|return|if|else|for|while|class|import|from|export|async|await|public|private|contract|uint|bool|string|bytes|address|mapping|require|revert|emit|event|constructor|modifier|struct|enum|interface|type|implements|extends|true|false|null|undefined|void|this|new|try|catch|super|msg|block|tx|console|log|div|span|className|id)\b)|(".*?"|'.*?'|`.*?`)|(\/\/.*)/g;
    
    // Split and filter out undefined/empty matches from capturing groups
    const parts = line.split(tokenRegex).filter(part => part !== undefined && part !== '');

    return parts.map((part, index) => {
       if (/^(\/\/.*)/.test(part)) return <span key={index} className="text-gray-500 italic">{part}</span>; // Comments
       if (/^(".*"|'.*'|`.*`)/.test(part)) return <span key={index} className="text-yellow-300">{part}</span>; // Strings
       if (/^(const|let|var|function|contract|class|struct|enum|interface|type)$/.test(part)) return <span key={index} className="text-purple-400 font-bold">{part}</span>; // Declarations
       if (/^(return|if|else|for|while|try|catch|import|from|export|new|this|super|implements|extends)$/.test(part)) return <span key={index} className="text-pink-400">{part}</span>; // Control flow
       if (/^(uint|bool|string|bytes|address|mapping|void|true|false|null|undefined)$/.test(part)) return <span key={index} className="text-orange-400">{part}</span>; // Types/Values
       if (/^(public|private|async|await|modifier|view|pure|require|emit|constructor)$/.test(part)) return <span key={index} className="text-blue-400">{part}</span>; // Modifiers/Built-ins
       if (/^(console|log|div|span)$/.test(part)) return <span key={index} className="text-cyan-400">{part}</span>; // Built-in/Common
       return <span key={index} className="text-gray-200">{part}</span>;
    });
  };

  return (
    <div className="my-6 rounded border border-green-900/50 bg-black/90 overflow-hidden shadow-lg group font-mono text-sm relative">
      <div className="flex justify-between items-center bg-green-900/20 px-4 py-2 border-b border-green-900/30 select-none">
        <span className="text-xs text-green-500 uppercase flex items-center gap-2 font-bold">
           <Terminal size={12} /> {language || 'SCRIPT'}
        </span>
        <button 
          onClick={handleCopy}
          className="flex items-center gap-2 text-[10px] text-gray-500 hover:text-white transition-colors uppercase tracking-wider bg-black/50 px-2 py-1 rounded hover:bg-green-900/50 border border-transparent hover:border-green-500/30"
        >
          {copied ? <Check size={12} className="text-green-500" /> : <Clipboard size={12} />}
          {copied ? 'COPIED' : 'COPY'}
        </button>
      </div>
      <div className="p-4 overflow-x-auto bg-[#0a0a0a] custom-scrollbar">
         <table className="w-full border-collapse text-left">
            <tbody>
              {code.split('\n').map((line, i) => (
                <tr key={i}>
                   <td className="w-8 select-none text-gray-700 text-right pr-4 text-xs align-top pt-[1px] border-r border-green-900/20 opacity-50">{i + 1}</td>
                   <td className="pl-4 whitespace-pre font-mono leading-relaxed">{highlight(line) || <br/>}</td>
                </tr>
              ))}
            </tbody>
         </table>
      </div>
    </div>
  );
};

const BlogSection: React.FC = () => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
        const data = await blogService.getAllPosts();
        setPosts(data);
    } catch (e) {
        console.error("Failed to load logs");
    } finally {
        setLoading(false);
    }
  };

  // Content Parser
  const renderPostContent = (content: string) => {
    const lines = content.split('\n');
    const nodes: React.ReactNode[] = [];
    let inCode = false;
    let codeLines: string[] = [];
    let lang = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      // Detect Code Block Start
      if (line.trim().startsWith('```')) {
        if (inCode) {
          // End of code block
          nodes.push(<CodeBlock key={`code-${i}`} code={codeLines.join('\n')} language={lang} />);
          codeLines = [];
          inCode = false;
        } else {
          // Start of code block
          inCode = true;
          // Extract language, handle "```javascript" or "``` js"
          lang = line.trim().replace(/^```/, '').trim();
        }
      } else if (inCode) {
        codeLines.push(line);
      } else {
        // Standard markdown rendering
        if (line.startsWith('# ')) {
             nodes.push(<h2 key={i} className="text-2xl font-bold text-green-400 mt-8 mb-4 font-tech border-b border-green-900/50 pb-2">{line.replace(/^#+\s/, '')}</h2>);
        } else if (line.startsWith('## ')) {
             nodes.push(<h3 key={i} className="text-xl font-bold text-green-300 mt-6 mb-3 font-tech">{line.replace(/^#+\s/, '')}</h3>);
        } else if (line.startsWith('### ')) {
             nodes.push(<h4 key={i} className="text-lg font-bold text-green-200 mt-4 mb-2 font-tech">{line.replace(/^#+\s/, '')}</h4>);
        } else if (line.startsWith('- ')) {
             nodes.push(<li key={i} className="ml-6 list-disc text-gray-300 my-2 pl-2 marker:text-green-500">{line.substring(2)}</li>);
        } else if (line.trim() === '') {
             nodes.push(<div key={i} className="h-4"></div>);
        } else {
             // Handle **bold** and `inline code`
             // Split by markdown markers
             const parts = line.split(/(\*\*.*?\*\*|`.*?`)/g);
             
             nodes.push(
                <div key={i} className="text-gray-300 mb-2 leading-relaxed">
                   {parts.map((part, idx) => {
                     // Check for bold
                     if (part.startsWith('**') && part.endsWith('**')) {
                        return <strong key={idx} className="text-green-200 font-bold">{part.slice(2, -2)}</strong>;
                     }
                     // Check for inline code
                     if (part.startsWith('`') && part.endsWith('`')) {
                        return <code key={idx} className="bg-green-900/30 text-green-300 px-1.5 py-0.5 rounded border border-green-500/20 text-xs font-mono">{part.slice(1, -1)}</code>;
                     }
                     // Standard Text
                     return part;
                   })}
                </div>
             );
        }
      }
    }
    // Handle unclosed code block at end of file
    if (inCode) {
         nodes.push(<CodeBlock key="code-end" code={codeLines.join('\n')} language={lang} />);
    }
    return nodes;
  };

  return (
    <section id="blog" className="py-32 relative bg-dark-bg">
       {/* Admin Trigger */}
       <div className="absolute top-4 right-4 z-20">
         <button 
           onClick={() => setIsAdminOpen(true)}
           className="text-green-900 hover:text-green-500 transition-colors p-2 opacity-50 hover:opacity-100"
           title="ADMIN_GATEWAY"
         >
            <Settings size={16} />
         </button>
       </div>

       <BlogAdmin 
         isOpen={isAdminOpen} 
         onClose={() => setIsAdminOpen(false)} 
         onUpdate={loadPosts} 
       />

       <div className="container mx-auto px-4">
         <SectionHeader title="SYSTEM_LOGS" subtitle="INTELLIGENCE ARCHIVE" />
         
         <div className="grid lg:grid-cols-1 gap-6 max-w-5xl mx-auto">
           {/* Header Row for the 'File List' */}
           <div className="hidden md:grid grid-cols-12 gap-4 text-green-500/50 font-mono text-xs border-b border-green-500/20 pb-2 px-4 uppercase tracking-wider">
              <div className="col-span-2">Timestamp</div>
              <div className="col-span-1">ID</div>
              <div className="col-span-6">Subject</div>
              <div className="col-span-2">Category</div>
              <div className="col-span-1 text-right">Action</div>
           </div>
           
           {loading && (
               <div className="text-center py-12 font-mono text-green-500/50 animate-pulse">
                   ACCESSING ARCHIVES...
               </div>
           )}

           {!loading && posts.map((post) => (
             <div 
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className="group relative bg-black/40 border border-green-500/10 p-4 cursor-pointer transition-all duration-300 hover:border-green-500 hover:bg-green-900/10"
             >
               {/* Desktop View */}
               <div className="hidden md:grid grid-cols-12 gap-4 items-center font-mono text-sm">
                  <div className="col-span-2 text-gray-500 group-hover:text-green-400 transition-colors flex items-center gap-2">
                    <Calendar size={12} /> {post.date}
                  </div>
                  <div className="col-span-1 text-green-600 group-hover:text-green-300">{post.id}</div>
                  <div className="col-span-6 text-gray-200 group-hover:text-white font-bold truncate group-hover:text-glow">
                    {post.title}
                  </div>
                  <div className="col-span-2">
                    <span className="bg-green-900/30 text-green-400 px-2 py-1 text-xs rounded border border-green-500/20">
                      {post.category}
                    </span>
                  </div>
                  <div className="col-span-1 text-right text-gray-600 group-hover:text-green-500">
                    <ChevronRight size={16} className="ml-auto" />
                  </div>
               </div>

               {/* Mobile View */}
               <div className="md:hidden flex flex-col gap-2">
                  <div className="flex justify-between text-xs text-green-500/60 font-mono">
                     <span>{post.date}</span>
                     <span>{post.id}</span>
                  </div>
                  <h3 className="text-lg text-white font-bold font-tech">{post.title}</h3>
                  <div className="flex justify-between items-center mt-2">
                     <span className="text-xs bg-green-900/30 text-green-400 px-2 py-1 rounded">{post.category}</span>
                     <span className="text-xs text-gray-500">READ_LOG &gt;</span>
                  </div>
               </div>
             </div>
           ))}

           {!loading && posts.length === 0 && (
             <div className="text-center py-12 border border-dashed border-green-900">
               <p className="text-gray-500 font-mono">ARCHIVE EMPTY or CORRUPTED.</p>
             </div>
           )}
         </div>
       </div>

       {/* File Reader Modal */}
       {selectedPost && (
         <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
            <div 
              className="bg-black w-full max-w-4xl border border-green-500 shadow-[0_0_50px_rgba(0,255,0,0.2)] relative flex flex-col max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
               {/* Modal Header */}
               <div className="flex items-center justify-between bg-green-900/20 border-b border-green-500/30 p-3 select-none">
                  <div className="flex items-center gap-3 text-green-500 font-mono text-sm">
                     <Terminal size={16} />
                     <span>/var/logs/{selectedPost.category}/{selectedPost.id}.txt</span>
                  </div>
                  <button 
                    onClick={() => setSelectedPost(null)}
                    className="text-green-500 hover:text-white hover:bg-green-500/20 p-1 rounded transition-colors"
                  >
                    <X size={20} />
                  </button>
               </div>

               {/* Meta Info Bar */}
               <div className="grid grid-cols-3 gap-4 border-b border-green-500/20 p-4 text-xs font-mono text-gray-400 bg-black/50 select-none">
                  <div className="flex items-center gap-2">
                     <User size={14} className="text-green-600"/>
                     <span>AUTHOR: {selectedPost.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <Clock size={14} className="text-green-600"/>
                     <span>EST_READ: {selectedPost.readTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <Hash size={14} className="text-green-600"/>
                     <span>MD5: {Math.random().toString(36).substring(7)}</span>
                  </div>
               </div>

               {/* Content Area */}
               <div className="p-6 md:p-10 overflow-y-auto custom-scrollbar bg-black/90">
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 font-tech border-l-4 border-green-500 pl-6 py-2">
                    {selectedPost.title}
                  </h1>
                  
                  <div className="font-mono text-sm leading-relaxed">
                    {renderPostContent(selectedPost.content)}
                  </div>
                  
                  <div className="mt-12 border-t border-dashed border-green-500/30 pt-8 text-center">
                     <CyberButton onClick={() => setSelectedPost(null)} variant="secondary" className="text-xs py-2 px-6">
                        CLOSE_STREAM
                     </CyberButton>
                  </div>
               </div>
            </div>
         </div>
       )}
    </section>
  );
};

export default BlogSection;
