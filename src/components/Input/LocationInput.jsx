import React, { useState, useEffect } from "react";
import locationService from "../../services/locationService";

// Custom hook for debouncing
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

const LocationInput = ({
  name,
  placeholder,
  value, // previously saved location object with address
  onChange,
  isRequired,
  className,
  promptMessage,
  onFocus,
  onBlur
}) => {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [inputLocation, setInputLocation] = useState(""); // Default empty
  const [inputFocus, setInputFocus] = useState(false);
  const [message, setMessage] = useState(promptMessage);
  const [visited, setVisited] = useState(false);

  // Debounced input location
  const debouncedInputLocation = useDebounce(inputLocation, 500);
  
  // Update inputLocation when value (previously saved location) changes
  useEffect(() => {
    if (value && value.address) {
      setInputLocation(value.address); // Set saved location to input
    }
  }, [value]);

  // Debugging input location
  useEffect(() => {
    console.log("Debounced Input:", debouncedInputLocation);
  }, [debouncedInputLocation]);

  useEffect(() => {
    const fetchLocations = async () => {
      if (debouncedInputLocation === "") {
        setLocations([]);
        return;
      }

      setLoading(true);
      try {
        const response = await locationService.place(debouncedInputLocation);
        setLocations(response);
        console.log("Fetched Locations:", response);
      } catch (error) {
        console.error("Error fetching locations:", error);
        setLocations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, [debouncedInputLocation]);

  const createError = () => {
    console.log("Creating error with inputLocation:", inputLocation, "Value:", value);
    if (visited) {
      if (isRequired && !inputLocation) {
        setMessage({ type: "error", text: "This is a required field" });
      } else if (isRequired && !locations.some(loc => loc.address === inputLocation)) {
        setMessage({ type: "error", text: "Select a location from the list" });
      } else {
        setMessage(null);
      }
    }
  };

  const handleInputChange = (e) => {
    setVisited(true);
    setInputLocation(e.target.value);
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setInputLocation(location.address);
    setInputFocus(false);
    setMessage(null);
    onChange({
      target: {
        name: name,
        value: location
      }
    });
  };

  useEffect(() => {
    createError();
  }, [inputLocation, selectedLocation]);

  return (
    <div className={`relative ${className}`}>
      <div className="relative flex items-center">
        <input
          type="text"
          name={name}
          id={name}
          placeholder={placeholder}
          onChange={handleInputChange}
          value={inputLocation} // Ensure inputLocation is set correctly
          onFocus={() => {
            setInputFocus(true);
            if (onFocus) onFocus();
          }}
          onBlur={() => {
            setInputFocus(false);
            if (onBlur) onBlur();
            createError(); // Validate on blur
          }}
          className={`flex-1 block px-3 py-3 font-normal bg-white rounded-sm border appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer ${className}`}
          style={{
            WebkitAutofill: "number",
            WebkitBoxShadow: "0 0 0px 1000px white inset",
          }}
        />
        <label
          htmlFor={name}
          className="absolute duration-200 cursor-text px-2 text-gray-400 bg-white font-normal transform -translate-y-5 scale-90 top-2 z-10 peer-focus:px-2 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-90 peer-focus:-translate-y-5"
        >
          {placeholder}{isRequired && <span className="text-red-500">*</span>}
        </label>
      </div>
      {message && (
        <p
          className={`w-fit ml-1 mt-0.5 text-xs mb-1 rounded-sm ${
            message.type === "error" ? "text-red-500" : "text-green-500 bg-green-50"
          }`}
        >
          {message.text}
        </p>
      )}
      {inputFocus && locations.length > 0 && (
        <ul className="absolute z-50 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {!loading ? (
            locations.map((location) => (
              <li
                key={location.id}
                onClick={(e) => e.stopPropagation()}
                onMouseDown={() => handleLocationSelect(location)}
                className="p-3 hover:bg-gray-100 cursor-pointer"
              >
                {location.address}
              </li>
            ))
          ) : (
            <div className="w-full text-center">
              <svg
                aria-hidden="true"
                className="inline w-6 h-6 m-5 text-transparent animate-spin fill-blue-500"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7916 65.9787 12.7325 70.5273 15.7678C75.076 18.803 78.9425 22.8747 81.8523 27.7178C84.2795 31.7335 86.0561 36.1378 87.1142 40.7445C87.7644 43.158 90.1558 44.6781 93.9676 44.0409Z"
                  fill="currentFill"
                />
              </svg>
            </div>
          )}
        </ul>
      )}
    </div>
  );
};

export default LocationInput;
