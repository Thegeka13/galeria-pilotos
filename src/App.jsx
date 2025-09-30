import { useState, useEffect } from "react";

// Configuracion de la URL base de la API
const API_URL_BASE = "https://api.openf1.org/v1/drivers";

// Componente para mostrar la tarjeta de un piloto de F1
// Definido internamente para cumplir con el requisito de un solo archivo.
function CartaPiloto({ numeroPiloto, alBorrar }) {
  // Estado para los datos del piloto
  const [datosPiloto, setDatosPiloto] = useState(null);
  // Estado para el indicador de carga
  const [cargando, setCargando] = useState(true);
  // Estado para manejar errores
  const [error, setError] = useState(null);

  useEffect(() => {
    async function obtenerDatos() {
      let url = `${API_URL_BASE}?driver_number=${numeroPiloto}`;
      
      try {
        setCargando(true);
        setError(null); // Limpiar errores anteriores
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
      // Estilos Tailwind para el mensaje de carga
      <div className="p-4 bg-blue-600 text-white text-center rounded-xl shadow-lg h-full flex items-center justify-center">
        Cargando datos del piloto...
      </div>
    );
  }

  if (error) {
    return (
      // Estilos Tailwind para el mensaje de error
      <div className="p-4 bg-red-600 text-white text-center rounded-xl shadow-lg h-full flex items-center justify-center">
        {error}
      </div>
    );
  }

  // Vista de la tarjeta del piloto
  return (
    <div className="bg-gray-800 text-white rounded-xl shadow-2xl h-full flex flex-col overflow-hidden transform hover:scale-[1.02] transition duration-300 border border-yellow-600">
      <div className="p-6 pb-2 flex flex-col items-center">
        <img
          src={datosPiloto.fotoUrl}
          alt={`Piloto #${datosPiloto.numero}`}
          // Estilos para la imagen
          className="w-4/5 mx-auto block rounded-full border-4 border-yellow-500 shadow-xl"
          style={{ maxHeight: "200px", objectFit: "cover", aspectRatio: "1/1" }}
          // Manejo de error para la imagen
          onError={(e) => { 
              e.target.onerror = null; 
              e.target.src = `https://placehold.co/200x200/4F46E5/FFFFFF?text=${datosPiloto.numero}`; 
          }}
        />
      </div>
      
      <div className="p-6 pt-2 flex flex-col items-center text-center flex-grow">
        <h5 className="text-2xl font-extrabold mb-1">
          {datosPiloto.nombreCompleto}{" "}
          <span className="text-yellow-500 text-3xl font-black ml-1">#{datosPiloto.numero}</span>
        </h5>
        <p className="text-gray-400 mb-4 text-lg font-medium">{datosPiloto.equipo}</p>
        
        {/* Boton Borrar Piloto sin el emoji */}
        <button
          className="mt-auto px-4 py-2 text-sm font-semibold rounded-lg border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition duration-200 w-full"
          onClick={() => alBorrar(numeroPiloto)}
        >
          Borrar Piloto
        </button>
      </div>
    </div>
  );
}


// Componente principal de la aplicacion
export default function App() {
  // Estado para el valor del input de busqueda
  const [busqueda, setBusqueda] = useState("");
  // Lista de numeros de pilotos a mostrar
  const [listaPilotos, setListaPilotos] = useState(["1", "81", "4"]);

  // Funcion para manejar el envio del formulario (busqueda)
  const manejarBusqueda = (e) => {
    e.preventDefault();
    // Verifica que no este vacio y no este ya en la lista
    if (busqueda.trim() !== "" && !listaPilotos.includes(busqueda)) {
      setListaPilotos([...listaPilotos, busqueda.trim()]);
      setBusqueda("");
    }
  };

  // Funcion para eliminar un piloto de la lista
  const manejarBorrar = (numero) => {
    setListaPilotos(listaPilotos.filter((n) => n !== numero));
  };

  return (
    // Usa un fondo oscuro para que las cartas de piloto destaquen
    <div className="min-h-screen bg-gray-900 font-sans"> 
      {/* Contenedor principal para centrar el contenido */}
      <div className="container mx-auto py-8 px-4"> 

        {/* Titulo principal sin acentos */}
        <h1 className="text-center text-white text-4xl font-bold mb-8">
          Galeria de Pilotos de F1
        </h1>

        {/* Barra de busqueda */}
        <form
          onSubmit={manejarBusqueda}
          className="flex flex-wrap justify-center gap-4 mb-10"
        >
          <div className="w-full sm:w-auto">
            <input
              type="text"
              // Placeholder sin acentos
              placeholder="Buscar por numero"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full bg-gray-800 text-white border-gray-600 rounded-lg p-3 focus:ring-yellow-500 focus:border-yellow-500 shadow-inner"
            />
          </div>
          <div className="w-full sm:w-auto">
            <button 
              type="submit" 
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-gray-900 font-semibold py-3 px-6 rounded-lg shadow-lg transition duration-200 transform hover:scale-[1.05]"
            >
              Buscar
            </button>
          </div>
        </form>

        {/* Cartas de pilotos - Usando grid para responsive layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {listaPilotos.map((num) => (
            <CartaPiloto 
              key={num} 
              numeroPiloto={num} 
              alBorrar={manejarBorrar} 
            />
          ))}
        </div>
        
        {listaPilotos.length === 0 && (
          <p className="text-center text-gray-400 mt-10 text-xl">
            Aun no hay pilotos agregados. Usa la barra de busqueda.
          </p>
        )}
      </div>
    </div>
  );
}