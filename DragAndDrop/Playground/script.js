const dragElements = document.querySelectorAll(".drag-element");
const dropZone = document.querySelector(".drop-zone");
const listDragElement = document.querySelector(".list-drags-elements");

listDragElement.addEventListener("drop", async (e) => {
  e.preventDefault();
  e.target.classList.remove("dragover");
  let item = e.dataTransfer.items[0];
  let string;
  string = await new Promise((resolve) => {
    item.getAsString((s) => resolve(s));
  });
  let element = getDragElementByCardId(string);

  if (element) {
    //Mostrar la diferencia entre target y currentTarget
    e.currentTarget.appendChild(element);
    // e.target.appendChild(element);
  }
});
function handleDrop(e) {}
listDragElement.addEventListener("dragenter", (e) => {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
  e.target.classList.add("dragover");
});
listDragElement.addEventListener("dragleave", (e) => {
  e.preventDefault();
  e.target.classList.remove("dragover");
});
listDragElement.addEventListener("dragenter", (e) => {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
  e.target.classList.add("dragover");
});

listDragElement.addEventListener("dragover", (e) => {
  e.preventDefault();
});

function addingChild(target, element) {
  target.appendChild(element);
}
function handleDragStart(e) {
  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("carId", e.target.getAttribute("cardId"));
  e.target.classList.add("dragging");

  console.log("dragstart");
}
function handleDragEnd(e) {
  e.preventDefault();
  e.target.classList.remove("dragging");
}
dragElements.forEach((dragElement, index) => {
  dragElement.setAttribute("cardId", index);
  dragElement.addEventListener("dragstart", handleDragStart);
  dragElement.addEventListener("dragend", handleDragEnd);
});
dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
});
dropZone.addEventListener("dragenter", (e) => {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
  e.target.classList.add("dragover");
});
dropZone.addEventListener("dragleave", (e) => {
  e.preventDefault();
  e.target.classList.remove("dragover");
});
dropZone.addEventListener("drop", handleDropFiles);
dropZone.addEventListener("dragover", handleDragOverFiles);
dropZone.addEventListener("drop", async (e) => {
  e.preventDefault();
  e.target.classList.remove("dragover");

  if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
    let item = e.dataTransfer.items[0];
    let string;
    string = await new Promise((resolve) => {
      item.getAsString((s) => resolve(s));
    });
    let element = getDragElementByCardId(string);
    if (element) {
      e.target.appendChild(element);
    }
    // e.target.appendChild(string);
  }
});
function getDragElementByCardId(cardId) {
  let element = document.querySelector(`.drag-element[cardId=\"${cardId}\"]`);
  return element;
}

function handleDropFiles(e) {
  e.preventDefault();
  e.currentTarget.classList.remove("dragover");
  if (e.dataTransfer.types.includes("Files")) {
    console.log("Incluye archivos del SO.");
  }
}
function handleDragOverFiles(e) {
  e.preventDefault();
  e.dropEffect = "copy";
  const { currentTarget, dataTransfer } = e;
  if (dataTransfer.types.includes("Files")) {
    currentTarget.classList.add("drag-files");
  }
}
