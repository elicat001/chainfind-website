
import { BlogPost } from '../types';

const STORAGE_KEY = 'chainfind_blog_db_v1';

const DEFAULT_POSTS: BlogPost[] = [
  {
    id: 'LOG_001',
    title: 'The Convergence of AI Agents and Smart Contracts',
    date: '2024.05.12',
    category: 'AI_WEB3',
    author: 'ROOT_ADMIN',
    readTime: '5 MIN',
    preview: 'Autonomous agents are no longer just chat interfaces. By giving them wallet addresses, we are witnessing the birth of an automated economy...',
    content: `# SYSTEM_LOG: AI_AGENTS_V2
# TIMESTAMP: 2024.05.12 :: 04:23 UTC
# ENCRYPTION: AES-256

The intersection of Generative AI and Blockchain technology is creating a new paradigm: "Autonomous Economic Agents".

Traditionally, smart contracts are passive code—they wait for an external trigger. AI Agents, however, are proactive. They can analyze market data, make decisions, and execute transactions on-chain without human intervention.

## KEY DEVELOPMENTS:
1. **Wallet Abstraction**: Agents now possess secure multi-sig wallets.
2. **Oracles**: LLMs are acting as reasoning engines for on-chain data.
3. **Governance**: DAOs are experimenting with AI delegates for voting.

At Chainfind, we are developing the "Neural-Chain Bridge", a protocol allowing L2 networks to verify AI inference results. This ensures that when an agent executes a trade, the logic behind it is verifiable.

[END_OF_LOG]`
  },
  {
    id: 'LOG_002',
    title: 'Zero-Knowledge Proofs in Enterprise Privacy',
    date: '2024.04.28',
    category: 'CRYPTOGRAPHY',
    author: 'SEC_OPS',
    readTime: '8 MIN',
    preview: 'Enterprises need privacy, blockchains are public. ZK-Proofs solve this paradox by proving truth without revealing the underlying data...',
    content: `# SYSTEM_LOG: ZK_RESEARCH
# STATUS: DECLASSIFIED

Public blockchains offer transparency, but enterprises require confidentiality. Zero-Knowledge Proofs (ZKPs) are the mathematical magic solving this contradiction.

## USE CASE: SUPPLY CHAIN
Imagine a luxury goods manufacturer wants to prove a bag is authentic without revealing their entire supplier list to competitors.

- **Traditional Blockchain**: All data is public.
- **ZK-Rollup**: The manufacturer generates a "proof" that the item moved through the verified supply chain. The public ledger verifies the proof, but the supplier identities remain hidden.

Chainfind's implementation of ZK-SNARKs reduces gas costs by 90% while maintaining GDPR compliance for our European clients.

[END_OF_LOG]`
  },
  {
    id: 'LOG_003',
    title: 'Vulnerability Report: Reentrancy in DeFi Protocols',
    date: '2024.03.15',
    category: 'SECURITY_AUDIT',
    author: 'WHITE_HAT',
    readTime: '12 MIN',
    preview: 'Despite being a known vector since 2016, reentrancy attacks continue to drain millions. Here is how our automated scanner detects them...',
    content: `# INCIDENT_REPORT: REENTRANCY
# SEVERITY: CRITICAL

A reentrancy attack occurs when a function makes an external call to an untrusted contract before it resolves its own state change. This allows the attacker to recursively call the original function, draining funds.

## CODE ANALYSIS:
\`\`\`solidity
// VULNERABLE CODE
function withdraw() public {
    uint bal = balances[msg.sender];
    require(bal > 0);
    (bool sent, ) = msg.sender.call{value: bal}(""); // <--- ATTACK VECTOR
    require(sent, "Failed to send Ether");
    balances[msg.sender] = 0;
}
\`\`\`

## REMEDIATION:
1. **Checks-Effects-Interactions Pattern**: Update state *before* making external calls.
2. **ReentrancyGuard**: Use OpenZeppelin's modifiers.

Our "Chainfind Sentinel" tool now automatically flags this pattern during CI/CD pipelines.

[END_OF_LOG]`
  }
];

export const blogService = {
  getAllPosts: (): BlogPost[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_POSTS));
      return DEFAULT_POSTS;
    }
    try {
      return JSON.parse(stored);
    } catch (e) {
      return DEFAULT_POSTS;
    }
  },

  savePost: (post: BlogPost): void => {
    const posts = blogService.getAllPosts();
    const existingIndex = posts.findIndex(p => p.id === post.id);
    
    if (existingIndex >= 0) {
      posts[existingIndex] = post;
    } else {
      posts.unshift(post); // Add new post to top
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  },

  deletePost: (id: string): void => {
    const posts = blogService.getAllPosts();
    const filtered = posts.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  },
  
  resetDB: (): void => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_POSTS));
  }
};
