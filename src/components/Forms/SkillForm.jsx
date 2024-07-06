import React, { useState, useEffect } from "react";
import Button from "../Button/Button";
import useProfileApi from "../../services/profileService";

function SkillForm({ onClose, setSkills }) {
  const [skill, setSkill] = useState("");
  const [level, setLevel] = useState("");
  const [addDisabled, setAddDisabled] = useState(true);
  const profileApi = useProfileApi();

  useEffect(() => {
    // Check if both skill and level are not empty
    if (skill.trim() !== "" && level !== "") {
      setAddDisabled(false); // Enable the button
    } else {
      setAddDisabled(true); // Disable the button
    }
  }, [skill, level]);

  const handleAddSkill = async (e) => {
    e.preventDefault();
    console.log("Skill:", skill);
    console.log("Level:", level);
    const token = localStorage.getItem("token");
    try {
      await profileApi.skills.add({ name: skill, level }, token);
      console.log("Skill added successfully");
      onClose(); // Close the form after successfully adding the skill
    } catch (error) {
      console.error("Error in addSkill:", error);
    }
    setSkills((prev) => [...perv, skill]);
    setSkill("");
    setLevel("");
  };

  return (
    <form
      className="bg-white p-6 px-4 sm:px-8 flex flex-col justify-between rounded-sm w-full h-full"
      onSubmit={handleAddSkill}
    >
      <div>
        <h2 className="text-xl font-medium">Add Skill</h2>
        <p className="text-sm text-gray-400">
          Add your skill and specify your confidence with the level
        </p>
        <div className="mt-6 relative flex peer">
          <input
            type="text"
            name="skill"
            id="skill"
            className="block px-3 py-3 w-full font-normal bg-white rounded-sm border appearance-none focus:outline-none focus:ring-0 focus:border-blue-500 peer"
            placeholder=""
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
          />
          <label
            htmlFor="skill"
            onClick={(e) => {
              e.preventDefault();
              e.target.previousSibling.focus();
            }}
            className="absolute duration-200 cursor-text px-2 text-gray-400 bg-white font-normal transform -translate-y-5 scale-90 top-2 z-10 peer-focus:px-2 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-90 peer-focus:-translate-y-5 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
          >
            Skill
          </label>
        </div>
        <div className="mt-4 relative flex">
          <select
            name="level"
            id="level"
            className={`mt-1 border outline-none focus:border-blue-500 p-2 block w-full text-gray-900 py-3 rounded-sm peer ${
              level ? "text-black" : "text-gray-500"
            }`}
            value={level}
            onChange={(e) => setLevel(e.target.value)}
          >
            <option value="">Select Skill</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
          <label
            htmlFor="level"
            onClick={(e) => {
              e.preventDefault();
              e.target.previousSibling.focus();
            }}
            className={`absolute duration-200 cursor-text px-2 text-gray-400 bg-white font-normal transform transition-all ${
              level
                ? "-translate-y-4 scale-90 top-2 z-10"
                : "top-1/2 -translate-y-1/2"
            } peer-focus:-translate-y-4 peer-focus:scale-90 peer-focus:top-2 peer-focus:text-blue-600 start-1`}
          >
            Skill Level
          </label>
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <Button className="mr-2 text-blue-500" onClick={onClose}>
          Cancel
        </Button>
        <Button
          disabled={addDisabled}
          className="bg-blue-500 text-white disabled:bg-blue-300"
          type="submit"
        >
          Add
        </Button>
      </div>
    </form>
  );
}

export default SkillForm;
