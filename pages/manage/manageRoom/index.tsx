import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Input, Upload, Card, Image, message, Spin, Select } from 'antd';
import { faUpload, faTimes, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useFetchWithAccessToken } from '@/functions/useFetchWithAccessToken';
import { BackendApiUrl } from '@/functions/BackendApiUrl';
import { WithDefaultLayout } from '@/components/DefautLayout';
import useSWR from 'swr';
import { useSwrFetcherWithAccessToken } from '@/functions/useSwrFetcherWithAccessToken';
import ReactQuill from 'react-quill';  // Import ReactQuill
import 'react-quill/dist/quill.snow.css';  // Import Quill styles
import RoomConfirmationModal from '@/components/Modals/ManageModals/ManageRoomModals/AddRoomConfirm';
import AddRoomSuccessModal from '@/components/Modals/ManageModals/ManageRoomModals/AddRoomSuccess';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/png", "image/gif"];

export interface BuildingData {
  buildingId: number;
  name: string;
}

export interface Buildings {
  buildingList: BuildingData[];
}

export interface UserData{
  id: string;
  givenName: string;
}

export interface UserList{
  userList: UserData[];
  totalData: number;
}

export interface Group{
  id: number;
  name: string;
}

export interface GroupList{
  roomGroups: Group[];
  totalData: number;
}

const AddRoomPage = () => {
  const router = useRouter();
  const { fetchPOSTWithFormData } = useFetchWithAccessToken();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isSending, setIsSending] = useState(false);
  const swrFetcher = useSwrFetcherWithAccessToken();
  const [formData, setFormData] = useState({
    roomName: '',
    description: '',
    roomTypeId: '',
    buildingId: '',
    capacity: '',
    image: null as File | null,
    roomGroupId: ''
  });

  // Modal state
  const [isConfirmationModalVisible, setConfirmationModalVisible] = useState(false);
  const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { data: building } = useSWR<Buildings>(BackendApiUrl.getBuilding, swrFetcher)
  const { data: group } = useSWR<GroupList>(BackendApiUrl.getRoomGroup, swrFetcher);


  console.log(building);

  const handleBeforeUpload = (file: File) => {
    const isImage = ACCEPTED_FILE_TYPES.includes(file.type);
    const isLt5M = file.size <= MAX_FILE_SIZE;

    if (!isImage) {
      message.error('File yang di upload hanya bisa dalam format JPG, JPEG, PNG');
      return false;
    }

    if (!isLt5M) {
      message.error('File yang di upload maksimal 5 MB');
      return false;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImageUrl(reader.result as string);
      setFileName(file.name);
      setFormData({
        ...formData,
        image: file,
      });
    };
    return false; // Prevent automatic upload
  };

  const handleRemoveImage = () => {
    setImageUrl(null);
    setFileName('');
    setFormData({
      ...formData,
      image: null,
    });
  };

  const handleBackButton = () => {
    router.back();
  };

  const handleSubmit = async () => {
    if (!formData.roomName || !formData.image) {
      message.error('Please provide a room name and an image');
      return;
    }

    setConfirmationModalVisible(false); // Hide confirmation modal
    setIsSending(true);

    const payload = new FormData();
    payload.append('RoomName', formData.roomName);
    payload.append('Description', formData.description);
    payload.append('Capacity', formData.capacity);
    payload.append('BuildingId', formData.buildingId);
    payload.append('RoomTypeId', formData.roomTypeId);
    payload.append('RoomGroupId', formData.roomGroupId);
    payload.append('RoomPicture', formData.image);

    try {
      await fetchPOSTWithFormData(BackendApiUrl.createRoom, payload);
      setIsSuccess(true); // Set success state
    } catch (error) {
      setIsSuccess(false); // Set failure state
    } finally {
      setIsSending(false);
      setSuccessModalVisible(true); // Show success/failure modal
    }
  };

  const roomTypes = [
    { label: 'LAB', value: 1 },
    { label: 'CLASS', value: 2 },
    { label: 'FUNCTION', value: 3 },
    // Add more room types as needed
  ];

  const handleDescriptionChange = (value: string) => {
    if (value.length <= 250) {
      setFormData({
        ...formData,
        description: value,
      });
    } else {
      message.warning('Description must be less than 250 characters');
    }
  };

  return (
    <div className="mt-4 h-[710px] overflow-y-auto">
      <button className="bg-white rounded-full w-10 h-10 flex items-center justify-center" onClick={handleBackButton}>
        <FontAwesomeIcon icon={faChevronLeft} className="inline" />
      </button>
      <div>
        <img src="/Assets/images/add-room.png" alt="manage" width={310} height={40} className="mt-6 mb-6" />

        {/* Room Name Input */}
        <div>
          <p className="text-white font-normal text-base mb-2">Room Name</p>
          <Input
            value={formData.roomName}
            onChange={(e) => setFormData({ ...formData, roomName: e.target.value })}
            placeholder="Enter room name"
            className="w-full mb-3 rounded-md"
          />
        </div>

        {/* Description - React Quill Editor */}
        <div>
          <p className="text-white font-normal text-base mb-2">Description</p>
          <ReactQuill
            value={formData.description}
            onChange={handleDescriptionChange}
            placeholder="Enter room description (max 250 characters)"
            className='bg-white'
            modules={{
              toolbar: [
                [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                ['bold', 'italic', 'underline'],
                ['link'],
                ['blockquote'],
                [{ 'align': [] }],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'indent': '-1'}, { 'indent': '+1' }],
                [{ 'direction': 'rtl' }],
                ['clean'],
              ],
            }}
            theme="snow"
          />
        </div>

        {/* Room Type Select */}
        <div className="mt-4">
          <p className="text-white font-normal text-base mb-2">Room Type</p>
          <Select
            value={formData.roomTypeId}
            onChange={(value) => setFormData({ ...formData, roomTypeId: value })}
            placeholder="Select room type"
            className="w-full mb-3 rounded-lg"
          >
            {roomTypes.map((type) => (
              <Select.Option key={type.value} value={type.value}>
                {type.label}
              </Select.Option>
            ))}
          </Select>
        </div>

        {/* Building Select */}
        <div>
          <p className="text-white font-normal text-base mb-2">Building</p>
          <Select
            value={formData.buildingId}
            onChange={(value) => setFormData({ ...formData, buildingId: value })}
            placeholder="Select building"
            className="w-full mb-3 rounded-lg h-8"
            options={building?.buildingList.map((building) => ({
              label: building.name,
              value: building.buildingId,
            }))}
          />
        </div>

        <div>
          <p className="text-white font-normal text-base mb-2">Capacity</p>
          <Input
            value={formData.capacity}
            onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
            placeholder="Enter room capacity"
            className="w-full mb-3 rounded-md"
          />
        </div>
        <div>
          <p className="text-white font-normal text-base mb-2">Group</p>
          <Select
            value={formData.roomGroupId}
            onChange={(value) => setFormData({ ...formData, roomGroupId: value })}
            placeholder="Select building"
            className="w-full mb-3 rounded-lg h-8"
            options={group?.roomGroups.map((group) => ({
              label: group.name,
              value: group.id,
            }))}
          />
        </div>

        {/* Image Upload */}
        <div className="">
          <p className="text-white font-normal text-base mb-2">Room Image</p>
          <Upload beforeUpload={handleBeforeUpload} multiple={false} showUploadList={false}>
            <Button className="bg-white border-black text-black text-base">
              <FontAwesomeIcon icon={faUpload} className="mr-2" />Click to Upload
            </Button>
          </Upload>
          {imageUrl && (
            <Card className="mt-4 p-4 bg-[#F4F5F2] shadow-inner flex justify-center">
              <div className="w-72 h-fit">
                <div className="flex justify-center">
                  <Image
                    width={256}
                    height={150}
                    className="rounded-md object-cover max-w-[256px] max-h-[150px]"
                    src={imageUrl}
                    alt={fileName}
                  />
                </div>
                <div className="flex justify-center items-center w-full">
                  <p className="font-normal text-sm">{fileName}</p>
                  <Button type="link" onClick={handleRemoveImage}>
                    <FontAwesomeIcon icon={faTimes} className="text-red-500" />
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Submit Button */}
        <div className="mt-6 flex justify-center">
          <Spin spinning={isSending}>
            <button
              onClick={() => setConfirmationModalVisible(true)} // Show confirmation modal
              disabled={!formData.roomName || !formData.roomTypeId || !formData.image || isSending}
              className="bg-purple-950 px-14 py-2 font-bold text-white rounded-full text-xl"
            >
              Add Room
            </button>
          </Spin>
        </div>
      </div>

      {/* Confirmation Modal */}
      <RoomConfirmationModal
        visible={isConfirmationModalVisible}
        onConfirm={handleSubmit}
        onCancel={() => setConfirmationModalVisible(false)} // Close confirmation modal
      />

      {/* Success Modal */}
      <AddRoomSuccessModal
        visible={isSuccessModalVisible}
        isSuccess={isSuccess}
        onConfirm={() => {setSuccessModalVisible(false); router.push('/manage')}} // Close success modal
      />
    </div>
  );
};

AddRoomPage.layout = WithDefaultLayout;
export default AddRoomPage;
