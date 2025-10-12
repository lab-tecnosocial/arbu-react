import React, { useMemo, useState, useEffect } from "react";
import { MaterialReactTable } from "material-react-table";
import { Box, Button, Chip, Select, MenuItem } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { useMapeoScout } from "../../context/MapeoScoutContext";
import TreeCardPopup from "./TreeCardPopup";
import FiltroFechas from "./FiltroFechas";
import { db } from "../../firebase/firebase-config";
import * as XLSX from "xlsx";

const TablaMapeo = ({ fechaInicio, fechaFin, setFechaInicio, setFechaFin, onLimpiarFiltros }) => {
  const { mapeadores: mapeadoresOriginal, arbolesMapeados } = useMapeoScout();
  const [treePopupOpen, setTreePopupOpen] = useState(false);
  const [selectedMapper, setSelectedMapper] = useState(null);
  const [mapeadores, setMapeadores] = useState(mapeadoresOriginal);

  // Actualizar mapeadores cuando cambie mapeadoresOriginal
  useEffect(() => {
    setMapeadores(mapeadoresOriginal);
  }, [mapeadoresOriginal]);

  // Función para convertir timestamp de Firebase a Date
  const convertTimestamp = (timestamp) => {
    if (!timestamp) return null;
    if (timestamp.seconds) {
      return new Date(timestamp.seconds * 1000);
    }
    return new Date(timestamp);
  };

  // Función para obtener el timestamp del árbol (está dentro del primer monitoreo)
  const getArbolTimestamp = (arbol) => {
    if (!arbol.monitoreos || typeof arbol.monitoreos !== 'object') return null;
    const monitoreoKeys = Object.keys(arbol.monitoreos);
    if (monitoreoKeys.length === 0) return null;
    return arbol.monitoreos[monitoreoKeys[0]].timestamp;
  };

  // Filtrar árboles por fecha si se aplican filtros
  const arbolesFiltrados = useMemo(() => {
    if (!fechaInicio && !fechaFin) return arbolesMapeados;

    return arbolesMapeados.filter((arbol) => {
      const timestamp = getArbolTimestamp(arbol);
      const fecha = convertTimestamp(timestamp);
      if (!fecha) return false;

      const inicio = fechaInicio ? new Date(fechaInicio) : null;
      const fin = fechaFin ? new Date(fechaFin + "T23:59:59") : null;

      if (inicio && fecha < inicio) return false;
      if (fin && fecha > fin) return false;
      return true;
    });
  }, [arbolesMapeados, fechaInicio, fechaFin]);

  // Recalcular mapeadores con árboles filtrados
  const mapeadoresFiltrados = useMemo(() => {
    return mapeadores.map((mapper) => {
      const arbolesDeMapeador = arbolesFiltrados.filter(
        (arbol) => arbol.mapeadoPor === mapper.id
      );
      return {
        ...mapper,
        cantidadArbolesMapeadosFiltrados: arbolesDeMapeador.length,
        arbolesMapeadosFiltrados: arbolesDeMapeador,
      };
    });
  }, [mapeadores, arbolesFiltrados]);

  const handleViewTrees = (mapper) => {
    setSelectedMapper(mapper);
    setTreePopupOpen(true);
  };

  const handleClosePopup = () => {
    setTreePopupOpen(false);
    setSelectedMapper(null);
  };

  const handlePagadoChange = async (mapperId, newValue) => {
    try {
      const pagadoBoolean = newValue === "si";

      // Actualizar estado local inmediatamente para mejor UX
      setMapeadores(prevMapeadores =>
        prevMapeadores.map(mapper =>
          mapper.id === mapperId
            ? { ...mapper, pagado: pagadoBoolean }
            : mapper
        )
      );

      // Actualizar en Firestore en segundo plano
      await db.collection("inscripcionesMapeo").doc(mapperId).update({
        pagado: pagadoBoolean
      });
    } catch (error) {
      console.error("Error actualizando campo pagado:", error);
      alert("Error al actualizar el campo. Por favor, intenta nuevamente.");
      // Revertir cambio local en caso de error
      setMapeadores(mapeadoresOriginal);
    }
  };

  const handleExportToExcel = (table) => {
    // Exportar TODAS las filas (pre-paginadas) con filtros y ordenamiento aplicados
    const rows = table.getPrePaginationRowModel().rows;
    const dataToExport = rows.map((row) => ({
      Nombre: row.original.nombre,
      Email: row.original.email,
      Estado: row.original.estado,
      Grupo: row.original.grupo,
      Rama: row.original.rama,
      "Árboles Mapeados": fechaInicio || fechaFin
        ? row.original.cantidadArbolesMapeadosFiltrados
        : row.original.cantidadArbolesMapeados || 0,
    }));

    // Crear workbook y worksheet
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Participantes");

    // Generar archivo
    const fecha = new Date().toISOString().split("T")[0];
    XLSX.writeFile(wb, `Mapeo_Participantes_${fecha}.xlsx`);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "nombre",
        header: "Nombre",
        size: 200,
      },
      {
        accessorKey: "email",
        header: "Email",
        size: 200,
      },
      {
        accessorKey: "estado",
        header: "Estado",
        size: 120,
        Cell: ({ cell }) => (
          <Chip
            label={cell.getValue()}
            color={
              cell.getValue() === "Aceptado"
                ? "success"
                : cell.getValue() === "Pendiente"
                  ? "warning"
                  : "default"
            }
            size="small"
          />
        ),
      },
      {
        accessorKey: "grupo",
        header: "Grupo",
        size: 150,
      },
      {
        accessorKey: "rama",
        header: "Rama",
        size: 120,
      },
      {
        accessorKey: "pagado",
        header: "Pagado",
        size: 130,
        Cell: ({ row }) => {
          const pagadoValue = row.original.pagado;
          let displayValue = "";

          if (pagadoValue === true) {
            displayValue = "si";
          } else if (pagadoValue === false) {
            displayValue = "no";
          }

          return (
            <Select
              value={displayValue}
              onChange={(e) => handlePagadoChange(row.original.id, e.target.value)}
              size="small"
              displayEmpty
              sx={{
                fontFamily: "Poppins",
                minWidth: 100,
                fontSize: "0.875rem"
              }}
            >
              <MenuItem value="" disabled sx={{ fontFamily: "Poppins", fontStyle: "italic", color: "#999" }}>
                Seleccionar...
              </MenuItem>
              <MenuItem value="si" sx={{ fontFamily: "Poppins" }}>
                Sí
              </MenuItem>
              <MenuItem value="no" sx={{ fontFamily: "Poppins" }}>
                No
              </MenuItem>
            </Select>
          );
        },
      },
      {
        accessorKey: "cantidadArbolesMapeados",
        header: "Árboles Mapeados",
        size: 150,
        Cell: ({ row }) => {
          const cantidadFiltrada = row.original.cantidadArbolesMapeadosFiltrados;
          const cantidadTotal = row.original.cantidadArbolesMapeados || 0;
          const hayFiltro = fechaInicio || fechaFin;

          return (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
              }}
            >
              <Chip
                label={hayFiltro ? cantidadFiltrada : cantidadTotal}
                color="primary"
                size="small"
                sx={{ fontWeight: "bold" }}
              />
              {hayFiltro && cantidadFiltrada !== cantidadTotal && (
                <span style={{ fontSize: "12px", color: "#666" }}>
                  de {cantidadTotal}
                </span>
              )}
            </Box>
          );
        },
      },
      {
        accessorKey: "actions",
        header: "Ver Árboles",
        size: 150,
        enableSorting: false,
        Cell: ({ row }) => (
          <Button
            variant="outlined"
            size="small"
            startIcon={<VisibilityIcon />}
            onClick={() => handleViewTrees(row.original)}
            disabled={!row.original.cantidadArbolesMapeados}
            sx={{ fontFamily: "Poppins" }}
          >
            Ver ({row.original.cantidadArbolesMapeados || 0})
          </Button>
        ),
      },
    ],
    [fechaInicio, fechaFin]
  );

  return (
    <Box sx={{ maxWidth: "100%", overflow: "auto" }}>
      <FiltroFechas
        fechaInicio={fechaInicio}
        fechaFin={fechaFin}
        onFechaInicioChange={setFechaInicio}
        onFechaFinChange={setFechaFin}
        onLimpiar={onLimpiarFiltros}
        totalFiltrado={mapeadoresFiltrados.length}
        totalSinFiltrar={mapeadores.length}
      />
      <MaterialReactTable
        columns={columns}
        data={mapeadoresFiltrados}
        enableColumnResizing
        enableSorting
        enablePagination
        enableRowNumbers
        initialState={{
          density: "comfortable",
          sorting: [{ id: "cantidadArbolesMapeados", desc: true }],
        }}
        renderTopToolbarCustomActions={({ table }) => (
          <Button
            variant="contained"
            startIcon={<FileDownloadIcon />}
            onClick={() => handleExportToExcel(table)}
            sx={{
              fontFamily: "Poppins",
              backgroundColor: "#268576",
              "&:hover": {
                backgroundColor: "#1f6b5f",
              },
            }}
          >
            Exportar a Excel
          </Button>
        )}
        muiTableHeadCellProps={{
          sx: {
            fontFamily: "Poppins",
            fontWeight: "bold",
            backgroundColor: "#268576",
            color: "#fff",
          },
        }}
        muiTableBodyCellProps={{
          sx: {
            fontFamily: "Poppins",
          },
        }}
        muiTablePaperProps={{
          elevation: 2,
          sx: {
            borderRadius: "8px",
          },
        }}
        localization={{
          noRecordsToDisplay: "No hay mapeadores registrados",
          rowsPerPage: "Filas por página",
          of: "de",
        }}
      />

      {selectedMapper && (
        <TreeCardPopup
          open={treePopupOpen}
          onClose={handleClosePopup}
          trees={selectedMapper.arbolesMapeados || []}
          mapperName={selectedMapper.nombre}
        />
      )}
    </Box>
  );
};

export default TablaMapeo;
