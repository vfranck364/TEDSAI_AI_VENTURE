/**
 * TEDSAI CMS LOADER
 * Synchronises public site content with Admin Dashboard edits.
 */

const TedCMS = {
    async init() {
        console.log("📝 TedCMS: Initializing...");

        // 1. Identify Current Page
        const path = window.location.pathname;
        let slug = path.split('/').pop() || 'index.html';
        if (path.includes('/pages/')) slug = 'pages/' + slug;

        // 2. Fetch Pages Data
        if (!window.TedAPI) {
            console.error("📝 TedCMS: TedAPI not found");
            return;
        }

        const allPages = await window.TedAPI.Content.getAllPages(); // Using API method or direct TedDB
        const pageData = allPages ? allPages.find(p => p.slug === slug) : null;

        if (pageData) {
            console.log(`📝 TedCMS: Found config for ${slug}`);
            this.applyContent(pageData);
        } else {
            console.log(`📝 TedCMS: No dynamic config found for page ${slug}`);
        }
    },

    applyContent(page) {
        // Update Title (SEO)
        if (page.title) {
            document.title = page.title;
        }

        // Update Blocks
        if (page.blocks) {
            page.blocks.forEach(block => {
                // Find element by data-cms-id
                const el = document.querySelector(`[data-cms-id="${block.id}"]`);
                if (el) {
                    if (block.type === 'image') {
                        if (el.tagName === 'IMG') {
                            el.src = block.value;
                        } else {
                            // Assume background image for other tags (div, section, header)
                            el.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('${block.value}')`;
                        }
                    } else if (block.type === 'text' || block.type === 'textarea') {
                        el.innerHTML = block.value; // Allow HTML in textarea
                    }
                } else {
                    console.warn(`📝 TedCMS: Block element [data-cms-id="${block.id}"] not found in DOM`);
                }
            });
        }
    }
};

// Auto-run
document.addEventListener('DOMContentLoaded', () => {
    // Wait for API and DB sync
    setTimeout(() => TedCMS.init(), 1500);
});
