import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Search } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import GlassButton from '../components/GlassButton';
import GlassInput from '../components/GlassInput';
import DataTable from '../components/DataTable';
import GlassModal from '../components/GlassModal';
import NeonTriangleLoader from '../components/NeonTriangleLoader';
import { useToast } from '../context/ToastContext';

const Subjects = () => {
    const [subjects, setSubjects] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { addToast } = useToast();

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentSubject, setCurrentSubject] = useState(null);
    const [formData, setFormData] = useState({ name: '', code: '', teacherId: '' });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [subjectsRes, teachersRes] = await Promise.all([
                axios.get('/api/subjects'),
                axios.get('/api/teachers')
            ]);
            setSubjects(subjectsRes.data);
            setTeachers(teachersRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            addToast('Failed to fetch data', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (subject = null) => {
        if (subject) {
            setCurrentSubject(subject);
            setFormData({
                name: subject.name,
                code: subject.code,
                teacherId: subject.teacher ? subject.teacher.id : ''
            });
        } else {
            setCurrentSubject(null);
            setFormData({ name: '', code: '', teacherId: '' });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentSubject(null);
        setFormData({ name: '', code: '', teacherId: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const payload = {
            name: formData.name,
            code: formData.code,
            teacher: formData.teacherId ? { id: formData.teacherId } : null
        };

        try {
            if (currentSubject) {
                await axios.put(`/api/subjects/${currentSubject.id}`, payload);
                addToast('Subject updated successfully', 'success');
            } else {
                await axios.post('/api/subjects', payload);
                addToast('Subject added successfully', 'success');
            }
            fetchData();
            handleCloseModal();
        } catch (error) {
            console.error('Error saving subject:', error);
            addToast('Failed to save subject', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (subject) => {
        if (window.confirm(`Are you sure you want to delete ${subject.name}?`)) {
            try {
                await axios.delete(`/api/subjects/${subject.id}`);
                addToast('Subject deleted successfully', 'success');
                fetchData();
            } catch (error) {
                console.error('Error deleting subject:', error);
                addToast('Failed to delete subject', 'error');
            }
        }
    };

    const columns = [
        { key: 'code', label: 'Code' },
        { key: 'name', label: 'Subject Name' },
        {
            key: 'teacher',
            label: 'Teacher',
            render: (row) => row.teacher ? row.teacher.name : 'N/A'
        },
    ];

    const filteredSubjects = subjects.filter(subject =>
        subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subject.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-white">Subjects</h2>
                    <p className="text-gray-400 mt-1">Manage course curriculum</p>
                </div>
                <GlassButton onClick={() => handleOpenModal()} className="flex items-center gap-2">
                    <Plus size={20} />
                    Add Subject
                </GlassButton>
            </div>

            <GlassCard>
                <div className="mb-6 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <GlassInput
                        placeholder="Search subjects..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {loading ? (
                    <NeonTriangleLoader />
                ) : (
                    <DataTable
                        columns={columns}
                        data={filteredSubjects}
                        onEdit={handleOpenModal}
                        onDelete={handleDelete}
                    />
                )}
            </GlassCard>

            <GlassModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={currentSubject ? 'Edit Subject' : 'Add Subject'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Subject Code</label>
                        <GlassInput
                            required
                            value={formData.code}
                            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                            placeholder="CS101"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Subject Name</label>
                        <GlassInput
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Introduction to Programming"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Teacher</label>
                        <select
                            value={formData.teacherId}
                            onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all"
                        >
                            <option value="" className="bg-gray-800">Select Teacher</option>
                            {teachers.map(teacher => (
                                <option key={teacher.id} value={teacher.id} className="bg-gray-800">
                                    {teacher.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={handleCloseModal}
                            className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <GlassButton type="submit" disabled={submitting}>
                            {submitting ? 'Saving...' : (currentSubject ? 'Update Subject' : 'Add Subject')}
                        </GlassButton>
                    </div>
                </form>
            </GlassModal>
        </div>
    );
};

export default Subjects;
