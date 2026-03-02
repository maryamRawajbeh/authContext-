import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// Mock API Login
const mockLoginAPI = async (email, password) => {
  // تأخير 1-2 ثانية
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // تحقق بسيط
  if (email === 'admin@test.com' && password === 'admin123') {
    return {
      id: 1,
      name: 'Admin User',
      email: email,
      role: 'admin',
      token: 'mock-jwt-token-' + Date.now(),
      expiresAt: Date.now() + 1 * 60 * 1000 // 1 دقيقة
    };
  } else if (email === 'user@test.com' && password === 'user123') {
    return {
      id: 2,
      name: 'Regular User',
      email: email,
      role: 'user',
      token: 'mock-jwt-token-' + Date.now(),
      expiresAt: Date.now() + 1 * 60 * 1000
    };
  }
  
  throw new Error('Invalid login data');
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expiresAt, setExpiresAt] = useState(null);

  // استرجاع الحالة عند التحميل
  useEffect(() => {
    const savedAuth = localStorage.getItem('auth');
    if (savedAuth) {
      try {
        const authData = JSON.parse(savedAuth);
        
        // تحقق من انتهاء الصلاحية
        if (authData.expiresAt > Date.now()) {
          setUser(authData.user);
          setToken(authData.token);
          setExpiresAt(authData.expiresAt);
          setIsAuthenticated(true);
        } else {
          // انتهت الصلاحية
          localStorage.removeItem('auth');
        }
      } catch (err) {
        localStorage.removeItem('auth');
      }
    }
  }, []);

  // فحص انتهاء الصلاحية كل دقيقة
  useEffect(() => {
    if (!isAuthenticated || !expiresAt) return;

    const checkExpiration = setInterval(() => {
      if (Date.now() >= expiresAt) {
        logout();
        alert('Work session has ended - you will be logged out');
      }
    }, 60000); // كل دقيقة

    return () => clearInterval(checkExpiration);
  }, [isAuthenticated, expiresAt]);

  // تسجيل الدخول
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await mockLoginAPI(email, password);
      
      const authData = {
        user: {
          id: response.id,
          name: response.name,
          email: response.email,
          role: response.role
        },
        token: response.token,
        expiresAt: response.expiresAt
      };
      
      // حفظ في localStorage
      localStorage.setItem('auth', JSON.stringify(authData));
      
      // تحديث الحالة
      setUser(authData.user);
      setToken(authData.token);
      setExpiresAt(authData.expiresAt);
      setIsAuthenticated(true);
      
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // تسجيل الخروج
  const logout = () => {
    setUser(null);
    setToken(null);
    setExpiresAt(null);
    setIsAuthenticated(false);
    setError(null);
    localStorage.removeItem('auth');
  };

  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    expiresAt,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
};