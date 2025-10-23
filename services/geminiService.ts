
import { GoogleGenAI, Type } from "@google/genai";
import type { ControlSettings, UrbanPlan, GridCell } from '../types';
import { LandUse } from '../types';

const GRID_SIZE = 20;

function buildEnhancementPrompt(moduleId: string, inputs: Record<string, any>): string {
    switch (moduleId) {
        case 'citizen-feedback': {
            const feedbackHistory = inputs['feedback-history'] as string[] | undefined;
            if (!feedbackHistory || feedbackHistory.length === 0) {
                return `Incorporate citizen feedback. Specifically: "focus on public happiness and accessibility".`;
            }
            const feedbackPoints = feedbackHistory.map(f => `- "${f.trim()}"`).join('\n');
            return `Incorporate the following list of specific citizen feedback points into the design:\n${feedbackPoints}`;
        }
        case 'multi-objective-optimization': {
            const trafficVsGreen = inputs['traffic-vs-green'] as number; // 0-100
            const economicVsResidential = inputs['economic-vs-residential'] as number; // 0-100
            
            let optoPrompt = 'Optimize the layout by balancing competing objectives. ';
            if (trafficVsGreen < 30) optoPrompt += 'Strongly prioritize expansive green spaces and pedestrian access over maximizing traffic throughput. ';
            else if (trafficVsGreen > 70) optoPrompt += 'Strongly prioritize efficient traffic flow and clear road hierarchy over maximizing green space coverage. ';
            else optoPrompt += 'Strike a balance between traffic efficiency and green space access. ';

            if (economicVsResidential < 30) optoPrompt += 'The focus should be on high-quality residential comfort and community spaces over dense economic zones. ';
            else if (economicVsResidential > 70) optoPrompt += 'The focus should be on creating a vibrant economic hub with dense commercial areas over maximizing residential space. ';
            else optoPrompt += 'Balance economic growth with residential comfort. ';
            return optoPrompt;
        }
        case '3d-ar-viz':
            return 'Design visually striking areas and landmarks, particularly a well-defined central hub, that would be impressive in 3D visualizations.';
        case 'climate-sustainability': {
            const goals = inputs['sustainability-goals'] as string[] | undefined;
            if (!goals || goals.length === 0) {
                return `Focus on climate sustainability, implementing a wide range of green technologies like solar, green roofs, and water conservation.`;
            }
            const goalPoints = goals.map(g => `- "${g.trim()}"`).join('\n');
            return `Focus on climate sustainability, incorporating these specific goals:\n${goalPoints}`;
        }
        case 'adaptive-learning': {
            const inspirations = inputs['city-inspirations'] as string[] | undefined;
            if (!inspirations || inspirations.length === 0) {
                return `Draw inspiration from successful real-world cities, like efficient, circular cities such as Amsterdam or Copenhagen.`;
            }
            const inspirationPoints = inspirations.map(i => `- "${i.trim()}"`).join('\n');
            return `Draw inspiration from the following real-world cities and concepts:\n${inspirationPoints}`;
        }
        case 'budget-constraints': {
            const constraints = inputs['budget-constraints-list'] as string[] | undefined;
            if (!constraints || constraints.length === 0) {
                return `Adhere to realistic budget and resource constraints, generating a practical and cost-effective layout.`;
            }
            const constraintPoints = constraints.map(c => `- "${c.trim()}"`).join('\n');
            return `Adhere to the following specific budget and resource constraints:\n${constraintPoints}`;
        }
        case 'disaster-planning': {
            const disasters = inputs['disaster-types'] as string[] | undefined;
            if (!disasters || disasters.length === 0) {
                return `Incorporate emergency and disaster planning for general resilience, ensuring robust evacuation routes.`;
            }
            const disasterPoints = disasters.map(d => `- "${d.trim()}"`).join('\n');
            return `Incorporate emergency and disaster planning. The design must be resilient against these specific hazards:\n${disasterPoints}`;
        }
        default:
            return '';
    }
}


/**
 * Normalizes the grid received from the AI to ensure it's a valid 20x20 grid.
 * It pads missing rows/cells and truncates oversized ones.
 * @param grid The raw grid data from the AI.
 * @param size The target size (e.g., 20 for a 20x20 grid).
 * @returns A valid GridCell[][] array.
 */
function normalizeGrid(grid: any, size: number): GridCell[][] {
    const defaultCell: GridCell = { landUse: LandUse.Empty, density: 0 };
    
    if (!Array.isArray(grid)) {
        // If grid is not an array at all, create a new empty grid
        return Array.from({ length: size }, () => 
            Array.from({ length: size }, () => ({ ...defaultCell }))
        );
    }

    // 1. Pad or truncate rows (vertically)
    let normalizedGrid = grid.slice(0, size);
    while (normalizedGrid.length < size) {
        normalizedGrid.push([]);
    }

    // 2. Pad or truncate cells in each row (horizontally) and validate cell content
    return normalizedGrid.map(row => {
        let normalizedRow = Array.isArray(row) ? row.slice(0, size) : [];
        while (normalizedRow.length < size) {
            normalizedRow.push({ ...defaultCell });
        }
        
        // Ensure each cell is valid
        return normalizedRow.map(cell => {
            if (cell && typeof cell === 'object' && cell.landUse && typeof cell.density === 'number') {
                // Check if landUse is a valid enum value, if not, default it
                if (Object.values(LandUse).includes(cell.landUse)) {
                    return {
                        landUse: cell.landUse,
                        density: Math.max(0, Math.min(1, cell.density)) // Clamp density between 0 and 1
                    };
                }
            }
            return { ...defaultCell };
        });
    });
}


export async function generateUrbanPlan(settings: ControlSettings, activeModuleIds: string[], moduleInputs: Record<string, Record<string, any>>): Promise<UrbanPlan> {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  let enhancementsPrompt = '';
  if (activeModuleIds.length > 0) {
    enhancementsPrompt = `
    **Activated AI Enhancements:**
    The design must also incorporate the following advanced principles:
    ${activeModuleIds.map(id => {
      const inputs = moduleInputs[id] || {};
      const enhancement = buildEnhancementPrompt(id, inputs);
      return `- ${enhancement}`;
    }).filter(Boolean).join('\n')}
    `;
  }

  const prompt = `
    Generate a modern smart city plan for "${settings.cityName}" with a realistic and futuristic design. The layout should be organized and efficient but have a natural, organic flow.

    **Core Concept:**
    Design a well-balanced, sustainable city that blends technology with nature. The city is organized around a central hub with circular and radial roads for excellent connectivity. Green corridors link parks and open spaces, promoting an eco-friendly lifestyle.

    **Constraints and Priorities:**
    - Population Density: ${settings.populationDensity}
    - Desired Green Space: Approximately ${settings.greenSpacePercentage}% of the total area.
    - Allowed Building Mix: ${settings.buildingMix.join(', ')}. Emphasize mixed-use development.
    - Key Development Priorities: ${settings.priorities.join(', ')}. Focus on sustainability and quality of life.
    ${enhancementsPrompt}
    **Output Requirements:**
    Provide a detailed plan in JSON format conforming to the provided schema.

    1.  **description**: Write a compelling, one-paragraph narrative describing this modern smart city. Mention the balance of technology and nature, the central hub, mixed-use zones, and sustainability features. If any AI enhancements were activated, subtly reference their influence in the description.
    2.  **keyMetrics**: Provide estimated values. The sustainabilityScore should reflect the city's eco-friendliness.
    3.  **layoutGrid**: Generate a grid representing the city layout. The grid MUST be exactly ${GRID_SIZE} rows and ${GRID_SIZE} columns. For each cell, provide a \`landUse\` type and a \`density\` value (a number between 0.0 for low density and 1.0 for high density).

    **Visual Guidelines for the Layout Grid:**
    - **Central Hub ('central-hub'):** Create a distinct, high-density city center that serves as the focal point for commerce, culture, and public services.
    - **Roads ('main-road', 'secondary-road'):** Design a network of main roads in circular or radial patterns around the hub, with secondary roads branching off to connect zones.
    - **Mixed-Use Zones ('mixed-use'):** Create vibrant neighborhoods that combine residential, commercial, and recreational spaces.
    - **Green Rooftops ('rooftop-garden'):** Distribute these throughout residential and commercial zones to represent sustainable building practices.
    - **Solar Fields ('solar-field'):** Place one or two dedicated areas for renewable energy generation, typically on the city outskirts.
    - **EV Charging Zones ('ev-charging-zone'):** Integrate these into commercial and mixed-use areas.
    - **Green Corridors ('green-corridor'):** Use these to link larger parks ('park') and create seamless connections for pedestrians and wildlife.
  `;
  
  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      cityName: { type: Type.STRING },
      description: { type: Type.STRING },
      keyMetrics: {
        type: Type.OBJECT,
        properties: {
          populationEstimate: { type: Type.STRING },
          greenSpacePercentage: { type: Type.NUMBER },
          dominantBuildingType: { type: Type.STRING },
          sustainabilityScore: { type: Type.NUMBER },
        },
        required: ['populationEstimate', 'greenSpacePercentage', 'dominantBuildingType', 'sustainabilityScore'],
      },
      layoutGrid: {
        type: Type.ARRAY,
        items: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              landUse: { 
                type: Type.STRING,
                enum: Object.values(LandUse).filter(
                  (value) => ![
                    'industrial', 'innovation-hub', 'tech-district', 
                    'automated-transport-corridor', 'smart-grid-node', 'wind-turbine'
                  ].includes(value)
                ),
              },
              density: { type: Type.NUMBER }
            },
            required: ['landUse', 'density']
          },
        },
      },
    },
    required: ['cityName', 'description', 'keyMetrics', 'layoutGrid'],
  };

  try {
    // Retry logic with fallback for model overload errors
const MAX_RETRIES = 3;
let response;
let modelName = "gemini-2.5-flash";

for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
  try {
    response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.7,
      },
    });
    break; // success → exit loop
  } catch (err: any) {
    console.warn(`Attempt ${attempt} failed: ${err.message}`);

    // If it's a 503 or overload, retry with delay or fallback
    if (err.message?.includes("overloaded") || err.message?.includes("503")) {
      if (attempt < MAX_RETRIES) {
        const delay = 1000 * Math.pow(2, attempt);
        console.log(`Model busy. Retrying in ${delay / 1000}s...`);
        await new Promise(r => setTimeout(r, delay));
      } else {
        // Final attempt → fallback to lighter model
        console.log("Falling back to gemini-2.5-flash-lite...");
        modelName = "gemini-2.5-flash-lite";
      }
    } else {
      throw err; // Other errors → stop retrying
    }
  }
}

if (!response) throw new Error("Gemini API did not return a response after retries.");


    const jsonText = response.text.trim();
    let parsedPlan: UrbanPlan;
    try {
        parsedPlan = JSON.parse(jsonText);
    } catch(e) {
        console.error("Failed to parse JSON from model:", jsonText);
        throw new Error("The AI model returned a response that was not valid JSON.");
    }
    
    // Replace the rigid validation with robust normalization
    parsedPlan.layoutGrid = normalizeGrid(parsedPlan.layoutGrid, GRID_SIZE);

    return parsedPlan;

  } catch (error) {
    console.error("Error generating urban plan:", error);
    if (error instanceof Error) {
        // Re-throw our specific errors or any other error that was thrown
        throw error;
    }
    // Fallback for non-Error objects being thrown
    throw new Error("Failed to generate the urban plan due to an unexpected issue.");
  }
}
