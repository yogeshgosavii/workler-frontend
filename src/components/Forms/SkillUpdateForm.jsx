import React, { useState, useEffect } from "react";
import Button from "../Button/Button";
import useProfileApi from "../../services/profileService";
import TextInput from "../Input/TextInput";
import OptionInput from "../Input/OptionInput";

function SkillUpdateForm({ skillData, onClose, setSkillData }) {
  const [skill, setSkill] = useState(skillData.name);
  const [level, setLevel] = useState(skillData.level);
  const [updateDisabled, setUpdateDisabled] = useState(true);
  const profileApi = useProfileApi();

  useEffect(() => {
    setUpdateDisabled(skill.trim() === "" || level === "");
  }, [skill, level]);

  const handleUpdateSkill = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const updatedSkillData = await profileApi.skills.update(skillData._id, {
        name: skill,
        level,
      });
      setSkillData((prevData) =>
        prevData.map((item) =>
          item._id === skillData._id ? updatedSkillData : item
        )
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
      await profileApi.skills.delete(skillData._id);
      // Filter out the deleted skill from skillData state
      setSkillData((prevData) =>
        prevData.filter((item) => item._id !== skillData._id)
      );
      onClose();
    } catch (error) {
      console.error("Error deleting skill:", error);
    }
  };

  return (
    <form
      className="bg-white p-6 px-4 sm:px-8 rounded-sm w-full flex flex-col  h-full"
      onSubmit={handleUpdateSkill}
    >
      <div className="flex-1">
        <div className="mb-10">
          <h2 className="text-xl font-medium">Skills</h2>
          <p className="text-sm text-gray-400">
            Update your skill to what you originally wanted it to be{" "}
          </p>
        </div>
        <div className="flex flex-col gap-6">
          <TextInput
            name={"skill"}
            onChange={(e) => setSkill(e.target.value)}
            value={skill}
            placeholder={"Skill"}
            isRequired={true}
          />

          <OptionInput
            name={"level"}
            placeholder={"Skill Level"}
            value={level}
            optionList={["Beginner", "Intermediate", "Advanced"]}
            isRequired={true}
            onChange={(e) => setLevel(e.target.value)}
          />
        </div>
      </div>
      <div className="mt-6 flex justify-between items-center">
        <svg
          onClick={onDelete}
          class="h-6 w-6 cursor-pointer text-red-500"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          {" "}
          <polyline points="3 6 5 6 21 6" />{" "}
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>

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
