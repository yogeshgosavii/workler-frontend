import React, { useRef, useEffect, useState } from "react";

const ImageCarousel = ({
  images,
  className,
  imageClassName,
  dots = true,
  gap = 0,
  setImages,
  edges = "",
  isEditable = false,
  imagePreview = false,
}) => {
  const [animatingImages, setAnimatingImages] = useState(images);
  const [removedImage, setRemovedImage] = useState(null);
  const imageContainerRef = useRef();  // Define the imageContainerRef here


  useEffect(() => {
    setAnimatingImages(images);
  }, [images]);

  // Cleanup URLs when component unmounts or images change
  useEffect(() => {
    const objectURLs = animatingImages.map((image) =>
      typeof image !== "string" ? URL.createObjectURL(image) : null
    );

    return () => {
      objectURLs.forEach((url) => {
        if (url) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [animatingImages]);

  // Handle image removal with animation
  const handleRemoveImage = (image) => {
    setRemovedImage(image);

    // Wait for the fade-out animation to complete before removing the image
    setTimeout(() => {
      const updatedImages = animatingImages.filter((img) => img !== image);
      setAnimatingImages(updatedImages);
      setImages(updatedImages);
      setRemovedImage(null);
    }, 300); // Match this duration to the CSS transition duration
  };
  const scrollContainerStyle = {
    display: 'flex',
    overflowX: 'auto',
    scrollSnapType: 'x mandatory',
    scrollbarWidth: 'none',
    WebkitOverflowScrolling: 'touch', // Smooth scrolling in WebKit-based browsers
  };
  const scrollItemStyle = {
    flex: '0 0 auto',
    scrollSnapAlign: 'start',
    minWidth: '100%', // Ensure each item takes up the full width of the container
  };
  return (
    <div className={`${className}`}>
      <div
        ref={imageContainerRef}
        className={`flex ${!dots && images.length>1 && "pl-[43px]"} transition-all w-full max-h-min gap-${gap}`}
        style={
        scrollContainerStyle}
      >
        {animatingImages.map((image, index) => (
          <div
            className={`relative w-full transition-all duration-300 ease-in-out ${
              removedImage === image ? "opacity-0 scale-95" : "opacity-100 scale-100"
            }`}
            key={index}
            style={scrollItemStyle}
          >
            <img
              className={`w-full max-w-full h-full ${imageClassName} object-cover max-h-60 ${edges}`}
              src={
                typeof image === "string" ? image : URL.createObjectURL(image)
              }
              alt={`Image ${index + 1}`}
            />
            {isEditable && (
              <div
                onClick={() => handleRemoveImage(image)}
                className="absolute top-4 right-4 border cursor-pointer"
              >
                <div className="absolute w-10 h-10 -top-[3px] -right-[4px] bg-black opacity-45 rounded-full"></div>
                <svg
                  className="h-5 w-5 text-white rounded-full absolute top-[7px] right-1.5 z-10"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  strokeWidth="3"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" />
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>

      {imagePreview && animatingImages.length > 1 && (
        <div className="flex mt-4 gap-2 h-1/5">
          {animatingImages.slice(1).map((image, index) => (
            <div
              key={index}
              className="h-20 relative transition-all duration-300 ease-in-out"
            >
              <img
                className={`w-full h-full object-cover ${edges}`}
                src={
                  typeof image === "string" ? image : URL.createObjectURL(image)
                }
                alt={`Image ${index + 1}`}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;
