import React, { useState, useEffect, useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import locationService from "../../services/locationService";

// Debounce custom hook
function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

// Spinner Component
const Spinner = () => (
  <div className="w-full text-center">
    <svg
      aria-hidden="true"
      className="inline w-6 h-6 m-5 text-transparent animate-spin fill-blue-500"
      viewBox="0 0 100 101"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M100 50.59C100 78.205 77.614 100.591 50 100.591 22.386 100.591 0 78.205 0 50.59 0 22.977 22.386 0.591 50 0.591 77.614 0.591 100 22.977 100 50.59ZM9.081 50.59C9.081 73.19 27.401 91.509 50 91.509 72.599 91.509 90.919 73.19 90.919 50.59 90.919 27.992 72.599 9.672 50 9.672 27.401 9.672 9.081 27.992 9.081 50.59Z"
        fill="currentColor"
      />
      <path
        d="M93.968 39.041C96.393 38.404 97.862 35.912 97.008 33.554 95.293 28.823 92.871 24.369 89.817 20.348 85.845 15.119 80.883 10.724 75.212 7.413 69.542 4.102 63.275 1.94 56.77 1.051 51.767 0.368 46.698 0.447 41.735 1.279 39.261 1.693 37.813 4.198 38.45 6.623 39.087 9.049 41.569 10.472 44.051 10.107 47.851 9.549 51.719 9.527 55.54 10.049 60.864 10.792 65.979 12.732 70.527 15.768 75.076 18.803 78.943 22.875 81.852 27.718 84.279 31.734 86.056 36.138 87.114 40.745 87.764 43.158 90.156 44.678 93.968 44.041Z"
        fill="currentFill"
      />
    </svg>
  </div>
);

const LocationInput = ({
  name,
  placeholder,
  value,
  onChange,
  isRequired,
  className = "",
  promptMessage,
  onFocus,
  onBlur,
}) => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputLocation, setInputLocation] = useState(value?.address || "");
  const [message, setMessage] = useState(promptMessage);
  const [visited, setVisited] = useState(false);
  const [inputFocus, setInputFocus] = useState(false);

  const debouncedInputLocation = useDebounce(inputLocation, 300);

  // Fetch locations
  useEffect(() => {
    const fetchLocations = async () => {
      if (!debouncedInputLocation.trim()) {
        setLocations([]);
        return;
      }

      setLoading(true);
      try {
        const response = await locationService.place(debouncedInputLocation);
        setLocations(response);
      } catch (error) {
        console.error("Error fetching locations:", error);
        setLocations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, [debouncedInputLocation]);

  // Validate input
  const validateInput = useMemo(() => {
    if (!visited) return null;
    if (isRequired && !inputLocation) {
      return { type: "error", text: "This is a required field" };
    }
    // if (
    //   isRequired &&
    //   !locations.some((loc) => loc.address === inputLocation)
    // ) {
    //   return { type: "error", text: "Select a location from the list" };
    // }
    return null;
  }, [inputLocation, visited, isRequired, locations]);

  useEffect(() => {
    setMessage(validateInput);
  }, [validateInput]);

  const handleInputChange = useCallback((e) => {
    setVisited(true);
    setInputLocation(e.target.value);
  }, []);

  const handleLocationSelect = useCallback((location) => {
    setInputLocation(location.address);
    setInputFocus(false);
    setMessage(null);
    onChange?.({ target: { name, value: location } });
  }, [onChange, name]);

  return (
    <div className={`relative ${className}`}>
      <div className="relative flex items-center">
        <input
          type="text"
          name={name}
          id={name}
          placeholder={placeholder}
          value={inputLocation}
          onChange={handleInputChange}
          onFocus={() => {
            setInputFocus(true);
            onFocus?.();
          }}
          onBlur={() => {
            setInputFocus(false);
            onBlur?.();
          }}
          className={`flex-1 peer outline-none block focus:border-blue-500 px-3 py-3 rounded-sm border ${className}`}
        />
        <label
          htmlFor={name}
          className="absolute duration-200 cursor-text px-2 text-gray-400 bg-white font-normal transform -translate-y-5 scale-90 top-2 z-10 peer-focus:px-2 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-90 peer-focus:-translate-y-5 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
        >
          {placeholder} {isRequired && <span className="text-red-500">*</span>}
        </label>
      </div>
      {message && (
        <p
          className={`w-fit ml-1 mt-0.5 text-xs mb-1 rounded-sm ${
            message.type === "error" ? "text-red-500" : "text-green-500"
          }`}
        >
          {message.text}
        </p>
      )}
      {inputFocus && inputLocation.length > 0 && (
        <ul className="absolute z-50 mt-2 w-full bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {loading ? (
            <Spinner />
          ) : locations.length > 0 ? (
            locations.map((loc) => (
              <li
                key={loc.id}
                onMouseDown={() => handleLocationSelect(loc)}
                className="p-3 hover:bg-gray-100 cursor-pointer"
              >
                {loc.address}
              </li>
            ))
          ) : (
            <p className="p-3 text-gray-400">No result found, add more detailed location</p>
          )}
        </ul>
      )}
    </div>
  );
};

LocationInput.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.object,
  onChange: PropTypes.func,
  isRequired: PropTypes.bool,
  className: PropTypes.string,
  promptMessage: PropTypes.string,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
};

export default LocationInput;
