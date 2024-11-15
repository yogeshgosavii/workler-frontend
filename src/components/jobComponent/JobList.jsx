import React, { useEffect, useState, Suspense, lazy, useMemo } from 'react';
import companyDefaultImage from '../../assets/companyDefaultImage.png';
import Pagination from '../..//components/Pagination';
import JobSkeletonLoader  from './JobSkeletonLoader'; // Import the SkeletonLoader component
import searchService from '../../services/searchService';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const JobListItem = lazy(() => import('../jobComponent/JobListItem'));

function JobList({jobs}) {
  const jobsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);
  // const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  

  const joblistSkeleton = () => {
    return (
      <div className=" flex flex-col gap-6 w-full mb-10 animate-pulse">
        {[1,2,3].map((job) => (
          <div className="py-6 border-y">
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
    );
  };

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = useMemo(() => jobs.slice(indexOfFirstJob, indexOfLastJob), [jobs, indexOfFirstJob, indexOfLastJob]);

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(1, prevPage - 1));
  };

  const handleNextPage = () => {
    const totalPages = Math.ceil(jobs.length / jobsPerPage);
    setCurrentPage((prevPage) => Math.min(totalPages, prevPage + 1));
  };

  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <div className={`flex flex-1  ${isAuthenticated?"sm:ml-[330px]":"sm:ml-[300px]"} flex-col gap-8 pb-10 w-full mt-20 sm:mt-0 `}>
      {loading ? (
        <div>
          {Array.from({ length: jobsPerPage }).map((_, index) => (
            <JobSkeletonLoader key={index} />
          ))}
        </div>
      ) : (
        <Suspense fallback={<div>{joblistSkeleton()}</div>}>
         
          {currentJobs.map((job, index) => (
            <JobListItem onCl key={index} job={job} companyDefaultImage={companyDefaultImage} className="border bg-white  sm:shadow-none hover:sm:shadow-xl  hover:scale-105" />
          ))}
           {/* {currentJobs.map((job, index) => (
            <JobListItem key={index} job={job} companyDefaultImage={companyDefaultImage} />
          ))}
           {currentJobs.map((job, index) => (
            <JobListItem key={index} job={job} companyDefaultImage={companyDefaultImage} />
          ))} */}
        </Suspense>
      )}
      {/* Pagination */}
      <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} cardList={jobs} cardsPerPage={jobsPerPage} />
    </div>
  );
}

export default JobList;
