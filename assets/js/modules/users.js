/**
 * MODULE UTILISATEURS
 * Gère le CRUD des utilisateurs et l'attribution des rôles (Auth + Firestore)
 */

const UsersAdmin = {
    init() {
        console.log("Users Admin Init");
        this.renderTable();
    },

    renderTable() {
        const tbody = document.getElementById('users-table-body');
        if (!tbody) return;

        const users = TedDB.findAll('users');
        const currentUser = TedAuth.getCurrentUser(); // Use standard method

        let html = '';

        if (users.length === 0) {
            html = '<tr><td colspan="4" style="text-align:center; padding:2rem; color:#888;">Aucun utilisateur trouvé.</td></tr>';
        } else {
            users.forEach(user => {
                const roleBadge = this.getRoleBadge(user.role);
                const isMe = currentUser && currentUser.uid === user.id; // TedDB stores doc ID as .id
                const isOnline = isMe; // Mock online status

                const statusDot = isOnline
                    ? `<span style="display:inline-block; width:10px; height:10px; background:#22c55e; border-radius:50%; margin-right:8px;" title="En ligne"></span>`
                    : `<span style="display:inline-block; width:10px; height:10px; background:#cbd5e0; border-radius:50%; margin-right:8px;" title="Hors ligne"></span>`;

                const lastLoginDisplay = user.lastLogin
                    ? new Date(user.lastLogin).toLocaleString()
                    : 'Jamais';

                // Prevent deleting yourself or other super admins if you are not THE super admin (simplified: prevent deleting super_admins)
                const canDelete = user.role !== 'super_admin';

                html += `
                <tr>
                    <td>
                        <div style="display:flex; align-items:center;">
                            ${statusDot}
                            <div>
                                <div style="font-weight:600; color:#1e293b;">${user.name} ${isMe ? '(Vous)' : ''}</div>
                                <div style="font-size:0.8rem; color:#64748b;">${user.email}</div>
                            </div>
                        </div>
                    </td>
                    <td>${roleBadge}</td>
                    <td style="color:#64748b; font-size:0.9rem;">${lastLoginDisplay}</td>
                    <td>
                        <button class="btn-icon" onclick="UsersAdmin.openModal('${user.id}')" title="Éditer"><i class="fa-solid fa-pen"></i></button>
                        ${canDelete ? `<button class="btn-icon" onclick="UsersAdmin.deleteUser('${user.id}')" title="Supprimer/Désactiver" style="color:#ef4444;"><i class="fa-solid fa-trash"></i></button>` : ''}
                    </td>
                </tr>`;
            });
        }
        tbody.innerHTML = html;
    },

    getRoleBadge(role) {
        const map = {
            'super_admin': { label: 'Super Admin', class: 'badge-warning' },
            'admin_resto': { label: 'Admin Resto', class: 'badge-success' },
            'admin_garden': { label: 'Admin Jardin', class: 'badge-success' },
            'admin_ia': { label: 'Admin IA', class: 'badge-info' },
            'visitor': { label: 'Visiteur', class: 'badge-gray' }
        };
        const r = map[role] || map['visitor'];
        return `<span class="badge ${r.class}">${r.label}</span>`;
    },

    openModal(id = null) {
        const isEdit = !!id;
        let user = { role: 'visitor' };
        if (isEdit) {
            user = TedDB.findById('users', id);
            if (!user) return;
        }

        const roles = [
            { value: 'super_admin', label: 'Super Admin' },
            { value: 'admin_resto', label: 'Admin Restaurant' },
            { value: 'admin_garden', label: 'Admin Jardin' },
            { value: 'admin_ia', label: 'Admin IA / Services' },
            { value: 'visitor', label: 'Utilisateur Standard' }
        ];

        const modalHtml = `
            <div class="modal-overlay">
                <div class="modal-content fade-in-up">
                    <div class="modal-header">
                        <h3>${isEdit ? 'Modifier Utilisateur' : 'Nouvel Administrateur'}</h3>
                        <button onclick="this.closest('.modal-overlay').remove()" style="background:none;border:none;font-size:1.5rem;cursor:pointer;">&times;</button>
                    </div>
                    <form id="user-form">
                        <div class="form-group">
                            <label>Nom complet</label>
                            <input type="text" name="name" class="form-control" value="${user.name || ''}" required>
                        </div>
                         <div class="form-group">
                            <label>Email (Identifiant)</label>
                            <input type="email" name="email" class="form-control" value="${user.email || ''}" required ${isEdit ? 'readonly style="background:#f1f5f9;"' : ''}>
                        </div>
                        <div class="form-group">
                            <label>Rôle</label>
                            <select name="role" class="form-control">
                                ${roles.map(r => `<option value="${r.value}" ${user.role === r.value ? 'selected' : ''}>${r.label}</option>`).join('')}
                            </select>
                        </div>
                         <div class="form-group">
                            <label>Mot de passe ${isEdit ? '(Laisser vide pour ne pas changer)' : ''}</label>
                            <input type="password" name="password" class="form-control" ${!isEdit ? 'required minlength="6"' : ''}>
                            <small style="color:#64748b; font-size:0.75rem;">Min 6 caractères</small>
                        </div>

                        <div id="create-error" style="color:red; font-size:0.85rem; margin-bottom:1rem; display:none;"></div>

                        <div class="modal-actions">
                            <button type="button" class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Annuler</button>
                            <button type="submit" class="btn btn-primary" id="btn-save-user">
                                ${isEdit ? 'Mettre à jour' : 'Créer Compte'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        const existingModal = document.querySelector('.modal-overlay');
        if (existingModal) existingModal.remove();

        document.body.insertAdjacentHTML('beforeend', modalHtml);

        document.getElementById('user-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('btn-save-user');
            const errorDiv = document.getElementById('create-error');

            btn.disabled = true;
            btn.textContent = "Traitement...";
            errorDiv.style.display = 'none';

            const formData = new FormData(e.target);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                role: formData.get('role')
            };
            const password = formData.get('password');

            try {
                if (isEdit) {
                    // Update Firestore Only (Auth update separate/complex)
                    // We assume email is locked for editing to keep link with Auth
                    await this.updateUserInDB(id, data);
                } else {
                    // Create New Auth User + Firestore
                    await this.createNewAuthUser(data.email, password, data);
                }

                document.querySelector('.modal-overlay').remove();
                this.renderTable();
                if (window.DashboardHome) window.DashboardHome.renderKPIs();

            } catch (err) {
                console.error(err);
                errorDiv.textContent = err.message || "Erreur lors de l'opération";
                errorDiv.style.display = 'block';
                btn.disabled = false;
                btn.textContent = isEdit ? 'Mettre à jour' : 'Créer Compte';
            }
        });
    },

    async createNewAuthUser(email, password, userData) {
        // 1. Initialize Secondary App to avoid logging out current admin
        if (!window.tedFirebaseConfig) throw new Error("Config Firebase introuvable");
        const secondaryApp = firebase.initializeApp(window.tedFirebaseConfig, "SecondaryApp");

        try {
            // 2. Create User
            const userCredential = await secondaryApp.auth().createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;

            // 3. Save to Firestore (TEDDB)
            // We use standard TedDB.add but we want to specify ID. 
            // TedDB.add generates ID. We prefer to use UID.
            // Let's allow TedDB to take an ID or use raw firestore

            const finalData = {
                id: user.uid, // Force ID match
                ...userData,
                createdAt: new Date().toISOString()
            };

            // Direct Firestore write for precision (or modify TedDB to accept ID)
            const { db } = window.tedFirebase;
            await db.collection('users').doc(user.uid).set(finalData);

            // Also update local cache manually since we bypassed TedDB.add partially
            // Or just trigger a reload.
            // Simplest: TedDB loadFromLocal will be stale until sync. 
            // Let's force a sync or just use TedDB if we can pass ID.

            // NOTE: TedDB.add overwrites ID if not present. If present? 
            // Let's look at db.js: "if (!item.id) item.id = ..."
            // So if we pass item.id, it uses it!

            // Let's use TedDB.add but with ID pre-filled
            // TedDB.add('users', finalData); // This pushes to local and compat sync calls .set(item.id)
            // Yes, db.js logic: if (window.tedFirebase) db.collection(...).doc(item.id).set(item)
            // So this is perfect!

            TedDB.add('users', finalData);

            console.log("✅ User created:", user.uid);

        } catch (error) {
            let msg = error.message;
            if (error.code === 'auth/email-already-in-use') msg = "Cet email est déjà utilisé.";
            if (error.code === 'auth/weak-password') msg = "Le mot de passe est trop faible.";
            throw new Error(msg);
        } finally {
            // 4. Cleanup
            secondaryApp.delete();
        }
    },

    async updateUserInDB(id, data) {
        TedDB.update('users', id, data);
    },

    deleteUser(id) {
        if (confirm('Désactiver cet utilisateur ? Il ne pourra plus se connecter.')) {
            // We can't delete from Auth client-side without their creds.
            // But we can delete from Firestore. 
            // auth.js checks Firestore on login. If doc missing, they are visitor/blocked.

            TedDB.delete('users', id);
            this.renderTable();
            if (window.DashboardHome) window.DashboardHome.renderKPIs();
        }
    }
};

window.UsersAdmin = UsersAdmin;
