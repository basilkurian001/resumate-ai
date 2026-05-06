# 🚀 Resumate AI — Intelligent Resume Analysis Platform

[Go directly to Installation Guide](#-installation-guide)

---

# Table of Contents

- [Features](#-features)
- [System Architecture](#️-system-architecture)
- [Tech Stack](#️-tech-stack)
- [Resume Parsing Engine](#-resume-parsing-engine)
- [Supported File Types](#️-supported-file-types)
- [Privacy-Focused Design](#-privacy-focused-design)
- [Real-Time Job Processing](#-real-time-job-processing)
- [Results Dashboard](#-results-dashboard)
- [Issue Reporting System](#-issue-reporting-system)
- [REST API Endpoints](#-rest-api-endpoints)
- [Installation Guide](#-installation-guide)
- [Linux Setup](#-linux-setup)
- [Windows Setup](#-windows-setup)
- [Production Deployment](#-production-deployment-nginx)
- [HTTPS Setup](#-https-setup-certbot)
- [Rate Limiting](#-rate-limiting-nginx)
- [Backend Process Management](#️-backend-process-management-pm2)
- [Error Logging](#-error-logging)
- [Future Improvements](#-future-improvements)
- [License](#-license)

---

# ✨ Features

* 📄 Multi-layer Resume Parsing Pipeline
* 🔍 OCR Support for Scanned Resumes
* 🤖 AI-Powered Resume Analysis
* ⚡ Real-Time Job Processing & Progress Tracking
* 📊 ATS Score & Skill Insights Dashboard
* 🌐 React Frontend + Node.js Backend
* 🔐 HTTPS & Rate Limiting using NGINX
* 🐧 Cross-Platform Support (Windows + Linux)
* 📧 Integrated Issue Reporting System
* 🧠 Automatic Tesseract Model Download
* 📦 Production Deployment Ready (PM2 + EC2)

---

# 🏗️ System Architecture

```text
Frontend (React)
        ↓
NGINX Reverse Proxy
        ↓
Backend (Node.js + Express)
        ↓
Resume Parsing Engine
        ↓
AI Analysis Service
```

---

# 🛠️ Tech Stack

## Frontend

* React
* React Router
* Tailwind CSS

## Backend

* Node.js
* Express

## Parsing & OCR

* pdfjs-dist
* pdf-text-extract
* mammoth
* Tesseract OCR
* pdf-poppler (Windows)
* pdftoppm / Poppler (Linux)

## AI Integration

* OpenAI Package
* NVIDIA API

## DevOps & Deployment

* NGINX
* PM2
* AWS EC2
* Certbot (SSL)

---

# 📄 Resume Parsing Engine

The backend implements a multi-layer parsing strategy to maximize parsing reliability across different resume formats.

## Parsing Flow

```text
PDF Upload
   ↓
pdfjs (fast extraction)
   ↓ fallback
pdf-text-extract (pdftotext)
   ↓ fallback
OCR (Tesseract)
   ↓
Text Cleaning
   ↓
AI Analysis
```

---

# ⚙️ Supported File Types

| Format         | Parsing Method   |
| -------------- | ---------------- |
| PDF (standard) | pdfjs            |
| PDF (complex)  | pdf-text-extract |
| PDF (scanned)  | OCR              |
| DOCX           | mammoth          |

---

# 🔐 Privacy-Focused Design

* Files are processed entirely in memory
* No permanent resume storage
* Temporary files deleted automatically
* Uploads handled using multer memory storage

---

# ⚡ Real-Time Job Processing

The application uses an asynchronous job-based architecture.

## Workflow

```text
uploading → parsing → analyzing → completed / failed
```

### Progress Tracking

| Stage       | Progress |
| ----------- | -------- |
| Upload      | 10%      |
| Parsing     | 40%      |
| AI Analysis | 70%      |
| Completed   | 100%     |

---

# 📊 Results Dashboard

The frontend dynamically renders:

* ATS Score
* Skills
* Missing Keywords
* Strengths
* Suggestions
* Key Highlights

---

# 📧 Issue Reporting System

Integrated feedback/reporting system using Nodemailer.

## Endpoint

```http
POST /api/report
```

Users can submit:

* Optional email
* Subject
* Issue description

---

# 🧾 REST API Endpoints

| Method | Endpoint                     | Description             |
| ------ | ---------------------------- | ----------------------- |
| POST   | `/api/resumes`               | Upload & analyze resume |
| GET    | `/api/resumes/:jobId/status` | Check job status        |
| POST   | `/api/report`                | Submit issue report     |

---

# 🚀 Installation Guide

## 📌 Prerequisites

* Node.js v18+
* npm
* Git

---

# 🐧 Linux Setup

## 1️⃣ Clone Repository

```bash
git clone <your-repo-url>
cd resumate-ai
```

---

## 2️⃣ Install Linux Dependencies

```bash
sudo apt update

sudo apt install -y poppler-utils
sudo apt install -y tesseract-ocr
sudo apt install -y tesseract-ocr-eng
```

---

## 3️⃣ Install Node Dependencies

### Frontend

```bash
cd frontend
npm install
```

### Backend

```bash
cd backend
npm install
```

---

## 4️⃣ Create Environment Variables

Create `.env` inside backend:

```env
PORT=5000

NVIDIA_API_KEY=your_api_key
OPENAI_API_KEY=your_api_key

EMAIL_USER=your_email
EMAIL_PASS=your_password
```

---

## 5️⃣ Start Development Servers

### Backend

```bash
cd backend
npm run dev
```

### Frontend

```bash
cd frontend
npm run dev
```

---

# 🪟 Windows Setup

## Install Backend Packages

```bash
npm install pdf-poppler
```

Other dependencies:

```bash
npm install pdfjs-dist mammoth pdf-text-extract uuid tesseract.js
```

---

# 🌐 Production Deployment (NGINX)

## Install NGINX

```bash
sudo apt install nginx
```

---

## Example NGINX Config

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    root /home/ubuntu/resumate-ai/dist;
    index index.html;

    location / {
        try_files $uri /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:5000;

        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;

        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

---

# 🔐 HTTPS Setup (Certbot)

## Install Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
```

## Enable HTTPS

```bash
sudo certbot --nginx -d yourdomain.com
```

## Test Renewal

```bash
sudo certbot renew --dry-run
```

---

# 🚧 Rate Limiting (NGINX)

Inside `/etc/nginx/nginx.conf`:

```nginx
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=5r/s;
limit_req_status 429;
```

Apply to API routes:

```nginx
location /api/ {
    limit_req zone=api_limit burst=10 nodelay;

    proxy_pass http://127.0.0.1:5000;
}
```

Restart NGINX:

```bash
sudo nginx -t
sudo systemctl restart nginx
```

---

# ⚙️ Backend Process Management (PM2)

## Install PM2

```bash
npm install -g pm2
```

## Start Backend

```bash
pm2 start server.js --name resumate-backend
```

## Useful Commands

```bash
pm2 list
pm2 restart resumate-backend
pm2 stop resumate-backend
pm2 delete resumate-backend
pm2 logs resumate-backend
```

## Enable Auto Start

```bash
pm2 startup
pm2 save
```

---

# 📁 Error Logging

Structured logging implemented using Winston.

## Log Structure

```text
logs/
 ├── error.log
 └── files/
```

Failed resumes are stored temporarily for debugging purposes.

---

# 🔄 Automatic OCR Model Download

The application automatically:

* Creates `/tessdata`
* Downloads required OCR models if missing

No manual setup required.

---

# 🧠 Key Learnings

* Not all PDFs contain extractable text
* OCR is essential for scanned documents
* Multiple parsers improve reliability
* Post-processing significantly improves OCR accuracy

---

# 🚀 Future Improvements

* Authentication system
* User profiles
* Database-backed job persistence
* Advanced AI scoring models
* Parallel OCR processing

---

# 📜 License

This project is licensed under the MIT License.

---

# 🤝 Contributing

Contributions, suggestions, and feedback are welcome.

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a Pull Request

---

# ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub!
