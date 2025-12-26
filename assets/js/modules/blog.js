/**
 * ADMIN BLOG MODULE (AXE 6)
 * Gestion des articles, modération et social
 */

const BlogAdmin = {
    init() {
        this.render();
    },

    render() {
        const dashboardContent = document.getElementById('blog-content');
        if (!dashboardContent) return;

        dashboardContent.innerHTML = `
            <div class="module-header">
                <h2><i class="fa-solid fa-satellite-dish"></i> Pôle Observatoire & Social</h2>
                <div class="header-actions">
                    <button class="btn-primary" onclick="BlogAdmin.openEditor()">
                        <i class="fa-solid fa-plus"></i> Nouvel Article Officiel
                    </button>
                </div>
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-value" id="pending-count">0</div>
                    <div class="stat-label">En attente de modération</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value" id="published-count">0</div>
                    <div class="stat-label">Analyses publiées</div>
                </div>
            </div>

            <div class="data-table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Titre</th>
                            <th>Auteur</th>
                            <th>Date</th>
                            <th>Statut</th>
                            <th>Social</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="blog-list">
                        <!-- Articles loaded here -->
                    </tbody>
                </table>
            </div>
        `;

        this.updateTable();
    },

    updateTable() {
        const posts = TedDB.findAll('blog_posts');
        const list = document.getElementById('blog-list');

        document.getElementById('pending-count').textContent = posts.filter(p => p.status === 'en_attente').length;
        document.getElementById('published-count').textContent = posts.filter(p => p.status === 'publié').length;

        list.innerHTML = posts.sort((a, b) => new Date(b.date) - new Date(a.date)).map(post => `
            <tr>
                <td><strong>${post.title}</strong><br><small>${post.category}</small></td>
                <td>${post.author}</td>
                <td>${new Date(post.date).toLocaleDateString()}</td>
                <td>
                    <span class="status-badge ${post.status === 'publié' ? 'status-active' : 'status-pending'}">
                        ${post.status === 'publié' ? 'Publié' : 'En attente'}
                    </span>
                </td>
                <td>
                    <i class="fa-solid fa-heart" style="color:#ef4444;"></i> ${post.likes || 0}
                </td>
                <td class="actions-cell">
                    ${post.status === 'en_attente' ? `
                        <button class="action-btn view-btn" onclick="BlogAdmin.approve('${post.id}')" title="Approuver">
                            <i class="fa-solid fa-check"></i>
                        </button>
                    ` : ''}
                    <button class="action-btn delete-btn" onclick="BlogAdmin.delete('${post.id}')" title="Supprimer">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    },

    approve(id) {
        if (confirm("Voulez-vous publier cet article sur l'Observatoire ?")) {
            TedDB.update('blog_posts', id, { status: 'publié' });
            this.updateTable();
            alert("Article publié avec succès !");
        }
    },

    delete(id) {
        if (confirm("Supprimer définitivement cet article ?")) {
            TedDB.delete('blog_posts', id);
            this.updateTable();
        }
    },

    openEditor() {
        // Redirection simple ou modal pour MVP
        alert("L'éditeur riche sera disponible dans la version finale. Pour le moment, utilisez la soumission publique pour les tests.");
    }
};

window.BlogAdmin = BlogAdmin;
