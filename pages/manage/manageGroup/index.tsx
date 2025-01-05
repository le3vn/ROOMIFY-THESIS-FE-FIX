import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Input, Spin, Select } from 'antd';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useFetchWithAccessToken } from '@/functions/useFetchWithAccessToken';
import { BackendApiUrl } from '@/functions/BackendApiUrl';
import { WithDefaultLayout } from '@/components/DefautLayout';
import useSWR from 'swr';
import { useSwrFetcherWithAccessToken } from '@/functions/useSwrFetcherWithAccessToken';
import AddGroupSuccessModal from '@/components/Modals/ManageModals/ManageRoomModals/AddGroupSuccess';
import GroupConfirmationModal from '@/components/Modals/ManageModals/ManageRoomModals/AddGroupConfirm';

interface UserData {
    userId: string;
    userName: string;
}

interface UserList {
    users: UserData[];
    totalData: number;
}

const AddGroupPage = () => {
    const router = useRouter();
    const swrFetcher = useSwrFetcherWithAccessToken();
    const [isSending, setIsSending] = useState(false);
    const [isConfirmationModalVisible, setConfirmationModalVisible] = useState(false);
    const { fetchPOSTWithFormData } = useFetchWithAccessToken();
    const [isSuccess, setIsSuccess] = useState(false);
    const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);

    const [formData, setFormData] = useState({
        lscApprover: '',
        ssoApprover: '',
        slcApprover: '',
        bmApprover: '',
        groupName: ''
    });

    // Fetch users based on selected role dynamically
    const FetchUsersForRole = (role: string) => {
        return useSWR<UserList>(`${BackendApiUrl.getUser}?RoleName=${role}`, swrFetcher);
    };

    // Fetch users for each role
    const { data: ssoData } = FetchUsersForRole('SSO');
    const { data: lscData } = FetchUsersForRole('LSC');
    const { data: slcData } = FetchUsersForRole('SLC');
    const { data: bmData } = FetchUsersForRole('BM');

    // Handle submit action
    const handleSubmit = async () => {
        setConfirmationModalVisible(false); // Hide confirmation modal
        setIsSending(true);

        const payload = new FormData();
        payload.append('GroupName', formData.groupName);
        payload.append('SSOApprover', formData.ssoApprover);
        payload.append('LSCApprover', formData.lscApprover);
        payload.append('SLCApprover', formData.slcApprover);
        payload.append('BMApprover', formData.bmApprover);

        try {
            await fetchPOSTWithFormData(BackendApiUrl.createGroup, payload);
            setIsSuccess(true); // Set success state
        } catch (error) {
            setIsSuccess(false); // Set failure state
        } finally {
            setIsSending(false);
            setSuccessModalVisible(true); // Show success/failure modal
        }
    };

    const handleBackButton = () => {
        router.back();
    };

    // Handle change for each approver and set the corresponding role
    const handleApproverChange = (role: string, value: string) => {
        setFormData({ ...formData, [`${role}Approver`]: value });
    };

    return (
        <div className="mt-4 h-[710px] overflow-y-auto">
            <button className="bg-white rounded-full w-10 h-10 flex items-center justify-center" onClick={handleBackButton}>
                <FontAwesomeIcon icon={faChevronLeft} className="inline" />
            </button>
            <div>
                <img src="/Assets/images/add-group.png" alt="manage" width={410} height={40} className="mt-6 mb-6" />
                <div>
                    <p className="text-white font-normal text-base mb-2">Group Name</p>
                    <Input
                        value={formData.groupName}
                        onChange={(e) => setFormData({ ...formData, groupName: e.target.value })}
                        placeholder="Enter room capacity"
                        className="w-full mb-3 rounded-md"
                    />
                </div>
                <div>
                    <p className="text-white font-normal text-base mb-2">SSO Approver</p>
                    <Select
                        value={formData.ssoApprover}
                        onChange={(value) => handleApproverChange('sso', value)}
                        placeholder="Select SSO approver"
                        className="w-full mb-3 rounded-md"
                        options={ssoData?.users.map((user) => ({
                            label: user.userName,
                            value: user.userId
                        }))}
                    />
                </div>
                <div>
                    <p className="text-white font-normal text-base mb-2">LSC Approver</p>
                    <Select
                        value={formData.lscApprover}
                        onChange={(value) => handleApproverChange('lsc', value)}
                        placeholder="Select LSC approver"
                        className="w-full mb-3 rounded-md"
                        options={lscData?.users.map((user) => ({
                            label: user.userName,
                            value: user.userId
                        }))}
                    />
                </div>
                <div>
                    <p className="text-white font-normal text-base mb-2">SLC Approver</p>
                    <Select
                        value={formData.slcApprover}
                        onChange={(value) => handleApproverChange('slc', value)}
                        placeholder="Select SLC approver"
                        className="w-full mb-3 rounded-md"
                        options={slcData?.users.map((user) => ({
                            label: user.userName,
                            value: user.userId
                        }))}
                    />
                </div>
                <div>
                    <p className="text-white font-normal text-base mb-2">BM Approver</p>
                    <Select
                        value={formData.bmApprover}
                        onChange={(value) => handleApproverChange('bm', value)}
                        placeholder="Select BM approver"
                        className="w-full mb-3 rounded-md"
                        options={bmData?.users.map((user) => ({
                            label: user.userName,
                            value: user.userId
                        }))}
                    />
                </div>
                <div className="mt-6 flex justify-center">
                    <Spin spinning={isSending}>
                        <button
                            onClick={() => setConfirmationModalVisible(true)} // Show confirmation modal
                            disabled={!formData.groupName || !formData.ssoApprover || !formData.lscApprover || !formData.slcApprover || !formData.bmApprover || isSending}
                            className="bg-purple-950 px-14 py-2 font-bold text-white rounded-full text-xl"
                        >
                            Add Room
                        </button>
                    </Spin>
                </div>
            </div>
            <GroupConfirmationModal
                visible={isConfirmationModalVisible}
                onConfirm={handleSubmit}
                onCancel={() => setConfirmationModalVisible(false)} // Close confirmation modal
            />

            {/* Success Modal */}
            <AddGroupSuccessModal
                visible={isSuccessModalVisible}
                isSuccess={isSuccess}
                onConfirm={() => {setSuccessModalVisible(false); router.push('/manage')}} // Close success modal
            />
        </div>
    );
};

AddGroupPage.layout = WithDefaultLayout;
export default AddGroupPage;
