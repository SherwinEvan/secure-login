import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import axios from "axios";
import SignUp from './signup';
import Login from './login';
import HomePage from './home';

axios.defaults.baseURL="http://localhost:8080/";
axios.defaults.withCredentials = true;

export default function RouteApp() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RouteApp />
);

