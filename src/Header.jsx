import React, { useEffect, useState } from 'react';
import Logo from './assets/Logo';
import BorderedButton from './components/Button/BorderButton';
import Button from './components/Button/Button';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import profileImageDefault from '../src/assets/user_male_icon.png';
import authService from "./services/authService";

function Header({className}) {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [userDetails, setUserDetails] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const isHeaderHidden = isAuthenticated || location.pathname.startsWith("/job/");

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await authService.fetchUserDetails();
        setUserDetails(response);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    if (isAuthenticated) {
      fetchUserDetails();
    }
  }, [isAuthenticated]);

  return (
    <div className={`${isHeaderHidden ? "hidden" : "block"} ${className}  w-full fixed top-0 z-20 flex justify-center `}>
      <div className='relative w-full '>
        {/* Blurred Background */}
        <div className={`absolute inset-0  bg-background/95  backdrop-blur supports-[backdrop-filter]:bg-background/60 -z-10  `} />


        <div className='flex w-full px-5 sm:px-8 py-3 sm:py-4 justify-between items-center'>
          <div className='flex gap-10 items-center justify-between'>
            <Logo />
          </div>

          {isAuthenticated ? (
            <div 
              onClick={() => navigate("/profile")}
              className='flex items-center cursor-pointer gap-3 sm:border sm:px-4 sm:pr-5 sm:py-2 rounded-md'>
              <img 
                className='h-10 w-10 object-cover border rounded-full' 
                src={userDetails?.profileImage?.compressedImage || profileImageDefault} 
                alt='Profile' 
              />
              <div className='hidden sm:inline'>
                <p className='font-medium'>{user?.username || "User"}</p>
                <div className="flex gap-1 items-center">
                  <p className="text-xs text-gray-400">Currently active</p>
                  <span className="h-2 w-2 rounded-full border bg-green-500"></span>
                </div>
              </div>
            </div>
          ) : (
            <div className='flex'>
              <Link to="/login">
                <BorderedButton >Login</BorderedButton>
              </Link>
              <Link to="/signup" className="hidden sm:inline-block">
                <Button className="bg-gray-800  text-white">Register</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
