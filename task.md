# University Timetable Optimization System – Task Breakdown

This document lists **all tasks** required to build a complete university-level timetable optimization system. It is designed to be used directly with AI agents (e.g., Google Antigravity) for step-by-step execution.

---

## PHASE 0 – Project Foundation

### 0.1 Problem Definition

* [x] Define the problem of manual timetable creation
* [x] Identify conflicts (teacher, room, subject, workload)
* [x] Define optimization goals

### 0.2 Project Scope

* [x] University → Department → Class hierarchy
* [x] Multi-role system (Admin, Coordinator, Teacher, Student)
* [x] AI-based optimization using Genetic Algorithm

---

## PHASE 1 – UI / FRONTEND TASKS

### 1.1 Authentication UI

* [x] Login screen
* [x] Role-based redirection
* [x] Session handling

### 1.2 Dashboard UI

* [x] Admin dashboard
* [x] Department dashboard
* [x] Teacher dashboard
* [x] Student timetable view

### 1.3 Master Data Management Screens

#### Teachers

* [x] Add/Edit/Delete teacher
* [x] Assign subjects
* [x] Define preferences

#### Subjects

* [x] Subject code
* [x] Weekly hours
* [x] Type (theory/lab)

#### Classes

* [x] Course, year, section
* [x] Student strength

#### Rooms

* [x] Capacity
* [x] Type (lab/classroom)

#### Time Slots

* [x] Day-wise slot definition

---

## PHASE 2 – BACKEND CORE TASKS

### 2.1 Authentication & Authorization

* [x] Role-based access control
* [x] Secure APIs

### 2.2 CRUD APIs

* [x] Teacher APIs
* [x] Subject APIs
* [x] Class APIs
* [x] Room APIs
* [x] Time slot APIs

### 2.3 Timetable Engine API

* [x] Input constraint collection
* [x] GA execution trigger
* [x] Save optimized timetable

---

## PHASE 3 – DATABASE TASKS

### 3.1 Schema Design

* [x] University table
* [x] Department table
* [x] Teacher table
* [x] Subject table
* [x] Class table
* [x] Room table
* [x] TimeSlot table
* [x] Timetable table

### 3.2 Relationships

* [x] Department ↔ Teachers
* [x] Class ↔ Subjects
* [x] Timetable ↔ All entities

---

## PHASE 4 – GENETIC ALGORITHM TASKS

### 4.1 Chromosome Design

* [x] Define gene structure
* [x] Encode timetable as chromosome

### 4.2 Fitness Function

* [x] Hard constraints (conflicts)
* [x] Soft constraints (preferences)
* [x] Fitness scoring

### 4.3 GA Operations

* [x] Population initialization
* [x] Selection strategy
* [x] Crossover implementation
* [x] Mutation logic

### 4.4 Termination Criteria

* [x] Max generations
* [x] Fitness threshold

---

## PHASE 5 – OUTPUT & REPORTING

* [x] Class-wise timetable
* [x] Teacher-wise timetable
* [x] Conflict report
* [x] Fitness score display
* [x] PDF export

---

## PHASE 6 – TESTING & VALIDATION

* Unit testing
* Constraint validation
* Stress testing

---

## PHASE 7 – DOCUMENTATION TASKS

* SRS document
* System architecture diagram
* ER diagram
* Algorithm explanation
* Results analysis
* Future scope

---

## FINAL DELIVERABLES

* Working system
* Source code
* Project report
* Demo video

---

END OF TASK FILE
