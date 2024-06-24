import React, { useEffect, useState, Suspense, lazy, useMemo } from 'react';
import companyDefaultImage from '../../assets/companyDefaultImage.png';
import Pagination from '../..//components/Pagination';
import JobSkeletonLoader  from './JobSkeletonLoader'; // Import the SkeletonLoader component

const JobListItem = lazy(() => import('../jobComponent/JobListItem'));

function JobList() {
  const jobsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/jobs/third-party')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setJobs(data);
        } else {
          setJobs([data]);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching third-party jobs:', error);
        setLoading(false);
      });
  }, []);

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
    <div className="flex flex-1 flex-col w-full mt-5 sm:mt-0">
      {loading ? (
        <div>
          {Array.from({ length: jobsPerPage }).map((_, index) => (
            <JobSkeletonLoader key={index} />
          ))}
        </div>
      ) : (
        <Suspense fallback={<div>Loading...</div>}>
          {currentJobs.map((job, index) => (
            <JobListItem key={index} job={job} companyDefaultImage={companyDefaultImage} />
          ))}
        </Suspense>
      )}
      {/* Pagination */}
      <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} cardList={jobs} cardsPerPage={jobsPerPage} />
    </div>
  );
}

export default JobList;
