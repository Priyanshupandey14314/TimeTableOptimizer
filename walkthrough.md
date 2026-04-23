# PDF Export Feature Walkthrough

## Feature
Added a button to export the generated timetable as a PDF file.

## Implementation
1.  **Library**: Used `jspdf` and `jspdf-autotable`.
2.  **Component**: Modified `frontend/src/components/ConsolidatedTimetable.jsx`.
3.  **Functionality**:
    - Generates a landscape PDF.
    - Includes Department Title.
    - Renders the timetable grid with Days, Sections, and Periods.
    - Handles cell content (Subject, Teacher, Room).

## Verification
1.  **Generate Timetable**: Create a timetable for a department.
2.  **Export**: Click the "Export PDF" button in the top right of the timetable view.
3.  **Review**: Open the downloaded PDF and verify the layout matches the screen.
