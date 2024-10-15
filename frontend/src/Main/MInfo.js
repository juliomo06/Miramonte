import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { FaTimes } from 'react-icons/fa';

export default function MInfo({ onClose }) {
  const modalRef = useRef();
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return createPortal(
    <div className='fixed inset-0 flex items-center justify-center backdrop-brightness-50'>
      <div ref={modalRef} className='bg-white rounded-lg w-11/12 md:w-2/6'>
        <button className="w-full border-b p-4 md:p-8" type='button' onClick={onClose}>
          <FaTimes className='text-lg md:text-2xl' />
        </button>
        <div className='mt-2 p-4 md:p-8'>
          <h1 className='text-xl md:text-2xl font-semibold'>Pay part now, part later</h1>
          <p className='text-base md:text-lg'>You can pay for part of this reservation now, and the rest later. No additional fees.</p>
          <div className='mt-4'>
            <h2 className='text-base md:text-lg font-semibold'>Pay part of the total now</h2>
            <p className='text-base md:text-lg'>Confirm your reservation by paying a portion of the total amount.</p>
          </div>
          <div className='mt-4'>
            <h2 className='text-base md:text-lg font-semibold'>Pay the rest before check-in</h2>
            <p className='text-base md:text-lg'>Your original payment method will be charged on the second payment date.</p>
          </div>
          <div className='mt-4'>
            <h2 className='text-base md:text-lg font-semibold'>Payment is automatic</h2>
            <p className='text-base md:text-lg'>You don’t have to worry, we’ll send a reminder 3 days before the next payment.</p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
