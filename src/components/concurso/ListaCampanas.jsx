import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Button, Chip, CircularProgress, Paper, Table, TableBody,
  TableCell, TableHead, TableRow, Typography, Alert,
} from "@mui/material";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase-config";
import {
  CAMPANIAS_COLLECTION, normalizarCampania, ordenarCampanias,
} from "../../helpers/campanias/campaniaModel";
import { formatFecha } from "../../helpers/fechaArbol";

const colorEstado = { activa: "success", proxima: "info", cerrada: "default" };

const ListaCampanas = () => {
  const navigate = useNavigate();
  const [campanias, setCampanias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const snapshot = await getDocs(collection(db, CAMPANIAS_COLLECTION));
        setCampanias(
          ordenarCampanias(snapshot.docs.map((d) => normalizarCampania({ id: d.id, ...d.data() })))
        );
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <Box sx={{ display: "flex", justifyContent: "center", p: 6 }}><CircularProgress sx={{ color: "#268576" }} /></Box>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontFamily: "Poppins", fontWeight: "bold", color: "#268576", mb: 3 }}>
        Campañas de mapeo
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              {["Nombre", "Tipo", "Estado", "Periodo", "Pública", ""].map((h) => (
                <TableCell key={h} sx={{ fontFamily: "Poppins", fontWeight: "bold" }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {campanias.map((c) => (
              <TableRow key={c.id} hover>
                <TableCell sx={{ fontFamily: "Poppins" }}>{c.nombre}</TableCell>
                <TableCell sx={{ fontFamily: "Poppins" }}>{c.tipo}</TableCell>
                <TableCell>
                  <Chip size="small" label={c.estado} color={colorEstado[c.estado]} sx={{ fontFamily: "Poppins" }} />
                </TableCell>
                <TableCell sx={{ fontFamily: "Poppins" }}>
                  {formatFecha(c.fechaInicio)} – {formatFecha(c.fechaFin)}
                </TableCell>
                <TableCell sx={{ fontFamily: "Poppins" }}>{c.publica ? "Sí" : "No"}</TableCell>
                <TableCell align="right">
                  <Button size="small" onClick={() => navigate(`/campanas/${c.id}/resumen`)} sx={{ fontFamily: "Poppins", textTransform: "none" }}>
                    Abrir
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {!campanias.length && (
              <TableRow>
                <TableCell colSpan={6} sx={{ fontFamily: "Poppins", textAlign: "center", py: 4 }}>
                  Todavía no hay campañas. Se crean desde Proyectos.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default ListaCampanas;
