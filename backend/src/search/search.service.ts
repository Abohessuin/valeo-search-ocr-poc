import { Injectable, NotFoundException } from "@nestjs/common";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { assertValidVin } from "../common/vin";
import {
  ProductProfile,
  VehicleLineOfBusinessesResponse,
  VehicleRecord,
  VehicleSummary,
  VinDataset,
  VinSearchResponse
} from "./search.types";

@Injectable()
export class SearchService {
  private readonly dataset: VinDataset;

  constructor() {
    const dataPath = join(process.cwd(), "data", "vin-records.json");
    this.dataset = JSON.parse(readFileSync(dataPath, "utf8")) as VinDataset;
  }

  searchByVin(vin: string): VinSearchResponse {
    const normalizedVin = assertValidVin(vin);
    const record = this.dataset.records.find(
      (entry) => entry.vin === normalizedVin
    );

    if (!record) {
      return {
        vin: normalizedVin,
        totalVehicles: 0,
        vehicles: []
      };
    }

    return {
      vin: normalizedVin,
      totalVehicles: record.vehicles.length,
      vehicles: record.vehicles.map((vehicle) =>
        this.toVehicleSummary(vehicle)
      )
    };
  }

  getLineOfBusinesses(vehicleId: number): VehicleLineOfBusinessesResponse {
    const vehicle = this.findVehicle(vehicleId);
    const profile = this.findProductProfile(vehicle.productProfileId);

    return {
      vehicle: this.toVehicleSummary(vehicle),
      lineOfBusinesses: profile.lineOfBusinesses,
      enableMissingPartForm: profile.enableMissingPartForm,
      enableMissingPartFormFailed: profile.enableMissingPartFormFailed,
      productsGroup: profile.productsGroup
    };
  }

  private findVehicle(vehicleId: number): VehicleRecord {
    for (const record of this.dataset.records) {
      const vehicle = record.vehicles.find((item) => item.id === vehicleId);

      if (vehicle) {
        return vehicle;
      }
    }

    throw new NotFoundException(`Vehicle ${vehicleId} was not found.`);
  }

  private findProductProfile(productProfileId: string): ProductProfile {
    const profile = this.dataset.productProfiles[productProfileId];

    if (!profile) {
      throw new NotFoundException(
        `Product profile ${productProfileId} was not found.`
      );
    }

    return profile;
  }

  private toVehicleSummary(vehicle: VehicleRecord): VehicleSummary {
    const { productProfileId, ...summary } = vehicle;
    void productProfileId;
    return summary;
  }
}
