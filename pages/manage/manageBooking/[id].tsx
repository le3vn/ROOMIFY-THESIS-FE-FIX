import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useSwrFetcherWithAccessToken } from '@/functions/useSwrFetcherWithAccessToken';
import { Page } from '@/types/Page';
import { BackendApiUrl } from '@/functions/BackendApiUrl';
import useSWR from 'swr';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faDownload, faEye } from '@fortawesome/free-solid-svg-icons';
import dayjs from 'dayjs'; // Import dayjs
import PreviewModal from '@/components/Modals/ApproversModals/ApproveModals/PreviewModal';
import { useFetchWithAccessToken } from '@/functions/useFetchWithAccessToken';
import { WithDefaultLayout } from '@/components/DefautLayout';
import UpdateModal from '@/components/Modals/ManageModals/ManageBookingModals/UpdateBookingConfirm';
import UpdateSuccessModal from '@/components/Modals/ManageModals/ManageBookingModals/UpdateSuccessModal';

interface SessionBooked {
    sessionId: number;
    sessionName: string;
    startTime: string;
    endTime: string;
}

interface ApproverHistory {
    approverUserId: string;
    approverUserName: string;
    statusId: number;
    statusName: string;
    approverMinioUrl: string;
    approvedAt: string;
}

interface EquipmentList{
    equipmentId: number;
    equipmentName: string;
}

interface BookingData {
    bookingId: string;
    bookingDescription: string;
    name: string;
    roomId: number;
    roomName: string;
    minioUrl: string;
    isCanceled: boolean;
    roomMinioUrl: string;
    bookingInstitutionalId: string;
    bookingOrganizationName: string;
    userRole: string;
    bookerMinioUrl: string;
    bookingDate: string;
    sessionList: SessionBooked[];
    approverHistory: ApproverHistory[];
    equipmentList: EquipmentList[];
}

interface BookingDetailView {
    totalData: number;
    bookingDetailModel: BookingData[];
}

interface RoomData {
    roomId: number;
    roomName: string;
}

interface RoomList{
    roomAvailables: RoomData[];
    totalData: number;
}

const BookingDetailPage: Page = () => {
    const router = useRouter();
    const { id } = router.query;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const swrFetcher = useSwrFetcherWithAccessToken();
    const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

    const { fetchPOST } = useFetchWithAccessToken();

    const { data: bookingDetail } = useSWR<BookingDetailView>(
        `${BackendApiUrl.getBookingDetail}?BookingId=${id}`,
        swrFetcher
    );

    const { data: roomAvailable } = useSWR<RoomList>(
        `${BackendApiUrl.getRoomAvailable}?id=${id}`,
        swrFetcher
    );

    

    console.log(roomAvailable)

    const handleApprove = async () => {
        const payload = {
          bookingId: booking?.bookingId,
          roomId: selectedRoomId
        };
    
        const response = await fetchPOST(BackendApiUrl.updateBooking, payload);
        if (response) {
          setIsApproveModalOpen(false);
          setIsSuccessModalOpen(true);
        }

      };

      const handleApproveSuccessModalClose = () => {
        setIsSuccessModalOpen(false)
        router.push('/manage')
      }
      



   // Set the selected room ID from booking data or default to the first available room
   const booking = bookingDetail?.bookingDetailModel[0];
   const [selectedRoomId, setSelectedRoomId] = useState(booking?.roomId || null);

   // Handle room selection change
   const handleRoomChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
       setSelectedRoomId(Number(event.target.value));
   };


    // Format the booking date
    const bookingDate = booking?.bookingDate ? dayjs(booking.bookingDate) : null;
    const day = bookingDate ? bookingDate.format('ddd') : 'N/A';
    const date = bookingDate ? bookingDate.format('DD') : 'N/A';
    const month = bookingDate ? bookingDate.format('MMM').toUpperCase() : 'N/A'; // Convert to uppercase for JAN
    const year = bookingDate ? bookingDate.format('YYYY') : 'N/A';

    const handleBackButton = () => {
        router.back();
    };
    const handlePreviewClick = (url: string) => {
        setPreviewUrl(url);
        setIsModalOpen(true);
    };

    const handleDownloadClick = (booking: BookingData) => {
        if (!booking) {
          console.error("Booking data is not available.");
          return;
        }
      
        // Construct the filename based on the booking role
        let filename = `EVIDENCE_${booking.bookingDescription}_${booking.bookingInstitutionalId}_${booking.name}`;
      
        // If the user role is Staff or StudentOrganization, append the booking organization name
        if (booking.userRole === 'Staff' || booking.userRole === 'StudentOrganization') {
          filename += `_${booking.bookingOrganizationName}`;
        }
      
        // Extract the file extension (assuming it's an image or file) from the URL
        const fileExtension = booking.minioUrl.split('.').pop();
        filename += `.${fileExtension}`;
      
        // Create an invisible link to trigger the download
        const link = document.createElement('a');
        link.href = booking.minioUrl;
        link.download = filename;
      
        // Trigger the click event to start the download
        link.click();
      };
      
      

    return (
        <div className='mt-4'>
            <button className="bg-white rounded-full w-10 h-10 flex items-center justify-center" onClick={handleBackButton}>
                <FontAwesomeIcon icon={faChevronLeft} className="inline" />
            </button>
            <div className='mt-8 flex h-[640px] gap-4'>
                <div className='w-1/6 h-full'>
                    <div className='flex flex-col h-full justify-between gap-4'>
                        <div className='bg-white rounded-lg h-[150px] p-4'>
                            <div className='text-center flex flex-col items-center h-full justify-center'>
                                <div className='h-full'>
                                    <p className='mb-6 text-sm'>Room Name</p>
                                    <div className='flex flex-col items-center'>
                                        <select
                                            value={selectedRoomId || ''}
                                            onChange={handleRoomChange}
                                            className="w-full p-2 border rounded-md"
                                        >
                                            <option value={booking?.roomId}>
                                                {booking?.roomName}
                                            </option>
                                            {roomAvailable?.roomAvailables?.map((room) => (
                                                <option key={room.roomId} value={room.roomId}>
                                                    {room.roomName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='bg-white rounded-lg h-[150px] p-4'>
                            <div className='h-full flex flex-col items-center justify-between'>
                                <p className='text-sm'>Submitted By</p>
                                <img src={booking?.bookerMinioUrl} alt="" className='w-8 h-8 rounded-full border-2 border-purple-950' />
                                {booking?.userRole === 'Staff' || booking?.userRole === 'StudentOrganization' ? 
                                    <div className='flex flex-col items-center'>
                                        <p className='text-sm font-semibold'>{booking?.bookingInstitutionalId}</p>
                                        <p className='text-sm'>{booking?.name}</p>
                                        <p className='text-sm truncate'>{booking?.bookingOrganizationName}</p>
                                    </div>
                                :
                                    <div>
                                        <p>{booking?.bookingInstitutionalId}</p>
                                        <p className='text-sm font-semibold truncate'>{booking?.name}</p>
                                    </div>
                                }
                            </div>
                        </div>
                        <div className='bg-white rounded-lg h-[150px] p-4'>
                            <div className='h-full'>
                                <div className='h-full'>
                                    <div className='bg-purple-950 h-2/5 rounded-t-xl p-1 border-2 border-purple-950'>
                                        <div className='flex flex-col items-center'>
                                            <p className='text-xs text-white'>{year}</p>
                                            <p className='text-base text-white'>{month}</p>
                                        </div>
                                    </div>
                                    <div className='h-3/5 rounded-b-xl flex flex-col justify-center p-1 border-2 border-purple-950'>
                                        <div className='flex flex-col items-center'>
                                            <p className={`${day == 'Sun' ? 'text-4xl text-red-600' : 'text-4xl text-black'}`}>{date}</p>
                                            <p className={`${day == 'Sun' ? 'text-base text-red-600' : 'text-base text-black'}`}>{day}</p>
                                        </div>
                                    </div>
                                </div> 
                                
                            </div>
                        </div>
                        <div className='bg-white rounded-lg h-[150px] p-4'>
                            <div className='text-center flex flex-col items-center h-full justify-center'>
                                    <div className='h-full'>
                                        <p className='mb-9 text-sm'>Evidence</p>
                                        <div className='flex items-center gap-4'>
                                        <button className={`w-8 h-8 rounded-full 
                                            ${booking?.userRole == 'Staff' || booking?.userRole == 'Student' || booking?.userRole == 'Lecturer' ? 
                                            'bg-gray-200 border-2 border-gray-400' : 
                                            'bg-purple-950'
                                            }`} onClick={() => handlePreviewClick(booking?.minioUrl || '')} disabled={booking?.userRole == 'Staff' || booking?.userRole == 'Student' || booking?.userRole== 'Lecturer' ? true : false}>
                                            <FontAwesomeIcon icon={faEye} className="inline text-white" />
                                        </button>
                                        <button
                                        className={`w-8 h-8 rounded-full 
                                            ${booking?.userRole == 'Staff' || booking?.userRole == 'Student' || booking?.userRole == 'Lecturer' ? 
                                            'bg-gray-200 border-2 border-gray-400' : 
                                            'bg-purple-950'
                                            }`}
                                        onClick={() => booking ? handleDownloadClick(booking) : null}
                                        disabled={booking?.userRole == 'Staff' || booking?.userRole == 'Student' || booking?.userRole == 'Lecturer'}
                                        >
                                        <FontAwesomeIcon icon={faDownload} className="inline text-white" />
                                        </button>

                                        </div>
                                    </div>
                                </div>
                            </div>
                    </div>
                    
                </div>
                <div className='flex flex-col gap-4 w-full'>
                    <div className='h-3/5 flex gap-4'>
                        <div className='w-2/5 flex flex-col gap-4'>
                            <div className='bg-white rounded-lg h-2/6 p-4'>
                                <div className=' h-full flex flex-col'>
                                    <p className='text-sm'>Event Name</p>
                                    <div className=' h-full flex flex-col justify-center'>
                                        <div className='flex'>
                                        <p>&quot;</p>
                                        <p className='text-lg font-semibold'>{booking?.bookingDescription}</p>
                                        <p>&quot;</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='bg-white rounded-lg h-4/6 p-4'>
                            <div className='h-full'>
                                <p className='text-sm mb-4'>Session Booked</p>
                                {booking?.sessionList?.length ? (
                                <div className="grid grid-cols-2 gap-2">
                                    {booking.sessionList.map((session) => {
                                    // Split session name and time
                                    const sessionParts = session.sessionName.match(/^(.*?)(\s*\(.*\))$/); // Regex to separate name and time
                                    const sessionTitle = sessionParts ? sessionParts[1]?.trim() : session.sessionName;
                                    const sessionTime = sessionParts ? sessionParts[2]?.trim() : '';

                                    return (
                                        <div key={session.sessionId} className={`flex ${session.sessionId == 1 ? 'bg-red-800 border-red-900' 
                                        : session.sessionId == 2 ? 'bg-orange-800 border-orange-900' 
                                        : session.sessionId == 3 ? 'bg-yellow-600 border-yellow-700' 
                                        : session.sessionId == 4 ? 'bg-emerald-800 border-emerald-900' 
                                        : session.sessionId == 5 ? 'bg-blue-900 border-blue-950' 
                                        : session.sessionId == 6 && 'bg-pink-700 border-pink-800'} flex-col items-center rounded-full py-1 border-4`}>
                                            <p className="text-sm text-white ">{sessionTitle}</p>
                                            <p className="text-sm text-white">{sessionTime}</p>
                                        </div>
                                    );
                                    })}
                                </div>
                                ) : (
                                <p>No sessions booked.</p>
                                )}

                            </div>
                            </div>
                        </div>
                        <div className='bg-white rounded-lg w-3/5 p-4'>
                            <div className='h-full'>
                                <img src={booking?.roomMinioUrl} alt="" className='h-full w-full object-cover rounded-lg'/>
                            </div>
                        </div>
                    </div>
                    <div className='flex h-2/5 w-full gap-4'>
                        <div className='w-3/5 grid grid-cols-2 gap-4'>
                            <div className='bg-white rounded-lg p-4'>
                                <div className='h-full flex flex-col'>
                                    <p className='text-sm'>Approval History</p>
                                    {booking?.sessionList?.length ? (
                                        <div className='flex flex-col mt-6 h-full justify-end'>

                                        <div className='flex flex-col gap-2 h-4/5'>                                        
                                            {booking?.approverHistory.map((approver) => (
                                                <div key={approver.approverUserId}>
                                                <div className='flex gap-2 items-center'>
                                                    <img src={approver.approverMinioUrl} alt="" className={`w-8 h-8 rounded-full border-2 ${approver.statusId == 1 ? 'border-yellow-600' : approver.statusId == 2 ? 'border-green-600' : 'border-red-600'}`}/>
                                                    <p>{approver.approverUserName}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                        </div>
                                ) : (
                                    <p>No Approval History.</p>
                                )}
                                </div>
                            </div>
                            <div className='bg-white rounded-lg p-4'>
                                <div className='flex flex-col h-full'>
                                    <p className='text-sm'>Technical Support</p>
                                    {booking?.equipmentList?.length ? (
                                        <div className='flex flex-col mt-6 h-full justify-end'>

                                        <div className='flex flex-col gap-4 h-4/5 items-center'>                                        
                                            {booking?.equipmentList.map((equipment) => (
                                                <div key={equipment.equipmentId}>
                                                    <div className='bg-blue-800 border-4 border-blue-900 w-[150px] flex items-center justify-center py-2 rounded-full'>
                                                        <p className='text-white'>{equipment.equipmentName}</p>
                                                    </div>
                                            </div>
                                        ))}
                                    </div>
                                        </div>
                                ) : (
                                    <p>No Equipment booked.</p>
                                )}
                                </div>
                            </div>
                        </div>
                        <div className='bg-white rounded-lg w-2/5 p-4'>
                        <div className='h-full flex flex-col'>
                            <p className='text-sm'>Actions</p>
                            <div className='flex flex-col h-full justify-center'>
                            <div  className='flex justify-center gap-4'>
                                <button className='bg-purple-950 w-[120px] py-2 rounded-full text-white font-semibold' onClick={() => setIsApproveModalOpen(true)}>Save Change</button>
                            </div>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Preview Modal */}
      <PreviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        minioUrl={previewUrl}
      />

      {/* Confirm Approve Modal */}
      <UpdateModal
        isOpen={isApproveModalOpen}
        onApprove={handleApprove}
        onClose={() => setIsApproveModalOpen(false)}
    />

                {/* Success Modal */}
    <UpdateSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={handleApproveSuccessModalClose}
    />
        </div>
    );
};

BookingDetailPage.layout = WithDefaultLayout;
export default BookingDetailPage;
