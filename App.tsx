
import React, { useState, useCallback, useEffect } from 'react';
import { ControlsPanel } from './components/ControlsPanel';
import { PlanDisplay } from './components/PlanDisplay';
import { SavedPlansPanel } from './components/SavedPlansPanel';
import { AdvancedAIPage } from './components/AdvancedAIPage';
import { generateUrbanPlan } from './services/geminiService';
import type { ControlSettings, UrbanPlan, AIModule } from './types';
import { CityIcon } from './components/icons/CityIcon';
import { ModuleIcon } from './components/icons/ModuleIcon';
import { aiModules } from './config/aiModules';

type Page = 'planner' | 'enhancements';

const App: React.FC = () => {
  const [controlSettings, setControlSettings] = useState<ControlSettings>({
    cityName: 'Aethelgard',
    populationDensity: 'medium',
    greenSpacePercentage: 40,
    buildingMix: ['residential', 'commercial', 'mixed-use'],
    priorities: ['sustainability', 'walkability'],
  });

  const [urbanPlan, setUrbanPlan] = useState<UrbanPlan | null>(null);
  const [savedPlans, setSavedPlans] = useState<UrbanPlan[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('planner');
  const [activeModules, setActiveModules] = useState<Record<string, boolean>>({});
  const [moduleInputs, setModuleInputs] = useState<Record<string, Record<string, string | number | string[]>>>({});

  useEffect(() => {
    const plans: UrbanPlan[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('urban-plan-')) {
        try {
          const plan = JSON.parse(localStorage.getItem(key)!);
          plans.push(plan);
        } catch (e) {
          console.error('Failed to parse saved plan:', key, e);
        }
      }
    }
    setSavedPlans(plans.sort((a, b) => a.cityName.localeCompare(b.cityName)));
  }, []);

  const handleToggleModule = (module: AIModule) => {
    const moduleId = module.id;
    setActiveModules(prevActive => {
      const newActiveState = !prevActive[moduleId];
      
      setModuleInputs(prevInputs => {
        const newInputs = {...prevInputs};
        if (newActiveState) {
          // Module is being activated, initialize its inputs with defaults
          if (module.inputs) {
            newInputs[moduleId] = {};
            module.inputs.forEach(input => {
              newInputs[moduleId][input.id] = input.default;
            });
          }
        } else {
          // Module is being deactivated, remove its inputs
          delete newInputs[moduleId];
        }
        return newInputs;
      });
      
      return {
        ...prevActive,
        [moduleId]: newActiveState,
      };
    });
  };
  
  const handleModuleInputChange = (moduleId: string, inputId: string, value: string | number) => {
    setModuleInputs(prev => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        [inputId]: value,
      },
    }));
  };

  const handleSendFeedback = (moduleId: string, inputId: string, message: string) => {
    if (!message.trim()) return;
    setModuleInputs(prev => {
      const currentHistory = (prev[moduleId]?.[inputId] as string[] || []);
      const newHistory = [...currentHistory, message];
      return {
        ...prev,
        [moduleId]: {
          ...prev[moduleId],
          [inputId]: newHistory,
        },
      };
    });
  };

  const handleGeneratePlan = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setUrbanPlan(null);
    setCurrentPage('planner');
    try {
      const enabledModuleIds = Object.entries(activeModules)
        .filter(([, isActive]) => isActive)
        .map(([id]) => id);
      
      const plan = await generateUrbanPlan(controlSettings, enabledModuleIds, moduleInputs);
      setUrbanPlan(plan);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [controlSettings, activeModules, moduleInputs]);
  
  const handleSavePlan = useCallback((plan: UrbanPlan) => {
    try {
      localStorage.setItem(`urban-plan-${plan.cityName}`, JSON.stringify(plan));
      setSavedPlans(prev => {
        const otherPlans = prev.filter(p => p.cityName !== plan.cityName);
        return [...otherPlans, plan].sort((a, b) => a.cityName.localeCompare(b.cityName));
      });
    } catch (err) {
      console.error('Failed to save plan to localStorage:', err);
    }
  }, []);
  
  const handleLoadPlan = useCallback((plan: UrbanPlan) => {
    // A bit of a "hack" to find the original settings, but good for demo
    // In a real app, settings should be saved with the plan
    const originalSettings: ControlSettings = {
      cityName: plan.cityName,
      populationDensity: 'medium',
      greenSpacePercentage: plan.keyMetrics.greenSpacePercentage,
      buildingMix: ['residential', 'commercial', 'mixed-use'],
      priorities: ['sustainability', 'walkability'],
    };
    setControlSettings(originalSettings);
    setUrbanPlan(plan);
    setError(null);
    setCurrentPage('planner');
  }, []);

  const handleDeletePlan = useCallback((cityName: string) => {
    localStorage.removeItem(`urban-plan-${cityName}`);
    setSavedPlans(prev => prev.filter(p => p.cityName !== cityName));
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 shadow-lg sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CityIcon className="h-8 w-8 text-cyan-400" />
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Generative AI Urban Planner
            </h1>
          </div>
          <button
            onClick={() => setCurrentPage('enhancements')}
            className="flex items-center space-x-2 text-sm bg-gray-700 hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
            aria-label="View Advanced AI Modules"
          >
            <ModuleIcon className="h-5 w-5" />
            <span>AI Modules</span>
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentPage === 'planner' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="space-y-8">
                <ControlsPanel
                  settings={controlSettings}
                  setSettings={setControlSettings}
                  onGenerate={handleGeneratePlan}
                  isLoading={isLoading}
                />
                <SavedPlansPanel 
                  savedPlans={savedPlans}
                  onLoadPlan={handleLoadPlan}
                  onDeletePlan={handleDeletePlan}
                />
              </div>
            </div>
            <div className="lg:col-span-2">
              <PlanDisplay
                plan={urbanPlan}
                isLoading={isLoading}
                error={error}
                onSavePlan={handleSavePlan}
              />
            </div>
          </div>
        ) : (
          <AdvancedAIPage
            onBack={() => setCurrentPage('planner')}
            activeModules={activeModules}
            onToggleModule={handleToggleModule}
            moduleInputs={moduleInputs}
            onModuleInputChange={handleModuleInputChange}
            onSendFeedback={handleSendFeedback}
            onGeneratePlan={handleGeneratePlan}
            isGenerating={isLoading}
          />
        )}
      </main>
    </div>
  );
};

export default App;
