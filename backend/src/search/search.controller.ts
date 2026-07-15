import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { SearchService } from "./search.service";
import {
  VehicleLineOfBusinessesResponse,
  VinSearchResponse
} from "./search.types";

@Controller()
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get("vin/:vin")
  searchByVin(@Param("vin") vin: string): VinSearchResponse {
    return this.searchService.searchByVin(vin);
  }

  @Get("vehicles/:vehicleId/line-of-businesses")
  getLineOfBusinesses(
    @Param("vehicleId", ParseIntPipe) vehicleId: number
  ): VehicleLineOfBusinessesResponse {
    return this.searchService.getLineOfBusinesses(vehicleId);
  }
}
