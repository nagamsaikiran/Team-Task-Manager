TEAM TASK MANAGER
=================

A full-stack web application for managing team projects and tasks with role-based access control.

TECH STACK
----------
Frontend : Angular 17 + TypeScript + Tailwind CSS
Backend  : Python + FastAPI (REST API)
Database : PostgreSQL
Auth     : JWT tokens

FEATURES
--------
- User signup and login with JWT authentication
- Create and manage projects
- Role-based access: Admin (create/delete/manage) and Member (view/update tasks)
- Create tasks with title, description, due date, status, and assignee
- Task status tracking: To Do, In Progress, Done
- Dashboard with task summary and overdue task highlights
- Add and remove project members

PROJECT STRUCTURE
-----------------
Team-Task-Manager/
  backend/         Python FastAPI backend
    app/
      models/      Database table definitions
      routes/      API endpoint handlers
      schemas/     Request and response shapes
      auth/        JWT and password hashing
      core/        Database connection and config
    main.py        App entry point
    requirements.txt

  frontend/        Angular frontend
    src/app/
      pages/       Login, Signup, Dashboard, Projects, Tasks
      components/  Navbar
      services/    API communication (auth, project, task)
      guards/      Route protection for logged-in users
      interceptors/ Attaches JWT token to every API request

HOW TO RUN LOCALLY
------------------

1. DATABASE
   - Install PostgreSQL
   - Create a database: createdb teamtaskmanager

2. BACKEND
   cd backend
   python -m venv venv
   source venv/bin/activate          (Windows: venv\Scripts\activate)
   pip install -r requirements.txt
   Copy .env.example to .env and fill in your DATABASE_URL and a SECRET_KEY
   uvicorn main:app --reload
   API runs at: http://localhost:8000
   API docs at: http://localhost:8000/docs

3. FRONTEND
   cd frontend
   npm install
   npm start
   App runs at: http://localhost:4200

ENVIRONMENT VARIABLES (backend .env)
-------------------------------------
DATABASE_URL=postgresql://user:password@localhost:5432/teamtaskmanager
SECRET_KEY=your-random-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

DEPLOYMENT
----------
Both backend and frontend are deployed on Railway.
Backend is a Python/FastAPI service connected to a Railway PostgreSQL database.
Frontend is a static Angular build served via the 'serve' package.

REST API ENDPOINTS
------------------
POST   /api/auth/signup          Create account
POST   /api/auth/login           Login
GET    /api/auth/me              Get current user

GET    /api/projects             List my projects
POST   /api/projects             Create project (admin)
GET    /api/projects/:id         Get project details
PUT    /api/projects/:id         Update project (admin)
DELETE /api/projects/:id         Delete project (admin)
POST   /api/projects/:id/members Add member (admin)
DELETE /api/projects/:id/members/:userId  Remove member (admin)

GET    /api/tasks/my             Get my assigned tasks
GET    /api/tasks/my/overdue     Get overdue tasks
GET    /api/tasks/project/:id    Get tasks for a project
POST   /api/tasks                Create task
PUT    /api/tasks/:id            Update task
DELETE /api/tasks/:id            Delete task
