import React, { useState } from "react";
import Button from "../Button/Button";
import profileService from "../../services/profileService";

function PersonalDetailsForm({ onSave, onClose }) {
  const [fullname, setfullname] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [birthdate, setbirthdate] = useState("");

  const isFormValid = () => {
    return fullname  && phone && address && birthdate;
  };

  const handleSave = async () => {
    if (isFormValid()) {
      try {
        const formData = {
          fullname,
          phone,
          address,
          birthdate,
        };

        
        const filteredData = Object.entries(formData)
          .filter(([key, value]) => value !== null && value !== "")
          .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
    
        const token = localStorage.getItem("token");
        const personalData = await profileService.addPersonalDetails(filteredData, token);
        
        console.log("Personal data saved successfully:", personalData);
        
        // Optionally call onSave if needed
        // onSave(personalData);
        
        // onClose(); // Close the form after successful save
      } catch (error) {
        console.error("Error saving personal details:", error);
        alert("Failed to save personal details. Please try again.");
      }
    } else {
      alert("Please fill in all the fields.");
    }
  };

  return (
    <form className="bg-white p-6 px-8 rounded-sm w-full  flex flex-col justify-between h-full">
      <div className="">
        <h2 className="text-xl font-medium">Personal Details</h2>
        <div className="flex flex-col gap-4 mt-5">
          <div className=" relative flex peer">
            <input
              type="text"
              name="fullname"
              id="fullname"
              value={fullname}
              onChange={(e) => {setfullname(e.target.value);}}
              className="block px-3 py-3 w-full font-normal bg-white rounded-sm border appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=""
              title="Full Name"
            />
            <label
              htmlFor="fullname"
              onClick={(e) => {
                e.preventDefault();
                e.target.previousSibling.focus();
              }}
              className="absolute duration-200 cursor-text px-2 text-gray-400 bg-white font-normal transform -translate-y-5 scale-90 top-2 z-10 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-90 peer-focus:-translate-y-5 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
            >
              Full Name
            </label>
          </div>
          
          

          <div className=" relative flex peer">
            <input
              type="tel"
              name="phone"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="block px-3 py-3 w-full font-normal bg-white rounded-sm border appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=""
              title="Phone number"
            />
            <label
              htmlFor="phone"
              onClick={(e) => {
                e.preventDefault();
                e.target.previousSibling.focus();
              }}
              className="absolute duration-200 cursor-text px-2 text-gray-400 bg-white font-normal transform -translate-y-5 scale-90 top-2 z-10 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-90 peer-focus:-translate-y-5 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
            >
              Phone number
            </label>
          </div>
          <div className="relative flex peer">
            <input
              type="text"
              name="address"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="block px-3 py-3 w-full font-normal bg-white rounded-sm border appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=""
              title="Address"
            />
            <label
              htmlFor="address"
              onClick={(e) => {
                e.preventDefault();
                e.target.previousSibling.focus();
              }}
              className="absolute duration-200 cursor-text px-2 text-gray-400 bg-white font-normal transform -translate-y-5 scale-90 top-2 z-10 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-90 peer-focus:-translate-y-5 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
            >
              Address
            </label>
          </div>
          <div className="relative flex peer">
            <input
              type="date"
              name="birthdate"
              id="birthdate"
              value={birthdate}
              onChange={(e) => setbirthdate(e.target.value)}
              className="block px-3 py-3 w-full font-normal bg-white rounded-sm border appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=""
              title="Date of Birth"
            />
            <label
              htmlFor="birthdate"
              onClick={(e) => {
                e.preventDefault();
                e.target.previousSibling.focus();
              }}
              className="absolute duration-200 cursor-text px-2 text-gray-400 bg-white font-normal transform -translate-y-5 scale-90 top-2 z-10 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-90 peer-focus:-translate-y-5 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
            >
              Date of Birth
            </label>
          </div>
        </div>
      </div>
      <div className="mt-8 flex justify-end">
        <Button className="mr-2 text-blue-500" onClick={onClose}>
          Cancel
        </Button>
        <Button
          className={"bg-blue-500 text-white"}
          onClick={handleSave}
          disabled={!isFormValid()}
        >
          Save
        </Button>
      </div>
    </form>
  );
}

export default PersonalDetailsForm;
