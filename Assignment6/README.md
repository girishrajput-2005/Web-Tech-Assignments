# VIT Semester Result Portal

A full-stack semester result project using:

- React + Vite
- Spring Boot
- Spring Security + JWT authentication
- MySQL + JPA/Hibernate
- Responsive CSS

## Features

1. Student registration
2. JWT login authentication
3. BCrypt password hashing
4. Student dashboard
5. Four subjects
6. MSE out of 30 + ESE out of 70
7. Automatic total, percentage and grade
8. Admin-only result preparation panel
9. Admin can add and delete results
10. Print / Save as PDF from browser
11. Responsive design

## Demo accounts

Admin:
- username: admin
- password: admin123

Student:
- username: student
- password: student123

## Run backend

1. Create MySQL database:
   CREATE DATABASE vit_result_db;

2. Open:
   backend/src/main/resources/application.properties

3. Replace:
   spring.datasource.password=YOUR_MYSQL_PASSWORD

4. From backend:
   mvn clean spring-boot:run

Backend:
http://localhost:8080

## Run frontend

From frontend:
npm install
npm run dev

Frontend:
http://localhost:5173

## Result calculation

MSE is entered out of 30 and ESE out of 70.

Final marks = MSE + ESE

Example:
MSE = 24
ESE = 61
Final = 85 / 100

Grade:
90+ O
80-89 A+
70-79 A
60-69 B+
50-59 B
40-49 C
Below 40 F

## API

POST /api/auth/register
POST /api/auth/login

GET /api/results/me
GET /api/results                 (ADMIN)
POST /api/results                (ADMIN)
PUT /api/results/{id}            (ADMIN)
DELETE /api/results/{id}         (ADMIN)
