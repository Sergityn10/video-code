const buttonSidebar = document.querySelector("aside.sidebar .toggle-sidebar");
const sidebar = document.querySelector("aside.sidebar");
buttonSidebar.addEventListener("click", (e) => {
  sidebar.classList.toggle("open");
  sidebar
    .querySelectorAll(".list-item-sidebar .item-sidebar span")
    .forEach((span) => span.classList.toggle("oculto"));
});
