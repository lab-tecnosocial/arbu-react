import React, { useMemo, useState, useEffect } from "react";
import { MaterialReactTable } from "material-react-table";
import { Box, Button, IconButton, Chip, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useProyectos } from "../../context/ProyectosContext";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import CrearEditarProyecto from "./CrearEditarProyecto";
import { checkIsSuperAdmin } from "../../helpers/checkAuthorization";

const ListaProyectos = () => {
  const { proyectos, eliminar, loading } = useProyectos();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [dialogCrearEditar, setDialogCrearEditar] = useState(false);
  const [proyectoEditando, setProyectoEditando] = useState(null);
  const [dialogEliminar, setDialogEliminar] = useState(false);
  const [proyectoEliminar, setProyectoEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  // Verificar si el usuario es superadmin
  useEffect(() => {
    const verificarSuperAdmin = async () => {
      if (user && user.email) {
        const esSuperAdmin = await checkIsSuperAdmin(user.email);
        setIsSuperAdmin(esSuperAdmin);
      }
    };
    verificarSuperAdmin();
  }, [user]);

  // Formatear fecha
  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    let date;
    if (timestamp.seconds) {
      date = new Date(timestamp.seconds * 1000);
    } else {
      date = new Date(timestamp);
    }
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleCrear = () => {
    setProyectoEditando(null);
    setDialogCrearEditar(true);
  };

  const handleEditar = (proyecto) => {
    setProyectoEditando(proyecto);
    setDialogCrearEditar(true);
  };

  const handleVerDetalle = (proyecto) => {
    navigate(`/proyectos/${proyecto.id}`);
  };

  const handleEliminarClick = (proyecto) => {
    setProyectoEliminar(proyecto);
    setDialogEliminar(true);
  };

  const handleConfirmarEliminar = async () => {
    if (!proyectoEliminar) return;

    setEliminando(true);
    const result = await eliminar(proyectoEliminar.id);

    if (result.success) {
      setDialogEliminar(false);
      setProyectoEliminar(null);
    } else {
      alert(result.error || "Error al eliminar proyecto");
    }
    setEliminando(false);
  };

  const handleCancelarEliminar = () => {
    setDialogEliminar(false);
    setProyectoEliminar(null);
  };

  const handleCloseDialogCrearEditar = (guardado) => {
    setDialogCrearEditar(false);
    setProyectoEditando(null);
    // Si guardado es true, los proyectos ya se recargaron automáticamente
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "nombreProyecto",
        header: "Nombre del Proyecto",
        size: 250,
        Cell: ({ cell }) => (
          <span style={{ fontWeight: "bold" }}>{cell.getValue()}</span>
        ),
      },
      // Columna de propietario (solo visible para superadmin)
      ...(isSuperAdmin ? [{
        accessorKey: "usuarioAutorizado",
        header: "Propietario",
        size: 200,
        Cell: ({ cell }) => (
          <Chip
            label={cell.getValue()}
            size="small"
            color="info"
            sx={{ fontFamily: "Poppins" }}
          />
        ),
      }] : []),
      {
        accessorKey: "fechaInicio",
        header: "Fecha Inicio",
        size: 120,
        Cell: ({ cell }) => formatDate(cell.getValue()),
      },
      {
        accessorKey: "fechaFin",
        header: "Fecha Fin",
        size: 120,
        Cell: ({ cell }) => formatDate(cell.getValue()),
      },
      {
        accessorKey: "idMapeadores",
        header: "Mapeadores",
        size: 120,
        Cell: ({ cell }) => {
          const mapeadores = cell.getValue() || [];
          return (
            <Chip
              label={`${mapeadores.length} mapeador${mapeadores.length !== 1 ? "es" : ""}`}
              color="primary"
              size="small"
              sx={{ fontWeight: "bold" }}
            />
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: "Creado",
        size: 120,
        Cell: ({ cell }) => formatDate(cell.getValue()),
      },
      {
        accessorKey: "actions",
        header: "Acciones",
        size: 200,
        enableSorting: false,
        Cell: ({ row }) => (
          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton
              size="small"
              onClick={() => handleVerDetalle(row.original)}
              sx={{ color: "#268576" }}
              title="Ver detalles"
            >
              <VisibilityIcon />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => handleEditar(row.original)}
              sx={{ color: "#1976d2" }}
              title="Editar"
            >
              <EditIcon />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => handleEliminarClick(row.original)}
              sx={{ color: "#d32f2f" }}
              title="Eliminar"
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ),
      },
    ],
    [isSuperAdmin]
  );

  return (
    <Box sx={{ maxWidth: "100%", overflow: "auto" }}>
      <MaterialReactTable
        columns={columns}
        data={proyectos}
        enableColumnResizing
        enableSorting
        enablePagination
        enableRowNumbers
        state={{
          isLoading: loading,
        }}
        renderTopToolbarCustomActions={() => (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCrear}
            sx={{
              fontFamily: "Poppins",
              backgroundColor: "#268576",
              "&:hover": {
                backgroundColor: "#1f6b5f",
              },
            }}
          >
            Crear Proyecto
          </Button>
        )}
        initialState={{
          density: "comfortable",
          sorting: [{ id: "createdAt", desc: true }],
        }}
        muiTableHeadCellProps={{
          sx: {
            fontFamily: "Poppins",
            fontWeight: "bold",
            backgroundColor: "#268576",
            color: "#fff",
          },
        }}
        muiTableBodyCellProps={{
          sx: {
            fontFamily: "Poppins",
          },
        }}
        muiTablePaperProps={{
          elevation: 2,
          sx: {
            borderRadius: "8px",
          },
        }}
        localization={{
          noRecordsToDisplay: "No hay proyectos creados",
          rowsPerPage: "Filas por página",
          of: "de",
        }}
      />

      {/* Dialog Crear/Editar Proyecto */}
      <CrearEditarProyecto
        open={dialogCrearEditar}
        onClose={handleCloseDialogCrearEditar}
        proyecto={proyectoEditando}
      />

      {/* Dialog Confirmar Eliminación */}
      <Dialog
        open={dialogEliminar}
        onClose={handleCancelarEliminar}
      >
        <DialogTitle sx={{ fontFamily: "Poppins", fontWeight: "bold" }}>
          Confirmar Eliminación
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontFamily: "Poppins" }}>
            ¿Estás seguro de que deseas eliminar el proyecto "{proyectoEliminar?.nombreProyecto}"?
            Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCancelarEliminar}
            disabled={eliminando}
            sx={{ fontFamily: "Poppins" }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmarEliminar}
            color="error"
            variant="contained"
            disabled={eliminando}
            sx={{ fontFamily: "Poppins" }}
          >
            {eliminando ? "Eliminando..." : "Eliminar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ListaProyectos;
