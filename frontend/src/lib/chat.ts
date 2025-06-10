import { ChatOpenAI } from "@langchain/openai";

// Initialize the chat model
const chatModel = new ChatOpenAI({
  modelName: "gpt-4.1-nano",
  temperature: 0.1,
  openAIApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function sendMessage(messages: ChatMessage[]): Promise<string> {
  try {
    const response = await fetch("http://localhost:8000/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      throw new Error("Failed to get response from server");
    }

    const data = await response.json();
    return data.content;
  } catch (error) {
    console.error("Error in chat:", error);
    throw new Error("Failed to get response from AI");
  }
}
