import React, { useEffect, useState } from "react";
import axios from "axios";
import "tailwindcss";
import Navbar from "./components/Navbar";
function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get("/api/subjects")
      .then(response => {
        setMessage("Connected! Found " + response.data.length + " subjects.");
        console.log(response.data);
      })
      .catch(error => {
        console.error("There was an error!", error);
        setMessage("Error connecting to backend: " + error.message);
      });
  }, []);

  return (
    <div>
      <Navbar />
      <div className="p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Time Table Optimizer</h1>
        <p className="text-lg">{message}</p>
      </div>
    </div>
  );
}

export default App;
