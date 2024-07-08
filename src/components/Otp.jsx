import React, { useEffect, useState } from 'react'

function Otp({text,setOtpInput,genertedOtp,className,setVerified,verified,...props}) {
  const [checking, setChecking] = useState(false);
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [inputValue, setinputValue] = useState("");
  useEffect(()=>{
    if (!verified) {
      setChecked(false)
      setCorrect(false)
      document.getElementById("otpInput").value = ""
    }
  },[verified])
  const checkOtp = (otp)=>{
    if (otp.length <= 6) {
      setinputValue(otp)
    }
    if(inputValue.length == 6){
      setChecking(true)
      setChecked(false)
      if(document.getElementById("otpInput").value == genertedOtp)
      {
        setTimeout(() => {
          setChecking(false)
          setChecked(true)
          setCorrect(true)
          setVerified(true)
          setOtpInput(false)
        }, 2000);
      }
      else{
        setChecking(false)
        setChecked(true)
        setCorrect(false)
      }
    }
    else{

      setChecking(false)
    }
  }
  return (
    <div className={`${className}`} {...props}>
      <div className={`flex flex-col w-full ${className}`}>
          <label htmlFor="email" className='font-semibold ml-1 mb-2 flex flex-row'>
            <p className='text-gray-800 font-normal '>{text}</p>
            <svg  onClick={()=>{setOtpInput(false)}} width="20"  className=' ml-1 cursor-pointer stroke-current hover:stroke-blue-500' height="18"  viewBox="0 0 24 24"  xmlns="http://www.w3.org/2000/svg"  fill="none"    stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round">  <path d="M12 20h9" />  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
          </label>
          <div className='flex flex-row flex-wrap border rounded-sm '>
            <input type="number" value={inputValue} id='otpInput' className=' bg-white  flex-grow w-10  px-3 py-3 rounded-sm focus:bg-gray-50 duration-200 placeholder:text-gray-400  outline-none no-spin-buttons flex-1' 
              style={{ 
                "-webkit-autofill": "text",
                "-webkit-box-shadow": "0 0 0px 1000px white inset", 
              }}  
              onChange={(e)=>{checkOtp(e.target.value)}}
              placeholder='Enter otp sent to you' />
              <div className='flex items-center justify-center  px-2 my-1 '>
              {
                checking||checked?
                    checked?
                      correct?
                      <svg class="h-8 w-8 text-green-500"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      :
                      <svg class="h-8 w-8 text-red-500"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>

                    :
                    <svg aria-hidden="true" class="inline w-6 h-6  text-transparent animate-spin  fill-blue-500 " viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                    </svg>
                :
                null            
                
                }
              </div>
                  
            </div>
      </div>
    </div>
    
  )
}

export default Otp