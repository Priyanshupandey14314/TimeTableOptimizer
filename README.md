🚀 Overview

Timetable Optimizer (TTO) is a smart web-based system that automatically generates clash-free and optimized timetables for educational institutions.
It helps schools, colleges, and universities save hours of manual work by using intelligent scheduling algorithms to assign teachers, subjects, and classrooms efficiently.

🏗️ Project Architecture

This project follows a React + Spring Boot architecture:

🎨 Frontend: React (for UI and user interactions)

⚙️ Backend: Spring Boot (for APIs, logic, and database interaction)

🗃️ Database: MySQL or PostgreSQL (to store timetable data)

📂 Folder Structure
tto/
│
├── frontend/                # React app
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Main app pages
│   │   ├── services/        # Axios API calls
│   │   └── App.js
│   └── package.json
│
├── backend/                 # Spring Boot app
│   ├── src/main/java/com/tto/
│   │   ├── controller/      # REST controllers
│   │   ├── service/         # Business logic
│   │   ├── model/           # Entity classes
│   │   └── repository/      # Database access
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
│
└── README.md

🧩 Features

✅ Auto-generate clash-free timetables
✅ Optimize based on teacher availability and room capacity
✅ Manage multiple departments and courses
✅ User-friendly React interface
✅ RESTful APIs with Spring Boot
✅ Cross-Origin support for React–Spring communication

⚙️ Tech Stack

Frontend: React, Axios, Tailwind/Bootstrap
Backend: Spring Boot, Java
Database: MySQL or PostgreSQL
Build Tools: Maven, npm
IDE: IntelliJ (backend) + VS Code (frontend)

🧠 How It Works

User enters class, subject, and faculty data in the frontend.

Data is sent to the Spring Boot backend through REST APIs.

The backend processes data using optimization algorithms.

A clash-free timetable is generated and returned as a response.

The frontend displays the optimized timetable in a user-friendly format.

▶️ Run the Project
Backend
cd backend
mvn spring-boot:run

Frontend
cd frontend
npm install
npm start

🔗 API Endpoints
Method	Endpoint	Description
GET	/api/test	Check if backend is running
POST	/api/optimize	Send timetable data to backend for optimization
👨‍💻 Contributors

Priyanshu Pandey – Developer & Project Lead
Rachit Agarwal - Team Member (DSA Expert)

Would you like me to now add a project description section that explains your vision and real-world use cases (for GitHub page and hackathon documentation)?
