import React from "react";
import { Box, TextField, Button, Chip } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import ClearIcon from "@mui/icons-material/Clear";

const FiltroFechas = ({ fechaInicio, fechaFin, onFechaInicioChange, onFechaFinChange, onLimpiar, totalFiltrado, totalSinFiltrar }) => {
    const hayFiltro = fechaInicio || fechaFin;

    return (
        <Box
            sx={{
                display: "flex",
                gap: 2,
                mb: 2,
                flexWrap: "wrap",
                alignItems: "center",
                backgroundColor: "#f5f5f5",
                padding: 2,
                borderRadius: 2,
            }}
        >
            <FilterListIcon sx={{ color: "#268576" }} />

            <TextField
                label="Fecha Inicio"
                type="date"
                value={fechaInicio}
                onChange={(e) => onFechaInicioChange(e.target.value)}
                InputLabelProps={{
                    shrink: true,
                    sx: { fontFamily: "Poppins" },
                }}
                inputProps={{
                    sx: { fontFamily: "Poppins" },
                }}
                sx={{
                    backgroundColor: "#fff",
                    borderRadius: 1,
                    minWidth: 180,
                }}
            />

            <TextField
                label="Fecha Fin"
                type="date"
                value={fechaFin}
                onChange={(e) => onFechaFinChange(e.target.value)}
                InputLabelProps={{
                    shrink: true,
                    sx: { fontFamily: "Poppins" },
                }}
                inputProps={{
                    sx: { fontFamily: "Poppins" },
                }}
                sx={{
                    backgroundColor: "#fff",
                    borderRadius: 1,
                    minWidth: 180,
                }}
            />

            {(fechaInicio || fechaFin) && (
                <Button
                    variant="outlined"
                    startIcon={<ClearIcon />}
                    onClick={onLimpiar}
                    sx={{
                        fontFamily: "Poppins",
                        borderColor: "#e74c3c",
                        color: "#e74c3c",
                        "&:hover": {
                            borderColor: "#c0392b",
                            backgroundColor: "#ffebee",
                        },
                    }}
                >
                    Limpiar Filtros
                </Button>
            )}

            <Chip
                label={
                    hayFiltro && totalFiltrado !== totalSinFiltrar
                        ? `${totalFiltrado} de ${totalSinFiltrar} registro${totalSinFiltrar !== 1 ? "s" : ""}`
                        : `${totalSinFiltrar || totalFiltrado} registro${(totalSinFiltrar || totalFiltrado) !== 1 ? "s" : ""}`
                }
                color="primary"
                sx={{ fontFamily: "Poppins", fontWeight: "bold", ml: "auto" }}
            />
        </Box>
    );
};

export default FiltroFechas;
