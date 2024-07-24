import React, { useState, useEffect } from "react";
import TextInput from "../Input/TextInput";
import AddInput from "../Input/AddInput";
import authService from "../../services/authService";
import imageService from "../../services/imageService";
import TextAreaInput from "../Input/TextAreaInput";
import Button from "../Button/Button";
import UrlInput from "../Input/UrlInput";
import UserImageInput from "../Input/UserImageInput";
import imageCompression from "browser-image-compression";
import { useSelector } from "react-redux";
import LocationInput from "../Input/LocationInput";
import DateInput from "../Input/DateInput";

function UserDetailsForm({ onClose, setData, data }) {
  const [loading, setloading] = useState(false);
  const [formData, setFormData] = useState(data);
  const [userDetails, setUserDetails] = useState(data);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState(null);
  const userData = useSelector((state) => state.auth.user);

  const deepEqual = (obj1, obj2) => {
    if (obj1 === obj2) return true;
    if (
      typeof obj1 !== "object" ||
      obj1 === null ||
      typeof obj2 !== "object" ||
      obj2 === null
    )
      return false;
    let keys1 = Object.keys(obj1);
    let keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) return false;
    for (let key of keys1) {
      if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key]))
        return false;
    }
    return true;
  };

  const isFormValid = () => {
    return (
      formData.username !== "" &&
      formData.email !== "" &&
      !deepEqual(formData, userDetails)
    );
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
    console.log(formData);
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
    setloading(true);
    try {
      let profileImageUrl = formData.profileImage;
      let profileImagecompressedUrl = formData.profileImagecompressed;

      // Check if the profile image has changed
      if (formData.profileImage && typeof formData.profileImage !== "string") {
        const formDataToUpload = new FormData();
        formDataToUpload.append("originalImage", formData.profileImage);
        formDataToUpload.append(
          "compressedImage",
          formData.profileImagecompressed
        );

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
      setData(updatedData);
      onClose();
    } catch (error) {
      setError("Failed to update user details");
    } finally {
      setloading(false);
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
        <p className="text-sm text-gray-400">
          Update the user details or add new to them
        </p>
      </div>
      <div className="flex-1 flex flex-col gap-5">
        <UserImageInput
          imageHeight={150}
          className={"flex justify-center w-full mb-8"}
          image={formData.profileImage} // Show compressed image
          onImageChange={handleImageChange}
        />
        {formData.profileImage && (
          <Button
            className="text-red-500 mb-5 -mt-8"
            onClick={handleRemoveImage}
          >
            Remove Image
          </Button>
        )}
        <TextInput
          name="company_name"
          value={formData.company_details.company_name}
          isRequired={true}
          placeholder="Conpany name"
          onChange={handleInputChange}
        />
        {userData.account_type == "Candidate" && (
          <>
            <TextInput
              name="firstname"
              value={formData.firstname}
              isRequired={true}
              placeholder="Firstname"
              onChange={handleInputChange}
            />
            <TextInput
              name="lastname"
              value={formData.lastname}
              placeholder="Lastname"
              onChange={handleInputChange}
            />
          </>
        )}
        {/* <TextInput
          name="email"
          value={formData.email}
          isRequired={true}
          placeholder="Email"
          onChange={handleInputChange}
        /> */}
        {userData.account_type == "Employeer" && (
          <>
            <DateInput
              name="found_in_date"
              type={"date"}
              value={formData.company_details.found_in_date.split("T")[0]}
              onChange={handleInputChange}
              placeholder="Found in"
              isRequired={true}
            />
          </>
        )}

        <LocationInput
          name="location"
          value={formData.location}
          onChange={handleInputChange}
          placeholder="Location"
          isRequired={true}
        />

        <TextAreaInput
          name="bio"
          value={formData.bio}
          onChange={handleInputChange}
          placeholder="Bio"
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
        {userData.account_type == "Candidate" && (
          <UrlInput
            name="portfolio"
            value={formData.personal_details.portfolio}
            onChange={handleInputChange}
            placeholder="Portfolio"
          />
        )}
        {userData.account_type == "Employeer" && (
          <UrlInput
            name="website"
            value={formData.company_details.website}
            onChange={handleInputChange}
            placeholder="Website"
          />
        )}
      </div>
      <div className="mt-10 flex justify-end">
        {/* <Button className="mr-2 text-blue-500" onClick={onClose}>
          Cancel
        </Button> */}
        <Button
          className={`bg-blue-500 flex justify-center items-center text-white w-full text-lg disabled:bg-blue-300`}
          onClick={handleUpdateUserDetails}
          disabled={!isFormValid() || loading}
        >
          {loading ? (
            <svg
              className="inline w-7 h-7 text-transparent animate-spin fill-white"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          ) : (
            "Update"
          )}
        </Button>
      </div>
    </div>
  );
}

export default UserDetailsForm;
