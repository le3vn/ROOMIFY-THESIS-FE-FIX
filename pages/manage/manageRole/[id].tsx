/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ConfigProvider, Input, message, Select } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faPlus, faX } from '@fortawesome/free-solid-svg-icons';
import { useSwrFetcherWithAccessToken } from '@/functions/useSwrFetcherWithAccessToken';
import useSWR, { mutate } from 'swr'; // Import mutate
import { BackendApiUrl } from '@/functions/BackendApiUrl';
import { WithDefaultLayout } from '@/components/DefautLayout';
import { officeOptions, studentOrganizationOption } from '@/functions/RoleAddOptions';
import { useFetchWithAccessToken } from '@/functions/useFetchWithAccessToken';
import AddRoleSuccessModal from '@/components/Modals/ManageModals/ManageRoleModal/AddRoleSuccessModal';
import RoleConfirmationModal from '@/components/Modals/ManageModals/ManageRoleModal/AddRoleConfirm';

const customTheme = {
  token: {
    'colorBgContainerDisabled': '#ffffff',
  },
};

interface RolesDetail {
  roleId: string;
  roleName: string;
  displayName: string;
}

interface UserRoleDetail {
  userId: string;
  userName: string;
  roles: RolesDetail[];
}

interface Roles {
  roleId: string;
  roleName: string;
}

interface RolesAvailable {
  roleAvailable: Roles[];
  totalData: number;
}

const EditRolePage = () => {
  const router = useRouter();
  const { id } = router.query;
  const swrFetcher = useSwrFetcherWithAccessToken();
  const { fetchPOST, fetchDELETE } = useFetchWithAccessToken();

  const { data: roleDetail } = useSWR<UserRoleDetail>(`${BackendApiUrl.getRoleDetail}?id=${id}`, swrFetcher);
  const { data: roleAvailable } = useSWR<RolesAvailable>(`${BackendApiUrl.getAvailableRole}?UserId=${id}`, swrFetcher);

  const [isFormVisible, setIsFormVisible] = useState(false); // State to toggle form visibility
  const [newRole, setNewRole] = useState<string | undefined>(undefined); // State for the new role
  const [selectedRoleName, setSelectedRoleName] = useState<string | undefined>(undefined); // Track the selected role name
  const [selectedOfficeOrOrg, setSelectedOfficeOrOrg] = useState<string | undefined>(undefined); // State for office or organization name
  
  const [isConfirmationModalVisible, setConfirmationModalVisible] = useState(false); // Track visibility of the confirmation modal
  const [isSuccessModalVisible, setSuccessModalVisible] = useState(false); // Track visibility of the success modal
  const [isSuccess, setIsSuccess] = useState(false); // Track if the role addition was successful
  const [roleToDelete, setRoleToDelete] = useState<string | undefined>(undefined);
  const [orgToDelete, setOrgToDelete] = useState<string | undefined>(undefined);


  const handleBackButton = () => {
    router.back();
  };

  const handleAddRoleClick = () => {
    setIsFormVisible(true); // Show the form
  };

  const handleRoleChange = (value: string, option: any) => {
    setNewRole(value); // Set the new selected role ID
    setSelectedRoleName(option.label); // Save the roleName (label)
    setSelectedOfficeOrOrg(undefined); // Reset office or organization name when role changes
  };

  const handleOfficeOrOrgChange = (value: string) => {
    setSelectedOfficeOrOrg(value); // Set the office or organization name
  };

  const handleSubmitRole = () => {
    if (newRole) {
      // Show confirmation modal before proceeding
      setConfirmationModalVisible(true);
    } else {
      message.error('Please select a role!');
    }
  };

  const handleConfirmRole = async () => {
    // Forming the payload for the API request
    const payload = {
      userId: roleDetail?.userId, // Use the userId from the roleDetail
      roleId: newRole, // Role ID from selected role
      organizationName: selectedOfficeOrOrg, // Office or Organization name if selected
    };

    try {
      // Sending the POST request to the backend
      const response = await fetchPOST(BackendApiUrl.addNewRole, payload);

      if (response) {
        // On successful role addition
        setIsSuccess(true); // Set success flag to true
        setSuccessModalVisible(true); // Show success modal

        // Manually trigger re-fetch of the roles
        mutate(`${BackendApiUrl.getRoleDetail}?id=${id}`);
        mutate(`${BackendApiUrl.getAvailableRole}?UserId=${id}`);
      } else {
        // Handle failure response
        message.error(`Error: ${response || 'Something went wrong.'}`);
      }
    } catch (error) {
      // Handle fetch error
      message.error(`Error: ${error || 'Something went wrong while adding the role.'}`);
    } finally {
      setConfirmationModalVisible(false); // Close the confirmation modal
      setIsFormVisible(false)
      setNewRole(undefined);
      setSelectedRoleName(undefined);
      setSelectedOfficeOrOrg(undefined);
    }
  };

  const handleDeleteClick = (roleId: string, organizationName: string) => {
    setRoleToDelete(roleId);
    setOrgToDelete(organizationName);
  };
  
  // Use useEffect to handle deletion when roleToDelete or orgToDelete changes
  useEffect(() => {
    if (roleToDelete && orgToDelete !== undefined) {
      handleDeleteRole();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleToDelete, orgToDelete]);

const handleDeleteRole = async () => {

    const payload = {
        userId: id, // Assuming 'id' is the userId
        roleId: roleToDelete,
        organizationName: orgToDelete || "", // Provide empty string if no org name
    };

    console.log("Payload for delete request:", JSON.stringify(payload));

    try {
        const response = await fetchDELETE<Response>(`${BackendApiUrl.deleteRole}?UserId=${id}&RoleId=${roleToDelete}&OrganizationName=${orgToDelete}`);

        if (response) {
            message.success('Role deleted successfully!');
            mutate(`${BackendApiUrl.getRoleDetail}?id=${id}`);
            mutate(`${BackendApiUrl.getAvailableRole}?UserId=${id}`);
            setRoleToDelete(undefined);
            setOrgToDelete(undefined);
        } else {
            message.error(`Failed to delete role.`);
        }
    } catch (error) {
        console.error("Error deleting role:", error);
        message.error('Something went wrong while deleting the role.');
    }
};
  

  return (
    <ConfigProvider theme={customTheme}>
      <div className="mt-4">
        <button className="bg-white rounded-full w-10 h-10 flex items-center justify-center" onClick={handleBackButton}>
          <FontAwesomeIcon icon={faChevronLeft} className="inline" />
        </button>
        <div>
          <img src="/Assets/images/manage-role.png" alt="manage" width={310} height={40} className="mt-6 mb-6" />
          <div>
            <p className="mb-2 text-base text-white font-normal">Full Name</p>
            <Input disabled={true} value={roleDetail?.userName} />
          </div>
          <div className="flex gap-4 mt-4">
            {roleDetail?.roles.map((role) => (
              <div
                key={role.roleId}
                className={`${
                  role.roleName === 'Staff'
                    ? 'bg-red-500'
                    : role.roleName === 'StudentOrganization'
                    ? 'bg-blue-500'
                    : role.roleName === 'Lecturer'
                    ? 'bg-green-500'
                    : role.roleName === 'Student'
                    ? 'bg-purple-500'
                    : role.roleName === 'LSC'
                    ? 'bg-orange-500'
                    : role.roleName === 'SLC'
                    ? 'bg-pink-500'
                    : role.roleName === 'SSO'
                    ? 'bg-red-300'
                    : role.roleName === 'BM'
                    ? 'bg-lime-400'
                    : 'bg-gray-400'
                } rounded-full`}
              >
                <div className="px-4 py-2 flex items-center gap-4">
                  <p className="text-base font-semibold">{role.displayName}</p>
                  <button onClick={role.roleName === 'Staff' || role.roleName === 'StudentOrganization' ? () => handleDeleteClick(role.roleId, role.displayName) : () => handleDeleteClick(role.roleId, "")}>
                    <FontAwesomeIcon icon={faX} />
                  </button>
                </div>
              </div>
            ))}
            <div>
              <button className="px-4 py-2 bg-purple-950 text-white font-semibold rounded-full text-base" onClick={handleAddRoleClick}>
                <FontAwesomeIcon icon={faPlus} /> Add Role
              </button>
            </div>
          </div>

          {isFormVisible && (
            <div className="mt-4 flex flex-col">
              <div className="flex items-end">
                <p className="mb-2 text-base text-white font-normal">Select Role</p>
              </div>
              <Select
                value={newRole}
                onChange={handleRoleChange}
                className="w-full mb-4"
                placeholder="Select a role"
                options={roleAvailable?.roleAvailable.map((role) => ({
                  label: role.roleName,
                  value: role.roleId,
                }))}
              />
              {(selectedRoleName === 'Staff' || selectedRoleName === 'StudentOrganization') && (
                <div>
                  <p className="mb-2 text-base text-white font-normal">
                    {selectedRoleName === 'Staff' ? 'Office Name' : 'Organization Name'}
                  </p>
                  <Select
                    value={selectedOfficeOrOrg}
                    onChange={handleOfficeOrOrgChange}
                    className="w-full mb-4"
                    placeholder={selectedRoleName === 'Staff' ? 'Select Office' : 'Select Organization'}
                    options={selectedRoleName === 'Staff' ? officeOptions : studentOrganizationOption}
                  />
                </div>
              )}
              <div className="flex justify-center">
                <button onClick={handleSubmitRole} className="bg-purple-950 px-14 py-2 font-bold text-white rounded-full text-xl">
                  Add Role
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <RoleConfirmationModal
        visible={isConfirmationModalVisible}
        onConfirm={handleConfirmRole} // Confirm and add the role
        onCancel={() => setConfirmationModalVisible(false)} // Close confirmation modal
      />

      {/* Success Modal */}
      <AddRoleSuccessModal
        visible={isSuccessModalVisible}
        isSuccess={isSuccess}
        onConfirm={() => 
          setSuccessModalVisible(false)
          
        } // Close success modal
      />
    </ConfigProvider>
  );
};

EditRolePage.layout = WithDefaultLayout;
export default EditRolePage;
