/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { WithDefaultLayout } from '../../components/DefautLayout';
import { Page } from '../../types/Page';
import { ConfigProvider, Input, Select } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useDebounce } from 'use-debounce';
import HeaderPage from "@/components/HeaderPage";
import useSWR from 'swr';
import { BackendApiUrl } from '@/functions/BackendApiUrl';
import { useSwrFetcherWithAccessToken } from '@/functions/useSwrFetcherWithAccessToken';
import BookingCards from '@/components/BookingsCard';

const customTheme = {
    token: {
        'borderRadius': 100, 
    },
};

interface BuildingData {
    buildingId: number;
    name: string;
}

interface BuildingList {
    buildingList: BuildingData[];
    totalData: number;
}

interface RoomData {
    roomId: number;
    name: string;
}

interface RoomList {
    roomList: RoomData[];
    totalData: number;
}

const Dashboard: Page = () => {
    const [search, setSearch] = useState<string>('');
    const [searchDebounce] = useDebounce(search, 500);
    const [selectedBuilding, setSelectedBuilding] = useState<number | null>(null);
    const [selectedRoom, setSelectedRoom] = useState<number | null>(null);

    const swrFetcher = useSwrFetcherWithAccessToken();
    const { data: buildingData } = useSWR<BuildingList>(BackendApiUrl.getBuilding, swrFetcher);
    const { data: roomData } = useSWR<RoomList>(BackendApiUrl.getAllRoom, swrFetcher);



    const handleBuildingSelect = (buildingId: number) => {
        setSelectedBuilding(buildingId);
    };

    const handleRoomSelect = (roomId: number) => {
        setSelectedRoom(roomId);
    };

    const handleClearSelections = () => {
        setSelectedBuilding(null);
        setSelectedRoom(null);
    };

    return (
        <ConfigProvider theme={customTheme}>
            <div className='flex flex-col items-center'>
                <HeaderPage />
                <div className="mt-8 w-full flex justify-center gap-4 mb-8">
                    <Input
                        placeholder="Search"
                        prefix={<FontAwesomeIcon icon={faMagnifyingGlass} />}
                        className='w-6/7 rounded-2xl h-[32px]'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Select
                        placeholder="Enter Building"
                        className="w-1/7 rounded-2xl h-[25px]"
                        value={selectedBuilding ?? undefined}
                        onChange={handleBuildingSelect}
                        options={buildingData?.buildingList.map((building) => ({
                            label: building.name,
                            value: building.buildingId
                        }))}
                    />
                    <Select
                        placeholder="Enter Room"
                        className="w-1/7 rounded-2xl h-[30px]"
                        value={selectedRoom ?? undefined}
                        onChange={handleRoomSelect}
                        options={roomData?.roomList.map((room) => ({
                            label: room.name,
                            value: room.roomId
                        }))}
                    />
                    <button
                        onClick={handleClearSelections}
                        className="h-[32px] bg-purple-950 text-white rounded-full w-[150px]"
                        style={{ paddingLeft: '10px', paddingRight: '10px' }}
                    >
                        Clear Filter
                    </button>
                </div>
                <div className="h-[530px] w-full overflow-y-auto">
                <BookingCards search={searchDebounce} building={selectedBuilding} room={selectedRoom} />
            </div>

            </div>
        </ConfigProvider>
    );
};

Dashboard.layout = WithDefaultLayout;
export default Dashboard;
