/**
 * MODULE: GESTION DES PAGES DU SITE
 */

const PagesAdmin = {
    // Configuration: Liste des pages connues du site
    pagesList: [
        { id: 'home', path: 'index.html', title: 'Accueil', desc: 'Page principale' },
        { id: 'ia', path: 'pages/solutions-ia.html', title: 'Solutions IA', desc: 'Offres B2B' },
        { id: 'resto', path: 'pages/vitedia.html', title: 'Restaurant viTEDia', desc: 'Réservations et Menu' },
        { id: 'garden', path: 'pages/garden.html', title: 'SelecTED Gardens', desc: 'Produits et Jardin' },
        { id: 'obs', path: 'pages/observatoire.html', title: 'Observatoire', desc: 'Blog et Analyses' },
        { id: 'ecosystem', path: 'pages/ecosystem.html', title: 'Écosystème', desc: 'Vue d\'ensemble' },
        { id: 'contact', path: 'pages/contact.html', title: 'Contact', desc: 'Formulaire' },
        { id: 'about', path: 'pages/a-propos.html', title: 'À Propos', desc: 'Histoire et Mission' }
    ],

    // Initialisation
    init() {
        console.log("📄 PagesAdmin: Init");
        this.render();
    },

    // Rendu de la liste
    render() {
        const container = document.getElementById('pages-content');
        if (!container) return;

        let html = `
            <div class="card-table">
                <div class="card-header">
                    <h3>Liste des Pages (${this.pagesList.length})</h3>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Page</th>
                            <th>Chemin</th>
                            <th>Statut</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        this.pagesList.forEach(page => {
            html += `
                <tr>
                    <td>
                        <div style="font-weight:600; color:#0f172a;">${page.title}</div>
                        <div style="font-size:0.8rem; color:#64748b;">${page.desc}</div>
                    </td>
                    <td style="font-family:monospace; color:#3b82f6;">${page.path}</td>
                    <td><span class="badge badge-success">Publié</span></td>
                    <td>
                        <button class="btn-action btn-edit" onclick="PagesAdmin.editPage('${page.id}')">
                            <i class="fa-solid fa-pen"></i> Éditer Métas
                        </button>
                        <a href="../${page.path}" target="_blank" class="btn-action">
                            <i class="fa-solid fa-external-link-alt"></i> Voir
                        </a>
                    </td>
                </tr>
            `;
        });

        html += `   </tbody>
                </table>
            </div>
            
            <!-- Modal Édition Simple -->
            <div id="page-edit-modal" class="modal-overlay" style="display:none;">
                <div class="modal-card">
                    <h3 style="margin-bottom:1rem;">Éditer Page</h3>
                    <p style="margin-bottom:1rem; color:#666;" id="edit-page-name">...</p>
                    
                    <div class="form-group" style="margin-bottom:1rem;">
                        <label style="display:block; margin-bottom:5px; font-weight:600;">Titre (SEO)</label>
                        <input type="text" id="edit-seo-title" style="width:100%; padding:8px; border:1px solid #ccc; border-radius:4px;">
                    </div>

                    <div class="form-group" style="margin-bottom:1rem;">
                        <label style="display:block; margin-bottom:5px; font-weight:600;">Description (Meta)</label>
                        <textarea id="edit-seo-desc" rows="3" style="width:100%; padding:8px; border:1px solid #ccc; border-radius:4px;"></textarea>
                    </div>

                    <div style="text-align:right; margin-top:2rem;">
                         <button onclick="document.getElementById('page-edit-modal').style.display='none'" 
                            style="background:none; border:none; color:#666; margin-right:1rem; cursor:pointer;">Annuler</button>
                        <button onclick="PagesAdmin.savePage()" 
                            style="background:#3b82f6; color:white; padding:8px 20px; border:none; border-radius:4px; cursor:pointer;">Enregistrer</button>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = html;
    },

    currentEditId: null,

    // Ouvrir Modal
    editPage(id) {
        const page = this.pagesList.find(p => p.id === id);
        if (!page) return;

        this.currentEditId = id;
        document.getElementById('edit-page-name').innerText = `Modification de : ${page.title}`;
        document.getElementById('edit-seo-title').value = page.title; // Simulé (viendrait de la DB en vrai)
        document.getElementById('edit-seo-desc').value = `Description optimisée pour ${page.title}...`; // Simulé

        document.getElementById('page-edit-modal').style.display = "flex";
    },

    // Sauvegarder (Simulation)
    savePage() {
        const newTitle = document.getElementById('edit-seo-title').value;
        const newDesc = document.getElementById('edit-seo-desc').value;

        // Ici, on enregistrerait dans Firebase Firestore collection 'pages_meta'
        alert(`✅ Méta-données simulées sauvegardées pour ${this.currentEditId}:\nTitre: ${newTitle}\nDesc: ${newDesc}`);
        document.getElementById('page-edit-modal').style.display = "none";
    }
};

// Expose Globalement
window.PagesAdmin = PagesAdmin;
