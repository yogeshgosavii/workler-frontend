import React, { useState } from "react";
import Button from "../Button/Button";
import useProfileApi from "../../services/profileService";
import TextInput from "../Input/TextInput";
import DateInput from "../Input/DateInput";
import TextAreaInput from "../Input/TextAreaInput";
import UrlInput from "../Input/UrlInput";
import AddInput from "../Input/AddInput";

function ProjectForm({ onClose,setData }) {
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
      } catch (error) {
        console.error("Error in adding project:", error);
      }
    } else {
      alert("Please fill in all the fields.");
    }
    onClose();

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
       
        <TextInput
          name={"project_name"}
          onChange={handleChange}
          placeholder={"Project title"}
          value={formData.project_name}
        />

        <TextAreaInput
          name={"project_description"}
          onChange={handleChange}
          placeholder={"Description"}
          value={formData.project_description}
          />

        <div className="grid grid-cols-2 gap-4 ">
         
          <DateInput
          name={"start_date"}
          onChange={handleChange}
          placeholder={"Start Date"}
          value={formData.start_date}
          maxDate={formData.end_date}
          />
          <DateInput
          name={"end_date"}
          onChange={handleChange}
          placeholder={"End Date"}
          minDate={formData.start_date}
          value={formData.end_date}
          />
          
        </div>
       
        <AddInput 
        name={"technologies"}
        data={formData.technologies}
        handleAdd={handleAddTechnology}
        onChange={(e) => setinputValue(e.target.value)}
        placeholder={"Technologies"}
        value={inputValue}
        handleDelete={handleDeleteTechnology}
        />
       
        <UrlInput
        name={"url"}
        onChange={handleChange}
        value={formData.url}
        placeholder={"URL"}
        />
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
