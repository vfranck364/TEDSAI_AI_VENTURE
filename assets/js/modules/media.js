/**
 * MODULE: MÉDIATHÈQUE (Gestion Images)
 */

const MediaAdmin = {
    // Images simulées (viendrait de Storage en prod)
    images: [
        { url: '../assets/images/logos/tedsai_logo.jpg', name: 'Logo TEDSAI' },
        { url: '../assets/images/logos/garden_logo.jpg', name: 'Logo Garden' },
        { url: '../assets/images/logos/vitedia_logo.jpg', name: 'Logo viTEDia' },
        { url: '../assets/images/hero_bg.png', name: 'Hero Background' },
        { url: '../assets/images/placeholder_dish.jpg', name: 'Plat Exemple' }
    ],

    init() {
        console.log("🖼 MediaAdmin: Init");
        this.render();
    },

    render() {
        const container = document.getElementById('media-content');
        if (!container) return;

        let html = `
            <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap:1rem;">
                <div class="media-upload-card" onclick="MediaAdmin.openUploadModal()" 
                     style="border:2px dashed #cbd5e1; border-radius:8px; display:flex; flex-direction:column; align-items:center; justify-content:center; cursor:pointer; height:150px; background:#f8fafc; color:#64748b; transition:all 0.2s;">
                    <i class="fa-solid fa-cloud-arrow-up" style="font-size:2rem; margin-bottom:0.5rem;"></i>
                    <span style="font-weight:600;">Uploader</span>
                </div>
        `;

        this.images.forEach(img => {
            html += `
                <div class="media-card" style="position:relative; border-radius:8px; overflow:hidden; border:1px solid #e2e8f0; height:150px;">
                    <img src="${img.url}" style="width:100%; height:100%; object-fit:cover;" alt="${img.name}">
                    <div style="position:absolute; bottom:0; left:0; right:0; background:rgba(0,0,0,0.7); color:white; padding:4px 8px; font-size:0.75rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                        ${img.name}
                    </div>
                </div>
            `;
        });

        html += `</div>`;
        container.innerHTML = html;
    },

    openUploadModal() {
        // Simulation d'upload
        const url = prompt("Simulez un upload en entrant l'URL d'une image (ex: https://via.placeholder.com/150):");
        if (url) {
            this.images.push({ url: url, name: 'Nouvelle Image' });
            this.render();
            alert("Image ajoutée à la galerie (Session uniquement)");
        }
    }
};

window.MediaAdmin = MediaAdmin;
