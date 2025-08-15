import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ImageCarouselModal from "./ImageCarouselModal";
import "./EditableTable.css";
import { startUpdateNombreMapeado } from "../../actions/tablaActions";

const EditableTable = ({ data }) => {
    const [tableData, setTableData] = useState(data);
    const [carouselImages, setCarouselImages] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const dispatch = useDispatch();


    useEffect(() => {
    setTableData(data);
    }, [data]);

    const handleInputChange = (index, field, value) => {
        setTableData((prev) =>
            prev.map((item, i) =>
                i === index ? { ...item, [field]: value } : item
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

    const handleKeyDown = (event, index) => {
        if (event.key === "Enter") {
            const updatedItem = tableData[index];
            console.log("Actualizar este item en la base de datos:", updatedItem);
            dispatch(startUpdateNombreMapeado(updatedItem.id, updatedItem.nombreComun, updatedItem.nombreCientifico));
        }
    };

    return (
        <div style={{ overflowX: "auto" }}>
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

            <table className="editable-table">
                <thead>
                    <tr>
                        <th className="table-header">ID</th>
                        <th className="table-header">Nombre común</th>
                        <th className="table-header">Nombre científico</th>
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
                                <td>{item.id}</td>
                                <td>
                                    <input
                                        type="text"
                                        value={item.nombreComun}
                                        onChange={(e) => handleInputChange(idx, "nombreComun", e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(e, idx)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={item.nombreCientifico}
                                        onChange={(e) => handleInputChange(idx, "nombreCientifico", e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(e, idx)}
                                    />
                                </td>
                                <td>
                                    <button className="view-images-button"
                                            onClick={() => openImageCarousel(item.monitoreos)}>
                                        Ver imágenes
                                    </button>
                                </td>
                                <td>{item.latitud}</td>
                                <td>{item.longitud}</td>
                                <td>{item.proyecto}</td>
                                <td>{item.lugarDePlantacion}</td>
                                <td>{item.nombrePropio}</td>

                                <td>{monitoreo.altura ?? "-"}</td>
                                <td>{monitoreo.diametroAlturaPecho ?? "-"}</td>
                                <td>{formatTimestamp(monitoreo.timestamp)}</td>

                            </tr>
                        );
                    })}
                </tbody>
            </table>

            <ImageCarouselModal
                images={carouselImages}
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
            />
        </div>
    );
};

export default EditableTable;