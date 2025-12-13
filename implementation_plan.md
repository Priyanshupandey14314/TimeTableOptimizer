# Implementation Plan - Final Polish & "100% Working" Verification

## Goal Description
We are entering the final phase to ensure the Time Table Optimizer is "100% working". This involves polishing the UI consistency (Neon Loader) and, critically, verifying the end-to-end generation flow with a rigorous integration test.

## User Review Required
> [!NOTE]
> I will be adding a new `IntegrationTest` to verify the full generation pipeline without needing manual UI clicking. This ensures the Core Algorithm connects correctly to the API.

## Proposed Changes

### Frontend Polish
#### [MODIFY] [GenerateTimetable.jsx](file:///f:/SpringBootProjects/TTO/frontend/src/pages/GenerateTimetable.jsx)
- **Change**: Replace the default spinner with the `NeonTriangleLoader` component.
- **Reason**: To maintain consistent "Neon" aesthetics across the application.

### Backend Verification
#### [NEW] [TimetableIntegrationTest.java](file:///f:/SpringBootProjects/TTO/timetableoptimizer/src/test/java/com/timemaster/timetableoptimizer/integration/TimetableIntegrationTest.java)
- **New Test**: A Spring Boot Integration Test that:
    1.  Creates Reference Data (Teacher, Room, Subject, Class).
    2.  Calls the `POST /api/timetable/generate` endpoint.
    3.  Verifies the response contains a valid timetable (fitness > 0, non-empty list).

## Verification Plan

### Automated Tests
- **Run All Tests**: `mvn test`
    - This will run the new `TimetableIntegrationTest` and all existing unit tests.
- **Success Criteria**: All tests pass, specifically confirming the Genetic Algorithm produces a valid result via the API.

### Manual Verification (User)
1.  **Start Application**: Run backend and frontend.
2.  **Navigate to Generate**: Go to `/generate`.
3.  **Select Data**: Pick a Class, Teachers, and Subjects.
4.  **Click Generate**:
    -   **Observe**: The `NeonTriangleLoader` should appear.
    -   **Result**: A table of classes should appear after a few seconds.
