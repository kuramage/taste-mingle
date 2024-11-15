import React, { useState } from 'react';
import { useSpring, animated } from 'react-spring';
import { useSwipeable } from 'react-swipeable';
import video from './like.mp4';
import img from './demo.jpg';
const SwipeableCard = ({ image, onSwipe, videoUrl }) => {
  const [style, api] = useSpring(() => ({ x: 0, opacity: 1 }));
  const [showVideo, setShowVideo] = useState(false);

  const handleSwipe = (dir) => {
    const distance = dir === 'left' ? -500 : 500;
    api.start({ x: distance, opacity: 0 });

    if (dir === 'right') {
      setShowVideo(true); // Show the video when swiped right
      setTimeout(() => setShowVideo(false), 1500); // Hide the video after animation (same duration as the heart)
    }

    setTimeout(() => onSwipe(dir), 300); // Trigger callback after animation
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => handleSwipe('left'),
    onSwipedRight: () => handleSwipe('right'),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  return (
    <div style={{ position: 'relative' }}>
      {/* Card */}
      <animated.div
        {...handlers}
        style={{
          ...style,
          touchAction: 'pan-y',
          backgroundImage: `url(${img})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          width: '300px',
          height: '400px',
          borderRadius: '10px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          position: 'absolute',
          zIndex: 1, // Ensure the card is on top
        }}
      />
      {/* Floating Video */}
      {showVideo && (
        <div className="floating-video" style={{border:"2px solid"}}> 
          <video
            width="300"
            height="400"
            autoPlay
            muted
            loop
            style={{ borderRadius: '10px' }}
          >
            <source src={video} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
  );
};

export default SwipeableCard;
