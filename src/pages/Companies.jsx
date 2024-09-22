import React from 'react'
import CompanyList from '../companyComponents/CompanyList'
import CompanyFilter from '../companyComponents/CompanyFilter'

function Companies() {
  return (
    <div className='flex flex-col mt-20 px-4 sm:flex-row gap-10'>
      <CompanyFilter/>
      <CompanyList/>
    </div>
  )
}

export default Companies