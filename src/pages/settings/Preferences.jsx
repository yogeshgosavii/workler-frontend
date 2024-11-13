import React, { useEffect, useState } from "react";
import {
  createPreference,
  updatePreference,
  getPreference,
} from "../../services/preferenceService";
import LocationInput from "../../components/Input/LocationInput";
import NumberInput from "../../components/Input/NumberInput";
import OptionInput from "../../components/Input/OptionInput";
import { useSelector } from "react-redux";
import Toast from "../../components/toast/Toast";

const Preferences = () => {
  const currentUser = useSelector((state) => state.auth.user);


  useEffect(() => {
    document.title = "User job preferences"  
 }, []);
  const [hasPreferences, setHasPreferences] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMassage, setToastMassage] = useState("");

  const [preferences, setPreferences] = useState({
    location: "",
    jobType: "",
    workAuthorization: false,
    remote: false,
    notification: true,
    experienceLevel: "",
    industries: "",
    companySize: "",
    preferredCompanies: "",
  });

  useEffect(() => {
    async function fetchPreferences() {
      try {
        const existingPreferences = await getPreference(currentUser._id);
        if (existingPreferences) {
          setPreferences(existingPreferences);
          setHasPreferences(true);
        }
      } catch (error) {
        console.error("Error fetching preferences:", error);
      }
    }
    fetchPreferences();
  }, [currentUser]);

  const handleSavePreferences = async () => {
    try {
      setIsLoading(true);
      if (hasPreferences) {
        await updatePreference(currentUser._id, preferences);
      } else {
        await createPreference({ userId: currentUser._id, preferences });
      }
      setShowToast(true);
      setToastMassage("Preferences saved successfully");
    } catch (error) {
      console.error(error);
      setShowToast(true);
      setToastMassage("An error occurred while saving preferences.");
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setShowToast(false)
      }, 4000);
    }
  };

  const setLocation = (value) =>
    setPreferences({ ...preferences, location: value });
  const setJobType = (value) =>
    setPreferences({ ...preferences, jobType: value });
  const setExperienceLevel = (value) =>
    setPreferences({ ...preferences, experienceLevel: value });

  return (
    <div className="max-h-screen h-full -top-10 overflow-y-auto border border-red-500">
      <div
        onClick={() => {
          window.history.back();
        }}
        className="fixed w-full h-full bg-black opacity-30 z-20 top-0 left-0"
      ></div>
      <div className="fixed w-full sm:max-w-lg right-0 flex flex-col gap-5 border h-full px-4 sm:px-6 py-6 sm:py-8 bg-white top-0 z-30 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-10">Preference</h2>

        <div className="-mt-3">
          <LocationInput
            name={"location"}
            placeholder={"Location"}
            value={preferences?.location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <OptionInput
          value={preferences.jobType}
          name={"jobType"}
          onChange={(e) => setJobType(e.target.value)}
          options={["Full time", "Part time", "Freelance", "Internship"]}
          placeholder={"Job type"}
        />

        <OptionInput
          placeholder={"Experience level"}
          value={preferences.experienceLevel + " level"}
          name={"experienceLevel"}
          onChange={(e) => setExperienceLevel(e.target.value)}
          options={["Entry level", "Mid level", "Senior level"]}
        />

        <button
          disabled={isLoading}
          onClick={handleSavePreferences}
          className="w-full py-2 px-4 mt-5 disabled:bg-gray-600 font-medium text-lg bg-gray-800 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-5">
              Saving preferences
              <svg
                className="inline w-6 h-6 text-transparent animate-spin fill-white"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 78.6023 21.8622 80.4978 26.2545C81.3533 28.7054 84.4794 29.2237 86.1745 27.8186C88.3947 25.6994 90.2448 22.6956 91.6372 19.5288C92.5058 17.3199 94.1449 39.0309 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
            </div>
          ) : (
            "Save preferences"
          )}
        </button>
      </div>
      <Toast message={toastMassage} show={showToast} setShowToast={setShowToast} />
    </div>
  );
};

export default Preferences;
