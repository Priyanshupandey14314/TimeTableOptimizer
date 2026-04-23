import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import GlassCard from '../components/GlassCard';
import GlassInput from '../components/GlassInput';
import GlassButton from '../components/GlassButton';
import { Lock, User, GraduationCap, Briefcase } from 'lucide-react';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('STUDENT'); // Default
    const [loading, setLoading] = useState(false);
    const { addToast } = useToast();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username,
                    password,
                    roles: [role]
                }),
            });

            if (response.ok) {
                addToast('Registration successful! Please login.', 'success');
                navigate('/login');
            } else {
                const text = await response.text();
                addToast(text || 'Registration failed', 'error');
            }
        } catch {
            addToast('Registration failed', 'error');
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
                            Create Account
                        </h1>
                        <p className="text-gray-400 mt-2">Join TimeMaster</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Username</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <GlassInput
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Choose a username"
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
                                    placeholder="Choose a password"
                                    className="pl-10"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">I am a...</label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setRole('STUDENT')}
                                    className={`p-3 rounded-lg border flex items-center justify-center space-x-2 transition-all ${role === 'STUDENT'
                                            ? 'bg-blue-500/20 border-blue-500 text-blue-300'
                                            : 'border-white/10 hover:bg-white/5 text-gray-400'
                                        }`}
                                >
                                    <GraduationCap size={18} />
                                    <span>Student</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole('TEACHER')}
                                    className={`p-3 rounded-lg border flex items-center justify-center space-x-2 transition-all ${role === 'TEACHER'
                                            ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                                            : 'border-white/10 hover:bg-white/5 text-gray-400'
                                        }`}
                                >
                                    <Briefcase size={18} />
                                    <span>Teacher</span>
                                </button>
                            </div>
                        </div>

                        <GlassButton
                            type="submit"
                            className="w-full justify-center py-3 text-lg"
                            disabled={loading}
                        >
                            {loading ? 'Creating Account...' : 'Sign Up'}
                        </GlassButton>
                    </form>

                    <div className="mt-6 text-center">
                        <span className="text-gray-400">Already have an account? </span>
                        <button
                            onClick={() => navigate('/login')}
                            className="text-blue-400 hover:text-blue-300 font-medium"
                        >
                            Log In
                        </button>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
};

export default Signup;
