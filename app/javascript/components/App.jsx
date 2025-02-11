import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Correct import for BrowserRouter
import NavBar from './NavBar';
import MediaUpload from './MediaUpload';
import MediaGallery from './MediaGallery';
import Profile from './Profile';
import Login from './Login';
import SignUp from './SignUp';

const App = () => {
  const [media, setMedia] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isUserLoading, setIsUserLoading] = useState(true);

  // Fetch user data from API or localStorage
  const fetchUser = async () => {
    setIsUserLoading(true);
    try {
      const savedUser = localStorage.getItem('user');
      const savedToken = localStorage.getItem('token'); // Retrieve token from localStorage

      if (savedUser && savedToken) {
        setUser(JSON.parse(savedUser));
        setIsUserLoading(false);
        return;
      }

      const response = await fetch('/current_user', {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${savedToken}` // Include token in the header
        }
      });

      if (!response.ok) {
        throw new Error("Not logged in");
      }

      const userData = await response.json();
      setUser(userData);
      // Save user data and token to localStorage for future use
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', savedToken);
    } catch (error) {
      console.error("Error fetching user:", error);
      setUser(null);
    } finally {
      setIsUserLoading(false);
    }
  };

  // Fetch media data
  const fetchMedia = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('/media', {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Include token for media request
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch media: ${response.statusText}`);
      }

      const data = await response.json();
      setMedia(data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
    } catch (error) {
      console.error('Error fetching media:', error);
      setErrorMessage(`Error loading media: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
    fetchUser();
  }, []);

  return (
    <Router>
      {/* Wrap the entire app in Router */}
      <NavBar profileImage={user?.profile_picture_url || "/path/to/default/profile.png"} user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={
          <div>
            <h1>Media Gallery</h1>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            <MediaUpload onUpload={fetchMedia} />
            {isLoading ? <p>Loading media...</p> : <MediaGallery media={media} setMedia={setMedia} />}
          </div>
        } />
        <Route path="/profile" element={isUserLoading ? <p>Loading user...</p> : <Profile user={user} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<SignUp setUser={setUser} />} />
        <Route path="*" element={<h1>Page Not Found</h1>} />
      </Routes>
    </Router>
  );
};

export default App;
