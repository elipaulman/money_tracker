const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const Transaction = require("./models/Transaction.js");
const mongoose = require("mongoose");
const app = express();

dotenv.config();

const url = "/api/test";
const port = 4000;
const message = "test ok";

app.use(cors()); // Enable CORS

app.use(express.json());

const mongoURI = process.env.MONGO_URL;

// Connect to MongoDB
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB database.");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

app.get(url, (req, res) => {
  res.json(message);
});

app.post("/api/transaction", async (req, res) => {
  try {
    // Check if all required fields are present in the request body
    if (!req.body.name || !req.body.description || !req.body.datetime || !req.body.price) {
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
    console.error("Error creating transaction:", error);
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

// Static Port
app.listen(port, () => {
  console.log(`App listening on port http://localhost:${port}${url}`);
});
