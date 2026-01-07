'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import './solutions-ia.css';

const SolutionsIA = () => {
    const [activeTab, setActiveTab] = useState('facturation');

    const handlePlaygroundClick = () => {
        alert("Analyse de la facture en cours... (Ceci est une simulation)");
    };

    return (
        <>
            {/* Hero Section */}
            <section className="hero hero-ia">
                <div className="hero-content container fade-in-up" style={{ textAlign: 'center' }}>
                    <h1>Le Cerveau du Complexe</h1>
                    <p>Intelligence Artificielle pour PME & Optimisation Interne</p>
                </div>
            </section>

            {/* Intro / Vision Section */}
            <section className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
                <h2 style={{ color: 'var(--color-primary)', marginBottom: '2rem' }}>Notre Double Mission</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '900px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'left' }}>
                        <h3 style={{ color: 'var(--color-secondary)' }}>
                            <i className="fa-solid fa-network-wired"></i> <span>Interne</span>
                        </h3>
                        <p>TEDSAI IA pilote l'ensemble du complexe. Gestion des stocks du restaurant, régulation de l'irrigation du jardin, et analyse des flux en temps réel.</p>
                    </div>
                    <div style={{ textAlign: 'left' }}>
                        <h3 style={{ color: 'var(--color-secondary)' }}>
                            <i className="fa-solid fa-briefcase"></i> <span>Externe</span>
                        </h3>
                        <p>Nous mettons cette même puissance technologique au service des PME locales pour automatiser, sécuriser et accélérer leur croissance.</p>
                    </div>
                </div>
            </section>

            {/* Problems Tabs */}
            <section className="container tabs-container">
                <h2 style={{ textAlign: 'center', marginBottom: 'var(--space-md)' }}>Vos Défis, Nos Solutions</h2>

                <div className="tabs-header">
                    <button className={`tab-btn ${activeTab === 'facturation' ? 'active' : ''}`} onClick={() => setActiveTab('facturation')}>🧾 Facturation</button>
                    <button className={`tab-btn ${activeTab === 'stocks' ? 'active' : ''}`} onClick={() => setActiveTab('stocks')}>📦 Stocks</button>
                    <button className={`tab-btn ${activeTab === 'service' ? 'active' : ''}`} onClick={() => setActiveTab('service')}>💬 Service Client</button>
                </div>

                <div className={`tab-content ${activeTab === 'facturation' ? 'active' : ''}`}>
                    <div style={{ display: 'flex', gap: 'var(--space-lg)', flexWrap: 'wrap' }}>
                        <div style={{ flex: 1, min- width: '300px' }}>
                        <h3>Automatisation de la Facturation</h3>
                        <p style={{ marginTop: '1rem' }}>Vos équipes passent 15h/semaine à saisir des factures manuellement ? L'IA TEDSAI scanne, extrait et intègre automatiquement vos factures dans votre ERP.</p>
                        <ul style={{ marginTop: '1rem', list- style: 'circle', paddingLeft: '1.5rem' }}>
                        <li>Reconnaissance OCR 99.8%</li>
                        <li>Intégration Sage, QuickBooks, Odoo</li>
                        <li>Détection des erreurs et doublons</li>
                    </ul>
                </div>
                <div style={{ flex: 1, min- width: '300px', background: '#f0f4f8', padding: 'var(--space-md)', borderRadius: '8px' }}>
                <h4>Résultats Client</h4>
                <p><strong>Supermarché Local :</strong></p>
                <p className="stats" style={{ color: 'var(--color-secondary)' }}>
                    <span>ROI :</span>
                    <span>5 500 000 FCFA économisés/an</span>
                </p>
                <p>Temps de gestion divisé par 8.</p>
            </div>
        </div >
        </div >

        <div className={`tab-content ${activeTab === 'stocks' ? 'active' : ''}`}>
          <h3>Gestion Intelligente des Stocks</h3>
          <p>Anticipez la demande et réduisez le gaspillage grâce à nos algorithmes prédictifs.</p>
        </div>

        <div className={`tab-content ${activeTab === 'service' ? 'active' : ''}`}>
          <h3>Service Client 360°</h3>
          <p>Chatbots intelligents disponibles 24/7 pour répondre à vos clients instantanément.</p>
        </div>
      </section >

    {/* AI Playground Simulation */ }
    < section id = "playground" style = {{ background: '#eef2f6', padding: 'var(--space-xl) 0', marginTop: 'var(--space-xl)', textAlign: 'center' }}>
        <div className="container">
            <h2>IA Playground</h2>
            <p>Testez notre technologie OCR en temps réel (Simulation).</p>
            <div style={{ background: 'white', width: '100%', maxWidth: '600px', height: '300px', margin: '2rem auto', border: '2px dashed #ccc', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', borderRadius: '8px' }}>
                <p style={{ color: '#888' }}><i className="fa-solid fa-cloud-upload-alt fa-2x"></i><br /><span>Glissez une facture ici (Démo)</span></p>
            </div>
            <button className="btn btn-primary" onClick={handlePlaygroundClick}>Lancer l'analyse</button>
        </div>
      </section >

    {/* Pricing Section */ }
    < section className = "container" style = {{ padding: '4rem 0' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '3rem', color: 'var(--color-primary)' }}>Débuter maintenant</h2>
        
        <div className="pricing-grid">
          <div className="pricing-card">
            <h3>Starter</h3>
            <div className="price">325 000 FCFA<span style={{ fontSize: '1rem', color: '#666' }}>/mois</span></div>
            <p>Pour PME 1-10 employés</p>
            <Link href="/contact?plan=starter" className="btn btn-secondary" style={{ marginTop: 'var(--space-md)', display: 'inline-block' }}>Choisir</Link>
          </div>

          <div className="pricing-card featured">
            <div style={{ background: 'var(--color-secondary)', color: 'white', position: 'absolute', top: 0, left: 0, width: '100%', padding: '4px', fontSize: '0.8rem', fontWeight: 'bold', borderRadius: '8px 8px 0 0' }}>POPULAIRE</div>
            <h3 style={{ marginTop: '1.5rem' }}>Business</h3>
            <div className="price">850 000 FCFA<span style={{ fontSize: '1rem', color: '#666' }}>/mois</span></div>
            <p>Pour PME 10-50 employés</p>
            <Link href="/contact?plan=business" className="btn btn-primary" style={{ marginTop: 'var(--space-md)', display: 'inline-block' }}>Choisir</Link>
          </div>

          <div className="pricing-card">
            <h3>Enterprise</h3>
            <div className="price">Sur Devis</div>
            <p>Pour +50 employés</p>
            <Link href="/contact?plan=enterprise" className="btn btn-secondary" style={{ marginTop: 'var(--space-md)', display: 'inline-block' }}>Contacter</Link>
          </div>
        </div>
      </section >

    {/* Resources Section */ }
    < section className = "container" style = {{ padding: '4rem 0', background: '#f9f9f9', borderRadius: '12px', marginBottom: '4rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Ressources Utiles</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          <div className="pricing-card" style={{ textAlign: 'left' }}>
            <i className="fa-solid fa-file-pdf" style={{ color: '#e74c3c', fontSize: '2rem', marginBottom: '1rem' }}></i>
            <h3>Livre Blanc IA & PME</h3>
            <p>Guide complet pour digitaliser votre entreprise au Cameroun.</p>
            <button className="btn-text" style={{ color: 'var(--color-primary)', fontWeight: 600, border: 'none', background: 'none', cursor: 'pointer', padding: 0, marginTop: '1rem' }}>Télécharger (PDF)</button>
          </div>
          <div className="pricing-card" style={{ textAlign: 'left' }}>
            <i className="fa-solid fa-file-excel" style={{ color: '#27ae60', fontSize: '2rem', marginBottom: '1rem' }}></i>
            <h3>Calculateur ROI</h3>
            <p>Fichier Excel pour calculer la rentabilité de l'automatisation.</p>
            <button className="btn-text" style={{ color: 'var(--color-primary)', fontWeight: 600, border: 'none', background: 'none', cursor: 'pointer', padding: 0, marginTop: '1rem' }}>Télécharger (XLS)</button>
          </div>
        </div>
      </section >
    </>
  );
};

export default SolutionsIA;
