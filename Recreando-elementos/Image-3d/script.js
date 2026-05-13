// Efecto "tilt" 3D: la imagen rota en X/Y siguiendo la posición del cursor dentro del contenedor.
// El contenedor aporta la perspectiva (CSS) y este script calcula la rotación y la aplica por frame.
(() => {
  // Nodo raíz del efecto (contiene data-max-rotate y se usa para calcular el rectángulo).
  const tilt = document.querySelector(".tilt");
  if (!tilt) return;

  // Elemento que realmente se rota (suele envolver la imagen).
  const card = tilt.querySelector(".tilt__card");
  if (!card) return;

  // Grados máximos de rotación permitidos (configurable vía data-max-rotate).
  const maxRotate = Number(tilt.dataset.maxRotate ?? 14);

  // Estado interno para agrupar updates (evitar repintar cientos de veces por evento).
  let rafId = 0;
  let targetX = 0;
  let targetY = 0;

  // Limita un valor dentro de un rango [min, max] para evitar rotaciones exageradas.
  const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

  // Programa la escritura del transform en el próximo frame de animación.
  // Esto reduce "jank" y evita trabajo repetido si llegan muchos pointermove seguidos.
  const schedule = () => {
    if (rafId) return;
    rafId = window.requestAnimationFrame(() => {
      rafId = 0;
      card.style.transform = `rotateX(${targetX}deg) rotateY(${targetY}deg)`;
    });
  };

  // Calcula el ángulo en función de dónde está el cursor dentro del contenedor.
  // - Cuando el cursor está a la derecha, rotateY es positivo ("se inclina" hacia ese lado).
  // - Cuando el cursor está arriba, rotateX es positivo (se inclina hacia arriba).
  const onMove = (event) => {
    // Posición y tamaño del contenedor en la pantalla.
    const rect = tilt.getBoundingClientRect();

    // Coordenadas del puntero relativas al contenedor.
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Normalización a [0..1] para que el cálculo sea independiente del tamaño real.
    const px = x / rect.width;
    const py = y / rect.height;

    // Mapeo de [0..1] a [-maxRotate..maxRotate].
    const rotateY = (px - 0.5) * (maxRotate * 2);
    const rotateX = -(py - 0.5) * (maxRotate * 2);

    // Guardamos el objetivo (clamp por seguridad) y actualizamos en el próximo frame.
    targetX = clamp(rotateX, -maxRotate, maxRotate);
    targetY = clamp(rotateY, -maxRotate, maxRotate);

    schedule();
  };

  // Vuelve la tarjeta a su estado "reposo".
  // Se llama al salir del elemento para que la imagen se enderece.
  const reset = () => {
    targetX = 0;
    targetY = 0;
    schedule();
  };

  // Al entrar: marcamos activo para quitar transición (respuesta inmediata mientras mueves el cursor).
  tilt.addEventListener("pointerenter", () => {
    tilt.classList.add("is-active");
  });

  // Mientras te mueves: recalculamos rotación.
  tilt.addEventListener("pointermove", onMove);

  // Al salir: reactivamos transición y reseteamos a 0 para que vuelva suave.
  tilt.addEventListener("pointerleave", () => {
    tilt.classList.remove("is-active");
    reset();
  });
})();
