# User Management Project

## Overview
This project is a full-stack user management application that allows adding, editing, deleting, and viewing users. It includes frontend React components and a backend Express server with SQLite database.

---

## Frontend

### Technologies
- React
- Vite
- React Context API for state management
- React Toastify for notifications
- Tailwind CSS for styling

### Key Components
- **UserForm.jsx**: Form component for adding and editing users. Includes validation for required fields, phone number length, and uniqueness checks for email, username, and phone at the form level.
- **UserCard.jsx**: Displays user summary cards on the dashboard.
- **DashboardPage.jsx**: Main page showing user list, search functionality, and user form modal for add/edit.
- **UserDetailsPage.jsx**: (If implemented) Shows detailed user info with edit and delete options.
- **UserContext.jsx**: React context managing user data fetching, adding, updating, and deleting via API.

### Validation
- Email, username, and phone uniqueness are validated on the form level during input blur and on form submission.
- Phone number must be exactly 10 digits.
- Required fields are validated on blur.

---

## Backend

### Technologies
- Node.js with Express
- SQLite database
- dotenv for environment variables

### API Routes

- `GET /api/users`  
  Returns all users.

- `GET /api/users/:id`  
  Returns a single user by ID.

- `POST /api/users`  
  Adds a new user. Enforces unique email constraint at the database level.

- `PUT /api/users/:id`  
  Updates an existing user by ID.

- `DELETE /api/users/:id`  
  Deletes a user by ID.

### Database Schema
- Users table with fields: id, name, username, email (unique), phone, website, address fields (street, suite, city, zipcode, geo_lat, geo_lng), company fields (name, catchPhrase, bs).

---

## Deployed URLs

- **Frontend**: https://forty-4-tech-frontend.onrender.com
- **Backend**: https://forty-4-tech-backend.onrender.com

## Running the Project Locally

### Backend
1. Navigate to `44-backend` folder.
2. Run `npm install` to install dependencies.
3. Run `npm start` to start the backend server (default port 3000).

### Frontend
1. Navigate to `44-frontend` folder.
2. Run `npm install` to install dependencies.
3. Run `npm run dev` to start the frontend development server.
4. Open the URL shown in the terminal (e.g., http://localhost:5174).

---

## Notes
- The frontend communicates with the backend API to fetch and manipulate user data.
- Email uniqueness is validated both on the frontend form and backend database.
- The project uses React Context for state management and API interaction.
- Tailwind CSS is used for styling and responsive design.

---

## Future Improvements
- Add pagination for user list.
- Add user authentication and authorization.
- Improve error handling and loading states.
- Add unit and integration tests.

---

## Contact
For any questions or issues, please contact the project maintainer.
