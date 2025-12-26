/**
 * MODULE IA / SERVICES ADMIN
 * Gère l'interface de gestion des solutions IA
 */

const IAAdmin = {
    init() {
        console.log("IA Admin Init");
        this.renderTable();
    },

    renderTable() {
        const container = document.getElementById('ia-content');
        if (!container) return;

        const services = TedDB.findAll('ia_services');

        if (services.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fa-solid fa-brain fa-3x" style="color:#cbd5e0; margin-bottom:1rem;"></i>
                    <p>Aucun service IA configuré.</p>
                    <button class="btn btn-info" onclick="IAAdmin.openModal()" style="background:#0ea5e9; border:none; color:white;">Ajouter un service</button>
                </div>`;
            return;
        }

        let html = `
        <div class="card-table">
            <table>
                <thead>
                    <tr>
                        <th style="width: 50px;">Icon</th>
                        <th>Nom du Service</th>
                        <th>Catégorie</th>
                        <th>Prix / Tarification</th>
                        <th>Statut</th>
                        <th style="text-align: right;">Actions</th>
                    </tr>
                </thead>
                <tbody>`;

        services.forEach(item => {
            const statusBadge = item.active
                ? `<span class="badge badge-success">Actif</span>`
                : `<span class="badge badge-gray">Inactif</span>`;

            html += `
                <tr>
                    <td style="text-align:center; font-size:1.2rem; color:#0ea5e9;">
                        <i class="${item.icon || 'fa-solid fa-microchip'}"></i>
                    </td>
                    <td>
                        <strong>${item.name}</strong>
                        <p style="font-size: 0.85rem; color: #718096; margin-top: 2px;">${item.description ? item.description.substring(0, 50) + '...' : ''}</p>
                    </td>
                    <td>${item.category || 'Général'}</td>
                    <td>${item.price || 'Sur Devis'}</td>
                    <td>${statusBadge}</td>
                    <td style="text-align: right;">
                        <button class="btn-icon" onclick="IAAdmin.toggleStatus('${item.id}')" title="Activer/Désactiver"><i class="fa-solid fa-power-off"></i></button>
                        <button class="btn-icon" onclick="IAAdmin.openModal('${item.id}')" title="Modifier"><i class="fa-solid fa-pen"></i></button>
                        <button class="btn-icon delete" onclick="IAAdmin.deleteItem('${item.id}')" title="Supprimer"><i class="fa-solid fa-trash"></i></button>
                    </td>
                </tr>`;
        });

        html += `</tbody></table></div>`;
        container.innerHTML = html;
    },

    openModal(id = null) {
        const item = id ? TedDB.find('ia_services', i => i.id == id) : null;
        const isEdit = !!item;

        const modalHtml = `
            <div class="modal-overlay" id="modal-overlay">
                <div class="modal-card fade-in-up">
                    <h3>${isEdit ? 'Modifier Service IA' : 'Nouveau Service IA'}</h3>
                    <form id="ia-form">
                        <div class="form-group">
                            <label>Nom du service</label>
                            <input type="text" name="name" class="form-control" required value="${item?.name || ''}" placeholder="Ex: Chatbot Juridique">
                        </div>

                        <div class="row">
                            <div class="form-group half">
                                <label>Catégorie</label>
                                <select name="category" class="form-control">
                                    <option value="Consulting" ${item?.category === 'Consulting' ? 'selected' : ''}>Consulting / Audit</option>
                                    <option value="Développement" ${item?.category === 'Développement' ? 'selected' : ''}>Développement Sur Mesure</option>
                                    <option value="Formation" ${item?.category === 'Formation' ? 'selected' : ''}>Formation</option>
                                    <option value="SaaS" ${item?.category === 'SaaS' ? 'selected' : ''}>Produit SaaS</option>
                                </select>
                            </div>
                            <div class="form-group half">
                                <label>Tarification</label>
                                <input type="text" name="price" class="form-control" value="${item?.price || ''}" placeholder="Ex: 350 000 FCFA">
                            </div>
                        </div>

                        <div class="form-group">
                             <label>Icône FontAwesome (Classe)</label>
                             <input type="text" name="icon" class="form-control" value="${item?.icon || 'fa-solid fa-robot'}" placeholder="fa-solid fa-robot">
                        </div>

                        <div class="form-group">
                            <label>Description</label>
                            <textarea name="description" class="form-control" rows="3">${item?.description || ''}</textarea>
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

        // Submit Handler
        document.getElementById('ia-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = {
                name: formData.get('name'),
                category: formData.get('category'),
                price: formData.get('price'),
                icon: formData.get('icon'),
                description: formData.get('description'),
                active: isEdit ? item.active : true
            };

            if (isEdit) {
                TedDB.update('ia_services', id, data);
            } else {
                TedDB.add('ia_services', data);
            }
            document.querySelector('.modal-overlay').remove();
            this.renderTable();
        });
    },

    deleteItem(id) {
        if (confirm('Supprimer ce service ?')) {
            TedDB.delete('ia_services', id);
            this.renderTable();
        }
    },

    toggleStatus(id) {
        const item = TedDB.find('ia_services', i => i.id == id);
        if (item) {
            TedDB.update('ia_services', id, { active: !item.active });
            this.renderTable();
        }
    }
};

window.IAAdmin = IAAdmin;
