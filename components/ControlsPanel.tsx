
import React from 'react';
import type { ControlSettings, PopulationDensity, BuildingType, Priority } from '../types';
import { GenerateIcon } from './icons/GenerateIcon';

interface ControlsPanelProps {
  settings: ControlSettings;
  setSettings: React.Dispatch<React.SetStateAction<ControlSettings>>;
  onGenerate: () => void;
  isLoading: boolean;
}

const populationOptions: { value: PopulationDensity; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

const buildingMixOptions: { value: BuildingType; label: string }[] = [
  { value: 'residential', label: 'Residential' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'industrial', label: 'Industrial' },
  { value: 'mixed-use', label: 'Mixed-Use' },
];

const priorityOptions: { value: Priority; label: string }[] = [
  { value: 'sustainability', label: 'Sustainability' },
  { value: 'walkability', label: 'Walkability' },
  { value: 'public-transport', label: 'Public Transport' },
  { value: 'economic-growth', label: 'Economic Growth' },
];

export const ControlsPanel: React.FC<ControlsPanelProps> = ({ settings, setSettings, onGenerate, isLoading }) => {
  const handleInputChange = <K extends keyof ControlSettings>(key: K, value: ControlSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleCheckboxChange = <T extends BuildingType | Priority>(key: 'buildingMix' | 'priorities', value: T) => {
    setSettings(prev => {
      const currentValues = prev[key] as T[];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(item => item !== value)
        : [...currentValues, value];
      return { ...prev, [key]: newValues };
    });
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 shadow-2xl border border-gray-700 h-full">
      <h2 className="text-xl font-bold text-cyan-400 mb-6">City Parameters</h2>
      <div className="space-y-6">
        <div>
          <label htmlFor="cityName" className="block text-sm font-medium text-gray-300 mb-1">City Name</label>
          <input
            type="text"
            id="cityName"
            value={settings.cityName}
            onChange={(e) => handleInputChange('cityName', e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Population Density</label>
          <div className="flex space-x-2 bg-gray-700 rounded-lg p-1">
            {populationOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => handleInputChange('populationDensity', opt.value)}
                className={`flex-1 py-1.5 text-sm rounded-md transition-colors duration-200 ${settings.populationDensity === opt.value ? 'bg-cyan-600 text-white shadow' : 'hover:bg-gray-600'}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="greenSpace" className="block text-sm font-medium text-gray-300 mb-1">Green Space Coverage ({settings.greenSpacePercentage}%)</label>
          <input
            type="range"
            id="greenSpace"
            min="10"
            max="70"
            value={settings.greenSpacePercentage}
            onChange={(e) => handleInputChange('greenSpacePercentage', parseInt(e.target.value, 10))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Building Mix</label>
          <div className="grid grid-cols-2 gap-2">
            {buildingMixOptions.map(opt => (
              <label key={opt.value} className="flex items-center space-x-2 cursor-pointer bg-gray-700 p-2 rounded-md hover:bg-gray-600">
                <input
                  type="checkbox"
                  checked={settings.buildingMix.includes(opt.value)}
                  onChange={() => handleCheckboxChange('buildingMix', opt.value)}
                  className="h-4 w-4 rounded bg-gray-600 border-gray-500 text-cyan-600 focus:ring-cyan-500"
                />
                <span className="text-sm">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Key Priorities</label>
          <div className="grid grid-cols-2 gap-2">
            {priorityOptions.map(opt => (
              <label key={opt.value} className="flex items-center space-x-2 cursor-pointer bg-gray-700 p-2 rounded-md hover:bg-gray-600">
                <input
                  type="checkbox"
                  checked={settings.priorities.includes(opt.value)}
                  onChange={() => handleCheckboxChange('priorities', opt.value)}
                  className="h-4 w-4 rounded bg-gray-600 border-gray-500 text-cyan-600 focus:ring-cyan-500"
                />
                <span className="text-sm">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
      <button
        onClick={onGenerate}
        disabled={isLoading}
        className="mt-8 w-full flex items-center justify-center bg-cyan-600 hover:bg-cyan-500 disabled:bg-cyan-800 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 shadow-lg"
      >
        {isLoading ? (
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <GenerateIcon className="h-5 w-5 mr-2" />
        )}
        {isLoading ? 'Generating Plan...' : 'Generate Plan'}
      </button>
    </div>
  );
};
