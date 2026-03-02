import React from 'react';

function Footer(props) {
	return(
		<div className="footer mt-5">
		<div className="container">		
		<div className="row justify-content-center">             
		<div className="col-12 text-center" style={{color: 'white'}}>
			<p className="mb-1">
				<a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="license noopener noreferrer">
					<img alt="Creative Commons BY-NC-SA 4.0" style={{borderWidth: 0, verticalAlign: 'middle'}}
						src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" />
				</a>
				<span className="ml-2">2020–2026 Stefano Arteconi</span>
			</p>
			<p className="mb-0" style={{fontSize: '0.8rem', opacity: 0.75}}>
				Dati degli spettacoli di proprietà delle rispettive sale cinematografiche.
				Fonti: <a href="https://cinetecadibologna.it" target="_blank" rel="noopener noreferrer" style={{color: 'white'}}>Cineteca di Bologna</a>,{' '}
				<a href="https://circuitocinemabologna.it" target="_blank" rel="noopener noreferrer" style={{color: 'white'}}>Circuito Cinema Bologna</a>,{' '}
				<a href="https://popupcinema.it" target="_blank" rel="noopener noreferrer" style={{color: 'white'}}>Pop Up Cinema</a>.
			</p>
		</div>
		</div>
		</div>
		</div>
		);
}

export default Footer;