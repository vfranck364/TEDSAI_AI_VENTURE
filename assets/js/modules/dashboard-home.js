/**
 * MODULE DASHBOARD HOME
 * Gère l'affichage des KPIs et des Logs sur la page d'accueil
 */

const DashboardHome = {
    init() {
        console.log("Dashboard Home Init");
        this.renderKPIs();
        this.renderActivityLog();
        this.renderSystemAlerts();
    },

    renderKPIs() {
        // 1. Users Count
        const users = TedDB.findAll('users');
        const admins = users.filter(u => u.role !== 'user').length; // Assuming 'user' is default, others are admins

        // 2. Content Counts
        const menuItems = TedDB.findAll('menu').length;
        const gardenItems = TedDB.findAll('garden_products') ? TedDB.findAll('garden_products').length : 0;
        const iaServices = TedDB.findAll('ia_services') ? TedDB.findAll('ia_services').length : 0;
        const totalContent = menuItems + gardenItems + iaServices;

        // 3. Update DOM
        this.updateStat('kpi-users', users.length, `Dont ${admins} admins`);
        this.updateStat('kpi-admins', admins, 'Actifs maintenant'); // Mock "Active now"
        this.updateStat('kpi-content', totalContent, `${menuItems} Resto, ${gardenItems} Jardin`);

        // System Status is static for now
    },

    updateStat(id, value, subtitle) {
        const el = document.getElementById(id);
        if (el) {
            el.querySelector('.stat-value').innerText = value;
            if (subtitle) el.querySelector('.stat-sub').innerText = subtitle;
        }
    },

    renderActivityLog() {
        // In a real app, this would come from a 'logs' table
        // Here we simulate recent activity for the demo
        const container = document.getElementById('activity-log-body');
        if (!container) return;

        // Mock Data
        const logs = [
            { user: 'Super Admin', action: 'Connexion', module: 'Auth', time: 'À l\'instant', badge: 'badge-gray' },
            { user: 'Super Admin', action: 'Update Dashboard', module: 'System', time: 'Il y a 2 min', badge: 'badge-warning' },
            { user: 'Chef Resto', action: 'Nouveau Plat (Yassa)', module: 'Restaurant', time: 'Il y a 15 min', badge: 'badge-success' },
            { user: 'Resp. Jardin', action: 'Stock Alert', module: 'Jardin', time: 'Il y a 1h', badge: 'badge-danger' }
        ];

        let html = '';
        logs.forEach(log => {
            html += `
            <tr>
                <td>${log.user}</td>
                <td>${log.action}</td>
                <td><span class="badge ${log.badge || 'badge-success'}">${log.module}</span></td>
                <td style="color:#64748b; font-size:0.85rem;">${log.time}</td>
            </tr>`;
        });
        container.innerHTML = html;
    },

    renderSystemAlerts() {
        // Logic to check for issues (e.g., empty categories, missing images)
        const alertsContainer = document.getElementById('system-alerts-body');
        if (!alertsContainer) return;

        // Example Checks
        let alerts = [];

        // Check 1: Menu Items without images
        const menuNoImg = TedDB.findAll('menu').filter(i => !i.image || i.image.includes('placeholder'));
        if (menuNoImg.length > 0) {
            alerts.push({ icon: 'fa-image', color: '#f59e0b', title: 'Images manquantes', text: `${menuNoImg.length} plats n'ont pas de photo personnalisée.` });
        }

        // Check 2: Garden empty?
        const garden = TedDB.findAll('garden_products');
        if (!garden || garden.length === 0) {
            alerts.push({ icon: 'fa-leaf', color: '#3b82f6', title: 'Module Jardin vide', text: "Aucun produit en vente." });
        }

        let html = '';
        if (alerts.length === 0) {
            html = `<div style="padding:1rem; color:#64748b; text-align:center;">Aucune alerte. Tout va bien ! 🚀</div>`;
        } else {
            alerts.forEach(a => {
                html += `
                 <div style="display:flex; gap:12px; margin-bottom:12px; padding-bottom:12px; border-bottom:1px solid #f1f5f9;">
                     <i class="fa-solid ${a.icon}" style="color:${a.color}; margin-top:3px;"></i>
                     <div>
                         <strong style="font-size:0.9rem; display:block; color:#1e293b;">${a.title}</strong>
                         <p style="font-size:0.8rem; color:#64748b; margin:0;">${a.text}</p>
                     </div>
                 </div>`;
            });
        }
        alertsContainer.innerHTML = html;
    }
};

window.DashboardHome = DashboardHome;
