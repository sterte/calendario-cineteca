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
        right: '88px',
        bottom: '18px',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        cursor: 'pointer',
        color: 'white',
        zIndex: 1,
        display: visible ? 'flex' : 'none',
        alignItems: 'center',
        justifyContent: 'center'}}>
        <span className="fa fa-arrow-up" style={{fontSize: '1.5rem'}} />
    </Button>
  );
}
  
export default ScrollToTopButton;