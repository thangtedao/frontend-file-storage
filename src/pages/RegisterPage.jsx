import React, { useState } from "react";
import { Form, NavLink, useNavigate } from "react-router-dom";
import { register } from "../services/authService";
import Button from "../components/Button";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [errors, setErrors] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await register({ username, email, password, confirmPassword });
      navigate("/login");
    } catch (error) {
      console.log(error);
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
        {errors && (
          <div className="w-full text-red-900 bg-red-200 text-center mb-5 p-2">
            {errors}
          </div>
        )}

        <div className="text-4xl text-center font-bold mb-5">Sign Up</div>

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
            className="focus:outline-none w-full"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

        <div className="w-full px-3 py-2 rounded-lg border border-gray-300">
          <input
            type="password"
            className="focus:outline-none w-full"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setconfirmPassword(e.target.value)}
          />
        </div>

        <Button primary rounded type="submit">
          Sign Up
        </Button>

        <div className="text-center mt-3">
          Already have an Account{" "}
          <NavLink className="text-blue-300 font-medium" to="/login">
            Sign In
          </NavLink>
        </div>
      </Form>
    </div>
  );
};

export default RegisterPage;
