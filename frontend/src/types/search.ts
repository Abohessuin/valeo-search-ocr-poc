export interface VehicleEngine {
  id: number;
  code: string;
}

export interface VehicleSummary {
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
}

export interface VinSearchResponse {
  vin: string;
  totalVehicles: number;
  vehicles: VehicleSummary[];
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

export interface VehicleLineOfBusinessesResponse {
  vehicle: VehicleSummary;
  lineOfBusinesses: LineOfBusiness[];
  productsGroup: ProductGroup[];
}
