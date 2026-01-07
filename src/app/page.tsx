import Link from 'next/link';
import Image from 'next/image';
import './landing.css';

export default function Home() {
    return (
        <>
            <section className="carrefour-hero">
                <div className="carrefour-content">
                    <h1 className="carrefour-title">TEDSAI Complex</h1>
                    <p className="carrefour-subtitle">De la Data à l'Assiette</p>
                    <p className="carrefour-tagline">
                        Un écosystème intelligent unifiant IA, Agriculture, Élevage, Restauration et Épicerie
                    </p>

                    <div className="carrefour-choices">
                        {/* Choice 1: IA & Entreprises */}
                        <Link href="/solutions-ia" className="choice-card ia">
                            <div className="choice-icon">
                                <i className="fa-solid fa-brain"></i>
                            </div>
                            <h2 className="choice-title">Entreprises & IA</h2>
                            <p className="choice-description">
                                Solutions d'intelligence artificielle sur mesure pour automatiser, optimiser et propulser votre entreprise.
                            </p>
                            <span className="choice-cta">
                                Découvrir <i className="fa-solid fa-arrow-right"></i>
                            </span>
                        </Link>

                        {/* Choice 2: Restaurant viTEDia */}
                        <Link href="/vitedia" className="choice-card restaurant">
                            <div className="choice-icon">
                                <i className="fa-solid fa-utensils"></i>
                            </div>
                            <h2 className="choice-title">Restaurant viTEDia</h2>
                            <p className="choice-description">
                                Gastronomie traçable où chaque ingrédient raconte son histoire, du jardin à votre assiette
                            </p>
                            <span className="choice-cta">
                                Réserver <i className="fa-solid fa-arrow-right"></i>
                            </span>
                        </Link>

                        {/* Choice 3: Jardins & Épicerie */}
                        <Link href="/garden" className="choice-card garden">
                            <div className="choice-icon">
                                <i className="fa-solid fa-leaf"></i>
                            </div>
                            <h2 className="choice-title">Jardin & Épicerie SelecTED</h2>
                            <p className="choice-description">
                                Production locale, élevage et épicerie fine avec traçabilité totale de la graine à l'assiette
                            </p>
                            <span className="choice-cta">
                                Explorer <i className="fa-solid fa-arrow-right"></i>
                            </span>
                        </Link>
                    </div>


                    <div className="ecosystem-extra-choice">
                        <Link href="/ecosystem" className="choice-card ecosystem" aria-label="Découvrir Notre écosystème">
                            <div className="choice-icon">
                                <i className="fa-solid fa-diagram-project"></i>
                            </div>
                            <h2 className="choice-title">Notre Écosystème</h2>
                            <p className="choice-description">
                                Découvrez la synergie entre nos trois pôles et notre vision pour un futur durable
                            </p>
                            <span className="choice-cta">
                                Explorer <i className="fa-solid fa-arrow-right"></i>
                            </span>
                        </Link>
                    </div>

                    <div className="home-obs-section">
                        <div className="home-obs-container">
                            <h2 className="home-obs-title">
                                <i className="fa-solid fa-satellite-dish" style={{ color: '#2196F3' }}></i>
                                L'Observatoire TEDSAI
                            </h2>
                            <p className="home-obs-text">
                                Analyses économiques, études de cas et veille technologique. <br />
                                Participez aux discussions et découvrez les tendances qui façonnent l'Afrique de demain.
                            </p>
                            <Link href="/observatoire" className="btn-obs-pulse">
                                Explorer les Analyses & Discussions
                                <i className="fa-solid fa-comments"></i>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
