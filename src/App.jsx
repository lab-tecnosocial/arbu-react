import './App.css';
import { Link, Outlet } from "react-router-dom";
import { startLoadingArboles, startLoadingUsuarios } from './actions/mapaActions';
import { useEffect, useState } from 'react';
import { useDispatch } from "react-redux";
import { startLoadEspeciesCatalogo } from './actions/catalogoActions';
//
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import MapIcon from '@mui/icons-material/Map';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import adoptaIcon from './components/mapa/arbol_icon_navigation.svg'
import catalogoIcon from './components/mapa/catalogo_icon_navigation.svg'
import arbuAppIcon from './components/mapa/logo_arbu_app.svg'
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import ApiIcon from '@mui/icons-material/Api';
import { loadScoresGlobal, loadScoresMes } from './actions/leaderboardActions';
import { useNavigate } from 'react-router-dom';
const drawerWidth = 240;
const navItems = [
  // {
  //   section:'Mapa',
  //   icon: <img src={adoptaIcon} alt="" width="25px" height="25px" style={{verticalAlign:'middle'}} />
  // },
  {
    section: 'Mapa',
    icon: <MapIcon sx={{ color: '#EBF5EE' }} />,
    path: '/mapa'
  },
  {
    section: 'Ranking',
    icon: <LeaderboardIcon sx={{ color: '#EBF5EE' }} />,
    path: '/ranking'
  },
  {
    section: 'Aprende',
    icon: <img src={catalogoIcon} alt="" width="25px" height="25px" style={{ verticalAlign: 'middle' }} />,
    path: '/aprende'
  },
  {
    section: 'API',
    icon: <ApiIcon sx={{ color: '#EBF5EE' }} />,
    path: '/api'
  }
];

function App(props) {
  const { window } = props
  const [mobileOpen, setMobileOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(startLoadingArboles());
    dispatch(startLoadingUsuarios());
    dispatch(startLoadEspeciesCatalogo());
    dispatch(loadScoresMes());
    dispatch(loadScoresGlobal());
  }, [dispatch]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleHome = () => {
    navigate('/');
  }
  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', backgroundColor: '#268576' }}>
      <Typography variant="h6" sx={{ my: 2, color: '#EBF5EE', fontFamily: 'Poppins' }}>
        <div onClick={handleHome} className="home">
          <img src={arbuAppIcon} alt="" width="30px" height="30px" style={{ verticalAlign: 'middle', borderRadius: '5px', backgroundColor: '#EBF5EE', paddingTop: '2px' }} />
          &nbsp;Arbu
        </div>
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <Link key={item.section} to={item.path} style={{ textDecoration: 'none', color: '#EBF5EE' }}>
            <ListItem disablePadding>
              <ListItemButton sx={{ textAlign: 'center' }}>
                {item.icon}
                <ListItemText sx={{ fontFamily: 'Poppins' }} primary={item.section} />
              </ListItemButton>
            </ListItem>
          </Link>
        ))}
      </List>
    </Box>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <>
      <Box sx={{ display: 'flex', marginBottom: '65px' }}>
        <AppBar component="nav" style={{ backgroundColor: '#268576', paddingBottom: '0px' }}>
          <Toolbar >
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 0, display: { sm: 'none' }, padding: '10px' }}
            >
              <MenuIcon sx={{ marginTop: '11px', marginBottom: '11px' }} />
            </IconButton>
            {/* <div onClick={handleHome}> */}
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' }, color: '#EBF5EE', fontFamily: 'Poppins' }}

            >
              <div onClick={handleHome} className="home-typography">
                <img src={arbuAppIcon} alt="" width="30px" height="30px" style={{ verticalAlign: 'middle', borderRadius: '5px', backgroundColor: '#EBF5EE', paddingTop: '2px' }} />
                &nbsp;
                Arbu
              </div>

            </Typography>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              {navItems.map((item) => (

                <Link key={item.section} to={item.path} style={{ textDecoration: 'none' }}>

                  <Button className='buttons-appbar' sx={{
                    color: '#EBF5EE', textTransform: 'capitalize', borderRadius: '20px',
                    marginLeft: '4px', marginRight: '4px', fontFamily: 'Poppins'
                  }}>
                    {item.icon}&nbsp;{item.section}
                  </Button>
                </Link>

              ))}
            </Box>
          </Toolbar>
        </AppBar>
        <Box component="nav">
          <Drawer
            container={container}
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
          >
            {drawer}
          </Drawer>
        </Box>
        {/* <Box component="main" sx={{ p: 3 }}>
        <Toolbar />
        <Typography>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique unde
         
        </Typography>
      </Box> */}
      </Box>
    </>
  );
}

export default App;
