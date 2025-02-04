import React, { useState } from 'react';

const MediaUpload = ({ onUpload }) => {
  const [files, setFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (event) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles) return;

    const newFiles = Array.from(selectedFiles);
    setFiles(newFiles);

    // Generate preview URLs for selected files
    const newPreviewUrls = newFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls(newPreviewUrls);

    setErrorMessage(''); // Clear previous errors
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFiles = event.dataTransfer.files;
    if (!droppedFiles) return;

    const newFiles = Array.from(droppedFiles);
    setFiles(newFiles);

    // Generate preview URLs for dropped files
    const newPreviewUrls = newFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls(newPreviewUrls);

    setErrorMessage(''); // Clear previous errors
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleUpload = async () => {
    if (!files.length) {
      setErrorMessage('No files selected. Please choose files.');
      return;
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append('media[file][]', file); // Handle multiple files
    });

    setIsUploading(true);
    setErrorMessage('');

    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
      if (!csrfToken) {
        throw new Error('CSRF token not found. Please refresh the page.');
      }

      const response = await fetch('/media', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.errors ? errorData.errors.join(', ') : 'Upload failed');
      }

      const data = await response.json();
      onUpload(data); // Notify parent component of the new upload
      setFiles([]); // Clear the file input
      setPreviewUrls([]); // Clear preview images
    } catch (error) {
      console.error('Error uploading files:', error);
      setErrorMessage(`Upload failed: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      style={{
        border: '2px dashed #ccc',
        padding: '20px',
        textAlign: 'center',
        backgroundColor: '#f9f9f9',
        borderRadius: '5px',
      }}
    >
      <input
        type="file"
        accept="image/*,video/*,image/bmp,image/gif,image/png,image/jpeg" // Include .bmp, .gif, .png, .jpg, .jpeg
        multiple
        onChange={handleFileChange}
        style={{ display: 'none' }} // Hide file input
        id="file-input"
      />
      <label htmlFor="file-input" style={{ cursor: 'pointer' }}>
        <p>Drag and drop files here, or click to select files</p>
      </label>
      {previewUrls.length > 0 && (
        <div>
          <h3>Preview:</h3>
          {previewUrls.map((previewUrl, index) => {
            const file = files[index];
            if (file.type.startsWith('video/')) {
              return (
                <div key={index}>
                  <video controls width="250">
                    <source src={previewUrl} type={file.type} />
                    Your browser does not support the video tag.
                  </video>
                </div>
              );
            } else if (file.type.startsWith('image/')) {
              return (
                <div key={index}>
                  <img src={previewUrl} alt="Preview" style={{ width: '250px', height: 'auto' }} />
                </div>
              );
            }
          })}
        </div>
      )}
      <button onClick={handleUpload} disabled={!files.length || isUploading}>
        {isUploading ? 'Uploading...' : 'Upload'}
      </button>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
};

export default MediaUpload;
