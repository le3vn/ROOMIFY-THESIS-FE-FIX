export interface RoomResponse {
    roomlist: RoomList[],
    totaldata: number
}

export interface RoomList {
    roomId: number
    name: string,
    roomType: string,
    description: string,
    building: string,
    capacity: number,
    minioUrl: string
}