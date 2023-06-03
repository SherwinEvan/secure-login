import React, { useEffect, useState } from "react";
import { TextField, Button } from "@mui/material";
import { IconButton } from "@mui/material";
import { toast } from "react-toastify";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useForm, Controller } from "react-hook-form";
import NavBar from "./components/navbar";
import Footer from "./components/footer";
import useRememberMe from "./service/rememberMe";
import GetUser from "./service/getUser";
import axios from "axios";

export default function MyAccount() {
  useRememberMe();

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    reset
  } = useForm();

  const [currUser, setCurrUser] = useState("Guest");
  const [email, setEmail] = useState("NoEmail");
  const [showCurrPassword, setShowCurrPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

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

  const handleToggleCurrPassword = () => {
    setShowCurrPassword(!showCurrPassword);
  };

  const handleToggleNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };

  const validatePassword = (value) => {
    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;
    const specialCharactersRegex = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/;
    const digitRegex = /\d/;

    if (!uppercaseRegex.test(value)) {
      return "At least one uppercase character is required.";
    }

    if (!specialCharactersRegex.test(value)) {
      return "At least one special character is required.";
    }

    if (!lowercaseRegex.test(value)) {
      return "At least one lowercase character is required.";
    }

    if (!digitRegex.test(value)) {
      return "At least one digit is required.";
    }

    if(getValues("currentPassword") === value) {
      return "New password must be different.";
    }

    return true;
  };

  const onSubmit = async (data) => {
    console.log(data);

    if (
      !/^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])(?=.*\d).{8,127}$/.test(
        data.currentPassword
      )
    ) {
      toast.error(<div>Invalid current password!</div>, {
        position: "top-center",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } else {
      try {
        const formData = {
          email: email,
          oldPassword: getValues("currentPassword"),
          newPassword: getValues("newPassword"),
        };

        console.log(formData);

        const response = await axios.post("/auth/changePassword", formData);
        await toast.promise(Promise.resolve(response), {
          pending: "Authenticating...",
          success: response.data,
          error: response.data,
          position: "top-center",
          autoClose: 2750,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } catch (error) {
        console.log(error);
        toast.error(
          <div>
            Server error! <br /> Please try again later.
          </div>,
          {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          } 
        );
      } finally {
        reset({
          currentPassword: "",
          newPassword: ""
        });
      }
    }
  };

  return (
    <div className="flex flex-col h-screen justify-between">
      <NavBar />
      <span className="flex text-2xl pt-3 md:pt-8 md:text-3xl font-bold justify-center">
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
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-3">
                <Controller
                  name="currentPassword"
                  control={control}
                  rules={{
                    required: "Password is required.",
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      name="currentPassword"
                      label="Current Password"
                      id="currentPassword"
                      autoComplete="new-password"
                      type={showCurrPassword ? "text" : "password"}
                      error={!!errors.currentPassword}
                      helperText={errors.currentPassword?.message}
                      InputProps={{
                        endAdornment: (
                          <IconButton
                            onClick={handleToggleCurrPassword}
                            edge="end"
                          >
                            {showCurrPassword ? (
                              <VisibilityOffIcon />
                            ) : (
                              <VisibilityIcon />
                            )}
                          </IconButton>
                        ),
                      }}
                    />
                  )}
                />
              </div>
              <div className="mb-3">
                <Controller
                  name="newPassword"
                  control={control}
                  rules={{
                    required: "Enter a new password.",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters.",
                    },
                    validate: validatePassword,
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      name="newPassword"
                      label="New Password"
                      id="newPassword"
                      autoComplete="new-password"
                      type={showNewPassword ? "text" : "password"}
                      error={!!errors.newPassword}
                      helperText={errors.newPassword?.message}
                      InputProps={{
                        endAdornment: (
                          <IconButton
                            onClick={handleToggleNewPassword}
                            edge="end"
                          >
                            {showNewPassword ? (
                              <VisibilityOffIcon />
                            ) : (
                              <VisibilityIcon />
                            )}
                          </IconButton>
                        ),
                      }}
                    />
                  )}
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
            </form>
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
