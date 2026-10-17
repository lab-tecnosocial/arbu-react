import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import {
  PARAM_ACTIVIDAD,
  buscarCampaniaPorParametro,
  parametroDeCampania,
} from "../../../helpers/campanias/enlaceCampania";
import { selectCampania } from "../../../actions/campanias.actions";
import {
  selectCampaniaSeleccionadaId,
  selectCampaniasPublicas,
} from "../../../selectors/campanias";

/**
 * La actividad elegida vive también en la URL, en los dos sentidos.
 *
 *  - **URL → mapa**: entrar por `/mapa?actividad=…` abre el mapa ya puesto en
 *    esa actividad, con sus dos capas encendidas. Es lo que permite compartir
 *    "el mapa de la primavera" por WhatsApp sin explicar nada.
 *  - **mapa → URL**: tocar una actividad reescribe la barra de direcciones, así
 *    que compartir es copiar lo que ya se está viendo. Sin esto habría que
 *    construir el enlace a mano y nadie lo haría.
 *
 * Se usa `replace` y no `push`: cada toque de un chip no es un paso de
 * navegación, y con `push` el botón Atrás tendría que deshacer diez filtros
 * antes de salir del mapa.
 *
 * El enlace entrante se aplica **una sola vez**. Si no, al quitar la actividad
 * volvería a ponerse sola en el siguiente render y el chip sería imposible de
 * apagar.
 */
export const useActividadEnUrl = () => {
  const dispatch = useDispatch();
  const [params, setParams] = useSearchParams();

  const campanias = useSelector(selectCampaniasPublicas);
  const seleccionadaId = useSelector(selectCampaniaSeleccionadaId);

  const pedida = params.get(PARAM_ACTIVIDAD);
  const enlaceAplicado = useRef(false);

  // URL → mapa. Las campañas llegan por red, así que esto espera a que haya
  // alguna: resolver contra una lista vacía daría "no existe" siempre.
  useEffect(() => {
    if (enlaceAplicado.current || !pedida || campanias.length === 0) return;

    enlaceAplicado.current = true;
    const campania = buscarCampaniaPorParametro(campanias, pedida);
    if (campania) dispatch(selectCampania(campania.id));
  }, [pedida, campanias, dispatch]);

  // mapa → URL. Se escribe solo cuando el valor cambia de verdad; escribir en
  // cada render dispararía una navegación por render.
  useEffect(() => {
    if (pedida && !enlaceAplicado.current) return;

    const seleccionada = campanias.find((c) => c.id === seleccionadaId) ?? null;
    const valor = seleccionada ? parametroDeCampania(seleccionada) : null;
    const actual = params.get(PARAM_ACTIVIDAD);
    if (valor === actual) return;

    // Una campaña seleccionada que todavía no está en la lista (o que se borró)
    // no debe borrar el parámetro del enlace con el que alguien acaba de entrar.
    if (!valor && seleccionadaId) return;

    const siguientes = new URLSearchParams(params);
    if (valor) siguientes.set(PARAM_ACTIVIDAD, valor);
    else siguientes.delete(PARAM_ACTIVIDAD);

    setParams(siguientes, { replace: true });
  }, [seleccionadaId, campanias, params, pedida, setParams]);
};
