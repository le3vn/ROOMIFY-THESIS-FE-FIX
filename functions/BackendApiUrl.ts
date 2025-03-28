
// Request will be proxied via /api/be/[...apiGateway].ts
const baseUrl = '/api/be';

export const BackendApiUrl = {
    test: baseUrl + '/api/test',

    login: baseUrl + "/api/Authentication/login",
    getUserRole: baseUrl + "/api/Role/get-user-role",
    changeRole: baseUrl + "/api/Role/change-role",
    getDisplayName: baseUrl + "/api/Role/get-display-name",
    getUser: baseUrl + `/api/User/get-user-by-roles`,

    getBuilding: baseUrl + "/api/v1/Building/get-all-building",
    getBuildingDetail: (id: string) => baseUrl + `/api/v1/Building/get-building/${id}`,
    editBuilding: (id: string) => baseUrl + `/api/v1/Building/edit-building/${id}`,
    createBuilding: baseUrl + `/api/v1/Building/create-building`,
    deleteBuilding: baseUrl + `/api/v1/Building/delete-building`,
    getRoom: baseUrl + "/api/v1/Room/get-user-view",
    getRoomDetail: baseUrl + `/api/v1/Room/get-room-detail`,
    getRoomSchedule: baseUrl + `/api/v1/Room/get-room-schedule`,
    getAllRoom: baseUrl + `/api/v1/Room/get-all-room`,
    createRoom: baseUrl + `/api/v1/Room/create-room`,
    getAllRoomDetail: baseUrl + `/api/v1/Room/get-room-detail`,
    editRoom: (id: string) => baseUrl + `/api/v1/Room/${id}`,
    deleteRoom: baseUrl + `/api/v1/Room/delete-room`,
    getRoomGroup: baseUrl + `/api/v1/Room/get-room-group`,
    createGroup: baseUrl + `/api/Group/create-group`,
    getGroupDetail: baseUrl + `/api/Group/get-group-detail`,
    editGroup: (id: string) => baseUrl + `/api/Group/${id}`,
    deleteGroup: baseUrl + `/api/Group/delete-group`,
    getRoomAvailable: baseUrl + `/api/v1/Room/get-room-available`,

    getAvailableSession: baseUrl + `/api/Booking/get-available-session`,
    getAllEquipment: baseUrl + `/api/Booking/get-all-equipment`,
    getLecturerSubject: baseUrl + `/api/Booking/get-lecturer-subject`,
    getInstituteId: baseUrl + `/api/Booking/get-institutional-id`,
    createBooking: baseUrl + `/api/Booking/create-booking`,
    getUserBookingView: baseUrl + `/api/Booking/get-user-view`,
    cancelBooking: baseUrl + `/api/Booking/cancel-booking`,
    getRejectMessage: baseUrl + `/api/Booking/get-reject-message`,
    getAllBooking: baseUrl + `/api/Booking/get-all-booking`,
    updateBooking: baseUrl + `/api/Booking/update-booking`,
    getBookingTraffic: baseUrl + `/api/Booking/get-booking-traffic`,

    getApproverView: baseUrl + `/api/Booking/get-approver-view`,
    getBookingDetail: baseUrl + `/api/Booking/get-booking-detail`,
    approveBooking: baseUrl + `/api/Booking/approve`,
    getApproverHistory: baseUrl + `/api/Booking/get-approver-history`,
    checkIn: baseUrl + `/api/Booking/checkin`,

    getUserRoles: baseUrl + `/api/User/get-user-roles`,
    getRoleDetail: baseUrl + `/api/User/get-role-detail`,
    getAvailableRole: baseUrl + `/api/user/get-role-available`,
    addNewRole: baseUrl + `/api/User/add-new-role`,
    deleteRole: baseUrl + `/api/User/delete-role`,

    getBlockerList: baseUrl + `/api/Blocker/get-blocker-list`,
    createBlocker: baseUrl + `/api/Blocker/create-blocker`,
    deleteBlocker: baseUrl + `/api/Blocker/delete-blocker`,
    deactiveBlocker: baseUrl + `/api/Blocker/deactive-blocker`,
    getBlockerDetail: baseUrl + `/api/Blocker/get-blocker-detail`,
    updateBlocker: baseUrl + `/api/Blocker/update-blocker`,

    getNotificationUnread: baseUrl + `/api/Notification/get-notification-unread`,
    getNotification: baseUrl + `/api/Notification/get-notification`,
    readNotification: baseUrl + `/api/Notification/read-notification`,
    deleteNotification: baseUrl + `/api/Notification/delete-notification`,
    deleteAllNotification: baseUrl + `/api/Notification/delete-all`,
}