/**
 * MODULE GARDEN ADMIN
 * Gère l'interface de gestion des produits du jardin
 */

const GardenAdmin = {
    init() {
        console.log("Garden Admin Init");
        this.renderTable();
    },

    renderTable() {
        const container = document.getElementById('garden-content');
        // Note: We need to update dashboard.html to have id='garden-content' instead of the placeholder
        // For now, let's assume I will update dashboard.html next.
        if (!container) return;

        const products = TedDB.findAll('garden_products');

        if (products.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fa-solid fa-leaf fa-3x" style="color:#cbd5e0; margin-bottom:1rem;"></i>
                    <p>Votre jardin est vide.</p>
                    <button class="btn btn-success" onclick="GardenAdmin.openModal()" style="background:#22c55e; border:none;">Ajouter une récolte</button>
                </div>`;
            return;
        }

        let html = `
        <div class="card-table">
            <table>
                <thead>
                    <tr>
                        <th style="width: 80px;">Img</th>
                        <th>Produit</th>
                        <th>Catégorie</th>
                        <th>Saison</th>
                        <th>Stock/Dispo</th>
                        <th style="text-align: right;">Actions</th>
                    </tr>
                </thead>
                <tbody>`;

        products.forEach(item => {
            const imgDisplay = item.image
                ? `<img src="${item.image}" class="table-thumb">`
                : `<div class="table-thumb-placeholder"><i class="fa-solid fa-image"></i></div>`;

            const statusBadge = item.inStock
                ? `<span class="badge badge-success">En Stock</span>`
                : `<span class="badge badge-danger">Rupture</span>`;

            html += `
                <tr>
                    <td>${imgDisplay}</td>
                    <td>
                        <strong>${item.name}</strong>
                        <p style="font-size: 0.85rem; color: #718096; margin-top: 2px;">${item.variety || ''}</p>
                    </td>
                    <td>${item.category}</td>
                    <td>${item.season || 'Toute l\'année'}</td>
                    <td>${statusBadge}</td>
                    <td style="text-align: right;">
                        <button class="btn-icon" onclick="GardenAdmin.toggleStock('${item.id}')" title="Changer Stock"><i class="fa-solid fa-box"></i></button>
                        <button class="btn-icon" onclick="GardenAdmin.openModal('${item.id}')" title="Modifier"><i class="fa-solid fa-pen"></i></button>
                        <button class="btn-icon delete" onclick="GardenAdmin.deleteItem('${item.id}')" title="Supprimer"><i class="fa-solid fa-trash"></i></button>
                    </td>
                </tr>`;
        });

        html += `</tbody></table></div>`;
        container.innerHTML = html;
    },

    openModal(id = null) {
        const item = id ? TedDB.find('garden_products', i => i.id == id) : null;
        const isEdit = !!item;

        const modalHtml = `
            <div class="modal-overlay" id="modal-overlay">
                <div class="modal-card fade-in-up">
                    <h3>${isEdit ? 'Modifier Récolte' : 'Nouvelle Récolte'}</h3>
                    <form id="garden-form">
                        <div class="form-group">
                            <label>Nom du produit</label>
                            <input type="text" name="name" class="form-control" required value="${item?.name || ''}" placeholder="Ex: Tomates Cœur de Bœuf">
                        </div>
                         <div class="form-group">
                            <label>Variété (Optionnel)</label>
                            <input type="text" name="variety" class="form-control" value="${item?.variety || ''}">
                        </div>
                        
                        <div class="row">
                            <div class="form-group half">
                                <label>Catégorie</label>
                                <select name="category" class="form-control">
                                    <option value="Légume" ${item?.category === 'Légume' ? 'selected' : ''}>Légume</option>
                                    <option value="Fruit" ${item?.category === 'Fruit' ? 'selected' : ''}>Fruit</option>
                                    <option value="Aromate" ${item?.category === 'Aromate' ? 'selected' : ''}>Aromate</option>
                                    <option value="Épice" ${item?.category === 'Épice' ? 'selected' : ''}>Épice</option>
                                </select>
                            </div>
                            <div class="form-group half">
                                <label>Saison</label>
                                <input type="text" name="season" class="form-control" value="${item?.season || ''}" placeholder="Ex: Été, Toute l'année">
                            </div>
                        </div>

                        <div class="form-group">
                             <label>Photo</label>
                             <input type="file" id="gardenImageInput" class="form-control" accept="image/*">
                             <input type="hidden" name="image" id="gardenImageHidden" value="${item?.image || ''}">
                             <div id="gardenImagePreview" style="margin-top: 10px; height: 150px; background: #f8f9fa; border: 2px dashed #ddd; display: flex; align-items: center; justify-content: center; border-radius: 6px; overflow: hidden;">
                                 ${item?.image ? `<img src="${item.image}" style="max-height: 100%; max-width: 100%; object-fit: contain;">` : '<span style="color:#aaa">Aucune image</span>'}
                             </div>
                        </div>

                        <div class="modal-actions">
                            <button type="button" class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Annuler</button>
                            <button type="submit" class="btn btn-primary">Enregistrer</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.getElementById('modal-overlay')?.remove();
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        // File Handler
        const fileInput = document.getElementById('gardenImageInput');
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                if (file.size > 2 * 1024 * 1024) {
                    alert("Image trop lourde (> 2Mo)");
                    fileInput.value = "";
                    return;
                }
                const reader = new FileReader();
                reader.onload = (ev) => {
                    document.getElementById('gardenImageHidden').value = ev.target.result;
                    document.getElementById('gardenImagePreview').innerHTML = `<img src="${ev.target.result}" style="max-height: 100%; max-width: 100%; object-fit: contain;">`;
                };
                reader.readAsDataURL(file);
            }
        });

        // Submit Handler
        document.getElementById('garden-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = {
                name: formData.get('name'),
                variety: formData.get('variety'),
                category: formData.get('category'),
                season: formData.get('season'),
                image: document.getElementById('gardenImageHidden').value,
                inStock: isEdit ? item.inStock : true
            };

            if (isEdit) {
                TedDB.update('garden_products', id, data);
            } else {
                TedDB.add('garden_products', data);
            }
            document.querySelector('.modal-overlay').remove();
            this.renderTable();
        });
    },

    deleteItem(id) {
        if (confirm('Supprimer ce produit ?')) {
            TedDB.delete('garden_products', id);
            this.renderTable();
        }
    },

    toggleStock(id) {
        const item = TedDB.find('garden_products', i => i.id == id);
        if (item) {
            TedDB.update('garden_products', id, { inStock: !item.inStock });
            this.renderTable();
        }
    }
};

window.GardenAdmin = GardenAdmin;
