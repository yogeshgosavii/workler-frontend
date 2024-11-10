import { useState, useRef, useEffect } from "react";

export default function JobCategories() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef(null);

  const jobCategories = [
    {
      category: "Information Technology",
      roles: "Web Developer, Database Administrator, Network Engineer, Cybersecurity Analyst",
      opportunities: "5 opportunities",
    },
    {
      category: "Business and Accounting",
      roles: "Accountant, Financial Analyst, Business Development Manager, Tax Advisor",
      opportunities: "3 opportunities",
    },
    {
      category: "Engineering and Technology",
      roles: "Software Engineer, Civil Engineer, Mechanical Engineer, IT Support Specialist",
      opportunities: "7 opportunities",
    },
    {
      category: "Human Resources (HR)",
      roles: "HR Manager, Recruiter, Talent Acquisition Specialist, Payroll Specialist",
      opportunities: "2 opportunities",
    },
    {
      category: "Marketing and Advertising",
      roles: "Marketing Manager, Social Media Specialist, Content Writer, Market Research Analyst",
      opportunities: "4 opportunities",
    },
    {
      category: "Writing and Journalism",
      roles: "Journalist, Editor, Copywriter, Technical Writer",
      opportunities: "6 opportunities",
    },
  ];

  // Handle scroll to update the current index
  const handleScroll = () => {
    const scrollLeft = scrollRef.current.scrollLeft;
    const elementWidth = scrollRef.current.clientWidth;
    const newIndex = Math.round(scrollLeft / elementWidth);
    setCurrentIndex(newIndex);
  };

  useEffect(() => {
    const scrollElement = scrollRef.current;
    scrollElement.addEventListener("scroll", handleScroll);
    return () => scrollElement.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex w-full flex-col items-center">
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto w-full mt-16 max-w-screen-lg sm:grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
        style={{
          scrollbarWidth: "none",
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {jobCategories.map((job, index) => (
          <div
            key={index}
            style={{ scrollSnapAlign: "start" }}
            onClick={() => navigate("/jobs/" + job.category)}
            className="border border-gray-300 mb-5 shadow-lg cursor-pointer text-start w-full rounded-xl bg-white p-6"
          >
            <p className="font-medium text-lg">{job.category}</p>
            <div className="flex justify-between items-center text-sm text-gray-400">
              <span className="truncate">{job.roles}</span>
              <span className="text-blue-500 flex gap-1 pl-2 font-medium">
                {job.opportunities}
                <svg
                  className="h-5 w-5 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Dot Indicators */}
      <div className="flex gap-2 mt-4">
        {jobCategories.map((_, index) => (
          <div
            key={index}
            className={`h-2 w-2 rounded-full ${
              currentIndex === index ? "bg-blue-500" : "bg-gray-300"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
}
