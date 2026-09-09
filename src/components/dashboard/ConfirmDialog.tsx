import React from 'react';
import './ConfirmDialog.css';

const ConfirmDialog = ({ visible, onConfirm, onCancel, mensaje }) => {
  if (!visible) return null;
  return (
    <div className="confirm-overlay">
      <div className="confirm-dialog">
        <p>{mensaje}</p>
        <div className="confirm-buttons">
          <button onClick={onConfirm} className="confirm">Confirmar</button>
          <button onClick={onCancel} className="cancel">Cancelar</button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;