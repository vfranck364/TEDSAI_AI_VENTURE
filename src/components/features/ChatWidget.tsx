'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ChatMessage } from '@/types';
import { useAuth } from '@/context/AuthContext';

const ChatWidget = () => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [history, setHistory] = useState<ChatMessage[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const [sessionId] = useState(() => {
        // Simple session ID for now, can be improved or synced with DB
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('ted_session_id');
            if (saved) return saved;
            const newId = crypto.randomUUID();
            localStorage.setItem('ted_session_id', newId);
            return newId;
        }
        return '';
    });
    const chatBodyRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
    }, [history, isTyping]);

    const toggleChat = () => setIsOpen(!isOpen);

    const handleSendMessage = async (e?: React.FormEvent, presetMessage?: string) => {
        if (e) e.preventDefault();

        const textToSend = presetMessage || message;
        if (!textToSend.trim()) return;

        const userMessage: ChatMessage = {
            role: 'user',
            content: textToSend,
            timestamp: new Date(),
        };

        setHistory((prev) => [...prev, userMessage]);
        setMessage('');
        setIsTyping(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: textToSend,
                    history: history,
                    userId: user?.uid || 'anonymous',
                    sessionId: sessionId,
                }),
            });

            const data = await response.json();

            if (data.response) {
                const assistantMessage: ChatMessage = {
                    role: 'assistant',
                    content: data.response,
                    timestamp: new Date(),
                };
                setHistory((prev) => [...prev, assistantMessage]);
            }
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="ted-widget">
            {/* Bouton Flottant */}
            <button className="ted-button" onClick={toggleChat} title="Discuter avec TED">
                <img src="/assets/images/logos/tedsai_logo.jpg" alt="TED" />
            </button>

            {/* Fenêtre de Chat */}
            <div className={`ted-chat-window ${isOpen ? 'active' : ''}`}>
                <div className="ted-chat-header">
                    <div className="ted-chat-header-info">
                        <img src="/assets/images/logos/tedsai_logo.jpg" alt="TED Assistant" />
                        <div>
                            <h3>TED Assistant</h3>
                            <p>En ligne • IA Automatisée</p>
                        </div>
                    </div>
                    <button className="ted-close-btn" onClick={toggleChat}>
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <div className="ted-chat-body" ref={chatBodyRef}>
                    {history.length === 0 && (
                        <div className="ted-message ted">
                            <div className="ted-message-content">
                                Bonjour ! Je suis TED, votre assistant intelligent. Comment puis-je vous aider aujourd'hui ?
                                <div className="ted-scenarios">
                                    <button className="ted-scenario-btn" onClick={() => handleSendMessage(undefined, "Quels sont vos services IA ?")}>
                                        <i className="fa-solid fa-brain"></i> Services IA
                                    </button>
                                    <button className="ted-scenario-btn" onClick={() => handleSendMessage(undefined, "Je veux réserver au restaurant")}>
                                        <i className="fa-solid fa-utensils"></i> Restaurant viTEDia
                                    </button>
                                    <button className="ted-scenario-btn" onClick={() => handleSendMessage(undefined, "Qu'est-ce que le SelecTED Garden ?")}>
                                        <i className="fa-solid fa-leaf"></i> SelecTED Garden
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {history.map((msg, idx) => (
                        <div key={idx} className={`ted-message ${msg.role === 'assistant' ? 'ted' : 'user'}`}>
                            <div className="ted-message-content">
                                {msg.content}
                            </div>
                        </div>
                    ))}

                    {isTyping && (
                        <div className="ted-message ted">
                            <div className="ted-typing">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    )}
                </div>

                <form className="ted-chat-footer" onSubmit={handleSendMessage}>
                    <input
                        type="text"
                        className="ted-input"
                        placeholder="Écrivez votre message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <button type="submit" className="ted-send-btn">
                        <i className="fa-solid fa-paper-plane"></i>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatWidget;
