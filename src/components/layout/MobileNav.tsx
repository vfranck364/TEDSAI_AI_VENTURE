'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const MobileNav = () => {
    const pathname = usePathname();

    const navItems = [
        { href: '/', label: 'Accueil', icon: 'fa-solid fa-home' },
        { href: '/solutions-ia', label: 'IA', icon: 'fa-solid fa-brain' },
        { href: '/vitedia', label: 'viTEDia', icon: 'fa-solid fa-utensils' },
        { href: '/garden', label: 'Jardin', icon: 'fa-solid fa-leaf' },
        { href: '/ecosystem', label: 'Éco', icon: 'fa-solid fa-diagram-project' },
        { href: '/observatoire', label: 'Obs', icon: 'fa-solid fa-satellite-dish' },
        { href: '/contact', label: 'Contact', icon: 'fa-solid fa-envelope' },
    ];

    return (
        <nav className="mobile-bottom-nav" aria-label="Navigation mobile principale">
            <div className="mobile-nav-items">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`mobile-nav-item ${pathname === item.href ? 'active' : ''}`}
                        aria-label={item.label}
                    >
                        <i className={item.icon}></i>
                        <span>{item.label}</span>
                    </Link>
                ))}
            </div>
        </nav>
    );
};

export default MobileNav;
