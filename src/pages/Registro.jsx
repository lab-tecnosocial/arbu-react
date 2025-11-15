import React, { useState } from 'react';
import styles from './Registro.module.css'; // Assuming you create this CSS file
import { Input } from '../components/input/Input';
import { Button } from '../components/button/Button';
import { db } from '../firebase/firebase-config';
import { collection, addDoc } from 'firebase/firestore';

export const Registro = () => {
  const [formData, setFormData] = useState({
    email: "",
    nombres: '',
    idAuth: '',

    grupo: '',
    rama: "",

    scouts: '',
    estado: "pendiente",

  });
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  const handleTextChange = (field, event) => {
    const value = event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nombresApellidos.trim()) {
      newErrors.nombresApellidos = 'Nombres y apellidos son obligatorios.';
    }
    if (!formData.grupo.trim()) {
      newErrors.grupo = 'Grupo es obligatorio.';
    }
    if (!formData.scouts.trim()) {
      newErrors.scouts = 'Scouts es obligatorio.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      try {
        const coleccionRef = collection(db, 'inscripciones_test');
        const docRef = await addDoc(coleccionRef, formData);
        console.log("Documento escrito con ID: ", docRef.id);

        setShowSuccess(true);
        setFormData({
          nombresApellidos: '',
          grupo: '',
        });
        setErrors({});
        console.log('Form submitted:', formData);
      } catch (e) {
        console.error("Error al añadir el documento: ", e);
        alert("Hubo un error al subir los datos.");
      }
    }
  };

  return (
    <div className={styles.registroContainer}>
      {showSuccess ? (
        <div className={styles.successMessage}>
          <h2>Registro completado con éxito!</h2>
          <p>Arbu revisará tu información dentro de las próximas 24 horas para confirmar tu registro.
            Cuando el proceso finalice, podrás continuar.</p>
          <p></p>
          <Button type="button" variant="secondary" href={'/mapa'}>
            Aceptar y Volver
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={styles.form}>
          <h2>Formulario de Inscripción</h2>
          <Input
            label="Nombres y apellidos"
            value={formData.nombresApellidos}
            onChange={(e) => handleTextChange('nombresApellidos', e)}
            placeholder="Ingrese nombres y apellidos"
            error={errors.nombresApellidos}
            fullWidth
          />
          <Input
            label="Grupo"
            value={formData.grupo}
            onChange={(e) => handleTextChange('grupo', e)}
            placeholder="Ingrese grupo"
            error={errors.grupo}
            suggestions={['Manada', 'Tropa', 'Comunidad', 'Clan']}
            fullWidth
          />
          <Input
            label="Scouts"
            value={formData.scouts}
            onChange={(e) => handleTextChange('scouts', e)}
            placeholder="Ingrese scouts"
            suggestions={["ALEMAN", "AMERICA", "ANGLO_AMERICANO", "BOLIVIA",
              "BRONWSEA", "CEIDBO", "ESPAÑA", "FORTALEZA", "IMPEESA", "INCAS",
              "INTIDRAC", "KAIROS", "LA_SALLE", "LOYOLA", "MAFEKING", "MURRAY_DICKSON",
              "PANDA", "PRIMAVERA", "SAINT-ANDREWS", "SEMILLA", "TIQUIPAYA", "TUNARI"]}
            error={errors.scouts}
            fullWidth
            withIcon
          />
          <div className='line'></div>
          <Button type="submit" variant="secondary" fullWidth>
            Registrar
          </Button>
        </form>
      )}
    </div>
  );
};

