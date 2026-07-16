import DirectionsCarOutlinedIcon from "@mui/icons-material/DirectionsCarOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  Typography
} from "@mui/material";
import {
  VehicleLineOfBusinessesResponse,
  VehicleSummary,
  VinSearchResponse
} from "@/types/search";
import { InlineError } from "./InlineError";

interface VehicleResultsPanelProps {
  vinSearchResult: VinSearchResponse | null;
  selectedVehicleId: number | null;
  vehicleData: VehicleLineOfBusinessesResponse | null;
  isLoadingVehicleData: boolean;
  vehicleDataError: string | null;
  onVehicleSelect: (vehicle: VehicleSummary) => void;
}

export function VehicleResultsPanel({
  vinSearchResult,
  selectedVehicleId,
  vehicleData,
  isLoadingVehicleData,
  vehicleDataError,
  onVehicleSelect
}: VehicleResultsPanelProps) {
  if (!vinSearchResult) {
    return null;
  }

  if (vinSearchResult.totalVehicles === 0) {
    return (
      <Alert severity="info">
        No local vehicle data was found for VIN {vinSearchResult.vin}.
      </Alert>
    );
  }

  return (
    <Stack spacing={2}>
      <Stack spacing={0.5}>
        <Typography variant="h2" sx={{ fontSize: 24 }}>
          Vehicle Matches
        </Typography>
        <Typography color="text.secondary">
          {vinSearchResult.totalVehicles} option
          {vinSearchResult.totalVehicles === 1 ? "" : "s"} found for{" "}
          {vinSearchResult.vin}.
        </Typography>
      </Stack>

      <Stack spacing={1.5}>
        {vinSearchResult.vehicles.map((vehicle) => (
          <VehicleOptionCard
            key={vehicle.id}
            vehicle={vehicle}
            selected={selectedVehicleId === vehicle.id}
            loading={isLoadingVehicleData && selectedVehicleId === vehicle.id}
            onSelect={() => onVehicleSelect(vehicle)}
          />
        ))}
      </Stack>

      {vehicleDataError ? <InlineError message={vehicleDataError} /> : null}

      {vehicleData ? <VehicleProductsPanel vehicleData={vehicleData} /> : null}
    </Stack>
  );
}

interface VehicleOptionCardProps {
  vehicle: VehicleSummary;
  selected: boolean;
  loading: boolean;
  onSelect: () => void;
}

function VehicleOptionCard({
  vehicle,
  selected,
  loading,
  onSelect
}: VehicleOptionCardProps) {
  return (
    <Card variant="outlined" sx={{ borderColor: selected ? "primary.main" : "divider" }}>
      <CardContent>
        <Stack spacing={1.5}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            justifyContent="space-between"
            alignItems={{ xs: "stretch", sm: "flex-start" }}
          >
            <Stack direction="row" spacing={1.25} sx={{ minWidth: 0 }}>
              <DirectionsCarOutlinedIcon color="primary" />
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="h3" sx={{ fontSize: 18 }}>
                  {vehicle.manufacturerName} {vehicle.modelSeriesName}
                </Typography>
                <Typography color="text.secondary">{vehicle.description}</Typography>
              </Box>
            </Stack>

            <Button
              variant={selected ? "contained" : "outlined"}
              onClick={onSelect}
              disabled={loading}
              startIcon={
                loading ? <CircularProgress color="inherit" size={16} /> : null
              }
            >
              {selected ? "Selected" : "Select"}
            </Button>
          </Stack>

          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Chip size="small" label={vehicle.market} />
            <Chip size="small" label={vehicle.fuelType} />
            <Chip size="small" label={`${vehicle.capacityLiters}L`} />
            <Chip
              size="small"
              label={`${vehicle.horsePowerFrom}-${vehicle.horsePowerTo} hp`}
            />
            <Chip size="small" label={vehicle.bodyStyle} />
          </Stack>

          <Typography variant="body2" color="text.secondary">
            {vehicle.beginYearMonth}
            {vehicle.endYearMonth ? ` to ${vehicle.endYearMonth}` : " onward"} •{" "}
            {vehicle.driveType}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

interface VehicleProductsPanelProps {
  vehicleData: VehicleLineOfBusinessesResponse;
}

function VehicleProductsPanel({ vehicleData }: VehicleProductsPanelProps) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Inventory2OutlinedIcon color="primary" />
            <Box>
              <Typography variant="h3" sx={{ fontSize: 20 }}>
                Product Data
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {vehicleData.vehicle.manufacturerName}{" "}
                {vehicleData.vehicle.modelSeriesName}
              </Typography>
            </Box>
          </Stack>

          <Divider />

          <Stack spacing={1}>
            <Typography sx={{ fontWeight: 800 }}>Line of Business</Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" },
                gap: 1
              }}
            >
              {vehicleData.lineOfBusinesses.map((item) => (
                <MetricTile
                  key={item.id}
                  title={item.name}
                  value={`${item.articlesCount} articles`}
                  detail={`${item.childrenCount} groups`}
                />
              ))}
            </Box>
          </Stack>

          <Stack spacing={1}>
            <Typography sx={{ fontWeight: 800 }}>Product Groups</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {vehicleData.productsGroup.map((product) => (
                <Chip
                  key={product.id}
                  label={`${product.description} (${product.articlesCount})`}
                  variant="outlined"
                />
              ))}
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

interface MetricTileProps {
  title: string;
  value: string;
  detail: string;
}

function MetricTile({ title, value, detail }: MetricTileProps) {
  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 1,
        p: 1.5,
        bgcolor: "#FAFBFC",
        minHeight: 92
      }}
    >
      <Typography sx={{ fontWeight: 800 }}>{title}</Typography>
      <Typography variant="body2" color="text.secondary">
        {value}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {detail}
      </Typography>
    </Box>
  );
}
