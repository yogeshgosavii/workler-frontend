import React, { useState } from "react";
import Button from "../Button/Button";
import useProfileApi from "../../services/profileService";

function ProjectForm({ onClose }) {
  const [formData, setFormData] = useState({
    project_name: "",
    project_description: "",
    start_date: "",
    end_date: "",
    url: "",
    technologies: [],
  });
  const [inputValue, setinputValue] = useState("");

  const profileApi = useProfileApi();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTechnology = () => {
    if (formData.technologies.length < 10) {
      if (inputValue.trim() && !formData.technologies.includes(inputValue.trim())) {
        const updatedTechnologies = [...formData.technologies, inputValue.trim()];
        setFormData((prev) => ({ ...prev, technologies: updatedTechnologies }));
        setinputValue("");
      }
    }
  };

  const handleDeleteTechnology = (tech) =>{
    const updatedTechnologies = formData.technologies.filter(t =>t !=tech)
    setFormData((prev) => ({ ...prev, technologies: updatedTechnologies }));
  }

  

  const isFormValid = () => {
    const { project_name, project_description, start_date, end_date,technologies } = formData;
    return project_name && project_description && start_date && end_date && technologies.length>0;
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    if (isFormValid()) {
      const token = localStorage.getItem("token");
      try {
        const filteredData = Object.entries(formData)
          .filter(([key, value]) => value !== null && value !== "" && key !== "inputValue")
          .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

        const projectData = await profileApi.projectDetails.add(filteredData, token);
        setData((prev) => [...prev, projectData]);
        onClose();
      } catch (error) {
        console.error("Error in adding project:", error);
      }
    } else {
      alert("Please fill in all the fields.");
    }
  };


  return (
    <form className="bg-white p-6 px-4 sm:px-8 rounded-sm sm:max-h-96 overflow-y-auto w-full flex flex-col gap-5 h-full">
      <div>
        <h2 className="text-xl font-medium">Project</h2>
        <p className="text-sm text-gray-400 mb-6">
          Add the project you created or worked on
        </p>
      </div>
      <div className="flex-1 flex flex-col gap-5">
        <div className=" relative flex peer">
          <input
            type="text"
            name="project_name"
            id="project_name"
            className="block px-3 py-3 w-full font-normal bg-white rounded-sm border appearance-none focus:outline-none focus:ring-0 focus:border-blue-500 peer"
            placeholder=""
            value={formData.project_name}
            onChange={handleChange}
          />
          <label
            htmlFor="project_name"
            onClick={(e) => {
              e.preventDefault();
              e.target.previousSibling.focus();
            }}
            className="absolute duration-200 cursor-text px-2 text-gray-400 bg-white font-normal transform -translate-y-5 scale-90 top-2 z-10 peer-focus:px-2 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-90 peer-focus:-translate-y-5 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
          >
            Project title
          </label>
        </div>

        <div className="relative flex peer">
          <textarea
            type="text"
            name="project_description"
            id="project_description"
            className="block px-3 py-3 w-full font-normal bg-white rounded-sm border appearance-none focus:outline-none focus:ring-0 focus:border-blue-500 peer"
            placeholder=""
            value={formData.project_description}
            onChange={handleChange}
          />
          <label
            htmlFor="project_description"
            onClick={(e) => {
              e.preventDefault();
              e.target.previousSibling.focus();
            }}
            className="absolute duration-200 cursor-text px-2 text-gray-400 bg-white font-normal transform -translate-y-5 scale-90 top-2 z-10 peer-focus:px-2 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-6 peer-focus:top-2 peer-focus:scale-90 peer-focus:-translate-y-5 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
          >
            Description
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4 ">
          <div className="relative flex">
  <input
    type="date"
    name="start_date"
    id="start_date"
    className={`block px-3 py-3 w-full font-normal bg-white rounded-sm border appearance-none focus:outline-none focus:ring-0 focus:border-blue-500 peer `}
    placeholder=""
    value={formData.start_date}
    onChange={handleChange}
  />
  <label
    htmlFor="start_date"
    className={`absolute duration-200 w-32 cursor-text px-2 text-gray-400 bg-white font-normal transform transition-all ${
      formData.start_date
        ? "scale-90 max-w-fit -translate-y-5 top-2 text-blue-500"
        : "-translate-y-1/2 scale-100 top-1/2"
    } z-10`}
    onClick={() => {
      document.getElementById("start_date").focus();
    }}
  >
    Start Date
  </label>
</div>

          <div className="relative flex">
            <input
              type="date"
              name="end_date"
              id="end_date"
              className={`block px-3 py-3 w-full font-normal bg-white rounded-sm border appearance-none focus:outline-none focus:ring-0 focus:border-blue-500 peer `}
              placeholder=""
              value={formData.end_date}
              onChange={handleChange}
            />
            <label
              htmlFor="end_date"
              onClick={(e) => {
                e.preventDefault();
                e.target.previousSibling.focus();
              }}
              className={`absolute duration-200 w-32  cursor-text px-2 text-gray-400 bg-white font-normal transform transition-all ${
                formData.end_date
                  ? "scale-90 -translate-y-5 top-2 max-w-fit text-blue-500"
                  : "-translate-y-1/2 scale-100 top-1/2"
              } z-10 peer-focus:px-2 peer-focus:w-fit peer-focus:text-blue-500 peer-focus:scale-90 peer-focus:-translate-y-5 peer-focus:top-2 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1`}
            >
              End Date
            </label>
          </div>
        </div>
        <div className="flex flex-col ">
          <div className="relative flex items-center">
            <input
              type="text"
              name="technologies"
              id="technologies"
              className="block px-3 py-3 w-full font-normal bg-white rounded-sm border appearance-none focus:outline-none focus:ring-0 focus:border-blue-500 peer"
              placeholder=""
              value={inputValue}
              onChange={(e) => setinputValue(e.target.value)}
            />
            <label
              htmlFor="technologies"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("technologies").focus();
              }}
              className="absolute duration-200  cursor-text px-2 text-gray-400 bg-white font-normal transform -translate-y-5 scale-90 top-2 z-10 peer-focus:px-2 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-90 peer-focus:-translate-y-5 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
            >
              Technologies
            </label>
            <button
              type="button"
              className="absolute right-0 h-full font-medium text-blue-500 border-l px-6"
              onClick={()=>{handleAddTechnology()}}
            >
              Add
            </button>
          </div>
          <div className={`flex flex-wrap mt-2 ${formData.technologies.length<=0?"hidden":null}`}>
            {formData.technologies.map((tech, index) => (
              <div
                key={index}
                className="flex items-center gap-1 bg-blue-50  border border-blue-500 text-blue-500 rounded px-3 py-1 mr-2 "
              >
                <span>{tech}</span>
                <button
                  type="button"
                  className="ml-2 focus:outline-none"
                  onClick={(e) =>
                   handleDeleteTechnology(tech)
                  }
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="relative flex peer">
          <input
            type="url"
            name="url"
            id="url"
            className="block px-3 py-3 w-full font-normal bg-white rounded-sm border appearance-none focus:outline-none focus:ring-0 focus:border-blue-500 peer"
            placeholder=""
            value={formData.url}
            onChange={handleChange}
          />
          <label
            htmlFor="url"
            onClick={(e) => {
              e.preventDefault();
              e.target.previousSibling.focus();
            }}
            className="absolute duration-200 cursor-text px-2 text-gray-400 bg-white font-normal transform -translate-y-5 scale-90 top-2 z-10 peer-focus:px-2 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-6 peer-focus:top-2 peer-focus:scale-90 peer-focus:-translate-y-5 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
          >
            URL
          </label>
        </div>
      </div>

      <div className="mt-10 flex justify-end">
        <Button className="mr-2  text-blue-500" onClick={onClose}>
          Cancel
        </Button>
        <Button
          className={`bg-blue-500 text-white disabled:bg-blue-300`}
          onClick={handleAddProject}
          disabled={!isFormValid()}
        >
          Add
        </Button>
      </div>
    </form>
  );
}

export default ProjectForm;
