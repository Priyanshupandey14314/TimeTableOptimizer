import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Search } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import GlassButton from '../components/GlassButton';
import GlassInput from '../components/GlassInput';
import DataTable from '../components/DataTable';

const Rooms = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            const response = await axios.get('/api/rooms');
            setRooms(response.data);
        } catch (error) {
            console.error('Error fetching rooms:', error);
            setRooms([
                { id: 1, name: 'Room 101', capacity: 60, type: 'Lecture Hall' },
                { id: 2, name: 'Lab 202', capacity: 30, type: 'Computer Lab' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { key: 'name', label: 'Room Name' },
        { key: 'capacity', label: 'Capacity' },
        { key: 'type', label: 'Type' },
    ];

    const filteredRooms = rooms.filter(room =>
        room.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-white">Rooms</h2>
                    <p className="text-gray-400 mt-1">Manage classrooms and labs</p>
                </div>
                <GlassButton className="flex items-center gap-2">
                    <Plus size={20} />
                    Add Room
                </GlassButton>
            </div>

            <GlassCard>
                <div className="mb-6 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <GlassInput
                        placeholder="Search rooms..."
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
                        data={filteredRooms}
                        onEdit={(row) => console.log('Edit', row)}
                        onDelete={(row) => console.log('Delete', row)}
                    />
                )}
            </GlassCard>
        </div>
    );
};

export default Rooms;
