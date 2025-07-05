# 🛒 E-commerce Admin Panel - Product Module

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
  apiBaseUrl: 'http://localhost:5000/api' (Example)
};
```

4. Run the Angular development server:

```bash
ng serve
```

---

## 🧑‍💻 Developer Info

**Name:** Nikesh Vishwakarma  
**Email:** nikeshvishwakarma33@gmail.com
**Portfolio:** [https://portfolio-nikeshvishwakarma.vercel.app/]  
**Linkedin:** [https://www.linkedin.com/in/nikeshvish/] 
**GitHub:** [https://github.com/nikesh33/ecommerce-admin-panel](https://github.com/nikesh33/ecommerce-admin-panel)

---

✅ Task requirements are implemented exactly as per instructions using old versions (Angular v9, legacy peer deps, TypeORM, PostgreSQL, etc.).
