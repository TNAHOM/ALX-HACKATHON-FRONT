"use client";

import type React from "react";

import { useState } from "react";
import Image from "next/image";
import { Send, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ChatInterface from "@/components/chat-interface";
import ChatButton from "@/components/chat-button";
import { AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import BookingBar from "@/components/BookingBar";

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<
    { role: string; content: string }[]
  >([]);
  const [hasInteracted, setHasInteracted] = useState(false);

  const handleChatSubmit = (e: React.FormEvent, input: string = chatInput) => {
    e.preventDefault();
    if (!input.trim()) return;

    setChatHistory([...chatHistory, { role: "user", content: input }]);

    // Mark that the user has interacted with the chat
    setHasInteracted(true);

    if (!isChatOpen) {
      setIsChatOpen(true);
      // Add a welcome message if this is the first interaction
      if (chatHistory.length === 0) {
        setTimeout(() => {
          setChatHistory((prev) => [
            ...prev,
            {
              role: "assistant",
              content:
                "Hello! Welcome to Kuriftu Resort. How can I assist you today?",
            },
          ]);
        }, 500);
      }
    }

    setChatInput("");
  };

  const handleOpenChat = () => {
    setIsChatOpen(true);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

  return (
    <main className="min-h-screen bg-[#f8f5f0]">
      <Navbar />

      {/* Hero Section with Chatbot Input */}
      <section className="relative">
        <div className="h-[60vh] w-full relative">
          <Image
            src="/placeholder.svg?height=800&width=1600"
            alt="Resort view"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col items-center justify-center px-4">
            <h1 className="text-4xl md:text-5xl text-white font-bold mb-6 text-center">
              Experience Luxury at Kuriftu Resort
            </h1>

            {/* Chatbot Input */}
            <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-1">
              <form onSubmit={handleChatSubmit} className="flex">
                <Input
                  type="text"
                  placeholder="Ask our AI assistant about rooms, dining, or activities..."
                  className="flex-grow border-none focus-visible:ring-0 text-lg py-6"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                />
                <Button
                  type="submit"
                  className="bg-[#f8a4a9] hover:bg-[#f68e94] text-white"
                >
                  <Send size={20} />
                </Button>
              </form>
              <div className="px-4 py-2 text-sm text-gray-500">
                <p>
                  {
                    "Try: 'I want to book a room from April 1 to 5 and know your services price and facilities"
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resort Features */}
      <section className="py-16 container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="h-64 relative rounded-lg overflow-hidden mb-4">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Adventure activities"
                fill
                className="object-cover"
              />
            </div>
            <div className="mb-6">
              <h3 className="text-sm text-gray-500 uppercase tracking-wider">
                Adventure
              </h3>
              <h2 className="text-2xl font-bold mb-2">
                Discover Extraordinary Destinations
              </h2>
              <p className="text-gray-600 mb-4">
                Absorb the unique beauty of natural landscapes and prominent
                cultural heritage
              </p>
              <button className="text-gray-800 font-medium flex items-center">
                Explore <ChevronRight size={16} className="ml-1" />
              </button>
            </div>
          </div>

          <div>
            <div className="h-64 relative rounded-lg overflow-hidden mb-4">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Dining experience"
                fill
                className="object-cover"
              />
            </div>
            <div className="mb-6">
              <h3 className="text-sm text-gray-500 uppercase tracking-wider">
                Catering
              </h3>
              <h2 className="text-2xl font-bold mb-2">
                The Commitment To Good Service
              </h2>
              <p className="text-gray-600 mb-4">
                From culinary experiences to accommodations inspired by
                tradition as well as international standards of luxury
              </p>
              <button className="text-gray-800 font-medium flex items-center">
                Explore <ChevronRight size={16} className="ml-1" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <BookingBar />

      {/* Floating Chat Button */}
      <AnimatePresence>
        {!isChatOpen && hasInteracted && chatHistory.length > 0 && (
          <ChatButton
            onClick={handleOpenChat}
            hasMessages={chatHistory.length > 0}
          />
        )}
      </AnimatePresence>

      {/* Chat Interface */}
      {isChatOpen && (
        <ChatInterface
          messages={chatHistory}
          onClose={handleCloseChat}
          onSend={(message) => {
            setChatInput(message);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            handleChatSubmit(new Event("submit") as any, message);
          }}
        />
      )}
    </main>
  );
}
