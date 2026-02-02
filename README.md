# Task Manager App

A full-stack Task Manager application built with **Node.js, Express, MongoDB, and vanilla JavaScript**.  
It supports user authentication, task management, and a clean modal-based UI.

---

## 🚀 Features

- User Sign Up & Sign In (JWT Authentication)
- Create, view, and manage tasks
- Task status tracking (Pending / In Progress / Completed)
- Secure backend with protected routes
- Clean UI with modals (Auth, Logout, Login Required)
- Click-outside-to-close modal support
- Dark mode support

---

## 🛠 Tech Stack

### Frontend
- HTML
- CSS
- JavaScript (Vanilla)

### Backend
- Node.js
- Express.js
- MongoDB (Atlas)
- JWT Authentication

---

## 📁 Project Structure

```txt
Task_Manager/
│
├── frontend/
│   ├── index.html
│   │
│   ├── css/
│   │   └── style.css
│   │
│   └── js/
│       └── app.js
│
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── package-lock.json
│   │
│   ├── routes/
│   │   ├── auth.js
│   │   └── tasks.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   └── Task.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   └── .env   (ignored by git)
│
├── .gitignore
└── README.md
```

---

## ⚙️ Setup Instructions

### Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/Task_Manager.git
cd Task_Manager
cd backend
npm install
node server.js
```
---



