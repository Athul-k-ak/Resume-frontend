import React from 'react';
import '../../styles/Loader.css';

const Loader = ({ fullScreen = false, size = 'medium', text = 'Loading...' }) => {
    const loaderClass = `loader-container ${fullScreen ? 'loader-fullscreen' : ''} ${size}`;

    return (
        <div className={loaderClass}>
            <div className="loader-spinner">
                <div className="spinner-ring"></div>
                <div className="spinner-ring"></div>
                <div className="spinner-ring"></div>
            </div>
            {text && <p className="loader-text">{text}</p>}
        </div>
    );
};

export default Loader;
