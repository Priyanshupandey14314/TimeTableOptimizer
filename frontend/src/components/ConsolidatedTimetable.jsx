import React from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const ConsolidatedTimetable = ({ timetable, departments, timeSlots = [] }) => {
    if (!timetable || timetable.length === 0) return null;

    // 1. Group by Day
    // 2. Inside Day, Group by ClassSection
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // Extract unique sections and sort them
    // Handle both string and object classSection
    const sections = [...new Set(timetable.map(t => t.classSection?.name || t.classSection))].sort();

    // Helper to find entry
    const getEntry = (day, section, period) => {
        // Check for break
        if (timeSlots.length > 0) {
            const breakSlot = timeSlots.find(ts => ts.day.toLowerCase() === day.toLowerCase() && ts.periodNumber === period && ts.type !== 'TEACHING');
            if (breakSlot) {
                return { isBreak: true, subject: breakSlot.name || breakSlot.type };
            }
        }

        return timetable.find(t => {
            const tDay = t.timeSlot?.day || t.day;
            const tSection = t.classSection?.name || t.classSection;
            const tPeriod = t.timeSlot?.periodNumber || t.periodNumber;

            return tDay?.toLowerCase() === day.toLowerCase() &&
                tSection === section &&
                tPeriod === period;
        });
    };

    const exportToPDF = () => {
        const doc = new jsPDF('landscape');
        const deptName = departments?.[0] || 'DEPARTMENT';

        // Title
        doc.setFontSize(18);
        doc.setTextColor(40, 40, 40);
        doc.text(`DEPARTMENT OF ${deptName}`, 14, 15);
        doc.setFontSize(14);
        doc.text('CONSOLIDATED CLASS TIME TABLE', 14, 22);

        // Prep data for autoTable
        // We want a structure like the HTML table: Day | Sec | 1 | 2 | ...

        let tableBody = [];

        days.forEach(day => {
            const dayHasClasses = timetable.some(t => {
                const tDay = t.timeSlot?.day || t.day;
                return tDay?.toLowerCase() === day.toLowerCase();
            });
            if (!dayHasClasses) return;

            sections.forEach((section, index) => {
                let row = [];
                // Day column (only for first section of the day to mimic rowspan, or just repeat it)
                if (index === 0) {
                    row.push({ content: day, rowSpan: sections.length, styles: { valign: 'middle', fontStyle: 'bold' } });
                }

                row.push(section);

                [1, 2, 3, 4, 5, 6, 7, 8].forEach(period => {
                    const entry = getEntry(day, section, period);
                    if (entry) {
                        // Cell content
                        if (entry.isBreak) {
                            row.push(entry.subject);
                        } else {
                            const subjectName = entry.subject?.name || entry.subject || '';
                            const teacherName = entry.teacher?.name || entry.teacher || '';
                            const roomName = entry.room?.roomNumber || entry.room || '';

                            const text = `${subjectName}\n(${teacherName})\n[${roomName}]`;
                            row.push(text);
                        }
                    } else {
                        row.push("-");
                    }
                });
                tableBody.push(row);
            });
        });

        autoTable(doc, {
            startY: 28,
            head: [['Day', 'Sec', '1', '2', '3', '4', '5', '6', '7', '8']],
            body: tableBody,
            theme: 'grid',
            headStyles: { fillColor: [204, 0, 0], textColor: 255, halign: 'center', lineColor: [0, 0, 0], lineWidth: 0.1 },
            styles: { fontSize: 8, cellPadding: 2, overflow: 'linebreak', halign: 'center', valign: 'middle', lineColor: [0, 0, 0], lineWidth: 0.1 },
            columnStyles: {
                0: { cellWidth: 20 }, // Day
                1: { cellWidth: 15 }, // Sec
                // Periods auto
            },
            didParseCell: (data) => {
                if (data.section === 'body') {
                    // Start checking from index 2 (after Day and Sec)
                    // But data.column.index gives the index.
                    // Cell content is in data.cell.raw
                    const content = data.cell.raw;
                    if (content === 'LUNCH' || content === 'BREAK' || content === 'Lunch Break') {
                        data.cell.styles.fillColor = [255, 243, 205]; // Yellowish
                        data.cell.styles.fontStyle = 'bold';
                        data.cell.styles.halign = 'center';
                        data.cell.styles.valign = 'middle';
                    }
                }
            }
        });

        doc.save(`${deptName}_Timetable.pdf`);
    };

    return (
        <div className="overflow-x-auto bg-white p-4 rounded-lg shadow-lg text-black min-w-full">
            <div className="flex justify-between items-center mb-4 border-b-2 border-black pb-2">
                <div className="text-center flex-grow">
                    <h2 className="text-xl font-bold">DEPARTMENT OF {departments?.[0] || 'DEPARTMENT'}</h2>
                    <h3 className="text-lg font-bold">CONSOLIDATED CLASS TIME TABLE</h3>
                </div>
                <button
                    onClick={exportToPDF}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded shadow-md transition-colors"
                >
                    Export PDF
                </button>
            </div>

            <table className="w-full border-collapse border border-black text-xs md:text-sm">
                <thead>
                    <tr className="bg-red-600 text-white">
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
                        const dayHasClasses = timetable.some(t => t.day?.toLowerCase() === day.toLowerCase());
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
                                                <td key={period} className={`border border-black p-1 text-center h-16 min-w-[100px] ${entry?.isBreak ? 'bg-yellow-100' : ''}`}>
                                                    {entry ? (
                                                        entry.isBreak ? (
                                                            <span className="font-bold text-gray-600">{entry.subject}</span>
                                                        ) : (
                                                            <div className="flex flex-col justify-center h-full">
                                                                <span className="font-bold text-blue-900">{entry.subject}</span>
                                                                <span className="text-gray-700 text-xs">({entry.teacher})</span>
                                                                <span className="text-red-700 text-xs font-semibold">{entry.room}</span>
                                                            </div>
                                                        )
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
