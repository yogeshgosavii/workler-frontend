import React, { useRef, useState } from 'react';
import { useSwipeable } from 'react-swipeable';

const ImageCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef(null);
  console.log(images);
  

  const handlers = useSwipeable({
    onSwipedLeft: () => handleSwipe('left'),
    onSwipedRight: () => handleSwipe('right'),
    trackMouse: true, // Optional: Allows swiping with the mouse
  });

  const handleSwipe = (direction) => {
    const newIndex = direction === 'right'
      ? Math.max(currentIndex - 1, 0)
      : Math.min(currentIndex + 1, images.length - 1);

    setCurrentIndex(newIndex);
    scrollContainerRef.current.scrollTo({
      left: newIndex * scrollContainerRef.current.clientWidth,
      behavior: 'smooth'
    });
  };

  return (
    <div className="relative">
      <div
        {...handlers}
        ref={scrollContainerRef}
        className="flex overflow-hidden"
        style={{ width: '100%' }}
      >
        {images.map((image, imgIndex) => (
          <div
            key={imgIndex}
            className="flex-shrink-0 w-full h-64 bg-gray-200"
          >
            <img
              className="w-full h-full object-cover"
              src={image}
              alt={`Image ${imgIndex}`}
            />
          </div>
        ))}
      </div>
      {/* <div className="absolute top-1/2 left-2 transform -translate-y-1/2 z-10 cursor-pointer text-white">
        <button
          onClick={() => handleSwipe('left')}
          className="bg-gray-800 p-2 rounded-full"
        >
          ←
        </button>
      </div>
      <div className="absolute top-1/2 right-2 transform -translate-y-1/2 z-10 cursor-pointer text-white">
        <button
          onClick={() => handleSwipe('right')}
          className="bg-gray-800 p-2 rounded-full"
        >
          →
        </button>
      </div> */}
    </div>
  );
};

export default ImageCarousel;
