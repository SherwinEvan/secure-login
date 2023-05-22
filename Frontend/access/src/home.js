import axios from "axios";
import { useState } from "react";
import NavBar from "./components/navbar";
import "./index.css";
import Footer from "./components/footer";

export default function HomePage() {
  const [currUser, setCurrUser] = useState("Guest");

  axios
    .get("login/")
    .then((res) => {
      console.log(res.data);
      setCurrUser(res.data);
    })
    .catch((error) => {
      console.log(error.data);
    });

  return (
    <div class="flex flex-col h-screen justify-between">
      <NavBar />
      <div className="mb-auto">{currUser}</div>
      <Footer />
    </div>
  );
}
