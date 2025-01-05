// components/modals/RejectBookingConfirmationModal.tsx
import React from 'react';

interface RejectBookingConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const RejectBookingConfirmationModal: React.FC<RejectBookingConfirmationModalProps> = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 flex flex-col justify-center items-center bg-black bg-opacity-50 z-auto ${isOpen? '' : 'hidden'}`}>
      <div className='bg-purple-950 p-4 absolute top-32 rounded-full border-white border-4'>
        <img src="/Assets/images/are-you-sure.png" alt="" className='w-[200px] rounded-full'/>
      </div>
      <div className="bg-white p-4 rounded-lg w-2/5 h-2/5">
        <div className='h-full'>
          <div className='h-2/3 flex flex-col justify-end'>
            <div className='flex flex-col items-center'>
              <h1 className='text-2xl font-bold'>Reject Booking ?</h1>
              <h4 className='text-center'>Make sure to check the booking details carefully :)</h4>
            </div>
          </div>
          <div className='h-1/3 flex items-center justify-center'>
            <div className='flex gap-4'>
              <button className='bg-purple-950 h-[50px] w-[150px] rounded-full text-white text-lg font-semibold' onClick={onConfirm}>Reject</button>
              <button className='bg-gray-200 h-[50px] w-[150px] rounded-full text-black text-lg font-semibold' onClick={onCancel}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RejectBookingConfirmationModal;
