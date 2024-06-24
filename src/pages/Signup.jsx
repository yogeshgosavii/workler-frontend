import React, { useEffect, useRef, useState } from 'react'

import verifiedIcon from "../assets/verified.png"
import { Link, useNavigate } from 'react-router-dom';

import Otp from '../components/Otp';
import Button from '../components/Button/Button';

function Signup() {

    const [otpInput, setotpInput] = useState(false);
    const fileInputRef = useRef(null);
    const [email, setemail] = useState("");
    const [emailChecking, setemailChecking] = useState(false);
    const [otpValue, setotpValue] = useState("");
    const [verified, setverified] = useState(false);
    const [next, setNext] = useState(false)
    const [loader, setloader] = useState(false);
    const [usernameChecking, setusernameChecking] = useState(false);
    const [usernameChecked, setusernameChecked] = useState(false);
    const [userNameAvailable, setuserNameAvailable] = useState(false);
    const [showPassword, setshowPassword] = useState(false);
    const [accountErrorMessage, setAccountErrorMessage] = useState();
    const [errorMessage, setErrorMessage] = useState();
    const [successMessage, setSuccessMessage] = useState();
    const navigate = useNavigate();


    const handleIconClick = () => {
        // Trigger click event on the file input element
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        // Handle the file upload logic here
        console.log('File uploaded:', file.name);
    };


    useEffect(() => {
        const locationIcon = document.getElementById("locationIcon");
        if (locationIcon) {
            locationIcon.addEventListener('click', () => {
                document.getElementById("userAddress").value = "Kandivali West,Mumbai India";
            });
        }
    }, []);

    const verifyUserName = (username) => {

    }
    const verifyEmail = async () => {
        var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        var emailInput = document.getElementById("userEmail");
        var emailBorder = document.getElementById("userEmailFull");
        
        if (emailInput.value.match(validRegex)) {
            emailBorder.focus();
            emailBorder.classList.remove("border-red-400", "bg-red-50");
    
            try {
                setemailChecking(true);
<<<<<<< HEAD
                const response = await fetch('https://workler-backend.vercel.app/api/auth/check-email', {
=======
                const response = await fetch('http://localhost:5000/api/auth/checkEmail', {
>>>>>>> origin/main
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: emailInput.value }),
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    
    
                    if (!data.exists) {
                        document.getElementById("error").classList.add("invisible");
                        const otp = Math.floor(100000 + Math.random() * 900000); // Generate a random 6-digit OTP
                        console.log("otp : ", otp);
                        setotpValue(otp);
                        setemail(emailInput.value);
                        setotpInput(true);
                    } else {
                        setErrorMessage("Email already exists")
                        console.log("Email already exists");
                    }
                } else {
                    const errorMessage = await response.text();
                    console.error('Error checking email:', errorMessage);
                }
            } catch (error) {
                console.error('Error checking email:', error);
            } finally {
                setemailChecking(false);
            }
        } else {
            emailBorder.classList.add("border-red-400", "bg-red-50");
        }
    };
    
    const create = async (e) => {
        e.preventDefault();
        console.log("submit");
        setloader(true);

        // Define the user data
        const userData = {
            username: document.getElementById("userName").value,
            email: document.getElementById("userEmail").value,
            password: document.getElementById("userPassword").value,
            birthDate: new Date(document.getElementById("userBirthDate").value),
            accountType: document.getElementById("userType").value,
        };

        try {
<<<<<<< HEAD
            const response = await fetch('http://localhost:5002/api/auth/signup', {
=======
            const response = await fetch('http://localhost:5000/api/auth/signup', {
>>>>>>> origin/main
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (response.ok) {
                setSuccessMessage('User created successfully');
                setAccountErrorMessage('');
            } else {
                const errorText = await response.text();
                setAccountErrorMessage(errorText);
                setSuccessMessage('');
            }
        } catch (error) {
            setAccountErrorMessage('Error creating user');
            setSuccessMessage('');
        } finally {
            setloader(false);
        }
    };

    return (
        <div className='flex flex-col h-svh  items-center w-full justify-center  text-gray-800'>
            <div className={` flex h-full flex-col justify-between items-center sm:justify-center  w-full   ${next ? 'hidden' : null}`}>
                <div id='email-form' className={` w-full  sm:border p-10 max-w-sm flex  flex-col  `} >
                    <div className=''>
                        <p className='text-2xl font-semibold text-gray-800 '>Hello User</p>
                        <p className='text-sm text-gray-400'>Enter you email address to get started</p>
                    </div>
                    <p id='error' className={`text-red-500 px-2 mt-1 w-fit rounded-sm text-sm bg-red-50 transition-opacity duration-300 ${errorMessage ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                        {errorMessage}
                    </p>

                    <div className={`flex flex-col mt-16 w-full ${otpInput ? 'hidden' : null}`}>

                        <div id='userEmailFull' class="relative flex peer  items-center">
                            <input
                                type="email"
                                id="userEmail"
                                onChange={()=>{setErrorMessage("")}}

                                title='Email address'
                                class="flex-1 block px-3 py-3 font-normal bg-white rounded-sm border appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                placeholder=" "
                                style={{
                                    "-webkit-autofill": "number",
                                    "-webkit-box-shadow": "0 0 0px 1000px white inset",
                                }}

                            />
                            <label
                                for="userEmail"
                                class="absolute duration-200 cursor-text px-2 text-gray-400 bg-white font-normal transform -translate-y-5 scale-90 top-2 z-10 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-90 peer-focus:-translate-y-5 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                            >
                                Email address
                            </label>

                            <div
                                className=' text-gray-300 absolute w-14 flex items-center justify-center border-l h-9 cursor-pointer my-1  right-2 pl-1.5 '

                            >

                                {
                                    !emailChecking ?
                                        verified ?
                                            <img src={verifiedIcon} className='h-8 w-8' alt="" />
                                            :
                                            <p className='text-blue-500 cursor-pointer font-medium flex items-center my-1   ' onClick={(e) => { verifyEmail() }}>verify</p>
                                        :
                                        <svg aria-hidden="true" class=" inline  w-6 h-6  self-center text-transparent animate-spin  fill-blue-500 " viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                        </svg>
                                }
                            </div>
                        </div>
                    </div>
                    <Otp verified={verified} setVerified={setverified} genertedOtp={otpValue} setOtpInput={setotpInput} text={email} className={`mt-5  ${!otpInput ? 'hidden' : null}`} />
                    <Button
                        type="button"
                        // disabled = {!(passwordCheck&&emailCheck)}
                        onClick={() => { setNext(true) }}
                        disabled={!verified}
                        className="w-full flex justify-center mt-8 duration-200 font-semibold text-lg  text-white bg-blue-500 disabled:bg-blue-300"
                    >
                        {
                            loader ?
                                <svg aria-hidden="true" class="inline w-7 h-7   text-transparent animate-spin fill-white " viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                </svg>
                                :
                                "Next"
                        }
                    </Button>
                    <p className=' hidden sm:block w-full text-center mt-10'>Already have an account? <Link to={"/login"} className='text-blue-500 font-semibold cursor-pointer'>Login</Link></p>

                    {/* <Button className='w-full mt-5 font-medium disabled:bg-green-300' onClick={()=>{setNext(true)}} disabled = {!verified}>Next</Button> */}
                </div>
            </div>



            <form action="" method="post" onSubmit={(e) => { create(e) }} className={`sm:border w-full flex-1 sm:mt-10 sm:mb-10 sm:w-fit p-10 ${next ? null : 'hidden'} `}>
                <div className=''>
                    <p className='text-2xl font-semibold text-gray-800 '>Let's setup your account</p>
                    <p className='text-sm text-gray-400'>Enter your details to create your account</p>
                </div>
                <p id='errorAccount' className='text-red-500 px-2 mt-1 w-fit rounded-sm text-sm bg-red-50 '>
                    {accountErrorMessage}
                </p>
                <p id='successAccount' className='text-green-500 px-2 mt-1 w-fit rounded-sm text-sm bg-green-50 '>
                    {successMessage}
                </p>
                <div className='flex flex-col sm:flex-row gap-5 w-full mt-10'>
                    <div className='flex flex-col '>
                        <label htmlFor="userName" className='font-medium ml-1'>Username</label>
                        <div id='usernameFull' className='flex  row border rounded-sm '>
                            <input
                                type="text"
                                id="userName"
                                onChange={(e) => { verifyUserName(e.target.value) }}
                                className="bg-white px-3 py-2 rounded-sm focus:bg-gray-50 duration-200 placeholder:text-gray-400 outline-none no-spin-buttons"
                                style={{
                                    "-webkit-autofill": "number",
                                    "-webkit-box-shadow": "0 0 0px 1000px white inset",
                                }}
                                placeholder="Enter your fullname"
                                // pattern="[a-zA-Z0-9_]+"

                                title="Username can only contain letters, numbers, and underscores"
                            />
                            <div className='flex  bg-transparent px-2 my-1 items-center justify-center w-14   '>
                                {
                                    usernameChecking || usernameChecked ?
                                        usernameChecked ?
                                            userNameAvailable ?
                                                <svg class="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                :
                                                <svg class="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>

                                            :
                                            <svg aria-hidden="true" class="inline w-6 h-6  text-transparent animate-spin  fill-blue-500 " viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                            </svg>
                                        :
                                        null

                                }
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col w-full'>
                        <label htmlFor="userPassword" className='font-medium ml-1'>Password</label>
                        <div id='userpasswordFull' className='flex  row border rounded-sm'>
                            <input
                                type={showPassword ? "text" : "password"} // Dynamically set the type attribute
                                id='userPassword'
                                className='bg-white px-3 py-2 flex-1 rounded-sm duration-200 placeholder:text-gray-400 outline-none no-spin-buttons'
                                placeholder='Create a password'
                            />
                            <div
                                className='flex cursor-pointer px-2 my-1 items-center justify-center w-14 border-l'
                                onClick={() => setshowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <svg
                                        class='h-6 w-6 text-gray-800'
                                        fill='none'
                                        viewBox='0 0 24 24'
                                        stroke='currentColor'
                                    >
                                        <path
                                            stroke-linecap='round'
                                            stroke-linejoin='round'
                                            stroke-width='2'
                                            d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                                        />
                                        <path
                                            stroke-linecap='round'
                                            stroke-linejoin='round'
                                            stroke-width='2'
                                            d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        class='h-6 w-6 text-gray-800'
                                        fill='none'
                                        viewBox='0 0 24 24'
                                        stroke='currentColor'
                                    >
                                        <path
                                            stroke-linecap='round'
                                            stroke-linejoin='round'
                                            stroke-width='2'
                                            d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21'
                                        />
                                    </svg>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex flex-col sm:flex-row gap-5  mt-5 w-full'>
                    <div className='flex flex-col  w-full'>
                        <label htmlFor="userBirthDate" className='font-medium ml-1'>Birthdate</label>
                        <input type="date" id='userBirthDate' className=' border bg-white  px-3 py-[7px] rounded-sm focus:bg-gray-50 duration-200 placeholder:text-gray-400  outline-none no-spin-buttons flex-1'
                            placeholder='Enter your contact number' />
                    </div>  
                        
                    <div className='w-full '>
                        <div className='flex flex-col  w-full'>
                            <label htmlFor="userType" className='font-medium ml-1'>Account type</label>
                            {/* <input type="number"  max={9999999999}   id='userContact' maxLength="10" className=' border bg-white  px-3 py-2 rounded-sm focus:bg-gray-50 duration-200 placeholder:text-gray-400  outline-none no-spin-buttons flex-1'
                                style={{
                                    "-webkit-autofill": "number",
                                    "-webkit-box-shadow": "0 0 0px 1000px white inset",
                                }}
                                placeholder='Enter your contact number' /> */}
                                <select id='userType' className=' border bg-white  px-3 py-2.5 rounded-sm focus:bg-gray-50 duration-200 placeholder:text-gray-400  outline-none no-spin-buttons flex-1'>
                                    <option>Candidate</option>
                                    <option>Employeer</option>
                                </select>
                        </div>
                       
                    </div>

                </div>
                {/* <div className='flex flex-col mt-5'>
                            <label htmlFor="userAddress" className='font-medium ml-1'>Address</label>
                            <div id='userAddressFull' className='flex border rounded-sm '>
                                <input type="text" id='userAddress' className=' bg-white flex-1  px-3 py-2 rounded-sm  duration-200 placeholder:text-gray-400  outline-none no-spin-buttons '
                                    style={{
                                        // "-webkit-autofill": "number",
                                        // "-webkit-box-shadow": "0 0 0px 1000px white inset", 
                                    }}
                                    placeholder='Enter your address' />
                                <div id='locationIcon' className='cursor-pointer flex px-2 my-1 items-center justify-center w-14  border-l'>
                                    <svg class="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div> */}


                <Button
                    type="submit"
                    className="w-full mt-8  flex items-center justify-center bg-blue-500 text-white disabled:bg-blue-400 font-semibold text-lg"
                >
                    {
                        loader ?
                            <svg aria-hidden="true" class="inline w-7 h-7    text-transparent animate-spin fill-white " viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                            </svg>
                            :
                            "Create"
                    }
                </Button>
            </form>
            <p className='py-5 border-t-2 sm:hidden w-full text-center'>Already have an account? <Link to={"/login"} className='text-blue-500 font-semibold cursor-pointer'>Login</Link></p>

        </div>
    )
}

export default Signup