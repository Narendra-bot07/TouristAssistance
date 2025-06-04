import React, { useState } from 'react';
import axios from 'axios';
import './ChatBot.css'; 
const ChatBot = () => {
  const [messages, setMessages] = useState([
    { from: 'bot', text: "Hello! I'm your travel assistant. Ask me about places or weather!" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { from: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:8000/api/chatbot/', { message: input });
      const botReply = { from: 'bot', text: res.data.reply };
      setMessages(prev => [...prev, botReply]);
    } catch (err) {
      setMessages(prev => [...prev, { from: 'bot', text: 'Sorry, something went wrong!' }]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column h-100">
     
      <div className="flex-grow-1 overflow-auto p-3" style={{ maxHeight: '400px' }}>
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`mb-2 p-3 rounded ${msg.from === 'bot' ? 'bg-light align-self-start' : 'bg-primary text-white align-self-end'}`}
            style={{ maxWidth: '80%', wordWrap: 'break-word' }}
          >
            {msg.text}
          </div>
        ))}
        {loading && (
          <div className="mb-2 p-3 rounded bg-light align-self-start" style={{ maxWidth: '80%' }}>
            Typing...
          </div>
        )}
      </div>

      
      <div className="input-group p-3 border-top">
        <input
          type="text"
          className="form-control"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your message..."
          onKeyPress={e => e.key === 'Enter' && handleSend()}
        />
        <button 
          className="btn btn-primary" 
          onClick={handleSend}
          disabled={loading}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBot;