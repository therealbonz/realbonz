import React, { useEffect, useState } from 'react';
import MediaUpload from './MediaUpload';
import MediaGallery from './MediaGallery';

const App = () => {
  const [media, setMedia] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchMedia = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('/media', {
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch media: ${response.statusText}`);
      }

      const data = await response.json();
      // Sort by the most recent upload at the top
      setMedia(data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
    } catch (error) {
      console.error('Error fetching media:', error);
      setErrorMessage(`Error loading media: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (data) => {
    setErrorMessage('');
    fetchMedia(); // Re-fetch the media after the upload is complete
  };

  useEffect(() => {
    fetchMedia(); // Fetch media when the component mounts
  }, []);

  return (
    <div>
      <h1>Media Upload</h1>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <MediaUpload onUpload={handleUpload} />
      {isLoading ? <p>Loading media...</p> : <MediaGallery media={media} />}
    </div>
  );
};

export default App;
