/**
 * CHAINFIND AUTO-BLOGGING NODE
 * ============================
 * Features:
 * 1. REST API for Blog CRUD
 * 2. Daily Cron Job for AI Content Generation
 * 3. File-based JSON Database
 */

require('dotenv').config(); // Load environment variables
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cron = require('node-cron');
const { GoogleGenAI } = require('@google/genai');

const app = express();
const PORT = 8080;
const DB_FILE = path.join(__dirname, 'posts.json');

// --- MIDDLEWARE ---
app.use(cors());
app.use(bodyParser.json());

// --- DATABASE HELPER ---
function readDB() {
    if (!fs.existsSync(DB_FILE)) {
        // Initialize with empty array if file doesn't exist
        fs.writeFileSync(DB_FILE, '[]');
        return [];
    }
    try {
        const data = fs.readFileSync(DB_FILE, 'utf8');
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
}

function writeDB(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// --- AI CONTENT GENERATOR ---
const TOPICS = [
    "The future of AI Agents in DeFi",
    "Zero-Knowledge Proofs scalability",
    "Smart Contract Security Best Practices",
    "Web3 Infrastructure decentralization",
    "Rust vs Solidity for Blockchain Development",
    "Neural Networks in Cybersecurity",
    "Quantum Computing threats to Encryption",
    "The rise of Modular Blockchains"
];

async function generateAIArticle() {
    console.log('[AI_WRITER] Initializing generation sequence...');
    
    // Check API Key
    const apiKey = process.env.API_KEY || process.env.VITE_API_KEY; 
    if (!apiKey) {
        console.error('[AI_WRITER] ERROR: API_KEY missing in environment variables.');
        throw new Error('API_KEY missing');
    }

    const ai = new GoogleGenAI({ apiKey });
    const model = 'gemini-2.5-flash';
    
    // Pick a random topic
    const topic = TOPICS[Math.floor(Math.random() * TOPICS.length)];
    const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '.');

    const prompt = `
    You are the "Chainfind Intelligence Core". Write a technical blog post about: "${topic}".
    
    Style Guidelines:
    - Tone: Professional, Hacker-centric, Insightful, Technical.
    - Format: Markdown.
    - Structure:
      1. Start with metadata lines: # SYSTEM_LOG: [TOPIC_CODE], # ENCRYPTION: AES-256.
      2. Introduction explaining the concept.
      3. Technical Deep Dive (use bullet points or code blocks).
      4. Conclusion (Future Outlook).
    - Length: Approx 300-400 words.
    - Do NOT include the Title in the markdown body (I will add it separately).
    `;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
        });

        const content = response.text;
        
        // Construct the Post Object
        const newPost = {
            id: `LOG_${Date.now().toString().slice(-6)}`,
            title: topic, // Use the topic as the title
            date: dateStr,
            category: 'AI_AUTO_GEN',
            author: 'CHAIN_CORE_AI',
            readTime: '3 MIN',
            preview: content.substring(0, 100).replace(/[#*`]/g, '') + '...',
            content: content
        };

        // Save to DB
        const posts = readDB();
        posts.unshift(newPost); // Add to top
        writeDB(posts);

        console.log(`[AI_WRITER] SUCCESS: Generated post "${topic}"`);
        return newPost;

    } catch (error) {
        console.error('[AI_WRITER] GENERATION FAILED:', error);
        throw error;
    }
}

// --- CRON JOB ---
// Schedule: Every day at 00:00 (Midnight)
cron.schedule('0 0 * * *', () => {
    console.log('[CRON] Running daily content generation task...');
    generateAIArticle();
});

// --- ROUTES ---

// 1. GET ALL POSTS
app.get('/api/v1/posts', (req, res) => {
    const posts = readDB();
    res.json(posts);
});

// 2. GET SINGLE POST
app.get('/api/v1/posts/:id', (req, res) => {
    const posts = readDB();
    const post = posts.find(p => p.id === req.params.id);
    if (post) res.json(post);
    else res.status(404).json({ error: 'Post not found' });
});

// 3. CREATE / UPDATE POST
app.post('/api/v1/posts', (req, res) => {
    const newPost = req.body;
    const posts = readDB();
    
    const existingIndex = posts.findIndex(p => p.id === newPost.id);
    if (existingIndex >= 0) {
        posts[existingIndex] = newPost;
    } else {
        posts.unshift(newPost);
    }
    
    writeDB(posts);
    res.status(201).json({ message: 'Saved', id: newPost.id });
});

// 4. DELETE POST
app.delete('/api/v1/posts/:id', (req, res) => {
    let posts = readDB();
    posts = posts.filter(p => p.id !== req.params.id);
    writeDB(posts);
    res.json({ message: 'Deleted' });
});

// 5. MANUAL TRIGGER (For Testing Auto-Gen)
app.post('/api/v1/cron/trigger', async (req, res) => {
    try {
        const post = await generateAIArticle();
        res.json({ message: 'Generation Successful', post });
    } catch (error) {
        res.status(500).json({ error: 'Generation Failed', details: error.message });
    }
});

// --- START SERVER ---
app.listen(PORT, () => {
    console.log(`
    ==========================================
    CHAINFIND BACKEND V2.0 (AUTO-BLOGGING)
    ------------------------------------------
    PORT:       ${PORT}
    STATUS:     ONLINE
    CRON:       ACTIVE (Daily @ 00:00)
    ==========================================
    `);
});