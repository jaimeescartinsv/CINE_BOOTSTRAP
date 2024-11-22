document.addEventListener("DOMContentLoaded", function () {
    const apiUrlPeliculas = "http://localhost:5000/api/peliculas";
    const apiUrlSesiones = "http://localhost:5000/api/sesiones";

    // Renderizar título y banner de la película
    function renderBannerAndTitle(pelicula) {
        const movieTitle = document.getElementById('movieTitle');
        const movieBanner = document.getElementById('movieBanner');

        if (movieTitle && movieBanner) {
            movieTitle.innerHTML = pelicula.title || 'Título no disponible';
            movieBanner.src = pelicula.cartelUrl || 'https://via.placeholder.com/1920x600';
        } else {
            console.error("No se encontraron los elementos del DOM para renderizar el banner y el título.");
        }
    }

    // Mostrar los detalles de la sesión
    function renderSesionDetails(sesion) {
        const sessionDetailsElement = document.getElementById('sessionDetails');

        if (!sesion) {
            sessionDetailsElement.textContent = "No se pudieron cargar los detalles de la sesión.";
            return;
        }

        // Formatear la fecha y la hora
        const formattedDate = new Date(sesion.fechaDeSesion).toLocaleDateString("es-ES", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
        });

        const formattedTime = new Date(sesion.horaDeInicio).toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
        });

        // Renderizar los detalles
        sessionDetailsElement.textContent = `Sala: ${sesion.salaId} | Fecha: ${formattedDate} | Hora: ${formattedTime}`;
    }

    // Obtener los IDs de película y sesión desde localStorage
    const selectedPeliculaId = localStorage.getItem('selectedPeliculaId');
    const selectedSesionId = localStorage.getItem('selectedSesionId');

    // Validar los IDs
    if (!selectedSesionId) {
        console.error("No se encontró ningún ID de sesión en localStorage.");
        document.getElementById('sessionDetails').textContent = "No se pudieron cargar los detalles de la sesión.";
        return;
    }

    if (!selectedPeliculaId) {
        console.error("No se encontró ningún ID de película en localStorage.");
        return;
    }

    // Fetch detalles de la sesión
    fetch(`${apiUrlSesiones}/${selectedSesionId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al obtener los datos de la sesión.");
            }
            return response.json();
        })
        .then(sesion => {
            console.log("Datos de la sesión:", sesion);
            renderSesionDetails(sesion); // Renderizar detalles de la sesión
        })
        .catch(error => {
            console.error("Error al cargar los datos de la sesión:", error);
            document.getElementById('sessionDetails').textContent = "Hubo un error al cargar los detalles de la sesión.";
        });

    // Fetch para cargar y renderizar el título y el banner de la película
    fetch(`${apiUrlPeliculas}/${selectedPeliculaId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la solicitud a la API.');
            }
            return response.json();
        })
        .then(pelicula => {
            if (pelicula) {
                renderBannerAndTitle(pelicula); // Renderizar solo el banner y el título
                console.log(`Renderizado título y banner de película con ID: ${selectedPeliculaId}`);
            } else {
                console.error("Película no encontrada en la API.");
            }
        })
        .catch(error => {
            console.error("Error al obtener los datos de la película:", error);
        });
});