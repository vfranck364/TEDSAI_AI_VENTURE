'use client';

import React, { useState } from 'react';
import './vitedia.css';
import { db } from '@/lib/firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const ViTEDia = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '12:00',
        guests: '2',
        occasion: '',
        special: '',
        payment: 'spot'
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        const key = id.replace('res-', '');
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleReservation = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await addDoc(collection(db, 'reservations'), {
                ...formData,
                status: 'pending',
                createdAt: serverTimestamp()
            });
            setSubmitted(true);
        } catch (error) {
            console.error('Error saving reservation:', error);
            alert("Une erreur est survenue lors de la réservation. Veuillez réessayer.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            {/* Hero */}
            <section className="hero-rest">
                <div className="container fade-in-up" style={{ textAlign: 'center' }}>
                    <h1 style={{ fontSize: '4rem', fontWeight: 800 }}>Bon. Propre. Rapide.</h1>
                    <p style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Le goût de l'excellence, la traçabilité en plus.</p>
                    <a href="#reservation" className="btn btn-primary" style={{ backgroundColor: 'var(--color-vitedia-primary)', border: 'none' }}>
                        Réserver une table
                    </a>
                </div>
            </section>

            {/* Concept Section */}
            <section className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
                <h2 style={{ color: 'var(--color-vitedia-primary)', marginBottom: '1rem' }}>Une Odyssée Culinaire</h2>
                <p style={{ maxWidth: '800px', margin: '0 auto', fontSize: '1.1rem', color: '#555' }}>
                    viTEDia célèbre la diversité des dix régions du Cameroun. Nos chefs revisitent les classiques avec une touche moderne, en utilisant exclusivement des produits de notre jardin urbain. C'est la rencontre entre la tradition ancestrale et l'innovation de TEDSAI.
                </p>
            </section>

            {/* Menu Section */}
            <section className="menu-section">
                <div className="container">
                    <div className="menu-card">
                        <h2 style={{ marginBottom: '2.5rem', color: 'var(--color-vitedia-primary)', fontSize: '2.5rem' }}>Menu du Jour</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', textAlign: 'left' }}>
                            <div>
                                <h3 style={{ borderBottom: '2px solid #eee', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Entrées</h3>
                                <ul style={{ listStyle: 'none', padding: 0 }}>
                                    <li style={{ marginBottom: '1rem' }}>
                                        <strong>Ndolé Gastronomique</strong> <span style={{ float: 'right', color: 'var(--color-vitedia-primary)' }}>3 500 F</span>
                                        <p style={{ fontSize: '0.85rem', color: '#777' }}>Version légère aux crevettes de Kribi</p>
                                    </li>
                                    <li>
                                        <strong>Carpaccio d'Ananas & Épices</strong> <span style={{ float: 'right', color: 'var(--color-vitedia-primary)' }}>2 500 F</span>
                                        <p style={{ fontSize: '0.85rem', color: '#777' }}>Épices SelecTED, basilic du jardin</p>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h3 style={{ borderBottom: '2px solid #eee', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Plats</h3>
                                <ul style={{ listStyle: 'none', padding: 0 }}>
                                    <li style={{ marginBottom: '1rem' }}>
                                        <strong>Poulet DG Déstructuré</strong> <span style={{ float: 'right', color: 'var(--color-vitedia-primary)' }}>7 500 F</span>
                                        <p style={{ fontSize: '0.85rem', color: '#777' }}>Légumes croquants SelecTED Garden</p>
                                    </li>
                                    <li>
                                        <strong>Filet de Capitaine Braisé</strong> <span style={{ float: 'right', color: 'var(--color-vitedia-primary)' }}>8 500 F</span>
                                        <p style={{ fontSize: '0.85rem', color: '#777' }}>Purée de plantain mûr truffée</p>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h3 style={{ borderBottom: '2px solid #eee', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Desserts</h3>
                                <ul style={{ listStyle: 'none', padding: 0 }}>
                                    <li style={{ marginBottom: '1rem' }}>
                                        <strong>Mousse Chocolat & Piment</strong> <span style={{ float: 'right', color: 'var(--color-vitedia-primary)' }}>3 000 F</span>
                                        <p style={{ fontSize: '0.85rem', color: '#777' }}>Cacao pur du Centre, pointe de piment</p>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <button className="btn btn-secondary" style={{ marginTop: '3rem' }}>Voir la Carte Complète</button>
                    </div>
                </div>
            </section>

            {/* Reservation Section */}
            <section className="reservation-section" id="reservation">
                <div className="container">
                    <div className="reservation-form-container">
                        {submitted ? (
                            <div style={{ textAlign: 'center', padding: '2rem' }}>
                                <i className="fa-solid fa-circle-check" style={{ fontSize: '4rem', color: 'green', marginBottom: '1rem' }}></i>
                                <h3>Réservation Reçue !</h3>
                                <p>Merci {formData.name}, nous avons bien reçu votre demande pour le {formData.date} à {formData.time}. Un membre de notre équipe vous contactera pour confirmer.</p>
                                <button className="btn btn-primary" onClick={() => setSubmitted(false)} style={{ marginTop: '2rem' }}>Faire une autre réservation</button>
                            </div>
                        ) : (
                            <>
                                <h3 style={{ textAlign: 'center', color: 'var(--color-vitedia-primary)', marginBottom: '2rem', fontSize: '1.8rem' }}>Réserver une Table</h3>
                                <form onSubmit={handleReservation}>
                                    <div className="form-group">
                                        <label htmlFor="res-name">Nom Complet</label>
                                        <input type="text" id="res-name" required placeholder="Votre nom" value={formData.name} onChange={handleChange} />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="res-phone">Téléphone</label>
                                        <input type="tel" id="res-phone" required placeholder="Ex: 6xxxxx" value={formData.phone} onChange={handleChange} />
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group" style={{ flex: 1 }}>
                                            <label htmlFor="res-date">Date</label>
                                            <input type="date" id="res-date" required value={formData.date} onChange={handleChange} />
                                        </div>
                                        <div className="form-group" style={{ flex: 1 }}>
                                            <label htmlFor="res-time">Heure</label>
                                            <select id="res-time" required value={formData.time} onChange={handleChange}>
                                                <option value="12:00">12:00</option>
                                                <option value="12:30">12:30</option>
                                                <option value="13:00">13:00</option>
                                                <option value="13:30">13:30</option>
                                                <option value="19:00">19:00</option>
                                                <option value="19:30">19:30</option>
                                                <option value="20:00">20:00</option>
                                                <option value="20:30">20:30</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="res-guests">Nombre de personnes</label>
                                        <select id="res-guests" value={formData.guests} onChange={handleChange}>
                                            {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                                                <option key={n} value={n.toString()}>{n} Personne{n > 1 ? 's' : ''}</option>
                                            ))}
                                            <option value="plus">Plus de 8 personnes</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="res-payment">Mode de Paiement (Acompte)</label>
                                        <select id="res-payment" required value={formData.payment} onChange={handleChange}>
                                            <option value="spot">Paiement sur place</option>
                                            <option value="momo">Mobile Money (Orange/MTN)</option>
                                        </select>
                                    </div>

                                    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                                        <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ backgroundColor: 'var(--color-vitedia-primary)', border: 'none', padding: '12px 30px', cursor: isSubmitting ? 'not-allowed' : 'pointer' }}>
                                            {isSubmitting ? 'Traitement...' : 'Confirmer la Réservation'}
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
};

export default ViTEDia;
