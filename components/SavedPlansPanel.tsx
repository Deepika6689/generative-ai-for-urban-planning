
import React from 'react';
import type { UrbanPlan } from '../types';
import { LoadIcon } from './icons/LoadIcon';
import { DeleteIcon } from './icons/DeleteIcon';
import { CityIcon } from './icons/CityIcon';

interface SavedPlansPanelProps {
  savedPlans: UrbanPlan[];
  onLoadPlan: (plan: UrbanPlan) => void;
  onDeletePlan: (cityName: string) => void;
}

export const SavedPlansPanel: React.FC<SavedPlansPanelProps> = ({ savedPlans, onLoadPlan, onDeletePlan }) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 shadow-2xl border border-gray-700">
      <h2 className="text-xl font-bold text-cyan-400 mb-4">Saved Plans</h2>
      <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
        {savedPlans.length === 0 ? (
          <p className="text-gray-400 text-sm">No plans saved yet. Generate and save a plan to see it here.</p>
        ) : (
          savedPlans.map(plan => (
            <div key={plan.cityName} className="flex items-center justify-between bg-gray-700/50 p-3 rounded-lg">
              <div className="flex items-center space-x-3">
                <CityIcon className="h-5 w-5 text-cyan-500" />
                <span className="font-medium text-white">{plan.cityName}</span>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => onLoadPlan(plan)}
                  className="p-1.5 text-gray-300 hover:text-white hover:bg-cyan-600 rounded-full transition-colors"
                  title="Load Plan"
                  aria-label={`Load plan for ${plan.cityName}`}
                >
                  <LoadIcon className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => onDeletePlan(plan.cityName)}
                  className="p-1.5 text-gray-300 hover:text-white hover:bg-red-600 rounded-full transition-colors"
                  title="Delete Plan"
                  aria-label={`Delete plan for ${plan.cityName}`}
                >
                  <DeleteIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
