import React, {  useState } from 'react'

import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import SportsScoreIcon from '@mui/icons-material/SportsScore';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

import './RankingComponent.css'
import { useSelector } from 'react-redux';
import ChildComponent from './ChildComponent';
import ThreePositionsMes from './ThreePositionsMes';
import ThreePositionsGlobal from './ThreePositionsGlobal';
import Footer from '../footer/Footer';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const RankingComponent = () => {
  const [value, setValue] = useState(0);
  const {usuariosMap} = useSelector(state=>state.mapa);
  const {scoresGlobal,scoresMes} = useSelector(state=>state.leaderboard);











  
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const getUserPhoto = (id)=>{
      if(usuariosMap !==null){
         if(usuariosMap.hasOwnProperty(id)){
            return usuariosMap[id]?.imageProfile;
          }
      }
    return "default";
  }
  const getUserInstitucion = (id)=>{
    if(usuariosMap !==null){
       if(usuariosMap.hasOwnProperty(id)){
          return usuariosMap[id]?.institucion;
        }
    }
  return "default";
}

  const getFullNameUser = (id) => {
      if(usuariosMap !==null){
        if(usuariosMap.hasOwnProperty(id)){
           return usuariosMap[id]?.nombre;
         }
     }
    return "";
  };
  const getFormatedList = (scoresList) => {
    let array = [];
    scoresList.forEach(element => {
      let n = getFullNameUser(element.id);
      let institucion = getUserInstitucion(element.id);
      let puntos = element.puntos;
      let foto = getUserPhoto(element.id);
      array.push({nombre:n,foto:foto,institucion:institucion, puntos:puntos});
    });
    return array;
  }
  return (
    <div 
    // style={{ padding: "1rem 0" }}
    >
    
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" centered={true}>
              <Tab icon={<CalendarMonthIcon />} sx={{fontFamily:'Poppins'}} label={`MES`} {...a11yProps(0)} />
          <Tab icon={<SportsScoreIcon />} sx={{fontFamily:'Poppins'}} label="GLOBAL" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <div>
        <center>
          <strong>Top 30</strong><br />
        </center>
          <ThreePositionsMes list3Best={getFormatedList(scoresMes)} />
        {
          scoresMes.map((item,i)=>(

            i>2 && i<30 && <ChildComponent key={`${item.id}-mes`} nombre={getFullNameUser(item.id)} puntos={item.puntos} foto={getUserPhoto(item.id)} institucion={getUserInstitucion(item.id)} index={i+1} />

          ))
        }
        {
          scoresMes.length===0 && (
            <center>
              <br />
              No hay usuarios compitiendo aún...
            </center>
          )
        }
        </div>
      </TabPanel>
      <TabPanel value={value} index={1}>
      <div>
        <center>
          <strong>Top 100</strong><br />
        <span style={{marginLeft:'auto',marginRight:'auto'}}>El tablón global se actualiza todos los días a las 00:00 A.M.</span>
        </center>
          <ThreePositionsGlobal list3Best={getFormatedList(scoresGlobal)} />
        {
          scoresGlobal.map((item,i)=>(
            
            i>2 && i<100 && <ChildComponent key={`${item.id}-Global`} nombre={getFullNameUser(item.id)} puntos={item.puntos} foto={getUserPhoto(item.id)} institucion={getUserInstitucion(item.id)} index={i+1} />
            
          ))
        }
        {
          scoresGlobal.length===0 && (
            <center>
              <br />
              No hay usuarios compitiendo aún...
            </center>
          )
        }
        </div>
      </TabPanel>
      <br />
      <br />
      <br />
      <br />
      
        <Footer />
  </div>
  )
}

export default RankingComponent