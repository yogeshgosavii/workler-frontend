import React, { useEffect, useState } from "react";
import Button from "../Button/Button";
import useProfileApi from "../../services/profileService";
import { set } from "date-fns/fp/set";
import TextInput from "../Input/TextInput";
import DateInput from "../Input/DateInput";
import NumberInput from "../Input/NumberInput";
import OptionInput from "../Input/OptionInput";

function WorkExperienceForm({ onClose, initialData, setData, data }) {
  const workTypeOptions = ["Full-time", "Internship"];
  const departmentOptions = [
    "Engineering",
    "Marketing",
    "Finance",
    "Human Resources",
    "Sales",
  ];

  console.log(data);
  const currentWorkingSomeWhere = data.some(
    (experience) => experience.currentlyWorking == "Yes"
  );
  console.log(currentWorkingSomeWhere);
  const noticePeriodOptions = [
    "15 days or less",
    "1 Month",
    "2 Months",
    "3 Months",
    "More than 3 Months",
  ];
  const profileApi = useProfileApi();

  const [workExperienceType, setWorkExperienceType] = useState();
  const [currentlyWorkingHere, setCurrentlyWorkingHere] = useState(
    currentWorkingSomeWhere ? "No" : null
  );
  const [currentPage, setCurrentPage] = useState(0);
  const [noticePeriod, setNoticePeriod] = useState(noticePeriodOptions[0]);
  const [formData, setFormData] = useState({
    years: "",
    months: "",
    companyName: "",
    jobTitle: "",
    joiningDate: "",
    annualSalary: "",
    location: "",
    department: "",
    leavingDate: "",
    stipend: "",
    employmentType: workExperienceType,
    currentlyWorking: currentlyWorkingHere,
    noticePeriod: noticePeriodOptions[0],
  });

  useEffect(() => {
    const handlePopState = (event) => {
      if (currentPage > 0) {
        setCurrentPage(currentPage - 1);
      } else {
        onClose();
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  useEffect(() => {
    console.log("Work experience type updated:", workExperienceType);
  }, [workExperienceType]);

  const handleNext = () => {
    setFormData((prev) => ({
      ...prev,
      ["currentlyWorking"]: currentlyWorkingHere,
    }));
    setFormData((prev) => ({
      ...prev,
      ["employmentType"]: workExperienceType,
    }));

    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
      window.history.pushState({ page: currentPage + 1 }, "", "");
    }
  };
  const handleCancel = () => {
    onClose();
    window.history.back();
  };

  const onSave = async () => {
    try {
      if (formData.currentlyWorking == "No") {
        setFormData((prev) => ({
          ...prev,
          ["noticePeriod"]: null,
        }));
      }
      const nonEmptyData = Object.fromEntries(
        Object.entries(formData).filter(([key, value]) => value !== "")
      );
      const data = await profileApi.workExperience.add(nonEmptyData);
      console.log("data", data);
      setData((prev) => [...prev, data]);
      onClose();
    } catch (error) {
      console.error("Error while saving work experience:", error);
    }
  };

  const handleBack = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      window.history.back();
    } else {
      onClose();
    }
  };
  // Get today's date
  const today = new Date();

  // Calculate 20 years ago from today
  const minDate = new Date();
  minDate.setFullYear(today.getFullYear() - 20);

  // Format minDate to 'YYYY-MM-DD' for input[type="date"]
  const minDateFormatted = minDate.toISOString().split("T")[0];

  // Format today to 'YYYY-MM-DD' for input[type="date"]
  const todayFormatted = today.toISOString().split("T")[0];

  const calculateExperience = (joinDate, leaveDate) => {
    if (!joinDate) return;
    if (!leaveDate && currentlyWorkingHere !== "Yes") return;

    if (!leaveDate && currentlyWorkingHere === "Yes") {
      leaveDate = todayFormatted;
    }

    joinDate = new Date(joinDate);
    leaveDate = new Date(leaveDate);

    if (leaveDate < joinDate) {
      return "Leaving date cannot be before joining date.";
    }

    let diffYears = leaveDate.getFullYear() - joinDate.getFullYear();
    let diffMonths = leaveDate.getMonth() - joinDate.getMonth();

    if (diffMonths < 0) {
      diffYears--;
      diffMonths += 12;
    }

    setFormData((prev) => ({ ...prev, years: diffYears, months: diffMonths }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };

    setFormData(updatedFormData);

    const joinDate = name === "joiningDate" ? value : formData.joiningDate;
    const leaveDate = name === "leavingDate" ? value : formData.leavingDate;
    calculateExperience(joinDate, leaveDate);
  };

  const handleWorkExperienceTypeChange = (type) => {
    console.log("Selected employment type:", type);
    setWorkExperienceType(type);
    console.log("Updated employment type:", workExperienceType);
  };

  const isFormValid = () => {
    const {
      companyName,
      jobTitle,
      joiningDate,
      annualSalary,
      location,
      department,
      leavingDate,
      stipend,
    } = formData;
    console.log(formData);

    if (!companyName || !jobTitle) {
      return false;
    }

    if (workExperienceType === "Full-time") {
      if (currentlyWorkingHere === "Yes" && !annualSalary) {
        return false;
      } else if (currentlyWorkingHere === "No" && !leavingDate) {
        return false;
      }
    } else {
      if (!location || !department || !stipend) {
        return false;
      } else {
        return true;
      }
      if (currentlyWorkingHere === "No" && !leavingDate) {
        return false;
      } else {
        return true;
      }
    }

    return true;
  };

  const renderWorkForm = () => {
    const isFullTime = workExperienceType === "Full-time";
    const isCurrentlyWorking = currentlyWorkingHere === "Yes";

    return (
      <div className="flex flex-col h-full gap-6 ">
        <div className="flex-1 flex flex-col gap-6 ">
          <div>
            <p className="font-medium">
              Total experience
              <span className="text-sm text-gray-400 font-normal">
                <span className="text-red-500">*</span> (Auto Generated)
              </span>
            </p>
            <div className="flex items-end gap-4 mt-2">
              <div className="flex w-full gap-1 items-end">
                <input
                  name="years"
                  className="border  focus:border-blue-500 p-2 outline-none  text-center w-full rounded-sm"
                  value={formData.years}
                  readOnly
                  required
                />
                <p>years</p>
              </div>
              <div className="flex w-full items-end gap-1">
                <input
                  name="months"
                  className="border focus:border-blue-500 p-2 outline-none  text-center w-full rounded-sm"
                  value={formData.months}
                  readOnly
                  required
                />
                <p>months</p>
              </div>
            </div>
          </div>
          <TextInput
            name="companyName"
            placeholder={`${
              currentlyWorkingHere === "Yes" ? "Current" : "Previous"
            } company name`}
            value={formData.companyName}
            onChange={handleInputChange}
            isRequired={true}
          />
          <div className="flex gap-4 items-end">
            <TextInput
              type="text"
              name="jobTitle"
              className={"w-full"}
              placeholder={`${
                currentlyWorkingHere === "Yes" ? "Current" : "Previous"
              } job title`}
              value={formData.jobTitle}
              onChange={handleInputChange}
              isRequired={true}
            />
          </div>
          {isFullTime && isCurrentlyWorking && (
            <div className="flex gap-4 ">
              <TextInput
                name="annualSalary"
                placeholder="Current annual salary"
                value={formData.annualSalary}
                onChange={handleInputChange}
                isRequired={true}
              />
              <p className="text-nowrap flex items-end py-1">Per year</p>
            </div>
          )}

          {isFullTime && (
            <div className="flex flex-wrap gap-4">
              <DateInput
                type="date"
                name="joiningDate"
                id="joiningDate"
                placeholder="Joining date"
                className={"flex-grow"}
                value={formData.joiningDate}
                onChange={handleDateChange}
                min={minDateFormatted}
                max={todayFormatted}
                isRequired={true}
              />
              {formData.currentlyWorking === "No" ? (
                <DateInput
                  type="date"
                  name="leavingDate"
                  id="leavingDate"
                  placeholder={"Leaving date"}
                  className={"flex-grow"}
                  value={formData.leavingDate}
                  onChange={handleDateChange}
                  min={formData.joiningDate}
                  max={todayFormatted}
                  isRequired={true}
                />
              ) : (
                <p className="border px-4 py-2 flex items-center text-blue-500 w-full text-sm sm:text-base">
                  Present
                </p>
              )}
            </div>
          )}
          {isFullTime && formData.currentlyWorking == "Yes" && (
            <div>
              <p className="font-medium">Notice period</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {noticePeriodOptions.map((notice_period) => (
                  <p
                    key={notice_period}
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        ["noticePeriod"]: notice_period,
                      }))
                    }
                    className={`px-4 border py-1 cursor-pointer text-sm w-fit text-nowrap rounded-md transition-all ease-in-out 0.3ms ${
                      notice_period === formData.noticePeriod
                        ? "scale-110 bg-blue-50 border-blue-500 font-medium text-blue-500"
                        : "text-gray-500"
                    }`}
                  >
                    {notice_period}
                  </p>
                ))}
              </div>
            </div>
          )}
          {!isFullTime && (
            <>
              <TextInput
                name="location"
                placeholder="Location"
                value={formData.location}
                onChange={handleInputChange}
                isRequired={true}
              />

              <OptionInput
                name={"department"}
                value={formData.department}
                onChange={handleInputChange}
                optionList={departmentOptions}
                isRequired={true}
                placeholder={"Department"}
              />
              <div className="flex gap-4 items-end">
                <div className="flex flex-col w-full">
                  <div className="flex flex-wrap gap-4 mt-2">
                    <DateInput
                      type="date"
                      name="joiningDate"
                      id="joiningDate"
                      placeholder={"Joining date"}
                      value={formData.joiningDate}
                      onChange={handleDateChange}
                      min={minDateFormatted}
                      className={"flex-grow"}
                      isRequired={true}
                      // max={todayFormatted}
                      required
                    />
                    {isCurrentlyWorking ? (
                      <p className="border px-4 py-1 flex items-center text-blue-500">
                        Present
                      </p>
                    ) : (
                      <DateInput
                        type="date"
                        name="leavingDate"
                        id="leavingDate"
                        placeholder={"Leaving date"}
                        className={"flex-grow"}
                        value={formData.leavingDate}
                        onChange={handleDateChange}
                        min={formData.joiningDate}
                        max={todayFormatted}
                        isRequired={true}
                      />
                    )}
                  </div>
                </div>
              </div>
              <NumberInput
                name="stipend"
                placeholder="Stipend"
                value={formData.stipend}
                onChange={handleInputChange}
                isRequired={true}
              />
            </>
          )}
        </div>
        <div className="flex    justify-end items-center mt-6 w-full">
          <Button className="text-blue-500 font-medium" onClick={handleBack}>
            Cancel
          </Button>
          <Button
            disabled={!isFormValid()}
            className="bg-blue-500 rounded-full text-white disabled:bg-blue-300 disabled:cursor-not-allowed"
            onClick={onSave}
          >
            {"Add"}
          </Button>
        </div>
      </div>
    );
  };

  const pages = [
    {
      content: (
        <div className="flex flex-col  h-full justify-between flex-wrap gap-8">
          <div className="flex-1 ">
            <div>
              <p className="text-sm font-medium">Currently working here</p>
              <div className="flex gap-3 mt-2">
                {["Yes", "No"].map((type) => (
                  <p
                    key={type}
                    onClick={() =>
                      !currentWorkingSomeWhere
                        ? setCurrentlyWorkingHere(type)
                        : null
                    }
                    className={`${
                      currentlyWorkingHere === type
                        ? "bg-blue-50 text-blue-500 border-blue-500 font-semibold"
                        : "text-gray-500 border-gray-300"
                    } border px-4 py-1 text-sm cursor-pointer rounded-md`}
                  >
                    {type}
                  </p>
                ))}
              </div>
            </div>
            <div className="mt-6">
              <p className="text-sm font-medium">Employment type</p>
              <div className="flex gap-3 mt-2">
                {workTypeOptions.map((type) => (
                  <p
                    key={type}
                    onClick={() => handleWorkExperienceTypeChange(type)}
                    className={`${
                      workExperienceType === type
                        ? "bg-blue-50 text-blue-500 border-blue-500 font-semibold"
                        : "text-gray-500 border-gray-300"
                    } border px-4 py-1 text-sm cursor-pointer rounded-md`}
                  >
                    {type}
                  </p>
                ))}
              </div>
            </div>
          </div>
          <div className="flex  justify-end items-center mt-8">
            <button
              className="text-blue-500 font-medium px-4 py-2 0 rounded-md mr-2"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              disabled={!workExperienceType || !currentlyWorkingHere}
              className={`${
                !workExperienceType || !currentlyWorkingHere
                  ? "bg-blue-300 text-white cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              } px-4 py-2 rounded-md font-medium`}
              onClick={handleNext}
            >
              Next
            </button>
          </div>
        </div>
      ),
    },
    {
      content: renderWorkForm(),
    },
  ];

  return (
    <form className="bg-white pt-2 pb-6 px-4 sm:px-8 rounded-sm flex flex-col w-full h-full md:max-h-[80vh] max-h-[100vh] overflow-y-auto">
      <div className=" sticky -top-2.5 py-4 z-20 bg-white">
        <h2 className="text-xl font-medium">Work experience</h2>
        <p className="text-sm text-gray-400  mt-1">
          Details like job title, company name, etc help employers understand
          your work
        </p>
      </div>
      <div className=" mt-2 h-full">{pages[currentPage].content}</div>
    </form>
  );
}

export default WorkExperienceForm;
