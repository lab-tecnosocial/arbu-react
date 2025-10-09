import React from 'react';
import './AdminDashboard.css';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardActionArea, Typography, Grid, Box, Container } from '@mui/material';
import TableChartIcon from '@mui/icons-material/TableChart';
import MapIcon from '@mui/icons-material/Map';
import ApiIcon from '@mui/icons-material/Api';

const AdminDashboard = () => {
  const adminTools = [
    {
      title: 'Tabla',
      description: 'Dashboard de visualización de resultados de mapeos. Edición y validación de datos.',
      icon: <TableChartIcon sx={{ fontSize: 60, color: '#268576' }} />,
      path: '/tabla'
    },
    {
      title: 'Mapeo Scout',
      description: 'Gestión de campañas de mapeo, metas y mapeadores. Visualización del mapa de árboles.',
      icon: <MapIcon sx={{ fontSize: 60, color: '#268576' }} />,
      path: '/mapeo-scout'
    },
    {
      title: 'API',
      description: 'Documentación y acceso a las APIs de Arbu. Exportación de datos en múltiples formatos.',
      icon: <ApiIcon sx={{ fontSize: 60, color: '#268576' }} />,
      path: '/api'
    }
  ];

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
