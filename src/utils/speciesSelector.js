export function recommendSpecies(especies = [], answers = {}, options = {}) {
  const { lugar, ancho, cables } = answers;
  const topN = options.topN || 5;

  // 🐛 DEBUG: Esto te mostrará en la consola del navegador qué datos estás recibiendo
  console.log("🔍 Criterios de búsqueda:", { lugar, ancho, cables });
  console.log("🌳 Primera especie analizada:", especies[0]); 

  const filtrados = especies.filter((data) => {
    // Si la especie no tiene los datos requeridos, la ignoramos.
    // ESTO ES CLAVE: Si ves muchos de estos en consola, significa que tu base
    // de datos (Redux/Firebase) no tiene las variables tipoArea o cablesElectricidad
    if (!data.tipoArea || !data.cablesElectricidad) {
        console.warn("Faltan datos en la especie:", data.nombreComun || 'Desconocida');
        return false; 
    }

    // A. VALIDAR ANCHO (Aseguramos que sea un número)
    const dimRequerida = Number(data.dimJardinera2) || 0;
    const cumpleAncho = ancho ? (dimRequerida <= ancho) : true;

    // B. VALIDAR LUGAR (Limpiamos espacios para que "calle, parque" funcione igual que "calle,parque")
    const areasArray = data.tipoArea.toLowerCase().split(',').map(s => s.trim());
    const lugarBuscado = lugar.toLowerCase().trim();
    const cumpleLugar = areasArray.includes(lugarBuscado);

    // C. VALIDAR CABLES (Buscamos solo la palabra clave, para evitar problemas de tildes en el "Sí")
    const cablesArbol = data.cablesElectricidad.toLowerCase().trim();
    let cumpleCables = false;
    
    if (cables === 'No' && cablesArbol === 'no') {
        cumpleCables = true;
    } else if (cables === 'Baja' && cablesArbol.includes('baja')) {
        cumpleCables = true;
    } else if (cables === 'Media' && cablesArbol.includes('media')) {
        cumpleCables = true;
    }

    // Si todo se cumple, mostramos en consola cuál pasó la prueba
    if (cumpleAncho && cumpleLugar && cumpleCables) {
        console.log("✅ Especie APROBADA:", data.nombreComun);
    }

    return cumpleAncho && cumpleLugar && cumpleCables;
  });

  return filtrados.slice(0, topN).map((especie, index) => ({
    especie: especie,
    rank: index + 1
  }));
}

export function getCompatibilityLevel() { return null; }
export default { recommendSpecies };