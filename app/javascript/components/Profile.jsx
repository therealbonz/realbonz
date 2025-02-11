import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Profile = ({ user }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login"); // Redirect to login page if user is null
    }
  }, [user, navigate]);

  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    password: "",
    profilePicture: null,
    preview: user?.profile_picture_url || ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profilePicture: file, preview: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("user[username]", formData.username);
    data.append("user[email]", formData.email);
    if (formData.password) {
      data.append("user[password]", formData.password);
    }
    if (formData.profilePicture) {
      data.append("user[profile_picture]", formData.profilePicture);
    }

    const token = localStorage.getItem('token'); // Retrieve token from localStorage

    try {
      const response = await fetch("/users/update_profile", {
        method: "PUT",
        body: data,
        headers: {
          "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').content,
          "Authorization": `Bearer ${token}`, // Add the token to the headers
        },
      });

      if (response.ok) {
        alert("Profile updated successfully!");
        window.location.reload();
      } else {
        alert("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (!user) return null; // Prevent rendering if user is not loaded yet

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto border rounded shadow-lg">
      <div className="mb-4">
        <label className="block text-sm font-bold">Username</label>
        <input type="text" name="username" value={formData.username} onChange={handleChange} className="w-full p-2 border rounded" required />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-bold">Email</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded" required />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-bold">Password</label>
        <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Leave blank to keep current password" />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-bold">Profile Picture</label>
        <input type="file" name="profile_picture" onChange={handleFileChange} className="w-full p-2 border rounded" />
        {formData.preview && <img src={formData.preview} alt="Profile Preview" className="mt-2 w-20 h-20 rounded-full" />}
      </div>
      <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Update Profile</button>
    </form>
  );
};

export default Profile;
