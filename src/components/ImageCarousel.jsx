import React, { useRef, useEffect, useState } from "react";

const ImageCarousel = ({
  images,
  className,
  imageClassName,
  dots = true,
  gap = 0,
  showCount= true,
  setImages,
  edges = "",
  isEditable = false,
  imagePreview = false,
}) => {
  const [animatingImages, setAnimatingImages] = useState(images);
  const [removedImage, setRemovedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(1); // Track current image index
  const imageContainerRef = useRef();

  useEffect(() => {
    setAnimatingImages(images);
  }, [images]);

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

  const handleRemoveImage = (image) => {
    setRemovedImage(image);
    setTimeout(() => {
      const updatedImages = animatingImages.filter((img) => img !== image);
      setAnimatingImages(updatedImages);
      setImages(updatedImages);
      setRemovedImage(null);
      setCurrentIndex((prevIndex) => Math.max(1, prevIndex - 1));
    }, 300);
  };

  const handleScroll = (event) => {
    const scrollPosition = event.target.scrollLeft;
    const totalWidth = event.target.scrollWidth - event.target.clientWidth;
    const newIndex = Math.round((scrollPosition / totalWidth) * (animatingImages.length - 1)) + 1;
    setCurrentIndex(newIndex);
  };

  const scrollContainerStyle = {
    display: "flex",
    overflowX: "auto",
    scrollSnapType: "x mandatory",
    scrollbarWidth: "none",
    WebkitOverflowScrolling: "touch",
  };
  const scrollItemStyle = {
    flex: "0 0 auto",
    scrollSnapAlign: "start",
  };

  return (
    <div className={`relative ${className}`}>
     {animatingImages.length>1 && showCount && <div className="px-4 py-1 text-white rounded-2xl bg-black opacity-75 absolute top-4 right-4 z-10">
        {currentIndex}/{animatingImages.length}
      </div>}

      <div
        ref={imageContainerRef}
        className={`flex ${!dots && images.length > 1 && ""} h-full w-full relative transition-all max-h-min max-w-full gap-${gap}`}
        style={scrollContainerStyle}
        onScroll={handleScroll}
      >
        {animatingImages.map((image, index) => (
          <div
            className={`relative h-full flex items-center flex-grow self-center ${images.length > 1 ? "w-fit" : "w-full"} transition-all duration-300 ease-in-out ${
              removedImage === image ? "opacity-0 scale-95" : "opacity-100 scale-100"
            }`}
            key={index}
            style={scrollItemStyle}
          >
            <img
              className={`w-full flex-grow h-full ${imageClassName} object-cover max-h-60 h-60 ${edges}`}
              src={typeof image === "string" ? image : URL.createObjectURL(image)}
              alt={`Image ${index + 1}`}
            />
            {isEditable && (
              <div onClick={() => handleRemoveImage(image)} className="absolute top-4 right-4 cursor-pointer">
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
            <div key={index} className="h-20 relative transition-all duration-300 ease-in-out">
              <img
                className={`w-full h-full object-cover ${edges}`}
                src={typeof image === "string" ? image : URL.createObjectURL(image)}
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
