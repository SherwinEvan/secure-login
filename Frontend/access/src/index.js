import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import axios from "axios";
import SignUp from './signup';
import Login from './login';
import HomePage from './home';
import { ToastContainer } from 'react-toastify';
import ReadPDF from './readPDF';
import MyAccount from './myAccount';
import ForgotPassword from './forgotPassword';

axios.defaults.baseURL="http://localhost:8080/";
axios.defaults.withCredentials = true;

export default function RouteApp() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/account" element={<MyAccount />} />
        <Route path="/read" element={<ReadPDF />} />
      </Routes>
    </Router>
    <ToastContainer />
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RouteApp />
);

