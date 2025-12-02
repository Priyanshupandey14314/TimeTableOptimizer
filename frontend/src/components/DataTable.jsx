import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import GlassButton from './GlassButton';

const DataTable = ({ columns, data, onEdit, onDelete, actions = true }) => {
    return (
        <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-left text-sm text-gray-300">
                <thead className="bg-white/5 text-xs uppercase text-gray-100">
                    <tr>
                        {columns.map((col) => (
                            <th key={col.key} className="px-6 py-4 font-semibold tracking-wider">
                                {col.label}
                            </th>
                        ))}
                        {actions && <th className="px-6 py-4 text-right">Actions</th>}
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {data.length === 0 ? (
                        <tr>
                            <td
                                colSpan={columns.length + (actions ? 1 : 0)}
                                className="px-6 py-8 text-center text-gray-500"
                            >
                                No data available
                            </td>
                        </tr>
                    ) : (
                        data.map((row, rowIndex) => (
                            <tr key={rowIndex} className="hover:bg-white/5 transition-colors">
                                {columns.map((col) => (
                                    <td key={`${rowIndex}-${col.key}`} className="px-6 py-4 whitespace-nowrap">
                                        {row[col.key]}
                                    </td>
                                ))}
                                {actions && (
                                    <td className="px-6 py-4 text-right whitespace-nowrap">
                                        <div className="flex justify-end space-x-2">
                                            {onEdit && (
                                                <button
                                                    onClick={() => onEdit(row)}
                                                    className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 rounded-lg transition-colors"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                            )}
                                            {onDelete && (
                                                <button
                                                    onClick={() => onDelete(row)}
                                                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default DataTable;
