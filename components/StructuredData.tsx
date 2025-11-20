import React from 'react';

export const StructuredData: React.FC = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Chainfind Systems",
    "alternateName": "Chainfind",
    "url": "https://chainfind.com",
    "logo": "https://chainfind.com/assets/logo.png", 
    "description": "Chainfind is an elite collective of network architects and software engineers specializing in cybersecurity, AI, and blockchain infrastructure.",
    "slogan": "Systems Architecture / Security / AI / Blockchain",
    "knowsAbout": ["Cybersecurity", "Network Infrastructure", "Software Development", "Penetration Testing", "AI Integration", "Blockchain", "Web3", "Smart Contracts", "Machine Learning"],
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "qin@chainfind.cn",
      "contactType": "sales",
      "availableLanguage": ["English", "Chinese"]
    },
    "sameAs": [
      "https://twitter.com/chainfind",
      "https://linkedin.com/company/chainfind",
      "https://github.com/chainfind"
    ],
    "offers": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Cybersecurity Audits",
          "description": "Advanced penetration testing, real-time intrusion detection, and zero-trust architecture."
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Network Infrastructure",
          "description": "Cloud migration, decentralized storage meshes, and high-availability server management."
        }
      },
       {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Custom Software Development",
          "description": "Full-stack development with modern frameworks for speed and scalability."
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "AI Tool Development",
          "description": "Custom LLM integration, autonomous agents, and machine learning model training."
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Blockchain Technology",
          "description": "Smart contract auditing, private chain deployment, and consensus algorithm implementation."
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Web3 Solutions",
          "description": "Decentralized App (dApp) development, DeFi protocols, and crypto wallet integration."
        }
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};