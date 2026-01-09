import React from 'react'
import MainLayout from './layouts/MainLayout'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import SelectTemplate from './pages/SelectTemplate';
import CreateResume from './pages/CreateResume';
import ProtectedRoutes from './components/common/ProtectedRoutes';
import PublicRoute from './components/common/PublicRoute';
import AuthLayout from './layouts/AuthLayout';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />

          {/* Public Routes */}
          <Route element={<PublicRoute />}>
            <Route element={<AuthLayout />}>
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />
            </Route>
          </Route>

          {/* Protected Routes */}
          <Route element={<ProtectedRoutes />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="templates" element={<SelectTemplate />} />
            <Route path="create" element={<CreateResume />} />
            <Route path="edit/:id" element={<CreateResume />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  )
}

export default App
