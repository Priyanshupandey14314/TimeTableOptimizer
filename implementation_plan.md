# Repair PDF Download Functionality

The "Download PDF" button is unresponsive. Investigation reveals a high probability of errors in `pdfUtils.js` due to incorrect data access handling (nested `timeSlot` properties) during sorting and potentially incorrect `jspdf` import usage in the Vite environment.

## User Review Required

> [!NOTE]
> No breaking changes. This is a bug fix for the PDF export utility.

## Proposed Changes

### Frontend

#### [MODIFY] [pdfUtils.js](file:///f:/SpringBootProjects/TTO/frontend/src/utils/pdfUtils.js)
- Update the sorting logic to correctly access `day` and `periodNumber` from either the root object or the nested `timeSlot` object, similar to how it is handled in the table data construction.
- Change `import jsPDF from 'jspdf';` to `import { jsPDF } from 'jspdf';` to ensure compatibility.

## Verification Plan

### Manual Verification
1.  **Frontend Logic Verification**: Since I cannot easily run the full stack with backend data, I will rely on code analysis.
2.  **Browser Test (Optional)**: If the backend were available, I would:
    - Open the application.
    - Go to Teacher or Student timetable.
    - Select a teacher/class to load data.
    - Click "Export PDF".
    - Verify no console errors and that the download initiates.
