const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require('dotenv').config(); 
const Transaction = require("./models/Transaction.js");

const app = express();
const port = 4000;
const url = "/api/test";
const message = "test ok";

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", (error) => {
  console.error("Error connecting to MongoDB database:", error);
});

db.once("open", () => {
  console.log("Connected to MongoDB database.");
});

app.get(url, (req, res) => {
  res.json(message);
});

app.post("/api/transaction", async (req, res) => {
  try {
    // Check if all required fields are present in the request body
    if (
      !req.body.name ||
      !req.body.description ||
      !req.body.datetime ||
      !req.body.price
    ) {
      res.status(400).send("Missing required fields");
      return;
    }

    // Create a new transaction with the data from the request body
    const { name, description, datetime, price } = req.body;
    const transaction = await Transaction.create({
      name,
      description,
      datetime,
      price,
    });

    res.json(transaction);
  } catch (error) {
    console.error("Error creating a transaction:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/api/transaction", async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Close MongoDB connection on application shutdown
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('MongoDB connection is closed.');
    process.exit(0);
  });
});

app.listen(port, () => {
  console.log(`App listening on port http://localhost:${port}${url}`);
});
