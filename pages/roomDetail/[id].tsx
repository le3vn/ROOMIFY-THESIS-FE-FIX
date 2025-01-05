import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useSwrFetcherWithAccessToken } from '@/functions/useSwrFetcherWithAccessToken';
import { WithDefaultLayout } from '../../components/DefautLayout';
import { Page } from '@/types/Page';
import { BackendApiUrl } from '@/functions/BackendApiUrl';
import useSWR from 'swr';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import ScheduleModal from '@/components/Modals/BookingsModals/ScheduleModal';

export interface RoomDetail {
  roomId: number;
  name: string;
  description: string;
  minioUrl: string;
  capacity: number;
  roomType: string;
  // Add other properties as needed based on your backend API response
}

const RoomDetailPage: Page = () => {
  const router = useRouter();
  const { id } = router.query;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const swrFetcher = useSwrFetcherWithAccessToken();

  const { data: roomDetail, error } = useSWR<RoomDetail>(
    `${BackendApiUrl.getRoomDetail}?id=${id}`,
    swrFetcher
  );

  if (error) {
    return <div>Error fetching room details.</div>;
  }

  if (!roomDetail) {
    return <div>Loading room details...</div>;
  }

  const handleBackButton = () =>{
    router.back();
  }
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const handleBookClicked = (roomId) => {
    const selectedDate = router.query['date'];
    router.push(`/booking/${roomId}?date=${selectedDate}`)
};

  return (
      <div className='mt-4'>
        <button className="bg-white rounded-full w-10 h-10 flex items-center justify-center" onClick={()=> handleBackButton()}>
          <FontAwesomeIcon icon={faChevronLeft} className="inline" />
        </button>
        <div className='flex flex-col items-center'>
        <div className='mt-6 flex gap-4 h-[580px] w-full'>
          <div className='w-2/5 flex flex-col gap-4'>
            <div className='h-[150px]'>
              <div className='bg-white rounded-lg h-full flex items-center justify-center'>
                <p className='text-3xl font-bold'>{roomDetail.name}</p>
              </div>
            </div>
            <div className='h-[300px]'>
            <div className='bg-white rounded-lg h-full flex flex-col p-4'>
            <div>
              <p className='mb-3 text-lg font-semibold'>Description</p>
              <p className='text-lg'>{roomDetail.description}</p>
            </div>
          </div>
        </div>
        <div className='h-[130px]'>
          <div className='bg-white rounded-lg h-full flex flex-col justify-center items-center'>
            <div className='flex flex-col items-center'>
              <p className='mb-3 text-lg font-semibold'>Room Info</p>
                <button
                  className="rounded-full bg-purple-950 w-[65px] text-white px-4 py-1"
                  onClick={handleOpenModal}
                >
                  Info
                </button>
                <ScheduleModal
                  isOpen={isModalOpen}
                  onClose={handleCloseModal}
                  roomId={id} 
                  roomName={roomDetail.name}
                />
            </div>
          </div>
        </div>
      </div>
      <div className='w-3/5 flex flex-col gap-4'>
        <div className='h-[350px]'>
          <div className='bg-white h-full rounded-lg p-4'>
            <img src={roomDetail.minioUrl} alt="" className='w-full max-h-80 rounded-lg'/>
          </div>
        </div>
        <div className='h-[230px]'>
          <div className='grid grid-cols-2 gap-4 h-full'>
            <div className='bg-white rounded-lg flex flex-col justify-center items-center'>
              <div className='flex flex-col items-center'>
                <p className='mb-3 text-lg font-semibold'>Room Type</p>
                <p className='text-6xl font-extralight'>{roomDetail.roomType}</p>
              </div>
            </div>
            <div className='bg-white rounded-lg flex flex-col justify-center items-center'>
              <div className='flex flex-col items-center'>
                <p className='mb-3 text-lg font-semibold'>Capacity</p>
                <p className='text-6xl font-extralight'>{roomDetail.capacity}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className='mt-4'>
      <button className='bg-purple-950 py-3 px-14 text-xl font-bold text-white rounded-full' onClick={()=>handleBookClicked(id)}>Book</button> 
    </div>
    </div>
  </div>
  );
};

RoomDetailPage.layout = WithDefaultLayout;
export default RoomDetailPage;

