import './App.css';
import { Link, Outlet } from "react-router-dom";
import { startLoadingArboles, startLoadingArbolesMapeados, startLoadingUsuarios } from './actions/mapaActions';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
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
import ListItemIcon from '@mui/material/ListItemIcon';
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
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LogoutIcon from '@mui/icons-material/Logout';
import TableChartIcon from '@mui/icons-material/TableChart';
import ApiIcon from '@mui/icons-material/Api';
import FolderIcon from '@mui/icons-material/Folder';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { loadScoresGlobal, loadScoresMes } from './actions/leaderboardActions';
import { useNavigate, useLocation } from 'react-router-dom';
import { clearUser } from './actions/authActions';
import { getAuth, signOut } from 'firebase/auth';
import { app } from './firebase/firebase-config';
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
    section: 'Admin',
    icon: <AdminPanelSettingsIcon sx={{ color: '#EBF5EE' }} />,
    path: '/admin'
  }
];


function App(props) {
  const { window } = props
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);
  const auth = getAuth(app);

  // Determinar si estamos en una ruta de admin
  const isAdminRoute = location.pathname.startsWith('/admin') ||
                       location.pathname.startsWith('/tabla') ||
                       location.pathname.startsWith('/mapeo-scout') ||
                       location.pathname.startsWith('/api');

  const appName = isAdminRoute && user ? 'Arbu Pro' : 'Arbu';
  useEffect(() => {
    dispatch(startLoadingArboles());
    dispatch(startLoadingArbolesMapeados());
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

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(clearUser());
      handleCloseUserMenu();
      navigate('/');
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };
  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', backgroundColor: '#268576' }}>
      <Typography variant="h6" sx={{ my: 2, color: '#EBF5EE', fontFamily: 'Poppins' }}>
        <div onClick={handleHome} className="home">
          <img src={arbuAppIcon} alt="" width="30px" height="30px" style={{ verticalAlign: 'middle', borderRadius: '5px', backgroundColor: '#EBF5EE', paddingTop: '2px' }} />
          &nbsp;{appName}
        </div>
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <Link key={item.section} to={item.path} style={{ textDecoration: 'none', color: '#EBF5EE' }}>
            <ListItem disablePadding>
              <ListItemButton sx={{ textAlign: 'center' }}>
                <ListItemIcon sx={{ color: '#EBF5EE', minWidth: 'auto', mr: 1, display: 'flex', justifyContent: 'center' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText sx={{ fontFamily: 'Poppins' }} primary={item.section} />
              </ListItemButton>
            </ListItem>
          </Link>
        ))}
        {isAdminRoute && user && (
          <>
            <Divider sx={{ backgroundColor: '#EBF5EE', opacity: 0.3, my: 1 }} />
            <ListItem disablePadding>
              <ListItemButton sx={{ textAlign: 'center' }} onClick={(e) => {
                e.stopPropagation();
                navigate('/tabla');
              }}>
                <ListItemIcon sx={{ color: '#EBF5EE', minWidth: 'auto', mr: 1, display: 'flex', justifyContent: 'center' }}>
                  <TableChartIcon />
                </ListItemIcon>
                <ListItemText sx={{ fontFamily: 'Poppins' }} primary="Tabla" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton sx={{ textAlign: 'center' }} onClick={(e) => {
                e.stopPropagation();
                navigate('/mapeo-scout');
              }}>
                <ListItemIcon sx={{ color: '#EBF5EE', minWidth: 'auto', mr: 1, display: 'flex', justifyContent: 'center' }}>
                  <MapIcon />
                </ListItemIcon>
                <ListItemText sx={{ fontFamily: 'Poppins' }} primary="Mapeo Scout" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton sx={{ textAlign: 'center' }} onClick={(e) => {
                e.stopPropagation();
                navigate('/api');
              }}>
                <ListItemIcon sx={{ color: '#EBF5EE', minWidth: 'auto', mr: 1, display: 'flex', justifyContent: 'center' }}>
                  <ApiIcon />
                </ListItemIcon>
                <ListItemText sx={{ fontFamily: 'Poppins' }} primary="API" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton sx={{ textAlign: 'center' }} onClick={(e) => {
                e.stopPropagation();
                navigate('/proyectos');
              }}>
                <ListItemIcon sx={{ color: '#EBF5EE', minWidth: 'auto', mr: 1, display: 'flex', justifyContent: 'center' }}>
                  <FolderIcon />
                </ListItemIcon>
                <ListItemText sx={{ fontFamily: 'Poppins' }} primary="Gestión de Proyectos" />
              </ListItemButton>
            </ListItem>
            <Divider sx={{ backgroundColor: '#EBF5EE', opacity: 0.3, my: 1 }} />
            <ListItem disablePadding>
              <ListItemButton sx={{ textAlign: 'center' }} onClick={(e) => {
                e.stopPropagation();
                handleLogout();
              }}>
                <ListItemIcon sx={{ color: '#EBF5EE', minWidth: 'auto', mr: 1, display: 'flex', justifyContent: 'center' }}>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText sx={{ fontFamily: 'Poppins' }} primary="Cerrar sesión" />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <>

      {/* <nav style={{ borderBottom: "solid 1px", paddingBottom: "1rem",}}>
        <Link to="/">Home</Link> |{" "}
        <Link to="/mapa">Mapa</Link> |{" "}
        <Link to="/ranking">Ranking</Link> |{" "}
        <Link to="/catalogo">Catalogo y Manuales de plantacion</Link> |{" "}
        <Link to="/api">API</Link> |{" "}
      </nav> */}
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
                {appName}
              </div>

            </Typography>
            {/* </div> */}
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              {navItems.map((item) => (

                <Link key={item.section} to={item.path} style={{ textDecoration: 'none' }}>

                  <Button className='buttons-appbar' sx={{
                    color: '#EBF5EE', textTransform: 'capitalize', borderRadius: '20px',
                    // border:'1px solid #EBF5EE',
                    marginLeft: '4px', marginRight: '4px', fontFamily: 'Poppins'
                  }}>
                    {item.icon}&nbsp;{item.section}
                  </Button>
                </Link>

              ))}
              {isAdminRoute && user && (
                <>
                  <IconButton
                    onClick={handleOpenUserMenu}
                    sx={{ ml: 1, color: '#EBF5EE' }}
                  >
                    <MenuIcon />
                  </IconButton>
                  <Menu
                    sx={{ mt: '45px' }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                    <MenuItem onClick={() => { handleCloseUserMenu(); navigate('/tabla'); }}>
                      <TableChartIcon sx={{ mr: 1 }} />
                      <Typography textAlign="center">Tabla</Typography>
                    </MenuItem>
                    <MenuItem onClick={() => { handleCloseUserMenu(); navigate('/mapeo-scout'); }}>
                      <MapIcon sx={{ mr: 1 }} />
                      <Typography textAlign="center">Mapeo Scout</Typography>
                    </MenuItem>
                    <MenuItem onClick={() => { handleCloseUserMenu(); navigate('/api'); }}>
                      <ApiIcon sx={{ mr: 1 }} />
                      <Typography textAlign="center">API</Typography>
                    </MenuItem>
                    <MenuItem onClick={() => { handleCloseUserMenu(); navigate('/proyectos'); }}>
                      <FolderIcon sx={{ mr: 1 }} />
                      <Typography textAlign="center">Gestión de Proyectos</Typography>
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout}>
                      <LogoutIcon sx={{ mr: 1 }} />
                      <Typography textAlign="center">Cerrar sesión</Typography>
                    </MenuItem>
                  </Menu>
                </>
              )}
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
