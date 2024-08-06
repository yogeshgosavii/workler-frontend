import React, { useRef, useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';

const ImageCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef(null);

  const handlers = useSwipeable({
    onSwipedLeft: () => handleSwipe('right'),
    onSwipedRight: () => handleSwipe('left'),
    trackMouse: true, // Optional: Allows swiping with the mouse
  });

  const handleSwipe = (direction) => {
    console.log('Swiped:', direction);
    const newIndex = direction === 'right'
      ? Math.max(currentIndex - 1, 0)
      : Math.min(currentIndex + 1, images.length - 1);

    setCurrentIndex(newIndex);
  };

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        left: currentIndex * scrollContainerRef.current.clientWidth,
        behavior: 'smooth'
      });
    }
  }, [currentIndex]);

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
      <div className="absolute top-1/2 left-0 h-full transform -translate-y-1/2 z-10 cursor-pointer text-white">
        <button
          onClick={() => handleSwipe('right')}
          className="bg-transparent h-full p-2 w-14"
        >
        
        </button>
      </div>
      <div className="absolute top-1/2 right-0 transform h-full -translate-y-1/2 z-10 cursor-pointer text-white">
      <button
          onClick={() => handleSwipe('left')}
          className="bg-transparent h-full p-2 w-14"
        >
        
        </button>
      </div>
    </div>
  );
};

export default ImageCarousel;
