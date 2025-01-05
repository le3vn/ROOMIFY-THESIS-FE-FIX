import React, { useState, useEffect } from 'react';
import { WithDefaultLayout } from '../../components/DefautLayout';
import { Page } from '../../types/Page';
import { Input, DatePicker, message } from 'antd';
import dayjs, { Dayjs } from 'dayjs'; // Import Dayjs
import { useSwrFetcherWithAccessToken } from '@/functions/useSwrFetcherWithAccessToken';
import { BackendApiUrl } from '@/functions/BackendApiUrl';
import useSWR from 'swr';
import { useFetchWithAccessToken } from '@/functions/useFetchWithAccessToken';
import { useRouter } from 'next/router';
import ConfirmationModal from '@/components/Modals/BlockerModals/ConfirmationModal';
import SuccessModal from '@/components/Modals/BlockerModals/SuccessModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

interface BlockerInfo {
    blockerId: number;
    blockerName: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
}

const { RangePicker } = DatePicker;

const EditBlockerPage: Page = () => {
    const router = useRouter();
    const { id } = router.query;

    // State variables to store form values
    const [blockerName, setBlockerName] = useState('');
    const [startDate, setStartDate] = useState<Dayjs | null>(null);
    const [endDate, setEndDate] = useState<Dayjs | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccesModalOpen] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const swrFetcher = useSwrFetcherWithAccessToken();
    const { data: blockerDetail } = useSWR<BlockerInfo>(`${BackendApiUrl.getBlockerDetail}?BlockerId=${id}`, swrFetcher);
    const { fetchPOSTWithFormData } = useFetchWithAccessToken();

    // Populate form values once blockerDetail is fetched
    useEffect(() => {
        if (blockerDetail) {
            setBlockerName(blockerDetail.blockerName);
            setStartDate(dayjs(blockerDetail.startDate));
            setEndDate(dayjs(blockerDetail.endDate));
        }
    }, [blockerDetail]);

    const handleBlockerNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBlockerName(e.target.value);
    };

    const handleDateChange = (dates: [Dayjs, Dayjs] | null) => {
        if (dates) {
            setStartDate(dates[0]);
            setEndDate(dates[1]);
        }
    };

    const handleSubmit = async () => {
        if (!blockerName || !startDate || !endDate) {
            message.error('Please fill all required fields.');
            return;
        }
    
        // Ensure `id` is defined before using it
        if (!id) {
            message.error('Blocker ID is missing.');
            return;
        }
    
        const formData = new FormData();
        formData.append('BlockerId', id.toString());  // Now we know `id` is not undefined
        formData.append('BlockerName', blockerName);
        formData.append('StartDate', formatDate(startDate)); 
        formData.append('EndDate', formatDate(endDate));
    
        try {
            const response = await fetchPOSTWithFormData(BackendApiUrl.updateBlocker, formData);
    
            if (response.data) {
                setIsSuccess(true);
            } else {
                setIsSuccess(false);
            }
        } catch (error) {
            setIsSuccess(false);
        }
    };
    

    const handleModalConfirm = () => {
        handleSubmit(); 
        setIsModalOpen(false); 
        setIsSuccesModalOpen(true)
    };

    const handleSuccessModalConfirm = () => {
        setIsSuccesModalOpen(false);
        router.push('/blocker')
    }
    
    const handleSuccessModalCancel= () => {
        setIsSuccesModalOpen(false);
    }

    const handleModalCancel = () => {
        setIsModalOpen(false);
    };

    const handleBackButton = () => {
        router.back();
    };

    const formatDate = (date: Dayjs | null) => {
        return date ? date.format('YYYY-MM-DD') : '';
    };

    return (
        <div className="mt-4 h-[710px] overflow-y-auto flex flex-col justify-between">
            <div>
                <button className="bg-white rounded-full w-10 h-10 flex items-center justify-center" onClick={handleBackButton}>
                    <FontAwesomeIcon icon={faChevronLeft} className="inline" />
                </button>
                <img src="/Assets/images/edit-blocker.png" alt="Ongoing" width={310} height={40} className="mt-6" />
                <div className="mt-8">
                    <div className="mb-6">
                        <p className="mb-2 text-base text-white font-normal">Blocker Name</p>
                        <Input
                            type="text"
                            className="w-full mb-3 rounded-lg h-8"
                            name="blockerName"
                            value={blockerName} // Set the value from state
                            onChange={handleBlockerNameChange}
                        />
                    </div>
                    <div className="mb-6">
                        <p className="mb-2 text-base text-white font-normal">Dates</p>
                        <div className="mb-2 grid grid-cols-4">
                            <div className="flex-col">
                                <p className="mb-2 text-sm text-white font-normal">Start Date:</p>
                                <span className="mb-2 text-sm text-white font-normal">{formatDate(startDate)}</span>
                            </div>
                            <div className="flex-col">
                                <p className="mb-2 text-sm text-white font-normal">End Date:</p>
                                <span className="mb-2 text-sm text-white font-normal">{formatDate(endDate)}</span>
                            </div>
                        </div>
                        <RangePicker
                            value={[startDate, endDate]} // Set the value from state
                            onChange={handleDateChange}
                            className="mb-4"
                        />
                    </div>
                </div>
            </div>
            <div className="flex justify-center">
                <button className="bg-purple-950 px-14 py-2 font-bold text-white rounded-full text-xl" onClick={() => setIsModalOpen(true)}>
                    Submit
                </button>
            </div>
            <ConfirmationModal visible={isModalOpen} onConfirm={handleModalConfirm} onCancel={handleModalCancel} />
            <SuccessModal
                visible={isSuccessModalOpen}
                onConfirm={handleSuccessModalConfirm}
                isSuccess={isSuccess}
                onCancel={handleSuccessModalCancel}
            />
        </div>
    );
};

EditBlockerPage.layout = WithDefaultLayout;
export default EditBlockerPage;
