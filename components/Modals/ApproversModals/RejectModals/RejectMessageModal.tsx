/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useFetchWithAccessToken } from '@/functions/useFetchWithAccessToken';
import { BackendApiUrl } from '@/functions/BackendApiUrl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string | string[] | undefined;
  bookingName: string | undefined;
  roomName: string | undefined;
}

interface RejectMessage {
  rejectMessage: string;
  createdBy: string;
  createdAt: string;
  minioUrl: string;
}

const RejectMessageModal: React.FC<ModalProps> = ({ isOpen, onClose, bookingId, roomName, bookingName }) => {
  const { fetchGET } = useFetchWithAccessToken();
  const [rejectMessage, setRejectMessage] = useState<RejectMessage | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const fetchRejectMessage = async (bookingId: string | string[] | undefined) => {
    if (!bookingId) return;
    setLoading(true);
    try {
      const response = await fetchGET<RejectMessage>(`${BackendApiUrl.getRejectMessage}?BookingId=${bookingId}`);
      setRejectMessage(response.data);
    } catch (error) {
      console.error('Failed to fetch reject message:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && bookingId) {
      fetchRejectMessage(bookingId);
    }
  }, [isOpen, bookingId]);

  return (
    <div className={`fixed inset-0 flex flex-col justify-center items-center bg-black bg-opacity-10 z-50 ${isOpen ? '' : 'hidden'}`}>
        <div className='bg-purple-950 p-4 absolute top-11 rounded-full border-white border-4'>
            <img src="/Assets/images/person-sad.png" alt="" className='w-[200px] rounded-full'/>

        </div>
        <div className="bg-white p-4 rounded-lg w-2/5 h-3/5">
            <div className=' h-full flex flex-col justify-between'>
                <div className='grid grid-row-2 gap-0 max-h-[200px]'>

                        <div className='h-[100px]'>
                            <div className='flex justify-end'>

                            <button className='bg-gray-200 w-10 h-10 rounded-full' onClick={onClose}>
                                <FontAwesomeIcon icon={faX}/>
                            </button>
                            </div>
                        </div>
                        <div className='flex justify-center items-center h-[100px]'>
                            <p className='text-2xl font-bold'>Oh no, your booking was rejected...</p>
                        </div>
                </div>
                <div className='bg-gray-200 p-4 border-2 h-full border-gray-400 rounded-lg '>
                    {loading ? (
                        <p>loading...</p>
                    ) : rejectMessage ? (
                        <div className='h-full flex flex-col'>
                            <div className='mb-4'>
                                <p className='font-bold text-xl'>{roomName} - {bookingName}</p>
                            </div>
                            <div className='flex-grow flex flex-col justify-between'>
                                <div className='flex'>
                                    <div className='w-1/5'>
                                        <img src={rejectMessage.minioUrl} alt="" className='w-11 h-11 rounded-full' />
                                    </div>
                                    <div className='w-4/5 flex items-center'>
                                        <p>&quot;{rejectMessage.rejectMessage}&quot;</p>
                                    </div>
                                </div>
                                <div className='text-gray-400'>
                                    <p>Rejected by {rejectMessage.createdBy} at {rejectMessage.createdAt}</p>
                                </div>
                            </div>
                        </div>             
                        ) : ( 
                            <p>{bookingName}</p>
                        )}
                    </div>
                </div>
            </div>
            </div>
    );
};

export default RejectMessageModal;
