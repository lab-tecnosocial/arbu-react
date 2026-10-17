import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

import { loadArboles } from "../helpers/loadArboles";
import { loadArbolesMapeados } from "../helpers/loadArbolesMapeados";
import { loadUsuarios } from "../helpers/loadUsuarios";
import { loadCampaniaPorId } from "../helpers/campanias/loadCampanias";
import { registrosDeTodasLasFuentes } from "../helpers/campanias/registros";
import { evaluarRegistros } from "../helpers/campanias/evaluarRegistro";
import { detectarDuplicados } from "../helpers/campanias/detectarDuplicados";
import { aplicarRevisiones } from "../helpers/campanias/revisiones";
import { calcularRanking } from "../helpers/campanias/calcularRanking";
import {
  cargarParticipantes,
  cargarRevisiones,
} from "../helpers/campanias/revisionOperations";
import { parseFechaLocal, toInputDate } from "../helpers/fechaArbol";

const ConcursoContext = createContext(null);

export const useConcurso = () => {
  const ctx = useContext(ConcursoContext);
  if (!ctx) throw new Error("useConcurso debe usarse dentro de ConcursoProvider");
  return ctx;
};

export const ConcursoProvider = ({ campaniaId, children }) => {
  const { user } = useSelector((state) => state.auth);

  const [campania, setCampania] = useState(null);
  // Las dos colecciones de árboles: lo mapeado desde Android y lo adoptado
  // desde iOS. Ambas participan en la campaña (ver `campanias/origenArbol.js`).
  const [fuentes, setFuentes] = useState({ mapeados: [], plantados: [] });
  const [usuarios, setUsuarios] = useState(new Map());
  const [revisiones, setRevisiones] = useState({});
  const [participantes, setParticipantes] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Vista: permiten mirar FUERA del filtro de la campaña, que es lo que la
  // vista pública no hace. Sin esto, un aporte mal etiquetado o registrado un
  // día antes se pierde sin que nadie se entere. ---
  const [ventana, setVentana] = useState(null); // {desde, hasta} como "YYYY-MM-DD"
  const [incluirFueraDeVentana, setIncluirFueraDeVentana] = useState(false);
  const [incluirSinEspecie, setIncluirSinEspecie] = useState(true);

  const recargar = useCallback(async () => {
    if (!campaniaId) return;
    setLoading(true);
    setError(null);
    try {
      const [camp, mapeados, plantados, usrs, revs, parts] = await Promise.all([
        loadCampaniaPorId(campaniaId),
        loadArbolesMapeados(),
        loadArboles(),
        loadUsuarios(),
        cargarRevisiones(campaniaId),
        cargarParticipantes(campaniaId),
      ]);
      setCampania(camp);
      setFuentes({ mapeados, plantados });
      setUsuarios(new Map(usrs.map((u) => [u.id, u])));
      setRevisiones(revs);
      setParticipantes(parts);
      if (camp && !ventana) {
        setVentana({
          desde: toInputDate(camp.fechaInicio),
          hasta: toInputDate(camp.fechaFin),
        });
      }
    } catch (e) {
      console.error("[concurso] error al cargar:", e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [campaniaId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    recargar();
  }, [recargar]);

  /** La campaña con la ventana que el panel esté mirando ahora mismo. */
  const campaniaEfectiva = useMemo(() => {
    if (!campania) return null;
    if (!ventana) return campania;

    return {
      ...campania,
      fechaInicio: incluirFueraDeVentana ? null : parseFechaLocal(ventana.desde),
      fechaFin: incluirFueraDeVentana
        ? null
        : parseFechaLocal(ventana.hasta, { finDeDia: true }),
    };
  }, [campania, ventana, incluirFueraDeVentana]);

  const duplicados = useMemo(() => {
    if (!campaniaEfectiva) return { gruposSospechosos: [], porArbol: {}, gruposCompartidos: [], flagsParticipante: {} };
    return detectarDuplicados(registrosDeTodasLasFuentes(fuentes, campaniaEfectiva), {
      radioMetros: campania?.reglas?.duplicados?.radioMetros ?? 15,
      ventanaHoras: campania?.reglas?.duplicados?.ventanaHoras ?? 6,
    });
  }, [fuentes, campaniaEfectiva, campania]);

  const registros = useMemo(() => {
    if (!campaniaEfectiva) return [];
    const base = registrosDeTodasLasFuentes(fuentes, campaniaEfectiva);
    const evaluados = evaluarRegistros(base, { porArbol: duplicados.porArbol });
    const finales = aplicarRevisiones(evaluados, revisiones, participantes);
    return incluirSinEspecie ? finales : finales.filter((r) => r.motivos.especieAdmitida);
  }, [fuentes, campaniaEfectiva, duplicados, revisiones, participantes, incluirSinEspecie]);

  const ranking = useMemo(
    () =>
      calcularRanking(registros, {
        usuarios,
        criterioDesempate1: campania?.reglas?.criterioDesempate1,
      }),
    [registros, usuarios, campania]
  );

  const valor = useMemo(
    () => ({
      campania,
      campaniaEfectiva,
      fuentes,
      usuarios,
      revisiones,
      participantes,
      registros,
      ranking,
      duplicados,
      loading,
      error,
      recargar,
      usuarioActual: user?.email ?? null,
      ventana,
      setVentana,
      incluirFueraDeVentana,
      setIncluirFueraDeVentana,
      incluirSinEspecie,
      setIncluirSinEspecie,
      setRevisiones,
      setParticipantes,
    }),
    [
      campania, campaniaEfectiva, fuentes, usuarios, revisiones, participantes,
      registros, ranking, duplicados, loading, error, recargar, user,
      ventana, incluirFueraDeVentana, incluirSinEspecie,
    ]
  );

  return <ConcursoContext.Provider value={valor}>{children}</ConcursoContext.Provider>;
};
