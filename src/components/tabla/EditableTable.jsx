import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ImageCarouselModal from "./ImageCarouselModal";
import "./EditableTable.css";
import { startUpdateNombreMapeado } from "../../actions/tablaActions";
import { sugerenciasNombresCientificos, sugerenciasNombresComunes } from "./constants";

const EditableTable = ({ data }) => {
    const [tableData, setTableData] = useState(data);
    const [carouselImages, setCarouselImages] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [isMobile, setIsMobile] = useState(false);
    const dispatch = useDispatch();


    useEffect(() => {
        setTableData(data);
    }, [data]);

    useEffect(() => {
        const checkMobile = () => {
          setIsMobile(window.innerWidth <= 768);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
      }, []);

    const handleInputChange = (index, field, value) => {
        setTableData((prev) =>
            prev.map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            )
        );
    };

    const rowHasChanges = (rowIndex) => {
        const original = data[rowIndex];
        const current = tableData[rowIndex];
        return (
          original.nombreComun !== current.nombreComun ||
          original.nombreCientifico !== current.nombreCientifico
        );
      };

    const handleSaveRow = (index) => {
        const updatedItem = tableData[index];
    
        dispatch(
          startUpdateNombreMapeado(
            updatedItem.id,
            updatedItem.nombreComun,
            updatedItem.nombreCientifico
          )
        );
      };

    const openImageCarousel = (monitoreos) => {
        const first = Object.values(monitoreos)[0];
        if (!first) return;

        const images = [
            { tipo: "Árbol completo", url: first.fotoArbolCompleto },
            { tipo: "Raíz", url: first.fotoRaiz },
            { tipo: "Corteza", url: first.fotoCorteza },
            { tipo: "Hoja", url: first.fotoHoja },
            { tipo: "Flor", url: first.fotoFlor },
        ].filter((img) => img.url);
        if (images.length > 0) {
            setCarouselImages(images);
            setModalOpen(true);
        }
    };

    const formatTimestamp = (timestamp) => {
        if (!timestamp || !timestamp.seconds) return "";
        const date = new Date(timestamp.seconds * 1000);
        return date.toLocaleString();
    };

    const filteredData = tableData.filter((item) => {
        const monitoreo = Object.values(item.monitoreos)[0] || {};
        const fecha = formatTimestamp(monitoreo.timestamp);

        const fieldsToCheck = [
            item.id,
            item.nombreComun,
            item.nombreCientifico,
            item.proyecto,
            item.lugarDePlantacion,
            item.nombrePropio,
            monitoreo.altura,
            monitoreo.diametroAlturaPecho,
            fecha.split(",")[0],
        ];

        return fieldsToCheck.some(field =>
            field?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    // const handleKeyDown = (event, index) => {
    //     if (event.key === "Enter") {
    //         const updatedItem = tableData[index];
    //         console.log("Actualizar este item en la base de datos:", updatedItem);
    //         dispatch(startUpdateNombreMapeado(updatedItem.id, updatedItem.nombreComun, updatedItem.nombreCientifico));
    //     }
    // };
    const handleKeyDown = (event, index) => {
        if (!isMobile && event.key === "Enter") {
          handleSaveRow(index);
        }
      };

    return (
        <div>
          <div className="table-container">
            <div className="table-filter">
              <input
                type="text"
                placeholder="Filtrar por ID, nombre, común, científico, proyecto, altura, DAP, fecha..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  marginBottom: "10px",
                  padding: "6px",
                  width: "100%",
                  maxWidth: "600px",
                  fontSize: "14px"
                }}
              />
            </div>
      
            <table className="editable-table">
              <thead>
                <tr>
                  <th className="table-header">ID</th>
                  <th className="table-header">Nombre común</th>
                  <th className="table-header">Nombre científico</th>
                  {isMobile && <th>Acción</th>}
                  <th className="table-header">Imágenes</th>
                  <th className="table-header">Latitud</th>
                  <th className="table-header">Longitud</th>
                  <th className="table-header">Proyecto</th>
                  <th className="table-header">Lugar de plantación</th>
                  <th className="table-header">Nombre propio</th>
                  <th className="table-header">Altura</th>
                  <th className="table-header">Diámetro (DAP)</th>
                  <th className="table-header">Fecha de monitoreo</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, idx) => {
                  const monitoreo = Object.values(item.monitoreos)[0] || {};
                  return (
                    <tr key={item.id}>
                      <td data-label="ID">{item.id}</td>
                      <td data-label="Nombre común">
                        <input
                          type="text"
                          list="lista-nombres-comunes"
                          value={item.nombreComun}
                          onChange={(e) => handleInputChange(idx, "nombreComun", e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, idx)}
                        />
                        <datalist id="lista-nombres-comunes">
                          {sugerenciasNombresComunes.map((nombre, index) => (
                            <option key={index} value={nombre} />
                          ))}
                        </datalist>
                      </td>
                      <td data-label="Nombre científico">
                        <input
                          type="text"
                          list="lista-nombres-cientificos"
                          value={item.nombreCientifico}
                          onChange={(e) => handleInputChange(idx, "nombreCientifico", e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, idx)}
                        />
                        <datalist id="lista-nombres-cientificos">
                          {sugerenciasNombresCientificos.map((nombre, index) => (
                            <option key={index} value={nombre} />
                          ))}
                        </datalist>
                      </td>
                    
                      <td data-label="Imágenes">
                        <button
                          className="view-images-button"
                          onClick={() => openImageCarousel(item.monitoreos)}
                        >
                          Ver imágenes
                        </button>
                      </td>
                      <td data-label="Latitud">{item.latitud}</td>
                      <td data-label="Longitud">{item.longitud}</td>
                      <td data-label="Proyecto">{item.proyecto}</td>
                      <td data-label="Lugar de plantación">{item.lugarDePlantacion}</td>
                      <td data-label="Nombre propio">{item.nombrePropio}</td>
                      <td data-label="Altura">{monitoreo.altura ?? "-"}</td>
                      <td data-label="Diámetro (DAP)">{monitoreo.diametroAlturaPecho ?? "-"}</td>
                      <td data-label="Fecha de monitoreo">{formatTimestamp(monitoreo.timestamp)}</td>
                      {isMobile && rowHasChanges(idx) && (
              <td>
                <button
                  className="save-button"
                  onClick={() => handleSaveRow(idx)}
                >
                  Guardar
                </button>
              </td>
            )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
      
          <ImageCarouselModal
            images={carouselImages}
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
          />
        </div>
      );
};

export default EditableTable;