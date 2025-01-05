import React, { useState, useCallback } from 'react';
import { WithDefaultLayout } from '../../components/DefautLayout';
import { Page } from '../../types/Page';
import { ConfigProvider, Input, Select, Button, Table, message } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faPen, faPlus, faRefresh, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useDebounce } from 'use-debounce';
import HeaderPage from "@/components/HeaderPage";
import { useSession } from 'next-auth/react';
import { User } from 'next-auth';
import router, { useRouter } from 'next/router';
import useSWR, { mutate } from 'swr';
import { BackendApiUrl } from '@/functions/BackendApiUrl';
import { useSwrFetcherWithAccessToken } from '@/functions/useSwrFetcherWithAccessToken';
import BookingCards from '@/components/BookingsCard';
import { useFetchWithAccessToken } from '@/functions/useFetchWithAccessToken';
import ConfirmationModal from '@/components/Modals/BlockerModals/DeleteConfirmationModal';
import SuccessModal from '@/components/Modals/BlockerModals/DeleteSuccessModal';
import DeactiveConfirmationModal from '@/components/Modals/BlockerModals/DeactiveConfirmationModal';
import ActivateConfirmationModal from '@/components/Modals/BlockerModals/ActivateConfirmationModal';
import DeactiveSuccessModal from '@/components/Modals/BlockerModals/DeactiveSuccessModal';

interface BlockerInfo {
    blockerId: number;
    blockerName: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
}

interface BlockerList {
    blockerLists: BlockerInfo[];
    totalData: number;
}

const Blocker: Page = () => {

    const swrFetcher = useSwrFetcherWithAccessToken();
    const { fetchDELETE, fetchPOST } = useFetchWithAccessToken();
    const { data: blockeList } = useSWR<BlockerList>(BackendApiUrl.getBlockerList, swrFetcher);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSuccesModalOpen, setIsSuccessModalOpen] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [blocker, setBlocker] = useState(0);

    const [isDeactiveModalOpen, setIsDeactiveModalOpen] = useState(false);
    const [isActivateModalOpen, setActivateModalOpen] = useState(false);
    const [deactiveId, setDeactiveId] = useState(0);
    const [isSuccessDeactive, setIsSuccessDeactive] = useState(false);
    const [isSuccesDeactiveModalOpen, setIsSuccessDeactiveModalOpen] = useState(false);
    


    const handleDeleteBlocker = async () => {
        try{
            const response = await fetchDELETE(`${BackendApiUrl.deleteBlocker}?BlockerId=${blocker}`)
            if(response){
                setIsSuccess(true)
                mutate(BackendApiUrl.getBlockerList);
            }
            else{
                setIsSuccess(false)
            }
        }
        catch (error) {
            setIsSuccess(false)
            message.error('An error occurred while deleting blocker.');
        }
    }

    const handleDeactiveBlocker = async () => {

        const payload = {
            BlockerId: deactiveId
        }
        try{
            const response = await fetchPOST(BackendApiUrl.deactiveBlocker, payload)
            if(response){
                setIsSuccessDeactive(true)
                mutate(BackendApiUrl.getBlockerList);
            }
            else{
                setIsSuccessDeactive(false)
            }
        }
        catch (error) {
            setIsSuccessDeactive(false)
            message.error('An error occurred while updating blocker.');
        }
    }

    const blockerTable = blockeList?.blockerLists.map((blocker, index) => {
        let active;

        if(blocker.isActive){
            active = "ACTIVE"
        }
        else{
            active = "INACTIVE"
        }
        return {
            key: blocker.blockerId,
            blockerName: blocker.blockerName,
            startDate: blocker.startDate,
            endDate: blocker.endDate,
            BlockerId: blocker.blockerId,
            isActive: active,
            no: index + 1,
            action: 'View',
        };
    });

    const blockerColumns = [
        {
            title: 'No.',
            dataIndex: 'no',
            key: 'no',
            render: (text: string, record: any, index: number) => index + 1,
        },
        {
            title: 'Blocker Name',
            dataIndex: 'blockerName',
            key: 'blockerName',
        },
        {
            title: 'Start Date',
            dataIndex: 'startDate',
            key: 'startDate',
        },
        {
            title: 'End Date',
            dataIndex: 'endDate',
            key: 'endDate',
        },
        {
            title: 'Status',
            dataIndex: 'isActive',
            key: 'isActive',
            render: (text: string, record: any) => (
                <div className='flex items-center'>
                  <div className={`${record.isActive == 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'} w-4 h-4 rounded-full mr-4`}></div>
                  <p>{record.isActive}</p>
                </div>
              )
        },
        {
            title: 'Action',
            dataIndex: 'id',
            key: 'id',
            render: (text: string, record: any) => (
            <div className='flex gap-4'>
                <button className='w-8 h-8 bg-purple-950 text-white rounded-full' onClick={() => router.push(`/blocker/${record.BlockerId}`)}>
                    <FontAwesomeIcon icon={faPen} />
                </button>
                <button
                className='w-8 h-8 bg-red-600 text-white rounded-full'
                onClick={() => handleModalOpen(record.BlockerId)}
                >
                <FontAwesomeIcon icon={faTrash} />
                </button>
                <button
                className={`w-8 h-8 ${record.isActive == 'ACTIVE' ? 'bg-red-600' : 'bg-purple-950'} text-white rounded-full`}
                onClick={() => handleDeactiveModalOpen(record.BlockerId, record.isActive)}
                >
                <FontAwesomeIcon icon={faRefresh} />
                </button>
            </div>
            ),
        },
    ];

    const handleModalOpen = (id: number) => {
        setIsModalOpen(true);
        setBlocker(id)
    };

    const handleDeactiveModalOpen = (id: number, isActive: string) => {
        if(isActive == 'ACTIVE'){
            setIsDeactiveModalOpen(true)
        }
        else if(isActive == 'INACTIVE'){
            setActivateModalOpen(true)
        }

        setDeactiveId(id)
    }

    const handleDeactiveConfirm = () => {
        handleDeactiveBlocker(); 
        setIsDeactiveModalOpen(false); 
        setIsSuccessDeactiveModalOpen(true)
    };

    const handleActivateConfirm = () => {
        handleDeactiveBlocker(); 
        setActivateModalOpen(false); 
        setIsSuccessDeactiveModalOpen(true)
    };

    const handleSuccessDeactiveModalConfirm = () => {
        setIsSuccessDeactiveModalOpen(false);
    }

    const handleModalConfirm = () => {
        handleDeleteBlocker(); 
        setIsModalOpen(false); 
        setIsSuccessModalOpen(true)
    };

    const handleSuccessModalConfirm = () => {
        setIsSuccessModalOpen(false);
        router.push('/blocker')
    }
    
    const handleSuccessModalCancel= () => {
        setIsSuccessModalOpen(false);
    }

    const handleSuccessDeactiveModalCancel= () => {
        setIsSuccessDeactiveModalOpen(false);
    }

    const handleDeactiveModalCancel = () => {
        setIsDeactiveModalOpen(false);
    };

    const handleActivateModalCancel = () => {
        setActivateModalOpen(false);
    };

    const handleModalCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <div className='mt-3 h-[710px] overflow-y-auto'>
            <img src="/Assets/images/blocker.png" alt="Ongoing" width={210} height={40} className="mt-16" />
            <div className='mt-8 flex justify-end'>
                <button
                    className='bg-purple-950 w-[150px] py-2 rounded-full text-white'
                    onClick={() => router.push('/blocker/addBlocker')}
                >
                    <FontAwesomeIcon icon={faPlus} className='font-light mr-4' />
                    Add Blocker
                </button>
            </div>
            <div className='mt-8'>
                <Table
                    dataSource={blockerTable}
                    columns={blockerColumns}
                    rowKey="key"  // Ensures each row has a unique key
                    pagination={false}
                    className='overflow-y-auto'
                />
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
            <DeactiveConfirmationModal
              visible={isDeactiveModalOpen}
              onConfirm={handleDeactiveConfirm}
              onCancel={handleDeactiveModalCancel}
            />
            <ActivateConfirmationModal
              visible={isActivateModalOpen}
              onConfirm={handleActivateConfirm}
              onCancel={handleActivateModalCancel}
            />
            <DeactiveSuccessModal
              visible={isSuccesDeactiveModalOpen}
              onConfirm={handleSuccessDeactiveModalConfirm}
              isSuccess={isSuccessDeactive}
              onCancel={handleSuccessDeactiveModalCancel}
            />
        </div>
    );
};

Blocker.layout = WithDefaultLayout;
export default Blocker;
