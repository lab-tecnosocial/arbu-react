import React from 'react'
import { useState } from 'react';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import FilterAltRoundedIcon from '@mui/icons-material/FilterAltRounded';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Fab from '@mui/material/Fab';
import './FiltroVarianteComponent.css'
import { useDispatch, useSelector } from 'react-redux';
import { filterArboles, resetFiltro, setBusqueda, setFilter, setFiltro, setShowArbolesMapeados, setShowArbolesPlantados } from '../../../actions/mapaActions';
import { FormGroup, IconButton, InputAdornment, InputLabel, OutlinedInput } from '@mui/material';
import { CleaningServicesOutlined, ClearRounded } from '@mui/icons-material';
// import { Box, Tab, TabContext, TabList, TabPanel } from '@mui/material'
// import Box from '@mui/material/Box';
// import Tab from '@mui/material/Tab';
// import TabContext from '@mui/lab/TabContext';
// import TabList from '@mui/lab/TabList';
// import TabPanel from '@mui/lab/TabPanel';

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

const FiltroVarianteComponent = ({ geoData }) => {
  const [currentTab, setCurrentTab] = useState(1)
  const [showFiltros, setShowFiltros] = useState(true)
  const [riegosSeleccionados, setRiegosSeleccionados] = useState(["con", "sin"]);

  const [cantidadRiegos, setCantidadRiegos] = useState("");
  const [cantidadMaximaRiegos, setCantidadMaximaRiegos] = useState("");

  const [monitoreoSeleccionado, setMonitoreoSeleccionado] = useState("todo");

  const [monitoreoTipo, setMonitoreoTipo] = useState("todo");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");

  const {
    arbolesFiltrados,
    showArbolesPlantados,
    showArbolesMapeados
  } = useSelector(state => state.mapa);

  const [showFilterWindow, setShowFilterWindow] = useState(false);
  const [especiesEspecificas, setEspeciesEspecificas] = useState([]);
  const dispatch = useDispatch();

  const [camposSeleccionados, setCamposSeleccionados] = useState([
    "nombreComun",
    "nombreCientifico",
    "nombrePropio"
  ]);
  const [busqueda, setBusqueda] = useState("");
  const [value, setValue] = React.useState('1');

  console.log(geoData)
  const grupos = geoData.features.map((feature) => feature.properties["GRUPO SCOUT"]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

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
  const handleBuscar = async () => {
    // const queryParams = new URLSearchParams();
    // // Filtro por campo
    // if (valorCampo.trim() !== "") {
    //   if (campoSeleccionado === "todos") {
    //     queryParams.append("buscar", valorCampo.trim());
    //   } else {
    //     queryParams.append(campoSeleccionado, valorCampo.trim());
    //   }
    // }
    //
    // // Filtro por existencia de riegos
    // if (riegosSeleccionado === "con") {
    //   queryParams.append("tieneRiegos", "true");
    //   if (cantidadRiegos) {
    //     queryParams.append("minRiegos", cantidadRiegos);
    //   }
    //   if (cantidadMaximaRiegos) {
    //     queryParams.append("maxRiegos", cantidadMaximaRiegos);
    //   }
    // }
    //
    // // Filtro por monitoreos
    // if (monitoreoSeleccionado === "hoy") {
    //   const today = new Date();
    //   today.setHours(0, 0, 0, 0);
    //   queryParams.append("desde", today.toISOString());
    // } else if (monitoreoSeleccionado === "30") {
    //   const desde = new Date();
    //   desde.setDate(desde.getDate() - 30);
    //   queryParams.append("desde", desde.toISOString());
    // } else if (monitoreoSeleccionado === "60") {
    //   const desde = new Date();
    //   desde.setDate(desde.getDate() - 60);
    //   queryParams.append("desde", desde.toISOString());
    // } else if (monitoreoSeleccionado === "personalizado") {
    //   if (fechaDesde) queryParams.append("desde", new Date(fechaDesde).toISOString());
    //   if (fechaHasta) queryParams.append("hasta", new Date(fechaHasta).toISOString());
    // }
    //
    // // // Filtros por cantidad
    // // if (cantidadRiegos) {
    // //   queryParams.append("minRiegos", cantidadRiegos);
    // // }
    // //
    // // if (cantidadMaximaRiegos) {
    // //   queryParams.append("maxRiegos", cantidadMaximaRiegos);
    // // }
    //
    // try {
    //   const res = await fetch(`http://localhost:8111/arboles-plantados/buscar?${queryParams.toString()}`);
    //   const json = await res.json();
    //   // setDatos(json);
    // } catch (err) {
    //   console.error("Error al obtener árboles:", err);
    // }
  };

  const cancel = () => {
    setShowFiltros(busqueda.length > 0 ? true : false)
    dispatch(resetFiltro())
    setBusqueda("")
    // setValorCampo("")
    // dispatch(setSelectedPosition(null));
    // dispatch(setZoomPosition(13));
  };

  const handleClickFilterBtnRounds = () => {
    setShowFilterWindow(true);
  }

  const handleCheckBox = (e) => {
    let isChecked = e.target.checked;
    if (isChecked) {
      // console.log(e.target.value);
      setEspeciesEspecificas(v => [...v, e.target.value]);
    } else {
      // console.log(e.target.value);
      let auxArray = especiesEspecificas.filter(especie => especie !== e.target.value);
      setEspeciesEspecificas(auxArray);
    }
  }

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
      monitoreoFiltro:
        rangoMonitoreo
    }))
    setShowFiltros(false)
  }

  return (
    <>
      {
        showFilterWindow === false ?
          <div className='btn-filter-round-variant'>
            <Fab
              aria-label="add"
              sx={{ backgroundColor: 'white' }}
              onClick={handleClickFilterBtnRounds}>
              <FilterAltRoundedIcon />
            </Fab>
          </div>
          :
          <div className='filtro-layout' >
            <div className='filtro-tabs'>
              <button
                style={currentTab === 1 ? { borderBottom: "2px solid #1976d2" } : {}}
                onClick={() => setCurrentTab(1)}>OTB</button>
              <button
                style={currentTab === 2 ? { borderBottom: "2px solid #1976d2" } : {}}
                onClick={() => setCurrentTab(2)}>Scouts</button>
            </div>
            {currentTab === 1 &&
              <>
                <div className='filtro-buscador'>

                  <FormControl fullWidth>
                    <InputLabel htmlFor="outlined-adornment-password">Buscar</InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-password"
                      label='Buscar'
                      value={busqueda}
                      onChange={(e) => setBusqueda(e.target.value)}
                      fullWidth
                      endAdornment={
                        <InputAdornment position='end'>
                          {busqueda.length > 0 ? <>
                            <IconButton onClick={cancel}>
                              <ClearRounded></ClearRounded>
                            </IconButton>
                          </> : null}
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={showArbolesPlantados}
                          onClick={() => dispatch(setShowArbolesPlantados(!showArbolesPlantados))}
                        />}
                      label="Arboles Plantados" />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={showArbolesMapeados}
                          onClick={() => dispatch(setShowArbolesMapeados(!showArbolesMapeados))}
                        />}
                      label="Arboles Mapeados" />
                  </FormGroup>

                </div>
                <div className='filtro-groups'>
                  <Accordion
                    expanded={showFiltros}
                    style={{
                      boxShadow: "none",
                      borderBottom: "1px solid rgba(0,0,0,0.2)",
                      borderBottomLeftRadius: "0px",
                      borderBottomRightRadius: "0px"
                    }}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1-content"
                      id="panel1-header"
                      style={{
                        height: "64px",
                        padding: "1rem"
                      }}
                      onClick={() => setShowFiltros(!showFiltros)}
                    >
                      <h2 style={{ fontSize: "1.2rem" }}>Filtrar Busqueda</h2>
                      {/* <Typography component="legend">Filtrar busqueda</Typography> */}
                    </AccordionSummary>
                    <AccordionDetails style={{
                      boxShadow: "none",
                      padding: "0px 1rem"
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
                      {/*   </AccordionDetails> */}
                      {/* </Accordion> */}
                      {/* <Accordion sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', marginTop: '10px', border: 'transparent solid 1px', borderRadius: '10px', boxShadow: 'none' }}> */}
                      {/*   <AccordionSummary */}
                      {/*     expandIcon={<ExpandMoreIcon sx={{ color: '#03B25E', borderRadius: '50%', backgroundColor: 'white' }} />} */}
                      {/*     aria-controls="panel1a-content" */}
                      {/*     id="panel1a-header" */}
                      {/*     sx={{ backgroundColor: '#03B25E', border: '#174C44 solid 1px', borderRadius: '10px' }} */}
                      {/*   > */}
                      {/*     <Typography sx={{ color: 'white', fontFamily: `'Poppins',sans-serif` }}>Filtro por Riegos</Typography> */}
                      {/*   </AccordionSummary> */}
                      {/*   <AccordionDetails > */}
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
                      {/*   </AccordionDetails> */}
                      {/* </Accordion> */}

                      {/* <Accordion sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', marginTop: '10px', border: 'transparent solid 1px', borderRadius: '10px', boxShadow: 'none' }}> */}
                      {/*   <AccordionSummary */}
                      {/*     expandIcon={<ExpandMoreIcon sx={{ color: '#03B25E', borderRadius: '50%', backgroundColor: 'white' }} />} */}
                      {/*     aria-controls="panel1a-content" */}
                      {/*     id="panel1a-header" */}
                      {/*     sx={{ backgroundColor: '#03B25E', border: '#174C44 solid 1px', borderRadius: '10px' }} */}
                      {/*   > */}
                      {/*     <Typography sx={{ color: 'white', fontFamily: `'Poppins',sans-serif` }}>Filtro por Monitoreos</Typography> */}
                      {/*   </AccordionSummary> */}
                      {/*   <AccordionDetails > */}

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

                      {/* <div> */}
                      {/*   <FormLabel component="legend">Filtros por especies</FormLabel> */}
                      {/*   <div style={{ display: 'flex', height: '240px', overflowY: 'auto', flexDirection: 'column' }}> */}
                      {/*     { */}
                      {/*       especies.map(item => ( */}
                      {/*         <FormControlLabel key={item?.id} control={ */}
                      {/*           <Checkbox onChange={handleCheckBox} style={{ */}
                      {/*             color: "#03B25E", */}
                      {/*             padding: "6px 9px", */}
                      {/*           }} */}
                      {/*             value={item.nombreCientifico} */}
                      {/*             checked={especiesEspecificas.includes(item.nombreCientifico)} */}
                      {/*           />} */}
                      {/*           label={item.nombreCientifico} */}
                      {/*         /> */}
                      {/*       )) */}
                      {/*     } */}
                      {/*   </div> */}
                      {/* </div> */}
                    </AccordionDetails>
                  </Accordion>
                  {/* <Accordion sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', marginTop: '10px', border: 'transparent solid 1px', borderRadius: '10px', boxShadow: 'none' }}> */}
                  {/*   <AccordionSummary */}
                  {/*     expandIcon={<ExpandMoreIcon sx={{ color: '#03B25E', borderRadius: '50%', backgroundColor: 'white' }} />} */}
                  {/*     aria-controls="panel1a-content" */}
                  {/*     id="panel1a-header" */}
                  {/*     sx={{ backgroundColor: '#03B25E', border: '#174C44 solid 1px', borderRadius: '10px' }} */}
                  {/*   > */}
                  {/*     <Typography sx={{ color: 'white', fontFamily: `'Poppins',sans-serif` }}>Filtro por nombres</Typography> */}
                  {/*   </AccordionSummary> */}
                  {/*   <AccordionDetails > */}

                  {/*   </AccordionDetails> */}
                  {/* </Accordion> */}

                  {/* <button onClick={handleBubscar}>Buscar</button> */}
                  {/* <button onClick={cancel}>Borrar Filtros</button> */}
                  {/* <ToggleSwitch */}
                  {/*     id="nativas" */}
                  {/*     checked={nativas} */}
                  {/*     onChange={handleSwitchNew} */}
                  {/*     optionLabels={['Nativas','Nativas']} */}
                  {/*     name="Nativa" */}
                  {/*   /> */}
                  {/**/}
                  {/* <ToggleSwitch */}
                  {/*   id="introducidas" */}
                  {/*   checked={introducidas} */}
                  {/*   onChange={handleSwitchNew} */}
                  {/*   optionLabels={['Introducidas','Introducidas']} */}
                  {/*   name="Introducida" */}
                  {/* /> */}

                  {/* <FormControlLabel
          value="start"
          control={<Switch color="primary" onChange={handleSwitch} value="Nativa" checked={nativas} />}
          label="Nativas"
          labelPlacement="start"
        />
        <br />
      <FormControlLabel
          value="start"
          control={<Switch color="primary" onChange={handleSwitch} value="Introducida" checked={introducidas}/>}
          label="Introducidas"
          labelPlacement="start"
        /> */}

                  {/* <Accordion sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', marginTop: '10px', border: 'transparent solid 1px', borderRadius: '10px', boxShadow: 'none' }}> */}
                  {/*   <AccordionSummary */}
                  {/**/}
                  {/*     expandIcon={<ExpandMoreIcon sx={{ color: '#03B25E', borderRadius: '50%', backgroundColor: 'white' }} />} */}
                  {/*     aria-controls="panel1a-content" */}
                  {/*     id="panel1a-header" */}
                  {/*     sx={{ backgroundColor: '#03B25E', border: '#174C44 solid 1px', borderRadius: '10px' }} */}
                  {/*   > */}
                  {/*     <Typography sx={{ color: 'white', fontFamily: `'Poppins',sans-serif` }}>Especies específicas</Typography> */}
                  {/*   </AccordionSummary> */}
                  {/*   <AccordionDetails > */}

                  {/*   </AccordionDetails> */}
                  {/* </Accordion> */}
                  {
                    grupos ?
                      <div className='wrapper-results'>
                        <h3
                          style={{ fontSize: "1.2rem", padding: "1rem 1rem" }}
                        >
                          {grupos.length} ZONAS
                        </h3>
                        <div className='list'>
                          {grupos.map((grupo, index) => (
                            <button key={index} className='row-result'>{grupo}</button>
                          ))}
                        </div>
                      </div>
                      : null
                  }

                  {arbolesFiltrados.length > 0 ?
                    <div className='wrapper-results'>
                      <h3 style={{ fontSize: "1.2rem", padding: "1rem 1rem" }}>{arbolesFiltrados.length} Resultados</h3>
                      <div className='list'>
                        {arbolesFiltrados.length > 0 && arbolesFiltrados.map((arbol) => {
                          return (
                            <button key={arbol.id} className="row-result" onClick={() => {
                              dispatch(loadActiveArbol(arbol));
                              dispatch(setSelectedPosition([arbol.latitud, arbol.longitud]));
                              dispatch(setZoomPosition(18));
                            }}>
                              <div className='input-row'><span className="label">Nombre propio: </span> {arbol.nombrePropio}</div>
                              <div className='input-row'><span className="label">Nombre cientifico: </span> {arbol.nombreCientifico}</div>
                              <div className='input-row'><span className="label">Nombre comun: </span> {arbol.nombreComun}</div>
                              <div className='input-row'><span className="label">Cantidad de riegos: </span> {Object.keys(arbol.riegos).length}</div>
                              <div className='input-row'><span className="label">Cantidad de monitoreos: </span> {Object.keys(arbol.monitoreos).length}</div>

                              {Object.entries(arbol.riegos).map(([id, riego]) => (
                                <div key={id}>
                                  <p><strong>ID:</strong> {id}</p>
                                  <p><strong>Realizado por:</strong> {riego?.riegoRealizadoPor}</p>
                                  <p><strong>Fecha:</strong> {new Date(riego?.timestamp.seconds * 1000).toLocaleDateString()}</p>
                                </div>
                              ))}
                            </button>
                          )
                        })}
                      </div>
                    </div>
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
                      onClick={() => setShowFilterWindow(false)}
                    >Cerrar</Button>
                  </Stack>
                </div>
              </>}
            {currentTab === 2 && <></>}

            {/* <div className="toggle-switch">d</div> */}
          </div >
      }

    </>
  )
}

export default FiltroVarianteComponent
