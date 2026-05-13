const cursor = document.querySelector(".cursor");
let lastXMove = null;
let lastYMove = null;
document.addEventListener("pointermove", (e) => {
  const actualLeftPosition =
    parseFloat(cursor.style.left.replace("px", "")) || 0;
  const actualTopPosition = parseFloat(cursor.style.top.replace("px", "")) || 0;

  if (e.clientX > actualLeftPosition) {
    console.log("Me muevo hacia la derecha");
  } else {
    console.log("Me muevo hacia la izquierda");
  }

  cursor.style.left = `${e.clientX}px`;
  cursor.style.top = `${e.clientY}px`;
  // Calcular el ángulo basado en la dirección del movimiento
  if (lastXMove !== null && lastYMove !== null) {
    const deltaX = e.clientX - lastXMove;
    const deltaY = e.clientY - lastYMove;

    // Calcular el ángulo en radianes y convertir a grados
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    cursor.style.transform = `rotate(${angle}deg)`;
  }

  lastXMove = e.clientX;
  lastYMove = e.clientY;
  //hacer que el angulo de empuje dependa de la direccion a la que se mueva el raton
});
