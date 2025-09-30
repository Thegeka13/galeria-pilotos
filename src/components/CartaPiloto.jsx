import { useState, useEffect } from "react";

// Componente para mostrar la tarjeta de un piloto de F1
export default function CartaPiloto({ numeroPiloto, alBorrar }) {
  // Estado para los datos del piloto
  const [datosPiloto, setDatosPiloto] = useState(null);
  // Estado para el indicador de carga
  const [cargando, setCargando] = useState(true);
  // Estado para manejar errores
  const [error, setError] = useState(null);

  useEffect(() => {
    async function obtenerDatos() {
      // URL de la API de OpenF1 usando el numero de piloto
      let url = `https://api.openf1.org/v1/drivers?driver_number=${numeroPiloto}`;
      
      try {
        setCargando(true);
        const respuesta = await fetch(url);
        
        if (!respuesta.ok)
          throw new Error(`Error al consumir la API: ${respuesta.status}`);
          
        const datos = await respuesta.json();
        const piloto = datos[0];
        
        // Verifica si se encontro el piloto
        if (!piloto) throw new Error("No se encontro el piloto");

        // Almacena solo los datos necesarios
        setDatosPiloto({
          nombreCompleto: piloto.full_name,
          numero: piloto.driver_number,
          equipo: piloto.team_name,
          fotoUrl: piloto.headshot_url,
        });
        
      } catch (err) {
        console.error("Ha ocurrido un error:", err);
        // Mensaje de error sin acentos
        setError("No se pudo cargar la informacion del piloto.");
        
      } finally {
        setCargando(false);
      }
    }

    obtenerDatos();
  }, [numeroPiloto]);

  if (cargando) {
    return (
      // Mensaje de carga sin acentos
      <div className="alert alert-info text-center w-100">
        Cargando datos del piloto...
      </div>
    );
  }

  if (error) {
    return (
      // Mensaje de error
      <div className="alert alert-danger text-center w-100">{error}</div>
    );
  }

  return (
    <div className="card bg-dark text-light border-light shadow-sm h-100">
      <img
        src={datosPiloto.fotoUrl}
        alt="Piloto de F1"
        // Estilos para la imagen, utilizando Tailwind por defecto
        className="w-75 mx-auto d-block rounded-circle border border-light mt-3"
        style={{ maxHeight: "200px", objectFit: "contain" }}
        // Agregando manejo de error para la imagen
        onError={(e) => { 
            e.target.onerror = null; 
            // Placeholder de imagen en caso de error
            e.target.src = "https://placehold.co/200x200/4F46E5/FFFFFF?text=F1"; 
        }}
      />
      <div className="card-body d-flex flex-column text-center">
        <h5 className="card-title">
          {datosPiloto.nombreCompleto}{" "}
          <span className="text-warning">#{datosPiloto.numero}</span>
        </h5>
        <p className="card-text">{datosPiloto.equipo}</p>
        <button
          className="btn btn-outline-danger btn-sm mt-auto"
          onClick={() => alBorrar(numeroPiloto)}
        >
          {/* Boton sin el emoji */}
          Borrar Piloto
        </button>
      </div>
    </div>);
}
