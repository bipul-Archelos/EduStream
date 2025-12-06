"use client";
import { useState, useRef, useEffect } from "react";
import axios from "axios";

interface Message {
  role: "user" | "bot";
  text: string;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: "Hello! 👋 I am your AI Tutor. Select a subject and ask me anything!" }
  ]);
  const [input, setInput] = useState("");
  const [subject, setSubject] = useState("Python"); // Default Subject
  const [loading, setLoading] = useState(false);
  
  // Auto-scroll to bottom
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    // 1. User message add karein
    const userMsg = input;
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setInput("");
    setLoading(true);

    try {
      // 2. Backend API call karein
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/ask-tutor`, {
        subject: subject,
        question: userMsg
      });

      // 3. Bot response add karein
      setMessages((prev) => [...prev, { role: "bot", text: res.data.answer }]);

    } catch (error) {
      setMessages((prev) => [...prev, { role: "bot", text: "Sorry, I am having trouble connecting to the brain. 🧠" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      
      {/* Chat Box (Hidden/Visible logic) */}
      {isOpen && (
        <div className="bg-white w-80 h-96 rounded-lg shadow-2xl border border-gray-200 flex flex-col mb-4 overflow-hidden">
          
          {/* Header */}
          <div className="bg-blue-600 text-white p-3 flex justify-between items-center">
            <h3 className="font-bold">🤖 AI Tutor</h3>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200">✕</button>
          </div>

          {/* Subject Selector */}
          <div className="bg-gray-100 p-2 border-b">
            <select 
              value={subject} 
              onChange={(e) => setSubject(e.target.value)}
              className="w-full p-1 rounded border text-sm text-gray-700"
            >
              <option value="Python">Python Programming</option>
              <option value="Physics">Physics</option>
              <option value="Math">Mathematics</option>
              <option value="General">General Doubts</option>
            </select>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-3 overflow-y-auto bg-gray-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`mb-2 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] p-2 rounded-lg text-sm ${
                  msg.role === "user" 
                    ? "bg-blue-500 text-white rounded-br-none" 
                    : "bg-white border text-gray-800 rounded-bl-none shadow-sm"
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && <div className="text-xs text-gray-400 ml-2">Thinking... 🤔</div>}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-2 border-t bg-white flex gap-2">
            <input
              type="text"
              className="flex-1 border rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-500 text-black"
              placeholder="Ask a doubt..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button 
              onClick={sendMessage} 
              disabled={loading}
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 disabled:bg-gray-400"
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* Toggle Button (Hamesha dikhega) */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all transform hover:scale-110 flex items-center justify-center"
      >
        {isOpen ? "⬇️" : "💬 AI Help"}
      </button>
    </div>
  );
}