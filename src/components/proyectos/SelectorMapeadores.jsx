import React, { useState } from "react";
import {
  Box,
  TextField,
  Autocomplete,
  Chip,
  Button,
  Alert,
  CircularProgress,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import { buscarMapeadorPorEmail } from "../../helpers/proyectoOperations";

const SelectorMapeadores = ({ mapeadoresSeleccionados, onMapeadoresChange }) => {
  const [inputValue, setInputValue] = useState("");
  const [opciones, setOpciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actualizando, setActualizando] = useState(false);

  // Buscar mapeadores por email
  const handleBuscar = async (valor) => {
    setInputValue(valor);

    if (!valor || valor.trim().length < 3) {
      setOpciones([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const resultados = await buscarMapeadorPorEmail(valor);
      setOpciones(resultados);
    } catch (err) {
      console.error("Error al buscar mapeadores:", err);
      setError("Error al buscar mapeadores");
    } finally {
      setLoading(false);
    }
  };

  // Agregar mapeador seleccionado
  const handleAgregar = (event, nuevoValor) => {
    if (!nuevoValor) return;

    // Verificar si ya está agregado
    const yaExiste = mapeadoresSeleccionados.some(
      (m) => m.id === nuevoValor.id
    );

    if (!yaExiste) {
      const nuevosM = [...mapeadoresSeleccionados, nuevoValor];
      onMapeadoresChange(nuevosM);
    }

    // Limpiar búsqueda
    setInputValue("");
    setOpciones([]);
  };

  // Eliminar mapeador
  const handleEliminar = (mapeadorId) => {
    const nuevosM = mapeadoresSeleccionados.filter((m) => m.id !== mapeadorId);
    onMapeadoresChange(nuevosM);
  };

  // Actualizar datos de mapeadores
  const handleActualizarDatos = async () => {
    setActualizando(true);
    setError(null);

    try {
      // Buscar cada mapeador por su ID para obtener datos actualizados
      const mapeadoresActualizados = await Promise.all(
        mapeadoresSeleccionados.map(async (mapeador) => {
          try {
            // Re-buscar por email para obtener datos frescos
            const resultados = await buscarMapeadorPorEmail(mapeador.email);
            const encontrado = resultados.find((r) => r.id === mapeador.id);
            return encontrado || mapeador; // Si no se encuentra, mantener el original
          } catch (err) {
            console.error(`Error al actualizar mapeador ${mapeador.id}:`, err);
            return mapeador; // En caso de error, mantener el original
          }
        })
      );

      onMapeadoresChange(mapeadoresActualizados);
    } catch (err) {
      console.error("Error al actualizar datos:", err);
      setError("Error al actualizar datos de mapeadores");
    } finally {
      setActualizando(false);
    }
  };

  return (
    <Box>
      <Typography variant="subtitle1" sx={{ mb: 1, fontFamily: "Poppins", fontWeight: "bold" }}>
        Mapeadores del Proyecto
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Buscador de mapeadores */}
      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
        <Autocomplete
          fullWidth
          options={opciones}
          getOptionLabel={(option) =>
            option.email
              ? `${option.nombre || "Sin nombre"} (${option.email})`
              : "Sin email"
          }
          inputValue={inputValue}
          onInputChange={(event, newValue) => handleBuscar(newValue)}
          onChange={handleAgregar}
          loading={loading}
          noOptionsText={
            inputValue.length < 3
              ? "Escribe al menos 3 caracteres"
              : "No se encontraron mapeadores"
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Buscar mapeador por email"
              placeholder="Escribe el email del mapeador..."
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
                sx: { fontFamily: "Poppins" },
              }}
              InputLabelProps={{
                sx: { fontFamily: "Poppins" },
              }}
            />
          )}
          renderOption={(props, option) => (
            <li {...props}>
              <Box>
                <Typography sx={{ fontFamily: "Poppins", fontWeight: "bold" }}>
                  {option.nombre || "Sin nombre"}
                </Typography>
                <Typography variant="caption" sx={{ fontFamily: "Poppins", color: "#666" }}>
                  {option.email || "Sin email"}
                  {option.grupo && ` - ${option.grupo}`}
                  {option.rama && ` - ${option.rama}`}
                </Typography>
              </Box>
            </li>
          )}
        />

        <Button
          variant="outlined"
          startIcon={actualizando ? <CircularProgress size={16} /> : <RefreshIcon />}
          onClick={handleActualizarDatos}
          disabled={mapeadoresSeleccionados.length === 0 || actualizando}
          sx={{
            fontFamily: "Poppins",
            minWidth: "200px",
            borderColor: "#268576",
            color: "#268576",
            "&:hover": {
              borderColor: "#1f6b5f",
              backgroundColor: "#e8f5f3",
            },
          }}
        >
          Actualizar Datos
        </Button>
      </Box>

      {/* Lista de mapeadores seleccionados */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
        {mapeadoresSeleccionados.length === 0 ? (
          <Typography variant="body2" sx={{ fontFamily: "Poppins", color: "#666", fontStyle: "italic" }}>
            No hay mapeadores seleccionados. Busca y agrega mapeadores al proyecto.
          </Typography>
        ) : (
          mapeadoresSeleccionados.map((mapeador) => (
            <Chip
              key={mapeador.id}
              label={
                mapeador.nombre
                  ? `${mapeador.nombre} (${mapeador.email})`
                  : `${mapeador.email} - Sin datos`
              }
              onDelete={() => handleEliminar(mapeador.id)}
              color={mapeador.nombre ? "primary" : "default"}
              sx={{ fontFamily: "Poppins" }}
            />
          ))
        )}
      </Box>

      <Typography variant="caption" sx={{ display: "block", mt: 1, fontFamily: "Poppins", color: "#666" }}>
        Total de mapeadores: {mapeadoresSeleccionados.length}
      </Typography>
    </Box>
  );
};

export default SelectorMapeadores;
