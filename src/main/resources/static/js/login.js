setupPasswordToggle("togglePassword", "password");

const ROLE_COPY = {
    CUSTOMER: { headline: "Support, tracked properly.", copy: "Raise issues and follow them through to resolution." },
    AGENT: { headline: "Resolve tickets, faster.", copy: "See what's assigned to you and keep customers updated." },
    ADMIN: { headline: "Full oversight, one dashboard.", copy: "Manage tickets, approve agents, see the big picture." }
};

document.querySelectorAll(".role-tab").forEach(tab => {
    tab.addEventListener("click", () => {
        document.querySelectorAll(".role-tab").forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        const role = tab.dataset.role;
        document.body.setAttribute("data-role", role);
        document.getElementById("sideHeadline").textContent = ROLE_COPY[role].headline;
        document.getElementById("sideCopy").textContent = ROLE_COPY[role].copy;
    });
});

document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const errorDiv = document.getElementById("errorMsg");
    try {
        const data = await apiFetch("/auth/login", {
            method: "POST",
            body: JSON.stringify({ email: document.getElementById("email").value, password: document.getElementById("password").value })
        });
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("role", data.role);
        sessionStorage.setItem("email", data.email);
        window.location.href = "tickets.html";
    } catch (err) {
        errorDiv.textContent = err.message;
        errorDiv.classList.remove("hidden");
    }
});