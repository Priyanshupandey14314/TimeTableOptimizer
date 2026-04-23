import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, BookOpen, MapPin, School, Clock, Calendar, Menu, GraduationCap, ClipboardList, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const SidebarItem = ({ icon: Icon, label, to, active }) => (
    <Link to={to}>
        <motion.div
            whileHover={{ x: 5 }}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${active
                ? 'bg-blue-600/20 text-blue-300 border-l-4 border-blue-500'
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
        >
            <Icon size={20} />
            <span className="font-medium">{label}</span>
        </motion.div>
    </Link>
);

const Layout = ({ children }) => {
    const location = useLocation();
    const { user, logout } = useAuth();

    const allNavItems = [
        { icon: LayoutDashboard, label: 'Dashboard', to: '/', roles: ['ADMIN', 'TEACHER', 'STUDENT'] },
        { icon: Users, label: 'Teachers', to: '/teachers', roles: ['ADMIN'] },
        { icon: BookOpen, label: 'Subjects', to: '/subjects', roles: ['ADMIN'] },
        { icon: MapPin, label: 'Rooms', to: '/rooms', roles: ['ADMIN'] },
        { icon: School, label: 'Classes', to: '/classes', roles: ['ADMIN'] },
        { icon: Clock, label: 'Time Slots', to: '/timeslots', roles: ['ADMIN'] },
        { icon: Calendar, label: 'Generate', to: '/generate', roles: ['ADMIN'] },
        { icon: GraduationCap, label: 'Student View', to: '/student-timetable', roles: ['ADMIN', 'STUDENT'] },
        { icon: ClipboardList, label: 'Teacher View', to: '/teacher-timetable', roles: ['ADMIN', 'TEACHER'] },
    ];

    const navItems = allNavItems.filter(item => {
        if (!user || !user.roles) return false;
        // Check if user has at least one of the required roles
        // Backend typically returns "ROLE_ADMIN", so we normalize or check
        return item.roles.some(role => user.roles.includes(role) || user.roles.includes(`ROLE_${role}`));
    });

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="w-64 glass fixed h-full z-10 hidden md:block border-r border-white/10">
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-gradient">TimeMaster</h1>
                    <p className="text-xs text-gray-500 mt-1">Timetable Optimizer</p>
                </div>

                <nav className="mt-6 px-4 space-y-2">
                    {navItems.map((item) => (
                        <SidebarItem
                            key={item.to}
                            icon={item.icon}
                            label={item.label}
                            to={item.to}
                            active={location.pathname === item.to}
                        />
                    ))}
                </nav>

                <div className="absolute bottom-0 w-full p-4 border-t border-white/10">
                    <button
                        onClick={logout}
                        className="flex items-center space-x-3 px-4 py-3 w-full rounded-lg text-red-400 hover:bg-white/5 hover:text-red-300 transition-all font-medium"
                    >
                        <LogOut size={20} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-8">
                {/* Mobile Header */}
                <div className="md:hidden flex items-center justify-between mb-8 glass p-4 rounded-xl">
                    <h1 className="text-xl font-bold text-gradient">TimeMaster</h1>
                    <button className="p-2 text-gray-300 hover:text-white">
                        <Menu size={24} />
                    </button>
                </div>

                {children}
            </main>
        </div>
    );
};

export default Layout;
