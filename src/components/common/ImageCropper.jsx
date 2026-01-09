import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Slider } from '@mui/material';
import { X, Check, ZoomIn, ZoomOut } from 'lucide-react';
import getCroppedImg from '../../utils/canvasUtils';
import '../../styles/ImageCropper.css';

const ImageCropper = ({ imageSrc, onCropComplete, onCancel }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const onCropChange = (crop) => {
        setCrop(crop);
    };

    const onZoomChange = (zoom) => {
        setZoom(zoom);
    };

    const onCropCompleteCallback = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleSave = async () => {
        try {
            const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
            onCropComplete(croppedImage);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="cropper-overlay">
            <div className="cropper-modal glass-strong">
                <div className="cropper-header">
                    <h3>Adjust Image</h3>
                    <button onClick={onCancel} className="btn-icon">
                        <X size={20} />
                    </button>
                </div>

                <div className="cropper-container">
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        onCropChange={onCropChange}
                        onCropComplete={onCropCompleteCallback}
                        onZoomChange={onZoomChange}
                    />
                </div>

                <div className="cropper-controls">
                    <div className="zoom-control">
                        <ZoomOut size={16} />
                        <Slider
                            value={zoom}
                            min={1}
                            max={3}
                            step={0.1}
                            aria-labelledby="Zoom"
                            onChange={(e, zoom) => setZoom(zoom)}
                        />
                        <ZoomIn size={16} />
                    </div>

                    <div className="cropper-actions">
                        <button onClick={onCancel} className="btn btn-ghost">
                            Cancel
                        </button>
                        <button onClick={handleSave} className="btn btn-primary">
                            <Check size={18} />
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageCropper;
