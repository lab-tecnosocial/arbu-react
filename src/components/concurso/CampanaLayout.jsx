import { Box, Chip, CircularProgress, Tab, Tabs, Typography, Alert } from "@mui/material";
import { Link, Outlet, useLocation, useParams } from "react-router-dom";
import { ConcursoProvider, useConcurso } from "../../context/ConcursoContext";
import { formatFecha } from "../../helpers/fechaArbol";

const TABS = [
  { ruta: "resumen", label: "Resumen" },
  { ruta: "registros", label: "Registros" },
  { ruta: "revision", label: "Revisión" },
  { ruta: "posiciones", label: "Posiciones" },
  { ruta: "acta", label: "Acta" },
];

const Cabecera = () => {
  const { campania, registros, ranking, loading, error } = useConcurso();
  const location = useLocation();
  const { id } = useParams();

  const actual = TABS.findIndex((t) => location.pathname.includes(`/${t.ruta}`));

  if (loading && !campania) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 6 }}>
        <CircularProgress sx={{ color: "#268576" }} />
      </Box>
    );
  }

  if (error) return <Alert severity="error" sx={{ m: 3 }}>{error}</Alert>;
  if (!campania) return <Alert severity="warning" sx={{ m: 3 }}>Campaña no encontrada.</Alert>;

  const validos = registros.filter((r) => r.validoFinal).length;
  const pendientes = registros.filter((r) => !r.revisado).length;
  const diasRestantes = campania.fechaFin
    ? Math.ceil((campania.fechaFin.getTime() - Date.now()) / 86400000)
    : null;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontFamily: "Poppins", fontWeight: "bold", color: "#268576" }}>
        {campania.nombre}
      </Typography>

      <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", my: 2 }}>
        <Chip
          label={campania.estado === "activa" ? "En curso" : campania.estado === "proxima" ? "Próxima" : "Cerrada"}
          color={campania.estado === "activa" ? "success" : "default"}
          sx={{ fontFamily: "Poppins", fontWeight: "bold" }}
        />
        <Chip label={`${formatFecha(campania.fechaInicio)} – ${formatFecha(campania.fechaFin)}`} sx={{ fontFamily: "Poppins" }} />
        {diasRestantes !== null && diasRestantes >= 0 && (
          <Chip label={`${diasRestantes} día${diasRestantes !== 1 ? "s" : ""} restante${diasRestantes !== 1 ? "s" : ""}`} sx={{ fontFamily: "Poppins" }} />
        )}
        <Chip label={`${registros.length} registros`} sx={{ fontFamily: "Poppins" }} />
        <Chip label={`${validos} válidos`} color="success" sx={{ fontFamily: "Poppins", fontWeight: "bold" }} />
        <Chip label={`${pendientes} sin revisar`} color={pendientes ? "warning" : "default"} sx={{ fontFamily: "Poppins" }} />
        <Chip label={`${ranking.length} participantes`} sx={{ fontFamily: "Poppins" }} />
      </Box>

      {campania.resultadosPublicados && (
        <Alert severity="info" sx={{ mb: 2, fontFamily: "Poppins" }}>
          Los resultados de esta campaña ya se publicaron. La tabla en vivo puede diferir del acta congelada.
        </Alert>
      )}

      <Tabs value={actual === -1 ? 0 : actual} sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
        {TABS.map((t) => (
          <Tab
            key={t.ruta}
            label={t.label}
            component={Link}
            to={`/campanas/${id}/${t.ruta}`}
            sx={{ fontFamily: "Poppins", textTransform: "none", fontWeight: 600 }}
          />
        ))}
      </Tabs>

      <Outlet />
    </Box>
  );
};

const CampanaLayout = () => {
  const { id } = useParams();
  return (
    <ConcursoProvider campaniaId={id}>
      <Cabecera />
    </ConcursoProvider>
  );
};

export default CampanaLayout;
