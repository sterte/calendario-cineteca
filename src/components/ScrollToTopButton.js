import React, { useState } from 'react';
import { Button } from 'reactstrap';
  
const ScrollToTopButton = () =>{
  
  const [visible, setVisible] = useState(false)
  
  const toggleVisible = () => {
    const scrolled = document.documentElement.scrollTop;
    if (scrolled > 1000){
      setVisible(true)
    } 
    else if (scrolled <= 1000){
      setVisible(false)
    }
  };
  
  const scrollToTop = () =>{
    window.scrollTo({
      top: 0, 
      behavior: 'smooth'
      /* you can also use 'auto' behaviour
         in place of 'smooth' */
    });
  };
  
  window.addEventListener('scroll', toggleVisible);
  
  return (
    <Button className='navigation-button' onClick={scrollToTop} 
     style={{position: 'fixed',         
        left: '75%',
        bottom: '40px',             
        cursor: 'pointer',
        color: 'white',
        zIndex : 1,
        display: visible ? 'inline' : 'none'}}>
        <span className="fa fa-arrow-up" />
    </Button>    
  );
}
  
export default ScrollToTopButton;