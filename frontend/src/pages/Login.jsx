import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import GlassCard from '../components/GlassCard';
import GlassInput from '../components/GlassInput';
import GlassButton from '../components/GlassButton';
import { Lock, User } from 'lucide-react';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const { addToast } = useToast();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const success = await login(username, password);
            if (success) {
                addToast('Login successful!', 'success');
                navigate('/');
            } else {
                addToast('Invalid credentials', 'error');
            }
        } catch {
            addToast('Login failed', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-slate-900 p-4">
            <div className="w-full max-w-md">
                <GlassCard className="p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-400">
                            TimeMaster
                        </h1>
                        <p className="text-gray-400 mt-2">Sign in to your account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Username</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <GlassInput
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter your username"
                                    className="pl-10"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <GlassInput
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="pl-10"
                                    required
                                />
                            </div>
                        </div>

                        <GlassButton
                            type="submit"
                            className="w-full justify-center py-3 text-lg"
                            disabled={loading}
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </GlassButton>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-500">
                        Default Admin: admin / pass-admin
                    </div>

                    <div className="mt-4 text-center">
                        <span className="text-gray-400">Don't have an account? </span>
                        <button
                            onClick={() => navigate('/signup')}
                            className="text-blue-400 hover:text-blue-300 font-medium"
                        >
                            Sign Up
                        </button>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
};

export default Login;
