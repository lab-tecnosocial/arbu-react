import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { Button } from "../../../../components/button/Button";
import styles from "./Sidebar.module.css"
import { Radio } from "../../../../components/Radio/Radio";
import { OptionChip } from "../../../../components/OptionChip/OptionChip"
import { Accordion } from "../../../../components/Accordion/Accordion";
import { ResultCard } from "../ResultCard/ResultCard";
import {
  optionsArbol,
  optionsCategorias,
  optionsRiegos,
  optionsMonitoreos,
  MONITOREO_PERSONALIZADO,
} from "./Utils/filterOptions";
import { especies } from "../../utils/especies";
import {
  mostrarArbolesMapeados,
  resetPlantedTreesFilter,
  setActivePlantedTrees,
  setPlantedTreesFilter,
} from "../../../../actions/arboles.actions";
import {
  clearCampania,
  limpiarCampaniaSeleccionada,
  selectCampania,
} from "../../../../actions/campanias.actions";
import {
  selectCampaniaSeleccionadaId,
  selectCampaniasActivas,
  selectCampaniasLoading,
  selectCampaniasPasadas,
} from "../../../../selectors/campanias";
import { selectArbolesCargando } from "../../../../selectors/arboles";
import { Skeleton } from "../../../../components/Skeleton/Skeleton";
import { ESTADO_CAMPANIA } from "../../../../helpers/campanias/campaniaModel";
import { Checkbox } from "../../../../components/Checkbox/Checkbox";
import { Input } from "../../../../components/input/Input";

export const Sidebar = () => {
  const dispatch = useDispatch()
  const [search, setSearch] = useState("");
  const [arbolValues, setArbolValues] = useState(["plantados"]);
  const [selectedCategorias, setSelectedCategorias] = useState("");
  const [selectedRiegos, setSelectedRiegos] = useState("");
  const [selectedMonitoreos, setSelectedMonitoreos] = useState("");
  const [selectedEspecies, setSelectedEspecies] = useState([])
  const [fechaDesde, setDesde] = useState("");
  const [fechaHasta, setHasta] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);

  const { arbolesPlantados } = useSelector((state) => state.arboles)
  const campaniasActivas = useSelector(selectCampaniasActivas);
  const campaniasPasadas = useSelector(selectCampaniasPasadas);
  const campaniaSeleccionadaId = useSelector(selectCampaniaSeleccionadaId);
  const campaniasCargando = useSelector(selectCampaniasLoading);
  const arbolesCargando = useSelector(selectArbolesCargando);

  useEffect(() => {
    const handleResize = () => {
      setIsCollapsed(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleToggleArbol = (value) => {
    if (arbolValues.includes(value)) {
      setArbolValues(arbolValues.filter((item) => item !== value));
      if (value === 'plantados') dispatch(setActivePlantedTrees(false))
      if (value === 'mapeados') {
        dispatch(mostrarArbolesMapeados(false))
        if (campaniaSeleccionadaId) dispatch(limpiarCampaniaSeleccionada());
      }
    } else {
      if (campaniaSeleccionadaId) dispatch(limpiarCampaniaSeleccionada());
      setArbolValues([...arbolValues, value]);
      if (value === 'plantados') dispatch(setActivePlantedTrees(true))
      if (value === 'mapeados') dispatch(mostrarArbolesMapeados(true))
    }
  };

  // La coreografía de capas vive en los thunks, no aquí.
  const handleToggleCampania = (id) => {
    if (campaniaSeleccionadaId === id) {
      dispatch(clearCampania());
      setArbolValues(["plantados"]);
      return;
    }
    dispatch(selectCampania(id));
    setArbolValues(["mapeados"]);
  };

  const handleCheckBox = (value) => {
    setSelectedEspecies(prev =>
      prev.includes(value)
        ? prev.filter((especie) => especie !== value)
        : [...prev, value]
    )
  }

  const hayFiltros =
    Boolean(search.trim()) ||
    Boolean(selectedCategorias) ||
    Boolean(selectedRiegos) ||
    Boolean(selectedMonitoreos) ||
    selectedEspecies.length > 0;

  const handleAplicar = () => {
    const monitoreo =
      selectedMonitoreos === MONITOREO_PERSONALIZADO
        ? {
          tipo: MONITOREO_PERSONALIZADO,
          desde: fechaDesde ? new Date(`${fechaDesde}T00:00:00`).getTime() : null,
          hasta: fechaHasta ? new Date(`${fechaHasta}T23:59:59.999`).getTime() : null,
        }
        : { tipo: selectedMonitoreos, desde: null, hasta: null };

    dispatch(setPlantedTreesFilter({
      texto: search,
      campo: selectedCategorias,
      riego: selectedRiegos,
      monitoreo,
      especies: selectedEspecies,
    }))
  }

  const handleDeshacer = () => {
    setSearch("");
    setSelectedCategorias("");
    setSelectedMonitoreos("");
    setSelectedRiegos("");
    setSelectedEspecies([]);
    setDesde("");
    setHasta("");
    dispatch(resetPlantedTreesFilter());
  };

  // Un solo bloque: las que están en curso primero, con su distintivo, y
  // debajo las que ya terminaron.
  const actividades = [...campaniasActivas, ...campaniasPasadas];

  const hayResultados = arbolesPlantados.visibleData.length > 0;

  return (
    <div
      className={`${styles.sidebar} 
        ${isCollapsed ? styles.collapsed : ""}`}
    >
      <div className={styles.header}>
        <div className={styles.headerActions}>
          <Input
            placeholder="Buscar..."
            size="larger"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            searchIcon
            searchOnClick={handleAplicar}
            closeIcon={search ? true : false}
            closeOnClick={() => setSearch("")}
            fullWidth
          />
          <button className={styles.toggleBtn}
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <ChevronDown size={24} strokeWidth={1.75} /> : <ChevronUp size={24} strokeWidth={1.75} />}
          </button>
        </div>

        {arbolesPlantados.isSearching &&
          <div className={styles.withResult}>
            <ArrowLeft size={22} strokeWidth={1.75} />
            <button onClick={handleDeshacer}>
              {hayResultados ? `${arbolesPlantados.visibleData.length} Resultados` : "Volver"}
            </button>
          </div>
        }
      </div>
      <div className={styles.body}>
        {!arbolesPlantados.isSearching && (
          <>
            <div className={styles.rowSidebar}>
              <h3>Árboles</h3>
              <div className={styles.options}>
                {optionsArbol.map((option) => (
                  <OptionChip
                    key={option.value}
                    control="checkbox"
                    onClick={() => handleToggleArbol(option.value)}
                    checked={arbolValues.includes(option.value)}
                  >
                    {option.label}
                  </OptionChip>
                ))}
              </div>
            </div>
            <div className="line"></div>
            <div className={styles.rowSidebar}>
              <h3>Filtros</h3>
              <div className={styles.accordionFilters}>
                <Accordion
                  label={"Categorias"}
                  isActive={Boolean(selectedCategorias)}
                >
                  <div className={styles.inputOptions}>
                    {optionsCategorias.map((option) => (
                      <Radio
                        key={option.value}
                        value={option.label}
                        onClick={() => setSelectedCategorias(option.value)}
                        checked={option.value === selectedCategorias}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => setSelectedCategorias("")}
                    disabled={!selectedCategorias}
                    className={`${styles.clearOptions} ${selectedCategorias ? styles.clearActive : ""}`}
                  >
                    <Trash2 size={18} strokeWidth={1.75} />
                    <span>Eliminar filtro</span>
                  </button>
                </Accordion>
                <Accordion
                  label={"Riegos"}
                  isActive={Boolean(selectedRiegos)}
                >
                  <div className={styles.inputOptions}>
                    {optionsRiegos.map((option) => (
                      <Radio
                        key={option.value}
                        value={option.label}
                        onClick={() => setSelectedRiegos(option.value)}
                        checked={option.value === selectedRiegos}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => setSelectedRiegos("")}
                    disabled={!selectedRiegos}
                    className={`${styles.clearOptions} ${selectedRiegos ? styles.clearActive : ""}`}
                  >
                    <Trash2 size={18} strokeWidth={1.75} />
                    <span>Eliminar filtro</span>
                  </button>
                </Accordion>
                <Accordion
                  label={"Monitoreos"}
                  isActive={Boolean(selectedMonitoreos)}
                >
                  <div className={styles.inputOptions}>
                    {optionsMonitoreos.map((option) => (
                      <Radio
                        key={option.value}
                        value={option.label}
                        onClick={() => setSelectedMonitoreos(option.value)}
                        checked={option.value === selectedMonitoreos}
                      />
                    ))}
                  </div>
                  <div className={styles.dateInputs}>
                    <Input
                      size="medium"
                      label="Desde"
                      type="date"
                      value={fechaDesde}
                      onChange={(e) => {
                        setDesde(e.target.value);
                        setSelectedMonitoreos(MONITOREO_PERSONALIZADO);
                      }}
                    />
                    <Input
                      size="medium"
                      label="Hasta"
                      type="date"
                      value={fechaHasta}
                      onChange={(e) => {
                        setHasta(e.target.value);
                        setSelectedMonitoreos(MONITOREO_PERSONALIZADO);
                      }}
                    />
                  </div>
                  <button
                    onClick={() => {
                      setSelectedMonitoreos("");
                      setDesde("");
                      setHasta("");
                    }}
                    disabled={!selectedMonitoreos}
                    className={`${styles.clearOptions} ${selectedMonitoreos ? styles.clearActive : ""}`}
                  >
                    <Trash2 size={18} strokeWidth={1.75} />
                    <span>Eliminar filtro</span>
                  </button>
                </Accordion>
                <Accordion
                  label={"Especies"}
                  isActive={selectedEspecies.length > 0}
                >
                  <div className={styles.inputOptions}>
                    {especies.map((especie) => (
                      <Checkbox
                        key={especie.id}
                        value={especie.nombreCientifico}
                        onClick={() => handleCheckBox(especie.nombreCientifico)}
                        checked={selectedEspecies.includes(especie.nombreCientifico)}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => setSelectedEspecies([])}
                    disabled={selectedEspecies.length === 0}
                    className={`${styles.clearOptions} ${selectedEspecies.length > 0 ? styles.clearActive : ""}`}
                  >
                    <Trash2 size={18} strokeWidth={1.75} />
                    <span>Eliminar filtro</span>
                  </button>
                </Accordion>

              </div>
            </div>
            {campaniasCargando && (
              <div className={styles.rowSidebar} role="status" aria-label="Cargando actividades">
                <h3>Actividades</h3>
                <div className={`${styles.options} ${styles.optionsColumna}`}>
                  <Skeleton height={48} radius="var(--br-medium)" />
                  <Skeleton height={48} radius="var(--br-medium)" />
                </div>
              </div>
            )}
            {!campaniasCargando && actividades.length > 0 && (
              <div className={styles.rowSidebar}>
                <h3>Actividades</h3>
                <div className={`${styles.options} ${styles.optionsColumna}`}>
                  {actividades.map((campania) => (
                    <OptionChip
                      key={campania.id}
                      fullWidth
                      onClick={() => handleToggleCampania(campania.id)}
                      checked={campaniaSeleccionadaId === campania.id}
                    >
                      {campania.nombre}
                      {campania.estado === ESTADO_CAMPANIA.ACTIVA ? (
                        <span className={`${styles.chipEstado} ${styles.chipEnCurso}`}>
                          En curso
                        </span>
                      ) : (
                        <span className={`${styles.chipEstado} ${styles.chipConcluido}`}>
                          Concluido
                        </span>
                      )}
                    </OptionChip>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {arbolesPlantados.isSearching && (
          hayResultados ? (
            <div className={styles.resultsWrapper}>
              {arbolesPlantados.visibleData.map((arbol, i) => (
                <ResultCard index={i} key={arbol.id} arbolData={arbol} />
              ))}
            </div>
          ) : (
            <>sin resultados</>
          )
        )}

      </div>
      <div className={styles.footer}>
        <Button
          variant="terciary"
          fullWidth
          disabled={!hayFiltros}
          onClick={handleDeshacer}
        >Deshacer</Button>
        <Button
          variant="secondary"
          fullWidth
          isLoading={arbolesCargando}
          onClick={handleAplicar}
        >Buscar</Button>
      </div>
    </div >
  )
}
