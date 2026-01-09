import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import {
    Save,
    Download,
    ArrowLeft,
    Plus,
    Trash2,
    Image as ImageIcon,
    GripVertical,
    Mail,
    Phone,
    MapPin,
    Linkedin,
    Globe,
    Type,
    Layout,
    Check
} from 'lucide-react';
import html2pdf from 'html2pdf.js';
import DownloadResumePopup from '../components/templates/DownloadResumePopup';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import resumeService from '../services/resumeService';
import ModernTemplate from '../components/templates/ModernTemplate';
import ProfessionalTemplate from '../components/templates/ProfessionalTemplate';
import '../styles/CreateResume_.css';
import { uploadProfileImage } from '../services/uploadService';
import ImageCropper from '../components/common/ImageCropper';
import Toast from '../components/common/Toast';


// Global Sensors outside component to avoid recreation
// Global Sensors outside component to avoid recreation
const SENSORS_CONFIG = [
    {
        sensor: PointerSensor,
        options: {
            activationConstraint: {
                distance: 8,
            },
        }
    },
    {
        sensor: KeyboardSensor,
        options: {
            coordinateGetter: sortableKeyboardCoordinates,
        },
    },
];

const SortableSection = ({ id, label, enabled, onToggle, children }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`form-section card ${!enabled ? 'disabled' : ''}`}
        >
            <h3 className="section-title">
                {label}
                <div className="section-header-actions">
                    <label className="section-toggle">
                        <input
                            type="checkbox"
                            checked={enabled}
                            onChange={() => onToggle(id)}
                        />
                        {enabled ? 'Enabled' : 'Disabled'}
                    </label>
                    <div className="drag-handle" {...attributes} {...listeners}>
                        <GripVertical size={20} />
                    </div>
                </div>
            </h3>
            {children}
        </div>
    );
};

const CreateResume = ({ resumeId: propResumeId, isEditing: propIsEditing }) => {
    const location = useLocation();
    const { id: urlResumeId } = useParams();
    const resumeId = propResumeId || urlResumeId;
    const isEditing = propIsEditing || !!urlResumeId;
    const navigate = useNavigate();
    const templateId = location.state?.templateId || 'modern';
    const resumeRef = useRef();

    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [showDownloadPopup, setShowDownloadPopup] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

    // Cropper State
    const [imageSrc, setImageSrc] = useState(null);
    const [showCropper, setShowCropper] = useState(false);
    const [isImageUploading, setIsImageUploading] = useState(false);

    // Toast State
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('success');

    const [formData, setFormData] = useState({
        title: 'Untitled Resume',
        personalInfo: {
            fullName: '',
            email: '',
            phone: '',
            location: '',
            linkedin: '',
            website: '',
            jobTitle: '',
            profileImage: ''
        },
        summary: '',
        experience: [
            {
                position: '',
                company: '',
                location: '',
                startDate: '',
                endDate: '',
                description: ''
            }
        ],
        education: [
            {
                school: '',
                degree: '',
                field: '',
                graduationDate: ''
            }
        ],
        projects: [
            {
                title: '',
                subtitle: '',
                description: '',
                link: ''
            }
        ],
        certifications: [
            {
                name: '',
                issuer: '',
                date: ''
            }
        ],
        skills: [],
        templateId: templateId,
        sections: [
            { id: 'summary', label: 'Professional Summary', enabled: true, column: 'left' },
            { id: 'experience', label: 'Work Experience', enabled: true, column: 'right' },
            { id: 'education', label: 'Education', enabled: true, column: 'left' },
            { id: 'projects', label: 'Projects', enabled: true, column: 'right' },
            { id: 'certifications', label: 'Certifications', enabled: true, column: 'right' },
            { id: 'skills', label: 'Skills', enabled: true, column: 'left' }
        ]
    });

    const defaultSections = [
        { id: 'summary', label: 'Professional Summary', enabled: true, column: 'left' },
        { id: 'experience', label: 'Work Experience', enabled: true, column: 'right' },
        { id: 'education', label: 'Education', enabled: true, column: 'left' },
        { id: 'projects', label: 'Projects', enabled: true, column: 'right' },
        { id: 'certifications', label: 'Certifications', enabled: true, column: 'right' },
        { id: 'skills', label: 'Skills', enabled: true, column: 'left' }
    ];

    const [currentSkill, setCurrentSkill] = useState('');

    useEffect(() => {
        if (isEditing && resumeId) {
            fetchResumeData();
        }
    }, [isEditing, resumeId]);

    const fetchResumeData = async () => {
        try {
            setIsLoading(true);
            const data = await resumeService.getResume(resumeId);
            setFormData({
                title: data.title || 'Untitled Resume',
                personalInfo: data.personalInfo || {},
                summary: data.summary || '',
                experience: data.experience?.length ? data.experience : [{ position: '', company: '', location: '', startDate: '', endDate: '', description: '' }],
                education: data.education?.length ? data.education : [{ school: '', degree: '', field: '', graduationDate: '' }],
                projects: data.projects?.length ? data.projects : [{ title: '', subtitle: '', description: '', link: '' }],
                certifications: data.certifications?.length ? data.certifications : [{ name: '', issuer: '', date: '' }],
                skills: data.skills || [],
                templateId: data.templateId || 'modern',
                sections: data.sections?.length ? data.sections : defaultSections
            });
        } catch (error) {
            console.error('Error fetching resume:', error);
            setToastMessage('Failed to load resume data');
            setToastType('error');
            setShowToast(true);
            setTimeout(() => navigate('/dashboard'), 2000); // Give time to read toast
        } finally {
            setIsLoading(false);
        }
    };

    const handlePersonalInfoChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            personalInfo: {
                ...prev.personalInfo,
                [name]: value
            }
        }));
    };

    const handleTitleChange = (e) => {
        setFormData(prev => ({ ...prev, title: e.target.value }));
    };

    const handleTemplateChange = (e) => {
        setFormData(prev => ({ ...prev, templateId: e.target.value }));
    };

    const handleSummaryChange = (e) => {
        setFormData(prev => ({ ...prev, summary: e.target.value }));
    };

    const handleExperienceChange = (index, e) => {
        const { name, value } = e.target;
        const newExperience = [...formData.experience];
        newExperience[index] = { ...newExperience[index], [name]: value };
        setFormData(prev => ({ ...prev, experience: newExperience }));
    };

    const addExperience = () => {
        setFormData(prev => ({
            ...prev,
            experience: [...prev.experience, { position: '', company: '', location: '', startDate: '', endDate: '', description: '' }]
        }));
    };

    const removeExperience = (index) => {
        setFormData(prev => ({
            ...prev,
            experience: prev.experience.filter((_, i) => i !== index)
        }));
    };

    const handleEducationChange = (index, e) => {
        const { name, value } = e.target;
        const newEducation = [...formData.education];
        newEducation[index] = { ...newEducation[index], [name]: value };
        setFormData(prev => ({ ...prev, education: newEducation }));
    };

    const addEducation = () => {
        setFormData(prev => ({
            ...prev,
            education: [...prev.education, { school: '', degree: '', field: '', graduationDate: '' }]
        }));
    };

    const removeEducation = (index) => {
        setFormData(prev => ({
            ...prev,
            education: prev.education.filter((_, i) => i !== index)
        }));
    };

    /* Projects Handlers */
    const handleProjectChange = (index, e) => {
        const { name, value } = e.target;
        const newProjects = [...formData.projects];
        newProjects[index] = { ...newProjects[index], [name]: value };
        setFormData(prev => ({ ...prev, projects: newProjects }));
    };

    const addProject = () => {
        setFormData(prev => ({
            ...prev,
            projects: [...prev.projects, { title: '', subtitle: '', description: '', link: '' }]
        }));
    };

    const removeProject = (index) => {
        setFormData(prev => ({
            ...prev,
            projects: prev.projects.filter((_, i) => i !== index)
        }));
    };

    /* Certifications Handlers */
    const handleCertificationChange = (index, e) => {
        const { name, value } = e.target;
        const newCerts = [...formData.certifications];
        newCerts[index] = { ...newCerts[index], [name]: value };
        setFormData(prev => ({ ...prev, certifications: newCerts }));
    };

    const addCertification = () => {
        setFormData(prev => ({
            ...prev,
            certifications: [...prev.certifications, { name: '', issuer: '', date: '' }]
        }));
    };

    const removeCertification = (index) => {
        setFormData(prev => ({
            ...prev,
            certifications: prev.certifications.filter((_, i) => i !== index)
        }));
    };

    /* Image Upload Handler */
    /* Image Upload Handler */
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.addEventListener('load', () => {
            setImageSrc(reader.result);
            setShowCropper(true);
            e.target.value = null; // Reset input so same file can be selected again
        });
        reader.readAsDataURL(file);
    };

    const handleCropComplete = async (croppedBlob) => {
        // Optimistic Update: Show image immediately
        const optimisticUrl = URL.createObjectURL(croppedBlob);
        setFormData(prev => ({
            ...prev,
            personalInfo: { ...prev.personalInfo, profileImage: optimisticUrl }
        }));

        setShowCropper(false);
        setToastMessage('Profile image uploaded successfully!');
        setToastType('success');
        setShowToast(true);
        setIsImageUploading(true); // Start background upload

        try {
            // Perform actual upload in background
            const imageUrl = await uploadProfileImage(croppedBlob);

            // On success, update with real URL
            setFormData(prev => ({
                ...prev,
                personalInfo: { ...prev.personalInfo, profileImage: imageUrl }
            }));
        } catch (error) {
            console.error('Upload failed', error);
            setToastMessage('Failed to upload image. Please try again.');
            setToastType('error');
            setShowToast(true);

            // Revert optimistic update on failure (optional, or just keep showing generic placeholder if available)
            // For now, we keep the previous state or handle as needed. 
            // Ideally we might want to revert:
            /*
            setFormData(prev => ({
               ...prev,
               personalInfo: { ...prev.personalInfo, profileImage: prev.personalInfo.profileImage === optimisticUrl ? '' : prev.personalInfo.profileImage }
            }));
            */
        } finally {
            setIsImageUploading(false);
        }
    };

    const handleCropperCancel = () => {
        setShowCropper(false);
        setImageSrc(null);
    };

    const handleAddSkill = () => {
        if (currentSkill.trim()) {
            setFormData(prev => ({
                ...prev,
                skills: [...prev.skills, currentSkill.trim()]
            }));
            setCurrentSkill('');
        }
    };

    const handleRemoveSkill = (index) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.filter((_, i) => i !== index)
        }));
    };

    const handleSave = async () => {
        if (isLoading) return; // Prevent saving while still loading data
        if (isImageUploading) {
            setToastMessage('Image is still uploading. Please wait...');
            setToastType('warning');
            setShowToast(true);
            return;
        }
        try {
            setIsSaving(true);
            if (isEditing) {
                await resumeService.updateResume(resumeId, formData);
                setToastMessage('Resume updated successfully!');
                setToastType('success');
                setShowToast(true);
            } else {
                await resumeService.createResume(formData);
                setToastMessage('Resume created successfully!');
                setToastType('success');
                setShowToast(true);
                setTimeout(() => navigate('/dashboard'), 1500);
            }
        } catch (error) {
            console.error('Error saving resume:', error);
            setToastMessage('Failed to save resume. Please try again.');
            setToastType('error');
            setShowToast(true);
        } finally {
            setIsSaving(false);
        }
    };

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setFormData((prev) => {
                const oldIndex = prev.sections.findIndex((s) => s.id === active.id);
                const newIndex = prev.sections.findIndex((s) => s.id === over.id);
                return {
                    ...prev,
                    sections: arrayMove(prev.sections, oldIndex, newIndex),
                };
            });
        }
    };

    const toggleSection = (id) => {
        setFormData(prev => ({
            ...prev,
            sections: prev.sections.map(s =>
                s.id === id ? { ...s, enabled: !s.enabled } : s
            )
        }));
    };

    const handleDownload = () => {
        setShowDownloadPopup(true);
    };

    const onDownloadPDF = () => {
        const element = resumeRef.current;
        if (!element) {
            setToastMessage('Resume preview not found');
            setToastType('error');
            setShowToast(true);
            return;
        }

        setIsDownloading(true);
        setShowDownloadPopup(false); // Close immediately for "instant" feel
        setToastMessage('Preparing PDF download...');
        setToastType('success'); // or info
        setShowToast(true);

        const opt = {
            margin: 0,
            filename: `${formData.title || 'Resume'}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
                scale: 2,
                useCORS: true,
                letterRendering: true
            },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        // Small timeout to allow UI to update (close popup) before heavy thread work
        setTimeout(() => {
            html2pdf().set(opt).from(element).save().then(() => {
                setIsDownloading(false);
                setToastMessage('PDF Downloaded successfully');
                setShowToast(true);
            }).catch(err => {
                console.error(err);
                setIsDownloading(false);
                setToastMessage('Failed to download PDF');
                setToastType('error');
                setShowToast(true);
            });
        }, 100);
    };

    const onDownloadImage = () => {
        const element = resumeRef.current;
        if (!element) {
            setToastMessage('Resume preview not found');
            setToastType('error');
            setShowToast(true);
            return;
        }

        setIsDownloading(true);
        setShowDownloadPopup(false);
        setToastMessage('Preparing Image download...');
        setToastType('success');
        setShowToast(true);

        const opt = {
            margin: 0,
            filename: `${formData.title || 'Resume'}.jpeg`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
                scale: 2,
                useCORS: true,
                letterRendering: true
            }
        };

        setTimeout(() => {
            html2pdf().set(opt).from(element).outputImg('img').then((img) => {
                const link = document.createElement('a');
                link.href = img.src;
                link.download = `${formData.title || 'Resume'}.jpeg`;
                link.click();
                setIsDownloading(false);
                setToastMessage('Image downloaded successfully');
                setShowToast(true);
            }).catch(err => {
                console.error(err);
                setIsDownloading(false);
                setToastMessage('Failed to download Image');
                setToastType('error');
                setShowToast(true);
            });
        }, 100);
    };


    if (isLoading) {
        return <div className="loader-container"><div className="loader"></div></div>;
    }

    const renderSection = (sectionId) => {
        const section = formData.sections.find(s => s.id === sectionId);
        if (!section) return null;

        const { id, label, enabled } = section;

        switch (id) {
            case 'summary':
                return (
                    <SortableSection key={id} id={id} label={label} enabled={enabled} onToggle={toggleSection}>
                        <div className="form-group">
                            <label className="form-label">Professional Summary</label>
                            <textarea
                                name="summary"
                                className="form-textarea"
                                placeholder="Brief overview of your professional background..."
                                value={formData.summary}
                                onChange={handleSummaryChange}
                                rows="4"
                            />
                        </div>
                    </SortableSection>
                );
            case 'experience':
                return (
                    <SortableSection key={id} id={id} label={label} enabled={enabled} onToggle={toggleSection}>
                        {formData.experience.map((exp, index) => (
                            <div key={index} className="experience-item item-card">
                                {formData.experience.length > 1 && (
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
                                        <button onClick={() => removeExperience(index)} className="btn-icon-danger" title="Remove Experience">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                )}
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label className="form-label">Position</label>
                                        <input
                                            type="text"
                                            name="position"
                                            className="form-input"
                                            value={exp.position}
                                            onChange={(e) => handleExperienceChange(index, e)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Company</label>
                                        <input
                                            type="text"
                                            name="company"
                                            className="form-input"
                                            value={exp.company}
                                            onChange={(e) => handleExperienceChange(index, e)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Start Date</label>
                                        <input
                                            type="text"
                                            name="startDate"
                                            className="form-input"
                                            value={exp.startDate}
                                            onChange={(e) => handleExperienceChange(index, e)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">End Date</label>
                                        <input
                                            type="text"
                                            name="endDate"
                                            className="form-input"
                                            value={exp.endDate}
                                            onChange={(e) => handleExperienceChange(index, e)}
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Description</label>
                                    <textarea
                                        name="description"
                                        className="form-textarea"
                                        rows="3"
                                        value={exp.description}
                                        onChange={(e) => handleExperienceChange(index, e)}
                                    />
                                </div>

                            </div>
                        ))}
                        <button onClick={addExperience} className="btn btn-outline btn-sm full-width">+ Add Experience</button>
                    </SortableSection>
                );
            case 'education':
                return (
                    <SortableSection key={id} id={id} label={label} enabled={enabled} onToggle={toggleSection}>
                        {formData.education.map((edu, index) => (
                            <div key={index} className="education-item item-card">
                                {formData.education.length > 1 && (
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
                                        <button onClick={() => removeEducation(index)} className="btn-icon-danger" title="Remove Education">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                )}
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label className="form-label">School</label>
                                        <input
                                            type="text"
                                            name="school"
                                            className="form-input"
                                            value={edu.school}
                                            onChange={(e) => handleEducationChange(index, e)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Degree</label>
                                        <input
                                            type="text"
                                            name="degree"
                                            className="form-input"
                                            value={edu.degree}
                                            onChange={(e) => handleEducationChange(index, e)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Field of Study</label>
                                        <input
                                            type="text"
                                            name="field"
                                            className="form-input"
                                            value={edu.field}
                                            onChange={(e) => handleEducationChange(index, e)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Graduation Date</label>
                                        <input
                                            type="text"
                                            name="graduationDate"
                                            className="form-input"
                                            value={edu.graduationDate}
                                            onChange={(e) => handleEducationChange(index, e)}
                                        />
                                    </div>
                                </div>

                            </div>
                        ))}
                        <button onClick={addEducation} className="btn btn-outline btn-sm full-width">+ Add Education</button>
                    </SortableSection>
                );
            case 'projects':
                return (
                    <SortableSection key={id} id={id} label={label} enabled={enabled} onToggle={toggleSection}>
                        {formData.projects.map((proj, index) => (
                            <div key={index} className="project-item item-card">
                                {formData.projects.length > 1 && (
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
                                        <button onClick={() => removeProject(index)} className="btn-icon-danger" title="Remove Project">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                )}
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label className="form-label">Project Title</label>
                                        <input
                                            type="text"
                                            name="title"
                                            className="form-input"
                                            value={proj.title}
                                            onChange={(e) => handleProjectChange(index, e)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Sub Title (Optional)</label>
                                        <input
                                            type="text"
                                            name="subtitle"
                                            className="form-input"
                                            placeholder="e.g. University Group Project"
                                            value={proj.subtitle || ''}
                                            onChange={(e) => handleProjectChange(index, e)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Project Link</label>
                                        <input
                                            type="text"
                                            name="link"
                                            className="form-input"
                                            placeholder="https://github.com/..."
                                            value={proj.link}
                                            onChange={(e) => handleProjectChange(index, e)}
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Description</label>
                                    <textarea
                                        name="description"
                                        className="form-textarea"
                                        rows="3"
                                        value={proj.description}
                                        onChange={(e) => handleProjectChange(index, e)}
                                    />
                                </div>

                            </div>
                        ))}
                        <button onClick={addProject} className="btn btn-outline btn-sm full-width">+ Add Project</button>
                    </SortableSection>
                );
            case 'certifications':
                return (
                    <SortableSection key={id} id={id} label={label} enabled={enabled} onToggle={toggleSection}>
                        {formData.certifications.map((cert, index) => (
                            <div key={index} className="certification-item item-card">
                                {formData.certifications.length > 1 && (
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
                                        <button onClick={() => removeCertification(index)} className="btn-icon-danger" title="Remove Certification">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                )}
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label className="form-label">Certification Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            className="form-input"
                                            value={cert.name}
                                            onChange={(e) => handleCertificationChange(index, e)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Issuer</label>
                                        <input
                                            type="text"
                                            name="issuer"
                                            className="form-input"
                                            value={cert.issuer}
                                            onChange={(e) => handleCertificationChange(index, e)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Date</label>
                                        <input
                                            type="text"
                                            name="date"
                                            className="form-input"
                                            placeholder="e.g. 2023"
                                            value={cert.date}
                                            onChange={(e) => handleCertificationChange(index, e)}
                                        />
                                    </div>
                                </div>

                            </div>
                        ))}
                        <button onClick={addCertification} className="btn btn-outline btn-sm full-width">+ Add Certification</button>
                    </SortableSection>
                );
            case 'skills':
                return (
                    <SortableSection key={id} id={id} label={label} enabled={enabled} onToggle={toggleSection}>
                        <div className="skills-input">
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Add a skill (e.g., JavaScript, Project Management)"
                                value={currentSkill}
                                onChange={(e) => setCurrentSkill(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                            />
                            <button onClick={handleAddSkill} className="btn btn-primary">
                                Add
                            </button>
                        </div>
                        <div className="skills-list">
                            {formData.skills.map((skill, index) => (
                                <span key={index} className="skill-tag">
                                    {skill}
                                    <button onClick={() => handleRemoveSkill(index)} className="flex items-center justify-center">
                                        <Trash2 size={12} />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </SortableSection>
                );
            default:
                return null;
        }
    };

    if (isLoading && isEditing) {
        return (
            <div className="create-resume" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <div className="loader"></div>
            </div>
        );
    }

    return (
        <div className="create-resume">
            <div className="resume-toolbar glass-strong">
                <div className="container">
                    <div className="toolbar-content">
                        <div className="toolbar-left">
                            <button onClick={() => navigate('/dashboard')} className="btn btn-ghost btn-sm">
                                <ArrowLeft size={18} />
                                Dashboard
                            </button>
                            <input
                                type="text"
                                className="resume-title-input"
                                value={formData.title}
                                onChange={handleTitleChange}
                                placeholder="Resume Title"
                            />
                            <select
                                className="template-select"
                                value={formData.templateId}
                                onChange={handleTemplateChange}
                            >
                                <option value="modern">Modern Template</option>
                                <option value="professional">Professional Template</option>
                            </select>
                        </div>
                        <div className="toolbar-actions">
                            <button onClick={handleSave} className="btn btn-ghost btn-sm" disabled={isSaving}>
                                <Save size={18} />
                                {isSaving ? 'Saving...' : 'Save Resume'}
                            </button>
                            <button onClick={handleDownload} className="btn btn-primary btn-sm">
                                <Download size={18} />
                                Download
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="resume-editor">
                <div className="container-2xl">
                    <div className="editor-layout">
                        {/* Form Section */}
                        <div className="editor-form">
                            <div className="form-section card">
                                <h3 className="section-title">Personal Information</h3>
                                <div className="form-grid">
                                    {formData.templateId !== 'professional' && (
                                        <div className="form-group">
                                            <label className="form-label">Profile Image</label>
                                            <div className="image-upload-container">
                                                {formData.personalInfo.profileImage && (
                                                    <img
                                                        src={formData.personalInfo.profileImage}
                                                        alt="Profile"
                                                        className="w-16 h-16 rounded-full object-cover mb-2"
                                                        style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '50%', marginBottom: '0.5rem' }}
                                                    />
                                                )}
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    className="form-input"
                                                />
                                            </div>
                                        </div>
                                    )}
                                    <div className="form-group">
                                        <label className="form-label">Full Name</label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            className="form-input"
                                            placeholder="John Doe"
                                            value={formData.personalInfo.fullName}
                                            onChange={handlePersonalInfoChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Job Title</label>
                                        <input
                                            type="text"
                                            name="jobTitle"
                                            className="form-input"
                                            placeholder="e.g. Marketing Manager"
                                            value={formData.personalInfo.jobTitle || ''}
                                            onChange={handlePersonalInfoChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            className="form-input"
                                            placeholder="john@example.com"
                                            value={formData.personalInfo.email}
                                            onChange={handlePersonalInfoChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Phone</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            className="form-input"
                                            placeholder="+1 (555) 123-4567"
                                            value={formData.personalInfo.phone}
                                            onChange={handlePersonalInfoChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Location</label>
                                        <input
                                            type="text"
                                            name="location"
                                            className="form-input"
                                            placeholder="City, State"
                                            value={formData.personalInfo.location}
                                            onChange={handlePersonalInfoChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">LinkedIn</label>
                                        <input
                                            type="text"
                                            name="linkedin"
                                            className="form-input"
                                            placeholder="linkedin.com/in/username"
                                            value={formData.personalInfo.linkedin || ''}
                                            onChange={handlePersonalInfoChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleDragEnd}
                            >
                                <SortableContext
                                    items={formData.sections.map(s => s.id)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {formData.sections.map((section) => renderSection(section.id))}
                                </SortableContext>
                            </DndContext>
                        </div>

                        {/* Preview Section */}
                        {/* Preview Section */}
                        <div className="editor-preview">
                            <div
                                className="preview-container glass-strong"
                                style={{ padding: 0, overflow: 'hidden' }}
                                ref={resumeRef}
                            >
                                {formData.templateId === 'modern' ? (
                                    <div style={{ transform: 'scale(1)', transformOrigin: 'top center' }}>
                                        <ModernTemplate data={formData} />
                                    </div>
                                ) : formData.templateId === 'professional' ? (
                                    <div style={{ transform: 'scale(1)', transformOrigin: 'top center' }}>
                                        <ProfessionalTemplate data={formData} />
                                    </div>
                                ) : (
                                    <h3 style={{ padding: '2rem' }}>Select a valid template</h3>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <DownloadResumePopup
                    open={showDownloadPopup}
                    onClose={() => setShowDownloadPopup(false)}
                    onDownloadPDF={onDownloadPDF}
                    onDownloadImage={onDownloadImage}
                    loading={isDownloading}
                />
            </div>

            {showCropper && imageSrc && (
                <ImageCropper
                    imageSrc={imageSrc}
                    onCropComplete={handleCropComplete}
                    onCancel={handleCropperCancel}
                />
            )}

            {showToast && (
                <Toast
                    message={toastMessage}
                    type={toastType}
                    onClose={() => setShowToast(false)}
                />
            )}
        </div>
    );
};

export default CreateResume;

