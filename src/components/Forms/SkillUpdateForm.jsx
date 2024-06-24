import React, { useState, useEffect } from "react";
import Button from "../Button/Button";
<<<<<<< HEAD
import useProfileApi from "../../services/profileService";
=======
import profileService from "../../services/profileService";
>>>>>>> origin/main

function SkillUpdateForm({ skillData, onClose, setSkillData }) {
  const [skill, setSkill] = useState(skillData.name);
  const [level, setLevel] = useState(skillData.level);
  const [updateDisabled, setUpdateDisabled] = useState(true);
<<<<<<< HEAD
  const profileApi = useProfileApi()

=======
>>>>>>> origin/main

  useEffect(() => {
    setUpdateDisabled(skill.trim() === "" || level === "");
  }, [skill, level]);

  const handleUpdateSkill = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
<<<<<<< HEAD
      const updatedSkillData = await profileApi.skills.update(skillData._id, { name: skill, level });
=======
      const updatedSkillData = await profileService.updateSkills(skillData._id, { name: skill, level }, token);
>>>>>>> origin/main
      setSkillData((prevData) =>
        prevData.map((item) => (item._id === skillData._id ? updatedSkillData : item))
      );
      console.log("Updated skill", updatedSkillData);
    } catch (error) {
      console.error("Error in updateSkill:", error);
    }
    onClose();
  };
  const onDelete = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      await profileService.deleteSkill(skillData._id, token);
      // Filter out the deleted skill from skillData state
      setSkillData((prevData) =>
        prevData.filter((item) => item._id !== skillData._id)
      );
      onClose();
    } catch (error) {
      console.error('Error deleting skill:', error);
    }
  };

  return (
    <form className="bg-white p-6 px-8 rounded-sm w-full flex flex-col justify-between h-full" onSubmit={handleUpdateSkill}>
      <div>
      <h2 className="text-xl font-medium">Skills</h2>
      <div className="mt-6 relative flex peer">
        <input
          type="text"
          name="skill"
          id="skill"
          className="block px-3 py-3 w-full font-normal bg-white rounded-sm border appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
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
          className="absolute duration-200 cursor-text px-2 text-gray-400 bg-white font-normal transform -translate-y-5 scale-90 top-2 z-10 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-90 peer-focus:-translate-y-5 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
        >
          Skill
        </label>
      </div>
      <div className="mt-4 relative flex peer">
        <select
          name="level"
          id="level"
          className="mt-1 border p-2 block w-full text-gray-500 border-gray-300 rounded-sm"
          value={level}
          onChange={(e) => setLevel(e.target.value)}
        >
          <option value="">Select skill level</option>
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
          className="absolute duration-200 cursor-text px-2 text-gray-400 bg-white font-normal transform -translate-y-5 scale-90 top-2 z-10 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-90 peer-focus:-translate-y-5 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
        >
          Level
        </label>
      </div>
      </div>
      <div className="mt-6 flex justify-between items-center">
      <svg onClick={onDelete} class="h-6 w-6 cursor-pointer text-red-500"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round">  <polyline points="3 6 5 6 21 6" />  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>

       <div>
        <Button className="mr-2 text-blue-500" onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={updateDisabled}
            className="bg-blue-500 text-white disabled:bg-blue-300"
            type="submit"
          >
            Update
          </Button>
       </div>
      
      </div>
    </form>
  );
}

export default SkillUpdateForm;
