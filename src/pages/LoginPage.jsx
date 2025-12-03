import React, { useState } from "react";
import { Form, NavLink, redirect, useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import Button from "../components/Button";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await login(username, password);
      return navigate("/");
    } catch (error) {
      console.log(error.response?.data?.detail);
      setErrors(error.response?.data?.detail);
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <Form
        className="w-130 h-130 border border-gray-300 rounded-lg flex flex-col justify-center items-center gap-5 p-8"
        method="post"
        onSubmit={handleSubmit}
      >
        {/* {errors.length > 0 && (
          <div className="w-full text-red-900 bg-red-200 text-center mb-5 p-2">
            {errors.map((error) => (
              <p key={error[0]}>{error[0] + " " + error[1]}</p>
            ))}
          </div>
        )} */}

        {errors && (
          <div className="w-full text-red-900 bg-red-200 text-center mb-5 p-2">
            {errors}
          </div>
        )}

        <div className="text-4xl text-center font-bold mb-5">Sign In</div>

        <div className="w-full px-3 py-2 rounded-lg border border-gray-300">
          <input
            className="focus:outline-none w-full"
            name="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="w-full px-3 py-2 rounded-lg border border-gray-300">
          <input
            type="password"
            className="focus:outline-none w-full"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <Button primary rounded type="submit">
          Sign In
        </Button>

        <div className="text-center mt-3">
          Create An Account{" "}
          <NavLink className="text-blue-300 font-medium" to="/register">
            Sign Up
          </NavLink>
        </div>
      </Form>
    </div>
  );
};

export default LoginPage;
