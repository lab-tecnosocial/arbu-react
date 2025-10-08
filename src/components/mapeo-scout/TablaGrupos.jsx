import React, { useMemo, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import { Box, Button, Chip } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { useMapeoScout } from "../../context/MapeoScoutContext";
import FiltroFechas from "./FiltroFechas";
import * as XLSX from "xlsx";

const TablaGrupos = () => {
    const { mapeadores, arbolesMapeados } = useMapeoScout();
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");

    const handleLimpiarFiltros = () => {
        setFechaInicio("");
        setFechaFin("");
    };

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

    // Calcular total de grupos únicos (sin filtros)
    const totalGrupos = useMemo(() => {
        const grupos = {};
        mapeadores.forEach((mapeador) => {
            const key = `${mapeador.grupo || "Sin Grupo"}-${mapeador.rama || "Sin Rama"}`;
            grupos[key] = true;
        });
        return Object.keys(grupos).length;
    }, [mapeadores]);

    // Agrupar datos por Grupo y Rama con filtros aplicados
    const gruposData = useMemo(() => {
        const grupos = {};

        mapeadores.forEach((mapeador) => {
            const key = `${mapeador.grupo || "Sin Grupo"}-${mapeador.rama || "Sin Rama"}`;

            // Contar árboles filtrados para este mapeador
            const arbolesDelMapeador = arbolesFiltrados.filter(
                (arbol) => arbol.mapeadoPor === mapeador.id
            ).length;

            // Contar árboles totales
            const arbolesTotales = arbolesMapeados.filter(
                (arbol) => arbol.mapeadoPor === mapeador.id
            ).length;

            if (!grupos[key]) {
                grupos[key] = {
                    grupo: mapeador.grupo || "Sin Grupo",
                    rama: mapeador.rama || "Sin Rama",
                    totalParticipantes: 0,
                    totalArbolesMapeados: 0,
                    totalArbolesMapeadosFiltrados: 0,
                };
            }

            grupos[key].totalParticipantes += 1;
            grupos[key].totalArbolesMapeados += arbolesTotales;
            grupos[key].totalArbolesMapeadosFiltrados += arbolesDelMapeador;
        });

        return Object.values(grupos);
    }, [mapeadores, arbolesFiltrados, arbolesMapeados]);

    const handleExportToExcel = (table) => {
        // Exportar TODAS las filas (pre-paginadas) con filtros y ordenamiento aplicados
        const rows = table.getPrePaginationRowModel().rows;
        const dataToExport = rows.map((row) => ({
            Grupo: row.original.grupo,
            Rama: row.original.rama,
            "Total Participantes": row.original.totalParticipantes,
            "Total Árboles Mapeados": fechaInicio || fechaFin
                ? row.original.totalArbolesMapeadosFiltrados
                : row.original.totalArbolesMapeados,
        }));

        // Crear workbook y worksheet
        const ws = XLSX.utils.json_to_sheet(dataToExport);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Grupos");

        // Generar archivo
        const fecha = new Date().toISOString().split("T")[0];
        XLSX.writeFile(wb, `Mapeo_Grupos_${fecha}.xlsx`);
    };

    const columns = useMemo(
        () => [
            {
                accessorKey: "grupo",
                header: "Grupo",
                size: 250,
            },
            {
                accessorKey: "rama",
                header: "Rama",
                size: 200,
            },
            {
                accessorKey: "totalParticipantes",
                header: "Total Participantes",
                size: 180,
                Cell: ({ cell }) => (
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Chip
                            label={cell.getValue()}
                            color="secondary"
                            size="small"
                            sx={{ fontWeight: "bold" }}
                        />
                    </Box>
                ),
            },
            {
                accessorKey: "totalArbolesMapeados",
                header: "Total Árboles Mapeados",
                size: 200,
                Cell: ({ row }) => {
                    const cantidadFiltrada = row.original.totalArbolesMapeadosFiltrados;
                    const cantidadTotal = row.original.totalArbolesMapeados;
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
                onLimpiar={handleLimpiarFiltros}
                totalFiltrado={gruposData.length}
                totalSinFiltrar={totalGrupos}
            />
            <MaterialReactTable
                columns={columns}
                data={gruposData}
                enableColumnResizing
                enableSorting
                enablePagination
                enableRowNumbers
                initialState={{
                    density: "comfortable",
                    sorting: [{ id: "totalArbolesMapeados", desc: true }],
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
                    noRecordsToDisplay: "No hay grupos registrados",
                    rowsPerPage: "Filas por página",
                    of: "de",
                }}
            />
        </Box>
    );
};

export default TablaGrupos;
