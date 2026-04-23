import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Search, Download, Users } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import GlassButton from '../components/GlassButton';
import DataTable from '../components/DataTable';
import NeonTriangleLoader from '../components/NeonTriangleLoader';
import { useToast } from '../context/ToastContext';
import { exportTimetableToPDF } from '../utils/pdfUtils';

const StudentTimetable = () => {
    const [loading, setLoading] = useState(false);
    const [timetable, setTimetable] = useState(null);
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const { addToast } = useToast();

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            const res = await axios.get('/api/classsections');
            setClasses(res.data);
        } catch (err) {
            console.error(err);
            addToast('Failed to load classes', 'error');
        }
    };

    const fetchTimetable = async () => {
        if (!selectedClass) return;
        setLoading(true);
        try {
            const res = await axios.get(`/api/timetable/class/${selectedClass}`);
            // The API returns List<TimetableEntry>. We may need to map it if the format is strictly Entity and not DTO.
            // TimetableEntry has { classSection, subject, teacher, room, timeSlot ... }
            if (res.data && res.data.length > 0) {
                setTimetable(res.data);
            } else {
                setTimetable([]);
                addToast('No timetable found for this class', 'info');
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
        const cls = classes.find(c => c.id == selectedClass);
        exportTimetableToPDF(timetable, `${cls?.name || 'Class'}_Timetable`);
        addToast('Timetable exported successfully', 'success');
    };

    const columns = [
        { key: 'timeSlot.day', label: 'Day', render: (row) => row.timeSlot?.day || row.day },
        { key: 'timeSlot.periodNumber', label: 'Period', render: (row) => row.timeSlot?.periodNumber || row.periodNumber },
        { key: 'subject.name', label: 'Subject', render: (row) => row.subject?.name || row.subject },
        { key: 'teacher.name', label: 'Teacher', render: (row) => row.teacher?.name || row.teacher },
        { key: 'room.roomNumber', label: 'Room', render: (row) => row.room?.roomNumber || row.room },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-white">Student Timetable</h2>
                <p className="text-gray-400 mt-1">View weekly schedule by class</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <GlassCard className="lg:col-span-1 h-fit space-y-6">
                    <h3 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
                        <Search size={20} className="text-violet-400" />
                        Find Class
                    </h3>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Select Class</label>
                        <select
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all"
                        >
                            <option value="" className="bg-gray-800">Select Class</option>
                            {classes.map(cls => (
                                <option key={cls.id} value={cls.id} className="bg-gray-800">{cls.name}</option>
                            ))}
                        </select>
                    </div>

                    <GlassButton
                        onClick={handleSearch}
                        disabled={!selectedClass || loading}
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
                                <Users size={48} className="mb-4 opacity-20" />
                                <p>Select a class to view its timetable</p>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentTimetable;
