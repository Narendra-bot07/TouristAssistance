import React, { useState } from 'react';
import { FaRobot, FaTimes } from 'react-icons/fa';
import './ChatBotIcon.css'; // You might not need this if you use only Bootstrap
import ChatBot from '../ChatBot/ChatBot';

const ChatBotIcon = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="position-fixed bottom-0 end-0 mb-4 me-4" style={{ zIndex: 1000 }}>
      {isOpen && (
        <div className="card shadow-lg" style={{ width: '350px', maxWidth: '90vw', height: '500px', maxHeight: '80vh' }}>
          <div className="card-header d-flex justify-content-between align-items-center bg-primary text-white">
            <h5 className="mb-0">Travel Assistant</h5>
            <button 
              onClick={() => setIsOpen(false)} 
              className="btn btn-sm btn-light"
              aria-label="Close chat"
            >
              <FaTimes />
            </button>
          </div>
          <div className="card-body p-0 d-flex flex-column">
            <ChatBot />
          </div>
        </div>
      )}
      <button
        className="btn btn-primary rounded-circle p-3"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Chatbot"
        style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }}
      >
        <FaRobot size={24} />
      </button>
    </div>
  );
};

export default ChatBotIcon;