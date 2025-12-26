/**
 * GLOBAL UI MANAGER
 * Gère les éléments d'interface communs à tout le site
 * - Injection de la Mobile Bottom Nav
 * - Gestion des liens actifs
 */

(function initGlobalUI() {
    console.log("Global UI initializing...");

    // 1. Définition du HTML de la Navbar Mobile
    const isPageIndex = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/');
    const pathPrefix = isPageIndex ? 'pages/' : ''; // Si index, aller vers pages/
    const homeLink = isPageIndex ? '#' : '../index.html'; // Si index, ancre ou rien, sinon remonter

    // Détection dossier racine ou sous-dossier pour liens relatifs
    // Stratégie simple : si URL contient /pages/, on est dans une sous-page -> liens relatifs simplifiés
    const isInPages = window.location.pathname.includes('/pages/');

    const linkHome = isInPages ? '../index.html' : 'index.html';
    const linkIA = isInPages ? 'solutions-ia.html' : 'pages/solutions-ia.html';
    const linkResto = isInPages ? 'vitedia.html' : 'pages/vitedia.html';
    const linkGarden = isInPages ? 'garden.html' : 'pages/garden.html';
    const linkContact = isInPages ? 'contact.html' : 'pages/contact.html';

    const mobileNavHTML = `
    <nav class="mobile-bottom-nav">
        <div class="mobile-nav-items">
            <a href="${linkHome}" class="mobile-nav-item" data-page="index">
                <i class="fa-solid fa-home"></i>
                <span>Accueil</span>
            </a>
            <a href="${linkIA}" class="mobile-nav-item" data-page="solutions-ia">
                <i class="fa-solid fa-brain"></i>
                <span>IA</span>
            </a>
            <a href="${linkResto}" class="mobile-nav-item" data-page="vitedia">
                <i class="fa-solid fa-utensils"></i>
                <span>viTEDia</span>
            </a>
            <a href="${linkGarden}" class="mobile-nav-item" data-page="garden">
                <i class="fa-solid fa-leaf"></i>
                <span>Jardin</span>
            </a>
            <a href="${linkContact}" class="mobile-nav-item" data-page="contact">
                <i class="fa-solid fa-envelope"></i>
                <span>Contact</span>
            </a>
        </div>
    </nav>
    `;

    // 2. Injection si n'existe pas déjà
    if (!document.querySelector('.mobile-bottom-nav')) {
        document.body.insertAdjacentHTML('beforeend', mobileNavHTML);
    }

    // 3. Gestion de l'état Actif
    const currentPage = window.location.pathname;
    const navItems = document.querySelectorAll('.mobile-nav-item');

    navItems.forEach(item => {
        const href = item.getAttribute('href');
        // Logique simple de correspondance
        if (currentPage.endsWith(href) || (currentPage.endsWith('/') && href === 'index.html')) {
            item.classList.add('active');
        } else if (href.startsWith('..') && currentPage.endsWith('index.html')) {
            // Cas spécial retour home
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // 4. Padding Body pour ne pas cacher le contenu
    if (window.innerWidth <= 768) {
        document.body.style.paddingBottom = '70px';
    }

})();
