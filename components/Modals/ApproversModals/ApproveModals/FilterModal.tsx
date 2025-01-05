import { faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

interface FilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectOption: (option: string) => void;
    selected: string;
}

const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose, onSelectOption, selected }) => {
    if (!isOpen) return null;

    const handleSelectOption = (option: string) => {
        // If the option is already selected, reset it to an empty string
        if (selected === option) {
            onSelectOption('');
        } else {
            onSelectOption(option);
        }
    };

    return (
        <div className="fixed inset-0 flex justify-end bg-black bg-opacity-30 z-50">
            <div className="absolute right-12 top-56">
                <div className="bg-white p-4 rounded-lg shadow-lg w-[450px] h-32 left-24 flex flex-col justify-between">
                    <div className="flex justify-between">
                        <h2 className="text-lg font-bold mb-4">Sort Order</h2>
                        <button className="bg-gray-200 w-7 h-7 rounded-full" onClick={onClose}>
                            <FontAwesomeIcon icon={faX} className="w-3 h-3" />
                        </button>
                    </div>
                    <div className="flex gap-4">
                        <button
                            className={`${
                                selected === 'Desc' ? 'bg-[#EB8317]' : 'bg-purple-950'
                            } text-white font-semibold px-4 rounded-full w-[200px] h-[40px]`}
                            onClick={() => handleSelectOption('Desc')}
                        >
                            Latest to Earliest
                        </button>
                        <button
                            className={`${
                                selected === 'Asc' ? 'bg-[#EB8317]' : 'bg-purple-950'
                            } font-semibold text-white px-4 rounded-full w-[200px] h-[40px]`}
                            onClick={() => handleSelectOption('Asc')}
                        >
                            Earliest to Latest
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterModal;
