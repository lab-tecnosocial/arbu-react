import { useRef, useState } from "react";
import {
  Box, Card, CardContent, Grid, IconButton, LinearProgress, Tooltip, Typography,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import DeleteIcon from "@mui/icons-material/Delete";
import { subirFoto } from "../../helpers/aportes/subirFoto";

/**
 * Las fotos del monitoreo, una casilla por parte del árbol.
 *
 * Las claves salen del catálogo del tipo de aporte (`clavesFoto`), que es el
 * mismo que usa la ficha del mapa público: así lo que se sube aquí se ve allá
 * sin traducciones.
 *
 * Quitar una foto solo la desengancha del formulario; el archivo se borra de
 * Storage al descartar el aporte entero, no aquí, porque en una edición la URL
 * puede ser una que subió la app móvil y que no nos toca borrar.
 */
const SubidorFotos = ({ clavesFoto, fotos, identidad, onCambiar, deshabilitado }) => {
  const [progreso, setProgreso] = useState({});
  const [errores, setErrores] = useState({});
  const entradas = useRef({});

  const elegir = async (clave, archivo) => {
    if (!archivo) return;

    setErrores((prev) => ({ ...prev, [clave]: null }));
    setProgreso((prev) => ({ ...prev, [clave]: 0 }));

    const res = await subirFoto(
      archivo,
      { ...identidad, clave },
      (pct) => setProgreso((prev) => ({ ...prev, [clave]: pct }))
    );

    setProgreso((prev) => ({ ...prev, [clave]: null }));

    if (!res.success) {
      setErrores((prev) => ({ ...prev, [clave]: res.error }));
      return;
    }

    onCambiar(clave, res.url, res.ruta);
  };

  return (
    <Grid container spacing={1.5}>
      {clavesFoto.map(({ key, label }) => {
        const url = fotos[key];
        const pct = progreso[key];
        const subiendo = pct !== null && pct !== undefined;

        return (
          <Grid item xs={6} sm={4} key={key}>
            <Card variant="outlined" sx={{ position: "relative" }}>
              <Box
                onClick={() => !deshabilitado && !subiendo && entradas.current[key]?.click()}
                sx={{
                  height: 120,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: deshabilitado ? "default" : "pointer",
                  backgroundColor: "action.hover",
                  backgroundImage: url ? `url(${url})` : "none",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {!url && !subiendo && <AddPhotoAlternateIcon color="disabled" fontSize="large" />}
              </Box>

              {subiendo && <LinearProgress variant="determinate" value={pct} />}

              <CardContent sx={{ py: 0.75, px: 1, "&:last-child": { pb: 0.75 } }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Typography variant="caption" noWrap>{label}</Typography>
                  {url && !deshabilitado && (
                    <Tooltip title="Quitar esta foto">
                      <IconButton size="small" onClick={() => onCambiar(key, null, null)}>
                        <DeleteIcon fontSize="inherit" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
                {errores[key] && (
                  <Typography variant="caption" color="error" display="block">
                    {errores[key]}
                  </Typography>
                )}
              </CardContent>

              <input
                type="file"
                accept="image/*"
                hidden
                ref={(el) => { entradas.current[key] = el; }}
                onChange={(e) => {
                  elegir(key, e.target.files?.[0]);
                  e.target.value = "";
                }}
              />
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default SubidorFotos;
