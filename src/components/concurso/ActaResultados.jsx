import { useState } from "react";
import { Alert, Box, Button, Paper, Snackbar, Typography } from "@mui/material";
import { useConcurso } from "../../context/ConcursoContext";
import { guardarResultados } from "../../helpers/campanias/revisionOperations";
import { exportarLibro } from "../../helpers/exportarExcel";
import { formatFecha, formatFechaHora } from "../../helpers/fechaArbol";
import { CRITERIO_DESEMPATE_1 } from "../../helpers/campanias/calcularRanking";

const explicar = (f) => {
  const d = f.desempate;
  if (!d) return "Primera posición por número de registros válidos.";
  if (d.empateTotal) return `Empate total con ${d.rival}: lo resuelve la organización.`;
  return `${d.criterio}: ${d.valorRival} (${d.rival}) frente a ${d.valorPropio}.`;
};

const ActaResultados = () => {
  const { campania, ranking, registros, usuarioActual, recargar } = useConcurso();
  const [aviso, setAviso] = useState(null);

  if (!campania) return null;

  const premios = campania.reglas?.premios ?? 3;
  const ganadores = ranking.slice(0, premios);
  const validos = registros.filter((r) => r.validoFinal).length;
  const pendientes = registros.filter((r) => !r.revisado).length;
  const descalificados = registros.filter((r) => r.descalificado);

  const congelar = async (final) => {
    const res = await guardarResultados(
      campania.id,
      {
        ranking: ranking.map(({ arbol, ...f }) => f),
        parametros: {
          fechaInicio: campania.fechaInicio?.toISOString() ?? null,
          fechaFin: campania.fechaFin?.toISOString() ?? null,
          criterioDesempate1: campania.reglas?.criterioDesempate1 ?? CRITERIO_DESEMPATE_1.MUNICIPIOS_DISTINTOS,
          especies: campania.reglas?.especies ?? null,
          municipios: campania.reglas?.municipios ?? null,
        },
        totales: { registros: registros.length, validos, pendientes },
      },
      { final },
      usuarioActual
    );
    setAviso({
      texto: res.success
        ? final ? "Resultados publicados y congelados" : "Borrador de resultados guardado"
        : res.error,
      severity: res.success ? "success" : "error",
    });
    if (res.success && final) await recargar();
  };

  return (
    <Box>
      <style>{`@media print { .no-imprimir { display: none !important; } }`}</style>

      <Box className="no-imprimir" sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
        <Button variant="contained" onClick={() => window.print()} sx={{ fontFamily: "Poppins", textTransform: "none" }}>
          Imprimir o guardar como PDF
        </Button>
        <Button
          onClick={() =>
            exportarLibro(
              [
                {
                  nombreHoja: "Ganadores",
                  filas: ganadores,
                  columnas: [
                    { header: "Posición", valor: (f) => f.posicion },
                    { header: "Participante", valor: (f) => f.nombre },
                    { header: "UID", valor: (f) => f.uid },
                    { header: "Válidos", valor: (f) => f.validos },
                    { header: "Municipios", valor: (f) => f.municipios.join(", ") },
                    { header: "Completitud", valor: (f) => f.completitudMedia },
                    { header: "Justificación", valor: explicar },
                  ],
                },
                {
                  nombreHoja: "Ranking completo",
                  filas: ranking,
                  columnas: [
                    { header: "Posición", valor: (f) => f.posicion },
                    { header: "Participante", valor: (f) => f.nombre },
                    { header: "UID", valor: (f) => f.uid },
                    { header: "Válidos", valor: (f) => f.validos },
                    { header: "Municipios distintos", valor: (f) => f.nMunicipios },
                    { header: "Fuera del principal", valor: (f) => f.validosFueraDelPrincipal },
                    { header: "Completitud", valor: (f) => f.completitudMedia },
                  ],
                },
              ],
              "Concurso_Acta"
            )
          }
          sx={{ fontFamily: "Poppins", textTransform: "none" }}
        >
          Descargar Excel
        </Button>
        <Button onClick={() => congelar(false)} sx={{ fontFamily: "Poppins", textTransform: "none" }}>
          Guardar borrador
        </Button>
        <Button variant="outlined" color="warning" onClick={() => congelar(true)} sx={{ fontFamily: "Poppins", textTransform: "none" }}>
          Publicar resultados definitivos
        </Button>
      </Box>

      {pendientes > 0 && (
        <Alert severity="warning" className="no-imprimir" sx={{ mb: 2, fontFamily: "Poppins" }}>
          Hay {pendientes} registros sin revisar. Conviene cerrarlos antes de publicar.
        </Alert>
      )}

      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ fontFamily: "Poppins", fontWeight: "bold", mb: 1 }}>
          Acta de resultados — {campania.nombre}
        </Typography>
        <Typography variant="body2" sx={{ fontFamily: "Poppins", color: "#6b7a7a", mb: 3 }}>
          Generada el {formatFechaHora(new Date())} por {usuarioActual ?? "—"}
        </Typography>

        <Typography sx={{ fontFamily: "Poppins", fontWeight: "bold", mt: 2 }}>Periodo</Typography>
        <Typography sx={{ fontFamily: "Poppins" }}>
          Del {formatFechaHora(campania.fechaInicio)} al {formatFechaHora(campania.fechaFin)} (hora de Bolivia, UTC−4).
        </Typography>

        <Typography sx={{ fontFamily: "Poppins", fontWeight: "bold", mt: 2 }}>Criterios de validez</Typography>
        <ul style={{ fontFamily: "Poppins", marginTop: 4 }}>
          <li>Especie admitida: {campania.reglas?.especies?.etiqueta ?? campania.reglas?.especies?.generos?.join(", ") ?? "sin restricción"}.</li>
          <li>En flor, inferido por la fotografía de flor y confirmado por revisión humana.</li>
          <li>Dentro de los municipios habilitados y del periodo indicado.</li>
          <li>Con ubicación y datos suficientes para identificar el árbol.</li>
          <li>Un mismo ejemplar mapeado por personas distintas es válido para todas ellas.</li>
        </ul>

        <Typography sx={{ fontFamily: "Poppins", fontWeight: "bold", mt: 2 }}>Criterios de desempate, en orden</Typography>
        <ol style={{ fontFamily: "Poppins", marginTop: 4 }}>
          <li>Mayor número de registros válidos.</li>
          <li>
            {(campania.reglas?.criterioDesempate1 ?? CRITERIO_DESEMPATE_1.MUNICIPIOS_DISTINTOS) === CRITERIO_DESEMPATE_1.MUNICIPIOS_DISTINTOS
              ? "Mayor número de municipios distintos cubiertos."
              : "Mayor número de registros válidos fuera del municipio principal."}
          </li>
          <li>Mayor proporción de registros completos y verificables.</li>
          <li>Quien alcanzó primero ese total.</li>
        </ol>

        <Typography sx={{ fontFamily: "Poppins", fontWeight: "bold", mt: 2 }}>Totales</Typography>
        <Typography sx={{ fontFamily: "Poppins" }}>
          {registros.length} registros · {validos} válidos · {pendientes} sin revisar ·{" "}
          {ranking.length} participantes · {descalificados.length} registros de personas descalificadas.
        </Typography>

        <Typography sx={{ fontFamily: "Poppins", fontWeight: "bold", mt: 3 }}>Personas ganadoras</Typography>
        {ganadores.map((f) => (
          <Box key={f.uid} sx={{ mt: 1.5 }}>
            <Typography sx={{ fontFamily: "Poppins", fontWeight: "bold" }}>
              {f.posicion}. {f.nombre}
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: "Poppins" }}>
              {f.validos} registros válidos · {f.nMunicipios} municipio(s): {f.municipios.join(", ") || "—"} ·
              completitud {Math.round(f.completitudMedia * 100)}% · alcanzó su total el {formatFecha(f.fechaAlcanzoTotal)}.
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: "Poppins", color: "#6b7a7a" }}>
              {explicar(f)}
            </Typography>
          </Box>
        ))}

        {!ganadores.length && (
          <Typography sx={{ fontFamily: "Poppins" }}>Todavía no hay participantes con registros válidos.</Typography>
        )}
      </Paper>

      <Snackbar open={Boolean(aviso)} autoHideDuration={4000} onClose={() => setAviso(null)}>
        {aviso ? <Alert severity={aviso.severity}>{aviso.texto}</Alert> : undefined}
      </Snackbar>
    </Box>
  );
};

export default ActaResultados;
