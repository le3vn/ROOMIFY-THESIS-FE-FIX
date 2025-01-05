import React, { useState } from 'react';
import { WithDefaultLayout } from '../../components/DefautLayout';
import { Page } from '../../types/Page';
import { Input } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import BuildingCards from '@/components/BuildingCards';
import { useDebounce } from 'use-debounce';
import HeaderPage from "@/components/HeaderPage";


const Dashboard: Page = () => {
    const [search, setSearch] = useState<string>('');
    const [searchDebounce] = useDebounce(search, 1000);
    console.log(search);

    // REACT USE STATE

    return (
        <div className='flex flex-col items-center'>
            <HeaderPage/>
            <div className="mt-8 w-full flex justify-center">
                <Input
                    placeholder="Search"
                    prefix={<FontAwesomeIcon icon={faMagnifyingGlass} />}
                    className='w-6/7 rounded-2xl mb-8'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <div className="h-[480px] overflow-y-auto"> {/* Add height and overflow-y-auto */}
                <BuildingCards search={searchDebounce} />
            </div>
        </div>
    );
};


Dashboard.layout = WithDefaultLayout;
export default Dashboard;
