/**
 * TEDSAI DATABASE CORE (Hybrid: LocalStorage + Firestore Sync)
 * COMPAT VERSION (for file:// support)
 */

const TedDB = {
    collections: {
        users: [],
        menu: [],
        garden_products: [],
        ia_services: [],
        content_pages: [],
        reservations: [],
        messages: [],
        media: [],
        blog_posts: [],
        blog_categories: [],
        blog_comments: [],
        logs: []
    },

    // Initialize DB
    async init() {
        console.log("💾 TedDB Initializing (Compat Mode)...");
        this.loadFromLocal();

        // 🟢 SEED DATA for Observatoire if empty
        if (this.collections.blog_categories.length === 0) {
            console.log("🌱 Seeding Blog Categories...");
            this.collections.blog_categories = [
                { id: 'tech', name: 'Technologie & IA' },
                { id: 'agro', name: 'Agro-Industrie' },
                { id: 'eco', name: 'Économie Sociale' }
            ];
            this.saveToLocal('blog_categories');
        }

        if (this.collections.blog_posts.length === 0) {
            console.log("🌱 Seeding Blog Posts...");
            this.collections.blog_posts = [
                {
                    id: 'post-1',
                    title: "L'IA au service de l'agriculture camerounaise",
                    author: "Dr. Hamadou W.",
                    category: "agro",
                    date: new Date().toISOString(),
                    status: "publié",
                    summary: "Comment les algorithmes prédictifs transforment la gestion des récoltes dans le septentrion.",
                    content: "<h1>L'IA et la Terre</h1><p>L'utilisation de capteurs IoT couplés à une IA d'analyse permet aujourd'hui d'économiser 30% d'eau sur les parcelles...</p>",
                    likes: 12,
                    image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=800'
                },
                {
                    id: 'post-2',
                    title: "Pourquoi le Complexe TEDSAI choisit le circuit court",
                    author: "Mme. NGO MBOCK",
                    category: "eco",
                    date: new Date().toISOString(),
                    status: "publié",
                    summary: "La philosophie derrière viTEDia et SelecTED Garden : de la terre à l'assiette en moins de 100km.",
                    content: "<h1>Circuit Court : Le futur</h1><p>Le circuit court n'est pas qu'une mode, c'est une nécessité économique pour nos agriculteurs...</p>",
                    likes: 24,
                    image: 'https://images.unsplash.com/photo-1488459711635-0cabd124d9b5?q=80&w=800'
                }
            ];
            this.saveToLocal('blog_posts');
        }

        window.dispatchEvent(new Event('ted-db-ready'));

        if (window.tedFirebase && window.tedFirebase.loaded) {
            console.log("🔥 Firebase detected. Starting Sync...");
            await this.syncWithFirestore();
        } else {
            console.warn("⚠️ Firebase not found (or not loaded). Using LocalStorage Mode.");
        }
    },

    loadFromLocal() {
        for (const key in this.collections) {
            try {
                const data = localStorage.getItem('tedsai_' + key);
                if (data) {
                    this.collections[key] = JSON.parse(data);
                }
            } catch (e) {
                console.error(`❌ Error loading collection ${key}:`, e);
                this.collections[key] = []; // Fallback to empty
            }
        }
    },

    saveToLocal(collection) {
        try {
            const data = JSON.stringify(this.collections[collection]);
            localStorage.setItem('tedsai_' + collection, data);
        } catch (e) {
            console.error("💾 LocalStorage Error:", e);
            if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
                alert("⚠️ Espace de stockage plein ! Impossible d'enregistrer. \n\nConseil : Essayez d'utiliser des images plus légères ou supprimez d'anciens éléments.");
            }
            throw e; // Rethrow to let the caller handle it if needed
        }
    },

    // --- FIRESTORE SYNC (COMPAT SYNTAX) ---
    async syncWithFirestore() {
        const { db } = window.tedFirebase; // db is firebase.firestore()

        for (const key in this.collections) {
            // Listen for Realtime Updates using Compat syntax
            db.collection(key).onSnapshot((snapshot) => {
                const remoteData = [];
                snapshot.forEach(doc => {
                    remoteData.push({ id: doc.id, ...doc.data() });
                });

                // Update Local Memory
                if (remoteData.length > 0) {
                    this.collections[key] = remoteData;
                    this.saveToLocal(key);
                    console.log(`🔄 Synced ${key} from Firestore (${remoteData.length} items)`);
                    window.dispatchEvent(new Event('ted-db-changed-' + key));
                }
            }, (error) => {
                console.error(`Sync Error for ${key}:`, error);
            });
        }
    },

    // --- CRUD OPERATIONS ---

    findAll(collection) {
        return this.collections[collection] || [];
    },

    find(collection, predicate) {
        return (this.collections[collection] || []).find(predicate);
    },

    findById(collection, id) {
        return this.find(collection, item => item.id === id);
    },

    add(collectionName, item) {
        // 1. Prepare Data
        if (!item.id) item.id = Date.now().toString(36) + Math.random().toString(36).substr(2);
        if (!item.createdAt) item.createdAt = new Date().toISOString();

        // 2. Optimistic Update
        if (!this.collections[collectionName]) this.collections[collectionName] = [];
        this.collections[collectionName].push(item);
        this.saveToLocal(collectionName);

        // 3. Firestore Update (Compat Syntax)
        if (window.tedFirebase && window.tedFirebase.loaded) {
            const { db } = window.tedFirebase;
            db.collection(collectionName).doc(item.id).set(item)
                .then(() => console.log("✅ Saved to Firestore"))
                .catch(err => console.error("❌ Firestore Save Error", err));
        }

        return item;
    },

    update(collectionName, id, updates) {
        const index = this.collections[collectionName].findIndex(i => i.id == id);
        if (index === -1) return null;

        // 1. Optimistic Update
        const item = this.collections[collectionName][index];
        const updatedItem = { ...item, ...updates, lastModified: new Date().toISOString() };
        this.collections[collectionName][index] = updatedItem;
        this.saveToLocal(collectionName);

        // 2. Firestore Update (Compat Syntax)
        if (window.tedFirebase && window.tedFirebase.loaded) {
            const { db } = window.tedFirebase;
            db.collection(collectionName).doc(id).update(updates)
                .catch(err => console.error("❌ Firestore Update Error", err));
        }

        return updatedItem;
    },

    delete(collectionName, id) {
        const index = this.collections[collectionName].findIndex(i => i.id == id);
        if (index === -1) return false;

        // 1. Optimistic Update
        this.collections[collectionName].splice(index, 1);
        this.saveToLocal(collectionName);

        // 2. Firestore Update (Compat Syntax)
        if (window.tedFirebase && window.tedFirebase.loaded) {
            const { db } = window.tedFirebase;
            db.collection(collectionName).doc(id).delete()
                .catch(err => console.error("❌ Firestore Delete Error", err));
        }

        return true;
    },

    // --- UTILS ---
    filter(collection, predicate) {
        return (this.collections[collection] || []).filter(predicate);
    }
};

window.TedDB = TedDB;

// Immediate local load to avoid race conditions
TedDB.loadFromLocal();

document.addEventListener('DOMContentLoaded', () => {
    // Background sync initialization
    setTimeout(() => TedDB.init(), 100);
});
