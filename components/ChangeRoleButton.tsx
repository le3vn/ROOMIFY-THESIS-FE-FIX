import React from "react";
import { Button } from "antd";

interface ChangeRoleButtonProps {
    onClick: () => void;
}

const ChangeRoleButton: React.FC<ChangeRoleButtonProps> = ({ onClick }) => {
    return (
        <Button
            onClick={onClick}
            className="absolute bottom-4 right-4 flex items-center justify-center text-white bg-[#EB8317] px-4 py-2 rounded-lg font-semibold"
        >
            Change Role
        </Button>
    );
};

export default ChangeRoleButton;
