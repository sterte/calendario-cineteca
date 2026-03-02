import React from 'react';

export const Loading = (props) => {
  const size = props.size || 5;
  const classes = 'fa fa-spinner fa-spin fa-' + size + 'x fa-fw';
  return (
    <div className="row d-flex justify-content-center">
      <div className='d-flex align-items-center col-2 col-md-1 order-2 order-md-1'>
        <span className={classes} style={{color: '#ffffff80'}} />
      </div>
    </div>
  );
};

export default Loading;
