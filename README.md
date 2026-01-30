🛒 Super Mall Web Application

A full-stack **Super Mall Web Application** built using **Django (Backend)** and **HTML, CSS, JavaScript (Frontend)**.  
The application supports multiple user roles such as **Admin, Merchant, and Customer**, with core e-commerce features.

---

## 🚀 Features

### 👤 User Management
- User Registration & Login
- Role-based access (Admin / Merchant / Customer)
- Authentication & Authorization

### 🏪 Merchant Module
- Add & manage products
- View product listings
- Handle orders

### 🛍️ Customer Module
- Browse products
- View product details
- Place orders
- View order history

### 🛠️ Admin Module
- Admin dashboard
- Manage users & products
- Monitor overall system activity

---

## 🧑‍💻 Tech Stack

### Backend
- **Python**
- **Django**
- **SQLite (Development DB)**

### Frontend
- **HTML**
- **CSS**
- **JavaScript**

---

## 📁 Project Structure

supermall/
│
├── backend/
│ ├── accounts/
│ ├── products/
│ ├── db.sqlite3
│ └── manage.py
│
├── frontend/
│ ├── static/
│ │ ├── css/
│ │ └── js/
│ ├── login.html
│ ├── signup.html
│ ├── admin_dashboard.html
│ ├── merchant_dashboard.html
│ └── customer_dashboard.html
│
├── .gitignore
└── README.md


---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repository
```bash
git clone https://github.com/yeshaswini4/super-mall-web-application.git
cd super-mall-web-application
2️⃣ Create virtual environment
python -m venv venv
venv\Scripts\activate   # Windows
3️⃣ Install dependencies
pip install django
4️⃣ Run migrations
python manage.py migrate
5️⃣ Start the server
python manage.py runserver
6️⃣ Open in browser
http://127.0.0.1:8000/
