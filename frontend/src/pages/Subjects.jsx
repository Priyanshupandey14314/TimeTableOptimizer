import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Search } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import GlassButton from '../components/GlassButton';
import GlassInput from '../components/GlassInput';
import DataTable from '../components/DataTable';

const Subjects = () => {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchSubjects();
    }, []);

    const fetchSubjects = async () => {
        try {
            const response = await axios.get('/api/subjects');
            setSubjects(response.data);
        } catch (error) {
            console.error('Error fetching subjects:', error);
            // Mock data
            setSubjects([
                { id: 1, name: 'Data Structures', code: 'CS101', credits: 4 },
                { id: 2, name: 'Algorithms', code: 'CS102', credits: 3 },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { key: 'code', label: 'Code' },
        { key: 'name', label: 'Name' },
        { key: 'credits', label: 'Credits' },
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
                    <p className="text-gray-400 mt-1">Manage course subjects</p>
                </div>
                <GlassButton className="flex items-center gap-2">
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
                    <div className="text-center py-8 text-gray-400">Loading...</div>
                ) : (
                    <DataTable
                        columns={columns}
                        data={filteredSubjects}
                        onEdit={(row) => console.log('Edit', row)}
                        onDelete={(row) => console.log('Delete', row)}
                    />
                )}
            </GlassCard>
        </div>
    );
};

export default Subjects;
