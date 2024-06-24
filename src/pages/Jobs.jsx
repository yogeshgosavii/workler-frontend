import React from 'react'
import JobList from '../components/jobComponent/JobList'
import JobFilter from '../components/jobComponent/JobFilter'
import News from '../components/jobComponent/News'

function Jobs() {
  return (
    <div className='flex justify-center w-full gap-10'>
        <JobFilter/>
        <JobList/>
        {/* <div className='hidden  md:block'>
          <News/>
        </div> */}
    </div>
  )
}

export default Jobs