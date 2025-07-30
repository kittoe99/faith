"use client";

import { useState, useRef, useEffect, FormEvent } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AiChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I’m your mock AI companion. Ask me anything and I’ll try to help.",
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;

    // Add user message
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");

    // Mock AI response after delay
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `I’m a mock AI. You said: "${text}"`,
        },
      ]);
    }, 600);
  };

  return (
    <div className="flex justify-center items-center w-full h-full px-2 sm:px-4 min-w-0">
      <div className="flex flex-col w-full sm:w-auto max-w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto h-[75vh] sm:h-[80vh] bg-white border rounded-2xl shadow-lg overflow-hidden text-sm min-w-0">
        {/* Header */}
        <div className="flex items-center gap-2 px-4 py-3 border-b bg-gradient-to-r from-purple-600 to-purple-500 text-white">
          <i className="fas fa-robot" />
          <h3 className="font-semibold">Ai Chat</h3>
        </div>
      <div className="flex-1 min-h-0 overflow-y-auto px-3 py-4 space-y-3 bg-gray-50 rounded-t-lg">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`break-words max-w-[75%] rounded-lg px-3 py-2 whitespace-pre-line shadow-sm ${msg.role === "user" ? "bg-purple-600 text-white" : "bg-white text-gray-800"}`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex gap-2 p-3 border-t bg-white rounded-b-lg"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border rounded px-3 py-2 text-gray-800 focus:outline-none"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-purple-600 text-white rounded disabled:opacity-50"
          disabled={!input.trim()}
        >
          Send
        </button>
      </form>
    </div>
  </div>
  );
}
