// Array con las rutas de las imágenes de los titanes (una por carta)
const rutas = [
  "img/ataque.jpg",
  "img/acorazado.jpg",
  "img/colosal.jpg",
  "img/bestia.jpg",
  "img/mandibula.jpg",
  "img/hembra.jpg",
  "img/carreta.jpg",
  "img/martillo.jpg",
  "img/fundador.jpg"
];

// Esperamos a que toda la página cargue para empezar a usar los elementos
window.onload = () => {
  const tablero = document.getElementById("tablero");
  const spanIntentos = document.getElementById("intentos");
  const spanTiempo = document.getElementById("tiempo");
  const musica = document.getElementById("musica");
  const btnSonido = document.getElementById("btnSonido");
  const btnIniciar = document.getElementById("btnIniciar");
  const btnReiniciar = document.getElementById("btnReiniciar");

  let cartas = [...rutas, ...rutas];
  let carta1 = null;
  let carta2 = null;
  let bloqueado = false;
  let intentos = 0;
  let parejasEncontradas = 0;
  let segundos = 0;
  let intervalo;

  btnIniciar.addEventListener("click", () => {
    musica.muted = false;
    musica.play().catch(() => {
      console.warn("Reproducción bloqueada, espera interacción.");
    });

    iniciarJuego();
    btnIniciar.style.display = "none";
  });

  btnSonido.addEventListener("click", () => {
    musica.muted = !musica.muted;
    btnSonido.textContent = musica.muted ? "🔇" : "🔊";

    if (!musica.paused && !musica.muted) {
      musica.play();
    }
  });

  btnReiniciar.addEventListener("click", () => {
    reiniciarJuego();
  });

  function crearTablero() {
    tablero.innerHTML = "";
    parejasEncontradas = 0;
    cartas = [...rutas, ...rutas].sort(() => 0.5 - Math.random());

    cartas.forEach((ruta) => {
      const carta = document.createElement("div");
      carta.classList.add("carta");

      const frontal = document.createElement("div");
      frontal.classList.add("cara", "frontal");
      const imagenTitan = document.createElement("img");
      imagenTitan.src = ruta;
      imagenTitan.alt = "Titán SNK";
      frontal.appendChild(imagenTitan);

      const trasera = document.createElement("div");
      trasera.classList.add("cara", "trasera");
      const escudo = document.createElement("img");
      escudo.src = "img/escudo.jpg";
      escudo.alt = "Escudo SNK";
      trasera.appendChild(escudo);

      carta.appendChild(frontal);
      carta.appendChild(trasera);

      carta.addEventListener("click", () => {
        if (bloqueado || carta.classList.contains("descubierta")) return;

        carta.classList.add("descubierta");

        if (!carta1) {
          carta1 = carta;
        } else {
          carta2 = carta;
          verificarPareja();
        }
      });

      tablero.appendChild(carta);
    });
  }

  function verificarPareja() {
    bloqueado = true;
    intentos++;
    spanIntentos.textContent = intentos;

    const img1 = carta1.querySelector(".frontal img");
    const img2 = carta2.querySelector(".frontal img");

    if (img1.src === img2.src) {
      parejasEncontradas++;
      carta1 = null;
      carta2 = null;
      bloqueado = false;

      if (parejasEncontradas === rutas.length) {
        detenerCronometro();
        setTimeout(() => {
          alert(`🎉 ¡Felicidades! Completaste el juego en ${intentos} intentos y ${formatTiempo(segundos)}.`);
        }, 500);
      }
    } else {
      setTimeout(() => {
        carta1.classList.remove("descubierta");
        carta2.classList.remove("descubierta");
        carta1 = null;
        carta2 = null;
        bloqueado = false;
      }, 800);
    }
  }

  function reiniciarJuego() {
    carta1 = null;
    carta2 = null;
    intentos = 0;
    spanIntentos.textContent = 0;
    crearTablero();

    // Esperamos mínimo 50 ms para que el DOM tenga las cartas ya renderizadas
    setTimeout(() => {
      const todas = document.querySelectorAll(".carta");
      todas.forEach(c => c.classList.add("descubierta"));

      bloqueado = true;

      setTimeout(() => {
        todas.forEach(c => c.classList.remove("descubierta"));
        bloqueado = false;
        iniciarCronometro();
      }, 2500);
    }, 50);
  }

  function iniciarJuego() {
    reiniciarJuego();
    musica.play().catch(() => {
      console.warn("Reproducción bloqueada, espera interacción.");
    });
  }

  function iniciarCronometro() {
    segundos = 0;
    intervalo = setInterval(() => {
      segundos++;
      spanTiempo.textContent = formatTiempo(segundos);
    }, 1000);
  }

  function detenerCronometro() {
    clearInterval(intervalo);
  }

  function formatTiempo(segundos) {
    const minutos = Math.floor(segundos / 60);
    const seg = segundos % 60;
    return `${minutos.toString().padStart(2, "0")}:${seg.toString().padStart(2, "0")}`;
  }
};
