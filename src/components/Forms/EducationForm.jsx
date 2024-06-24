import React, { useState, useEffect } from 'react';
import Button from "../Button/Button";
import useProfileApi from "../../services/profileService";

function EducationForm({ onClose, setEducationData }) {
  const typesOfEducation = ["Post Graduate", "Graduate", "Class XII", "Class X"];
  const [educationType, setEducationType] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [educationMode, setEducationMode] = useState("Full time");
  const [formData, setFormData] = useState({
    educationType: '',
    university: '',
    course: '',
    specialization: '',
    start_year: '',
    end_year: '',
    board: '',
    school_name: '',
    passing_out_year: '',
    grade: '',
    marks: '',
    maths: '',
    physics: '',
    chemistry: ''
  });
  const profileApi = useProfileApi()


  // Update formData when educationType changes
  useEffect(() => {
    setFormData(prevState => ({ ...prevState, educationType }));
  }, [educationType]);

  const onSave = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const filteredData = Object.entries(formData)
        .filter(([key, value]) => value !== null && value !== "")
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
  
      const educationData = await profileApi.education.add(filteredData, token);
      console.log(educationData);
      setEducationData(prev => [...prev, educationData]);
      onClose();
    } catch (error) {
      console.error('Error in addEducation:', error);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  const isPostGraduateOrGraduateFilled = () => {
    return formData.university && formData.course && formData.specialization && formData.start_year && formData.end_year;
  };

  const isClassXIIFilled = () => {
    return formData.board && formData.school_name && formData.passing_out_year && formData.marks && formData.maths && formData.physics && formData.chemistry;
  };

  const isClassXFilled = () => {
    return formData.board && formData.school_name && formData.passing_out_year && formData.marks;
  };

  const isSaveDisabled = () => {
    switch (educationType) {
      case "Post Graduate":
      case "Graduate":
        return !isPostGraduateOrGraduateFilled();
      case "Class XII":
        return !isClassXIIFilled();
      case "Class X":
        return !isClassXFilled();
      default:
        return true;
    }
  };

  // Handle back button functionality
  const handleBack = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    } else {
      onClose();
    }
  };

  // Handle cancel action
  const handleCancel = () => {
    onClose();
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  // Render the form based on selected education type
  const renderEducationForm = () => {
    switch (educationType) {
      case "Post Graduate":
      case "Graduate":
        return (
          <div className='flex flex-col gap-4'>
            <input
              type="text"
              name="university"
              placeholder="University/Institute name*"
              className="border p-2 w-full rounded-sm"
              value={formData.university}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="course"
              placeholder="Course"
              className="border p-2 w-full rounded-sm"
              value={formData.course}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="specialization"
              placeholder="Specialization"
              className="border p-2 w-full rounded-sm"
              value={formData.specialization}
              onChange={handleInputChange}
            />
            <input
              type="number"
              name="grade"
              placeholder="Grade out of 10"
              className="border p-2 w-full rounded-sm"
              value={formData.grade}
              onChange={handleInputChange}
            />
            <div className='flex gap-2'>
              {["Full time", "Part time"].map((mode) => (
                <p key={mode} onClick={() => setEducationMode(mode)} className={`${mode === educationMode ? "bg-blue-50 border-blue-500 text-blue-500" : "border-transparent text-gray-500"} border cursor-pointer px-4 py-1 w-fit rounded-md`}>
                  {mode}
                </p>
              ))}
            </div>
            <div className='flex gap-4 w-full flex-wrap'>
              <select
                name="start_year"
                className="border p-2 w-fit rounded-sm max-w-40"
                value={formData.start_year}
                onChange={handleInputChange}
              >
                <option value="">Start year</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <select
                name="end_year"
                className="border p-2 w-fit rounded-sm max-w-40"
                value={formData.end_year}
                onChange={handleInputChange}
              >
                <option value="">End year</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        );
      case "Class XII":
        return (
          <div>
            <div className='space-y-4'>
              <input
                type="text"
                name="board"
                placeholder="Board*"
                className="border p-2 rounded-sm w-full"
                value={formData.board}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="school_name"
                placeholder="School Name*"
                className="border rounded-sm p-2 w-full"
                value={formData.school_name}
                onChange={handleInputChange}
              />
              <select
                name="passing_out_year"
                className="border p-2 w-full rounded-sm"
                value={formData.passing_out_year}
                onChange={handleInputChange}
              >
                <option value="">Passing out year*</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <input
                type="text"
                name="marks"
                placeholder="Marks in % out 100*"
                className="border rounded-sm p-2 w-full"
                value={formData.marks}
                onChange={handleInputChange}
              />
              <div className='flex gap-2'>
                <input
                  type="text"
                  name="maths"
                  placeholder="Maths"
                  className="border rounded-sm p-2 w-full"
                  value={formData.maths}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="physics"
                  placeholder="Physics"
                  className="border rounded-sm p-2 w-full"
                  value={formData.physics}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="chemistry"
                  placeholder="Chemistry"
                  className="border rounded-sm p-2 w-full"
                  value={formData.chemistry}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        );
      case "Class X":
        return (
          <div>
            <div className='space-y-4'>
              <input
                type="text"
                name="board"
                placeholder="Board*"
                className="border p-2 rounded-sm w-full"
                value={formData.board}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="school_name"
                placeholder="School Name*"
                className="border rounded-sm p-2 w-full"
                value={formData.school_name}
                onChange={handleInputChange}
              />
              <select
                name="passing_out_year"
                className="border p-2 w-full rounded-sm"
                value={formData.passing_out_year}
                onChange={handleInputChange}
              >
                <option value="">Passing out year*</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <input
                type="text"
                name="marks"
                placeholder="Marks in % out 100*"
                className="border rounded-sm p-2 w-full"
                value={formData.marks}
                onChange={handleInputChange}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Define the pages for the form
  const pages = [
    {
      content: (
        <div className='flex flex-wrap gap-2 h-full'>
          <div className='flex-1'>
            <p className='text-sm font-medium'>Education<span className='text-red-500'>*</span></p>
            <div className='flex gap-3 mt-2 text-nowrap flex-wrap'>
              {typesOfEducation.map((type) => (
                <p
                  key={type}
                  onClick={() => setEducationType(type)}
                  className={`${educationType === type ? "scale-110 bg-blue-50 text-blue-500 border-blue-500 font-semibold" : "text-gray-500 border-gray-300"} border transition-all ease-in-out 0.3ms px-4 h-fit py-2 text-sm cursor-pointer rounded-md`}
                >
                  {type}
                </p>
              ))}
            </div>
          </div>
          <div className='flex justify-end items-center mt-14 w-full'>
            <Button className="text-blue-500 font-medium" onClick={handleCancel}>Cancel</Button>
            <Button disabled={!educationType} className="bg-blue-500 rounded-full text-white disabled:bg-blue-300" onClick={() => setCurrentPage(currentPage + 1)}>Next</Button>
          </div>
        </div>
      )
    },
    {
      content: (
        <div className='flex flex-col gap-4'>
          {renderEducationForm()}
          <div className='flex justify-end items-center mt-10 w-full'>
            <Button className="text-blue-500 font-medium" onClick={handleCancel}>Cancel</Button>
            <Button disabled={isSaveDisabled()} className="bg-blue-500 rounded-full text-white disabled:bg-blue-300" onClick={onSave}>Save</Button>
          </div>
        </div>
      )
    }
  ];

  return (
    <form className='bg-white p-6 px-4 sm:px-8 rounded-sm w-full h-full '>
      <h2 className='text-xl font-medium'>Education</h2>
      <p className='text-sm text-gray-400 mb-8'>Adding the education or course type helps recruiters know your educational background</p>
      {pages[currentPage].content}
    </form>
  );
}

export default EducationForm;
