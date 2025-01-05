import React, { useEffect, useState } from 'react';
import { WithDefaultLayout } from '../../components/DefautLayout';
import { Page } from '../../types/Page';
import { useSwrFetcherWithAccessToken } from '@/functions/useSwrFetcherWithAccessToken';
import useSWR from 'swr';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import { BackendApiUrl } from '@/functions/BackendApiUrl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQrcode } from '@fortawesome/free-solid-svg-icons';
import { useFetchWithAccessToken } from '@/functions/useFetchWithAccessToken';
import RejectMessageModal from '@/components/Modals/ApproversModals/RejectModals/RejectMessageModal';
import CancelConfirmationModal from '@/components/Modals/BookingsModals/CancelConfirmationModal';
import CancelSuccessModal from '@/components/Modals/BookingsModals/CancelSuccessModal';
import QRModal from '@/components/Modals/BookingsModals/QRTicketModal';

interface UserBookingList {
    bookingId: string;
    bookingDescription: string;
    roomId: number;
    roomName: string;
    roomMinioUrl: string;
    qrMinioUrl: string;
    checkInPlace: string;
    approvalHistories: ApprovalUser[];
    sessionBookingList: SessionList[];
}

interface ApprovalUser {
    approvalUserId: string;
    approvalName: string;
    approvalMinioUrl: string;
    approvalStatusId: number;
    approvalStatus: string;
    approvedAt: string;
}

interface SessionList {
    sessionId: number;
    sessionName: string;
}

interface UserViewResponse {
    userBookings: UserBookingList[];
    totalData: number;
}


const Ongoing: Page = () => {
    const swrFetcher = useSwrFetcherWithAccessToken();
    const { data: session } = useSession();
    const user = session?.user as User;
    const roleName = user?.role?.[0];
    const userId = user?.id;
    const [isCanceled, setIsCanceled] = useState(false);
    const [idToModal, setIdToModal] = useState<string>('');
    const [idToModalQr, setIdToModalQr] = useState<string>('');
    const [qrUrlToModal, setQrUrlToModal] = useState<string>('');
    const [checkInPlaceToModal,  setCheckInPlaceToModal] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [idToCancel, setIdToCancel] = useState<string>('');
    const [bookingDesc, setBookingDesc] = useState<string>('');
    const [isCancelSuccesModalOpen, setIsCancelSuccessModalOpen] = useState(false);
    const [isQrOpen, setIsQrOpen] = useState(false)
    const [isCancelSucces, setIsCancelSuccess] = useState(false);
    const [filteredBookings, setFilteredBookings] = useState<UserBookingList[]>([]);
    const { data: userView } = useSWR<UserViewResponse>(`${BackendApiUrl.getUserBookingView}?UserId=${userId}&RoleName=${roleName}&IsCanceled=${isCanceled}`, swrFetcher);
    const { fetchPOST } = useFetchWithAccessToken();

    useEffect(() => {
        if (userView?.userBookings) {
            const filtered = userView.userBookings.filter(booking => 
                isCanceled ? booking.approvalHistories.some(approval => approval.approvalStatusId === 4) : 
                !booking.approvalHistories.some(approval => approval.approvalStatusId === 4)
            );
            setFilteredBookings(filtered);
        }
    }, [isCanceled, userView]);

    if (!userView) {
        return <div>Loading...</div>;
    }

    const handleCancel = async () => {
        const payload = {
            bookingId: idToCancel
        }
        try{
            const response = await fetchPOST(BackendApiUrl.cancelBooking, payload)
            if(response){
                setIsCancelSuccess(true)
            }
        }
        catch(error){
            setIsCancelSuccess(false)
        }
    }
    const handleMenuChange = (isCanceled) => { // Function to handle menu selection
        setIsCanceled(isCanceled);
    };
    const handleOpenModal = (bookingId: string, bookingDesc: string) => {
        setBookingDesc(bookingDesc)
        setIsModalOpen(true);
        setIdToModal(bookingId)
      };
      const handleModalConfirm = () => {
          handleCancel(); // Call the handleSubmit function to post the data
          setIsCancelModalOpen(false); // Close the modal after confirming
          setIsCancelSuccessModalOpen(true)
        };
        const handleCancelSuccessModal = () => {
            setIsCancelSuccessModalOpen(false);
            handleMenuChange(true)
        }

    
      const handleCloseModal = () => {
        setIsModalOpen(false);
      };
      const handleModalCancel = () => {
        setIsCancelModalOpen(false);
      };
      const handleOpenQrModal = (bookingId: string, qrUrl: string, checkInPlace: string) => {
        setIsQrOpen(true);
        setIdToModalQr(bookingId);
        setQrUrlToModal(qrUrl);
        setCheckInPlaceToModal(checkInPlace);
      };

      const handleCloseQrModal = () => {
        setIsQrOpen(false);
      }

      console.log(idToCancel)

    return (
        <div className="mt-3 h-[650px]">
            <img src="/Assets/images/Ongoing.png" alt="Ongoing" width={410} height={40} className="mt-16" />
            <div className="flex mt-4 mb-6">
                    {/* Container for menu buttons */}
                    <button
                        className={`rounded-md text-white text-xl ${!isCanceled ? 'underline' : ''} ${!isCanceled ? 'underline-offset-8' : ''}`}
                        onClick={() => handleMenuChange(false)}
                    >
                        Ongoing
                    </button>
                    <button
                        className={`rounded-md ml-8 text-white text-xl ${isCanceled? 'underline' : ''} ${isCanceled ? 'underline-offset-8' : ''}`}
                        onClick={() => handleMenuChange(true)}
                    >
                        Canceled
                    </button>
                </div>
            <div className="mt-8 grid grid-cols-3 gap-5 overflow-y-auto h-[540px]">
                {filteredBookings?.length > 0 ? (
                    filteredBookings.map((booking) => {
                        const latestApproval = booking.approvalHistories[booking.approvalHistories.length - 1];
                        const qrButtonBg = latestApproval?.approvalStatusId === 2
                            ? 'bg-purple-950 text-gray-400 border-yellow-400'
                            : 'bg-gray-100 text-gray-400 border-gray-400';
                        const qrButtonText = latestApproval?.approvalStatusId === 2
                        ? 'text-yellow-400'
                        : 'text-gray-400';
                        const qrDisabled = latestApproval?.approvalStatusId === 2 ? false: true
                        const isRejected = latestApproval?.approvalStatusId === 3;
                        const isCanceled= latestApproval?.approvalStatusId === 4; // Assuming 3 represents "rejected"
                        return (
                            <div key={booking.bookingId}className="bg-white p-4 rounded-lg flex flex-col justify-between h-[510px] overflow-y-auto">
                                <div className="">
                                    <div className="">
                                        <div className="relative mb-4">
                                            <img
                                                src={booking.roomMinioUrl}
                                                alt=""
                                                className="rounded-lg w-full h-48 object-cover"
                                            />
                                        </div>
                                        <div className="flex justify-between">
                                        <h1 className="text-2xl font-semibold max-w-[170px] break-words overflow-hidden">
                                            {booking.bookingDescription}
                                            </h1>
                                            {isRejected ? (
                                                <button
                                                    className="bg-yellow-500 min-w-[120px] min-h-[35px] max-h-[35px] rounded-full text-white"
                                                    onClick={()=>handleOpenModal(booking.bookingId, booking.bookingDescription)}
                                                >
                                                    Reject Message
                                                </button>
                                            ) : ( 
                                                <button
                                                    className={isCanceled ? "bg-gray-200 min-w-[100px] min-h-[35px] max-h-[35px] rounded-full text-gray-400" : "bg-red-600 min-w-[100px] min-h-[35px] max-h-[35px] rounded-full text-white"}
                                                    onClick={() => {
                                                        setIsCancelModalOpen(true);
                                                        setIdToCancel(booking.bookingId);
                                                      }}
                                                      disabled={
                                                        isCanceled ? true : false
                                                      }
                                                >
                                                    Cancel
                                                </button>
                                            )}                                 
                                            </div>
                                        <div className=''>
                                            <h3 className="text-base">{booking.roomName}</h3>
                                        </div>
                                        <div className='grid grid-cols-2 gap-2 mb-2'> 
                                            {booking.sessionBookingList.map((sessions) => (
                                                <div key={sessions.sessionId} className={`rounded-full flex justify-center py-1 ${sessions.sessionId == 1 ? 'bg-red-800' 
                                                    : sessions.sessionId == 2 ? 'bg-orange-800' 
                                                    : sessions.sessionId == 3 ? 'bg-yellow-600' 
                                                    : sessions.sessionId == 4 ? 'bg-emerald-800' 
                                                    : sessions.sessionId == 5 ? 'bg-blue-900' 
                                                    : sessions.sessionId == 6 && 'bg-pink-700'} `}>
                                                    <p className='text-xs text-white'>{sessions.sessionName}</p>
                                                </div>
                                            ))}
                                        </div>
                                        {booking.approvalHistories.map((approval) => (
                                            <div key={approval.approvalUserId} className="relative flex items-center gap-2 group">
                                                <img
                                                    src={approval.approvalMinioUrl}
                                                    alt=""
                                                    className={`rounded-full w-8 h-8 my-1 border-2 ${
                                                    approval.approvalStatusId === 1
                                                        ? 'border-yellow-600'
                                                        : approval.approvalStatusId === 2
                                                        ? 'border-green-600'
                                                        : 'border-red-600'
                                                    }`}
                                                />
                                                <p>{approval.approvalName}</p>
                                                <div className="absolute left-0 bottom-12 hidden group-hover:block bg-gray-800 text-white text-sm p-2 rounded-md shadow-lg">
                                                    <p>Status: {approval.approvalStatus}</p>
                                                    <p>{approval.approvalStatusId === 4 ? "Cancelled at :" : approval.approvalStatusId === 3 ? "Rejected at:" : "Approved at:"} {approval.approvedAt === '0001-01-01T00:00:00' ? 'N/A' : approval.approvedAt}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="mt-auto flex justify-end">
                                    <button className={`px-1 py-0.5 rounded-md border-2 ${qrButtonBg}`} disabled={qrDisabled} onClick={()=>handleOpenQrModal(booking.bookingId, booking.qrMinioUrl, booking.checkInPlace)}>
                                        <FontAwesomeIcon icon={faQrcode} className={`inline text-4xl ${qrButtonText}`} />
                                    </button>
                                    <QRModal
                                    isOpen={isQrOpen}
                                    onClose={handleCloseQrModal}
                                    qrUrl={qrUrlToModal}
                                    bookingId={idToModalQr}
                                    checkInPlace={checkInPlaceToModal}
                                    />     
                                </div>
                                <RejectMessageModal
                                    isOpen={isModalOpen}
                                    onClose={handleCloseModal}
                                    bookingId={idToModal}
                                    bookingName={bookingDesc}
                                    roomName={booking.roomName}
                                    />   
                                    <CancelConfirmationModal
                                    visible={isCancelModalOpen}
                                    onConfirm={handleModalConfirm}
                                    onCancel={handleModalCancel}
                                    /> 
                                    <CancelSuccessModal
                                    visible={isCancelSuccesModalOpen}
                                    onConfirm={handleCancelSuccessModal}
                                    isSuccess={isCancelSucces}
                                    />    
                            </div>
                        );
                    })) : (
                    <div className='flex absolute items-center'>
                        <p className='text-white text-3xl font-bold mr-3'>:)</p>
                        <p className='text-white text-2xl font-normal'>
                            {isCanceled
                                ? 'Yay... No canceled bookings yet. Your cancelled bookings will show up here.'
                                : 'Oops... No ongoing bookings. Book now by clicking on the Dashboard.'}
                        </p>            
                    </div>
                )}
            </div>
        </div>
    );
};

Ongoing.layout = WithDefaultLayout;
export default Ongoing;
