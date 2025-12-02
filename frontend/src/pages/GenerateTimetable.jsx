import React, { useState } from 'react';
import axios from 'axios';
import { Calendar, Play, Download } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import GlassButton from '../components/GlassButton';
import DataTable from '../components/DataTable';

const GenerateTimetable = () => {
    const [generating, setGenerating] = useState(false);
    const [timetable, setTimetable] = useState(null);
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        setGenerating(true);
        setError('');
        setTimetable(null);

        try {
            // Hardcoded request for demo - in real app, these would come from form inputs
            const request = {
                classSectionId: 1,
                subjectIds: [1, 2],
                teacherIds: [1, 2]
            };

            const response = await axios.post('/api/timetable/generate', request);
            setTimetable(response.data.timetable);
        } catch (err) {
            console.error('Error generating timetable:', err);
            setError('Failed to generate timetable. Please ensure data exists.');

            // Mock result for demo
            setTimeout(() => {
                setTimetable([
                    { day: 'Monday', periodNumber: 1, subject: 'Data Structures', teacher: 'Dr. Smith', room: 'Room 101' },
                    { day: 'Monday', periodNumber: 2, subject: 'Algorithms', teacher: 'Prof. Johnson', room: 'Room 101' },
                ]);
            }, 1000);
        } finally {
            setGenerating(false);
        }
    };

    const columns = [
        { key: 'day', label: 'Day' },
        { key: 'periodNumber', label: 'Period' },
        { key: 'subject', label: 'Subject' },
        { key: 'teacher', label: 'Teacher' },
        { key: 'room', label: 'Room' },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-white">Generate Timetable</h2>
                <p className="text-gray-400 mt-1">Run the genetic algorithm optimization</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <GlassCard className="lg:col-span-1 h-fit">
                    <h3 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
                        <Calendar size={20} className="text-violet-400" />
                        Configuration
                    </h3>

                    <div className="space-y-4">
                        <p className="text-sm text-gray-400">
                            Click the button below to start the genetic algorithm. The system will attempt to find the optimal schedule without clashes.
                        </p>

                        <GlassButton
                            onClick={handleGenerate}
                            disabled={generating}
                            className="w-full flex justify-center items-center gap-2"
                        >
                            {generating ? (
                                <>
                                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                                    Optimizing...
                                </>
                            ) : (
                                <>
                                    <Play size={18} />
                                    Generate Schedule
                                </>
                            )}
                        </GlassButton>
                    </div>
                </GlassCard>

                <div className="lg:col-span-2">
                    {error && (
                        <div className="mb-4 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
                            {error}
                        </div>
                    )}

                    {timetable && (
                        <GlassCard>
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-semibold text-white">Generated Schedule</h3>
                                <button className="text-gray-400 hover:text-white flex items-center gap-2 text-sm">
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
                    )}

                    {!timetable && !generating && !error && (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-500 bg-white/5 rounded-xl border border-white/5 border-dashed">
                            <Calendar size={48} className="mb-4 opacity-20" />
                            <p>No timetable generated yet</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GenerateTimetable;
