import { useRef, useState } from "react";
import {
  Alert, Box, Button, Chip, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Typography,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import {
  columnasPlantilla, descargarPlantilla, importarFilas, leerPlanilla,
} from "../../helpers/aportes/importarAportes";
import { ACCION, anotarEnBitacora } from "../../helpers/aportes/bitacora";

/**
 * Carga masiva desde una planilla.
 *
 * El paso que importa es la previsualización: nada se escribe hasta que
 * alguien ve fila por fila qué va a entrar y qué se va a quedar fuera. Una
 * importación que escribe primero y avisa después es imposible de deshacer en
 * Firestore.
 */
const ImportarAportes = ({ tipo, autor, onImportado, onAviso }) => {
  const entrada = useRef(null);
  const [filas, setFilas] = useState(null);
  const [desconocidas, setDesconocidas] = useState([]);
  const [nombreArchivo, setNombreArchivo] = useState("");
  const [importando, setImportando] = useState(false);

  const columnas = columnasPlantilla(tipo);

  const elegirArchivo = async (archivo) => {
    if (!archivo) return;
    setNombreArchivo(archivo.name);

    try {
      const { filas: leidas, columnasDesconocidas } = await leerPlanilla(archivo, tipo);
      setFilas(leidas);
      setDesconocidas(columnasDesconocidas);
    } catch (error) {
      onAviso({ texto: `No se pudo leer la planilla: ${error.message}`, severity: "error" });
    }
  };

  const validas = filas?.filter((f) => f.valido) ?? [];
  const invalidas = filas?.filter((f) => !f.valido) ?? [];

  const importar = async () => {
    setImportando(true);
    const res = await importarFilas(tipo, filas, autor);

    if (!res.success) {
      setImportando(false);
      onAviso({
        texto: `Se importaron ${res.escritas} de ${validas.length}: ${res.error}`,
        severity: "error",
      });
      return;
    }

    await anotarEnBitacora({
      coleccion: tipo.coleccion,
      accion: ACCION.IMPORTAR,
      arbolId: null,
      monitoreoKey: null,
      cambios: {},
      cantidad: res.escritas,
      arboles: res.ids.slice(0, 50),
      archivo: nombreArchivo,
      editadoPor: autor.email,
    });

    setImportando(false);
    setFilas(null);
    setNombreArchivo("");
    onAviso({ texto: `Se importaron ${res.escritas} aportes`, severity: "success" });
    onImportado();
  };

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
          1. Descargá la plantilla
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1.5 }}>
          Trae las columnas que el importador entiende y una fila de ejemplo. Las fotos van como
          URL de una imagen que ya esté subida; si no la tenés, dejá la celda vacía y completala
          después desde el editor.
        </Typography>
        <Button
          startIcon={<DownloadIcon />}
          onClick={() => descargarPlantilla(tipo)}
          sx={{ textTransform: "none" }}
        >
          Descargar plantilla
        </Button>
      </Paper>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1.5 }}>
          2. Subí la planilla completada
        </Typography>
        <Button
          startIcon={<UploadFileIcon />}
          variant="outlined"
          onClick={() => entrada.current?.click()}
          sx={{ textTransform: "none" }}
        >
          {nombreArchivo || "Elegir archivo (.xlsx o .csv)"}
        </Button>
        <input
          type="file"
          accept=".xlsx,.xls,.csv"
          hidden
          ref={entrada}
          onChange={(e) => {
            elegirArchivo(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </Paper>

      {filas && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
            3. Revisá antes de importar
          </Typography>

          <Box sx={{ display: "flex", gap: 1, mb: 1.5, flexWrap: "wrap" }}>
            <Chip label={`${validas.length} se importan`} color="success" size="small" />
            <Chip
              label={`${invalidas.length} se quedan fuera`}
              color={invalidas.length ? "error" : "default"}
              size="small"
            />
          </Box>

          {desconocidas.length > 0 && (
            <Alert severity="warning" sx={{ mb: 1.5 }}>
              Estas columnas no se reconocen y se ignoran: {desconocidas.join(", ")}.
            </Alert>
          )}

          {filas.length === 0 && <Alert severity="info">La planilla no tiene filas.</Alert>}

          {filas.length > 0 && (
            <TableContainer sx={{ maxHeight: 380 }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Fila</TableCell>
                    <TableCell>Estado</TableCell>
                    {columnas.slice(0, 6).map((c) => (
                      <TableCell key={c.nombre}>{c.header}</TableCell>
                    ))}
                    <TableCell>Problemas</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filas.map((fila) => (
                    <TableRow
                      key={fila.numero}
                      sx={{ backgroundColor: fila.valido ? undefined : "error.light", opacity: fila.valido ? 1 : 0.9 }}
                    >
                      <TableCell>{fila.numero}</TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={fila.valido ? "OK" : "Error"}
                          color={fila.valido ? "success" : "error"}
                        />
                      </TableCell>
                      {columnas.slice(0, 6).map((c) => (
                        <TableCell key={c.nombre}>{String(fila.valores[c.nombre] ?? "")}</TableCell>
                      ))}
                      <TableCell>
                        {[...Object.values(fila.errores), ...fila.advertencias].join("; ")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
            <Button
              variant="contained"
              disabled={!validas.length || importando}
              onClick={importar}
              sx={{ textTransform: "none" }}
            >
              {importando ? "Importando…" : `Importar ${validas.length} aportes`}
            </Button>
            <Button onClick={() => { setFilas(null); setNombreArchivo(""); }} disabled={importando}>
              Descartar
            </Button>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default ImportarAportes;
