<<<<<<< HEAD
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { Button } from "../../../../components/button/Button";
import styles from "./Sidebar.module.css";
import { Radio } from "../../../../components/Radio/Radio";
import { OptionChip } from "../../../../components/OptionChip/OptionChip";
import { Accordion } from "../../../../components/Accordion/Accordion";
import { ResultCard } from "../ResultCard/ResultCard";
import { optionsGeo, optionsArbol, optionsCategorias, optionsRiegos, optionsMonitoreos } from "./Utils/filterOptions";
import { especies } from "../../utils/especies";
import { resetPlantedTreesFilter, setActiveMappedTrees, setActivePlantedTrees, setPlantedTreesFilter } from "../../../../actions/arboles.actions";
=======
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Trash2 } from "lucide-react";
import { Button } from "../../../../components/button/Button";
import styles from "./Sidebar.module.css"
import { Radio } from "../../../../components/Radio/Radio";
import { OptionChip } from "../../../../components/OptionChip/OptionChip"
import { Accordion } from "../../../../components/Accordion/Accordion";
import { ResultCard } from "../ResultCard/ResultCard";
import { optionsGeo, optionsArbol, optionsCategorias, optionsRiegos, optionsMonitoreos, optionsActividades } from "./Utils/filterOptions";
import { especies } from "../../utils/especies";
import { resetMappedTreesActivityFilter, resetPlantedTreesFilter, setActiveMappedTrees, setActivePlantedTrees, setMappedTreesActivityFilter, setPlantedTreesFilter } from "../../../../actions/arboles.actions";
>>>>>>> a7d307769a044f360211c87a4837a02a1d6945d8
import { setGeoMode } from "../../../../actions/mapaActions";
import { Checkbox } from "../../../../components/Checkbox/Checkbox";
import { Input } from "../../../../components/input/Input";

<<<<<<< HEAD
const STORAGE_KEY = "mapa.plantedTreesFilter";
const STORAGE_TTL_MS = 24 * 60 * 60 * 1000;

const defaultMonitoreoState = () => ({
  tipo: "",
  desde: null,
  hasta: null,
});

const saveFilterState = (state) => {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      expiresAt: Date.now() + STORAGE_TTL_MS,
      state,
    })
  );
};

const loadFilterState = () => {
  if (typeof window === "undefined") return null;

  const rawValue = window.localStorage.getItem(STORAGE_KEY);
  if (!rawValue) return null;

  try {
    const parsed = JSON.parse(rawValue);

    if (!parsed?.expiresAt || parsed.expiresAt < Date.now()) {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return parsed.state ?? null;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

const buildMonitoreoFilter = (selectedMonitoreos, fechaDesde, fechaHasta) => {
  if (selectedMonitoreos === "personalizado" || selectedMonitoreos === "rango de fechas") {
    return {
      tipo: "personalizado",
      desde: fechaDesde ? new Date(fechaDesde).getTime() : null,
      hasta: fechaHasta ? new Date(fechaHasta).getTime() : null,
    };
  }

  if (!selectedMonitoreos || selectedMonitoreos === "todos") {
    return defaultMonitoreoState();
  }

  return {
    tipo: selectedMonitoreos,
    ...calcularFechasRango(selectedMonitoreos),
  };
};

export const Sidebar = () => {
  const dispatch = useDispatch();
=======
export const Sidebar = () => {
  const dispatch = useDispatch()
>>>>>>> a7d307769a044f360211c87a4837a02a1d6945d8
  const [search, setSearch] = useState("");
  const [geoValues, setGeoValues] = useState("normal");
  const [arbolValues, setArbolValues] = useState(["plantados"]);
  const [selectedCategorias, setSelectedCategorias] = useState("");
  const [selectedRiegos, setSelectedRiegos] = useState("");
  const [selectedMonitoreos, setSelectedMonitoreos] = useState("");
<<<<<<< HEAD
  const [selectedEspecies, setSelectedEspecies] = useState([]);
  const [fechaDesde, setDesde] = useState("");
  const [fechaHasta, setHasta] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [persistedFilters, setPersistedFilters] = useState(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [hasRestoredSearch, setHasRestoredSearch] = useState(false);
  const { arbolesPlantados, arbolesMapeados } = useSelector((state) => state.arboles);
=======
  const [selectedEspecies, setSelectedEspecies] = useState([])
  const [fechaDesde, setDesde] = useState("");
  const [fechaHasta, setHasta] = useState("");
  const [selectedActividad, setSelectedActividad] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);

  const { arbolesPlantados } = useSelector((state) => state.arboles)
>>>>>>> a7d307769a044f360211c87a4837a02a1d6945d8

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
      else {
        setIsCollapsed(false);
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

<<<<<<< HEAD
  useEffect(() => {
    const storedFilters = loadFilterState();

    if (storedFilters) {
      setSearch(storedFilters.search ?? "");
      setGeoValues(storedFilters.geoValues ?? "normal");
      setArbolValues(storedFilters.arbolValues?.length ? storedFilters.arbolValues : ["plantados"]);
      setSelectedCategorias(storedFilters.selectedCategorias ?? "");
      setSelectedRiegos(storedFilters.selectedRiegos ?? "");
      setSelectedMonitoreos(storedFilters.selectedMonitoreos ?? "");
      setSelectedEspecies(storedFilters.selectedEspecies ?? []);
      setDesde(storedFilters.fechaDesde ?? "");
      setHasta(storedFilters.fechaHasta ?? "");
      setPersistedFilters(storedFilters);
      setIsFilterApplied(Boolean(storedFilters.isSearching));
    } else {
      setIsFilterApplied(false);
    }

    setHasRestoredSearch(!storedFilters?.isSearching);
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    saveFilterState({
      search,
      geoValues,
      arbolValues,
      selectedCategorias,
      selectedRiegos,
      selectedMonitoreos,
      selectedEspecies,
      fechaDesde,
      fechaHasta,
      isSearching: isFilterApplied,
    });
  }, [
    arbolValues,
    fechaDesde,
    fechaHasta,
    geoValues,
    isFilterApplied,
    isHydrated,
    search,
    selectedCategorias,
    selectedEspecies,
    selectedMonitoreos,
    selectedRiegos,
  ]);

  useEffect(() => {
    dispatch(setGeoMode(geoValues));
  }, [dispatch, geoValues]);

  useEffect(() => {
    if (
      !persistedFilters?.isSearching ||
      hasRestoredSearch ||
      arbolesPlantados.loading ||
      arbolesMapeados.loading ||
      (!arbolesPlantados.data?.length && !arbolesMapeados.data?.length)
    ) {
      return;
    }

    dispatch(
      setPlantedTreesFilter({
        search: persistedFilters.search ?? "",
        selectedCategorias: persistedFilters.selectedCategorias ?? "",
        selectedRiegos: persistedFilters.selectedRiegos ?? "",
        selectedMonitoreos: buildMonitoreoFilter(
          persistedFilters.selectedMonitoreos,
          persistedFilters.fechaDesde,
          persistedFilters.fechaHasta
        ),
        selectedEspecies: persistedFilters.selectedEspecies ?? [],
      })
    );

    setHasRestoredSearch(true);
  }, [
    arbolesPlantados.loading,
    arbolesMapeados.loading,
    arbolesPlantados.data?.length,
    arbolesMapeados.data?.length,
    dispatch,
    hasRestoredSearch,
    persistedFilters,
  ]);

  useEffect(() => {
    dispatch(setActivePlantedTrees(arbolValues.includes("plantados")));
    dispatch(setActiveMappedTrees(arbolValues.includes("mapeados")));
  }, [arbolValues, dispatch]);
=======
  const handleToggleGeo = (value) => {
    setGeoValues(value)
    if (value === 'normal') {
      dispatch(setGeoMode("normal"))
    }
    if (value === 'otbs') {
      dispatch(setGeoMode("otbs"))
    }
    if (value === 'scouts') {
      dispatch(setGeoMode("scouts"))
    }
  };

  const clearActivityFilter = () => {
    setSelectedActividad("");
    dispatch(resetMappedTreesActivityFilter());
  };
>>>>>>> a7d307769a044f360211c87a4837a02a1d6945d8

  const handleToggleArbol = (value) => {
    if (arbolValues.includes(value)) {
      setArbolValues(arbolValues.filter((item) => item !== value));
<<<<<<< HEAD
    } else {
      setArbolValues([...arbolValues, value]);
    }
  };

  const calcularFechasRango = (tipo) => {
    const ahora = new Date();
    const hasta = new Date(ahora);
    hasta.setHours(23, 59, 59, 999);
    let desde = null;
    let hastaMs = hasta.getTime();

    switch (tipo) {
      case "estaSemana":
        desde = new Date(ahora);
        desde.setDate(desde.getDate() - 7);
        desde.setHours(0, 0, 0, 0);
        desde = desde.getTime();
        break;
      case "esteMes":
        desde = new Date(ahora.getFullYear(), ahora.getMonth(), 1).getTime();
        break;
      case "hoy":
        desde = new Date(ahora);
        desde.setHours(0, 0, 0, 0);
        desde = desde.getTime();
        break;
      case "todo":
        desde = null;
        hastaMs = null;
        break;
    }

    return { desde, hasta};
=======
      if (value === 'plantados') dispatch(setActivePlantedTrees(false))
      if (value === 'mapeados') {
        dispatch(setActiveMappedTrees(false))
        if (selectedActividad) clearActivityFilter();
      }
    } else {
      if (selectedActividad) clearActivityFilter();
      setArbolValues([...arbolValues, value]);
      if (value === 'plantados') dispatch(setActivePlantedTrees(true))
      if (value === 'mapeados') dispatch(setActiveMappedTrees(true))
    }
  };

  const handleToggleActividad = (value) => {
    if (selectedActividad === value) {
      clearActivityFilter();
      setArbolValues(["plantados"]);
      dispatch(setActivePlantedTrees(true));
      dispatch(setActiveMappedTrees(false));
      return;
    }

    setSelectedActividad(value);
    dispatch(setMappedTreesActivityFilter(value));
    setArbolValues([]);
    dispatch(setActivePlantedTrees(false));
    dispatch(setActiveMappedTrees(true));
  };

  const calcularFechasRango = (tipo) => {
    const ahora = new Date();
    const hasta = ahora.getTime();
    let desde = null;

    switch (tipo) {
      case "estaSemana":
        desde = new Date(ahora.setDate(ahora.getDate() - 7)).getTime();
        break;
      case "esteMes":
        desde = new Date(ahora.setMonth(ahora.getMonth() - 1)).getTime();
        break;
      case "hoy":
        desde = new Date(ahora.setMonth(ahora.getMonth() - 3)).getTime();
        break;
      case "todo":
        desde = null;
        break;
    }

    return { desde, hasta };
>>>>>>> a7d307769a044f360211c87a4837a02a1d6945d8
  };

  const handleCheckBox = (value) => {
    setSelectedEspecies(prev =>
      prev.includes(value)
        ? prev.filter((especie) => especie !== value)
        : [...prev, value]
    )
  }

  const handleAplicar = () => {
<<<<<<< HEAD
    const rangoMonitoreo = buildMonitoreoFilter(selectedMonitoreos, fechaDesde, fechaHasta);
    setIsFilterApplied(true);

=======

    let rangoMonitoreo = { tipo: selectedMonitoreos, desde: null, hasta: null };

    if (selectedMonitoreos === "rango de fechas") {
      const desdeMs = fechaDesde ? new Date(fechaDesde).getTime() : null;
      const hastaMs = fechaHasta ? new Date(fechaHasta).getTime() : null;
      rangoMonitoreo = {
        tipo: "rango de fechas",
        desde: desdeMs,
        hasta: hastaMs
      };
    } else {
      rangoMonitoreo = {
        tipo: selectedMonitoreos,
        ...calcularFechasRango(selectedMonitoreos)
      };
    }
>>>>>>> a7d307769a044f360211c87a4837a02a1d6945d8
    dispatch(setPlantedTreesFilter({
      search,
      selectedCategorias,
      selectedRiegos,
<<<<<<< HEAD
      selectedMonitoreos: rangoMonitoreo,
      selectedEspecies,
    }));
  };

  const handleReset = () => {
    const defaultArbolValues = ["plantados"];

    setSearch("");
    setGeoValues("normal");
    setArbolValues(defaultArbolValues);
    setSelectedCategorias("");
    setSelectedRiegos("");
    setSelectedMonitoreos("");
    setSelectedEspecies([]);
    setDesde("");
    setHasta("");
    setIsFilterApplied(false);

    dispatch(resetPlantedTreesFilter());
  };

  const handleBackToFilters = () => {
    dispatch(resetPlantedTreesFilter());
  };
=======
      selectedMonitoreos: rangoMonitoreo
      // especiesSeleccionadas: especiesEspecificas
    }))
  }
>>>>>>> a7d307769a044f360211c87a4837a02a1d6945d8

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

        {arbolesPlantados.isSearching && arbolesPlantados.filteredData.length > 0 &&
          <div className={styles.withResult}>
<<<<<<< HEAD
            <button
              type="button"
              onClick={handleBackToFilters}
              style={{ display: "flex", alignItems: "center", gap: "8px", color: "inherit", font: "inherit" }}
            >
              <ArrowLeft size={22} strokeWidth={1.75} />
              <span>Volver atrás ({arbolesPlantados.filteredData.length} Resultados)</span>
=======
            <ArrowLeft size={22} strokeWidth={1.75} />
            <button
              onClick={() => dispatch(resetPlantedTreesFilter())}
            >{arbolesPlantados.filteredData.length} Resultados
>>>>>>> a7d307769a044f360211c87a4837a02a1d6945d8
            </button>
          </div>
        }
        {arbolesPlantados.isSearching && !arbolesPlantados.filteredData.length > 0 &&
          <div className={styles.withResult}>
<<<<<<< HEAD
            <button
              type="button"
              onClick={handleBackToFilters}
              style={{ display: "flex", alignItems: "center", gap: "8px", color: "inherit", font: "inherit" }}
            >
              <ArrowLeft size={22} strokeWidth={1.75} />
              <span>Volver atrás</span>
=======
            <ArrowLeft size={22} strokeWidth={1.75} />
            <button
              onClick={() => dispatch(resetPlantedTreesFilter())}
            >Volver
>>>>>>> a7d307769a044f360211c87a4837a02a1d6945d8
            </button>
          </div>
        }
      </div>
      <div className={styles.body}>
        {!arbolesPlantados.isSearching && !arbolesPlantados.filteredData.length > 0 && (
          <>
<<<<<<< HEAD
            {/*<div className={styles.rowSidebar}>
=======
            <div className={styles.rowSidebar}>
>>>>>>> a7d307769a044f360211c87a4837a02a1d6945d8
              <h3>Geo Visualización</h3>
              <div className={styles.options}>
                {optionsGeo.map((option) => (
                  <OptionChip
                    key={option.value}
<<<<<<< HEAD
                    onClick={() => setGeoValues(option.value)}
=======
                    onClick={() => {
                      handleToggleGeo(option.value)
                    }}
>>>>>>> a7d307769a044f360211c87a4837a02a1d6945d8
                    checked={option.value === geoValues}
                  >
                    {option.label}
                  </OptionChip>
                ))}
              </div>
            </div>
<<<<<<< HEAD
            */}
=======
>>>>>>> a7d307769a044f360211c87a4837a02a1d6945d8
            <div className={styles.rowSidebar}>
              <h3>Árboles</h3>
              <div className={styles.options}>
                {optionsArbol.map((option) => (
                  <OptionChip
                    key={option.value}
                    onClick={() => {
                      handleToggleArbol(option.value)
                    }}
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
<<<<<<< HEAD
                {/* 
=======
>>>>>>> a7d307769a044f360211c87a4837a02a1d6945d8
                <Accordion
                  label={"Categorias"}
                  isActive={selectedCategorias ? true : false}
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
                    onClick={() => {
                      setSelectedCategorias("")
                    }}
                    className={`${styles.clearOptions} ${selectedCategorias ? styles.disabled : ""}`}
                  >
                    <Trash2 size={18} strokeWidth={1.75} />
                    <span>Eliminar filtro</span>
                  </button>
                </Accordion>
<<<<<<< HEAD
                */}
=======
>>>>>>> a7d307769a044f360211c87a4837a02a1d6945d8
                <Accordion
                  label={"Riegos"}
                  isActive={selectedRiegos ? true : false}
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
                    onClick={() => {
                      setSelectedRiegos("")
                    }}
                    className={`${styles.clearOptions} ${selectedRiegos ? styles.disabled : ""}`}
                  >
                    <Trash2 size={18} strokeWidth={1.75} />
                    <span>Eliminar filtro</span>
                  </button>
                </Accordion>
                <Accordion
                  label={"Monitoreos"}
                  isActive={selectedMonitoreos ? true : false}
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
                      onChange={(e) => setDesde(e.target.value)}
                    />
                    <Input
                      size="medium"
                      label="Hasta"
                      type="date"
                      value={fechaHasta}
                      onChange={(e) => setHasta(e.target.value)}
                    />
                  </div>
                  <button
                    onClick={() => {
                      setSelectedMonitoreos("")
                    }}
                    className={`${styles.clearOptions} ${selectedMonitoreos ? styles.disabled : ""}`}
                  >
                    <Trash2 size={18} strokeWidth={1.75} />
                    <span>Eliminar filtro</span>
                  </button>
                </Accordion>
                <Accordion
                  label={"Especies"}
                  isActive={selectedEspecies.length > 0 ? true : false}
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
                    onClick={() => {
                      setSelectedEspecies([])
                    }}
                    className={`${styles.clearOptions} ${selectedEspecies ? styles.disabled : ""}`}
                  >
                    <Trash2 size={18} strokeWidth={1.75} />
                    <span>Eliminar filtro</span>
                  </button>
                </Accordion>

              </div>
            </div>
<<<<<<< HEAD
=======
            <div className={styles.rowSidebar}>
              <h3>Actividades pasadas</h3>
              <div className={styles.options}>
                {optionsActividades.map((option) => (
                  <OptionChip
                    key={option.value}
                    fullWidth
                    onClick={() => handleToggleActividad(option.value)}
                    checked={selectedActividad === option.value}
                  >
                    {option.label}
                  </OptionChip>
                ))}
              </div>
            </div>
>>>>>>> a7d307769a044f360211c87a4837a02a1d6945d8
          </>
        )}

        {arbolesPlantados.isSearching && arbolesPlantados.filteredData.length > 0 ?
          <div className={styles.resultsWrapper}>
            {
              arbolesPlantados.filteredData.map((arbol, i) => {
                return (
                  <ResultCard index={i} key={arbol.id} arbolData={arbol} />
                )
              })
            }
          </div>
          :
          arbolesPlantados.isSearching && !arbolesPlantados.filteredData.length > 0 && (
            <>sin resultados</>
          )
        }

      </div>
      <div className={styles.footer}>
        <Button
          variant="terciary"
          fullWidth
          disabled={
<<<<<<< HEAD
            !search && !selectedCategorias && !selectedMonitoreos && !selectedRiegos && selectedEspecies.length === 0
          }
          onClick={handleReset}
=======
            (selectedCategorias || selectedMonitoreos || selectedRiegos) === "" && selectedEspecies.length === 0
          }
          onClick={() => {
            setSelectedCategorias("")
            setSelectedMonitoreos("")
            setSelectedRiegos("")
            setSelectedEspecies([])
          }}
>>>>>>> a7d307769a044f360211c87a4837a02a1d6945d8
        >Deshacer</Button>
        <Button variant="secondary" fullWidth onClick={handleAplicar}>Buscar</Button>
      </div>
    </div >
  )
}

