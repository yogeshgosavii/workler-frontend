import React, { useEffect, useRef } from 'react';

const FreezeScroll = ({ freezeScroll, className, children }) => {
  const scrollRef = useRef(null);
  const scrollPosition = useRef(0);

  useEffect(() => {
    if (freezeScroll) {
      // Save current scroll position and disable scroll
      scrollPosition.current = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPosition.current}px`;
    } else {
      // Restore scroll position and enable scroll
      document.body.style.position = '';
      document.body.style.top = '';
      window.scrollTo(0, scrollPosition.current);
    }

    return () => {
      // Cleanup to ensure scroll is restored
      document.body.style.position = '';
      document.body.style.top = '';
    };
  }, [freezeScroll]);

  return (
    <div className={className} ref={scrollRef}>
      {children}
    </div>
  );
};

export default FreezeScroll;
