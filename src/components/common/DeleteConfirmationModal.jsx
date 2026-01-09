import React from 'react';
import '../../styles/DeleteConfirmationModal.css';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;

    return (
        <div className="delete-modal-overlay">
            <div className="delete-modal-container">
                <div className="delete-modal-header">
                    <h3 className="delete-modal-title">{title || 'Confirm Delete'}</h3>
                    <p className="delete-modal-message">
                        {message || 'Are you sure you want to delete this item? This action cannot be undone.'}
                    </p>
                </div>
                <div className="delete-modal-actions">
                    <button className="btn-cancel" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="btn-delete" onClick={onConfirm}>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;
