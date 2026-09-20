import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  Alert, Box, Container, Snackbar, Tab, Tabs, Typography,
} from "@mui/material";
import { TIPO_MAPEO } from "../../helpers/aportes/tiposAporte";
import { filasDeAportes } from "../../helpers/aportes/listadoAportes";
import { leerArbol } from "../../helpers/aportes/escrituraArbol";
import { loadArbolesMapeados } from "../../helpers/loadArbolesMapeados";
import ListaAportes from "./ListaAportes";
import FormularioAporte from "./FormularioAporte";
import ImportarAportes from "./ImportarAportes";

/**
 * Aportes: registrar, corregir e importar.
 *
 * Existe porque hasta ahora un árbol solo podía nacer desde las apps móviles.
 * Todo lo que llegaba por otra vía —una jornada anotada en papel, fotos por
 * WhatsApp, un lote de una institución— no tenía puerta de entrada, y un
 * registro con la ubicación mal puesta no tenía quien lo arreglara.
 *
 * Se lee siempre del servidor (sin ventana de frescura): estos datos se van a
 * editar, y editar sobre una copia de hace media hora es pisar el trabajo de
 * otro.
 */
const Aportes = () => {
  const { user } = useSelector((state) => state.auth);

  const [pestania, setPestania] = useState(0);
  const [arboles, setArboles] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [aviso, setAviso] = useState(null);
  const [edicion, setEdicion] = useState(null);
  const [creando, setCreando] = useState(false);

  const autor = useMemo(
    () => (user ? { uid: user.uid, email: user.email } : null),
    [user]
  );

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      setArboles(await loadArbolesMapeados());
    } catch (error) {
      setAviso({ texto: `No se pudieron cargar los aportes: ${error.message}`, severity: "error" });
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  const filas = useMemo(() => filasDeAportes(arboles), [arboles]);

  // El árbol en edición se vuelve a buscar por id tras recargar: guardar el
  // objeto dejaría el formulario mostrando los datos de antes de guardar.
  const arbolEnEdicion = useMemo(
    () => (edicion ? arboles.find((a) => a.id === edicion.arbolId) ?? null : null),
    [arboles, edicion]
  );

  /**
   * Refresca SOLO el árbol que se acaba de tocar.
   *
   * Recargar la colección entera tras cada guardado costaría más de 3.000
   * lecturas facturadas por aporte. Firestore cobra por documento: se pide el
   * que cambió y se sustituye en la lista que ya está en memoria.
   */
  const alGuardar = async (mensaje, arbolId) => {
    setAviso(mensaje);
    if (!arbolId) return;

    const actualizado = await leerArbol(TIPO_MAPEO, arbolId);
    if (!actualizado) return;

    setArboles((prev) => {
      const i = prev.findIndex((a) => a.id === arbolId);
      if (i === -1) return [actualizado, ...prev];
      const copia = [...prev];
      copia[i] = actualizado;
      return copia;
    });
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontFamily: "Poppins", fontWeight: "bold", mb: 0.5 }}>
        Aportes
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Registrá aportes que no entraron por la app, corregí los que están incompletos e importá
        planillas. Todo queda anotado con quién lo hizo.
      </Typography>

      <Tabs value={pestania} onChange={(_, v) => setPestania(v)} sx={{ mb: 2 }}>
        <Tab label="Registrar y corregir" sx={{ textTransform: "none", fontFamily: "Poppins" }} />
        <Tab label="Importar planilla" sx={{ textTransform: "none", fontFamily: "Poppins" }} />
      </Tabs>

      {pestania === 0 && (
        <ListaAportes
          filas={filas}
          cargando={cargando}
          onNuevo={() => setCreando(true)}
          onEditar={(fila) => setEdicion({ arbolId: fila.arbolId, monitoreoKey: fila.monitoreoKey })}
          onRecargar={cargar}
        />
      )}

      {pestania === 1 && (
        <ImportarAportes
          tipo={TIPO_MAPEO}
          autor={autor}
          onImportado={cargar}
          onAviso={setAviso}
        />
      )}

      <FormularioAporte
        abierto={creando}
        tipo={TIPO_MAPEO}
        arbol={null}
        monitoreoKey={null}
        autor={autor}
        onCerrar={() => setCreando(false)}
        onGuardado={alGuardar}
      />

      {arbolEnEdicion && (
        <FormularioAporte
          abierto
          tipo={TIPO_MAPEO}
          arbol={arbolEnEdicion}
          monitoreoKey={edicion.monitoreoKey}
          autor={autor}
          onCerrar={() => setEdicion(null)}
          onGuardado={alGuardar}
        />
      )}

      <Snackbar
        open={Boolean(aviso)}
        autoHideDuration={6000}
        onClose={() => setAviso(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        {aviso ? (
          <Alert severity={aviso.severity} onClose={() => setAviso(null)} sx={{ width: "100%" }}>
            {aviso.texto}
          </Alert>
        ) : undefined}
      </Snackbar>
    </Container>
  );
};

export default Aportes;
