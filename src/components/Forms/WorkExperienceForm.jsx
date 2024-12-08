import React, { useEffect, useState } from "react";
import Button from "../Button/Button";
import useProfileApi from "../../services/profileService";
import { set } from "date-fns/fp/set";
import TextInput from "../Input/TextInput";
import DateInput from "../Input/DateInput";
import NumberInput from "../Input/NumberInput";
import OptionInput from "../Input/OptionInput";

function WorkExperienceForm({ onClose, initialData, setData, data }) {
  const [loading, setloading] = useState(false);
  const workTypeOptions = ["Full-time", "Internship"];
  const departmentOptions = [
    "Engineering",
    "Marketing",
    "Finance",
    "Human Resources",
    "Sales",
  ];

  const currentWorkingSomeWhere = data.some(
    (experience) => experience.currentlyWorking == "Yes"
  );
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
    }
  };
  const handleCancel = () => {
    onClose();
  };

  const onSave = async () => {
    setloading(true)
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
      setData((prev) => [...prev, data]);
      onClose();
    } catch (error) {
      console.error("Error while saving work experience:", error);
    }
    finally{
      setloading(false)
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
    console.log("asdfghj",value,name);
    
    // Utility function to determine and convert value type
    const convertValue = (value) => {
      if (!isNaN(value) && value !== "") {
        return value.includes('.') ? parseFloat(value) : parseInt(value, 10);
      }
      return value;
    };
  
    setFormData((prev) => ({ ...prev, [name]: (convertValue(value)) }));
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
    setWorkExperienceType(type);
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
      <div className="flex flex-col gap-6 ">
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
                  className="border   p-2 outline-none  text-center w-full rounded-sm"
                  value={formData.years}
                  readOnly
                  required
                />
                <p>years</p>
              </div>
              <div className="flex w-full items-end gap-1">
                <input
                  name="months"
                  className="border  p-2 outline-none  text-center w-full rounded-sm"
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
              <NumberInput
                name="annualSalary"
                placeholder="Current annual salary"
                value={formData.annualSalary}
                onChange={handleInputChange}
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
                options={departmentOptions}
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
        <div className="flexs py-5 justify-end items-center mt-6 w-full">
          {/* <Button className="text-blue-500 font-medium" onClick={handleBack}>
            Cancel
          </Button> */}
          <Button
            disabled={!isFormValid() || loading}
            className="bg-gray-800 w-full text-lg flex justify-center items-center rounded-full text-white disabled:bg-gray-600 disabled:cursor-not-allowed"
            onClick={onSave}
          >
            {
              loading? (
                 <svg className="inline w-7 h-7 text-transparent animate-spin fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                  </svg>
              ) :"Add"
            }
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
            {/* <button
              className="text-blue-500 font-medium px-4 py-2 0 rounded-md mr-2"
              onClick={handleCancel}
            >
              Cancel
            </button> */}
            <button
              disabled={!workExperienceType || !currentlyWorkingHere}
              className={`${
                !workExperienceType || !currentlyWorkingHere
                  ? "text-gray-600  cursor-not-allowed"
                  : "text-gray-800 "
              } px-4 flex items-center text-lg font-bold py-2 rounded-md `}
              onClick={handleNext}
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
      content: renderWorkForm(),
    },
  ];

  return (
    <form className="bg-white pt-2 pb-6 px-4 sm:px-8 rounded-sm flex flex-col w-full h-full md:max-h-[80vh] max-h-[100vh] overflow-y-auto">
       <div className="flex gap-3 flex-nowrap  sticky -top-2.5 -mt-[5px] py-4 z-20 bg-white">
       <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="size-8 shrink-0 -ml-2.5"
          onClick={() => {
            onClose()
          }}
        >
          <path
            fill-rule="evenodd"
            d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z"
            clip-rule="evenodd"
          />
        </svg>
      <div className=" ">
        <h2 className="text-xl font-medium">Work experience</h2>
        <p className="text-sm text-gray-400  mt-1">
          Details like job title, company name, etc help employers understand
          your work
        </p>
      </div>
       </div>
      <div className=" mt-2 h-full">{pages[currentPage].content}</div>
    </form>
  );
}

export default WorkExperienceForm;
