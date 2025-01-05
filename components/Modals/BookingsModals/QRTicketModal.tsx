import { faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrUrl: string;
  bookingId: string;
  checkInPlace: string;
}

const QRModal: React.FC<ModalProps> = ({ isOpen, onClose, qrUrl, bookingId, checkInPlace }) => {

  return (
    <div
      className={`fixed inset-0 flex flex-col justify-center items-center bg-black bg-opacity-30 z-50 ${
        isOpen ? '' : 'hidden'
      }`}
    >
      <div className="w-4/12 h-5/6 rounded-2xl flex flex-col">
        <div className="h-full flex flex-col divide-y-4 divide-dashed divide-gray-400">
          {/* Top Section */}
          <div className="bg-purple-950 h-1/3 rounded-t-3xl flex justify-between pt-4 pr-4">
            <div className='flex'>
                <div className='flex flex-col justify-end mr-8'>
                    <img src="/Assets/images/point-right.png" alt="" className='w-32 h-32' />
                </div>
                <div className='flex flex-col justify-around'>
                    <div className='text-white'>
                        <p className='text-2xl pb-2'>Your Booking&apos;s</p>
                        <p className='text-6xl pb-2'>QR Code</p>
                        <p className='text-2xl'>Here !</p>
                    </div>
                </div> 
            </div>
            <div>
                <button className='bg-gray-200 w-10 h-10 rounded-full' onClick={onClose}>
                    <FontAwesomeIcon icon={faX}/>
                </button>
            </div>
          </div>

          <div className="bg-white h-3/4 rounded-b-3xl">
            <div className='py-8 flex flex-col justify-center items-center'>
                <img src={qrUrl} alt="" className='w-40 h-40 mb-4 border-2 border-purple-950 rounded-lg'/>
                <p className='text-xs font-semibold'>{bookingId}</p>
            </div>
                <div className='px-14 py-6'>
                    <ol className='list-decimal list-inside'>
                        <li className='text-sm'>Before using the room, check in using this QR Code in <p className='font-bold text-purple-950'>{checkInPlace}</p></li>
                        <li className='text-sm'>Booking will be automatically cancelled after 1 (one) hour if the booking isn&apos;t checked in.</li>
                        <li className='text-sm'>Make sure to keep the room and establishment neat and tidy.</li>
                    </ol>
                </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default QRModal;
