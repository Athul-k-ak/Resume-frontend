import { Phone, Mail, Globe, MapPin, Linkedin } from 'lucide-react';

const ModernTemplate = ({ data }) => {
  const {
    personalInfo,
    summary,
    experience,
    education,
    skills,
    projects,
    certifications,
  } = data;

  const styles = {
    page: {
      width: '210mm',
      minHeight: '296.5mm',
      backgroundColor: '#fff',
      fontFamily: "'Inter', sans-serif",
      color: '#222',
      padding: '32px',
      boxSizing: 'border-box',
    },
    layout: {
      display: 'flex',
      gap: '32px',
    },
    left: {
      width: '35%',
    },
    right: {
      width: '65%',
    },

    /* HEADER */
    name: {
      fontSize: '42px',
      fontWeight: 800,
      lineHeight: 1.1,
      textTransform: 'uppercase',
    },
    jobTitle: {
      fontSize: '16px',
      color: '#666',
      marginBottom: '16px',
    },
    contact: {
      display: 'flex',
      gap: '14px',
      fontSize: '11px',
      borderTop: '2px solid #000',
      paddingTop: '10px',
      marginBottom: '24px',
      flexWrap: 'wrap',
    },
    contactItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
    },

    /* SECTIONS */
    sectionTitle: {
      fontSize: '16px',
      fontWeight: 700,
      margin: '24px 0 12px 0',
    },
    textSmall: {
      fontSize: '11px',
      lineHeight: 1.6,
      color: '#555',
    },

    /* PROFILE IMAGE */
    profileImage: {
      width: '120px',
      height: '120px',
      borderRadius: '50%',
      backgroundColor: '#e5e7eb',
      backgroundImage: `url(${personalInfo.profileImage || ''})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      marginBottom: '24px',
    },

    /* EXPERIENCE & PROJECTS & CERTS */
    expItem: {
      marginBottom: '16px',
    },
    expHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '13px',
      fontWeight: 600,
    },
    expCompany: {
      fontSize: '12px',
      color: '#444',
      marginBottom: '4px',
    },

    /* LIST ITEMS */
    listItem: {
      fontSize: '12px',
      color: '#555',
      marginBottom: '6px',
    },
  };

  // Determine the active sections, using a fallback if data.sections is missing or empty
  const activeSections = data.sections && data.sections.length > 0
    ? data.sections
    : [
      { id: 'summary', enabled: true, column: 'left' },
      { id: 'experience', enabled: true, column: 'right' },
      { id: 'education', enabled: true, column: 'left' },
      { id: 'projects', enabled: true, column: 'right' },
      { id: 'certifications', enabled: true, column: 'right' },
      { id: 'skills', enabled: true, column: 'left' }
    ];

  const renderSection = (sectionId) => {
    // Find the specific section within the active sections
    const section = activeSections.find(s => s.id === sectionId);

    // If the section is not found or explicitly disabled, return null
    if (!section || section.enabled === false) return null;

    switch (sectionId) {
      case 'summary':
        return (
          <div key={sectionId}>
            <div style={styles.sectionTitle}>About Me</div>
            <div style={styles.textSmall}>{summary}</div>
          </div>
        );
      case 'education':
        return (
          <div key={sectionId}>
            <div style={styles.sectionTitle}>Education</div>
            {education.map((edu, i) => (
              <div key={i} style={styles.listItem}>
                <strong>{edu.degree}</strong><br />
                {edu.school}<br />
                {edu.graduationDate}
              </div>
            ))}
          </div>
        );
      case 'skills':
        return (
          <div key={sectionId}>
            <div style={styles.sectionTitle}>Skills</div>
            {skills.map((skill, i) => (
              <div key={i} style={styles.listItem}>{skill}</div>
            ))}
          </div>
        );
      case 'experience':
        return (
          <div key={sectionId}>
            <div style={styles.sectionTitle}>Work Experience</div>
            {experience.map((exp, i) => (
              <div key={i} style={styles.expItem}>
                <div style={styles.expHeader}>
                  <span>{exp.position}</span>
                  <span>{exp.startDate} – {exp.endDate}</span>
                </div>
                <div style={styles.expCompany}>
                  {exp.company} | {exp.location}
                </div>
                <div style={styles.textSmall}>
                  <ul style={{ paddingLeft: '16px', margin: '4px 0 0 0' }}>
                    {exp.description.split('\n').filter(line => line.trim()).map((line, idx) => (
                      <li key={idx} style={{ marginBottom: '2px' }}>{line.trim()}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        );
      case 'projects':
        return projects?.length > 0 && (
          <div key={sectionId}>
            <div style={styles.sectionTitle}>Projects</div>
            {projects.map((proj, i) => (
              <div key={i} style={styles.expItem}>
                <strong style={{ fontSize: '13px' }}>{proj.title}</strong>
                {proj.subtitle && (
                  <div style={{ fontSize: '12px', fontStyle: 'italic', color: '#666' }}>{proj.subtitle}</div>
                )}
                {proj.link && (
                  <div style={styles.textSmall}>{proj.link}</div>
                )}
                <div style={styles.textSmall}>
                  <ul style={{ paddingLeft: '16px', margin: '4px 0 0 0' }}>
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
        return certifications?.length > 0 && (
          <div key={sectionId}>
            <div style={styles.sectionTitle}>Certifications</div>
            {certifications.map((cert, i) => (
              <div key={i} style={styles.expItem}>
                <strong style={{ fontSize: '13px' }}>{cert.name}</strong>
                <div style={styles.textSmall}>
                  {cert.issuer} {cert.date && `(${cert.date})`}
                </div>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.layout}>
        {/* LEFT COLUMN */}
        <div style={styles.left}>
          <div style={styles.profileImage} />
          {activeSections.filter(s => s.column === 'left').map(s => renderSection(s.id))}
        </div>

        {/* RIGHT COLUMN */}
        <div style={styles.right}>
          <div>
            <div style={styles.name}>
              {personalInfo.fullName}
            </div>
            <div style={styles.jobTitle}>{personalInfo.jobTitle}</div>
          </div>

          <div style={styles.contact}>
            {personalInfo.phone && (
              <div style={styles.contactItem}>
                <Phone size={12} /> {personalInfo.phone}
              </div>
            )}
            {personalInfo.email && (
              <div style={styles.contactItem}>
                <Mail size={12} /> {personalInfo.email}
              </div>
            )}
            {personalInfo.location && (
              <div style={styles.contactItem}>
                <MapPin size={12} /> {personalInfo.location}
              </div>
            )}
            {personalInfo.linkedin && (
              <div style={styles.contactItem}>
                <Linkedin size={12} /> {personalInfo.linkedin}
              </div>
            )}
            {personalInfo.website && (
              <div style={styles.contactItem}>
                <Globe size={12} /> {personalInfo.website}
              </div>
            )}
          </div>

          {activeSections.filter(s => s.column === 'right').map(s => renderSection(s.id))}
        </div>
      </div>
    </div>
  );
};

export default ModernTemplate;
