import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../styles/loginpage.css";
import GoogleSvg from "./googleSvg";
import Logo from "./logoSvg";
import { useEffect } from "react";
import axios from "axios";
import { Controller, useForm } from "react-hook-form";
const Login = () => {
  const location = useLocation();
  const route = location.pathname;
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    control,
  } = useForm();

  const handleGoogleResponse = async (response) => {
    // response.credential = Google ID token
    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/googleLogin",
        { credential: response.credential },
      );
      sessionStorage.setItem("accessToken", res.data.token);
      navigate("/");
    } catch (err) {
      console.error("Google login failed", err);
    }
  };

  useEffect(() => {
    window.google.accounts.id.initialize({
      client_id:
        "239885194426-jdgurkrut4r1h8vclv5jiv9qhml2scej.apps.googleusercontent.com",
      callback: handleGoogleResponse,
    });

    window.google.accounts.id.renderButton(
      document.getElementById("google-signin"),
      { theme: "outline", size: "large" },
    );
  }, []);

  const onSubmit = async (data) => {
    try {
      const res = await axios.post("http://localhost:5000/api/users/login", {
        email: data?.userEmail,
        password: data?.userPassword,
      });
      if(res.status === 200 && res.data.success && res.data.token){
        sessionStorage.setItem("accessToken",res.data.token)
        navigate("/home")
      }
    } catch (error) {
      console.log(error);
    }
  };

  // console.log(watch("userEmail"),errors);

  const handleLoginWithEmail = async () => {};

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

          <div className="loginForm">
            <form onSubmit={handleSubmit(onSubmit)}>
              <FieldSet>
                <FieldGroup className="">
                  <Field className="flex gap-1">
                    <FieldLabel>Email</FieldLabel>
                    <Input
                      name="userEmail"
                      className="bg-gray-100 border-none py-5"
                      type="email"
                      placeholder="Enter you email"
                      {...register("userEmail")}
                    />
                  </Field>
                  <Field className="flex gap-1">
                    <FieldLabel>Password</FieldLabel>
                    <Input
                      name="userPassword"
                      className="bg-gray-100 border-none py-5"
                      type="password"
                      placeholder="Enter your password"
                      {...register("userPassword")}
                    />
                  </Field>
                  <Field
                    orientation="horizontal"
                    className="flex items-center gap-2"
                  >
                    <Controller
                      name="rememberMe"
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(value) => field.onChange(value)}
                          className="bg-gray-100"
                        />
                      )}
                    />
                    <FieldLabel>Remember me</FieldLabel>
                  </Field>
                  <Field orientation="horizontal">
                    <Button
                      type="submit"
                      className="w-full py-5"
                      onClick={handleLoginWithEmail}
                    >
                      Login
                    </Button>
                  </Field>
                </FieldGroup>
              </FieldSet>
            </form>
          </div>

          <div className="forgotAndSignup flex flex-col gap-5">
            {route === "/login" ? (
              <p className="m-auto text-[14px]">Forgot password?</p>
            ) : (
              <p>this is other</p>
            )}
            <p className="m-auto text-[14px]">
              {" "}
              <span className="text-gray-500">Don't have an account?</span>{" "}
              <Link to="/signup">
                <span>Signup</span>
              </Link>
            </p>
          </div>
          <div className="googleSSO">
            {/* <div id="google-signin" className="w-full bg-transparent border text-black py-5 flex gap-5 hover:bg-gray-200">
              <GoogleSvg /> Continue with Google
            </div> */}
            <div id="google-signin"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
