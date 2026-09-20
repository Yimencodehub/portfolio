# Portfolio Full-Stack App

**Frontend**: Vue 3 + Tailwind CSS  
**Backend**: Express.js + PostgreSQL  
**REST API**: Go Gin + MySQL

---

## Quick Start

### 1. Frontend
```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

### 2. Backend (Express + PostgreSQL)
```bash
cd backend
npm install
# Edit .env with your PostgreSQL credentials
npm run dev
# → http://localhost:3000
```

### 3. Go API (Gin + MySQL)
```bash
cd go-api
# Edit .env with your MySQL credentials
go mod tidy
go run main.go
# → http://localhost:8080
```

---

## Environment Files

### backend/.env
```
PG_HOST=localhost
PG_PORT=5432
PG_USER=postgres
PG_PASSWORD=YOUR_PASSWORD
PG_DATABASE=portfolio_db
PORT=3000
```

### go-api/.env
```
MYSQL_DSN=root:YOUR_PASSWORD@tcp(localhost:3306)/portfolio_go?parseTime=true
GO_PORT=8080
```

---

## API Reference

### Express (Port 3000)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/contact | Submit contact form |
| GET | /api/files | List uploaded files |
| POST | /api/files/upload | Upload files |
| GET | /api/files/download/:id | Download file |
| GET | /api/stats | Get likes/views/rating |
| POST | /api/stats/like | Like the portfolio |
| POST | /api/stats/dislike | Dislike |
| POST | /api/stats/view | Record page view |
| POST | /api/stats/rating | Submit star rating |

### Gin (Port 8080)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/projects | List all projects |
| POST | /api/projects | Add new project |
| DELETE | /api/projects/:id | Delete project |
| GET | /api/analytics | Get analytics summary |

---

## Dark / Light Mode
Click the ☀️/🌙 button in the top navbar. Preference is saved to localStorage and applied instantly.
