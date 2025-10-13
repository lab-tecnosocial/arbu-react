import React, { useMemo, useState, useEffect } from "react";
import { MaterialReactTable } from "material-react-table";
import { Box, Button, Link, Chip, Select, MenuItem } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { useMapeoScout } from "../../context/MapeoScoutContext";
import FiltroFechas from "./FiltroFechas";
import { db } from "../../firebase/firebase-config";
import * as XLSX from "xlsx";

// Funciones helper fuera del componente para evitar re-creación
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

const TablaArboles = ({ fechaInicio, fechaFin, setFechaInicio, setFechaFin, onLimpiarFiltros }) => {
    const { arbolesMapeados: arbolesMapeadosOriginal, mapeadores } = useMapeoScout();
    const [arbolesMapeados, setArbolesMapeados] = useState(arbolesMapeadosOriginal);

    // Actualizar arbolesMapeados cuando cambie arbolesMapeadosOriginal
    useEffect(() => {
        setArbolesMapeados(arbolesMapeadosOriginal);
    }, [arbolesMapeadosOriginal]);

    // Crear un mapa de mapeadores por ID
    const mapeadoresMap = useMemo(() => {
        const map = {};
        mapeadores.forEach((mapper) => {
            map[mapper.id] = mapper;
        });
        return map;
    }, [mapeadores]);

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

    // Preparar datos con filtros aplicados
    const arbolesData = useMemo(() => {
        console.log("TablaArboles - arbolesMapeados:", arbolesMapeados.length);
        console.log("TablaArboles - arbolesFiltrados:", arbolesFiltrados.length);
        console.log("TablaArboles - primer árbol:", arbolesMapeados[0]);

        const processedData = arbolesFiltrados.map((arbol) => {
            const mapper = mapeadoresMap[arbol.mapeadoPor] || {};

            // Obtener el primer monitoreo para extraer timestamp, altura y DAP
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


        return processedData;
    }, [arbolesFiltrados, mapeadoresMap]);

    const handleValidadoChange = async (arbolId, newValue) => {
        try {
            const validadoBoolean = newValue === "si";

            // Actualizar estado local inmediatamente para mejor UX
            setArbolesMapeados(prevArboles =>
                prevArboles.map(arbol =>
                    arbol.id === arbolId
                        ? { ...arbol, validado: validadoBoolean }
                        : arbol
                )
            );

            // Actualizar en Firestore en segundo plano
            await db.collection("arbolesMapeados").doc(arbolId).update({
                validado: validadoBoolean
            });
        } catch (error) {
            console.error("Error actualizando campo validado:", error);
            alert("Error al actualizar el campo. Por favor, intenta nuevamente.");
            // Revertir cambio local en caso de error
            setArbolesMapeados(arbolesMapeadosOriginal);
        }
    };

    const handleExportToExcel = (table) => {
        // Exportar TODAS las filas (pre-paginadas) con ordenamiento aplicado
        const rows = table.getPrePaginationRowModel().rows;
        const dataToExport = rows.map((row) => {
            const arbol = row.original;
            // Obtener el primer monitoreo si existe
            const monitoreos = arbol.monitoreos;
            let monitoreo = null;
            if (monitoreos && typeof monitoreos === 'object') {
                const monitoreoKeys = Object.keys(monitoreos);
                if (monitoreoKeys.length > 0) {
                    monitoreo = monitoreos[monitoreoKeys[0]];
                }
            }

            // Obtener valor de validado
            const validadoValue = arbol.validado;
            let validadoText = "";
            if (validadoValue === true) validadoText = "Sí";
            else if (validadoValue === false) validadoText = "No";

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
                Validado: validadoText,
                "Foto Árbol Completo": monitoreo?.fotoArbolCompleto || "",
                "Foto Corteza": monitoreo?.fotoCorteza || "",
                "Foto Flor": monitoreo?.fotoFlor || "",
                "Foto Hoja": monitoreo?.fotoHoja || "",
                "Foto Raíz": monitoreo?.fotoRaiz || "",
            };
        });

        const ws = XLSX.utils.json_to_sheet(dataToExport);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Árboles Mapeados");

        const fecha = new Date().toISOString().split("T")[0];
        XLSX.writeFile(wb, `Arboles_Mapeados_${fecha}.xlsx`);
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
                accessorKey: "mapperGrupo",
                header: "Grupo",
                size: 150,
            },
            {
                accessorKey: "mapperRama",
                header: "Rama",
                size: 120,
            },
            {
                accessorKey: "validado",
                header: "Validado",
                size: 130,
                Cell: ({ row }) => {
                    const validadoValue = row.original.validado;
                    let displayValue = "";

                    if (validadoValue === true) {
                        displayValue = "si";
                    } else if (validadoValue === false) {
                        displayValue = "no";
                    }

                    return (
                        <Select
                            value={displayValue}
                            onChange={(e) => handleValidadoChange(row.original.id, e.target.value)}
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
                accessorKey: "fotos",
                header: "Fotos",
                size: 200,
                enableSorting: false,
                Cell: ({ row }) => {
                    const monitoreos = row.original.monitoreos;
                    if (!monitoreos || typeof monitoreos !== 'object') {
                        return <span style={{ color: "#999" }}>Sin fotos</span>;
                    }

                    const monitoreoKeys = Object.keys(monitoreos);
                    if (monitoreoKeys.length === 0) {
                        return <span style={{ color: "#999" }}>Sin fotos</span>;
                    }

                    const monitoreo = monitoreos[monitoreoKeys[0]];
                    if (!monitoreo) {
                        return <span style={{ color: "#999" }}>Sin fotos</span>;
                    }

                    const fotos = [
                        { label: "Árbol", url: monitoreo.fotoArbolCompleto },
                        { label: "Corteza", url: monitoreo.fotoCorteza },
                        { label: "Flor", url: monitoreo.fotoFlor },
                        { label: "Hoja", url: monitoreo.fotoHoja },
                        { label: "Raíz", url: monitoreo.fotoRaiz },
                    ].filter((f) => f.url);

                    if (fotos.length === 0) {
                        return <span style={{ color: "#999" }}>Sin fotos</span>;
                    }

                    return (
                        <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                            {fotos.map((foto, idx) => (
                                <Link
                                    key={idx}
                                    href={foto.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 0.5,
                                        fontSize: "12px",
                                        textDecoration: "none",
                                        color: "#268576",
                                        "&:hover": {
                                            textDecoration: "underline",
                                        },
                                    }}
                                >
                                    <OpenInNewIcon sx={{ fontSize: 14 }} />
                                    {foto.label}
                                </Link>
                            ))}
                        </Box>
                    );
                },
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
            <FiltroFechas
                fechaInicio={fechaInicio}
                fechaFin={fechaFin}
                onFechaInicioChange={setFechaInicio}
                onFechaFinChange={setFechaFin}
                onLimpiar={onLimpiarFiltros}
                totalFiltrado={arbolesData.length}
                totalSinFiltrar={arbolesMapeados.length}
            />
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
                    showProgressBars: false,
                }}
                localization={{
                    noRecordsToDisplay: "No hay árboles registrados",
                    rowsPerPage: "Filas por página",
                    of: "de",
                }}
            />
        </Box>
    );
};

export default TablaArboles;
