const dialog = document.getElementById("dialog");
const openButton = document.getElementById("open");

// Open button opens a modal dialog
openButton.addEventListener("click", () => {
  dialog.showModal();
});
// Close button closes the dialog box
const closeButton = document.getElementById("close");
closeButton.addEventListener("click", () => {
  dialog.returnValue = ""; // Reset return value
  dialog.close();
  // Alternatively, we could use dialog.requestClose(""); with an empty return value.
});
