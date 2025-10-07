import React, { useMemo } from "react";
import { MaterialReactTable } from "material-react-table";
import { Box, Button, Chip } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { useMapeoScout } from "../../context/MapeoScoutContext";
import * as XLSX from "xlsx";

const TablaGrupos = () => {
    const { mapeadores } = useMapeoScout();

    // Agrupar datos por Grupo y Rama
    const gruposData = useMemo(() => {
        const grupos = {};

        mapeadores.forEach((mapeador) => {
            const key = `${mapeador.grupo || "Sin Grupo"}-${mapeador.rama || "Sin Rama"}`;

            if (!grupos[key]) {
                grupos[key] = {
                    grupo: mapeador.grupo || "Sin Grupo",
                    rama: mapeador.rama || "Sin Rama",
                    totalParticipantes: 0,
                    totalArbolesMapeados: 0,
                };
            }

            grupos[key].totalParticipantes += 1;
            grupos[key].totalArbolesMapeados += mapeador.cantidadArbolesMapeados || 0;
        });

        return Object.values(grupos);
    }, [mapeadores]);

    const handleExportToExcel = () => {
        // Preparar datos para exportar
        const dataToExport = gruposData.map((grupo) => ({
            Grupo: grupo.grupo,
            Rama: grupo.rama,
            "Total Participantes": grupo.totalParticipantes,
            "Total Árboles Mapeados": grupo.totalArbolesMapeados,
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
                            color="primary"
                            size="small"
                            sx={{ fontWeight: "bold" }}
                        />
                    </Box>
                ),
            },
        ],
        []
    );

    return (
        <Box sx={{ maxWidth: "100%", overflow: "auto" }}>
            <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
                <Button
                    variant="contained"
                    startIcon={<FileDownloadIcon />}
                    onClick={handleExportToExcel}
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
            </Box>
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
