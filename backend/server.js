
/**
 * CHAINFIND SYSTEM BACKEND NODE (TEMPLATE)
 * ========================================
 * 
 * This file is a template for your Node.js server.
 * Deploy this to a server (e.g., AWS, DigitalOcean) to enable
 * the Real API mode.
 * 
 * REQUIRED PACKAGES:
 * npm install express cors body-parser
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 8080;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Mock Database (Replace with MongoDB or PostgreSQL in production)
let posts = [
    {
        id: 'LOG_001',
        title: 'The Convergence of AI Agents and Smart Contracts',
        date: '2024.05.12',
        category: 'AI_WEB3',
        author: 'ROOT_ADMIN',
        readTime: '5 MIN',
        preview: 'Autonomous agents are no longer just chat interfaces...',
        content: '# SYSTEM_LOG: AI_AGENTS_V2\n...'
    }
];

// Routes
// ------

// GET All Posts
app.get('/api/v1/posts', (req, res) => {
    console.log(`[${new Date().toISOString()}] INCOMING REQUEST: GET /posts`);
    // Simulate database delay
    setTimeout(() => {
        res.json(posts);
    }, 200);
});

// GET Single Post
app.get('/api/v1/posts/:id', (req, res) => {
    const post = posts.find(p => p.id === req.params.id);
    if (post) {
        res.json(post);
    } else {
        res.status(404).json({ error: 'Post not found' });
    }
});

// CREATE Post
app.post('/api/v1/posts', (req, res) => {
    const newPost = req.body;
    console.log(`[${new Date().toISOString()}] CREATING LOG: ${newPost.id}`);
    
    const existingIndex = posts.findIndex(p => p.id === newPost.id);
    if (existingIndex >= 0) {
        // Update existing
        posts[existingIndex] = newPost;
    } else {
        // Create new
        posts.unshift(newPost);
    }
    res.status(201).json({ message: 'Log entry saved successfully', id: newPost.id });
});

// DELETE Post
app.delete('/api/v1/posts/:id', (req, res) => {
    console.log(`[${new Date().toISOString()}] PURGING LOG: ${req.params.id}`);
    posts = posts.filter(p => p.id !== req.params.id);
    res.json({ message: 'Log entry purged' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`
    ==========================================
    CHAINFIND BACKEND NODE ONLINE
    ------------------------------------------
    PORT:       ${PORT}
    STATUS:     LISTENING
    MODE:       PRODUCTION
    ==========================================
    `);
});
