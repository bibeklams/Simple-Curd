📝 Simple CRUD App (with Authentication)

A simple Node.js + Express + MongoDB CRUD web application with user authentication.
Each user can register, log in, and manage (add, edit, delete) their own notes securely.

🚀 Features

🧑‍💻 User Registration & Login
Secure password storage with bcrypt.

🔒 Session-based Authentication
Implemented using express-session and connect-mongo to persist sessions.

🗒️ Notes Management

Create, update, and delete notes

Each user can only see their own notes

🧠 MongoDB Integration
Mongoose schemas for users and notes.

🎨 Clean Frontend Views
Using EJS templates for simple and intuitive UI.

🛠️ Technologies Used

Node.js
Express.js
MongoDB & Mongoose
EJS (templating)
bcrypt (password hashing)
express-session & connect-mongo (sessions)

📂 Project Structure
├── app.js               # Main server file
├── package.json
├── views/
│   ├── login.ejs
│   ├── register.ejs
│   ├── dashboard.ejs
│   ├── add-note.ejs
│   └── update.ejs
└── node_modules/


🔐 Usage Flow

Register a new user
Login with your credentials
Add, Edit, or Delete notes
Logout to end session

💡 Notes

Each user’s notes are private.
Passwords are securely hashed with bcrypt.
Sessions are stored in MongoDB using connect-mongo.
