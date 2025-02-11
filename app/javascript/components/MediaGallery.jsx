import React, { useState } from "react";
import Masonry from "react-masonry-css";
import "../components/media.css"; // Ensure the CSS file is correctly linked

const MediaGallery = ({ media, setMedia }) => {
  const [selectedMedia, setSelectedMedia] = useState(null);

  const handleDelete = async (mediaId) => {
    if (!window.confirm("Are you sure you want to delete this media?")) return;

    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
      const response = await fetch(`/media/${mediaId}`, {
        method: "DELETE",
        headers: {
          "X-CSRF-Token": csrfToken,
          "Accept": "application/json",
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete media");
      }

      // Remove deleted media from state
      setMedia((prevMedia) => prevMedia.filter((item) => item.id !== mediaId));
      setSelectedMedia(null);
    } catch (error) {
      console.error("Error deleting media:", error);
      alert(error.message);
    }
  };

  return (
    <>
      {/* Masonry Grid */}
      <Masonry
        breakpointCols={{ default: 4, 1100: 3, 700: 2, 500: 1 }}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {media.map((item) => (
          <div key={item.id} className="media-item" onClick={() => setSelectedMedia(item)}>
            {item.file?.content_type?.startsWith("video/") ? (
              <video controls className="media-content">
                <source src={item.file.url} type={item.file.content_type} />
              </video>
            ) : (
              <img src={item.file?.url} alt="Media" className="media-content" />
            )}
            <div className="media-overlay">{item.title}</div>
          </div>
        ))}
      </Masonry>

      {/* Popup Modal */}
      {selectedMedia && (
        <div className="popup-overlay" onClick={() => setSelectedMedia(null)}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={() => setSelectedMedia(null)}>✖</button>

            {selectedMedia.file?.content_type?.startsWith("video/") ? (
              <video controls className="popup-media">
                <source src={selectedMedia.file.url} type={selectedMedia.file.content_type} />
              </video>
            ) : (
              <img src={selectedMedia.file.url} alt="Preview" className="popup-media" />
            )}

            <div className="button-container">
              <button className="like-button">👍 Like</button>
              <button className="delete-button" onClick={() => handleDelete(selectedMedia.id)}>
                ❌ Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MediaGallery;
