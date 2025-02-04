import React, { useState } from "react";
import Masonry from "react-masonry-css";
import media from "../components/media.css";

const MediaGallery = ({ media }) => {
  const [showPopup, setShowPopup] = useState(null); // State to track which item has an active popup

  const handlePopupToggle = (id) => {
    setShowPopup(showPopup === id ? null : id); // Toggle popup visibility for the clicked item
  };

  const handleLike = (id) => {
    // Handle like action (you can add your logic here)
    console.log(`Liked media with id: ${id}`);
  };

  const handleDelete = (id) => {
    // Handle delete action (you can add your logic here)
    console.log(`Deleted media with id: ${id}`);
  };

  return (
    <div>
      <Masonry
        breakpointCols={{
          default: 4, // Default 4 columns
          1100: 3,    // 3 columns for medium screens
          700: 2,     // 2 columns for small screens
          500: 1,     // 1 column for very small screens
        }}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {media.map((item) => {
          if (!item.file) {
            return (
              <div key={item.id} className="media-item">
                <p>Error: Missing file data</p>
              </div>
            );
          }

          return (
            <div key={item.id} className="media-item" onClick={() => handlePopupToggle(item.id)}>
              {item.file?.content_type?.startsWith("video/") ? (
                <video controls style={{ width: "100%", height: "auto" }}>
                  <source src={item.file.url} type={item.file.content_type} />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img
                  src={item.file?.url}
                  alt={item.title || "Media"}
                  style={{ width: "100%", height: "auto" }}
                />
              )}
            </div>
          );
        })}
      </Masonry>

      {/* Transparent Modal Popup */}
      {showPopup && (
        <div className="modal-overlay" onClick={() => setShowPopup(null)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()} // Prevent closing the modal when clicking inside the content
          >
            <div className="modal-header">
              <button className="close-button" onClick={() => setShowPopup(null)}>X</button>
            </div>
            <div className="modal-body">
              {media.map((item) => {
                if (item.id === showPopup) {
                  return (
                    <div key={item.id} className="modal-media">
                      {item.file?.content_type?.startsWith("video/") ? (
                        <video controls style={{ width: "100%", height: "auto" }}>
                          <source src={item.file.url} type={item.file.content_type} />
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <img
                          src={item.file?.url}
                          alt={item.title || "Media"}
                          style={{ width: "100%", height: "auto" }}
                        />
                      )}
                      <div className="modal-buttons">
                        <button
                          className="like-button"
                          onClick={() => handleLike(item.id)}
                        >
                          Like
                        </button>
                        <button
                          className="delete-button"
                          onClick={() => handleDelete(item.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaGallery;
