import React, { useState } from 'react';
import scrapeJobDetails from '../../services/scrapeService';

const JobLinkDetails = () => {
  const [url, setUrl] = useState('');
  const [jobDetails, setJobDetails] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFetchDetails = async () => {
    if (!url) {
      alert("Please enter a job URL.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const details = await scrapeJobDetails(url);
      setJobDetails(details);
    } catch (error) {
      setError("Failed to fetch job details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="scraper-container">
      <h2>Job Scraper</h2>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter job URL"
        className="url-input"
      />
      <button onClick={handleFetchDetails} disabled={loading} className="fetch-button">
        {loading ? "Fetching..." : "Fetch Job Details"}
      </button>

      {error && <p className="error-message">{error}</p>}

      {jobDetails && (
        <div className="job-details">
          <h3>Job Title: {jobDetails.title}</h3>
          <p><strong>Company:</strong> {jobDetails.company}</p>
          <p><strong>Description:</strong> {jobDetails.description}</p>
        </div>
      )}
    </div>
  );
};

export default JobLinkDetails;
