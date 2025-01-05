export interface BuildingResponse {
    buildingList: BuildingList[],
    totalData: number,
}

export interface BuildingList {
    buildingId: number,
    createdAt: string,
    createdBy: string,
    minioUrl: string,
    name: string,
    updatedAt: string,
    updatedBy: string,
}
