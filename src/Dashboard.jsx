import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const { user, token, expiresAt, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const timeRemaining = expiresAt 
    ? Math.max(0, Math.floor((expiresAt - Date.now()) / 60000)) 
    : 0;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>لوحة التحكم</h1>
        
        <div style={styles.userInfo}>
          <div style={styles.badge}>
            {user.role === 'admin' ? '👨‍💼 Manager' : '👤 User'}
          </div>
          
          <h2 style={styles.userName}>مرحباً، {user.name}</h2>
          <p style={styles.email}>{user.email}</p>
          
          <div style={styles.details}>
            <div style={styles.detailItem}>
              <strong>User ID:</strong> {user.id}
            </div>
            <div style={styles.detailItem}>
              <strong> Validity: </strong> {user.role}
            </div>
            <div style={styles.detailItem}>
              <strong>Token:</strong> {token.substring(0, 20)}...
            </div>
            <div style={styles.detailItem}>
              <strong>Time remaining: </strong> {timeRemaining} minute
            </div>
          </div>
        </div>

        <button onClick={handleLogout} style={styles.button}>
         Log out
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
    fontFamily: 'Arial, sans-serif',
    padding: '20px', // ← إضافة
    boxSizing: 'border-box' // ← مهم
  },
  card: {
    backgroundColor: 'white',
    padding: '40px 30px', // ← تعديل
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '500px',
    boxSizing: 'border-box' // ← مهم
  },
  title: {
    textAlign: 'center',
    marginBottom: '30px',
    color: '#333',
    fontSize: 'clamp(24px, 5vw, 32px)' // ← حجم متجاوب
  },
  userInfo: {
    textAlign: 'center',
    marginBottom: '30px'
  },
  badge: {
    display: 'inline-block',
    padding: '8px 16px',
    backgroundColor: '#4caf50',
    color: 'white',
    borderRadius: '20px',
    marginBottom: '15px',
    fontSize: 'clamp(12px, 3vw, 14px)' // ← حجم متجاوب
  },
  userName: {
    margin: '10px 0',
    color: '#333',
    fontSize: 'clamp(20px, 4vw, 24px)' // ← حجم متجاوب
  },
  email: {
    color: '#666',
    marginBottom: '20px',
    fontSize: 'clamp(14px, 3vw, 16px)', // ← حجم متجاوب
    wordBreak: 'break-all' // ← لمنع تجاوز البريد
  },
  details: {
    backgroundColor: '#f5f5f5',
    padding: '20px',
    borderRadius: '8px',
    textAlign: 'right'
  },
  detailItem: {
    padding: '8px 0',
    borderBottom: '1px solid #ddd',
    fontSize: 'clamp(13px, 3vw, 15px)', // ← حجم متجاوب
    wordBreak: 'break-word' // ← لمنع تجاوز النص
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#d32f2f',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    fontWeight: 'bold',
    boxSizing: 'border-box' // ← مهم
  }
};