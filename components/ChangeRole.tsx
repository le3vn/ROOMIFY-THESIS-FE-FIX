// ChangeRole.tsx
import React from 'react';
import { Modal, Select, Button } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPeopleRoof } from '@fortawesome/free-solid-svg-icons';
import { UserRole } from '@/interface/GetRoleOptionInterface';

interface ChangeRoleProps {
    visible: boolean;
    roles: UserRole[];
    currentRole: string;
    onClose: () => void;
    onSave: (newRole: string) => void;
}

const { Option } = Select;

const ChangeRole: React.FC<ChangeRoleProps> = ({ visible, roles, currentRole, onClose, onSave }) => {
    const [newRole, setNewRole] = React.useState(currentRole);

    const handleRoleChange = (value: string) => {
        setNewRole(value);
    };

    return (
        <Modal
            title={<div className="text-center text-lg font-semibold" style={{ background: '#EB8317', color: '#fff', padding: '10px 0' }}>Change Role</div>}
            visible={visible}
            onCancel={onClose}
            onOk={() => {
                onSave(newRole);
                onClose();
            }}
            okText="Save"
            cancelText="Cancel"
            bodyStyle={{ padding: '20px', textAlign: 'center' }}
            footer={[
                <Button key="cancel" onClick={onClose} className="bg-gray-300 hover:bg-gray-400">Cancel</Button>,
                <Button key="save" type="primary" onClick={() => {
                    onSave(newRole);
                    onClose();
                }} className="bg-[#EB8317] hover:bg-orange-600">Save</Button>
            ]}
        >
            <Select
                value={newRole}
                style={{ width: '100%' }}
                onChange={handleRoleChange}
                dropdownStyle={{ maxHeight: '200px', overflowY: 'auto' }}
            >
                {roles.map(role => (
                    <Option key={role.roleId} value={role.roleName} className="flex items-center">
                        <FontAwesomeIcon icon={faPeopleRoof} className="mr-2" />
                        {role.roleName}
                    </Option>
                ))}
            </Select>
        </Modal>
    );
};

export default ChangeRole;
