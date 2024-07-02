import React, { useEffect, useState } from "react";
import Button from "../Button/Button";
import useProfileApi from "../../services/profileService";

function WorkExperienceForm({ onClose, initialData, setWorkExperience }) {
  const workTypeOptions = ["Full-time", "Internship"];
  const departmentOptions = [
    "Engineering",
    "Marketing",
    "Finance",
    "Human Resources",
    "Sales",
  ];
  const noticePeriodOptions = [
    "15 days or less",
    "1 Month",
    "2 Months",
    "3 Months",
    "More than 3 Months",
  ];
  const profileApi = useProfileApi();

  const [workExperienceType, setWorkExperienceType] = useState(
    initialData?.employmentType
  );
  const [currentlyWorkingHere, setCurrentlyWorkingHere] = useState(
    initialData?.currentWorking
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
      // Filter out the empty fields from formData
      const nonEmptyData = Object.fromEntries(
        Object.entries(formData).filter(([key, value]) => value !== "")
      );
      // Add new work experience
      const data = await profileApi.workExperience.add(nonEmptyData);
      console.log("data", data);
      setWorkExperience((prev) => [...prev, data]);
      onClose();
    } catch (error) {
      console.error("Error while saving work experience:", error);
      // Handle the error, e.g., display an error message to the user
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

  const calculateExperience = () => {
    let { joiningDate, leavingDate } = formData;
    // console.log(joiningDate, leavingDate);
    if (!joiningDate || !leavingDate) {
      if(formData.currentlyWorking == "Yes"){
        leavingDate = todayFormatted

      }
      else{
        return "Please enter both joining and leaving dates.";

      }
    }


    const joinDate = new Date(joiningDate);
    const leaveDate = new Date(leavingDate);

    if (leaveDate < joinDate) {
      return "Leaving date cannot be before joining date.";
    }

    // Calculate the difference in years and months
    const diffYears = leaveDate.getFullYear() - joinDate.getFullYear();
    const diffMonths = leaveDate.getMonth() - joinDate.getMonth();

    let totalExperience = "";

    if (diffMonths < 0) {
      diffYears--;
      diffMonths += 12;
    }

    totalExperience = `${diffYears} ${
      diffYears > 1 ? "years" : "year"
    } ${diffMonths} ${diffMonths > 1 ? "months" : "month"}`;
    console.log(totalExperience);
    setFormData((prev) => ({ ...prev, ["years"]: diffYears }));
    setFormData((prev) => ({ ...prev, ["months"]: diffMonths }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleDateChange = (e) => {
    handleInputChange(e); // Update the form data
    calculateExperience(); // Calculate experience on date change
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

    if ( !companyName || !jobTitle) {
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
      <div className="flex flex-col gap-5 ">
        <div>
          <p className="font-medium">
            Total experience
            <span className="text-sm text-gray-400 font-normal">
              {" "}
              (Auto Generated)
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
        <input
          type="text"
          name="companyName"
          placeholder={`${
            currentlyWorkingHere === "Yes" ? "Current" : "Previous"
          } company name*`}
          className="border outline-none focus:border-blue-500 p-2 w-full rounded-sm"
          value={formData.companyName}
          onChange={handleInputChange}
          required
        />
        <div className="flex gap-4 items-end">
          <input
            type="text"
            name="jobTitle"
            placeholder={`${
              currentlyWorkingHere === "Yes" ? "Current" : "Previous"
            } job title*`}
            className="border outline-none focus:border-blue-500 h-fit p-2 w-full rounded-sm"
            value={formData.jobTitle}
            onChange={handleInputChange}
            required
          />
        </div>
        {isFullTime && isCurrentlyWorking && (
          <div className="flex gap-4 ">
            <input
              type="number"
              name="annualSalary"
              placeholder="Current annual salary per year*"
              className="border outline-none focus:border-blue-500 p-2 w-full rounded-sm"
              value={formData.annualSalary}
              onChange={handleInputChange}
              required
            />
            <p className="text-nowrap flex items-end py-1">Per year</p>
          </div>
        )}

        {isFullTime && (
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-col w-full">
              <label
                htmlFor="joiningDate"
                className="font-medium ml-1  text-sm sm:text-base"
              >
                Joining date<span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="joiningDate"
                id="joiningDate"
                className="border  focus:border-blue-500 bg-white mt-2 px-3 py-2 rounded-sm duration-200 placeholder:text-gray-400 w-full outline-none"
                value={formData.joiningDate}
                onChange={handleDateChange}
                min={minDateFormatted}
                max={todayFormatted}
                required
              />
            </div>
            {formData.currentlyWorking === "No" ? (
              <div className="flex flex-col w-full">
                <label
                  htmlFor="leavingDate"
                  className="font-medium ml-1 text-sm sm:text-base"
                >
                  Leaving date<span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="leavingDate"
                  id="leavingDate"
                  className="border focus:border-blue-500 bg-white mt-2 px-3 py-2 rounded-sm duration-200 placeholder:text-gray-400 w-full outline-none"
                  value={formData.leavingDate}
                  onChange={handleDateChange}
                  min={formData.joiningDate}
                  max={todayFormatted}
                  required
                />
              </div>
            ) : (
              <p className="border px-4 py-2 flex items-center text-blue-500 w-full text-sm sm:text-base">
                Present
              </p>
            )}
          </div>
        )}
        {isFullTime && (
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
            <input
              type="text"
              name="location"
              placeholder="Location*"
              className="border h-fit p-2 w-full rounded-sm"
              value={formData.location}
              onChange={handleInputChange}
              required
            />
            <select
              name="department"
              className="border h-fit p-2 w-full rounded-sm"
              value={formData.department}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Department*</option>
              {departmentOptions.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            <div className="flex gap-4 items-end">
              <div className="flex flex-col w-full">
                <label htmlFor="joiningDate" className="font-medium ml-1">
                  Internship duration<span className="text-red-500">*</span>
                </label>
                <div className="flex gap-4 mt-2">
                  <input
                    type="date"
                    name="joiningDate"
                    id="joiningDate"
                    className="border bg-white px-3 py-[7px] rounded-sm duration-200 placeholder:text-gray-400 outline-none no-spin-buttons flex-1"
                    value={formData.joiningDate}
                    onChange={handleDateChange}
                    min={minDateFormatted}
                    // max={todayFormatted}
                    required
                  />
                  {isCurrentlyWorking ? (
                    <p className="border px-4 py-1 flex items-center text-blue-500">
                      Present
                    </p>
                  ) : (
                    <input
                      type="date"
                      name="leavingDate"
                      id="leavingDate"
                      className="border bg-white px-3 py-[7px] rounded-sm duration-200 placeholder:text-gray-400 outline-none no-spin-buttons flex-1"
                      value={formData.leavingDate}
                      onChange={handleDateChange}
                      min={formData.joiningDate}
                      max={todayFormatted}
                      required
                    />
                  )}
                </div>
              </div>
            </div>
            <input
              type="text"
              name="stipend"
              placeholder="Stipend*"
              className="border h-fit p-2 w-full rounded-sm"
              value={formData.stipend}
              onChange={handleInputChange}
              required
            />
          </>
        )}
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
                    onClick={() => setCurrentlyWorkingHere(type)}
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
      <div className=" sticky -top-2.5 py-4 bg-white">
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
