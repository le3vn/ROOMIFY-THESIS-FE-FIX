import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button, Input, Select, Upload, message } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faTimes, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { BackendApiUrl } from '@/functions/BackendApiUrl';
import { useFetchWithAccessToken } from '@/functions/useFetchWithAccessToken';
import { useSwrFetcherWithAccessToken } from '@/functions/useSwrFetcherWithAccessToken';
import useSWR from 'swr';
import { WithDefaultLayout } from '@/components/DefautLayout';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import EditRoomSuccessModal from '@/components/Modals/ManageModals/ManageRoomModals/EditRoomSuccess';
import EditRoomConfirmationModal from '@/components/Modals/ManageModals/ManageRoomModals/EditRoomConfirm';

interface GroupDetail{
    groupName: string,
    ssoApprover: string,
    slcApprover: string,
    lscApprover: string,
    bmApprover: string
}

interface UserData {
    userId: string;
    userName: string;
}

interface UserList {
    users: UserData[];
    totalData: number;
}

const roomSchema = z.object({
  GroupName: z.string(),
  LSCApprover: z.string(),
  SLCApprover: z.string(),
  SSOApprover: z.string(),
  BMApprover: z.string(),
});

const EditRoomPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { fetchPOSTWithFormData } = useFetchWithAccessToken();
  const fetcher = useSwrFetcherWithAccessToken();

  const { data: group } = useSWR<GroupDetail>(`${BackendApiUrl.getGroupDetail}?id=${id}`, fetcher);

  const { handleSubmit, control, setValue, reset } = useForm<z.infer<typeof roomSchema>>({
    resolver: zodResolver(roomSchema),
  });

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');

  const [isConfirmationModalVisible, setConfirmationModalVisible] = useState(false);
  const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const FetchUsersForRole = (role: string) => {
    return useSWR<UserList>(`${BackendApiUrl.getUser}?RoleName=${role}`, fetcher);
};

// Fetch users for each role
    const { data: ssoData } = FetchUsersForRole('SSO');
    const { data: lscData } = FetchUsersForRole('LSC');
    const { data: slcData } = FetchUsersForRole('SLC');
    const { data: bmData } = FetchUsersForRole('BM');

  useEffect(() => {
    if (group) {
      reset({
        GroupName: group.groupName,
        SSOApprover: group.ssoApprover,
        LSCApprover: group.lscApprover,
        SLCApprover: group.slcApprover,
        BMApprover: group.bmApprover
      });
    }
  }, [group, reset]);

  // Submit function
  const onSubmit = async (values: z.infer<typeof roomSchema>) => {
    const formData = new FormData();
    formData.append('GroupName', values.GroupName);
    formData.append('SSOApprover', values.SSOApprover);
    formData.append('SLCApprover', values.SLCApprover);
    formData.append('LSCApprover', values.LSCApprover);
    formData.append('BMApprover', values.BMApprover);
   
    try {
      await fetchPOSTWithFormData(BackendApiUrl.editGroup(id as string), formData);
      setIsSuccess(true); // Set success state
      setSuccessModalVisible(true); // Show success modal
    } catch (error) {
      setIsSuccess(false); // Set failure state
      setSuccessModalVisible(true); // Show failure modal
      console.error('Update failed:', error);
    }
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
        <img src="/Assets/images/edit-group.png" alt="manage" width={410} height={40} className="mt-6 mb-6" />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-white font-normal text-base mb-2">Group Name</label>
            <Controller
              name="GroupName"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter group name" className="w-full mb-3 rounded-lg h-8" />
              )}
            />
          </div>
          <div>
            <label className="block text-white font-normal text-base mb-2">SSO Approver</label>
            <Controller
              name="SSOApprover"
              control={control}
              render={({ field }) => (
                <Select {...field} 
                placeholder="Enter SSO Approver" 
                className="w-full mb-3 rounded-lg h-8" 
                options={ssoData?.users.map((user) => ({
                    label: user.userName,
                    value: user.userId
                }))}
                />
              )}
            />
          </div>
          <div>
            <label className="block text-white font-normal text-base mb-2">SLC Approver</label>
            <Controller
              name="SLCApprover"
              control={control}
              render={({ field }) => (
                <Select {...field} 
                placeholder="Enter SLC Approver" 
                className="w-full mb-3 rounded-lg h-8" 
                options={slcData?.users.map((user) => ({
                    label: user.userName,
                    value: user.userId
                }))}
                />
              )}
            />
          </div>
          <div>
            <label className="block text-white font-normal text-base mb-2">LSC Approver</label>
            <Controller
              name="LSCApprover"
              control={control}
              render={({ field }) => (
                <Select {...field} 
                placeholder="Enter LSC Approver" 
                className="w-full mb-3 rounded-lg h-8" 
                options={lscData?.users.map((user) => ({
                    label: user.userName,
                    value: user.userId
                }))}
                />
              )}
            />
          </div>
          <div>
            <label className="block text-white font-normal text-base mb-2">BM Approver</label>
            <Controller
              name="BMApprover"
              control={control}
              render={({ field }) => (
                <Select {...field} 
                placeholder="Enter BM Approver" 
                className="w-full mb-3 rounded-lg h-8" 
                options={bmData?.users.map((user) => ({
                    label: user.userName,
                    value: user.userId
                }))}
                />
              )}
            />
          </div>

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
