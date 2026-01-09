import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import '../styles/SelectTemplate_.css';

import modernImage from '../assets/templates/Modern.jpeg';
import professionalImage from '../assets/templates/professional.jpeg';

const SelectTemplate = () => {
    const navigate = useNavigate();
    const [selectedTemplate, setSelectedTemplate] = useState('modern');

    const templates = [
        {
            id: 'modern',
            name: 'Modern Minimalist',
            description: 'Clean and contemporary design perfect for creative and tech roles',
            image: modernImage,
            popular: true
        },
        {
            id: 'professional',
            name: 'Professional',
            description: 'Traditional layout ideal for corporate and executive positions',
            image: professionalImage,
            popular: false
        }
    ];

    const handleSelectTemplate = (templateId) => {
        setSelectedTemplate(templateId);
    };

    const handleContinue = () => {
        if (selectedTemplate) {
            navigate('/create', { state: { templateId: selectedTemplate } });
        }
    };

    return (
        <div className="select-template">
            <div className="container">
                <div className="template-header">
                    <h1 className="template-title">
                        Choose Your <span className="gradient-text">Template</span>
                    </h1>
                    <p className="template-subtitle">
                        Select a professional template that matches your style and industry
                    </p>
                </div>

                <div className="templates-grid">
                    {templates.map((template) => (
                        <div
                            key={template.id}
                            className={`template-card card ${selectedTemplate === template.id ? 'selected' : ''}`}
                            onClick={() => handleSelectTemplate(template.id)}
                        >
                            {template.popular && (
                                <div className="template-badge">Popular</div>
                            )}
                            {selectedTemplate === template.id && (
                                <div className="template-checkmark">
                                    <Check size={20} />
                                </div>
                            )}
                            <div className="template-preview">
                                <img src={template.image} alt={template.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            </div>
                            <div className="template-info">
                                <h3 className="template-name">{template.name}</h3>
                                <p className="template-description">{template.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="template-actions">
                    <button
                        onClick={handleContinue}
                        className="btn btn-primary btn-lg"
                        disabled={!selectedTemplate}
                    >
                        Continue with Selected Template
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SelectTemplate;
