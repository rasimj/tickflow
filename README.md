# tickflow
TicketFlow Application

# TicketFlow — Helpdesk & Ticket Tracking System

A full-stack support ticket system with role-based access control (Customer/Agent/Admin), JWT authentication, and an admin approval workflow for agents.

## Tech Stack
- Backend: Java 21, Spring Boot 4, Spring Security, Spring Data JPA, MySQL
- Frontend: HTML/CSS/JavaScript (vanilla), served as static resources
- Auth: JWT, BCrypt password hashing

## Features
- Role-based dashboards (Customer / Agent / Admin)
- Ticket lifecycle: Open → In Progress → Resolved → Closed (enforced server-side)
- Agent registration requires admin approval before login
- Comment threads per ticket
- Password strength validation (client + server)

## Run locally
1. Create MySQL database `ticketflow_db`
2. Set env vars: `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET`
3. `mvn spring-boot:run`
4. Open `http://localhost:8080`

## API Endpoints
| Method | Endpoint | Access |
|---|---|---|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |
| GET/POST | /api/tickets | Authenticated |
| PATCH | /api/tickets/{id}/status | Agent/Admin |
| DELETE | /api/tickets/{id} | Admin |
| GET | /api/admin/agents/pending | Admin |
| PATCH | /api/admin/agents/{id}/approve | Admin |

## Live Demo
[link here after Step 5]

## Future Improvements
- Email notifications on status change
- File attachments on tickets
- React frontend
