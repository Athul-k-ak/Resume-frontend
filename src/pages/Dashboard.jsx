import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, FileText, Download, Edit, Trash2, Calendar, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import resumeService from '../services/resumeService';
import ModernTemplate from '../components/templates/ModernTemplate';
import ProfessionalTemplate from '../components/templates/ProfessionalTemplate';
import html2pdf from 'html2pdf.js';
import DownloadResumePopup from '../components/templates/DownloadResumePopup';
import '../styles/Dashboard_.css';
import DeleteConfirmationModal from '../components/common/DeleteConfirmationModal';
import Toast from '../components/common/Toast';

const Dashboard = () => {
    const { user } = useAuth();
    const [resumes, setResumes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadingResume, setDownloadingResume] = useState(null);
    const [showDownloadPopup, setShowDownloadPopup] = useState(false);
    const [selectedResumeId, setSelectedResumeId] = useState(null);
    const [error, setError] = useState('');

    // Delete Confirmation State
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [resumeToDelete, setResumeToDelete] = useState(null);

    // Toast State
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('success');

    const downloadRef = React.useRef();

    useEffect(() => {
        fetchResumes();
    }, []);

    const fetchResumes = async () => {
        try {
            setIsLoading(true);
            const data = await resumeService.getResumes();
            setResumes(data);
        } catch (err) {
            console.error('Error fetching resumes:', err);
            setError('Failed to load resumes. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const initiateDelete = (id) => {
        setResumeToDelete(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!resumeToDelete) return;
        try {
            await resumeService.deleteResume(resumeToDelete);
            setResumes(resumes.filter(resume => resume._id !== resumeToDelete));
            setToastMessage('Resume deleted successfully');
            setToastType('success');
            setShowToast(true);
        } catch (err) {
            console.error('Error deleting resume:', err);
            setToastMessage('Failed to delete resume');
            setToastType('error');
            setShowToast(true);
        } finally {
            setShowDeleteModal(false);
            setResumeToDelete(null);
        }
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setResumeToDelete(null);
    };

    const handleDownload = (resumeId) => {
        setSelectedResumeId(resumeId);
        setShowDownloadPopup(true);
    };

    const onDownloadPDF = async () => {
        if (!selectedResumeId) return;
        try {
            setIsDownloading(true);
            const fullResume = await resumeService.getResume(selectedResumeId);
            setDownloadingResume(fullResume);

            // Wait for render
            setTimeout(() => {
                const element = downloadRef.current;
                const opt = {
                    margin: 0,
                    filename: `${fullResume.title || 'Resume'}.pdf`,
                    image: { type: 'jpeg', quality: 0.98 },
                    html2canvas: { scale: 2, useCORS: true },
                    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
                };

                html2pdf().set(opt).from(element).save().then(() => {
                    setDownloadingResume(null);
                    setIsDownloading(false);
                    setShowDownloadPopup(false);
                });
            }, 500);
        } catch (err) {
            console.error('Download failed:', err);
            alert('Failed to download resume');
            setIsDownloading(false);
        }
    };

    const onDownloadImage = async () => {
        if (!selectedResumeId) return;
        try {
            setIsDownloading(true);
            const fullResume = await resumeService.getResume(selectedResumeId);
            setDownloadingResume(fullResume);

            // Wait for render
            setTimeout(() => {
                const element = downloadRef.current;
                const opt = {
                    margin: 0,
                    filename: `${fullResume.title || 'Resume'}.jpeg`,
                    image: { type: 'jpeg', quality: 0.98 },
                    html2canvas: { scale: 2, useCORS: true }
                };

                html2pdf().set(opt).from(element).outputImg('img').then((img) => {
                    const link = document.createElement('a');
                    link.href = img.src;
                    link.download = `${fullResume.title || 'Resume'}.jpeg`;
                    link.click();
                    setDownloadingResume(null);
                    setIsDownloading(false);
                    setShowDownloadPopup(false);
                });
            }, 500);
        } catch (err) {
            console.error('Download failed:', err);
            alert('Failed to download resume');
            setIsDownloading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (isLoading) {
        return (
            <div className="dashboard">
                <div className="container">
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
                        <div className="loader"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard">
            <div className="container">
                {/* Header */}
                <div className="dashboard-header">
                    <div className="header-content">
                        <h1 className="dashboard-title">
                            Welcome back, <span className="gradient-text">{user?.name}</span>
                        </h1>
                        <p className="dashboard-subtitle">
                            Manage your resumes and create new ones to land your dream job
                        </p>
                    </div>
                    <Link to="/templates" className="btn btn-primary">
                        <Plus size={20} />
                        Create New Resume
                    </Link>
                </div>

                {/* Stats */}
                <div className="dashboard-stats">
                    <div className="stat-card glass">
                        <div className="stat-icon gradient-text">
                            <FileText size={32} />
                        </div>
                        <div className="stat-info">
                            <div className="stat-value">{resumes.length}</div>
                            <div className="stat-label">Total Resumes</div>
                        </div>
                    </div>
                    {/* <div className="stat-card glass">
                        <div className="stat-icon gradient-text">
                            <Download size={32} />
                        </div>
                        <div className="stat-info">
                            <div className="stat-value">0</div>
                            <div className="stat-label">Downloads</div>
                        </div>
                    </div>
                    <div className="stat-card glass">
                        <div className="stat-icon gradient-text">
                            <Calendar size={32} />
                        </div>
                        <div className="stat-info">
                            <div className="stat-value">{resumes.length > 0 ? 'Active' : 'Inactive'}</div>
                            <div className="stat-label">Status</div>
                        </div>
                    </div> */}
                </div>

                {error && <div className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

                {/* Resumes Grid */}
                <div className="resumes-section">
                    <h2 className="section-title">Your Resumes</h2>

                    {resumes.length > 0 ? (
                        <div className="resumes-grid">
                            {resumes.map((resume) => (
                                <div key={resume._id} className="resume-card card">
                                    <div className="resume-preview">
                                        <div className="thumbnail-wrapper">
                                            {resume.templateId === 'professional' ? (
                                                <ProfessionalTemplate data={resume} />
                                            ) : (
                                                <ModernTemplate data={resume} />
                                            )}
                                        </div>
                                    </div>
                                    <div className="resume-info">
                                        <h3 className="resume-title">{resume.title || 'Untitled Resume'}</h3>
                                        <div className="resume-meta">
                                            <span className="resume-template">
                                                {resume.templateId ? resume.templateId.charAt(0).toUpperCase() + resume.templateId.slice(1) : 'Modern'} Template
                                            </span>
                                            <span className="resume-date">Updated {formatDate(resume.updatedAt)}</span>
                                        </div>
                                    </div>
                                    <div className="resume-actions">
                                        <Link
                                            to={`/edit/${resume._id}`}
                                            className="btn btn-ghost btn-sm"
                                        >
                                            <Edit size={16} />
                                            Edit
                                        </Link>
                                        <button
                                            className="btn btn-ghost btn-sm"
                                            onClick={() => handleDownload(resume._id)}
                                            disabled={isDownloading}
                                        >
                                            {isDownloading && downloadingResume?._id === resume._id ? (
                                                <Loader2 size={16} className="animate-spin" />
                                            ) : (
                                                <Download size={16} />
                                            )}
                                            Download
                                        </button>
                                        <button
                                            onClick={() => initiateDelete(resume._id)}
                                            className="btn btn-ghost btn-sm delete-btn"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <FileText size={64} className="empty-icon" />
                            <h3 className="empty-title">No resumes yet</h3>
                            <p className="empty-description">
                                Create your first resume and start your journey to landing your dream job
                            </p>
                            <Link to="/templates" className="btn btn-primary">
                                <Plus size={20} />
                                Create Your First Resume
                            </Link>
                        </div>
                    )}
                </div>

                {/* Hidden container for PDF generation */}
                <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
                    <div ref={downloadRef} style={{ width: '210mm' }}>
                        {downloadingResume && (
                            downloadingResume.templateId === 'professional' ? (
                                <ProfessionalTemplate data={downloadingResume} />
                            ) : (
                                <ModernTemplate data={downloadingResume} />
                            )
                        )}
                    </div>
                </div>
                <DownloadResumePopup
                    open={showDownloadPopup}
                    onClose={() => setShowDownloadPopup(false)}
                    onDownloadPDF={onDownloadPDF}
                    onDownloadImage={onDownloadImage}
                    loading={isDownloading}
                />

                <DeleteConfirmationModal
                    isOpen={showDeleteModal}
                    onClose={cancelDelete}
                    onConfirm={confirmDelete}
                    title="Delete Resume"
                    message="Are you sure you want to delete this resume? This action cannot be undone."
                />

                {showToast && (
                    <Toast
                        message={toastMessage}
                        type={toastType}
                        onClose={() => setShowToast(false)}
                    />
                )}
            </div>
        </div>
    );
};

export default Dashboard;
