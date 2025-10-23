
import React, { useState } from 'react';
import type { UrbanPlan } from '../types';
import { CityGrid } from './CityGrid';
import { ChartIcon } from './icons/ChartIcon';
import { InfoIcon } from './icons/InfoIcon';
import { SaveIcon } from './icons/SaveIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { renderGridToImage } from '../services/imageService';

interface PlanDisplayProps {
  plan: UrbanPlan | null;
  isLoading: boolean;
  error: string | null;
  onSavePlan: (plan: UrbanPlan) => void;
}

const MetricCard: React.FC<{ title: string; value: string | number; unit?: string }> = ({ title, value, unit }) => (
    <div className="bg-gray-700/50 p-4 rounded-lg text-center">
        <p className="text-sm text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-cyan-400">
            {value}
            {unit && <span className="text-lg ml-1">{unit}</span>}
        </p>
    </div>
);

export const PlanDisplay: React.FC<PlanDisplayProps> = ({ plan, isLoading, error, onSavePlan }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [isSavingImage, setIsSavingImage] = useState(false);

  const handleSavePlan = () => {
    if (!plan) return;
    onSavePlan(plan);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
    }, 2000);
  };

  const handleSaveAsImage = async () => {
    if (!plan) return;
    setIsSavingImage(true);
    try {
      const dataUrl = await renderGridToImage(plan.layoutGrid);
      const link = document.createElement('a');
      link.download = `${plan.cityName.toLowerCase().replace(/\s+/g, '-')}-plan.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Failed to save image:', err);
      // You could show an error to the user here
    } finally {
      setIsSavingImage(false);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center text-center p-8">
          <svg className="animate-spin h-12 w-12 text-cyan-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <h3 className="text-xl font-semibold">Generating Urban Masterpiece...</h3>
          <p className="text-gray-400 mt-2">The AI is architecting your city. This may take a moment.</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center text-center p-8 bg-red-900/20 border border-red-500 rounded-lg">
          <h3 className="text-xl font-semibold text-red-400">Error Generating Plan</h3>
          <p className="text-gray-300 mt-2">{error}</p>
        </div>
      );
    }

    if (!plan) {
      return (
        <div className="text-center p-8">
          <h3 className="text-2xl font-semibold text-gray-300">Welcome to the Urban Planner</h3>
          <p className="text-gray-400 mt-2">Configure your city's parameters on the left and click "Generate Plan" to begin.</p>
        </div>
      );
    }

    return (
      <div className="space-y-8 w-full">
        <div>
           <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
            <h2 className="text-3xl font-bold text-white">{plan.cityName}</h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleSavePlan}
                disabled={isSaved}
                className="flex items-center bg-gray-700 hover:bg-cyan-700 disabled:bg-green-600 text-white font-bold py-2 px-3 rounded-lg transition-colors duration-300 disabled:cursor-not-allowed text-sm"
                aria-label="Save plan"
              >
                <SaveIcon className="h-5 w-5 mr-2" />
                {isSaved ? 'Saved!' : 'Save Plan'}
              </button>
              <button
                onClick={handleSaveAsImage}
                disabled={isSavingImage}
                className="flex items-center bg-gray-700 hover:bg-cyan-700 disabled:bg-cyan-900 text-white font-bold py-2 px-3 rounded-lg transition-colors duration-300 disabled:cursor-not-allowed text-sm"
                aria-label="Export as Image"
              >
                {isSavingImage ? (
                  <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <DownloadIcon className="h-5 w-5 mr-2" />
                )}
                {isSavingImage ? 'Saving...' : 'Export Image'}
              </button>
            </div>
          </div>
          <div className="flex items-center text-cyan-400 mb-4">
             <InfoIcon className="h-5 w-5 mr-2"/>
             <h3 className="text-xl font-semibold">Plan Overview</h3>
          </div>
          <p className="text-gray-300 leading-relaxed bg-gray-800 p-4 rounded-md">{plan.description}</p>
        </div>
        
        <div>
           <div className="flex items-center text-cyan-400 mb-4">
             <ChartIcon className="h-5 w-5 mr-2"/>
             <h3 className="text-xl font-semibold">Key Metrics</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard title="Population Est." value={plan.keyMetrics.populationEstimate} />
            <MetricCard title="Green Space" value={plan.keyMetrics.greenSpacePercentage} unit="%" />
            <MetricCard title="Sustainability" value={plan.keyMetrics.sustainabilityScore} unit="/100" />
            <MetricCard title="Dominant Zone" value={plan.keyMetrics.dominantBuildingType} />
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-cyan-400 mb-4">City Layout Visualization</h3>
          <CityGrid gridData={plan.layoutGrid} />
        </div>
      </div>
    );
  };
  
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 shadow-2xl border border-gray-700 min-h-[500px] w-full flex items-center justify-center">
      {renderContent()}
    </div>
  );
};
