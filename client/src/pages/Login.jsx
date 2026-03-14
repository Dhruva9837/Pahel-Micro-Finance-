import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Wallet, Eye, EyeOff, ArrowRight, ShieldCheck, Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: 'white',
      fontFamily: "'Inter', sans-serif"
    }}>
      {/* Left Panel - Form */}
      <div style={{
        flex: '1',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 8%',
        zIndex: 2,
        background: 'white'
      }}>
        <div style={{ maxWidth: 400, width: '100%', margin: '0 auto' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 48 }}>
            <div style={{
              width: 40, height: 40,
              background: '#253745',
              borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Wallet size={20} color="white" />
            </div>
            <span style={{ fontSize: 20, fontWeight: 700, color: '#06141B', letterSpacing: '-0.5px' }}>Pahel Finance</span>
          </div>

          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontSize: 32, fontWeight: 800, color: '#06141B', marginBottom: 8, letterSpacing: '-1px' }}>Welcome back</h1>
            <p style={{ color: '#64748b', fontSize: 15 }}>Enter your details to access your account</p>
          </div>

          {error && (
            <div style={{ 
              marginBottom: 24, 
              padding: '12px 16px', 
              background: '#fef2f2', 
              border: '1px solid #fee2e2', 
              borderRadius: 12,
              color: '#b91c1c',
              fontSize: 14,
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 8 }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  placeholder="name@company.com"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 42px',
                    background: '#f8fafc',
                    border: '1.5px solid #e2e8f0',
                    borderRadius: 12,
                    fontSize: 14,
                    outline: 'none',
                    transition: 'all 0.2s'
                  }}
                  onFocus={e => { e.target.style.borderColor = '#253745'; e.target.style.background = 'white'; }}
                  onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 8 }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                  <Lock size={18} />
                </div>
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 42px 12px 42px',
                    background: '#f8fafc',
                    border: '1.5px solid #e2e8f0',
                    borderRadius: 12,
                    fontSize: 14,
                    outline: 'none',
                    transition: 'all 0.2s'
                  }}
                  onFocus={e => { e.target.style.borderColor = '#253745'; e.target.style.background = 'white'; }}
                  onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: -4 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#64748b', cursor: 'pointer' }}>
                <input type="checkbox" style={{ width: 16, height: 16, border: '1.5px solid #cbd5e1', borderRadius: 4 }} />
                <span>Remember for 30 days</span>
              </label>
              <button type="button" style={{ background: 'none', border: 'none', fontSize: 13, fontWeight: 600, color: '#253745', cursor: 'pointer' }}>Forgot password?</button>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: 8,
                width: '100%',
                padding: '14px',
                background: '#253745',
                border: 'none',
                borderRadius: 12,
                color: 'white',
                fontSize: 15,
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                transition: 'transform 0.2s, background 0.2s',
              }}
            >
              {loading ? "Signing in..." : <>Login <ArrowRight size={18} /></>}
            </button>
          </form>

          {/* Demo Credentials Footer */}
          <div style={{ marginTop: 40, paddingTop: 24, borderTop: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
              <ShieldCheck size={16} color="#475569" />
              <span style={{ fontSize: 13, fontWeight: 600, color: '#475569' }}>Demo Access</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: '#94a3b8' }}>Email</span>
                <code style={{ color: '#475569', fontWeight: 500 }}>admin@pahel.io</code>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: '#94a3b8' }}>Password</span>
                <code style={{ color: '#475569', fontWeight: 500 }}>Admin@123</code>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Visual */}
      <div style={{
        flex: '1.2',
        position: 'relative',
        background: '#11212D',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        {/* Abstract Shapes Container */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 0% 0%, #253745 0%, #11212D 100%)',
          zIndex: 0
        }} />
        
        {/* Wave Overlay (Simplified concept based on the image) */}
        <svg style={{ position: 'absolute', right: 0, top: 0, height: '100%', width: '100%', opacity: 0.4 }} viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M100 0 C 70 20, 90 50, 60 70 C 40 85, 20 100, 0 100 L 100 100 Z" fill="#253745" />
          <path d="M100 20 C 80 40, 95 60, 75 80 C 65 90, 45 100, 30 100 L 100 100 Z" fill="#4A5C6A" opacity="0.3" />
        </svg>

        <div style={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          color: 'white',
          padding: '0 15%'
        }}>
          <div style={{
            width: 80, height: 80,
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: 24,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 32px'
          }}>
            <Wallet size={40} color="white" />
          </div>
          <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 16, letterSpacing: '-0.5px' }}>Pahel Loan Management</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 17, lineHeight: 1.6 }}>
            The most advanced and reliable platform for microfinance organizations to manage their loan portfolios.
          </p>
        </div>
      </div>
    </div>
  );
}
