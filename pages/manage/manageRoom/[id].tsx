import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button, Input, Select, Upload, message } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faTimes, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { useForm, Controller } from 'react-hook-form';
import { BackendApiUrl } from '@/functions/BackendApiUrl';
import { useFetchWithAccessToken } from '@/functions/useFetchWithAccessToken';
import { useSwrFetcherWithAccessToken } from '@/functions/useSwrFetcherWithAccessToken';
import useSWR from 'swr';
import { WithDefaultLayout } from '@/components/DefautLayout';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import EditRoomSuccessModal from '@/components/Modals/ManageModals/ManageRoomModals/EditRoomSuccess';
import EditRoomConfirmationModal from '@/components/Modals/ManageModals/ManageRoomModals/EditRoomConfirm';
import { GroupList, UserList } from '.';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

interface BuildingData {
  buildingId: number;
  name: string;
}

interface Buildings {
  buildingList: BuildingData[];
  totalData: number;
}

interface RoomData {
  name: string;
  description: string;
  roomTypeId: number;
  roomType: string;
  buildingId: number;
  building: string;
  capacity: number;
  roomGroupId: number;
  roomGroup: string;
  minioUrl: string;
}

const EditRoomPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { fetchPOSTWithFormData } = useFetchWithAccessToken();
  const fetcher = useSwrFetcherWithAccessToken();

  const { data: roomData } = useSWR<RoomData>(`${BackendApiUrl.getAllRoomDetail}?id=${id}`, fetcher);
  const { data: building } = useSWR<Buildings>(BackendApiUrl.getBuilding, fetcher);
  const { data: group } = useSWR<GroupList>(BackendApiUrl.getRoomGroup, fetcher);

  const { handleSubmit, control, setValue, reset } = useForm();

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');

  const [isConfirmationModalVisible, setConfirmationModalVisible] = useState(false);
  const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (roomData) {
      reset({
        RoomName: roomData.name,
        Description: roomData.description,
        RoomTypeId: roomData.roomTypeId,
        BuildingId: roomData.buildingId,
        Capacity: roomData.capacity,
        RoomGroupId: roomData.roomGroupId,
      });
      setImageUrl(roomData.minioUrl);
      const imageName = decodeURIComponent(roomData.minioUrl.split('/').pop()?.split('?')[0] || '');
      setFileName(imageName);
    }
  }, [roomData, reset]);

  // Simple Validation Function
  const validateForm = (values: any) => {
    const errors: any = {};

    // RoomName validation
    if (!values.RoomName || values.RoomName.trim().length === 0) {
      errors.RoomName = 'Nama Kosong';
    }

    // Description validation (max 250 characters)
    if (values.Description && values.Description.length > 250) {
      errors.Description = 'Deskripsi maksimal 250 karakter';
    }

    // RoomPicture validation
    if (values.RoomPicture && !ACCEPTED_FILE_TYPES.includes(values.RoomPicture.type)) {
      errors.RoomPicture = 'File yang di upload hanya bisa dalam format JPG, JPEG, PNG';
    }
    if (values.RoomPicture && values.RoomPicture.size > MAX_FILE_SIZE) {
      errors.RoomPicture = 'File yang di upload maksimal 5 MB';
    }

    // Capacity validation (should be a number)
    if (!values.Capacity || isNaN(values.Capacity)) {
      errors.Capacity = 'Capacity harus berupa angka';
    }

    return errors;
  };

  const onSubmit = async (values: any) => {
    const errors = validateForm(values);

    if (Object.keys(errors).length > 0) {
      for (const errorField in errors) {
        message.error(errors[errorField]);
      }
      return;
    }

    const formData = new FormData();
    formData.append('Name', values.RoomName);
    formData.append('Description', values.Description);
    formData.append('RoomTypeId', values.RoomTypeId.toString());
    formData.append('BuildingId', values.BuildingId.toString());
    formData.append('Capacity', values.Capacity.toString());
    formData.append('RoomGroupId', values.RoomGroupId.toString());
    if (values.RoomPicture) {
      formData.append('RoomPicture', values.RoomPicture);
    }

    try {
      await fetchPOSTWithFormData(BackendApiUrl.editRoom(id as string), formData);
      setIsSuccess(true); // Set success state
      setSuccessModalVisible(true); // Show success modal
    } catch (error) {
      setIsSuccess(false); // Set failure state
      setSuccessModalVisible(true); // Show failure modal
      console.error('Update failed:', error);
    }
  };

  const handleBeforeUpload = (file: File) => {
    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      message.error('File yang di upload hanya bisa dalam format JPG, JPEG, PNG');
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      message.error('File yang di upload maksimal 5 MB');
      return false;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImageUrl(reader.result as string);
      setFileName(file.name);
      setValue('RoomPicture', file); // Set file to form value
    };
    return false;
  };

  const handleRemoveImage = () => {
    setImageUrl(null);
    setFileName('');
    setValue('RoomPicture', null); // Clear the form field
  };

  const handleBackButton = () => {
    router.back();
  };

  // Open confirmation modal
  const handleConfirmationCancel = () => {
    setConfirmationModalVisible(false);
  };

  // After confirmation, submit the form
  const handleConfirmationConfirm = () => {
    setConfirmationModalVisible(false); // Close confirmation modal
    handleSubmit(onSubmit)(); // Proceed with form submission
  };

  const handleSuccessConfirm = () => {
    setSuccessModalVisible(false);
    router.push('/manage'); // Redirect after success
  };

  return (
    <div className="mt-4">
      <button className="bg-white rounded-full w-10 h-10 flex items-center justify-center" onClick={handleBackButton}>
        <FontAwesomeIcon icon={faChevronLeft} className="inline" />
      </button>
      <div>
        <img src="/Assets/images/edit-room.png" alt="manage" width={310} height={40} className="mt-6 mb-6" />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-white font-normal text-base mb-2">Building Name</label>
            <Controller
              name="RoomName"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter building name" className="w-full mb-3 rounded-lg h-8" />
              )}
            />
          </div>
          <div>
            <label className="block text-white font-normal text-base mb-2">Description</label>
            <Controller
              name="Description"
              control={control}
              render={({ field }) => (
                <ReactQuill
                  {...field}
                  className="bg-white"
                  theme="snow"
                />
              )}
            />
          </div>
          <div>
            <label className="block text-white font-normal text-base mb-2">Room Type</label>
            <Controller
              name="RoomTypeId"
              control={control}
              render={({ field }) => (
                <Select {...field} 
                placeholder="Select room type" 
                className="w-full mb-3 rounded-lg h-8" 
                options={[
                    { value: 1, label: "LAB" },
                    { value: 2, label: "CLASS" },
                    { value: 3, label: "FUNCTION" },
                  ]}
                />
              )}
            />
          </div>
          <div>
            <label className="block text-white font-normal text-base mb-2">Building</label>
            <Controller
              name="BuildingId"
              control={control}
              render={({ field }) => (
                <Select {...field} 
                placeholder="Select building" 
                className="w-full mb-3 rounded-lg h-8" 
                options={building?.buildingList.map((building) => (
                    {
                        value: building.buildingId,
                        label: building.name
                    }
                ))}
                />
              )}
            />
          </div>
          <div>
            <label className="block text-white font-normal text-base mb-2">Capacity</label>
            <Controller
              name="Capacity"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter capacity" className="w-full mb-3 rounded-lg h-8" />
              )}
            />
          </div>
          <div>
            <label className="block text-white font-normal text-base mb-2">Room Group</label>
            <Controller
              name="RoomGroupId"
              control={control}
              render={({ field }) => (
                <Select {...field} 
                placeholder="Select room group" 
                className="w-full mb-3 rounded-lg h-8" 
                options={group?.roomGroups.map((group) => (
                    {
                        value: group.id,
                        label: group.name
                    }
                ))}
                />
              )}
            />
          </div>

          <div>
            <label className="block text-white font-normal text-base mb-2">Building Image</label>
            <Upload beforeUpload={handleBeforeUpload} showUploadList={false}>
              <Button className="bg-white border-black text-black text-base">
                <FontAwesomeIcon icon={faUpload} className="mr-2" />Click to Upload
              </Button>
            </Upload>
          </div>

          {imageUrl && (
            <div className="relative w-full flex justify-center bg-[#F4F5F2] rounded-md p-5">
              <div className="w-[256px] h-[150px] relative overflow-hidden rounded-md">
                <img src={imageUrl} alt={fileName} className="object-cover w-full h-full" />
                <button
                  className="absolute top-0 right-0 text-red-600 rounded-full p-2"
                  onClick={handleRemoveImage}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
            </div>
          )}

          <div className="flex justify-center mt-6">
            <button
              type="button"
              className="bg-purple-950 px-14 py-2 font-bold text-white rounded-full text-xl"
              onClick={() => setConfirmationModalVisible(true)} // Open confirmation modal first
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>

      {/* Confirmation Modal */}
      <EditRoomConfirmationModal
        visible={isConfirmationModalVisible}
        onConfirm={handleConfirmationConfirm} // After confirmation, submit form
        onCancel={handleConfirmationCancel} // Cancel the confirmation
      />

      {/* Success Modal */}
      <EditRoomSuccessModal
        visible={isSuccessModalVisible}
        onConfirm={handleSuccessConfirm} // Close the success modal
        isSuccess={isSuccess}
        onCancel={handleSuccessConfirm} // Close on cancel
      />
    </div>
  );
};

EditRoomPage.layout = WithDefaultLayout;
export default EditRoomPage;
