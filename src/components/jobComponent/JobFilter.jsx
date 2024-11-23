import React, { useState, useRef, useEffect } from "react";
import Button from "../Button/Button";
import { useNavigate, useLocation } from "react-router-dom";

function JobFilter({ filterText, setfilterText }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [currentSelectedFilter, setcurrentSelectedFilter] = useState(null);
  const [filters, setFilters] = useState([
    {
      filterName: "Employment Type",
      filterList: [
        { name: "Full-Time", selected: false, opportunities: 1000 },
        { name: "Part-Time", selected: false, opportunities: 200 },
        { name: "Contract", selected: false, opportunities: 150 },
        { name: "Freelance", selected: false, opportunities: 80 },
      ],
    },
    {
      filterName: "Job Role",
      filterList: [
        { name: "Web Developer", selected: false, opportunities: 500 },
        { name: "Data Analyst", selected: false, opportunities: 300 },
        { name: "Frontend Developer", selected: false, opportunities: 120 },
        { name: "Backend Developer", selected: false, opportunities: 90 },
        { name: "Devops Engineer", selected: false, opportunities: 90 },
        { name: "Product Manager", selected: false, opportunities: 90 },
        { name: "Content Writer", selected: false, opportunities: 90 },
      ],
    },
    {
      filterName: "Industry",
      filterList: [
        { name: "Technology", selected: false, opportunities: 800 },
        { name: "Finance", selected: false, opportunities: 500 },
        { name: "Healthcare", selected: false, opportunities: 300 },
        { name: "Education", selected: false, opportunities: 150 },
      ],
    },
  ]);

  const [showFilter, setShowFilter] = useState(false);
  const filtersRef = useRef(null);

  // Sync filters from URL on component mount
  useEffect(() => {
    const pathFilters = decodeURIComponent(
      location.pathname.split("/jobs/")[1] || ""
    ).split(",");
    if (pathFilters.length) {
      const updatedFilters = filters.map((filter) => ({
        ...filter,
        filterList: filter.filterList.map((filterItem) => ({
          ...filterItem,
          selected: pathFilters.includes(filterItem.name),
        })),
      }));
      setFilters(updatedFilters);
      setfilterText(pathFilters.join(" "));
    }
  }, [location.pathname]);

  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };

  const applyFilters = () => {
    const selectedFilters = filters.flatMap((filter) =>
      filter.filterList
        .filter((filterItem) => filterItem.selected)
        .map((filterItem) => filterItem.name)
    );
    const newPath = `/jobs/${encodeURIComponent(selectedFilters.join(","))}`;
    console.log("Navigating to:", newPath);
    setfilterText(selectedFilters.join(" "));
    setShowFilter(false);
    navigate(newPath);
    navigate(0);
  };

  const handleCheckboxChange = (filterName, index) => {
    const updatedFilters = filters.map((filter) => {
      if (filter.filterName === filterName) {
        filter.filterList[index].selected = !filter.filterList[index].selected;
      }
      return filter;
    });
    setFilters(updatedFilters);
  };

  return (
    <div>
      <div className="flex gap-3 px-4 shadow-lg py-3 mt-2 items-center bg-white sm:hidden">
        <svg
          onClick={toggleFilter}
          className="h-6 w-6 text-gray-500"
          viewBox="0 0 24 24"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        </svg>
        <div
          className="flex gap-3 overflow-auto"
          style={{ scrollbarWidth: "none" }}
        >
          {filters.map((filter) => (
            <p
              key={filter.filterName}
              onClick={() => {
                setcurrentSelectedFilter(filter);
                toggleFilter();
              }}
              className="border rounded-lg font-medium px-2 py-1 w-fit text-nowrap"
            >
              {filter.filterName}
            </p>
          ))}
        </div>
      </div>
      <div className="">
        <div
          className="border bg-white sticky top-24 bottom-0 hidden sm:block rounded-2xl min-w-60 px-6 py-8"
          ref={filtersRef}
        >
          <div className="flex pb-5 items-center border-b justify-between gap-4">
            <p className="  text-lg font-semibold">Filters</p>
            <Button onClick={applyFilters} className="bg-blue-500 text-white">
              Apply
            </Button>
          </div>
          {filters.map((filter, index, arr) => (
            <div
              key={filter.filterName}
              className={`mt-5 pb-8 ${index !== arr.length - 1 && "border-b"}`}
            >
              <p className="text-lg font-semibold">{filter.filterName}</p>
              <div className="space-y-2 mt-5">
                {filter.filterList.map((filterItem, index) => (
                  <div key={index} className="flex gap-3">
                    <input
                      id={`${filter.filterName}-${index}`}
                      type="checkbox"
                      onChange={() =>
                        handleCheckboxChange(filter.filterName, index)
                      }
                      checked={filterItem.selected}
                    />
                    <label
                      htmlFor={`${filter.filterName}-${index}`}
                      className="font-medium text-nowrap"
                    >
                      {filterItem.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="sm:hidden">
        {showFilter && (
          <div
            onClick={toggleFilter}
            className="fixed top-0 bottom-0 left-0 w-full h-full bg-black opacity-50 z-30"
          ></div>
        )}
        <div
          className={`fixed bottom-0 left-0 w-full h-3/4 z-30 bg-white shadow-md transition-transform transform ${
            showFilter ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div className="flex px-5 border-b py-4 justify-between items-center">
            <p className="text-xl font-semibold">Filters</p>
            <Button onClick={applyFilters} className="bg-blue-500 text-white">
              Apply
            </Button>
          </div>
          <div className="flex h-full">
            <div className="border-r h-full">
              {filters.map((filter) => (
                <p
                  key={filter.filterName}
                  onClick={() => setcurrentSelectedFilter(filter)}
                  className={`px-5 py-3 ${
                    filter.filterName === currentSelectedFilter?.filterName
                      ? "bg-gray-100"
                      : null
                  }`}
                >
                  {filter.filterName}
                </p>
              ))}
            </div>
            <div className="space-y-2 mt-5 overflow-y-auto pb-24">
              {currentSelectedFilter?.filterList.map((filter, index) => (
                <div key={index} className="flex gap-3 w-full pl-5">
                  <input
                    id={`${currentSelectedFilter.filterName}-${index}`}
                    type="checkbox"
                    onChange={() =>
                      handleCheckboxChange(
                        currentSelectedFilter.filterName,
                        index
                      )
                    }
                    checked={filter.selected}
                  />
                  <label
                    htmlFor={`${currentSelectedFilter.filterName}-${index}`}
                    className="font-medium text-nowrap truncate max-w-36"
                  >
                    {filter.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobFilter;
