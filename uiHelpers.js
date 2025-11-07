// Floating message
export function showMessage(text) {
    const msg = document.createElement("div");
    msg.textContent = text;
    msg.className = "popup-message";
    document.body.appendChild(msg); // Appends msg to the DOM to display

    setTimeout(() => msg.classList.add("hide"), 1500);
    setTimeout(() => msg.remove(), 2000);
}