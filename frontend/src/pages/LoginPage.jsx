import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, ArrowRight, UserCheck, Sparkles, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, switchDemoRole } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role) => {
    setError('');
    setLoading(true);
    try {
      await switchDemoRole(role);
      navigate('/dashboard');
    } catch (err) {
      setError(`Failed to log in as ${role}: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center space-x-2">
          <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-sm">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight font-sans">InkloomGuard</span>
        </Link>
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
          Sign in to Inkloom AI
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Intelligent Brand Governance Platform • <a href="https://inkloomguard.xyz" className="text-brand-600 hover:underline">inkloomguard.xyz</a>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200 rounded-2xl sm:px-10">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Judge Quick-Demo Credentials Card */}
          <div className="mb-6 p-4 rounded-xl bg-brand-50/70 border border-brand-200 space-y-2.5">
            <div className="flex items-center space-x-1.5 text-brand-800 text-xs font-bold">
              <Sparkles className="w-4 h-4 text-brand-600" />
              <span>Hackathon Judge Quick Sign-In</span>
            </div>
            <p className="text-[11px] text-brand-700 leading-tight">
              Click any demo account to test role-specific brand governance workflows:
            </p>
            <div className="grid grid-cols-3 gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleDemoLogin('creator')}
                disabled={loading}
                className="px-2.5 py-1.5 rounded-lg bg-white border border-brand-300 text-brand-800 text-xs font-semibold hover:bg-brand-100 hover:border-brand-400 transition-colors shadow-2xs"
              >
                Priya (Creator)
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('reviewer')}
                disabled={loading}
                className="px-2.5 py-1.5 rounded-lg bg-white border border-brand-300 text-brand-800 text-xs font-semibold hover:bg-brand-100 hover:border-brand-400 transition-colors shadow-2xs"
              >
                Arjun (Reviewer)
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('manager')}
                disabled={loading}
                className="px-2.5 py-1.5 rounded-lg bg-white border border-brand-300 text-brand-800 text-xs font-semibold hover:bg-brand-100 hover:border-brand-400 transition-colors shadow-2xs"
              >
                Rohan (Manager)
              </button>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-slate-700">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="creator@freshplus.io"
                className="mt-1 block w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1 block w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center space-x-2 py-2.5 px-4 border border-transparent rounded-lg shadow-xs text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 transition-colors"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            <span>Don't have an account? </span>
            <Link to="/register" className="font-semibold text-brand-600 hover:text-brand-500">
              Create one now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
