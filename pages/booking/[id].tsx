import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useSwrFetcherWithAccessToken } from '@/functions/useSwrFetcherWithAccessToken';
import { WithDefaultLayout } from '../../components/DefautLayout';
import { Page } from '@/types/Page';
import { BackendApiUrl } from '@/functions/BackendApiUrl';
import useSWR from 'swr';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faUpload } from '@fortawesome/free-solid-svg-icons';
import { Input, Upload, Button, Select, ConfigProvider } from 'antd';
import { useSession } from 'next-auth/react';
import { User } from 'next-auth';
import { UploadFile } from 'antd/es/upload/interface'; // Type for the uploaded file
import ConfirmationModal from '@/components/Modals/BookingsModals/BookingConfirmtionModal';
import { useFetchWithAccessToken } from '@/functions/useFetchWithAccessToken'; // Custom hook for fetching data
import SuccessModal from '@/components/Modals/BookingsModals/SuccessModal';

const customTheme = {
  token: {
    'colorBgContainerDisabled': '#ffffff', 
  },
};


export interface RoomDetail {
  roomId: number;
  name: string;
  description: string;
  minioUrl: string;
  capacity: number;
  roomType: string;
}

export interface AvailableSession {
  sessionId: number;
  sessionName: string;
}

interface AvailableSessions {
  availableSessions: AvailableSession[];
}

export interface Equipment {
  equipmentId: number;
  equipmentName: string;
}

interface Subject {
  subjectId: number;
  subjectName: string;
}

interface IntituteId {
  lecturersId: string 
  staffsId: string 
  studentsId: string
}

interface Organization{
    name: string;
}

const BookingPage: Page = () => {
  const router = useRouter();
  const { id, date } = router.query;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccesModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string | undefined>(undefined);
  const [selectedBookingPurpose, setSelectedBookingPurpose] = useState<string | undefined>(undefined);

  const swrFetcher = useSwrFetcherWithAccessToken();
  const { data: session } = useSession();
  const user = session?.user as User;
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const userId = user?.id;
  const {data: organizationName} = useSWR<Organization>(`${BackendApiUrl.getDisplayName}?UserId=${userId}&RoleName=${user?.role?.[0]}`, swrFetcher)

  const { fetchPOSTWithFormData } = useFetchWithAccessToken();

  // Fetching data using SWR
  const { data: sessionsData, error } = useSWR<AvailableSessions>(
    `${BackendApiUrl.getAvailableSession}?RoomId=${id}&Date=${date}`,
    swrFetcher
  );

  const { data: equipments } = useSWR<Equipment[]>(
    `${BackendApiUrl.getAllEquipment}`,
    swrFetcher
  );

  const { data: institutes } = useSWR<IntituteId>(
    `${BackendApiUrl.getInstituteId}?UserId=${userId}`,
    swrFetcher
  );

  const { data: subjects } = useSWR<Subject[]>(
    `${BackendApiUrl.getLecturerSubject}?LecturerId=${userId}`,
    swrFetcher
  );

  const sessions = sessionsData?.availableSessions || [];
  const equipment = equipments || [];

  if (error) {
    return <p>Error loading available sessions.</p>;
  }

  if (!sessionsData) {
    return <p>Loading...</p>;
  }

  // Handle back button
  const handleBackButton = () => {
    router.back();
  };

  // Handle file change
  const handleFileChange = (info: { fileList: UploadFile[] }) => {
    setFileList(info.fileList || []);
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Prepare the FormData
    const formData = new FormData();
    const selectedSessions: string[] = [];
    const selectedEquipment: string[] = [];
  
    // Collect selected sessions
    document.querySelectorAll("input[name='sessionIds']:checked").forEach((input: any) => {
      selectedSessions.push(input.value);
    });
  
    // Collect selected equipment
    document.querySelectorAll("input[name='equipmentIds']:checked").forEach((input: any) => {
      selectedEquipment.push(input.value);
    });
  
    // Handle the booking description
    let bookingDescription = (document.querySelector('input[name="eventName"]') as HTMLInputElement)?.value || '';
    const institutionalId = (document.querySelector('input[name="institutionalId"]') as HTMLInputElement)?.value || '';

    // If the user is a Lecturer, overwrite the BookingDescription with subject and booking purpose
    if (user?.role?.[0] === 'Lecturer') {
      bookingDescription = `${selectedSubject} - ${selectedBookingPurpose}`;
    }

  
  
    // Append the booking description and other basic form data
    formData.append('BookingDescription', bookingDescription);
    formData.append('InstitutionalId', institutionalId);
    formData.append('UserId', userId as string);
    formData.append('BookingDate', date as string);
    formData.append('RoomId', id as string);
    if (user?.role?.[0] === 'StudentOrganization' && fileList.length > 0) {
        formData.append('Evidence', fileList[0]?.originFileObj as Blob); // Assuming only one file upload
      } else {
        // For non-StudentOrganization roles, append an empty value for Evidence
        formData.append('Evidence', ''); 
      }
    formData.append('FullName', user?.name || '');
  
    // Append selected sessions and equipment
    selectedSessions.forEach((sessionId) => {
      formData.append('SessionBookedList', sessionId);
    });
  
    selectedEquipment.forEach((equipmentId) => {
      formData.append('EquipmentBookedList', equipmentId);
    });
  
  
    // Append organization name (if available)
    if (user?.role?.[0] === 'StudentOrganization' || user?.role?.[0] === 'Staff') {
      const organizationName = (document.querySelector('input[name="organizationName"]') as HTMLInputElement)?.value || '';
      formData.append('OrganizationName', organizationName);
    }
  
    // Make the POST request using fetch
    try {
      const response = await fetchPOSTWithFormData(BackendApiUrl.createBooking, formData);
      if (response.data) {
        // Handle success (show success message or redirect)
       setIsSuccess(true);
      } else {
        // Handle error (e.g., display an error message)
        setIsSuccess(false);
      }
    } catch (error) {
      setIsSuccess(false);
    }
  };
  
  // Handle modal cancellation
  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  // Handle modal confirmation (trigger the submission)
  const handleModalConfirm = () => {
    handleSubmit(); // Call the handleSubmit function to post the data
    setIsModalOpen(false); // Close the modal after confirming
    setIsSuccessModalOpen(true)
  };

  const handleSuccessModalConfirm = () => {
    setIsSuccessModalOpen(false);
    router.push('/ongoing')
  }

  const handleSuccessModalCancel= () => {
    setIsSuccessModalOpen(false);
  }

  return (
    <ConfigProvider theme={customTheme}>
      <div className="mt-4">
        <button
          className="bg-white rounded-full w-10 h-10 flex items-center justify-center"
          onClick={handleBackButton}
        >
          <FontAwesomeIcon icon={faChevronLeft} className="inline" />
        </button>
        <div className="mt-6 overflow-y-auto h-[620px]">
          <img
            src="/Assets/images/booking-title.png"
            alt=""
            width={720}
            height={100}
            className="mb-6"
          />
          <div>
            {/* User information fields */}
            <div>
              <p className="mb-2 text-base text-white font-normal">Full Name</p>
              <Input
                type="text"
                className="w-full mb-3 rounded-lg h-8"
                disabled={true}
                value={user?.name ?? ''}
              />
            </div>
            {/* Role-specific inputs */}
            <div className="bg-orange-200-300">
              {user?.role?.[0] === 'StudentOrganization' || user?.role?.[0] === 'Student' ? (
                <div>
                    <p className="mb-2 text-base text-white font-normal">Student ID</p>
                    <Input type="text" className="w-full mb-3 rounded-lg h-8" disabled={true} value={institutes?.studentsId ?? ''} name="institutionalId"/>
                </div>
              ) : user?.role?.[0] === 'Lecturer' ? (
                <div>
                <p className="mb-2 text-base text-white font-normal">Lecturer ID</p>
                <Input type="text" className="w-full mb-3 rounded-lg h-8" disabled={true} value={institutes?.lecturersId ?? ''} name="institutionalId"/>
                </div>
              ) : user?.role?.[0] === 'Staff' ? (
                <div>
                <p className="mb-2 text-base text-white font-normal">Staff ID</p>
                <Input type="text" className="w-full mb-3 rounded-lg h-8" disabled={true} value={institutes?.staffsId ?? ''} name="institutionalId"/>

                </div>
              ) : (
                <p className="mb-2 text-base text-white font-normal">Unknown Role</p>
              )}
              {/* <Input type="text" className="w-full mb-3 rounded-lg h-8"/> */}
            </div>
            <div>
              {user?.role?.[0] === 'Student' ||
              user?.role?.[0] === 'StudentOrganization' ||
              user?.role?.[0] === 'Staff' ? (
                <>
                  <p className="mb-2 text-base text-white font-normal">Event Name</p>
                  <Input type="text" className="w-full mb-3 rounded-lg h-8" name="eventName"/>
                </>
              ) : user?.role?.[0] === 'Lecturer' ? (
                <>
                  <p className="mb-2 text-base text-white font-normal">Subject</p>
                  <Select
                    className="w-full mb-3 rounded-lg h-8"
                    placeholder="Select a Subject"
                    value={selectedSubject}  // Manage the selected value through state
                    onChange={(value) => setSelectedSubject(value)} // Update selectedSubject when changed
                    options={subjects?.map((subject) => ({
                        label: subject.subjectName,
                        value: subject.subjectName,
                    }))}
                    />
                </>
              ) : (
                <p className="mb-3">Unknown Role</p>
              )}
            </div>
            <div>
              {user?.role?.[0] === 'StudentOrganization' && (
                <>
                  <p className="mb-2 text-base text-white font-normal">Student Organization Name</p>
                  <Input type="text" className="w-full mb-3 rounded-lg h-8" disabled={true} value={organizationName?.name} name="organizationName"/>
                </>
              )} 
              {user?.role?.[0] === 'Staff' && (
                <>
                  <p className="mb-2 text-base text-white font-normal">Office/Center Name</p>
                  <Input type="text" className="w-full mb-3 rounded-lg h-8" disabled={true} value={organizationName?.name} name="organizationName"/>
                </>
              )}
              {user?.role?.[0] === 'Lecturer' && (
                <>
                  <p className="mb-2 text-base text-white font-normal">Booking Purpose</p>
                  <Select
                    className="w-full mb-3 rounded-lg h-8"
                    value={selectedBookingPurpose} // Manage the selected value through state
                    onChange={(value) => setSelectedBookingPurpose(value)} // Update selectedBookingPurpose when changed
                    options={[
                        { value: 'Class Replacement', label: 'Class Replacement' },
                        { value: 'New Class', label: 'New Class' },
                        { value: 'Extra Class', label: 'Extra Class' },
                    ]}
                    />
                </>
              )}
            </div>
            {/* Session Selection */}
            <div>
              <p className="mb-2 text-base text-white font-normal">Session Booked</p>
              <div className="grid grid-cols-2 mb-3">
                {sessions.length > 0 ? (
                  sessions.map((availableSession) => (
                    <div key={availableSession.sessionId} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`session-${availableSession.sessionId}`}
                        name="sessionIds"
                        value={availableSession.sessionId}
                        className="mr-2 grid-cols-2"
                      />
                      <label
                        htmlFor={`session-${availableSession.sessionId}`}
                        className="text-white text-base font-thin"
                      >
                        {availableSession.sessionName}
                      </label>
                    </div>
                  ))
                ) : (
                  <p>No sessions available</p>
                )}
              </div>
            </div>

            {/* Equipment Selection */}
            <div>
              <p className="mb-2 text-base text-white font-normal">Technical Support</p>
              <div className="grid grid-cols-2 mb-3">
                {equipment.length > 0 ? (
                  equipment.map((equipment) => (
                    <div key={equipment.equipmentId} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`equipment-${equipment.equipmentId}`}
                        name="equipmentIds"
                        value={equipment.equipmentId}
                        className="mr-2 grid-cols-2"
                      />
                      <label
                        htmlFor={`equipment-${equipment.equipmentId}`}
                        className="text-white text-base font-thin"
                      >
                        {equipment.equipmentName}
                      </label>
                    </div>
                  ))
                ) : (
                  <p>No equipment available</p>
                )}
              </div>
            </div>

            {/* Evidence Upload */}
            <div>
            {user?.role?.[0] === 'StudentOrganization' && (
                <>
              <p className="mb-2 text-base text-white font-normal">Evidence of Approval</p>
              <Upload
                fileList={fileList ?? []}
                onChange={handleFileChange}
                showUploadList={true}
                className='text-white'
                maxCount={1}
              >
                <Button className="bg-white border-black text-black text-base">
                  <FontAwesomeIcon icon={faUpload} className="mr-2" />Click to Upload
                </Button>
              </Upload>
              </>
              )}
            </div>

            <div className="flex justify-center mt-4">
              <button
                className="bg-purple-950 px-14 py-2 font-bold text-white rounded-full text-xl"
                onClick={() => setIsModalOpen(true)}
              >
                Submit Booking
              </button>
            </div>
            <ConfirmationModal
              visible={isModalOpen}
              onConfirm={handleModalConfirm}
              onCancel={handleModalCancel}
            />
            <SuccessModal
              visible={isSuccesModalOpen}
              onConfirm={handleSuccessModalConfirm}
              isSuccess={isSuccess}
              onCancel={handleSuccessModalCancel}
            />
          </div>
        </div>
      </div>
    </ConfigProvider>
    
  );
};

BookingPage.layout = WithDefaultLayout;
export default BookingPage;
