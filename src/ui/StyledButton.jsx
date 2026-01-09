import React from 'react';

export const StyledButton = ({ name, variant, onClick, disabled }) => {
    const className = `btn ${variant === 'secondary' ? 'btn-outline' : 'btn-primary'} btn-sm`;

    return (
        <button
            className={className}
            onClick={onClick}
            disabled={disabled}
        >
            {name}
        </button>
    );
};
