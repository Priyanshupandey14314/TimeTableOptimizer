import React, { useEffect, useState } from "react";
import axios from "axios";
import "tailwindcss";
import Navbar from "./components/Navbar";
function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get("http://localhost:8080/api/hello")
      .then(response => {
        setMessage(response.data);
      })
      .catch(error => {
        console.error("There was an error!", error);
      });
  }, []);

  return (
  //   <div style={{ textAlign: "center", marginTop: "50px" }}>
  //     <h1 className="text-3xl font-bold red underline">
  //   SpringBoot+React
  // </h1>
  //     <p>Message from backend:</p>
  //     <h2>{message}</h2>
  //   </div>
  <Navbar/>
  );
}

export default App;
