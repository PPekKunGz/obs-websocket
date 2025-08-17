'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  message: string;
  status: 'pending' | 'queued' | 'processing' | 'sent';
}

const Home: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // เชื่อมต่อ WebSocket
    socketRef.current = new WebSocket('ws://localhost:8080');

    socketRef.current.onopen = () => {
      console.log('Connected to WebSocket server');
    };

    socketRef.current.onmessage = (event) => {
      const update = JSON.parse(event.data);
      setMessages((prev) => {
        const existing = prev.find((m) => m.id === update.id);
        if (existing) {
          // Update สถานะถ้ามี ID เดียวกัน
          return prev.map((m) =>
            m.id === update.id ? { ...m, status: update.status } : m
          );
        } else {
          // Append ถ้าเป็นข้อความใหม่ (จากคนอื่น)
          return [...prev, { id: update.id, message: update.message, status: update.status }];
        }
      });
    };

    socketRef.current.onclose = () => {
      console.log('Disconnected from WebSocket server');
    };

    return () => {
      socketRef.current?.close();
    };
  }, []);

  const sendMessage = () => {
    if (message && socketRef.current?.readyState === WebSocket.OPEN) {
      const id = crypto.randomUUID(); // Generate UUID สำหรับ ID
      const data = JSON.stringify({ id, message });
      socketRef.current.send(data);

      // Append ข้อความของตัวเองด้วยสถานะ pending
      setMessages((prev) => [...prev, { id, message, status: 'pending' }]);

      setMessage('');
    }
  };

  // Handle enter key press for sending messages
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // หาข้อความที่กำลัง processing สำหรับ animation
  const currentProcessing = messages.find((m) => m.status === 'processing');

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-6">ส่งข้อความไป OBS</h1>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="พิมพ์ข้อความที่นี่..."
          className="p-2 border rounded-md w-80"
          onKeyDown={handleKeyPress}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          ส่ง
        </button>
      </div>
      <div className="w-full max-w-md mb-4">
        <h2 className="text-xl font-semibold mb-2">ประวัติข้อความ</h2>
        <ul className="bg-white p-4 rounded-md shadow-md max-h-60 overflow-y-auto">
          {messages.map((msg) => (
            <li key={msg.id} className="mb-2 flex justify-between">
              <span>{msg.message}</span>
              <span className="text-sm text-gray-500">
                {msg.status === 'pending' ? 'กำลังส่ง...' :
                 msg.status === 'queued' ? 'queued' :
                 msg.status === 'processing' ? 'processing' :
                 'ส่งแล้ว'}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="w-full max-w-md">
        <AnimatePresence>
          {currentProcessing && (
            <motion.div
              key={currentProcessing.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-4 rounded-md shadow-md mb-2"
            >
              {currentProcessing.message}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Home;