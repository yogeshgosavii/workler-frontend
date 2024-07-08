import React, { useState, useEffect } from "react";
import Button from "../Button/Button";
import useProfileApi from "../../services/profileService";
import TextInput from "../Input/TextInput";
import OptionInput from "../Input/OptionInput";

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
        <div className="mb-10">
        <h2 className="text-xl font-medium">Add Skill</h2>
        <p className="text-sm text-gray-400">
          Add your skill and specify your confidence with the level
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
        optionList={["Beginner","Intermediate","Advanced"]}
        isRequired={true}
        onChange={(e) => setLevel(e.target.value)}

        />
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
