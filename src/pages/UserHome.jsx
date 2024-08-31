import React, { useEffect, useState } from 'react'
import { getAllPosts } from '../services/postService';
import { set } from 'date-fns';
import Posts from '../components/profileTabs/Posts';
import useProfileApi from '../services/profileService';
import useJobApi from '../services/jobService';


function UserHome() {

  const [content, setcontent] = useState([]);
  const [selectedtype, setSelectedType] = useState("All");
  const jobService = useJobApi()
  useEffect(() => {
    const fetchPosts = async()=> {
      const posts = await getAllPosts();
      if(selectedtype == "Posts"){
        setcontent(posts.filter(post=>(post.post_type != "job")))

      }
      else if (selectedtype == "Jobs"){
        setcontent(posts.filter(post=>(post.post_type == "job")))

      }else{
        setcontent(posts)
      }
      console.log("posts",posts);
      
    }

    const fetchJobs = async () => {
      const jobs = await jobService.job.getAll()
      console.log("jobs",jobs);
      
    }

    fetchPosts()
    fetchJobs()
   
  }, [selectedtype]);
  return (
    <div className='w-full sm:max-w-lg'>
      <div className=' px-4 flex sm:left-[71px] shadow-md z-50 bg-white py-4 fixed top-0 w-full'>
        {
          ["All","Posts","Jobs"].map((type)=>(
            <p onClick={()=>{setSelectedType(type)}} className={`${selectedtype == type && "bg-blue-50 text-blue-500 rounded-md"} px-4 py-1`}>{type}</p>
          ))
        }
      </div>
      <div className='mt-12 sm:mt-16 pb-14'>
        {/* {
          content
        } */}
        <Posts
        isEditable={false}
        postData={content}
        />
      </div>
    </div>
  )
}

export default UserHome