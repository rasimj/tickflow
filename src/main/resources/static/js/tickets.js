initAppShell();
document.getElementById("pageTitle").textContent = getRole() === "CUSTOMER" ? "My tickets" : "All tickets";

async function loadTickets() {
    try {
        const tickets = await apiFetch("/tickets");
        renderStats(tickets);
        const tbody = document.getElementById("ticketTableBody");
        tbody.innerHTML = "";
        if (tickets.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:var(--ink-muted); padding:32px;">No tickets yet.</td></tr>`;
            return;
        }
        tickets.forEach((ticket) => {
            const row = document.createElement("tr");
            row.innerHTML = `<td><a href="ticket.html?id=${ticket.id}">${ticket.title}</a></td>
                <td><span class="badge badge-${ticket.priority.toLowerCase()}">${ticket.priority}</span></td>
                <td><span class="badge badge-${ticket.status.toLowerCase()}">${ticket.status.replace("_"," ")}</span></td>
                <td>${ticket.createdByName || "-"}</td>`;
            tbody.appendChild(row);
        });
    } catch (err) { alert(err.message); }
}

function renderStats(tickets) {
    const counts = { OPEN: 0, IN_PROGRESS: 0, RESOLVED: 0, CLOSED: 0 };
    tickets.forEach(t => counts[t.status]++);
    const container = document.getElementById("statsRow");
    container.innerHTML = `
        <div class="stat-card"><div class="stat-value">${counts.OPEN}</div><div class="stat-label">Open</div></div>
        <div class="stat-card"><div class="stat-value">${counts.IN_PROGRESS}</div><div class="stat-label">In progress</div></div>
        <div class="stat-card"><div class="stat-value">${counts.RESOLVED}</div><div class="stat-label">Resolved</div></div>
        ${getRole() === "ADMIN" ? `<div class="stat-card"><div class="stat-value">${counts.CLOSED}</div><div class="stat-label">Closed</div></div>` : ""}
    `;
    if (getRole() === "ADMIN") loadPendingStatCard();
}

async function loadPendingStatCard() {
    try {
        const pending = await apiFetch("/admin/agents/pending");
        if (pending.length > 0) {
            const card = document.createElement("a");
            card.href = "admin.html";
            card.className = "stat-card alert";
            card.innerHTML = `<div class="stat-value">${pending.length}</div><div class="stat-label">Pending approvals →</div>`;
            document.getElementById("statsRow").appendChild(card);
        }
    } catch (err) {}
}

loadTickets();