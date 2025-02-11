import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Signup = ({ setUser }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    // Wrap the form data in a `registration` key to match the expected backend format
    const payload = { registration: formData };

    try {
      const response = await fetch("/register", {  // Make sure this is the correct endpoint
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').content,
        },
        body: JSON.stringify(payload), // Send the wrapped data
      });

      const responseData = await response.json(); // Always parse JSON

      if (!response.ok) {
        console.log("Error Response:", responseData);

        // Extract error messages from the response
        let errorMessages = "Signup failed. Please check your details.";

        if (responseData.errors) {
          if (Array.isArray(responseData.errors)) {
            errorMessages = responseData.errors.join(" ");
          } else if (typeof responseData.errors === "object") {
            errorMessages = Object.values(responseData.errors).flat().join(" ");
          }
        }

        throw new Error(errorMessages);
      }

      setUser(responseData); // Set user data
      navigate("/"); // Redirect to home after signup
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto border rounded shadow-lg">
      <h2 className="text-xl font-bold mb-4">Sign Up</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-bold">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold">Confirm Password</label>
          <input
            type="password"
            name="password_confirmation"
            value={formData.password_confirmation}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          Sign Up
        </button>
      </form>
      <p className="mt-4 text-sm">
        Already have an account? <Link to="/login" className="text-blue-500">Login</Link>
      </p>
    </div>
  );
};

export default Signup;
