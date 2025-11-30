export interface LocationMapCoil {
  coilId: string;
  status: string;
}

export interface LocationMapCell {
  locationCode: string;
  coils: LocationMapCoil[];
  coilCount: number;
  row: number;
  col: number;
}

export interface LocationMap {
  cells: LocationMapCell[][];
  specialAreas: {
    row126: LocationMapCell;
    s3: LocationMapCell;
    truckReserving: LocationMapCell;
    s3os: LocationMapCell;
  };
}
