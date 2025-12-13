import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Play, Download, CheckSquare, Square } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import GlassButton from '../components/GlassButton';
import DataTable from '../components/DataTable';
import NeonTriangleLoader from '../components/NeonTriangleLoader';

import { useToast } from '../context/ToastContext';

import ConsolidatedTimetable from '../components/ConsolidatedTimetable';

const GenerateTimetable = () => {
    const [generating, setGenerating] = useState(false);
    const [timetable, setTimetable] = useState(null);
    const [error, setError] = useState('');
    const { addToast } = useToast();

    // Data State
    const [classes, setClasses] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [subjects, setSubjects] = useState([]);

    // Selection State
    const [generationMode, setGenerationMode] = useState('single'); // 'single' or 'department'
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedTeachers, setSelectedTeachers] = useState([]);
    const [selectedSubjects, setSelectedSubjects] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [classesRes, teachersRes, subjectsRes] = await Promise.all([
                axios.get('/api/classsections'),
                axios.get('/api/teachers'),
                axios.get('/api/subjects')
            ]);
            setClasses(classesRes.data);
            setTeachers(teachersRes.data);
            setSubjects(subjectsRes.data);
        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Failed to load configuration data.');
            addToast('Failed to load configuration data', 'error');
        }
    };

    const toggleTeacher = (id) => {
        setSelectedTeachers(prev =>
            prev.includes(id) ? prev.filter(tId => tId !== id) : [...prev, id]
        );
    };

    const toggleSubject = (id) => {
        setSelectedSubjects(prev =>
            prev.includes(id) ? prev.filter(sId => sId !== id) : [...prev, id]
        );
    };

    const selectAllTeachers = () => setSelectedTeachers(teachers.map(t => t.id));
    const selectAllSubjects = () => setSelectedSubjects(subjects.map(s => s.id));

    // Get unique departments from classes
    const departments = [...new Set(classes.map(c => c.department).filter(Boolean))].sort();

    const handleGenerate = async () => {
        if (generationMode === 'single' && !selectedClass) {
            setError('Please select a class.');
            return;
        }
        if (generationMode === 'department' && !selectedDepartment) {
            setError('Please select a department.');
            return;
        }

        if (selectedTeachers.length === 0 || selectedSubjects.length === 0) {
            setError('Please select at least one teacher and one subject.');
            addToast('Please complete the configuration', 'error');
            return;
        }

        setGenerating(true);
        setError('');
        setTimetable(null);

        try {
            const request = {
                classSectionId: generationMode === 'single' ? parseInt(selectedClass) : null,
                department: generationMode === 'department' ? selectedDepartment : null,
                subjectIds: selectedSubjects,
                teacherIds: selectedTeachers
            };

            const response = await axios.post('/api/timetable/generate', request);
            setTimetable(response.data.timetable);
            addToast('Timetable generated successfully', 'success');
        } catch (err) {
            console.error('Error generating timetable:', err);
            setError('Failed to generate timetable. Please ensure data exists and constraints can be met.');
            addToast('Failed to generate timetable', 'error');
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
                <GlassCard className="lg:col-span-1 h-fit space-y-6">
                    <div>
                        <h3 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
                            <Calendar size={20} className="text-violet-400" />
                            Configuration
                        </h3>

                        <div className="space-y-4">
                            {/* Generation Mode Toggle */}
                            <div className="flex bg-gray-800 p-1 rounded-lg mb-4">
                                <button
                                    onClick={() => setGenerationMode('single')}
                                    className={`flex-1 py-1 px-3 rounded-md text-sm transition-all ${generationMode === 'single' ? 'bg-violet-600 text-white' : 'text-gray-400 hover:text-white'}`}
                                >
                                    Single Class
                                </button>
                                <button
                                    onClick={() => setGenerationMode('department')}
                                    className={`flex-1 py-1 px-3 rounded-md text-sm transition-all ${generationMode === 'department' ? 'bg-violet-600 text-white' : 'text-gray-400 hover:text-white'}`}
                                >
                                    Entire Branch
                                </button>
                            </div>

                            {generationMode === 'single' ? (
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Target Class</label>
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
                            ) : (
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Target Department</label>
                                    <select
                                        value={selectedDepartment}
                                        onChange={(e) => setSelectedDepartment(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all"
                                    >
                                        <option value="" className="bg-gray-800">Select Department</option>
                                        {departments.map(dept => (
                                            <option key={dept} value={dept} className="bg-gray-800">{dept}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="block text-sm font-medium text-gray-300">Teachers</label>
                                    <button onClick={selectAllTeachers} className="text-xs text-violet-400 hover:text-violet-300">Select All</button>
                                </div>
                                <div className="max-h-32 overflow-y-auto bg-white/5 rounded-lg p-2 space-y-1 border border-white/10">
                                    {teachers.map(teacher => (
                                        <div key={teacher.id} onClick={() => toggleTeacher(teacher.id)} className="flex items-center gap-2 cursor-pointer hover:bg-white/5 p-1 rounded">
                                            {selectedTeachers.includes(teacher.id) ?
                                                <CheckSquare size={16} className="text-violet-400" /> :
                                                <Square size={16} className="text-gray-500" />
                                            }
                                            <span className="text-sm text-gray-300 truncate">{teacher.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="block text-sm font-medium text-gray-300">Subjects</label>
                                    <button onClick={selectAllSubjects} className="text-xs text-violet-400 hover:text-violet-300">Select All</button>
                                </div>
                                <div className="max-h-32 overflow-y-auto bg-white/5 rounded-lg p-2 space-y-1 border border-white/10">
                                    {subjects.map(subject => (
                                        <div key={subject.id} onClick={() => toggleSubject(subject.id)} className="flex items-center gap-2 cursor-pointer hover:bg-white/5 p-1 rounded">
                                            {selectedSubjects.includes(subject.id) ?
                                                <CheckSquare size={16} className="text-violet-400" /> :
                                                <Square size={16} className="text-gray-500" />
                                            }
                                            <span className="text-sm text-gray-300 truncate">{subject.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <GlassButton
                                onClick={handleGenerate}
                                disabled={generating}
                                className="w-full flex justify-center items-center gap-2 mt-4"
                            >
                                {generating ? (
                                    <>
                                        <div className="flex flex-col items-center justify-center py-2">
                                            <NeonTriangleLoader />
                                            <span className="mt-2 text-sm text-gray-300">Optimizing Schedule...</span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <Play size={18} />
                                        Generate Schedule
                                    </>
                                )}
                            </GlassButton>
                        </div>
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

                            {generationMode === 'department' ? (
                                <ConsolidatedTimetable
                                    timetable={timetable}
                                    departments={[selectedDepartment]}
                                />
                            ) : (
                                <DataTable
                                    columns={columns}
                                    data={timetable}
                                    actions={false}
                                />
                            )}
                        </GlassCard>
                    )}

                    {!timetable && !generating && !error && (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-500 bg-white/5 rounded-xl border border-white/5 border-dashed">
                            <Calendar size={48} className="mb-4 opacity-20" />
                            <p>Select configuration and generate timetable</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GenerateTimetable;
