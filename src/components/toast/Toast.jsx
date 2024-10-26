import React, { useState, useEffect } from "react";
import "../../css/button.css";

function Toast({ message,setShowToast,className, duration = 3000, show }) {
  const [visible, setVisible] = useState(false);
  console.log(show);
  
  useEffect(() => {
    if (show) {
      setVisible(true); // Show toast when show prop is true
      const timer = setTimeout(() => {
        setVisible(false); // Hide toast after the duration
      }, duration);

      return () => clearTimeout(timer); // Cleanup timer on unmount
    } else {
      setVisible(false); // Hide toast if show prop is false
      setTimeout(() => {
        console.log("hello");
        
        setShowToast(false)
      }, 2000);
    }
  }, [show, duration]);

  return (
    <div className={`fixed bottom-4 right-4 left-4 z-50 w-[92%] text-center ${className}`}>
      {show && (
        <p
          className={`bg-black opacity-85 text-white font-medium rounded-xl px-6 py-2.5 shadow-lg border transition-all duration-300
            ${visible ? "animate-popup" : "animate-popdown"}`}
        >
          {message}
        </p>
      )}
    </div>
  );
}

export default Toast;
