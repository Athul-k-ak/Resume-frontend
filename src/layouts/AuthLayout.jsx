import React from 'react';
import { Outlet } from 'react-router-dom';
import '../styles/authLayout.css';

const AuthLayout = () => {
    return (
        <div className="auth-layout">
            <div className="auth-background">
                <div className="auth-gradient-orb orb-1"></div>
                <div className="auth-gradient-orb orb-2"></div>
                <div className="auth-gradient-orb orb-3"></div>
            </div>
            <div className="auth-content">
                <Outlet />
            </div>
        </div>
    );
};

export default AuthLayout;
