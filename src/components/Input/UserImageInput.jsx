import React, { useEffect, useRef, useState } from "react";
import profileImageDefault from "../../assets/user_male_icon.png";

function UserImageInput({
  isEditable = true,
  className,
  imageHeight = 50,
  image,
  imageBorder = 2,
  onClick,
  imageClassName,
  onError,
  onImageChange, // callback to handle image change
}) {
  const fileInputRef = useRef(null);
  const [currentImage, setCurrentImage] = useState(image);

  useEffect(() => {
    if (image instanceof File) {
      // If the image is a File object, convert it to a data URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentImage(reader.result);
      };
      reader.readAsDataURL(image);
    } else {
      // Otherwise, set the image directly
      setCurrentImage(image);
    }
  }, [image]);

  const handleImageClick = () => {
    if (isEditable) {
      fileInputRef.current.click();
    } else {
      onClick();
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentImage(reader.result);
      };
      reader.readAsDataURL(file);

      if (onImageChange) {
        onImageChange(file); // Pass the File object to the callback
      }
    }
  };

  return (
    <div className={`${className}`}>
      <div
        onClick={handleImageClick}
        className={`relative  bg-gray-50 ${
          isEditable ? "cursor-pointer" : ""
        } ${
          imageBorder > 1 ? `border-${imageBorder}` : "border"
        } rounded-full flex items-center justify-center`}
        style={{ height: `${imageHeight}px`, width: `${imageHeight}px` }}
      >
        <img
          className={`object-cover rounded-full ${imageClassName}`}
          src={currentImage || profileImageDefault}
          alt="Profile"
          onError={onError}
          style={{ height: "100%", width: "100%" }}
        />
        {isEditable && (
          <>
            <div className="absolute inset-0 bg-black opacity-25 rounded-full"></div>
            {/* <svg
              className="absolute text-white"
              style={{
                height: `${Math.min(imageHeight / 2, 50)}px`, // Adjust icon height dynamically but cap it at 50px
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            > */}
            <svg
              className="absolute h-14 w-14 text-white"
              style={{
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M10.5 8.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
              <path d="M2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4zm.5 2a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1m9 2.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0" />
            </svg>
          </>
        )}
        <input
          type="file"
          // name="images"
          ref={fileInputRef}
          style={{ display: "none" }}
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}

export default UserImageInput;
