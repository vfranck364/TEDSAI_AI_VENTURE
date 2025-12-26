/**
 * MODULE MEDIA LIBRARY
 * Gestion centralisée des images et fichiers
 */

const MediaAdmin = {
    init() {
        console.log("Media Admin Init");
        this.renderGallery();
    },

    renderGallery(containerId = 'media-content', isPicker = false) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const media = TedDB.findAll('media_library');

        let html = '';

        if (media.length === 0) {
            html = `
                <div style="text-align: center; padding: 3rem; color: #64748b; background: white; border-radius: 12px; border: 1px dashed #cbd5e1;">
                    <i class="fa-solid fa-images" style="font-size: 2rem; margin-bottom: 1rem; color: #cbd5e1;"></i>
                    <p>La médiathèque est vide.</p>
                    <button class="btn-action" style="background:#3b82f6; color:white; margin-top:1rem;" onclick="MediaAdmin.openUploadModal()">
                        <i class="fa-solid fa-cloud-arrow-up"></i> Ajouter une image
                    </button>
                </div>`;
        } else {
            html = `<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 1rem;">`;

            // Add Button in Grid
            if (!isPicker) {
                html += `
                <div onclick="MediaAdmin.openUploadModal()" 
                    style="border: 2px dashed #cbd5e1; border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 150px; cursor: pointer; transition: all 0.2s; color: #64748b; background: #f8fafc;">
                    <i class="fa-solid fa-plus" style="font-size: 1.5rem; margin-bottom: 0.5rem;"></i>
                    <span style="font-size: 0.8rem; font-weight: 600;">Ajouter</span>
                </div>`;
            }

            media.forEach(item => {
                const actionBtn = isPicker
                    ? `<button class="btn-action" style="width:100%; background:#3b82f6; color:white; margin-top:0.5rem; font-size:0.8rem;" onclick="MediaAdmin.selectImage('${item.url}')">Choisir</button>`
                    : `<button class="btn-icon" onclick="MediaAdmin.deleteImage('${item.id}')" title="Supprimer" style="position:absolute; top:5px; right:5px; background:white; border-radius:50%; width:25px; height:25px; display:flex; align-items:center; justify-content:center; color:#ef4444; box-shadow:0 2px 5px rgba(0,0,0,0.1);"><i class="fa-solid fa-trash" style="font-size:0.7rem;"></i></button>`;

                html += `
                <div style="position: relative; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); aspect-ratio: 1;">
                    <img src="${item.url}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover;">
                    ${actionBtn}
                    <div style="position:absolute; bottom:0; left:0; right:0; background:rgba(0,0,0,0.6); color:white; padding:4px 8px; font-size:0.7rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                        ${item.name}
                    </div>
                </div>`;
            });
            html += `</div>`;
        }

        container.innerHTML = html;
    },

    openUploadModal() {
        const modalHtml = `
            <div class="modal-overlay" id="media-modal-overlay">
                <div class="modal-card fade-in-up">
                    <div class="modal-header">
                        <h3>Ajouter un Média</h3>
                        <button onclick="document.getElementById('media-modal-overlay').remove()" style="background:none; border:none; color:#64748b; font-size:1.5rem; cursor:pointer;">&times;</button>
                    </div>
                    <form id="media-form">
                        <div class="form-group" style="margin-bottom:1.2rem;">
                            <label style="display:block; margin-bottom:0.5rem; font-weight:600;">Nom du fichier</label>
                            <input type="text" name="name" id="media-name" required style="width:100%; padding:0.75rem; border:1px solid #e2e8f0; border-radius:8px;" placeholder="Ex: logo_tedsai.png">
                        </div>
                        
                        <div class="form-group" style="margin-bottom:1.5rem;">
                             <label style="display:block; margin-bottom:0.5rem; font-weight:600;">Sélectionner une image</label>
                             <input type="file" id="media-file-input" accept="image/*" style="width:100%; padding:0.5rem; border:1px solid #e2e8f0; border-radius:8px; background:#f8fafc;">
                             <input type="hidden" name="url" id="media-url-hidden">
                             
                             <div id="media-preview" style="margin-top: 1rem; height: 180px; background: #f1f5f9; border: 2px dashed #cbd5e1; display: flex; align-items: center; justify-content: center; border-radius: 8px; overflow: hidden; color: #94a3b8;">
                                 <div style="text-align:center;">
                                     <i class="fa-solid fa-image fa-3x" style="margin-bottom:0.5rem; opacity:0.3;"></i>
                                     <p style="font-size:0.85rem;">Aucune image sélectionnée</p>
                                 </div>
                             </div>
                             <p style="font-size:0.75rem; color:#64748b; margin-top:0.5rem;"><i class="fa-solid fa-circle-info"></i> Max 2Mo. L'image sera stockée localement.</p>
                        </div>

                        <button type="submit" id="btn-media-save" disabled class="btn-action" style="background:#3b82f6; color:white; width:100%; padding:0.75rem; opacity:0.5; cursor:not-allowed;">
                            Ajouter à la bibliothèque
                        </button>
                    </form>
                </div>
            </div>
        `;
        document.getElementById('media-modal-overlay')?.remove();
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        const fileInput = document.getElementById('media-file-input');
        const preview = document.getElementById('media-preview');
        const urlHidden = document.getElementById('media-url-hidden');
        const nameInput = document.getElementById('media-name');
        const submitBtn = document.getElementById('btn-media-save');

        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            if (file.size > 2 * 1024 * 1024) {
                alert("L'image est trop lourde (> 2Mo). Veuillez la compresser.");
                fileInput.value = "";
                return;
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                const base64 = event.target.result;
                urlHidden.value = base64;

                // Update Preview
                preview.innerHTML = `<img src="${base64}" style="max-height: 100%; max-width: 100%; object-fit: contain;">`;

                // Auto-fill name if empty
                if (!nameInput.value) {
                    nameInput.value = file.name;
                }

                // Enable Submits
                submitBtn.disabled = false;
                submitBtn.style.opacity = "1";
                submitBtn.style.cursor = "pointer";
            };
            reader.readAsDataURL(file);
        });

        document.getElementById('media-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);

            const name = formData.get('name');
            const url = formData.get('url');

            if (!url) {
                alert("Veuillez sélectionner une image.");
                return;
            }

            TedDB.add('media_library', {
                name: name,
                url: url,
                type: 'image',
                date: new Date().toISOString()
            });

            document.getElementById('media-modal-overlay').remove();
            this.renderGallery();

            // Refresh counts if dashboard is active
            if (window.DashboardHome) DashboardHome.renderKPIs();
        });
    },

    deleteImage(id) {
        if (confirm("Supprimer définitivement cette image ?")) {
            TedDB.delete('media_library', id);
            this.renderGallery();
        }
    },

    // --- PICKER MODE (For other modules) ---
    openPicker(callback) {
        // Callback receives the selected URL
        this.onPick = callback;

        const modalHtml = `
            <div class="modal-overlay" id="media-picker-overlay">
                <div class="modal-card fade-in-up" style="width: 800px; max-width: 90vw; height: 80vh; display:flex; flex-direction:column;">
                    <div class="modal-header" style="flex-shrink:0; border-bottom:1px solid #e2e8f0; padding-bottom:1rem; margin-bottom:1rem;">
                        <h3>Choisir une image</h3>
                        <button onclick="document.getElementById('media-picker-overlay').remove()" style="background:none; border:none; font-size:1.5rem;">&times;</button>
                    </div>
                    <div id="picker-content" style="flex:1; overflow-y:auto;"></div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        this.renderGallery('picker-content', true);
    },

    selectImage(url) {
        if (this.onPick) {
            this.onPick(url);
            const overlay = document.getElementById('media-picker-overlay');
            if (overlay) overlay.remove();
        }
    }
};

window.MediaAdmin = MediaAdmin;
