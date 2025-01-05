import React, { useEffect } from 'react';
import useSWR from 'swr';
import { BackendApiUrl } from '@/functions/BackendApiUrl';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSwrFetcherWithAccessToken } from '@/functions/useSwrFetcherWithAccessToken';
import { useSession } from 'next-auth/react';
import { User } from 'next-auth';

interface SessionBooked{
    sessionId: number;
    sessionName: string;
    startTime: string;
    endTime: string;
}

interface ApproverHistory{
    approverUserId: string;
    approverUserName: string;
    statusId: number;
    statusName: string;
    approverMinioUrl: string;
    approvedAt: string;
}

interface ApproverView{
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
    sessionList: SessionBooked[];
    approverHistory: ApproverHistory[]
}

interface BookingApproverView{
    totalData: number;
    approverViewModel: ApproverView[];
}

const BookingCards = ({ search, building, room }) => {
  const searchParams = useSearchParams();
  const swrFetcher = useSwrFetcherWithAccessToken();
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user as User;

  console.log(user?.id)

  // Update the URL parameter when the parent `search` prop changes


  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
  
    if (search) {
      params.set('Search', search);
    } else {
      params.delete('Search');
    }
  
    if (building) {
      params.set('BuildingId', building);
    } else {
      params.delete('BuildingId');
    }
    if (room) {
        params.set('RoomId', building);
      } else {
        params.delete('RoomId');
      }
  
    // Update the URL with both search and sort parameters
    router.push(`?${params.toString()}`);
  }, [search, building, room, searchParams, router]); // Include both `search` and `sort` in the dependency array
  
  // Fetch data based on the updated `query`
  const { data: approverViews } = useSWR<BookingApproverView>(
    `${BackendApiUrl.getBookingTraffic}?Search=${search}${
      building ? `&BuildingId=${building}` : ''
    }${room ? `&RoomId=${room}` : ''}`,
    swrFetcher
  );
  


  return (
    <div className="grid grid-cols-3 gap-5 h-[530px] overflow-y-auto">
       {approverViews?.approverViewModel.map((books) => {
          const userRoles = books.userRole
          console.log(userRoles);
        return(
        <div key={books.bookingId} className='bg-white rounded-lg p-4 h-[510px] overflow-y-auto'>
            <div className="relative mb-4">
              <img
                  src={books.roomMinioUrl}
                  alt=""
                  className="rounded-lg w-full h-48 object-cover"
              />
          </div>
            <div className='flex justify-between'>
              <h1 className="text-2xl font-semibold max-w-[170px] break-words">{books.bookingDescription}</h1>
            </div>
            <div>
              <h3 className="text-base mb-1">{books.roomName}</h3>
            </div>
            <div className='mb-1'>
              <p className='text-xs mb-1'>Submitted by :</p>
            {userRoles == "Student" || userRoles == "Lecturer" ? 
              <div className='flex gap-2'>
                <img src={books.bookerMinioUrl} alt="" className='w-8 h-8 rounded-full border-2 border-purple-950'/>
                <p>{books.bookingInstitutionalId} - {books.name}</p>
              </div>
              : 
              <div className='flex gap-2 items-center'>
                <img src={books.bookerMinioUrl} alt="" className='w-8 h-8 rounded-full border-2 border-purple-950'/>
                <div>
                  <p>{books.bookingInstitutionalId} - {books.bookingOrganizationName}</p>
                  <p>{books.name}</p>
                </div>
            </div>
            }
            </div>
            <div>
              <p className='text-xs mb-1'>Approvals from :</p>
            </div>
          {books.approverHistory.map((approval) => (
            <div key={approval.approverUserId} className="relative flex items-center gap-2 group">
                <img
                    src={approval.approverMinioUrl}
                    alt=""
                    className={`rounded-full my-1 border-2 w-8 h-8 ${
                    approval.statusId === 1
                        ? 'border-yellow-600'
                        : approval.statusId === 2
                        ? 'border-green-600'
                        : 'border-red-600'
                    }`}
                />
                <p className=''>{approval.approverUserName}</p>
                <div className="absolute left-0 bottom-12 hidden group-hover:block bg-gray-800 text-white text-sm p-2 rounded-md shadow-lg">
                    <p>Status: {approval.statusName}</p>
                    <p>{approval.statusId === 4 ? "Cancelled at :" : approval.statusId === 3 ? "Rejected at:" : "Approved at:"} {approval.approvedAt === '0001-01-01T00:00:00' ? 'N/A' : approval.approvedAt}</p>
                </div>
            </div>
        ))}
        </div> 
      )})}
    </div>
  );
};


export default BookingCards;
