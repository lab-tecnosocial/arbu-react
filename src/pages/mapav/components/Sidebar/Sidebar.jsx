import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft, Trash2 } from "lucide-react";
import { Button } from "../../../../components/button/Button";
import styles from "./Sidebar.module.css"
import { Radio } from "../../../../components/Radio/Radio";
import { OptionChip } from "../../../../components/OptionChip/OptionChip"
import { Accordion } from "../../../../components/Accordion/Accordion";
import { ResultCard } from "../ResultCard/ResultCard";
import { optionsGeo, optionsArbol, optionsCategorias, optionsRiegos, optionsMonitoreos } from "./Utils/filterOptions";
import { especies } from "../../utils/especies";
import { resetPlantedTreesFilter, setActiveMappedTrees, setActivePlantedTrees, setPlantedTreesFilter } from "../../../../actions/arboles.actions";
import { setGeoMode } from "../../../../actions/mapaActions";
import { Checkbox } from "../../../../components/Checkbox/Checkbox";
import { Input } from "../../../../components/input/Input";

export const Sidebar = () => {
  const dispatch = useDispatch()
  const [search, setSearch] = useState("");
  const [geoValues, setGeoValues] = useState("normal");
  const [arbolValues, setArbolValues] = useState(["plantados"]);
  const [selectedCategorias, setSelectedCategorias] = useState("");
  const [selectedRiegos, setSelectedRiegos] = useState("");
  const [selectedMonitoreos, setSelectedMonitoreos] = useState("");
  const [selectedEspecies, setSelectedEspecies] = useState([])
  const [fechaDesde, setDesde] = useState("");
  const [fechaHasta, setHasta] = useState("");

  const { arbolesPlantados } = useSelector((state) => state.arboles)

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

  const handleToggleArbol = (value) => {
    if (arbolValues.includes(value)) {
      setArbolValues(arbolValues.filter((item) => item !== value));
      if (value === 'plantados') dispatch(setActivePlantedTrees(false))
      if (value === 'mapeados') dispatch(setActiveMappedTrees(false))
    } else {
      setArbolValues([...arbolValues, value]);
      if (value === 'plantados') dispatch(setActivePlantedTrees(true))
      if (value === 'mapeados') dispatch(setActiveMappedTrees(true))
    }
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
  };

  const handleCheckBox = (value) => {
    setSelectedEspecies(prev =>
      prev.includes(value)
        ? prev.filter((especie) => especie !== value)
        : [...prev, value]
    )
  }

  const handleAplicar = () => {

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
    dispatch(setPlantedTreesFilter({
      search,
      selectedCategorias,
      selectedRiegos,
      selectedMonitoreos: rangoMonitoreo
      // especiesSeleccionadas: especiesEspecificas
    }))
  }

  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <Input
          placeholder="Buscar..."
          size="larger"
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          searchIcon
          searchOnClick={handleAplicar}
          closeIcon={search ? true : false}
          closeOnClick={() => setSearch("")}
        />
        {arbolesPlantados.isSearching && arbolesPlantados.filteredData.length > 0 &&
          <div className={styles.withResult}>
            <ArrowLeft size={22} strokeWidth={1.75} />
            <button
              onClick={() => dispatch(resetPlantedTreesFilter())}
            >{arbolesPlantados.filteredData.length} Resultados
            </button>
          </div>
        }
        {arbolesPlantados.isSearching && !arbolesPlantados.filteredData.length > 0 &&
          <div className={styles.withResult}>
            <ArrowLeft size={22} strokeWidth={1.75} />
            <button
              onClick={() => dispatch(resetPlantedTreesFilter())}
            >Volver
            </button>
          </div>
        }
      </div>
      <div className={styles.body}>
        {!arbolesPlantados.isSearching && !arbolesPlantados.filteredData.length > 0 && (
          <>
            <div className={styles.rowSidebar}>
              <h3>Geo Visualización</h3>
              <div className={styles.options}>
                {optionsGeo.map((option) => (
                  <OptionChip
                    key={option.value}
                    onClick={() => {
                      handleToggleGeo(option.value)
                    }}
                    checked={option.value === geoValues}
                  >
                    {option.label}
                  </OptionChip>
                ))}
              </div>
            </div>
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
            (selectedCategorias || selectedMonitoreos || selectedRiegos) === "" && selectedEspecies.length === 0
          }
          onClick={() => {
            setSelectedCategorias("")
            setSelectedMonitoreos("")
            setSelectedRiegos("")
            setSelectedEspecies([])
          }}
        >Deshacer</Button>
        <Button variant="secondary" fullWidth onClick={handleAplicar}>Buscar</Button>
      </div>
    </div >
  )
}

