'use client';

import React, { useState } from 'react';
import './garden.css';

const Garden = () => {
    const [traceCode, setTraceCode] = useState('');
    const [showResult, setShowResult] = useState(false);

    const handleTrace = (e: React.FormEvent) => {
        e.preventDefault();
        if (traceCode.trim()) {
            setShowResult(true);
            setTimeout(() => {
                const element = document.getElementById('trace-result');
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
        }
    };

    const products = [
        { icon: 'fa-solid fa-pepper-hot', name: 'Épices Rares', desc: 'Poivre de Penja, Gingembre, Curcuma bio.' },
        { icon: 'fa-solid fa-leaf', name: 'Légumes Feuilles', desc: 'Ndolé, Biteskout, Basilic frais.' },
        { icon: 'fa-solid fa-carrot', name: 'Maraîchage', desc: 'Tomates, Carottes, Poivrons sans pesticides.' },
        { icon: 'fa-solid fa-egg', name: 'Élevage Local', desc: 'Poulets fermiers et œufs du jour.' }
    ];

    return (
        <>
            {/* Hero */}
            <section className="hero-garden">
                <div className="container hero-content fade-in-up">
                    <h1 style={{ fontSize: '3.5rem', fontWeight: 800 }}>La Base Agricole du Complexe</h1>
                    <p style={{ fontSize: '1.5rem', marginTop: '1rem' }}>Production Locale • Élevage • Traçabilité Totale</p>
                </div>
            </section>

            {/* Production Section */}
            <section className="container" style={{ padding: '4rem 0' }}>
                <h2 style={{ text- align: 'center', color: 'var(--color-garden-primary)', marginBottom: '3rem', fontSize: '2.5rem' }}>Notre Production</h2>
            <div className="prod-grid">
                {products.map((prod, idx) => (
                    <div key={idx} className="prod-card">
                        <div className="prod-icon">
                            <i className={prod.icon}></i>
                        </div>
                        <h3 style={{ marginBottom: '1rem', color: 'var(--color-garden-primary)' }}>{prod.name}</h3>
                        <p style={{ color: '#666' }}>{prod.desc}</p>
                    </div>
                ))}
            </div>
        </section >

            {/* Traceability Section */ }
            < section className = "traceability-section" >
                <div className="container">
                    <h2 style={{ fontSize: '2.2rem', marginBottom: '1.5rem', color: 'var(--color-garden-primary)' }}>Suivez le Parcours de Votre Ingrédient</h2>
                    <p style={{ marginBottom: '2rem', fontSize: '1.1rem' }}>Entrez le code produit présent sur votre ticket ou étiquette.</p>

                    <form onSubmit={handleTrace} style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
                        <input
                            type="text"
                            className="trace-input"
                            placeholder="Ex: TOM-131224-B3"
                            value={traceCode}
                            onChange={(e) => setTraceCode(e.target.value)}
                            required
                        />
                        <button type="submit" className="btn-garden">Tracer</button>
                    </form>

                    <div style={{ marginTop: '2rem' }}>
                        <button
                            onClick={() => alert('Ouverture de la caméra... (Simulation)')}
                            style={{ color: 'var(--color-garden-primary)', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' }}
                        >
                            <i className="fa-solid fa-qrcode"></i> Ou scannez un QR Code
                        </button>
                    </div>
                </div>

    {
        showResult && (
            <div id="trace-result" className="trace-result-container">
                <h3 style={{ color: 'var(--color-garden-primary)', textAlign: 'center', marginBottom: '2rem', fontSize: '1.8rem' }}>Résultat de la Traçabilité</h3>
                <div style={{ borderBottom: '2px solid #eee', paddingBottom: '1rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>🍅 Tomate Cœur de Bœuf Bio</span>
                    <span style={{ color: '#666' }}>Code: {traceCode}</span>
                </div>

                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr' }}>
                        <span style={{ color: '#888', fontWeight: 600 }}>ORIGINE</span>
                        <span><strong>Serre #2, Parcelle B3</strong></span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr' }}>
                        <span style={{ color: '#888', fontWeight: 600 }}>PLANTATION</span>
                        <span>15 Septembre 2024 (Semences BioDom)</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr' }}>
                        <span style={{ color: '#888', fontWeight: 600 }}>RÉCOLTE</span>
                        <span>13 Décembre 2024 (Jean K.)</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr' }}>
                        <span style={{ color: '#888', fontWeight: 600 }}>LIVRAISON</span>
                        <span style={{ color: 'green', font_weight: 'bold' }}>50 mètres vers viTEDia</span>
                    </div>
                </div>

                <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
                    <button
                        className="btn btn-secondary"
                        onClick={() => alert('Génération du PDF... (Simulation)')}
                    >
                        Télécharger Certificat
                    </button>
                </div>
            </div>
        )
    }
      </section >

    {/* Sustainable Section */ }
    < section className = "container" style = {{ padding: '5rem 0', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <i className="fa-solid fa-recycle" style={{ fontSize: '3rem', color: 'var(--color-garden-primary)', marginBottom: '1.5rem' }}></i>
            <h2 style={{ marginBottom: '1.5rem' }}>Économie Circulaire</h2>
            <p style={{ fontSize: '1.1rem', color: '#555', lineHeight: 1.6 }}>
                Rien ne se perd, tout se transforme. Les biodéchets du restaurant viTEDia sont compostés pour enrichir les sols du SelecTED Garden. L'eau de pluie est collectée et filtrée par IA pour optimiser l'irrigation goutte-à-goutte.
            </p>
        </div>
      </section >
    </>
  );
};

export default Garden;
