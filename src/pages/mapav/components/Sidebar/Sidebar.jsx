import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { Button } from '../../../../components/button/Button';
import styles from './Sidebar.module.css';
import { Radio } from '../../../../components/Radio/Radio';
import { OptionChip } from '../../../../components/OptionChip/OptionChip';
import { Accordion } from '../../../../components/Accordion/Accordion';
import { ResultCard } from '../ResultCard/ResultCard';
import { optionsArbol, optionsCategorias, optionsRiegos, optionsMonitoreos, optionsActividades } from './Utils/filterOptions';
import { especies } from '../../utils/especies';
import { resetMappedTreesActivityFilter, resetPlantedTreesFilter, setActiveMappedTrees, setActivePlantedTrees, setMappedTreesActivityFilter, setPlantedTreesFilter } from '../../../../actions/arboles.actions';
import { Checkbox } from '../../../../components/Checkbox/Checkbox';
import { Input } from '../../../../components/input/Input';

const STORAGE_KEY = 'mapSidebarFilterState';
const STORAGE_TTL_MS = 24 * 60 * 60 * 1000;

export const Sidebar = () => {
  const dispatch = useDispatch();
  const { arbolesPlantados } = useSelector((state) => state.arboles);

  const [search, setSearch] = useState('');
  const [arbolValues, setArbolValues] = useState([]);
  const [selectedCategorias, setSelectedCategorias] = useState('todos');
  const [selectedRiegos, setSelectedRiegos] = useState('');
  const [selectedMonitoreosOption, setSelectedMonitoreosOption] = useState('');
  const [selectedEspecies, setSelectedEspecies] = useState([]);
  const [fechaDesde, setDesde] = useState('');
  const [fechaHasta, setHasta] = useState('');
  const [selectedActividad, setSelectedActividad] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isResultView, setIsResultView] = useState(false);

  const loadSavedFilters = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || !parsed.expires || Date.now() > parsed.expires) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }
      return parsed.value;
    } catch (error) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  };

  const saveFilters = (payload) => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        expires: Date.now() + STORAGE_TTL_MS,
        value: payload,
      })
    );
  };

  const clearSavedFilters = () => {
    localStorage.removeItem(STORAGE_KEY);
  };

  useEffect(() => {
    const saved = loadSavedFilters();
    if (saved) {
      setSearch(saved.search || '');
      setSelectedRiegos(saved.selectedRiegos || '');
      setSelectedMonitoreosOption(saved.selectedMonitoreosOption || saved.selectedMonitoreos?.tipo || '');
      setSelectedEspecies(saved.selectedEspecies || []);
      setSelectedCategorias(saved.selectedCategorias || 'todos');
      setDesde(saved.fechaDesde || '');
      setHasta(saved.fechaHasta || '');
      setSelectedActividad(saved.selectedActividad || '');
      setArbolValues(saved.arbolValues || ['plantados']);
      const savedArboles = saved.arbolValues || ['plantados'];
      dispatch(setActivePlantedTrees(savedArboles.includes('plantados')));
      dispatch(setActiveMappedTrees(savedArboles.includes('mapeados')));
      if (saved.selectedActividad) {
        dispatch(setMappedTreesActivityFilter(saved.selectedActividad));
        dispatch(setActiveMappedTrees(true));
        dispatch(setActivePlantedTrees(false));
      }

      const loadedMonitoreo = saved.selectedMonitoreosRange || (saved.selectedMonitoreosOption || saved.selectedMonitoreos?.tipo
        ? {
            tipo: saved.selectedMonitoreosOption || saved.selectedMonitoreos?.tipo,
            ...calcularFechasRango(saved.selectedMonitoreosOption || saved.selectedMonitoreos?.tipo),
            desde: saved.fechaDesde ? new Date(saved.fechaDesde).getTime() : null,
            hasta: saved.fechaHasta ? new Date(saved.fechaHasta).getTime() : null,
          }
        : null);

      dispatch(
        setPlantedTreesFilter({
          search: saved.search || '',
          selectedCategorias: saved.selectedCategorias || 'todos',
          selectedRiegos: saved.selectedRiegos || '',
          selectedMonitoreos: loadedMonitoreo,
          selectedEspecies: saved.selectedEspecies || [],
        })
      );
      setIsResultView(true);
    }

    const handleResize = () => setIsCollapsed(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [dispatch]);

  const handleToggleArbol = (value) => {
    if (arbolValues.includes(value)) {
      setArbolValues(arbolValues.filter((item) => item !== value));
      if (value === 'plantados') dispatch(setActivePlantedTrees(false));
      if (value === 'mapeados') dispatch(setActiveMappedTrees(false));
    } else {
      setArbolValues([...arbolValues, value]);
      if (value === 'plantados') dispatch(setActivePlantedTrees(true));
      if (value === 'mapeados') dispatch(setActiveMappedTrees(true));
    }
  };

  const handleToggleActividad = (value) => {
    if (selectedActividad === value) {
      setSelectedActividad('');
      dispatch(resetMappedTreesActivityFilter());
      setArbolValues(['plantados']);
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

  const handleCheckBox = (value) => {
    setSelectedEspecies(prev => prev.includes(value) ? prev.filter(e => e !== value) : [...prev, value]);
  };

  const calcularFechasRango = (tipo) => {
    const ahora = new Date();
    let desde = null;
    let hasta = ahora.getTime();

    switch (tipo) {
      case 'estaSemana':
        desde = new Date(ahora.setDate(ahora.getDate() - 7)).getTime();
        break;
      case 'esteMes':
        desde = new Date(ahora.setMonth(ahora.getMonth() - 1)).getTime();
        break;
      case 'hoy':
        desde = new Date(ahora.setDate(ahora.getDate())).getTime();
        break;
      default:
        desde = null;
    }

    return { desde, hasta };
  };

  const getMonitoreoRange = (tipo) => {
    if (!tipo) return null;
    if (tipo === 'personalizado') {
      return {
        tipo: 'personalizado',
        desde: fechaDesde ? new Date(fechaDesde).getTime() : null,
        hasta: fechaHasta ? new Date(fechaHasta).getTime() : null,
      };
    }
    return { tipo, ...calcularFechasRango(tipo) };
  };

  const applyFilters = (override = {}) => {
    const searchValue = override.search ?? search;
    const categoriasValue = override.selectedCategorias ?? selectedCategorias;
    const riegosValue = override.selectedRiegos ?? selectedRiegos;
    const especiesValue = override.selectedEspecies ?? selectedEspecies;
    const monitoreosValue = override.selectedMonitoreos ?? getMonitoreoRange(selectedMonitoreosOption);

    const payload = {
      search: searchValue,
      selectedCategorias: categoriasValue,
      selectedRiegos: riegosValue,
      selectedMonitoreos: monitoreosValue,
      selectedEspecies: especiesValue,
    };

    dispatch(setPlantedTreesFilter(payload));
    if (searchValue || riegosValue || monitoreosValue || especiesValue.length > 0) {
      setIsResultView(true);
    }

    return payload;
  };

  const handleSearchChange = (value) => {
    setSearch(value);
    applyFilters({ search: value });
  };

  const handleAplicar = () => {
    const rangoMonitoreo = getMonitoreoRange(selectedMonitoreosOption);

    const payload = {
      search,
      selectedCategorias,
      selectedRiegos,
      selectedMonitoreos: rangoMonitoreo,
      selectedEspecies,
    };

    dispatch(setPlantedTreesFilter(payload));
    saveFilters({
      search,
      selectedCategorias,
      selectedRiegos,
      selectedMonitoreosOption,
      selectedMonitoreosRange: rangoMonitoreo,
      selectedEspecies,
      fechaDesde,
      fechaHasta,
      selectedActividad,
      arbolValues,
    });
    setIsResultView(true);
  };

  const handleReset = () => {
    setSearch('');
    setArbolValues(['plantados']);
    setSelectedCategorias('todos');
    setSelectedRiegos('');
    setSelectedMonitoreosOption('');
    setSelectedEspecies([]);
    setDesde('');
    setHasta('');
    setSelectedActividad('');
    setIsResultView(false);
    clearSavedFilters();
    dispatch(resetPlantedTreesFilter());
  };

  return (
    <div className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
      <div className={styles.header}>
        <div className={styles.headerActions}>
          <Input
            placeholder="Buscar..."
            size="larger"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            searchIcon
            searchOnClick={handleAplicar}
            closeIcon={search ? true : false}
            closeOnClick={() => handleSearchChange('')}
            fullWidth
          />
          <button className={styles.toggleBtn} onClick={() => setIsCollapsed(!isCollapsed)}>
            {isCollapsed ? <ChevronDown size={24} strokeWidth={1.75} /> : <ChevronUp size={24} strokeWidth={1.75} />}
          </button>
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.rowSidebar}>
          <h3>Árboles</h3>
          <div className={styles.options}>
            {optionsArbol.map(option => (
              <OptionChip key={option.value} onClick={() => handleToggleArbol(option.value)} checked={arbolValues.includes(option.value)}>{option.label}</OptionChip>
            ))}
          </div>
        </div>

        <div className="line"></div>

        {!isResultView ? (
          <>
            <div className={styles.rowSidebar}>
              <h3>Filtros</h3>
              <div className={styles.accordionFilters}>
                <Accordion label={'Buscar en'} isActive={selectedCategorias !== 'todos'}>
                  <div className={styles.inputOptions}>
                    {optionsCategorias.map((option) => (
                      <Radio key={option.value} value={option.label} onClick={() => setSelectedCategorias(option.value)} checked={option.value === selectedCategorias} />
                    ))}
                  </div>
                  <button onClick={() => setSelectedCategorias('todos')} className={`${styles.clearOptions} ${selectedCategorias !== 'todos' ? '' : styles.disabled}`}>
                    <Trash2 size={18} strokeWidth={1.75} />
                    <span>Eliminar filtro</span>
                  </button>
                </Accordion>

                <Accordion label={'Riegos'} isActive={selectedRiegos ? true : false}>
                  <div className={styles.inputOptions}>
                    {optionsRiegos.map((option) => (
                      <Radio key={option.value} value={option.label} onClick={() => setSelectedRiegos(option.value)} checked={option.value === selectedRiegos} />
                    ))}
                  </div>
                  <button onClick={() => setSelectedRiegos('')} className={`${styles.clearOptions} ${selectedRiegos ? '' : styles.disabled}`}>
                    <Trash2 size={18} strokeWidth={1.75} />
                    <span>Eliminar filtro</span>
                  </button>
                </Accordion>

                <Accordion label={'Monitoreos'} isActive={selectedMonitoreosOption ? true : false}>
                  <div className={styles.inputOptions}>
                    {optionsMonitoreos.map((option) => (
                      <Radio key={option.value} value={option.label} onClick={() => setSelectedMonitoreosOption(option.value)} checked={option.value === selectedMonitoreosOption} />
                    ))}
                  </div>
                  <div className={styles.dateInputs}>
                    <Input size="medium" label="Desde" type="date" value={fechaDesde} onChange={(e) => setDesde(e.target.value)} />
                    <Input size="medium" label="Hasta" type="date" value={fechaHasta} onChange={(e) => setHasta(e.target.value)} />
                  </div>
                  <button onClick={() => setSelectedMonitoreosOption('')} className={`${styles.clearOptions} ${selectedMonitoreosOption ? '' : styles.disabled}`}>
                    <Trash2 size={18} strokeWidth={1.75} />
                    <span>Eliminar filtro</span>
                  </button>
                </Accordion>

            <Accordion label={'Especies'} isActive={selectedEspecies.length > 0 ? true : false}>
              <div className={styles.inputOptions}>
                {especies.map((especie) => (
                  <Checkbox key={especie.id} value={especie.nombreCientifico} onClick={() => handleCheckBox(especie.nombreCientifico)} checked={selectedEspecies.includes(especie.nombreCientifico)} />
                ))}
              </div>
              <button onClick={() => setSelectedEspecies([])} className={`${styles.clearOptions} ${selectedEspecies ? styles.disabled : ''}`}>
                <Trash2 size={18} strokeWidth={1.75} />
                <span>Eliminar filtro</span>
              </button>
            </Accordion>

            <div className={styles.rowSidebar}>
              <h3>Actividades pasadas</h3>
              <div className={styles.options}>
                {optionsActividades.map((option) => (
                  <OptionChip key={option.value} fullWidth onClick={() => handleToggleActividad(option.value)} checked={selectedActividad === option.value}>{option.label}</OptionChip>
                ))}
              </div>
            </div>

          </div>
        </div>
      </>
        ) : (
          <div className={styles.resultsPanel}>
            <div className={styles.resultsHeader}>
              <button onClick={() => setIsResultView(false)} className={styles.backButton}>
                <ArrowLeft size={16} /> Volver atrás
              </button>
              <span className={styles.resultsTitle}>Resultados</span>
            </div>

            {arbolesPlantados.filteredData.length > 0 ? (
              <div className={styles.resultsWrapper}>
                {arbolesPlantados.filteredData.map((arbol, i) => <ResultCard index={i} key={arbol.id} arbolData={arbol} />)}
              </div>
            ) : (
              <div className={styles.noResults}>No se encontraron resultados.</div>
            )}
          </div>
        )}

      </div>

      <div className={styles.footer}>
        <Button
          variant="terciary"
          fullWidth
          disabled={!isResultView && !search && !selectedRiegos && (selectedMonitoreosOption === 'todos') && selectedEspecies.length === 0 && !selectedActividad}
          onClick={handleReset}
        >
          Deshacer
        </Button>
        <Button variant="secondary" fullWidth onClick={handleAplicar}>Buscar</Button>
      </div>
    </div>
  );
};
