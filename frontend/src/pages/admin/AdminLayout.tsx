import React, { useState } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Megaphone,
    Calendar,
    Users,
    LogOut,
    Menu,
    X,
    ChevronRight
} from 'lucide-react';
import './AdminLayout.css';

const AdminLayout: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();

    // 현재 경로에 따른 헤더 타이틀 매핑
    const getPageTitle = () => {
        const path = location.pathname;
        if (path.includes('dashboard')) return '대시보드';
        if (path.includes('notices')) return '공지사항 & 슬라이드 관리';
        if (path.includes('schedules')) return '일정 관리';
        if (path.includes('applications')) return '지원 관리';
        return '관리자 홈';
    };

    const menuItems = [
        { name: '대시보드', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
        { name: '공지사항 관리', path: '/admin/notices', icon: <Megaphone size={20} /> },
        { name: '일정 관리', path: '/admin/schedules', icon: <Calendar size={20} /> },
        { name: '지원 관리', path: '/admin/applications', icon: <Users size={20} /> },
    ];

    const handleLogout = () => {
        if (window.confirm('로그아웃 하시겠습니까?')) {
            localStorage.removeItem('accessToken');
            navigate('/login');
        }
    };

    return (
        <div className="admin-layout">
            {/* 사이드바 */}
            <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
                <div className="sidebar-header">
                    <div className="logo" onClick={() => navigate('/')}>
                        <span className="logo-text">EC ADMIN</span>
                    </div>
                    <button className="mobile-close" onClick={() => setIsSidebarOpen(false)}>
                        <X size={24} />
                    </button>
                </div>

                <nav className="sidebar-nav">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            <span className="nav-text">{item.name}</span>
                            <ChevronRight className="nav-arrow" size={16} />
                        </NavLink>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <button className="logout-button" onClick={handleLogout}>
                        <LogOut size={20} />
                        <span className="nav-text">로그아웃</span>
                    </button>
                </div>
            </aside>

            {/* 메인 영역 */}
            <div className="admin-main-wrapper">
                <header className="admin-top-nav">
                    <button className="menu-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                        <Menu size={24} />
                    </button>
                    <h2 className="current-page-title">{getPageTitle()}</h2>
                    <div className="admin-profile">
                        <div className="avatar">A</div>
                        <span className="admin-name">관리자님</span>
                    </div>
                </header>

                <section className="admin-page-content">
                    <Outlet /> {/* 각 메뉴 컴포넌트가 렌더링되는 위치 */}
                </section>
            </div>
        </div>
    );
};

export default AdminLayout;