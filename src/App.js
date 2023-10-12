import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [name, setName] = useState("");
  const [datetime, setDatetime] = useState("");
  const [description, setDescription] = useState("");
  const [transactions, setTransactions] = useState("");

  // Define the root URL for your API
  const apiUrl = "http://localhost:4000/api/transaction";

  useEffect(() => {
    getTransactions().then(setTransactions);
  }, []);

  async function getTransactions() {
    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
      throw error;
    }
  }

  function addNewTransaction(e) {
    e.preventDefault();

    const price = name.split(" ")[0];

    fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        price,
        name: name.substring(price.length + 1),
        description,
        datetime,
      })
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add transaction");
        }
        return response.json();
      })
      .then((json) => {
        setName("");
        setDatetime("");
        setDescription("");
        console.log("Result", json);
      })
      .catch((error) => {
        console.error("Failed to add transaction:", error);
      });
  }

  let balance = 0;
  for (const transaction of transactions) {
    balance = balance + transaction.price;
  }
  balance = balance.toFixed(2);

  return (
    <main>
      <h1>
        {balance}
        <span>.00</span>
      </h1>
      <form action="" onSubmit={addNewTransaction}>
        <div className="basic">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={"price and name"}
          />
          <input
            value={datetime}
            onChange={(e) => setDatetime(e.target.value)}
            type="datetime-local"
          />
        </div>
        <div className="description">
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={"description"}
          />
        </div>
        <button type="submit">Add new transaction</button>
      </form>
      <div className="transactions">
        {transactions.length > 0 &&
          transactions.map((transaction, index) => (
            <div key={index} className="transaction">
              <div className="left">
                <div className="name">{transaction.name}</div>
                <div className="description">{transaction.description}</div>
              </div>
              <div className="right">
                <div
                  className={"price " + (transaction.price < 0 ? "red" : "green")}
                >
                  {transaction.price}
                </div>
                <div className="datetime">{transaction.datetime}</div>
              </div>
            </div>
          ))}
      </div>
    </main>
  );
}

export default App;
