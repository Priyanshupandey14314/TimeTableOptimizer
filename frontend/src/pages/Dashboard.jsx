import React from 'react';
import { Users, BookOpen, MapPin, School, Clock } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { motion } from 'framer-motion';

const StatCard = ({ icon: Icon, label, value, color }) => (
    <GlassCard className="flex items-center space-x-4">
        <div className={`p-3 rounded-lg bg-${color}-500/20 text-${color}-400`}>
            <Icon size={24} />
        </div>
        <div>
            <p className="text-sm text-gray-400">{label}</p>
            <h3 className="text-2xl font-bold text-white">{value}</h3>
        </div>
    </GlassCard>
);

const Dashboard = () => {
    // Mock data - replace with API calls later
    const stats = [
        { icon: Users, label: 'Total Teachers', value: '12', color: 'violet' },
        { icon: BookOpen, label: 'Total Subjects', value: '8', color: 'pink' },
        { icon: MapPin, label: 'Total Rooms', value: '5', color: 'cyan' },
        { icon: School, label: 'Classes', value: '6', color: 'emerald' },
        { icon: Clock, label: 'Time Slots', value: '40', color: 'amber' },
    ];

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-white">Dashboard</h2>
                    <p className="text-gray-400 mt-1">Welcome to TimeMaster Optimizer</p>
                </div>
                <div className="text-sm text-gray-400 bg-white/5 px-4 py-2 rounded-lg border border-white/10">
                    Academic Year 2025-2026
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <StatCard {...stat} />
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <GlassCard>
                    <h3 className="text-xl font-semibold mb-4 text-white">Quick Actions</h3>
                    <div className="space-y-4">
                        <p className="text-gray-400">Select an action to get started:</p>
                        <div className="grid grid-cols-2 gap-4">
                            <button className="p-4 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-left group">
                                <span className="block text-violet-400 font-medium group-hover:text-violet-300">Add Teacher</span>
                                <span className="text-xs text-gray-500">Register new faculty member</span>
                            </button>
                            <button className="p-4 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-left group">
                                <span className="block text-pink-400 font-medium group-hover:text-pink-300">Generate Timetable</span>
                                <span className="text-xs text-gray-500">Run optimization algorithm</span>
                            </button>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard>
                    <h3 className="text-xl font-semibold mb-4 text-white">System Status</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                            <span className="text-green-400 font-medium">Backend Connected</span>
                            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                            <span className="text-blue-400 font-medium">Database Active</span>
                            <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                        </div>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
};

export default Dashboard;
