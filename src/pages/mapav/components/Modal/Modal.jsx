import React from 'react';
import styles from './Modal.module.css';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { TreeMappingForm } from '../TreeMappingForm/TreeMappingForm';
import { setModalState, setShowTreeMappingForm } from '../../../../actions/mapaActions';
import { TreeAdoptForm } from '../TreeAdoptForm/TreeAdoptForm';

const Modal = () => {
  const dispatch = useDispatch();
  const { showTreeMappingForm, modalState } = useSelector((state) => state.mapa);

  const handleClose = () => {
    dispatch(setModalState("CLOSE"));
  };

  if (modalState === "CLOSE") return null;

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <TreeMappingForm />
      </div>
    </div>
  );
};

export default Modal;
