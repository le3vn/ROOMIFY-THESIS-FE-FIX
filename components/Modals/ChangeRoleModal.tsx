/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { GetUserRole } from '@/interface/GetRoleOptionInterface';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import { BackendApiUrl } from '@/functions/BackendApiUrl';
import { useSwrFetcherWithAccessToken } from '@/functions/useSwrFetcherWithAccessToken';
import { User } from 'next-auth';
import { signIn } from 'next-auth/react';
import { useFetchWithAccessToken } from '@/functions/useFetchWithAccessToken';

interface ChangeRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Organization {
  name: string;
}

const ChangeRoleModal: React.FC<ChangeRoleModalProps> = ({ isOpen, onClose }) => {
  const { data: session } = useSession();
  const user = session?.user as User;
  const swrFetcher = useSwrFetcherWithAccessToken();
  const userId = user?.id;
  const [newRole, setNewRole] = useState<string>(user?.role?.[0] || '');
  
  // State to track organization name for each role
  const [roleDisplayNames, setRoleDisplayNames] = useState<{ [key: string]: string }>({});
  
  // State to track selected role for styling
  const [selectedRole, setSelectedRole] = useState<string>(user?.role?.[0] || '');

  const { fetchPOST } = useFetchWithAccessToken();

  // Fetch user roles using useSWR
  const { data: rolesData, error, isLoading } = useSWR<GetUserRole>(
    userId ? `${BackendApiUrl.getUserRole}?UserId=${userId}` : null,
    swrFetcher
  );

  // Fetch organization name for Staff and StudentOrganization roles
  const { data: staffOrganizationName } = useSWR<Organization>(
    userId ? `${BackendApiUrl.getDisplayName}?UserId=${userId}&RoleName=Staff` : null,
    swrFetcher
  );

  const { data: studentOrgOrganizationName } = useSWR<Organization>(
    userId ? `${BackendApiUrl.getDisplayName}?UserId=${userId}&RoleName=StudentOrganization` : null,
    swrFetcher
  );

  useEffect(() => {
    if (staffOrganizationName) {
      setRoleDisplayNames((prevState) => ({
        ...prevState,
        Staff: staffOrganizationName.name,
      }));
    }
    if (studentOrgOrganizationName) {
      setRoleDisplayNames((prevState) => ({
        ...prevState,
        StudentOrganization: studentOrgOrganizationName.name,
      }));
    }
  }, [staffOrganizationName, studentOrgOrganizationName]);

  useEffect(() => {
    if (isOpen) {
      setSelectedRole(user?.role?.[0] || ''); // Set selected role when modal opens
    }
  }, [isOpen, user]);

  const handleRoleClick = (roleName: string) => {
    setSelectedRole(roleName); // Update selected role when clicked
    setNewRole(roleName); // Update newRole to reflect the selected role
  };

  const saveRoleChange = async () => {
    const selectedRoleData = rolesData?.userRoles?.find(roleOption => roleOption.roleName === newRole);

    if (!userId || !selectedRoleData) {
      console.error("User ID or selected role is not available.");
      return;
    }

    const payload = {
      userId: userId,
      roleId: selectedRoleData.roleId,
    };

    try {
      const response = await fetchPOST(BackendApiUrl.changeRole, payload);
      if (response.data) {
        // Sign in again to fetch the updated session
        await signIn("oidc", { redirect: false });
        console.log("Role changed successfully. Updated session fetched.");
      }
    } catch (error) {
      console.error('Failed to change role:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-8 rounded-lg w-3/5">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-8 rounded-lg w-3/5">Error loading roles</div>
      </div>
    );
  }

  const roles = rolesData?.userRoles || [];

  return (
    <div className={`fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50 ${isOpen ? '' : 'hidden'}`}>
      <div className="bg-white p-4 rounded-lg w-2/5">
        <div className="flex flex-col items-center">
            <p className='text-xl font-medium text-purple-950 mb-6'>Change Role</p>
            <div className='flex flex-col'>
                <div className="grid grid-cols-3 gap-5">
                    {roles.length > 0 ? (
                        roles.map((role) => {
                            const displayName = roleDisplayNames[role.roleName] || role.roleName;
                            const isCurrentRole = selectedRole === role.roleName; // Check if the role is selected

                            return (
                            <div key={role.roleId} className="flex flex-col mb-6">
                                <button
                                onClick={() => handleRoleClick(role.roleName)} // Set selected role on click
                                className={`w-[160px] h-[160px] border border-gray-400 rounded-xl ${isCurrentRole ? 'border-2 border-purple-950' : ''}`}
                                >
                                    <div className='flex flex-col items-center'>
                                        <img src={`/Assets/images/${role.roleName}.png`} alt={role.roleName} className='w-[120px] h-[120px]' />
                                        <p>{displayName}</p>
                                    </div>
                                </button>
                            </div>
                            );
                        })
                    ) : (
                    <div>No roles</div>
                    )}
                </div>
                <div className="flex justify-end gap-4 py-2">
                    <button
                      onClick={onClose} // Close the modal without saving
                      className='bg-gray-400 w-[90px] text-white px-6 py-2 rounded-full'
                    >
                      Cancel
                    </button>
                    <button
                      onClick={async () => {
                        await saveRoleChange(); // Save the role change
                        onClose(); // Close the modal after saving
                      }}
                      className='bg-purple-950 w-[90px] text-white px-6 py-2 rounded-full'
                    >
                      Save
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeRoleModal;
