import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, BookOpen, MapPin, School, Clock, Calendar, Menu } from 'lucide-react';
import { motion } from 'framer-motion';

const SidebarItem = ({ icon: Icon, label, to, active }) => (
    <Link to={to}>
        <motion.div
            whileHover={{ x: 5 }}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${active
                    ? 'bg-violet-600/20 text-violet-300 border-l-4 border-violet-500'
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

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', to: '/' },
        { icon: Users, label: 'Teachers', to: '/teachers' },
        { icon: BookOpen, label: 'Subjects', to: '/subjects' },
        { icon: MapPin, label: 'Rooms', to: '/rooms' },
        { icon: School, label: 'Classes', to: '/classes' },
        { icon: Clock, label: 'Time Slots', to: '/timeslots' },
        { icon: Calendar, label: 'Generate', to: '/generate' },
    ];

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
