# Smart Queue Management System

An MCA Mini Project — a simple web-based digital queue management system.

---

## Tech Stack

| Layer    | Technology                     |
|----------|--------------------------------|
| Frontend | ReactJS + Vite                 |
| Backend  | ASP.NET Core Web API (.NET 10) |
| Database | PostgreSQL                     |

---

## Folder Structure

```
mini-project-tms/
├── backend/
│   ├── Controllers/
│   │   ├── AdminController.cs
│   │   └── TokenController.cs
│   ├── Data/
│   │   └── AppDbContext.cs
│   ├── Models/
│   │   ├── Admin.cs
│   │   └── Token.cs
│   ├── Program.cs
│   ├── appsettings.json
│   └── QueueManagement.csproj
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── GenerateToken.jsx
│   │   │   ├── QueueStatus.jsx
│   │   │   ├── AdminLogin.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── database/
│   └── setup.sql
└── README.md
```

---

## Prerequisites

- **Node.js** v18 or higher — https://nodejs.org
- **.NET 10 SDK** — https://dotnet.microsoft.com/download
- **PostgreSQL** v14 or higher — https://www.postgresql.org/download

---

## Step 1 — PostgreSQL Setup

### Option A: Using pgAdmin

1. Open pgAdmin
2. Right-click "Databases" → Create → Database
3. Name it: `queue_management`
4. Open Query Tool and run the contents of `database/setup.sql`

### Option B: Using psql terminal

```bash
psql -U postgres
CREATE DATABASE queue_management;
\c queue_management
\i database/setup.sql
```

---

## Step 2 — Backend Setup

1. Open `backend/appsettings.json` and update your PostgreSQL password:

```json
"DefaultConnection": "Host=localhost;Database=queue_management;Username=postgres;Password=YOUR_PASSWORD"
```

2. Run the backend:

```bash
cd backend
dotnet restore
dotnet run
```

Backend runs at: **http://localhost:5000**

> Tables are auto-created on first run. Admin user (admin/admin123) is seeded automatically.

---

## Step 3 — Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: **http://localhost:3000**

---

## Default Admin Credentials

| Username | Password  |
|----------|-----------|
| admin    | admin123  |

---

## Pages

| Page             | URL                   | Who Uses It  |
|------------------|-----------------------|--------------|
| Home             | /                     | Everyone     |
| Get Token        | /generate             | Users        |
| Queue Status     | /status               | Users        |
| Admin Login      | /admin                | Admin        |
| Admin Dashboard  | /admin/dashboard      | Admin        |

---

## API Endpoints

| Method | Endpoint                  | Description                   |
|--------|---------------------------|-------------------------------|
| POST   | /api/token/generate       | Generate a new queue token    |
| GET    | /api/token/all            | Get all tokens                |
| GET    | /api/token/current        | Get the currently active token|
| GET    | /api/token/stats          | Get waiting/active/completed count |
| POST   | /api/token/next           | Call next waiting token       |
| PUT    | /api/token/complete/{id}  | Mark a token as completed     |
| DELETE | /api/token/reset          | Delete all tokens             |
| POST   | /api/admin/login          | Admin login                   |

---

## How It Works

1. **User** goes to **Get Token** page → enters name → gets a token number
2. **Queue Status** page shows which token is being served (auto-refreshes every 5 sec)
3. **Admin** logs in → clicks **Call Next Token** → system activates the next waiting token
4. Admin can mark any token as **Complete** or **Reset** the entire queue

---

## Token Status Flow

```
Waiting → Active → Completed
```

---

## Viva Q&A (Quick Reference)

**Q: What database did you use?**
A: PostgreSQL with Entity Framework Core (ORM) to interact from ASP.NET Core.

**Q: How does token generation work?**
A: We find the highest existing token number and add 1 to generate the next token.

**Q: How is admin authentication done?**
A: Plain username/password check against the Admins table. On success, a flag is stored in localStorage.

**Q: How does the queue status update automatically?**
A: Using `setInterval` in React's `useEffect` hook — it calls the API every 5 seconds.

**Q: What is CORS and why did you enable it?**
A: CORS allows the React frontend (port 3000) to call the .NET backend (port 5000) since they are on different ports.
