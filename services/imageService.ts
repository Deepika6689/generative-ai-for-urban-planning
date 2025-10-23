
import { landUseConfig } from '../config/landUseConfig';
import { iconPaths } from '../config/iconPaths';
import type { GridCell } from '../types';
import { LandUse } from '../types';

const CELL_SIZE = 40; // The size of each cell in pixels
const ICON_SCALE = 0.6; // Scale of the icon within the cell

export async function renderGridToImage(gridData: GridCell[][]): Promise<string> {
  if (!gridData || gridData.length === 0) {
    throw new Error("Grid data is empty or invalid.");
  }
  const gridSize = gridData.length;
  const canvasSize = gridSize * CELL_SIZE;

  const canvas = document.createElement('canvas');
  canvas.width = canvasSize;
  canvas.height = canvasSize;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Could not get canvas context');
  }
  
  // Set a background color
  ctx.fillStyle = landUseConfig[LandUse.Empty].hex;
  ctx.fillRect(0, 0, canvasSize, canvasSize);

  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const cell = gridData[y][x];
      if (!cell || !cell.landUse || !landUseConfig[cell.landUse]) continue;

      const config = landUseConfig[cell.landUse];
      const cellX = x * CELL_SIZE;
      const cellY = y * CELL_SIZE;

      // Draw cell background
      ctx.save();
      ctx.fillStyle = config.hex;
      ctx.globalAlpha = 1; // Reset alpha before applying filter
      ctx.filter = `brightness(${1.2 - (cell.density || 0.5) * 0.5})`;
      ctx.fillRect(cellX, cellY, CELL_SIZE, CELL_SIZE);
      ctx.restore();

      // Draw icon if it exists
      const iconData = iconPaths[cell.landUse];
      if (iconData) {
        ctx.save();
        // Center the icon
        ctx.translate(cellX + CELL_SIZE / 2, cellY + CELL_SIZE / 2);
        
        // Scale the icon
        const scale = (CELL_SIZE / 24) * ICON_SCALE; // Icons are on a 24x24 viewBox
        ctx.scale(scale, scale);

        // Center the 24x24 viewbox
        ctx.translate(-12, -12);

        // Draw path
        const path = new Path2D(iconData.path);
        ctx.fillStyle = iconData.color;
        ctx.fill(path);

        ctx.restore();
      }
    }
  }

  return canvas.toDataURL('image/png');
}
