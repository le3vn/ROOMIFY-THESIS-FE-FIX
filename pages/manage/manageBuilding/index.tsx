import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Input, Upload, Card, Image, message, Spin } from 'antd';
import { faUpload, faTimes, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useFetchWithAccessToken } from '@/functions/useFetchWithAccessToken';
import { BackendApiUrl } from '@/functions/BackendApiUrl';
import { WithDefaultLayout } from '@/components/DefautLayout';
import AddBuildingSuccessModal from '@/components/Modals/ManageModals/ManageBuildingModals/AddBuildingSuccess';
import BuildingConfirmationModal from '@/components/Modals/ManageModals/ManageBuildingModals/AddBuildingConfirm';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/png", "image/gif"];

const AddBuildingPage = () => {
  const router = useRouter();
  const { fetchPOSTWithFormData } = useFetchWithAccessToken();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isSending, setIsSending] = useState(false);
  const [formData, setFormData] = useState({
    buildingName: '',
    image: null as File | null,
  });

  // Modal state
  const [isConfirmationModalVisible, setConfirmationModalVisible] = useState(false);
  const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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
    if (!formData.buildingName || !formData.image) {
      message.error('Please provide a building name and an image');
      return;
    }

    setConfirmationModalVisible(false); // Hide confirmation modal
    setIsSending(true);

    const payload = new FormData();
    payload.append('BuildingName', formData.buildingName);
    payload.append('BuildingPicture', formData.image);

    try {
      await fetchPOSTWithFormData(BackendApiUrl.createBuilding, payload);
      setIsSuccess(true); // Set success state
    } catch (error) {
      setIsSuccess(false); // Set failure state
    } finally {
      setIsSending(false);
      setSuccessModalVisible(true); // Show success/failure modal
    }
  };

  return (
    <div className="mt-4">
      <button className="bg-white rounded-full w-10 h-10 flex items-center justify-center" onClick={handleBackButton}>
        <FontAwesomeIcon icon={faChevronLeft} className="inline" />
      </button>
      <div>
        <img src="/Assets/images/add-building.png" alt="manage" width={310} height={40} className="mt-6 mb-6" />
        <div>
          <p className="text-white font-normal text-base mb-2">Building Name</p>
          <Input
            value={formData.buildingName}
            onChange={(e) => setFormData({ ...formData, buildingName: e.target.value })}
            placeholder="Enter building name"
            className="w-full mb-3 rounded-lg h-8"
          />
        </div>
        <div className="mt-4">
          <p className="text-white font-normal text-base mb-2">Building Image</p>
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
        <div className="mt-6 flex justify-center">
          <Spin spinning={isSending}>
            <button
              onClick={() => setConfirmationModalVisible(true)} // Show confirmation modal
              disabled={!formData.buildingName || !formData.image || isSending}
              className="bg-purple-950 px-14 py-2 font-bold text-white rounded-full text-xl"
            >
              Add Building
            </button>
          </Spin>
        </div>
      </div>

      {/* Confirmation Modal */}
      <BuildingConfirmationModal
        visible={isConfirmationModalVisible}
        onConfirm={handleSubmit}
        onCancel={() => setConfirmationModalVisible(false)} // Close confirmation modal
      />

      {/* Success Modal */}
      <AddBuildingSuccessModal
        visible={isSuccessModalVisible}
        isSuccess={isSuccess}
        onConfirm={() => {setSuccessModalVisible(false); router.push('/manage')}} // Close success modal
      />
    </div>
  );
};

AddBuildingPage.layout = WithDefaultLayout;
export default AddBuildingPage;
