import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const TreeCardPopup = ({ open, onClose, trees, mapperName }) => {
  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getMonitoreoImage = (tree) => {
    if (tree.monitoreos && Object.keys(tree.monitoreos).length > 0) {
      const monitoreosList = Object.values(tree.monitoreos);
      if (monitoreosList.length > 0 && monitoreosList[0].fotoArbolCompleto) {
        return monitoreosList[0].fotoArbolCompleto;
      }
    }
    return null;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
    >
      <DialogTitle sx={{ m: 0, p: 2, fontFamily: "Poppins" }}>
        Árboles mapeados por {mapperName}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          {trees.length === 0 ? (
            <Grid item xs={12}>
              <Typography align="center" color="text.secondary">
                No hay árboles mapeados
              </Typography>
            </Grid>
          ) : (
            trees.map((tree, index) => (
              <Grid item xs={12} sm={6} key={tree.id || index}>
                <Card sx={{ height: "100%" }}>
                  {getMonitoreoImage(tree) && (
                    <CardMedia
                      component="img"
                      height="140"
                      image={getMonitoreoImage(tree)}
                      alt={tree.nombrePropio || "Árbol"}
                      sx={{ objectFit: "cover" }}
                    />
                  )}
                  <CardContent>
                    <Typography
                      gutterBottom
                      variant="h6"
                      component="div"
                      sx={{ fontFamily: "Poppins", color: "#268576" }}
                    >
                      {tree.nombrePropio || "Sin nombre"}
                    </Typography>
                    {tree.nombreComun && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        {tree.nombreComun}
                      </Typography>
                    )}
                    {tree.nombreCientifico && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        fontStyle="italic"
                        gutterBottom
                      >
                        {tree.nombreCientifico}
                      </Typography>
                    )}
                    {tree.lugarDePlantacion && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ display: "flex", alignItems: "center", mt: 1 }}
                      >
                        <LocationOnIcon fontSize="small" sx={{ mr: 0.5 }} />
                        {tree.lugarDePlantacion}
                      </Typography>
                    )}
                    {tree.proyecto && (
                      <Chip
                        label={tree.proyecto}
                        size="small"
                        sx={{ mt: 1 }}
                        color="primary"
                      />
                    )}
                    {tree.altura && (
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        Altura: {tree.altura}m
                      </Typography>
                    )}
                    {tree.diametroAlturaPecho && (
                      <Typography variant="body2">
                        DAP: {tree.diametroAlturaPecho}cm
                      </Typography>
                    )}
                    {tree.timestamp && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mt: 1, display: "block" }}
                      >
                        Mapeado: {formatDate(tree.timestamp)}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ fontFamily: "Poppins" }}>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TreeCardPopup;
