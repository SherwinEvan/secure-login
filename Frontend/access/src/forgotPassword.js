import axios from "axios";
import { useState, useEffect } from "react";
import NavBar from "./components/navbar";
import Footer from "./components/footer";
import useRememberMe from "./service/rememberMe";

export default function HomePage() {
  useRememberMe();
  useEffect(DeleteSessionCookie);

  return (
    <div class="flex flex-col h-screen justify-between">
      <NavBar />
      <div className="mb-auto"></div>
      <Footer />
    </div>
  );
}