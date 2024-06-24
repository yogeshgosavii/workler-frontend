import React, { useState } from 'react'
import CompanyDetails from './CompanyDetails'
import Pagination from '../components/Pagination';

function CompanyList() {
    const [currentPage, setcurrentPage] = useState(1);
    const companies = [
        {
          logo: "https://img.naukimg.com/logo_images/groups/v1/4539714.gif",
          name: "Hugama",
          stars: "3",
          reviewsCount: "110",
          tags: ["Development", "Software"]
        },
        {
          logo: "https://example.com/logo2.png",
          name: "TechCorp",
          stars: "4",
          reviewsCount: "85",
          tags: ["Technology", "Services"]
        },
        {
          logo: "https://example.com/logo3.png",
          name: "GigaByte",
          stars: "5",
          reviewsCount: "200",
          tags: ["Hardware", "Manufacturing"]
        },
        {
          logo: "https://example.com/logo4.png",
          name: "DataSmith",
          stars: "4",
          reviewsCount: "150",
          tags: ["Data", "Analytics"]
        },
        {
          logo: "https://example.com/logo5.png",
          name: "EcoSolutions",
          stars: "3",
          reviewsCount: "120",
          tags: ["Environment", "Renewable Energy"]
        },
        {
          logo: "https://example.com/logo6.png",
          name: "ByteSoft",
          stars: "4",
          reviewsCount: "100",
          tags: ["Software", "Technology"]
        },
        {
          logo: "https://example.com/logo7.png",
          name: "Innovatech",
          stars: "5",
          reviewsCount: "250",
          tags: ["Innovation", "Technology"]
        },
        {
          logo: "https://example.com/logo8.png",
          name: "SysTech",
          stars: "3",
          reviewsCount: "90",
          tags: ["IT", "Services"]
        },
        {
          logo: "https://example.com/logo9.png",
          name: "CloudCom",
          stars: "4",
          reviewsCount: "180",
          tags: ["Cloud", "Services"]
        },
        {
          logo: "https://example.com/logo10.png",
          name: "GreenGrove",
          stars: "4",
          reviewsCount: "140",
          tags: ["Environment", "Sustainability"]
        },
        {
          logo: "https://example.com/logo11.png",
          name: "MediTech",
          stars: "3",
          reviewsCount: "95",
          tags: ["Healthcare", "Technology"]
        },
        {
          logo: "https://example.com/logo12.png",
          name: "FinSoft",
          stars: "4",
          reviewsCount: "110",
          tags: ["Finance", "Software"]
        },
        {
          logo: "https://example.com/logo13.png",
          name: "EduTech",
          stars: "4",
          reviewsCount: "120",
          tags: ["Education", "Technology"]
        },
        {
          logo: "https://example.com/logo14.png",
          name: "AeroDynamics",
          stars: "5",
          reviewsCount: "220",
          tags: ["Aerospace", "Engineering"]
        },
        {
          logo: "https://example.com/logo15.png",
          name: "AgriSolutions",
          stars: "3",
          reviewsCount: "80",
          tags: ["Agriculture", "Technology"]
        },
        {
          logo: "https://example.com/logo16.png",
          name: "FashionTech",
          stars: "4",
          reviewsCount: "130",
          tags: ["Fashion", "Technology"]
        },
        {
          logo: "https://example.com/logo17.png",
          name: "AutoInnovations",
          stars: "4",
          reviewsCount: "160",
          tags: ["Automotive", "Innovation"]
        },
        {
          logo: "https://example.com/logo18.png",
          name: "BioTech",
          stars: "5",
          reviewsCount: "190",
          tags: ["Biotechnology", "Science"]
        },
        {
          logo: "https://example.com/logo19.png",
          name: "TravelEase",
          stars: "3",
          reviewsCount: "100",
          tags: ["Travel", "Services"]
        },
        {
          logo: "https://example.com/logo20.png",
          name: "MediaWorks",
          stars: "4",
          reviewsCount: "170",
          tags: ["Media", "Technology"]
        }
      ];
      const companiesPerPage = 16
      const indexOfLastCompany = currentPage * companiesPerPage;
      const indexOfFirstCompany = indexOfLastCompany - companiesPerPage;
      const currentCompanies = companies.slice(indexOfFirstCompany, indexOfLastCompany);
  return (
    <div className='w-full'>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            {
                currentCompanies.map((company)=>{
                    return(
                        <CompanyDetails logo={company.logo} companyName={company.name} stars={company.stars} reviewsCount={company.reviewsCount} tags={company.tags}/>
                    )
                })
            }
        </div>
        <Pagination currentPage={currentPage} setCurrentPage={setcurrentPage} cardList={companies} cardsPerPage={companiesPerPage}/>
    </div>
    

  )
}

export default CompanyList