import React, { useState, useEffect } from "react";
import Button from "../Button/Button";
import useProfileApi from "../../services/profileService";
import TextInput from "../Input/TextInput";
import OptionInput from "../Input/OptionInput";

function SkillUpdateForm({ data, onClose, setData }) {
  const [skill, setSkill] = useState(data.name);
  const [level, setLevel] = useState(data.level);
  const [updateDisabled, setUpdateDisabled] = useState(true);
  const [loading, setloading] = useState();
  const profileApi = useProfileApi();

  useEffect(() => {
    setUpdateDisabled(skill.trim() === "" || level === "");
  }, [skill, level]);

  const handleUpdateSkill = async (e) => {
    e.preventDefault();
    setloading(true);
    try {
      const updateddata = await profileApi.skills.update(data._id, {
        name: skill,
        level,
      });
      setData((prevData) =>
        prevData.map((item) => (item._id === data._id ? updateddata : item))
      );
      console.log("Updated skill", updateddata);
      onClose();
    } catch (error) {
      console.error("Error in updateSkill:", error);
    } finally {
      setloading(false);
    }
  };
  const onDelete = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      await profileApi.skills.delete(data._id);
      // Filter out the deleted skill from data state
      setData((prevData) => prevData.filter((item) => item._id !== data._id));
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
            options={["Beginner", "Intermediate", "Advanced"]}
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
          {/* <Button className="mr-2 text-blue-500" onClick={onClose}>
            Cancel
          </Button> */}
          <Button
            disabled={updateDisabled || loading}
            className="bg-gray-800 text-white disabled:bg-gray-600"
            type="submit"
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
              "Add"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}

export default SkillUpdateForm;
