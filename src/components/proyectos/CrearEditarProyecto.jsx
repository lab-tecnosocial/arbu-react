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
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  Typography,
  Divider,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import SelectorMapeadores from "./SelectorMapeadores";
import { useProyectos } from "../../context/ProyectosContext";
import {
  PARTICIPACION,
  REGLAS_CONCURSO_PRIMAVERA,
  TIPO_CAMPANIA,
  slugify,
} from "../../helpers/campanias/campaniaModel";
import { CODIGOS_METROPOLITANOS_CBBA } from "../../helpers/geo/municipios";
import { toInputDate } from "../../helpers/fechaArbol";

const CrearEditarProyecto = ({ open, onClose, proyecto = null }) => {
  const { crear, actualizar } = useProyectos();
  const [formData, setFormData] = useState({
    nombreProyecto: "",
    fechaInicio: "",
    fechaFin: "",
    tipo: TIPO_CAMPANIA.PROYECTO,
    descripcion: "",
    publica: false,
    destacada: false,
    participacion: PARTICIPACION.MAPEADORES,
    soloJacaranda: false,
    restringirMunicipios: false,
  });
  const [mapeadoresSeleccionados, setMapeadoresSeleccionados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const esEdicion = !!proyecto;

  // Cargar datos del proyecto si es edición
  useEffect(() => {
    if (proyecto) {
      setFormData({
        nombreProyecto: proyecto.nombreProyecto || proyecto.nombre || "",
        fechaInicio: toInputDate(proyecto.fechaInicio),
        fechaFin: toInputDate(proyecto.fechaFin),
        tipo: proyecto.tipo || TIPO_CAMPANIA.PROYECTO,
        descripcion: proyecto.descripcion || "",
        publica: proyecto.publica === true,
        destacada: proyecto.destacada === true,
        participacion: proyecto.participacion || PARTICIPACION.MAPEADORES,
        soloJacaranda: Boolean(proyecto.reglas?.especies),
        restringirMunicipios: Boolean(proyecto.reglas?.municipios?.length),
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
        tipo: TIPO_CAMPANIA.PROYECTO,
        descripcion: "",
        publica: false,
        destacada: false,
        participacion: PARTICIPACION.MAPEADORES,
        soloJacaranda: false,
        restringirMunicipios: false,
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

    // Preparar datos. schemaVersion 2 activa la semántica corregida de fechas
    // (cuenta cualquier monitoreo en ventana); los documentos sin él conservan
    // la de antes, para no mover los números de los proyectos ya existentes.
    const datosProyecto = {
      nombreProyecto: formData.nombreProyecto.trim(),
      fechaInicio: formData.fechaInicio,
      fechaFin: formData.fechaFin,
      idMapeadores:
        formData.participacion === PARTICIPACION.MAPEADORES
          ? mapeadoresSeleccionados.map((m) => m.id)
          : [],
      schemaVersion: 2,
      slug: slugify(formData.nombreProyecto),
      tipo: formData.tipo,
      descripcion: formData.descripcion.trim(),
      publica: formData.publica,
      destacada: formData.destacada,
      participacion: formData.participacion,
      reglas: {
        criterioFecha: REGLAS_CONCURSO_PRIMAVERA.criterioFecha,
        especies: formData.soloJacaranda ? REGLAS_CONCURSO_PRIMAVERA.especies : null,
        municipios: formData.restringirMunicipios ? CODIGOS_METROPOLITANOS_CBBA : null,
        fotos: formData.soloJacaranda ? REGLAS_CONCURSO_PRIMAVERA.fotos : null,
        requiereUbicacion: true,
        revisionHumana: formData.tipo === TIPO_CAMPANIA.CONCURSO,
        criterioDesempate1: REGLAS_CONCURSO_PRIMAVERA.criterioDesempate1,
      },
      iconoMarcador: formData.soloJacaranda ? "/jacaranda.png" : null,
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

          <TextField
            fullWidth
            label="Descripción"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            multiline
            rows={2}
            sx={{ mb: 2 }}
            InputLabelProps={{ sx: { fontFamily: "Poppins" } }}
          />

          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <FormControl fullWidth>
              <InputLabel sx={{ fontFamily: "Poppins" }}>Tipo</InputLabel>
              <Select
                label="Tipo"
                name="tipo"
                value={formData.tipo}
                onChange={handleChange}
                sx={{ fontFamily: "Poppins" }}
              >
                <MenuItem value={TIPO_CAMPANIA.PROYECTO} sx={{ fontFamily: "Poppins" }}>Proyecto</MenuItem>
                <MenuItem value={TIPO_CAMPANIA.CAMPANIA} sx={{ fontFamily: "Poppins" }}>Campaña</MenuItem>
                <MenuItem value={TIPO_CAMPANIA.CONCURSO} sx={{ fontFamily: "Poppins" }}>Concurso</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel sx={{ fontFamily: "Poppins" }}>Participación</InputLabel>
              <Select
                label="Participación"
                name="participacion"
                value={formData.participacion}
                onChange={handleChange}
                sx={{ fontFamily: "Poppins" }}
              >
                <MenuItem value={PARTICIPACION.MAPEADORES} sx={{ fontFamily: "Poppins" }}>
                  Solo mapeadores inscritos
                </MenuItem>
                <MenuItem value={PARTICIPACION.ABIERTO} sx={{ fontFamily: "Poppins" }}>
                  Abierta a cualquiera con la app
                </MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 1 }}>
            <FormControlLabel
              control={<Switch checked={formData.publica} onChange={(e) => setFormData({ ...formData, publica: e.target.checked })} />}
              label="Visible en el mapa público"
              sx={{ ".MuiFormControlLabel-label": { fontFamily: "Poppins" } }}
            />
            <FormControlLabel
              control={<Switch checked={formData.destacada} onChange={(e) => setFormData({ ...formData, destacada: e.target.checked })} />}
              label="Destacada"
              sx={{ ".MuiFormControlLabel-label": { fontFamily: "Poppins" } }}
            />
          </Box>

          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle2" sx={{ fontFamily: "Poppins", fontWeight: "bold", mb: 1 }}>
            Reglas de validez
          </Typography>

          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
            <FormControlLabel
              control={<Switch checked={formData.soloJacaranda} onChange={(e) => setFormData({ ...formData, soloJacaranda: e.target.checked })} />}
              label="Jacarandás en flor (icono propio en el mapa)"
              sx={{ ".MuiFormControlLabel-label": { fontFamily: "Poppins" } }}
            />
            <FormControlLabel
              control={<Switch checked={formData.restringirMunicipios} onChange={(e) => setFormData({ ...formData, restringirMunicipios: e.target.checked })} />}
              label="Solo los 7 municipios del área metropolitana"
              sx={{ ".MuiFormControlLabel-label": { fontFamily: "Poppins" } }}
            />
          </Box>
          <Typography variant="caption" sx={{ fontFamily: "Poppins", color: "#6b7a7a", display: "block", mb: 2 }}>
            La especie no oculta árboles del mapa ni descarta registros por sí sola: marca el icono
            y cuenta para la validez, y lo dudoso pasa por la cola de revisión.
          </Typography>

          {formData.participacion === PARTICIPACION.MAPEADORES && (
            <SelectorMapeadores
              mapeadoresSeleccionados={mapeadoresSeleccionados}
              onMapeadoresChange={setMapeadoresSeleccionados}
            />
          )}
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
