import React, { useState } from 'react';
import { WithDefaultLayout } from '../../components/DefautLayout';
import { Page } from '../../types/Page';
import { Input, DatePicker, Radio, RadioChangeEvent, Select, message } from 'antd';
import dayjs, { Dayjs } from 'dayjs'; // Import Dayjs
import { useSwrFetcherWithAccessToken } from '@/functions/useSwrFetcherWithAccessToken';
import { BackendApiUrl } from '@/functions/BackendApiUrl';
import useSWR from 'swr';
import { useFetchWithAccessToken } from '@/functions/useFetchWithAccessToken';
import router from 'next/router';
import ConfirmationModal from '@/components/Modals/BlockerModals/ConfirmationModal';
import SuccessModal from '@/components/Modals/BlockerModals/SuccessModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';


const { RangePicker } = DatePicker;
const { Option } = Select;

interface RoomData {
    roomId: number;
    name: string;
}

interface RoomList {
    roomList: RoomData[];
    totalData: number;
}

const Blocker: Page = () => {
    const [startDate, setStartDate] = useState<Dayjs | null>(null);
    const [endDate, setEndDate] = useState<Dayjs | null>(null);
    const [choice, setChoice] = useState(0);
    const [selectedRooms, setSelectedRooms] = useState<number[]>([]);
    const [blockerName, setBlockerName] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSuccesModalOpen, setIsSuccessModalOpen] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    
    const swrFetcher = useSwrFetcherWithAccessToken();
    const { fetchPOSTWithFormData } = useFetchWithAccessToken();
    const { data: roomData } = useSWR<RoomList>(BackendApiUrl.getAllRoom, swrFetcher);

    const onChange = (e: RadioChangeEvent) => {
        setChoice(e.target.value);
    };

    const handleBlockerNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBlockerName(e.target.value); // Update blockerName state with input value
    };

    const handleDateChange = (dates: [Dayjs | null, Dayjs | null]) => {
        setStartDate(dates[0] || null);
        setEndDate(dates[1] || null);
    };

    const formatDate = (date: Dayjs | null) => {
        return date ? date.format('YYYY-MM-DD') : 'Not selected'; 
    };

    const handleSubmit = async () => {
        if (!blockerName || !startDate || !endDate) {
            message.error('Please fill all required fields.');
            return;
        }

        const formData = new FormData();
        formData.append('BlockerName', blockerName);
        formData.append('StartDate', formatDate(startDate)); 
        formData.append('EndDate', formatDate(endDate));

        try {
            const response = await fetchPOSTWithFormData(BackendApiUrl.createBlocker, formData);

            if(response.data){
                setIsSuccess(true)
            }
            else {
                // Handle error (e.g., display an error message)
                setIsSuccess(false);
              }
            } catch (error) {
              setIsSuccess(false);
            }
    };

    const handleModalConfirm = () => {
        handleSubmit(); 
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

    const handleModalCancel = () => {
        setIsModalOpen(false);
    };

    const handleBackButton = () => {
        router.back();
    };

    return (
        <div className="mt-4 h-[710px] overflow-y-auto flex flex-col justify-between">
            <div>
            <button className="bg-white rounded-full w-10 h-10 flex items-center justify-center" onClick={()=> handleBackButton()}>
                 <FontAwesomeIcon icon={faChevronLeft} className="inline" />
            </button>
                <img
                    src="/Assets/images/add-blocker.png"
                    alt="Ongoing"
                    width={310}
                    height={40}
                    className="mt-6"
                    />
                <div className="mt-8">
                    <div className="mb-6">
                        <p className="mb-2 text-base text-white font-normal">Blocker Name</p>
                        <Input type="text" className="w-full mb-3 rounded-lg h-8" name="blockerName" onChange={handleBlockerNameChange} />
                    </div>
                    <div className='mb-6'>
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
                        <RangePicker onChange={handleDateChange} className='mb-4'/>
                    </div>
                </div>
            </div>
            <div className='flex justify-center'>
                <button
                    className="bg-purple-950 px-14 py-2 font-bold text-white rounded-full text-xl"
                    onClick={() => setIsModalOpen(true)}
                >
                    Submit
                </button>
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
        </div>
    );
};

Blocker.layout = WithDefaultLayout;
export default Blocker;
