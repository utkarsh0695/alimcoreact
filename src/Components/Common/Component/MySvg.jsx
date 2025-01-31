import React from 'react';

const MySvg = ({ IconComponent, ...res }) => {
  return IconComponent ? <IconComponent {...res} /> : null;
};

export default MySvg;
