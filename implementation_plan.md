# Implementation Plan - Frontend-Backend Connection

## Goal Description
Establish a working connection between the React frontend and Spring Boot backend.
Currently, the frontend tries to fetch from `/api/hello`, but the endpoint is missing and CORS/Proxy is not configured.

## Proposed Changes

### Backend
#### [NEW] [HelloController.java](file:///f:/SpringBootProjects/TTO/timetableoptimizer/src/main/java/com/timemaster/timetableoptimizer/controller/HelloController.java)
- Create a simple controller with `@GetMapping("/api/hello")` returning a welcome message.

### Frontend
#### [MODIFY] [vite.config.js](file:///f:/SpringBootProjects/TTO/frontend/vite.config.js)
- Add `server.proxy` configuration to forward `/api` requests to `http://localhost:8080`.

#### [MODIFY] [App.jsx](file:///f:/SpringBootProjects/TTO/frontend/src/App.jsx)
- Uncomment the display logic to show the message from the backend.
- Ensure the API call uses the relative path `/api/hello` (or relies on proxy).

## Verification Plan

### Automated Tests
- Run `mvn clean package` to ensure backend compiles.
- Run `npm run dev` (user action) and check the browser.

### Manual Verification
- Start Backend (`mvn spring-boot:run`).
- Start Frontend (`npm run dev`).
- Open App in browser.
- Verify "Message from backend: ..." is displayed.
