import { Box, Typography } from "@mui/material";

/**
 * Barras en SVG inline. No se añade una librería de gráficos: con xlsx, MRT,
 * MUI y Leaflet ya en el bundle, meter una entera por cuatro barras es mal
 * negocio.
 */
export const MiniBarras = ({ datos = [], titulo, alto = 120, color = "#268576" }) => {
  if (!datos.length) return null;

  const max = Math.max(...datos.map((d) => d.valor), 1);
  const ancho = Math.max(datos.length * 28, 200);

  return (
    <Box>
      {titulo && (
        <Typography variant="subtitle2" sx={{ fontFamily: "Poppins", fontWeight: "bold", mb: 1 }}>
          {titulo}
        </Typography>
      )}
      <svg width="100%" height={alto + 28} viewBox={`0 0 ${ancho} ${alto + 28}`} preserveAspectRatio="none" role="img">
        {datos.map((d, i) => {
          const h = (d.valor / max) * alto;
          const x = i * (ancho / datos.length);
          const w = (ancho / datos.length) * 0.7;
          return (
            <g key={d.etiqueta}>
              <rect x={x} y={alto - h} width={w} height={h} fill={color} rx="2">
                <title>{`${d.etiqueta}: ${d.valor}`}</title>
              </rect>
              <text x={x + w / 2} y={alto + 12} fontSize="9" textAnchor="middle" fill="#6b7a7a">
                {d.etiquetaCorta ?? d.etiqueta}
              </text>
              <text x={x + w / 2} y={alto - h - 3} fontSize="9" textAnchor="middle" fill="#455">
                {d.valor || ""}
              </text>
            </g>
          );
        })}
      </svg>
    </Box>
  );
};
