import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Link, useLocation } from "react-router-dom";
import "../../styles/loginpage.css";
import GoogleSvg from "../LoginComponent/googleSvg";
import Logo from "../LoginComponent/logoSvg";
import { Controller, useForm } from "react-hook-form";
const Signup = () => {
  const location = useLocation();
  const { register, control, handleSubmit } = useForm();
  const route = location.pathname;

  const onSubmit = (data) => {
    console.log(data);
  };
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
            <form action="" onSubmit={handleSubmit(onSubmit)}>
              <FieldSet>
                <FieldGroup className="">
                  <Field className="flex gap-1">
                    <FieldLabel>Full name</FieldLabel>
                    <Input
                      className="bg-gray-100 border-none py-5"
                      type="text"
                      placeholder="Enter you full name"
                      name="fullName"
                      {...register("fullName")}
                    />
                  </Field>
                  <Field className="flex gap-1">
                    <FieldLabel>Email</FieldLabel>
                    <Input
                      className="bg-gray-100 border-none py-5"
                      type="email"
                      placeholder="Enter you email"
                      {...register("email")}
                    />
                  </Field>

                  <Field className="flex gap-1">
                    <FieldLabel>Password</FieldLabel>
                    <Input
                      className="bg-gray-100 border-none py-5"
                      type="password"
                      placeholder="Create a password"
                      {...register("password")}
                    />
                  </Field>
                  <Field className="flex gap-1">
                    <FieldLabel>Confirm Password</FieldLabel>
                    <Input
                      className="bg-gray-100 border-none py-5"
                      type="password"
                      placeholder="re-enter your password"
                      {...register("confirmPassword")}
                    />
                  </Field>
                  <Field orientation="horizontal">
                    <Controller
                      name="iAgree"
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(value) => field.onChange(value)}
                          className="bg-gray-100"
                        />
                      )}
                    />

                    <FieldLabel>
                      I agree to the Terms and Conditions and Privacy Policy
                    </FieldLabel>
                  </Field>

                  <Field orientation="horizontal">
                    <Button type="submit" className="w-full py-5">
                      Create account
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
              <></>
            )}
            <p className="m-auto text-[14px]">
              {" "}
              <span className="text-gray-500">Don't have an account?</span>{" "}
              <Link to="/login">
                <span>Login</span>
              </Link>
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

export default Signup;
