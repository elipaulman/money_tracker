import { useState, useEffect } from "react";
import './App.css';

function App() {
  const [name, setName] = useState("");
  const [datetime, setDatetime] = useState("");
  const [description, setDescription] = useState("");
  const [transactions, setTransactions] = useState([]); 

  useEffect(() => {
    getTransactions().then(setTransactions);
  }, []);

  async function getTransactions() {
    const url = "http://localhost:4000/api/transaction";
    const response = await fetch(url);
    return await response.json();
  }

  function addNewTransaction(e) {
    e.preventDefault();
    const url = "http://localhost:4000/api/transaction";

    const price = name.split(" ")[0];

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        price,
        name: name.substring(price.length + 1),
        description,
        datetime,
      }),
    }).then((response) => {
      response.json().then((json) => {
        setName("");
        setDatetime("");
        setDescription("");
        console.log("result", json);
        getTransactions().then(setTransactions);
      });
    });
  }

  const formatDateTime = (isoDateTime) => {
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(new Date(isoDateTime));
  };

  let balance = 0;
  for (const transaction of transactions) {
    balance = balance + transaction.price;
  }
  balance = balance.toFixed(2);

  return (
    <main>
      <h1>
        <span>$</span>
        {balance}
      </h1>
      <form action="" onSubmit={addNewTransaction}>
        <div className="basic">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={"+/- Amount & Name"}
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
            placeholder={"Description"}
          />
        </div>
        <button type="submit">Add transaction</button>
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
                  className={
                    "price " + (transaction.price < 0 ? "red" : "green")
                  }
                >
                  {transaction.price >= 0 ? `+${transaction.price}` : transaction.price}
                </div>
                <div className="datetime">{formatDateTime(transaction.datetime)}</div>
              </div>
            </div>
          ))}
      </div>
    </main>
  );
}

export default App;
