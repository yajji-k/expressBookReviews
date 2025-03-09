const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

// let users = [];
let users=[
    {
     username:"admin",
     password:"1234"
    }
   ];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
return users.some((user)=>user.username===username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
return users.some((user)=>user.username===username && user.password===password);

}

//only registered users can login
regd_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
      return res.status(400).json({ message: "Username and password required" });
  }

  // Check if the user already exists using the isValid function
  if (isValid(username)) {
      return res.status(409).json({ message: "User already found" });
  }

  // If the user doesn't exist, register the new user
  users.push({ username, password });

  return res.status(200).json({ message: "User registered successfully" });
});

regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
      return res.status(400).json({ message: "Username and password required." });
  }

  if (!isValid(username)) {
      return res.status(404).json({ message: "User not found." });
  }

  if (!authenticatedUser(username, password)) {
      return res.status(401).json({ message: "Invalid credentials." });
  }

  // ✅ Generate JWT token
  const token = jwt.sign({ username }, "secret_key", { expiresIn: "1h" });

  return res.status(200).json({ message: "Login successful.", token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const { review } = req.query;
  const username = req.session.username;

  if (!review) {
    return res.status(400).json({ message: "Review is required" });
  }

  // Check if the ISBN exists in the books object
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Ensure reviews is an array
  if (!Array.isArray(books[isbn].reviews)) {
    books[isbn].reviews = []; // Initialize as an array if it's not
  }

  // Check if the user has already reviewed this book
  const existingReviewIndex = books[isbn].reviews.findIndex(r => r.username === username);

  if (existingReviewIndex !== -1) {
    // Modify the existing review
    books[isbn].reviews[existingReviewIndex].review = review;
    return res.status(200).json({ message: "Review updated successfully" });
  } else {
    // Add a new review
    books[isbn].reviews.push({ username, review });
    return res.status(201).json({ message: "Review added successfully" });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.username;

  // Ensure the book exists
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Ensure reviews is an array
  if (!Array.isArray(books[isbn].reviews)) {
    books[isbn].reviews = []; // Initialize as an array if it's not
  }

  // Find the index of the user's review
  const reviewIndex = books[isbn].reviews.findIndex(r => r.username === username);

  // If the user hasn't reviewed the book, return an error
  if (reviewIndex === -1) {
    return res.status(404).json({ message: "Review not found for this user" });
  }

  // Remove the review from the reviews array
  books[isbn].reviews.splice(reviewIndex, 1);

  return res.status(200).json({ message: "Review deleted successfully" });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;