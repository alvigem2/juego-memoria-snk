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
  // Referencias a elementos HTML que usaremos varias veces
  const tablero = document.getElementById("tablero");
  const spanIntentos = document.getElementById("intentos");
  const spanTiempo = document.getElementById("tiempo");
  const musica = document.getElementById("musica");
  const btnSonido = document.getElementById("btnSonido");
  const btnIniciar = document.getElementById("btnIniciar");
  const btnReiniciar = document.getElementById("btnReiniciar");

  // Variables del estado del juego
  let cartas = [...rutas, ...rutas]; // duplicamos para pares
  let carta1 = null; // la primera carta seleccionada
  let carta2 = null; // la segunda carta seleccionada
  let bloqueado = false; // evita que el usuario pueda seleccionar más de dos cartas rápido
  let intentos = 0; // cuenta cuántos intentos ha hecho el jugador
  let parejasEncontradas = 0; // cuántas parejas ya encontró
  let segundos = 0; // tiempo en segundos desde que empezó el juego
  let intervalo; // referencia al setInterval para el cronómetro

  // Evento click para iniciar el juego y la música
  btnIniciar.addEventListener("click", () => {
    musica.muted = false; // activar sonido
    musica.play().catch(() => {
      // Si el navegador bloquea la reproducción automática
      console.warn("Reproducción bloqueada, espera interacción.");
    });

    iniciarJuego(); // llama a la función que reinicia y empieza todo
    btnIniciar.style.display = "none"; // oculta el botón iniciar para no apretar otra vez
  });

  // Botón para silenciar o activar música
  btnSonido.addEventListener("click", () => {
    musica.muted = !musica.muted; // alterna mute
    btnSonido.textContent = musica.muted ? "🔇" : "🔊"; // cambia ícono

    if (!musica.paused && !musica.muted) {
      musica.play(); // si estaba pausado, vuelve a reproducir
    }
  });

  // Botón para reiniciar juego en cualquier momento
  btnReiniciar.addEventListener("click", () => {
    reiniciarJuego();
  });

  // Crea las cartas y las añade al tablero
  function crearTablero() {
    tablero.innerHTML = ""; // limpia tablero
    parejasEncontradas = 0; // reinicia parejas encontradas

    // Rebarajamos las cartas para que sea un juego nuevo
    cartas = [...rutas, ...rutas].sort(() => 0.5 - Math.random());

    cartas.forEach((ruta) => {
      const carta = document.createElement("div");
      carta.classList.add("carta");

      // Cara frontal (imagen del titán)
      const frontal = document.createElement("div");
      frontal.classList.add("cara", "frontal");

      const imagenTitan = document.createElement("img");
      imagenTitan.src = ruta;
      imagenTitan.alt = "Titán SNK";
      frontal.appendChild(imagenTitan);

      // Cara trasera (imagen del escudo)
      const trasera = document.createElement("div");
      trasera.classList.add("cara", "trasera");

      const escudo = document.createElement("img");
      escudo.src = "img/escudo.jpg";
      escudo.alt = "Escudo SNK";
      trasera.appendChild(escudo);

      // Añadimos ambas caras a la carta
      carta.appendChild(frontal);
      carta.appendChild(trasera);

      // Evento click para voltear la carta
      carta.addEventListener("click", () => {
        if (bloqueado || carta.classList.contains("descubierta")) return; // no hacer nada si bloqueado o ya descubierta

        carta.classList.add("descubierta"); // voltea la carta (CSS)

        if (!carta1) {
          carta1 = carta; // guardamos la primera carta
        } else {
          carta2 = carta; // guardamos la segunda carta
          verificarPareja(); // chequeamos si coinciden
        }
      });

      tablero.appendChild(carta);
    });
  }

  // Verifica si las dos cartas son iguales (pareja)
  function verificarPareja() {
    bloqueado = true; // bloquea más clicks hasta decidir
    intentos++; // sumamos un intento
    spanIntentos.textContent = intentos; // actualizamos contador

    // Obtenemos las imágenes de la parte frontal de las cartas
    const img1 = carta1.querySelector(".frontal img");
    const img2 = carta2.querySelector(".frontal img");

    if (img1.src === img2.src) {
      // Si coinciden, pareja encontrada
      parejasEncontradas++;
      carta1 = null;
      carta2 = null;
      bloqueado = false;

      // Si ya encontró todas las parejas, termina el juego
      if (parejasEncontradas === rutas.length) {
        detenerCronometro();
        setTimeout(() => {
          alert(`🎉 ¡Felicidades! Completaste el juego en ${intentos} intentos y ${formatTiempo(segundos)}.`);
        }, 500);
      }
    } else {
      // Si no coinciden, volteamos cartas otra vez después de un tiempo
      setTimeout(() => {
        carta1.classList.remove("descubierta");
        carta2.classList.remove("descubierta");
        carta1 = null;
        carta2 = null;
        bloqueado = false;
      }, 800);
    }
  }

  // Reinicia todo para comenzar de nuevo
  function reiniciarJuego() {
    carta1 = null;
    carta2 = null;
    intentos = 0;
    spanIntentos.textContent = 0;
    crearTablero();
    detenerCronometro();
    iniciarCronometro();
  }

  // Comienza el juego: crea tablero y cronómetro
  function iniciarJuego() {
    reiniciarJuego();
    musica.play().catch(() => {
      console.warn("Reproducción bloqueada, espera interacción.");
    });
  }

  // Comienza el cronómetro (cuenta segundos)
  function iniciarCronometro() {
    segundos = 0;
    intervalo = setInterval(() => {
      segundos++;
      spanTiempo.textContent = formatTiempo(segundos);
    }, 1000);
  }

  // Detiene el cronómetro
  function detenerCronometro() {
    clearInterval(intervalo);
  }

  // Convierte segundos a formato MM:SS para mostrar bonito
  function formatTiempo(segundos) {
    const minutos = Math.floor(segundos / 60);
    const seg = segundos % 60;
    return `${minutos.toString().padStart(2, "0")}:${seg.toString().padStart(2, "0")}`;
  }
};
