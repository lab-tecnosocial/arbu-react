import { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert, Autocomplete, Box, Button, Dialog, DialogActions, DialogContent,
  DialogTitle, Divider, Grid, TextField, Typography,
} from "@mui/material";
import { CAMPO } from "../../helpers/aportes/tiposAporte";
import {
  aValorFecha, validarAporte, valoresIniciales,
} from "../../helpers/aportes/validarAporte";
import { conciliarMetadatos } from "../../helpers/aportes/metadatosFoto";
import {
  calcularCambios, crearArbol, actualizarArbol, nuevaIdentidadAporte,
} from "../../helpers/aportes/escrituraArbol";
import { ACCION, anotarEnBitacora } from "../../helpers/aportes/bitacora";
import { borrarFoto } from "../../helpers/aportes/subirFoto";
import SelectorUbicacion from "./SelectorUbicacion";
import SubidorFotos from "./SubidorFotos";

/**
 * Alta y corrección de un aporte.
 *
 * Es el mismo formulario en los dos modos a propósito: lo que se puede
 * registrar es exactamente lo que se puede corregir después, sin campos que
 * solo existan en uno de los dos caminos.
 *
 * Al editar se guarda SOLO lo que cambió (ver `calcularCambios`), porque un
 * guardado completo pisaría con "" lo que otra pantalla acabara de arreglar.
 */

const CAMPOS_EN_MAPA = ["latitud", "longitud"];

const fotosIniciales = (tipo, arbol, monitoreoKey) => {
  const monitoreo = (arbol?.monitoreos ?? {})[monitoreoKey] ?? {};
  return Object.fromEntries(tipo.clavesFoto.map(({ key }) => [key, monitoreo[key] ?? null]));
};

const FormularioAporte = ({ abierto, tipo, arbol, monitoreoKey, autor, onCerrar, onGuardado }) => {
  const editando = Boolean(arbol);

  const [valores, setValores] = useState(() => valoresIniciales(tipo));
  const [fotos, setFotos] = useState(() => fotosIniciales(tipo, null, null));
  const [rutasSubidas, setRutasSubidas] = useState({});
  const [identidad, setIdentidad] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState(null);
  const [intentado, setIntentado] = useState(false);
  const [lecturaFoto, setLecturaFoto] = useState(null);
  const [horaDeLaFoto, setHoraDeLaFoto] = useState(null);

  // El EXIF se lee mientras la persona puede seguir escribiendo, así que la
  // conciliación necesita los valores de AHORA y no los del render en que se
  // eligió el archivo.
  const valoresRef = useRef(valores);
  valoresRef.current = valores;

  // Cada apertura reinicia el formulario: si no, se arrastran los valores del
  // aporte anterior y se corrige el árbol equivocado.
  useEffect(() => {
    if (!abierto) return;
    setValores(valoresIniciales(tipo, arbol, monitoreoKey));
    setFotos(fotosIniciales(tipo, arbol, monitoreoKey));
    setRutasSubidas({});
    setErrorGeneral(null);
    setIntentado(false);
    setLecturaFoto(null);
    setHoraDeLaFoto(null);
    setIdentidad(
      arbol
        ? { arbolId: arbol.id, monitoreoKey }
        : nuevaIdentidadAporte(tipo)
    );
  }, [abierto, arbol?.id, monitoreoKey, tipo]);

  // Las fotos entran en la validación: la principal es obligatoria
  // (`tipo.fotoRequerida`) y su valor vive en otro estado, no en `valores`.
  const { errores, advertencias, valido, normalizados } = useMemo(
    () => validarAporte(tipo, { ...valores, ...fotos }),
    [tipo, valores, fotos]
  );

  const visibles = intentado ? errores : {};

  // El espejo se adelanta al render a propósito: al soltar varias fotos de
  // golpe, sus lecturas de EXIF terminan casi juntas, y la segunda tiene que
  // ver lo que acaba de rellenar la primera en vez de volver a pisarlo.
  const cambiar = (parcial) => {
    valoresRef.current = { ...valoresRef.current, ...parcial };
    setValores((prev) => ({ ...prev, ...parcial }));
  };

  const cambiarFoto = (clave, url, ruta) => {
    setFotos((prev) => ({ ...prev, [clave]: url }));
    setRutasSubidas((prev) => ({ ...prev, [clave]: ruta ?? prev[clave] }));
  };

  /**
   * Lo que venía dentro de la foto: coordenada del GPS y hora del disparo.
   *
   * Rellena solo lo que está en blanco. Si la foto discrepa de lo que ya hay,
   * no se toca nada y se ofrece con un botón: subir una segunda foto no puede
   * mover un árbol que alguien acababa de colocar a mano en el mapa.
   */
  const alLeerMetadatos = (etiqueta, metadatos) => {
    if (!metadatos.coordenadas && !metadatos.fecha) {
      // Si otra foto ya puso el dato, que esta no lo traiga no es noticia.
      setLecturaFoto((prev) => (prev?.aplicados?.length ? prev : { etiqueta, vacia: true }));
      return;
    }

    const { propuesta, aplicar, enConflicto } = conciliarMetadatos(
      valoresRef.current,
      metadatos
    );

    if (Object.keys(aplicar).length) cambiar(aplicar);
    if (metadatos.fecha) setHoraDeLaFoto(metadatos.fecha);

    setLecturaFoto({
      etiqueta,
      propuesta,
      aplicados: Object.keys(aplicar),
      enConflicto,
    });
  };

  /** Una foto que no se puede usar: se dice por qué, donde se ve. */
  const alRechazarFoto = (etiqueta, motivo) => setLecturaFoto({ etiqueta, rechazo: motivo });

  const usarDatosDeLaFoto = () => {
    cambiar(lecturaFoto.propuesta);
    setLecturaFoto((prev) => ({
      ...prev,
      aplicados: Object.keys(prev.propuesta),
      enConflicto: [],
    }));
  };

  /** Lo subido y no guardado no debe quedarse ocupando el almacén. */
  const descartarSubidas = async () => {
    const huerfanas = Object.values(rutasSubidas).filter(Boolean);
    await Promise.all(huerfanas.map((ruta) => borrarFoto(ruta)));
  };

  const cerrarSinGuardar = async () => {
    if (!guardando) descartarSubidas();
    onCerrar();
  };

  const guardar = async () => {
    setIntentado(true);
    if (!valido) return;

    if (!autor?.uid || !autor?.email) {
      setErrorGeneral("No hay sesión: no se puede firmar el aporte");
      return;
    }

    setGuardando(true);
    setErrorGeneral(null);

    const conFotos = { ...normalizados, ...fotos };

    // El formulario solo sabe expresar un DÍA, pero la foto sí trae la hora del
    // disparo. Si el día que se va a guardar sigue siendo el suyo, el árbol
    // nace con la hora real en lugar de con medianoche: es un dato que ya
    // existía y que después nadie tendría cómo reponer. Al corregir no se toca
    // —la hora del monitoreo es la que registró la app—.
    if (!editando && horaDeLaFoto && aValorFecha(horaDeLaFoto) === valores.timestamp) {
      conFotos.timestamp = horaDeLaFoto;
    }

    if (!editando) {
      const res = await crearArbol(tipo, conFotos, autor, identidad);
      if (!res.success) {
        setGuardando(false);
        setErrorGeneral(res.error);
        return;
      }

      const bitacora = await anotarEnBitacora({
        coleccion: tipo.coleccion,
        arbolId: res.arbolId,
        monitoreoKey: res.monitoreoKey,
        accion: ACCION.CREAR,
        cambios: {},
        editadoPor: autor.email,
      });

      setGuardando(false);
      onGuardado(
        {
          texto: bitacora.success
            ? "Aporte registrado"
            : "Aporte registrado, pero no se pudo anotar en la bitácora",
          severity: bitacora.success ? "success" : "warning",
        },
        res.arbolId
      );
      onCerrar();
      return;
    }

    const cambios = calcularCambios(tipo, arbol, monitoreoKey, conFotos);
    if (!Object.keys(cambios).length) {
      setGuardando(false);
      onGuardado({ texto: "No había nada que cambiar", severity: "info" });
      onCerrar();
      return;
    }

    const res = await actualizarArbol(tipo, arbol.id, monitoreoKey, cambios);
    if (!res.success) {
      setGuardando(false);
      setErrorGeneral(res.error);
      return;
    }

    const bitacora = await anotarEnBitacora({
      coleccion: tipo.coleccion,
      arbolId: arbol.id,
      monitoreoKey,
      accion: ACCION.EDITAR,
      cambios,
      editadoPor: autor.email,
    });

    setGuardando(false);
    onGuardado(
      {
        texto: bitacora.success
          ? "Aporte actualizado"
          : "Aporte actualizado, pero no se pudo anotar en la bitácora",
        severity: bitacora.success ? "success" : "warning",
      },
      arbol.id
    );
    onCerrar();
  };

  const campoTexto = (campo) => {
    if (campo.sugerencias) {
      return (
        <Autocomplete
          freeSolo
          options={campo.sugerencias}
          value={valores[campo.nombre] ?? ""}
          onInputChange={(_, valor) => cambiar({ [campo.nombre]: valor })}
          renderInput={(params) => (
            <TextField
              {...params}
              label={campo.etiqueta}
              size="small"
              error={Boolean(visibles[campo.nombre])}
              helperText={visibles[campo.nombre]}
            />
          )}
        />
      );
    }

    return (
      <TextField
        label={campo.etiqueta}
        value={valores[campo.nombre] ?? ""}
        onChange={(e) => cambiar({ [campo.nombre]: e.target.value })}
        type={campo.tipo === CAMPO.FECHA ? "date" : "text"}
        InputLabelProps={campo.tipo === CAMPO.FECHA ? { shrink: true } : undefined}
        error={Boolean(visibles[campo.nombre])}
        helperText={visibles[campo.nombre]}
        fullWidth
        size="small"
      />
    );
  };

  const camposArbolVisibles = tipo.camposArbol.filter((c) => !CAMPOS_EN_MAPA.includes(c.nombre));

  /** Qué se sacó de la última foto, y qué queda por decidir. */
  const avisoDeLaFoto = () => {
    if (!lecturaFoto) return null;
    const {
      etiqueta, vacia, rechazo, aplicados = [], enConflicto = [], propuesta = {},
    } = lecturaFoto;

    if (rechazo) {
      return (
        <Alert severity="error" sx={{ mt: 2 }}>
          {rechazo} (casilla «{etiqueta}»)
        </Alert>
      );
    }

    if (vacia) {
      return (
        <Alert severity="info" sx={{ mt: 2 }}>
          La foto «{etiqueta}» no trae ubicación ni fecha. WhatsApp y las redes las borran al
          comprimir: si la foto pasó por ahí, esos datos ya no están y hay que ponerlos a mano.
        </Alert>
      );
    }

    const tomados = [
      aplicados.includes("latitud") ? "la ubicación" : null,
      aplicados.includes("timestamp") ? "la fecha del mapeo" : null,
    ].filter(Boolean);

    if (!tomados.length && !enConflicto.length) return null;

    return (
      <Alert
        severity={enConflicto.length ? "warning" : "success"}
        sx={{ mt: 2 }}
        action={
          enConflicto.length ? (
            <Button size="small" color="inherit" onClick={usarDatosDeLaFoto}>
              Usar los de la foto
            </Button>
          ) : undefined
        }
      >
        {tomados.length > 0 && (
          <>
            De la foto «{etiqueta}» se tomó {tomados.join(" y ")}. Revisalo y ajustalo si hace
            falta.{enConflicto.length ? " " : ""}
          </>
        )}
        {enConflicto.length > 0 && (
          <>
            La foto «{etiqueta}» dice otra cosa en {enConflicto.join(" y ")}
            {propuesta.timestamp && enConflicto.includes("la fecha")
              ? ` (${propuesta.timestamp})`
              : ""}
            . Se deja lo que ya estaba puesto.
          </>
        )}
      </Alert>
    );
  };

  return (
    <Dialog open={abierto} onClose={cerrarSinGuardar} maxWidth="md" fullWidth>
      <DialogTitle>
        {editando ? "Corregir aporte" : `Registrar aporte de ${tipo.etiqueta.toLowerCase()}`}
      </DialogTitle>

      <DialogContent dividers>
        {editando && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Los nombres y el lugar valen para <strong>todos</strong> los monitoreos de este árbol
            y se ven en el mapa público. Las medidas y las fotos son solo de este registro.
          </Alert>
        )}

        <Typography variant="overline" color="text.secondary">Identificación</Typography>
        <Grid container spacing={2} sx={{ mt: 0, mb: 2 }}>
          {camposArbolVisibles.map((campo) => (
            <Grid item xs={12} sm={6} key={campo.nombre}>{campoTexto(campo)}</Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 2 }} />
        <Typography variant="overline" color="text.secondary">Ubicación</Typography>
        <Box sx={{ mt: 1, mb: 2 }}>
          <SelectorUbicacion
            latitud={valores.latitud ?? ""}
            longitud={valores.longitud ?? ""}
            onCambiar={cambiar}
            errores={visibles}
          />
        </Box>

        <Divider sx={{ my: 2 }} />
        <Typography variant="overline" color="text.secondary">Este monitoreo</Typography>
        <Grid container spacing={2} sx={{ mt: 0, mb: 2 }}>
          {tipo.camposMonitoreo.map((campo) => (
            <Grid item xs={12} sm={4} key={campo.nombre}>{campoTexto(campo)}</Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 2 }} />
        <Typography variant="overline" color="text.secondary">Fotos</Typography>
        <Typography
          variant="caption"
          color={visibles[tipo.fotoRequerida] ? "error" : "text.secondary"}
          display="block"
          sx={{ mb: 1 }}
        >
          {visibles[tipo.fotoRequerida]
            ? "La foto del árbol completo es obligatoria: sin ella el registro no se puede verificar."
            : "La foto del árbol completo es obligatoria. JPG, PNG o WebP."}{" "}
          Si la foto viene del teléfono con el GPS encendido, la ubicación y la fecha se
          completan solas.
        </Typography>
        <Box sx={{ mt: 1 }}>
          {identidad && (
            <SubidorFotos
              clavesFoto={tipo.clavesFoto}
              fotos={fotos}
              identidad={identidad}
              onCambiar={cambiarFoto}
              onMetadatos={alLeerMetadatos}
              onRechazo={alRechazarFoto}
              deshabilitado={guardando}
            />
          )}
        </Box>

        {avisoDeLaFoto()}

        {advertencias.length > 0 && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            {advertencias.join(". ")}. Se puede guardar igual.
          </Alert>
        )}

        {errorGeneral && <Alert severity="error" sx={{ mt: 2 }}>{errorGeneral}</Alert>}
      </DialogContent>

      <DialogActions>
        <Button onClick={cerrarSinGuardar} disabled={guardando}>Cancelar</Button>
        <Button onClick={guardar} variant="contained" disabled={guardando}>
          {guardando ? "Guardando…" : editando ? "Guardar cambios" : "Registrar aporte"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FormularioAporte;
