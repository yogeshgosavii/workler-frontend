import React, { useEffect, useState } from "react";
import Button from "../Button/Button";
import useProfileApi from "../../services/profileService";
import { de } from "date-fns/locale/de";

function WorkExperienceUpdateForm({ onClose, workExperienceData,workExperienceFullData, setWorkExperienceData }) {
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

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const currentWorkingSomeWhere = workExperienceFullData.some(experience =>experience.currentlyWorking == "Yes")
  console.log(currentWorkingSomeWhere);
  const [workExperienceType, setWorkExperienceType] = useState(workExperienceData.employmentType);
  const [currentlyWorkingHere, setCurrentlyWorkingHere] = useState(workExperienceData.currentWorking);
  const [previousFormData, setpreviousFormData] = useState({
    years: workExperienceData.years,
    months: workExperienceData.months,
    companyName: workExperienceData.companyName,
    jobTitle: workExperienceData.jobTitle,
    joiningDate: formatDate(workExperienceData.joiningDate),
    annualSalary: workExperienceData.annualSalary,
    location: workExperienceData.location,
    department: workExperienceData.department,
    leavingDate: formatDate(workExperienceData.leavingDate),
    stipend: workExperienceData.stipend,
    currentlyWorking: workExperienceData.currentlyWorking,
    noticePeriod : workExperienceData.noticePeriod

  });
  const [formData, setFormData] = useState({
    years: workExperienceData.years,
    months: workExperienceData.months,
    companyName: workExperienceData.companyName,
    jobTitle: workExperienceData.jobTitle,
    joiningDate: formatDate(workExperienceData.joiningDate),
    annualSalary: workExperienceData.annualSalary,
    location: workExperienceData.location,
    department: workExperienceData.department,
    leavingDate: formatDate(workExperienceData.leavingDate),
    stipend: workExperienceData.stipend,
    currentlyWorking: workExperienceData.currentlyWorking,
    noticePeriod : workExperienceData.noticePeriod


  });
  console.log(formData);

  useEffect(() => {
    setWorkExperienceType(workExperienceData.employmentType);
    setCurrentlyWorkingHere(workExperienceData.currentWorking);
    setFormData({
      years: workExperienceData.years,
      months: workExperienceData.months,
      companyName: workExperienceData.companyName,
      jobTitle: workExperienceData.jobTitle,
      joiningDate: formatDate(workExperienceData.joiningDate),
      annualSalary: workExperienceData.annualSalary,
      location: workExperienceData.location,
      department: workExperienceData.department,
      leavingDate: formatDate(workExperienceData.leavingDate),
      stipend: workExperienceData.stipend,
      currentlyWorking: workExperienceData.currentlyWorking,
      noticePeriod : workExperienceData.noticePeriod

    });
  }, [workExperienceData]);

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

  function deepEqual(obj1, obj2) {
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
    console.log(keys1,keys2);

    // Check if the number of keys is different
    if (keys1.length !== keys2.length) {
        return false;
    }

    // Iterate over the keys of obj1
    for (let key of keys1) {
        // Check if obj2 has the key and the values of the key are deeply equal
        if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
            return false;
        }
    }

    // If all checks pass, the objects are deeply equal
    return true;
}

  const isFormValid = () => {
    if (deepEqual(previousFormData, formData)) {
        return false;
    }
    return true;

  };

  const renderWorkForm = () => {
    const isFullTime = workExperienceType === "Full-time";
    const isCurrentlyWorking = currentlyWorkingHere === "Yes";

    return (
      <div className="flex flex-col gap-5 py-2 h-full mt-2  sm:max-h-60 overflow-y-auto">
        <div>
          <p className="text-sm font-medium">Currently working here</p>
          <div className="flex gap-3 text-nowrap flex-wrap mt-2 px-1">
            {["Yes", "No"].map((type) => (
              <p
                key={type}
                onClick={() => {
                 currentWorkingSomeWhere && workExperienceData.currentlyWorking == "Yes" ? setFormData((prev) => ({ ...prev, ["currentlyWorking"]: type })):null;
                }}
                className={`${
                  formData.currentlyWorking == type
                    ? "scale-110 bg-blue-50 text-blue-500 border-blue-500 font-semibold"
                    : "text-gray-500 border-gray-300"
                } border transition-all ease-in-out 0.3ms px-4 h-fit py-1 text-sm cursor-pointer rounded-md`}
              >
                {type}
              </p>
            ))}
          </div>
        </div>
        <div>
          <p className="font-medium">
            Total experience<span className="text-red-500">*</span>
          </p>
          <div className="flex items-end gap-4 mt-2">
            <div className="flex w-full gap-1 items-end">
              <input
                name="years"
                className="border focus:border-blue-500 p-2 outline-none  text-center w-full rounded-sm"
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
          placeholder={`${currentlyWorkingHere === "Yes" ? "Current" : "Previous"} company name*`}
          className="border outline-none focus:border-blue-500 p-2 w-full rounded-sm"
          value={formData.companyName}
          onChange={handleInputChange}
          required
        />
        <div className="flex gap-4 items-end">
          <input
            type="text"
            name="jobTitle"
            placeholder={`${currentlyWorkingHere === "Yes" ? "Current" : "Previous"} job title*`}
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
              placeholder="Current outline-none focus:border-blue-500 annual salary per year*"
              className="border p-2 w-full rounded-sm"
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
                className="font-medium ml-1 outline-none focus:border-blue-500 text-sm sm:text-base"
              >
                Joining date<span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="joiningDate"
                id="joiningDate"
                className="border bg-white mt-2 px-3 py-2 rounded-sm duration-200 placeholder:text-gray-400 w-full outline-none"
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
                  className="border  focus:border-blue-500 bg-white mt-2 px-3 py-2 rounded-sm duration-200 placeholder:text-gray-400 w-full outline-none"
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

        {isFullTime && formData.currentlyWorking == "Yes" && (
          <div className="w-full z-40">
            <p className="font-medium">Notice period</p>
            <div className="flex flex-wrap gap-2 px-2  mt-2">
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
              placeholder="Office location*"
              className="border p-2 w-full rounded-sm"
              value={formData.location}
              onChange={handleInputChange}
              required
            />
            <div className="flex flex-col w-full">
              <p className="font-medium ml-1">Department</p>
              <select
                name="department"
                className="border bg-white mt-2 px-3 py-[7px] rounded-sm duration-200 placeholder:text-gray-400 outline-none flex-1"
                value={formData.department}
                onChange={handleInputChange}
                required
              >
                <option value="" disabled>
                  Select department
                </option>
                {departmentOptions.map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </select>
            </div>
            <input
              type="text"
              name="stipend"
              placeholder="Stipend*"
              className="border p-2 w-full rounded-sm"
              value={formData.stipend}
              onChange={handleInputChange}
              required
            />
          </>
        )}
      </div>
    );
  };
   

  const onDelete = async(e)=>{
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const updatedWorkExperience = await profileApi.workExperience.delete(workExperienceData._id, token);
      setWorkExperienceData(prevData => prevData.filter(exp => exp._id !== workExperienceData._id ));
 
      console.log('Updated education data:', updatedWorkExperience);
      onClose();
    } catch (error) {
      console.error('Error updating education data:', error);
    }
  }

  const handleUpdate = async (event) => {
    event.preventDefault();

    const updatedWorkExperienceData = {
      _id: workExperienceData._id,  // Include the ID to update the correct entry
      employmentType: workExperienceType,
      currentlyWorking: formData.currentlyWorking,
      years: formData.years,
      months: formData.months,
      companyName: formData.companyName,
      jobTitle: formData.jobTitle,
      joiningDate: formData.joiningDate,
      annualSalary: formData.annualSalary,
      location: formData.location,
      department: formData.department,
      leavingDate:  formData.currentlyWorking == "No"  ?  formData.leavingDate : null,
      stipend: formData.stipend,
      noticePeriod : formData.currentlyWorking == "Yes"  ? formData.noticePeriod : null
    };
    

    try {
      const updatedData = await profileApi.workExperience.update(workExperienceData._id, updatedWorkExperienceData);
      setWorkExperienceData(prevData => prevData.map(exp => exp._id === updatedData._id ? updatedData : exp));
      onClose();
    } catch (error) {
      console.error("Error updating work experience:", error);
    }
  };

  return (
    <form onSubmit={handleUpdate} className="relative bg-white pt-2 pb-6 px-4 sm:px-8 flex flex-col justify-between rounded-sm w-full h-full sm:h-full overflow-y-auto">
      <div className="flex flex-col flex-1  w-full justify-between  bg-white pb-5 pt-2 z-20">
      <div className=" sticky z-10 -top-2.5 py-4   bg-white">
        <h2 className="text-xl font-medium">Work experience</h2>
         <p className="text-sm text-gray-400  mt-1">
          Update the details to what you wanted before
        </p>
      </div>
        <div className=" mb-10">{renderWorkForm()}</div>
      </div>
      <div className="static  bottom-0   right-0 left-0 flex items-center justify-between  bg-white py-2 px-3 z-20">
        <svg onClick={onDelete} className="h-6 w-6 cursor-pointer text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
        <div>
          <Button variant="secondary" className="text-blue-500" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            className="bg-blue-500 disabled:bg-blue-300 text-white"
            type="submit"
            disabled={!isFormValid()}
          >
            Update
          </Button>
        </div>
      </div>
    </form>
  );
}

export default WorkExperienceUpdateForm;
