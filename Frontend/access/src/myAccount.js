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
      <div className="flex-col mt-10 mx-10 pt-4 shadow">
        <span className="flex text-3xl font-bold justify-center">Manage you account</span>
        <div className="flex justify-center mb-auto">
          <div className="p-10 m-10 shadow items-center font-semibold text-lg">
            <div className="flex mb-5 justify-center">Your Account</div>
            <div className="flex mb-5 justify-center">
              <TextField
                disabled
                id="outlined-disabled"
                label="Username"
                fullWidth
                value={currUser}
              />
            </div>
            <div className="flex mb-5 justify-center">
              <div
                style={{ display: "flex", maxWidth: "300px", width: "100%" }}
              >
                <TextField
                  disabled
                  id="outlined-disabled"
                  label="Email"
                  value={email}
                />
              </div>
            </div>
          </div>
          <div>
            <div className="p-10 m-10 shadow items-center font-semibold text-lg">
              <div className="flex mb-5 justify-center">
                Change your password
              </div>
              <div className="flex mb-5 justify-center">
                <TextField
                  id="outlined"
                  type="password"
                  label="Old Password"
                  fullWidth
                  placeholder="Enter your old password"
                />
              </div>
              <div className="flex mb-5 justify-center">
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
        </div>
        <div className="p-10 shadow items-center font-semibold text-lg">
          <div className="flex mb-5 justify-center">
            <Button variant="outlined" size='large' color="error">
              Delete your account
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
