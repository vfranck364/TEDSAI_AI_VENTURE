/**
 * ADMIN DASHBOARD LOGIC
 * Connecté au TEDBackend (localStorage)
 */

document.addEventListener('DOMContentLoaded', () => {
    // Vérifier Auth (Mock)
    if (!sessionStorage.getItem('ted_admin_user')) {
        // window.location.href = 'index.html'; // Decomment en prod
    }

    initDashboard();
});

function initDashboard() {
    console.log("Admin Dashboard Init");
    updateStats();
    renderReservationsTable();
    renderMessagesTable();

    // Auto-refresh toutes les 30s
    setInterval(() => {
        updateStats();
        renderReservationsTable();
    }, 30000);
}

function updateStats() {
    const reservations = window.TEDBackend.reservations.getAll();
    const messages = window.TEDBackend.messages.getAll();

    // Stats Cards
    document.getElementById('stat-reservations').textContent = reservations.length;
    document.getElementById('stat-messages').textContent = messages.filter(m => !m.read).length;

    // Revenue Mensuel (Mock calculation based on resas)
    const revenue = reservations.length * 15000; // 15 000 FCFA panier moyen fictif
    document.getElementById('stat-revenue').textContent = revenue.toLocaleString() + ' FCFA';
}

function renderReservationsTable() {
    const list = window.TEDBackend.reservations.getAll().reverse(); // Plus récent en haut
    const tbody = document.getElementById('reservations-body');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (list.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:2rem;">Aucune réservation pour le moment.</td></tr>';
        return;
    }

    list.forEach(res => {
        const tr = document.createElement('tr');
        const statusColor = res.status === 'confirmed' ? '#27ae60' : (res.status === 'cancelled' ? '#e74c3c' : '#f39c12');
        const statusLabel = res.status === 'confirmed' ? 'Confirmé' : (res.status === 'cancelled' ? 'Annulé' : 'En attente');

        tr.innerHTML = `
            <td>#${res.id.substr(-4)}</td>
            <td><strong>${res.name}</strong></td>
            <td>${res.date} - ${res.time}</td>
            <td>${res.people} pers.</td>
            <td><span class="badge" style="background:${statusColor}; color:white; padding:4px 8px; border-radius:4px; font-size:0.8rem;">${statusLabel}</span></td>
            <td>
                <button class="btn-icon" onclick="updateResStatus('${res.id}', 'confirmed')" title="Confirmer"><i class="fa-solid fa-check" style="color:#27ae60;"></i></button>
                <button class="btn-icon" onclick="updateResStatus('${res.id}', 'cancelled')" title="Annuler"><i class="fa-solid fa-times" style="color:#e74c3c;"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function renderMessagesTable() {
    // Similar logic for messages...
}

// Global actions
window.updateResStatus = function (id, status) {
    if (confirm(`Passer la réservation ${id} en ${status} ?`)) {
        window.TEDBackend.reservations.updateStatus(id, status);
        renderReservationsTable();
        updateStats();
    }
};

window.addMockReservation = function () {
    // Debug helper
    window.TEDBackend.reservations.add({
        name: "Client Test",
        people: 2,
        date: "Demain",
        time: "20:00",
        source: "admin_test"
    });
    renderReservationsTable();
    updateStats();
};
