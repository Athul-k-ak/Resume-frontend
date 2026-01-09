import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Github, Twitter, Linkedin, Mail } from 'lucide-react';
import '../../styles/Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    {/* Brand Section */}
                    <div className="footer-section">
                        <div className="footer-brand">
                            <FileText size={32} />
                            <span className="gradient-text">ResumeBuilder</span>
                        </div>
                        <p className="footer-description">
                            Create professional, ATS-friendly resumes in minutes.
                            Stand out from the crowd and land your dream job.
                        </p>
                        <div className="footer-social">
                            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-link">
                                <Github size={20} />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link">
                                <Twitter size={20} />
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link">
                                <Linkedin size={20} />
                            </a>
                            <a href="mailto:contact@resumebuilder.com" className="social-link">
                                <Mail size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="footer-section">
                        <h4 className="footer-title">Quick Links</h4>
                        <ul className="footer-links">
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/templates">Templates</Link></li>
                            <li><Link to="/dashboard">Dashboard</Link></li>
                            <li><Link to="/create">Create Resume</Link></li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div className="footer-section">
                        <h4 className="footer-title">Resources</h4>
                        <ul className="footer-links">
                            <li><a href="#how-it-works">How It Works</a></li>
                            <li><a href="#features">Features</a></li>
                            <li><a href="#faq">FAQ</a></li>
                            <li><a href="#blog">Blog</a></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div className="footer-section">
                        <h4 className="footer-title">Company</h4>
                        <ul className="footer-links">
                            <li><a href="#about">About Us</a></li>
                            <li><a href="#contact">Contact</a></li>
                            <li><a href="#privacy">Privacy Policy</a></li>
                            <li><a href="#terms">Terms of Service</a></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="footer-bottom">
                    <div className="footer-gradient-line"></div>
                    <p className="footer-copyright">
                        © {currentYear} ResumeBuilder. All rights reserved. Built with ❤️ for job seekers.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
