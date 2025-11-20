
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
