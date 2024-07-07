import React, { useState } from "react";
import Button from "../Button/Button";
import useProfileApi from "../../services/profileService";
import UrlInput from "../Input/UrlInput";
import AddInput from "../Input/AddInput";
import DateInput from "../Input/DateInput";
import TextAreaInput from "../Input/TextAreaInput";
import TextInput from "../Input/TextInput";

function ProjectUpdateForm({ projectData, setProjectData, onClose }) {
  const [previousData, setpreviousData] = useState({
    project_name: projectData.project_name || "",
    project_description: projectData.project_description || "",
    start_date: projectData.start_date || "",
    end_date: projectData.end_date || "",
    url: projectData.url || "",
    technologies: projectData.technologies || [],
  });
  const [formData, setFormData] = useState({
    project_name: projectData.project_name || "",
    project_description: projectData.project_description || "",
    start_date: projectData.start_date || "",
    end_date: projectData.end_date || "",
    url: projectData.url || "",
    technologies: projectData.technologies || [],
  });
  const [inputValue, setInputValue] = useState("");

  const profileApi = useProfileApi();

  const onDelete = async (e) => {
    e.preventDefault();
    try {
      await profileApi.projectDetails.delete(projectData._id);
      setProjectData((prevData) =>
        prevData.filter((item) => item._id !== projectData._id)
      );
      onClose();
    } catch (error) {
      console.error("Error updating education data:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };
  const handleAddTechnology = () => {
    if (formData.technologies.length < 10) {
      if (
        inputValue.trim() &&
        !formData.technologies.includes(inputValue.trim())
      ) {
        const updatedTechnologies = [
          ...formData.technologies,
          inputValue.trim(),
        ];
        setFormData((prev) => ({ ...prev, technologies: updatedTechnologies }));
        setInputValue("");
      }
    }
  };

  const handleDeleteTechnology = (tech) => {
    const updatedTechnologies = formData.technologies.filter((t) => t !== tech);
    setFormData((prev) => ({ ...prev, technologies: updatedTechnologies }));
  };

  const deepEqual = (obj1, obj2) => {
    // Check if both values are strictly equal
    if (obj1 === obj2) {
      return true;
    }

    // Check if either value is not an object or is null
    if (
      typeof obj1 !== "object" ||
      obj1 === null ||
      typeof obj2 !== "object" ||
      obj2 === null
    ) {
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
      if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
        // Handle special case for numeric values to consider them equal if numeric value is same
        if (
          typeof obj1[key] === "number" &&
          typeof obj2[key] === "number" &&
          obj1[key] === obj2[key]
        ) {
          continue; // Continue checking other keys
        }
        return false;
      }
    }

    // If all checks pass, the objects are deeply equal
    return true;
  };
  const isFormValid = () => {
    const {
      project_name,
      project_description,
      start_date,
      end_date,
      technologies,
    } = formData;
    return (
      project_name &&
      project_description &&
      start_date &&
      end_date &&
      technologies.length > 0 &&
      !deepEqual(previousData, formData)
    );
  };

  const handleUpdateProject = async (e) => {
    e.preventDefault();
    if (isFormValid()) {
      try {
        const filteredData = Object.entries(formData)
          .filter(
            ([key, value]) =>
              value !== null && value !== "" && key !== "inputValue"
          )
          .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

        await profileApi.projectDetails.update(projectData._id, filteredData);
        console.log();
        setProjectData((prevData) =>
            prevData.map((item) =>
              item._id === projectData._id ? { ...filteredData, _id: projectData._id } : item
            )
          );
        onClose();
      } catch (error) {
        console.error("Error in updating project:", error);
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
          Update the project details to what you originally wanted it to be
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
         value={formatDate(formData.start_date)}
         maxDate={formatDate(formData.end_date)}
         />
         <DateInput
         name={"end_date"}
         onChange={handleChange}
         placeholder={"End Date"}
         minDate={formatDate(formData.start_date)}
         value={formatDate(formData.end_date)}
         />
         
       </div>
      
       <AddInput
       name={"technologies"}
       data={formData.technologies}
       handleAdd={handleAddTechnology}
       onChange={(e) => setInputValue(e.target.value)}
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
      <div className="mt-10 flex justify-between">
        <svg
          onClick={onDelete}
          className="h-6 w-6 cursor-pointer text-red-500"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
        <div>
          <Button className="mr-2  text-blue-500" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className={`bg-blue-500 text-white disabled:bg-blue-300`}
            onClick={handleUpdateProject}
            disabled={!isFormValid()}
          >
            Update
          </Button>
        </div>
      </div>
    </form>
  );
}

export default ProjectUpdateForm;
