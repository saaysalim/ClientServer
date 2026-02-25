# Client-Server Architecture Setup

This document explains the new client-server architecture and how to run and deploy the application.

## Architecture Overview

```
┌─────────────────────┐         ┌─────────────────────┐
│   React Frontend    │         │  Express Backend    │
│   (Port 5173)       │◄───────►│  (Port 5000)        │
│   Vite Dev Server   │  HTTP   │  Node.js/Express    │
└─────────────────────┘         └─────────────────────┘
         │                               │
         │                        ┌──────┴───────┐
         │                        │   In-Memory   │
         │                        │    DataStore  │
         │                        └───────────────┘
    User Browser
```

## Running Locally

### Option 1: Run Both Services Separately (Recommended for Development)

#### Terminal 1 - Start Backend Server:
```bash
cd server
npm install
npm run dev
# Server running on http://localhost:5000
```

#### Terminal 2 - Start Frontend Dev Server:
```bash
npm install
npm run dev
# Client running on http://localhost:5173
```

The frontend will automatically connect to `http://localhost:5000/api`.

### Option 2: Using Docker Compose

```bash
# Build and start both services
docker-compose up --build

# Access the app at http://localhost:5173
```

## Project Structure

```
.
├── src/                          # React Frontend
│   ├── services/
│   │   └── api.ts               # API service for backend calls
│   ├── app/
│   │   ├── App.tsx
│   │   └── components/
│   ├── main.tsx
│   └── ...
├── server/                       # Express Backend
│   ├── src/
│   │   └── index.js             # Main server file
│   └── package.json
├── dist/                         # Built frontend (created after npm run build)
├── package.json                  # Frontend dependencies
├── vite.config.ts               # Vite configuration
├── .env                         # Frontend env variables
├── .env.production              # Production env variables
├── Dockerfile                   # Production Docker image
├── docker-compose.yml           # Docker compose for dev
└── README.md
```

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api  # Development
```

### Production (.env.production)
```
VITE_API_URL=/api  # Uses relative path for production
```

### Backend (server/.env)
```
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

## API Endpoints

The backend provides the following APIs:

### Health Check
- `GET /api/health` - Server health status

### Courses
- `GET /api/courses` - List all courses
- `POST /api/courses` - Create a new course
- `GET /api/courses/:id` - Get a specific course

### Media Centers
- `GET /api/media-centers` - List all media centers
- `POST /api/media-centers` - Create a new media center

### Uploads
- `GET /api/uploads` - List all uploads
- `POST /api/uploads` - Create a new upload record

### Collaborations
- `GET /api/collaborations` - List collaborations
- `POST /api/collaborations` - Create a new collaboration

### Analytics
- `GET /api/analytics` - Get analytics data
- `PUT /api/analytics` - Update analytics data

## Building for Production

```bash
# Build the frontend
npm run build

# Build and run the Docker image
docker build -t my-app:latest .
docker run -p 5000:5000 my-app:latest
```

## Deployment Options

### 1. **Azure App Service**
```bash
az appservice plan create --name myplan --resource-group mygroup --sku B1 --is-linux
az webapp create --resource-group mygroup --plan myplan --name myapp --runtime "node|20-lts"
az webapp up --name myapp
```

### 2. **Heroku**
```bash
heroku create my-app
git push heroku main
```

### 3. **Docker Container Registry (Azure Container Registry)**
```bash
az acr build --registry myregistry --image my-app:latest .
```

### 4. **Digital Ocean**
```bash
doctl apps create --spec app.yaml
```

### 5. **Vercel + Backend Service**
- Deploy frontend to Vercel
- Deploy backend to another service (Railway, Render, etc.)
- Update API URL in environment variables

## Making API Calls from Components

Example usage in React components:

```typescript
import { coursesAPI } from '@/services/api';

export default function MyComponent() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    coursesAPI.list()
      .then(data => setCourses(data))
      .catch(error => console.error('Error fetching courses:', error));
  }, []);

  return (
    <div>
      {courses.map(course => (
        <div key={course.id}>{course.title}</div>
      ))}
    </div>
  );
}
```

## Development Workflow

1. **Frontend Development**: Make changes in `src/` directory - Vite hot reload works automatically
2. **Backend Development**: Make changes in `server/src/` - Server restarts automatically with `--watch`
3. **Test API**: Use the provided API service in `src/services/api.ts`
4. **Build for Production**: Run `npm run build` to create optimized build

## Next Steps

1. **Database Integration**: Replace in-memory store with MongoDB, PostgreSQL, etc.
2. **Authentication**: Add JWT or session-based authentication
3. **File Upload**: Implement actual file upload handling with Multer
4. **Real-time Features**: Add WebSockets for live collaboration
5. **Monitoring**: Add logging and monitoring (Application Insights, Sentry, etc.)

## Troubleshooting

### CORS Errors
If you see CORS errors, check:
- Backend CORS configuration in `server/src/index.js`
- API URL is correct in frontend `.env` file
- Backend is running on the expected port

### API Not Found
- Ensure backend is running (`npm run dev` in server directory)
- Check that the API endpoint exists in `server/src/index.js`
- Verify the API URL in frontend environment variables

### Build Errors
- Delete `node_modules` and `package-lock.json` in both directories
- Run `npm install` again
- Clear Vite cache: `rm -rf dist .vite`
