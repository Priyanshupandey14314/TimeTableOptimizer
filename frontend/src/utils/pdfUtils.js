import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportTimetableToPDF = (timetableData, title = 'Timetable', refTimeSlots = []) => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text(title, 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);

    // Add date
    const date = new Date().toLocaleDateString();
    doc.text(`Generated on: ${date}`, 14, 30);

    // Prepare table columns and data
    const tableColumn = ["Day", "Period", "Time", "Subject", "Teacher", "Room", "Class"];
    const tableRows = [];

    // Inject Breaks
    let workingData = [...timetableData];
    if (refTimeSlots && refTimeSlots.length > 0) {
        const uniqueDays = [...new Set(timetableData.map(t => t.timeSlot?.day || t.day))];
        uniqueDays.forEach(day => {
            const daySlots = refTimeSlots.filter(s => s.day === day && s.type !== 'TEACHING');
            daySlots.forEach(slot => {
                workingData.push({
                    isBreak: true,
                    day: day,
                    periodNumber: slot.periodNumber,
                    startTime: slot.startTime,
                    endTime: slot.endTime,
                    subject: slot.name || slot.type,
                    teacher: '-',
                    room: '-',
                    classSection: '-'
                });
            });
        });
    }

    // Sort by Day and Period
    const sortedData = [...workingData].sort((a, b) => {
        const days = { "Monday": 1, "Tuesday": 2, "Wednesday": 3, "Thursday": 4, "Friday": 5, "Saturday": 6 };

        const dayA = a.timeSlot?.day || a.day;
        const dayB = b.timeSlot?.day || b.day;
        const periodA = a.timeSlot?.periodNumber || a.periodNumber;
        const periodB = b.timeSlot?.periodNumber || b.periodNumber;

        if (days[dayA] !== days[dayB]) return days[dayA] - days[dayB];
        return periodA - periodB;
    });

    sortedData.forEach(entry => {
        // If it's a break, styling will be applied by autoTable hooks or just content
        // For simple list, just show the Subject as "Lunch"

        const rowData = [
            entry.timeSlot?.day || entry.day,
            entry.timeSlot?.periodNumber || entry.periodNumber,
            `${entry.timeSlot?.startTime || entry.startTime} - ${entry.timeSlot?.endTime || entry.endTime}`,
            entry.subject?.name || entry.subject, // Break subject is string "Lunch"
            entry.teacher?.name || entry.teacher,
            entry.room?.roomNumber || entry.room,
            entry.classSection?.name || entry.classSection
        ];
        tableRows.push(rowData);
    });

    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 35,
        theme: 'grid',
        styles: {
            fontSize: 10,
            cellPadding: 3,
            overflow: 'linebreak',
            lineColor: [0, 0, 0],
            lineWidth: 0.1
        },
        headStyles: {
            fillColor: [204, 0, 0], // Red
            textColor: 255,
            fontStyle: 'bold',
            lineColor: [0, 0, 0],
            lineWidth: 0.1
        },
        alternateRowStyles: {
            fillColor: [245, 247, 250]
        },
        didParseCell: (data) => {
            if (data.section === 'body') {
                const subject = data.row.raw[3]; // Subject column
                if (subject === 'LUNCH' || subject === 'BREAK' || subject === 'Lunch Break') {
                    data.cell.styles.fillColor = [255, 243, 205]; // Yellowish for break
                    data.cell.styles.fontStyle = 'bold';
                    data.cell.styles.halign = 'center';
                }
            }
        }
    });

    doc.save(`${title.replace(/\s+/g, '_').toLowerCase()}_timetable.pdf`);
};
