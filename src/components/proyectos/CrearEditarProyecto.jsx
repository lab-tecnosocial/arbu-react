import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Alert,
  CircularProgress,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import SelectorMapeadores from "./SelectorMapeadores";
import { useProyectos } from "../../context/ProyectosContext";

const CrearEditarProyecto = ({ open, onClose, proyecto = null }) => {
  const { crear, actualizar } = useProyectos();
  const [formData, setFormData] = useState({
    nombreProyecto: "",
    fechaInicio: "",
    fechaFin: "",
  });
  const [mapeadoresSeleccionados, setMapeadoresSeleccionados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const esEdicion = !!proyecto;

  // Cargar datos del proyecto si es edición
  useEffect(() => {
    if (proyecto) {
      // Convertir timestamps de Firebase a formato de fecha
      const formatDate = (timestamp) => {
        if (!timestamp) return "";
        let date;
        if (timestamp.seconds) {
          date = new Date(timestamp.seconds * 1000);
        } else {
          date = new Date(timestamp);
        }
        return date.toISOString().split("T")[0];
      };

      setFormData({
        nombreProyecto: proyecto.nombreProyecto || "",
        fechaInicio: formatDate(proyecto.fechaInicio),
        fechaFin: formatDate(proyecto.fechaFin),
      });

      // Cargar mapeadores (convertir IDs a objetos con datos mínimos)
      if (proyecto.idMapeadores && proyecto.idMapeadores.length > 0) {
        // Los IDs en este caso son document IDs de inscripcionesMapeo
        const mapeadores = proyecto.idMapeadores.map((id) => ({
          id: id,
          email: id, // Por defecto usar el ID como email temporalmente
          nombre: "", // Se puede actualizar con el botón "Actualizar datos"
        }));
        setMapeadoresSeleccionados(mapeadores);
      }
    } else {
      // Resetear formulario
      setFormData({
        nombreProyecto: "",
        fechaInicio: "",
        fechaFin: "",
      });
      setMapeadoresSeleccionados([]);
    }

    setError(null);
    setSuccess(false);
  }, [proyecto, open]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    // Validaciones
    if (!formData.nombreProyecto.trim()) {
      setError("El nombre del proyecto es requerido");
      setLoading(false);
      return;
    }

    if (!formData.fechaInicio || !formData.fechaFin) {
      setError("Las fechas de inicio y fin son requeridas");
      setLoading(false);
      return;
    }

    const fechaInicio = new Date(formData.fechaInicio);
    const fechaFin = new Date(formData.fechaFin);

    if (fechaFin < fechaInicio) {
      setError("La fecha de fin debe ser posterior a la fecha de inicio");
      setLoading(false);
      return;
    }

    // Preparar datos
    const datosProyecto = {
      nombreProyecto: formData.nombreProyecto.trim(),
      fechaInicio: formData.fechaInicio,
      fechaFin: formData.fechaFin,
      idMapeadores: mapeadoresSeleccionados.map((m) => m.id),
    };

    try {
      let result;
      if (esEdicion) {
        result = await actualizar(proyecto.id, datosProyecto);
      } else {
        result = await crear(datosProyecto);
      }

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          onClose(true); // true indica que se guardó con éxito
        }, 1000);
      } else {
        setError(result.error || "Error al guardar el proyecto");
      }
    } catch (err) {
      setError(err.message || "Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    onClose(false);
  };

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontFamily: "Poppins", fontWeight: "bold", backgroundColor: "#268576", color: "#fff" }}>
        {esEdicion ? "Editar Proyecto" : "Crear Nuevo Proyecto"}
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        <Box component="form" onSubmit={handleSubmit}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {esEdicion ? "Proyecto actualizado con éxito" : "Proyecto creado con éxito"}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Nombre del Proyecto"
            name="nombreProyecto"
            value={formData.nombreProyecto}
            onChange={handleChange}
            required
            sx={{ mb: 2 }}
            InputLabelProps={{
              sx: { fontFamily: "Poppins" },
            }}
            inputProps={{
              sx: { fontFamily: "Poppins" },
            }}
          />

          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              label="Fecha de Inicio"
              name="fechaInicio"
              type="date"
              value={formData.fechaInicio}
              onChange={handleChange}
              required
              InputLabelProps={{
                shrink: true,
                sx: { fontFamily: "Poppins" },
              }}
              inputProps={{
                sx: { fontFamily: "Poppins" },
              }}
            />

            <TextField
              fullWidth
              label="Fecha de Fin"
              name="fechaFin"
              type="date"
              value={formData.fechaFin}
              onChange={handleChange}
              required
              InputLabelProps={{
                shrink: true,
                sx: { fontFamily: "Poppins" },
              }}
              inputProps={{
                sx: { fontFamily: "Poppins" },
              }}
            />
          </Box>

          <SelectorMapeadores
            mapeadoresSeleccionados={mapeadoresSeleccionados}
            onMapeadoresChange={setMapeadoresSeleccionados}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={handleCancel}
          startIcon={<CancelIcon />}
          disabled={loading}
          sx={{ fontFamily: "Poppins" }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          startIcon={loading ? <CircularProgress size={16} /> : <SaveIcon />}
          disabled={loading}
          sx={{
            fontFamily: "Poppins",
            backgroundColor: "#268576",
            "&:hover": {
              backgroundColor: "#1f6b5f",
            },
          }}
        >
          {loading ? "Guardando..." : esEdicion ? "Actualizar" : "Crear"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CrearEditarProyecto;
