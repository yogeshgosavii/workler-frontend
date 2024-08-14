import React, { useState, useEffect } from "react";
import searchService from "../services/searchService";
import UserImageInput from "../components/Input/UserImageInput";

function Search() {
  const [searchInputFocus, setSearchInputFocus] = useState(false);
  const [locationInputFocus, setLocationInputFocus] = useState(false);
  const [searchType, setSearchType] = useState("user");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false); // Track if a search has been performed

  const fetchData = async (searchQuery) => {
    setIsLoading(true);
    try {
      let response;
      if (searchType === "user") {
        response = await searchService.searchByUsername(searchQuery);
      } else if (searchType === "job") {
        response = await searchService.searchByJobTitle(searchQuery);
      } else if (searchType === "company") {
        response = await searchService.searchByCompanyName(searchQuery);
      }
      const data = response;
      console.log(data);

      setResults(data);
      setHasSearched(true); // Set to true after a search has been performed
    } catch (error) {
      console.error("Error fetching data:", error);
      // Optionally handle error here
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce logic to prevent excessive API calls
  useEffect(() => {
    setResults([]);
    setHasSearched(false); // Reset this whenever the query changes

    const handler = setTimeout(() => {
      if (query) {
        fetchData(query);
      }
    }, 500); // Adjust the debounce delay as needed

    return () => {
      clearTimeout(handler);
    };
  }, [query, searchType]);

  return (
    <div className="flex flex-col w-full">
      <div className="relative flex flex-col w-full border rounded-xl gap-2 h-fit px-4 py-3">
        <div className="flex gap-2 z-10 bg-white items-center w-full justify-between rounded-xl mb-px">
          <input
            autoFocus
            onFocus={() => {
              setSearchInputFocus(true);
            }}
            onBlur={() => {
              setTimeout(() => {
                setSearchInputFocus(false);
              }, 100);
            }}
            className="outline-none w-full"
            placeholder="Enter username, job title, or company"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <svg
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
        {/* Uncomment and modify this if you need the location input */}
        {/* {(searchInputFocus || locationInputFocus) && (
          <div className="transition-all -mt-px flex flex-col gap-2 w-full">
            <div className="border-t w-full"></div>
            <input
              placeholder={"Location"}
              className="shrink flex-grow outline-none"
              onFocus={() => {
                setLocationInputFocus(true);
              }}
              onBlur={() => {
                setLocationInputFocus(false);
              }}
            />
          </div>
        )} */}
      </div>

      {/* Display search results */}
      {query.length > 0 && (
        <div className="w-full mt-4">
          {isLoading ? (
            <p className="w-full text-center">
              <svg
                className="inline w-8 h-7 my-1.5 text-transparent animate-spin fill-blue-500 "
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
            </p>
          ) : hasSearched && results.length === 0 ? (
            <p>No results found</p>
          ) : (
            results.map((result, index) => (
              <div
                key={result._id}
                className={`p-2 flex gap-4 items-center ${
                  index !== results.length - 1 && "border-b"
                }`}
              >
                <UserImageInput
                  imageHeight={45}
                  isEditable={false}
                  image={result.profileImage?.compressedImage}
                />
                <div>
                  <p className="font-medium text-lg">{result.username}</p>
                  {result.personal_details.working_at ? (
                    <p className="text-sm text-gray-400">
                      {result.personal_details?.working_at}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-400">
                      {result.personal_details?.firstname}{" "}
                      {result.personal_details?.lastname}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default Search;
