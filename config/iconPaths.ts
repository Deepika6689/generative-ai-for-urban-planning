
import { LandUse } from '../types';

interface IconData {
  path: string;
  color: string;
}

export const iconPaths: Partial<Record<LandUse, IconData>> = {
  [LandUse.CentralHub]: {
    path: 'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z',
    color: 'rgba(113, 63, 18, 0.7)', // text-yellow-900/70
  },
  [LandUse.Landmark]: {
    path: 'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z',
    color: 'rgba(113, 63, 18, 0.7)',
  },
  [LandUse.SolarField]: {
    path: 'M4 2h16v20H4V2zm2 2v3h4V4H6zm5 0v3h4V4h-4zM6 9v3h4V9H6zm5 0v3h4V9h-4zm-5 5v3h4v-3H6zm5 0v3h4v-3h-4z',
    color: 'rgba(186, 230, 253, 0.8)', // text-sky-200/80
  },
  [LandUse.EVChargingZone]: {
    path: 'M15 7v4h-4L8 18v-4h1l3-7h3zm-3-4C6.48 3 2 7.48 2 13s4.48 10 10 10 10-4.48 10-10S17.52 3 12 3zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z',
    color: 'rgba(30, 58, 138, 0.8)', // text-blue-900/80
  },
  [LandUse.RooftopGarden]: {
    path: 'M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10,10-4.48,10-10S17.52,2,12,2z M16.36,14.36c-0.78,0.78-1.8,1.24-2.83,1.35 c-1.03,0.11-2.08-0.18-2.94-0.81c-0.87-0.63-1.46-1.59-1.65-2.65c-0.19-1.06,0.06-2.15,0.7-3.05c0.64-0.9,1.68-1.5,2.82-1.6 c1.14-0.1,2.26,0.22,3.13,0.91c0.87,0.69,1.44,1.69,1.58,2.77C17.76,12.2,17.4,13.4,16.36,14.36z',
    color: 'rgba(20, 83, 45, 0.7)', // text-green-900/70
  },
};
