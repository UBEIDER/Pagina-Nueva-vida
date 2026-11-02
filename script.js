// ===================== CARRUSEL DE LA PORTADA =====================
// Pasa de una diapositiva a otra cada 6 segundos; se detiene al pasar el mouse.
const portada = document.querySelector(".portada");

if (portada) {
    const diapositivas = portada.querySelectorAll(".diapositiva");
    const contenedorPuntos = portada.querySelector(".puntos");
    let actual = 0;
    let temporizador;

    // Un punto por cada diapositiva
    diapositivas.forEach(function (diapositiva, i) {
        const punto = document.createElement("button");
        punto.className = "punto" + (i === 0 ? " activo" : "");
        punto.setAttribute("aria-label", "Ir a la diapositiva " + (i + 1));
        punto.addEventListener("click", function () { mostrar(i); });
        contenedorPuntos.appendChild(punto);
    });
    const puntos = contenedorPuntos.querySelectorAll(".punto");

    function mostrar(i) {
        diapositivas[actual].classList.remove("activa");
        puntos[actual].classList.remove("activo");
        actual = (i + diapositivas.length) % diapositivas.length;
        diapositivas[actual].classList.add("activa");
        puntos[actual].classList.add("activo");
        reiniciar();
    }

    function reiniciar() {
        clearInterval(temporizador);
        temporizador = setInterval(function () { mostrar(actual + 1); }, 6000);
    }

    portada.querySelector(".flecha-anterior").addEventListener("click", function () { mostrar(actual - 1); });
    portada.querySelector(".flecha-siguiente").addEventListener("click", function () { mostrar(actual + 1); });
    portada.addEventListener("mouseenter", function () { clearInterval(temporizador); });
    portada.addEventListener("mouseleave", reiniciar);

    reiniciar();
}

// ===================== FILTROS POR AÑO =====================
// Al pulsar un botón de año, se muestran solo los proyectos de ese año.
const filtros = document.querySelectorAll(".filtro");
const proyectos = document.querySelectorAll(".proyecto");

filtros.forEach(function (boton) {
    boton.addEventListener("click", function () {
        // Marcar el botón pulsado como activo
        filtros.forEach(function (b) { b.classList.remove("activo"); });
        boton.classList.add("activo");

        // Mostrar u ocultar cada proyecto según su año
        const anio = boton.dataset.anio;
        proyectos.forEach(function (proyecto) {
            const mostrar = anio === "todos" || proyecto.dataset.anio === anio;
            proyecto.style.display = mostrar ? "" : "none";
        });
    });
});

// ===================== VISOR DE FOTOS =====================
// Al hacer clic en una foto se abre en grande, con flechas para pasar
// a las demás fotos del mismo proyecto o programa.
const visor = document.getElementById("visor");

if (visor) {
    const fotoGrande = visor.querySelector("img");
    const anterior = visor.querySelector(".visor-anterior");
    const siguiente = visor.querySelector(".visor-siguiente");
    let grupo = [];
    let posicion = 0;

    function mostrarFoto(i) {
        posicion = (i + grupo.length) % grupo.length;
        fotoGrande.src = grupo[posicion].src;
        fotoGrande.alt = grupo[posicion].alt;
    }

    function abrirVisor(fotos, i) {
        grupo = Array.from(fotos);
        mostrarFoto(i);
        const variasFotos = grupo.length > 1;
        anterior.style.display = variasFotos ? "" : "none";
        siguiente.style.display = variasFotos ? "" : "none";
        visor.classList.add("abierto");
    }

    // Página de proyectos: cada proyecto es un grupo
    document.querySelectorAll(".proyecto").forEach(function (proyecto) {
        const fotos = proyecto.querySelectorAll("img");
        fotos.forEach(function (foto, i) {
            foto.addEventListener("click", function () { abrirVisor(fotos, i); });
        });
    });

    // Página de programas: el grupo son todas las fotos de la galería del programa
    document.querySelectorAll(".programa-fotos").forEach(function (bloque) {
        const galeria = bloque.querySelector(".galeria");
        const fotosGaleria = galeria.querySelectorAll(".galeria-fotos img");

        // Las fotos que se ven en la página abren el visor en esa misma foto
        bloque.querySelectorAll(":scope > img, .foto-principal img").forEach(function (foto) {
            foto.addEventListener("click", function () {
                const i = Array.from(fotosGaleria).findIndex(function (f) { return f.src === foto.src; });
                abrirVisor(fotosGaleria, Math.max(i, 0));
            });
        });

        fotosGaleria.forEach(function (foto, i) {
            foto.addEventListener("click", function () { abrirVisor(fotosGaleria, i); });
        });

        bloque.querySelector(".ver-mas-fotos").addEventListener("click", function () {
            galeria.classList.add("abierta");
            document.body.style.overflow = "hidden";
        });

        galeria.querySelector(".galeria-cerrar").addEventListener("click", cerrarGalerias);
    });

    function cerrarGalerias() {
        document.querySelectorAll(".galeria.abierta").forEach(function (g) { g.classList.remove("abierta"); });
        document.body.style.overflow = "";
    }

    anterior.addEventListener("click", function (evento) {
        evento.stopPropagation();
        mostrarFoto(posicion - 1);
    });

    siguiente.addEventListener("click", function (evento) {
        evento.stopPropagation();
        mostrarFoto(posicion + 1);
    });

    // Se cierra al hacer clic fuera de las flechas o con la tecla Escape
    visor.addEventListener("click", function () {
        visor.classList.remove("abierto");
    });

    document.addEventListener("keydown", function (evento) {
        if (evento.key === "Escape") {
            // Primero se cierra la foto grande y después la galería
            if (visor.classList.contains("abierto")) {
                visor.classList.remove("abierto");
            } else {
                cerrarGalerias();
            }
        } else if (visor.classList.contains("abierto") && evento.key === "ArrowLeft") {
            mostrarFoto(posicion - 1);
        } else if (visor.classList.contains("abierto") && evento.key === "ArrowRight") {
            mostrarFoto(posicion + 1);
        }
    });
}

// ===================== FORMULARIO A WHATSAPP =====================
// Arma un mensaje con lo que escribió la persona y abre WhatsApp.
const formulario = document.getElementById("formulario");

if (formulario) {
    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault();

        const nombre = document.getElementById("nombre").value.trim();
        const motivo = document.getElementById("motivo").value;
        const mensaje = document.getElementById("mensaje").value.trim();

        let texto = "Hola, mi nombre es " + nombre + ". " + motivo + ".";
        if (mensaje) {
            texto += "\n\n" + mensaje;
        }

        window.open("https://wa.me/573147490549?text=" + encodeURIComponent(texto), "_blank");
    });
}
