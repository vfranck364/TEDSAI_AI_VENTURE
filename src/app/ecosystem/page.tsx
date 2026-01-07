'use client';

import React from 'react';
import Link from 'next/link';
import './ecosystem.css';

const Ecosystem = () => {
    const poles = [
        {
            title: 'Intelligence Artificielle',
            icon: 'fa-solid fa-brain',
            color: 'var(--color-ecosystem-secondary)',
            desc: "Le cerveau du complexe. L'IA pilote l'ensemble de l'écosystème : optimisation des stocks, prédiction des récoltes, régulation de l'irrigation et solutions PME.",
            link: '/solutions-ia'
        },
        {
            title: 'Agriculture Urbaine',
            icon: 'fa-solid fa-leaf',
            color: '#2D5A27',
            desc: "Production maraîchère au cœur de Yaoundé. Tomates, laitues et herbes aromatiques 100% traçables. Zéro pesticide, circuit ultra-court.",
            link: '/garden'
        },
        {
            title: 'Élevage Traçable',
            icon: 'fa-solid fa-drumstick-bite',
            color: '#D35400',
            desc: "Poulet et poisson élevés dans des conditions optimales. Traçabilité complète de la naissance à l'assiette pour viTEDia et l'épicerie.",
            link: '/garden'
        },
        {
            title: 'Restaurant viTEDia',
            icon: 'fa-solid fa-utensils',
            color: '#8B1E3F',
            desc: "Gastronomie camerounaise revisitée. Chaque plat raconte l'histoire de ses ingrédients : du jardin à l'assiette en quelques mètres.",
            link: '/vitedia'
        },
        {
            title: 'Épicerie SelecTED',
            icon: 'fa-solid fa-pepper-hot',
            color: '#B68D40',
            desc: "Épices locales et produits frais issus de notre élevage. Circuit court, fraîcheur garantie et prix justes pour tous.",
            link: '/garden'
        }
    ];

    const history = [
        { year: '2021', text: "L'idée naît : et si l'IA pouvait servir le concret ? Lancement de la R&D." },
        { year: '2022', text: "TEDSAI IA signe ses premiers clients PME pour l'automatisation." },
        { year: '2023', text: "Création de SelecTED Gardens : 2 hectares défrichés en ville." },
        { year: '2024', text: "Ouverture de viTEDia et lancement de l'écosystème complet." }
    ];

    return (
        <>
            {/* Hero */}
            <section className="hero" style={{
                backgroundImage: 'linear-gradient(rgba(10,36,99,0.8), rgba(10,36,99,0.5)), url("https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")',
                height: '50vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                color: 'white'
            }}>
                <div className="hero-content container fade-in-up">
                    <h1 style={{ fontSize: '3.5rem', fontWeight: 800 }}>Notre Vision</h1>
                    <p style={{ fontSize: '1.2rem', marginTop: '1rem' }}>Où l'Intelligence Artificielle Rencontre la Nature et la Gastronomie.</p>
                </div>
            </section>

            {/* Narrative Section */}
            <section className="container" style={{ padding: '5rem 0', textAlign: 'center' }}>
                <h2 style={{ fontSize: '2.5rem', color: 'var(--color-ecosystem-primary)', marginBottom: '2rem' }}>Une Boucle Vertueuse</h2>
                <p style={{ maxWidth: '800px', margin: '0 auto', fontSize: '1.15rem', color: '#444', lineHeight: 1.8, textAlign: 'left' }}>
                    TEDSAI Complex n'est pas une simple entreprise, c'est un laboratoire vivant où cinq mondes fusionnent. L'Intelligence Artificielle optimise la production de notre Jardin Urbain et de notre Élevage. Le Jardin et l'Élevage nourrissent notre Restaurant viTEDia et notre Épicerie. Le Restaurant génère des données et des déchets organiques qui retournent alimenter l'IA, le Jardin et l'Élevage. C'est l'économie circulaire à l'ère du numérique.
                </p>
            </section>

            {/* Poles Section */}
            <section style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', padding: '5rem 0' }}>
                <div className="container">
                    <h2 style={{ textAlign: 'center', marginBottom: '4rem', color: 'var(--color-ecosystem-primary)', fontSize: '2.2rem' }}>5 Pôles Interconnectés</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                        {poles.map((pole, idx) => (
                            <div key={idx} className="value-card" style={{ borderTop: `5px solid ${pole.color}`, textAlign: 'left' }}>
                                <i className={`${pole.icon} value-icon`} style={{ color: pole.color }}></i>
                                <h3 style={{ color: 'var(--color-ecosystem-primary)', marginBottom: '1rem' }}>{pole.title}</h3>
                                <p style={{ fontSize: '0.95rem', color: '#555', marginBottom: '1.5rem' }}>{pole.desc}</p>
                                <Link href={pole.link} className="btn-text" style={{ color: pole.color, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                    En savoir plus <i className="fa-solid fa-arrow-right"></i>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* History Timeline */}
            <section style={{ background: '#fff', padding: '5rem 0' }}>
                <div className="container">
                    <h2 style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '2.5rem' }}>Notre Histoire</h2>
                    <div className="timeline">
                        {history.map((item, idx) => (
                            <div key={idx} className={`timeline-item ${idx % 2 === 0 ? 'left' : 'right'}`}>
                                <div className="content">
                                    <h3 style={{ color: 'var(--color-ecosystem-primary)', marginBottom: '0.5rem' }}>{item.year}</h3>
                                    <p style={{ color: '#666' }}>{item.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="container" style={{ padding: '5rem 0' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '4rem', fontSize: '2.5rem' }}>Nos Valeurs</h2>
                <div className="values-grid">
                    <div className="value-card">
                        <i className="fa-solid fa-lightbulb value-icon"></i>
                        <h3>Innovation Pragmatique</h3>
                        <p style={{ color: '#666' }}>L'IA doit résoudre de vrais problèmes du quotidien.</p>
                    </div>
                    <div className="value-card">
                        <i className="fa-solid fa-recycle value-icon"></i>
                        <h3>Durabilité</h3>
                        <p style={{ color: '#666' }}>Zéro déchet, zéro pesticide, circuit 100% court.</p>
                    </div>
                    <div className="value-card">
                        <i className="fa-solid fa-hand-holding-heart value-icon"></i>
                        <h3>Humain d'Abord</h3>
                        <p style={{ color: '#666' }}>La technologie au service de l'épanouissement humain.</p>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Ecosystem;
