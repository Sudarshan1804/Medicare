# 🏥 Health Hub Live - Complete Medical Platform

A comprehensive full-stack healthcare platform providing real-time medical services, AI-powered health assistance, pharmacy services, emergency routing, and telemedicine capabilities.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Features Guide](#features-guide)
- [Development](#development)
- [Deployment](#deployment)
- [License](#license)

---

## 🎯 Overview

Health Hub Live is a modern healthcare platform that connects patients with medical services through an intuitive web interface. The platform offers AI-powered health assistance, real-time pharmacy location services, telemedicine consultations, emergency routing, and comprehensive medicine management.

### Key Highlights

- 🤖 **AI Medical Assistant** - Groq-powered pill identification and medical information
- 📍 **Real-time Location Services** - Find nearby hospitals and pharmacies (OpenStreetMap)
- 💊 **Smart Pharmacy System** - Browse catalogs, order medicines, track deliveries
- 🚑 **Emergency Services** - Quick access to emergency facilities with routing
- 👨‍⚕️ **Telemedicine** - Video consultations with healthcare professionals
- 📱 **Responsive Design** - Works seamlessly across all devices
- 🔐 **Secure Authentication** - JWT-based user authentication with role management

---

## ✨ Features

### 🤖 AI Health Assistant

- **Pill Identification**: Upload medicine images for instant AI-powered identification
- **Medical Information**: Get detailed info about medicines (uses, dosage, warnings)
- **Symptom Analysis**: Analyze symptoms and get preliminary health advice
- **Structured Output**: Easy-to-read format with sections and bullet points
- **Powered by Groq**: Uses Llama 4 Scout vision model for accurate results

### 📍 Location Services

- **Nearby Pharmacies**: Find medical stores within 30km radius
- **Hospital Finder**: Locate hospitals and clinics with real-time data
- **Interactive Maps**: Leaflet-powered maps with custom markers
- **Navigation**: In-app routing with distance and duration
- **OpenStreetMap Integration**: Comprehensive coverage with fallback to database

### 💊 Pharmacy System

- **Browse Catalogs**: View medicines by pharmacy with detailed information
- **Smart Search**: Find medicines by name, category, or condition
- **Shopping Cart**: Add multiple items with quantity management
- **Order Tracking**: Real-time order status updates
- **Home Delivery**: Track deliveries with estimated arrival times

### 🚑 Emergency Features

- **Emergency Hub**: Quick access to ambulance, police, fire services
- **Hospital Routing**: Find nearest emergency facilities
- **Community Responders**: Connect with nearby volunteer responders
- **Incident Feed**: Real-time emergency incidents and alerts
- **QR Code**: Emergency medical info for first responders

### 👨‍⚕️ Telemedicine

- **Doctor Directory**: Browse specialists by category and rating
- **Appointment Booking**: Schedule video consultations
- **Video Calls**: Secure peer-to-peer video communication
- **Consultation History**: Access past appointments and prescriptions

### 💊 Medicine Management

- **Upload Prescriptions**: Take photos of prescriptions for easy ordering
- **Medicine Reminders**: Never miss a dose with smart notifications
- **Dosage Tracking**: Monitor medication adherence
- **Refill Alerts**: Get notified when medicines are running low

### 🔐 User Management

- **Authentication**: Secure login/signup with JWT tokens
- **User Roles**: Patient, Doctor, Admin role-based access
- **Profile Management**: Update personal and medical information
- **Admin Dashboard**: Manage users, hospitals, and pharmacies

---

## 🛠 Tech Stack

### Frontend

- **React 18** - Modern UI library
- **Vite** - Lightning-fast build tool
- **React Router v6** - Client-side routing
- **TailwindCSS** - Utility-first CSS framework
- **Shadcn/ui** - Beautiful component library
- **Radix UI** - Accessible component primitives
- **Leaflet** - Interactive maps
- **Lucide Icons** - Modern icon library
- **TanStack Query** - Data fetching and caching

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Axios** - HTTP client

### External Services

- **Groq AI** - AI medical assistance (Llama 4 Scout vision model)
- **OpenStreetMap** - Real-time location data via Overpass API
- **Leaflet** - Map rendering and interactions

### Development Tools

- **ESLint** - Code linting
- **Nodemon** - Auto-restart server
- **Git** - Version control

---

## 📁 Project Structure

```
health-hub-live/
├── src/                          # Frontend source code
│   ├── components/              # Reusable UI components
│   │   ├── cards/              # Card components
│   │   ├── common/             # Common components (Header, Footer)
│   │   ├── layout/             # Layout components
│   │   ├── maps/               # Map components (Leaflet)
│   │   └── ui/                 # Shadcn/ui components
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utility libraries
│   │   ├── api.js             # API client
│   │   ├── store.js           # State management
│   │   └── utils.js           # Helper functions
│   ├── pages/                  # Page components
│   │   ├── Index.jsx          # Home page
│   │   ├── Doctors.jsx        # Doctor directory
│   │   ├── Appointments.jsx   # Appointments manager
│   │   ├── Pharmacies.jsx     # Pharmacy finder
│   │   ├── HealthAssistant.jsx # AI assistant
│   │   ├── EmergencyHub.jsx   # Emergency services
│   │   └── ...                # Other pages
│   ├── App.jsx                 # Main app component
│   └── main.jsx                # App entry point
│
├── server/                      # Backend source code
│   ├── config/                 # Configuration files
│   │   └── db.js              # MongoDB connection
│   ├── controllers/            # Route controllers
│   │   ├── authController.js  # Authentication logic
│   │   ├── assistantController.js # AI assistant logic
│   │   ├── locationController.js # Location services
│   │   ├── hospitalController.js # Hospital management
│   │   └── pharmacyController.js # Pharmacy management
│   ├── middleware/             # Express middleware
│   │   ├── auth.js            # JWT authentication
│   │   └── validation.js      # Input validation
│   ├── models/                 # MongoDB models
│   │   ├── User.js            # User schema
│   │   ├── Hospital.js        # Hospital schema
│   │   └── Pharmacy.js        # Pharmacy schema
│   ├── routes/                 # API routes
│   │   ├── authRoutes.js      # Auth endpoints
│   │   ├── assistantRoutes.js # AI assistant endpoints
│   │   ├── locationRoutes.js  # Location endpoints
│   │   ├── hospitalRoutes.js  # Hospital endpoints
│   │   └── pharmacyRoutes.js  # Pharmacy endpoints
│   ├── services/               # Business logic
│   │   ├── aiAssistantService.js # Groq AI integration
│   │   ├── overpassService.js    # OpenStreetMap API
│   │   └── googlePlacesService.js # Google Places (optional)
│   └── server.js               # Server entry point
│
├── public/                     # Static assets
├── package.json                # Frontend dependencies
├── vite.config.ts             # Vite configuration
├── tailwind.config.ts         # Tailwind configuration
└── README_COMPLETE.md         # This file
```

---

## 🚀 Installation

### Prerequisites

- **Node.js** >= 18.x
- **MongoDB** >= 6.x (local or Atlas)
- **npm** or **yarn** package manager
- **Groq API Key** (free at console.groq.com)

### Step 1: Clone Repository

```bash
git clone <repository-url>
cd health-hub-live
```

### Step 2: Install Frontend Dependencies

```bash
npm install
```

### Step 3: Install Backend Dependencies

```bash
cd server
npm install
cd ..
```

### Step 4: Environment Configuration

Create `.env` file in the `server/` directory:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/healthhub
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/healthhub

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
JWT_EXPIRE=7d

# Groq AI Configuration
GROQ_API_KEY=gsk_your_groq_api_key_here

# Optional: Google Places API (fallback)
GOOGLE_PLACES_API_KEY=your_google_api_key_here
```

### Step 5: Start Development Servers

**Terminal 1 - Backend:**

```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**

```bash
npm run dev
```

The application will be available at:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

---

## ⚙️ Configuration

### MongoDB Setup

**Local MongoDB:**

```bash
# Install MongoDB Community Edition
# Start MongoDB service
mongod --dbpath /path/to/data

# MongoDB will run on mongodb://localhost:27017
```

**MongoDB Atlas (Cloud):**

1. Create account at mongodb.com/cloud/atlas
2. Create a cluster
3. Add database user
4. Whitelist IP address (0.0.0.0/0 for development)
5. Get connection string and add to `.env`

### Groq API Key

1. Visit https://console.groq.com
2. Sign up for free account
3. Go to API Keys section
4. Create new API key
5. Copy key to `.env` file as `GROQ_API_KEY`

### Map Configuration

The app uses OpenStreetMap (no API key needed). Maps are powered by:

- **Leaflet** for rendering
- **Overpass API** for location data
- **OpenStreetMap tiles** for map display

No additional configuration required!

---

## 📡 API Documentation

### Base URL

```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "patient"
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}

Response:
{
  "success": true,
  "token": "jwt_token_here",
  "user": { ... }
}
```

### AI Assistant Endpoints

#### Chat with AI Assistant

```http
POST /api/assistant/chat
Content-Type: application/json

{
  "query": "What are the uses of Paracetamol?",
  "conversationHistory": []
}

Response:
{
  "success": true,
  "data": {
    "summary": "Formatted medical information...",
    "intent": "medicine_info",
    "confidence_score": 0.9
  }
}
```

#### Identify Pill from Image

```http
POST /api/assistant/identify-pill
Content-Type: application/json

{
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
  "query": "Identify this pill"
}

Response:
{
  "success": true,
  "data": {
    "summary": "**This is Dolo-650.**\nIt's paracetamol 650 mg...",
    "intent": "pill_id",
    "confidence_score": 0.85
  }
}
```

### Location Endpoints

#### Get Nearby Pharmacies/Hospitals

```http
GET /api/location/nearby?latitude=31.249245&longitude=75.698421&radius=30&type=pharmacy

Response:
{
  "success": true,
  "count": 15,
  "source": "openstreetmap",
  "items": [
    {
      "name": "Apollo Pharmacy",
      "address": "123 Main Street",
      "lat": 31.250,
      "lng": 75.700,
      "distance_km": 2.5,
      "phone": "+91-1234567890",
      "isOpen": true
    },
    ...
  ]
}
```

### Hospital Endpoints

#### Get All Hospitals

```http
GET /api/hospitals

Response:
{
  "success": true,
  "count": 10,
  "data": [ ... ]
}
```

#### Get Hospital by ID

```http
GET /api/hospitals/:id
```

### Pharmacy Endpoints

#### Get All Pharmacies

```http
GET /api/pharmacies
```

#### Get Pharmacy by ID

```http
GET /api/pharmacies/:id
```

---

## 🎓 Features Guide

### Using the AI Health Assistant

1. **Navigate** to Health Assistant page
2. **Upload Image**: Click "Upload Pill Image" button
3. **Select Photo**: Choose medicine image from device
4. **Get Results**: AI provides formatted information:
   - Medicine name and strength
   - Uses and indications
   - Dosage information
   - Important warnings
   - When to see a doctor

**Example Output:**

```
**This is Dolo-650.**
It's paracetamol 650 mg.

**What it's used for**
• Fever
• Headache
• Body pain
• Mild to moderate pain

**How it works**
• Reduces fever
• Relieves pain
• It is not an antibiotic and does not treat infections

**Typical adult dose**
• 1 tablet (650 mg) every 6–8 hours if needed
• Max: 3,000–4,000 mg per day
• Do not take continuously without consulting a doctor

**Important warnings**
• Overdose damages the liver. This is serious.
• Avoid alcohol while taking it
• Check labels - many cold/flu meds contain paracetamol

**When to see a doctor**
• Fever lasts more than 3 days
• Pain doesn't improve
• You have liver disease or are pregnant
```

### Finding Nearby Pharmacies

1. **Go to** Pharmacies page
2. **Click** "📍 Use My Location" button
3. **Allow** location access in browser
4. **View Results**:
   - List view with distance sorting
   - Map view with interactive markers
   - Store details (rating, phone, hours)
5. **Navigate**: Click navigation icon for directions

**Features:**

- Shows stores within 30km radius
- Filters by open/closed status
- Displays delivery availability
- Real-time distance calculation

### Booking Appointments

1. **Browse Doctors** by specialty
2. **View Profile** with ratings and availability
3. **Select Time Slot** from calendar
4. **Confirm Booking** with details
5. **Join Video Call** at appointment time

### Emergency Services

1. **Access Emergency Hub** from main menu
2. **Choose Service**:
   - 🚑 Ambulance
   - 🏥 Nearest Hospital
   - 👮 Police
   - 🚒 Fire Department
3. **Get Instant Routing** with ETA
4. **Call Directly** from app

### Medicine Ordering

1. **Search Pharmacy** catalog
2. **Add to Cart** with quantity
3. **Review Order** and apply coupons
4. **Checkout** with delivery address
5. **Track Order** in real-time

---

## 👨‍💻 Development

### Running Tests

```bash
# Frontend tests
npm test

# Backend tests
cd server
npm test
```

### Code Style

```bash
# Lint frontend code
npm run lint

# Fix linting issues
npm run lint:fix
```

### Building for Production

```bash
# Build frontend
npm run build

# Output will be in dist/ folder
```

### Database Seeding

```bash
# Seed sample data
cd server
node seed.js
```

---

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)

1. Build the app:

   ```bash
   npm run build
   ```

2. Deploy `dist/` folder to:
   - **Vercel**: `vercel deploy`
   - **Netlify**: `netlify deploy --prod --dir=dist`

### Backend Deployment (Heroku/Railway)

1. Set environment variables on hosting platform
2. Deploy using Git:

   ```bash
   git push heroku main
   ```

3. Ensure MongoDB Atlas is used for production

### Environment Variables (Production)

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_production_secret
GROQ_API_KEY=your_groq_key
```

---

## 🔧 Troubleshooting

### Common Issues

**Issue: Server not starting**

- Solution: Check if MongoDB is running
- Verify `.env` file exists with correct values
- Check port 5000 is not in use

**Issue: Location services not working**

- Solution: Enable location permissions in browser
- Check HTTPS connection (required for geolocation)
- Ensure device GPS is enabled

**Issue: AI Assistant errors**

- Solution: Verify Groq API key is valid
- Check internet connection
- Ensure image is less than 4MB

**Issue: No pharmacies showing**

- Solution: Try different location
- Increase search radius
- Check if area has mapped pharmacies on OpenStreetMap

---

## 📚 Additional Documentation

Refer to these files for more details:

- `ARCHITECTURE.md` - System architecture
- `API_DOCUMENTATION.md` - Complete API reference
- `DEPLOYMENT_GUIDE.md` - Deployment instructions
- `TESTING_GUIDE.md` - Testing procedures

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open pull request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👥 Support

For issues and questions:

- Create an issue on GitHub
- Email: support@healthhub.com
- Documentation: https://docs.healthhub.com

---

## 🎉 Acknowledgments

- **Groq** for AI capabilities
- **OpenStreetMap** for location data
- **Shadcn/ui** for beautiful components
- **React** and **Node.js** communities

---

**Built with ❤️ for better healthcare access**

Last Updated: December 21, 2025
