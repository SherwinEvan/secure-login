import React, { useEffect, useState } from "react";
import { TextField, Button } from "@mui/material";
import { toast } from "react-toastify";
import NavBar from "./components/navbar";
import Footer from "./components/footer";
import useRememberMe from "./service/rememberMe";
import GetUser from "./service/getUser";
import axios from "axios";

export default function MyAccount() {
  useRememberMe();

  const [currUser, setCurrUser] = useState("Guest");
  const [email, setEmail] = useState("NoEmail");

  useEffect(() => {
    async function checkUserStatus() {
      const user = await GetUser();
      setCurrUser(user);
      getEmail();
      if (user === "Guest" || user === "Error") {
        toast.error(<div>You are not logged in!</div>, {
          position: "top-center",
          autoClose: 2500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        //setTimeout(() => (window.location = "/login"), 2250);
      }
    }
    checkUserStatus();
  }, []);

  const getEmail = async () => {
    const email = await axios.get("login/email");
    setEmail(email.data);
  };

  return (
    <div className="flex flex-col h-screen justify-between">
      <NavBar />
      <span className="flex text-2xl pt-5 md:pt-8 md:text-3xl font-bold justify-center">
        Manage your account
      </span>
      <div className="flex-col mt-4 mb-8 mx-5 shadow">
        <div className="flex flex-col md:flex-row justify-center mb-auto">
          <div className="p-6 md:m-10 shadow items-center font-semibold text-lg md:p-10 md:text-lg w-full md:w-auto">
            <div className="flex mb-5 justify-center">Your Account</div>
            <div className="mb-3">
              <TextField
                disabled
                id="outlined-disabled"
                label="Username"
                fullWidth
                value={currUser}
              />
            </div>
            <div className="mb-3">
              <TextField
                disabled
                id="outlined-disabled"
                label="Email"
                fullWidth
                value={email}
              />
            </div>
          </div>
          <div className="p-6 md:m-10 shadow items-center font-semibold text-lg md:p-10 md:text-lg w-full md:w-auto">
            <div className="flex mb-5 justify-center">Change your password</div>
            <div className="mb-3">
              <TextField
                id="outlined"
                type="password"
                label="Old Password"
                fullWidth
                placeholder="Enter your old password"
              />
            </div>
            <div className="mb-3">
              <TextField
                id="outlined"
                type="password"
                label="New Password"
                fullWidth
                placeholder="Enter a new password"
              />
            </div>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Reset Password
            </Button>
          </div>
        </div>
        <div className="p-5 shadow items-center font-semibold text-base md:text-lg">
          <div className="flex mb-3 justify-center">
            <Button variant="outlined" size="large" color="error">
              Delete your account
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
