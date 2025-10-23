
import { LandUse, LandUseConfigItem } from '../types';

export const landUseConfig: Record<LandUse, LandUseConfigItem> = {
  // Modern & Sustainable Palette
  [LandUse.Residential]: { color: 'bg-sky-700', label: 'Residential', hex: '#0369a1' },
  [LandUse.Commercial]: { color: 'bg-blue-800', label: 'Commercial', hex: '#1e40af' },
  [LandUse.MixedUse]: { color: 'bg-indigo-600', label: 'Mixed-Use', hex: '#4f46e5' },
  [LandUse.CentralHub]: { color: 'bg-teal-500', label: 'Central Hub', hex: '#14b8a6' },
  [LandUse.Park]: { color: 'bg-green-600', label: 'Park', hex: '#16a34a' },
  [LandUse.GreenCorridor]: { color: 'bg-lime-600', label: 'Green Corridor', hex: '#65a30d' },
  [LandUse.RooftopGarden]: { color: 'bg-emerald-500', label: 'Green Building', hex: '#10b981' },
  [LandUse.Water]: { color: 'bg-cyan-800', label: 'Water', hex: '#155e75' },
  [LandUse.SolarField]: { color: 'bg-slate-700', label: 'Solar Field', hex: '#334155' },
  [LandUse.EVChargingZone]: { color: 'bg-cyan-500', label: 'EV Charging', hex: '#06b6d4' },
  [LandUse.MainRoad]: { color: 'bg-gray-500', label: 'Main Road', hex: '#6b7280' },
  [LandUse.SecondaryRoad]: { color: 'bg-gray-600', label: 'Secondary Road', hex: '#4b5563' },
  [LandUse.Public]: { color: 'bg-rose-600', label: 'Public/Civic', hex: '#e11d48' },
  [LandUse.Landmark]: { color: 'bg-amber-400', label: 'Landmark', hex: '#facc15' },
  [LandUse.Empty]: { color: 'bg-gray-900', label: 'Empty', hex: '#111827' },

  // Deprecated types - not used in prompt or legend but good to have
  [LandUse.Industrial]: { color: 'bg-slate-800', label: 'Industrial', hex: '#1e293b' },
  [LandUse.InnovationHub]: { color: 'bg-fuchsia-600', label: 'Innovation Hub', hex: '#c026d3' },
  [LandUse.TechDistrict]: { color: 'bg-violet-800', label: 'Tech District', hex: '#5b21b6' },
  [LandUse.AutomatedTransportCorridor]: { color: 'bg-gray-700', label: 'Transport Corridor', hex: '#374151' },
  [LandUse.SmartGridNode]: { color: 'bg-blue-500', label: 'Smart Grid Node', hex: '#3b82f6' },
  [LandUse.WindTurbine]: { color: 'bg-slate-400', label: 'Wind Turbine', hex: '#94a3b8' },
};
