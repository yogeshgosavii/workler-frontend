// src/components/JobDetail.js
import React from 'react';

const JobDetail = ({ job }) => {
  return (
    <div className="container mx-auto">
      <h2 className="text-3xl font-bold mb-4">{job.title}</h2>
      <div className="bg-white rounded-lg shadow-md p-6 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-gray-600 mb-2">Location: {job.location}</p>
            <p className="text-gray-600">Salary: {job.salary}</p>
          </div>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md">Apply Now</button>
        </div>
        <p className="text-lg">{job.description}</p>
      </div>
      <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md focus:outline-none">Back to Job Listings</button>
    </div>
  );
};

export default JobDetail;
