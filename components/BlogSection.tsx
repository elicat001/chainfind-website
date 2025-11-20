
import React, { useState, useEffect } from 'react';
import { SectionHeader, CyberButton } from './HackerUI';
import { FileText, X, Hash, Calendar, User, Clock, Terminal, ChevronRight, Settings } from 'lucide-react';
import { BlogPost } from '../types';
import { blogService } from '../services/blogService';
import { BlogAdmin } from './BlogAdmin';

const BlogSection: React.FC = () => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = () => {
    setPosts(blogService.getAllPosts());
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

           {posts.map((post) => (
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

           {posts.length === 0 && (
             <div className="text-center py-12 border border-dashed border-green-900">
               <p className="text-gray-500 font-mono">ARCHIVE EMPTY or CORRUPTED.</p>
             </div>
           )}
         </div>
       </div>

       {/* File Reader Modal */}
       {selectedPost && (
         <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div 
              className="bg-black w-full max-w-3xl border border-green-500 shadow-[0_0_50px_rgba(0,255,0,0.2)] relative flex flex-col max-h-[85vh]"
              onClick={(e) => e.stopPropagation()}
            >
               {/* Modal Header */}
               <div className="flex items-center justify-between bg-green-900/20 border-b border-green-500/30 p-3">
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
               <div className="grid grid-cols-3 gap-4 border-b border-green-500/20 p-4 text-xs font-mono text-gray-400 bg-black/50">
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
               <div className="p-6 overflow-y-auto font-mono text-sm leading-relaxed text-gray-300 selection:bg-green-900 selection:text-white custom-scrollbar">
                  <h2 className="text-2xl font-bold text-white mb-6 font-tech border-l-4 border-green-500 pl-4">
                    {selectedPost.title}
                  </h2>
                  
                  {selectedPost.content.split('\n').map((line, i) => (
                     <div key={i} className={`${line.startsWith('#') ? 'text-green-400 font-bold mt-4' : ''} ${line.startsWith('```') ? 'bg-gray-900 p-2 border border-gray-700 my-2 text-gray-300 font-mono text-xs' : ''} min-h-[1rem]`}>
                        {line}
                     </div>
                  ))}
                  
                  <div className="mt-8 border-t border-dashed border-green-500/30 pt-4 text-center">
                     <CyberButton onClick={() => setSelectedPost(null)} variant="secondary" className="text-xs py-2 px-4">
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
