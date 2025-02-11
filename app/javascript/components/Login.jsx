import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = ({ setUser }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // ✅ Attempt custom login first
      const customResponse = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include", // ✅ Required for session-based auth
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const customData = await customResponse.json();

      if (customResponse.ok) {
        // ✅ Store auth token from custom login
        localStorage.setItem("authHeaders", JSON.stringify(customData.token));
        setUser(customData.user);
        navigate("/");
        return;
      }

      // ✅ If custom login fails, fallback to Devise Token Auth
      const authResponse = await fetch("/auth/sign_in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include", // ✅ Ensure cookies are sent
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const authData = await authResponse.json();

      if (!authResponse.ok) {
        throw new Error(authData.errors ? authData.errors.join(" ") : "Invalid email or password");
      }

      // ✅ Extract authentication headers
      const authHeaders = {
        "access-token": authResponse.headers.get("access-token"),
        client: authResponse.headers.get("client"),
        uid: authResponse.headers.get("uid"),
        expiry: authResponse.headers.get("expiry"),
        token_type: authResponse.headers.get("token-type"),
      };

      // ✅ Store auth headers for future API requests
      localStorage.setItem("authHeaders", JSON.stringify(authHeaders));

      setUser(authData.data); // ✅ Save user info
      navigate("/");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto border rounded shadow-lg">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit}>
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
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          Login
        </button>
      </form>
      <p className="mt-4 text-sm">
        Don't have an account? <Link to="/signup" className="text-blue-500">Sign up</Link>
      </p>
    </div>
  );
};

export default Login;
