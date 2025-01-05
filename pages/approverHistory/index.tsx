import React, { useEffect, useState } from 'react';
import { WithDefaultLayout } from '../../components/DefautLayout';
import { Page } from '../../types/Page';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import { BackendApiUrl } from '@/functions/BackendApiUrl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faEye, faSearch } from '@fortawesome/free-solid-svg-icons';
import PreviewModal from '@/components/Modals/ApproversModals/ApproveModals/PreviewModal';
import { useRouter } from 'next/router';

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

interface BookingData {
    bookingId: string;
    bookingDescription: string;
    bookerName: string;
    roomId: number;
    roomName: string;
    evidenceMinioUrl: string;
    isCanceled: boolean;
    roomMinioUrl: string;
    bookingInstitutionalId: string;
    bookingOrganizationName: string;
    bookerUserRole: string;
    bookerMinioUrl: string;
    bookingDate: string;
    sessionList: SessionBooked[];
    approverHistory: ApproverHistory[];
}

interface BookingDetailView {
    totalData: number;
    approverHistoryViewModel: BookingData[];
}

const ApproverHistory: Page = () => {
    const router = useRouter();
    const { data: session } = useSession();
    const user = session?.user as User;
    const userId = user?.id;
    const [isApproved, setIsApproved] = useState(false);  // true = Approved, false = Rejected
    const [approvalHistory, setApprovalHistory] = useState<BookingDetailView | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [error, setError] = useState<string | null>(null);

    // Fetch data when `isApproved` changes
    useEffect(() => {
        const fetchApprovalHistory = async () => {
            try {
                const response = await fetch(`${BackendApiUrl.getApproverHistory}?UserId=${userId}&IsApproved=${isApproved}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch approval history');
                }
                const data: BookingDetailView = await response.json();
                setApprovalHistory(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            }
        };

        if (userId) {
            fetchApprovalHistory();
        }
    }, [isApproved, userId]); // Re-run when `isApproved` or `userId` changes

    const handleButtonClick = (approved: boolean) => {
        setIsApproved(approved); // Update the state to filter based on approval status
    };

    if (error) {
        return <div>Error loading data: {error}</div>;
    }

    const handlePreviewClick = (url: string) => {
        setPreviewUrl(url);
        setIsModalOpen(true);
    };

    const handleHistoryDetail = (bookingId) => {
        router.push(`/approverHistory/${bookingId}`);
    }

    const handleDownloadClick = (booking: BookingData) => {
        if (!booking) {
          console.error("Booking data is not available.");
          return;
        }
      
        // Construct the filename based on the booking role
        let filename = `EVIDENCE_${booking.bookingDescription}_${booking.bookingInstitutionalId}_${booking.bookerName}`;
      
        // If the user role is Staff or StudentOrganization, append the booking organization name
        if (booking.bookerUserRole === 'Staff' || booking.bookerUserRole === 'StudentOrganization') {
          filename += `_${booking.bookingOrganizationName}`;
        }
      
        // Extract the file extension (assuming it's an image or file) from the URL
        const fileExtension = booking.evidenceMinioUrl.split('.').pop();
        filename += `.${fileExtension}`;
      
        // Create an invisible link to trigger the download
        const link = document.createElement('a');
        link.href = booking.evidenceMinioUrl;
        link.download = filename;
      
        // Trigger the click event to start the download
        link.click();
      };

    return (
        <div className="mt-3 h-[650px]">
            <img
                src="/Assets/images/Approval-History.png"
                alt="Ongoing"
                width={410}
                height={40}
                className="mt-16"
            />
            <div className="flex mt-4 mb-6">
                    {/* Container for menu buttons */}
                    <button
                        className={`rounded-md text-white text-xl ${isApproved ? 'underline' : ''} ${isApproved ? 'underline-offset-8' : ''}`}
                        onClick={() => handleButtonClick(true)}
                    >
                        Approved
                    </button>
                    <button
                        className={`rounded-md ml-8 text-white text-xl ${!isApproved? 'underline' : ''} ${!isApproved ? 'underline-offset-8' : ''}`}
                        onClick={() => handleButtonClick(false)}
                    >
                        Rejected
                    </button>
                </div>

            <div className="mt-8 grid grid-cols-3 gap-5 overflow-y-auto h-[500px]">
                {/* Render booking data */}
                {approvalHistory?.approverHistoryViewModel?.map((booking, index) => (
                    <div
                        key={index}
                        className="bg-white p-4 rounded-lg h-[250px] overflow-y-auto"
                    >
                        <div className='flex flex-col h-full'>
                            <div className=''>
                                <p className='text-2xl font-semibold'>
                                    &quot;{booking.bookingDescription}&quot;
                                </p>
                            </div>
                            <div className=''>
                                <p className='text-lg'>
                                    {booking.roomName}
                                </p>
                            </div>
                            <div className='flex flex-col gap-1 mb-2'>
                                <p className='text-xs'> Submitted By :</p>
                                <div className='flex items-center gap-2'>
                                    <img src={booking.bookerMinioUrl} alt="" className='w-10 h-10 rounded-full border-2 border-purple-950'/>
                                    {booking?.bookerUserRole === 'Staff' || booking?.bookerUserRole === 'StudentOrganization' ? 
                                    <div className='flex flex-col'>
                                        <p className=''>{booking?.bookingInstitutionalId} - {booking?.bookerName}</p>
                                        <p className=''>{booking?.bookingOrganizationName}</p>
                                    </div>
                                    :
                                    <div>
                                        <p>{booking?.bookingInstitutionalId} - {booking?.bookerName}</p>
                                    </div>
                                }
                                </div>
                            </div>
                            <div className=''>
                                {booking.approverHistory.map((history) => (
                                   <div key={history.approverUserId} className='flex justify-center'>
                                        <p className={`${history.statusId == 2 ? 'text-green-600' : 'text-red-600'} text-2xl font-bold`}>
                                            {history.statusName}
                                        </p>
                                   </div>
                                ))}
                            </div>
                            <div className='h-full flex justify-center items-center gap-4'>
                                <button className={`w-10 h-10 rounded-full 
                                                ${booking?.bookerUserRole == 'Staff' || booking?.bookerUserRole == 'Student' || booking?.bookerUserRole == 'Lecturer' ? 
                                                'bg-gray-200 border-2 border-gray-400' : 
                                                'bg-purple-950'
                                                }`} disabled={booking?.bookerUserRole == 'Staff' || booking?.bookerUserRole == 'Student' || booking?.bookerUserRole== 'Lecturer' ? true : false}
                                                onClick={() => handlePreviewClick(booking?.evidenceMinioUrl || '')}>
                                    <FontAwesomeIcon icon={faEye} className="inline text-white" />
                                </button>
                                <button
                                        className={`w-10 h-10 rounded-full 
                                            ${booking?.bookerUserRole == 'Staff' || booking?.bookerUserRole == 'Student' || booking?.bookerUserRole == 'Lecturer' ? 
                                            'bg-gray-200 border-2 border-gray-400' : 
                                            'bg-purple-950'
                                            }`}
                                        onClick={() => booking ? handleDownloadClick(booking) : null}
                                        disabled={booking?.bookerUserRole == 'Staff' || booking?.bookerUserRole == 'Student' || booking?.bookerUserRole == 'Lecturer'}
                                        >
                                    <FontAwesomeIcon icon={faDownload} className="inline text-white" />
                                </button>
                                <button className='bg-purple-950 w-10 h-10 rounded-full' onClick={()=> handleHistoryDetail(booking.bookingId)}>
                                    <FontAwesomeIcon icon={faSearch} className="inline text-white" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {/* If no data */}
                {!approvalHistory?.approverHistoryViewModel?.length && (
                    <div className='flex absolute items-center'>
                        <p className='text-white text-3xl font-bold mr-3'>:)</p>
                        <p className='text-white text-2xl font-normal'>
                            No Approved bookings yet. Your approvals on bookings will show up here.
                        </p>            
                </div>
                )}
            </div>
            <PreviewModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                minioUrl={previewUrl}
            />
        </div>
    );
};

ApproverHistory.layout = WithDefaultLayout;
export default ApproverHistory;
