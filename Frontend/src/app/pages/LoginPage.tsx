import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../components/AuthContext';
import saestiLogo from '../../assets/saestl-logo.png';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated, loading: authLoading } = useAuth();

  if (authLoading) return null;
  if (isAuthenticated) return <Navigate to="/" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('[ERROR: CAMPOS REQUERIDOS]');
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch {
      setError('[ERROR: CREDENCIALES INVÁLIDAS]');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 dot-grid-subtle"
      style={{ background: '#000', fontFamily: "'Space Grotesk', sans-serif" }}
    >
      <div className="w-full max-w-[400px]" style={{
        background: 'var(--nd-surface)',
        border: '1px solid var(--nd-border-visible)',
        borderRadius: '16px',
        padding: '48px 32px',
      }}>
        {/* Logo */}
        <div className="flex flex-col items-center" style={{ marginBottom: '48px' }}>
          <img src={saestiLogo} alt="SAESTL" className="w-20 h-20 object-contain mb-4" />
          <h1 style={{
            fontFamily: "'Doto', 'Space Mono', monospace",
            fontSize: '36px',
            fontWeight: 700,
            color: 'var(--nd-text-display)',
            letterSpacing: '-0.02em',
            lineHeight: 1,
          }}>
            SAESTL
          </h1>
          <span style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '11px',
            letterSpacing: '0.08em',
            color: 'var(--nd-text-secondary)',
            textTransform: 'uppercase',
            marginTop: '12px',
          }}>
            SISTEMA DE GESTION FINANCIERA
          </span>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '12px',
            color: 'var(--nd-accent)',
            letterSpacing: '0.04em',
            marginBottom: '16px',
            padding: '12px',
            border: '1px solid var(--nd-accent)',
            borderRadius: '4px',
          }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontFamily: "'Space Mono', monospace",
              fontSize: '11px',
              letterSpacing: '0.08em',
              color: 'var(--nd-text-secondary)',
              textTransform: 'uppercase',
            }}>
              CORREO ELECTRONICO
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="usuario@uaeh.edu.mx"
              className="w-full h-11 px-0 bg-transparent outline-none transition-colors duration-150"
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: '14px',
                color: 'var(--nd-text-primary)',
                borderBottom: '1px solid var(--nd-border-visible)',
              }}
              onFocus={(e) => e.target.style.borderBottomColor = 'var(--nd-text-display)'}
              onBlur={(e) => e.target.style.borderBottomColor = 'var(--nd-border-visible)'}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontFamily: "'Space Mono', monospace",
              fontSize: '11px',
              letterSpacing: '0.08em',
              color: 'var(--nd-text-secondary)',
              textTransform: 'uppercase',
            }}>
              CONTRASENA
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-11 px-0 pr-10 bg-transparent outline-none transition-colors duration-150"
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '14px',
                  color: 'var(--nd-text-primary)',
                  borderBottom: '1px solid var(--nd-border-visible)',
                }}
                onFocus={(e) => e.target.style.borderBottomColor = 'var(--nd-text-display)'}
                onBlur={(e) => e.target.style.borderBottomColor = 'var(--nd-border-visible)'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-1/2 -translate-y-1/2 cursor-pointer"
                style={{ color: 'var(--nd-text-disabled)' }}
              >
                {showPassword ? <EyeOff size={16} strokeWidth={1.5} /> : <Eye size={16} strokeWidth={1.5} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-40 cursor-pointer"
            style={{
              background: 'var(--nd-text-display)',
              color: 'var(--nd-black)',
              borderRadius: '999px',
              fontFamily: "'Space Mono', monospace",
              fontSize: '13px',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              marginTop: '32px',
            }}
          >
            {loading ? (
              <span>[LOADING...]</span>
            ) : (
              <>INICIAR SESION <ArrowRight size={16} strokeWidth={1.5} /></>
            )}
          </button>
        </form>

        <p className="text-center" style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: '10px',
          color: 'var(--nd-text-disabled)',
          letterSpacing: '0.06em',
          marginTop: '32px',
          textTransform: 'uppercase',
        }}>
          ESCUELA SUPERIOR DE TLAHUELILPAN — UAEH
        </p>
      </div>
    </div>
  );
}
