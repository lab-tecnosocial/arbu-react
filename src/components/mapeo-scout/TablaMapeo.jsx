import React, { useMemo, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import { Box, Button, Chip } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useMapeoScout } from "../../context/MapeoScoutContext";
import TreeCardPopup from "./TreeCardPopup";

const TablaMapeo = () => {
  const { mapeadores } = useMapeoScout();
  const [treePopupOpen, setTreePopupOpen] = useState(false);
  const [selectedMapper, setSelectedMapper] = useState(null);

  const handleViewTrees = (mapper) => {
    setSelectedMapper(mapper);
    setTreePopupOpen(true);
  };

  const handleClosePopup = () => {
    setTreePopupOpen(false);
    setSelectedMapper(null);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "nombre",
        header: "Nombre",
        size: 200,
      },
      {
        accessorKey: "email",
        header: "Email",
        size: 200,
      },
      {
        accessorKey: "estado",
        header: "Estado",
        size: 120,
        Cell: ({ cell }) => (
          <Chip
            label={cell.getValue()}
            color={
              cell.getValue() === "Aceptado"
                ? "success"
                : cell.getValue() === "Pendiente"
                ? "warning"
                : "default"
            }
            size="small"
          />
        ),
      },
      {
        accessorKey: "grupo",
        header: "Grupo",
        size: 150,
      },
      {
        accessorKey: "rama",
        header: "Rama",
        size: 120,
      },
      {
        accessorKey: "cantidadArbolesMapeados",
        header: "Árboles Mapeados",
        size: 150,
        Cell: ({ cell }) => (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Chip
              label={cell.getValue() || 0}
              color="primary"
              size="small"
              sx={{ fontWeight: "bold" }}
            />
          </Box>
        ),
      },
      {
        accessorKey: "actions",
        header: "Ver Árboles",
        size: 150,
        enableSorting: false,
        Cell: ({ row }) => (
          <Button
            variant="outlined"
            size="small"
            startIcon={<VisibilityIcon />}
            onClick={() => handleViewTrees(row.original)}
            disabled={!row.original.cantidadArbolesMapeados}
            sx={{ fontFamily: "Poppins" }}
          >
            Ver ({row.original.cantidadArbolesMapeados || 0})
          </Button>
        ),
      },
    ],
    []
  );

  return (
    <Box sx={{ maxWidth: "100%", overflow: "auto" }}>
      <MaterialReactTable
        columns={columns}
        data={mapeadores}
        enableColumnResizing
        enableSorting
        enablePagination
        enableRowNumbers
        initialState={{
          density: "comfortable",
          sorting: [{ id: "cantidadArbolesMapeados", desc: true }],
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
          noRecordsToDisplay: "No hay mapeadores registrados",
          rowsPerPage: "Filas por página",
          of: "de",
        }}
      />

      {selectedMapper && (
        <TreeCardPopup
          open={treePopupOpen}
          onClose={handleClosePopup}
          trees={selectedMapper.arbolesMapeados || []}
          mapperName={selectedMapper.nombre}
        />
      )}
    </Box>
  );
};

export default TablaMapeo;
