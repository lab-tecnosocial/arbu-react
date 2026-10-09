import React from 'react';
import './AdminDashboard.css';
import { Link } from 'react-router-dom';
import { Alert, Card, CardContent, CardActionArea, Typography, Grid, Box, Container } from '@mui/material';
import TableChartIcon from '@mui/icons-material/TableChart';
import MapIcon from '@mui/icons-material/Map';
import ApiIcon from '@mui/icons-material/Api';
import FolderIcon from '@mui/icons-material/Folder';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import { useAutorizacion } from '../../helpers/useAutorizacion';

const AdminDashboard = () => {
  const acceso = useAutorizacion();

  // Cada tarjeta declara el permiso que abre su sección; las que no se tienen
  // no se pintan. Enseñar una puerta que lleva a "no autorizado" no ayuda a
  // nadie. `permiso: null` es de todos los que entran al back-office.
  const adminTools = [
    {
      title: 'Campañas y concursos',
      description: 'Seguimiento, revisión de registros y tabla de posiciones.',
      icon: <EmojiEventsIcon sx={{ fontSize: 60, color: '#268576' }} />,
      path: '/campanas',
      permiso: 'campanas'
    },
    {
      title: 'Gestión de Proyectos',
      description: 'Gestión de proyectos, mapeadores y árboles.',
      icon: <FolderIcon sx={{ fontSize: 60, color: '#268576' }} />,
      path: '/proyectos',
      permiso: 'proyectos'
    },
    {
      title: 'Aportes',
      description: 'Registrar, corregir e importar aportes de mapeo.',
      icon: <AddLocationAltIcon sx={{ fontSize: 60, color: '#268576' }} />,
      path: '/admin/aportes',
      permiso: 'aportes'
    },
    {
      title: 'Tabla',
      description: 'Edición y validación de datos.',
      icon: <TableChartIcon sx={{ fontSize: 60, color: '#268576' }} />,
      path: '/tabla',
      permiso: 'tabla'
    },
    {
      title: 'Mapeo Scout',
      description: 'Participantes, grupos y árboles del mapeo scout.',
      icon: <MapIcon sx={{ fontSize: 60, color: '#268576' }} />,
      path: '/mapeo-scout',
      permiso: 'mapeoScout'
    },
    {
      title: 'API',
      description: 'Documentación y acceso a las APIs de Arbu.',
      icon: <ApiIcon sx={{ fontSize: 60, color: '#268576' }} />,
      path: '/api',
      permiso: null
    },
    {
      title: 'Accesos',
      description: 'Quién entra a Arbu Pro y a qué secciones.',
      icon: <ManageAccountsIcon sx={{ fontSize: 60, color: '#268576' }} />,
      path: '/admin/accesos',
      soloSuperadmin: true
    }
  ].filter((tool) =>
    tool.soloSuperadmin ? acceso.esSuperadmin : acceso.puedeVer(tool.permiso)
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontFamily: 'Poppins',
            fontWeight: 600,
            color: '#268576',
            mb: 2
          }}
        >
          Arbu Pro
        </Typography>
        <Typography
          variant="h6"
          component="p"
          sx={{
            fontFamily: 'Open Sans',
            color: '#666',
            maxWidth: '800px',
            margin: '0 auto'
          }}
        >
          Herramientas profesionales para gestión de arbolado urbano
        </Typography>
        <Typography
          variant="body1"
          component="p"
          sx={{
            fontFamily: 'Open Sans',
            color: '#999',
            mt: 1
          }}
        >
          Funcionalidades avanzadas para empresas, gobiernos y ciudadanos
        </Typography>
      </Box>

      {!acceso.comprobando && adminTools.length === 0 && (
        <Alert severity="info" sx={{ mb: 4 }}>
          Tu cuenta tiene acceso a Arbu Pro pero todavía no tiene ninguna sección
          asignada. Pídele a un superadmin que te dé acceso desde Accesos.
        </Alert>
      )}

      <Grid container spacing={4}>
        {adminTools.map((tool, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Link to={tool.path} style={{ textDecoration: 'none' }}>
              <Card
                className="admin-card"
                sx={{
                  height: '100%',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 24px rgba(38, 133, 118, 0.2)'
                  }
                }}
              >
                <CardActionArea sx={{ height: '100%', p: 3 }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Box sx={{ mb: 2 }}>
                      {tool.icon}
                    </Box>
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="h2"
                      sx={{
                        fontFamily: 'Poppins',
                        fontWeight: 600,
                        color: '#268576',
                        mb: 2
                      }}
                    >
                      {tool.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontFamily: 'Open Sans',
                        lineHeight: 1.6
                      }}
                    >
                      {tool.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default AdminDashboard;
