import React from 'react';

interface SuccessModalProps {
  visible: boolean;
  onConfirm: () => void;
  isSuccess: boolean;
}

const AddRoleSuccessModal: React.FC<SuccessModalProps> = ({ visible, onConfirm, isSuccess }) => {
  return (
    <div className={`fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-auto ${visible ? '' : 'hidden'}`}>
      <div className="bg-purple-950 p-4 absolute top-32 rounded-full border-white border-4">
        <img
          src={isSuccess ? "/Assets/images/succeed.png" : "/Assets/images/person-sad.png"}
          alt={isSuccess ? "Success" : "Error"}
          className="w-[200px] rounded-full"
        />
      </div>
      <div className="bg-white p-4 rounded-lg w-2/5 h-2/5">
        <div className="h-full">
          <div className="h-2/3 flex flex-col justify-end">
            {isSuccess ? (
              <div className="flex flex-col items-center px-8">
                <h1 className="text-2xl font-bold">You&apos;re All Set!</h1>
                <h4 className="text-center">
                  New Role has been successfully added. Check the management page for more details!
                </h4>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <h1 className="text-2xl font-bold">Oh no...</h1>
                <h4 className="text-center">Something went wrong. Please try again later.</h4>
              </div>
            )}
          </div>
          <div className="h-1/3 flex items-center justify-center">
            <button
              className="bg-purple-950 h-[50px] w-[150px] rounded-full text-white text-lg font-semibold"
              onClick={onConfirm}
            >
              {isSuccess ? 'Okay, Great!' : 'Okay :('}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddRoleSuccessModal;
