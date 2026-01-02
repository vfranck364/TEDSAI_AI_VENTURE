/**
 * MODULE: PARAMÈTRES GLOBAUX
 */

const SettingsAdmin = {
    settings: {
        siteName: 'TEDSAI Complex',
        email: 'contact@tedsai.cm',
        phone: '+237 000 000 000',
        address: 'Yaoundé, Cameroun',
        maintenanceMode: false
    },

    init() {
        console.log("⚙️ SettingsAdmin: Init");
        this.render();
    },

    render() {
        const container = document.getElementById('view-settings'); // Cible directe de la vue
        if (!container) return;

        // On ne remplace pas tout le container (car il a une classe et id essentiels), juste le contenu après le titre
        // Mais ici, le container 'view-settings' continent déjà le titre h3. On va remplacer son innerHTML

        container.innerHTML = `
            <h3>Paramètres Globaux</h3>
            <div style="background:white; padding:2rem; border-radius:12px; margin-top:2rem; border:1px solid #e2e8f0; max-width:800px;">
                <form onsubmit="event.preventDefault(); SettingsAdmin.save();">
                    <div style="margin-bottom:1.5rem;">
                        <label style="display:block; margin-bottom:0.5rem; font-weight:600;">Nom du Site</label>
                        <input type="text" id="set-site-name" value="${this.settings.siteName}" style="width:100%; padding:10px; border:1px solid #cbd5e1; border-radius:6px;">
                    </div>

                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1.5rem; margin-bottom:1.5rem;">
                        <div>
                            <label style="display:block; margin-bottom:0.5rem; font-weight:600;">Email Contact</label>
                            <input type="email" id="set-email" value="${this.settings.email}" style="width:100%; padding:10px; border:1px solid #cbd5e1; border-radius:6px;">
                        </div>
                         <div>
                            <label style="display:block; margin-bottom:0.5rem; font-weight:600;">Téléphone</label>
                            <input type="text" id="set-phone" value="${this.settings.phone}" style="width:100%; padding:10px; border:1px solid #cbd5e1; border-radius:6px;">
                        </div>
                    </div>

                    <div style="margin-bottom:1.5rem;">
                        <label style="display:block; margin-bottom:0.5rem; font-weight:600;">Adresse</label>
                        <input type="text" id="set-address" value="${this.settings.address}" style="width:100%; padding:10px; border:1px solid #cbd5e1; border-radius:6px;">
                    </div>

                    <div style="margin-bottom:2rem; padding:1rem; background:#f8fafc; border-radius:8px;">
                        <label style="display:flex; align-items:center; cursor:pointer;">
                            <input type="checkbox" id="set-maintenance" ${this.settings.maintenanceMode ? 'checked' : ''} style="margin-right:10px; transform:scale(1.2);">
                            <span style="font-weight:600; color:#ef4444;">Mode Maintenance</span>
                        </label>
                        <p style="font-size:0.85rem; color:#64748b; margin-top:5px; margin-left:26px;">Si activé, le site affichera une page de maintenance aux visiteurs.</p>
                    </div>

                    <button type="submit" style="background:#3b82f6; color:white; padding:12px 24px; border:none; border-radius:6px; cursor:pointer; font-weight:600;">
                        Enregistrer les modifications
                    </button>
                </form>
            </div>
        `;
    },

    save() {
        this.settings.siteName = document.getElementById('set-site-name').value;
        this.settings.email = document.getElementById('set-email').value;
        this.settings.phone = document.getElementById('set-phone').value;
        this.settings.address = document.getElementById('set-address').value;
        this.settings.maintenanceMode = document.getElementById('set-maintenance').checked;

        // DB save simulation
        alert("✅ Paramètres sauvegardés avec succès !");
    }
};

window.SettingsAdmin = SettingsAdmin;
