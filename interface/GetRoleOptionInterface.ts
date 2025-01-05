export interface UserRole {
    roleId: string;
    roleName: string;
}

export interface GetUserRole{
    totalData: number;
    userRoles: UserRole[];
}
