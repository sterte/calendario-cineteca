import React, { useState, useEffect } from 'react';
import { Button } from 'reactstrap';

const ScrollToTopButton = () => {

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisible = () => {
      setVisible(document.documentElement.scrollTop > 1000);
    };
    window.addEventListener('scroll', toggleVisible);
    return () => window.removeEventListener('scroll', toggleVisible);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Button className='navigation-button scroll-to-top-btn' onClick={scrollToTop}
     style={{
        position: 'fixed',
        right: '18px',
        bottom: '70px',
        width: '44px',
        height: '44px',
        borderRadius: '50%',
        cursor: 'pointer',
        color: 'white',
        zIndex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        transition: 'opacity 0.3s ease',
     }}>
      <span className="fa fa-arrow-up" style={{fontSize: '1.5rem'}} />
    </Button>
  );
};

export default ScrollToTopButton;
