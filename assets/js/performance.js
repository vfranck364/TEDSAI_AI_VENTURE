// ========================================
// PERFORMANCE OPTIMIZATION
// Lazy loading images and performance utilities
// ========================================

// Lazy loading pour les images
function initLazyLoading() {
    // Vérifier si IntersectionObserver est supporté
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;

                    // Charger l'image
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }

                    // Charger le srcset si présent
                    if (img.dataset.srcset) {
                        img.srcset = img.dataset.srcset;
                        img.removeAttribute('data-srcset');
                    }

                    // Ajouter classe loaded
                    img.classList.add('loaded');

                    // Arrêter d'observer cette image
                    observer.unobserve(img);
                }
            });
        }, {
            // Charger l'image 50px avant qu'elle soit visible
            rootMargin: '50px 0px',
            threshold: 0.01
        });

        // Observer toutes les images avec data-src
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback pour les navigateurs qui ne supportent pas IntersectionObserver
        document.querySelectorAll('img[data-src]').forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }
            if (img.dataset.srcset) {
                img.srcset = img.dataset.srcset;
            }
        });
    }
}

// Lazy loading pour les iframes (vidéos YouTube, etc.)
function initLazyIframes() {
    if ('IntersectionObserver' in window) {
        const iframeObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const iframe = entry.target;
                    if (iframe.dataset.src) {
                        iframe.src = iframe.dataset.src;
                        iframe.removeAttribute('data-src');
                    }
                    observer.unobserve(iframe);
                }
            });
        }, {
            rootMargin: '100px 0px'
        });

        document.querySelectorAll('iframe[data-src]').forEach(iframe => {
            iframeObserver.observe(iframe);
        });
    }
}

// Détecter connexion lente
function isSlowConnection() {
    if ('connection' in navigator) {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (connection) {
            // Si effectiveType est 'slow-2g', '2g' ou '3g', considérer comme lent
            return ['slow-2g', '2g', '3g'].includes(connection.effectiveType);
        }
    }
    return false;
}

// Désactiver les animations sur connexion lente
function optimizeForSlowConnection() {
    if (isSlowConnection()) {
        document.body.classList.add('slow-connection');
        console.log('Slow connection detected: animations disabled');
    }
}

// Précharger les ressources critiques
function preloadCriticalResources() {
    // Précharger les polices
    const fontPreload = document.createElement('link');
    fontPreload.rel = 'preload';
    fontPreload.as = 'font';
    fontPreload.type = 'font/woff2';
    fontPreload.crossOrigin = 'anonymous';

    // Précharger les images critiques (logo, hero)
    const criticalImages = document.querySelectorAll('img[data-critical]');
    criticalImages.forEach(img => {
        if (img.dataset.src) {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = img.dataset.src;
            document.head.appendChild(link);
        }
    });
}

// Initialiser toutes les optimisations de performance
function initPerformanceOptimizations() {
    // Lazy loading
    initLazyLoading();
    initLazyIframes();

    // Optimisations connexion lente
    optimizeForSlowConnection();

    // Préchargement ressources critiques
    preloadCriticalResources();

    console.log('Performance optimizations initialized');
}

// Charger automatiquement
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPerformanceOptimizations);
} else {
    initPerformanceOptimizations();
}

// Exposer globalement
window.initLazyLoading = initLazyLoading;
