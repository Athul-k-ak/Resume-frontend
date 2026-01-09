import React from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowRight,
    FileText,
    Sparkles,
    Download,
    Zap,
    Shield,
    Palette,
    CheckCircle,
    Star
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import heroImage from '../assets/images/image2.jpg';
import '../styles/Home.css';

const Home = () => {
    const { isAuthenticated } = useAuth();
    const features = [
        {
            icon: <Sparkles size={32} />,
            title: 'AI-Powered',
            description: 'Smart suggestions and auto-formatting to make your resume stand out'
        },
        {
            icon: <Shield size={32} />,
            title: 'ATS-Friendly',
            description: 'Optimized for Applicant Tracking Systems to get past the bots'
        },
        {
            icon: <Palette size={32} />,
            title: 'Beautiful Templates',
            description: 'Professional designs that make a lasting impression'
        },
        {
            icon: <Download size={32} />,
            title: 'Export Anywhere',
            description: 'Download as PDF or Word document with one click'
        },
        {
            icon: <Zap size={32} />,
            title: 'Real-time Preview',
            description: 'See changes instantly as you build your resume'
        },
        {
            icon: <FileText size={32} />,
            title: 'Multiple Resumes',
            description: 'Create and manage unlimited resumes for different roles'
        }
    ];

    const steps = [
        {
            number: '01',
            title: 'Choose Template',
            description: 'Select from our collection of professional templates'
        },
        {
            number: '02',
            title: 'Fill Details',
            description: 'Add your information with our easy-to-use form'
        },
        {
            number: '03',
            title: 'Customize',
            description: 'Personalize colors, fonts, and layout to match your style'
        },
        {
            number: '04',
            title: 'Download',
            description: 'Export your resume as PDF or Word document'
        }
    ];

    return (
        <div className="home">
            {/* Hero Section */}
            <section className="hero">
                <div className="container">
                    <div className="hero-content">
                        <div className="hero-text animate-fade-in-up">
                            <h1 className="hero-title">
                                Build Your Dream Resume in
                                <span className="gradient-text"> Minutes</span>
                            </h1>
                            <p className="hero-subtitle">
                                Create professional, ATS-friendly resumes that get you noticed.
                                Choose from beautiful templates, customize with ease, and land your dream job.
                            </p>
                            <div className="hero-actions">
                                {isAuthenticated ? (
                                    <Link to="/dashboard" className="btn btn-primary btn-lg">
                                        Go to Dashboard
                                        <ArrowRight size={20} />
                                    </Link>
                                ) : (
                                    <Link to="/signup" className="btn btn-primary btn-lg">
                                        Get Started Free
                                        <ArrowRight size={20} />
                                    </Link>
                                )}
                                <Link to="/templates" className="btn btn-outline btn-lg">
                                    View Templates
                                </Link>
                            </div>
                            <div className="hero-stats">
                                <div className="stat-item">
                                    <div className="stat-number gradient-text">10K+</div>
                                    <div className="stat-label">Resumes Created</div>
                                </div>
                                <div className="stat-item">
                                    <div className="stat-number gradient-text">95%</div>
                                    <div className="stat-label">Success Rate</div>
                                </div>
                                <div className="stat-item">
                                    <div className="stat-number gradient-text">4.9/5</div>
                                    <div className="stat-label">User Rating</div>
                                </div>
                            </div>
                        </div>
                        <div className="hero-visual animate-float">
                            <img src={heroImage} alt="Resume Builder" className="hero-img" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features" id="features">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">
                            Why Choose <span className="gradient-text">ResumeBuilder</span>
                        </h2>
                        <p className="section-subtitle">
                            Everything you need to create a standout resume
                        </p>
                    </div>
                    <div className="features-grid">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="feature-card card animate-fade-in-up"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="feature-icon gradient-text">
                                    {feature.icon}
                                </div>
                                <h3 className="feature-title">{feature.title}</h3>
                                <p className="feature-description">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="how-it-works" id="how-it-works">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">
                            How It <span className="gradient-text">Works</span>
                        </h2>
                        <p className="section-subtitle">
                            Four simple steps to your perfect resume
                        </p>
                    </div>
                    <div className="steps-container">
                        {steps.map((step, index) => (
                            <div key={index} className="step-item">
                                <div className="step-number gradient-text">{step.number}</div>
                                <h3 className="step-title">{step.title}</h3>
                                <p className="step-description">{step.description}</p>
                                {index < steps.length - 1 && (
                                    <div className="step-connector"></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta">
                <div className="container">
                    <div className="cta-content glass-strong">
                        <h2 className="cta-title">
                            Ready to Build Your <span className="gradient-text">Perfect Resume?</span>
                        </h2>
                        <p className="cta-subtitle">
                            Join thousands of job seekers who landed their dream jobs with our resume builder
                        </p>
                        {isAuthenticated ? (
                            <Link to="/dashboard" className="btn btn-primary btn-lg">
                                Go to Dashboard
                                <ArrowRight size={20} />
                            </Link>
                        ) : (
                            <Link to="/signup" className="btn btn-primary btn-lg">
                                Start Building Now
                                <ArrowRight size={20} />
                            </Link>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
