import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Search } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import GlassButton from '../components/GlassButton';
import GlassInput from '../components/GlassInput';
import DataTable from '../components/DataTable';
import GlassModal from '../components/GlassModal';
import NeonTriangleLoader from '../components/NeonTriangleLoader';
import ErrorBoundary from '../components/ErrorBoundary';
import { useToast } from '../context/ToastContext';

const Rooms = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { addToast } = useToast();

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentRoom, setCurrentRoom] = useState(null);
    const [formData, setFormData] = useState({ roomNumber: '', capacity: '', roomType: '' });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            const response = await axios.get('/api/rooms');
            setRooms(response.data);
        } catch (error) {
            console.error('Error fetching rooms:', error);
            addToast('Failed to fetch rooms', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (room = null) => {
        if (room) {
            setCurrentRoom(room);
            setFormData({
                roomNumber: room.roomNumber,
                capacity: room.capacity,
                roomType: room.roomType
            });
        } else {
            setCurrentRoom(null);
            setFormData({ roomNumber: '', capacity: '', roomType: '' });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentRoom(null);
        setFormData({ roomNumber: '', capacity: '', roomType: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (currentRoom) {
                await axios.put(`/api/rooms/${currentRoom.id}`, formData);
                addToast('Room updated successfully', 'success');
            } else {
                await axios.post('/api/rooms', formData);
                addToast('Room added successfully', 'success');
            }
            fetchRooms();
            handleCloseModal();
        } catch (error) {
            console.error('Error saving room:', error);
            addToast('Failed to save room', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (room) => {
        if (window.confirm(`Are you sure you want to delete room ${room.roomNumber}?`)) {
            try {
                await axios.delete(`/api/rooms/${room.id}`);
                addToast('Room deleted successfully', 'success');
                fetchRooms();
            } catch (error) {
                console.error('Error deleting room:', error);
                addToast('Failed to delete room', 'error');
            }
        }
    };

    const columns = [
        { key: 'roomNumber', label: 'Room Number' },
        { key: 'capacity', label: 'Capacity' },
        { key: 'roomType', label: 'Type' },
    ];

    const filteredRooms = rooms.filter(room =>
        room.roomNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-white">Rooms</h2>
                    <p className="text-gray-400 mt-1">Manage classrooms and labs</p>
                </div>
                <GlassButton onClick={() => handleOpenModal()} className="flex items-center gap-2">
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
                    <NeonTriangleLoader />
                ) : (
                    <DataTable
                        columns={columns}
                        data={filteredRooms}
                        onEdit={handleOpenModal}
                        onDelete={handleDelete}
                    />
                )}
            </GlassCard>

            <GlassModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={currentRoom ? 'Edit Room' : 'Add Room'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Room Number</label>
                        <GlassInput
                            required
                            value={formData.roomNumber}
                            onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                            placeholder="Room 101"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Capacity</label>
                        <GlassInput
                            required
                            type="number"
                            value={formData.capacity}
                            onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                            placeholder="60"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Type</label>
                        <GlassInput
                            required
                            value={formData.roomType}
                            onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
                            placeholder="Lecture Hall"
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
                            {submitting ? 'Saving...' : (currentRoom ? 'Update Room' : 'Add Room')}
                        </GlassButton>
                    </div>
                </form>
            </GlassModal>
        </div>
    );
};

export default function RoomsWithErrorBoundary() {
    return (
        <ErrorBoundary>
            <Rooms />
        </ErrorBoundary>
    );
}
