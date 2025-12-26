document.addEventListener('DOMContentLoaded', function () {
    // Initialize global functions
    initTraceability();
    loadDynamicContent(); // New Dynamic Loader
    initMobileNav(); // Mobile Navigation Logic

    // Initialize Lightbox logic
    initLightbox();
});

function initMobileNav() {
    const currentPage = window.location.pathname;
    const navItems = document.querySelectorAll('.mobile-nav-item');

    navItems.forEach(item => {
        const href = item.getAttribute('href');
        // Simple distinct logic to handle '../' or exact matches
        // Note: In production, URL parsing might be more robust
        if (currentPage.endsWith(href) || (currentPage.endsWith('/') && href.includes('index.html'))) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

/**
 * PHASE 2: Dynamic Content Rendering
 * Fetches data from "Mock Backend" and renders it.
 */

// --- 4. RESERVATION HANDLER ---
window.handleReservationVitedia = function (e) {
    e.preventDefault();
    const name = document.getElementById('res-name').value;
    const email = document.getElementById('res-email').value; // Nouveau champ
    const phone = document.getElementById('res-phone').value;
    const date = document.getElementById('res-date').value;
    const time = document.getElementById('res-time').value;
    const people = document.getElementById('res-people').value;
    const occasion = document.getElementById('res-occasion').value; // Nouveau champ
    const specialRequests = document.getElementById('res-special').value; // Nouveau champ
    const payment = document.getElementById('res-payment').value;

    if (!name || !date || !time || !phone) {
        alert("Veuillez remplir tous les champs obligatoires (Nom, Téléphone, Date, Heure).");
        return;
    }

    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.innerText;
    btn.disabled = true;
    btn.innerText = "Traitement de la réservation...";

    // SIMULATION MOBILE MONEY
    if (payment === 'momo') {
        const confirmMomo = confirm(`Simulation Mobile Money:\n\nVeuillez valider le paiement de 5000 FCFA sur votre téléphone (${phone}).\n\nAppuyez sur OK pour simuler la validation.`);
        if (!confirmMomo) {
            btn.disabled = false;
            btn.innerText = originalText;
            return;
        }
    }

    // Google Sheets Integration
    const data = {
        name, email, phone, date, time, people, payment, occasion, specialRequests,
        id: 'res_' + Date.now(),
        dateCreated: new Date().toISOString()
    };

    // TODO: Remplacer par l'URL de votre déploiement Google Apps Script (voir guide_google_sheets_reservations.md)
    const GOOGLE_APPS_SCRIPT_RESERVATIONS_URL = 'https://script.google.com/macros/s/AKfycbw4dwneZ5fwG7YvPVSZJcwODby3DiDobXAlgQi8r9Rcf0GmxyqzN207QFFIV_3LcW8b/exec';

    // 1. Send to Google Sheets
    fetch(GOOGLE_APPS_SCRIPT_RESERVATIONS_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
        .then(() => {
            // 2. Save locally for Admin Dashboard (Parallel)
            const result = TedAPI.Restaurant.makeReservation({
                name, phone, date, time, people, paymentMethod: payment
            });

            if (result.success) {
                alert(`✅ Réservation confirmée !\n\n${result.message}\n\nAcompte: ${payment === 'momo' ? 'Payé (Simulé)' : 'À régler sur place'}`);
                e.target.reset();
            } else {
                alert(`❌ Erreur locale: ${result.message}`);
            }
        })
        .catch((error) => {
            console.error('Erreur Google Sheets:', error);
            // Fallback: Save locally anyway
            const result = TedAPI.Restaurant.makeReservation({
                name, phone, date, time, people, paymentMethod: payment
            });
            alert('✅ Réservation enregistrée (Mode local uniquement). Veuillez nous contacter si vous ne recevez pas de confirmation.');
            e.target.reset();
        })
        .finally(() => {
            btn.disabled = false;
            btn.innerText = originalText;
        });
};

/**
 * PHASE 2: Dynamic Content Rendering
 * Fetches data from "Mock Backend" and renders it.
 */
async function loadDynamicContent() {
    // 1. Render viTEDia Menu
    if (document.getElementById('dynamic-menu-container')) {
        loadVitediaMenu();
    }

    // 2. Render Garden Production
    const gardenContainer = document.getElementById('dynamic-garden-container');
    if (gardenContainer && typeof TedAPI !== 'undefined') {
        const gardenData = TedAPI.Garden.getProducts();
        renderGarden(gardenContainer, gardenData);
    }
    // 3. Render IA Services
    const iaContainer = document.getElementById('dynamic-services-container');
    if (iaContainer && typeof TedAPI !== 'undefined') {
        const iaData = await TedAPI.fetchData('services');
        if (iaData) {
            renderServices(iaContainer, iaData);
        }
    }

    // 4. Initialize Quote Wizard (if on IA page)
    if (document.getElementById('quote-wizard-container')) {
        initQuoteWizard();
    }
}

// 🔄 ADDED: Listen for DB changes to re-render dynamic content
window.addEventListener('ted-db-changed-menu', () => { if (document.getElementById('dynamic-menu-container')) loadVitediaMenu(); });
window.addEventListener('ted-db-changed-garden_products', () => { if (document.getElementById('dynamic-garden-container')) loadGardenProducts(); });
window.addEventListener('ted-db-changed-ia_services', () => { if (document.getElementById('dynamic-services-container')) loadDynamicContent(); });

// --- QUOTE WIZARD LOGIC ---
let quizData = null;
let currentStep = 0;
let totalEstimate = 0;

async function initQuoteWizard() {
    // Determine path based on location
    const path = window.location.pathname.includes('/pages/') ? '../assets/data/quiz.json' : 'assets/data/quiz.json';

    try {
        const response = await fetch(path);
        const data = await response.json();
        quizData = data.questions;
        renderWizardStep();
    } catch (e) {
        console.error("Quiz Error", e);
        document.getElementById('wizard-steps').innerHTML = '<p class="error">Erreur chargement devis.</p>';
    }
}

function renderWizardStep() {
    const container = document.getElementById('wizard-steps');
    if (currentStep >= quizData.length) {
        showWizardResult();
        return;
    }

    const q = quizData[currentStep];
    let html = `
        <h4 style="margin-bottom:1.5rem; color:var(--color-primary);">Étape ${currentStep + 1}/${quizData.length}: ${q.text}</h4>
        <div style="display:grid; gap:10px;">
    `;

    q.options.forEach(opt => {
        html += `<button class="btn-text" style="text-align:left; border:1px solid #eee;" onclick="selectOption(${opt.price_mod})">${opt.label}</button>`;
    });
    html += '</div>';

    container.innerHTML = html;
}

function selectOption(price) {
    totalEstimate += price;
    currentStep++;
    renderWizardStep();
}

function showWizardResult() {
    document.getElementById('wizard-steps').style.display = 'none';
    document.getElementById('wizard-result').style.display = 'block';

    // Animate Number
    const el = document.getElementById('estimated-price');
    let start = 0;
    const end = totalEstimate;
    const duration = 1000;
    const stepTime = Math.abs(Math.floor(duration / (end - start)));

    const timer = setInterval(() => {
        start += 50;
        el.textContent = start + " FCFA";
        if (start >= end) {
            el.textContent = end + " FCFA / mois"; // Monthly estimate
            clearInterval(timer);
        }
    }, 10);
}

function restartWizard() {
    currentStep = 0;
    totalEstimate = 0;
    const resultEl = document.getElementById('wizard-result');
    if (resultEl) resultEl.style.display = 'none';
    const stepsEl = document.getElementById('wizard-steps');
    if (stepsEl) stepsEl.style.display = 'block';
    renderWizardStep();
}

function renderServices(container, data) {
    if (!data || data.length === 0) {
        container.innerHTML = `
            <div style="text-align:center; padding:3rem; color:#718096; background: #f8fafc; border-radius: 12px; border: 1px dashed #cbd5e0;">
                <i class="fa-solid fa-brain fa-2x" style="margin-bottom:1rem; opacity:0.5;"></i>
                <p>Nos nouvelles solutions IA sont en cours de déploiement.<br><small>Revenez très bientôt !</small></p>
            </div>`;
        return;
    }

    let html = '<div class="services-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">';
    data.forEach(service => {
        html += `
            <div class="service-card" style="background: white; padding: 2.5rem; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); text-align: center; border-bottom: 4px solid var(--color-primary); transition: transform 0.3s ease;">
                <i class="${service.icon || 'fa-solid fa-robot'}" style="font-size: 3rem; color: var(--color-primary); margin-bottom: 1.5rem; display: block;"></i>
                <h3 style="margin-bottom: 1rem; color: #1e293b; font-weight: 700;">${service.name}</h3>
                <p style="color: #64748b; font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.5rem;">${service.description || 'Solution d\'intelligence artificielle avancée pour votre entreprise.'}</p>
                <div style="margin-bottom: 1.5rem;">
                    <span style="background: #f1f5f9; color: var(--color-primary); padding: 5px 12px; border-radius: 20px; font-size: 0.85rem; font-weight: 600;">
                        ${service.price || 'Sur Devis'}
                    </span>
                </div>
                <a href="contact.html?plan=${service.name.toLowerCase().replace(/\s+/g, '-')}" class="btn-text" style="color: var(--color-primary); font-weight: 700; text-decoration: none;">
                    En savoir plus <i class="fa-solid fa-arrow-right" style="margin-left: 5px;"></i>
                </a>
            </div>
        `;
    });
    html += '</div>';
    container.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. Dynamic Modules (Data Loading)
    // Initial attempt (might be empty if DB not ready)
    setTimeout(() => {
        if (document.getElementById('dynamic-menu-container')) loadVitediaMenu();
        if (document.getElementById('dynamic-garden-container')) loadGardenProducts();
    }, 1000);

    // Note: CMS Content Loading is now handled by cms-loader.js separately
});


function loadGardenProducts() {
    const container = document.getElementById('dynamic-garden-container');
    if (!container) return;

    if (!window.TedAPI || !window.TedAPI.Garden) {
        container.innerHTML = '<p class="error-msg">Impossible de charger les récoltes.</p>';
        return;
    }

    const products = window.TedAPI.Garden.getProducts();

    if (products.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #777;">Aucune récolte disponible pour le moment.</p>';
        return;
    }

    let html = '<div class="prod-grid">';

    products.forEach(item => {
        // Handle availability/stock
        const isStock = item.inStock !== false; // Default true if undefined
        const stockBadge = isStock
            ? '<span style="background:var(--color-garden-primary); color:white; padding:4px 8px; border-radius:4px; font-size:0.8rem; font-weight:bold;">En Stock</span>'
            : '<span style="background:#e53e3e; color:white; padding:4px 8px; border-radius:4px; font-size:0.8rem; font-weight:bold;">Rupture</span>';

        const imgHtml = item.image
            ? `<img src="${item.image}" alt="${item.name}" style="width:100%; height:180px; object-fit:cover; border-radius:8px; margin-bottom:1rem;">`
            : `<div style="height:180px; background:#f0fdf4; display:flex; align-items:center; justify-content:center; border-radius:8px; margin-bottom:1rem; color:var(--color-garden-primary);"><i class="fa-solid fa-leaf fa-3x"></i></div>`;

        html += `
        <div class="prod-card" style="text-align:left;">
             ${imgHtml}
             <div style="display:flex; justify-content:space-between; align-items:start; margin-bottom:0.5rem;">
                <h3 style="margin:0; font-size:1.2rem; color:var(--color-garden-primary);">${item.name}</h3>
                ${stockBadge}
             </div>
             <p style="color:#666; font-size:0.9rem; margin-bottom:0.5rem;">${item.category} • ${item.season || 'Saison ?'}</p>
             <p style="font-style:italic; font-size:0.85rem; color:#888;">${item.variety || ''}</p>
        </div>
        `;
    });

    html += '</div>';
    container.innerHTML = html;
}

function loadVitediaMenu() {
    const container = document.getElementById('dynamic-menu-container');
    if (!container) return; // Should not happen given check above but safe

    // 1. Get Data from API
    if (!window.TedAPI || !window.TedAPI.Restaurant) {
        container.innerHTML = '<p class="error-msg">Impossible de charger le menu (API manquante).</p>';
        return;
    }

    const menu = window.TedAPI.Restaurant.getMenu();
    if (menu.length === 0) {
        container.innerHTML = `
            <div style="text-align:center; padding:2rem;">
                <i class="fa-solid fa-utensils" style="font-size:2rem; color:#cbd5e0; margin-bottom:1rem;"></i>
                <p>Notre carte est en cours de mise à jour. Revenez vite !</p>
            </div>`;
        return;
    }

    // 2. Group by Category
    const categories = {
        'Entrée': [],
        'Plat de Résistance': [],
        'Dessert': [],
        'Boisson': [],
        'Autre': []
    };
    menu.forEach(item => {
        let cat = item.category || 'Plat de Résistance';
        if (cat === 'Plat') cat = 'Plat de Résistance';
        if (cat === 'Boisson / Autre') cat = 'Boisson';

        if (categories[cat]) {
            categories[cat].push(item);
        } else {
            // Fallback for unexpected or mixed categories
            if (cat.toLowerCase().includes('boisson')) categories['Boisson'].push(item);
            else if (cat.toLowerCase().includes('autre')) categories['Autre'].push(item);
            else categories['Plat de Résistance'].push(item);
        }
    });

    // 3. Render Categorized Menu
    const order = ['Entrée', 'Plat de Résistance', 'Dessert', 'Boisson', 'Autre'];
    const icons = {
        'Entrée': 'fa-leaf',
        'Plat de Résistance': 'fa-utensils',
        'Dessert': 'fa-ice-cream',
        'Boisson': 'fa-glass-water',
        'Autre': 'fa-plus'
    };
    const displayTitles = {
        'Entrée': 'Entrées',
        'Plat de Résistance': 'Plats de Résistance',
        'Dessert': 'Desserts',
        'Boisson': 'Boissons',
        'Autre': 'Autres'
    };

    // Build Category Navigation
    let navHtml = '<div class="menu-nav" style="display:flex; justify-content:center; gap:1rem; margin-bottom:4rem; flex-wrap:wrap;">';
    order.forEach(cat => {
        if (categories[cat].length > 0) {
            navHtml += `<a href="#cat-${cat.replace(/\s+/g, '-').toLowerCase()}" 
                onmouseover="this.style.background='var(--color-vitedia-primary)'; this.style.color='white'"
                onmouseout="this.style.background='#f0f0f0'; this.style.color='#555'"
                style="padding: 10px 20px; border-radius: 30px; background: #f0f0f0; color: #555; text-decoration: none; font-size: 0.95rem; font-weight: 600; transition: all 0.3s ease; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">${displayTitles[cat]}</a>`;
        }
    });
    navHtml += '</div>';

    let html = navHtml;

    order.forEach(catName => {
        const items = categories[catName];
        if (items.length > 0) {
            const sectionId = `cat-${catName.replace(/\s+/g, '-').toLowerCase()}`;
            html += `
            <div id="${sectionId}" class="menu-category-block" style="margin-bottom:6rem; scroll-margin-top: 100px;">
                <div style="display: flex; align-items: center; justify-content: center; gap: 1.5rem; margin-bottom: 3rem;">
                    <div style="height: 2px; background: #eee; flex: 1;"></div>
                    <div style="text-align: center;">
                        <i class="fa-solid ${icons[catName]}" style="color: var(--color-vitedia-primary); font-size: 1.5rem; margin-bottom: 0.5rem; display: block;"></i>
                        <h3 style="font-family: var(--font-accent); color: var(--color-vitedia-primary); font-size: 2rem; margin: 0; text-transform: uppercase; letter-spacing: 2px;">
                            ${displayTitles[catName]}
                        </h3>
                    </div>
                    <div style="height: 2px; background: #eee; flex: 1;"></div>
                </div>
                <div class="menu-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); justify-content: center; gap: 2rem;">
            `;

            items.forEach(item => {
                const imageSrc = item.image && item.image.length > 10 ? item.image : '../assets/images/placeholder_dish.jpg';
                const availableBadge = item.available ? '' : '<span style="position:absolute; top:12px; right:12px; background:rgba(231, 76, 60, 0.9); color:white; padding:5px 12px; border-radius:20px; font-weight:bold; font-size:0.75rem; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">ÉPUISÉ</span>';
                const opacityStyle = item.available ? '' : 'filter: grayscale(0.8); opacity:0.8;';

                html += `
                    <div class="dish-card" style="background: white; border-radius: 16px; border: 1px solid #f0f0f0; box-shadow: 0 10px 30px rgba(0,0,0,0.03); overflow: hidden; transition: all 0.4s ease; position:relative; ${opacityStyle}">
                        ${availableBadge}
                        <div style="height: 220px; overflow: hidden; position: relative;">
                            <img src="${imageSrc}" alt="${item.name}" 
                                 onerror="this.src='../assets/images/placeholder_dish.jpg'"
                                 style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s ease;">
                        </div>
                        <div style="padding: 1.5rem; text-align: left;">
                            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
                                <h4 style="margin: 0; font-size: 1.2rem; font-weight: 700; color: #333;">${item.name}</h4>
                                <span style="color: var(--color-vitedia-primary); font-weight: 800; font-size: 1.1rem; white-space: nowrap; margin-left: 10px;">
                                    ${item.price.toLocaleString()} <small style="font-size: 0.65rem; font-weight: 600;">FCFA</small>
                                </span>
                            </div>
                            <p style="color: #777; font-size: 0.9rem; line-height: 1.6; margin-bottom: 0; min-height: 2.8rem;">
                                ${item.description || 'Une création savoureuse préparée avec soin par nos chefs sélectionnés.'}
                            </p>
                        </div>
                    </div>
                `;
            });

            html += `</div></div>`;
        }
    });

    container.innerHTML = html;
}

// 🔄 Removed redundant renderMenu/renderMenuCategory functions.
// loadVitediaMenu is now the primary handler for the restaurant menu.

function renderGarden(container, products) {
    if (!products || products.length === 0) {
        container.innerHTML = `
            <div style="text-align:center; padding:3rem; color:#718096;">
                <i class="fa-solid fa-seedling fa-2x" style="margin-bottom:1rem; opacity:0.5;"></i>
                <p>Nos récoltes chargent... ou le jardin est au repos !</p>
            </div>`;
        return;
    }

    // 1. Group by Category
    const categories = { 'Légume': [], 'Fruit': [], 'Aromate': [], 'Épice': [] };
    products.forEach(p => {
        if (!categories[p.category]) categories[p.category] = [];
        categories[p.category].push(p);
    });

    let html = '<div class="prod-grid">';

    // 2. Render Categories as Cards (Style similar to original but dynamic)
    Object.keys(categories).forEach(catName => {
        const items = categories[catName];
        if (items.length === 0) return;

        // Visual config per category
        let icon = 'fa-leaf';
        let color = 'var(--color-garden-primary)';
        if (catName === 'Fruit') icon = 'fa-apple-whole';
        if (catName === 'Épice') { icon = 'fa-pepper-hot'; color = '#B68D40'; }
        if (catName === 'Aromate') icon = 'fa-wind';

        // Build list of items txt
        const itemList = items.map(i => {
            const style = i.inStock ? '' : 'text-decoration:line-through; opacity:0.6;';
            return `<span style="${style}">${i.name}</span>`;
        }).join(', ');

        html += `
            <div class="prod-card" style="border-top: 4px solid ${color};">
                <i class="fa-solid ${icon} prod-icon" style="color: ${color};"></i>
                <h3 style="color: ${color};">${catName}s du Moment</h3>
                <div style="margin-top:1rem; font-size:0.95rem; line-height:1.6; color:#555;">
                    ${itemList}
                </div>
                <div style="margin-top:1rem;">
                    <button class="btn-text" style="color:${color}; font-size:0.8rem;" onclick="document.getElementById('trace-input-code').focus()">
                        <i class="fa-solid fa-qrcode"></i> Vérifier Traçabilité
                    </button>
                </div>
            </div>
        `;
    });

    html += '</div>';
    container.innerHTML = html;
}

// Traceability Modal Logic
function initTraceability() {
    // 1. Listen for clicks on trace badges
    const badges = document.querySelectorAll('.badge-trace, .btn-trace-sim');
    if (badges) {
        badges.forEach(badge => {
            badge.addEventListener('click', (e) => {
                e.preventDefault();
                openTraceModal(e.target.innerText.includes('Potimarron') ? 'potimarron' : 'general');
            });
        });
    }

    // 2. Listen for Manual Input (Garden Page)
    const traceBtn = document.getElementById('btn-trace-submit');
    const traceInput = document.getElementById('trace-input-code');

    if (traceBtn && traceInput) {
        traceBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const code = traceInput.value.trim();
            if (!code) {
                alert("Veuillez entrer un code produit.");
                return;
            }
            // Smart Logic: Check code pattern
            if (code.includes("POT")) openTraceModal('potimarron');
            else openTraceModal('general');
        });
    }

    // Create Modal HTML if not exists
    if (!document.getElementById('trace-modal')) {
        const modalHTML = `
        <div id="trace-modal" class="modal-overlay">
            <div class="modal-content fade-in-up">
                <span class="close-modal">&times;</span>
                <div id="trace-modal-body">
                    <!-- Dynamic Content -->
                </div>
            </div>
        </div>
        <style>
            .modal-overlay {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0,0,0,0.7); z-index: 10000;
                display: none; align-items: center; justify-content: center;
                backdrop-filter: blur(5px);
            }
            .modal-content {
                background: white; padding: 2rem; border-radius: 12px;
                max-width: 600px; width: 90%; position: relative;
                max-height: 90vh; overflow-y: auto;
            }
            .close-modal {
                position: absolute; top: 15px; right: 20px; font-size: 2rem; cursor: pointer; color: #aaa;
            }
            .close-modal:hover { color: black; }
        </style>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Close logic
        document.querySelector('.close-modal').addEventListener('click', closeTraceModal);
        document.getElementById('trace-modal').addEventListener('click', (e) => {
            if (e.target.id === 'trace-modal') closeTraceModal();
        });
    }
}

function openTraceModal(type) {
    const modal = document.getElementById('trace-modal');
    const body = document.getElementById('trace-modal-body');

    // Mock Data based on Spec
    const data = {
        potimarron: {
            title: "Velouté de Potimarron du Jardin",
            code: "POT-131224-B3",
            origin: "Parcelle B3 (Serre #2)",
            harvest: "10 Décembre 2024",
            farmer: "Jean K.",
            distance: "50 mètres",
            inputs: "Zero Pesticide (Contrôle biologique)",
            chef: "Marie L."
        },
        general: {
            title: "Produit du Jardin SelecTED",
            code: "GEN-131224-X",
            origin: "Parcelle A1 (Plein Champ)",
            harvest: "Aujourd'hui",
            farmer: "Equipe SelecTED",
            distance: "50 mètres",
            inputs: "Bio Certifié",
            chef: "Chef viTEDia"
        }
    };

    const item = data[type] || data.general;

    body.innerHTML = `
        <h2 style="color: var(--color-garden-primary); margin-bottom: 0.5rem;"><i class="fa-solid fa-leaf"></i> Traçabilité Certifiée</h2>
        <h3 style="margin-bottom: 1.5rem;">${item.title}</h3>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 1.5rem;">
            <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px 0; color: #666;">Code Produit</td><td style="font-weight: bold;">${item.code}</td></tr>
            <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px 0; color: #666;">Origine</td><td style="font-weight: bold;">${item.origin}</td></tr>
            <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px 0; color: #666;">Date Récolte</td><td style="font-weight: bold;">${item.harvest}</td></tr>
            <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px 0; color: #666;">Distance Resto</td><td style="font-weight: bold; color: green;">${item.distance}</td></tr>
             <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px 0; color: #666;">Intrants</td><td style="font-weight: bold;">${item.inputs}</td></tr>
        </table>
        
        <div style="background: #f9f9f9; padding: 1rem; border-radius: 8px; text-align: center;">
             <p style="font-size: 0.9rem; color: #555;">Ce produit a été préparé par <strong>${item.chef}</strong>.</p>
             <button class="btn btn-primary" style="margin-top: 10px; font-size: 0.8rem;">Télécharger Certificat PDF</button>
        </div>
    `;

    modal.style.display = 'flex';
}

function closeTraceModal() {
    document.getElementById('trace-modal').style.display = 'none';
}


function initLightbox() {
    // Simplified MVP Lightbox placeholder
}


