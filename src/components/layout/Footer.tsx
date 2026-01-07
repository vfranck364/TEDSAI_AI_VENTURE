import React from 'react';
import Link from 'next/link';

const Footer = () => {
    return (
        <footer className="pro-footer">
            <div className="container">
                {/* 5️⃣ Bloc Call To Action (Banner) */}
                <div className="footer-cta-banner fade-in-up">
                    <h3>Prêt à automatiser votre avenir ?</h3>
                    <p>Discutez avec notre agent IA ou demandez un devis personnalisé pour vos projets.</p>
                    <div className="footer-cta-buttons">
                        <Link href="/contact" className="btn btn-primary">Demander un devis</Link>
                        <button className="btn btn-secondary" style={{ color: 'white', borderColor: 'white' }}>
                            Discuter avec l'IA
                        </button>
                    </div>
                </div>

                <div className="footer-main">
                    {/* 1️⃣ Bloc Identité & Branding */}
                    <div className="footer-col footer-identity">
                        <div className="footer-logo">
                            <img src="/assets/images/logos/tedsai_logo.jpg" alt="TEDSAI Logo" />
                        </div>
                        <div className="footer-slogan">
                            <strong>TEDSAI Complex</strong><br />
                            <em>Automatisation intelligente & solutions IA sur mesure.</em>
                            <p style={{ marginTop: '1rem', fontSize: '0.9rem', opacity: 0.8 }}>
                                Un écosystème unifié pour propulser l'Afrique vers l'industrie 4.0.
                            </p>
                        </div>
                        <div className="social-links">
                            <a href="https://www.linkedin.com/in/tedsai-complex-a26b95397" target="_blank" rel="noreferrer" className="social-icon" title="LinkedIn"><i className="fa-brands fa-linkedin-in"></i></a>
                            <a href="https://www.instagram.com/tedsai1385/" target="_blank" rel="noreferrer" className="social-icon" title="Instagram"><i className="fa-brands fa-instagram"></i></a>
                            <a href="https://x.com/Tedsai1385" target="_blank" rel="noreferrer" className="social-icon" title="X (Twitter)"><i className="fa-brands fa-twitter"></i></a>
                            <a href="https://www.facebook.com/profile.php?id=61584073655708" target="_blank" rel="noreferrer" className="social-icon" title="Facebook"><i className="fa-brands fa-facebook"></i></a>
                            <a href="https://www.youtube.com/@TEDSAIComplex" target="_blank" rel="noreferrer" className="social-icon" title="YouTube"><i className="fa-brands fa-youtube"></i></a>
                        </div>
                    </div>

                    {/* 2️⃣ Bloc Navigation rapide */}
                    <div className="footer-col">
                        <h4>Navigation</h4>
                        <ul className="footer-links-list">
                            <li><Link href="/">Accueil</Link></li>
                            <li><Link href="/a-propos">À Propos</Link></li>
                            <li><Link href="/solutions-ia">Solutions IA</Link></li>
                            <li><Link href="/vitedia">Restaurant viTEDia</Link></li>
                            <li><Link href="/garden">SelecTED Gardens</Link></li>
                            <li><Link href="/ecosystem">L'Écosystème</Link></li>
                            <li><Link href="/contact">Contact</Link></li>
                        </ul>
                    </div>

                    {/* 3️⃣ Bloc Services / Solutions */}
                    <div className="footer-col">
                        <h4>Nos Services</h4>
                        <ul className="footer-links-list">
                            <li><Link href="/solutions-ia#automation">Automatisation IA</Link></li>
                            <li><Link href="/solutions-ia#agents">Agents Intelligents</Link></li>
                            <li><Link href="/vitedia#traceability">Traçabilité Alimentaire</Link></li>
                            <li><Link href="/garden#urban">Agriculture Urbaine</Link></li>
                            <li><Link href="/observatoire">Études & Consulting</Link></li>
                        </ul>
                    </div>

                    {/* 4️⃣ Bloc Contact & Infos légales */}
                    <div className="footer-col">
                        <h4>Contact & Info</h4>
                        <ul className="footer-contact-info">
                            <li className="contact-item">
                                <i className="fa-solid fa-envelope"></i>
                                <span>contact@tedsai.cm</span>
                            </li>
                            <li className="contact-item">
                                <i className="fa-solid fa-phone"></i>
                                <span>+237 6XX XXX XXX</span>
                            </li>
                            <li className="contact-item">
                                <i className="fa-solid fa-location-dot"></i>
                                <span>Yaoundé, Cameroun</span>
                            </li>
                            <li className="contact-item" style={{ marginTop: '1rem' }}>
                                <a href="https://maps.app.goo.gl/PAqnePyormGahFcW9" target="_blank" rel="noreferrer" style={{ color: 'var(--color-secondary)', fontWeight: 600 }}>
                                    <i className="fa-solid fa-map-location-dot"></i> Localiser sur Maps
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* 6️⃣ Barre finale (Bottom bar) */}
                <div className="footer-bottom">
                    <div className="copyright">
                        &copy; 2026 <strong>TEDSAI Complex</strong>. Tous droits réservés.
                    </div>
                    <div className="footer-bottom-links">
                        <Link href="/mentions-legales">Mentions Légales</Link>
                        <Link href="/confidentialite">Confidentialité</Link>
                    </div>
                    <div className="powered-by">
                        Built with <i className="fa-solid fa-heart"></i> & Intelligence Artificielle
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
