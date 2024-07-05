import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Button from "../Button/Button";
import useProfileApi from "../../services/profileService";

function EducationForm({ onClose, setData, data }) {
  const typesOfEducation = [
    "Post Graduate",
    "Graduate",
    "Class XII",
    "Class X",
  ];
  const [educationType, setEducationType] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [formData, setFormData] = useState({
    educationType: "",
    university: "",
    course: "",
    specialization: "",
    start_month: "",
    end_month: "",
    board: "",
    school_name: "",
    passing_out_year: "",
    obtained_grades: "",
    maximum_grades: "",
    percentage: "",
    maths: "",
    physics: "",
    chemistry: "",
    educationMode: "",
    marking_system : ""
  });
  const profileApi = useProfileApi();

  const hasClass12 = data.some(
    (education) => education.educationType === "Class XII"
  );
  const hasClass10 = data.some(
    (education) => education.educationType === "Class X"
  );
  const today = new Date();

  // Calculate 20 years ago from today
  const minDate = new Date();
  minDate.setFullYear(today.getFullYear() - 20);
  
  // Format minDate to 'YYYY-MM-DD' for input[type="date"]
  const minDateFormatted = minDate.toISOString().split("T")[0];
  
  // Format today to 'YYYY-MM-DD' for input[type="date"]
  const todayFormatted = today.toISOString().split("T")[0].slice(0, 7);;
  useEffect(() => {
    setFormData((prevState) => ({ ...prevState, educationType }));
  }, [educationType]);

  const onSave = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const filteredData = Object.entries(formData)
        .filter(([key, value]) => value !== null && value !== "")
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

      const educationData = await profileApi.education.add(filteredData, token);
      setData((prev) => [...prev, educationData]);
      onClose();
    } catch (error) {
      console.error("Error in addEducation:", error);
    }
  };


  const isPostGraduateOrGraduateFilled = () => {
    return (
      formData.university &&
      formData.course &&
      formData.marking_system &&
      (formData.marking_system == "Percentage"? formData.percentage:formData.obtained_grades && formData.maximum_grades)&&
      formData.specialization &&
      formData.start_month &&
      formData.end_month &&
      formData.educationMode
    );
  };

  const isClassXIIFilled = () => {
    return (
      formData.board &&
      formData.school_name &&
      formData.passing_out_year &&
      formData.percentage &&
      formData.maths &&
      formData.physics &&
      formData.chemistry
    );
  };

  const isClassXFilled = () => {
    return (
      formData.board &&
      formData.school_name &&
      formData.passing_out_year &&
      formData.percentage
    );
  };

  const isSaveDisabled = () => {
    switch (educationType) {
      case "Post Graduate":
        return !isPostGraduateOrGraduateFilled();
      case "Graduate":
        return !isPostGraduateOrGraduateFilled();
      case "Class XII":
        return !isClassXIIFilled();
      case "Class X":
        return !isClassXFilled();
      default:
        return true;
    }
  };


  const handleCancel = (e) => {
    e.preventDefault();

    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    } else {
      onClose();
    }
  };

  const handleInputChange = (e) => {
    let { name, value } = e.target;

    if (!isNaN(value)) {
      const regex = /^\d*\.?\d{0,2}$/;
      if (!regex.test(value)) {
        return; // Do not update state if the value has more than 2 decimal places
      }
  
      value = Number(value);
    }

    if ((name === "percentage" || name === "obtained_grades" || name === "maximum_grades") && value > 100) {
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

  const renderEducationForm = () => {
    switch (educationType) {
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
                  onClick={() =>
                  {
                    if(marking === "Percentage"){
                      setFormData((prevState) => ({ ...prevState, ["obtained_grades"]: "" }));
                      setFormData((prevState) => ({ ...prevState, ["maximum_grades"]: "" }));

                    }
                    else{
                      setFormData((prevState) => ({ ...prevState, ["percentage"]: "" }));
                    }
                    handleInputChange({
                      target: { name: "marking_system", value: marking },
                    })
                  }
                  }
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
                className={`${formData.marking_system == "Percentage"?null:"hidden"} border outline-none focus:border-blue-500 p-2 w-full rounded-sm`}
                value={formData.percentage}
                max="100"
                onChange={handleInputChange}
              />
            <div className={` flex gap-4 ${formData.marking_system == "Grades"?null:"hidden"}`}>
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
                  min={0}
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
              {/* <select
                name="start_month"
                className="border p-2 w-fit rounded-sm max-w-40"
                value={formData.start_month}
                onChange={handleInputChange}
              >
                <option value="">Start year</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <select
                name="end_month"
                className="border p-2 w-fit rounded-sm max-w-40"
                value={formData.end_month}
                onChange={handleInputChange}
              >
                <option value="">End year</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select> */}
              <input
                type="month"
                name="start_month"
                placeholder="Start Date*"
                className="border bg-white outline-none focus:border-blue-500 p-2 rounded-sm w-full"
                value={formData.start_month}
                onChange={handleInputChange}
                min={minDateFormatted}
                max={formData.end_month || todayFormatted}
              />
              <input
                type="month"
                name="end_month"
                placeholder="End Date*"
                className="border bg-white outline-none focus:border-blue-500 p-2 rounded-sm w-full"
                value={formData.end_month}
                onChange={handleInputChange}
                min={formData.start_month}
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
              className="border bg-white outline-none focus:border-blue-500 rounded-sm p-2 w-full"
              value={formData.school_name}
              onChange={handleInputChange}
            />
           <input
                type="month"
                name="passing_out_year"
                placeholder="End Date*"
                className="border bg-white outline-none focus:border-blue-500 p-2 rounded-sm w-full"
                value={formData.passing_out_year}
                onChange={handleInputChange}
              />
            <input
              type="text"
              name="percentage"
              placeholder="percentage in % out 100*"
              className="border outline-none focus:border-blue-500 rounded-sm p-2 w-full"
              value={formData.percentage}
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
                name="passing_out_year"
                placeholder="End Date*"
                className="border bg-white outline-none focus:border-blue-500 p-2 rounded-sm w-full"
                value={formData.passing_out_year}
                onChange={handleInputChange}
              />
            <input
              type="text"
              name="percentage"
              placeholder="percentage in % out 100*"
              className="border outline-none focus:border-blue-500 rounded-sm p-2 w-full"
              value={formData.percentage}
              onChange={handleInputChange}
            />
          </div>
        );
      default:
        return null;
    }
  };

  const pages = [
    {
      content: (
        <div className="flex flex-col flex-wrap  justify-between gap-2 h-full">
          <div>
            <p className="text-sm font-medium">
              Education<span className="text-red-500">*</span>
            </p>
            <div className="flex gap-3 mt-2 text-nowrap flex-wrap px-2">
              {typesOfEducation.map((type) => (
                <p
                  key={type}
                  onClick={() => setEducationType(type)}
                  className={`  ${
                    educationType === type
                      ? "scale-110 bg-blue-50 text-blue-500 border-blue-500 font-semibold"
                      : "text-gray-500 border-gray-300"
                  } border transition-all ease-in-out 0.3ms px-4 h-fit py-2 text-sm cursor-pointer rounded-md ${
                    (hasClass10 && type === "Class X") ||
                    (hasClass12 && type === "Class XII")
                      ? "hidden"
                      : ""
                  }`}
                >
                  {type}
                </p>
              ))}
            </div>
          </div>
          <div className="flex justify-end items-center w-full">
            <Button
              className="text-blue-500 font-medium"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              disabled={!educationType}
              className="bg-blue-500 rounded-full text-white disabled:bg-blue-300"
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      ),
    },
    {
      content: (
        <div className="flex flex-col h-full  gap-4">
          <div className="flex-1">{renderEducationForm()}</div>
          <div className="flex justify-end items-center mt-10 w-full">
            <Button
              className="text-blue-500 font-medium"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              disabled={isSaveDisabled()}
              className="bg-blue-500 rounded-full text-white disabled:bg-blue-300"
              onClick={onSave}
            >
              Save
            </Button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="relative flex flex-col gap-4 pt-2 pb-6 px-4 sm:px-8  w-full h-full sm:max-w-lg bg-white ">
      <form onSubmit={onSave} className="flex flex-col h-full gap-4 w-full">
        <div className="py-4 sticky z-10 -top-2.5">
          <h2 className="text-xl font-medium">Education</h2>
          <p className="text-sm text-gray-400">
            Adding the education or course type helps recruiters know your
            educational background
          </p>
        </div>
       <div className="sm:max-h-60 overflow-auto sm:px-2 h-full"> {pages[currentPage].content}</div>
      </form>
    </div>
  );
}

EducationForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  setData: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired,
};

export default EducationForm;
