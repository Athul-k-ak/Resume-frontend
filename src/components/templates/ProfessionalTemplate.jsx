import React from 'react';
import { Phone, Mail, Globe, MapPin, Linkedin } from 'lucide-react';

const ProfessionalTemplate = ({ data }) => {
    const { personalInfo, summary, experience, education, skills } = data;

    const styles = {
        container: {
            width: '100%',
            height: '100%',
            fontFamily: "'Times New Roman', Times, serif",
            color: '#000',
            backgroundColor: 'white',
            padding: '40px',
            lineHeight: '1.4',
        },
        header: {
            textAlign: 'center',
            marginBottom: '20px',
        },
        name: {
            fontSize: '28px',
            fontWeight: 'bold',
            marginBottom: '5px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
        },
        jobTitle: {
            fontSize: '16px',
            fontStyle: 'italic',
            marginBottom: '10px',
            color: '#333',
        },
        contactInfo: {
            display: 'flex',
            justifyContent: 'center',
            gap: '12px',
            fontSize: '11px',
            flexWrap: 'wrap',
            marginBottom: '10px',
        },
        contactItem: {
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
        },
        section: {
            marginTop: '15px',
            borderTop: '1px solid #000',
            paddingTop: '10px',
        },
        sectionTitle: {
            fontSize: '14px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            marginBottom: '8px',
            letterSpacing: '1px',
        },
        expItem: {
            marginBottom: '10px',
        },
        expHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: '1px',
        },
        role: {
            fontSize: '14px',
            fontWeight: 'bold',
        },
        company: {
            fontSize: '13px',
            fontStyle: 'italic',
        },
        date: {
            fontSize: '12px',
            textAlign: 'right',
        },
        description: {
            fontSize: '12px',
            marginTop: '2px',
            textAlign: 'justify',
        },
        skillList: {
            display: 'flex',
            flexWrap: 'wrap',
            gap: '15px',
        },
        skillItem: {
            fontSize: '12px',
        },
    };

    const activeSections = data.sections && data.sections.length > 0
        ? data.sections
        : [
            { id: 'summary', enabled: true },
            { id: 'experience', enabled: true },
            { id: 'education', enabled: true },
            { id: 'projects', enabled: true },
            { id: 'certifications', enabled: true },
            { id: 'skills', enabled: true }
        ];

    const renderSection = (sectionId) => {
        const section = activeSections.find(s => s.id === sectionId);
        if (!section || section.enabled === false) return null;

        switch (sectionId) {
            case 'summary':
                return summary && (
                    <div key={sectionId} style={styles.section}>
                        <div style={styles.sectionTitle}>Professional Summary</div>
                        <div style={styles.description}>{summary}</div>
                    </div>
                );
            case 'experience':
                return (experience && experience.length > 0) && (
                    <div key={sectionId} style={styles.section}>
                        <div style={styles.sectionTitle}>Experience</div>
                        {experience.map((exp, index) => (
                            <div key={index} style={styles.expItem}>
                                <div style={styles.expHeader}>
                                    <div>
                                        <span style={styles.role}>{exp.position}</span>
                                        {exp.company && <span style={styles.company}> — {exp.company}</span>}
                                    </div>
                                    <div style={styles.date}>
                                        {exp.startDate} {exp.endDate && `– ${exp.endDate}`}
                                    </div>
                                </div>
                                <div style={styles.description}>
                                    <ul style={{ paddingLeft: '18px', margin: '4px 0 0 0' }}>
                                        {exp.description.split('\n').filter(line => line.trim()).map((line, idx) => (
                                            <li key={idx} style={{ marginBottom: '2px' }}>{line.trim()}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                );
            case 'education':
                return (education && education.length > 0) && (
                    <div key={sectionId} style={styles.section}>
                        <div style={styles.sectionTitle}>Education</div>
                        {education.map((edu, index) => (
                            <div key={index} style={styles.expItem}>
                                <div style={styles.expHeader}>
                                    <div>
                                        <span style={styles.role}>{edu.school}</span>
                                    </div>
                                    <div style={styles.date}>
                                        {edu.graduationDate}
                                    </div>
                                </div>
                                <div style={styles.company}>{edu.degree} {edu.field && `in ${edu.field}`}</div>
                            </div>
                        ))}
                    </div>
                );
            case 'projects':
                return (data.projects && data.projects.length > 0) && (
                    <div key={sectionId} style={styles.section}>
                        <div style={styles.sectionTitle}>Projects</div>
                        {data.projects.map((proj, index) => (
                            <div key={index} style={styles.expItem}>
                                <div style={styles.expHeader}>
                                    <span style={styles.role}>{proj.title}</span>
                                    {proj.link && <span style={{ fontSize: '11px' }}>{proj.link}</span>}
                                </div>
                                {proj.subtitle && (
                                    <div style={{ fontSize: '12px', fontStyle: 'italic', marginBottom: '2px' }}>{proj.subtitle}</div>
                                )}
                                <div style={styles.description}>
                                    <ul style={{ paddingLeft: '18px', margin: '4px 0 0 0' }}>
                                        {proj.description.split('\n').filter(line => line.trim()).map((line, idx) => (
                                            <li key={idx} style={{ marginBottom: '2px' }}>{line.trim()}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                );
            case 'certifications':
                return (data.certifications && data.certifications.length > 0) && (
                    <div key={sectionId} style={styles.section}>
                        <div style={styles.sectionTitle}>Certifications</div>
                        {data.certifications.map((cert, index) => (
                            <div key={index} style={styles.expItem}>
                                <div style={styles.expHeader}>
                                    <span style={styles.role}>{cert.name}</span>
                                    <span style={styles.date}>{cert.date}</span>
                                </div>
                                <div style={styles.company}>{cert.issuer}</div>
                            </div>
                        ))}
                    </div>
                );
            case 'skills':
                return (skills && skills.length > 0) && (
                    <div key={sectionId} style={styles.section}>
                        <div style={styles.sectionTitle}>Skills</div>
                        <div style={styles.skillList}>
                            {skills.map((skill, index) => (
                                <span key={index} style={styles.skillItem}>• {skill}</span>
                            ))}
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    // Fallback handled above via activeSections

    return (
        <div style={{ position: 'relative', width: '210mm', minHeight: '297mm', backgroundColor: 'white', overflow: 'hidden' }}>
            <div style={styles.container}>
                <div style={styles.header}>
                    <div style={styles.name}>{personalInfo.fullName || 'YOUR NAME'}</div>
                    <div style={styles.jobTitle}>{personalInfo.jobTitle || 'Professional Title'}</div>
                    <div style={styles.contactInfo}>
                        {personalInfo.phone && <span style={styles.contactItem}><Phone size={11} />{personalInfo.phone}</span>}
                        {personalInfo.email && <span style={styles.contactItem}><Mail size={11} />{personalInfo.email}</span>}
                        {personalInfo.location && <span style={styles.contactItem}><MapPin size={11} />{personalInfo.location}</span>}
                        {personalInfo.linkedin && <span style={styles.contactItem}><Linkedin size={11} />{personalInfo.linkedin}</span>}
                        {personalInfo.website && <span style={styles.contactItem}><Globe size={11} />{personalInfo.website}</span>}
                    </div>
                </div>

                {activeSections.map(s => renderSection(s.id))}
            </div>
        </div>
    );
};

export default ProfessionalTemplate;
