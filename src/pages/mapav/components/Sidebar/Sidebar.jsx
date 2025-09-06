import { useState } from "react";
import { Input } from "../../../../components/Input/Input"
import { ArrowLeft, Plus, Search, Trash, Trash2, X } from "lucide-react";
import { Button } from "../../../../components/button/Button";
import styles from "./Sidebar.module.css"
import { RadioButton } from "../../../../components/RadioButton/RadioButton";
import { RadioInput } from "../../../../components/RadioInput/RadioInput";
import { Accordion } from "../../../../components/Accordion/Accordion";
import { ResultCard } from "../ResultCard/ResultCard";
import { useDispatch, useSelector } from "react-redux";
import { defaultPlantadosFiltrados, setActiveArbolesPlantados, setFiltroArbolesPlantados, setStartBusqueda } from "../../../../actions/arbolesPlantados.actions";
import { setActiveArbolesMapeados } from "../../../../actions/arbolesMapeados.actions";
import { setActiveGeoScouts } from "../../../../actions/geoScouts.actions";
import { optionsGeo, optionsArbol, optionsCategorias, optionsRiegos, optionsMonitoreos } from "./Utils/filterOptions";
import { especies } from "../../../../components/mapa/filtro/especies";

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

  const { arbolesPlantadosFiltrados, statusSearch } = useSelector((state) => state.arbolesPlantados)

  const handleToggleGeo = (value) => {
    setGeoValues(value)
    if (value === 'normal') {
      dispatch(setActiveGeoScouts(false))
    }
    if (value === 'otbs') {
      dispatch(setActiveGeoScouts(false))
    }
    if (value === 'scouts') {
      dispatch(setActiveGeoScouts(true))
    }
  };

  const handleToggleArbol = (value) => {
    if (arbolValues.includes(value)) {
      setArbolValues(arbolValues.filter((item) => item !== value));
      if (value === 'plantados') dispatch(setActiveArbolesPlantados(false))
      if (value === 'mapeados') dispatch(setActiveArbolesMapeados(false))
    } else {
      setArbolValues([...arbolValues, value]);
      if (value === 'plantados') dispatch(setActiveArbolesPlantados(true))
      if (value === 'mapeados') dispatch(setActiveArbolesMapeados(true))
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

  const handleCheckBox = (e) => {
    let isChecked = e.target.checked;
    if (isChecked) {
      setSelectedEspecies(v => [...v, e.target.value]);
    } else {
      let auxArray = selectedEspecies.filter(especie => especie !== e.target.value);
      setSelectedEspecies(auxArray);
    }
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

    dispatch(setFiltroArbolesPlantados({
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
        {statusSearch && arbolesPlantadosFiltrados.length > 0 &&
          <div className={styles.withResult}>
            <ArrowLeft size={22} strokeWidth={1.75} />
            <button
              onClick={() => dispatch(defaultPlantadosFiltrados())}
            >{arbolesPlantadosFiltrados.length} Resultados
            </button>
          </div>
        }
        {statusSearch && !arbolesPlantadosFiltrados.length > 0 &&
          <div className={styles.withResult}>
            <ArrowLeft size={22} strokeWidth={1.75} />
            <button
              onClick={() => dispatch(defaultPlantadosFiltrados())}
            >Volver
            </button>
          </div>
        }
      </div>
      <div className={styles.body}>
        {!statusSearch && !arbolesPlantadosFiltrados.length > 0 && (
          <>
            <div className={styles.rowSidebar}>
              <h3>Geo Visualización</h3>
              <div className={styles.options}>
                {optionsGeo.map((option) => (
                  <RadioButton
                    key={option.value}
                    onClick={() => {
                      handleToggleGeo(option.value)
                    }}
                    checked={option.value === geoValues}
                  >
                    {option.label}
                  </RadioButton>
                ))}
              </div>
            </div>
            <div className={styles.rowSidebar}>
              <h3>Árboles</h3>
              <div className={styles.options}>
                {optionsArbol.map((option) => (
                  <RadioButton
                    key={option.value}
                    onClick={() => {
                      handleToggleArbol(option.value)
                    }}
                    checked={arbolValues.includes(option.value)}
                  >
                    {option.label}
                  </RadioButton>
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
                      <RadioInput
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
                      <RadioInput
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
                      <RadioInput
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
                  isActive={selectedMonitoreos ? true : false}
                >
                  <div className={styles.inputOptions}>
                    {especies.map((especie) => (
                      <label key={especie.id}>
                        <input
                          key={especie.id}
                          type="checkbox"
                          name=""
                          value={especie.nombreCientifico}
                          checked={selectedEspecies.includes(especie.nombreCientifico)}
                          onChange={(e) => handleCheckBox(e)}
                        />
                        {especie.nombreCientifico}
                      </label>
                    ))}
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

              </div>
            </div>
          </>
        )}

        {statusSearch && arbolesPlantadosFiltrados.length > 0 ?
          <div className={styles.resultsWrapper}>
            {
              arbolesPlantadosFiltrados.map((item) => {
                return (
                  <ResultCard key={item.id} data={item} />
                )
              })
            }
          </div>
          :
          statusSearch && !arbolesPlantadosFiltrados.length > 0 && (
            <>sin resultados</>
          )
        }

      </div>
      <div className={styles.footer}>
        <Button
          variant="terciary"
          fullWidth
          disabled={
            (selectedCategorias || selectedMonitoreos || selectedRiegos) === ""
          }
          onClick={() => {
            setSelectedCategorias("")
            setSelectedMonitoreos("")
            setSelectedRiegos("")
          }}
        >Deshacer</Button>
        <Button variant="secondary" fullWidth onClick={handleAplicar}>Buscar</Button>
      </div>
    </div >
  )
}

