import React from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const variants = {
  initial: { opacity: 0, scale: 0.95 },
  enter: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 1.05 },
};

function PageTransition({ children }) {
  const location = useLocation();
  const controls = useAnimation();

  React.useEffect(() => {
    controls.start('enter');
  }, [location.pathname]);

  return (
    <motion.div
      key={location.pathname}
      initial="initial"
      animate={controls}
      exit="exit"
      variants={variants}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

export default PageTransition;
