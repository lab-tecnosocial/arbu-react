import { useMemo, useState } from "react";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
import {
  Alert, Box, Button, Chip, Paper, Snackbar, TextField, Typography,
} from "@mui/material";
import { useConcurso } from "../../context/ConcursoContext";
import { exportarTablaAExcel } from "../../helpers/exportarExcel";
import { guardarParticipante } from "../../helpers/campanias/revisionOperations";
import { formatFechaHora } from "../../helpers/fechaArbol";
import { CRITERIO_DESEMPATE_1 } from "../../helpers/campanias/calcularRanking";

/** Redacta en prosa por qué una fila va detrás de la anterior. */
const explicarDesempate = (fila) => {
  const d = fila.desempate;
  if (!d) return "Va primero.";
  if (d.empateTotal) {
    return `Empate total con ${d.rival} en los cuatro criterios. Lo decide la organización, no el sistema.`;
  }
  if (d.criterio === "Registros válidos") {
    return `${d.rival} tiene ${d.valorRival} registros válidos y esta persona ${d.valorPropio}.`;
  }
  return `Empata con ${d.rival} en registros válidos. ${d.criterio}: ${d.valorRival} vs ${d.valorPropio} → gana ${d.rival}.`;
};

const TablaPosiciones = () => {
  const { ranking, campania, usuarioActual, participantes, recargar, registros } = useConcurso();
  const [aviso, setAviso] = useState(null);
  const [edicion, setEdicion] = useState({});

  const criterio1 = campania?.reglas?.criterioDesempate1 ?? CRITERIO_DESEMPATE_1.MUNICIPIOS_DISTINTOS;

  const columnas = useMemo(
    () => [
      { accessorKey: "posicion", header: "#", size: 50 },
      { accessorKey: "nombre", header: "Participante", size: 180 },
      { accessorKey: "validos", header: "Válidos", size: 80 },
      { accessorKey: "pendientes", header: "Sin revisar", size: 100 },
      {
        accessorKey: "nMunicipios",
        header: "Municipios",
        size: 100,
        Header: () => (
          <span title="Criterio 1, lectura (a)">
            Municipios{criterio1 === CRITERIO_DESEMPATE_1.MUNICIPIOS_DISTINTOS ? " ★" : ""}
          </span>
        ),
      },
      {
        accessorKey: "validosFueraDelPrincipal",
        header: "Fuera del principal",
        size: 140,
        Header: () => (
          <span title="Criterio 1, lectura (b)">
            Fuera del principal{criterio1 === CRITERIO_DESEMPATE_1.FUERA_DEL_PRINCIPAL ? " ★" : ""}
          </span>
        ),
      },
      {
        accessorFn: (f) => `${Math.round(f.completitudMedia * 100)}%`,
        id: "completitud",
        header: "Completitud",
        size: 110,
      },
      {
        accessorFn: (f) => formatFechaHora(f.fechaAlcanzoTotal),
        id: "alcanzo",
        header: "Alcanzó su total",
        size: 150,
      },
    ],
    [criterio1]
  );

  const table = useMaterialReactTable({
    columns: columnas,
    data: ranking,
    initialState: { density: "compact", pagination: { pageSize: 25, pageIndex: 0 } },
    muiTableHeadCellProps: { sx: { backgroundColor: "#268576", color: "white", fontFamily: "Poppins" } },
    muiTableBodyCellProps: { sx: { fontFamily: "Poppins" } },
    renderDetailPanel: ({ row }) => {
      const fila = row.original;
      const datos = participantes[fila.uid] ?? {};
      const local = edicion[fila.uid] ?? {};
      const campo = (k) => local[k] ?? datos.verificacion?.[k] ?? "";

      return (
        <Box sx={{ p: 2, backgroundColor: "#f7faf9" }}>
          <Typography sx={{ fontFamily: "Poppins", fontWeight: "bold", mb: 1 }}>
            Por qué está en esta posición
          </Typography>
          <Typography sx={{ fontFamily: "Poppins", mb: 2 }}>{explicarDesempate(fila)}</Typography>

          <Typography variant="body2" sx={{ fontFamily: "Poppins", mb: 2 }}>
            Municipios cubiertos: {fila.municipios.join(", ") || "ninguno"} · principal:{" "}
            {fila.municipioPrincipal ?? "—"}
          </Typography>

          <Typography sx={{ fontFamily: "Poppins", fontWeight: "bold", mb: 1 }}>
            Verificación manual (18-30 años y residencia)
          </Typography>
          <Typography variant="caption" sx={{ fontFamily: "Poppins", color: "#6b7a7a", display: "block", mb: 1 }}>
            El correo no es accesible desde aquí: está en Firebase Auth. Copia el UID y búscalo en la consola.
          </Typography>

          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", alignItems: "center" }}>
            <Button size="small" onClick={() => navigator.clipboard?.writeText(fila.uid)}
              sx={{ fontFamily: "Poppins", textTransform: "none" }}>
              Copiar UID
            </Button>
            <Button size="small" component="a" target="_blank" rel="noreferrer"
              href="https://console.firebase.google.com/project/arbu-c574d/authentication/users"
              sx={{ fontFamily: "Poppins", textTransform: "none" }}>
              Abrir consola de Auth
            </Button>
            {["emailManual", "telefono", "municipioResidencia", "edad", "notas"].map((k) => (
              <TextField key={k} size="small" label={k} value={campo(k)}
                onChange={(e) => setEdicion((s) => ({ ...s, [fila.uid]: { ...local, [k]: e.target.value } }))}
              />
            ))}
            <Button size="small" variant="contained"
              onClick={async () => {
                const res = await guardarParticipante(
                  campania.id, fila.uid,
                  { verificacion: { ...(datos.verificacion ?? {}), ...local } },
                  usuarioActual
                );
                setAviso({ texto: res.success ? "Verificación guardada" : res.error, severity: res.success ? "success" : "error" });
                if (res.success) await recargar();
              }}
              sx={{ fontFamily: "Poppins", textTransform: "none" }}>
              Guardar
            </Button>
          </Box>
        </Box>
      );
    },
    renderTopToolbarCustomActions: () => (
      <Button
        onClick={() =>
          exportarTablaAExcel(table, [
            { header: "Posición", valor: (f) => f.posicion },
            { header: "Participante", valor: (f) => f.nombre },
            { header: "UID", valor: (f) => f.uid },
            { header: "Válidos", valor: (f) => f.validos },
            { header: "Inválidos", valor: (f) => f.invalidos },
            { header: "Sin revisar", valor: (f) => f.pendientes },
            { header: "Municipios distintos", valor: (f) => f.nMunicipios },
            { header: "Municipios", valor: (f) => f.municipios.join(", ") },
            { header: "Municipio principal", valor: (f) => f.municipioPrincipal },
            { header: "Válidos fuera del principal", valor: (f) => f.validosFueraDelPrincipal },
            { header: "Completitud media", valor: (f) => f.completitudMedia },
            { header: "Alcanzó su total", valor: (f) => formatFechaHora(f.fechaAlcanzoTotal) },
            { header: "Desempate", valor: (f) => explicarDesempate(f) },
          ], { nombreHoja: "Posiciones", nombreArchivo: "Concurso_Posiciones" })
        }
        sx={{ fontFamily: "Poppins", textTransform: "none" }}
      >
        Exportar a Excel
      </Button>
    ),
  });

  const pendientes = registros.filter((r) => !r.revisado).length;

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle2" sx={{ fontFamily: "Poppins", fontWeight: "bold", mb: 1 }}>
          Parámetros aplicados
        </Typography>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Chip size="small" label={`Criterio 1: ${criterio1 === CRITERIO_DESEMPATE_1.MUNICIPIOS_DISTINTOS ? "municipios distintos" : "válidos fuera del principal"}`} sx={{ fontFamily: "Poppins" }} />
          <Chip size="small" label={`Especies: ${campania?.reglas?.especies?.etiqueta ?? campania?.reglas?.especies?.generos?.join(", ") ?? "sin restricción"}`} sx={{ fontFamily: "Poppins" }} />
          <Chip size="small" label={`Municipios: ${campania?.reglas?.municipios?.length ?? "sin restricción"}`} sx={{ fontFamily: "Poppins" }} />
          <Chip size="small" label="Descalificaciones aplicadas" color="success" sx={{ fontFamily: "Poppins" }} />
        </Box>
        <Typography variant="caption" sx={{ fontFamily: "Poppins", color: "#6b7a7a", display: "block", mt: 1 }}>
          Las dos lecturas del criterio 1 se muestran siempre; ★ marca la que decide. Conviene
          fijarla por escrito con la organización antes del cierre.
        </Typography>
      </Paper>

      {pendientes > 0 && (
        <Alert severity="warning" sx={{ mb: 2, fontFamily: "Poppins" }}>
          Quedan {pendientes} registros sin revisar: estas posiciones aún pueden cambiar.
        </Alert>
      )}

      <MaterialReactTable table={table} />

      <Snackbar open={Boolean(aviso)} autoHideDuration={4000} onClose={() => setAviso(null)}>
        {aviso ? <Alert severity={aviso.severity}>{aviso.texto}</Alert> : undefined}
      </Snackbar>
    </Box>
  );
};

export default TablaPosiciones;
