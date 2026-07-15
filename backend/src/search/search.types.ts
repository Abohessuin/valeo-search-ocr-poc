export interface VehicleEngine {
  id: number;
  code: string;
}

export interface VehicleRecord {
  id: number;
  manufacturerId: number;
  manufacturerName: string;
  modelSeriesId: number;
  modelSeriesName: string;
  description: string;
  beginYearMonth: string;
  endYearMonth?: string;
  driveType: string;
  bodyStyle: string;
  fuelType: string;
  engineType: string;
  horsePowerFrom: number;
  horsePowerTo: number;
  kiloWattsFrom: number;
  kiloWattsTo: number;
  capacityCC: number;
  capacityLiters: number;
  market: string;
  engines: VehicleEngine[];
  productProfileId: string;
}

export type VehicleSummary = Omit<VehicleRecord, "productProfileId">;

export interface VinRecord {
  vin: string;
  vehicles: VehicleRecord[];
}

export interface LineOfBusiness {
  id: number;
  name: string;
  type: string;
  childrenCount: number;
  articlesCount: number;
}

export interface ProductGroup {
  id: number;
  description: string;
  articlesCount: number;
}

export interface ProductProfile {
  lineOfBusinesses: LineOfBusiness[];
  enableMissingPartForm: boolean;
  enableMissingPartFormFailed: boolean;
  productsGroup: ProductGroup[];
}

export interface VinDataset {
  records: VinRecord[];
  productProfiles: Record<string, ProductProfile>;
}

export interface VinSearchResponse {
  vin: string;
  totalVehicles: number;
  vehicles: VehicleSummary[];
}

export interface VehicleLineOfBusinessesResponse extends ProductProfile {
  vehicle: VehicleSummary;
}
