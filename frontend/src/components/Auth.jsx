import { useState } from 'react';
import api from '../api';

export default function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    if (!isLogin && form.name.trim().length < 2) return 'Name must be at least 2 characters';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Please enter a valid email';
    if (form.password.length < 6) return 'Password must be at least 6 characters';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const problem = validate();
    if (problem) return setError(problem);
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post(isLogin ? '/auth/login' : '/auth/register', form);
      onLogin(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Cannot connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-side">
        <div className="brand light">
          <span className="logo">✓</span>
          <span className="brand-text">TaskFlow</span>
        </div>
        <h1>Organize your work.<br /><em>Achieve more.</em></h1>
        <ul>
          <li>✔ Track tasks with priorities and deadlines</li>
          <li>✔ Visual dashboard with progress charts</li>
          <li>✔ Secure personal account</li>
        </ul>
      </div>

      <div className="auth-form-wrap">
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <h2>{isLogin ? 'Welcome back' : 'Create your account'}</h2>
          <p className="muted">{isLogin ? 'Login to continue' : 'Start managing your tasks today'}</p>
          {!isLogin && (
            <>
              <label>Full name</label>
              <input name="name" value={form.name} onChange={handleChange} />
            </>
          )}
          <label>Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} />
          <label>Password</label>
          <input name="password" type="password" value={form.password} onChange={handleChange} />
          {error && <p className="error">{error}</p>}
          <button type="submit" className="btn-primary full" disabled={loading}>
            {loading ? 'Please wait...' : isLogin ? 'Login' : 'Register'}
          </button>
          <p className="switch" onClick={() => { setIsLogin(!isLogin); setError(''); }}>
            {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
          </p>
        </form>
      </div>
    </div>
  );
}