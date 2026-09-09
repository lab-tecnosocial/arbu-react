import React, { useMemo } from "react";
import { MaterialReactTable } from "material-react-table";
import { Box, Button, Link, Chip } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import * as XLSX from "xlsx";

// Reutilizar funciones helper
const convertTimestamp = (timestamp) => {
    if (!timestamp) return null;
    if (timestamp.seconds) {
        return new Date(timestamp.seconds * 1000);
    }
    return new Date(timestamp);
};

const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = convertTimestamp(timestamp);
    if (!date || isNaN(date)) return "N/A";
    return date.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const TablaArbolesProyecto = ({ arboles, mapeadoresMap }) => {
    // Preparar datos
    const arbolesData = useMemo(() => {
        return arboles.map((arbol) => {
            const mapper = mapeadoresMap[arbol.mapeadoPor] || {};

            // Obtener el primer monitoreo
            let timestamp = null;
            let altura = null;
            let diametroAlturaPecho = null;

            if (arbol.monitoreos && typeof arbol.monitoreos === 'object') {
                const monitoreoKeys = Object.keys(arbol.monitoreos);
                if (monitoreoKeys.length > 0) {
                    const primerMonitoreo = arbol.monitoreos[monitoreoKeys[0]];
                    timestamp = primerMonitoreo?.timestamp || null;
                    altura = primerMonitoreo?.altura || null;
                    diametroAlturaPecho = primerMonitoreo?.diametroAlturaPecho || null;
                }
            }

            return {
                ...arbol,
                timestamp: timestamp,
                altura: altura,
                diametroAlturaPecho: diametroAlturaPecho,
                mapperNombre: mapper.nombre || "N/A",
                mapperEmail: mapper.email || "N/A",
                mapperGrupo: mapper.grupo || "N/A",
                mapperRama: mapper.rama || "N/A",
                fechaMapeado: convertTimestamp(timestamp),
            };
        });
    }, [arboles, mapeadoresMap]);

    const handleExportToExcel = (table) => {
        const rows = table.getPrePaginationRowModel().rows;
        const dataToExport = rows.map((row) => {
            const arbol = row.original;
            const monitoreos = arbol.monitoreos;
            let monitoreo = null;
            if (monitoreos && typeof monitoreos === 'object') {
                const monitoreoKeys = Object.keys(monitoreos);
                if (monitoreoKeys.length > 0) {
                    monitoreo = monitoreos[monitoreoKeys[0]];
                }
            }

            return {
                "Nombre del Árbol": arbol.nombrePropio || "",
                "Nombre Común": arbol.nombreComun || "",
                "Nombre Científico": arbol.nombreCientifico || "",
                "Lugar de Plantación": arbol.lugarDePlantacion || "",
                Proyecto: arbol.proyecto || "",
                "Altura (m)": arbol.altura || "",
                "DAP (cm)": arbol.diametroAlturaPecho || "",
                Latitud: arbol.latitud || "",
                Longitud: arbol.longitud || "",
                "Fecha de Mapeo": arbol.timestamp ? formatDate(arbol.timestamp) : "",
                "Mapeador - Nombre": arbol.mapperNombre,
                "Mapeador - Email": arbol.mapperEmail,
                "Mapeador - Grupo": arbol.mapperGrupo,
                "Mapeador - Rama": arbol.mapperRama,
                "Foto Árbol Completo": monitoreo?.fotoArbolCompleto || "",
                "Foto Corteza": monitoreo?.fotoCorteza || "",
                "Foto Flor": monitoreo?.fotoFlor || "",
                "Foto Hoja": monitoreo?.fotoHoja || "",
                "Foto Raíz": monitoreo?.fotoRaiz || "",
            };
        });

        const ws = XLSX.utils.json_to_sheet(dataToExport);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Árboles del Proyecto");

        const fecha = new Date().toISOString().split("T")[0];
        XLSX.writeFile(wb, `Arboles_Proyecto_${fecha}.xlsx`);
    };

    const columns = useMemo(
        () => [
            {
                accessorKey: "nombrePropio",
                header: "Nombre del Árbol",
                size: 150,
                Cell: ({ cell }) => cell.getValue() || <em style={{ color: "#999" }}>Sin nombre</em>,
            },
            {
                accessorKey: "nombreComun",
                header: "Nombre Común",
                size: 150,
            },
            {
                accessorKey: "nombreCientifico",
                header: "Nombre Científico",
                size: 180,
                Cell: ({ cell }) => (
                    <span style={{ fontStyle: "italic" }}>{cell.getValue() || "-"}</span>
                ),
            },
            {
                accessorKey: "lugarDePlantacion",
                header: "Lugar",
                size: 120,
            },
            {
                accessorKey: "proyecto",
                header: "Proyecto",
                size: 120,
            },
            {
                accessorKey: "altura",
                header: "Altura (m)",
                size: 100,
                Cell: ({ cell }) => {
                    const val = cell.getValue();
                    return val ? `${val} m` : "-";
                },
            },
            {
                accessorKey: "diametroAlturaPecho",
                header: "DAP (cm)",
                size: 100,
                Cell: ({ cell }) => {
                    const val = cell.getValue();
                    return val ? `${val} cm` : "-";
                },
            },
            {
                accessorKey: "timestamp",
                header: "Fecha de Mapeo",
                size: 150,
                Cell: ({ cell }) => {
                    const val = cell.getValue();
                    return val ? formatDate(val) : "N/A";
                },
            },
            {
                accessorKey: "mapperNombre",
                header: "Mapeador",
                size: 180,
            },
            {
                accessorKey: "mapperEmail",
                header: "Email Mapeador",
                size: 200,
            },
            {
                accessorKey: "ubicacion",
                header: "Ubicación",
                size: 150,
                enableSorting: false,
                Cell: ({ row }) => {
                    const { latitud, longitud } = row.original;
                    if (!latitud || !longitud) return "-";

                    const mapsUrl = `https://www.google.com/maps?q=${latitud},${longitud}`;
                    return (
                        <Link
                            href={mapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                                textDecoration: "none",
                                color: "#268576",
                                "&:hover": {
                                    textDecoration: "underline",
                                },
                            }}
                        >
                            <OpenInNewIcon sx={{ fontSize: 14 }} />
                            Ver en mapa
                        </Link>
                    );
                },
            },
        ],
        []
    );

    return (
        <Box sx={{ maxWidth: "100%", overflow: "auto" }}>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    mb: 2,
                }}
            >
                <Chip
                    label={`${arbolesData.length} árbol${arbolesData.length !== 1 ? "es" : ""} en el proyecto`}
                    color="success"
                    sx={{ fontFamily: "Poppins", fontWeight: "bold" }}
                />
            </Box>
            <MaterialReactTable
                columns={columns}
                data={arbolesData}
                enableColumnResizing
                enableSorting
                enablePagination
                enableRowNumbers
                enableRowVirtualization
                muiTableContainerProps={{ sx: { maxHeight: '600px' } }}
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
                initialState={{
                    density: "compact",
                    pagination: { pageSize: 20, pageIndex: 0 },
                }}
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
                state={{
                    isLoading: false,
                }}
                localization={{
                    noRecordsToDisplay: "No hay árboles en este proyecto",
                    rowsPerPage: "Filas por página",
                    of: "de",
                }}
            />
        </Box>
    );
};

export default TablaArbolesProyecto;
