const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5001;

// Configure CORS to allow only a specific origin
const corsOptions = {
  origin: 'https://my-frontend-three-blond.vercel.app', // change this to your frontend's origin
  optionsSuccessStatus: 200 // for legacy browser support
};

app.use(cors(corsOptions));

// Middleware to parse JSON
app.use(express.json());

// GET /bfhl - Returns a hardcoded operation_code
app.get('/bfhl', (req, res) => {
  res.status(200).json({ operation_code: 1 });
});

// POST /bfhl - Expects a JSON body with a "data" array
app.post('/bfhl', (req, res) => {
  // Validate input
  if (!req.body || !Array.isArray(req.body.data)) {
    return res.status(400).json({
      is_success: false,
      message: "Invalid input. 'data' must be provided as an array."
    });
  }

  const inputArray = req.body.data;
  const numbers = [];
  const alphabets = [];

  // Separate numbers and alphabets.
  inputArray.forEach(item => {
    if (!isNaN(item) && item.trim() !== '') {
      numbers.push(item);
    } else if (/^[A-Za-z]$/.test(item)) {
      alphabets.push(item);
    }
  });

  // Calculate highest_alphabet (case insensitive)
  let highest_alphabet = [];
  if (alphabets.length > 0) {
    const highest = alphabets.reduce((prev, curr) =>
      curr.toUpperCase() > prev.toUpperCase() ? curr : prev
    );
    highest_alphabet.push(highest);
  }

  // Build response with hardcoded user details
  const response = {
    is_success: true,
    user_id: "john_doe_17091999",
    email: "john@xyz.com",
    roll_number: "ABCD123",
    numbers,
    alphabets,
    highest_alphabet
  };

  res.json(response);
});

// Global error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ is_success: false, message: "Internal Server Error" });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
