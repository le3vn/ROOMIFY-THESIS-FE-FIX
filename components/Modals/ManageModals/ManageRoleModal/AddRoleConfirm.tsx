import React from 'react';

interface ConfirmationModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const RoleConfirmationModal: React.FC<ConfirmationModalProps> = ({ visible, onConfirm, onCancel }) => {
  return (
    <div className={`fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-auto ${visible ? '' : 'hidden'}`}>
      <div className="bg-purple-950 p-4 absolute top-32 rounded-full border-white border-4">
        <img src="/Assets/images/are-you-sure.png" alt="Are you sure?" className="w-[200px] rounded-full" />
      </div>
      <div className="bg-white p-4 rounded-lg w-2/5 h-2/5">
        <div className="h-full">
          <div className="h-2/3 flex flex-col justify-end">
            <div className="flex flex-col items-center">
              <h1 className="text-2xl font-bold">Add Role?</h1>
              <h4 className="text-center">Make sure to input the right data and requirements :)</h4>
            </div>
          </div>
          <div className="h-1/3 flex items-center justify-center">
            <div className="flex gap-4">
              <button
                className="bg-purple-950 h-[50px] w-[150px] rounded-full text-white text-lg font-semibold"
                onClick={onConfirm}
              >
                Add
              </button>
              <button
                className="bg-gray-200 h-[50px] w-[150px] rounded-full text-black text-lg font-semibold"
                onClick={onCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleConfirmationModal;
