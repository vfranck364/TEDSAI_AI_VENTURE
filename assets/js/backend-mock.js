/**
 * TEDSAI Backend Mock
 * Simule une API et une Base de Données utilisant localStorage
 * Permet la persistance des données entre les pages sans serveur réel.
 */

const TEDBackend = {
    // URL de l'API Google Apps Script (Base de données)
    API_URL: 'https://script.google.com/macros/s/AKfycbz2VjWidMjVJx-1Clm0IQ_eK2vR04hZpWfyJOMJH0TIzrKELj2UJZbrgKwZ3HOUg-Zn/exec',

    // Clés de stockage local (Backup/Cache)
    KEYS: {
        RESERVATIONS: 'tedsai_reservations',
        MESSAGES: 'tedsai_messages',
        MENU: 'tedsai_menu',
        GARDEN: 'tedsai_garden',
        USERS: 'tedsai_users',
        LOGS: 'tedsai_logs'
    },

    // Initialisation des données par défaut si vide
    init() {
        if (!localStorage.getItem(this.KEYS.RESERVATIONS)) {
            localStorage.setItem(this.KEYS.RESERVATIONS, JSON.stringify([]));
        }
        if (!localStorage.getItem(this.KEYS.MESSAGES)) {
            localStorage.setItem(this.KEYS.MESSAGES, JSON.stringify([]));
        }

        // --- DATA INITIALISATION ---

        // 1. Menu viTEDia
        if (!localStorage.getItem(this.KEYS.MENU)) {
            const defaultMenu = [
                { id: 1, name: "Poulet DG Royal", category: "Plats", price: 15000, image: "../assets/images/poulet-dg.jpg", description: "Poulet fermier élevé sur site, plantains mûrs frits, légumes du jardin (carottes, poivrons, haricots verts). Sauce secrète du chef." },
                { id: 2, name: "Ndolé Crevettes & Miondo", category: "Plats", price: 12000, image: "../assets/images/ndole.jpg", description: "Feuilles de Ndolé fraîches lavées à la main, crevettes de Kribi, arachides grillées. Servi avec Miondo ou Plantain vapeur." },
                { id: 3, name: "Salade César 'Jardin'", category: "Entrées", price: 4500, image: "../assets/images/garden/lettuce.jpg", description: "Laitue fraîche récoltée le matin même, croûtons maison, copeaux de parmesan, poulet grillé et sauce César légère." },
                { id: 4, name: "Cocktail Hibiscus Menthe", category: "Boissons", price: 2000, image: "../assets/images/folere.jpg", description: "Fleurs d'hibiscus (Foléré) infusées à froid, menthe fraîche du jardin, sans sucre ajouté (option miel)." }
            ];
            localStorage.setItem(this.KEYS.MENU, JSON.stringify(defaultMenu));
        }

        // 2. Produits SelecTED Gardens
        if (!localStorage.getItem(this.KEYS.GARDEN)) {
            const defaultGarden = [
                { id: 'g1', name: "Panier Légumes Bio", category: "Paniers", price: 5000, image: "../assets/images/garden/basket.jpg", availability: "En stock", description: "Assortiment de saison : Tomates, Laitue, Poivrons, Aubergines." },
                { id: 'g2', name: "Tomates Cœur de Bœuf", category: "Légumes", price: 1500, unit: "/kg", image: "../assets/images/garden/tomatoes.jpg", availability: "Récolte demain", description: "Juteuses et charnues, idéales pour vos salades." },
                { id: 'g3', name: "Œufs Fermiers (Plateau)", category: "Élevage", price: 2500, image: "../assets/images/garden/eggs.jpg", availability: "En stock", description: "Œufs frais de nos poules élevées en plein air, nourries aux grains bio." },
                { id: 'g4', name: "Piment Jaune", category: "Épices", price: 1000, unit: "/sachet", image: "../assets/images/garden/spices.jpg", availability: "Derniers articles", description: "Piment fort et parfumé, séché naturellement." }
            ];
            localStorage.setItem(this.KEYS.GARDEN, JSON.stringify(defaultGarden));
        }

        console.log("TEDBackend initialized (Multi-Sheets Connected + Data Loaded)");
    },

    // Méthode générique d'envoi vers Google Sheets
    async sendToSheet(type, data) {
        try {
            // On utilise mode: 'no-cors' car GAS ne renvoie pas toujours les headers CORS corrects
            // Cela signifie qu'on ne saura pas si ça a réussi ou échoué via JS, mais ça envoie.
            await fetch(this.API_URL, {
                method: 'POST',
                mode: 'no-cors',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                },
                redirect: 'follow',
                body: JSON.stringify({ type, ...data })
            });
            console.log(`Données ${type} envoyées au Cloud.`);
            return true;
        } catch (e) {
            console.error("Erreur Sync Google Sheet", e);
            return false;
        }
    },

    // --- Gestion des Réservations (viTEDia) ---
    reservations: {
        getAll: () => {
            return JSON.parse(localStorage.getItem(TEDBackend.KEYS.RESERVATIONS) || '[]');
        },
        add: (reservation) => {
            // reservation: { name, phone, people, date, time, source: 'web'|'chat' }
            const list = TEDBackend.reservations.getAll();
            const newRes = {
                id: 'RES-' + Date.now(),
                status: 'pending', // pending, confirmed, cancelled
                createdAt: new Date().toISOString(),
                ...reservation
            };
            list.push(newRes);
            localStorage.setItem(TEDBackend.KEYS.RESERVATIONS, JSON.stringify(list));

            // Sync Cloud
            TEDBackend.sendToSheet('RESERVATION', newRes);

            return newRes;
        },
        updateStatus: (id, status) => {
            const list = TEDBackend.reservations.getAll();
            const index = list.findIndex(r => r.id === id);
            if (index !== -1) {
                list[index].status = status;
                localStorage.setItem(TEDBackend.KEYS.RESERVATIONS, JSON.stringify(list));
                return true;
            }
            return false;
        }
    },

    // --- Gestion des Articles (Observatoire) ---
    articles: {
        getAll: () => {
            if (!localStorage.getItem('tedsai_articles')) {
                const defaultArticles = [
                    {
                        id: 'art_1',
                        title: "L'IA au service des PME camerounaises",
                        category: "Intelligence Artificielle",
                        date: "15 Déc 2024",
                        image: "../assets/images/services/data-analysis.jpg", // Placeholder
                        summary: "Comment l'automatisation transforme la logistique locale et réduit les pertes de 20%.",
                        content: `
                            <p>L'intelligence artificielle n'est plus un luxe réservé aux géants de la tech. Au Cameroun, les PME commencent à l'adopter pour résoudre des problèmes concrets.</p>
                            <h4>Le défi logistique</h4>
                            <p>Dans le secteur agroalimentaire, les pertes post-récolte atteignent parfois 40%. Grâce à nos algorithmes prédictifs, viTEDia a réussi à ajuster ses stocks en temps réel.</p>
                            <h4>Résultats concrets</h4>
                            <ul>
                                <li>Réduction du gaspillage : -25%</li>
                                <li>Optimisation des marges : +15%</li>
                            </ul>
                            <p>TEDSAI propose désormais ces outils sous forme d'API accessibles.</p>
                        `
                    },
                    {
                        id: 'art_2',
                        title: "De la Terre à l'Assiette : Le modèle ultra-court",
                        category: "Agriculture Urbaine",
                        date: "10 Déc 2024",
                        image: "../assets/images/garden/serre.jpg", // Placeholder
                        summary: "Étude de cas sur le jardin de viTEDia : 0km de transport, 100% de fraîcheur.",
                        content: `
                            <p>Le concept "Farm-to-Table" est souvent un argument marketing. Chez TEDSAI, c'est une réalité physique : le jardin est à 50 mètres de la cuisine.</p>
                            <p>Cela permet de récolter les légumes à pleine maturité, garantissant un goût et une valeur nutritionnelle supérieurs.</p>
                        `
                    },
                    {
                        id: 'art_3',
                        title: "Lancement de la Phase 2 : Élevage Connecté",
                        category: "News TEDSAI",
                        date: "01 Déc 2024",
                        image: "../assets/images/services/consulting.jpg", // Placeholder
                        summary: "TEDSAI étend son écosystème avec l'intégration de l'élevage de poulets et de porcs.",
                        content: `
                            <p>Après le succès du jardin et du restaurant, nous lançons notre pôle élevage. L'objectif : maîtriser la chaîne de protéines animales avec la même rigueur que nos végétaux.</p>
                            <p>Les déchets du restaurant nourriront les animaux (après traitement), créant une boucle circulaire parfaite.</p>
                        `
                    }
                ];
                localStorage.setItem('tedsai_articles', JSON.stringify(defaultArticles));
            }
            return JSON.parse(localStorage.getItem('tedsai_articles'));
        },
        getById: (id) => {
            const articles = TEDBackend.articles.getAll();
            return articles.find(a => a.id === id);
        }
    },

    // --- Gestion des Messages (Contact/Chat) ---
    messages: {
        getAll: () => {
            return JSON.parse(localStorage.getItem(TEDBackend.KEYS.MESSAGES) || '[]');
        },
        add: (msg) => {
            // msg: { name, email, subject, content, source: 'contact_form'|'chat' }
            const list = TEDBackend.messages.getAll();
            const newMsg = {
                id: 'MSG-' + Date.now(),
                read: false,
                createdAt: new Date().toISOString(),
                ...msg
            };
            list.push(newMsg);
            localStorage.setItem(TEDBackend.KEYS.MESSAGES, JSON.stringify(list));
            return newMsg;
        },
        markAsRead: (id) => {
            const list = TEDBackend.messages.getAll();
            const item = list.find(m => m.id === id);
            if (item) {
                item.read = true;
                localStorage.setItem(TEDBackend.KEYS.MESSAGES, JSON.stringify(list));
            }
        }
    },

    // --- Statistiques pour Dashboard ---
    settings: {
        resetAll: () => {
            localStorage.clear();
            TEDBackend.init();
            return "All data reset.";
        }
    }
};

// Auto-init au chargement
TEDBackend.init();

// Expose to window globally
window.TEDBackend = TEDBackend;
