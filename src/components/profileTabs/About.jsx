import React from "react";

function About({
  descriptionInput,
  setdescriptionInput,
  setdescriptionInputText,
  descriptionInputText,
  setUpdateData,
  setupdateFormType,
  setUpdateForm,
  userDetails,
  addDescription,
  isEditable = true,
}) {
  return (
    <div className="bg-white flex flex-col gap-4 w-full px-4 py-4 sm:px-6 h-full">
      {(isEditable || userDetails.description)  && <div className="relative overflow-hidden mb-2">
        <div className="flex justify-between">
          <p className="text-xl font-bold mb-2">Description</p>
          {isEditable && (
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
          )}
        </div>

        <div className={`text-sm ${descriptionInput ? "hidden" : ""}`}>
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
             
              className="text-sm font-normal text-gray-300 w-full"
            >
              Add a description. For example: "We are a dynamic company
              committed to excellence and innovation."
            </div>
          )}
        </div>

       
      </div>}

      <div className="">
        <p className="font-semibold text-lg mb-2">Details</p>
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
                {userDetails?.company_details.industry}
              </p>
            </div>
          )}
          {userDetails?.location && (
            <div>
              <p>Company location</p>
              <p className="text-gray-400">{userDetails?.location.address}</p>
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
  );
}

export default About;
