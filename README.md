# Gym Management System

A full-stack gym management application built with ASP.NET Core and React. Manage members, memberships, and check-ins from a clean, modern dashboard.

**Author:** Abdullah Manan  
**Stack:** ASP.NET Core · Entity Framework Core · SQL Server · React · Vite

---

## Features

- **Members** — Add, edit, and delete gym members
- **Memberships** — Assign membership plans (type, price, start/end dates) to members
- **Persistent storage** — All data stored in SQL Server via Entity Framework Core
- **Single-command deployment** — React frontend served directly by ASP.NET Core

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | ASP.NET Core Minimal API |
| ORM | Entity Framework Core |
| Database | SQL Server |
| Frontend | React + Vite |
| Styling | Plain CSS with CSS variables |

---

## Project Structure

```
gym-management-system/
  backend/          ASP.NET Core Minimal API
    Program.cs      All endpoints and models
    Migrations/     EF Core database migrations
    wwwroot/        Built React app (served by ASP.NET)
  frontend/         React + Vite
    src/
      App.jsx       Layout and navigation
      Members.jsx   Members page
      Memberships.jsx  Memberships page
```

---

## Getting Started

### Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [SQL Server Express](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)
- [Node.js](https://nodejs.org/)

### Setup

**1. Clone the repo**
```bash
git clone https://github.com/abdullahmanan/gym-management-system.git
cd gym-management-system
```

**2. Configure the database connection**

Open `backend/appsettings.json` and update the connection string with your SQL Server details:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=YOUR_SERVER;Database=GymDb;User Id=sa;Password=YOUR_PASSWORD;TrustServerCertificate=True"
  }
}
```

**3. Run database migrations**
```bash
cd backend
dotnet ef database update
```

**4. Build the frontend**
```bash
cd ../frontend
npm install
npm run build
```

**5. Run the app**
```bash
cd ../backend
dotnet run
```

Visit `http://localhost:5041` — the full app runs from a single command.

---

## API Endpoints

### Members
| Method | Endpoint | Description |
|---|---|---|
| GET | /members | Get all members |
| GET | /members/{id} | Get member by ID |
| POST | /members | Add a member |
| PUT | /members/{id} | Update a member |
| DELETE | /members/{id} | Delete a member |

### Memberships
| Method | Endpoint | Description |
|---|---|---|
| GET | /memberships | Get all memberships |
| POST | /memberships | Assign a membership |
| PUT | /memberships/{id} | Update a membership |
| DELETE | /memberships/{id} | Delete a membership |
| GET | /members/{id}/membership | Get a member's membership |



---

## Key Design Decisions

- **Minimal API** — chose ASP.NET Core Minimal API over MVC for cleaner, less boilerplate code
- **EF Core** — used an ORM to keep C# code readable and database-agnostic
- **DateOnly** — used C#'s `DateOnly` type for membership dates instead of `DateTime` since time component is irrelevant
- **Single-origin deployment** — React app is built into `wwwroot` and served by ASP.NET, eliminating CORS in production

---

*Built as a learning project to explore ASP.NET Core, Entity Framework Core, and full-stack development.*
