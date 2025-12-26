/**
 * MODULE RESTAURANT ADMIN
 * Gère l'interface de gestion des menus et plats
 */

const RestaurantAdmin = {
    init() {
        console.log("Restaurant Admin Init");
        this.renderMenuTable();
    },

    // --- VIEW LOGIC ---
    renderMenuTable() {
        const container = document.getElementById('restaurant-content');
        if (!container) return;

        const menuItems = TedDB.findAll('menu');
        if (menuItems.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fa-solid fa-utensils fa-3x" style="color:#cbd5e0; margin-bottom:1rem;"></i>
                    <p>Aucun plat dans le menu.</p>
                    <button class="btn btn-primary" onclick="RestaurantAdmin.openModal()">Ajouter un plat</button>
                </div>`;
            return;
        }

        // Group by Category
        const categories = { 'Entrée': [], 'Plat de Résistance': [], 'Dessert': [], 'Boisson': [], 'Autre': [] };
        menuItems.forEach(item => {
            let cat = item.category || 'Plat de Résistance';
            if (cat === 'Plat') cat = 'Plat de Résistance';
            if (cat === 'Boisson / Autre') cat = 'Boisson';
            if (cat === 'Boisson') cat = 'Boisson';

            if (!categories[cat]) categories[cat] = [];
            categories[cat].push(item);
        });

        let html = '';
        const order = ['Entrée', 'Plat de Résistance', 'Dessert', 'Boisson', 'Autre'];
        const displayTitles = {
            'Entrée': 'Entrées',
            'Plat de Résistance': 'Plats de Résistance',
            'Dessert': 'Desserts',
            'Boisson': 'Boissons',
            'Autre': 'Autres'
        };

        order.forEach(catName => {
            const items = categories[catName];
            if (items.length === 0) return;

            html += `
            <div class="menu-category-block">
                <h4 style="border-bottom: 2px solid #e2e8f0; padding-bottom: 0.5rem; margin-top: 2rem; color: var(--color-vitedia-primary); font-family: var(--font-accent); text-transform: uppercase; letter-spacing: 1px;">
                    ${displayTitles[catName]}
                </h4>
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th style="width: 80px;">Img</th>
                            <th>Nom & Description</th>
                            <th>Prix</th>
                            <th>Dispo</th>
                            <th style="text-align: right;">Actions</th>
                        </tr>
                    </thead>
                    <tbody>`;

            items.forEach(item => {
                const statusBadge = item.available
                    ? `<span class="badge badge-success">En ligne</span>`
                    : `<span class="badge badge-danger">Épuisé</span>`;

                const imgDisplay = item.image && item.image.length > 10
                    ? `<img src="${item.image}" class="table-thumb" onerror="this.src='../assets/images/placeholder_dish.jpg'">`
                    : `<div class="table-thumb-placeholder"><i class="fa-solid fa-image"></i></div>`;

                html += `
                        <tr>
                            <td>${imgDisplay}</td>
                            <td>
                                <strong>${item.name}</strong>
                                <p style="font-size: 0.85rem; color: #718096; margin-top: 2px;">${item.description || ''}</p>
                            </td>
                            <td style="font-weight: 500;">${item.price.toLocaleString()} FCFA</td>
                            <td>${statusBadge}</td>
                            <td style="text-align: right;">
                                <button class="btn-icon" onclick="RestaurantAdmin.toggleAvailability('${item.id}')" title="Changer Dispo">
                                    <i class="fa-solid fa-sync"></i>
                                </button>
                                <button class="btn-icon" onclick="RestaurantAdmin.openModal('${item.id}')" title="Modifier">
                                    <i class="fa-solid fa-edit"></i>
                                </button>
                                <button class="btn-icon delete" onclick="RestaurantAdmin.deleteItem('${item.id}')" title="Supprimer">
                                    <i class="fa-solid fa-trash"></i>
                                </button>
                            </td>
                        </tr>`;
            });

            html += `</tbody></table></div>`;
        });

        container.innerHTML = html;
        // Re-inject Add Button at top if needed, or rely on Header button
    },

    // --- ACTIONS ---

    openModal(id = null) {
        const item = id ? TedDB.find('menu', i => i.id == id) : null;
        const isEdit = !!item;

        const modalHtml = `
            <div class="modal-overlay" id="modal-overlay">
                <div class="modal-card fade-in-up">
                    <h3>${isEdit ? 'Modifier' : 'Nouveau'} Plat</h3>
                    <form id="dish-form">
                        <div class="form-group">
                            <label>Nom du plat</label>
                            <input type="text" name="name" class="form-control" required value="${item?.name || ''}">
                        </div>
                        
                        <div class="row">
                            <div class="form-group half">
                                <label>Catégorie</label>
                                <select name="category" class="form-control">
                                    <option value="Entrée" ${item?.category === 'Entrée' ? 'selected' : ''}>Entrée</option>
                                    <option value="Plat de Résistance" ${item?.category === 'Plat de Résistance' || item?.category === 'Plat' ? 'selected' : ''}>Plat de Résistance</option>
                                    <option value="Dessert" ${item?.category === 'Dessert' ? 'selected' : ''}>Dessert</option>
                                    <option value="Boisson" ${item?.category === 'Boisson' || item?.category === 'Boisson / Autre' ? 'selected' : ''}>Boisson</option>
                                    <option value="Autre" ${item?.category === 'Autre' ? 'selected' : ''}>Autre / Accompagnement</option>
                                </select>
                            </div>
                            <div class="form-group half">
                                <label>Prix (FCFA)</label>
                                <input type="number" step="100" name="price" class="form-control" required value="${item?.price || ''}">
                            </div>
                        </div>

                        <div class="form-group">
                            <label>Description (Ingrédients, allergènes...)</label>
                            <textarea name="description" class="form-control" rows="3">${item?.description || ''}</textarea>
                        </div>

                        <div class="form-group">
                             <label>Image du plat</label>
                             <input type="file" id="imageInput" class="form-control" accept="image/*">
                             <input type="hidden" name="image" id="imageHidden" value="${item?.image || ''}">
                             <div id="imagePreview" style="margin-top: 10px; height: 150px; background: #f8f9fa; border: 2px dashed #ddd; display: flex; align-items: center; justify-content: center; border-radius: 6px; overflow: hidden;">
                                 ${item?.image ? `<img src="${item.image}" style="max-height: 100%; max-width: 100%; object-fit: contain;">` : '<span style="color:#aaa">Aucune image sélectionnée</span>'}
                             </div>
                        </div>

                        <div class="modal-actions">
                            <button type="button" class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Annuler</button>
                            <button type="submit" class="btn btn-primary" id="btn-save">Enregistrer</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.getElementById('modal-overlay')?.remove();
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        // 2. Handle File Change
        const fileInput = document.getElementById('imageInput');
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                if (file.size > 2 * 1024 * 1024) { // 2MB limit check
                    alert("L'image est trop lourde (> 2Mo). Veuillez la compresser.");
                    fileInput.value = "";
                    return;
                }
                const reader = new FileReader();
                reader.onload = (e) => {
                    document.getElementById('imageHidden').value = e.target.result;
                    document.getElementById('imagePreview').innerHTML = `<img src="${e.target.result}" 
                        onerror="this.src='../assets/images/placeholder_dish.jpg'"
                        style="max-height: 100%; max-width: 100%; object-fit: contain;">`;
                };
                reader.readAsDataURL(file);
            }
        });

        // 3. Handle Submit
        document.getElementById('dish-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('btn-save');
            const originalText = btn.textContent;

            try {
                btn.disabled = true;
                btn.textContent = 'Enregistrement...';

                const formData = new FormData(e.target);
                const priceVal = parseFloat(formData.get('price'));

                const data = {
                    name: formData.get('name'),
                    category: formData.get('category'),
                    price: isNaN(priceVal) ? 0 : priceVal,
                    description: formData.get('description'),
                    image: document.getElementById('imageHidden').value,
                    available: isEdit ? item.available : true
                };

                console.log("Saving Item Data:", data);

                if (isEdit) {
                    TedDB.update('menu', id, data);
                } else {
                    TedDB.add('menu', data);
                }

                alert("✅ Plat enregistré avec succès !");
                document.querySelector('.modal-overlay').remove();
                this.renderMenuTable();

            } catch (err) {
                console.error("Save Error:", err);
                alert("❌ Erreur lors de l'enregistrement. Vérifiez la console ou la taille de votre image.");
            } finally {
                btn.disabled = false;
                btn.textContent = originalText;
            }
        });
    },

    deleteItem(id) {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce plat ?')) {
            TedDB.delete('menu', id);
            this.renderMenuTable();
        }
    },

    toggleAvailability(id) {
        const item = TedDB.find('menu', i => i.id == id);
        if (item) {
            TedDB.update('menu', id, { available: !item.available });
            this.renderMenuTable();
        }
    }
};

// Global Export
window.RestaurantAdmin = RestaurantAdmin;
