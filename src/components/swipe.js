import React, { useState } from "react";
import "./SwipeImage.css";

const SwipeImage = () => {
  const [swipeX, setSwipeX] = useState(0);  // Track the swipe position
  const [opacity, setOpacity] = useState(1); // Track the opacity

  const handleMouseMove = (event) => {
    const deltaX = event.clientX - event.target.getBoundingClientRect().left;
    const maxSwipe = 200; // Max distance the image can swipe (you can adjust this)

    // Calculate the swipe distance
    const swipe = Math.min(Math.max(deltaX, -maxSwipe), maxSwipe);

    // Set swipe position and adjust opacity based on swipe distance
    setSwipeX(swipe);
    setOpacity(1 - Math.abs(swipe) / maxSwipe); // Reduce opacity based on swipe
  };

  const handleMouseUp = () => {
    // Reset the swipe effect when the mouse is released
    setSwipeX(0);
    setOpacity(1);
  };

  return (
    <div
      className="image-container"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}  // Ensure the effect resets if the mouse leaves the image
    >
      <img
        src="https://via.placeholder.com/400x300"
        alt="Swipeable"
        className="swipe-image"
        style={{
          transform: `translateX(${swipeX}px)`,
          opacity: opacity,
        }}
      />
    </div>
  );
};

export default SwipeImage;
