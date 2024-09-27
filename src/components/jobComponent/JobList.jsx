import React, { useEffect, useState, Suspense, lazy, useMemo } from 'react';
import companyDefaultImage from '../../assets/companyDefaultImage.png';
import Pagination from '../..//components/Pagination';
import JobSkeletonLoader  from './JobSkeletonLoader'; // Import the SkeletonLoader component
import searchService from '../../services/searchService';
import { useNavigate } from 'react-router-dom';

const JobListItem = lazy(() => import('../jobComponent/JobListItem'));

function JobList({jobs}) {
  const jobsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);
  // const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  console.log("jobs:",jobs);
  const navigate = useNavigate()
  

 

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
    <div className="flex flex-1 sm:ml-[270px] flex-col pb-10 w-full mt-20 sm:mt-0">
      {loading ? (
        <div>
          {Array.from({ length: jobsPerPage }).map((_, index) => (
            <JobSkeletonLoader key={index} />
          ))}
        </div>
      ) : (
        <Suspense fallback={<div>Loading...</div>}>
          {currentJobs.map((job, index) => (
            <JobListItem onCl key={index} job={job} companyDefaultImage={companyDefaultImage} />
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
