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
    const [formData, setFormData] = useState({ day: '', periodNumber: '', startTime: '', endTime: '', type: 'TEACHING', name: '' });
    const [applyToAllDays, setApplyToAllDays] = useState(false);
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
                day: slot.day === 'Mon-Sat' ? '' : slot.day, // If group, no specific day in form initially
                periodNumber: slot.periodNumber,
                startTime: slot.startTime,
                endTime: slot.endTime,
                type: slot.type || 'TEACHING',
                name: slot.name || ''
            });
            setApplyToAllDays(!!slot.isGroup); // Set checkbox if group
        } else {
            setCurrentTimeSlot(null);
            setFormData({ day: 'Monday', periodNumber: '', startTime: '', endTime: '', type: 'TEACHING', name: '' });
            setApplyToAllDays(false);
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentTimeSlot(null);
        setFormData({ day: '', periodNumber: '', startTime: '', endTime: '', type: 'TEACHING', name: '' });
        setApplyToAllDays(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const targets = applyToAllDays ? days : [formData.day];

            const promises = targets.map(async (day) => {
                const payload = { ...formData, day };

                // Check if slot exists for this day/period to decide Update vs Create
                const existing = timeSlots.find(ts =>
                    ts.day === day &&
                    ts.periodNumber == formData.periodNumber &&
                    // If editing, exclude self from "existing" check implies we want to update self. 
                    // But here we want to OVERWRITE any slot at this period on that day.
                    (currentTimeSlot ? ts.id !== currentTimeSlot.id : true)
                );

                if (currentTimeSlot && !applyToAllDays) {
                    // Normal single update
                    return axios.put(`/api/timeslots/${currentTimeSlot.id}`, payload);
                } else if (existing) {
                    // Update existing found slot (even if we are in "Add" mode, if slot exists, update it)
                    return axios.put(`/api/timeslots/${existing.id}`, payload);
                } else {
                    // Create new
                    return axios.post('/api/timeslots', payload);
                }
            });

            await Promise.all(promises);
            addToast(`Time slot(s) ${currentTimeSlot ? 'updated' : 'added'} successfully`, 'success');

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
        const message = slot.isGroup
            ? `Are you sure you want to delete this slot for ALL DAYS (Mon-Sat)?`
            : `Are you sure you want to delete this time slot?`;

        if (window.confirm(message)) {
            try {
                if (slot.isGroup) {
                    await Promise.all(slot.ids.map(id => axios.delete(`/api/timeslots/${id}`)));
                } else {
                    await axios.delete(`/api/timeslots/${slot.id}`);
                }
                addToast('Time slot(s) deleted successfully', 'success');
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
        { key: 'type', label: 'Type', render: (row) => row.type === 'TEACHING' ? 'Teaching' : (row.name || row.type) },
    ];

    // Helper to Group Time Slots
    const getGroupedSlots = () => {
        let groups = {};
        let singles = [];

        timeSlots.forEach(slot => {
            // Create a key based on attributes that define a "group"
            const key = `${slot.periodNumber}-${slot.startTime}-${slot.endTime}-${slot.type}-${slot.name}`;
            if (!groups[key]) groups[key] = [];
            groups[key].push(slot);
        });

        const result = [];
        Object.values(groups).forEach(group => {
            if (group.length === 6) { // Assuming 6 days Mon-Sat
                // Check if it covers all days exactly
                const days = group.map(g => g.day).sort();
                const allDays = ['Friday', 'Monday', 'Saturday', 'Thursday', 'Tuesday', 'Wednesday']; // Sorted alphabetically

                // Compare sorted arrays
                const isAllDays = JSON.stringify(days) === JSON.stringify(allDays);

                if (isAllDays) {
                    const first = group[0];
                    result.push({
                        ...first,
                        id: `group-${first.periodNumber}`, // Virtual ID
                        day: 'Mon-Sat',
                        isGroup: true,
                        ids: group.map(g => g.id)
                    });
                } else {
                    result.push(...group);
                }
            } else {
                result.push(...group);
            }
        });

        // Sort by Day then Period (approximately)
        // Groups (Mon-Sat) can float to top or sort by Period
        return result.sort((a, b) => {
            if (a.day === 'Mon-Sat' && b.day !== 'Mon-Sat') return -1;
            if (a.day !== 'Mon-Sat' && b.day === 'Mon-Sat') return 1;
            return a.periodNumber - b.periodNumber;
        });
    };

    const groupedTimeSlots = getGroupedSlots().filter(slot =>
        slot.day.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (slot.day === 'Mon-Sat' && 'mon-sat'.includes(searchTerm.toLowerCase()))
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
                        data={groupedTimeSlots}
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
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            {applyToAllDays ? 'Day (Auto: Mon-Sat)' : 'Day'}
                        </label>
                        <select
                            required={!applyToAllDays}
                            disabled={applyToAllDays}
                            value={applyToAllDays ? '' : formData.day}
                            onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                            className={`w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all ${applyToAllDays ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                    {formData.type === 'TEACHING' && (
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
                    )}
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

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Type</label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all"
                            >
                                <option value="TEACHING" className="bg-gray-800">Teaching Class</option>
                                <option value="LUNCH" className="bg-gray-800">Lunch Break</option>
                                <option value="BREAK" className="bg-gray-800">Short Break</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Name (Optional)</label>
                            <GlassInput
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g. Lunch"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 mt-4">
                        <input
                            type="checkbox"
                            id="applyAll"
                            checked={applyToAllDays}
                            onChange={(e) => setApplyToAllDays(e.target.checked)}
                            className="w-4 h-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                        />
                        <label htmlFor="applyAll" className="text-sm text-gray-300">
                            Apply to all working days (Mon-Sat)
                        </label>
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
        </div >
    );
};

export default TimeSlots;
