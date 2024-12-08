import React, { useState } from "react";
import Button from "../Button/Button";
import useProfileApi from "../../services/profileService";
import UrlInput from "../Input/UrlInput";
import AddInput from "../Input/AddInput";
import DateInput from "../Input/DateInput";
import TextAreaInput from "../Input/TextAreaInput";
import TextInput from "../Input/TextInput";

function ProjectUpdateForm({ data, setData, onClose }) {
  const [loading, setloading] = useState(false);
  const [previousData, setpreviousData] = useState({
    project_name: data.project_name || "",
    project_description: data.project_description || "",
    start_date: data.start_date || "",
    end_date: data.end_date || "",
    url: data.url || "",
    technologies: data.technologies || [],
  });
  const [formData, setFormData] = useState({
    project_name: data.project_name || "",
    project_description: data.project_description || "",
    start_date: data.start_date || "",
    end_date: data.end_date || "",
    url: data.url || "",
    technologies: data.technologies || [],
  });
  const [inputValue, setInputValue] = useState("");

  const profileApi = useProfileApi();

  const onDelete = async (e) => {
    e.preventDefault();
    try {
      await profileApi.projectDetails.delete(data._id);
      setData((prevData) => prevData.filter((item) => item._id !== data._id));
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
    setloading(true);
    if (isFormValid()) {
      try {
        const filteredData = Object.entries(formData)
          .filter(
            ([key, value]) =>
              value !== null && value !== "" && key !== "inputValue"
          )
          .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

        await profileApi.projectDetails.update(data._id, filteredData);
        setData((prevData) =>
          prevData.map((item) =>
            item._id === data._id ? { ...filteredData, _id: data._id } : item
          )
        );
        onClose();
      } catch (error) {
        console.error("Error in updating project:", error);
      } finally {
        setloading(false);
      }
    } else {
      alert("Please fill in all the fields.");
    }
  };

  return (
    <form className="bg-white px-4 pt-2 pb-6 sm:px-8 rounded-sm sm:max-h-96 overflow-y-auto w-full flex flex-col gap-5 h-full">
      <div className="flex gap-3 sticky -top-2.5 -mt-[5px] py-4 z-20 bg-white">
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
        <div className="  bg-white">
          <h2 className="text-xl font-medium">Project</h2>
          <p className="text-sm text-gray-400 ">
            Update the project details to what you originally wanted it to be
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-6">
        <TextInput
          name={"project_name"}
          onChange={handleChange}
          placeholder={"Project title"}
          value={formData.project_name}
          isRequired={true}
        />

        <TextAreaInput
          name={"project_description"}
          onChange={handleChange}
          placeholder={"Description"}
          value={formData.project_description}
          isRequired={true}
        />

        <div className="flex flex-wrap gap-4 ">
          <DateInput
            type={"Date"}
            name={"start_date"}
            onChange={handleChange}
            placeholder={"Start Date"}
            className={"flex-grow"}
            value={formatDate(formData.start_date)}
            maxDate={formatDate(formData.end_date)}
            isRequired={true}
          />
          <DateInput
            type={"Date"}
            name={"end_date"}
            onChange={handleChange}
            placeholder={"End Date"}
            className={"flex-grow"}
            minDate={formatDate(formData.start_date)}
            value={formatDate(formData.end_date)}
            isRequired={true}
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
          isRequired={true}
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
          {/* <Button className="mr-2  text-blue-500" onClick={onClose}>
            Cancel
          </Button> */}
          <Button
            className={`bg-gray-800 text-white disabled:bg-gray-600`}
            onClick={handleUpdateProject}
            disabled={!isFormValid() || loading}
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
              "Update"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}

export default ProjectUpdateForm;
