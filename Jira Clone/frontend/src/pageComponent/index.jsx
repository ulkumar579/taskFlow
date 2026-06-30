import { Button } from "@/components/ui/button";
import "../styles/loginpage.css";
import GoogleSvg from "./googleSvg";
import Logo from "./logoSvg";
import Login from "./LoginComponent/Login";
import Signup from "./signupComponent/Signup";
import { Link, useLocation } from "react-router-dom";
// import { useState } from "react";
const LoginComponent = () => {
  const location = useLocation();
  const route = location.pathname;
  // const [loginOrSignup,setLoginOrSignup] = useState(false)

  return (
    <div className="mainContainer py-10">
      <div className="container m-auto">
        <div className="brandLogo">
          <div className="loginLogo m-auto flex w-full justify-center gap-4 p-15">
            <Logo />
            <p className="text-2xl font-medium">TaskFlow</p>
          </div>
        </div>
        <div className="loginFormContainer p-12 m-auto min-w-[450px] w-[450px] flex flex-col gap-5">
          <div className="logintext">
            <p className="font-medium text-[20px]">Welcome Back</p>
            <p className="font-normal text-[16px] text-gray-500">
              Login to your account
            </p>
          </div>

          <Login />

          <div className="forgotAndSignup flex flex-col gap-5">
            <p className="m-auto text-[14px]">Forgot password?</p>
            <p className="m-auto text-[14px]">
              {" "}
              <span className="text-gray-500">Don't have an account?</span>{" "}
              {route === "/login" ? (
                <span
                  onClick={() => {
                    return <Link to="/signup" />;
                  }}
                >
                  Signup
                </span>
              ) : (
                <span
                  onClick={() => {
                    return <Link to="/login" />;
                  }}
                >
                  Login
                </span>
              )}
            </p>
          </div>
          <div className="googleSSO">
            <Button className="w-full bg-transparent border text-black py-5 flex gap-5 hover:bg-gray-200">
              <GoogleSvg /> Continue with Google
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
