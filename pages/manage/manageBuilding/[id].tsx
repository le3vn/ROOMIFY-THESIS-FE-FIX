import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button, Input, Upload, message } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faTimes, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { BackendApiUrl } from '@/functions/BackendApiUrl';
import { useFetchWithAccessToken } from '@/functions/useFetchWithAccessToken';
import { useSwrFetcherWithAccessToken } from '@/functions/useSwrFetcherWithAccessToken';
import useSWR from 'swr';
import EditConfirmationModal from '@/components/Modals/ManageModals/ManageBuildingModals/EditBuildingConfirm';
import EditSuccessModal from '@/components/Modals/ManageModals/ManageBuildingModals/EditBuildingSuccess';
import { WithDefaultLayout } from '@/components/DefautLayout';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

const buildingSchema = z.object({
  Name: z.string().min(1, 'Nama Kosong'),
  BuildingPicture: z
    .any()
    .nullable()
    .refine(
      (file) => file === null || file.size <= MAX_FILE_SIZE,
      'File yang di upload maksimal 5 MB'
    )
    .refine(
      (file) => file === null || ACCEPTED_FILE_TYPES.includes(file.type),
      'File yang di upload hanya bisa dalam format JPG, JPEG, PNG'
    ),
});

const EditBuildingPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { fetchPOSTWithFormData } = useFetchWithAccessToken();
  const fetcher = useSwrFetcherWithAccessToken();

  const { data: buildingData } = useSWR(
    id ? BackendApiUrl.getBuildingDetail(id as string) : null,
    fetcher,
    { revalidateOnFocus: false, revalidateOnReconnect: false }
  );

  const { handleSubmit, control, setValue, reset } = useForm<z.infer<typeof buildingSchema>>({
    resolver: zodResolver(buildingSchema),
  });

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');

  const [isConfirmationModalVisible, setConfirmationModalVisible] = useState(false);
  const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (buildingData) {
      reset({
        Name: buildingData.name,
        BuildingPicture: null,
      });
      setImageUrl(buildingData.minioUrl);
      const imageName = decodeURIComponent(buildingData.minioUrl.split('/').pop()?.split('?')[0] || '');
      setFileName(imageName);
    }
  }, [buildingData, reset]);

  // Submit function
  const onSubmit = async (values: z.infer<typeof buildingSchema>) => {
    const formData = new FormData();
    formData.append('Name', values.Name);
    if (values.BuildingPicture) {
      formData.append('BuildingPicture', values.BuildingPicture);
    }

    try {
      await fetchPOSTWithFormData(BackendApiUrl.editBuilding(id as string), formData);
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
      setValue('BuildingPicture', file, { shouldValidate: true });
    };
    return false;
  };

  const handleRemoveImage = () => {
    setImageUrl(null);
    setFileName('');
    setValue('BuildingPicture', null, { shouldValidate: true });
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
    router.push('/manage')
    // Optionally, you can redirect or perform another action after success
  };

  return (
    <div className="mt-4">
      <button className="bg-white rounded-full w-10 h-10 flex items-center justify-center" onClick={handleBackButton}>
        <FontAwesomeIcon icon={faChevronLeft} className="inline" />
      </button>
      <div>
        <img src="/Assets/images/edit-building.png" alt="manage" width={310} height={40} className="mt-6 mb-6" />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-white font-normal text-base mb-2">Building Name</label>
            <Controller
              name="Name"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter building name" className="w-full mb-3 rounded-lg h-8" />
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
      <EditConfirmationModal
        visible={isConfirmationModalVisible}
        onConfirm={handleConfirmationConfirm} // After confirmation, submit form
        onCancel={handleConfirmationCancel} // Cancel the confirmation
      />

      {/* Success Modal */}
      <EditSuccessModal
        visible={isSuccessModalVisible}
        onConfirm={handleSuccessConfirm} // Close the success modal
        isSuccess={isSuccess}
        onCancel={handleSuccessConfirm} // Close on cancel
      />
    </div>
  );
};

EditBuildingPage.layout = WithDefaultLayout;
export default EditBuildingPage;
