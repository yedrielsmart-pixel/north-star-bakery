// North Star Bakery - Touchstone 4

const bakeryProducts = [
    { id: "bread", name: "Signature Bread Loaf" },
    { id: "cookie", name: "Chocolate Chip Cookie" },
    { id: "croissant", name: "Butter Croissant" },
    { id: "cake", name: "Custom Cake" }
];

function getSavedFavorites() {
    const saved = localStorage.getItem("northStarFavorites");
    return saved ? JSON.parse(saved) : [];
}

function saveFavorites(favorites) {
    localStorage.setItem("northStarFavorites", JSON.stringify(favorites));
}

function getProductName(id) {
    const product = bakeryProducts.find(item => item.id === id);
    return product ? product.name : id;
}

function updateFavoritesDisplay() {
    const list = document.getElementById("favorites-list");
    const emptyMessage = document.getElementById("favorites-empty");

    if (!list || !emptyMessage) return;

    const favorites = getSavedFavorites();
    list.innerHTML = "";

    if (favorites.length === 0) {
        emptyMessage.textContent = "You have not saved any favorites yet.";
    } else {
        emptyMessage.textContent = "";
        favorites.forEach(id => {
            const item = document.createElement("li");
            item.textContent = getProductName(id);
            list.appendChild(item);
        });
    }

    document.querySelectorAll(".favorite-btn").forEach(button => {
        const id = button.dataset.product;
        const saved = favorites.includes(id);
        button.textContent = saved ? "Remove Favorite" : "Save Favorite";
        button.classList.toggle("saved", saved);
        button.setAttribute("aria-pressed", saved);
    });
}

function toggleFavorite(productId) {
    const favorites = getSavedFavorites();
    const index = favorites.indexOf(productId);

    if (index === -1) {
        favorites.push(productId);
    } else {
        favorites.splice(index, 1);
    }

    saveFavorites(favorites);
    updateFavoritesDisplay();
}

function setupFavoriteButtons() {
    document.querySelectorAll(".favorite-btn").forEach(button => {
        button.addEventListener("click", () => {
            toggleFavorite(button.dataset.product);
        });
    });

    updateFavoritesDisplay();
}

function showError(field, message) {
    const error = document.getElementById(field.id + "-error");
    field.classList.add("invalid");
    if (error) error.textContent = message;
}

function clearError(field) {
    const error = document.getElementById(field.id + "-error");
    field.classList.remove("invalid");
    if (error) error.textContent = "";
}

function validEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateContactForm(event) {
    const form = event.currentTarget;
    const name = form.querySelector("#name");
    const email = form.querySelector("#email");
    const reason = form.querySelector("#reason");
    const message = form.querySelector("#message");
    const success = document.getElementById("form-success");

    let valid = true;
    [name, email, reason, message].forEach(clearError);
    success.textContent = "";

    if (name.value.trim().length < 2) {
        showError(name, "Please enter at least 2 characters for your name.");
        valid = false;
    }

    if (!validEmail(email.value.trim())) {
        showError(email, "Please enter a valid email address.");
        valid = false;
    }

    if (reason.value === "") {
        showError(reason, "Please choose a reason for contacting us.");
        valid = false;
    }

    if (message.value.trim().length < 10) {
        showError(message, "Please enter a message with at least 10 characters.");
        valid = false;
    }

    if (!valid) {
        event.preventDefault();
        return;
    }

    event.preventDefault();
    localStorage.setItem("northStarCustomerName", name.value.trim());
    success.textContent = "Thanks, " + name.value.trim() + "! Your message passed validation.";
    form.reset();
}

function loadSavedName() {
    const nameField = document.getElementById("name");
    if (!nameField) return;

    const savedName = localStorage.getItem("northStarCustomerName");
    if (savedName) {
        nameField.value = savedName;
    }
}

function setupContactForm() {
    const form = document.getElementById("contact-form");
    if (!form) return;

    loadSavedName();
    form.addEventListener("submit", validateContactForm);

    form.querySelectorAll("input, select, textarea").forEach(field => {
        field.addEventListener("input", () => clearError(field));
        field.addEventListener("change", () => clearError(field));
    });
}

document.addEventListener("DOMContentLoaded", () => {
    setupFavoriteButtons();
    setupContactForm();
});
