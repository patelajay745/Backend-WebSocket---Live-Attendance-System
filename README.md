# Live Attendance System

A real-time attendance management system built with Node.js, Express, WebSockets, and MongoDB. This application enables teachers to manage classes and track student attendance in real-time using WebSocket connections.

## Features

- **Authentication & Authorization** - JWT-based authentication with role-based access control (Teacher/Student)
- **User Management** - Registration and login for teachers and students
- **Class Management** - Teachers can create and manage classes
- **Student Management** - Add students to classes
- **Real-time Attendance** - Live attendance marking using WebSocket connections
- **Attendance Tracking** - View attendance history and summaries
- **Session Management** - Start and end attendance sessions in real-time

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB (with Mongoose ODM)
- **WebSockets**: ws library
- **Authentication**: JWT (jsonwebtoken) + bcrypt
- **Validation**: Zod
- **Containerization**: Docker (Docker Compose for MongoDB)

## Project Structure

```
src/
├── app.ts                      # Express app configuration
├── index.ts                    # Entry point
├── config/                     # Configuration files
├── controllers/                # Route controllers
│   ├── attendance.controller.ts
│   ├── class.controller.ts
│   ├── student.controller.ts
│   └── user.controller.ts
├── db/                        # Database connection
├── middlewares/               # Express middlewares
│   ├── errorHandler.middleware.ts
│   ├── isAuth.middleware.ts
│   └── validate.middleware.ts
├── models/                    # Mongoose models
│   ├── attendance.model.ts
│   ├── class.model.ts
│   └── user.model.ts
├── routes/                    # API routes
│   ├── attendance.routes.ts
│   ├── class.routes.ts
│   ├── students.routes.ts
│   └── user.routes.ts
├── schemas/                   # Zod validation schemas
│   ├── attendance.schema.ts
│   ├── class.schema.ts
│   └── user.schema.ts
├── services/                  # Business logic
├── types/                     # TypeScript type definitions
│   └── websocket.d.ts
├── utils/                     # Utility functions
│   ├── apiError.ts
│   ├── apiResponse.ts
│   ├── asyncHandler.ts
│   └── websocket/
│       └── helper.ts
└── websockets/                # WebSocket implementation
    ├── index.ts
    ├── handlers/
    │   ├── attendace.handler.ts
    │   ├── session.handler.ts
    │   └── summary.handler.ts
    └── middlewares/
        └── auth.middleware.ts
```

## Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- npm or yarn

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd nodejs-with-web-sockets
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```env
   PORT=8000
   BASEURL=http://localhost:8000
   DB_URl=mongodb://localhost:27017/attendance-system
   JWT_TOKEN_SECRET=your_jwt_secret_key_here
   ```

4. **Start MongoDB using Docker Compose**

   ```bash
   docker-compose up -d
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

The server will start at `http://localhost:8000` and WebSocket server at `ws://localhost:8000`.

## API Endpoints

### Authentication

| Method | Endpoint                | Description              | Access  |
| ------ | ----------------------- | ------------------------ | ------- |
| POST   | `/api/v1/auth/register` | Register a new user      | Public  |
| POST   | `/api/v1/auth/login`    | Login user               | Public  |
| GET    | `/api/v1/auth/me`       | Get current user details | Private |

### Classes

| Method | Endpoint            | Description        | Access  |
| ------ | ------------------- | ------------------ | ------- |
| POST   | `/api/v1/class`     | Create a new class | Teacher |
| GET    | `/api/v1/class`     | Get all classes    | Teacher |
| GET    | `/api/v1/class/:id` | Get class by ID    | Teacher |

### Students

| Method | Endpoint                    | Description                 | Access  |
| ------ | --------------------------- | --------------------------- | ------- |
| POST   | `/api/v1/students/add`      | Add student to class        | Teacher |
| GET    | `/api/v1/students/:classId` | Get all students in a class | Teacher |

### Attendance

| Method | Endpoint                      | Description                | Access          |
| ------ | ----------------------------- | -------------------------- | --------------- |
| POST   | `/api/v1/attendance`          | Mark attendance            | Student/Teacher |
| GET    | `/api/v1/attendance/:classId` | Get attendance for a class | Teacher         |

## WebSocket Events

### Client to Server

| Event               | Description                    | Payload                  |
| ------------------- | ------------------------------ | ------------------------ |
| `ATTENDANCE_MARKED` | Mark attendance for a student  | `{ classId, studentId }` |
| `DONE`              | End attendance session         | `{ classId }`            |
| `TODAY_SUMMARY`     | Get today's attendance summary | `{ classId }`            |
| `MY_ATTENDANCE`     | Get personal attendance        | `{ studentId }`          |

### Server to Client

- Real-time attendance updates
- Session status updates
- Attendance summaries

### WebSocket Connection

To connect to the WebSocket server, include the JWT token in the URL query parameters:

```javascript
const ws = new WebSocket("ws://localhost:8000?token=YOUR_JWT_TOKEN");
```

## User Roles

### Teacher

- Create and manage classes
- Add students to classes
- Start and end attendance sessions
- View attendance reports
- Real-time attendance monitoring

### Student

- Mark attendance when session is active
- View personal attendance history
- Receive real-time session updates

## Development

### Build the project

```bash
npm run build
```

### Run in development mode

```bash
npm run dev
```

## Scripts

- `npm run dev` - Run the development server with nodemon
- `npm run build` - Compile TypeScript to JavaScript

## Error Handling

The application includes centralized error handling with custom error classes:

- `ApiError` - Custom error class for API errors
- `ApiResponse` - Standardized API response format
- `asyncHandler` - Wrapper for async route handlers

## Security Features

- Password hashing using bcrypt
- JWT-based authentication
- Role-based access control
- WebSocket authentication middleware
- Input validation using Zod schemas

## Database Models

### User

```typescript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: "teacher" | "student"
}
```

### Class

```typescript
{
  className: String,
  teacherId: ObjectId (ref: User),
  studentIds: ObjectId[] (ref: User)
}
```

### Attendance

```typescript
{
  classId: ObjectId (ref: Class),
  studentId: ObjectId (ref: User),
  status: "present" | "absent"
}
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## Acknowledgments

- Built as part of Harkirat's challenges
- Uses WebSocket for real-time communication
- MongoDB for data persistence
