import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FileText, Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Navbar.css';

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const location = useLocation();
    const { user, isAuthenticated, logout } = useAuth(); // Use AuthContext

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const toggleUserMenu = () => {
        setIsUserMenuOpen(!isUserMenuOpen);
    };

    const handleLogout = async () => {
        await logout();
        window.location.href = '/';
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="navbar glass-strong">
            <div className="container">
                <div className="navbar-content">
                    {/* Logo */}
                    <Link to="/" className="navbar-logo">
                        <FileText size={28} />
                        <span className="gradient-text">ResumeBuilder</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="navbar-links">
                        <Link
                            to="/"
                            className={`navbar-link ${isActive('/') ? 'active' : ''}`}
                        >
                            Home
                        </Link>
                        {isAuthenticated && (
                            <>
                                <Link
                                    to="/dashboard"
                                    className={`navbar-link ${isActive('/dashboard') ? 'active' : ''}`}
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    to="/templates"
                                    className={`navbar-link ${isActive('/templates') ? 'active' : ''}`}
                                >
                                    Templates
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Auth Buttons / User Menu */}
                    <div className="navbar-actions">
                        {isAuthenticated ? (
                            <div className="user-menu-container">
                                <button
                                    className="user-menu-trigger"
                                    onClick={toggleUserMenu}
                                >
                                    <User size={20} />
                                    <span>{user?.name || 'User'}</span>
                                </button>

                                {isUserMenuOpen && (
                                    <div className="user-menu-dropdown glass">
                                        <Link to="/dashboard" className="user-menu-item">
                                            <LayoutDashboard size={18} />
                                            <span>Dashboard</span>
                                        </Link>
                                        <button onClick={handleLogout} className="user-menu-item">
                                            <LogOut size={18} />
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className="btn btn-ghost btn-sm">
                                    Login
                                </Link>
                                <Link to="/signup" className="btn btn-primary btn-sm">
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="mobile-menu-toggle"
                        onClick={toggleMobileMenu}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="mobile-menu glass animate-fade-in-down">
                        <Link
                            to="/"
                            className="mobile-menu-link"
                            onClick={toggleMobileMenu}
                        >
                            Home
                        </Link>
                        {isAuthenticated ? (
                            <>
                                <Link
                                    to="/dashboard"
                                    className="mobile-menu-link"
                                    onClick={toggleMobileMenu}
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    to="/templates"
                                    className="mobile-menu-link"
                                    onClick={toggleMobileMenu}
                                >
                                    Templates
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="mobile-menu-link"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="mobile-menu-link"
                                    onClick={toggleMobileMenu}
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className="mobile-menu-link"
                                    onClick={toggleMobileMenu}
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
