const scrapeJobDetails = async (url) => {
    try {
      const response = await fetch(`http://localhost:5002/api/scrape/getJobDetails?url=${encodeURIComponent(url)}`, {
        method: 'GET',  // Explicitly use GET method (default for fetch)
      });
  
      // Check if the response was successful (200 OK)
      if (!response.ok) {
        throw new Error('Failed to fetch job details');
      }
  
      // Parse and return the data
      return await response.json();
    } catch (error) {
      console.error("Error scraping job details:", error.message);
      throw new Error('Failed to fetch job details');
    }
  };
  
  export default scrapeJobDetails;
  