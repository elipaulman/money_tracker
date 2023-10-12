const express = require("express");
const cors = require("cors");
app.use(cors({ origin: "http://localhost:3000" }));
require("dotenv").config();
const Transaction = require("./models/Transaction.js");
const mongoose = require("mongoose");
const app = express();

const url = "/api/test";
const port = 4000;
const message = "test ok";

app.use(cors());
app.use(express.json());

app.get(url, (req, res) => {
  res.json(message);
});

app.post("/api/transaction", async (req, res) => {
  try {
    console.log("Connecting to MongoDB database...");
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("MongoDB database connected successfully!");

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
    console.error("Error connecting to MongoDB database:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/api/transaction", async (req, res) => {
  await mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const transactions = await Transaction.find();
  res.json(transactions);
});

// Close MongoDB connection on application shutdown
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('MongoDB connection is closed.');
    process.exit(0);
  });
});

// Static Port
app.listen(port);
console.log(`App listening on port http://localhost:${port}${url}`);
