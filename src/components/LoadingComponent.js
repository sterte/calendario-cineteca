import React from 'react';

export const Loading = (props) => {
	var size = props.size || 5;
	var classes = 'fa fa-spinner fa-pulse fa-' + size + 'x fa-fw'
	return(		
		<div className="row d-flex justify-content-center">
		<div className='d-flex align-items-center col-2 col-md-1 order-2 order-md-1'>
		<span className={classes} style={{color: '#ffffff80'}} />
		</div>
		</div>
		);
}

export default Loading;