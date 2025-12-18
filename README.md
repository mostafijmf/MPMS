# 🚀 Minimal Project Management System (MPMS)

A modern **Project Management System** inspired by real-world tools like Jira / Asana.  
Built with **Next.js, Express.js, MongoDB**, and **role-based access control (RBAC)**.

This application supports **Admin, Manager, and Member** roles with a clean, scalable architecture.

---

## 🧠 Key Features

### 🔐 Authentication & Authorization

- JWT-based authentication
- Role-based access control (Admin / Manager / Member)
- Secure protected routes (Backend + Frontend)

### 📁 Project Management

- Create, view, update, delete projects (Admin/Manager)
- Members can only see projects where they have assigned tasks
- Search, filter, and pagination support

### 🏃 Sprint Management

- Sprints created inside projects
- Auto-increment sprint numbers
- Date validation (start/end)
- Read-only access for members

### ✅ Task Management

- Tasks belong to sprints & projects
- Members are assigned to tasks
- Status flow: `todo → in_progress → review → done`
- Priority, due date, and estimation support

### 📊 Dashboard

- Role-aware dashboard
- Summary statistics
- "My Tasks" overview for members
- Active projects & progress tracking

---

## 🧩 Role Capabilities

| Feature            | Admin | Manager | Member                  |
| ------------------ | ----- | ------- | ----------------------- |
| Dashboard          | ✅    | ✅      | ✅                      |
| Create Project     | ✅    | ✅      | ❌                      |
| View Projects      | ✅    | ✅      | ✅ (via assigned tasks) |
| Create Sprint      | ✅    | ✅      | ❌                      |
| Create Task        | ✅    | ✅      | ❌                      |
| Update Task Status | ❌    | ❌      | ✅                      |
| Team Management    | ✅    | ❌      | ❌                      |

---

## 🛠️ Tech Stack

### Frontend

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Zod (form validation)

### Backend

- Node.js
- Express.js
- TypeScript
- MongoDB + Mongoose
- JWT Authentication
- Cloudinary (Media Cloude)
- Multer

---

---

## 🔐 Credentials (Admin)

```bash
  Email: admin@mpms.com
  Password: 123456
```

## ⚙️ Environment Variables

### Backend (`.env`)

```bash
  PORT=5000
  DB_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/mpms
  BASE_URL=http://localhost:3000
  API_URL=http://localhost:5000

  JWT_ACCESS_TOKEN=your_access_token
  JWT_REFRESH_TOKEN=your_refresh_token

  CLOUDINARY_NAME=cloudinary_name_key
  CLOUDINARY_API_KEY=cloudinary_api_key
  CLOUDINARY_API_SECRET=cloudinary_api_secret_key
```

### Frontend (`.env.local`)

```bash
  API_URL=http://localhost:5000/api
  NEXT_PUBLIC_API_URL=http://localhost:5000/api
  NEXT_PUBLIC_BASE_URL=http://localhost:3000
```
