# ama-odoo-hackathon

#AMA Odoo Hackathon – Marketplace App

This project is a full-stack marketplace application built for the hackathon.
It allows users to sign up, log in, list products for sale, browse others’ products, and manage their own listings.

#Features

#Authentication (JWT)

User registration & login

Secure endpoints with JWT tokens

Protected routes on frontend

#Product Listings

Create new product listings with image upload

Browse all products

Search & filter by category

View product detail pages

#Manage Listings

Edit your own listings

Delete your own listings

Authorization enforced (only the owner can update/delete)

#Image Handling

Supports file upload (Multer)

Stores images in /uploads

Falls back to a placeholder image if no image is provided

#Tech Stack

Backend: Node.js, Express, Prisma ORM

Frontend: React + Vite

Auth: JWT

Styling: Simple CSS inline styles (customizable)

#1. Clone repo
git clone https://github.com/<your-username>/ama-odoo-hackathon.git
cd ama-odoo-hackathon

2. Backend Setup
cd backend
npm install


#Create a .env file inside /backend:

DATABASE_URL="mysql://user:password@localhost:5432/marketplace"
JWT_SECRET="supersecretkey"
PORT=3000


Run Prisma migrations:

npx prisma migrate dev --name init


#Start backend:

npm run dev


Server runs on: http://localhost:3000

3. Frontend Setup
cd frontend
npm install


Create .env inside /frontend:

VITE_API_URL=http://localhost:3000/api


#Start frontend:

npm run dev


App runs on: http://localhost:5173

🔑 Authentication

Register: POST /api/auth/register
Body: { "email": "test@mail.com", "password": "123456", "username": "tester" }

Login: POST /api/auth/login
Body: { "email": "test@mail.com", "password": "123456" }
Response: { "token": "<JWT>" }

The token is stored in localStorage via authStorage and added to requests with an Axios interceptor.

📦 Products API
Method	Endpoint	Auth	Description
GET	/api/products	❌	Get all products
GET	/api/products/:id	❌	Get product by ID
POST	/api/products	✅	Create a new product
PATCH	/api/products/:id	✅	Update product (owner only)
DELETE	/api/products/:id	✅	Delete product (owner only)

Product Fields

{
  "id": "string",
  "title": "Laptop",
  "description": "Good condition",
  "price": 200,
  "category": "Electronics",
  "image": "/uploads/xyz.png",
  "location": "Bangalore",
  "condition": "Used",
  "userId": "user-id"
}

# Frontend Pages

/ → Feed (browse/search all products)

/products/:id → Product Detail

/my-listings → User’s Listings (View/Edit/Delete your products)

/product/new → Add new product

/auth/login → Login

/auth/signup → Signup

#Authorization

Only logged-in users (JWT in header) can create, update, or delete products.

A product can only be modified or deleted by its owner (product.userId === req.user.id).

🔧 Future Improvements

Cloud image upload (S3/Cloudinary)

Better UI styling with Tailwind or Material UI

Real-time updates with WebSockets

Add Wishlist / Favorites feature
