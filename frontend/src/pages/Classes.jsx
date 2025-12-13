import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Search } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import GlassButton from '../components/GlassButton';
import GlassInput from '../components/GlassInput';
import DataTable from '../components/DataTable';
import GlassModal from '../components/GlassModal';
import { useToast } from '../context/ToastContext';

const Classes = () => {
    const [classes, setClasses] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { addToast } = useToast();

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentClass, setCurrentClass] = useState(null);
    const [formData, setFormData] = useState({ name: '', studentCount: '', roomId: '' });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [classesRes, roomsRes] = await Promise.all([
                axios.get('/api/classsections'),
                axios.get('/api/rooms')
            ]);
            setClasses(classesRes.data);
            setRooms(roomsRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            addToast('Failed to fetch data', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (cls = null) => {
        if (cls) {
            setCurrentClass(cls);
            setFormData({
                name: cls.name,
                studentCount: cls.studentCount,
                department: cls.department || '',
                roomId: cls.room ? cls.room.id : ''
            });
        } else {
            setCurrentClass(null);
            setFormData({ name: '', studentCount: '', roomId: '', department: '' });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentClass(null);
        setFormData({ name: '', studentCount: '', roomId: '', department: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const payload = {
            name: formData.name,
            studentCount: formData.studentCount,
            department: formData.department,
            room: formData.roomId ? { id: formData.roomId } : null
        };

        try {
            if (currentClass) {
                await axios.put(`/api/classsections/${currentClass.id}`, payload);
                addToast('Class updated successfully', 'success');
            } else {
                await axios.post('/api/classsections', payload);
                addToast('Class added successfully', 'success');
            }
            fetchData();
            handleCloseModal();
        } catch (error) {
            console.error('Error saving class:', error);
            addToast('Failed to save class', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (cls) => {
        if (window.confirm(`Are you sure you want to delete ${cls.name}?`)) {
            try {
                await axios.delete(`/api/classsections/${cls.id}`);
                addToast('Class deleted successfully', 'success');
                fetchData();
            } catch (error) {
                console.error('Error deleting class:', error);
                addToast('Failed to delete class', 'error');
            }
        }
    };

    const columns = [
        { key: 'name', label: 'Class Name' },
        { key: 'department', label: 'Department' },
        { key: 'studentCount', label: 'Student Count' },
        {
            key: 'room',
            label: 'Assigned Room',
            render: (row) => row.room ? `${row.room.roomNumber} (${row.room.roomType})` : 'N/A'
        },
    ];

    const filteredClasses = classes.filter(cls =>
        cls.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-white">Classes</h2>
                    <p className="text-gray-400 mt-1">Manage student sections</p>
                </div>
                <GlassButton onClick={() => handleOpenModal()} className="flex items-center gap-2">
                    <Plus size={20} />
                    Add Class
                </GlassButton>
            </div>

            <GlassCard>
                <div className="mb-6 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <GlassInput
                        placeholder="Search classes..."
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
                        data={filteredClasses}
                        onEdit={handleOpenModal}
                        onDelete={handleDelete}
                    />
                )}
            </GlassCard>

            <GlassModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={currentClass ? 'Edit Class' : 'Add Class'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Class Name</label>
                        <GlassInput
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="CS-A"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Department</label>
                        <GlassInput
                            required
                            value={formData.department}
                            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                            placeholder="CSE"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Student Count</label>
                        <GlassInput
                            required
                            type="number"
                            value={formData.studentCount}
                            onChange={(e) => setFormData({ ...formData, studentCount: e.target.value })}
                            placeholder="60"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Assigned Room</label>
                        <select
                            value={formData.roomId}
                            onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all"
                        >
                            <option value="" className="bg-gray-800">Select Room</option>
                            {rooms.map(room => (
                                <option key={room.id} value={room.id} className="bg-gray-800">
                                    {room.roomNumber} (Cap: {room.capacity})
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
                            {submitting ? 'Saving...' : (currentClass ? 'Update Class' : 'Add Class')}
                        </GlassButton>
                    </div>
                </form>
            </GlassModal>
        </div>
    );
};

export default Classes;
