using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/sesiones")]
public class SesionesController : ControllerBase
{
    // Obtener todas las sesiones
    [HttpGet]
    public ActionResult<IEnumerable<Sesion>> GetSesiones()
    {
        var sesiones = DatosCines.Cines
            .SelectMany(c => c.Salas)
            .SelectMany(s => s.Sesiones)
            .ToList();

        return Ok(sesiones);
    }

    // Obtener una sesion específica por su ID
    [HttpGet("{sesionId}")]
    public ActionResult<Sesion> GetSesionById(int sesionId)
    {
        var sesion = DatosCines.Cines
            .SelectMany(c => c.Salas)
            .SelectMany(s => s.Sesiones)
            .FirstOrDefault(f => f.SesionId == sesionId);

        if (sesion == null)
        {
            return NotFound($"Sesion con ID {sesionId} no encontrada.");
        }

        return Ok(sesion);
    }

    // Obtener una butacas de una sesion específica por la sesión ID
    [HttpGet("{sesionId}/butacas")]
    public ActionResult<IEnumerable<Butaca>> GetButacasBySesionId(int sesionId)
    {
        var sesion = DatosCines.Cines
            .SelectMany(s => s.Salas)
            .SelectMany(s => s.Sesiones)
            .FirstOrDefault(f => f.SesionId == sesionId);

        if (sesion == null)
        {
            return NotFound($"Sesion con ID {sesionId} no encontrada.");
        }

        return Ok(sesion.Butacas);
    }

    // Obtener sesiones por sala
    [HttpGet("sala/{salaId}")]
    public ActionResult<IEnumerable<Sesion>> GetSesionesBySalaId(int salaId)
    {
        var sesiones = DatosCines.Cines
            .SelectMany(c => c.Salas)
            .Where(s => s.SalaId == salaId)
            .SelectMany(s => s.Sesiones)
            .ToList();

        if (!sesiones.Any())
        {
            return NotFound($"No se encontraron sesiones para la sala con ID {salaId}.");
        }

        return Ok(sesiones);
    }

    [HttpGet("cine/{cineId}/pelicula/{peliculaId}")]
    public ActionResult GetSesionesByCineYPelicula(int cineId, int peliculaId)
    {
        var cine = DatosCines.Cines
            .Where(c => c.CineId == cineId)
            .Select(c => new
            {
                c.Nombre,
                Sesiones = c.Salas
                    .SelectMany(s => s.Sesiones)
                    .Where(s => s.PeliculaId == peliculaId)
                    .ToList()
            })
            .FirstOrDefault();

        if (cine == null || !cine.Sesiones.Any())
        {
            return NotFound($"No se encontraron sesiones para la película con ID {peliculaId} en el cine con ID {cineId}.");
        }

        return Ok(new
        {
            Nombre = cine.Nombre,
            Sesiones = cine.Sesiones
        });
    }
}