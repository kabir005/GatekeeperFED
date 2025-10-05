const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Helper functions
const readUsers = () => {
  if (!fs.existsSync("users.json")) return [];
  const data = fs.readFileSync("users.json");
  return JSON.parse(data);
};

const writeUsers = (users) => {
  fs.writeFileSync("users.json", JSON.stringify(users, null, 2));
};

// Home route
app.get("/", (req, res) => {
  res.send(`
    <h1>👋 Welcome to Code Academy Gatekeeper</h1>
    <p>Use /signup or /login via Postman or Browser forms</p>
  `);
});

// Signup form
app.get("/signup", (req, res) => {
  res.send(`
    <h2>Signup Page</h2>
    <form action="/signup" method="POST">
      <input name="name" placeholder="Name" required><br><br>
      <input type="password" name="password" placeholder="Password" required><br><br>
      <button type="submit">Signup</button>
    </form>
  `);
});

// Login form
app.get("/login", (req, res) => {
  res.send(`
    <h2>Login Page</h2>
    <form action="/login" method="POST">
      <input name="name" placeholder="Name" required><br><br>
      <input type="password" name="password" placeholder="Password" required><br><br>
      <button type="submit">Login</button>
    </form>
  `);
});

// Signup (POST)
app.post("/signup", (req, res) => {
  const { name, password } = req.body;
  if (!name || !password)
    return res.status(400).send("Name and password required!");

  const users = readUsers();
  if (users.find((u) => u.name === name)) {
    return res.status(400).send("User already exists!");
  }

  users.push({ name, password });
  writeUsers(users);
  res.send("Signup successful! You can now login.");
});

// Login (POST)
app.post("/login", (req, res) => {
  const { name, password } = req.body;
  const users = readUsers();

  const user = users.find((u) => u.name === name && u.password === password);
  if (!user) return res.status(401).send("Invalid credentials!");

  res.send(`Welcome, ${name}!`);
});

// Start server
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
