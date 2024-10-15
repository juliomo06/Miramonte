import React from 'react';
import MHeader from './MHeader';
import MFooter from './MFooter';
import { Outlet } from 'react-router-dom';

const MRoot = () => {
  return (
    <div className='flex flex-col '>
       
      <MHeader/>
      <Outlet/>
      <MFooter/>
     
    </div>
  )
}

export default MRoot
