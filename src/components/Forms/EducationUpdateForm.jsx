import React, { useState } from "react";
import Button from "../Button/Button";
import useProfileApi from "../../services/profileService";

function EducationUpdateForm({
  educationdata,
  seteducationdata,
  onClose,
  index,
}) {
  const [formData, setFormData] = useState(educationdata);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);
  const profileApi = useProfileApi();

  const today = new Date();
  const todayFormatted = today.toISOString().split("T")[0].slice(0, 7); // Format: YYYY-MM
  const minDate = new Date(today.getFullYear() - 100, today.getMonth());
  const minDateFormatted = minDate.toISOString().split("T")[0].slice(0, 7); // Format: YYYY-MM
  const formatDate = (dateString) => {
    return new Date(dateString).toISOString().split("T")[0].slice(0, 7);
  };

  const handleInputChange = (e) => {
    let { name, value } = e.target;
    value = isNaN(Number(value)) ? value : Number(value);

    if (!isNaN(value)) {
      const regex = /^\d*\.?\d{0,2}$/;
      if (!regex.test(value)) {
        return; // Do not update state if the value has more than 2 decimal places
      }
  
      value = Number(value);
    }
    
    if ((name === "percentage" || name === "maximum_grades") && value > 100) {
      value = 100;
    }
    else if( name === "obtained_grades" && value > formData.maximum_grades){
      value = formData.maximum_grades
    }
    else if(value<0){
      value = 0;
    }

    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const onSave = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const updatededucationdata = await profileApi.education.update(
        formData._id,
        formData
      );
      onClose();
      seteducationdata((prevData) => {
        return prevData.map((item) => {
          if (item._id === formData._id) {
            return formData;
          }
          return item;
        });
      });
    } catch (error) {
      console.error("Error updating education data:", error);
    }
  };

  const onDelete = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      await profileApi.education.delete(formData._id, token);
      seteducationdata((prevData) =>
        prevData.filter((item) => item._id !== educationdata._id)
      );
      onClose();
    } catch (error) {
      console.error("Error updating education data:", error);
    }
  };
  const deepEqual = (obj1, obj2) => {
    // Check if both values are strictly equal
    if (obj1 === obj2) {
      return true;
    }
  
    // Check if either value is not an object or is null
    if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
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
        if (typeof obj1[key] === 'number' && typeof obj2[key] === 'number' && obj1[key] === obj2[key]) {
          continue; // Continue checking other keys
        }
        return false;
      }
    }
  
    // If all checks pass, the objects are deeply equal
    return true;
  };
  
  console.log('formData:', formData);
  console.log('educationdata:', educationdata);
  console.log('Deep equal result:', deepEqual(formData, educationdata));
    const isUpdateDisabled = () => {
    switch (educationdata.educationType) {
      case "Post Graduate":
      case "Graduate":
        return !(
          formData.university &&
          formData.course &&
          formData.marking_system &&
          (formData.marking_system === "Percentage"
            ? formData.percentage
            : formData.obtained_grades && formData.maximum_grades) &&
          formData.specialization &&
          formData.start_month &&
          formData.end_month &&
          formData.educationMode &&
          !deepEqual(formData,educationdata)
        );
      case "Class XII":
        return !(
          formData.board &&
          formData.school_name &&
          formData.passing_out_year &&
          formData.percentage &&
          formData.maths &&
          formData.physics &&
          formData.chemistry &&
          !deepEqual(formData,educationdata)
        );
      case "Class X":
        return !(
          formData.board &&
          formData.school_name &&
          formData.passing_out_year &&
          formData.percentage &&
          !deepEqual(formData,educationdata)
        );
      default:
        return true;
    }
  };

  const renderEducationUpdateForm = () => {
    switch (educationdata.educationType) {
      case "Post Graduate":
      case "Graduate":
        return (
          <div className="flex flex-col gap-4">
            <input
              type="text"
              name="university"
              placeholder="University/Institute name*"
              className="border outline-none focus:border-blue-500 p-2 w-full rounded-sm"
              value={formData.university}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="course"
              placeholder="Course"
              className="border outline-none focus:border-blue-500 p-2 w-full rounded-sm"
              value={formData.course}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="specialization"
              placeholder="Specialization"
              className="border outline-none focus:border-blue-500 p-2 w-full rounded-sm"
              value={formData.specialization}
              onChange={handleInputChange}
            />
            <div className="flex gap-2">
              {["Percentage", "Grades"].map((marking) => (
                <p
                  key={marking}
                  name="marking_system"
                  onClick={() => {
                    if (marking === "Percentage") {
                      setFormData((prevState) => ({
                        ...prevState,
                        obtained_grades: "",
                        maximum_grades: "",
                      }));
                    } else {
                      setFormData((prevState) => ({
                        ...prevState,
                        percentage: "",
                      }));
                    }
                    handleInputChange({
                      target: { name: "marking_system", value: marking },
                    });
                  }}
                  className={`${
                    marking === formData.marking_system
                      ? "bg-blue-50 border-blue-500 text-blue-500"
                      : "border text-gray-500"
                  } border cursor-pointer px-4 py-1 w-fit rounded-md`}
                >
                  {marking}
                </p>
              ))}
            </div>
            <input
              type="number"
              name="percentage"
              placeholder="Percentage"
              className={`${
                formData.marking_system === "Percentage" ? null : "hidden"
              } border outline-none focus:border-blue-500 p-2 w-full rounded-sm`}
              value={formData.percentage}
              max="100"
              onChange={handleInputChange}
            />
            <div
              className={`flex gap-4 ${
                formData.marking_system === "Grades" ? null : "hidden"
              }`}
            >
              <input
                type="number"
                name="obtained_grades"
                placeholder="Obtained grades"
                className="border outline-none focus:border-blue-500 p-2 w-full rounded-sm"
                value={formData.obtained_grades}
                max={formData.maximum_grades}
                min="0"
                onChange={handleInputChange}
              />
              <input
                type="number"
                name="maximum_grades"
                placeholder="Maximum grades"
                min="0"
                className="border outline-none focus:border-blue-500 p-2 w-full rounded-sm"
                value={formData.maximum_grades}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex gap-2">
              {["Full time", "Part time"].map((mode) => (
                <p
                  key={mode}
                  name="educationMode"
                  onClick={() =>
                    handleInputChange({
                      target: { name: "educationMode", value: mode },
                    })
                  }
                  className={`${
                    mode === formData.educationMode
                      ? "bg-blue-50 border-blue-500 text-blue-500"
                      : "border text-gray-500"
                  } border cursor-pointer px-4 py-1 w-fit rounded-md`}
                >
                  {mode}
                </p>
              ))}
            </div>
            <div className="flex gap-4 w-full ">
            <input
                type="month"
                name="start_month"
                placeholder="Start Date*"
                className="border bg-white outline-none focus:border-blue-500 p-2 rounded-sm w-full"
                value={formatDate(formData.start_month)}
                onChange={handleInputChange}
                min={minDateFormatted}
                max={formData.end_month ? formatDate(formData.end_month) : todayFormatted}
              />
               <input
                type="month"
                name="end_month"
                placeholder="End Date*"
                className="border bg-white outline-none focus:border-blue-500 p-2 rounded-sm w-full"
                value={formatDate(formData.end_month)}
                onChange={handleInputChange}
                min={formData.start_month ? formatDate(formData.start_month) : minDateFormatted}
                max={todayFormatted}
              />
            </div>
          </div>
        );
      case "Class XII":
        return (
          <div className="space-y-4">
            <input
              type="text"
              name="board"
              placeholder="Board*"
              className="border outline-none focus:border-blue-500 p-2 rounded-sm w-full"
              value={formData.board}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="school_name"
              placeholder="School Name*"
              className="border outline-none focus:border-blue-500 rounded-sm p-2 w-full"
              value={formData.school_name}
              onChange={handleInputChange}
            />
            <input
              type="month"
              name="passing_out_month"
              placeholder="End Date*"
              className="border bg-white outline-none focus:border-blue-500 p-2 rounded-sm w-full"
              value={formatDate(formData.passing_out_month)}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="marks"
              placeholder="Marks in % out 100*"
              className="border outline-none focus:border-blue-500 rounded-sm p-2 w-full"
              value={formData.marks}
              onChange={handleInputChange}
            />
            <div className="flex gap-2">
              <input
                type="text"
                name="maths"
                placeholder="Maths"
                className="border outline-none focus:border-blue-500 rounded-sm p-2 w-full"
                value={formData.maths}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="physics"
                placeholder="Physics"
                className="border outline-none focus:border-blue-500 rounded-sm p-2 w-full"
                value={formData.physics}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="chemistry"
                placeholder="Chemistry"
                className="border outline-none focus:border-blue-500 rounded-sm p-2 w-full"
                value={formData.chemistry}
                onChange={handleInputChange}
              />
            </div>
          </div>
        );
      case "Class X":
        return (
          <div className="space-y-4">
            <input
              type="text"
              name="board"
              placeholder="Board*"
              className="border outline-none focus:border-blue-500 p-2 rounded-sm w-full"
              value={formData.board}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="school_name"
              placeholder="School Name*"
              className="border outline-none focus:border-blue-500 rounded-sm p-2 w-full"
              value={formData.school_name}
              onChange={handleInputChange}
            />
            <input
              type="month"
              name="passing_out_month"
              placeholder="End Date*"
              className="border bg-white outline-none focus:border-blue-500 p-2 rounded-sm w-full"
              value={formData(formData.passing_out_month)}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="marks"
              placeholder="Marks in % out 100*"
              className="border outline-none focus:border-blue-500 rounded-sm p-2 w-full"
              value={formData.marks}
              onChange={handleInputChange}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="fixed inset-0 z-10 flex h-full w-full  border border-blue-500  justify-center items-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="fixed z-20 flex flex-col w-full sm:max-w-md h-full sm:h-fit mx-auto bg-white pt-2 pb-6 px-4 sm:px-8 rounded-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="py-4 ">
          <h1 className="text-xl font-medium">Education</h1>
          <p className='text-sm text-gray-400 mb-8'>Update the education details to what you originally wanted it to be</p>
        </div>

        <div className="flex-1 ">{renderEducationUpdateForm()}</div>
        <div className="flex justify-between items-center mt-12 w-full">
          <svg
            onClick={onDelete}
            className="h-6 w-6 cursor-pointer text-red-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
          <div>
            <Button className="text-blue-500 font-medium" onClick={onClose}>
              Cancel
            </Button>
            <Button
              disabled={isUpdateDisabled()  }
              className="bg-blue-500 rounded-full text-white disabled:bg-blue-300"
              onClick={onSave}
            >
              Update
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EducationUpdateForm;
