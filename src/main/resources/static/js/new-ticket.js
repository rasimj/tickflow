initAppShell();

document.getElementById("ticketForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const errorDiv = document.getElementById("errorMsg");
    try {
        await apiFetch("/tickets", {
            method: "POST",
            body: JSON.stringify({
                title: document.getElementById("title").value,
                description: document.getElementById("description").value,
                priority: document.getElementById("priority").value
            })
        });
        window.location.href = "tickets.html";
    } catch (err) {
        errorDiv.textContent = err.message;
        errorDiv.classList.remove("hidden");
    }
});