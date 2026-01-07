'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Header = () => {
    const pathname = usePathname();

    const navLinks = [
        { href: '/', label: 'Accueil', icon: 'fa-solid fa-home' },
        { href: '/solutions-ia', label: 'Solutions IA' },
        { href: '/vitedia', label: 'viTEDia' },
        { href: '/garden', label: 'SelecTED Gardens' },
        { href: '/shop', label: 'Boutique', icon: 'fa-solid fa-basket-shopping' },
        { href: '/ecosystem', label: 'Écosystème' },
        { href: '/observatoire', label: 'Observatoire' },
        { href: '/contact', label: 'Contact' },
    ];

    return (
        <header>
            <div className="container navbar">
                <Link href="/" className="logo">
                    <img src="/assets/images/logos/tedsai_logo.jpg" alt="TEDSAI Logo" />
                </Link>
                <nav className="nav-links">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            style={{ color: pathname === link.href ? 'var(--color-primary)' : 'inherit' }}
                        >
                            {link.icon && <i className={link.icon}></i>} {link.icon && <span> </span>}
                            <span>{link.label}</span>
                        </Link>
                    ))}
                </nav>
            </div>
        </header>
    );
};

export default Header;
