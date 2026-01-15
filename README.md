# Viso Time Tracker



A simplified time tracking application built with **NestJS** and **Next.js**.

The app allows users to log their work hours, view history, and validates that daily entries do not exceed 24 hours.



## 🛠 Tech Stack



- **Backend:** NestJS, Prisma ORM, SQLite

- **Frontend:** Next.js (App Router), Tailwind CSS, React Query

- **Validation:** class-validator, React Hook Form

- **State Management:** TanStack Query



## How to Run



### 1. Clone the repository

```bash

git clone <https://github.com/dmytromuntian/viso-time-tracker.git>

cd viso-time-tracker



2. Setup Backend (Port 4000)

The backend runs on port 4000 to avoid conflicts with the frontend.



cd backend

npm install



# Initialize SQLite database

npx prisma db push



# Start the server

npm run start:dev



Backend will start at: http://localhost:4000





3. Setup Frontend (Port 3000)

Open a new terminal window:



cd frontend

npm install



# Start the development server

npm run dev



Frontend will start at: http://localhost:3000





✅ Features Implemented

[x] Time Logging: Users can add entries with date, project, description, and hours.



[x] Validation: Server-side check prevents logging more than 24 hours per day.



[x] History: Displays grouped list of time entries ordered by date.



[x] Persistence: Data is stored in a local SQLite database.



[x] UI/UX: Clean interface with Tailwind CSS and form reset functionality.