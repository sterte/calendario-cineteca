import React from 'react';

export const Loading = () => {
	return(		
		<div className="row d-flex justify-content-center">
		<div className='d-flex align-items-center col-2 col-md-1 order-2 order-md-1'>
		<span className="fa fa-spinner fa-pulse fa-3x fa-fw" />
		</div>
		</div>
		);
}

export default Loading;