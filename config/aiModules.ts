
import type { AIModule } from '../types';
import { CitizenFeedbackIcon } from '../components/icons/CitizenFeedbackIcon';
import { OptimizationIcon } from '../components/icons/OptimizationIcon';
import { ARViewIcon } from '../components/icons/ARViewIcon';
import { ClimateIcon } from '../components/icons/ClimateIcon';
import { AILearningIcon } from '../components/icons/AILearningIcon';
import { BudgetIcon } from '../components/icons/BudgetIcon';
import { DisasterPlanIcon } from '../components/icons/DisasterPlanIcon';

export const aiModules: AIModule[] = [
  {
    id: 'citizen-feedback',
    title: 'Citizen Feedback Simulation',
    description: 'Add specific points of feedback for the AI to consider, simulating a public consultation process.',
    icon: CitizenFeedbackIcon,
    inputs: [{
      id: 'feedback-history',
      label: 'Citizen Feedback',
      type: 'chat',
      placeholder: "Type feedback and press send...",
      default: [],
    }],
  },
  {
    id: 'multi-objective-optimization',
    title: 'Multi-objective Optimization',
    description: 'Balance competing objectives to find an optimal layout. The AI will prioritize based on your settings.',
    icon: OptimizationIcon,
    inputs: [
      { id: 'traffic-vs-green', label: 'Balance: Traffic Flow vs. Green Space', type: 'slider', min: 0, max: 100, default: 50 },
      { id: 'economic-vs-residential', label: 'Focus: Economic Growth vs. Residential Comfort', type: 'slider', min: 0, max: 100, default: 50 }
    ],
  },
  {
    id: '3d-ar-viz',
    title: '3D Visualization & AR',
    description: 'Instructs the AI to design visually striking areas and landmarks suitable for 3D/AR mockups.',
    icon: ARViewIcon,
  },
  {
    id: 'climate-sustainability',
    title: 'Climate & Sustainability Prediction',
    description: 'Add specific environmental goals for the AI to prioritize in its design.',
    icon: ClimateIcon,
    inputs: [{
      id: 'sustainability-goals',
      label: 'Sustainability Goals',
      type: 'chat',
      placeholder: "Add a goal and press send...",
      default: [],
    }],
  },
  {
    id: 'adaptive-learning',
    title: 'Adaptive Learning from Real Cities',
    description: 'Add real-world cities or design concepts for the AI to draw inspiration from.',
    icon: AILearningIcon,
    inputs: [{
      id: 'city-inspirations',
      label: 'Cities & Concepts to Emulate',
      type: 'chat',
      placeholder: "Add an inspiration and press send...",
      default: [],
    }],
  },
  {
    id: 'budget-constraints',
    title: 'Budget & Resource Constraints',
    description: 'Add specific financial and material limits for more realistic, actionable plans.',
    icon: BudgetIcon,
    inputs: [{
      id: 'budget-constraints-list',
      label: 'Specific Constraints',
      type: 'chat',
      placeholder: "Add a constraint and press send...",
      default: [],
    }],
  },
  {
    id: 'disaster-planning',
    title: 'Emergency & Disaster Planning',
    description: 'Add specific hazards (e.g., flooding, earthquakes) for the AI to design against.',
    icon: DisasterPlanIcon,
    inputs: [{
      id: 'disaster-types',
      label: 'Hazards to Plan For',
      type: 'chat',
      placeholder: "Add a hazard and press send...",
      default: [],
    }],
  },
];
