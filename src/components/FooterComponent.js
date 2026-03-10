import React from 'react';
import pkg from '../../package.json';
const { version } = pkg;

function Footer() {
  return(
    <div className="footer mt-5">
    <div className="container">   
    <div className="row justify-content-center">             
    <div className="col-12 text-center" style={{color: 'white'}}>
      <p className="mb-4">
        <a href="https://buymeacoffee.com/cinetecalendar" target="_blank" rel="noopener noreferrer">
          <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
            alt="Buy Me A Coffee" style={{height: '40px', verticalAlign: 'middle'}} />
        </a>
      </p>
      <p className="mb-4">
        <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="license noopener noreferrer">
          <img alt="Creative Commons BY-NC-SA 4.0" style={{borderWidth: 0, verticalAlign: 'middle'}}
            src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" />
        </a>
        <span className="ms-2">2020–2026 Stefano Arteconi</span>
        <span className="ms-3" style={{opacity: 0.5, fontSize: '0.85rem'}}>v{version}</span>
      </p>
      <p className="mb-0" style={{fontSize: '0.8rem', opacity: 0.75}}>
        Dati degli spettacoli di proprietà delle rispettive sale cinematografiche.
        Fonti: <a href="https://cinetecadibologna.it" target="_blank" rel="noopener noreferrer" style={{color: '#f99e00'}}>Cineteca di Bologna</a>,{' '}
        <a href="https://circuitocinemabologna.it" target="_blank" rel="noopener noreferrer" style={{color: '#ffabad'}}>Circuito Cinema Bologna</a>,{' '}
        <a href="https://popupcinema.18tickets.it/" target="_blank" rel="noopener noreferrer" style={{color: '#9f1c24'}}>Pop Up Cinema</a>.
      </p>
    </div>
    </div>
    </div>
    </div>
    );
}

export default Footer;