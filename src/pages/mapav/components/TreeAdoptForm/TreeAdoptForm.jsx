import React, { useState } from "react";
import styles from "./TreeAdoptForm.module.css";
import { Button } from "../../../../components/button/Button";
import { useSelector } from "react-redux";
import { Radio } from "../../../../components/Radio/Radio";
export const lugarPlantacion = [
  { value: "acera", label: "Acera" },
  { value: "area verde", label: "Area verde" },
  { value: "plaza", label: "Plaza" },
  { value: "parque", label: "Parque" },
  { value: "corredor biologico", label: "Corredor biologico" },
  { value: "otro", label: "Otro" },
];
export const sanidad = [
  { value: "saludable", label: "Saludable" },
  { value: "muerto", label: "Muerto" },
  { value: "enfermo", label: "Enfermo" },
];
export const TreeAdoptForm = ({ onSubmit, forceShow = false }) => {
  const [selectedLugarPlantacion, setSelectedLugarPlantacion] = useState("acera");
  const [selectedSanidad, setSelectedSanidad] = useState("saludable");
  const { showTreeAdoptForm } = useSelector((state) => state.mapa);
  const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
  const [formData, setFormData] = useState({
    arbolCompleto: null,
    raizBase: null,
    corteza: null,
    hoja: null,
    flor: null,
    proyecto: "",
    nombrePropio: "",
    nombreComun: "",
    nombreCientifico: "",
    altura: "",
    diametro: "",
    lugarPlantacion: "",
    sanidad: "",
    otherLugar: "",
    enfermedadDescription: "",
  });

  const [previews, setPreviews] = useState({});
  const [errors, setErrors] = useState({});

  const handleFileChange = (field, event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > MAX_IMAGE_SIZE) {
        setErrors((prev) => ({
          ...prev,
          [field]: "La imagen es demasiado grande. Máximo 5MB.",
        }));
        event.target.value = "";
        return;
      }
      setFormData((prev) => ({ ...prev, [field]: file }));
      setPreviews((prev) => ({ ...prev, [field]: URL.createObjectURL(file) }));
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: null }));
      }
    }
  };

  const handleTextChange = (field, event) => {
    const value = event.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const removeImage = (field) => {
    setFormData((prev) => ({ ...prev, [field]: null }));
    setPreviews((prev) => ({ ...prev, [field]: null }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.arbolCompleto) {
      newErrors.arbolCompleto = "La foto del árbol completo es obligatoria.";
    }
    if (!formData.lugarPlantacion) {
      newErrors.lugarPlantacion = "Seleccione el lugar de plantación.";
    }
    if (!formData.sanidad) {
      newErrors.sanidad = "Seleccione la sanidad.";
    }
    if (formData.lugarPlantacion === "otro" && !formData.otherLugar.trim()) {
      newErrors.otherLugar = "Especifique el otro lugar.";
    }
    // if (
    //   formData.sanidad === "enfermo" &&
    //   !formData.enfermedadDescription.trim()
    // ) {
    //   newErrors.enfermedadDescription = "Describa la enfermedad.";
    // }
    // Validaciones adicionales si es necesario, ej. formato de altura/diametro
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      // Reset form if needed
      setFormData({
        arbolCompleto: null,
        raizBase: null,
        corteza: null,
        hoja: null,
        flor: null,
        proyecto: "",
        nombrePropio: "",
        nombreComun: "",
        nombreCientifico: "",
        altura: "",
        diametro: "",
        lugarPlantacion: "",
        sanidad: "",
        otherLugar: "",
        enfermedadDescription: "",
      });
      setSelectedLugarPlantacion("");
      setSelectedSanidad("");
      setPreviews({});
    }
  };

  const renderFileInput = (label, field, required = false) => (
    <div className={styles.field}>
      <label className={styles.label}>
        {label}
        {required && " *"}
      </label>
      {previews[field] ? null : (
        <div className={styles.fileContainer}>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(e) => handleFileChange(field, e)}
            className={styles.fileInput}
          />
        </div>
      )}

      {previews[field] && (
        <div className={styles.previewContainer}>
          <img
            src={previews[field]}
            alt={`Preview ${label}`}
            className={styles.preview}
          />
          <button
            type="button"
            onClick={() => removeImage(field)}
            className={styles.removeIcon}
          >
            <X size={16} />
          </button>
        </div>
      )}
      {errors[field] && <span className={styles.error}>{errors[field]}</span>}
    </div>
  );

  const renderTextInput = (label, field, placeholder = "") => (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
      <input
        type="text"
        value={formData[field]}
        onChange={(e) => handleTextChange(field, e)}
        placeholder={placeholder}
        className={styles.textInput}
      />
      {errors[field] && <span className={styles.error}>{errors[field]}</span>}
    </div>
  );

  const renderRadioInput = (label, field, options, selected, setSelected, conditionalField, conditionalValue, conditionalPlaceholder) => (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
      <div className={styles.radioContainer}>
        {options.map((option) => (
          <Radio
            key={option.value}
            value={option.label}
            onClick={() => {
              setSelected(option.value);
              setFormData((prev) => ({
                ...prev,
                [field]: option.value,
              }));
            }}
            checked={option.value === selected}
          />
        ))}
      </div>
      {selected === conditionalValue &&
        renderTextInput("", conditionalField, conditionalPlaceholder)}
      {/* {errors[field] && <span className={styles.error}>as{errors[field]}</span>} */}
    </div>
  );

  const submitAcctions = () => (
    <div className={styles.submitActions}>
      <Button type="submit" variant="terciary" fullWidth>
        Cancelar
      </Button>
      <Button type="submit" variant="secondary" fullWidth>
        Enviar
      </Button>
    </div>
  );

  if (!forceShow && !showTreeAdoptForm) return null;

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.title}>Formulario de Adopciòn</h2>

      {renderFileInput("Foto del árbol", "arbolCompleto", true)}

      {renderTextInput("Proyecto", "proyecto", "Ingrese el proyecto")}
      {renderTextInput(
        "Nombre propio *",
        "nombrePropio",
        "Ingrese nombre propio"
      )}
      {renderTextInput(
        "Nombre común *",
        "nombreComun",
        "Ingrese nombre común"
      )}
      {renderTextInput(
        "Nombre científico *",
        "nombreCientifico",
        "Ingrese nombre científicomún"
      )}

      {renderRadioInput(
        "Lugar de plantación *",
        "lugarPlantacion",
        lugarPlantacion,
        selectedLugarPlantacion,
        setSelectedLugarPlantacion,
        "Otro",
        "otro",
        "Especificar lugar"
      )}

      {renderRadioInput(
        "Sanidad *",
        "sanidad",
        sanidad,
        selectedSanidad,
        setSelectedSanidad,
        "enfermedadDescription",
        "enfermo",
        "Describa la enfermedad"
      )}
      {submitAcctions()}
    </form>
  );
};
