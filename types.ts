
export enum MessageRole {
  USER = 'user',
  SYSTEM = 'system',
  AI = 'model'
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  text: string;
  isTyping?: boolean;
  isCustomUI?: boolean; // New flag for rendering custom components in chat
}

export interface ServiceItem {
  title: string;
  description: string;
  icon: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface BlogPost {
  id: string;
  title: string;
  date: string;
  category: string;
  preview: string;
  content: string;
  author: string;
  readTime: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: 'AI_AGENTS' | 'BLOCKCHAIN' | 'SECURITY' | 'TOOLS';
  version: string;
  status: 'ONLINE' | 'BETA' | 'DEV';
  icon: any; // Lucide icon component
  link: string;
  priceLabel: string;
}