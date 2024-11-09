import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Button from "../Button/Button";
import useProfileApi from "../../services/profileService";
import TextInput from "../Input/TextInput";
import NumberInput from "../Input/NumberInput";
import DateInput from "../Input/DateInput";

function EducationForm({ onClose, setData, data }) {
  const typesOfEducation = [
    "Post Graduate",
    "Graduate",
    "Class XII",
    "Class X",
  ];
  const [loading, setloading] = useState(false);
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
    marking_system: "",
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
  const todayFormatted = today.toISOString().split("T")[0].slice(0, 7);
  useEffect(() => {
    setFormData((prevState) => ({ ...prevState, educationType }));
  }, [educationType]);

  const onSave = async (e) => {
    e.preventDefault();
    setloading(true);
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
    } finally {
      setloading(false);
    }
  };

  const isPostGraduateOrGraduateFilled = () => {
    return (
      formData.university &&
      formData.course &&
      formData.marking_system &&
      (formData.marking_system == "Percentage"
        ? formData.percentage
        : formData.obtained_grades && formData.maximum_grades) &&
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

    onClose();
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

    if (
      (name === "percentage" ||
        name === "obtained_grades" ||
        name === "maximum_grades") &&
      value > 100
    ) {
      value = 100;
    } else if (name === "obtained_grades" && value > formData.maximum_grades) {
      value = formData.maximum_grades;
    } else if (value < 0) {
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
            <TextInput
              name={"university"}
              className={"mt-1.5"}
              placeholder={"University/Institute name"}
              isRequired={true}
              value={formData.university}
              onChange={handleInputChange}
            />
            <TextInput
              name={"course"}
              placeholder={"Course"}
              isRequired={true}
              value={formData.course}
              onChange={handleInputChange}
            />
            <TextInput
              name="specialization"
              placeholder="Specialization"
              isRequired={true}
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
                        ["obtained_grades"]: "",
                      }));
                      setFormData((prevState) => ({
                        ...prevState,
                        ["maximum_grades"]: "",
                      }));
                    } else {
                      setFormData((prevState) => ({
                        ...prevState,
                        ["percentage"]: "",
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
              placeholder={"Percentage"}
              className={`${
                formData.marking_system == "Percentage" ? null : "hidden"
              }`}
              value={formData.percentage}
              isRequired={true}
              max="100"
              onChange={handleInputChange}
            />
            <div
              className={` flex gap-4 ${
                formData.marking_system == "Grades" ? null : "hidden"
              }`}
            >
              <NumberInput
                name="obtained_grades"
                placeholder="Obtained grades"
                value={formData.obtained_grades}
                max={formData.maximum_grades}
                min="0"
                className={"w-full"}
                isRequired={true}
                onChange={handleInputChange}
              />
              <NumberInput
                name="maximum_grades"
                placeholder="Maximum grades"
                className={"w-full"}
                min={0}
                isRequired={true}
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
            <div className="flex flex-wrap justify-stretch items-stretch gap-4 w-full ">
              <DateInput
                type="month"
                name="start_month"
                placeholder="Start Date"
                isRequired={true}
                value={formData.start_month}
                onChange={handleInputChange}
                className="flex-grow"
                min={minDateFormatted}
                max={formData.end_month || todayFormatted}
              />
              <DateInput
                type="month"
                name="end_month"
                placeholder="End Date"
                className="flex-grow"
                isRequired={true}
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
          <div className="flex flex-col gap-5 pt-1.5">
            <TextInput
              name="board"
              placeholder="Board"
              value={formData.board}
              onChange={handleInputChange}
              isRequired={true}
            />
            <TextInput
              name="school_name"
              placeholder="College/School name"
              value={formData.school_name}
              onChange={handleInputChange}
              isRequired={true}
            />
            <DateInput
              type="month"
              name="passing_out_year"
              className={"w-full"}
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
            <div className="flex flex-wrap gap-2">
              <NumberInput
                name="maths"
                placeholder="Maths"
                className={"flex-grow"}
                value={formData.maths}
                onChange={handleInputChange}
                isRequired={true}
              />
              <NumberInput
                name="physics"
                placeholder="Physics"
                className={"flex-grow"}
                value={formData.physics}
                onChange={handleInputChange}
                isRequired={true}
              />
              <NumberInput
                name="chemistry"
                placeholder="Chemistry"
                className={"flex-grow"}
                value={formData.chemistry}
                onChange={handleInputChange}
                isRequired={true}
              />
            </div>
          </div>
        );
      case "Class X":
        return (
          <div className="flex flex-col gap-5 pt-1.5">
            <TextInput
              name="board"
              placeholder="Board"
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
              className={"w-full"}
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

  const pages = [
    {
      content: (
        <div className="flex flex-col flex-wrap  justify-between gap-2 h-full">
          <div className="flex-1  ">
            <p className="text-sm font-medium">
              Education<span className="text-red-500">*</span>
            </p>
            <div className="flex flex-1 gap-3 mt-2 text-nowrap flex-wrap px-2">
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
            {/* <Button
              className="text-blue-500 font-medium"
              onClick={handleCancel}
            >
              Cancel
            </Button> */}
            <button
              disabled={!educationType}
              className="text-gray-800 items-center  flex gap-2 text-lg font-bold rounded-full  disabled:text-gray-600"
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              <span>Next</span>
              <svg
                class="h-8 w-8 "
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      ),
    },
    {
      content: (
        <div className="flex flex-col h-full  gap-4">
          <div className="flex-1 overflow-auto">{renderEducationForm()}</div>
          <div className="flex justify-end items-center mt-10 w-full">
            {/* <Button
              className="text-blue-500 font-medium"
              onClick={handleCancel}
            >
              Cancel
            </Button> */}
            <Button
              disabled={isSaveDisabled() || loading}
              className="bg-gray-800 flex justify-center items-center text-lg w-full rounded-full text-white disabled:bg-gray-600"
              onClick={onSave}
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
                "Save"
              )}
            </Button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="relative flex flex-col gap-4 pt-2 pb-6 px-4 sm:px-8  w-full h-full sm:max-w-2xl overflow-auto bg-white ">
      <form
        onSubmit={onSave}
        className="flex flex-col  gap-4 flex-grow  w-full"
      >
        <div className="py-4 sticky z-40 -top-2.5 bg-white">
          <h2 className="text-xl font-medium">Education</h2>
          <p className="text-sm text-gray-400">
            Adding the education or course type helps recruiters know your
            educational background
          </p>
        </div>
        <div className="sm:max-h-60 h-full "> {pages[currentPage].content}</div>
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
