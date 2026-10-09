import { getMonitoreosOrdenados } from "../fechaArbol";
import { tipoDeArbol } from "./tiposAporte";

/**
 * Los aportes como filas de tabla.
 *
 * La unidad es el REGISTRO —el par (árbol, monitoreo)—, no el árbol: un mismo
 * ejemplar puede tener varios monitoreos y corregir "el árbol" sin decir cuál
 * de ellos llevaría a editar las medidas o las fotos equivocadas. Es el mismo
 * criterio que usa el panel del concurso (`registros.js`), aquí sin las reglas
 * de campaña, que no vienen al caso.
 */

export const claveFila = (arbolId, monitoreoKey) => `${arbolId}__${monitoreoKey}`;

export const filasDeAportes = (arboles = []) => {
  const filas = [];

  for (const arbol of arboles) {
    const tipo = tipoDeArbol(arbol);
    const monitoreos = getMonitoreosOrdenados(arbol);

    // Un árbol sin monitoreos no se pierde: se muestra igual para poder
    // arreglarlo, que es justo para lo que sirve esta pantalla.
    if (!monitoreos.length) {
      filas.push({
        clave: claveFila(arbol.id, null),
        arbolId: arbol.id,
        monitoreoKey: null,
        tipo,
        arbol,
        fecha: null,
        nombreComun: arbol.nombreComun || "",
        nombreCientifico: arbol.nombreCientifico || "",
        lugarDePlantacion: arbol.lugarDePlantacion || "",
        latitud: arbol.latitud ?? null,
        longitud: arbol.longitud ?? null,
        autor: arbol[tipo.campoAutor] ?? null,
        desdeWeb: arbol.registradoDesde === "web",
        registradoPor: arbol.registradoPor ?? null,
        fotos: 0,
        altura: null,
        diametroAlturaPecho: null,
      });
      continue;
    }

    for (const monitoreo of monitoreos) {
      filas.push({
        clave: claveFila(arbol.id, monitoreo.key),
        arbolId: arbol.id,
        monitoreoKey: monitoreo.key,
        tipo,
        arbol,
        fecha: monitoreo.fecha,
        nombreComun: arbol.nombreComun || "",
        nombreCientifico: arbol.nombreCientifico || "",
        lugarDePlantacion: arbol.lugarDePlantacion || "",
        latitud: arbol.latitud ?? null,
        longitud: arbol.longitud ?? null,
        autor: monitoreo.monitoreoRealizadoPor || arbol[tipo.campoAutor] || null,
        desdeWeb: arbol.registradoDesde === "web",
        registradoPor: arbol.registradoPor ?? null,
        fotos: tipo.clavesFoto.filter(({ key }) => monitoreo[key]).length,
        altura: monitoreo.altura ?? null,
        diametroAlturaPecho: monitoreo.diametroAlturaPecho ?? null,
      });
    }
  }

  return filas;
};
