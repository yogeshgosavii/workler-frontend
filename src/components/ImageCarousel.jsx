import React, { useRef } from "react";

const ImageCarousel = ({ images }) => {
  return (
    <div style={{ display: "flex", overflowX: "scroll",scrollbarWidth:'none',scrollSnapType: 'x mandatory', width: "100%" }}>
      {images.map((image, index) => (
        <div
          key={index}
          style={{
            minWidth: "100%",
            scrollSnapAlign: "start",
            position: "relative",
          }}
        >
          <img
            className="w-full h-full  object-cover max-h-60"
            src={image}
            alt={`Image ${index + 1}`}
          />{" "}
        </div>
      ))}
    </div>
  );
};

export default ImageCarousel;
