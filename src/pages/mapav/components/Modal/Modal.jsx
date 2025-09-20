import React from 'react';
import styles from './Modal.module.css';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { TreeMappingForm } from '../TreeMappingForm/TreeMappingForm';
import { setShowTreeMappingForm, setShowTreeAdoptForm } from '../../../../actions/mapaActions';
import { TreeAdoptForm } from '../TreeAdoptForm/TreeAdoptForm';

const Modal = () => {
  const dispatch = useDispatch();
  const { showTreeMappingForm, showTreeAdoptForm } = useSelector((state) => state.mapa);

  if (!showTreeMappingForm && !showTreeAdoptForm) return null;

  const handleClose = () => {
    dispatch(setShowTreeMappingForm(false));
    dispatch(setShowTreeAdoptForm(false));
  };

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {showTreeMappingForm && <TreeMappingForm />}
        {showTreeAdoptForm && <TreeAdoptForm />}
        <button className={styles.closeButton} onClick={handleClose}>×</button>
      </div>
    </div>
  );
};

export default Modal;