import React, { useEffect, useState } from "react";
import Button from "../Button/Button";
import useProfileApi from "../../services/profileService";
import TextInput from "../Input/TextInput";
import NumberInput from "../Input/NumberInput";
import DateInput from "../Input/DateInput";

function WorkExperienceUpdateForm({ onClose, data, setdata }) {
  const [loading, setloading] = useState(false);
  const [workExperienceFullData, setWorkExperienceFullData] = useState([]);
  const [workExperienceType, setWorkExperienceType] = useState(data.employmentType);
  const [currentlyWorkingHere, setCurrentlyWorkingHere] = useState(data.currentWorking);
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const [previousFormData, setPreviousFormData] = useState({
    years: data.years,
    months: data.months,
    companyName: data.companyName,
    jobTitle: data.jobTitle,
    joiningDate: formatDate(data.joiningDate),
    annualSalary: data.annualSalary,
    location: data.location,
    department: data.department,
    leavingDate: formatDate(data.leavingDate),
    stipend: data.stipend,
    currentlyWorking: data.currentlyWorking,
    noticePeriod: data.noticePeriod,
  });
  const [formData, setFormData] = useState({
    years: data.years,
    months: data.months,
    companyName: data.companyName,
    jobTitle: data.jobTitle,
    joiningDate: formatDate(data.joiningDate),
    annualSalary: data.annualSalary,
    location: data.location,
    department: data.department,
    leavingDate: formatDate(data.leavingDate),
    stipend: data.stipend,
    currentlyWorking: data.currentlyWorking,
    noticePeriod: data.noticePeriod,
  });
  
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

 
  useEffect(() => {
    const fetchWorkExperienceData = async () => {
      try {
        const response = await profileApi.workExperience.getAll();
        setWorkExperienceFullData(response);
      } catch (error) {
        console.error('Error fetching work experience data:', error);
      }
    };

    fetchWorkExperienceData();
  }, [profileApi]);

  const currentWorkingSomeWhere = (workExperienceFullData || []).some(experience => experience.currentlyWorking === "Yes");

  useEffect(() => {
    setWorkExperienceType(data.employmentType);
    setCurrentlyWorkingHere(data.currentWorking);
    setFormData({
      years: data.years,
      months: data.months,
      companyName: data.companyName,
      jobTitle: data.jobTitle,
      joiningDate: formatDate(data.joiningDate),
      annualSalary: data.annualSalary,
      location: data.location,
      department: data.department,
      leavingDate: formatDate(data.leavingDate),
      stipend: data.stipend,
      currentlyWorking: data.currentlyWorking,
      noticePeriod: data.noticePeriod,
    });
  }, [data]);

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

    // Check if the number of keys is different
    if (keys1.length !== keys2.length) {
      return false;
    }

    // Iterate over the keys of obj1
    for (let key of keys1) {
      // Check if obj2 has the key and the values of the key are deeply equal
      if (formData.currentlyWorking === "Yes" && key === "leavingDate") {
        continue;
      }
      if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
        return false;
      }
    }

    // If all checks pass, the objects are deeply equal
    return true;
  }

  const isFormValidCheck = () => {
    const {
      companyName,
      jobTitle,
      joiningDate,
      annualSalary,
      location,
      department,
      leavingDate,
      stipend,
      currentlyWorking,
      employmentType
    } = formData;

    if (!companyName || !jobTitle) {
      return false;
    }

    if (employmentType === "Full-time") {
      if (currentlyWorking === "Yes" && !annualSalary) {
        return false;
      } else if (currentlyWorking === "No" && (!leavingDate || leavingDate === "")) {
        return false;
      }
    } else {
      if (!location || !department || !stipend || !joiningDate) {
        return false;
      } else {
        return !(currentlyWorking === "No" && !leavingDate);
      }
    }

    return true;
  };

  const isFormValid = () => {
    return !isFormValidCheck() || deepEqual(previousFormData, formData);
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    setloading(true)

    const updateddata = {
      _id: data._id,  // Include the ID to update the correct entry
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
      const updatedData = await profileApi.workExperience.update(data._id, updateddata);
      setdata(prevData => prevData.map(exp => exp._id === updatedData._id ? updatedData : exp));
      onClose();
    } catch (error) {
      console.error("Error updating work experience:", error);
    }
    finally{
      setloading(false)
    }
  };

    const onDelete = async(e)=>{
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const updatedWorkExperience = await profileApi.workExperience.delete(data._id, token);
      setdata(prevData => prevData.filter(exp => exp._id !== data._id ));
 
      console.log('Updated education data:', updatedWorkExperience);
      onClose();
    } catch (error) {
      console.error('Error updating education data:', error);
    }
  }


  const renderWorkForm = () => {
    const isFullTime = workExperienceType === "Full-time";
    const isCurrentlyWorking = currentlyWorkingHere === "Yes";

    return (
      <div className="flex flex-col gap-8 py-2 h-full mt-2">
        <div>
          <p className="text-sm font-medium">Currently working here</p>
          <div className="flex gap-3 text-nowrap flex-wrap mt-2 px-1">
            {["Yes", "No"].map((type) => (
              <p
                key={type}
                onClick={() => {
                  if (currentWorkingSomeWhere && data.currentlyWorking === "Yes") {
                    setFormData((prev) => ({ ...prev, currentlyWorking: type }));
                  } else {
                    setFormData((prev) => ({ ...prev, currentlyWorking: type }));
                  }
                }}
                className={`${
                  formData.currentlyWorking === type
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
            <span className="text-sm text-gray-400 font-normal"> (Auto Generated)</span>
          </p>
          <div className="flex items-end gap-4 mt-2">
            <div className="flex w-full gap-1 items-end">
              <input
                name="years"
                type="number"
                className="w-24 px-4 py-2 border rounded-md"
                min={0}
                max={100}
                onChange={handleInputChange}
                value={formData.years}
              />
              <p className="text-sm font-medium">years</p>
            </div>
            <div className="flex w-full gap-1 items-end">
              <input
                name="months"
                type="number"
                className="w-24 px-4 py-2 border rounded-md"
                min={0}
                max={11}
                onChange={handleInputChange}
                value={formData.months}
              />
              <p className="text-sm font-medium">months</p>
            </div>
          </div>
        </div>
        <TextInput
          name="companyName"
          placeholder="Company Name"
          onChange={handleInputChange}
          value={formData.companyName}
          label="Company Name"
        />
        <TextInput
          name="jobTitle"
          placeholder="Job Title"
          onChange={handleInputChange}
          value={formData.jobTitle}
          label="Job Title"
        />
        <DateInput
          name="joiningDate"
          value={formData.joiningDate}
          label="Joining Date"
          min={minDateFormatted}
          max={todayFormatted}
          onChange={handleDateChange}
        />
        {isFullTime && (
          <>
            <NumberInput
              name="annualSalary"
              label="Annual Salary"
              placeholder="Annual Salary"
              onChange={handleInputChange}
              value={formData.annualSalary}
            />
            <DateInput
              name="leavingDate"
              value={formData.leavingDate}
              label="Leaving Date"
              min={formData.joiningDate}
              max={todayFormatted}
              onChange={handleDateChange}
              disabled={isCurrentlyWorking}
            />
          </>
        )}
        {!isFullTime && (
          <>
            <TextInput
              name="location"
              placeholder="Location"
              onChange={handleInputChange}
              value={formData.location}
              label="Location"
            />
            <TextInput
              name="department"
              placeholder="Department"
              onChange={handleInputChange}
              value={formData.department}
              label="Department"
            />
            <NumberInput
              name="stipend"
              label="Stipend"
              placeholder="Stipend"
              onChange={handleInputChange}
              value={formData.stipend}
            />
            <DateInput
              name="leavingDate"
              value={formData.leavingDate}
              label="Leaving Date"
              min={formData.joiningDate}
              max={todayFormatted}
              onChange={handleDateChange}
              disabled={isCurrentlyWorking}
            />
          </>
        )}
        <div>
          <p className="text-sm font-medium">Notice Period</p>
          <div className="flex gap-3 text-nowrap flex-wrap mt-2 px-1">
            {noticePeriodOptions.map((option) => (
              <p
                key={option}
                onClick={() => setFormData((prev) => ({ ...prev, noticePeriod: option }))}
                className={`${
                  formData.noticePeriod === option
                    ? "scale-110 bg-blue-50 text-blue-500 border-blue-500 font-semibold"
                    : "text-gray-500 border-gray-300"
                } border transition-all ease-in-out 0.3ms px-4 h-fit py-1 text-sm cursor-pointer rounded-md`}
              >
                {option}
              </p>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <form onSubmit={handleUpdate} className=" bg-white pt-2 pb-6 px-4 sm:px-8 sm:max-h-96 flex flex-col justify-between rounded-sm w-full h-full sm:h-full overflow-y-auto">
    <div className="flex flex-col flex-1  w-full justify-between  bg-white pb-5 pt-2 z-20">
    <div className=" sticky z-20 -top-2.5 py-4   bg-white">
      <h2 className="text-xl font-medium">Work experience</h2>
       <p className="text-sm text-gray-400  mt-1">
        Update the details to what you wanted before
      </p>
    </div>
    <div className=" flex-1">{renderWorkForm()}</div>
    </div>
    <div className=" static flex items-center justify-between  bg-white px-3 ">
      <svg onClick={onDelete} className="h-6 w-6 cursor-pointer text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      </svg>
      <div>
        {/* <Button variant="secondary" className="text-blue-500" size="md" onClick={onClose}>
          Cancel
        </Button> */}
        <Button
          variant="primary"
          size="md"
          className="bg-blue-500 disabled:bg-blue-300 text-white"
          type="submit"
          disabled={isFormValid() || loading}
        >
             {
              loading? (
                 <svg className="inline w-7 h-7 text-transparent animate-spin fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                  </svg>
              ) :"Update"
            }
        </Button>
      </div>
    </div>
  </form>
  );
}

export default WorkExperienceUpdateForm;
