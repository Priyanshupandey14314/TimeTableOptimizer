import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Search, Download, GraduationCap } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import GlassButton from '../components/GlassButton';
import DataTable from '../components/DataTable';
import NeonTriangleLoader from '../components/NeonTriangleLoader';
import { useToast } from '../context/ToastContext';
import { exportTimetableToPDF } from '../utils/pdfUtils';

const TeacherTimetable = () => {
    const [loading, setLoading] = useState(false);
    const [timetable, setTimetable] = useState(null);
    const [teachers, setTeachers] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState('');
    const { addToast } = useToast();

    useEffect(() => {
        fetchTeachers();
    }, []);

    const fetchTeachers = async () => {
        try {
            const res = await axios.get('/api/teachers');
            setTeachers(res.data);
        } catch (err) {
            console.error(err);
            addToast('Failed to load teachers', 'error');
        }
    };

    const fetchTimetable = async () => {
        if (!selectedTeacher) return;
        setLoading(true);
        try {
            const res = await axios.get(`/api/timetable/teacher/${selectedTeacher}`);
            if (res.data && res.data.length > 0) {
                setTimetable(res.data);
            } else {
                setTimetable([]);
                addToast('No timetable found for this teacher', 'info');
            }
        } catch (err) {
            console.error(err);
            addToast('Failed to load timetable', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        fetchTimetable();
    };

    const handleExport = () => {
        if (!timetable || timetable.length === 0) return;
        const teacher = teachers.find(t => t.id == selectedTeacher);
        exportTimetableToPDF(timetable, `${teacher?.name || 'Teacher'}_Schedule`);
        addToast('Schedule exported successfully', 'success');
    };

    const columns = [
        { key: 'timeSlot.day', label: 'Day', render: (row) => row.timeSlot?.day || row.day },
        { key: 'timeSlot.periodNumber', label: 'Period', render: (row) => row.timeSlot?.periodNumber || row.periodNumber },
        { key: 'subject.name', label: 'Subject', render: (row) => row.subject?.name || row.subject },
        { key: 'classSection.name', label: 'Class', render: (row) => row.classSection?.name || row.classSection },
        { key: 'room.roomNumber', label: 'Room', render: (row) => row.room?.roomNumber || row.room },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-white">Teacher Schedule</h2>
                <p className="text-gray-400 mt-1">View personal teaching schedule</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <GlassCard className="lg:col-span-1 h-fit space-y-6">
                    <h3 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
                        <Search size={20} className="text-violet-400" />
                        Find Teacher
                    </h3>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Select Teacher</label>
                        <select
                            value={selectedTeacher}
                            onChange={(e) => setSelectedTeacher(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all"
                        >
                            <option value="" className="bg-gray-800">Select Teacher</option>
                            {teachers.map(t => (
                                <option key={t.id} value={t.id} className="bg-gray-800">{t.name}</option>
                            ))}
                        </select>
                    </div>

                    <GlassButton
                        onClick={handleSearch}
                        disabled={!selectedTeacher || loading}
                        className="w-full flex justify-center items-center gap-2"
                    >
                        {loading ? <NeonTriangleLoader size={20} /> : <Search size={18} />}
                        View Schedule
                    </GlassButton>
                </GlassCard>

                <div className="lg:col-span-3">
                    {timetable && timetable.length > 0 ? (
                        <GlassCard>
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-semibold text-white">Weekly Schedule</h3>
                                <button
                                    onClick={handleExport}
                                    className="text-gray-400 hover:text-white flex items-center gap-2 text-sm transition-colors"
                                >
                                    <Download size={16} />
                                    Export PDF
                                </button>
                            </div>
                            <DataTable
                                columns={columns}
                                data={timetable}
                                actions={false}
                            />
                        </GlassCard>
                    ) : (
                        !loading && (
                            <div className="flex flex-col items-center justify-center h-64 text-gray-500 bg-white/5 rounded-xl border border-white/5 border-dashed">
                                <GraduationCap size={48} className="mb-4 opacity-20" />
                                <p>Select a teacher to view schedule</p>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeacherTimetable;
