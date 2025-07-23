# 💼 FullStack Portfolio Platform — React + Flask + MongoDB

This is a complete **full-stack portfolio web app** built with **React.js (frontend)** and **Flask (backend)** connected to a **MongoDB** database.

It contains both **public-facing portfolio pages** and a fully featured **admin dashboard** to manage:
- Projects
- Skills
- Experiences
- Education
- Certificates
- Blog posts

---

## 🚀 Tech Stack

- **Frontend:** React, Tailwind CSS, Context API, Custom Hooks
- **Backend:** Flask, Flask-JWT-Extended, PyMongo
- **Database:** MongoDB
- **Auth:** JWT Token (Admin only)
- **Hosting:** GitHub Pages (frontend), Flask server (backend)

---

## 📦 Features

### 👤 Public Area:
- Dynamic Portfolio with projects, skills, experience, certificates, blog, etc.
- Detailed project and section pages
- Scroll-based animations, modern UI

### 🔐 Admin Dashboard:
- JWT-protected login
- Add / edit / delete:
  - Skills
  - Projects
  - Experience
  - Education
  - Certificates
  - Blog Posts
- File upload support
- Live analytics components

---

## 🗂 Project Structure

```bash
my-portfolio/
├── frontend/     # React App
│   ├── components/
│   ├── pages/
│   ├── contexts/
│   ├── hooks/
│   └── api/
├── backend/      # Flask App
│   ├── app.py
│   ├── config.py
│   ├── upload/     # Uploaded images/files
│   └── venv/       # Virtual environment
└── README.md
```

---

## 🛠️ Setup Instructions

### 1. Backend (Flask)

```bash
cd backend
python -m venv venv
venv\Scripts\activate         # On Windows
pip install -r requirements.txt
python app.py
```

> MongoDB connection is set inside `config.py`

---

### 2. Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

---

## 🌐 Live Demo (Optional)

[🔗 View Live Portfolio](https://YUKINE-FAYSSAL.github.io/my-portfolio)

---
