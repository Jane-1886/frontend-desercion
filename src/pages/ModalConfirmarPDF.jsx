import React from 'react';

export default function ModalConfirmarPDF({ open, onClose, onConfirm, titulo = 'Generar PDF' }) {
  if (!open) return null;

  // Evitar backdrop fantasma: un solo overlay y cierre controlado
  return (
    <div className="modal-backdrop" style={backdropStyle} onClick={onClose}>
      <div className="modal-card" style={cardStyle} onClick={(e) => e.stopPropagation()}>
        <h3 style={{ margin: 0 }}>{titulo}</h3>
        <p>¿Deseas generar el PDF del reporte de este aprendiz?</p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button onClick={onClose}>Cancelar</button>
          <button onClick={onConfirm}>Sí, generar</button>
        </div>
      </div>
    </div>
  );
}

const backdropStyle = {
  position: 'fixed', inset: 0, display: 'grid', placeItems: 'center',
  background: 'rgba(0,0,0,.45)', zIndex: 1060
};
const cardStyle = {
  background: '#fff', padding: 16, borderRadius: 12, width: 'min(92vw, 420px)',
  boxShadow: '0 10px 30px rgba(0,0,0,.2)'
};
