import React, { useState } from 'react';
import { WithDefaultLayout } from '../../components/DefautLayout';
import { Page } from '../../types/Page';
import { useSwrFetcherWithAccessToken } from '@/functions/useSwrFetcherWithAccessToken';
import useSWR, { mutate } from 'swr';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import { BackendApiUrl } from '@/functions/BackendApiUrl';
import { Table, Button, Space, Tag, Modal, message } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { useFetchWithAccessToken } from '@/functions/useFetchWithAccessToken';
import ConfirmationModal from '@/components/Modals/NotificationModals/ConfirmationModal';
import SuccessModal from '@/components/Modals/NotificationModals/SuccessModal';

interface NotificationModel {
    notificationId: number;
    subject: string;
    message: string;
    readAt: string;
    createdAt: string;
    createdBy: string;
}

interface NotificationList {
    notifications: NotificationModel[];
    totalData: number;
}

const Notification: Page = () => {
    const { data: session } = useSession();
    const user = session?.user as User;
    const userId = user?.id;
    const swrFetcher = useSwrFetcherWithAccessToken();
    const { fetchPUT, fetchDELETE } = useFetchWithAccessToken();

    const { data: notification } = useSWR<NotificationList>(`${BackendApiUrl.getNotification}?UserId=${userId}`, swrFetcher);

    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]); // State for selected rows
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false); // Modal for confirmation before deleting all notifications
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false); // Success Modal state
    const [isSuccess, setIsSuccess] = useState(false); // Success state

    // Row Selection Configuration
    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedRowKeys: React.Key[]) => {
            setSelectedRowKeys(selectedRowKeys);
        },
    };

    const handleNotificationClick = async (id: number) => {
        const payload = { notificationId: id };
        await fetchPUT(BackendApiUrl.readNotification, payload);
        mutate(`${BackendApiUrl.getNotification}?UserId=${userId}`);
        mutate(`${BackendApiUrl.getNotificationUnread}?UserId=${userId}`);
    };

    const handleDelete = async (id: number) => {
        const response = await fetchDELETE<Response>(
            `${BackendApiUrl.deleteNotification}?NotificationId=${id}`
        );
        if (response.data) {
            mutate(`${BackendApiUrl.getNotification}?UserId=${userId}`);
            mutate(`${BackendApiUrl.getNotificationUnread}?UserId=${userId}`);
        }
    };

    // Handle delete all notifications confirmation
    const handleDeleteAll = () => {
        if (selectedRowKeys.length > 0) {
            setIsDeleteModalVisible(true);
        } else {
            message.error("Please select at least one notification to delete.");
        }
    };

    const confirmDeleteAll = async () => {
        setIsSuccess(false); // Reset success state

        try {
            // Loop through selected notifications and delete them individually
            for (let i = 0; i < selectedRowKeys.length; i++) {
                const notificationId = selectedRowKeys[i];
                const response = await fetchDELETE<Response>(
                    `${BackendApiUrl.deleteNotification}?NotificationId=${notificationId}`
                );

                if (!response.data) {
                    throw new Error("Failed to delete notification");
                }
            }

            // After all deletions are successful, set success state to true
            setIsSuccess(true);
            setIsSuccessModalOpen(true); // Open success modal
            // Mutate to refresh data
            mutate(`${BackendApiUrl.getNotification}?UserId=${userId}`);
            mutate(`${BackendApiUrl.getNotificationUnread}?UserId=${userId}`);
        } catch (error) {
            console.error('Error deleting notifications:', error);
        } finally {
            setIsDeleteModalVisible(false);
        }
    };

    const cancelDeleteAll = () => {
        setIsDeleteModalVisible(false);
    };

    const handleSuccessModalConfirm = () => {
        setIsSuccessModalOpen(false); // Close success modal
    };

    const handleSuccessModalCancel = () => {
        setIsSuccessModalOpen(false); // Close success modal
    };

    // Columns for the Table
    const columns = [
        {
            title: 'No',
            dataIndex: 'no',
            key: 'no',
            render: (text: string, record: NotificationModel, index: number) => index + 1,
        },
        {
            title: 'Notification',
            dataIndex: 'message',
            key: 'notificationId',
            render: (message: string, record: NotificationModel) => (
                <div className="flex items-center" onClick={() => handleNotificationClick(record.notificationId)}>
                    <div>
                        <div className='flex'>
                            <p className='text-base font-bold mr-2'>{record.subject}</p>
                            <span>{record.readAt === null && <Tag color="red" className="mr-2">New</Tag>}</span>
                        </div>
                        <p>{message}</p>
                        <p className='text-xs text-gray-500'>{record.createdAt} - {record.createdBy}</p>
                    </div>
                </div>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: NotificationModel) => (
                <Space size="middle">
                    <button
                        onClick={() => handleDelete(record.notificationId)}
                    >
                        <FontAwesomeIcon icon={faTrash} className='text-red-500'/>
                    </button>
                </Space>
            ),
        },
    ];

    return (
        <div className="mt-3 h-[650px]">
            <img src="/Assets/images/notification.png" alt="Ongoing" width={310} height={40} className="mt-16" />

            <div className="flex justify-end mt-4 mb-6">
                <button 
                    onClick={handleDeleteAll}
                    className='bg-red-500 w-10 h-10 rounded-xl'
                >
                    <FontAwesomeIcon icon={faTrash} className='text-white'/>
                </button>
            </div>

            <Table
                rowSelection={rowSelection}
                columns={columns}
                dataSource={notification?.notifications}
                rowKey="notificationId"
                pagination={false}
                scroll={{ y: 700 }} // Enable vertical scrolling if the table is long
            />

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                visible={isDeleteModalVisible}
                onConfirm={confirmDeleteAll}
                onCancel={cancelDeleteAll}
            />

            {/* Success Modal */}
            <SuccessModal
                visible={isSuccessModalOpen}
                onConfirm={handleSuccessModalConfirm}
                onCancel={handleSuccessModalCancel}
                isSuccess={isSuccess}
            />
        </div>
    );
};

Notification.layout = WithDefaultLayout;
export default Notification;
