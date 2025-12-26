/**
 * MODULE PAGES CMS
 * Gestion des pages et du contenu textuel
 */

const PagesAdmin = {
    init() {
        console.log("Pages Admin Init");
        this.renderList();
    },

    renderList() {
        const container = document.getElementById('pages-content');
        if (!container) return;

        const pages = TedDB.findAll('content_pages');

        // Define map function manually for cleaner HTML generation
        const rows = pages.map(page => {
            const statusBadge = page.status === 'published'
                ? '<span class="badge badge-success">Publié</span>'
                : '<span class="badge badge-warning">Brouillon</span>';

            const date = new Date(page.lastModified).toLocaleDateString();

            return `
            <tr>
                <td style="font-weight: 600;">${page.title} <br> <span style="font-size:0.75rem; color:#94a3b8; font-weight:400;">/${page.slug}</span></td>
                <td>${statusBadge}</td>
                <td>${date}</td>
                <td>
                    <button class="btn-action btn-edit" onclick="PagesAdmin.editPage('${page.id}')"><i class="fa-solid fa-pen"></i> Éditer</button>
                    <!-- <button class="btn-action" style="background:none; color:#3b82f6;" onclick="window.open('../${page.slug}', '_blank')"><i class="fa-solid fa-eye"></i></button> -->
                </td>
            </tr>
            `;
        }).join('');

        container.innerHTML = `
            <div class="card-table">
                <table>
                    <thead>
                        <tr>
                            <th>Titre Page</th>
                            <th>Statut</th>
                            <th>Dernière Modif</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rows}
                    </tbody>
                </table>
            </div>
        `;
    },

    editPage(id) {
        const page = TedDB.findById('content_pages', id);
        if (!page) return;

        // Render Blocks Form
        let blocksHtml = '';
        if (page.blocks && page.blocks.length > 0) {
            blocksHtml = page.blocks.map((block, index) => {
                let input = '';
                if (block.type === 'text') {
                    input = `<input type="text" name="block_${index}" value="${block.value}" style="width:100%; padding:0.75rem; border:1px solid #e2e8f0; border-radius:6px;">`;
                } else if (block.type === 'textarea') {
                    input = `<textarea name="block_${index}" rows="4" style="width:100%; padding:0.75rem; border:1px solid #e2e8f0; border-radius:6px;">${block.value}</textarea>`;
                } else if (block.type === 'image') {
                    input = `
                        <div style="display:flex; gap:10px;">
                            <input type="text" id="img_input_${index}" name="block_${index}" value="${block.value}" style="flex:1; padding:0.75rem; border:1px solid #e2e8f0; border-radius:6px;">
                            <button type="button" class="btn-action" style="background:#3b82f6; color:white;" onclick="MediaAdmin.openPicker((url) => document.getElementById('img_input_${index}').value = url)">
                                <i class="fa-solid fa-image"></i> Choisir
                            </button>
                        </div>
                    `;
                }

                return `
                    <div class="form-group" style="margin-bottom:1.5rem; background:#f8fafc; padding:1rem; border-radius:8px; border:1px solid #e2e8f0;">
                        <label style="display:block; font-weight:600; margin-bottom:0.5rem; color:#475569;">${block.label} <span style="font-weight:400; font-size:0.7rem; color:#94a3b8;">(${block.id})</span></label>
                        ${input}
                        <input type="hidden" name="block_id_${index}" value="${block.id}">
                    </div>
                `;
            }).join('');
        } else {
            blocksHtml = `<p style="color:#64748b; font-style:italic;">Aucun bloc de contenu configurable pour cette page.</p>`;
        }

        const modalHtml = `
            <div class="modal-overlay">
                <div class="modal-card fade-in-up" style="max-width: 700px; width: 100%; max-height: 90vh; overflow-y: auto;">
                    <div class="modal-header" style="position:sticky; top:0; background:white; z-index:10; padding-bottom:1rem; border-bottom:1px solid #e2e8f0; margin-bottom:1rem;">
                        <h3>Éditer Page : ${page.title}</h3>
                        <button onclick="this.closest('.modal-overlay').remove()" style="background:none; border:none; color:#64748b; font-size:1.5rem; cursor:pointer;">&times;</button>
                    </div>
                    <form id="pages-form">
                        <div class="form-group" style="margin-bottom:1.5rem;">
                            <label style="display:block; font-weight:500; margin-bottom:0.5rem;">Titre de la page (SEO)</label>
                            <input type="text" name="title" value="${page.title}" required style="width:100%; padding:0.75rem; border:1px solid #e2e8f0; border-radius:6px;">
                        </div>

                        <div class="form-group" style="margin-bottom:1.5rem;">
                             <label style="display:flex; align-items:center; gap:0.5rem; cursor:pointer;">
                                <input type="checkbox" name="published" ${page.status === 'published' ? 'checked' : ''}>
                                <span style="font-weight:500;">Page Publiée</span>
                            </label>
                        </div>

                        <h4 style="margin-bottom:1rem; color:#1e293b; border-bottom:1px solid #e2e8f0; padding-bottom:0.5rem;">Blocs de Contenu</h4>
                        ${blocksHtml}

                        <div style="margin-top:2rem; display:flex; justify-content:flex-end; gap:1rem;">
                            <button type="button" onclick="this.closest('.modal-overlay').remove()" style="padding:0.75rem 1.5rem; background:#f1f5f9; color:#475569; border:none; border-radius:6px; cursor:pointer; font-weight:600;">Annuler</button>
                            <button type="submit" style="padding:0.75rem 1.5rem; background:#3b82f6; color:white; border:none; border-radius:6px; cursor:pointer; font-weight:600;">Enregistrer</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHtml);

        document.getElementById('pages-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);

            // Update Base Info
            const updates = {
                title: formData.get('title'),
                status: formData.get('published') === 'on' ? 'published' : 'draft',
                lastModified: new Date().toISOString(),
                blocks: page.blocks // Start with existing blocks structure
            };

            // Update Blocks Values
            if (updates.blocks) {
                updates.blocks.forEach((block, index) => {
                    const newVal = formData.get(`block_${index}`);
                    if (newVal !== null) block.value = newVal;
                });
            }

            TedDB.update('content_pages', id, updates);
            document.querySelector('.modal-overlay').remove();
            this.renderList();
        });
    }
};

window.PagesAdmin = PagesAdmin;
