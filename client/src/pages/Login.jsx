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
    <div className="login-page" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-login, #0A1929)',
      fontFamily: "'Inter', sans-serif",
      padding: '24px'
    }}>
      <div className="login-card" style={{
        maxWidth: 1040,
        width: '100%',
        background: 'white',
        borderRadius: 56, // Very large rounded corners for the main card
        display: 'flex',
        flexDirection: window.innerWidth <= 768 ? 'column' : 'row',
        overflow: 'hidden',
        boxShadow: '0 40px 100px -20px rgba(0, 0, 0, 0.4)',
        minHeight: window.innerWidth <= 768 ? 'auto' : 680
      }}>
        {/* Left Panel - Form */}
        <div style={{
          flex: '1',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '60px 80px',
          background: 'white'
        }}>
          <div style={{ width: '100%', maxWidth: 360, margin: '0 auto' }}>
            {/* Logo */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, marginBottom: 40, textAlign: 'center' }}>
              <div style={{
                width: 48, height: 48,
                background: 'linear-gradient(135deg, #1a8ffb 0%, #00f2fe 100%)',
                borderRadius: 14,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 8px 16px rgba(26, 143, 251, 0.2)'
              }}>
                <Wallet size={24} color="white" />
              </div>
              <div>
                <h1 style={{ fontSize: 28, fontWeight: 800, color: '#06141B', marginBottom: 4, letterSpacing: '-0.8px' }}>Welcome back</h1>
                <p style={{ color: '#64748b', fontSize: 14, fontWeight: 500 }}>Please enter your details to sign in.</p>
              </div>
            </div>

            {error && (
              <div style={{ 
                marginBottom: 24, 
                padding: '12px 16px', 
                background: '#fef2f2', 
                border: '1px solid #fee2e2', 
                borderRadius: 12,
                color: '#b91c1c',
                fontSize: 13,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontWeight: 500
              }}>
                <span>⚠️</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    placeholder="Email Address"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '14px 14px 14px 44px',
                      background: '#f8fafc',
                      border: '1.5px solid #e2e8f0',
                      borderRadius: 16,
                      fontSize: 14,
                      outline: 'none',
                      transition: 'all 0.2s',
                      fontWeight: 500
                    }}
                    onFocus={e => { e.target.style.borderColor = '#1a8ffb'; e.target.style.background = 'white'; e.target.style.boxShadow = '0 0 0 4px rgba(26, 143, 251, 0.1)'; }}
                    onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="Password"
                    required
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '14px 44px 14px 44px',
                      background: '#f8fafc',
                      border: '1.5px solid #e2e8f0',
                      borderRadius: 16,
                      fontSize: 14,
                      outline: 'none',
                      transition: 'all 0.2s',
                      fontWeight: 500
                    }}
                    onFocus={e => { e.target.style.borderColor = '#1a8ffb'; e.target.style.background = 'white'; e.target.style.boxShadow = '0 0 0 4px rgba(26, 143, 251, 0.1)'; }}
                    onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; e.target.style.boxShadow = 'none'; }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                  >
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 0 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#64748b', cursor: 'pointer', fontWeight: 500 }}>
                  <input type="checkbox" style={{ width: 16, height: 16, border: '1.5px solid #cbd5e1', borderRadius: 4 }} />
                  <span>Remember me</span>
                </label>
                <button type="button" style={{ background: 'none', border: 'none', fontSize: 13, fontWeight: 600, color: '#1a8ffb', cursor: 'pointer' }}>Forgot password?</button>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  marginTop: 12,
                  width: '100%',
                  padding: '16px',
                  background: 'linear-gradient(135deg, #1a8ffb 0%, #1576d0 100%)',
                  border: 'none',
                  borderRadius: 16,
                  color: 'white',
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  transition: 'all 0.2s',
                  boxShadow: '0 10px 20px -5px rgba(26, 143, 251, 0.4)'
                }}
                onMouseOver={e => { if(!loading) e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 15px 25px -5px rgba(26, 143, 251, 0.5)'; }}
                onMouseOut={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 10px 20px -5px rgba(26, 143, 251, 0.4)'; }}
              >
                {loading ? "Signing in..." : "Login"}
              </button>
            </form>

            <div style={{ margin: '32px 0', position: 'relative', textAlign: 'center' }}>
              <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: '#f1f5f9', zIndex: 0 }} />
              <span style={{ position: 'relative', padding: '0 12px', background: 'white', fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>OR</span>
            </div>

            {/* Social Icons Style based on reference */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 20 }}>
              {[
                { icon: 'https://cdn-icons-png.flaticon.com/512/0/747.png', label: 'Apple' },
                { icon: 'https://cdn-icons-png.flaticon.com/512/2991/2991148.png', label: 'Google' },
                { icon: 'https://cdn-icons-png.flaticon.com/512/124/124010.png', label: 'Facebook' }
              ].map((social, idx) => (
                <button
                  key={idx}
                  type="button"
                  style={{
                    width: 44, height: 44,
                    borderRadius: 12,
                    border: '1.5px solid #f1f5f9',
                    background: 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#f8fafc'; }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = '#f1f5f9'; e.currentTarget.style.background = 'white'; }}
                >
                  <img src={social.icon} alt={social.label} style={{ width: 20, height: 20, opacity: 0.8 }} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Visual Image */}
        <div style={{
          flex: '1.15',
          padding: '24px', // White gutter around the image panel
          display: 'flex'
        }}>
          <div style={{
            flex: 1,
            borderRadius: 44, // Large rounded corners for the inner image panel
            overflow: 'hidden',
            position: 'relative',
            background: '#1a8ffb'
          }}>
            <img 
              src="/login_bg.png" 
              alt="Pahel Microfinance"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
            {/* Overlay Gradient for Text */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 100%)',
              zIndex: 1
            }} />
            
            {/* Overlay Info Card */}
            <div style={{
              position: 'absolute',
              bottom: 40,
              left: 40,
              right: 40,
              padding: '28px',
              background: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              borderRadius: 28,
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
              zIndex: 2,
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
            }}>
              <div style={{
                display: 'inline-flex',
                padding: '6px 12px',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: 8,
                fontSize: 10,
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: 1,
                marginBottom: 12
              }}>
                Pahel Finance v3.0
              </div>
              <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 10, letterSpacing: '-0.5px' }}>Transforming Microfinance</h3>
              <p style={{ fontSize: 14, opacity: 0.9, lineHeight: 1.6, fontWeight: 500 }}>
                Join thousands of organizations using Pahel to streamline their loan management and scale social impact.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
