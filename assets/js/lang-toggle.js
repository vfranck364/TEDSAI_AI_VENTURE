/**
 * TEDSAI TRANSLATION SYSTEM
 * Simple JSON-based i18n
 */

const TedI18n = {
    currentLang: 'fr', // Default
    translations: {},

    async init() {
        console.log("🌍 TedI18n Init");

        // 1. Detect Language
        const saved = localStorage.getItem('ted_lang');
        this.currentLang = saved || (navigator.language.startsWith('en') ? 'en' : 'fr');

        // Force FR for now as requested by user priority, but system is ready
        // this.currentLang = 'fr'; 

        // 2. Load Data
        await this.loadTranslations(this.currentLang);

        // 3. Apply
        this.translatePage();

        // 4. Bind Toggle Button
        this.bindToggle();
    },

    async loadTranslations(lang) {
        try {
            // Adjust path based on location
            const isSubDir = window.location.pathname.includes('/pages/') || window.location.pathname.includes('/admin/');
            const path = isSubDir ? `../assets/data/${lang}.json` : `assets/data/${lang}.json`;

            const response = await fetch(path);
            if (response.ok) {
                this.translations = await response.json();
                console.log(`Loaded ${lang} translations`);
            } else {
                console.warn(`Could not load translations for ${lang}`);
            }
        } catch (error) {
            console.error("I18n Load Error:", error);
        }
    },

    translatePage() {
        if (!this.translations) return;

        // Find all elements with data-i18n
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const val = this.getNestedValue(this.translations, key);
            if (val) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = val;
                } else {
                    el.innerHTML = val;
                }
            }
        });

        // Update Toggle Button Text
        const btn = document.getElementById('lang-toggle-btn');
        if (btn) btn.innerText = this.currentLang === 'fr' ? 'EN' : 'FR';
    },

    getNestedValue(obj, key) {
        return key.split('.').reduce((o, i) => (o ? o[i] : null), obj);
    },

    toggle() {
        const newLang = this.currentLang === 'fr' ? 'en' : 'fr';
        this.currentLang = newLang;
        localStorage.setItem('ted_lang', newLang);
        location.reload(); // Simple reload to fetch new JSON and re-render
    },

    bindToggle() {
        const btn = document.getElementById('lang-toggle-btn');
        if (btn) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggle();
            });
        }
    }
};

// Start
document.addEventListener('DOMContentLoaded', () => {
    TedI18n.init();
});
