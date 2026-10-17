#!/usr/bin/env node
/**
 * Audita y repara los árboles que la web escribió incompletos.
 *
 * Contexto en `src/helpers/aportes/esquemaApp.js`: las apps móviles leen con
 * `doc.get("campo").toString()` y un campo ausente las tumba dentro del listener
 * del mapa, con lo que un solo documento malo deja sin app a todo el mundo.
 * Desde que `documentoNuevo()` completa el documento, esto no vuelve a pasar con
 * lo nuevo; este script arregla lo que ya está guardado y sirve de revisión
 * periódica.
 *
 * Por defecto solo MIRA y no escribe nada:
 *
 *   node scripts/reparar-esquema-app.mjs                # audita lo subido desde la web
 *   node scripts/reparar-esquema-app.mjs --aplicar      # lo repara
 *   node scripts/reparar-esquema-app.mjs --todos        # audita la colección entera
 *
 * Se autentica con la sesión de gcloud (`gcloud auth login`), que es la misma
 * que ya se usa para desplegar. No necesita service account.
 */
import { execFileSync } from "node:child_process";
import { huecosParaApps, RELLENO_APPS } from "../src/helpers/aportes/esquemaApp.js";

const PROYECTO = "arbu-c574d";
const RAIZ = `projects/${PROYECTO}/databases/(default)/documents`;
const API = `https://firestore.googleapis.com/v1/${RAIZ}`;

const args = process.argv.slice(2);
const aplicar = args.includes("--aplicar");
const todos = args.includes("--todos");
const coleccion = args.find((a) => !a.startsWith("--")) ?? "arbolesMapeados";

if (!RELLENO_APPS[coleccion]) {
  console.error(`No hay esquema declarado para "${coleccion}".`);
  console.error(`Colecciones conocidas: ${Object.keys(RELLENO_APPS).join(", ")}`);
  process.exit(1);
}

const token = execFileSync("gcloud", ["auth", "print-access-token"], {
  encoding: "utf8",
}).trim();

const pedir = async (url, opciones = {}) => {
  const res = await fetch(url, {
    ...opciones,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...opciones.headers,
    },
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}: ${await res.text()}`);
  return res.json();
};

/** Firestore REST -> objeto plano. Solo lo justo para saber qué campos hay. */
const aPlano = (valor) => {
  if ("mapValue" in valor) {
    return Object.fromEntries(
      Object.entries(valor.mapValue.fields ?? {}).map(([k, v]) => [k, aPlano(v)])
    );
  }
  if ("arrayValue" in valor) return (valor.arrayValue.values ?? []).map(aPlano);
  if ("nullValue" in valor) return null;
  if ("integerValue" in valor) return Number(valor.integerValue);
  if ("doubleValue" in valor) return Number(valor.doubleValue);
  if ("booleanValue" in valor) return valor.booleanValue;
  return Object.values(valor)[0];
};

/** Objeto JS -> Firestore REST. Los números van como double: es lo que escriben las apps. */
const aRest = (valor) => {
  if (typeof valor === "string") return { stringValue: valor };
  if (typeof valor === "number") return { doubleValue: valor };
  if (typeof valor === "boolean") return { booleanValue: valor };
  throw new Error(`No sé serializar ${typeof valor}`);
};

/** Una clave de monitoreo es un uuid con guiones: en un fieldPath va entre acentos graves. */
const comoRuta = (ruta) =>
  ruta
    .split(".")
    .map((tramo) => (/^[A-Za-z_][A-Za-z0-9_]*$/.test(tramo) ? tramo : `\`${tramo}\``))
    .join(".");

/** Convierte {"monitoreos.k.altura": 0} en el árbol anidado que pide la API. */
const anidar = (huecos) => {
  const fields = {};
  for (const [ruta, valor] of Object.entries(huecos)) {
    const tramos = ruta.split(".");
    let actual = fields;
    tramos.forEach((tramo, i) => {
      if (i === tramos.length - 1) {
        actual[tramo] = aRest(valor);
      } else {
        actual[tramo] ??= { mapValue: { fields: {} } };
        actual = actual[tramo].mapValue.fields;
      }
    });
  }
  return fields;
};

const leerDocumentos = async () => {
  const documentos = [];

  if (todos) {
    let pageToken;
    do {
      const url = new URL(`${API}/${coleccion}`);
      url.searchParams.set("pageSize", "300");
      if (pageToken) url.searchParams.set("pageToken", pageToken);
      const pagina = await pedir(url);
      documentos.push(...(pagina.documents ?? []));
      pageToken = pagina.nextPageToken;
    } while (pageToken);
    return documentos;
  }

  const consulta = {
    structuredQuery: {
      from: [{ collectionId: coleccion }],
      where: {
        fieldFilter: {
          field: { fieldPath: "registradoDesde" },
          op: "EQUAL",
          value: { stringValue: "web" },
        },
      },
    },
  };
  const filas = await pedir(`${API}:runQuery`, {
    method: "POST",
    body: JSON.stringify(consulta),
  });
  return filas.filter((f) => f.document).map((f) => f.document);
};

const escribir = async (pendientes) => {
  const writes = pendientes.map(({ nombre, huecos }) => ({
    update: { name: nombre, fields: anidar(huecos) },
    updateMask: { fieldPaths: Object.keys(huecos).map(comoRuta) },
  }));

  for (let i = 0; i < writes.length; i += 100) {
    const lote = writes.slice(i, i + 100);
    await pedir(`https://firestore.googleapis.com/v1/projects/${PROYECTO}/databases/(default)/documents:commit`, {
      method: "POST",
      body: JSON.stringify({ writes: lote }),
    });
    console.log(`   escritos ${Math.min(i + lote.length, writes.length)}/${writes.length}`);
  }
};

const documentos = await leerDocumentos();
console.log(
  `${coleccion}: ${documentos.length} documentos revisados ` +
    `(${todos ? "la colección entera" : "solo lo subido desde la web"})`
);

const pendientes = [];
const porCampo = {};

for (const doc of documentos) {
  const id = doc.name.split("/").pop();
  const plano = Object.fromEntries(
    Object.entries(doc.fields ?? {}).map(([k, v]) => [k, aPlano(v)])
  );
  const huecos = huecosParaApps(coleccion, plano, id);
  if (!Object.keys(huecos).length) continue;

  pendientes.push({ nombre: doc.name, id, huecos });
  for (const ruta of Object.keys(huecos)) {
    const campo = ruta.startsWith("monitoreos.") ? `monitoreos.*.${ruta.split(".").pop()}` : ruta;
    porCampo[campo] = (porCampo[campo] ?? 0) + 1;
  }
}

if (!pendientes.length) {
  console.log("Todo completo: ningún documento le falta nada a las apps.");
  process.exit(0);
}

console.log(`\n${pendientes.length} documentos incompletos. Campos que faltan:`);
for (const [campo, n] of Object.entries(porCampo).sort((a, b) => b[1] - a[1])) {
  console.log(`   ${campo}: ${n}`);
}

if (!aplicar) {
  console.log("\nNo se ha escrito nada. Para repararlos: --aplicar");
  process.exit(0);
}

console.log("\nEscribiendo...");
await escribir(pendientes);
console.log("Listo.");
