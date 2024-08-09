import React, { useRef, useEffect } from "react";

const ImageCarousel = ({
  images,
  className,
  dots = true,
  gap = 0,
  edges = "",
  isEditable = false,
  imagePreview = false,
}) => {
  const imageContainerRef = useRef();

  // Cleanup URLs when component unmounts or images change
  useEffect(() => {
    const objectURLs = images.map((image) =>
      typeof image !== "string" ? URL.createObjectURL(image) : null
    );

    return () => {
      objectURLs.forEach((url) => {
        if (url) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [images]);

  return (
    <div className={`${className}`}>
      <div
        ref={imageContainerRef}
        className={`flex ${!dots && "pl-14 pr-4"} w-full   gap-${gap}`}
        style={{
          overflowX: "scroll",
          scrollbarWidth: "none",
          scrollSnapType: "x mandatory",
          scrollBehavior:"smooth",
          scrollMarginLeft:"20px"
          // gap: `${gap}px`, // Using inline style for gap
        }}
      >
        {images.map((image, index) => (
          <div
            className="relative"
            key={index}
            style={{
              minWidth: "100%",
              scrollSnapAlign: "start",
            }}
          >
            <img
              className={`w-full h-full object-cover max-h-60 ${edges}`}
              src={
                typeof image === "string" ? image : URL.createObjectURL(image)
              }
              alt={`Image ${index + 1}`}
            />
            {isEditable && (
              <div className="absolute top-4 right-4 border">
                <div className="absolute w-10 h-10  -top-[3px] -right-[4px]  bg-black opacity-45 rounded-full"></div>
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

      {imagePreview && images.length > 1 && (
        <div className="flex  mt-4 gap-2 h-1/5">
          {images.slice(1).map((image, index) => (
            <div key={index} className=" h-20 relative">
              <img
                className={`w-full h-full object-cover rounded-md ${edges}`}
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
