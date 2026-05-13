// Lista de tareas con id, título y columna: "todo", "progress" o "done"
let tasks = [
  { id: 1, title: "Configurar entorno de desarrollo", column: "todo" },
  { id: 2, title: "Diseñar estructura del Kanban", column: "todo" },
  { id: 3, title: "Implementar drag & drop básico", column: "progress" },
  { id: 4, title: "Estilizar columnas y tarjetas", column: "progress" },
  { id: 5, title: "Guardar estado en localStorage", column: "done" },
  { id: 6, title: "Probar experiencia de usuario", column: "backlog" },
];
const columns = ["todo", "progress", "done", "backlog"];

//Plantillas html
const templateColumn = document.querySelector("#template-column");
const templateTask = document.querySelector("#template-card");
function crearColumna(titulo, tareas) {
  const clone = templateColumn.content.cloneNode(true);
  const column = clone.querySelector(".column");
  clone.querySelector(".title").textContent =
    titulo.charAt(0).toUpperCase() + titulo.slice(1);
  const list = clone.querySelector(".task-list");
  column.setAttribute("data-column", titulo);
  return clone;
}

function crearTarea(tarea) {
  const clone = templateTask.content.cloneNode(true);
  clone.querySelector(".title").textContent = tarea.title;
  clone.querySelector(".task").setAttribute("data-task", tarea.id);
  return clone;
}

const columnList = document.querySelector(".columns-list");
document.addEventListener("DOMContentLoaded", (event) => {
  columns.forEach(async (column) => {
    let c = crearColumna(column);

    let listColumn = tasks.filter((e) => e.column === column);
    listColumn.forEach((task) => {
      let cards = c.querySelector(".task-list");
      let t = crearTarea(task);

      cards.append(t);
    });
    let columnhtml = c.querySelector(".column");
    // let button = crearButtonAddTask(columnhtml);
    // columnhtml.appendChild(button);
    columnList.appendChild(c);
  });
  settingListener();
});

function settingListener() {
  const tasks = document.querySelectorAll(".column .task");
  tasks.forEach((task) => {
    task.addEventListener("dragstart", handleDragStart);
    task.addEventListener("dragend", handleDragEnd);
  });

  const columns = document.querySelectorAll("[data-column]");
  columns.forEach((column) => {
    column.addEventListener("dragenter", (e) => handleDragEnter(e, column));
    column.addEventListener("dragleave", (e) => handleDragLeave(e, column));
    column.addEventListener("dragover", handleDragOver);
    column.addEventListener("drop", (e) => handleDrop(e));
  });
}
const deletingColumn = document.querySelector(".deleting-column");
const deletingContainer = deletingColumn.querySelector(".deletion-container");
deletingContainer.addEventListener("dragenter", (e) =>
  handleDragEnterDeleting(e),
);
deletingContainer.addEventListener("dragleave", (e) =>
  handleDragLeaveDeleting(e),
);
deletingContainer.addEventListener("drop", (e) => handleDropDeletionColumn(e));
deletingContainer.addEventListener("dragover", (e) => e.preventDefault());
function handleDragEnterDeleting(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
  e.currentTarget.classList.add("dragover");
}
function handleDragLeaveDeleting(e) {
  e.preventDefault();
  e.currentTarget.classList.remove("dragover");
}
function handleDropDeletionColumn(e) {
  console.log(e.dataTransfer.types);
  e.currentTarget.classList.remove("dragover");
  console.log(e.dataTransfer.types.includes("taskId"));
  if (e.dataTransfer.types.includes("taskid")) {
    console.log("Entra");
    const taskId = e.dataTransfer.getData("taskId");
    const taksElement = document.querySelector(`[data-task=\"${taskId}\"]`);
    taksElement.remove();
    tasks = tasks.filter((task) => task.id !== Number(taskId));
    console.log(tasks);
  }
}
function handleDragStart(e) {
  //   e.preventDefault();
  const dataTransfer = e.dataTransfer;
  dataTransfer.setData("taskId", e.target.getAttribute("data-task"));
  dataTransfer.effectAllowed = "move";
  e.target.classList.add("dragging");
}
function handleDragEnd(e) {
  e.preventDefault();
  e.target.classList.remove("dragging");
}

function handleDragEnter(e, columna) {
  e.stopImmediatePropagation();
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
  if (e.target === columna) e.currentTarget.classList.add("dragover");
}
function handleDragLeave(e, columna) {
  e.stopImmediatePropagation();
  e.preventDefault();

  if (e.target === columna) e.currentTarget.classList.remove("dragover");
}
function handleDragOver(e) {
  e.preventDefault();
}
function handleDrop(e) {
  e.preventDefault();
  e.currentTarget.classList.remove("dragover");
  let data = e.dataTransfer.getData("taskId");
  const draggedTask = document.querySelector(`[data-task=\"${data}\"]`);
  const taskList = e.currentTarget.querySelector(".task-list");
  if (draggedTask) taskList.appendChild(draggedTask);
  //Cambiamos en el backend.
  changeColumnTask(data, e.currentTarget.getAttribute("data-column"));
}

function changeColumnTask(taskId, newColumn) {
  let task = tasks.find((task) => task.id === Number(taskId));
  tasks = tasks.filter((task) => task.id !== Number(taskId));
  task.column = newColumn;
  tasks.push(task);
  console.log(tasks);
}
