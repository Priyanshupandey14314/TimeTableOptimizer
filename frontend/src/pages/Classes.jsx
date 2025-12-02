import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Search } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import GlassButton from '../components/GlassButton';
import GlassInput from '../components/GlassInput';
import DataTable from '../components/DataTable';

const Classes = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            const response = await axios.get('/api/classes');
            setClasses(response.data);
        } catch (error) {
            console.error('Error fetching classes:', error);
            setClasses([
                { id: 1, name: 'CS-A', strength: 60 },
                { id: 2, name: 'CS-B', strength: 55 },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { key: 'name', label: 'Class Name' },
        { key: 'strength', label: 'Student Strength' },
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
                <GlassButton className="flex items-center gap-2">
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
                        onEdit={(row) => console.log('Edit', row)}
                        onDelete={(row) => console.log('Delete', row)}
                    />
                )}
            </GlassCard>
        </div>
    );
};

export default Classes;
