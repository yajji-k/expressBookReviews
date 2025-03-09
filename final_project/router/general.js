const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// public_users.post("/register", (req,res) => {
//   //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
// });

// Route to get all books - Sends JSON with message and books data
public_users.get("/", (req, res) => {
  // Sending books data in the response body with status 200 (OK)
  res.status(200).json({ message: "All Books", books: books });
});

// Simulate an async function to fetch books (could be a DB query in a real app)
const getBooks = async () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(books); // Simulating async fetching of books
    }, 1000); // Simulating a delay (e.g., DB query or API request)
  });
};
// Route to get books with async/await
public_users.get("/books", async (req, res) => {
  try {
    // Simulating an async operation such as fetching data from an API or DB
    const booksData = await getBooks(); // Simulate async data fetching
    res.status(200).json({ books: booksData });
  } catch (error) {
    // Handling errors if something goes wrong
    return res
      .status(500)
      .json({ message: "Error fetching books", error: error.message });
  }
});

// Get book details based on ISBN
// Synchronous Route
public_users.get("/isbn/:isbn", function (req, res) {
  try {
    const isbn = req.params.isbn;
    if (!books[isbn]) {
      return res.status(404).json({ message: "Not Found with ISBN" });
    }

    // No need for spreading the data if it's already in the correct format
    return res.json({ message: `Book with ISBN ${isbn}`, book: books[isbn] });
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({ message: "Internal Error" });
  }
});

// Simulated async function to fetch book details by ISBN
const getBookDetailsByISBN = async (isbn) => {
  return new Promise((resolve, reject) => {
    // Simulating a small delay (e.g., database/API request)
    setTimeout(() => {
      // Simulate fetching the book from the 'books' object
      if (books[isbn]) {
        resolve({ ...books[isbn], isbn });
      } else {
        reject("Book not found");
      }
    }, 500); // Simulate a delay
  });
};
// Async Route to get book by ISBN
public_users.get("/books/isbn/:isbn", async (req, res) => {
  const isbn = req.params.isbn;

  try {
    // Simulate an async operation, e.g., fetching from a database
    const bookDetails = await getBookDetailsByISBN(isbn);

    if (!bookDetails) {
      return res.status(404).json({ message: "Not Found with ISBN" });
    }

    // Send the book details in the response
    return res
      .status(200)
      .json({ message: `Book with ISBN ${isbn}`, book: bookDetails });
  } catch (error) {
    // Catch any errors during the async operation
    return res
      .status(500)
      .json({ message: "Internal Error", error: error.message });
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  //Write your code here
  const author = req.params.author;
  const bookByAuthor = Object.values(books).filter(
    (book) => book.author === author
  );
  return res
    .status(300)
    .json({ message: "book by author", book: bookByAuthor });
});

// Simulated async function to get books by author
const getBooksByAuthor = async (author) => {
  return new Promise((resolve, reject) => {
    // Simulating a small delay (e.g., database/API request)
    setTimeout(() => {
      const filteredBooks = Object.values(books).filter(
        (book) => book.author === author
      );
      resolve(filteredBooks);
    }, 500); // Simulate a delay (e.g., network or DB call)
  });
};
// Async Route to get books by author
public_users.get("/books/author/:author", async (req, res) => {
  const author = req.params.author;

  try {
    // Directly filtering books by author using async operation (in case you want to mock a delay or async data)
    const booksByAuthor = await getBooksByAuthor(author);

    if (booksByAuthor.length === 0) {
      return res.status(404).json({ message: "No books found by this author" });
    }

    // Return the filtered books
    return res
      .status(200)
      .json({ message: `Books by author: ${author}`, books: booksByAuthor });
  } catch (error) {
    // Catch any errors during the async operation
    return res
      .status(500)
      .json({ message: "Internal Error", error: error.message });
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here
  const title = req.params.title;
  const bookbyTitle = Object.values(books).filter(
    (book) => book.title === title
  );
  return res.status(300).json({ message: "book by title", book: bookbyTitle });
});

// Simulated async function to get books by title
const getBooksByTitle = async (title) => {
  return new Promise((resolve, reject) => {
    // Simulate a small delay (e.g., waiting for a DB or API call)
    setTimeout(() => {
      const filteredBooks = Object.values(books).filter(
        (book) => book.title.toLowerCase() === title.toLowerCase()
      );
      resolve(filteredBooks);
    }, 500); // Simulating a 500ms delay for async operation
  });
};
// Async Route to get books by title with simulated async operation
public_users.get("/books/title/:title", async (req, res) => {
  const title = req.params.title;
  try {
    // Simulating an async operation (e.g., database or API call)
    const booksByTitle = await getBooksByTitle(title);
    if (booksByTitle.length === 0) {
      return res
        .status(404)
        .json({ message: "No books found with this title" });
    }
    return res
      .status(200)
      .json({ message: `Books with title: ${title}`, books: booksByTitle });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Error", error: error.message });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const bookByReviews = books[isbn].reviews;
  //   return res.status(300).json({message: "Book Reviews by isbn",book:bookByReviews});
  return res
    .status(300)
    .json({ message: "book by author", reviews: bookByReviews });
});

module.exports.general = public_users;
