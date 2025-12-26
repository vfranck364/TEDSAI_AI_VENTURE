/**
 * TEDSAI DATA LOADER (Public Site - Compat Mode)
 * 
 * Fetches data for the public website.
 * Priority: Firestore (Live) > LocalStorage (Admin Preview) > JSON Files
 */

const DATA_PATH = {
    menu: '../assets/data/menu.json',
    garden: '../assets/data/garden.json',
    services: '../assets/data/services.json',
    users: '../assets/data/users.json'
};

class TedDataService {
    async fetchData(collectionName) {
        console.log(`[TedData] Fetching ${collectionName}...`);

        // 1. Try Firestore (Live Data - Compat Mode)
        if (window.tedFirebase && window.tedFirebase.loaded) {
            try {
                const { db } = window.tedFirebase;
                // Compat syntax: db.collection().get()
                const snap = await db.collection(collectionName).get();

                if (!snap.empty) {
                    const data = [];
                    snap.forEach(doc => {
                        data.push({ id: doc.id, ...doc.data() });
                    });
                    console.log(`[TedData] Loaded ${collectionName} from Firestore (${data.length} items)`);
                    return data;
                }
            } catch (err) {
                console.warn(`[TedData] Firestore fetch failed for ${collectionName}`, err);
            }
        }

        // 2. Try LocalStorage (Admin Preview on same device)
        const local = localStorage.getItem('tedsai_' + collectionName);
        if (local) {
            console.log(`[TedData] Loaded ${collectionName} from LocalStorage`);
            return JSON.parse(local);
        }

        // 3. Fallback to Static JSON
        try {
            const isSubDir = window.location.pathname.includes('/pages/') || window.location.pathname.includes('/admin/');
            let path = DATA_PATH[collectionName];
            if (!isSubDir && path) path = path.replace('../', '');

            if (path) {
                const response = await fetch(path);
                if (response.ok) {
                    const data = await response.json();
                    if (data[collectionName]) return data[collectionName];
                    if (Array.isArray(data)) return data;
                    return data;
                }
            }
        } catch (err) {
            console.warn(`[TedData] JSON fetch failed for ${collectionName}`);
        }

        return [];
    }

    // --- Specific Getters ---

    async getMenu() {
        const raw = await this.fetchData('menu');
        // If it's the old JSON structure (starters, mains), flatten it
        // Firestore is array, but fallback json might be object
        if (raw.starters || raw.mains) {
            let items = [];
            if (raw.starters) items = items.concat(raw.starters.map(i => ({ ...i, category: 'Entrée' })));
            if (raw.mains) items = items.concat(raw.mains.map(i => ({ ...i, category: 'Plat' })));
            if (raw.desserts) items = items.concat(raw.desserts.map(i => ({ ...i, category: 'Dessert' })));
            return items;
        }
        return raw;
    }
}

// Export singleton
window.TedAPI = new TedDataService();
window.tedApi = window.TedAPI;
