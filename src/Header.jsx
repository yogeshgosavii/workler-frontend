import React, { useEffect, useState } from 'react';
import Logo from './assets/Logo';
import BorderedButton from './components/Button/BorderButton';
import Button from './components/Button/Button';
import { Link ,useNavigate} from 'react-router-dom';
import { useSelector } from 'react-redux';
import profileImageDefault from '../src/assets/user_male_icon.png';
import authService from "./services/authService";


function Header() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [userDetails, setUserDetails] = useState(null);

  console.log("userData:", user);
  console.log("login status:", isAuthenticated);

  
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await authService.fetchUserDetails();
        setUserDetails(response);
        console.log(response);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

  const navigate = useNavigate();

  return (
    <div className={`${isAuthenticated && "hidden"} w-full fixed top-0 bg-white z-20 flex justify-center border-b-2 sm:border-none sm:shadow-md`}>
      <div className='flex w-full px-5 sm:px-8 py-3 sm:py-4 justify-between items-center'>
        {/* <svg className="h-8 w-8 sm:hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
        </svg> */}
        <div className='flex gap-10 items-center justify-between'>
          <Logo />
          {/* <div className=' gap-10 text-center items-center text-lg font-semibold hidden sm:flex'>
            <Link to={"/jobs"} className='cursor-pointer'>Jobs</Link>
            <Link to={"/companies"} className='cursor-pointer'>Companies</Link>
          </div> */}
        </div>
        {isAuthenticated ? (
          <div onClick={()=>navigate("/profile")} className='flex items-center cursor-pointer gap-3 sm:border sm:px-4 sm:pr-5  sm:py-2 rounded-md '>
            <img className='h-10 w-10 object-cover border rounded-full ' src={userDetails?.profileImage?.compressedImage || profileImageDefault} alt='Profile' />
            <div className='hidden sm:inline'>
              <p className=' font-medium'>{user?.username || "User"}</p>
              {/* <p className='text-red-500'>Logout</p> */}
              <div className="flex gap-1 items-center">
                  <p className="text-xs text-gray-400">Currently active</p>
                  <span className="h-2 w-2 rounded-full border bg-green-500"></span>

                </div>
            </div>
            
          </div>
        ) : (
          <div className='flex'>
            <BorderedButton><Link to={"/login"}>Login</Link></BorderedButton>
            <Button className={"hidden sm:flex bg-blue-500 hover:bg-blue-600 text-white"}><Link to={"/signup"}>Register</Link></Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
