import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Search } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import GlassButton from '../components/GlassButton';
import GlassInput from '../components/GlassInput';
import DataTable from '../components/DataTable';

const TimeSlots = () => {
    const [timeSlots, setTimeSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchTimeSlots();
    }, []);

    const fetchTimeSlots = async () => {
        try {
            const response = await axios.get('/api/timeslots');
            setTimeSlots(response.data);
        } catch (error) {
            console.error('Error fetching time slots:', error);
            setTimeSlots([
                { id: 1, day: 'Monday', startTime: '09:00', endTime: '10:00', periodNumber: 1 },
                { id: 2, day: 'Monday', startTime: '10:00', endTime: '11:00', periodNumber: 2 },
            ]);
        } finally {
            setLoading(false);
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
                <GlassButton className="flex items-center gap-2">
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
                        onEdit={(row) => console.log('Edit', row)}
                        onDelete={(row) => console.log('Delete', row)}
                    />
                )}
            </GlassCard>
        </div>
    );
};

export default TimeSlots;
