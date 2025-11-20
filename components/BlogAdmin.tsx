
import React, { useState, useEffect } from 'react';
import { X, Save, Trash2, Plus, Terminal, Lock, LogOut } from 'lucide-react';
import { BlogPost } from '../types';
import { blogService } from '../services/blogService';
import { CyberButton, GlitchText } from './HackerUI';

interface BlogAdminProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export const BlogAdmin: React.FC<BlogAdminProps> = ({ isOpen, onClose, onUpdate }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadPosts();
    }
  }, [isOpen, isAuthenticated]);

  const loadPosts = () => {
    setPosts(blogService.getAllPosts());
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock authentication - Simple hardcoded password for demo
    if (password === 'admin' || password === 'root' || password === 'chainfind') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('ACCESS DENIED: INVALID CREDENTIALS');
      setPassword('');
    }
  };

  const handleCreateNew = () => {
    const newPost: BlogPost = {
      id: `LOG_${String(Date.now()).slice(-4)}`,
      title: '',
      date: new Date().toISOString().split('T')[0].replace(/-/g, '.'),
      category: 'SYSTEM',
      author: 'ADMIN',
      readTime: '5 MIN',
      preview: '',
      content: '# NEW_ENTRY\n\nStart typing...'
    };
    setEditingPost(newPost);
    setIsNew(true);
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost({ ...post });
    setIsNew(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('CONFIRM DELETION? THIS ACTION CANNOT BE UNDONE.')) {
      blogService.deletePost(id);
      loadPosts();
      onUpdate();
    }
  };

  const handleSave = () => {
    if (!editingPost) return;
    if (!editingPost.title || !editingPost.content) {
        alert("ERROR: DATA CORRUPTED. FIELDS CANNOT BE EMPTY.");
        return;
    }
    
    // Auto-generate preview if empty
    if (!editingPost.preview) {
        editingPost.preview = editingPost.content.slice(0, 120).replace(/[#*`]/g, '') + '...';
    }

    blogService.savePost(editingPost);
    loadPosts();
    onUpdate();
    setEditingPost(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-5xl h-[85vh] bg-black border border-green-500 shadow-[0_0_30px_rgba(0,255,0,0.2)] flex flex-col relative overflow-hidden">
        
        {/* Header */}
        <div className="bg-green-900/20 border-b border-green-500/30 p-3 flex justify-between items-center">
          <div className="flex items-center gap-2 text-green-500 font-mono font-bold">
            <Terminal size={18} />
            <span>CMS_ROOT_ACCESS // V1.0.4</span>
          </div>
          <button onClick={onClose} className="text-green-500 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex p-4">
          {!isAuthenticated ? (
            // LOGIN SCREEN
            <div className="m-auto max-w-md w-full text-center">
               <div className="mb-8">
                 <Lock size={48} className="mx-auto text-green-500 mb-4" />
                 <GlitchText text="SECURE AUTHENTICATION REQUIRED" className="text-xl font-bold text-white font-tech" />
               </div>
               <form onSubmit={handleLogin} className="space-y-4">
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="ENTER PASSWORD"
                    className="w-full bg-black border border-green-500/50 p-3 text-center text-green-400 font-mono focus:outline-none focus:border-green-500 focus:shadow-[0_0_15px_rgba(0,255,0,0.3)] placeholder-green-800"
                    autoFocus
                  />
                  {error && <div className="text-red-500 text-xs font-mono animate-pulse">{error}</div>}
                  <CyberButton className="w-full justify-center">DECRYPT & ENTER</CyberButton>
                  <p className="text-xs text-gray-600 mt-4">HINT: Try 'admin' or 'root'</p>
               </form>
            </div>
          ) : editingPost ? (
            // EDITOR SCREEN
            <div className="w-full flex flex-col h-full">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-green-400 font-mono">{isNew ? 'Creating New Log' : `Editing: ${editingPost.id}`}</h3>
                    <div className="flex gap-4">
                         <button onClick={() => setEditingPost(null)} className="text-gray-500 hover:text-white font-mono text-sm">[ CANCEL ]</button>
                         <button onClick={handleSave} className="flex items-center gap-2 text-green-500 hover:text-green-300 font-mono font-bold border border-green-500/30 px-4 py-1 hover:bg-green-900/30">
                             <Save size={16} /> SAVE_CHANGES
                         </button>
                    </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">TITLE</label>
                        <input 
                          value={editingPost.title}
                          onChange={e => setEditingPost({...editingPost, title: e.target.value})}
                          className="w-full bg-gray-900/50 border border-green-900 text-white p-2 font-mono text-sm focus:border-green-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">ID (READ ONLY)</label>
                        <input 
                          value={editingPost.id}
                          disabled
                          className="w-full bg-gray-900/30 border border-green-900/50 text-gray-500 p-2 font-mono text-sm cursor-not-allowed"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">CATEGORY</label>
                        <input 
                          value={editingPost.category}
                          onChange={e => setEditingPost({...editingPost, category: e.target.value})}
                          className="w-full bg-gray-900/50 border border-green-900 text-white p-2 font-mono text-sm focus:border-green-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">AUTHOR</label>
                        <input 
                          value={editingPost.author}
                          onChange={e => setEditingPost({...editingPost, author: e.target.value})}
                          className="w-full bg-gray-900/50 border border-green-900 text-white p-2 font-mono text-sm focus:border-green-500 outline-none"
                        />
                    </div>
                </div>

                <div className="flex-1 flex flex-col">
                    <label className="block text-xs text-gray-500 mb-1">CONTENT (MARKDOWN SUPPORTED)</label>
                    <textarea 
                        value={editingPost.content}
                        onChange={e => setEditingPost({...editingPost, content: e.target.value})}
                        className="flex-1 w-full bg-black border border-green-900 p-4 font-mono text-sm text-gray-300 focus:border-green-500 outline-none resize-none leading-relaxed"
                        spellCheck={false}
                    />
                </div>
            </div>
          ) : (
            // DASHBOARD LIST
            <div className="w-full h-full flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-4">
                        <GlitchText text="DATABASE_ENTRIES" className="text-xl text-white font-bold" />
                        <span className="text-xs text-green-500 bg-green-900/20 px-2 py-1 rounded border border-green-500/20">{posts.length} RECORDS</span>
                    </div>
                    <div className="flex gap-4">
                        <button onClick={() => setIsAuthenticated(false)} className="flex items-center gap-2 text-gray-500 hover:text-red-400 text-xs font-mono">
                            <LogOut size={14} /> LOGOUT
                        </button>
                        <CyberButton onClick={handleCreateNew} className="text-xs py-2 px-4">
                            <Plus size={16} className="inline mr-1" /> NEW_ENTRY
                        </CyberButton>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar border border-green-900/50 bg-black/50">
                    <table className="w-full text-left font-mono text-sm">
                        <thead className="bg-green-900/20 text-green-500 text-xs uppercase sticky top-0">
                            <tr>
                                <th className="p-3">ID</th>
                                <th className="p-3">Date</th>
                                <th className="p-3">Title</th>
                                <th className="p-3">Category</th>
                                <th className="p-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.map(post => (
                                <tr key={post.id} className="border-b border-green-900/30 hover:bg-green-900/10 transition-colors text-gray-400 hover:text-white">
                                    <td className="p-3 font-bold text-green-600">{post.id}</td>
                                    <td className="p-3 text-xs">{post.date}</td>
                                    <td className="p-3 truncate max-w-[200px]">{post.title}</td>
                                    <td className="p-3"><span className="text-xs bg-gray-800 px-2 py-1 rounded">{post.category}</span></td>
                                    <td className="p-3 text-right space-x-3">
                                        <button onClick={() => handleEdit(post)} className="text-blue-400 hover:text-blue-300 underline text-xs">EDIT</button>
                                        <button onClick={() => handleDelete(post.id)} className="text-red-500 hover:text-red-400 underline text-xs">DELETE</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {posts.length === 0 && (
                        <div className="text-center py-12 text-gray-600">DATABASE EMPTY</div>
                    )}
                </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
