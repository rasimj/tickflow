initAppShell();
const params = new URLSearchParams(window.location.search);
const ticketId = params.get("id");
const STAGES = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];

function renderPipeline(currentStatus) {
    const currentIndex = STAGES.indexOf(currentStatus);
    const pipeline = document.getElementById("pipeline");
    pipeline.innerHTML = "";
    STAGES.forEach((stage, i) => {
        const node = document.createElement("div");
        let stateClass = i < currentIndex ? "done" : i === currentIndex ? "current" : "";
        node.className = "pipeline-node " + stateClass;
        node.innerHTML = `<div class="pipeline-line"></div><div class="pipeline-dot"></div><div class="pipeline-label">${stage.replace("_", " ")}</div>`;
        pipeline.appendChild(node);
    });
}

async function loadTicket() {
    const ticket = await apiFetch(`/tickets/${ticketId}`);
    document.getElementById("ticketTitle").textContent = ticket.title;
    document.getElementById("ticketDescription").textContent = ticket.description;
    document.getElementById("ticketCreator").textContent = ticket.createdByName || "-";
    document.getElementById("ticketIdLabel").textContent = "#" + ticket.id;
    const priorityBadge = document.getElementById("priorityBadge");
    priorityBadge.textContent = ticket.priority;
    priorityBadge.className = "badge badge-" + ticket.priority.toLowerCase();
    renderPipeline(ticket.status);
    renderStatusActions(ticket.status);
}

function renderStatusActions(currentStatus) {
    const container = document.getElementById("statusActions");
    container.innerHTML = "";
    if (getRole() === "CUSTOMER") return;
    const nextStatusMap = { OPEN: ["IN_PROGRESS"], IN_PROGRESS: ["RESOLVED", "OPEN"], RESOLVED: ["CLOSED", "IN_PROGRESS"], CLOSED: [] };
    (nextStatusMap[currentStatus] || []).forEach((nextStatus) => {
        const btn = document.createElement("button");
        btn.className = "btn btn-outline";
        btn.style.marginRight = "8px";
        btn.textContent = "Move to " + nextStatus.replace("_", " ");
        btn.onclick = () => updateStatus(nextStatus);
        container.appendChild(btn);
    });
}

async function updateStatus(newStatus) {
    try { await apiFetch(`/tickets/${ticketId}/status?status=${newStatus}`, { method: "PATCH" }); loadTicket(); }
    catch (err) { alert(err.message); }
}

async function loadComments() {
    const comments = await apiFetch(`/tickets/${ticketId}/comments`);
    const listDiv = document.getElementById("commentList");
    listDiv.innerHTML = "";
    if (comments.length === 0) { listDiv.innerHTML = `<p style="color:var(--ink-muted); font-size:0.88rem;">No comments yet.</p>`; return; }
    comments.forEach((comment) => {
        const div = document.createElement("div");
        div.className = "comment";
        div.innerHTML = `<div class="author">${comment.authorName}</div>${comment.content}`;
        listDiv.appendChild(div);
    });
}

document.getElementById("commentForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const input = document.getElementById("commentContent");
    try { await apiFetch(`/tickets/${ticketId}/comments`, { method: "POST", body: JSON.stringify({ content: input.value }) }); input.value = ""; loadComments(); }
    catch (err) { alert(err.message); }
});

loadTicket();
loadComments();