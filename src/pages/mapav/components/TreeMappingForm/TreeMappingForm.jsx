import React, { useState } from 'react';
import styles from './TreeMappingForm.module.css';
import { X } from 'lucide-react';
import { Button } from '../../../../components/button/Button';
import { useDispatch, useSelector } from 'react-redux';
import { Radio } from '../../../../components/Radio/Radio';
import { setModalState } from '../../../../actions/mapaActions';
import { Input } from '../../../../components/input/Input';
import { especies, nombreCientificos, nombresComunes } from '../../utils/especies'

export const lugarPlantacion = [
  { value: "acera", label: "Acera" },
  { value: "area verde", label: "Area verde" },
  { value: "plaza", label: "Plaza" },
  { value: "parque", label: "Parque" },
  { value: "corredor biologico", label: "Corredor biologico" },
  { value: "otro", label: "Otro" },
];

export const TreeMappingForm = ({ onSubmit }) => {
  const dispatch = useDispatch();
  const [selectedLugarPlantacion, setSelectedLugarPlantacion] = useState("acera");
  const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    arbolCompleto: null,
    raizBase: null,
    corteza: null,
    hoja: null,
    flor: null,
    proyecto: '',
    nombrePropio: '',
    nombreComun: '',
    nombreCientifico: '',
    lugarPlantacion: 'acera',
    otro: '',
    altura: '',
    diametro: '',
  });

  const [previews, setPreviews] = useState({});
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  const handleFileChange = (field, event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > MAX_IMAGE_SIZE) {
        setErrors(prev => ({ ...prev, [field]: 'La imagen es demasiado grande. Máximo 5MB.' }));
        event.target.value = '';
        return;
      }
      setFormData(prev => ({ ...prev, [field]: file }));
      setPreviews(prev => ({ ...prev, [field]: URL.createObjectURL(file) }));
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: null }));
      }
    }
  };

  const handleTextChange = (field, event) => {
    const value = event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const removeImage = (field) => {
    setFormData(prev => ({ ...prev, [field]: null }));
    setPreviews(prev => ({ ...prev, [field]: null }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateStep = (step = 3) => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.arbolCompleto) {
        newErrors.arbolCompleto = 'La foto del árbol completo es obligatoria.';
      }
    } else if (step === 2) {
      if (!formData.nombreComun?.trim()) {
        newErrors.nombreComun = 'El nombre comun es obligatorio.';
      }
      if (!formData.nombreCientifico?.trim()) {
        newErrors.nombreCientifico = 'El nombre científico es obligatorio.';
      }
    } else if (step === 3) {
      if (!formData.lugarPlantacion) {
        newErrors.lugarPlantacion = 'El lugar de plantación es obligatorio.';
      }
      if (selectedLugarPlantacion === 'otro' && !formData.otro?.trim()) {
        newErrors.otro = 'Especifique el lugar de plantación.';
      }
      if (!formData.altura.trim()) {
        newErrors.altura = 'El campo altura es obligatorio.';
      } else if (isNaN(Number(formData.altura))) {
        newErrors.altura = 'La altura debe ser un número válido.';
      }
      if (!formData.diametro) {
        newErrors.diametro = 'El campo diámetro es obligatorio.';
      } else if (isNaN(Number(formData.diametro))) {
        newErrors.diametro = 'El diámetro debe ser un número válido.';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setErrors({});
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    setErrors({});
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    if (!validateStep()) return;
    if (onSubmit) onSubmit(formData);
    setShowSuccess(true);
  };

  const handleResetAndClose = () => {
    setCurrentStep(1);
    setSelectedLugarPlantacion('acera');
    setFormData({
      arbolCompleto: null,
      raizBase: null,
      corteza: null,
      hoja: null,
      flor: null,
      proyecto: '',
      nombrePropio: '',
      nombreComun: '',
      nombreCientifico: '',
      lugarPlantacion: 'acera',
      otro: '',
      altura: '',
      diametro: '',
    });
    setPreviews({});
    setErrors({});
    setShowSuccess(false);
    dispatch(setModalState("CLOSE"));
  };

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
              setErrors(prev => ({
                ...prev,
                [field]: null,
                ...(option.value !== 'otro' ? { otro: null } : {})
              }));
            }}
            checked={option.value === selected}
          />
        ))}
      </div>
      {selected === conditionalValue &&
        <Input
          label=""
          value={formData[conditionalField]}
          onChange={(e) => handleTextChange(conditionalField, e)}
          placeholder={conditionalPlaceholder}
          error={errors[conditionalField]}
        />
      }
      {errors[field] && <span className={styles.error}>{errors[field]}</span>}
    </div>
  );

  return (
    <div className={styles.formContainer}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          Formulario de Mapeo
        </h2>
        <button className={styles.closeButton} onClick={showSuccess ? handleResetAndClose : () => dispatch(setModalState("CLOSE"))}><X /></button>
      </div>
      {showSuccess ? (
        <div className={styles.successContainer}>
          <h3>¡Formulario completado con éxito!</h3>
          <p>Los datos de mapeao han sido enviados correctamente.</p>
          <Button onClick={handleResetAndClose} variant="secondary" fullWidth>
            Aceptar y Salir
          </Button>
        </div>
      ) : (
        <>
          <div className={styles.form}>

            {currentStep === 1 && (
              <>
                <h4 style={{ fontSize: "20px" }}>Paso 1 de 3</h4>
                <Input
                  type="file"
                  label="Árbol completo"
                  required
                  accept="image/*"
                  capture="environment"
                  onFileChange={(e) => handleFileChange('arbolCompleto', e)}
                  previewSrc={previews.arbolCompleto}
                  onPreviewClose={() => removeImage('arbolCompleto')}
                  error={errors.arbolCompleto}
                />
                <Input
                  type="file"
                  label="Raiz o base"
                  accept="image/*"
                  capture="environment"
                  onFileChange={(e) => handleFileChange('raizBase', e)}
                  previewSrc={previews.raizBase}
                  onPreviewClose={() => removeImage('raizBase')}
                  error={errors.raizBase}
                />
                <Input
                  type="file"
                  label="Corteza"
                  accept="image/*"
                  capture="environment"
                  onFileChange={(e) => handleFileChange('corteza', e)}
                  previewSrc={previews.corteza}
                  onPreviewClose={() => removeImage('corteza')}
                  error={errors.corteza}
                />
                <Input
                  type="file"
                  label="Hoja"
                  accept="image/*"
                  capture="environment"
                  onFileChange={(e) => handleFileChange('hoja', e)}
                  previewSrc={previews.hoja}
                  onPreviewClose={() => removeImage('hoja')}
                  error={errors.hoja}
                />
                <Input
                  type="file"
                  label="Flor"
                  accept="image/*"
                  capture="environment"
                  onFileChange={(e) => handleFileChange('flor', e)}
                  previewSrc={previews.flor}
                  onPreviewClose={() => removeImage('flor')}
                  error={errors.flor}
                />
              </>
            )}

            {currentStep === 2 && (
              <>
                <h4 style={{ fontSize: "20px" }}>Paso 2 de 3</h4>
                <Input
                  label="Proyecto"
                  value={formData.proyecto}
                  onChange={(e) => handleTextChange('proyecto', e)}
                  placeholder="Ingrese el proyecto"
                  error={errors.proyecto}
                  fullWidth
                />
                <Input
                  label="Nombre propio"
                  value={formData.nombrePropio}
                  onChange={(e) => handleTextChange('nombrePropio', e)}
                  placeholder="Ingrese nombre propio"
                  error={errors.nombrePropio}
                  fullWidth
                />
                <Input
                  label="Nombre común*"
                  value={formData.nombreComun}
                  onChange={(e) => handleTextChange('nombreComun', e)}
                  placeholder="Ingrese nombre común"
                  error={errors.nombreComun}
                  fullWidth
                  // suggestions={especies.map(suggestion => suggestion.nombreComun)}
                  suggestions={nombresComunes}
                />
                <Input
                  label="Nombre científico*"
                  value={formData.nombreCientifico}
                  onChange={(e) => handleTextChange('nombreCientifico', e)}
                  placeholder="Ingrese nombre científico"
                  error={errors.nombreCientifico}
                  fullWidth
                  // suggestions={especies.map(suggestion => suggestion.nombreCientifico)}
                  suggestions={nombreCientificos}
                />
              </>
            )}

            {currentStep === 3 && (
              <>
                <h4 style={{ fontSize: "20px" }}>Paso 3 de 3</h4>
                {renderRadioInput(
                  "Lugar de plantación",
                  "lugarPlantacion",
                  lugarPlantacion,
                  selectedLugarPlantacion,
                  setSelectedLugarPlantacion,
                  "otro",
                  "otro",
                  "Especificar lugar"
                )}
                <Input
                  label="Altura (m)"
                  value={formData.altura}
                  onChange={(e) => handleTextChange('altura', e)}
                  placeholder="Ejm: 1.4"
                  error={errors.altura}
                  fullWidth
                />
                <Input
                  label="Diámetro a la altura del pecho (cm)"
                  value={formData.diametro}
                  onChange={(e) => handleTextChange('diametro', e)}
                  placeholder="Ejm: 12"
                  error={errors.diametro}
                  fullWidth
                />
              </>
            )}

          </div>
          <div className={styles.stepActions}>
            {currentStep === 1 && (
              <Button onClick={() => dispatch(setModalState("CLOSE"))} variant="terciary" fullWidth>
                Cancelar
              </Button>
            )}
            {currentStep > 1 && (
              <Button onClick={prevStep} variant="terciary" fullWidth>
                Anterior
              </Button>
            )}
            {currentStep < 3 ? (
              <Button onClick={nextStep} variant="secondary" fullWidth>
                Siguiente
              </Button>
            ) : (
              <Button onClick={handleSubmit} type="submit" variant="secondary" fullWidth>
                Completar
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

