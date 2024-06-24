import React from 'react';
import defaultCompanyImage from "../../assets/companyDefaultImage.png";

const JobsAppliedSection = () => {
  return (
    <div className='border px-5 py-4 h-fit w-80'>
      <p className='text-xl font-medium mb-8'>Jobs Applied</p>
      <div className='flex flex-col gap-3'>
        <JobAppliedItem company="Google" position="SDE-1" status="Pending" />
        <JobAppliedItem company="Microsoft" position="SDE-2" status="Shortlisted" />
        <JobAppliedItem company="Meta" position="ML Engineer" status="Rejected" />
      </div>
    </div>
  );
};

const JobAppliedItem = ({ company, position, status }) => {
  return (
    <div className='flex gap-2'>
      <img className='aspect-square h-10 w-10' src={defaultCompanyImage} alt="Company" />
      <div className='flex flex-col'>
        <p className='font-medium'>{company}</p>
        <p className='text-gray-500'>{position}</p>
        <p className={`text-sm border px-3 py-1 w-fit ${status === 'Pending' ? 'bg-gray-50 text-gray-400' : status === 'Shortlisted' ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'}`}>{status}</p>
      </div>
    </div>
  );
};

export default JobsAppliedSection;
