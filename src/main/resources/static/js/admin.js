initAppShell();

if (getRole() !== "ADMIN") {
    document.querySelector(".main").innerHTML = "<p>Only admins can view this page.</p>";
} else {
    loadPendingAgents();
}

async function loadPendingAgents() {
    try {
        const agents = await apiFetch("/admin/agents/pending");
        const container = document.getElementById("pendingList");
        container.innerHTML = "";
        if (agents.length === 0) { container.innerHTML = `<p style="color:var(--ink-muted);">No pending agent requests.</p>`; return; }
        agents.forEach((agent) => {
            const initials = agent.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
            const card = document.createElement("div");
            card.className = "detail-card approval-card";
            card.innerHTML = `
                <div class="approval-info">
                    <div class="avatar-circle">${initials}</div>
                    <div><strong>${agent.name}</strong><br><span class="meta-item">${agent.email}</span></div>
                </div>
                <div class="approval-actions">
                    <button class="btn btn-primary approve-btn" style="width:auto;">Approve</button>
                    <button class="btn btn-danger reject-btn" style="width:auto;">Reject</button>
                </div>`;
            card.querySelector(".approve-btn").addEventListener("click", () => approveAgent(agent.id));
            card.querySelector(".reject-btn").addEventListener("click", () => rejectAgent(agent.id));
            container.appendChild(card);
        });
    } catch (err) { alert(err.message); }
}

async function approveAgent(id) {
    try { await apiFetch(`/admin/agents/${id}/approve`, { method: "PATCH" }); loadPendingAgents(); }
    catch (err) { alert(err.message); }
}

async function rejectAgent(id) {
    if (!confirm("Reject this agent request? They'll need to register again.")) return;
    try { await apiFetch(`/admin/agents/${id}/reject`, { method: "DELETE" }); loadPendingAgents(); }
    catch (err) { alert(err.message); }
}