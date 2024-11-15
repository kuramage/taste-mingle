import React, { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { useSpring, animated } from 'react-spring';
import like from './like.mp4';
const SwipeableCard = ({ image, onSwipeLeft, onSwipeRight }) => {
  const [style, api] = useSpring(() => ({ x: 0 }));

  const handleSwipe = (direction) => {
    const distance = direction === 'left' ? -500 : 500;
    api.start({ x: distance, opacity: 0 });
    setTimeout(() => {
      api.start({ x: 0, opacity: 1 });
      direction === 'left' ? onSwipeLeft() : onSwipeRight();
    }, 300);
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => handleSwipe('left'),
    onSwipedRight: () => handleSwipe('right'),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  return (
    <animated.div
      {...handlers}
      style={{
        ...style,
        width: '300px',
        height: '400px',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundImage: `url(${image})`,
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        position: 'relative',
      }}
    >
      <div style={{ position: 'absolute', bottom: '20px', width: '100%', textAlign: 'center', color: '#fff' }}>
        <h3>Paneer-ki-sabji</h3>
        <p>Description of one line</p>
      </div>
    </animated.div>
  );
};

const SwipePage = () => {
  const [videoSource, setVideoSource] = useState(null);
  const [showVideo, setShowVideo] = useState(false);

  const handleSwipeLeft = () => {
    setVideoSource(like);
    setShowVideo(true);
  };

  const handleSwipeRight = () => {
    setVideoSource('right-swipe-video.mp4');
    setShowVideo(true);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#DAB7FF' }}>
      {/* Left Video Div */}
      <div style={{ width: '150px', marginRight: '20px' }}>
        {showVideo && videoSource === 'left-swipe-video.mp4' && (
          <video src="left-swipe-video.mp4" autoPlay loop muted width="100%" />
        )}
      </div>

      {/* Swipeable Card */}
      <SwipeableCard
        image="https://via.placeholder.com/300x400?text=Paneer-ki-sabji"
        onSwipeLeft={handleSwipeLeft}
        onSwipeRight={handleSwipeRight}
      />

      {/* Right Video Div */}
      <div style={{ width: '150px', marginLeft: '20px' }}>
        {showVideo && videoSource === 'right-swipe-video.mp4' && (
          <video src="right-swipe-video.mp4" autoPlay loop muted width="100%" />
        )}
      </div>
    </div>
  );
};

export default SwipePage;
