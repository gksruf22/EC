// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
    const { user, isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <p>권한 확인 중입니다...</p>
            </div>
        );
    }

    console.log("현재 로그인 유저 정보:", user);

    if (!isAuthenticated || user?.role !== 'ROLE_ADMIN') {
        alert(`접근 권한이 없습니다. (현재 권한: ${user?.role || '없음'})`);
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;