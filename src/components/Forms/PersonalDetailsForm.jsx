import React, { useState } from "react";
import Button from "../Button/Button";
import TextInput from "../Input/TextInput";
import NumberInput from "../Input/NumberInput";
import TextAreaInput from "../Input/TextAreaInput";
import DateInput from "../Input/DateInput";
import authService from "../../services/authService";
import { useSelector } from "react-redux";
import LocationInput from "../Input/LocationInput";
import UrlInput from "../Input/UrlInput";

function PersonalDetailsForm({ onClose, data, setData }) {
  const [loading, setloading] = useState(false);
  const user = useSelector((state) => state.auth.user);

  const [formData, setFormData] = useState(data || {});
  const [description, setDescription] = useState(user.description);

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
    if (formData.location !== "" && !deepEqual(data,formData)  ) {
      return true;
    }
    return false;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      if (value.length <= 10) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    }
    else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    setloading(true);
    if (!isFormValid()) {
      return;
    }

    try {
      const filteredData = Object.entries(formData)
        .filter(([key, value]) => value !== null && value !== "")
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});


      const personalData = await authService.updateUserDetails(
        filteredData,
      );
      setData(personalData)
      window.history.back()
      // onClose()

    } catch (error) {
      console.error("Error saving personal details:", error);
    }
  };

  return (
    <div className="h-full flex  sm:max-h-[450px] flex-col gap-6 pt-2 pb-6 overflow-auto bg-white">
      <div className="">
      <div className="flex   pl-2 sticky z-20 -top-2.5 py-4 bg-white">
      <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="size-8"
          onClick={() => {
            window.history.back();
          }}
        >
          <path
            fill-rule="evenodd"
            d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z"
            clip-rule="evenodd"
          />
        </svg>
      <div className={` px-4 sm:px-8  ${window.scroll >0?"shadow-lg":""} bg-white`}>
        <h2 className="text-xl font-medium">
        {user.account_type == "Employeer" ? (
            <span>Company details</span>
          ) : (
            <span>Personal details</span>
          )}
        </h2>
        <p className="text-sm text-gray-400">
          Update the details or add new to them
        </p>
      </div>
      </div>
        <div className="flex flex-col w-full px-4 sm:px-8  gap-6 mt-5">
          <TextAreaInput
            name="description"
            value={formData.description}
            onChange={(e) => {
              
              setFormData((prev) => ({
                ...prev,
                description:e.target.value
              }));
            }}
            placeholder="Description"
          />
          <NumberInput
            name="phone"
            max={9999999999}
            value={formData?.personal_details?.phone}
            placeholder="Phone"
            onChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                personal_details: {
                  ...prev.personal_details,
                  phone: e.target.value
                }
              }));
            }}
            
          />
         
        {user.account_type == "Employeer" && (
          <>
            <DateInput
              name="found_in_date"
              type={"date"}
              value={formData?.company_details?.found_in_date.split("T")[0]}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  company_details: {
                    ...prev.company_details,
                    found_in_date: e.target.value,
                  },
                }));
              }}
              placeholder="Found in"
              isRequired={true}
            />
          </>
        )}

        <LocationInput
          name="location"
          value={formData?.location}
          onChange={handleInputChange}
          placeholder="Location"
          isRequired={true}
        />

        <UrlInput
          name="githubLink"
          value={formData?.githubLink}
          onChange={handleInputChange}
          placeholder="Github"
        />
        <UrlInput
          name="linkedInLink"
          value={formData?.linkedInLink}
          onChange={handleInputChange}
          placeholder="LinkedIn"
        />
        {user.account_type == "Candidate" && (
          <UrlInput
            name="portfolio"
            value={formData?.personal_details?.portfolio}
            onChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                personal_details: {
                  ...prev.personal_details,
                  portfolio: e.target.value,
                },
              }));
            }}
            placeholder="Portfolio"
          />
        )}
        {user.account_type == "Employeer" && (
          <UrlInput
            name="website"
            value={formData?.company_details?.website}
            onChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                company_details: {
                  ...prev.company_details,
                  website: e.target.value,
                },
              }));
            }}
            placeholder="Website"
          />
        )}
        </div>
      </div>
      <div className="mt-8 px-4 sm:px-8 flex w-full justify-end">
       
        <button
          className="bg-gray-800 w-full py-2 text-lg flex items-center justify-center px-7 rounded-md font-semibold disabled:bg-gray-600 text-white"
          disabled={!isFormValid()}
          onClick={handleSave}
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
        </button>
      </div>
    </div>
  );
}

export default PersonalDetailsForm;
