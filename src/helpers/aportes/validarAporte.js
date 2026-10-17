import { CAMPO, camposDelTipo, esDeMonitoreo } from "./tiposAporte";
import { parseFechaLocal, toDate } from "../fechaArbol";
import { tieneEspecieIdentificada } from "../campanias/especies";

/**
 * Validación de un aporte, compartida por el formulario y el importador de
 * planillas. Una sola definición: si la planilla acepta una fila, el formulario
 * también la aceptaría, y al revés.
 *
 * Distingue ERRORES de ADVERTENCIAS a propósito. En los datos reales abundan
 * `nombreComun: ""` y `nombreCientifico: "..."`, así que la especie **avisa
 * pero no bloquea** —el mismo criterio que `evaluarRegistro.js` aplica en las
 * campañas—. Bloquear por especie dejaría fuera aportes legítimos.
 */

/** Los números llegan del formulario y de la planilla como texto; "" es "sin dato". */
export const aNumero = (valor) => {
  if (typeof valor === "number") return Number.isFinite(valor) ? valor : null;
  const limpio = String(valor ?? "").trim().replace(",", ".");
  if (!limpio) return null;
  const numero = Number(limpio);
  return Number.isFinite(numero) ? numero : null;
};

export const aTexto = (valor) => (valor === null || valor === undefined ? "" : String(valor));

/** "YYYY-MM-DD" para un <input type="date">, en hora local. */
export const aValorFecha = (valor) => {
  const fecha = toDate(valor);
  if (!fecha) return "";
  const dos = (n) => String(n).padStart(2, "0");
  return `${fecha.getFullYear()}-${dos(fecha.getMonth() + 1)}-${dos(fecha.getDate())}`;
};

/**
 * Una fecha, venga de donde venga.
 *
 * El formulario manda "YYYY-MM-DD" y eso pasa por `parseFechaLocal`, porque
 * `new Date("2026-09-30")` es medianoche **UTC** y en Bolivia cae el día
 * anterior a las 20:00.
 *
 * Una planilla, en cambio, manda lo que le da la gana: una hoja de cálculo
 * puede devolver un `Date` ya interpretado, "15/9/2026" o "2026-09-15". Aceptar
 * solo el formato del formulario hacía que toda planilla con fechas fallara
 * entera con "no es una fecha válida".
 */
const aFecha = (valor) => {
  if (valor instanceof Date) return Number.isNaN(valor.getTime()) ? null : valor;

  const texto = aTexto(valor).trim();
  if (!texto) return null;

  if (/^\d{4}-\d{2}-\d{2}/.test(texto)) return parseFechaLocal(texto);

  // Formato de por acá: día/mes/año.
  const partes = texto.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (partes) {
    const [, dia, mes, anio] = partes;
    return parseFechaLocal(`${anio}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`);
  }

  return toDate(texto);
};

/** Normaliza lo que escribió la persona al tipo que va a Firestore. */
export const normalizarValor = (campo, valor) => {
  if (campo.tipo === CAMPO.NUMERO) return aNumero(valor);
  if (campo.tipo === CAMPO.FECHA) return aFecha(valor);
  return aTexto(valor).trim();
};

/** Todos los valores del formulario, ya con el tipo correcto. */
export const normalizarValores = (tipo, valores) =>
  Object.fromEntries(
    camposDelTipo(tipo)
      .filter((campo) => campo.nombre in valores)
      .map((campo) => [campo.nombre, normalizarValor(campo, valores[campo.nombre])])
  );

const fueraDeRango = (campo, numero) =>
  (campo.min !== undefined && numero < campo.min) ||
  (campo.max !== undefined && numero > campo.max);

/**
 * @returns {{errores: Record<string,string>, advertencias: string[], valido: boolean}}
 */
export const validarAporte = (tipo, valores) => {
  const errores = {};
  const advertencias = [];
  const normalizados = normalizarValores(tipo, valores);

  for (const campo of camposDelTipo(tipo)) {
    const valor = normalizados[campo.nombre];

    // "Vacío" se decide sobre lo que la persona escribió, no sobre el valor ya
    // convertido: `aNumero("abc")` es null igual que un campo en blanco, y
    // confundirlos convierte "no es un número" en "falta el dato".
    const crudo = valores[campo.nombre];
    const escrito = crudo instanceof Date ? "fecha" : aTexto(crudo).trim();
    if (!escrito) {
      if (campo.requerido) errores[campo.nombre] = `Falta ${campo.etiqueta.toLowerCase()}`;
      continue;
    }

    if (campo.tipo === CAMPO.NUMERO) {
      if (valor === null) errores[campo.nombre] = `${campo.etiqueta} debe ser un número`;
      else if (fueraDeRango(campo, valor)) errores[campo.nombre] = `${campo.etiqueta} fuera de rango`;
    }

    if (campo.tipo === CAMPO.FECHA && valor === null) {
      errores[campo.nombre] = `${campo.etiqueta} no es una fecha válida`;
    }
  }

  // La foto principal se valida aparte porque no es un campo del formulario
  // como los demás: su valor es la URL que devuelve Storage al subirla.
  if (tipo.fotoRequerida) {
    const etiqueta =
      tipo.clavesFoto.find((f) => f.key === tipo.fotoRequerida)?.label ?? "foto";
    if (!aTexto(valores[tipo.fotoRequerida]).trim()) {
      errores[tipo.fotoRequerida] = `Falta la foto de ${etiqueta.toLowerCase()}`;
    }
  }

  const lat = normalizados.latitud;
  const lon = normalizados.longitud;
  if (lat === 0 && lon === 0) {
    errores.latitud = "La coordenada (0, 0) no es una ubicación real";
  }

  if (normalizados.timestamp instanceof Date && normalizados.timestamp > new Date()) {
    advertencias.push("La fecha del mapeo está en el futuro");
  }

  if (!tieneEspecieIdentificada(normalizados)) {
    advertencias.push("El árbol queda sin especie identificada");
  }

  return { errores, advertencias, valido: Object.keys(errores).length === 0, normalizados };
};

/** Valores de partida del formulario: vacío para crear, el árbol para editar. */
export const valoresIniciales = (tipo, arbol = null, monitoreoKey = null) => {
  const monitoreo = (arbol?.monitoreos ?? {})[monitoreoKey] ?? {};

  return Object.fromEntries(
    camposDelTipo(tipo).map((campo) => {
      const origen = esDeMonitoreo(tipo, campo.nombre) ? monitoreo : arbol ?? {};
      const valor = origen[campo.nombre];

      if (campo.tipo === CAMPO.FECHA) return [campo.nombre, aValorFecha(valor)];
      return [campo.nombre, aTexto(valor)];
    })
  );
};
