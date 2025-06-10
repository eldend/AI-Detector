"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { ChatMessage, sendMessage } from "@/lib/chat";

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { isLoggedIn, logout } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await sendMessage([...messages, userMessage]);

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: response,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      // Show error message to user
      const errorMessage: ChatMessage = {
        role: "assistant",
        content: "죄송합니다. 메시지를 처리하는 중에 오류가 발생했습니다.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    setMessages([]);
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen p-4 md:p-8 flex items-center justify-center">
        <div className="text-xl">로그인이 필요합니다.</div>
      </main>
    );
  }

  return (
    <DashboardLayout onRefresh={handleRefresh} onLogout={handleLogout}>
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        <div className="flex-grow overflow-y-auto mb-4 space-y-4 p-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 mt-8">
              <p className="text-lg mb-2">AI와 대화를 시작해보세요!</p>
              <p className="text-sm">
                질문이나 도움이 필요한 내용을 입력해주세요.
              </p>
            </div>
          )}
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-4 ${
                  message.role === "user"
                    ? "bg-primary text-white"
                    : "bg-dark-lighter text-gray-200"
                }`}
              >
                {message.content}
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-dark-lighter text-gray-200 rounded-lg p-4">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2 p-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="메시지를 입력하세요..."
            className="flex-grow bg-dark-lighter text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            전송
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
