import React from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';

const NavBar = ({ profileImage, user, setUser }) => {
  const navigate = useNavigate(); // Hook for navigation

  const handleLogout = () => {
    // Clear user data and token from localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');

    // Update user state to null (logged out)
    setUser(null);

    // Redirect to the login page
    navigate('/login');
  };

  return (
    <StyledNavBar>
      <div className="nav-container">
        <Link to="/" className="home-button">Home</Link>
        {user ? (
          <>
            <Link to="/profile" className="profile-circle">
              <img src={profileImage || '/default-profile.jpg'} alt="Profile" width="30" height="30" style={{ borderRadius: '50%' }} />
            </Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </>
        )}
      </div>
    </StyledNavBar>
  );
};

const StyledNavBar = styled.div`
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;

  .nav-container {
    display: flex;
    background-color: rgba(245, 73, 144, 0.8);
    padding: 6px 15px;
    border-radius: 12px;
    box-shadow: rgba(0, 0, 0, 0.25) 0px 3px 10px,
      rgba(245, 73, 144, 0.4) 2px 5px 10px;
    align-items: center;
    gap: 10px;
  }

  .home-button {
    background-color: blue;
    color: white;
    text-decoration: none;
    padding: 6px 12px;
    border-radius: 15px;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    transition: transform 0.2s ease;
  }

  .home-button:hover {
    transform: translateY(-2px);
  }

  .profile-circle {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: white;
    border: 1.5px solid rgba(0, 0, 0, 0.2);
  }

  .profile-circle img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  button {
    background-color: red;
    color: white;
    border: none;
    padding: 6px 12px;
    border-radius: 12px;
    cursor: pointer;
  }

  button:hover {
    background-color: darkred;
  }
`;

export default NavBar;
