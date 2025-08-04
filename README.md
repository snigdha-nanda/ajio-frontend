# AJIO Clone - E-commerce Frontend

A modern e-commerce web application built with React.js, featuring user authentication, product browsing, cart management, and search functionality.

## Live Demo
Deployed via Netlify. [https://ajio-project-clone.netlify.app/]

## Features

### Core Functionality
- **User Authentication**: Login/Signup with Firebase Authentication
- **Product Catalog**: Browse products from FakeStore API
- **Search**: Real-time product search with dropdown suggestions
- **Shopping Cart**: Add/remove items with quantity management
- **Responsive Design**: Mobile-friendly interface with Bootstrap

### Cart Management Modes
- **Local Cart Mode**: Cart data stored in Redux (client-side)
- **API Cart Mode**: Cart data managed via FakeStore API
- **Persistent Storage**: Cart data persists across browser sessions

### Technical Features
- **State Management**: Redux Toolkit with Redux Persist
- **Routing**: React Router for navigation
- **UI Framework**: Bootstrap for responsive design
- **API Integration**: FakeStore API for products and cart
- **Real-time Updates**: Live cart count and search results

## Tech Stack

- **Frontend**: React.js 18
- **State Management**: Redux Toolkit, Redux Persist
- **Routing**: React Router DOM
- **Authentication**: Firebase Auth
- **UI Framework**: Bootstrap 5
- **API**: FakeStore API
- **Build Tool**: Create React App
- **Styling**: CSS3, Bootstrap

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Firebase project (for authentication)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ajio-frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Firebase Configuration
1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication with Email/Password
3. Create `src/firebase.jsx` with your Firebase config:

```javascript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
```

### 4. Start Development Server
```bash
npm start
```

The application will open at `http://localhost:3000`

## Usage Guide

### Getting Started
1. **Home Page**: Browse all available products
2. **Search**: Use the search bar to find specific products
3. **Authentication**: Sign up or login to manage your cart
4. **Shopping**: Add products to cart and manage quantities
5. **Cart**: View and modify your cart items

### Cart Modes
**Local Cart Mode** (Default):
- Cart stored in browser's local storage
- Faster performance
- Data persists across sessions
- No API calls for cart operations

**API Cart Mode**:
- Cart managed via FakeStore API
- Simulates real e-commerce backend
- Cart ID persists until logout
- Requires API calls for cart operations

### Key Pages
- `/` - Home page with product grid and search
- `/login` - User authentication
- `/signup` - User registration
- `/product/:id` - Product details page
- `/cart` - Shopping cart management

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.jsx      # Navigation bar with cart count
│   ├── ProductCard.jsx # Product display card
│   ├── SearchBar.jsx   # Search functionality
│   └── ProtectedRoute.jsx # Route protection
├── pages/              # Main application pages
│   ├── Home.jsx        # Home page with products
│   ├── Login.jsx       # Authentication page
│   ├── Signup.jsx      # Registration page
│   ├── ProductDetail.jsx # Product details
│   └── CartPage.jsx    # Cart management
├── features/           # Redux slices
│   └── userCart/       # Cart state management
├── utils/              # Utility functions
│   ├── cartService.js  # Unified cart operations
│   └── cartUtils.js    # Cart helper functions
├── api/                # API integration
│   └── fakeStoreCart.js # FakeStore API calls
├── hooks/              # Custom React hooks
│   └── useCart.js      # Cart-related hooks
├── firebase.jsx        # Firebase configuration
├── store.jsx          # Redux store setup
└── index.css          # Global styles
```

## Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run test suite
- `npm eject` - Eject from Create React App

## Key Features Explained

### Search Functionality
- Real-time search as you type
- Dropdown with product suggestions
- Click to navigate to product details
- Shows all products by default

### Cart Management
- Unified service for both local and API modes
- Persistent cart across browser sessions
- Real-time cart count updates
- Add, remove, and update quantities

### State Management
- Redux Toolkit for efficient state management
- Redux Persist for data persistence
- Memoized selectors to prevent unnecessary re-renders

### Authentication Flow
- Firebase Authentication integration
- Protected routes for cart functionality
- User session management
- Automatic cart initialization

## Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Netlify
1. Build the project locally
2. Pushed the changes to git repository
3. Hosted on Netlify: automatic build of the CRA project.
4. Configure environment variables for Firebase on Netflify
`REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id`
5. Build command: npm run build
6. Publish directory: build/

