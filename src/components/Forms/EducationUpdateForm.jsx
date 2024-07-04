import React, { useState } from "react";
import Button from "../Button/Button";
import useProfileApi from "../../services/profileService";

function EducationUpdateForm({
  educationdata,
  setEducationData,
  onClose,
  index,
}) {
  const [formData, setFormData] = useState(educationdata);
  console.log("form", educationdata);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);
  const profileApi = useProfileApi();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
    console.log(formData);
  };

  const onSave = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const updatedEducationData = await profileApi.education.update(
        formData._id,
        formData
      );
      console.log("Updated education data:", updatedEducationData);
      onClose();
      setEducationData((prevData) => {
        return prevData.map((item) => {
          // If the item has the same ID as the new data, replace it with the new data
          if (item._id === formData._id) {
            return formData;
          }
          // Otherwise, keep the item unchanged
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
      const updatedEducationData = await profileApi.education.delete(
        formData._id,
        token
      );
      console.log("Updated education data:", updatedEducationData);
      onClose();
    } catch (error) {
      console.error("Error updating education data:", error);
    }
  };

  const isSaveDisabled = () => {
    switch (educationdata.educationType) {
      case "Post Graduate":
      case "Graduate":
        return !(
          formData.university &&
          formData.course &&
          formData.specialization &&
          formData.start_year &&
          formData.end_year
        );
      case "Class XII":
        return !(
          formData.board &&
          formData.school_name &&
          formData.passing_out_year &&
          formData.marks
        );
      case "Class X":
        return !(
          formData.board &&
          formData.school_name &&
          formData.passing_out_year &&
          formData.marks
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
              className="border p-2 w-full rounded-sm"
              value={formData.university}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="course"
              placeholder="Course"
              className="border p-2 w-full rounded-sm"
              value={formData.course}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="specialization"
              placeholder="Specialization"
              className="border p-2 w-full rounded-sm"
              value={formData.specialization}
              onChange={handleInputChange}
            />
            <input
              type="number"
              name="grades"
              placeholder="Grade out of 10"
              className="border p-2 w-full rounded-sm"
              value={formData.grades}
              onChange={handleInputChange}
            />
            <div className="flex gap-2">
              {["Full time", "Part time"].map((mode) => (
                <p
                  key={mode}
                  name = "educationMode"
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
            <div className="flex gap-4 w-full flex-wrap">
              <select
                name="start_year"
                className="border p-2 w-fit rounded-sm max-w-40"
                value={formData.start_year}
                onChange={handleInputChange}
              >
                <option value="">Start year</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <select
                name="end_year"
                className="border p-2 w-fit rounded-sm max-w-40"
                value={formData.end_year}
                onChange={handleInputChange}
              >
                <option value="">End year</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
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
              className="border p-2 rounded-sm w-full"
              value={formData.board}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="school_name"
              placeholder="School Name*"
              className="border rounded-sm p-2 w-full"
              value={formData.school_name}
              onChange={handleInputChange}
            />
            <select
              name="passing_out_year"
              className="border p-2 w-full rounded-sm"
              value={formData.passing_out_year}
              onChange={handleInputChange}
            >
              <option value="">Passing out year*</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <input
              type="text"
              name="marks"
              placeholder="Marks in % out 100*"
              className="border rounded-sm p-2 w-full"
              value={formData.marks}
              onChange={handleInputChange}
            />
            <div className="flex gap-2">
              <input
                type="text"
                name="maths"
                placeholder="Maths"
                className="border rounded-sm p-2 w-full"
                value={formData.maths}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="physics"
                placeholder="Physics"
                className="border rounded-sm p-2 w-full"
                value={formData.physics}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="chemistry"
                placeholder="Chemistry"
                className="border rounded-sm p-2 w-full"
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
              className="border p-2 rounded-sm w-full"
              value={formData.board}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="school_name"
              placeholder="School Name*"
              className="border rounded-sm p-2 w-full"
              value={formData.school_name}
              onChange={handleInputChange}
            />
            <select
              name="passing_out_year"
              className="border p-2 w-full rounded-sm"
              value={formData.passing_out_year}
              onChange={handleInputChange}
            >
              <option value="">Passing out year*</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <input
              type="text"
              name="marks"
              placeholder="Marks in % out 100*"
              className="border rounded-sm p-2 w-full"
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
            class="h-6 w-6 cursor-pointer text-red-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            {" "}
            <polyline points="3 6 5 6 21 6" />{" "}
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
          <div>
            <Button className="text-blue-500 font-medium" onClick={onClose}>
              Cancel
            </Button>
            <Button
              disabled={isSaveDisabled()}
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
