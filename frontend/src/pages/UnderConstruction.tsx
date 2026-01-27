import { IoConstruct } from "react-icons/io5";
import logo from '../assets/logo.png';

const UnderConstruction = () => {
  return (
    <div className="full-screen flex-center" style={{ 
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      padding: '2rem',
      color: '#1e293b'
    }}>
      <div className="card animate-fade-in" style={{ 
        maxWidth: '500px', 
        width: '100%',
        textAlign: 'center',
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.6)',
        borderRadius: '24px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)'
      }}>
        <div style={{ marginBottom: '2rem' }}>
          <img src={logo} alt="Logo" style={{ height: '80px', marginBottom: '1.5rem' }} />
          <br />
          <IoConstruct 
            size={60} 
            color="#10b981" 
            style={{ 
              filter: 'drop-shadow(0 4px 6px rgba(16, 185, 129, 0.3))',
              animation: 'spin 3s linear infinite'
            }} 
          />
        </div>
        
        <h1 style={{ 
          fontSize: '2.5rem', 
          marginBottom: '1rem',
          background: 'linear-gradient(to right, #10b981, #34d399)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: '800'
        }}>
          서비스 준비중입니다
        </h1>
        
        <p style={{ 
          color: '#64748b', 
          marginBottom: '2rem',
          fontSize: '1.1rem',
          lineHeight: '1.6'
        }}>
          현재 페이지를 개발하고 있습니다.<br />
          빠른 시일 내에 찾아뵙겠습니다.
        </p>

        <div style={{
          padding: '1rem',
          background: 'rgba(16, 185, 129, 0.05)',
          borderRadius: '12px',
          border: '1px solid rgba(16, 185, 129, 0.1)'
        }}>
          <p style={{ color: '#059669', fontWeight: '600', fontSize: '0.9rem' }}>
            System Status: Development in Progress
          </p>
        </div>
      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          50% { transform: rotate(15deg); }
          100% { transform: rotate(0deg); }
        }
      `}</style>
    </div>
  );
};

export default UnderConstruction;
