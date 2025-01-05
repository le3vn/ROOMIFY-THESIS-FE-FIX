/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Table, Spin, message } from 'antd';
import { useFetchWithAccessToken } from '@/functions/useFetchWithAccessToken'; // Import the fetch hook
import { BackendApiUrl } from '@/functions/BackendApiUrl'; // Assuming this is where your API URLs are
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomId: string | string[] | undefined ;
  roomName: string | undefined; // Pass roomId to fetch the schedule
}

// Define the structure of the schedule item
interface Schedule {
  bookingDate: string;
  bookingTimeStart: string;
  bookingTimeEnd: string;
  eventName: string;
  picName: string;
}

// Define the structure of the schedule list (wrapped around Schedule array)
interface ScheduleList {
  scheduleList: Schedule[];
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, roomId, roomName }) => {
  const { fetchGET } = useFetchWithAccessToken(); // Hook to fetch data
  const [scheduleData, setScheduleData] = useState<ScheduleList | undefined>(undefined); // State to store schedule data
  const [loading, setLoading] = useState<boolean>(false); // Loading state

  // Fetch room schedule when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchRoomSchedule();
    }
  }, [isOpen, roomId]);

  // Function to fetch room schedule with try-catch for error handling
  const fetchRoomSchedule = async () => {
    setLoading(true); // Set loading to true when fetching
    try {
      // Type the response explicitly as ScheduleList
      const response = await fetchGET<ScheduleList>(`${BackendApiUrl.getRoomSchedule}?id=${roomId}`);

      console.log(response.data)
      
      // Ensure that we only set the scheduleList if it's valid
      if (response && response.data?.scheduleList) {
        setScheduleData(response.data);
      } else {
        message.error('No schedule data available.');
      }
    } catch (error: unknown) {
      // Handle unknown error type
      console.error('Error fetching schedule data:', error);
      message.error('Failed to fetch room schedule. Please try again later.');
    } finally {
      setLoading(false); // Set loading to false when fetching is done
    }
  };

  if (!isOpen) return null; // Don't render the modal if it's closed

  // Define columns for Ant Design Table
  const columns = [
    {
      title: 'Date',
      dataIndex: 'bookingDate',
      key: 'bookingDate'
    },
    {
      title: 'Start Time',
      dataIndex: 'bookingTimeStart',
      key: 'bookingTimeStart',
    },
    {
      title: 'End Time',
      dataIndex: 'bookingTimeEnd',
      key: 'bookingTimeEnd',
    },
    {
      title: 'Event Name',
      dataIndex: 'eventName',
      key: 'eventName',
    },
    {
      title: 'PIC Name',
      dataIndex: 'picName',
      key: 'picName',
    },
  ];

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg w-3/5">
      <div className='flex justify-between items-center mb-4'>
        <h2 className="text-2xl font-bold">{roomName}</h2>
        <button className='bg-gray-200 w-10 h-10 rounded-full' onClick={onClose}>
          <FontAwesomeIcon icon={faX}/>
        </button>
      </div>

        {/* Table or loading spinner */}
        {loading ? (
          <div className="flex justify-center items-center">
            <Spin size="large" />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={scheduleData?.scheduleList} // Access scheduleList from scheduleData
            rowKey="bookingDate" // Use bookingDate as the row key (or any other unique identifier)
            pagination={false} // Disable pagination if you don't need it
            bordered
          />
        )}
      </div>
    </div>
  );
};

export default Modal;
