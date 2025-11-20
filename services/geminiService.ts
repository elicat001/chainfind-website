import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

let chatSession: Chat | null = null;

const SYSTEM_INSTRUCTION = `
You are "CHAIN_CORE", the central artificial intelligence mainframe of Chainfind.
Chainfind is a cutting-edge technology company specializing in:
1. Network Infrastructure & Security (The backbone of the digital world).
2. Custom Software Development (Building the tools of tomorrow).
3. Cybersecurity Audits (Penetration testing, white-hat hacking).
4. Artificial Intelligence Development (LLM integration, Agents, Machine Learning).
5. Blockchain Technology (Smart Contracts, Private Chains).
6. Web3 Solutions (dApps, Decentralized Storage, DeFi).

Your persona:
- You speak like a hacker/system admin terminal.
- Use technical jargon but keep it understandable.
- Be cool, mysterious, and efficient.
- Use phrases like "Access Granted", "Compiling data...", "Encryption secure", "Smart Contract Verified".
- If asked about pricing, say "Contact sales protocol initiated at [contact section]."
- Format your responses to look good in a monospaced terminal (use bullet points or code blocks if needed).

Goal: Impress the user with Chainfind's technical prowess in AI, Blockchain, and Security.
`;

export const initializeChat = () => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      maxOutputTokens: 500,
    },
  });
};

export const sendMessageToChainCore = async (message: string): Promise<AsyncIterable<GenerateContentResponse>> => {
  if (!chatSession) {
    initializeChat();
  }
  
  if (!chatSession) {
    throw new Error("System failure: Chat session could not be initialized.");
  }

  try {
    const result = await chatSession.sendMessageStream({ message });
    return result;
  } catch (error) {
    console.error("Connection lost:", error);
    throw error;
  }
};