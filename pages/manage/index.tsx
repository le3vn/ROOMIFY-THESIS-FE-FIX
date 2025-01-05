import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { WithDefaultLayout } from '../../components/DefautLayout';
import { Button, Collapse, Input, Select, Table } from 'antd';
import { Page } from '@/types/Page';
import { BackendApiUrl } from '@/functions/BackendApiUrl';
import { useSwrFetcherWithAccessToken } from '@/functions/useSwrFetcherWithAccessToken';
import useSWR from 'swr';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useFetchWithAccessToken } from '@/functions/useFetchWithAccessToken';
import DeleteConfirmationModal from '@/components/Modals/ManageModals/ManageBuildingModals/DeleteBuildingConfirm';
import DeleteSuccessModal from '@/components/Modals/ManageModals/ManageBuildingModals/DeleteBuildingSuccess';
import DeleteRoomConfirmationModal from '@/components/Modals/ManageModals/ManageRoomModals/DeleteRoomConfirm';
import DeleteRoomSuccessModal from '@/components/Modals/ManageModals/ManageRoomModals/DeleteRoomSuccess';
import DeleteGroupConfirmationModal from '@/components/Modals/ManageModals/ManageGroupModals/DeleteGroupConfirm';
import DeleteGroupSuccessModal from '@/components/Modals/ManageModals/ManageGroupModals/DeleteGroupSuccess';
import { displayName } from 'react-quill';
import { useDebounce } from 'use-debounce';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';

const { Panel } = Collapse;
const { Search } = Input;

export interface BuildingResponse {
  buildingList: BuildingList[],
  totalData: number,
}

export interface BuildingList {
  buildingId: number,
  createdAt: string,
  createdBy: string,
  minioUrl: string,
  name: string,
  updatedAt: string,
  updatedBy: string,
}

export interface RoomResponse{
    roomList: AllRoomList[];
    totalData: number;
}

export interface AllRoomList{
    roomId: number;
    name: string;
    roomType: string;
    building: string;
    buildingId: number;
    capacity: number;
    group: string
}
interface RoleList{
  roleId: string;
  roleName: string;
  displayName: string;
}

interface UserRole{
  userId: string;
  name: string;
  userRoles: RoleList[];
}

interface UserRolesList{
  userWithRoles: UserRole[];
  totaldata: number;
}

interface Group{
  id: number;
  name: string;
}

interface RoomGroups{
  roomGroups: Group[];
  totalData: number;
}

interface SessionInfo{
  sessionId: number;
  sessionName: string;
}

interface ManageBooking{
  bookingId: string;
  roomId: number;
  roomName: string; 
  bookingDate: string;
  statusId: number;
  statusName: string;
  userName: string;
  buildingId: number;
  bookingDescription: string;
  manageSessions: SessionInfo[];
}

interface BookingData{
  manageBookings: ManageBooking[];
  totaldata: number;
}

const ManagePage: Page = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user as User;
  const userRole = user?.role?.[0];
  const { data: buildingData, mutate } = useSWR<BuildingResponse>(BackendApiUrl.getBuilding, useSwrFetcherWithAccessToken());
  const { data: roomList } = useSWR<RoomResponse>(BackendApiUrl.getAllRoom, useSwrFetcherWithAccessToken());
  const [searchTerm, setSearchTerm] = useState<string>('');  // State to store the search term
  const [bookSearchTerm, setBookSearchTerm] = useState<string>('');  // State to store the search term
  const [filteredUserRoles, setFilteredUserRoles] = useState<UserRole[]>([]);  // Filtered roles data
  // Fetching the data initially
  const { data: userRoles, error } = useSWR<UserRolesList>(
    BackendApiUrl.getUserRoles, 
    useSwrFetcherWithAccessToken()
  );
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  const [debouncedBookSearchTerm] = useDebounce(bookSearchTerm, 500);

  const { data: roomGroup } = useSWR<RoomGroups>(BackendApiUrl.getRoomGroup, useSwrFetcherWithAccessToken());
  const [, setIsDeleting] = useState(false);
  const [, setIsDeletingGroup] = useState(false);
  const [, setIsDeletingRoom] = useState(false);
  const [currentBuildingId, setCurrentBuildingId] = useState<number>(0);
  const [currentRoomId, setCurrentRoomId] = useState<number>(0);
  const [currentGroupId, setCurrentGroupId] = useState<number>(0);
  const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);
  const [isRoomSuccessModalVisible, setRoomSuccessModalVisible] = useState(false);
  const [isGroupSuccessModalVisible, setGroupSuccessModalVisible] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSuccessGroup, setIsSuccessGroup] = useState(false);
  const [isSuccessRoom, setIsSuccessRoom] = useState(false);
  const [isConfirmModalVisible, setConfirmModalVisible] = useState(false);  // The id of the building being deleted
  const [isRoomConfirmModalVisible, setRoomConfirmModalVisible] = useState(false);
  const [isGroupConfirmModalVisible, setGroupConfirmModalVisible] = useState(false);
  
  const [selectedBuildingId, setSelectedBuildingId] = useState<number | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);

  const getSWRUrl = () => {
    let url = `${BackendApiUrl.getAllBooking}`; // Base URL

    // Add filters only if they are selected
    if (selectedBuildingId || selectedRoomId) {
      const queryParams: string[] = [];

      if (selectedBuildingId) queryParams.push(`BuildingId=${selectedBuildingId}`);
      if (selectedRoomId) queryParams.push(`RoomId=${selectedRoomId}`);

      if (queryParams.length > 0) {
        url += '?' + queryParams.join('&');
      }
    }

    return url;
  };

 const { data: manageBooking } = useSWR<BookingData>(getSWRUrl(), useSwrFetcherWithAccessToken());
  

  const { fetchDELETE } = useFetchWithAccessToken();

  // Delete building function
  const handleDeleteBuilding = async () => {
    setIsDeleting(true);
    try {
      await fetchDELETE(`${BackendApiUrl.deleteBuilding}/${currentBuildingId}`);
      setIsSuccess(true);
      mutate();
    } catch (error) {
      setIsSuccess(false);
    } finally {
      setIsDeleting(false);
      setSuccessModalVisible(true);
      setConfirmModalVisible(false);
      router.reload();
    }
  };

  const handleDeleteGroup = async () => {
    setIsDeleting(true);
    try {
      await fetchDELETE(`${BackendApiUrl.deleteGroup}/${currentGroupId}`);
      setIsSuccessGroup(true);
      mutate();
    } catch (error) {
      setIsSuccessGroup(false);
    } finally {
      setIsDeletingGroup(false);
      setGroupSuccessModalVisible(true);
      setGroupConfirmModalVisible(false);
    }
  };


  // Confirm delete modal
  const showDeleteConfirm = (buildingId: number) => {
    setCurrentBuildingId(buildingId);
    setConfirmModalVisible(true);
  };

  const handleDeleteRoom = async () => {
    setIsDeletingRoom(true);
    try {
      await fetchDELETE(`${BackendApiUrl.deleteRoom}/${currentRoomId}`);
      setIsSuccessRoom(true);
      mutate();
    } catch (error) {
      setIsSuccessRoom(false);
    } finally {
      setIsDeletingRoom(false);
      setRoomSuccessModalVisible(true);
      setRoomConfirmModalVisible(false);
      router.reload();
    }
  };
  // Confirm delete modal
  const showDeleteGroupConfirm = (groupId: number) => {
    setCurrentGroupId(groupId);
    setGroupConfirmModalVisible(true);
  };

  const showDeleteRoomConfirm = (roomId: number) => {
    setCurrentRoomId(roomId);
    setRoomConfirmModalVisible(true);
  };

  const closeSuccessModal = () => {
    setSuccessModalVisible(false);
  };

  const closeRoomSuccessModal = () => {
    setRoomSuccessModalVisible(false);
  };
  const closeGroupSuccessModal = () => {
    setGroupSuccessModalVisible(false);
  };

  const handleBuildingChange = (value: number) => {
    setSelectedBuildingId(value);
    setSelectedRoomId(null); // Clear room filter when building changes
  };
  
  // Select input for room
  const handleRoomChange = (value: number) => {
    setSelectedRoomId(value);
  };
  
  // Search handler
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBookSearchTerm(e.target.value);
  };

  const resetFilters = () => {
    setSelectedBuildingId(null);
    setSelectedRoomId(null);
    setBookSearchTerm('');
  };
  
  

  // Table columns
  const tableData = buildingData?.buildingList.map((building, index) => ({
    key: building.buildingId,  // Ensure the key is set to buildingId
    name: building.name,
    buildingId: building.buildingId,  // Add buildingId directly to the data
    no: index + 1,
    action: 'View',
  }));
  
  const columns = [
    {
      title: 'No.',
      dataIndex: 'no',
      key: 'no',
      render: (text: string, record: any, index: number) => index + 1, // Show row number
    },
    {
      title: 'Building Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Action',
      dataIndex: 'id',
      key: 'id',
      render: (text: string, record: any) => (
        <div className='flex gap-4'>
          <button className='w-8 h-8 bg-purple-950 text-white rounded-full' onClick={() => router.push(`/manage/manageBuilding/${record.buildingId}`)}>
            <FontAwesomeIcon icon={faPen} />
          </button>
          <button
            className='w-8 h-8 bg-red-600 text-white rounded-full'
            onClick={() => {
              // Now, it should log the buildingId correctly
              showDeleteConfirm(record.buildingId)
            }}
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      ),
    },
  ];
  
  
  useEffect(() => {
    if (userRoles) {
      // Filter the data based on the debounced search term
      const filtered = userRoles.userWithRoles.filter(user =>
        user.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
      setFilteredUserRoles(filtered);
    }
  }, [userRoles, debouncedSearchTerm]);

  const userRoleData = filteredUserRoles.map((user, index) => ({
    key: user.userId,  // Ensure the key is set to userId
    no: index + 1,  // Add row number
    name: user.name,
    userRoles: user.userRoles.map(role => ({
        displayName: role.displayName,  // Show displayName
        roleName: role.roleName,
    })),
    UserId: user.userId,
    action: 'View', 
  }));

  const RoleColumns = [
    {
      title: 'No.',
      dataIndex: 'no',
      key: 'no',
    },
    {
      title: 'User Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Roles',
      dataIndex: 'userRoles',
      key: 'userRoles',
      render: (roles: { displayName: string, roleName: string }[]) => (
        <div className="flex flex-wrap gap-2">
          {roles.map((role, index) => (
            <span
              key={index}
              className={`px-2 py-1 rounded-full text-white ${getRoleClass(role.roleName)}`}
            >
              {role.displayName} {/* Show the displayName */}
            </span>
          ))}
        </div>
      ),
    },
    {
      title: 'Action',
      dataIndex: 'id',
      key: 'id',
      render: (text: string, record: any) => (
        <div className='flex gap-4'>
          <button className='w-8 h-8 bg-purple-950 text-white rounded-full' onClick={() => router.push(`/manage/manageRole/${record.UserId}`)}>
            <FontAwesomeIcon icon={faPen} />
          </button>
        </div>
      ),
    },
  ];

  const getRoleClass = (role: string): string => {
    const roleClasses: { [key: string]: string } = {
      Staff: 'bg-red-500', // Red for Admin
      StudentOrganization: 'bg-blue-500', // Blue for User
      Lecturer: 'bg-green-500',
      Student: 'bg-purple-500',
      SLC: 'bg-pink-500',
      SSO: 'bg-red-300',
      LSC: 'bg-orange-500',
      BM: 'bg-lime-400'
    };
    return roleClasses[role] || 'bg-gray-400'; // Default gray if role is not in the map
  };

  const RoomGroupData = roomGroup?.roomGroups.map((group, index) => ({
    key: group.id,  // Ensure the key is set to buildingId
    name: group.name,
    GroupId: group.id,
    no: index + 1,
    action: 'View',
  }));

  const groupColumns = [
    {
      title: 'No.',
      dataIndex: 'no',
      key: 'no',
      render: (text: string, record: any, index: number) => index + 1, // Show row number
    },
    {
      title: 'Group Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Action',
      dataIndex: 'id',
      key: 'id',
      render: (text: string, record: any) => (
        <div className='flex gap-4'>
          <button className='w-8 h-8 bg-purple-950 text-white rounded-full' onClick={() => router.push(`/manage/manageGroup/${record.GroupId}`)}>
            <FontAwesomeIcon icon={faPen} />
          </button>
          <button
            className='w-8 h-8 bg-red-600 text-white rounded-full'
            onClick={() => {
              // Now, it should log the buildingId correctly
              showDeleteGroupConfirm(record.GroupId)
            }}
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      ),
    },
  ];

  const tableRoomData = roomList?.roomList.map((room, index) => ({
    key: room.roomId,  // Ensure the key is set to buildingId
    roomName: room.name,
    roomType: room.roomType,
    building: room.building,
    capacity: room.capacity,
    RoomId: room.roomId,  // Add buildingId directly to the data
    group: room.group,
    no: index + 1,
    action: 'View',
  }));

  const roomColumns = [
    {
      title: 'No.',
      dataIndex: 'no',
      key: 'no',
      render: (text: string, record: any, index: number) => index + 1, // Show row number
    },
    {
      title: 'Room Name',
      dataIndex: 'roomName',
      key: 'roomName',
    },
    {
        title: 'Room Type',
        dataIndex: 'roomType',
        key: 'roomType',
    },
    {
        title: 'Building',
        dataIndex: 'building',
        key: 'building',
      },
      {
        title: 'Capacity',
        dataIndex: 'capacity',
        key: 'capacity',
      },
      {
        title: 'Group',
        dataIndex: 'group',
        key: 'group',
      },
    {
      title: 'Action',
      dataIndex: 'id',
      key: 'id',
      render: (text: string, record: any) => (
        <div className='flex gap-4'>
          <button className='w-8 h-8 bg-purple-950 text-white rounded-full' onClick={() => router.push(`/manage/manageRoom/${record.RoomId}`)}>
            <FontAwesomeIcon icon={faPen} />
          </button>
          <button
            className='w-8 h-8 bg-red-600 text-white rounded-full'
            onClick={() => {
              // Now, it should log the buildingId correctly
              showDeleteRoomConfirm(record.RoomId)
            }}
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      ),
    },
  ];

  const bookingData = manageBooking?.manageBookings.map((book, index) => ({
    key: book.bookingId, // Ensure the key is set to buildingId
    roomId: book.roomId,
    roomName: book.roomName,
    bookingDescriptions: book.bookingDescription,
    bookingDate: book.bookingDate,
    status: book.statusName,  // Add buildingId directly to the data
    BookingId: book.bookingId,
    no: index + 1,
    action: 'View',
    userName: book.userName,
    buildingId: book.buildingId
  }));

  const filteredBookingData = manageBooking?.manageBookings.filter((book) => {
    return book.bookingDescription.toLowerCase().includes(bookSearchTerm.toLowerCase());
  }).map((book, index) => ({
    key: book.bookingId, // Ensure that each row has a unique key (BookingId)
    roomId: book.roomId,
    roomName: book.roomName,
    bookingDescriptions: book.bookingDescription,
    bookingDate: book.bookingDate,
    status: book.statusName,
    BookingId: book.bookingId, // Ensure you use the BookingId in your columns
    no: index + 1,
    action: 'View',
    userName: book.userName,
    buildingId: book.buildingId
  }));
  

  const filteredRooms = selectedBuildingId
  ? roomList?.roomList.filter(room => room.buildingId === selectedBuildingId)
  : roomList?.roomList;

  

  const bookingColumns = [
    {
      title: 'No.',
      dataIndex: 'no',
      key: 'no',
      render: (text: string, record: any, index: number) => index + 1, // Show row number
    },
    {
      title: 'Event Name',
      dataIndex: 'bookingDescriptions',
      key: 'bookingDescriptions',
    },
    {
        title: 'Room Name',
        dataIndex: 'roomName',
        key: 'roomName',
    },
    {
        title: 'Booking Date',
        dataIndex: 'bookingDate',
        key: 'bookingDate',
      },
      {
        title: 'Submitted By',
        dataIndex: 'userName',
        key: 'userName',
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (text: string, record: any) => (
          <div className='flex items-center'>
            <div className='bg-green-500 w-4 h-4 rounded-full mr-4'></div>
            <p>{record.status}</p>
          </div>
        )
      },
    {
      title: 'Action',
      dataIndex: 'id',
      key: 'id',
      render: (text: string, record: any) => (
        <div className='flex gap-4'>
          <button className='w-8 h-8 bg-purple-950 text-white rounded-full' onClick={() => router.push(`/manage/manageBooking/${record.BookingId}`)}>
            <FontAwesomeIcon icon={faPen} />
          </button>
        </div>
      ),
    },
  ];
  

  const items = [
    {
      key: '1',
      label: 'Manage Rooms',
      content: (
        <Collapse accordion>
          <Panel header="Manage Building" key="1">
            <div className='flex flex-col gap-4'>
              <div className='flex justify-end'>
                <button
                  className='bg-purple-950 w-[150px] py-2 rounded-full text-white'
                  onClick={() => router.push('/manage/manageBuilding')}
                >
                  <FontAwesomeIcon icon={faPlus} className='font-light mr-4' />
                  Add Building
                </button>
              </div>
              <div>
                <Table
                  columns={columns}
                  dataSource={tableData}
                  pagination={false}
                  rowKey="key"
                />
              </div>
            </div>
          </Panel>
          <Panel header="Manage Rooms" key="2">
            <div className='flex flex-col gap-4'>
            <div className='flex justify-end'>
                <button
                  className='bg-purple-950 w-[150px] py-2 rounded-full text-white'
                  onClick={() => router.push('/manage/manageRoom')}
                >
                  <FontAwesomeIcon icon={faPlus} className='font-light mr-4' />
                  Add Room
                </button>
              </div>
            <Table
                  columns={roomColumns}
                  dataSource={tableRoomData}
                  pagination={false}
                  rowKey="key"
                  className='overflow-x-auto'
                />
            </div>
          </Panel>
          {userRole === 'SuperAdmin' && (
            <Panel header="Manage Room Groups" key="3">
              <div className='flex flex-col gap-4'>
                <div className='flex justify-end'>
                  <button
                    className='bg-purple-950 w-[150px] py-2 rounded-full text-white'
                    onClick={() => router.push('/manage/manageGroup')}
                  >
                    <FontAwesomeIcon icon={faPlus} className='font-light mr-4' />
                    Add Group
                  </button>
                </div>
                <Table
                  columns={groupColumns}
                  dataSource={RoomGroupData}
                  pagination={false}
                  rowKey="key"
                  className='overflow-x-auto'
                />
              </div>
            </Panel>
          )}
        </Collapse>
      ),
    },
    {
      key: '2',
      label: 'Manage Booking',
      content: (
        <div className='flex flex-col gap-4'>
          <div className='flex gap-4'>
            <Input
            placeholder="Search by booking description"
            size="large"
            onChange={handleSearchChange}
            value={bookSearchTerm}
            />

            <Select
              placeholder="Select Building"
              onChange={handleBuildingChange}
              value={selectedBuildingId}
              className='rounded-full'
              size='large'
              >
              {buildingData?.buildingList.map(building => (
                <Select.Option key={building.buildingId} value={building.buildingId}>
                  {building.name}
                </Select.Option>
              ))}
            </Select>

        {/* Room Filter */}
            <Select
              style={{ width: 200 }}
              placeholder="Select Room"
              onChange={handleRoomChange}
              value={selectedRoomId}
              size='large'
              >
              {filteredRooms?.map(room => (
                <Select.Option key={room.roomId} value={room.roomId}>
                  {room.name}
                </Select.Option>
              ))}
            </Select>

        {/* Search Input */}
          </div>
            <div className='flex justify-end'>
            <Button onClick={resetFilters} size='large' className='bg-purple-950 text-white rounded-full'>
                Reset Filters
            </Button>

            </div>
        <Table
          dataSource={filteredBookingData}
          columns={bookingColumns}
          rowKey="key"  // Ensures each row has a unique key
          pagination={{ total: filteredBookingData?.length }}
        />
        </div>
      ),
    },
    {
      key: '3',
      label: 'Manage Roles',
      content: (
        <div>
          <div className="mb-4">
            <Input
              placeholder="Search by user name"
              size="large"
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full rounded-full'
            />
          </div>

          <Table
            dataSource={userRoleData}
            columns={RoleColumns}
            rowKey="key"  // Ensures each row has a unique key
            pagination={{ total: userRoles?.totaldata }}
          />
        </div>
      ),
    },
  ];

  const filteredItems = items.filter(section => {
    if (typeof userRole !== 'string') {
      return false;  // or return true based on your requirements
    }
  
    switch (section.label) {
      case 'Manage Roles':
        return userRole === 'SuperAdmin';  // Only SuperAdmin can see Manage Roles
      case 'Manage Booking':
        return ['BM', 'LSC', 'SLC', 'SuperAdmin'].includes(userRole);  // BM, LSC, SLC, and SuperAdmin can see Manage Booking
      case 'Manage Rooms':
        return ['SuperAdmin', 'BM'].includes(userRole);  // SuperAdmin and BM can see Manage Rooms
      default:
        return true;  // Show all other sections (in case there's any new section added)
    }
  });
  

  return (
    <div className='mt-3 h-[710px] overflow-y-auto'>
     <img src="/Assets/images/manage.png" alt="manage" width={200} height={40} className="mt-16 mb-6" />

     <Collapse accordion>
        {filteredItems.map(item => (
          <Panel header={item.label} key={item.key} className='bg-[#EB8317]' style={{borderRadius: 7}}>
            <div>{item.content}</div>
          </Panel>
        ))}
      </Collapse>
      <DeleteConfirmationModal
        visible={isConfirmModalVisible}
        onConfirm={handleDeleteBuilding}
        onCancel={() => setConfirmModalVisible(false)}
      />

      {/* Success Modal */}
      <DeleteSuccessModal
        visible={isSuccessModalVisible}
        isSuccess={isSuccess}
        onConfirm={closeSuccessModal}
        onCancel={closeSuccessModal}
      />
      <DeleteRoomConfirmationModal
        visible={isRoomConfirmModalVisible}
        onConfirm={handleDeleteRoom}
        onCancel={() => setRoomConfirmModalVisible(false)}
      />

      {/* Success Modal */}
      <DeleteRoomSuccessModal
        visible={isRoomSuccessModalVisible}
        isSuccess={isSuccessRoom}
        onConfirm={closeRoomSuccessModal}
        onCancel={closeRoomSuccessModal}
      />
      <DeleteGroupConfirmationModal
        visible={isGroupConfirmModalVisible}
        onConfirm={handleDeleteGroup}
        onCancel={() => setGroupConfirmModalVisible(false)}
      />

      {/* Success Modal */}
      <DeleteGroupSuccessModal
        visible={isGroupSuccessModalVisible}
        isSuccess={isSuccessGroup}
        onConfirm={closeGroupSuccessModal}
        onCancel={closeGroupSuccessModal}
      />
    </div>
  );
};

ManagePage.layout = WithDefaultLayout;
export default ManagePage;

