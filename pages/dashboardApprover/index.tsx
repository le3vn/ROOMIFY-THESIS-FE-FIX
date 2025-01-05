import React, { useState, useCallback } from 'react';
import { WithDefaultLayout } from '../../components/DefautLayout';
import { Page } from '../../types/Page';
import { Input } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faSliders } from '@fortawesome/free-solid-svg-icons';
import { useDebounce } from 'use-debounce';
import HeaderPage from "@/components/HeaderPage";
import FilterModal from "@/components/Modals/ApproversModals/ApproveModals/FilterModal";
import ApproverCards from '@/components/ApproversViewCard';
import { useSession } from 'next-auth/react';
import { User } from 'next-auth';
import { useRouter } from 'next/router';

const Dashboard: Page = () => {
    const [search, setSearch] = useState<string>('');
    const [searchDebounce] = useDebounce(search, 1000);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string>('');
    const { data: session } = useSession();
    const user = session?.user as User;
    const userRole = user?.role?.[0];
    const router = useRouter();

    console.log(userRole)

    const openFilterModal = useCallback(() => {
        setIsFilterOpen(true);
    }, []);

    const closeFilterModal = useCallback(() => {
        setIsFilterOpen(false);
    }, []);

    const handleOptionSelect = useCallback((option: string) => {
        setSelectedOption(option);
        closeFilterModal();
    }, [closeFilterModal]);

    return (
        <div className='flex flex-col items-center'>
            <HeaderPage />
            <div className="mt-8 w-full flex justify-center gap-4">
                <Input
                    placeholder="Search"
                    prefix={<FontAwesomeIcon icon={faMagnifyingGlass} />}
                    className='w-6/7 rounded-2xl mb-8 h-[30px]'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button className='bg-white w-[200px] h-[30px] rounded-full' onClick={openFilterModal}>
                    <FontAwesomeIcon icon={faSliders} className='mr-2' />Filter
                </button>
                {(userRole === 'LSC' || userRole === 'BM' || userRole === 'SLC') && (
                <button className='bg-[#EB8317] border-4 border-[#d68530] font-semibold text-white w-[200px] h-[30px] rounded-full' onClick={() => router.push('/checkIn')}>
                    Check-In
                </button>
                )}

            </div>

            {/* Filter Modal */}
            <FilterModal
                isOpen={isFilterOpen}
                onClose={closeFilterModal}
                onSelectOption={handleOptionSelect}
                selected={selectedOption}
            />
            <div className="h-[530px] w-full overflow-y-auto">
                <ApproverCards search={searchDebounce} sort={selectedOption} />
            </div>
        </div>
    );
};

Dashboard.layout = WithDefaultLayout;
export default Dashboard;
