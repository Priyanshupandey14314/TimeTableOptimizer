import React from 'react';

const ConsolidatedTimetable = ({ timetable, departments }) => {
    if (!timetable || timetable.length === 0) return null;

    // 1. Group by Day
    // 2. Inside Day, Group by ClassSection
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // Extract unique sections and sort them
    const sections = [...new Set(timetable.map(t => t.classSection))].sort();

    // Helper to find entry
    const getEntry = (day, section, period) => {
        return timetable.find(t =>
            t.day.toLowerCase() === day.toLowerCase() &&
            t.classSection === section &&
            t.periodNumber === period
        );
    };

    return (
        <div className="overflow-x-auto bg-white p-4 rounded-lg shadow-lg text-black min-w-full">
            <div className="text-center font-bold border-b-2 border-black mb-4 pb-2">
                <h2 className="text-xl">DEPARTMENT OF {departments?.[0] || 'DEPARTMENT'}</h2>
                <h3 className="text-lg">CONSOLIDATED CLASS TIME TABLE</h3>
            </div>

            <table className="w-full border-collapse border border-black text-xs md:text-sm">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border border-black p-2 w-20">Day</th>
                        <th className="border border-black p-2 w-16">Sec</th>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(p => (
                            <th key={p} className="border border-black p-2">
                                {p}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {days.map(day => {
                        // Check if this day has any classes at all
                        const dayHasClasses = timetable.some(t => t.day.toLowerCase() === day.toLowerCase());
                        if (!dayHasClasses) return null;

                        return (
                            <React.Fragment key={day}>
                                {sections.map((section, index) => (
                                    <tr key={`${day}-${section}`}>
                                        {/* Render Day cell only for the first section row */}
                                        {index === 0 && (
                                            <td
                                                className="border border-black p-2 font-bold text-center bg-gray-50"
                                                rowSpan={sections.length}
                                            >
                                                {day}
                                            </td>
                                        )}
                                        <td className="border border-black p-2 font-semibold text-center">{section}</td>
                                        {[1, 2, 3, 4, 5, 6, 7, 8].map(period => {
                                            const entry = getEntry(day, section, period);
                                            return (
                                                <td key={period} className="border border-black p-1 text-center h-16 min-w-[100px]">
                                                    {entry ? (
                                                        <div className="flex flex-col justify-center h-full">
                                                            <span className="font-bold text-blue-900">{entry.subject}</span>
                                                            <span className="text-gray-700 text-xs">({entry.teacher})</span>
                                                            <span className="text-red-700 text-xs font-semibold">{entry.room}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-300">-</span>
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                                {/* Add a separator row between days if needed */}
                                <tr className="h-4 bg-gray-800 border-none"><td colSpan="10" className="border-none"></td></tr>
                            </React.Fragment>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default ConsolidatedTimetable;
