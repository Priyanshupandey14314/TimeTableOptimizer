import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Search } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import GlassButton from '../components/GlassButton';
import GlassInput from '../components/GlassInput';
import DataTable from '../components/DataTable';
import GlassModal from '../components/GlassModal';
import { useToast } from '../context/ToastContext';

const Teachers = () => {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { addToast } = useToast();

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTeacher, setCurrentTeacher] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        maxHoursPerDay: '',
        maxHoursPerWeek: ''
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchTeachers();
    }, []);

    const fetchTeachers = async () => {
        try {
            const response = await axios.get('/api/teachers');
            setTeachers(response.data);
        } catch (error) {
            console.error('Error fetching teachers:', error);
            addToast('Failed to fetch teachers', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (teacher = null) => {
        if (teacher) {
            setCurrentTeacher(teacher);
            setFormData({
                name: teacher.name,
                maxHoursPerDay: teacher.maxHoursPerDay,
                maxHoursPerWeek: teacher.maxHoursPerWeek
            });
        } else {
            setCurrentTeacher(null);
            setFormData({ name: '', maxHoursPerDay: '', maxHoursPerWeek: '' });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentTeacher(null);
        setFormData({ name: '', maxHoursPerDay: '', maxHoursPerWeek: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (currentTeacher) {
                await axios.put(`/api/teachers/${currentTeacher.id}`, formData);
                addToast('Teacher updated successfully', 'success');
            } else {
                await axios.post('/api/teachers', formData);
                addToast('Teacher added successfully', 'success');
            }
            fetchTeachers();
            handleCloseModal();
        } catch (error) {
            console.error('Error saving teacher:', error);
            addToast('Failed to save teacher', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (teacher) => {
        if (window.confirm(`Are you sure you want to delete ${teacher.name}?`)) {
            try {
                await axios.delete(`/api/teachers/${teacher.id}`);
                addToast('Teacher deleted successfully', 'success');
                fetchTeachers();
            } catch (error) {
                console.error('Error deleting teacher:', error);
                addToast('Failed to delete teacher', 'error');
            }
        }
    };

    const columns = [
        { key: 'name', label: 'Name' },
        { key: 'maxHoursPerDay', label: 'Max Hours/Day' },
        { key: 'maxHoursPerWeek', label: 'Max Hours/Week' },
    ];

    const filteredTeachers = teachers.filter(teacher =>
        teacher.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-white">Teachers</h2>
                    <p className="text-gray-400 mt-1">Manage faculty members</p>
                </div>
                <GlassButton onClick={() => handleOpenModal()} className="flex items-center gap-2">
                    <Plus size={20} />
                    Add Teacher
                </GlassButton>
            </div>

            <GlassCard>
                <div className="mb-6 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <GlassInput
                        placeholder="Search teachers..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {loading ? (
                    <div className="text-center py-8 text-gray-400">Loading...</div>
                ) : (
                    <DataTable
                        columns={columns}
                        data={filteredTeachers}
                        onEdit={handleOpenModal}
                        onDelete={handleDelete}
                    />
                )}
            </GlassCard>

            <GlassModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={currentTeacher ? 'Edit Teacher' : 'Add Teacher'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                        <GlassInput
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Dr. John Doe"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Max Hours Per Day</label>
                        <GlassInput
                            required
                            type="number"
                            value={formData.maxHoursPerDay}
                            onChange={(e) => setFormData({ ...formData, maxHoursPerDay: e.target.value })}
                            placeholder="4"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Max Hours Per Week</label>
                        <GlassInput
                            required
                            type="number"
                            value={formData.maxHoursPerWeek}
                            onChange={(e) => setFormData({ ...formData, maxHoursPerWeek: e.target.value })}
                            placeholder="20"
                        />
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
                            {submitting ? 'Saving...' : (currentTeacher ? 'Update Teacher' : 'Add Teacher')}
                        </GlassButton>
                    </div>
                </form>
            </GlassModal>
        </div>
    );
};

export default Teachers;
