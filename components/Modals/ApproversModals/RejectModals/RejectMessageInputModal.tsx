import { faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

interface RejectModalProps {
  isOpen: boolean;
  onReject: () => void;
  onClose: () => void;
  rejectMessage: string;
  onRejectMessageChange: (value: string) => void;
}

const RejectModal: React.FC<RejectModalProps> = ({ isOpen, onReject, onClose, rejectMessage, onRejectMessageChange }) => {
  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 flex flex-col justify-center items-center bg-black bg-opacity-40 z-50 ${isOpen ? '' : 'hidden'}`}>
      <div className='bg-purple-950 p-4 absolute top-11 rounded-full border-white border-4'>
        <img src="/Assets/images/person-writing.png" alt="" className='w-[200px] rounded-full' />
      </div>
      <div className="bg-white p-4 rounded-lg w-2/5 h-3/5">
        <div className=' h-full flex flex-col justify-between'>
          <div className='grid grid-row-2 gap-0 max-h-[200px]'>
            <div className='h-[100px]'>
              <div className='flex justify-end'>
                <button className='bg-gray-200 w-10 h-10 rounded-full' onClick={onClose}>
                  <FontAwesomeIcon icon={faX} />
                </button>
              </div>
            </div>
            <div className='flex justify-center items-center h-[100px]'>
              <p className='text-2xl font-bold'>Input Reject Message</p>
            </div>
          </div>
          <div className='h-full flex flex-col'>
            <textarea
              value={rejectMessage}
              onChange={(e) => onRejectMessageChange(e.target.value)}
              placeholder="Type your rejection message here..."
              className='h-[150px] rounded-lg border p-2'
            />
          </div>
          <div className='gap-4 flex justify-end'>
            <button className='bg-purple-950 text-white font-semibold w-[100px] py-1 text-lg rounded-full' onClick={onReject}>Submit</button>
            <button className='bg-red-600 text-white font-semibold w-[100px] py-1 text-lg rounded-full' onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RejectModal;
