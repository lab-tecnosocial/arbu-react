import React from 'react'
import { useState } from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import Checkbox from '@mui/material/Checkbox';
import FilterAltRoundedIcon from '@mui/icons-material/FilterAltRounded';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Fab from '@mui/material/Fab';

import './FiltroComponent.css'
import { especies } from './especies'
import { useDispatch, useSelector } from 'react-redux';
import { activeArbol, resetFiltro, setArbolSeleccionado, setFiltro } from '../../../actions/mapaActions';
import ToggleSwitch from './ToggleSwitch';
import { IconButton, InputAdornment, InputLabel, OutlinedInput } from '@mui/material';
import { ClearRounded } from '@mui/icons-material';
import { useEffect } from 'react';
especies.sort((a, b) => a.nombreCientifico.toLocaleLowerCase().localeCompare(b.nombreCientifico.toLocaleLowerCase()));

const opcionesRiego = [
  { label: "Con riegos", value: "con" },
  { label: "Sin riegos", value: "sin" }
];

const campos = [
  { label: "Nombre común", value: "nombreComun" },
  { label: "Nombre científico", value: "nombreCientifico" },
  { label: "Nombre propio", value: "nombrePropio" }
];

const opcionesMonitoreo = [
  { label: "Todo el tiempo", value: "todo" },
  { label: "Esta semana", value: "semana" },
  { label: "Último mes", value: "mes" },
  { label: "Últimos 3 meses", value: "3meses" },
  { label: "Personalizado", value: "personalizado" }
]

const FiltroComponent = () => {
  const [showFiltros, setShowFiltros] = useState(true)
  const [riegosSeleccionados, setRiegosSeleccionados] = useState([]);
  const [cantidadRiegos, setCantidadRiegos] = useState("");
  const [cantidadMaximaRiegos, setCantidadMaximaRiegos] = useState("");
  const [monitoreoTipo, setMonitoreoTipo] = useState("todo");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [showFilterWindow, setShowFilterWindow] = useState(false);
  const [especiesEspecificas, setEspeciesEspecificas] = useState([]);
  const [camposSeleccionados, setCamposSeleccionados] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [placeHolder, setPlaceHolder] = useState("Buscar")
  const [startBusqueda, setStartBusqueda] = useState(false)

  const { arbolesFiltrados } = useSelector(state => state.mapa);
  const dispatch = useDispatch();

  const calcularFechasRango = (tipo) => {
    const ahora = new Date();
    const hasta = ahora.getTime();
    let desde = null;

    switch (tipo) {
      case "semana":
        desde = new Date(ahora.setDate(ahora.getDate() - 7)).getTime();
        break;
      case "mes":
        desde = new Date(ahora.setMonth(ahora.getMonth() - 1)).getTime();
        break;
      case "3meses":
        desde = new Date(ahora.setMonth(ahora.getMonth() - 3)).getTime();
        break;
      case "todo":
        desde = null;
        break;
    }

    return { desde, hasta };
  };

  const toggleCampo = (campo) => {
    setCamposSeleccionados((prev) =>
      prev.includes(campo)
        ? prev.filter((c) => c !== campo)
        : [...prev, campo]
    );
  };
  const toggleRiego = (opcion) => {
    setRiegosSeleccionados((prev) =>
      prev.includes(opcion)
        ? prev.filter((r) => r !== opcion)
        : [...prev, opcion]
    );
  };

  const cancel = () => {
    setShowFiltros(busqueda.length || placeHolder.length > 0 ? true : false)
    dispatch(resetFiltro())
    setBusqueda("")
    setStartBusqueda(false)
    setEspeciesEspecificas([])
  };

  const handleClickFilterBtnRound = () => {
    setShowFilterWindow(true);
  }

  const handleCheckBox = (e) => {
    let isChecked = e.target.checked;
    if (isChecked) {
      setEspeciesEspecificas(v => [...v, e.target.value]);
    } else {
      let auxArray = especiesEspecificas.filter(especie => especie !== e.target.value);
      setEspeciesEspecificas(auxArray);
    }
  }

  useEffect(() => {
    if (especiesEspecificas.length > 0) {
      setPlaceHolder(`${especiesEspecificas.length} especies seleccionadas`)
      setBusqueda("")
    } else {
      setPlaceHolder("Buscar")
    }
  }, [especiesEspecificas])

  const handleAplicar = () => {
    let rangoMonitoreo = { tipo: monitoreoTipo, desde: null, hasta: null };

    if (monitoreoTipo === "personalizado") {
      const desdeMs = fechaDesde ? new Date(fechaDesde).getTime() : null;
      const hastaMs = fechaHasta ? new Date(fechaHasta).getTime() : null;
      rangoMonitoreo = {
        tipo: "personalizado",
        desde: desdeMs,
        hasta: hastaMs
      };
    } else {
      rangoMonitoreo = {
        tipo: monitoreoTipo,
        ...calcularFechasRango(monitoreoTipo)
      };
    }
    dispatch(setFiltro({
      busqueda,
      camposSeleccionados,
      riegosSeleccionados,
      monitoreoFiltro: rangoMonitoreo,
      especiesSeleccionadas: especiesEspecificas
    }))
    setShowFiltros(false)
    setStartBusqueda(true)
  }

  return (
    <>
      {
        showFilterWindow === false ?
          <div className='btn-filter-round'>
            <button
              onClick={handleClickFilterBtnRound}
            >
            </button>
            <Fab
              aria-label="add"
              sx={{ backgroundColor: 'white' }}
              onClick={handleClickFilterBtnRound}
            >
              <FilterAltRoundedIcon />
            </Fab>
          </div>
          :
          <div className='filtro-layout' >
            <div className='filtro-buscador'>
              <FormControl fullWidth>
                <InputLabel htmlFor="outlined-adornment-password">{placeHolder}</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  label={placeHolder}
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  fullWidth
                  endAdornment={
                    <InputAdornment position='end'>
                      {busqueda.length > 0 ? <>
                        <IconButton
                          onClick={() => {
                            cancel()
                            dispatch(
                              setArbolSeleccionado(null)
                            )
                          }}
                        >
                          <ClearRounded></ClearRounded>
                        </IconButton>
                      </> : null}
                      {placeHolder !== "Buscar" ? <>
                        <IconButton
                          onClick={() => {
                            cancel()
                            dispatch(
                              setArbolSeleccionado(null)
                            )
                          }}
                        >
                          <ClearRounded></ClearRounded>
                        </IconButton>
                      </> : null}
                    </InputAdornment>
                  }
                />
              </FormControl>
            </div>
            <div className='filtro-groups'>
              <Accordion
                expanded={showFiltros}
                sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', padding: '1rem', border: 'transparent solid 1px', borderRadius: '10px', boxShadow: 'none' }}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: '#03B25E', borderRadius: '50%', backgroundColor: 'white' }} />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                  sx={{ backgroundColor: '#03B25E', border: 'rgba(0,0,0,.5) solid 1px', borderRadius: '6px' }}
                  onClick={() => setShowFiltros(!showFiltros)}
                >
                  <Typography sx={{ color: 'white', fontFamily: `'Poppins',sans-serif` }}>Búsqueda Avanzada</Typography>
                </AccordionSummary>
                <AccordionDetails style={{
                  boxShadow: "none",
                  padding: "1rem 1rem"
                }}>
                  <div className='group-filters'>
                    <FormLabel component="legend">Filtros por campos</FormLabel>
                    {campos.map((campo) => (
                      <FormControlLabel key={campo.value} style={{
                        display: "block"
                      }} control={
                        <Checkbox onChange={() => toggleCampo(campo.value)} style={{
                          color: "#03B25E",
                          padding: "6px 9px",
                        }}
                          value={campo.value}
                          checked={camposSeleccionados.includes(campo.value)}
                        />}
                        label={campo.label}
                      />
                    ))}
                  </div>
                  <div className='group-filters'>
                    <FormLabel component="legend">Filtros por riegos</FormLabel>
                    {opcionesRiego.map((opcion) => (
                      <FormControlLabel key={opcion.value} style={{
                        display: "block"
                      }} control={
                        <Checkbox onChange={() => toggleRiego(opcion.value)} style={{
                          color: "#03B25E",
                          padding: "6px 9px",
                        }}
                          value={opcion.value}
                          checked={riegosSeleccionados.includes(opcion.value)}
                        />}
                        label={opcion.label}
                      />
                    ))}

                    {riegosSeleccionados === "con" && (
                      <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
                        <input
                          type="number"
                          placeholder="Cantidad mínima"
                          value={cantidadRiegos}
                          onChange={(e) => setCantidadRiegos(e.target.value)}
                        />
                        <input
                          type="number"
                          placeholder="Cantidad máxima"
                          value={cantidadMaximaRiegos}
                          onChange={(e) => setCantidadMaximaRiegos(e.target.value)}
                        />
                      </div>
                    )}

                  </div>
                  <div className='group-filters'>
                    <FormLabel component="legend">Filtros por monitoreos</FormLabel>
                    <FormControl>
                      <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue="todo"
                        name="radio-buttons-group"
                      >
                        {opcionesMonitoreo.map((opt) => (
                          <FormControlLabel key={opt.value}
                            value={opt.value}
                            onChange={() => setMonitoreoTipo(opt.value)}
                            control={<Radio style={{
                              color: "#03B25E",
                              padding: "6px 9px",
                            }}
                            />}
                            label={opt.label}
                          />
                        ))}
                      </RadioGroup>
                    </FormControl>

                    {monitoreoTipo === "personalizado" && (
                      <div style={{ marginTop: "0.5rem" }}>
                        <label>
                          Desde:{" "}
                          <input
                            type="date"
                            value={fechaDesde}
                            onChange={(e) => setFechaDesde(e.target.value)}
                          />
                        </label>
                        <label style={{ marginLeft: "1rem" }}>
                          Hasta:{" "}
                          <input
                            type="date"
                            value={fechaHasta}
                            onChange={(e) => setFechaHasta(e.target.value)}
                          />
                        </label>
                      </div>
                    )}
                  </div>

                  <div>
                    <FormLabel component="legend">Filtros por especies</FormLabel>
                    <div style={{ display: 'flex', height: '240px', overflowY: 'auto', flexDirection: 'column' }}>
                      {
                        especies.map(item => (
                          <FormControlLabel key={item?.id}
                            control={
                              <Checkbox
                                onChange={(e) => handleCheckBox(e)}
                                style={{
                                  color: "#03B25E",
                                  padding: "6px 9px",
                                }}
                                value={item.nombreCientifico}
                                checked={especiesEspecificas.includes(item.nombreCientifico)}
                              />}
                            label={item.nombreCientifico}
                          />
                        ))
                      }
                    </div>
                  </div>
                </AccordionDetails>
              </Accordion>
              {arbolesFiltrados.length > 0 ?
                <div className='wrapper-results'>
                  <h3 style={{ fontSize: "1.2rem", padding: "0 1rem" }}>{arbolesFiltrados.length} Resultados</h3>
                  <div className='list'>
                    {arbolesFiltrados.length > 0 && arbolesFiltrados.map((arbol) => {
                      return (
                        <button key={arbol.id} className="row-result" onClick={() => {
                          dispatch(setArbolSeleccionado([arbol.latitud, arbol.longitud]))
                          dispatch(activeArbol(arbol.id, { ...arbol }));
                          // dispatch(loadActiveArbol(arbol));
                          // dispatch(setSelectedPosition([arbol.latitud, arbol.longitud]));
                          // dispatch(setZoomPosition(18));
                        }}>
                          <div className='input-row'>
                            <span className="label">Nombre propio: </span>
                            <span>{arbol.nombrePropio}</span>
                          </div>
                          <div className='input-row'>
                            <span className="label">Nombre cientifico: </span>
                            <span>{arbol.nombreCientifico}</span>
                          </div>
                          <div className='input-row'>
                            <span className="label">Nombre comun: </span>
                            <span>{arbol.nombreComun}</span>
                          </div>
                          <div className='input-row'>
                            <span className="label">Cantidad de riegos: </span>
                            <span>{Object.keys(arbol.riegos).length}</span>
                          </div>
                          <div className='input-row'>
                            <span className="label">Cantidad de monitoreos: </span>
                            <span>{Object.keys(arbol.monitoreos).length}</span>
                          </div>
                          {/* {Object.entries(arbol.riegos).map(([id, riego]) => ( */}
                          {/*   <div className='sub' key={id}> */}
                          {/*     <p> */}
                          {/*       <strong>ID:</strong> {id} */}
                          {/*     </p> */}
                          {/*     <p><strong>Realizado por:</strong> {riego?.riegoRealizadoPor}</p> */}
                          {/*     <p><strong>Fecha:</strong> {new Date(riego?.timestamp.seconds * 1000).toLocaleDateString()}</p> */}
                          {/*   </div> */}
                          {/* ))} */}
                        </button>
                      )
                    })}
                  </div>
                </div>
                :
                startBusqueda ?
                  <h3 style={{ fontSize: "1.1rem", padding: "0 1rem" }}>{arbolesFiltrados.length} Resultados</h3>
                  :
                  null
              }
            </div>
            <div className='filtro-buttons'>
              <Stack spacing={2} direction="row" sx={{ justifyContent: 'center' }}>
                <Button variant="contained" color='success' sx={{ border: '##174C44 solid 1px', backgroundColor: '#268576', color: 'white' }}
                  onClick={handleAplicar}
                >Aplicar</Button>
                <Button className='btn-cancelar' variant="outlined" sx={{ border: '1px solid #174C44', color: '#268576' }}
                  onClick={() => {
                    setShowFilterWindow(false)
                  }}
                >Cerrar</Button>
              </Stack>
            </div>
          </div >
      }
    </>
  )
}

export default FiltroComponent
