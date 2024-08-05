import React from 'react'

function About({descriptionInput,setdescriptionInput,setdescriptionInputText,descriptionInputText,setUpdateData,setupdateFormType,setUpdateForm,userDetails,addDescription}) {
  return (
    <div className="bg-white flex flex-col gap-4 w-full px-4 py-4 sm:px-6 h-full">
    <div className="relative overflow-hidden pb-12">
      <div className="flex justify-between">
        <p className="text-xl font-bold mb-2">Description</p>
        <svg
          class="h-5 w-5 text-blue-500"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          onClick={() => {
            setupdateFormType("personalDetails");
            console.log(userDetails);
            setUpdateData({ personalDetails: userDetails });
            setUpdateForm({ personalDetails: true });
          }}
        >
          {" "}
          <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
        </svg>
      </div>

      <div
        className={`text-sm ${descriptionInput ? "hidden" : ""}`}
      >
        {userDetails.description ? (
          <div
            onClick={() => {
              setdescriptionInputText(userDetails.description);

              setdescriptionInput(true);
            }}
          >
            <p>{userDetails.description}</p>
          </div>
        ) : (
          <div
            onClick={() => {
              setdescriptionInputText(userDetails.description);
              setdescriptionInput(true);
            }}
            className="text-sm font-normal text-gray-300 w-full"
          >
            Add a description. For example: "We are a dynamic
            company committed to excellence and innovation."
          </div>
        )}
      </div>

      <div>
        {descriptionInput && (
          <div>
            <textarea
              onChange={(e) =>
                setdescriptionInputText(e.target.value)
              }
              value={descriptionInputText}
              onFocus={() => setdescriptionInput(true)}
              onBlur={() => setdescriptionInput(false)}
              placeholder='Add a description. For example: "We are a dynamic company committed to excellence and innovation."'
              className="text-sm caret-blue-500 -mb-[6px] h-full font-normal placeholder:text-wrap placeholder:text-gray-300 outline-none w-full"
            />
          </div>
        )}

        <div
          className={`absolute flex gap-2 right-0 bottom-0 transition-transform duration-300 ${
            descriptionInput == true
              ? "translate-x-0"
              : "translate-x-40"
          }`}
        >
          <button
            onClick={() => setdescriptionInput(false)}
            className="font-medium px-4 py-1 rounded-2xl text-blue-500"
          >
            Cancel
          </button>
          <button
            onClick={addDescription}
            className="font-medium px-4 py-1 bg-blue-500 rounded-full text-white"
          >
            Save
          </button>
        </div>
      </div>
    </div>

    <div className="-mt-4">
      <p className="font-semibold text-lg mb-2  ">Details</p>
      <div className="text-sm flex flex-col gap-2">
        {userDetails?.company_details?.website && (
          <div>
            <p>Website</p>
            <p className="text-blue-500">
              {userDetails?.company_details.website}
            </p>
          </div>
        )}
        {userDetails?.company_details?.industry && (
          <div>
            <p>Industry</p>
            <p className="text-gray-400">
            {userDetails?.company_details.industry}</p>
          </div>
        )}
        {userDetails?.location && (
          <div>
            <p>Company location</p>
            <p className="text-gray-400">
              {userDetails?.location.address}
            </p>
          </div>
        )}
        {userDetails?.company_details?.found_in_date && (
          <div>
            <p>Found in</p>
            <p className="text-gray-400">
              {new Date(
                userDetails.company_details.found_in_date
              ).getFullYear()}
            </p>
          </div>
        )}
      </div>
    </div>
  </div>
  )
}

export default About