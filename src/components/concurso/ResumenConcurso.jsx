import { useMemo } from "react";
import { Alert, Box, Card, CardContent, Chip, Grid, Paper, Typography } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { useConcurso } from "../../context/ConcursoContext";
import { MiniBarras } from "./MiniBarras";
import { MUNICIPIOS_METROPOLITANOS_CBBA } from "../../helpers/geo/municipios";

const Kpi = ({ label, valor, color = "#268576" }) => (
  <Card variant="outlined">
    <CardContent>
      <Typography variant="h4" sx={{ fontFamily: "Poppins", fontWeight: "bold", color }}>
        {valor}
      </Typography>
      <Typography variant="body2" sx={{ fontFamily: "Poppins", color: "#6b7a7a" }}>
        {label}
      </Typography>
    </CardContent>
  </Card>
);

const ResumenConcurso = () => {
  const { registros, ranking, duplicados, campania } = useConcurso();
  const { id } = useParams();

  const stats = useMemo(() => {
    const validos = registros.filter((r) => r.validoFinal);
    const porDia = new Map();
    registros.forEach((r) => {
      if (!r.fecha) return;
      const clave = r.fecha.toISOString().slice(0, 10);
      porDia.set(clave, (porDia.get(clave) ?? 0) + 1);
    });

    const porMunicipio = new Map(MUNICIPIOS_METROPOLITANOS_CBBA.map((m) => [m.nombre, 0]));
    registros.forEach((r) => {
      const n = r.municipio?.nombre;
      if (n && porMunicipio.has(n)) porMunicipio.set(n, porMunicipio.get(n) + 1);
    });

    const conEspecie = registros.filter((r) => r.motivos.especieAdmitida).length;
    const sinIdentificar = registros.filter((r) => !r.auto?.especieIdentificada).length;

    return {
      total: registros.length,
      validos: validos.length,
      pendientes: registros.filter((r) => !r.revisado).length,
      invalidos: registros.filter((r) => r.revisado && !r.validoFinal).length,
      participantes: ranking.length,
      municipiosCubiertos: [...porMunicipio.values()].filter((v) => v > 0).length,
      porDia: [...porDia.entries()].sort().map(([d, v]) => ({
        etiqueta: d,
        etiquetaCorta: d.slice(8),
        valor: v,
      })),
      porMunicipio: [...porMunicipio.entries()].map(([m, v]) => ({
        etiqueta: m,
        etiquetaCorta: m.slice(0, 4),
        valor: v,
      })),
      conEspecie,
      otrasEspecies: registros.length - conEspecie - sinIdentificar,
      sinIdentificar,
    };
  }, [registros, ranking]);

  const alertas = [
    duplicados.gruposSospechosos.length && {
      texto: `${duplicados.gruposSospechosos.length} grupo(s) de registros que podrían ser el mismo ejemplar`,
      severity: "warning",
    },
    stats.sinIdentificar && {
      texto: `${stats.sinIdentificar} registro(s) sin especie identificada: hay que mirarlos en la cola de revisión`,
      severity: "warning",
    },
    registros.filter((r) => !r.motivos.municipioAdmitido).length && {
      texto: `${registros.filter((r) => !r.motivos.municipioAdmitido).length} registro(s) fuera del área del concurso`,
      severity: "info",
    },
  ].filter(Boolean);

  return (
    <Box>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          ["Registros", stats.total],
          ["Válidos", stats.validos],
          ["Sin revisar", stats.pendientes, "#b26a00"],
          ["Inválidos", stats.invalidos, "#8d3b3b"],
          ["Participantes", stats.participantes],
          ["Municipios", `${stats.municipiosCubiertos}/7`],
        ].map(([label, valor, color]) => (
          <Grid item xs={6} md={2} key={label}>
            <Kpi label={label} valor={valor} color={color} />
          </Grid>
        ))}
      </Grid>

      {alertas.map((a) => (
        <Alert key={a.texto} severity={a.severity} sx={{ mb: 1, fontFamily: "Poppins" }}>
          {a.texto} —{" "}
          <Link to={`/campanas/${id}/revision`} style={{ color: "inherit" }}>
            ir a revisión
          </Link>
        </Alert>
      ))}

      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 2 }}>
            <MiniBarras titulo="Registros por día" datos={stats.porDia} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 2 }}>
            <MiniBarras titulo="Cobertura por municipio" datos={stats.porMunicipio} />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" sx={{ fontFamily: "Poppins", fontWeight: "bold", mb: 1 }}>
              Especies
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Chip label={`${stats.conEspecie} coinciden con la campaña`} color="success" sx={{ fontFamily: "Poppins" }} />
              <Chip label={`${stats.otrasEspecies} son otras especies`} sx={{ fontFamily: "Poppins" }} />
              <Chip
                label={`${stats.sinIdentificar} sin identificar`}
                color={stats.sinIdentificar ? "warning" : "default"}
                sx={{ fontFamily: "Poppins" }}
              />
            </Box>
            {campania?.reglas?.especies && (
              <Typography variant="caption" sx={{ fontFamily: "Poppins", color: "#6b7a7a", display: "block", mt: 1 }}>
                La especie no descarta por sí sola: un registro sin identificar va a la cola de revisión, no a la basura.
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ResumenConcurso;
