import { useMemo, useState } from "react";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
import {
  Alert, Box, Button, Chip, FormControlLabel, IconButton, Paper, Snackbar,
  Switch, TextField, Tooltip, Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useConcurso } from "../../context/ConcursoContext";
import { exportarTablaAExcel } from "../../helpers/exportarExcel";
import { formatFechaHora } from "../../helpers/fechaArbol";
import { ETIQUETA_ORIGEN } from "../../helpers/campanias/origenArbol";
import EditarRegistroDialog from "./EditarRegistroDialog";

const colorVeredicto = { apto: "success", dudoso: "warning", no_apto: "error" };

const TablaRegistrosConcurso = () => {
  const {
    registros, usuarios, ventana, setVentana,
    incluirFueraDeVentana, setIncluirFueraDeVentana,
    incluirSinEspecie, setIncluirSinEspecie,
  } = useConcurso();

  // La fila que se está corrigiendo. Se guarda la CLAVE y no el objeto: tras
  // recargar, los registros son objetos nuevos y el diálogo seguiría enseñando
  // los datos viejos.
  const [claveEditando, setClaveEditando] = useState(null);
  const [aviso, setAviso] = useState(null);

  const filas = useMemo(
    () =>
      registros.map((r) => ({
        ...r,
        participante: usuarios.get(r.uid)?.nombre || r.uid || "—",
        municipioNombre: r.municipio?.nombre ?? "Fuera del área",
        origenTexto: ETIQUETA_ORIGEN[r.origen] ?? r.origen ?? "—",
        fechaTexto: formatFechaHora(r.fecha),
        estadoRevision: r.revisado ? r.revision.veredicto : "pendiente",
      })),
    [registros, usuarios]
  );

  const columnas = useMemo(
    () => [
      { accessorKey: "participante", header: "Participante", size: 160 },
      { accessorKey: "nombreComun", header: "Nombre común", size: 130 },
      { accessorKey: "nombreCientifico", header: "Nombre científico", size: 160 },
      { accessorKey: "municipioNombre", header: "Municipio", size: 120 },
      { accessorKey: "origenTexto", header: "Registro", size: 110 },
      { accessorKey: "fechaTexto", header: "Fecha", size: 140 },
      {
        accessorFn: (r) => r.auto?.veredicto,
        id: "veredicto",
        header: "Automático",
        size: 110,
        Cell: ({ cell }) => (
          <Chip size="small" label={cell.getValue()} color={colorVeredicto[cell.getValue()]} />
        ),
      },
      {
        accessorKey: "estadoRevision",
        header: "Revisión",
        size: 110,
        Cell: ({ cell }) => (
          <Chip
            size="small"
            label={cell.getValue()}
            color={cell.getValue() === "valido" ? "success" : cell.getValue() === "pendiente" ? "default" : "error"}
          />
        ),
      },
      {
        accessorFn: (r) => (r.auto?.reglasIncumplidas ?? []).map((x) => x.clave).join(", "),
        id: "reglas",
        header: "Observaciones",
        size: 220,
      },
      {
        accessorFn: (r) => `${Math.round(r.completitud * 100)}%`,
        id: "completitud",
        header: "Completitud",
        size: 100,
      },
    ],
    []
  );

  const columnasExcel = [
    { header: "Participante", valor: (r) => r.participante },
    { header: "UID", valor: (r) => r.uid },
    { header: "Árbol", valor: (r) => r.arbolId },
    { header: "Monitoreo", valor: (r) => r.monitoreoKey },
    { header: "Nombre Común", valor: (r) => r.nombreComun },
    { header: "Nombre Científico", valor: (r) => r.nombreCientifico },
    { header: "Nombre Propio", valor: (r) => r.nombrePropio },
    { header: "Lugar", valor: (r) => r.lugarDePlantacion },
    { header: "Latitud", valor: (r) => r.latitud },
    { header: "Longitud", valor: (r) => r.longitud },
    { header: "Municipio", valor: (r) => r.municipioNombre },
    { header: "Fecha", valor: (r) => r.fechaTexto },
    { header: "Altura", valor: (r) => r.altura },
    { header: "DAP", valor: (r) => r.diametroAlturaPecho },
    { header: "Veredicto automático", valor: (r) => r.auto?.veredicto },
    { header: "Reglas incumplidas", valor: (r) => (r.auto?.reglasIncumplidas ?? []).map((x) => x.clave).join(", ") },
    { header: "Estado revisión", valor: (r) => r.estadoRevision },
    { header: "Motivo", valor: (r) => r.revision?.motivo ?? "" },
    { header: "Nota", valor: (r) => r.revision?.nota ?? "" },
    { header: "Revisor", valor: (r) => r.revision?.revisadoPor ?? "" },
    { header: "Completitud", valor: (r) => r.completitud },
    { header: "Foto árbol", valor: (r) => r.fotos.fotoArbolCompleto ?? "" },
    { header: "Foto flor", valor: (r) => r.fotos.fotoFlor ?? "" },
  ];

  const enEdicion = useMemo(
    () => filas.find((f) => f.clave === claveEditando) ?? null,
    [filas, claveEditando]
  );

  const table = useMaterialReactTable({
    columns: columnas,
    data: filas,
    getRowId: (fila) => fila.clave,
    enableRowActions: true,
    positionActionsColumn: "first",
    displayColumnDefOptions: { "mrt-row-actions": { header: "", size: 60 } },
    renderRowActions: ({ row }) => (
      <Tooltip title="Editar este registro">
        <IconButton size="small" onClick={() => setClaveEditando(row.original.clave)}>
          <EditIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    ),
    initialState: { density: "compact", pagination: { pageSize: 25, pageIndex: 0 } },
    muiTableHeadCellProps: { sx: { backgroundColor: "#268576", color: "white", fontFamily: "Poppins" } },
    muiTableBodyCellProps: { sx: { fontFamily: "Poppins" } },
    renderTopToolbarCustomActions: () => (
      <Button
        onClick={() => exportarTablaAExcel(table, columnasExcel, { nombreHoja: "Registros", nombreArchivo: "Concurso_Registros" })}
        sx={{ fontFamily: "Poppins", textTransform: "none" }}
      >
        Exportar a Excel
      </Button>
    ),
  });

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle2" sx={{ fontFamily: "Poppins", fontWeight: "bold", mb: 1 }}>
          Ventana de trabajo
        </Typography>
        <Typography variant="caption" sx={{ fontFamily: "Poppins", color: "#6b7a7a", display: "block", mb: 2 }}>
          Solo cambia lo que ves aquí; no toca la campaña. Sirve para comprobar que no se esté
          quedando fuera ningún aporte legítimo.
        </Typography>

        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
          <TextField
            type="date" label="Desde" size="small" InputLabelProps={{ shrink: true }}
            value={ventana?.desde ?? ""} disabled={incluirFueraDeVentana}
            onChange={(e) => setVentana({ ...ventana, desde: e.target.value })}
          />
          <TextField
            type="date" label="Hasta" size="small" InputLabelProps={{ shrink: true }}
            value={ventana?.hasta ?? ""} disabled={incluirFueraDeVentana}
            onChange={(e) => setVentana({ ...ventana, hasta: e.target.value })}
          />
          <FormControlLabel
            control={<Switch checked={incluirFueraDeVentana} onChange={(e) => setIncluirFueraDeVentana(e.target.checked)} />}
            label="Incluir registros fuera de la ventana"
            sx={{ ".MuiFormControlLabel-label": { fontFamily: "Poppins", fontSize: 14 } }}
          />
          <FormControlLabel
            control={<Switch checked={incluirSinEspecie} onChange={(e) => setIncluirSinEspecie(e.target.checked)} />}
            label="Incluir los que no coinciden con la especie"
            sx={{ ".MuiFormControlLabel-label": { fontFamily: "Poppins", fontSize: 14 } }}
          />
          <Chip label={`${filas.length} registros a la vista`} sx={{ fontFamily: "Poppins" }} />
        </Box>
      </Paper>

      <MaterialReactTable table={table} />

      <EditarRegistroDialog
        registro={enEdicion}
        abierto={Boolean(enEdicion)}
        onCerrar={() => setClaveEditando(null)}
        onAviso={setAviso}
      />

      <Snackbar
        open={Boolean(aviso)} autoHideDuration={6000} onClose={() => setAviso(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        {aviso ? <Alert severity={aviso.severity}>{aviso.texto}</Alert> : undefined}
      </Snackbar>
    </Box>
  );
};

export default TablaRegistrosConcurso;
