
---

## 🔐 Credentials

| Role  | Email             | Password    |
|-------|------------------|-------------|
| Admin | admin@gmail.com  | admin@123   |
| User  | user@gmail.com   | user@123    |

---

## 🧰 Tech Stack

- **Backend**: Laravel 11, Sanctum Auth, MySQL
- **Frontend**: React.js + Vite + Axios + Bootstrap 5
- **Authentication**: Laravel Sanctum
- **Charts**: Recharts (for Pie Charts)
- **UI Enhancements**: React-Toastify, Bootstrap

---

## ✅ Features

### 👤 Roles
- **Admin**:
  - Full control: add/edit/delete products & categories
  - Dashboard summary (pie chart, total count)
- **User**:
  - Read-only access to products and categories

### 📦 Product & Category Management
- Create, Read, Update, Delete (CRUD)
- Category-wise summary
- Live category edit with reset/cancel option

### 📊 Admin Dashboard
- Dynamic pie chart: category vs product count
- Summary cards: total products, total categories

### 🔐 Authentication
- Secure login with role-based routing
- Session storage for user info
- CSRF protection via Sanctum

---

## 🛠️ Setup Instructions

### ⚙️ Backend (Laravel)
```bash
cd backend
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate
php artisan db:seed  # Includes admin & user

php artisan serve


cd frontend
npm install
npm run dev


🙋‍♂️ Author
Inus Daimary
📧 inusdaimary@gmail.com
🔒 Repo: Private GitHub Repository
