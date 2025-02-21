import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import Button from "../Button/Button";
import useProfileApi from "../../services/profileService";
import useJobApi from "../../services/jobService";
import TextInput from "../Input/TextInput";
import TextAreaInput from "../Input/TextAreaInput";
import UrlInput from "../Input/UrlInput";
import AddInput from "../Input/AddInput";
import ToggleInput from "../Input/ToggleInput";
import NumberInput from "../Input/NumberInput";
import LocationInput from "../Input/LocationInput";

function JobForm({ onClose, data, setData }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    job_role: "",
    min_salary: null,
    max_salary: null,
    source: "",
    description: "",
    company_name: "",
    location: {},
    job_type: "Current portal",
    skills_required: [],
    experience_type: null,
    min_experience: null,
    max_experience: null,
    company_logo: "",
    job_url: "",
    job_post_date: "",
  });
  const [inputValue, setInputValue] = useState("");
  const jobApi = useJobApi();
  const userData = useSelector((state) => state.auth.user);
  console.log(userData);
  

  useEffect(() => {
    const fetchData = () => {
      try {
        if (userData) {
          setFormData((prev) => ({
            ...prev,
            company_logo: userData.profileImage,
            job_post_date: new Date().toISOString(), // Format date if necessary
            company_name: userData.company_details.company_name,
          }));
        }
      } catch (error) {
        console.error("Error fetching personal details:", error);
      }
    };

    fetchData();
  }, []); // Ensure dependencies are correct

  useEffect(() => {
  }, [formData]);
  const handleChange = useCallback((e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) : value,
    }));
  }, []);

  const handleLocationChange = useCallback((location) => {
    setFormData((prev) => ({
      ...prev,
      location,
    }));
  }, []);

  const handleAddSkills = useCallback(() => {
    if (formData.skills_required.length < 10) {
      const trimmedValue = inputValue.trim();
      if (trimmedValue && !formData.skills_required.includes(trimmedValue)) {
        setFormData((prev) => ({
          ...prev,
          skills_required: [...prev.skills_required, trimmedValue],
        }));
        setInputValue("");
      }
    }
  }, [formData.skills_required, inputValue]);

  const handleDeleteSkills = useCallback((tech) => {
    setFormData((prev) => ({
      ...prev,
      skills_required: prev.skills_required.filter((t) => t !== tech),
    }));
  }, []);

  const isFormValid = useMemo(() => {
    const {
      job_role,
      description,
      company_name,
      skills_required,
      min_salary,
      max_salary,
      location,
      job_type,
      experience_type,
      min_experience,
      max_experience,
      company_logo,
      job_url,
      salary_type
    } = formData;

    if (
      !job_role ||
      !description ||
      !company_name ||
      !location ||
      skills_required == 0
    ) {
      return false;
    }

    if (experience_type === "Experienced") {
      if (max_experience >= 1 && max_experience > min_experience) {
        if (job_type === "Another portal") {
          return !!job_url;
        }
        if (max_experience == min_experience) {
          if (max_experience == 0) {
            setFormData((prev) => ({
              ...prev,
              min_experience: null,
              max_experience: null,
              experience_type: "Fresher",
            }));
          } else {
            setFormData((prev) => ({
              ...prev,
              max_experience: null,
            }));
          }
        }
        return true;
      } else {
        return false;
      }
    }

    return true;
  }, [formData]);

  const handleUpdateJob = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (isFormValid) {
      try {
        const filteredData = Object.entries(formData)
          .filter(
            ([key, value]) =>
              value !== null && value !== "" && key !== "inputValue"
          )
          .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

        const jobData = await jobApi.job.add(filteredData);
        setData((prevData) =>
          prevData.map((item) =>
            item._id === data._id ? { ...jobData, _id: data._id } : item
          )
        );
        onClose();
      } catch (error) {
        console.error("Error adding job:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  return (
    <form className="bg-white pt-2 pb-6 px-4 sm:px-8 rounded-sm  overflow-y-auto w-full flex flex-col gap-5 h-full">
      <div className="sticky pb-6  flex gap-3  -top-2.5 -mt-[5px] border border-white  py-3 z-20 bg-white">
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
        <div>
          <h2 className="text-xl font-medium">Job post</h2>
          <p className="text-sm text-gray-400 ">
            Create a job for candidates to apply
          </p>
        </div>
        
      </div>
      <div className="flex-1 flex flex-col gap-6">
        <TextInput
          name="job_role"
          onChange={handleChange}
          placeholder="Job role"
          value={formData.job_role}
          isRequired={true}
        />
        <TextAreaInput
          name="description"
          onChange={handleChange}
          placeholder="Description"
          value={formData.description}
          isRequired={true}
        />
        <LocationInput
          name="location"
          onChange={handleLocationChange}
          placeholder="Location"
          value={formData.location  || userData.location}
          isRequired={true}
        />
        <AddInput
          name="Skills required"
          data={formData.skills_required}
          handleAdd={handleAddSkills}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Skills required"
          value={inputValue}
          handleDelete={handleDeleteSkills}
          isRequired={true}
          max={10}
        />
        <div className="flex gap-2">
          {["Experienced", "Fresher"].map((type) => (
            <p
              key={type}
              onClick={() =>
                handleChange({
                  target: { name: "experience_type", value: type },
                })
              }
              className={`${
                type === formData.experience_type
                  ? "bg-blue-50 border-blue-500 text-blue-500"
                  : "border text-gray-500"
              } border cursor-pointer px-4 py-1 w-fit rounded-md`}
            >
              {type}
            </p>
          ))}
        </div>
        {formData.experience_type === "Experienced" && (
          <div className="flex flex-wrap gap-4 w-full">
            <NumberInput
              name="min_experience"
              placeholder="Minimum experience"
              value={formData.min_experience}
              min="0"
              max={20}
              className="flex-grow min-w-48"
              onChange={handleChange}
            />
            <NumberInput
              name="max_experience"
              placeholder="Maximum experience"
              value={formData.max_experience}
              max={20}
              min="0"
              className="flex-grow min-w-48"
              onChange={handleChange}
            />
          </div>
        )}
        <div className="flex flex-wrap gap-4 w-full">
          <NumberInput
            name="min_salary"
            placeholder="Minimum salary"
            value={formData.min_salary}
            min="0"
            max={1000000000}
            className="flex-grow min-w-48"
            onChange={handleChange}
          />
          <NumberInput
            name="max_salary"
            placeholder="Maximum salary"
            value={formData.max_salary}
            max={1000000000}
            min="0"
            className="flex-grow min-w-48"
            onChange={handleChange}
          />
        </div>
        <TextInput
          name="salary_type"
          placeholder="Salary type (per month, etc)"
          value={formData.salary_type}
          className="flex-grow min-w-48"
          onChange={handleChange}
        />
        <ToggleInput
          name="job_type"
          onChange={handleChange}
          value={formData.job_type}
          toggleList={["Current portal", "Another portal"]}
          placeholder="Job Portal"
        />
        {formData.job_type !== "Current portal" && (
          <UrlInput
            name="job_url"
            onChange={handleChange}
            value={formData.job_url}
            placeholder="Job Url"
          />
        )}
      </div>

      <div className="mt-10 flex gap-4 w-full justify-end">
        {/* <Button
          className="bg-red-500 w-full text-white disabled:bg-gray-600"
          onClick={handleUpdateJob}
          disabled={!isFormValid || loading}
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
            "Delete"
          )}
        </Button> */}

        {
          <Button
            className="bg-gray-800 justify-center flex items-center text-lg w-full text-white disabled:bg-gray-600"
            onClick={handleUpdateJob}
            disabled={!isFormValid || loading}
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
              "Create"
            )}
          </Button>
        }
      </div>
    </form>
  );
}

export default JobForm;
