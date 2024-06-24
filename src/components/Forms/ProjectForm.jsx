import React, { useState } from "react";
import Button from "../Button/Button";

function ProjectForm({ onClose }) {
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [url, setUrl] = useState("");

  const isFormValid = () => {
    return projectName && description && startDate && endDate ;
  };

  const handleAddProject = () => {
    if (isFormValid()) {
      // Here you can handle adding the project to your data source or state
      // For demonstration, let's just log the project details
      console.log("Project Name:", projectName);
      console.log("Description:", description);
      console.log("Start Date:", startDate);
      console.log("End Date:", endDate);
      console.log("URL:", url);
      // You can reset the form fields after adding the project
      setProjectName("");
      setDescription("");
      setStartDate("");
      setEndDate("");
      setUrl("");
    } else {
      alert("Please fill in all the fields.");
    }
  };

  return (
    <form className="bg-white p-6 px-8 rounded-sm sm:max-h-96 overflow-y-auto w-full h-full">
      <h2 className="text-xl font-medium">Project</h2>
      <div className="mt-8">
        <label htmlFor="projectName" className="block text-sm font-medium text-gray-700">
          Project Name
        </label>
        <input
          type="text"
          name="projectName"
          id="projectName"
          className="mt-1 border p-2 block w-full border-gray-300 rounded-sm"
          placeholder="Enter project name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />
      </div>
      <div className="mt-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          name="description"
          id="description"
          rows="3"
          className=" border mt-1 p-2 block w-full border-gray-300 rounded-sm"
          placeholder="Enter project description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
            Start Date
          </label>
          <input
            type="date"
            name="startDate"
            id="startDate"
            className="mt-1 p-2 block w-full border border-gray-300 rounded-sm"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
            End Date
          </label>
          <input
            type="date"
            name="endDate"
            id="endDate"
            className="mt-1 p-2 block w-full border border-gray-300 rounded-sm"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>
      <div className="mt-4">
        <label htmlFor="url" className="block text-sm font-medium text-gray-700">
          URL
        </label>
        <input
          type="text"
          name="url"
          id="url"
          className="mt-1 p-2 block w-full border-gray-300 border rounded-sm "
          placeholder="Enter project URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </div>
      <div className="mt-10 flex justify-end">
        <Button className="mr-2  text-blue-500" onClick={onClose}>
          Cancel
        </Button>
        <Button className={`bg-blue-500 text-white disabled:bg-blue-300`} onClick={handleAddProject} disabled={!isFormValid()}>
          Add
        </Button>
      </div>
    </form>
  );
}

export default ProjectForm;
