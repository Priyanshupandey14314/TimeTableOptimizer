# Software Requirements Specification (SRS)
## TimeMaster: University Timetable Optimization System

### 1. Introduction
TimeMaster is an intelligent timetable management system designed to automate the complex process of scheduling classes, teachers, and rooms in educational institutions. It utilizes a Genetic Algorithm (GA) to generate optimized schedules that minimize conflicts and resource wastage.

### 2. Scope
The system covers:
- Management of Master Data (Teachers, Subjects, Rooms, Classes, Time Slots).
- Role-based access for Admins, Teachers, and Students.
- Automatic timetable generation using AI (Genetic Algorithm).
- Conflict detection and resolution.
- Exporting schedules to PDF.

### 3. Functional Requirements
#### 3.1 Authentication
- Users must log in to access the system.
- Three roles: Admin, Teacher, Student.
- Admin: Full access.
- Teacher: View own schedule, update profile.
- Student: View class schedule.

#### 3.2 Master Data Management (Admin)
- **Teachers**: Add details, assign specific subjects.
- **Subjects**: Define code, name, weekly hours, type (Theory/Lab).
- **Rooms**: Define capacity and type.
- **Classes**: Define student groups and strength.
- **Time Slots**: Define daily grid (e.g., 9-10 AM, 10-11 AM).

#### 3.3 Timetable Generation
- Algorithm: Genetic Algorithm.
- Inputs: Selected Class(es) or Department.
- Constraints:
  - Hard: No teacher in 2 places, No room double-booked, Class capacity <= Room capacity.
  - Soft: Preferred time slots, contiguous blocks.
- Output: Conflict-free weekly schedule.

#### 3.4 Reporting
- View Timetable by Class.
- View Timetable by Teacher.
- Export generic PDF reports.

### 4. Non-Functional Requirements
- **Performance**: Timetable generation should complete within reasonable time (< 2 minutes for typical load).
- **Scalability**: Support multiple departments.
- **Security**: Password encryption (BCrypt), Role-based authorization.
- **Usability**: Responsive Web UI (React + Tailwind).

### 5. Technology Stack
- **Frontend**: React, Vite, Tailwind CSS, Framer Motion, Lucide Icons.
- **Backend**: Spring Boot 3, Java 17, Spring Security (JPA Auth).
- **Database**: H2 (Dev) / MySQL (Prod).
- **PDF Generation**: jspdf (Client-side).
