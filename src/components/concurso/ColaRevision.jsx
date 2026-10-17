import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert, Box, Button, Chip, Divider, FormControl, Grid, InputLabel, MenuItem,
  Paper, Select, Snackbar, TextField, Typography,
} from "@mui/material";
import { useConcurso } from "../../context/ConcursoContext";
import {
  guardarRevision, borrarRevision, guardarRevisionesEnLote, guardarParticipante,
} from "../../helpers/campanias/revisionOperations";
import {
  MOTIVO_INVALIDO, MOTIVO_DESCALIFICACION, VEREDICTO, ESTADO_PARTICIPANTE,
} from "../../helpers/campanias/revisiones";
import { formatFechaHora } from "../../helpers/fechaArbol";
import { ETIQUETA_ORIGEN, ORIGEN } from "../../helpers/campanias/origenArbol";

const MODOS = {
  dudosos: "Solo dudosos",
  muestra: "Muestra del 10% de los aptos",
  todos: "Todos",
  topN: "Solo el top 10",
};

/** Muestra reproducible: la misma semilla da siempre el mismo subconjunto. */
const hashEstable = (texto) => {
  let h = 0;
  for (let i = 0; i < texto.length; i += 1) h = (h * 31 + texto.charCodeAt(i)) | 0;
  return Math.abs(h);
};

const ColaRevision = () => {
  const {
    registros, ranking, usuarios, campania, usuarioActual, recargar, duplicados,
  } = useConcurso();

  const [modo, setModo] = useState("dudosos");
  const [indice, setIndice] = useState(0);
  const [nota, setNota] = useState("");
  const [motivo, setMotivo] = useState("OTRO");
  const [aviso, setAviso] = useState(null);
  const [guardando, setGuardando] = useState(false);

  const cola = useMemo(() => {
    const topUids = new Set(ranking.slice(0, 10).map((f) => f.uid));
    switch (modo) {
      case "dudosos":
        return registros.filter((r) => !r.revisado && r.auto?.veredicto !== "apto");
      case "muestra":
        return registros.filter((r) => r.auto?.veredicto === "apto" && hashEstable(r.clave) % 10 === 0);
      case "topN":
        return registros.filter((r) => topUids.has(r.uid));
      default:
        return registros;
    }
  }, [registros, ranking, modo]);

  useEffect(() => { setIndice(0); }, [modo]);

  const actual = cola[indice] ?? null;

  useEffect(() => {
    setNota(actual?.revision?.nota ?? "");
    setMotivo(actual?.revision?.motivo ?? "OTRO");
  }, [actual?.clave]); // eslint-disable-line react-hooks/exhaustive-deps

  const avanzar = useCallback(() => setIndice((i) => Math.min(i + 1, cola.length - 1)), [cola.length]);
  const retroceder = useCallback(() => setIndice((i) => Math.max(i - 1, 0)), []);

  const decidir = useCallback(
    async (veredicto, motivoElegido = null) => {
      if (!actual || !usuarioActual) return;
      setGuardando(true);
      const res = await guardarRevision(
        campania.id, actual, { veredicto, motivo: motivoElegido, nota }, usuarioActual
      );
      setGuardando(false);
      if (!res.success) {
        setAviso({ texto: `No se pudo guardar: ${res.error}`, severity: "error" });
        return;
      }
      setAviso({ texto: veredicto === VEREDICTO.VALIDO ? "Marcado como válido" : "Marcado como inválido", severity: "success" });
      await recargar();
      avanzar();
    },
    [actual, usuarioActual, campania, nota, recargar, avanzar]
  );

  const descalificar = useCallback(async () => {
    if (!actual?.uid || !usuarioActual) return;
    setGuardando(true);
    const res = await guardarParticipante(
      campania.id, actual.uid,
      { estado: ESTADO_PARTICIPANTE.DESCALIFICADO, motivo, nota },
      usuarioActual
    );
    setGuardando(false);
    setAviso(
      res.success
        ? { texto: "Participante descalificado: ninguno de sus registros cuenta", severity: "warning" }
        : { texto: `No se pudo descalificar: ${res.error}`, severity: "error" }
    );
    if (res.success) await recargar();
  }, [actual, usuarioActual, campania, motivo, nota, recargar]);

  const deshacer = useCallback(async () => {
    if (!actual?.revision) return;
    const res = await borrarRevision(campania.id, actual.clave);
    if (res.success) {
      setAviso({ texto: "Revisión deshecha", severity: "info" });
      await recargar();
    }
  }, [actual, campania, recargar]);

  // Atajos de teclado. J/K en vez de flechas porque el visor de fotos ya usa
  // las flechas y Escape.
  useEffect(() => {
    const onKey = (e) => {
      const tag = e.target?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || e.metaKey || e.ctrlKey) return;

      switch (e.key.toLowerCase()) {
        case "j": avanzar(); break;
        case "k": retroceder(); break;
        case "v": decidir(VEREDICTO.VALIDO); break;
        case "x": decidir(VEREDICTO.INVALIDO, motivo); break;
        case "u": deshacer(); break;
        default: return;
      }
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [avanzar, retroceder, decidir, deshacer, motivo]);

  const grupoDup = actual ? duplicados.porArbol[actual.clave] : null;
  const hermanos = grupoDup
    ? duplicados.gruposSospechosos.find((g) => g.id === grupoDup)?.registros.filter((r) => r.clave !== actual.clave) ?? []
    : [];

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 2, display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
        <FormControl size="small" sx={{ minWidth: 240 }}>
          <InputLabel>Modo de revisión</InputLabel>
          <Select value={modo} label="Modo de revisión" onChange={(e) => setModo(e.target.value)}>
            {Object.entries(MODOS).map(([k, v]) => (
              <MenuItem key={k} value={k} sx={{ fontFamily: "Poppins" }}>{v}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Chip label={`${cola.length ? indice + 1 : 0} de ${cola.length}`} sx={{ fontFamily: "Poppins" }} />
        <Typography variant="caption" sx={{ fontFamily: "Poppins", color: "#6b7a7a" }}>
          J siguiente · K anterior · V válido · X inválido · U deshacer
        </Typography>
        <Box sx={{ flex: 1 }} />
        <Button
          size="small" disabled={!cola.length || guardando}
          onClick={async () => {
            const aptos = cola.filter((r) => r.auto?.veredicto === "apto" && !r.revisado);
            if (!aptos.length) return setAviso({ texto: "No hay registros aptos sin revisar en esta cola", severity: "info" });
            setGuardando(true);
            const res = await guardarRevisionesEnLote(campania.id, aptos, { veredicto: VEREDICTO.VALIDO }, usuarioActual);
            setGuardando(false);
            setAviso({ texto: res.success ? `${res.total} marcados como válidos` : res.error, severity: res.success ? "success" : "error" });
            if (res.success) await recargar();
          }}
          sx={{ fontFamily: "Poppins", textTransform: "none" }}
        >
          Marcar los aptos de esta cola como válidos
        </Button>
      </Paper>

      {!actual ? (
        <Alert severity="success" sx={{ fontFamily: "Poppins" }}>
          No queda nada por revisar en este modo.
        </Alert>
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 1 }}>
              {actual.fotos.fotoFlor || actual.fotos.fotoArbolCompleto ? (
                <img
                  src={actual.fotos.fotoFlor || actual.fotos.fotoArbolCompleto}
                  alt="Registro"
                  style={{ width: "100%", maxHeight: 420, objectFit: "contain", background: "#f4f6f6" }}
                />
              ) : (
                <Box sx={{ p: 6, textAlign: "center", fontFamily: "Poppins", color: "#8b9a9a" }}>
                  Sin fotografías
                </Box>
              )}
              <Box sx={{ display: "flex", gap: 1, mt: 1, flexWrap: "wrap" }}>
                {Object.entries(actual.fotos)
                  .filter(([, url]) => url)
                  .map(([clave, url]) => (
                    <a key={clave} href={url} target="_blank" rel="noreferrer">
                      <img src={url} alt={clave} style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 4 }} />
                    </a>
                  ))}
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography sx={{ fontFamily: "Poppins", fontWeight: "bold" }}>
                {usuarios.get(actual.uid)?.nombre || actual.uid}
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: "Poppins", color: "#6b7a7a", mb: 1 }}>
                {formatFechaHora(actual.fecha)} · {actual.municipio?.nombre ?? "fuera del área"}
                {actual.origen === ORIGEN.PLANTADO && ` · ${ETIQUETA_ORIGEN[ORIGEN.PLANTADO]}`}
              </Typography>

              <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", mb: 2 }}>
                <Chip size="small" label={actual.auto?.veredicto} color={
                  actual.auto?.veredicto === "apto" ? "success" : actual.auto?.veredicto === "dudoso" ? "warning" : "error"
                } />
                {(actual.auto?.reglasIncumplidas ?? []).map((r) => (
                  <Chip key={r.clave} size="small" variant="outlined"
                    color={r.severidad === "bloqueante" ? "error" : "warning"}
                    label={r.mensaje} sx={{ fontFamily: "Poppins" }} />
                ))}
              </Box>

              <Typography variant="body2" sx={{ fontFamily: "Poppins" }}>
                <strong>Especie declarada:</strong> {actual.nombreComun || "—"} / {actual.nombreCientifico || "—"}
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: "Poppins" }}>
                <strong>Completitud:</strong> {Math.round(actual.completitud * 100)}%
              </Typography>

              {hermanos.length > 0 && (
                <Alert severity="warning" sx={{ my: 2, fontFamily: "Poppins" }}>
                  Esta persona tiene {hermanos.length} registro(s) muy cerca y casi a la misma hora.
                  Podría ser el mismo ejemplar.
                  <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                    {hermanos.map((h) => (
                      <img key={h.clave} src={h.fotos.fotoArbolCompleto || h.fotos.fotoFlor}
                        alt="hermano" style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 4 }} />
                    ))}
                  </Box>
                </Alert>
              )}

              <Divider sx={{ my: 2 }} />

              <FormControl size="small" fullWidth sx={{ mb: 1 }}>
                <InputLabel>Motivo</InputLabel>
                <Select value={motivo} label="Motivo" onChange={(e) => setMotivo(e.target.value)}>
                  {Object.entries({ ...MOTIVO_INVALIDO, ...MOTIVO_DESCALIFICACION }).map(([k, v]) => (
                    <MenuItem key={k} value={k} sx={{ fontFamily: "Poppins" }}>{v}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                size="small" fullWidth multiline rows={2} label="Nota"
                value={nota} onChange={(e) => setNota(e.target.value)} sx={{ mb: 2 }}
              />

              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                <Button variant="contained" color="success" disabled={guardando}
                  onClick={() => decidir(VEREDICTO.VALIDO)}
                  sx={{ fontFamily: "Poppins", textTransform: "none" }}>
                  Válido (V)
                </Button>
                <Button variant="outlined" color="error" disabled={guardando}
                  onClick={() => decidir(VEREDICTO.INVALIDO, motivo)}
                  sx={{ fontFamily: "Poppins", textTransform: "none" }}>
                  Inválido (X)
                </Button>
                <Button variant="outlined" color="warning" disabled={guardando}
                  onClick={descalificar}
                  sx={{ fontFamily: "Poppins", textTransform: "none" }}>
                  Descalificar persona
                </Button>
                {actual.revisado && (
                  <Button size="small" onClick={deshacer} sx={{ fontFamily: "Poppins", textTransform: "none" }}>
                    Deshacer (U)
                  </Button>
                )}
              </Box>

              {actual.revisado && (
                <Typography variant="caption" sx={{ fontFamily: "Poppins", display: "block", mt: 2, color: "#6b7a7a" }}>
                  Revisado por {actual.revision.revisadoPor}
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      )}

      <Snackbar
        open={Boolean(aviso)} autoHideDuration={4000} onClose={() => setAviso(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        {aviso ? <Alert severity={aviso.severity}>{aviso.texto}</Alert> : undefined}
      </Snackbar>
    </Box>
  );
};

export default ColaRevision;
