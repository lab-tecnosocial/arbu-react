import { useMemo, useState } from "react";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
import {
  Box, Button, Chip, FormControlLabel, IconButton, Switch, Tooltip, Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import { exportarTablaAExcel } from "../../helpers/exportarExcel";
import { formatFecha } from "../../helpers/fechaArbol";
import { municipioDeCoordenada } from "../../helpers/geo/municipios";

/**
 * Los aportes que ya existen, para encontrar el que hay que arreglar.
 *
 * El interruptor "solo los cargados desde la web" es el que da sentido al
 * campo `registradoDesde`: permite revisar lo que se metió a mano sin tener
 * que recordar cuál era.
 */
const ListaAportes = ({ filas, cargando, onNuevo, onEditar, onRecargar }) => {
  const [soloWeb, setSoloWeb] = useState(false);
  const [soloSinEspecie, setSoloSinEspecie] = useState(false);

  const datos = useMemo(() => {
    const conTextos = filas.map((f) => ({
      ...f,
      fechaTexto: formatFecha(f.fecha),
      municipioNombre:
        Number.isFinite(f.latitud) && Number.isFinite(f.longitud)
          ? municipioDeCoordenada(f.latitud, f.longitud)?.nombre ?? "Fuera del área"
          : "Sin ubicación",
      origenTexto: f.desdeWeb ? "Web" : "App",
    }));

    return conTextos.filter((f) => {
      if (soloWeb && !f.desdeWeb) return false;
      if (soloSinEspecie && (f.nombreComun || f.nombreCientifico)) return false;
      return true;
    });
  }, [filas, soloWeb, soloSinEspecie]);

  const columnas = useMemo(
    () => [
      { accessorKey: "nombreComun", header: "Nombre común", size: 140 },
      { accessorKey: "nombreCientifico", header: "Nombre científico", size: 170 },
      { accessorKey: "lugarDePlantacion", header: "Lugar", size: 150 },
      { accessorKey: "municipioNombre", header: "Municipio", size: 120 },
      { accessorKey: "fechaTexto", header: "Fecha", size: 110 },
      {
        accessorKey: "fotos",
        header: "Fotos",
        size: 80,
        Cell: ({ cell }) => (
          <Chip size="small" label={cell.getValue()} color={cell.getValue() ? "default" : "warning"} />
        ),
      },
      {
        accessorKey: "origenTexto",
        header: "Origen",
        size: 90,
        Cell: ({ cell }) => (
          <Chip
            size="small"
            label={cell.getValue()}
            color={cell.getValue() === "Web" ? "primary" : "default"}
            variant="outlined"
          />
        ),
      },
    ],
    []
  );

  const columnasExcel = [
    { header: "Árbol", valor: (f) => f.arbolId },
    { header: "Monitoreo", valor: (f) => f.monitoreoKey },
    { header: "Nombre común", valor: (f) => f.nombreComun },
    { header: "Nombre científico", valor: (f) => f.nombreCientifico },
    { header: "Lugar", valor: (f) => f.lugarDePlantacion },
    { header: "Latitud", valor: (f) => f.latitud },
    { header: "Longitud", valor: (f) => f.longitud },
    { header: "Municipio", valor: (f) => f.municipioNombre },
    { header: "Fecha", valor: (f) => f.fechaTexto },
    { header: "Altura", valor: (f) => f.altura },
    { header: "DAP", valor: (f) => f.diametroAlturaPecho },
    { header: "Fotos", valor: (f) => f.fotos },
    { header: "Origen", valor: (f) => f.origenTexto },
    { header: "Registrado por", valor: (f) => f.registradoPor ?? "" },
  ];

  const table = useMaterialReactTable({
    columns: columnas,
    data: datos,
    getRowId: (fila) => fila.clave,
    state: { isLoading: cargando },
    enableRowActions: true,
    positionActionsColumn: "first",
    displayColumnDefOptions: { "mrt-row-actions": { header: "", size: 60 } },
    renderRowActions: ({ row }) => (
      <Tooltip title="Corregir este aporte">
        <IconButton size="small" onClick={() => onEditar(row.original)}>
          <EditIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    ),
    initialState: { density: "compact", pagination: { pageSize: 25, pageIndex: 0 } },
    muiTableHeadCellProps: {
      sx: { backgroundColor: "#268576", color: "white", fontFamily: "Poppins" },
    },
    muiTableBodyCellProps: { sx: { fontFamily: "Poppins" } },
    renderTopToolbarCustomActions: () => (
      <Box sx={{ display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap" }}>
        <Button
          startIcon={<AddIcon />}
          variant="contained"
          onClick={onNuevo}
          sx={{ fontFamily: "Poppins", textTransform: "none" }}
        >
          Nuevo aporte
        </Button>
        <Button
          startIcon={<RefreshIcon />}
          onClick={onRecargar}
          sx={{ fontFamily: "Poppins", textTransform: "none" }}
        >
          Recargar
        </Button>
        <Button
          onClick={() =>
            exportarTablaAExcel(table, columnasExcel, {
              nombreHoja: "Aportes",
              nombreArchivo: "Arbu_Aportes",
            })
          }
          sx={{ fontFamily: "Poppins", textTransform: "none" }}
        >
          Exportar a Excel
        </Button>
      </Box>
    ),
  });

  return (
    <Box>
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center", mb: 1 }}>
        <FormControlLabel
          control={<Switch checked={soloWeb} onChange={(e) => setSoloWeb(e.target.checked)} />}
          label="Solo los cargados desde la web"
          sx={{ ".MuiFormControlLabel-label": { fontFamily: "Poppins", fontSize: 14 } }}
        />
        <FormControlLabel
          control={
            <Switch
              checked={soloSinEspecie}
              onChange={(e) => setSoloSinEspecie(e.target.checked)}
            />
          }
          label="Solo los que no tienen especie"
          sx={{ ".MuiFormControlLabel-label": { fontFamily: "Poppins", fontSize: 14 } }}
        />
        <Typography variant="caption" color="text.secondary">
          {datos.length} registros
        </Typography>
      </Box>

      <MaterialReactTable table={table} />
    </Box>
  );
};

export default ListaAportes;
