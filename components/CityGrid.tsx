
import React from 'react';
import { LandUse } from '../types';
import type { GridCell } from '../types';
import { LandmarkIcon } from './icons/LandmarkIcon';
import { SolarIcon } from './icons/SolarIcon';
import { EVChargingIcon } from './icons/EVChargingIcon';
import { RooftopGardenIcon } from './icons/RooftopGardenIcon';
import { landUseConfig } from '../config/landUseConfig';

interface CityGridProps {
  gridData: GridCell[][];
}

const Legend: React.FC = () => {
  const relevantLandUses = [
    LandUse.Residential,
    LandUse.Commercial,
    LandUse.MixedUse,
    LandUse.CentralHub,
    LandUse.MainRoad,
    LandUse.Park,
    LandUse.GreenCorridor,
    LandUse.RooftopGarden,
    LandUse.SolarField,
    LandUse.EVChargingZone,
    LandUse.Water,
  ];

  return (
    <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 justify-center">
      {relevantLandUses.map((use) => (
        <div key={use} className="flex items-center space-x-2">
          <div className={`w-4 h-4 rounded-sm ${landUseConfig[use].color}`}></div>
          <span className="text-xs text-gray-400">{landUseConfig[use].label}</span>
        </div>
      ))}
    </div>
  );
};

export const CityGrid: React.FC<CityGridProps> = ({ gridData }) => {
  if (!gridData || gridData.length === 0) {
    return <div className="text-center text-gray-500">No grid data available.</div>;
  }

  return (
    <div className="bg-black/50 p-4 rounded-lg">
      <div 
        className="grid gap-0.5 mx-auto"
        style={{ gridTemplateColumns: `repeat(${gridData[0].length}, minmax(0, 1fr))`}}
      >
        {gridData.flat().map((cell, index) => {
          if (!cell || !cell.landUse || !landUseConfig[cell.landUse]) {
            return (
              <div key={index} className={`aspect-square w-full h-full ${landUseConfig[LandUse.Empty].color}`} />
            );
          }
          const config = landUseConfig[cell.landUse];
          
          const getIcon = () => {
              switch (cell.landUse) {
                  case LandUse.CentralHub:
                  case LandUse.Landmark:
                      return <LandmarkIcon className="w-3/5 h-3/5 text-yellow-900/70" />;
                  case LandUse.SolarField:
                      return <SolarIcon className="w-3/5 h-3/5 text-sky-200/80" />;
                  case LandUse.EVChargingZone:
                      return <EVChargingIcon className="w-3/5 h-3/5 text-blue-900/80" />;
                   case LandUse.RooftopGarden:
                      return <RooftopGardenIcon className="w-3/5 h-3/5 text-green-900/70" />;
                  default:
                      return null;
              }
          }
          
          const cellClasses = `aspect-square w-full h-full flex items-center justify-center text-white font-bold text-xs transition-all duration-200 hover:scale-125 hover:z-10 ${config.color}`;

          return (
            <div
              key={index}
              className={cellClasses}
              title={config.label}
              style={{ filter: `brightness(${1.2 - (cell.density || 0.5) * 0.5})` }}
            >
              {getIcon()}
            </div>
          );
        })}
      </div>
      <Legend />
    </div>
  );
};
