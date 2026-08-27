setupPasswordToggle("togglePassword", "password");

const passwordInput = document.getElementById("password");
const bar1 = document.getElementById("bar1");
const bar2 = document.getElementById("bar2");
const bar3 = document.getElementById("bar3");
const strengthLabel = document.getElementById("strengthLabel");
const reqLength = document.getElementById("reqLength");
const reqCase = document.getElementById("reqCase");
const reqNumber = document.getElementById("reqNumber");
const reqSpecial = document.getElementById("reqSpecial");

function evaluatePassword(password) {
    const checks = {
        length: password.length >= 8,
        case: /[a-z]/.test(password) && /[A-Z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[^A-Za-z0-9]/.test(password)
    };

    reqLength.classList.toggle("met", checks.length);
    reqCase.classList.toggle("met", checks.case);
    reqNumber.classList.toggle("met", checks.number);
    reqSpecial.classList.toggle("met", checks.special);

    const metCount = Object.values(checks).filter(Boolean).length;
    [bar1, bar2, bar3].forEach(bar => bar.className = "strength-bar");

    if (password.length === 0) {
        strengthLabel.textContent = "";
    } else if (!checks.length || metCount <= 1) {
        bar1.classList.add("filled-weak");
        strengthLabel.textContent = "Weak";
        strengthLabel.className = "strength-label weak";
    } else if (metCount <= 2) {
        bar1.classList.add("filled-medium");
        bar2.classList.add("filled-medium");
        strengthLabel.textContent = "Medium";
        strengthLabel.className = "strength-label medium";
    } else {
        bar1.classList.add("filled-strong");
        bar2.classList.add("filled-strong");
        bar3.classList.add("filled-strong");
        strengthLabel.textContent = "Strong";
        strengthLabel.className = "strength-label strong";
    }

    return { isValid: checks.length && checks.case && checks.number };
}

passwordInput.addEventListener("input", () => evaluatePassword(passwordInput.value));

document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const errorDiv = document.getElementById("errorMsg");
    const password = passwordInput.value;
    const result = evaluatePassword(password);

    if (!result.isValid) {
        errorDiv.textContent = "Password needs 8+ characters with upper, lower case letters and a number.";
        errorDiv.classList.remove("hidden");
        return;
    }

    try {
        const data = await apiFetch("/auth/register", {
            method: "POST",
            body: JSON.stringify({
                name: document.getElementById("fullName").value,
                email: document.getElementById("email").value,
                password: password,
                role: document.getElementById("role").value
            })
        });

        if (data.status === "PENDING_APPROVAL") {
            document.querySelector(".auth-form").innerHTML = `
                <h2>Request sent</h2>
                <p class="subtext">Your agent account needs admin approval before you can log in.</p>
                <a href="index.html" class="btn btn-primary" style="display:block; text-align:center; text-decoration:none;">Back to login</a>
            `;
            return;
        }

        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("role", data.role);
        sessionStorage.setItem("email", data.email);
        window.location.href = "tickets.html";
    } catch (err) {
        errorDiv.textContent = err.message;
        errorDiv.classList.remove("hidden");
    }
});