import React from 'react';
import { FileText, Image, X, ChevronRight } from 'lucide-react';
import '../../styles/DownloadResumePopup.css';

const DownloadResumePopup = ({
    open,
    onClose,
    onDownloadPDF,
    onDownloadImage
}) => {
    if (!open) return null;

    return (
        <div className="download-modal-overlay" onClick={onClose}>
            <div className="download-modal-container" onClick={e => e.stopPropagation()}>
                <div className="download-modal-header">
                    <h2 className="download-modal-title">Download Resume</h2>
                    <button className="close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="download-options">
                    <div className="download-option pdf" onClick={onDownloadPDF}>
                        <div className="icon-box">
                            <FileText size={24} />
                        </div>
                        <div className="option-content">
                            <span className="option-title">PDF Document</span>
                            <span className="option-desc">Perfect for job applications (ATS friendly)</span>
                        </div>
                        <ChevronRight className="chevron" size={20} />
                    </div>

                    <div className="download-option image" onClick={onDownloadImage}>
                        <div className="icon-box">
                            <Image size={24} />
                        </div>
                        <div className="option-content">
                            <span className="option-title">Image (JPEG)</span>
                            <span className="option-desc">Best for sharing on social media</span>
                        </div>
                        <ChevronRight className="chevron" size={20} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DownloadResumePopup;
