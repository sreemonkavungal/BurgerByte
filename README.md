# BurgerByte

A full-stack, POS-friendly burger ordering application with comprehensive admin dashboard for managing products, orders, users, and sales reports.

## Overview

BurgerByte is a modern web application that provides a seamless burger ordering experience with customization options. The platform includes a customer-facing interface for browsing, customizing, and ordering burgers, along with a powerful admin dashboard for managing all aspects of the business.

## Features

### Customer Features

- **Product Browsing**: Browse available burgers with images, descriptions, and prices
- **Product Customization**: Customize burgers with:
  - Patty selection (Veg, Chicken, Beef, etc.)
  - Extras (Cheese, Bacon, Onion Rings, etc.)
  - Sauces
  - Special notes
- **Shopping Cart**: Add customized items to cart with quantity management
- **Favorites**: Save favorite products for quick access
- **Order Management**: 
  - Place orders with demo payment flow
  - View order history
  - Track order status
  - Request refunds for orders
- **User Authentication**: Secure registration and login with JWT tokens
- **Responsive Design**: Modern, mobile-friendly interface built with Tailwind CSS

### Admin Features

- **Dashboard**: Overview of orders, sales, and system statistics
- **Product Management**: 
  - Create, edit, and delete products
  - Set product availability status
  - Assign products to categories
  - Configure customization options (patties, extras, sauces)
  - Search and filter products
- **Category Management**: Organize products into categories
- **Order Management**: 
  - View all orders
  - Update order status (pending, accepted, rejected, preparing, ready, completed, cancelled)
  - Process refund requests
- **User Management**: View and manage registered users
- **Sales Reports**: Generate sales reports and analytics

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) with bcryptjs for password hashing
- **Middleware**: CORS, Morgan (logging), Cookie Parser

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS
- **State Management**: React Context API

## Project Structure

```
BurgerByte/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # MongoDB connection configuration
│   │   ├── controllers/
│   │   │   ├── adminController.js    # Admin operations (orders, users, reports)
│   │   │   ├── authController.js     # Authentication (register, login)
│   │   │   ├── cartController.js     # Shopping cart operations
│   │   │   ├── categoryController.js # Category CRUD operations
│   │   │   ├── favoriteController.js # Favorites management
│   │   │   ├── orderController.js    # Order creation and management
│   │   │   └── productController.js  # Product CRUD operations
│   │   ├── middleware/
│   │   │   └── authMiddleware.js     # JWT protection and admin authorization
│   │   ├── models/
│   │   │   ├── Category.js           # Category schema
│   │   │   ├── Order.js              # Order schema with status tracking
│   │   │   ├── Product.js            # Product schema with customization options
│   │   │   └── User.js               # User schema with cart and favorites
│   │   ├── routes/
│   │   │   ├── adminRoutes.js        # Admin-only routes
│   │   │   ├── authRoutes.js         # Authentication routes
│   │   │   ├── cartRoutes.js         # Cart management routes
│   │   │   ├── categoryRoutes.js     # Category routes
│   │   │   ├── favoriteRoutes.js     # Favorites routes
│   │   │   ├── orderRoutes.js        # Order routes
│   │   │   └── productRoutes.js      # Product routes
│   │   └── server.js                 # Express app setup and configuration
│   ├── package.json
│   └── .env                          # Environment variables (create this)
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── axiosClient.js        # Axios instance with auth interceptor
    │   ├── components/
    │   │   ├── Footer.jsx             # Footer component
    │   │   ├── Navbar.jsx             # Navigation bar
    │   │   └── ProtectedRoute.jsx    # Route protection wrapper
    │   ├── context/
    │   │   └── AuthContext.jsx       # Authentication context provider
    │   ├── pages/
    │   │   ├── admin/
    │   │   │   ├── AdminDashboard.jsx    # Admin dashboard overview
    │   │   │   ├── CategoriesAdmin.jsx   # Category management
    │   │   │   ├── OrderAdmin.jsx        # Order management
    │   │   │   ├── ProductAdmin.jsx      # Product management
    │   │   │   ├── SalesReportAdmin.jsx  # Sales reports
    │   │   │   └── UsersAdmin.jsx        # User management
    │   │   ├── Cart.jsx                  # Shopping cart page
    │   │   ├── Checkout.jsx              # Checkout and payment page
    │   │   ├── Favorites.jsx             # Favorites page
    │   │   ├── Home.jsx                  # Home page with product listing
    │   │   ├── Login.jsx                 # Login page
    │   │   ├── Orders.jsx                # User order history
    │   │   ├── ProductDetails.jsx        # Product detail and customization
    │   │   └── Register.jsx              # Registration page
    │   ├── App.jsx                       # Main app component with routing
    │   └── main.jsx                      # React entry point
    ├── package.json
    └── .env                              # Environment variables (optional)
```

## Environment Variables

### Backend (.env in backend/ directory)

Create a `.env` file in the `backend/` directory with the following variables:

- **MONGO_URI** (required): MongoDB connection string
  - Example: `mongodb://localhost:27017/burgerbyte` or MongoDB Atlas connection string
- **JWT_SECRET** (required): Secret key for signing JWT tokens
  - Use a strong, random string for production
- **JWT_EXPIRES_IN** (required): Token expiration time
  - Example: `7d`, `24h`, `1h`
- **PORT** (optional): Server port number
  - Default: `5000`

The backend validates these required environment variables at startup and will exit if any are missing.

### Frontend (.env in frontend/ directory - optional)

Create a `.env` file in the `frontend/` directory if your API is not running on the default URL:

- **VITE_API_BASE_URL**: Backend API base URL
  - Default: `http://localhost:5000`
  - Example: `https://your-api-domain.com`

## Installation & Setup

### Prerequisites

- Node.js (v14 or higher recommended)
- npm or yarn package manager
- MongoDB database (local or MongoDB Atlas)

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the `backend/` directory with the required environment variables (see above).

4. Start the development server:
   ```
   npm run dev
   ```
   The server will run on `http://localhost:5000` (or the port specified in your `.env` file).

   For production:
   ```
   npm start
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. (Optional) Create a `.env` file if your backend API is not at `http://localhost:5000`.

4. Start the development server:
   ```
   npm run dev
   ```
   The frontend will typically run on `http://localhost:5173`.

5. Build for production:
   ```
   npm run build
   ```

## Running the Application

1. **Start MongoDB**: Ensure your MongoDB instance is running (local or Atlas).

2. **Start Backend**: 
   - Open a terminal in the `backend/` directory
   - Run `npm run dev` (or `npm start` for production)

3. **Start Frontend**:
   - Open a new terminal in the `frontend/` directory
   - Run `npm run dev`

4. **Access the Application**:
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5000`
   - Health Check: `http://localhost:5000/api/health`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and receive JWT token

### Products (Public)
- `GET /api/products` - Get all available products
- `GET /api/products/:id` - Get product details by ID

### Products (Admin Only)
- `POST /api/products` - Create a new product
- `PUT /api/products/:id` - Update a product
- `DELETE /api/products/:id` - Delete a product
- `GET /api/products?all=true` - Get all products (including unavailable)

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (Admin)
- `PUT /api/categories/:id` - Update category (Admin)
- `DELETE /api/categories/:id` - Delete category (Admin)

### Cart (Authenticated)
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add or update item in cart
- `DELETE /api/cart/:itemId` - Remove item from cart
- `DELETE /api/cart` - Clear entire cart

### Favorites (Authenticated)
- `GET /api/favorites` - Get user's favorites
- `POST /api/favorites/:productId` - Add product to favorites
- `DELETE /api/favorites/:productId` - Remove product from favorites

### Orders (Authenticated)
- `POST /api/orders` - Create a new order
- `GET /api/orders` - Get current user's orders
- `GET /api/orders/:id` - Get order details
- `POST /api/orders/:id/refund` - Request refund for an order

### Admin Routes (Admin Only)
- `GET /api/admin/orders` - Get all orders
- `PATCH /api/admin/orders/:id/status` - Update order status
- `GET /api/admin/reports/sales` - Get sales report
- `GET /api/admin/users` - Get all users

### Health Check
- `GET /api/health` - API health status

**Note**: All authenticated routes require a JWT token in the Authorization header: `Authorization: Bearer <token>`

## Database Models

### User Model
- Name, email, password (hashed)
- Role (user/admin)
- Cart items with customization
- Favorite products array
- Timestamps

### Product Model
- Name, description, price
- Image URL
- Category reference
- Availability status
- Customization options (patties, extras, sauces)
- Timestamps

### Category Model
- Name (unique)
- Description
- Timestamps

### Order Model
- User reference
- Order items with:
  - Product reference
  - Quantity
  - Price snapshot (at time of order)
  - Customization details
- Total amount
- Order status (pending, accepted, rejected, preparing, ready, completed, cancelled)
- Payment status (pending, paid, refunded)
- Payment ID
- Refund status and request tracking
- Timestamps

## Authentication

The application uses JWT (JSON Web Tokens) for authentication:

1. **Registration/Login**: Users register or login and receive a JWT token
2. **Token Storage**: Frontend stores the token in `localStorage` as `burgerbyte_token`
3. **Protected Routes**: Backend middleware validates tokens on protected routes
4. **Admin Routes**: Additional `adminOnly` middleware restricts access to admin users
5. **Password Security**: Passwords are hashed using bcryptjs before storage

## CORS Configuration

The backend includes CORS protection with an allowlist. By default, it allows:
- `http://localhost:5173` (local development)
- `https://burger-byte-three.vercel.app` (production frontend)

To add additional origins, modify the `allowedOrigins` array in `backend/src/server.js`.

## Admin Access

To create an admin user:

1. Register a regular user through the registration endpoint
2. Update the user's role in MongoDB to `"admin"`:
   ```
   db.users.updateOne({ email: "admin@example.com" }, { $set: { role: "admin" } })
   ```

Alternatively, you can extend the registration logic to support admin creation or create a seed script.

## Deployment Notes

### Backend Deployment
- Set all required environment variables in your hosting platform
- Ensure MongoDB connection string is accessible
- Configure CORS to include your frontend domain
- Use a strong `JWT_SECRET` in production

### Frontend Deployment
- Set `VITE_API_BASE_URL` to your production backend URL
- Build the application using `npm run build`
- Deploy the `dist/` folder to your hosting service (Vercel, Netlify, etc.)

### Production Considerations
- Use environment-specific configuration
- Enable HTTPS for both frontend and backend
- Implement rate limiting on API endpoints
- Set up proper error logging and monitoring
- Use a production-grade MongoDB instance (MongoDB Atlas recommended)

## Development Tips

1. **Payment Flow**: The current checkout implements a demo payment flow. For production, integrate a real payment gateway (Stripe, Razorpay, etc.).

2. **Price Snapshots**: Order items store price snapshots at creation time to prevent price changes from affecting historical orders.

3. **Cart Customization**: The cart system matches items by product ID and customization options, allowing multiple entries of the same product with different customizations.

4. **Order Status Workflow**: Orders follow a status progression: pending → accepted → preparing → ready → completed. Admin can also reject or cancel orders.

5. **Refund System**: Users can request refunds, which admins can process through the order management interface.

6. **Product Availability**: Products can be marked as available/unavailable. Unavailable products are hidden from public product listings but visible to admins.

## Contributing

Contributions are welcome! Here are some ways to contribute:

1. Report bugs by opening an issue
2. Suggest new features
3. Submit pull requests for improvements
4. Improve documentation

## License

This project is open source and available for educational and commercial use.

