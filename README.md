# ToDoListAI

A full-stack AI-powered task management application with automatic subtask generation using Ollama.

## Features

- **Task Management**: Create, read, update, and delete tasks with title, description, priority, due date, and completion status
- **AI Subtask Generation**: Automatically break down tasks into actionable subtasks using a local Ollama model (llama3.1)
- **Modern UI**: Built with React 19, Tailwind CSS v4, and shadcn/ui components
- **Real-time Updates**: React Query for efficient data fetching and caching
- **Form Validation**: Zod schema validation with react-hook-form
- **Toast Notifications**: User feedback with sonner

## Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - ORM for database operations
- **SQLite** - Lightweight database
- **Ollama** - Local LLM for AI subtask generation
- **uvicorn** - ASGI server
- **pydantic-settings** - Configuration management

### Frontend
- **React 19** - UI library
- **Vite 7** - Build tool and dev server
- **Tailwind CSS v4** - Utility-first CSS framework
- **shadcn/ui** - Radix UI-based component library
- **React Query** - Data fetching and caching
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Zod** - Schema validation
- **react-hook-form** - Form management
- **date-fns** - Date utilities
- **lucide-react** - Icon library
- **sonner** - Toast notifications

## Prerequisites

- **Python 3.13+** - Backend runtime
- **Node.js 18+** - Frontend runtime
- **uv** - Python package manager (recommended)
- **Ollama** - Local LLM runtime for AI features

## Setup

### Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment and install dependencies:
   ```bash
   uv venv
   uv sync
   ```

3. Create a `.env` file in the `backend` directory:
   ```env
   DATABASE_URL=sqlite:///./database.db
   API_PREFIX=/api
   DEBUG=true
   ALLOWED_ORIGINS=http://localhost:5173
   ```

4. Start the backend server:
   ```bash
   uv run uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```
   
   Or simply:
   ```bash
   python main.py
   ```

The API will be available at `http://localhost:8000` with interactive docs at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The app will be available at `http://localhost:5173`. The Vite dev server proxies `/api` requests to the backend at `http://localhost:8000`.

### Ollama Setup (for AI subtask generation)

1. Install Ollama from [ollama.com](https://ollama.com)

2. Pull the llama3.1 model:
   ```bash
   ollama pull llama3.1
   ```

3. Ensure Ollama is running in the background. The backend will use it to generate subtasks.

## API Endpoints

All endpoints are prefixed with `/api/tasks`:

- `POST /create` - Create a new task
- `GET /` - Get all tasks
- `PUT /update/{task_id}` - Update a task
- `PUT /updateStatus/{task_id}` - Update task completion status
- `DELETE /delete/{task_id}` - Delete a task
- `GET /ollama/subtasks` - Generate subtasks using AI (query params: `title`, `description`)

## Project Structure

```
ToDoListAI/
├── backend/
│   ├── core/           # Configuration
│   ├── db/             # Database setup
│   ├── models/         # SQLAlchemy models
│   ├── routers/        # API route handlers
│   ├── schema/         # Pydantic schemas
│   ├── main.py         # FastAPI app entry point
│   └── pyproject.toml  # Python dependencies
│
└── frontend/
    ├── src/
    │   ├── components/ # React components
    │   ├── lib/        # Utilities (cn helper)
    │   ├── App.jsx     # Root component
    │   └── main.jsx    # Entry point
    ├── package.json    # Node dependencies
    └── vite.config.js  # Vite configuration
```

## Development

### Backend Development
The backend uses FastAPI with hot reload enabled. Changes to Python files will automatically restart the server.

### Frontend Development
The frontend uses Vite with HMR (Hot Module Replacement). Changes to React components will update instantly in the browser.

## Build for Production

### Frontend
```bash
cd frontend
npm run build
```

The production build will be in the `dist/` directory.

## License

This project is open source and available under the MIT License.
