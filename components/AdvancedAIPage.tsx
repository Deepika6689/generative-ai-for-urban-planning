
import React, { useState } from 'react';
import type { AIModule } from '../types';
import { aiModules } from '../config/aiModules';
import { BackArrowIcon } from './icons/BackArrowIcon';
import { ModuleIcon } from './icons/ModuleIcon';
import { GenerateIcon } from './icons/GenerateIcon';
import { SendIcon } from './icons/SendIcon';

interface AIModuleCardProps {
  module: AIModule;
  isActive: boolean;
  onToggle: (module: AIModule) => void;
  inputValues?: Record<string, string | number | string[]>;
  onInputChange: (moduleId: string, inputId: string, value: string | number) => void;
  onSendFeedback: (moduleId: string, inputId: string, message: string) => void;
}

const AIModuleCard: React.FC<AIModuleCardProps> = ({ module, isActive, onToggle, inputValues, onInputChange, onSendFeedback }) => {
  const Icon = module.icon;
  const activeClasses = isActive 
    ? 'border-cyan-500/80 shadow-[0_0_20px_rgba(6,182,212,0.3)]' 
    : 'border-gray-700';
  
  const [chatInput, setChatInput] = useState('');

  return (
    <div className={`bg-gray-800/50 backdrop-blur-sm border rounded-xl p-6 flex flex-col items-start space-y-4 transition-all duration-300 ${activeClasses}`}>
      <div className="flex justify-between items-start w-full">
        <div className="p-3 bg-gray-700/50 border border-gray-600 rounded-lg">
          <Icon className="h-7 w-7 text-cyan-400" />
        </div>
        <button
          onClick={() => onToggle(module)}
          className={`relative inline-flex items-center h-5 rounded-full w-10 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500 ${isActive ? 'bg-cyan-600' : 'bg-gray-700'}`}
          aria-pressed={isActive}
        >
          <span className={`inline-block w-3 h-3 transform bg-white rounded-full transition-transform duration-300 ${isActive ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      </div>
      <h3 className="text-lg font-bold text-white pt-2">{module.title}</h3>
      <p className="text-gray-400 text-sm flex-grow">{module.description}</p>
      
      {isActive && module.inputs && (
        <div className="w-full mt-2 space-y-4 animate-fade-in" onClick={e => e.stopPropagation()}>
          {module.inputs.map(input => {
            const handleSend = () => {
              if (input.type === 'chat') {
                onSendFeedback(module.id, input.id, chatInput);
                setChatInput('');
              }
            };
            
            return (
              <div key={input.id}>
                <label className="block text-xs font-medium text-gray-400 mb-2">{input.label}</label>
                {input.type === 'text' && (
                  <textarea
                      value={inputValues?.[input.id] as string || ''}
                      onChange={(e) => onInputChange(module.id, input.id, e.target.value)}
                      placeholder={input.placeholder}
                      className="w-full h-24 bg-gray-900 border border-gray-600 rounded-md p-2 text-sm text-gray-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none resize-none"
                  />
                )}
                {input.type === 'slider' && (
                  <div className="space-y-1">
                     <input
                          type="range"
                          min={input.min}
                          max={input.max}
                          value={inputValues?.[input.id] as number || 50}
                          onChange={(e) => onInputChange(module.id, input.id, parseInt(e.target.value, 10))}
                          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                          <span>{input.label.split('vs.')[0].split(':')[1].trim()}</span>
                          <span>{input.label.split('vs.')[1].trim()}</span>
                      </div>
                  </div>
                )}
                {input.type === 'chat' && (
                  <div className="space-y-2">
                    <div className="h-32 max-h-32 bg-gray-900 rounded-md p-2 overflow-y-auto space-y-2 border border-gray-600">
                      {(inputValues?.[input.id] as string[] || []).length > 0 ? (
                        (inputValues?.[input.id] as string[]).map((msg, index) => (
                          <div key={index} className="bg-gray-700/80 text-gray-300 text-sm p-2 rounded-lg animate-fade-in">
                            {msg}
                          </div>
                        ))
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                          No feedback added yet.
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder={input.placeholder}
                        className="flex-grow bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                      />
                      <button 
                        onClick={handleSend}
                        className="p-2 bg-cyan-600 hover:bg-cyan-500 rounded-md text-white transition-colors disabled:bg-gray-600"
                        disabled={!chatInput.trim()}
                        aria-label="Send feedback"
                      >
                        <SendIcon className="h-5 w-5"/>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  );
};


interface AdvancedAIPageProps {
  onBack: () => void;
  activeModules: Record<string, boolean>;
  onToggleModule: (module: AIModule) => void;
  moduleInputs: Record<string, Record<string, string | number | string[]>>;
  onModuleInputChange: (moduleId: string, inputId: string, value: string | number) => void;
  onSendFeedback: (moduleId: string, inputId: string, message: string) => void;
  onGeneratePlan: () => void;
  isGenerating: boolean;
}

export const AdvancedAIPage: React.FC<AdvancedAIPageProps> = ({ 
  onBack, 
  activeModules, 
  onToggleModule, 
  moduleInputs, 
  onModuleInputChange,
  onSendFeedback,
  onGeneratePlan,
  isGenerating,
}) => {
  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
        <div>
            <div className="flex items-center gap-3">
                <ModuleIcon className="h-8 w-8 text-cyan-400" />
                <h2 className="text-3xl font-bold text-white">Advanced AI Enhancements</h2>
            </div>
            <p className="text-gray-400 mt-2">Activate powerful AI modules to refine, analyze, and future-proof your urban designs.</p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-sm bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
              aria-label="Back to planner"
            >
              <BackArrowIcon className="h-5 w-5" />
              <span>Back</span>
            </button>
            <button
              onClick={onGeneratePlan}
              disabled={isGenerating}
              className="flex items-center justify-center bg-cyan-600 hover:bg-cyan-500 disabled:bg-cyan-800 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 shadow-lg text-sm"
            >
              {isGenerating ? (
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <GenerateIcon className="h-5 w-5 mr-2" />
              )}
              {isGenerating ? 'Generating...' : 'Generate Plan'}
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {aiModules.map(module => (
          <AIModuleCard 
            key={module.id} 
            module={module}
            isActive={!!activeModules[module.id]}
            onToggle={onToggleModule}
            inputValues={moduleInputs[module.id]}
            onInputChange={onModuleInputChange}
            onSendFeedback={onSendFeedback}
          />
        ))}
      </div>
    </div>
  );
};
