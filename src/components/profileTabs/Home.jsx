import React from "react";
import UserImageInput from "../Input/UserImageInput";
import profileImageDefault from "../../assets/user_male_icon.png";
import { formatDistanceToNow } from "date-fns";
import ImageCarousel from "../ImageCarousel";

function Home({
  user,
  loading,
  setcurrentTab,
  setupdateFormType,
  setUpdateData,
  postData,
  isEditable,
}) {
  return (
    <div className="  flex flex-col gap-4 mb-4 border  text-gray-800 bg-white h-full">
      {user?.account_type == "Employeer" ? (
        <div className="flex flex-col    gap-2">
          <p className="text-xl font-bold px-4 mt-4 md:px-6">About</p>
          {loading.user ? (
            <div className="px-4 md:px-6 py-4">
              <div className="h-2 bg-gray-200 rounded-md mb-2 "></div>
              <div className="h-2 bg-gray-200 rounded-md mb-4 "></div>
              <div className="h-2 bg-gray-200 w-1/2 rounded-md mb-2 "></div>
            </div>
          ) : (
            <div className="mb-4 px-4 md:px-6 ">
              <p className=" line-clamp-3 mt-1 text-sm mb-2">
                {user == "" ? (
                  <div>
                    <div className="animate-pulse z-10 mt-2">
                      <div className="h-2 bg-gray-200 rounded-md mb-2"></div>
                      <div className="h-2 bg-gray-200 rounded-md "></div>
                      <div className="h-2 w-1/2 bg-gray-200 rounded-md mt-5"></div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <span> {user.description}</span>
                    {!user.description && (
                      <div className="text-sm flex flex-col gap-2">
                        {user?.company_details?.website && (
                          <div>
                            <p>Website</p>
                            <p className="text-blue-500">
                              {user?.company_details.website}
                            </p>
                          </div>
                        )}
                        {user?.company_details?.industry && (
                          <div>
                            <p>Industry</p>
                            <p className="text-gray-400">
                              {user?.company_details.industry}
                            </p>
                          </div>
                        )}
                        {user?.location && (
                          <div>
                            <p>Company location</p>
                            <p className="text-gray-400">
                              {user?.location.address}
                            </p>
                          </div>
                        )}
                        {user?.company_details?.found_in_date && (
                          <div>
                            <p>Found in</p>
                            <p className="text-gray-400">
                              {new Date(
                                user.company_details.found_in_date
                              ).getFullYear()}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </p>
              <a className="text-sm text-blue-500">
                {user.company_details?.website}
              </a>
            </div>
          )}
          <p
            onClick={() => {
              setcurrentTab("About");
            }}
            className="w-full text-center border-y font-medium py-2 text-gray-400"
          >
            Learn more
          </p>
        </div>
      ) : (
        <div className="relative   md:px-6 overflow-hidden h-full px-4 py-4 pb-6">
          <div className="flex justify-between items-center mb-2 ">
            <p className="text-xl font-bold ">About</p>
            

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
                  setUpdateData({ personalDetails: user });
                  // setUpdateForm({ personalDetails: true });
                }}
              >
                {" "}
                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
              </svg>
            )}
          </div>
          {(!user.description ||
                !user.linkedInLink ||
                !user.location ||
                !user.githubLink) && (
                  <p className="text-gray-400 text-sm -mt-2">
                    Add some more details to let people know more about you
                  </p>
                )}

          {!loading.userDetails ? (
            <div className="flex flex-col gap-4 mt-5">
              {isEditable ||
                (user.description && (
                  <div className={`text-sm font-normal  `}>
                    <p className="font-semibold mb-1">Description</p>
                    {user.description ? (
                      <div onClick={() => setdescriptionInput(true)}>
                        <p className="text-gray-400">{user.description}</p>
                      </div>
                    ) : user.account_type == "Employeer" ? (
                      <div className="text-sm font-normal text-gray-300 w-full">
                        Add a description. For example: "We are a dynamic
                        company committed to excellence and innovation."
                      </div>
                    ) : (
                      <div className="text-sm font-normal text-gray-300 w-full">
                        Add a description. For example: "Experienced
                        professional with a strong background in developing."
                      </div>
                    )}
                  </div>
                ))}
              {user?.linkedInLink && (
                <div className={`text-sm font-normal  `}>
                  <p className="font-medium">LinkedIn</p>
                  {!loading.user && (
                    <a
                      className="text-sm font-normal text-blue-500 w-full"
                      href={user?.linkedInLink}
                    >
                      {user?.linkedInLink}
                    </a>
                  )}
                </div>
              )}
              {user.githubLink && (
                <div className={`text-sm font-normal  `}>
                  <p className="font-medium">Github</p>
                  {!loading.user && (
                    <a
                      className="text-sm font-normal text-blue-500 w-full"
                      href={user?.githubLink}
                    >
                      {user?.githubLink}
                    </a>
                  )}
                </div>
              )}

              
              {user?.location && (
                <div className={`text-sm font-normal  `}>
                  <p className="font-medium">Address</p>
                  {!loading.user && (
                    <div className="text-sm font-normal text-gray-400 w-full">
                      {user?.location?.address}
                    </div>
                  )}
                </div>
              )}
              {user?.personal_details?.phone && (
                <div className={`text-sm font-normal  `}>
                  <p className="font-medium">Phone</p>
                  {!loading.user && (
                    <div className="text-sm font-normal text-gray-400 w-full">
                      {user?.personal_details?.phone}
                    </div>
                  )}
                </div>
              )}
             
            </div>
          ) : (
            <div className="animate-pulse flex flex-col gap-3 z-10 mt-5">
              <div>
                <div className="h-2 bg-gray-200 w-1/4 rounded-md mb-2"></div>
                <div className="h-2 bg-gray-200 rounded-md mb-2"></div>
              </div>
              <div>
                <div className="h-2 bg-gray-200 w-1/4 rounded-md mb-2"></div>
                <div className="h-2 bg-gray-200 rounded-md mb-2"></div>
              </div>
              <div>
                <div className="h-2 bg-gray-200 w-1/4 rounded-md mb-2"></div>
                <div className="h-2 bg-gray-200 rounded-md mb-2"></div>
              </div>
              <div>
                <div className="h-2 bg-gray-200 w-1/4 rounded-md mb-2"></div>
                <div className="h-2 bg-gray-200 rounded-md mb-2"></div>
              </div>
              <div>
                <div className="h-2 bg-gray-200 w-1/4 rounded-md mb-2"></div>
                <div className="h-2 bg-gray-200 rounded-md mb-2"></div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Home;
