import React, { useState } from "react";
import Button from "../Button/Button";
import TextInput from "../Input/TextInput";
import NumberInput from "../Input/NumberInput";
import TextAreaInput from "../Input/TextAreaInput";
import DateInput from "../Input/DateInput";
import useProfileApi from "../../services/profileService";

function PersonalDetailsForm({ onClose, data, setdata }) {
  const [loading, setloading] = useState(false);
  const [formData, setFormData] = useState(data || {});
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
    setloading(true)
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
        {/* <button className="mr-2 py-2 px-7 rounded-md font-semibold text-blue-500" onClick={onClose}>
          Cancel
        </button> */}
        <button className="bg-blue-500 py-2 px-7 rounded-md font-semibold disabled:bg-blue-300 text-white" disabled={!isFormValid() || loading} onClick={handleSave}>
        {
              loading? (
                 <svg className="inline w-7 h-7 text-transparent animate-spin fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                  </svg>
              ) :"Update"
            }
        </button>
      </div>
    </form>
  );
}

export default PersonalDetailsForm;
