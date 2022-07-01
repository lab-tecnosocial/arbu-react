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

import Checkbox from '@mui/material/Checkbox';
import FilterAltRoundedIcon from '@mui/icons-material/FilterAltRounded';


import Fab from '@mui/material/Fab';

import './FiltroComponent.css'
import {especies} from './especies'
import { useDispatch,useSelector } from 'react-redux';
import { filterArboles, setFilter } from '../../../actions/mapaActions';
import ToggleSwitch from './ToggleSwitch';
especies.sort((a, b) => a.nombreCientifico.toLocaleLowerCase().localeCompare(b.nombreCientifico.toLocaleLowerCase()));

const FiltroComponent = () => {
  const [showFilterWindow, setShowFilterWindow] = useState(false);
  const [nativas, setNativas] = useState(false);
  const [introducidas, setIntroducidas] = useState(false);
  const [especiesEspecificas, setEspeciesEspecificas] = useState([]);
  const dispatch = useDispatch();
  const {arboles} = useSelector(state=>state.mapa);
  // console.log(especies);
  const handleClickFilterBtnRound = () => {
    setShowFilterWindow(true);
  }
  const handleCheckBox=(e)=>{
    let isChecked = e.target.checked;
    if(isChecked){
      // console.log(e.target.value);
       setEspeciesEspecificas(v=>[...v,e.target.value]);
    }else{
      // console.log(e.target.value);
      let auxArray = especiesEspecificas.filter(especie=>especie !== e.target.value);
      setEspeciesEspecificas(auxArray);
    }
  }
  const handleSwitch = (e) => {
    let isOn = e.target.checked;
    if(isOn){
      //solo nativas o introducidas, objetos Especie
      let auxEspeciesArray = especies.filter(especie=>especie.origen === e.target.value);
      let hashSet = new Set();
      for (let i = 0; i < auxEspeciesArray.length; i++) {
          hashSet.add(auxEspeciesArray[i].nombreCientifico);        
      }
      for (let i = 0; i < especiesEspecificas.length; i++) {
        if(!hashSet.has(especiesEspecificas[i])){
          hashSet.add(especiesEspecificas[i])
        }        
      }

      setEspeciesEspecificas(Array.from(hashSet));
      if(e.target.value==='Nativa'){
        setNativas(true);
      }else{
        setIntroducidas(true);
      }
    }else{
      let auxEspeciesArray = especies.filter(especie=>especie.origen === e.target.value);

      let especiesEspecificasAux = [...especiesEspecificas];

      let especiesArrayToFilter = auxEspeciesArray.filter(especie=>especiesEspecificas.includes(especie.nombreCientifico));
      for( let i = 0; i < especiesEspecificasAux.length; i++){ 
        for(let j = 0;j<especiesArrayToFilter.length;j++){
          if ( especiesEspecificasAux[i] === especiesArrayToFilter[j].nombreCientifico) { 
            especiesEspecificasAux.splice(i, 1); 
          }
        }
      }
      setEspeciesEspecificas(especiesEspecificasAux);
      if(e.target.value==='Nativa'){
        setNativas(false);
      }else{
        setIntroducidas(false);
      }
    }
  }
  const handleSwitchNew = (e) => {
    let isOn = e.target.checked;
    if(isOn){
      //solo nativas o introducidas, objetos Especie
      let auxEspeciesArray = especies.filter(especie=>especie.origen === e.target.value);
      let hashSet = new Set();
      for (let i = 0; i < auxEspeciesArray.length; i++) {
          hashSet.add(auxEspeciesArray[i].nombreCientifico);        
      }
      for (let i = 0; i < especiesEspecificas.length; i++) {
        if(!hashSet.has(especiesEspecificas[i])){
          hashSet.add(especiesEspecificas[i])
        }        
      }
      setEspeciesEspecificas(Array.from(hashSet));
      if(e.target.value==='Nativa'){
        setNativas(true);
      }else{
        setIntroducidas(true);
      }
    }else{
      let auxEspeciesArray = especies.filter(especie=>especie.origen === e.target.value);
      let especiesEspecificasAux = [...especiesEspecificas];
      let especiesArrayToFilter = auxEspeciesArray.filter(especie=>especiesEspecificas.includes(especie.nombreCientifico));
      for( let i = 0; i < especiesEspecificasAux.length; i++){ 
        for(let j = 0;j<especiesArrayToFilter.length;j++){
          if ( especiesEspecificasAux[i] === especiesArrayToFilter[j].nombreCientifico) { 
            especiesEspecificasAux.splice(i, 1); 
          }
        }
      }
      setEspeciesEspecificas(especiesEspecificasAux);
      if(e.target.value==='Nativa'){
        setNativas(false);
      }else{
        setIntroducidas(false);
      }
    }
  }
  const handleAplicar = () => {
    let arbolesFiltradosResult = []
    for (let index = 0; index < especiesEspecificas.length; index++) {
      let arbolesFiltrados = arboles.filter(arbol=>arbol.nombreCientifico === especiesEspecificas[index]);
      arbolesFiltrados.forEach(i=>arbolesFiltradosResult.push(i));
    }
    setShowFilterWindow(false);
    // console.log(arbolesFiltradosResult);
    dispatch(filterArboles(arbolesFiltradosResult))
    if(nativas || introducidas || especiesEspecificas.length>0){
      dispatch(setFilter(true));
      // console.log('Se aplico un filtro')
    }else{
      dispatch(setFilter(false));
      // console.log('No se aplico ningun filtro')
    }
  }
  return (
    <>
    {
      showFilterWindow===false ?
      <div className='btn-filter-round'>
      <Fab aria-label="add" sx={{backgroundColor:'white'}} onClick={handleClickFilterBtnRound}>
      <FilterAltRoundedIcon />
    </Fab>
      </div>
      :
      <div className='filtro-layout' >
      <div>&nbsp;&nbsp;&nbsp;&nbsp;<span style={{fontFamily: 'Poppins, sans-serif',fontSize:'1rem'}}> Filtro</span> </div>
      <ToggleSwitch
          id="nativas"
          checked={nativas}
          onChange={handleSwitchNew}
          optionLabels={['Nativas','Nativas']}
          name="Nativa"
        />
        
      <ToggleSwitch
        id="introducidas"
        checked={introducidas}
        onChange={handleSwitchNew}
        optionLabels={['Introducidas','Introducidas']}
        name="Introducida"
      />
      
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
        <Accordion sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)',marginTop:'10px',border:'transparent solid 1px', borderRadius:'10px',boxShadow:'none'}}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{color:'#03B25E',borderRadius:'50%',backgroundColor:'white'}} />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          sx={{backgroundColor:'#03B25E',border:'#174C44 solid 1px', borderRadius:'10px'}}
        >
          <Typography sx={{color:'white'}}>Especies específicas</Typography>
        </AccordionSummary>
        <AccordionDetails >
           <div style={{display:'flex',height:'150px',overflowY:'scroll',flexDirection:'column'}}>
              {
                especies.map(item=>(
                  <FormControlLabel key={item?.id}  control={<Checkbox onChange={handleCheckBox} style={{
                    color: "#03B25E"
                  }} value={item.nombreCientifico} checked={especiesEspecificas.includes(item.nombreCientifico)} />} label={item.nombreCientifico} />
                ))
              }
          </div>
        </AccordionDetails>
      </Accordion>
     

      <Stack spacing={2} direction="row" sx={{justifyContent:'center',marginTop:'10px'}}>
      <Button variant="contained" color='success' sx={{border:'##174C44 solid 1px',backgroundColor:'#268576',color:'white'}}
        onClick={handleAplicar}
      >Aplicar</Button>
      <Button variant="outlined" sx={{border:'##174C44 solid 1px',color:'#268576'}}
        onClick={()=>setShowFilterWindow(false)}
      >Cancelar</Button>
      </Stack>
      
      {/* <div className="toggle-switch">d</div> */}
    </div>
    }
    </>
  )
}

export default FiltroComponent