import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import TextInput from "../Input/TextInput";
import AddInput from "../Input/AddInput";
import TextAreaInput from "../Input/TextAreaInput";
import Button from "../Button/Button";
import UrlInput from "../Input/UrlInput";
import UserImageInput from "../Input/UserImageInput";
import LocationInput from "../Input/LocationInput";
import DateInput from "../Input/DateInput";
import profileImageDefault from "../../assets/user_male_icon.png";
import authService from "../../services/authService";
import { useDispatch } from "react-redux";
import { updateUserDetails } from "../../features/auth/authSlice";
import imageCompression from 'browser-image-compression';


function UserDetailsForm({ onClose, setData, data }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(data);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState(null);
  const userData = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  console.log(data);

  useEffect(() => {
    setFormData({
      username: data.username || "",
      email: data.email || "",
      about: data.about || "",
      description: data.description || "",
      account_type: data.account_type,
      tags: data.tags || [],
      githubLink: data.githubLink || "",
      linkedInLink: data.linkedInLink || "",
      portfolioLink: data.portfolioLink || "",
      profileImage: data.profileImage || null,
      personal_details: data.personal_details || {},
      company_details: data.company_details || {},
      location: data.location || "",
      bio: data.bio || "",
    });
  }, [data]);

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
    return !deepEqual(formData, data);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleDetailsChange = (section, name, value) => {
    setFormData((prevState) => ({
      ...prevState,
      [section]: {
        ...prevState[section],
        [name]: value,
      },
    }));
  };

  const handleImageChange = async (newImage) => {
    setFormData((prev) => ({ ...prev, profileImage: newImage }));
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, profileImage: null }));
  };
  function flattenObject(obj, prefix = "") {
    const flattened = {};

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const newKey = prefix ? `${prefix}[${key}]` : key;
        if (typeof obj[key] === "object" && !(obj[key] instanceof File)) {
          Object.assign(flattened, flattenObject(obj[key], newKey));
        } else {
          flattened[newKey] = obj[key];
        }
      }
    }

    return flattened;
  }


const handleUpdateUserDetails = async () => {
  let newFormData = new FormData();
  const flattenedData = flattenObject(formData);

  // Check if there is a profile image and compress it
  if (formData.profileImage) {
    const file = formData.profileImage;

    // Compression options: set max size to 150KB
    const options = {
      maxSizeMB: 0.05, // Max size in MB (150KB = 0.15MB)
      maxWidthOrHeight: 1024, // Max width or height
      useWebWorker: true, // Use web worker for faster compression
    };

    try {
      // Compress the image
      const compressedImage = await imageCompression(file, options);

      // Append the compressed image to the form data
      newFormData.append('files', compressedImage);
    } catch (error) {
      console.error('Error during image compression:', error);
    }
  }

  // Add other form data
  Object.keys(flattenedData).forEach((key) => {
    if (key !== 'profileImage') {  // Skip the profile image since it's already handled
      newFormData.append(key, flattenedData[key]);
    }
  });

  setLoading(true);
  try {
    const updatedData = await authService.updateUserDetails(newFormData);
    setData(formData);
    console.log(formData);

    dispatch(updateUserDetails(updatedData));
    onClose();
  } catch (error) {
    setError('Failed to update user details');
  } finally {
    setLoading(false);
  }
};


  const handleAddTags = () => {
    if (
      formData.tags.length < 10 &&
      inputValue.trim() &&
      !formData.tags.includes(inputValue.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, inputValue.trim()],
      }));
      setInputValue("");
    }
  };

  const handleDeleteTags = (tag) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  return (
    <div className="h-full flex  flex-col gap-6 pt-2 pb-6 px-4 sm:px-8 overflow-auto bg-white">
      <div className="flex gap-3 sticky z-20 -top-2.5  py-3 bg-white ">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="size-8 shrink-0 -ml-2.5"
          onClick={() => {
            onClose()
          }}
        >
          <path
            fill-rule="evenodd"
            d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z"
            clip-rule="evenodd"
          />
        </svg>
        <div className=" bg-white">
          <h2 className="text-xl font-medium">User details</h2>
          <p className="text-sm text-gray-400">
            Update the user details or add new to them
          </p>
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-5">
        <UserImageInput
          imageHeight={150}
          className={"flex justify-center w-full mb-8"}
          image={
            formData.profileImage?.originalImage ||
            formData.profileImage ||
            profileImageDefault
          }
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
        {formData.account_type === "Employer" && (
          <TextInput
            name="company_name"
            value={formData.company_details?.company_name || ""}
            isRequired={true}
            placeholder="Company name"
            onChange={(e) =>
              handleDetailsChange(
                "company_details",
                "company_name",
                e.target.value
              )
            }
          />
        )}
        {formData.account_type == "Candidate" && (
          <>
            <TextInput
              name="firstname"
              value={formData.personal_details?.firstname || ""}
              isRequired={true}
              placeholder="Firstname"
              onChange={(e) =>
                handleDetailsChange(
                  "personal_details",
                  "firstname",
                  e.target.value
                )
              }
            />
            <TextInput
              name="lastname"
              value={formData.personal_details?.lastname || ""}
              placeholder="Lastname"
              onChange={(e) =>
                handleDetailsChange(
                  "personal_details",
                  "lastname",
                  e.target.value
                )
              }
            />
          </>
        )}
        {formData.account_type === "Employer" && (
          <DateInput
            name="found_in_date"
            type={"date"}
            value={formData.company_details?.found_in_date?.split("T")[0] || ""}
            onChange={(e) =>
              handleDetailsChange(
                "company_details",
                "found_in_date",
                e.target.value
              )
            }
            placeholder="Found in"
            isRequired={true}
          />
        )}

        {formData.account_type === "Candidate" && (
          <DateInput
            name="birthdate"
            type={"date"}
            value={formData.personal_details?.birthdate?.split("T")[0] || ""}
            onChange={(e) =>
              handleDetailsChange(
                "personal_details",
                "birthdate",
                e.target.value
              )
            }
            placeholder="BirthDate"
            isRequired={true}
          />
        )}

        <LocationInput
          name="location"
          value={formData.location}
          onChange={handleInputChange}
          placeholder="Location"
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
        {/* <UrlInput
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
        {formData.account_type === "Candidate" && (
          <UrlInput
            name="portfolio"
            value={formData.personal_details?.portfolio || ""}
            onChange={(e) =>
              handleDetailsChange(
                "personal_details",
                "portfolio",
                e.target.value
              )
            }
            placeholder="Portfolio"
          />
        )}
        {formData.account_type === "Employer" && (
          <UrlInput
            name="website"
            value={formData.company_details?.website || ""}
            onChange={(e) =>
              handleDetailsChange("company_details", "website", e.target.value)
            }
            placeholder="Website"
          />
        )} */}
      </div>
      <div className="flex justify-end gap-5">
        {/* <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button> */}
        <Button
          className="bg-gray-800 flex justify-center items-center text-white w-full text-lg disabled:bg-gray-600"
          onClick={handleUpdateUserDetails}
          disabled={!isFormValid() || loading}
        >
          {loading ? "Updating..." : "Update"}
        </Button>
      </div>
    </div>
  );
}

export default UserDetailsForm;
