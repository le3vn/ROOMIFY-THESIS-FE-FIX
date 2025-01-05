import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { WithDefaultLayout } from '../../components/DefautLayout';
import HeaderPage from '@/components/HeaderPage'; // Assuming you have a Header component
import { Page } from '@/types/Page';
import { BackendApiUrl } from '@/functions/BackendApiUrl';
import { useSwrFetcherWithAccessToken } from '@/functions/useSwrFetcherWithAccessToken';
import { BuildingResponse } from '@/interface/Buildings';
import { BuildingList } from '@/interface/Buildings';
import { RoomList } from '@/interface/Rooms';
import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import ScheduleModal from '@/components/Modals/BookingsModals/ScheduleModal'; // Import your modal component
import { DatePicker, Select } from 'antd';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

// Extend dayjs with the isBetween plugin
dayjs.extend(isBetween);

interface BlockerInfo {
  blockerId: number;
  blockerName: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

interface BlockerList {
  blockerLists: BlockerInfo[];
  totalData: number;
}


const RoomPage: Page = () => {
  const router = useRouter();
  const { id } = router.query;
  const session = useSession();
  const swrFetcher = useSwrFetcherWithAccessToken();

  const [buildings, setBuildings] = useState<BuildingList[] | undefined>([]);
  const [selectedBuilding, setSelectedBuilding] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isAvailableSelected, setIsAvailableSelected] = useState(true);
  const [rooms, setRooms] = useState<RoomList[]>([]);

  const { data: blockerList } = useSWR<BlockerList>(BackendApiUrl.getBlockerList, swrFetcher);


  // Modal state for opening/closing the ScheduleModal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<string | undefined>(undefined);
  const [selectedRoomName, setSelectedRoomName] = useState<string | undefined>(undefined); // Add state for room name

  const { data: response } = useSWR<BuildingResponse>(
    `${BackendApiUrl.getBuilding}`,
    swrFetcher
  );

  useEffect(() => {
    if (response) {
      setBuildings(response.buildingList);
      if (id) {
        setSelectedBuilding(id.toString()); // Set buildingId from the query string
      }
    }
  }, [response, id]);

  useEffect(() => {
    const fetchRooms = async () => {
      const userRole = session.data?.user?.role; // Get user role from session
      const response = await swrFetcher(
        `${BackendApiUrl.getRoom}?BuildingId=${id}&UserRole=${userRole}&IsAvailable=${isAvailableSelected}&DateToBook=${selectedDate.toISOString().split('T')[0]}`
      );
      setRooms(response.roomList);
    };

    if (id && selectedDate && !isAvailableSelected || isAvailableSelected) {
      fetchRooms();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, selectedDate, isAvailableSelected, session.data?.user?.role]);

  const handleBuildingChange = (selectedId: string) => {
    setSelectedBuilding(selectedId);
    router.push(`/room/${selectedId}`);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleMenuChange = (isAvailable) => {
    setIsAvailableSelected(isAvailable);
  };

  const handleBookClicked = (roomId) => {
    const formattedDate = selectedDate.toISOString().split('T')[0];
    router.push(`/roomDetail/${roomId}?date=${formattedDate}`);
  };

  const handleOpenModal = (roomId, roomName) => {
    setSelectedRoomId(roomId); // Set selected room ID
    setSelectedRoomName(roomName);
    setIsModalOpen(true); // Open the modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  const isDateBlocked = (currentDate) => {
    if (!blockerList || !blockerList.blockerLists) return false;
  
    // Ensure currentDate is a dayjs object
    const currentDay = dayjs(currentDate);
  
    return blockerList.blockerLists.some((blocker) => {
      // Convert the blocker start and end dates to dayjs objects
      const startDate = dayjs(blocker.startDate);
      const endDate = dayjs(blocker.endDate);
  
      // Check if the current date is between the blocker start and end dates (inclusive)
      return currentDay.isBetween(startDate, endDate, 'day', '[]');
    });
  };
  

  return (
    <div>
      <HeaderPage />
      <div className="flex flex-col">
        <div className="w-full flex justify-center mt-8 gap-4">
          <Select
            className="w-3/5"
            value={selectedBuilding} // Manage the selected value through state
            onChange={handleBuildingChange} // Update selectedSubject when changed
            options={buildings?.map((building) => ({
              label: building.name,
              value: building.buildingId,
            }))}
          />
          <DatePicker
            value={selectedDate ? dayjs(selectedDate) : undefined}
            onChange={handleDateChange}
            className="border border-gray-300 rounded-md w-2/5"
            disabledDate={(currentDate) => 
              currentDate.isBefore(dayjs().startOf('day'), 'day') || isDateBlocked(currentDate)
            }
          />
        </div>

        <div className="flex mt-4 mb-6">
          {/* Container for menu buttons */}
          <button
            className={`rounded-md text-white text-xl ${isAvailableSelected ? 'underline' : ''} ${isAvailableSelected ? 'underline-offset-8' : ''}`}
            onClick={() => handleMenuChange(true)}
          >
            Available
          </button>
          <button
            className={`rounded-md ml-8 text-white text-xl ${!isAvailableSelected ? 'underline' : ''} ${!isAvailableSelected ? 'underline-offset-8' : ''}`}
            onClick={() => handleMenuChange(false)}
          >
            Booked
          </button>
        </div>

        <div className="mt-4 grid grid-cols-5 gap-5 overflow-y-auto h-[480px]">
          {rooms.map((room) => (
            <div key={room.roomId} className="flex flex-col bg-white rounded-md p-4 h-[290px]">
              <div>
                <img
                  src={room.minioUrl}
                  alt={room.name}
                  className="w-full h-40 object-cover rounded-md"
                />
                <div className="mb-9">
                  <h2 className="text-black text-base mt-2 font-semibold">{room.name}</h2>
                </div>
                <div className="flex mt-4 justify-end">
                  {/* Conditionally apply styles to the "Book" button */}
                  <button
                    className={`rounded-full text-white w-[65px] py-1 mr-2 ${
                      !isAvailableSelected ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-950'
                    }`}
                    onClick={() => (isAvailableSelected ? handleBookClicked(room.roomId) : null)}
                    disabled={!isAvailableSelected}
                  >
                    Book
                  </button>
                  <button
                    className="rounded-full bg-purple-950 w-[65px] text-white px-4 py-1"
                    onClick={() => handleOpenModal(room.roomId, room.name)}
                  >
                    Info
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal component to show room schedule */}
      {isModalOpen && selectedRoomId && (
        <ScheduleModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          roomId={selectedRoomId} // Pass the roomId to fetch its schedule
          roomName={selectedRoomName}
        />
      )}
    </div>
  );
};

RoomPage.layout = WithDefaultLayout;
export default RoomPage;
