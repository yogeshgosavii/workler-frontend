import React, { useEffect, useState } from "react";
import Button from "../Button/Button";
import useProfileApi from "../../services/profileService";

function WorkExperienceUpdateForm({ onClose, workExperienceData, setWorkExperienceData }) {
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

  console.log(workExperienceData);
  const [workExperienceType, setWorkExperienceType] = useState(workExperienceData.employmentType);
  const [currentlyWorkingHere, setCurrentlyWorkingHere] = useState(workExperienceData.currentWorking);
  const [noticePeriod, setNoticePeriod] = useState(workExperienceData.noticePeriod);
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

  });
  console.log(formData.currentlyWorking);

  useEffect(() => {
    setWorkExperienceType(workExperienceData.employmentType);
    setCurrentlyWorkingHere(workExperienceData.currentWorking);
    setNoticePeriod(workExperienceData.noticePeriod);
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
    });
  }, [workExperienceData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  function deepEqual(obj1, obj2) {
    if (obj1 === obj2) {
        return true;
    }

    if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
        return false;
    }

    let keys1 = Object.keys(obj1);
    let keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
        return false;
    }

    for (let key of keys1) {
        if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
            return false;
        }
    }

    return true;
  }

  const isFormValid = () => {
    if (deepEqual(previousFormData, formData)) {
        return false;
    }
    return true;

    // Additional validation logic can be added here if needed
    // if (!formData.years || !formData.months || !formData.companyName || !formData.jobTitle || !formData.joiningDate) {
    //   return false;
    // }

    // if (workExperienceType === "Full-time") {
    //   if (currentlyWorkingHere === "Yes" && !formData.annualSalary) {
    //     return false;
    //   } else if (currentlyWorkingHere === "No" && !formData.leavingDate) {
    //     return false;
    //   }
    // } else {
    //   if (!formData.location || !formData.department || !formData.stipend) {
    //     return false;
    //   }
    //   if (currentlyWorkingHere === "No" && !formData.leavingDate) {
    //     return false;
    //   }
    // }
  };

  const renderWorkForm = () => {
    const isFullTime = workExperienceType === "Full-time";
    const isCurrentlyWorking = currentlyWorkingHere === "Yes";

    return (
      <div className="flex flex-col gap-5 py-2 px-2 h-full  sm:max-h-60 overflow-y-auto">
        <div>
          <p className="text-sm font-medium">Currently working here</p>
          <div className="flex gap-3 text-nowrap flex-wrap mt-2">
            {["Yes", "No"].map((type) => (
              <p
                key={type}
                onClick={() => {
                  setFormData((prev) => ({ ...prev, ["currentlyWorking"]: type }));
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
          <div className="flex gap-4 mt-2">
            <select
              name="years"
              className="border p-2 w-full rounded-sm"
              value={formData.years}
              onChange={handleInputChange}
              required
            >
              <option value="">Years</option>
              {[...Array(50).keys()].map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <select
              name="months"
              className="border p-2 w-full rounded-sm"
              value={formData.months}
              onChange={handleInputChange}
              required
            >
              <option value="">Months</option>
              {[...Array(12).keys()].map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>
        </div>
        <input
          type="text"
          name="companyName"
          placeholder={`${currentlyWorkingHere === "Yes" ? "Current" : "Previous"} company name*`}
          className="border p-2 w-full rounded-sm"
          value={formData.companyName}
          onChange={handleInputChange}
          required
        />
        <div className="flex gap-4 items-end">
          <input
            type="text"
            name="jobTitle"
            placeholder={`${currentlyWorkingHere === "Yes" ? "Current" : "Previous"} job title*`}
            className="border h-fit p-2 w-full rounded-sm"
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
              className="border p-2 w-full rounded-sm"
              value={formData.annualSalary}
              onChange={handleInputChange}
              required
            />
            <p className="text-nowrap flex items-end py-1">Per year</p>
          </div>
        )}
        <div className="flex  gap-4 items-end">
            <div className="flex flex-col w-full">
              <label htmlFor="joiningDate" className="font-medium ml-1">
                Joining date<span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="joiningDate"
                id="joiningDate"
                className="border bg-white mt-2 px-3 py-[7px] rounded-sm duration-200 placeholder:text-gray-400 w-full outline-none flex-1"
                value={formData.joiningDate}
                onChange={handleInputChange}
                required
              />
            </div>
          {(formData.currentlyWorking=="No") ? (
            <div className="flex flex-col w-full">
              <label htmlFor="leavingDate" className="font-medium ml-1">
                Leaving date<span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="leavingDate"
                id="leavingDate"
                className="border bg-white mt-2 px-3 py-[7px] rounded-sm duration-200 placeholder:text-gray-400 outline-none flex-1"
                value={formData.leavingDate}
                onChange={handleInputChange}
                required
              />
            </div>
          ) : (
            <p className="border px-4 py-[8px] flex items-center text-blue-500">
              Present
            </p>
          )}
        </div>

        {isFullTime && (
          <div>
            <p className="font-medium">Notice period</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {noticePeriodOptions.map((notice_period) => (
                <p
                  key={notice_period}
                  onClick={() => setNoticePeriod(notice_period)}
                  className={`px-4 border py-1 cursor-pointer text-sm w-fit text-nowrap rounded-md transition-all ease-in-out 0.3ms ${
                    notice_period === noticePeriod
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
      currentlyWorking: currentlyWorkingHere,
      years: formData.years,
      months: formData.months,
      companyName: formData.companyName,
      jobTitle: formData.jobTitle,
      joiningDate: formData.joiningDate,
      annualSalary: formData.annualSalary,
      location: formData.location,
      department: formData.department,
      leavingDate: formData.leavingDate,
      stipend: formData.stipend,
    };

    try {
      const token = localStorage.getItem("token");
      const updatedData = await profileApi.workExperience.update(workExperienceData._id, updatedWorkExperienceData);
      // Update the work experience data in the parent component's state
      setWorkExperienceData(prevData => prevData.map(exp => exp._id === updatedData._id ? updatedData : exp));
      onClose();
    } catch (error) {
      console.error("Error updating work experience:", error);
    }
  };

  return (
    <form onSubmit={handleUpdate} className="relative bg-white p-6 px-4 sm:px-8 flex flex-col justify-between rounded-sm w-full h-full sm:h-full overflow-y-auto">
      <div className="flex flex-col  w-full justify-between  bg-white pb-5 pt-2 z-20">
        <h2 className="text-xl font-semibold px-2">Work Experience</h2>
        <div className="mt-5 mb-10">{renderWorkForm()}</div>
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
            className="bg-blue-500 disabled:bg-blue-400 text-white"
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
