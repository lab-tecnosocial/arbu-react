import { useRef, useState } from "react";
import {
  Box, Card, CardContent, Grid, IconButton, LinearProgress, Tooltip, Typography,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import DeleteIcon from "@mui/icons-material/Delete";
import { ACCEPT_FOTOS, motivoDeRechazo, subirFoto } from "../../helpers/aportes/subirFoto";
import { leerMetadatosFoto } from "../../helpers/aportes/metadatosFoto";

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
 *
 * Se puede hacer clic o **arrastrar** las fotos a las casillas. Arrastrar
 * varias de golpe sobre una casilla reparte las demás por las que estén
 * libres: cargar un árbol son seis fotos, y seis diálogos de archivo seguidos
 * es la parte más pesada del formulario. Nunca se pisa una casilla que ya
 * tiene foto —quien quiera reemplazarla la suelta encima a propósito—.
 */
const SubidorFotos = ({
  clavesFoto, fotos, identidad, onCambiar, onMetadatos, onRechazo, deshabilitado,
}) => {
  const [progreso, setProgreso] = useState({});
  const [errores, setErrores] = useState({});
  const [encima, setEncima] = useState(null);
  const entradas = useRef({});

  const elegir = async (clave, archivo) => {
    if (!archivo) return;

    // Un formato que la web no puede pintar se rechaza aquí, antes de leer nada
    // y antes de subir: el motivo se dice en la casilla Y arriba, porque el
    // texto de una casilla es fácil de no ver entre seis.
    const rechazo = motivoDeRechazo(archivo);
    const etiquetaCasilla = clavesFoto.find((f) => f.key === clave)?.label ?? clave;
    if (rechazo) {
      setErrores((prev) => ({ ...prev, [clave]: rechazo }));
      onRechazo?.(etiquetaCasilla, rechazo);
      return;
    }

    setErrores((prev) => ({ ...prev, [clave]: null }));
    setProgreso((prev) => ({ ...prev, [clave]: 0 }));

    // El EXIF se lee del archivo tal como salió de la cámara y en paralelo a
    // la subida: `subirFoto` lo recomprime en un canvas, y de ahí sale sin
    // coordenada ni fecha. Se avisa aunque la subida falle —el dato de dónde y
    // cuándo sigue siendo bueno— y si falla la lectura no se toca la subida.
    leerMetadatosFoto(archivo).then((metadatos) => onMetadatos?.(etiquetaCasilla, metadatos));

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

  /**
   * Reparte lo que se soltó: la primera foto va a la casilla donde se soltó y
   * las demás caen en las que siguen vacías, en el orden del catálogo.
   */
  const soltar = (clave, lista) => {
    // No se filtra por tipo: un HEIC soltado tiene que decir por qué no vale,
    // no desaparecer sin más.
    const archivos = Array.from(lista ?? []);
    if (!archivos.length) return;

    // Se sigue por las casillas que vienen DESPUÉS de aquella donde se soltó, y
    // al llegar al final se vuelve al principio: soltar las seis fotos sobre la
    // primera casilla las reparte en el orden del catálogo, que es el orden en
    // que se toman.
    const orden = clavesFoto.map(({ key }) => key);
    const desde = orden.indexOf(clave);
    const libres = [...orden.slice(desde + 1), ...orden.slice(0, Math.max(desde, 0))]
      .filter((key) => !fotos[key] && progreso[key] === undefined);

    const destinos = [clave, ...libres];
    archivos.slice(0, destinos.length).forEach((archivo, i) => elegir(destinos[i], archivo));
  };

  // Soltar una foto fuera de una casilla haría que el navegador la abriera y
  // se llevara por delante el formulario a medio llenar.
  const ignorarArrastre = (e) => e.preventDefault();

  return (
    <Grid container spacing={1.5} onDragOver={ignorarArrastre} onDrop={ignorarArrastre}>
      {clavesFoto.map(({ key, label }) => {
        const url = fotos[key];
        const pct = progreso[key];
        const subiendo = pct !== null && pct !== undefined;

        const recibiendo = encima === key;

        return (
          <Grid item xs={6} sm={4} key={key}>
            <Card
              variant="outlined"
              sx={{
                position: "relative",
                borderColor: recibiendo ? "primary.main" : undefined,
                borderStyle: recibiendo ? "dashed" : undefined,
              }}
            >
              <Box
                onClick={() => !deshabilitado && !subiendo && entradas.current[key]?.click()}
                onDragOver={(e) => {
                  if (deshabilitado) return;
                  e.preventDefault();
                  setEncima(key);
                }}
                onDragLeave={() => setEncima((prev) => (prev === key ? null : prev))}
                onDrop={(e) => {
                  e.preventDefault();
                  setEncima(null);
                  if (!deshabilitado) soltar(key, e.dataTransfer?.files);
                }}
                sx={{
                  height: 120,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: deshabilitado ? "default" : "pointer",
                  backgroundColor: recibiendo ? "action.selected" : "action.hover",
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
                accept={ACCEPT_FOTOS}
                multiple
                hidden
                ref={(el) => { entradas.current[key] = el; }}
                onChange={(e) => {
                  soltar(key, e.target.files);
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
