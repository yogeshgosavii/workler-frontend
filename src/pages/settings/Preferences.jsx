import React, { useState, useEffect } from "react";
import LocationInput from "../../components/Input/LocationInput";
import NumberInput from "../../components/Input/NumberInput";
import OptionInput from "../../components/Input/OptionInput";

function Preferences() {
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [salaryRange, setSalaryRange] = useState([40000, 80000]);
  const [workAuthorization, setWorkAuthorization] = useState(false);
  const [remote, setRemote] = useState(false);
  const [notification, setNotification] = useState(true);
  const [experienceLevel, setExperienceLevel] = useState("");
  const [industries, setIndustries] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [preferredCompanies, setPreferredCompanies] = useState("");

  // Retrieve preferences from localStorage when the component mounts
  useEffect(() => {
    const savedPreferences = JSON.parse(localStorage.getItem("preferences"));

    if (savedPreferences) {
      setLocation(savedPreferences.location || "");
      setJobType(savedPreferences.jobType || "");
      setSalaryRange(savedPreferences.salaryRange || [40000, 80000]);
      setWorkAuthorization(savedPreferences.workAuthorization || false);
      setRemote(savedPreferences.remote || false);
      setNotification(savedPreferences.notification || true);
      setExperienceLevel(savedPreferences.experienceLevel || "");
      setIndustries(savedPreferences.industries || "");
      setCompanySize(savedPreferences.companySize || "");
      setPreferredCompanies(savedPreferences.preferredCompanies || "");
    }
  }, []);
  console.log(location);

  const handleSavePreferences = () => {
    const preferences = {
      location,
      jobType,
      salaryRange,
      workAuthorization,
      remote,
      notification,
      experienceLevel,
      industries,
      companySize,
      preferredCompanies,
    };

    // Save preferences to localStorage
    localStorage.setItem("preferences", JSON.stringify(preferences));
    alert("Preferences saved successfully!");
  };

  return (
    <div>
      <div
        onClick={() => {
          window.history.back();
        }}
        className="fixed w-full h-full bg-black opacity-30 z-20 top-0 left-0"
      ></div>
      <div className="fixed w-full left-0 flex flex-col gap-6 sm:left-[15%] md:left-[20%] lg:left-[30%] sm:h-fit sm:max-h-96 sm:max-w-lg px-4 py-4 sm:p-8 border sm:rounded-lg top-0 sm:top-[20%] overflow-y-auto z-30 bg-white rounded-lg h-full">
        <p className="text-3xl font-bold  text-gray-800 sticky -top-5 sm:-top-8 -ml-px bg-white z-20 py-4 -mt-5">
          Preferences
        </p>

        <LocationInput
          placeholder={"Location"}
          value={location}
          onChange={(e) => {
            console.log(e.target.value);
            setLocation(e.target.value);
          }}
        />

        <OptionInput
          value={jobType}
          onChange={(e) => setJobType(e.target.value)}
          options={["Full time", "Part time", "Freelance", "Internship"]}
          placeholder={"Job type"}
        />

        {/* Salary Range Preference */}
        <div className="">
          <label className="block text-lg font-medium text-gray-700 mb-2">
            Salary Range
          </label>
          <div className="flex gap-5">
            <NumberInput
              type="number"
              min="20000"
              max="120000"
              value={salaryRange[0]}
              onChange={(e) =>
                setSalaryRange([Number(e.target.value), salaryRange[1]])
              }
              className="w-full mb-2"
            />
            <NumberInput
              type="number"
              min="20000"
              max="120000"
              value={salaryRange[1]}
              onChange={(e) =>
                setSalaryRange([salaryRange[0], Number(e.target.value)])
              }
              className="w-full"
            />
          </div>
        </div>

        <OptionInput
          placeholder={"Experience level"}
          value={experienceLevel}
          onChange={(e) => setExperienceLevel(e.target.value)}
          options={["Entry level", "Mid level", "Senior level"]}
        />

        <button
          onClick={handleSavePreferences}
          className="w-full py-2 px-4 font-medium text-lg bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
}

export default Preferences;
