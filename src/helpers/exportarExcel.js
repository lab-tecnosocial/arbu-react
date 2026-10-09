import * as XLSX from "xlsx";

/**
 * Exportación a Excel compartida.
 *
 * El patrón `getPrePaginationRowModel() → json_to_sheet → writeFile` estaba
 * copiado casi carácter por carácter en cuatro tablas. Aquí se declara una vez.
 *
 * Una `columna` es { header, valor } donde `valor` recibe la fila y devuelve
 * lo que va en la celda.
 */

const construirFilas = (filas, columnas) =>
  filas.map((fila) =>
    Object.fromEntries(
      columnas.map(({ header, valor }) => {
        try {
          return [header, valor(fila) ?? ""];
        } catch {
          return [header, ""];
        }
      })
    )
  );

const conFecha = (nombre) => `${nombre}_${new Date().toISOString().split("T")[0]}.xlsx`;

export const exportarFilasAExcel = (filas, columnas, { nombreHoja, nombreArchivo }) => {
  const hoja = XLSX.utils.json_to_sheet(construirFilas(filas, columnas));
  const libro = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(libro, hoja, nombreHoja);
  XLSX.writeFile(libro, conFecha(nombreArchivo));
};

/** Exporta lo que la tabla tiene filtrado, no solo la página visible. */
export const exportarTablaAExcel = (table, columnas, opciones) =>
  exportarFilasAExcel(
    table.getPrePaginationRowModel().rows.map((r) => r.original),
    columnas,
    opciones
  );

/** Varias hojas en un solo archivo; lo usa el acta de resultados. */
export const exportarLibro = (hojas, nombreArchivo) => {
  const libro = XLSX.utils.book_new();
  hojas.forEach(({ nombreHoja, filas, columnas }) => {
    XLSX.utils.book_append_sheet(
      libro,
      XLSX.utils.json_to_sheet(columnas ? construirFilas(filas, columnas) : filas),
      nombreHoja
    );
  });
  XLSX.writeFile(libro, conFecha(nombreArchivo));
};
