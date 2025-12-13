import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Search } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import GlassButton from '../components/GlassButton';
import GlassInput from '../components/GlassInput';
import DataTable from '../components/DataTable';
import GlassModal from '../components/GlassModal';
import { useToast } from '../context/ToastContext';

const TimeSlots = () => {
    const [timeSlots, setTimeSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { addToast } = useToast();

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTimeSlot, setCurrentTimeSlot] = useState(null);
    const [formData, setFormData] = useState({ day: '', periodNumber: '', startTime: '', endTime: '' });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchTimeSlots();
    }, []);

    const fetchTimeSlots = async () => {
        try {
            const response = await axios.get('/api/timeslots');
            setTimeSlots(response.data);
        } catch (error) {
            console.error('Error fetching time slots:', error);
            addToast('Failed to fetch time slots', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (slot = null) => {
        if (slot) {
            setCurrentTimeSlot(slot);
            setFormData({
                day: slot.day,
                periodNumber: slot.periodNumber,
                startTime: slot.startTime,
                endTime: slot.endTime
            });
        } else {
            setCurrentTimeSlot(null);
            setFormData({ day: '', periodNumber: '', startTime: '', endTime: '' });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentTimeSlot(null);
        setFormData({ day: '', periodNumber: '', startTime: '', endTime: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (currentTimeSlot) {
                await axios.put(`/api/timeslots/${currentTimeSlot.id}`, formData);
                addToast('Time slot updated successfully', 'success');
            } else {
                await axios.post('/api/timeslots', formData);
                addToast('Time slot added successfully', 'success');
            }
            fetchTimeSlots();
            handleCloseModal();
        } catch (error) {
            console.error('Error saving time slot:', error);
            addToast('Failed to save time slot', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (slot) => {
        if (window.confirm(`Are you sure you want to delete this time slot?`)) {
            try {
                await axios.delete(`/api/timeslots/${slot.id}`);
                addToast('Time slot deleted successfully', 'success');
                fetchTimeSlots();
            } catch (error) {
                console.error('Error deleting time slot:', error);
                addToast('Failed to delete time slot', 'error');
            }
        }
    };

    const columns = [
        { key: 'day', label: 'Day' },
        { key: 'periodNumber', label: 'Period' },
        { key: 'startTime', label: 'Start Time' },
        { key: 'endTime', label: 'End Time' },
    ];

    const filteredTimeSlots = timeSlots.filter(slot =>
        slot.day.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-white">Time Slots</h2>
                    <p className="text-gray-400 mt-1">Manage schedule timings</p>
                </div>
                <GlassButton onClick={() => handleOpenModal()} className="flex items-center gap-2">
                    <Plus size={20} />
                    Add Time Slot
                </GlassButton>
            </div>

            <GlassCard>
                <div className="mb-6 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <GlassInput
                        placeholder="Search days..."
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
                        data={filteredTimeSlots}
                        onEdit={handleOpenModal}
                        onDelete={handleDelete}
                    />
                )}
            </GlassCard>

            <GlassModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={currentTimeSlot ? 'Edit Time Slot' : 'Add Time Slot'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Day</label>
                        <select
                            required
                            value={formData.day}
                            onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all"
                        >
                            <option value="" className="bg-gray-800">Select Day</option>
                            <option value="Monday" className="bg-gray-800">Monday</option>
                            <option value="Tuesday" className="bg-gray-800">Tuesday</option>
                            <option value="Wednesday" className="bg-gray-800">Wednesday</option>
                            <option value="Thursday" className="bg-gray-800">Thursday</option>
                            <option value="Friday" className="bg-gray-800">Friday</option>
                            <option value="Saturday" className="bg-gray-800">Saturday</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Period Number</label>
                        <GlassInput
                            required
                            type="number"
                            value={formData.periodNumber}
                            onChange={(e) => setFormData({ ...formData, periodNumber: e.target.value })}
                            placeholder="1"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Start Time</label>
                            <GlassInput
                                required
                                type="time"
                                value={formData.startTime}
                                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">End Time</label>
                            <GlassInput
                                required
                                type="time"
                                value={formData.endTime}
                                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                            />
                        </div>
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
                            {submitting ? 'Saving...' : (currentTimeSlot ? 'Update Time Slot' : 'Add Time Slot')}
                        </GlassButton>
                    </div>
                </form>
            </GlassModal>
        </div>
    );
};

export default TimeSlots;
