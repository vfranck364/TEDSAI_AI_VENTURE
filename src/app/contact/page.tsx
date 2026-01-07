'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import './contact.css';

const Contact = () => {
    const [interest, setInterest] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulation of form submission
        setTimeout(() => {
            setSubmitted(true);
            setIsSubmitting(false);
        }, 1500);
    };

    return (
        <>
            <section className="hero" style={{ background: 'var(--color-text-dark)', height: '40vh', minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: 'white' }}>
                <div className="hero-content container fade-in-up">
                    <h1 style={{ fontSize: '3.5rem', fontWeight: 800 }}>Contactez-nous</h1>
                    <p style={{ fontSize: '1.2rem' }}>Nous sommes là pour vous aider</p>
                </div>
            </section>

            <section className="container contact-grid">
                <div className="contact-form-container">
                    {submitted ? (
                        <div style={{ textAlign: 'center', padding: '3rem' }}>
                            <i className="fa-solid fa-paper-plane" style={{ fontSize: '4rem', color: 'var(--color-primary)', marginBottom: '1.5rem' }}></i>
                            <h2>Message Envoyé !</h2>
                            <p>Merci pour votre message. Notre équipe reviendra vers vous dans les plus brefs délais.</p>
                            <button className="btn btn-primary" onClick={() => setSubmitted(false)} style={{ marginTop: '2rem' }}>Envoyer un autre message</button>
                        </div>
                    ) : (
                        <>
                            <h3 style={{ marginBottom: '2rem', fontSize: '1.5rem' }}>Envoyez-nous un message</h3>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>Je suis intéressé par :</label>
                                    <select value={interest} onChange={(e) => setInterest(e.target.value)} required>
                                        <option value="">-- Sélectionnez --</option>
                                        <option value="ia">Solution IA pour mon entreprise</option>
                                        <option value="resto">Réservation viTEDia</option>
                                        <option value="garden">Partenariat SelecTED Gardens</option>
                                        <option value="other">Autre demande</option>
                                    </select>
                                </div>

                                {interest === 'ia' && (
                                    <div className="fade-in" style={{ padding: '1rem', background: '#f8fafc', borderRadius: '8px', marginBottom: '1.5rem' }}>
                                        <div className="form-group">
                                            <label>Nom de l'entreprise</label>
                                            <input type="text" placeholder="Votre société" required />
                                        </div>
                                        <div className="form-group">
                                            <label>Problématique Principale</label>
                                            <select required>
                                                <option>Automatisation Facturation</option>
                                                <option>Gestion Stocks</option>
                                                <option>Service Client</option>
                                                <option>Autre</option>
                                            </select>
                                        </div>
                                    </div>
                                )}

                                {interest === 'resto' && (
                                    <div className="fade-in" style={{ padding: '1rem', background: '#fffbeb', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid #fcd34d' }}>
                                        <p>Pour réserver une table, vous pouvez utiliser notre <Link href="/vitedia#reservation" style={{ color: '#8B1E3F', fontWeight: 'bold', textDecoration: 'underline' }}>module de réservation dédié</Link> pour une confirmation immédiate.</p>
                                    </div>
                                )}

                                <div className="form-group">
                                    <label>Nom Complet</label>
                                    <input type="text" placeholder="Votre nom" required />
                                </div>

                                <div className="form-group">
                                    <label>Email professionnel</label>
                                    <input type="email" placeholder="votre@email.com" required />
                                </div>

                                <div className="form-group">
                                    <label>Message</label>
                                    <textarea rows={5} placeholder="Comment pouvons-nous vous aider ?" required></textarea>
                                </div>

                                <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ width: '100%', padding: '15px' }}>
                                    {isSubmitting ? 'Envoi en cours...' : 'Envoyer le Message'}
                                </button>
                            </form>
                        </>
                    )}
                </div>

                <div className="contact-info">
                    <h3 style={{ marginBottom: '2rem', fontSize: '1.5rem', textAlign: 'left' }}>Nos Coordonnées</h3>

                    <div className="info-card">
                        <div className="info-icon"><i className="fa-solid fa-location-dot"></i></div>
                        <div>
                            <h4 style={{ fontSize: '0.9rem', color: '#64748b' }}>ADRESSE</h4>
                            <p style={{ fontWeight: 600 }}>TEDSAI Complex, Yaoundé, Cameroun</p>
                        </div>
                    </div>

                    <div className="info-card">
                        <div className="info-icon"><i className="fa-solid fa-envelope"></i></div>
                        <div>
                            <h4 style={{ fontSize: '0.9rem', color: '#64748b' }}>EMAIL</h4>
                            <p style={{ fontWeight: 600 }}>contact@tedsai.cm</p>
                        </div>
                    </div>

                    <div className="info-card">
                        <div className="info-icon"><i className="fa-solid fa-phone"></i></div>
                        <div>
                            <h4 style={{ fontSize: '0.9rem', color: '#64748b' }}>TÉLÉPHONE</h4>
                            <p style={{ fontWeight: 600 }}>+237 683 121 654</p>
                        </div>
                    </div>

                    <div className="map-container">
                        <iframe
                            src="https://maps.google.com/maps?q=3.814343,11.476492&hl=fr&z=15&output=embed"
                            allowFullScreen={true}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                            <a href="https://maps.app.goo.gl/PAqnePyormGahFcW9" target="_blank" rel="noreferrer" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                <i className="fa-solid fa-map-location-dot"></i> Itinéraire Google Maps
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Contact;
