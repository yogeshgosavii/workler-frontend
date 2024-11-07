import React, { useState, useEffect } from 'react';


function Tabs({ tabs, className,setTab,tab, selectedTextColor = "#012169", ...props }) {
  // If tabs prop is not provided, use default tabs
  if (!tabs) {
    tabs = [
      {
        tabName: "Latest Oportunities",
        tabImage: "https://img.icons8.com/?size=100&id=lYYpvG0DCiKl&format=png&color=000000",
        tabLink: "/personal"
      },
      {
        tabName: "Top Paying",
        tabImage: "https://img.icons8.com/?size=100&id=34028&format=png&color=000000",
        tabLink: "/business-help"
      },
      {
        tabName: "Various Locations",
        tabImage: "https://img.icons8.com/?size=100&id=ONd36JPfNc5a&format=png&color=000000",
        tabLink: "/technical-help"
      }
    ];
  }

  // State to keep track of the selected tab index
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [tabWidth, setTabWidth] = useState(0);
  const [tabContainerWidth, setTabContainerWidth] = useState(0);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);


  // Calculate the width of each tab
  useEffect(() => {
    const containerWidth = document.getElementById("tabsContainer").offsetWidth;
    const calculatedTabWidth = containerWidth / tabs.length;
    setTabWidth(calculatedTabWidth);
    setTabContainerWidth(containerWidth);
  }, [tabs]);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate the position of the highlight based on the selected tab
  useEffect(() => {
    const highlightPosition = tabWidth * selectedTabIndex;
    const highlightElement = document.getElementById("highlight");
    if (highlightElement) {
      highlightElement.style.transform = `translateX(${highlightPosition-1}px)`;
    }
  }, [selectedTabIndex, tabWidth]);

  return (
    <div className={` border shadow-inner  flex gap-2 justify-between px-2 py-1.5 rounded-full w-full max-w-lg md:max-w-screen-md relative ${className}`} {...props} id="tabsContainer">
      {tabs.map((tab, index) => (
        <div
          className={`px-8 text-center flex justify-center py-2 z-10 w-1/3 rounded-full cursor-pointer font-medium ${selectedTabIndex === index ? `text-white ` : `text-gray-700`}`}
          key={tab.tabName}
          title={tab.tabName}
          onClick={() => {setSelectedTabIndex(index)

            setTab(tab.tabName)
          }}
        >
          <p className='hidden md:block truncate'>
            {tab.tabName}
          </p>
          <img className='md:hidden h-6 aspect-square ' src={tab.tabImage} alt={tab.tabName}/>
        </div>
      ))}
      
      <div
        id="highlight"
        className="absolute h-[44px] md:h-[44px] top-1 left-[5.5px] md:left-[5px] rounded-full bg-gray-700"
        style={{
          width: `${tabContainerWidth / (screenWidth >= 768 ? 3.13 : 3.27)}px` ,
          transition: 'transform 0.3s ease-in-out',
        }}
      />
    </div>
  );
}

export default Tabs;
