import React, { useState } from "react";
import Button from "../Button/Button";
import useProfileApi from "../../services/profileService";
import TextInput from "../Input/TextInput";
import NumberInput from "../Input/NumberInput";
import DateInput from "../Input/DateInput";

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
    } else if (name === "obtained_grades" && value > formData.maximum_grades) {
      value = formData.maximum_grades;
    } else if (value < 0) {
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

  console.log("formData:", formData);
  console.log("educationdata:", educationdata);
  console.log("Deep equal result:", deepEqual(formData, educationdata));
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
          !deepEqual(formData, educationdata)
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
          !deepEqual(formData, educationdata)
        );
      case "Class X":
        return !(
          formData.board &&
          formData.school_name &&
          formData.passing_out_year &&
          formData.percentage &&
          !deepEqual(formData, educationdata)
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
          <div className="flex flex-col gap-5">
            <TextInput
              name="university"
              className={"mt-1.5"}
              placeholder="University/Institute name"
              value={formData.university}
              onChange={handleInputChange}
              isRequired={true}
            />
            <TextInput
              name="course"
              placeholder="Course"
              value={formData.course}
              onChange={handleInputChange}
              isRequired={true}
            />
            <TextInput
              name="specialization"
              placeholder="Specialization"
              value={formData.specialization}
              onChange={handleInputChange}
              isRequired={true}
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
            <NumberInput
              name="percentage"
              placeholder="Percentage"
              className={`${
                formData.marking_system === "Percentage" ? null : "hidden"
              } `}
              value={formData.percentage}
              max="100"
              onChange={handleInputChange}
              isRequired={true}
            />
            <div
              className={`flex flex-wrap  gap-4 w-full ${
                formData.marking_system === "Grades" ? null : "hidden"
              }`}
            >
              <NumberInput
                name="obtained_grades"
                placeholder="Obtained grades"
                value={formData.obtained_grades}
                max={formData.maximum_grades}
                min="0"
                className={`flex-grow min-w-40`}
                onChange={handleInputChange}
                isRequired={true}
              />
              <NumberInput
                name="maximum_grades"
                placeholder="Maximum grades"
                value={formData.maximum_grades}
                max={100}
                min="0"
                className={`flex-grow min-w-40 `}
                onChange={handleInputChange}
                isRequired={true}
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
            <div className="flex gap-4 flex-wrap w-full ">
              <DateInput
                type="month"
                name="start_month"
                placeholder="Start Date"
                value={formatDate(formData.start_month)}
                onChange={handleInputChange}
                min={minDateFormatted}
                className={'flex-grow'}
                max={
                  formData.end_month
                    ? formatDate(formData.end_month)
                    : todayFormatted
                }
                isRequired={true}
              />
              <DateInput
                type="month"
                name="end_month"
                placeholder="End Date"
                value={formatDate(formData.end_month)}
                onChange={handleInputChange}
                className={'flex-grow'}
                min={
                  formData.start_month
                    ? formatDate(formData.start_month)
                    : minDateFormatted
                }
                max={todayFormatted}
                isRequired={true}
              />
            </div>
          </div>
        );
      case "Class XII":
        return (
          <div className="flex flex-col gap-5">
            <TextInput
              name="board"
              placeholder="Board"
              value={formData.board}
              onChange={handleInputChange}
              isRequired={true}
            />
            <TextInput
              name="school_name"
              placeholder="College name"
              value={formData.school_name}
              onChange={handleInputChange}
              isRequired={true}
            />
            <DateInput
              type="month"
              name="passing_out_year"
              placeholder="End Date"
              value={formData.passing_out_year}
              onChange={handleInputChange}
              isRequired={true}
            />
            <NumberInput
              name="percentage"
              placeholder="percentage in % out 100*"
              value={formData.percentage}
              onChange={handleInputChange}
              isRequired={true}
            />
            <div className="flex flex-wrap gap-2">
              <NumberInput
                name="maths"
                placeholder="Maths"
                value={formData.maths}
                onChange={handleInputChange}
                isRequired={true}
              />
              <NumberInput
                name="physics"
                placeholder="Physics"
                value={formData.physics}
                onChange={handleInputChange}
                isRequired={true}
              />
              <NumberInput
                name="chemistry"
                placeholder="Chemistry"
                value={formData.chemistry}
                onChange={handleInputChange}
                isRequired={true}
              />
            </div>
          </div>
        );
      case "Class X":
        return (
          <div className="space-y-4">
            <TextInput
              name="board"
              placeholder="Board*"
              value={formData.board}
              onChange={handleInputChange}
              isRequired={true}
            />
            <TextInput
              name="school_name"
              placeholder="School Name"
              value={formData.school_name}
              onChange={handleInputChange}
              isRequired={true}
            />
            <DateInput
              type="month"
              name="passing_out_year"
              placeholder="End Date"
              value={formData.passing_out_year}
              onChange={handleInputChange}
              isRequired={true}
            />
            <NumberInput
              name="percentage"
              placeholder="Percentage"
              value={formData.percentage}
              onChange={handleInputChange}
              isRequired={true}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <form
      className=" z-20 flex flex-col w-full   sm:max-h-96 overflow-auto h-full  bg-white pt-2 pb-6 px-4 sm:px-8 rounded-sm"
      onClick={(e) => e.stopPropagation()}
    >
      <div className=" sticky z-20 -top-2.5 py-4  border border-white bg-white">
        <h1 className="text-xl font-medium">Education</h1>
        <p className="text-sm text-gray-400 ">
          Update the education details to what you originally wanted it to be
        </p>
      </div>

      <div className="flex-1 pt-1.5">{renderEducationUpdateForm()}</div>
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
            disabled={isUpdateDisabled()}
            className="bg-blue-500 rounded-full text-white disabled:bg-blue-300"
            onClick={onSave}
          >
            Update
          </Button>
        </div>
      </div>
    </form>
  );
}

export default EducationUpdateForm;
