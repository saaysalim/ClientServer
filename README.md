# ClientServer Application

A full-stack web application built with a **Client-Server Architecture** pattern, featuring a modern React frontend and a RESTful Express backend. This application serves as a media center management system that has the list of media centers, file uploads, collaboration features, and analytics.

## 🏗️ Architecture Style

This application follows the **Client-Server Architecture** pattern, a foundational architectural style that separates concerns between the presentation layer (client) and the data/business logic layer (server).

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT TIER                              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │         React Application (Port 5173)                     │  │
│  │  - UI Components (React + Material-UI + shadcn/ui)        │  │
│  │  - State Management                                       │  │
│  │  - Client-Side Routing                                    │  │
│  │  - API Service Layer (Vite Dev Server)                    │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/REST API
                            │ JSON Data Exchange
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                        SERVER TIER                              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │         Express.js Backend (Port 5000)                    │  │
│  │  - RESTful API Endpoints                                  │  │
│  │  - Business Logic Layer                                   │  │
│  │  - CORS & Security Middleware                             │  │
│  │  - In-Memory Data Store                                   │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Key Architectural Characteristics

- **Separation of Concerns**: Frontend and backend are completely decoupled
- **Stateless Communication**: RESTful API design with stateless HTTP requests
- **Scalability**: Client and server can be scaled independently
- **Technology Independence**: Frontend and backend use different technology stacks
- **Multiple Clients Support**: Same API can serve web, mobile, or desktop clients

## 🚀 Technology Stack

### Frontend (Client)
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **UI Libraries**: 
  - Material-UI (MUI) v7
  - shadcn/ui components (Radix UI)
  - Tailwind CSS for styling
- **State Management**: React Hooks
- **HTTP Client**: Fetch API
- **Icons**: Lucide React, Material Icons

### Backend (Server)
- **Runtime**: Node.js
- **Framework**: Express.js v4
- **Middleware**:
  - CORS (Cross-Origin Resource Sharing)
  - Express JSON parser
  - Static file serving
- **Storage**: In-memory data store (development)
- **UUID Generation**: uuid v9

### DevOps
- **Containerization**: Docker & Docker Compose
- **Version Control**: Git
- **Package Management**: npm

## ✨ Features

### 1. **Home Page**
   - Landing page with application overview
   - Quick navigation to all sections

### 2. **Media Centers**
   - Manage media repositories
   - View media center information
   - Add new media centers

### 3. **File Upload System**
   - Upload functionality
   - Track uploaded files
   - Manage upload history

### 4. **Collaboration Tools**
   - Collaborative workspace
   - Team collaboration features

### 5. **Analytics Dashboard**
   - Real-time statistics
   - User metrics
   - Course and media tracking
   - Page view analytics

### 6. **Architecture Visualization**
   - Interactive architecture diagram
   - System overview

## 📋 Prerequisites

Before running this application, ensure you have:

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **Docker** and **Docker Compose** (optional, for containerized deployment)
- **Git** (for version control)

## 🛠️ Installation & Setup

### Option 1: Local Development (Recommended)

#### Step 1: Clone the Repository
```bash
git clone https://github.com/saaysalim/ClientServer.git
cd ClientServer
```

#### Step 2: Install Dependencies

**Frontend Dependencies:**
```bash
npm install
```

**Backend Dependencies:**
```bash
cd server
npm install
cd ..
```

#### Step 3: Run the Application

**Terminal 1 - Start Backend Server:**
```bash
cd server
npm run dev
```
The server will start on `http://localhost:5000`

**Terminal 2 - Start Frontend Dev Server:**
```bash
npm run dev
```
The client will start on `http://localhost:5173`

#### Step 4: Access the Application
Open your browser and navigate to:
```
http://localhost:5173
```

### Option 2: Docker Compose Deployment

For a containerized approach:

```bash
# Build and start both services
docker-compose up --build

# Run in detached mode
docker-compose up -d

# Stop services
docker-compose down
```

Access the application at `http://localhost:5173`

## 📁 Project Structure

```
ClientServer/
├── src/                          # Frontend source code
│   ├── main.tsx                  # Application entry point
│   ├── app/
│   │   ├── App.tsx               # Main App component
│   │   └── components/           # React components
│   │       ├── HomePage.tsx
│   │       ├── CourseCard.tsx
│   │       ├── MediaCentersPage.tsx
│   │       ├── UploadPage.tsx
│   │       ├── CollaborationPage.tsx
│   │       ├── AnalyticsPage.tsx
│   │       ├── ArchitectureDiagram.tsx
│   │       ├── Header.tsx
│   │       ├── Navigation.tsx
│   │       └── ui/               # Reusable UI components
│   ├── services/
│   │   └── api.ts                # API service layer
│   ├── styles/                   # CSS and styling
│   └── assets/                   # Static assets
│
├── server/                       # Backend source code
│   ├── src/
│   │   └── index.js              # Express server
│   └── package.json              # Server dependencies
│
├── guidelines/                   # Project guidelines
├── docker-compose.yml            # Docker Compose configuration
├── client.Dockerfile             # Client container image
├── server.Dockerfile             # Server container image
├── vite.config.ts                # Vite configuration
├── package.json                  # Frontend dependencies
└── README.md                     # This file
```

## 🌐 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### Health Check
- **GET** `/api/health`
- **Response**: Server status and timestamp

#### Courses
- **GET** `/api/courses` - List all courses
- **POST** `/api/courses` - Create a new course
- **GET** `/api/courses/:id` - Get a specific course

#### Media Centers
- **GET** `/api/media-centers` - List all media centers
- **POST** `/api/media-centers` - Create a new media center

#### Uploads
- **GET** `/api/uploads` - List all uploads
- **POST** `/api/uploads` - Create a new upload record

#### Collaborations
- **GET** `/api/collaborations` - List all collaborations
- **POST** `/api/collaborations` - Create a new collaboration

#### Analytics
- **GET** `/api/analytics` - Get analytics data

### Example API Request

```javascript
// Fetch all courses
fetch('http://localhost:5000/api/courses')
  .then(response => response.json())
  .then(data => console.log(data));

// Create a new course
fetch('http://localhost:5000/api/courses', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'New Course',
    description: 'Course description',
    instructor: 'Instructor Name'
  })
})
  .then(response => response.json())
  .then(data => console.log(data));
```

## 🔧 Configuration

### Environment Variables

**Frontend (.env)**
```env
VITE_API_URL=http://localhost:5000/api
```

**Backend (.env)**
```env
PORT=5000
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

## 🏗️ Build for Production

### Frontend Build
```bash
npm run build
```
Output: `dist/` directory

### Backend Production
```bash
cd server
npm start
```

## 🧪 Development Scripts

### Frontend
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production

### Backend
- `npm run dev` - Start server with hot-reload (Node.js watch mode)
- `npm start` - Start production server

## 🐳 Docker Configuration

### Individual Containers

**Build Frontend:**
```bash
docker build -f client.Dockerfile -t clientserver-frontend .
```

**Build Backend:**
```bash
docker build -f server.Dockerfile -t clientserver-backend .
```

**Run Containers:**
```bash
docker run -p 5173:5173 clientserver-frontend
docker run -p 5000:5000 clientserver-backend
```

## 📝 Design Principles

This application follows several software engineering principles:

1. **Separation of Concerns**: Frontend and backend are separate codebases
2. **RESTful Design**: API follows REST architectural constraints
3. **Component-Based Architecture**: React components are modular and reusable
4. **Single Responsibility**: Each component/module has one clear purpose
5. **DRY (Don't Repeat Yourself)**: Reusable UI components and API service layer

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is part of a Software Architecture course assignment.

## 🔗 Links

- **GitHub Repository**: https://github.com/saaysalim/ClientServer

## 📧 Contact

For questions or support, please open an issue in the GitHub repository.

---

**Last Updated**: February 25, 2026

