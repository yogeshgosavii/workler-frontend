import React, { useState, useEffect } from "react";
import TextInput from "../Input/TextInput";
import AddInput from "../Input/AddInput";
import authService from "../../services/authService";
import imageService from "../../services/imageService";
import TextAreaInput from "../Input/TextAreaInput";
import Button from "../Button/Button";
import UrlInput from "../Input/UrlInput";
import UserImageInput from "../Input/UserImageInput";
import imageCompression from 'browser-image-compression';

function UserDetailsForm({ onClose, setData, data }) {
  const [formData, setFormData] = useState(data);
  const [userDetails, setUserDetails] = useState(data);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const deepEqual = (obj1, obj2) => {
    if (obj1 === obj2) return true;
    if (typeof obj1 !== "object" || obj1 === null || typeof obj2 !== "object" || obj2 === null)
      return false;
    let keys1 = Object.keys(obj1);
    let keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) return false;
    for (let key of keys1) {
      if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) return false;
    }
    return true;
  };

  const isFormValid = () => {
    return formData.username !== "" && formData.email !== "" && !deepEqual(formData, userDetails);
  };

  // useEffect(() => {
  //   const fetchUserDetails = async () => {
  //     try {
  //       const userDetails = await authService.fetchUserDetails();
  //       setFormData({
  //         username: userDetails.username || "",
  //         email: userDetails.email || "",
  //         about: userDetails.about || "",
  //         tags: userDetails.tags || [],
  //         githubLink: userDetails.githubLink || "",
  //         linkedInLink: userDetails.linkedInLink || "",
  //         portfolioLink: userDetails.portfolioLink || "",
  //         profileImage: userDetails.profileImage || null,
  //         profileImagecompressed: userDetails.profileImagecompressed || null,
  //       });
  //       setUserDetails({
  //         username: userDetails.username || "",
  //         email: userDetails.email || "",
  //         about: userDetails.about || "",
  //         tags: userDetails.tags || [],
  //         githubLink: userDetails.githubLink || "",
  //         linkedInLink: userDetails.linkedInLink || "",
  //         portfolioLink: userDetails.portfolioLink || "",
  //         profileImage: userDetails.profileImage || null,
  //         profileImagecompressed: userDetails.profileImagecompressed || null,
  //       });
  //     } catch (err) {
  //       setError("Failed to fetch user details");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchUserDetails();
  // }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleImageChange = async (newImage) => {
    console.log("handleImageChange triggered with newImage:", newImage);
  
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
  
    try {
      console.log("Starting image compression...");
      const profileImagecompressed = await imageCompression(newImage, options);
      console.log("Image compression successful:", profileImagecompressed);
  
      setFormData((prev) => ({
        ...prev,
        profileImage: newImage,
        profileImagecompressed: profileImagecompressed,
      }));
    } catch (error) {
      console.error("Failed to compress image", error);
      setError("Failed to compress image");
    }
  };

  const handleRemoveImage = () => {
    
    setFormData((prev) => ({
      ...prev,
      profileImage: null,
      profileImagecompressed: null,
    }));
    console.log(formData);
  };

  const handleUpdateUserDetails = async () => {
    try {
        let profileImageUrl = formData.profileImage;
        let profileImagecompressedUrl = formData.profileImagecompressed;
        
        // Check if the profile image has changed
        if (formData.profileImage && typeof formData.profileImage !== 'string') {
            const formDataToUpload = new FormData();
            formDataToUpload.append("originalImage", formData.profileImage);
            formDataToUpload.append("compressedImage", formData.profileImagecompressed);

            const response = await imageService.uploadImages(formDataToUpload);
            profileImageUrl = response.imageData.originalImageUrl;
            profileImagecompressedUrl = response.imageData.compressedImageUrl;
        }

        const updatedData = {
            ...formData,
            profileImage: profileImageUrl,
            profileImagecompressed: profileImagecompressedUrl,
        };

        // Check for empty fields and set them to null
        Object.keys(updatedData).forEach((key) => {
            if (updatedData[key] === "" || updatedData[key] === null) {
                updatedData[key] = null;
            }
        });

        console.log(updatedData);

        await authService.updateUserDetails(updatedData);
        onClose();
    } catch (error) {
        setError("Failed to update user details");
    }
  };

  const handleAddTags = () => {
    if (formData.tags.length < 10) {
      if (inputValue.trim() && !formData.tags.includes(inputValue.trim())) {
        const updatedTags = [...formData.tags, inputValue.trim()];
        setFormData((prev) => ({ ...prev, tags: updatedTags }));
        setInputValue("");
      }
    }
  };

  const handleDeleteTags = (tag) => {
    const updatedTags = formData.tags.filter((t) => t !== tag);
    setFormData((prev) => ({ ...prev, tags: updatedTags }));
  };

 

  return (
    <div className="h-full flex sm:max-h-[450px] flex-col gap-6 pt-2 pb-6 px-4 sm:px-8 overflow-auto bg-white">
      <div className="sticky z-20 -top-2.5 py-4 bg-white">
        <h2 className="text-xl font-medium">User details</h2>
        <p className="text-sm text-gray-400">Update the user details or add new to them</p>
      </div>
      <div className="flex-1 flex flex-col gap-5">
        <UserImageInput
          imageHeight={150}
          className={"flex justify-center w-full mb-8"}
          image={formData.profileImage} // Show compressed image
          onImageChange={handleImageChange}
        />
        {formData.profileImage && (
          <Button className="text-red-500 mb-5 -mt-8" onClick={handleRemoveImage}>
            Remove Image
          </Button>
        )}
        <TextInput
          name="username"
          value={formData.username}
          isRequired={true}
          placeholder="Username"
          onChange={handleInputChange}
        />
        <TextInput
          name="email"
          value={formData.email}
          isRequired={true}
          placeholder="Email"
          onChange={handleInputChange}
        />
        <TextAreaInput
          name="about"
          value={formData.about}
          onChange={handleInputChange}
          placeholder="About"
        />
        <AddInput
          name="tags"
          data={formData.tags}
          handleAdd={handleAddTags}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Tags"
          value={inputValue}
          handleDelete={handleDeleteTags}
        />
        <UrlInput
          name="githubLink"
          value={formData.githubLink}
          onChange={handleInputChange}
          placeholder="Github"
        />
        <UrlInput
          name="linkedInLink"
          value={formData.linkedInLink}
          onChange={handleInputChange}
          placeholder="LinkedIn"
        />
        <UrlInput
          name="portfolioLink"
          value={formData.portfolioLink}
          onChange={handleInputChange}
          placeholder="Portfolio"
        />
      </div>
      <div className="mt-10 flex justify-end">
        <Button className="mr-2 text-blue-500" onClick={onClose}>
          Cancel
        </Button>
        <Button
          className={`bg-blue-500 text-white disabled:bg-blue-300`}
          onClick={handleUpdateUserDetails}
          disabled={!isFormValid()}
        >
          Update
        </Button>
      </div>
    </div>
  );
}

export default UserDetailsForm;
