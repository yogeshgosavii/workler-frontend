import React, { useEffect, useRef, useState } from "react";
import profileImageDefault from "../../assets/user_male_icon.png";

function UserImageInput({
  isEditable = true,
  className,
  imageHeight = 50,
  image,
  onImageChange, // callback to handle image change
}) {
  const fileInputRef = useRef(null);
  console.log(image)
  const [currentImage, setCurrentImage] = useState(image);

  useEffect(() => {
    setCurrentImage(image)
   
  }, [image]);

  const handleImageClick = () => {
    if (isEditable) {
      fileInputRef.current.click();
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
        className={`relative bg-gray-50 ${isEditable ? "cursor-pointer" : ""} border-2 rounded-full flex items-center justify-center`}
        style={{ height: `${imageHeight}px`, width: `${imageHeight}px` }}
      >
        <img
          className="object-cover rounded-full"
          src={currentImage || profileImageDefault}
          alt="Profile"
          style={{ height: "100%", width: "100%" }}
        />
        {isEditable && (
          <>
            <div className="absolute inset-0 bg-black opacity-25 rounded-full"></div>
            <svg
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
            >
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </>
        )}
        <input
          type="file"
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
