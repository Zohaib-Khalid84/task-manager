import { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, CheckCircle2, BarChart3, ShieldCheck, ArrowRight } from 'lucide-react';
import api from '../api';
import { toast } from '../utils';

export default function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

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
      toast(isLogin ? 'Welcome back!' : 'Account created!');
    } catch (err) {
      setError(err.response?.data?.message || 'Cannot connect to server');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: <CheckCircle2 size={20} />, title: 'Smart task tracking', text: 'Priorities, categories and deadlines' },
    { icon: <BarChart3 size={20} />, title: 'Visual insights', text: 'Charts, Kanban board and calendar' },
    { icon: <ShieldCheck size={20} />, title: 'Secure by design', text: 'JWT authentication, hashed passwords' },
  ];

  return (
    <div className="auth-page">
      <div className="auth-side">
        <span className="orb o1" />
        <span className="orb o2" />
        <span className="orb o3" />
        <div className="auth-content">
          <div className="brand light">
            <span className="logo">✓</span>
            <span className="brand-text">TaskFlow</span>
          </div>
          <h1>Organize your work.<br /><em>Achieve more.</em></h1>
          <p className="auth-sub">A premium workspace to plan, track and finish what matters.</p>
          <div className="feature-list"></div>