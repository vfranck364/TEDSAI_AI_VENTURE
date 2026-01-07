'use client';

import React, { useState } from 'react';
import './observatoire.css';

const Observatoire = () => {
    const [filter, setFilter] = useState('all');
    const [posts, setPosts] = useState([
        {
            id: 1,
            category: 'IA',
            title: "L'IA au secours de l'agriculture camerounaise",
            excerpt: "Comment les algorithmes prédictifs transforment la gestion des récoltes...",
            author: "Dr. Hamadou",
            date: "24 Dec 2025",
            likes: 42,
            comments: 5,
            img: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 2,
            category: 'Économie',
            title: "Impact du digital sur le PIB du Cameroun",
            excerpt: "Analyse des secteurs porteurs et des freins à l'innovation technologique...",
            author: "Tedsai Research",
            date: "20 Dec 2025",
            likes: 128,
            comments: 12,
            img: "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 3,
            category: 'Gastronomie',
            title: "La traçabilité : nouvel argument de vente",
            excerpt: "Pourquoi les consommateurs privilégient désormais la transparence sur l'origine...",
            author: "Chef Kotto",
            date: "15 Dec 2025",
            likes: 85,
            comments: 8,
            img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        }
    ]);

    const filteredPosts = filter === 'all' ? posts : posts.filter(p => p.category === filter);

    const categories = ['all', 'IA', 'Économie', 'Gastronomie', 'Agro-Tech'];

    const handleLike = (id: number) => {
        setPosts(prev => prev.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
    };

    return (
        <>
            {/* Hero */}
            <section className="obs-hero-v2">
                <div className="hero-container container">
                    <div className="hero-text">
                        <h1>Nos Analyses & Insights</h1>
                        <p>Découvrez les tendances deep-tech, agro-pastorales et économiques qui façonnent l'Afrique de demain. Données réelles, impact concret.</p>
                    </div>
                    <div className="hero-image" style={{ display: 'block' }}>
                        <img src="https://img.freepik.com/free-vector/blogging-concept-illustration_114360-1038.jpg?w=800" alt="Analyses" style={{ maxWidth: '400px', borderRadius: '20px' }} />
                    </div>
                </div>
            </section>

            {/* Category Nav */}
            <div className="category-nav">
                <div className="pills-container container">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`pill ${filter === cat ? 'active' : ''}`}
                            onClick={() => setFilter(cat)}
                        >
                            {cat === 'all' ? 'Tous' : cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <div className="container">
                <div className="obs-grid">
                    {filteredPosts.map(post => (
                        <div key={post.id} className="obs-card">
                            <div className="card-img">
                                <img src={post.img} alt={post.title} />
                                <span className="category-badge">{post.category}</span>
                            </div>
                            <div className="card-body">
                                <div className="card-meta">Par {post.author} • {post.date}</div>
                                <h3 className="card-title">{post.title}</h3>
                                <p className="card-excerpt">{post.excerpt}</p>
                            </div>
                            <div className="card-social">
                                <button className="social-btn" onClick={() => handleLike(post.id)}>
                                    <i className="fa-solid fa-heart"></i> {post.likes}
                                </button>
                                <button className="social-btn">
                                    <i className="fa-solid fa-comment"></i> {post.comments}
                                </button>
                                <button className="social-btn">
                                    <i className="fa-solid fa-share-nodes"></i>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* FAB Submition */}
            <button className="fab-submit" onClick={() => alert("Ouverture de l'éditeur... (Simulation)")} title="Proposer un article">
                <i className="fa-solid fa-plus fa-xl"></i>
            </button>
        </>
    );
};

export default Observatoire;
