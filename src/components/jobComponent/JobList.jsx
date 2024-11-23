import React, {
  useEffect,
  useState,
  useRef,
  lazy,
  useLayoutEffect,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import companyDefaultImage from "../../assets/companyDefaultImage.png";
import searchService from "../../services/searchService";
import { useSelector } from "react-redux";

const JobListItem = lazy(() => import("../jobComponent/JobListItem"));

function JobList({
  query,
  className,
  filter,
  joblistSkeleton = (
    <div className=" flex flex-col gap-6 w-full mb-10 animate-pulse">
      {[1, 2, 3].map((job) => (
        <div className="py-6 border-y sm:border sm:rounded-xl">
          <div className="px-6 flex gap-2">
            <div className="h-14 w-16 rounded-md bg-gray-100"></div>
            <div className=" w-full justify-center flex flex-col gap-2">
              <div className="h-5 w-1/2 bg-gray-100 rounded-full"></div>
              <div className="h-4 w-1/3 bg-gray-100 rounded-full"></div>
            </div>
          </div>
          <div className="flex w-full gap-3 mt-5 px-6">
            <div className="h-6 w-1/4 bg-gray-100 rounded-md "></div>
            <div className="h-6 w-1/4 bg-gray-100 rounded-md "></div>
          </div>
          <div className=" w-full border-t mt-5"></div>
          <div className="mt-6 flex px-6 justify-between">
            <div className="h-7 w-1/3 bg-gray-100 rounded-full"></div>
            <div className="h-8 w-8 rounded-full bg-gray-100"></div>
          </div>
        </div>
      ))}
    </div>
  ),
}) {
  const jobsPerPage = 8;
  const [jobs, setJobs] = useState([]);
  const [currentFilter, setcurrentFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const containerRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [isRestoringState, setIsRestoringState] = useState(false);

  // Restore state from location
  useLayoutEffect(() => {
    if (location.state?.savedState) {
      const { savedJobs, savedPage, scrollPosition } =
        location.state.savedState;
      setJobs(savedJobs);
      setCurrentPage(savedPage);
      setIsRestoringState(true);
      if (containerRef.current) {
        containerRef.current.scrollTop = scrollPosition; // Restore scroll position
      }
    }
  }, [location.state]);

  // Reset jobs when query changes
  // useEffect(() => {
  //   if (!isRestoringState) {
  //     setJobs([]); // Reset jobs when query changes
  //     setCurrentPage(1); // Reset to first page
  //   } else {
  //     setIsRestoringState(false);
  //   }
  // }, []);

  // Fetch jobs when currentPage or query changes
  useEffect(() => {
    console.log("sdfghjk", query);

    const fetchJobs = async () => {
      if (loading || isRestoringState) return;

      setLoading(true);
      setError(null);

      try {
        const fetchedJobs = query
          ? await searchService.secrchJobByKeyword(
              query,
              currentPage,
              jobsPerPage
            ) // Fixed typo
          : await searchService.secrchJobByKeyword(
              ["any"],
              currentPage,
              jobsPerPage
            );

        if (fetchedJobs.jobs.length === 0) return; // Stop fetching if no more jobs
        if (currentFilter !== filter) {
          setJobs((prevJobs) => [...fetchedJobs.jobs]);
        } else {
          setJobs((prevJobs) => [...prevJobs, ...fetchedJobs.jobs]);
        }
        setcurrentFilter(filter);
      } catch (err) {
        setError("Failed to fetch jobs. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();

    console.log("jibs", jobs);
  }, [query, currentPage]);

  // useEffect(() => {
  // const fetchFilteredJobs = async()=>{
  //   const fetchedJobs = filter
  //   && await searchService.secrchJobByKeyword(query, currentPage, jobsPerPage)
  //   setJobs(fetchedJobs.jobs)
  // }

  // fetchFilteredJobs()
  // }, [filter]);

  // Handle scroll for infinite scrolling
  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const isBottom =
        (container.scrollHeight - container.scrollTop <=
          container.clientHeight + 50) -
        50;

      if (isBottom && !loading) {
        setCurrentPage((prevPage) => prevPage + 1);
      }
    };

    const container = containerRef.current;
    container?.addEventListener("scroll", handleScroll);

    return () => {
      container?.removeEventListener("scroll", handleScroll);
    };
  }, [loading]);

  // Save state and navigate to job profile
  const handleJobClick = (job) => {
    const scrollPosition = containerRef.current?.scrollTop || 0;

    const savedState = {
      savedJobs: jobs,
      savedPage: currentPage,
      scrollPosition,
    };

    // Use navigate with state to pass the saved state
    navigate(`/job/${job._id}`, { state: { savedState } });
  };

  return (
    <div
      ref={containerRef}
      style={{ scrollbarWidth: "none" }}
      className={`flex flex-1 bg-gray-50 sm:px-5 sm:pt-5 border-blue-500 overflow-y-auto ${
        isAuthenticated ? "sm:ml-[330px]" : "sm:ml-[300px]"
      } ${className} flex-col gap-8  w-full mt-0 sm:mt-0`}
    >
      {loading && jobs.length === 0 ? (
        <div>
          <div className=" flex flex-col gap-6 w-full mb-10 animate-pulse">
            {[1, 2, 3].map((job) => (
              <div className="py-6 border-y sm:border sm:rounded-xl">
                <div className="px-6 flex gap-2">
                  <div className="h-14 w-16 rounded-md bg-gray-100"></div>
                  <div className=" w-full justify-center flex flex-col gap-2">
                    <div className="h-5 w-1/2 bg-gray-100 rounded-full"></div>
                    <div className="h-4 w-1/3 bg-gray-100 rounded-full"></div>
                  </div>
                </div>
                <div className="flex w-full gap-3 mt-5 px-6">
                  <div className="h-6 w-1/4 bg-gray-100 rounded-md "></div>
                  <div className="h-6 w-1/4 bg-gray-100 rounded-md "></div>
                </div>
                <div className=" w-full border-t mt-5"></div>
                <div className="mt-6 flex px-6 justify-between">
                  <div className="h-7 w-1/3 bg-gray-100 rounded-full"></div>
                  <div className="h-8 w-8 rounded-full bg-gray-100"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : true ? (
        <div className="text-gray-400 text-center px-4">
          <p className="text-gray-600 font-semibold text-2xl">No Jobs Found</p>
          <p>No job results found with your query be more specfic or check for typos and try again</p>
        </div>
      ) : (
        jobs?.map((job, index) => (
          <div
            key={index}
            // onClick={() => handleJobClick(job)}
            className="cursor-pointer"
          >
            <JobListItem
              job={job}
              companyDefaultImage={companyDefaultImage}
              className="bg-white border-y sm:border sm:rounded-xl hover:scale-105 hover:sm:shadow-lg"
            />
          </div>
        ))
      )}
      {loading && jobs.length > 0 && (
        <div className="w-full text-center py-4">Loading more jobs...</div>
      )}
    </div>
  );
}

export default JobList;
