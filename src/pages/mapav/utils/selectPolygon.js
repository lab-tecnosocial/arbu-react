export const seleccionarPoligono = (id, map) => {
  const layer = layersRef.current.get(id);
  console.log("layer", layer)
  const poligono = polygon(layer.feature.geometry.coordinates);

  const markers_ArbolesPlantadosDentro = arbolesPlantados.filter((marker) => {
    const punto = point([marker.longitud, marker.latitud]);
    return booleanPointInPolygon(punto, poligono);
  });

  const markers_ArbolesMapeadosDentro = arbolesMapeados.filter((marker) => {
    const punto = point([marker.longitud, marker.latitud]);
    return booleanPointInPolygon(punto, poligono);
  });

  const contenido = markers_ArbolesPlantadosDentro.length
    ? `<div class="marker-wrapper"> 
            <div class="marker-dentro">Arboles Plantados dentro la zona:</div>${markers_ArbolesPlantadosDentro
      .map((m, i) => {
        return `<div class="marker-row">${i + 1}. ${m.nombrePropio} - ${m.nombreCientifico}</div>`
      }).join('')}
          </div>`
    : 'No hay arboles plantados dentro de esta área.';

  const contenido2 = markers_ArbolesMapeadosDentro.length
    ? `<div class="marker-wrapper"> 
            <div class="marker-dentro">Arboles Mapeados dentro la zona: ${markers_ArbolesMapeadosDentro.length}</div>
          </div>
`
    : 'No hay arboles Mapeados dentro de esta área.';

  layer.bindPopup(`
        <div class="popup-card">
          <div class="popup-title">
            <span>Grupo Scout:</span><span>${layer.feature.properties['GRUPO SCOUT']}</span>
          </div> 
          ${contenido}
          ${contenido2}
        </div>
      `).openPopup();

  const bounds = layer.getBounds();
  console.log("bounds", bounds)
}
