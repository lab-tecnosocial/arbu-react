import { useEffect, useMemo, useState } from "react";
import {
  Alert, Autocomplete, Box, Button, Chip, Dialog, DialogActions, DialogContent,
  DialogTitle, Divider, FormControl, Grid, InputLabel, MenuItem, Select,
  TextField, Typography,
} from "@mui/material";
import { useConcurso } from "../../context/ConcursoContext";
import { guardarEdicionRegistro } from "../../helpers/campanias/edicionRegistro";
import { borrarRevision, guardarRevision } from "../../helpers/campanias/revisionOperations";
import { MOTIVO_INVALIDO, VEREDICTO } from "../../helpers/campanias/revisiones";
import { formatFechaHora } from "../../helpers/fechaArbol";
import { ETIQUETA_ORIGEN } from "../../helpers/campanias/origenArbol";
import {
  sugerenciasNombresCientificos, sugerenciasNombresComunes,
} from "../tabla/constants";

const PENDIENTE = "pendiente";

/** Los números llegan del formulario como texto; "" significa "sin dato". */
const aNumero = (texto) => {
  const limpio = String(texto).trim().replace(",", ".");
  if (!limpio) return null;
  const numero = Number(limpio);
  return Number.isFinite(numero) ? numero : null;
};

const aTexto = (valor) => (valor === null || valor === undefined ? "" : String(valor));

const formularioDesde = (registro) => ({
  nombreComun: registro?.nombreComun ?? "",
  nombreCientifico: registro?.nombreCientifico ?? "",
  nombrePropio: registro?.nombrePropio ?? "",
  lugarDePlantacion: registro?.lugarDePlantacion ?? "",
  altura: aTexto(registro?.altura),
  diametroAlturaPecho: aTexto(registro?.diametroAlturaPecho),
});

/**
 * Corrección a mano de un registro.
 *
 * Reúne las dos cosas que hasta ahora estaban separadas: el DATO (que vive en
 * `arbolesMapeados` y lo escribió la app móvil) y el JUICIO (el veredicto, que
 * vive en la campaña). Se ven juntos porque casi siempre van juntos: se corrige
 * "Jacarandá0" y, con la foto delante, se marca el registro como válido.
 */
const EditarRegistroDialog = ({ registro, abierto, onCerrar, onAviso }) => {
  const { campania, usuarioActual, recargar } = useConcurso();

  const [form, setForm] = useState(() => formularioDesde(registro));
  const [veredicto, setVeredicto] = useState(PENDIENTE);
  const [motivo, setMotivo] = useState("OTRO");
  const [nota, setNota] = useState("");
  const [guardando, setGuardando] = useState(false);

  // Cada registro que se abre reinicia el formulario: si no, se arrastran los
  // valores del anterior y se corrige el árbol equivocado.
  useEffect(() => {
    if (!registro) return;
    setForm(formularioDesde(registro));
    setVeredicto(registro.revision?.veredicto ?? PENDIENTE);
    setMotivo(registro.revision?.motivo ?? "OTRO");
    setNota(registro.revision?.nota ?? "");
  }, [registro?.clave]); // eslint-disable-line react-hooks/exhaustive-deps

  const fotos = useMemo(
    () => Object.entries(registro?.fotos ?? {}).filter(([, url]) => url),
    [registro]
  );

  if (!registro) return null;

  const cambiar = (campo) => (valor) => setForm((prev) => ({ ...prev, [campo]: valor }));

  const valores = {
    nombreComun: form.nombreComun.trim(),
    nombreCientifico: form.nombreCientifico.trim(),
    nombrePropio: form.nombrePropio.trim(),
    lugarDePlantacion: form.lugarDePlantacion.trim(),
    altura: aNumero(form.altura),
    diametroAlturaPecho: aNumero(form.diametroAlturaPecho),
  };

  const veredictoOriginal = registro.revision?.veredicto ?? PENDIENTE;
  const revisionCambiada =
    veredicto !== veredictoOriginal ||
    (veredicto !== PENDIENTE &&
      (nota !== (registro.revision?.nota ?? "") ||
        (veredicto === VEREDICTO.INVALIDO && motivo !== (registro.revision?.motivo ?? "OTRO"))));

  const guardar = async () => {
    if (!usuarioActual) {
      onAviso?.({ texto: "No hay sesión: no se puede firmar la corrección", severity: "error" });
      return;
    }

    setGuardando(true);

    const res = await guardarEdicionRegistro(campania.id, registro, valores, usuarioActual);
    if (!res.success) {
      setGuardando(false);
      onAviso?.({ texto: `No se pudo guardar: ${res.error}`, severity: "error" });
      return;
    }

    if (revisionCambiada) {
      const resRevision =
        veredicto === PENDIENTE
          ? await borrarRevision(campania.id, registro.clave)
          : await guardarRevision(
              campania.id,
              registro,
              { veredicto, motivo: veredicto === VEREDICTO.INVALIDO ? motivo : null, nota },
              usuarioActual
            );

      if (!resRevision.success) {
        setGuardando(false);
        onAviso?.({
          texto: `Los datos se guardaron, pero la revisión no: ${resRevision.error}`,
          severity: "warning",
        });
        await recargar();
        onCerrar();
        return;
      }
    }

    await recargar();
    setGuardando(false);
    onCerrar();

    if (res.sinCambios && !revisionCambiada) {
      onAviso?.({ texto: "No había nada que cambiar", severity: "info" });
    } else if (res.sinBitacora) {
      onAviso?.({
        texto: "Registro corregido, pero no se pudo anotar en la bitácora de correcciones. Despliega las reglas con `pnpm deploy:rules`.",
        severity: "warning",
      });
    } else {
      onAviso?.({ texto: "Registro corregido", severity: "success" });
    }
  };

  return (
    <Dialog open={abierto} onClose={guardando ? undefined : onCerrar} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontFamily: "Poppins", fontWeight: "bold" }}>
        Editar registro
        <Typography variant="caption" sx={{ fontFamily: "Poppins", color: "#6b7a7a", display: "block" }}>
          {typeof registro.participante === "string" ? registro.participante : registro.uid} · {formatFechaHora(registro.fecha)} ·{" "}
          {registro.municipio?.nombre ?? "fuera del área"}
          {registro.origen ? ` · ${ETIQUETA_ORIGEN[registro.origen] ?? registro.origen}` : ""}
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        {fotos.length > 0 && (
          <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
            {fotos.map(([clave, url]) => (
              <a key={clave} href={url} target="_blank" rel="noreferrer" title={clave}>
                <img
                  src={url}
                  alt={clave}
                  style={{ width: 72, height: 72, objectFit: "cover", borderRadius: 4 }}
                />
              </a>
            ))}
          </Box>
        )}

        <Alert severity="info" sx={{ mb: 2, fontFamily: "Poppins" }}>
          Los nombres y el lugar pertenecen al <strong>árbol</strong>: cambiarlos afecta a todos
          sus monitoreos y también a lo que se ve en el mapa público. La altura y el DAP son de
          <strong> este monitoreo</strong>. Cada cambio queda firmado con tu correo.
        </Alert>

        <Typography variant="subtitle2" sx={{ fontFamily: "Poppins", fontWeight: "bold", mb: 1 }}>
          Datos del árbol
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Autocomplete
              freeSolo
              options={sugerenciasNombresComunes}
              value={form.nombreComun}
              inputValue={form.nombreComun}
              onChange={(e, valor) => cambiar("nombreComun")(valor ?? "")}
              onInputChange={(e, valor) => cambiar("nombreComun")(valor ?? "")}
              renderInput={(params) => (
                <TextField {...params} size="small" fullWidth label="Nombre común" />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Autocomplete
              freeSolo
              options={sugerenciasNombresCientificos}
              value={form.nombreCientifico}
              inputValue={form.nombreCientifico}
              onChange={(e, valor) => cambiar("nombreCientifico")(valor ?? "")}
              onInputChange={(e, valor) => cambiar("nombreCientifico")(valor ?? "")}
              renderInput={(params) => (
                <TextField {...params} size="small" fullWidth label="Nombre científico" />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              size="small" fullWidth label="Nombre propio"
              value={form.nombrePropio}
              onChange={(e) => cambiar("nombrePropio")(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              size="small" fullWidth label="Lugar de plantación"
              value={form.lugarDePlantacion}
              onChange={(e) => cambiar("lugarDePlantacion")(e.target.value)}
            />
          </Grid>
        </Grid>

        <Typography variant="subtitle2" sx={{ fontFamily: "Poppins", fontWeight: "bold", mt: 3, mb: 1 }}>
          Medidas de este monitoreo
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              size="small" fullWidth type="number" label="Altura (m)"
              value={form.altura}
              onChange={(e) => cambiar("altura")(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              size="small" fullWidth type="number" label="DAP (cm)"
              value={form.diametroAlturaPecho}
              onChange={(e) => cambiar("diametroAlturaPecho")(e.target.value)}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography variant="subtitle2" sx={{ fontFamily: "Poppins", fontWeight: "bold", mb: 1 }}>
          Revisión
        </Typography>
        <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", mb: 2 }}>
          <Chip size="small" label={`automático: ${registro.auto?.veredicto ?? "—"}`} />
          {(registro.auto?.reglasIncumplidas ?? []).map((r) => (
            <Chip
              key={r.clave} size="small" variant="outlined" label={r.mensaje}
              color={r.severidad === "bloqueante" ? "error" : "warning"}
              sx={{ fontFamily: "Poppins" }}
            />
          ))}
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormControl size="small" fullWidth>
              <InputLabel>Estado</InputLabel>
              <Select value={veredicto} label="Estado" onChange={(e) => setVeredicto(e.target.value)}>
                <MenuItem value={PENDIENTE} sx={{ fontFamily: "Poppins" }}>Pendiente (sin revisar)</MenuItem>
                <MenuItem value={VEREDICTO.VALIDO} sx={{ fontFamily: "Poppins" }}>Válido</MenuItem>
                <MenuItem value={VEREDICTO.INVALIDO} sx={{ fontFamily: "Poppins" }}>Inválido</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {veredicto === VEREDICTO.INVALIDO && (
            <Grid item xs={12} sm={6}>
              <FormControl size="small" fullWidth>
                <InputLabel>Motivo</InputLabel>
                <Select value={motivo} label="Motivo" onChange={(e) => setMotivo(e.target.value)}>
                  {Object.entries(MOTIVO_INVALIDO).map(([k, v]) => (
                    <MenuItem key={k} value={k} sx={{ fontFamily: "Poppins" }}>{v}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}
          {veredicto !== PENDIENTE && (
            <Grid item xs={12}>
              <TextField
                size="small" fullWidth multiline rows={2} label="Nota"
                value={nota} onChange={(e) => setNota(e.target.value)}
              />
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onCerrar} disabled={guardando} sx={{ fontFamily: "Poppins", textTransform: "none" }}>
          Cancelar
        </Button>
        <Button
          variant="contained" onClick={guardar} disabled={guardando}
          sx={{ fontFamily: "Poppins", textTransform: "none", backgroundColor: "#268576" }}
        >
          {guardando ? "Guardando…" : "Guardar cambios"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditarRegistroDialog;
