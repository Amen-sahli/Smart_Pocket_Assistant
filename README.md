# 💳 Smart Pocket Assistant

A full-stack web application that allows users to upload bank transactions, analyze spending patterns, and visualize financial insights through an interactive dashboard.

---

## 🚀 Features

* 🔐 User authentication (login/register)
* 📄 Upload bank statements (CSV format)
* 🗄️ Store and manage transactions
* 📊 Interactive dashboard (charts & summaries)
* 🤖 Smart insights (basic AI analysis)
* 📈 Spending categorization and trends

---

## 🧱 Tech Stack

### Backend

* Django
* Django REST Framework
* SQLite (development) / PostgreSQL (production)

### Frontend

* React (Vite)
* Chart.js

---

## 📁 Project Structure

```
bank-statement-analyzer/
│
├── backend/        # Django API
├── frontend/       # React (Vite)
├── docs/           # Documentation (optional)
└── README.md
```

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```
git clone https://github.com/Amen-sahli/bank-statement-analyzer.git
cd bank-statement-analyzer
```

---

## 🔧 Backend Setup (Django)

```
cd backend
python -m venv venv
source venv/bin/activate   # (Linux/macOS)
venv\Scripts\activate      # (Windows)

pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Backend runs on:
👉 http://localhost:8000

---

## ⚛️ Frontend Setup (React + Vite)

```
cd frontend
npm install
npm run dev
```

Frontend runs on:
👉 http://localhost:3000

---

## 🔗 API Endpoints

```
/api/auth/register/
/api/auth/login/

/api/transactions/upload/
/api/transactions/

/api/dashboard/
/api/analysis/
```

---

## 📊 How It Works

1. User logs in
2. Uploads a CSV file with transactions
3. Backend processes and stores data
4. Dashboard displays:

   * Total income & expenses
   * Category breakdown
   * Monthly trends
5. AI module generates insights

---

## 🤖 AI Insights (Examples)

* High spending categories
* Monthly spending changes
* Financial behavior patterns

---

## 🧪 Future Improvements

* PDF statement parsing
* Advanced AI insights (ML models / APIs)
* Budget tracking
* Export reports (PDF/Excel)
* Dark mode UI

---

## 🧑‍💻 Contributors

* Amen allah Sahli
* Feriel Mouelhi
* Amira Brarmia
* Ghaya
* Siwar

---

## 📄 License

This project is for educational purposes.

---

## 📬 Contact

For questions or collaboration:

* GitHub: https://github.com/Amen-sahli

---
