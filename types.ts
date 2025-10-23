
export type PopulationDensity = 'low' | 'medium' | 'high';
export type BuildingType = 'residential' | 'commercial' | 'industrial' | 'mixed-use';
export type Priority = 'walkability' | 'public-transport' | 'sustainability' | 'economic-growth';

export interface ControlSettings {
  cityName: string;
  populationDensity: PopulationDensity;
  greenSpacePercentage: number;
  buildingMix: BuildingType[];
  priorities: Priority[];
}

// Redesigned LandUse to support a modern, sustainable smart city with a more organic layout.
export enum LandUse {
  // Core Urban Zones
  Residential = 'residential',
  Commercial = 'commercial',
  MixedUse = 'mixed-use', // Combines residential, commercial, recreational
  CentralHub = 'central-hub', // City center, landmark, public services

  // Green & Sustainable Infrastructure
  Park = 'park',
  Water = 'water',
  GreenCorridor = 'green-corridor', // Connects green spaces
  SolarField = 'solar-field',
  RooftopGarden = 'rooftop-garden', // Represents buildings with green roofs

  // Transport & Utilities
  MainRoad = 'main-road',
  SecondaryRoad = 'secondary-road',
  EVChargingZone = 'ev-charging-zone',
  
  // Misc
  Public = 'public',
  Landmark = 'landmark', // Specific important building, can be part of hub
  Empty = 'empty',
  
  // Deprecated for type safety
  Industrial = 'industrial',
  InnovationHub = 'innovation-hub',
  TechDistrict = 'tech-district',
  AutomatedTransportCorridor = 'automated-transport-corridor',
  SmartGridNode = 'smart-grid-node',
  WindTurbine = 'wind-turbine',
}

export interface GridCell {
  landUse: LandUse;
  density: number; // 0.0 to 1.0, influencing color shade
}

export interface KeyMetrics {
  populationEstimate: string;
  greenSpacePercentage: number;
  dominantBuildingType: string;
  sustainabilityScore: number; // Represents the city's eco-friendliness and tech integration
}

export interface UrbanPlan {
  cityName: string;
  description: string;
  keyMetrics: KeyMetrics;
  layoutGrid: GridCell[][];
}

export interface LandUseConfigItem {
  color: string; // Tailwind class
  label: string;
  hex: string;   // Hex color code
}

export interface ModuleInput {
  id: string;
  label: string;
  type: 'text' | 'slider' | 'chat';
  placeholder?: string;
  min?: number;
  max?: number;
  default: string | number | string[];
}

export interface AIModule {
  id: string;
  title: string;
  description: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  inputs?: ModuleInput[];
};
