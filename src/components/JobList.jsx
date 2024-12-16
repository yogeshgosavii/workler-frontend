import React, { useRef, useEffect, useState } from "react";
import TextInput from "./Input/TextInput";
import OptionInput from "./Input/OptionInput";
import AddInput from "./Input/AddInput";
import UrlInput from "./Input/UrlInput";
import TextAreaInput from "./Input/TextAreaInput";

const JobList = ({ jobs, setJobs, settagsText, tagsText }) => {
  const containerRef = useRef(null);

  // Scroll to the end when a new job is added
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollLeft = containerRef.current.scrollWidth;
    }
    console.log(jobs,jobs==0);
    
  }, [jobs]);
  const [companyName, setCompanyName] = useState("");

  const handleAddJob = () => {
    setJobs((prev) => [
      ...prev,
      {
        jobId: prev.length,
        job_source: "job_post",
        job_role: "",
        company_name: "",
        job_tags: [],
        job_url: "",
      },
    ]);
  };

  const handleRemoveJob = (jobId) => {
    // First, set the `isRemoving` flag to true for the job to be removed
    const updatedJobs = jobs.map((job) =>
      job.jobId === jobId ? { ...job, isRemoving: true } : job
    );
    setJobs(updatedJobs);
    if(jobs.length == 0){

      setJobs([])
    }

    // Wait for the animation to complete before actually removing the job
    setTimeout(() => {
      const filteredJobs = jobs.filter((job) => job.jobId !== jobId);
      setJobs(filteredJobs);
    }, 300); // Match this duration with your CSS transition duration
  };

  return (
    <div
      ref={containerRef}
      className="w-full flex gap-3 overflow-x-auto px-5"
      style={{
        overflowX: "scroll",
        scrollbarWidth: "none",
        scrollSnapType: "x mandatory",
        scrollBehavior: "smooth",
      }}
    >
      {jobs.map((job, index, arr) => (
        <div
          key={job.jobId}
          className={`border min-w-full transition-all duration-300 transform rounded-2xl flex flex-col gap-4 p-5 flex-grow ${
            job.isRemoving ? "opacity-0 scale-75" : "opacity-100 max-h-full"
          }`}
        >
          <div className="flex justify-between items-center">
            <p className="font-medium text-lg">Job {index + 1}</p>
            <div className="flex gap-4">
              <div
                onClick={handleAddJob}
                className={`${jobs.length >= 3 ? "hidden" : ""}`}
              >
                <svg
                  className="h-10 w-10 rounded-full p-2 bg-blue-50 text-blue-500"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" />
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </div>
              <div onClick={() => handleRemoveJob(job.jobId)}>
                <svg
                  className="h-10 w-10 bg-gray-100 p-2 text-gray-800 rounded-full z-10"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" />
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </div>
            </div>
          </div>
          <TextInput
            key={job.jobId + "_jobRole"}
            name={job.jobId + "_jobRole"}
            inputProps={{ autoFocus: true }}
            onChange={(e) => {
              const updatedJobs = jobs.map((j) =>
                j.jobId === job.jobId ? { ...j, job_role: e.target.value } : j
              );
              setJobs(updatedJobs);
            }}
            isRequired={true}
            value={job.jobRole}
            placeholder={"Job role"}
          />
          <OptionInput
            key={job.jobId + "_companyname"}
            name={job.jobId + "_companyname"}
            initialValue="Others"
            onChange={(e) => {
              const updatedJobs = jobs.map((j) =>
                j.jobId === job.jobId ? { ...j, company_name: e.target.value } : j
              );
              setJobs(updatedJobs);
            }}
            value={job.company_name}
            placeholder={"Company name"}
            options={[
              {
                name: "Accenture",
                value: "Accenture",
              },
              {
                name: "Microsoft",
                value: "Microsoft",
              },
              {
                name: "Google",
                value: "Google",
              },
              {
                name: "Apple",
                value: "Apple",
              },
              {
                name: "Amazon",
                value: "Amazon",
              },
              {
                name: "Facebook",
                value: "Facebook",
              },
              {
                name: "IBM",
                value: "IBM",
              },
              {
                name: "Intel",
                value: "Intel",
              },
              {
                name: "Oracle",
                value: "Oracle",
              },
              {
                name: "Cisco",
                value: "Cisco",
              },
              {
                name: "Salesforce",
                value: "Salesforce",
              },
              {
                name: "Adobe",
                value: "Adobe",
              },
              {
                name: "Deloitte",
                value: "Deloitte",
              },
              {
                name: "SAP",
                value: "SAP",
              },
              {
                name: "Walmart",
                value: "Walmart",
              },
              {
                name: "Goldman Sachs",
                value: "Goldman Sachs",
              },
              {
                name: "JPMorgan Chase",
                value: "JPMorgan Chase",
              },
              {
                name: "Tesla",
                value: "Tesla",
              },
              {
                name: "Uber",
                value: "Uber",
              },
              {
                name: "Airbnb",
                value: "Airbnb",
              },
              {
                name: "Others",
                value: "Others",
              },
              
            ]}
            
          />
         {true && <TextInput
         onChange={(e) => {
          const updatedJobs = jobs.map((j) =>
            j.jobId === job.jobId ? { ...j, company_name: e.target.value } : j
          );
          setJobs(updatedJobs);
        }}
        value={job.company_name}
        isRequired={true}
        placeholder={"Enter company name"}
          />}
          <TextAreaInput
            key={job.jobId + "_description"}
            name={"description"}
            value={job.job_description}
            isRequired={true}
            onChange={(e) => {
              const updatedJobs = jobs.map((j) =>
                j.jobId === job.jobId ? { ...j, description: e.target.value } : j
              );
              setJobs(updatedJobs);
            }}
            placeholder={"Job description"}
            />
          {/* <AddInput
            key={job.jobId + "_addInput"}
            name={"job_tags"}
            onChange={(e) => {
              settagsText((prev) => {
                const updatedList = prev.map((tag) =>
                  tag.jobId === job.jobId ? { ...tag, tagText: e.target.value } : tag
                );

                const jobExists = updatedList.some(
                  (tag) => tag.jobId === job.jobId
                );
                if (!jobExists) {
                  updatedList.push({
                    jobId: job.jobId,
                    tagText: e.target.value,
                  });
                }

                return updatedList;
              });
            }}
            handleAdd={() => {
              const updatedJobs = jobs.map((j) => {
                if (j.jobId === job.jobId) {
                  const newTags = tagsText
                    .filter((tag) => tag.jobId === job.jobId)
                    .map((tag) => tag.tagText);

                  const uniqueTags = [
                    ...j.job_tags,
                    ...newTags.filter((tag) => !j.job_tags.includes(tag)),
                  ];

                  return {
                    ...j,
                    job_tags: uniqueTags,
                  };
                }
                return j;
              });

              setJobs(updatedJobs);
            }}
            data={job.job_tags}
            placeholder={"Tags for job"}
          /> */}
          <UrlInput
            key={job.jobId+"job_url"}
            name={job.jobId +"job_url"}
            isRequired={true}
            onChange={(e) => {
              const updatedJobs = jobs.map((j) =>
                j.jobId === job.jobId ? { ...j, job_url: e.target.value } : j
              );
              setJobs(updatedJobs);
            }}
            value={job.job_url}
            placeholder={"Link to apply"}
          />
        </div>
      ))}
    </div>
  );
};

export default JobList;
