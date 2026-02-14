import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Members from './pages/Members';
import Notice from './pages/Notice';
import Apply from './pages/Apply';
import Signup from './pages/Signup';
import Login from './pages/Login';
import MyPage from './pages/MyPage';
import { AuthProvider } from './context/AuthContext';

// 관리자 페이지 임포트
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import NoticeManagement from './pages/admin/NoticeManagement';
import ScheduleManagement from './pages/admin/ScheduleManagement';
import ApplicationManagement from './pages/admin/ApplicationManagement';
import ApplicationList from './pages/admin/ApplicationList';
import ApplicationDetail from './pages/admin/ApplicationDetail';
import EventCreate from './pages/admin/EventCreate';
import EventEdit from './pages/admin/EventEdit';
import MemberList from './pages/admin/MemberList';
import ProtectedRoute from './components/ProtectedRoute';

// 사용자용 레이아웃 (Header/Footer 포함)
const UserLayout = () => (
  <>
    <Header />
    <main style={{ flex: 1 }}>
      <Outlet />
    </main>
    <Footer />
  </>
);

function App() {
  return (
    <AuthProvider>
      <div className="App" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Routes>
          {/* 1. 일반 사용자 경로 */}
          <Route element={<UserLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/members" element={<Members />} />
            <Route path="/apply" element={<Apply />} />
            <Route path="/notice" element={<Notice />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/mypage" element={<MyPage />} />
          </Route>

          {/* 2. 관리자 경로 (보호됨) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="notices" element={<NoticeManagement />} />
              <Route path="schedules" element={<ScheduleManagement />} />
              <Route path="applications" element={<ApplicationManagement />} />
              <Route path="applications/new" element={<EventCreate />} />
              <Route path="applications/:eventId" element={<ApplicationList />} />
              <Route path="applications/edit/:id" element={<EventEdit />} />
              <Route path="applications/detail/:id" element={<ApplicationDetail />} />
              <Route path="members" element={<MemberList />} />
            </Route>
          </Route>
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;