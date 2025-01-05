// components/PreviewModal.tsx
import { faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect } from 'react';

interface PreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    minioUrl: string;
}

const PreviewModal: React.FC<PreviewModalProps> = ({ isOpen, onClose, minioUrl }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-4 rounded-lg w-3/4 h-3/4 overflow-auto">
                <div className="flex justify-end">
                <button className='bg-gray-200 w-10 h-10 rounded-full' onClick={onClose}>
                    <FontAwesomeIcon icon={faX}/>
                </button>
                </div>
                <div className="flex justify-center items-center h-full p-6">
                    {/* Assuming the minioUrl is a valid image URL */}
                    <img src={minioUrl} alt="Evidence Preview" className="max-w-full max-h-full" />
                </div>
            </div>
        </div>
    );
};

export default PreviewModal;
