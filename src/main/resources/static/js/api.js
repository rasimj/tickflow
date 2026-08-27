const BASE_URL = "http://localhost:8080/api";

function getToken() {
    return sessionStorage.getItem("token");
}

function getRole() {
    return sessionStorage.getItem("role");
}

function isLoggedIn() {
    return !!getToken();
}

function logout() {
    sessionStorage.clear();
    window.location.href = "index.html";
}

async function apiFetch(path, options = {}) {
    const headers = options.headers || {};
    headers["Content-Type"] = "application/json";

    const token = getToken();
    if (token) {
        headers["Authorization"] = "Bearer " + token;
    }

    const response = await fetch(BASE_URL + path, { ...options, headers });

    if (response.status === 401) {
        logout();
        throw new Error("Session expired, please login again");
    }

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody.error || "Something went wrong");
    }

    if (response.status === 204) {
        return null;
    }

    return response.json();
}

function initAppShell() {
    if (!isLoggedIn()) { window.location.href = "index.html"; return; }
    const role = getRole();
    document.body.setAttribute("data-role", role);
    document.getElementById("userEmail")?.replaceChildren(sessionStorage.getItem("email"));
    document.getElementById("userRole")?.replaceChildren(role);
    document.getElementById("brandRoleBadge")?.replaceChildren(role);
    document.getElementById("logoutBtn")?.addEventListener("click", logout);
    if (role !== "ADMIN") document.getElementById("adminNavLink")?.remove();
    else loadPendingNavBadge();
}

async function loadPendingNavBadge() {
    try {
        const pending = await apiFetch("/admin/agents/pending");
        const link = document.getElementById("adminNavLink");
        if (link && pending.length > 0 && !link.querySelector(".nav-count-badge")) {
            const badge = document.createElement("span");
            badge.className = "nav-count-badge";
            badge.textContent = pending.length;
            link.appendChild(badge);
        }
    } catch (err) {}
}

function setupPasswordToggle(buttonId, inputId) {
    const btn = document.getElementById(buttonId);
    const input = document.getElementById(inputId);
    const eyeIcon = btn.querySelector(".icon-eye");
    const eyeOffIcon = btn.querySelector(".icon-eye-off");
    btn.addEventListener("click", (e) => {
        e.preventDefault();
        if (input.type === "password") {
            input.type = "text"; eyeIcon.classList.remove("hidden"); eyeOffIcon.classList.add("hidden");
        } else {
            input.type = "password"; eyeIcon.classList.add("hidden"); eyeOffIcon.classList.remove("hidden");
        }
    });
}