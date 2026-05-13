const toggle = document.querySelector(".dropdown-toggle");
const menu = document.querySelector(".dropdown-menu");

toggle.addEventListener("click", () => {
  const isOpen = menu.classList.toggle("show");

  // Buena práctica: Actualizar accesibilidad
  toggle.setAttribute("aria-expanded", isOpen);
});

// Cerrar si el usuario hace clic fuera del menú
window.addEventListener("click", (e) => {
  if (!toggle.contains(e.target)) {
    menu.classList.remove("show");
    toggle.setAttribute("aria-expanded", "false");
  }
});
