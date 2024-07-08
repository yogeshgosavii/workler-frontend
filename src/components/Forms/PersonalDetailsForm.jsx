import React, { useState } from "react";
import Button from "../Button/Button";
import TextInput from "../Input/TextInput";
import NumberInput from "../Input/NumberInput";
import TextAreaInput from "../Input/TextAreaInput";
import DateInput from "../Input/DateInput";
import useProfileApi from "../../services/profileService";

function PersonalDetailsForm({ onClose, personalDetailsData, setPersonalDetailsData }) {
  const [formData, setFormData] = useState(personalDetailsData || {});
  const profileApi = useProfileApi();

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const isFormValid = () => {
    if(formData.fullname!="" && formData.birthdate!=""){
      return true
    };
    return false
  };

  const handleInputChange = (e) => {
    console.log(formData);
    const { name, value } = e.target;
    if (name === "phone") {
      if (value.length <= 10) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    if (!isFormValid()) {
      return;
    }

    try {
      const filteredData = Object.entries(formData)
        .filter(([key, value]) => value !== null && value !== "")
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

      const token = localStorage.getItem("token");
      const personalData = await profileApi.personalDetails.add(filteredData, token);

      console.log("Personal data saved successfully:", personalData);
    } catch (error) {
      console.error("Error saving personal details:", error);
    }
  };

  return (
    <form className="bg-white pt-6 pb-6 px-4 sm:px-8 rounded-sm w-full flex flex-col justify-between h-full">
      <div className="">
        <h2 className="text-xl font-medium">Personal Details</h2>
        <div className="flex flex-col w-full gap-6 mt-5">
          <TextInput
            name="fullname"
            value={formData.fullname}
            onChange={handleInputChange}
            placeholder="Full name"
            isRequired={true}
          />
          <NumberInput
            name="phone"
            value={formData.phone}
            placeholder="Phone"
            onChange={handleInputChange}
          />
          <TextAreaInput
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Address"
          />
          <DateInput
            type="date"
            name="birthdate"
            value={formatDate(formData.birthdate)}
            className="w-full"
            onChange={handleInputChange}
            placeholder="Birthdate"
            isRequired={true}
          />
        </div>
      </div>
      <div className="mt-8 flex justify-end">
        <button className="mr-2 py-2 px-7 rounded-md font-semibold text-blue-500" onClick={onClose}>
          Cancel
        </button>
        <button className="bg-blue-500 py-2 px-7 rounded-md font-semibold disabled:bg-blue-300 text-white" disabled={!isFormValid()} onClick={handleSave}>
          Update
        </button>
      </div>
    </form>
  );
}

export default PersonalDetailsForm;
