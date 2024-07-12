import React, { useState, useEffect } from "react";
import TextInput from "../Input/TextInput";
import AddInput from "../Input/AddInput";
import authService from "../../services/authService";
import TextAreaInput from "../Input/TextAreaInput";
import Button from "../Button/Button";
import UrlInput from "../Input/UrlInput";
import UserImageInput from "../Input/UserImageInput";

function UserDetailsForm({ onClose }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    about: "",
    githubLink: "",
    linkedInLink: "",
    portfolioLink: "",
    tags: [], // Ensure this is always an array
  });
  const [userDetails, setUserDetails] = useState({});
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // State to manage loading

  const deepEqual = (obj1, obj2) => {
    // Check if both values are strictly equal
    if (obj1 === obj2) {
      return true;
    }

    // Check if either value is not an object or is null
    if (
      typeof obj1 !== "object" ||
      obj1 === null ||
      typeof obj2 !== "object" ||
      obj2 === null
    ) {
      return false;
    }

    // Get the keys of both objects
    let keys1 = Object.keys(obj1);
    let keys2 = Object.keys(obj2);

    // Check if the number of keys is different
    if (keys1.length !== keys2.length) {
      return false;
    }

    // Iterate over the keys of obj1
    for (let key of keys1) {
      // Check if obj2 has the key and the values of the key are deeply equal
      if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
        // Handle special case for numeric values to consider them equal if numeric value is same
        if (
          typeof obj1[key] === "number" &&
          typeof obj2[key] === "number" &&
          obj1[key] === obj2[key]
        ) {
          continue; // Continue checking other keys
        }
        return false;
      }
    }

    // If all checks pass, the objects are deeply equal
    return true;
  };

  const isFormValid = () => {
    return formData.username !== "" && formData.email !== "" && !deepEqual(formData, userDetails);
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userDetails = await authService.fetchUserDetails();
        console.log(userDetails);
        setFormData({
          username: userDetails.username || "",
          email: userDetails.email || "",
          about: userDetails.about || "",
          tags: userDetails.tags || [], // Ensure tags is always an array
          githubLink: userDetails.githubLink || "",
          linkedInLink: userDetails.linkedInLink || "",
          portfolioLink: userDetails.portfolioLink || "",
        });
        setUserDetails({
          username: userDetails.username || "",
          email: userDetails.email || "",
          about: userDetails.about || "",
          tags: userDetails.tags || [],
          githubLink: userDetails.githubLink || "",
          linkedInLink: userDetails.linkedInLink || "",
          portfolioLink: userDetails.portfolioLink || "",
        });
      } catch (err) {
        setError("Failed to fetch user details");
        console.error(err);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchUserDetails();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleUpdateUserDetails = async () => {
    const filteredData = Object.entries(formData)
    .filter(([key, value]) => value !== null && value !== "" && key !== "inputValue")
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
    try {
      console.log("Form Data:", filteredData); // Inspect formData for circular references
      await authService.updateUserDetails(filteredData);
      onClose();
    } catch (error) {
      setError("Failed to update user details");
      console.error("Update user details error:", error);
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

  if (loading) {
    return <div className="h-full bg-white">Loading...</div>; // Show a loading indicator
  }

  if (error) {
    return <div className="text-red-500">{error}</div>; // Show error message if any
  }

  return (
    <div className="h-full flex sm:max-h-[450px] flex-col gap-6 pt-2 pb-6 px-4 sm:px-8 overflow-auto bg-white">
      <div className="sticky z-20 -top-2.5 py-4 bg-white">
        <h2 className="text-xl font-medium">User details</h2>
        <p className="text-sm text-gray-400">Update the user details or add new to them</p>
      </div>
      <div className="flex-1 flex flex-col gap-5">
        <UserImageInput
          imageHeight={150}
          className={"flex justify-center w-full mb-6"}
          image={formData.image} // Pass the current image if available
          onImageChange={(newImage) => setFormData((prev) => ({ ...prev, image: newImage }))}
        />
        <TextInput
          name="username"
          value={formData.username}
          isRequired={true}
          placeholder="Username"
          onChange={(e) => {
            handleInputChange(e);
            verifyUserName(e.target.value);
          }}
        />
        <TextInput
          name="email"
          value={formData.email}
          isRequired={true}
          placeholder="Email"
          onChange={(e) => {
            handleInputChange(e);
          }}
        />
        <TextAreaInput
          name="about"
          value={formData.about}
          onChange={handleInputChange}
          placeholder="About"
        />
        <AddInput
          name="tags"
          data={formData.tags} // Always an array
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
