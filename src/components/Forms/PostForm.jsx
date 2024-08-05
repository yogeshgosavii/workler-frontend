import React, { useState } from 'react';
import imageService from '../../services/imageService.js'; // Adjust the import path as needed
import {createPost} from '../../services/postService'; // Adjust the import path as needed


function PostForm() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ content: '', images: [] });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files); // Convert FileList to Array
    setFormData((prevState) => ({ ...prevState, images: files }));
    setImages(files); // Update preview
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formDataToSend = new FormData();
    formDataToSend.append('content', formData.content);
    formData.images.forEach((image) => {
      formDataToSend.append('images', image);
    });

    try {
      await createPost(formDataToSend);
      setFormData({ content: '', images: [] });
      setImages([]);
      alert('Post created successfully!');
    } catch (error) {
      setError('Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
        <div className="flex items-start space-x-4">
          <img
            src="https://via.placeholder.com/40"
            alt="User Avatar"
            className="w-10 h-10 rounded-full"
          />
          <textarea
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            placeholder="What's happening?"
            rows="4"
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <input
            type="file"
            name="images"
            multiple
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
          />
          <div className="flex flex-wrap mt-2">
            {images.map((image, index) => (
              <div key={index} className="w-20 h-20 relative mr-2 mb-2">
                <img
                  src={URL.createObjectURL(image)}
                  alt={`image-${index}`}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
            ))}
          </div>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 text-white font-semibold rounded-md ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500'} focus:outline-none focus:ring`}
          >
            {loading ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default PostForm;
