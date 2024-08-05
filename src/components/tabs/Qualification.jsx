import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { format } from "date-fns";

function Qualification({
  educationData,
  skillData,
  workExperienceData,
  projectData,
  loading,
  setFormType,
  setUpdateForm,
  setUpdateFormType,
  setUpdateData,
  className,
}) {
  const user = useSelector((state) => state.auth.user);
  console.log( educationData,
    skillData,
    workExperienceData,
    projectData,);

  const Section = ({ id, title, content, loading, onAdd }) => (
    <div className="flex bg-white flex-col border-y sm:border px-4 sm:px-6 py-6 mt-3">
      <div className="flex justify-between items-center">
        <p className="text-xl font-medium">{title}</p>
        {onAdd && (
          <p
            className="text-blue-500 font-medium cursor-pointer"
            onClick={() => onAdd(title)}
          >
            Add
          </p>
        )}
      </div>
      {loading ? (
        <div className="animate-pulse z-10 mt-2">
          <div className="h-2 bg-gray-200 rounded-md mb-2"></div>
          <div className="h-2 bg-gray-200 rounded-md mb-2"></div>
          <div className="h-2 bg-gray-200 w-1/4 rounded-md mb-2"></div>
        </div>
      ) : (
        content
      )}
    </div>
  );

  const userDetailsList = useMemo(
    () => [
      {
        id: "skills",
        title: "Skills",
        content: skillData.length === 0 ? (
          <p className="text-sm text-gray-400 mt-1">
            Adding the skills helps recruiters know your most useful work
          </p>
        ) : (
          <div className="flex gap-2 mt-3 flex-wrap">
            {skillData.map((data, index) => (
              <div
                key={index}
                onClick={() => {
                  setUpdateFormType("skills");
                  setUpdateData({ skills: data });
                  setUpdateForm({ skills: true });
                }}
                className={`py-2 px-4 w-fit bg-gray-50 border rounded-md ${
                  index === skillData.length - 1 ? null : "border-b"
                }`}
              >
                <p className="font-medium hover:text-blue-500">{data.name}</p>
                <p className="text-sm text-gray-400">{data.level}</p>
              </div>
            ))}
          </div>
        ),
        loading: loading.skills,
        onAdd: (id) => setFormType(id),
      },
      {
        id: "education",
        title: "Education",
        content: educationData.length === 0 ? (
          <p className="text-sm text-gray-400 mt-1">
            Adding education or course type helps recruiters know your
            educational background
          </p>
        ) : (
          educationData.map((data, index) => {
            if (
              data.educationType === "Post Graduate" ||
              data.educationType === "Graduate"
            ) {
              const formattedStartMonth = data.start_month
                ? format(new Date(data.start_month), "MMMM yyyy")
                : "";
              const formattedEndMonth = data.end_month
                ? format(new Date(data.end_month), "MMMM yyyy")
                : "Present";
              return (
                <div
                  key={index}
                  onClick={() => {
                    setUpdateFormType("education");
                    setUpdateData({ education: data });
                    setUpdateForm({ education: true });
                  }}
                  className={`py-4 ${
                    index === educationData.length - 1 ? null : "border-b"
                  }`}
                >
                  <p className="text-xl font-semibold">
                    {data.course} {data.specialization}
                  </p>
                  <p>{data.university}</p>
                  <p className="text-sm text-gray-400">
                    {formattedStartMonth} - {formattedEndMonth}
                  </p>
                </div>
              );
            } else {
              return (
                <div
                  key={index}
                  onClick={() => {
                    setUpdateData({ education: data });
                    setUpdateForm({ education: true });
                  }}
                  className={`py-4 ${
                    index === educationData.length - 1 ? null : "border-b"
                  }`}
                >
                  <p className="text-xl font-semibold">
                    {data.educationType === "Class XII" ? "Class XII" : "Class X"}
                  </p>
                  <p>{data.board}</p>
                  <p className="text-sm text-gray-400">
                    {data.educationType === "Class XII"
                      ? data.school
                      : data.class10School}
                  </p>
                  <p className="text-sm text-gray-400">
                    {data.educationType === "Class XII"
                      ? data.marks
                      : data.class10Marks}{" "}
                    %
                  </p>
                </div>
              );
            }
          })
        ),
        loading: loading.education,
        onAdd: (id) => setFormType(id),
      },
      {
        id: "workExperience",
        title: "Work experience",
        content: workExperienceData.length === 0 ? (
          <p className="text-sm text-gray-400 mt-1">
            Adding work experience helps recruiters know about your previous
            work experience
          </p>
        ) : (
          workExperienceData.map((data, index) => {
            const formattedJoiningDate = data.joiningDate
              ? format(new Date(data.joiningDate), "MMMM yyyy")
              : "";
            const formattedLeavingDate = data.leavingDate
              ? format(new Date(data.leavingDate), "MMMM yyyy")
              : "Present";
            return (
              <div
                key={index}
                onClick={() => {
                    console.log("Hello");
                    setUpdateFormType("workExperience")
                  setUpdateData({ workExperience: data });
                  setUpdateForm({ workExperience: true });
                }}
                className={`py-4 ${
                  index === workExperienceData.length - 1 ? null : "border-b"
                }`}
              >
                <p className="text-xl font-semibold">{data.companyName}</p>
                <p>{data.jobTitle}</p>
                <p className="text-sm text-gray-400">
                  {formattedJoiningDate} - {formattedLeavingDate}
                </p>
              </div>
            );
          })
        ),
        loading: loading.workExperience,
        onAdd: (id) => setFormType(id),
      },
      {
        id: "projects",
        title: "Projects",
        content: projectData.length === 0 ? (
          <p className="text-sm text-gray-400 mt-1">
            Adding projects helps recruiters know about your previous projects
          </p>
        ) : (
          projectData.map((data, index) => {
            const formattedStartDate = data.start_date
              ? format(new Date(data.start_date), "MMMM yyyy")
              : "";
            const formattedEndDate = data.end_date
              ? format(new Date(data.end_date), "MMMM yyyy")
              : "Present";
            return (
              <div
                key={index}
                onClick={() => {
                setUpdateFormType("projects")
                console.log(data);
                  setUpdateData({ projects: data });
                  setUpdateForm({ projects: true });
                }}
                className={`py-4 ${
                  index === projectData.length - 1 ? null : "border-b"
                }`}
              >
                <a href={data.url} className="text-xl font-semibold">{data.project_name}</a>
                <p className="text-sm">{data.project_description}</p>
                <p className="text-sm text-gray-400">
                  {formattedStartDate} - {formattedEndDate}
                </p>
              </div>
            );
          })
        ),
        loading: loading.projects,
        onAdd: (id) => setFormType(id),
      },
    ],
    [educationData, projectData, skillData, user, workExperienceData]
  );

  return (
    <div className={`${className}`}>
      {userDetailsList.map((item) => (
        <Section
          key={item.id}
          id={item.id}
          title={item.title}
          content={item.content}
          loading={item.loading}
          onAdd={item.onAdd}
        />
      ))}
    </div>
  );
}

export default Qualification;
