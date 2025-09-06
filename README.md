# 🛒 Marketplace App  

A full-stack web application where users can **list, view, edit, and delete products**. Built with **Node.js, Express, Prisma, mysql, React, and JWT authentication**.  

## Video link

https://drive.google.com/file/d/1prgbEudfNr92pE6QZhvBeuQcTCV5eq13/view?usp=sharing
---


## 🚀 Features  

- 🔐 **Authentication**: Secure login & signup with JWT  
- 📦 **Product Listings**: Create, view, update, and delete products  
- 🖼️ **Image Uploads**: Upload product images (Multer middleware)  
- 👤 **User Ownership**: Only the owner can edit/delete their products  
- ⚡ **API Integration**: RESTful backend connected to React frontend  
- 🔍 **View Products**: Public browsing of listings with details  
- 🛠️ **Error Handling**: Friendly error messages with status codes  


---

## 🏗️ Tech Stack  

- **Frontend**: React, React Router, Axios  
- **Backend**: Node.js, Express.js  
- **Database**: Prisma ORM with mysql 
- **Auth**: JWT (JSON Web Token)  
- **File Uploads**: Multer  

---

# Backend Setup
cd backend
npm install


# Configure your .env file:

DATABASE_URL="mysql://user:password@localhost:5432/marketplace"
JWT_SECRET="your-secret-key"
PORT=5000


# Run Prisma migrations:

npx prisma migrate dev --name init


# Start backend server:

npm run dev

# Frontend Setup
cd frontend
npm install
npm run dev


Frontend runs on http://localhost:5173

Backend runs on http://localhost:3000

# Authentication Flow

Login / Register → Returns JWT Token

Frontend stores token in localStorage

Requests to protected routes (POST, PATCH, DELETE) must include:

Authorization: Bearer <token>

# API Endpoints
Auth
Method	Endpoint	Description	Auth Required
POST	/auth/register	Register a new user	
POST	/auth/login	Login and get token	
Products
Method	Endpoint	Description	Auth Required
GET	/products	Get all products	
GET	/products/:id	Get product by ID	
POST	/products	Create new product	
PATCH	/products/:id	Update product (owner only)	
DELETE	/products/:id	Delete product (owner only)	
# Frontend Features

Home Page → Shows all products

View Page → Shows product details

Add Product → Upload product with image

Edit Product → Owner can edit

Delete Product → Owner can delete

🛠️ Development Scripts

# Backend

npm run dev   # run with nodemon


# Frontend

npm run dev   # start react app



