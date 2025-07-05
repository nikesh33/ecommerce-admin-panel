# 🛒 E-commerce Admin Panel - Product Module

**Task Submission for Node.js Developer Role at INOVANT SOLUTIONS**

This is a full-featured product management module built using **Angular v9**, **Node.js with TypeScript**, **PostgreSQL**, and **TypeORM**, with support for **multiple image uploads via Cloudinary**. The panel allows adding, editing, deleting (soft delete), restoring, and listing products with real-time image previews.

---

## ✅ Features

- **Product Listing**
  - SKU, Name, Price, and multiple image previews
  - Pagination for easy browsing
- **Add Product**
  - Form to create product with validations
  - Upload multiple images using Cloudinary
- **Edit Product**
  - Modify existing product details and images
- **Soft Delete**
  - Products can be soft-deleted and restored
- **Restore Deleted**
  - Toggle between active and deleted products

---

## 🛠 Tech Stack (As per Task Requirements)

| Layer        | Technology                     |
|--------------|--------------------------------|
| Frontend     | Angular v9 + TypeScript        |
| Backend      | Node.js + Express + TypeScript |
| ORM          | TypeORM                        |
| Database     | PostgreSQL                     |
| Image Upload | Cloudinary                     |
| Deployment   | Render (Backend), Vercel (Frontend) |

---

## 🌐 Live Demo

- 🔗 **Frontend**: [https://ecommerce-admin-panel-mocha.vercel.app](https://ecommerce-admin-panel-mocha.vercel.app)
---

## 🚀 Project Setup Instructions

### 🔧 Backend Setup (`/backend`)

1. Navigate to backend folder:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install --legacy-peer-deps
```

3. Create a `.env` file in the `backend` root and add the following:

```env
DATABASE_URL=your_postgres_connection_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

4. Start the backend server:

```bash
npm run dev
```

The backend will run at: `http://localhost:5000`

---

### 💻 Frontend Setup (`/frontend`)

1. Navigate to frontend folder:

```bash
cd frontend
```

2. Install Angular 9 compatible dependencies:

```bash
npm install --legacy-peer-deps
```

3. Update the `src/environments/environment.ts` file:

```ts
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:5000/api'
};
```

4. Run the Angular development server:

```bash
ng serve
```

The frontend will run at: `http://localhost:4200`

---

## 📁 Project Structure

```
ecommerce-admin-panel/
├── frontend/               # Angular v9 App
│   └── src/app/
│       ├── components/
│       ├── services/
│       └── pages/
├── backend/                # Node.js + TypeScript API
│   ├── controllers/
│   ├── entities/
│   ├── services/
│   └── routes/
└── README.md               # This file
```

---

## 📸 Screenshots

> Add screenshots in the `screenshots/` folder if needed

---

## 🧑‍💻 Developer Info

**Name:** Nikesh Vishwakarma  
**Email:** nikeshvishwakarma33@gmail.com  
**GitHub:** [https://github.com/nikesh33/ecommerce-admin-panel](https://github.com/nikesh33/ecommerce-admin-panel)

---

✅ Task requirements are implemented exactly as per instructions using old versions (Angular v9, legacy peer deps, TypeORM, PostgreSQL, etc.).

**Built with ❤️ for INOVANT SOLUTIONS**