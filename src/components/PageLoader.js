import React from 'react';
import { HonestAILoader } from 'honest-ai-loader';

const PageLoader = () => (
  <div className='container'>
    <HonestAILoader showText={false} styleOptions={{ size: 180, strokeWidth: 20, primaryColor: '#555555', secondaryColor: 'rgba(255,255,255,0)' }} />
  </div>
);

export default PageLoader;
