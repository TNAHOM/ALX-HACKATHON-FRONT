"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatInterfaceProps {
  messages: { role: string; content: string }[];
  onClose: () => void;
  onSend: (message: string) => void;
}

export default function ChatInterface({
  messages,
  onClose,
  onSend,
}: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <>
      {/* Backdrop with blur effect */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 flex items-center justify-center"
        onClick={onClose}
      />

      {/* Chat Modal */}
      <div
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] md:w-[60%] h-[80%] 
                  bg-white rounded-xl shadow-2xl z-50 flex flex-col animate-in fade-in zoom-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Chat Header */}
        <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-[#f8a4a9] text-white rounded-t-xl">
          <div>
            <h3 className="font-bold text-xl">Kuriftu Resort Assistant</h3>
            <p className="text-sm opacity-90">
              {"We're here to help with your resort experience"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#f68e94] rounded-full transition-colors"
            aria-label="Close chat"
          >
            <X size={24} />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-grow overflow-y-auto p-6 space-y-6 bg-gray-50/50">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              <h3 className="text-xl font-medium mb-2">
                Welcome to Kuriftu Resort
              </h3>
              <p>How can I assist you with your stay today?</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`${
                    message.role === "user"
                      ? "bg-[#f8a4a9] text-white"
                      : "bg-white border border-gray-200 text-gray-800"
                  } rounded-2xl p-4 max-w-[80%] shadow-sm`}
                >
                  {message.content}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="p-4 border-t border-gray-200 bg-white rounded-b-xl">
          <form onSubmit={handleSubmit} className="flex items-center">
            <Input
              ref={inputRef}
              type="text"
              placeholder="Type your message..."
              className="flex-grow mr-3 py-6 text-base border-gray-300 focus-visible:ring-[#f8a4a9]"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <Button
              type="submit"
              className="bg-[#f8a4a9] hover:bg-[#f68e94] text-white px-6 py-6 rounded-full"
            >
              <Send size={20} className="mr-2" />
              <span>Send</span>
            </Button>
          </form>
          <div className="mt-2 text-xs text-gray-500 px-2">
            <p>
              Ask about room availability, dining options, spa services, or
              activities
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
