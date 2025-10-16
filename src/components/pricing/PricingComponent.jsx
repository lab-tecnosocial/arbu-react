import './PricingComponent.css';
import { Card, CardContent, Typography, Grid, Box, Container, Chip, List, ListItem, ListItemIcon, ListItemText, Button } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const PricingComponent = () => {
  const arbuFeatures = [
    'Adoptar árboles urbanos en la app del celular',
    'Participación en el ranking mensual y global de adoptadores',
    'Monitorear estados de los árboles',
    'Programar recordatorios de riego',
    'Visualización del mapa público de árboles',
    'Recursos educativos'
  ];

  const arbuProFeatures = [
    'Formularios y campos personalizados',
    'Gestión de campañas de mapeo, metas y mapeadores',
    'Dashboard de visualización de resultados de mapeos',
    'Edición y validación de datos',
    'Exportación de datos (Excel, Shapefile, GeoJSON)',
    'Cálculo de captura de carbono',
    'Funciones de Inteligencia Artificial: reconocimiento de especies',
    'Acceso a APIs'
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography
          variant="h3"
          component="h2"
          sx={{
            fontFamily: 'Poppins',
            fontWeight: 600,
            color: '#268576',
            mb: 2
          }}
        >
          Nuestros Planes
        </Typography>
        <Typography
          variant="h6"
          component="p"
          sx={{
            fontFamily: 'Open Sans',
            color: '#666'
          }}
        >
          Elige la opción que mejor se adapte a tus necesidades
        </Typography>
      </Box>

      <Grid container spacing={4} justifyContent="center">
        {/* Arbu Plan */}
        <Grid item xs={12} md={5}>
          <Card
            className="pricing-card"
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              border: '2px solid #e0e0e0',
              borderRadius: '16px',
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)'
              }
            }}
          >
            <CardContent sx={{ flexGrow: 1, p: 4 }}>
              <Typography
                variant="h4"
                component="h3"
                sx={{
                  fontFamily: 'Poppins',
                  fontWeight: 600,
                  color: '#268576',
                  mb: 1,
                  textAlign: 'center'
                }}
              >
                Arbu
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{
                  fontFamily: 'Open Sans',
                  color: '#666',
                  mb: 2,
                  textAlign: 'center'
                }}
              >
                Dirigido a ciudadanos
              </Typography>
              <List>
                {arbuFeatures.map((feature, index) => (
                  <ListItem key={index} sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <CheckCircleIcon sx={{ color: '#268576' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={feature}
                      sx={{
                        '& .MuiListItemText-primary': {
                          fontFamily: 'Open Sans',
                          fontSize: '0.95rem'
                        }
                      }}
                    />
                  </ListItem>
                ))}
              </List>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Chip
                  label="GRATUITO"
                  sx={{
                    fontFamily: 'Poppins',
                    fontWeight: 600,
                    fontSize: '1.2rem',
                    padding: '24px 16px',
                    backgroundColor: '#268576',
                    color: '#fff'
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Arbu Pro Plan */}
        <Grid item xs={12} md={5}>
          <Card
            className="pricing-card pricing-card-pro"
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              border: '2px solid #268576',
              borderRadius: '16px',
              position: 'relative',
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 12px 24px rgba(38, 133, 118, 0.3)'
              }
            }}
          >
            <CardContent sx={{ flexGrow: 1, p: 4 }}>
              <Typography
                variant="h4"
                component="h3"
                sx={{
                  fontFamily: 'Poppins',
                  fontWeight: 600,
                  color: '#268576',
                  mb: 1,
                  textAlign: 'center'
                }}
              >
                Arbu Pro
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{
                  fontFamily: 'Open Sans',
                  color: '#666',
                  mb: 2,
                  textAlign: 'center'
                }}
              >
                Dirigido a empresas, gobiernos y ciudadanos que deseen funcionalidades avanzadas
              </Typography>

              <List>
                {arbuProFeatures.map((feature, index) => (
                  <ListItem key={index} sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <CheckCircleIcon sx={{ color: '#268576' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={feature}
                      sx={{
                        '& .MuiListItemText-primary': {
                          fontFamily: 'Open Sans',
                          fontSize: '0.95rem'
                        }
                      }}
                    />
                  </ListItem>
                ))}
              </List>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: 'Poppins',
                    fontWeight: 600,
                    color: '#268576'
                  }}
                >
                  Contáctanos para cotizar
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Button
                  variant="contained"
                  href="mailto:contacto@labtecnosocial.org"
                  sx={{
                    backgroundColor: '#268576',
                    color: '#fff',
                    fontFamily: 'Poppins',
                    fontWeight: 600,
                    px: 4,
                    py: 1.5,
                    borderRadius: '24px',
                    textTransform: 'none',
                    fontSize: '1rem',
                    '&:hover': {
                      backgroundColor: '#1d6a5f'
                    }
                  }}
                >
                  Contactar
                </Button>
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: 'Open Sans',
                    color: '#666',
                    mt: 2
                  }}
                >
                  contacto@labtecnosocial.org
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PricingComponent;
