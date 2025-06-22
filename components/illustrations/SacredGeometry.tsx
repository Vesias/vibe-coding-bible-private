/**
 * Sacred Geometry Pattern Library
 * 
 * Contains all the divine mathematical patterns that form the foundation
 * of the Vibe Coding Bible's visual language. Each pattern is based on
 * ancient sacred geometry principles applied to modern tech aesthetics.
 */

import React from 'react';
import { DesignTokens, DesignUtils } from '../../lib/sacred-design/visual-system';

interface SacredGeometryProps {
  pattern: 'flower-of-life' | 'golden-spiral' | 'metatrons-cube' | 'vesica-piscis' | 'tree-of-life' | 'sri-yantra' | 'torus' | 'mandala';
  size?: number;
  color?: string;
  accentColor?: string;
  animated?: boolean;
  glowEffect?: boolean;
  className?: string;
}

export const SacredGeometry: React.FC<SacredGeometryProps> = ({
  pattern,
  size = 400,
  color = DesignTokens.colors.primary.electricIndigo,
  accentColor = DesignTokens.colors.primary.techGold,
  animated = true,
  glowEffect = true,
  className = ''
}) => {
  const patternId = `pattern-${pattern}-${Date.now()}`;
  const glowId = `glow-${pattern}-${Date.now()}`;
  const gradientId = `gradient-${pattern}-${Date.now()}`;

  return (
    <div className={`sacred-geometry ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        xmlns="http://www.w3.org/2000/svg"
        className={animated ? 'animate-sacred-rotation' : ''}
      >
        <defs>
          {/* Sacred Gradient */}
          <radialGradient id={gradientId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={color} stopOpacity="0.8" />
            <stop offset="70%" stopColor={accentColor} stopOpacity="0.4" />
            <stop offset="100%" stopColor={color} stopOpacity="0.1" />
          </radialGradient>

          {/* Divine Glow Filter */}
          {glowEffect && (
            <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          )}
        </defs>

        {/* Render Sacred Pattern */}
        {renderSacredPattern(pattern, size, color, accentColor, gradientId, glowId, glowEffect)}
      </svg>
    </div>
  );
};

/**
 * Render specific sacred geometry patterns
 */
function renderSacredPattern(
  pattern: string,
  size: number,
  color: string,
  accentColor: string,
  gradientId: string,
  glowId: string,
  glowEffect: boolean
): JSX.Element {
  const centerX = size / 2;
  const centerY = size / 2;
  const filter = glowEffect ? `url(#${glowId})` : undefined;

  switch (pattern) {
    case 'flower-of-life':
      return renderFlowerOfLife(centerX, centerY, size, color, filter);
    
    case 'golden-spiral':
      return renderGoldenSpiral(centerX, centerY, size, color, accentColor, filter);
    
    case 'metatrons-cube':
      return renderMetatronsCube(centerX, centerY, size, color, accentColor, filter);
    
    case 'vesica-piscis':
      return renderVesicaPiscis(centerX, centerY, size, color, filter);
    
    case 'tree-of-life':
      return renderTreeOfLife(centerX, centerY, size, color, accentColor, filter);
    
    case 'sri-yantra':
      return renderSriYantra(centerX, centerY, size, color, accentColor, filter);
    
    case 'torus':
      return renderTorus(centerX, centerY, size, color, accentColor, gradientId);
    
    case 'mandala':
      return renderTechMandala(centerX, centerY, size, color, accentColor, filter);
    
    default:
      return <></>;
  }
}

/**
 * Flower of Life - The fundamental pattern of creation
 */
function renderFlowerOfLife(centerX: number, centerY: number, size: number, color: string, filter?: string): JSX.Element {
  const radius = size / 8;
  const circles = [];

  // Center circle
  circles.push({ x: centerX, y: centerY });

  // First ring - 6 circles
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3;
    circles.push({
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    });
  }

  // Second ring - 12 circles
  for (let i = 0; i < 12; i++) {
    const angle = (i * Math.PI) / 6;
    circles.push({
      x: centerX + 2 * radius * Math.cos(angle),
      y: centerY + 2 * radius * Math.sin(angle)
    });
  }

  return (
    <g>
      {circles.map((circle, index) => (
        <circle
          key={index}
          cx={circle.x}
          cy={circle.y}
          r={radius * 0.8}
          stroke={color}
          strokeWidth="1.5"
          fill="none"
          opacity="0.6"
          filter={filter}
        />
      ))}
    </g>
  );
}

/**
 * Golden Spiral - The ratio of divine proportion
 */
function renderGoldenSpiral(centerX: number, centerY: number, size: number, color: string, accentColor: string, filter?: string): JSX.Element {
  const phi = DesignTokens.spacing.sacred.phi;
  const initialRadius = size / 20;
  let radius = initialRadius;
  let x = centerX;
  let y = centerY;
  let path = `M ${x} ${y}`;

  // Generate spiral segments
  for (let i = 0; i < 4; i++) {
    const startAngle = i * Math.PI / 2;
    const endAngle = (i + 1) * Math.PI / 2;
    
    const endX = x + radius * Math.cos(endAngle);
    const endY = y + radius * Math.sin(endAngle);
    
    path += ` A ${radius} ${radius} 0 0 1 ${endX} ${endY}`;
    
    x = endX;
    y = endY;
    radius *= phi;
  }

  // Golden rectangles
  const rectangles = [];
  let rectSize = initialRadius * 2;
  let rectX = centerX - rectSize / 2;
  let rectY = centerY - rectSize / 2;

  for (let i = 0; i < 4; i++) {
    rectangles.push({
      x: rectX,
      y: rectY,
      width: rectSize,
      height: rectSize / phi
    });
    rectSize *= phi;
  }

  return (
    <g>
      {/* Golden rectangles */}
      {rectangles.map((rect, index) => (
        <rect
          key={index}
          x={rect.x}
          y={rect.y}
          width={rect.width}
          height={rect.height}
          stroke={accentColor}
          strokeWidth="1"
          fill="none"
          opacity="0.3"
        />
      ))}
      {/* Spiral path */}
      <path
        d={path}
        stroke={color}
        strokeWidth="3"
        fill="none"
        filter={filter}
        opacity="0.8"
      />
    </g>
  );
}

/**
 * Metatron's Cube - The blueprint of all creation
 */
function renderMetatronsCube(centerX: number, centerY: number, size: number, color: string, accentColor: string, filter?: string): JSX.Element {
  const radius = size / 6;
  
  // 13 circles in specific formation
  const circles = [
    { x: centerX, y: centerY }, // Center
    // Inner hexagon
    ...DesignUtils.generateCirclePoints(6, radius, centerX, centerY),
    // Outer hexagon  
    ...DesignUtils.generateCirclePoints(6, radius * Math.sqrt(3), centerX, centerY)
  ];

  // Connection lines between all circles
  const connections = [];
  for (let i = 0; i < circles.length; i++) {
    for (let j = i + 1; j < circles.length; j++) {
      connections.push({
        x1: circles[i].x,
        y1: circles[i].y,
        x2: circles[j].x,
        y2: circles[j].y
      });
    }
  }

  return (
    <g>
      {/* Connection lines */}
      {connections.map((line, index) => (
        <line
          key={index}
          x1={line.x1}
          y1={line.y1}
          x2={line.x2}
          y2={line.y2}
          stroke={accentColor}
          strokeWidth="0.5"
          opacity="0.3"
        />
      ))}
      {/* Circles */}
      {circles.map((circle, index) => (
        <circle
          key={index}
          cx={circle.x}
          cy={circle.y}
          r={radius / 4}
          stroke={color}
          strokeWidth="2"
          fill={index === 0 ? color : 'none'}
          fillOpacity={index === 0 ? 0.3 : 0}
          filter={filter}
          opacity="0.7"
        />
      ))}
    </g>
  );
}

/**
 * Vesica Piscis - The intersection of two worlds
 */
function renderVesicaPiscis(centerX: number, centerY: number, size: number, color: string, filter?: string): JSX.Element {
  const radius = size / 4;
  const offset = radius * 0.5;

  return (
    <g>
      {/* Two intersecting circles */}
      <circle
        cx={centerX - offset}
        cy={centerY}
        r={radius}
        stroke={color}
        strokeWidth="2"
        fill="none"
        filter={filter}
        opacity="0.7"
      />
      <circle
        cx={centerX + offset}
        cy={centerY}
        r={radius}
        stroke={color}
        strokeWidth="2"
        fill="none"
        filter={filter}
        opacity="0.7"
      />
      {/* Intersection highlight */}
      <ellipse
        cx={centerX}
        cy={centerY}
        rx={offset}
        ry={radius * Math.sin(Math.PI / 3)}
        fill={color}
        opacity="0.2"
        filter={filter}
      />
    </g>
  );
}

/**
 * Tree of Life - The cosmic structure
 */
function renderTreeOfLife(centerX: number, centerY: number, size: number, color: string, accentColor: string, filter?: string): JSX.Element {
  // 10 Sephirot positions
  const sephirot = [
    { x: centerX, y: centerY - size * 0.3, name: 'Kether' },
    { x: centerX - size * 0.1, y: centerY - size * 0.2, name: 'Chokmah' },
    { x: centerX + size * 0.1, y: centerY - size * 0.2, name: 'Binah' },
    { x: centerX - size * 0.15, y: centerY - size * 0.05, name: 'Chesed' },
    { x: centerX + size * 0.15, y: centerY - size * 0.05, name: 'Geburah' },
    { x: centerX, y: centerY, name: 'Tiphereth' },
    { x: centerX - size * 0.15, y: centerY + size * 0.1, name: 'Netzach' },
    { x: centerX + size * 0.15, y: centerY + size * 0.1, name: 'Hod' },
    { x: centerX, y: centerY + size * 0.2, name: 'Yesod' },
    { x: centerX, y: centerY + size * 0.3, name: 'Malkuth' }
  ];

  // Paths connecting the sephirot
  const paths = [
    [0, 1], [0, 2], [1, 2], [1, 3], [2, 4], [3, 4], [3, 5], [4, 5],
    [5, 6], [5, 7], [6, 7], [6, 8], [7, 8], [8, 9]
  ];

  return (
    <g>
      {/* Paths */}
      {paths.map((path, index) => (
        <line
          key={index}
          x1={sephirot[path[0]].x}
          y1={sephirot[path[0]].y}
          x2={sephirot[path[1]].x}
          y2={sephirot[path[1]].y}
          stroke={accentColor}
          strokeWidth="1"
          opacity="0.5"
        />
      ))}
      {/* Sephirot */}
      {sephirot.map((seph, index) => (
        <circle
          key={index}
          cx={seph.x}
          cy={seph.y}
          r={size / 25}
          stroke={color}
          strokeWidth="2"
          fill={color}
          fillOpacity="0.3"
          filter={filter}
        />
      ))}
    </g>
  );
}

/**
 * Sri Yantra - The cosmic energy pattern
 */
function renderSriYantra(centerX: number, centerY: number, size: number, color: string, accentColor: string, filter?: string): JSX.Element {
  const radius = size / 3;
  
  // 9 interlocking triangles
  const triangles = [];
  
  // 4 upward triangles (Shiva)
  for (let i = 0; i < 4; i++) {
    const scale = 1 - i * 0.2;
    const offset = i * 10;
    triangles.push({
      points: [
        [centerX, centerY - radius * scale + offset],
        [centerX - radius * scale * 0.866, centerY + radius * scale * 0.5 + offset],
        [centerX + radius * scale * 0.866, centerY + radius * scale * 0.5 + offset]
      ],
      color: color
    });
  }
  
  // 5 downward triangles (Shakti)
  for (let i = 0; i < 5; i++) {
    const scale = 1 - i * 0.15;
    const offset = -i * 8;
    triangles.push({
      points: [
        [centerX, centerY + radius * scale + offset],
        [centerX - radius * scale * 0.866, centerY - radius * scale * 0.5 + offset],
        [centerX + radius * scale * 0.866, centerY - radius * scale * 0.5 + offset]
      ],
      color: accentColor
    });
  }

  return (
    <g>
      {/* Outer circles */}
      <circle cx={centerX} cy={centerY} r={radius * 1.2} stroke={color} strokeWidth="1" fill="none" opacity="0.3" />
      <circle cx={centerX} cy={centerY} r={radius * 1.1} stroke={accentColor} strokeWidth="1" fill="none" opacity="0.3" />
      
      {/* Triangles */}
      {triangles.map((triangle, index) => (
        <polygon
          key={index}
          points={triangle.points.map(p => `${p[0]},${p[1]}`).join(' ')}
          stroke={triangle.color}
          strokeWidth="1.5"
          fill="none"
          filter={filter}
          opacity="0.6"
        />
      ))}
      
      {/* Central point */}
      <circle cx={centerX} cy={centerY} r={3} fill={color} filter={filter} />
    </g>
  );
}

/**
 * Torus - The fundamental shape of energy flow
 */
function renderTorus(centerX: number, centerY: number, size: number, color: string, accentColor: string, gradientId: string): JSX.Element {
  const majorRadius = size / 4;
  const minorRadius = size / 12;
  
  // Generate torus rings
  const rings = [];
  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI) / 4;
    const y = Math.sin(angle) * majorRadius;
    const scale = Math.cos(angle);
    rings.push({
      cx: centerX,
      cy: centerY + y,
      rx: majorRadius * scale,
      ry: minorRadius * Math.abs(scale),
      opacity: 0.3 + Math.abs(scale) * 0.4
    });
  }

  return (
    <g>
      {rings.map((ring, index) => (
        <ellipse
          key={index}
          cx={ring.cx}
          cy={ring.cy}
          rx={ring.rx}
          ry={ring.ry}
          stroke={index % 2 === 0 ? color : accentColor}
          strokeWidth="1.5"
          fill="none"
          opacity={ring.opacity}
        />
      ))}
    </g>
  );
}

/**
 * Tech Mandala - Sacred geometry meets digital aesthetics
 */
function renderTechMandala(centerX: number, centerY: number, size: number, color: string, accentColor: string, filter?: string): JSX.Element {
  const layers = [
    { radius: size / 8, sides: 6, strokeWidth: 2 },
    { radius: size / 6, sides: 8, strokeWidth: 1.5 },
    { radius: size / 4, sides: 12, strokeWidth: 1 },
    { radius: size / 3, sides: 16, strokeWidth: 0.5 }
  ];

  return (
    <g>
      {layers.map((layer, layerIndex) => (
        <g key={layerIndex}>
          {/* Polygonal ring */}
          <polygon
            points={DesignUtils.generateCirclePoints(layer.sides, layer.radius, centerX, centerY)
              .map(p => `${p.x},${p.y}`).join(' ')}
            stroke={layerIndex % 2 === 0 ? color : accentColor}
            strokeWidth={layer.strokeWidth}
            fill="none"
            filter={filter}
            opacity={0.6}
          />
          
          {/* Connection lines to center */}
          {DesignUtils.generateCirclePoints(layer.sides, layer.radius, centerX, centerY).map((point, pointIndex) => (
            <line
              key={pointIndex}
              x1={centerX}
              y1={centerY}
              x2={point.x}
              y2={point.y}
              stroke={layerIndex % 2 === 0 ? accentColor : color}
              strokeWidth="0.5"
              opacity="0.3"
            />
          ))}
        </g>
      ))}
      
      {/* Central mandala core */}
      <circle cx={centerX} cy={centerY} r={8} fill={color} filter={filter} opacity="0.8" />
      <circle cx={centerX} cy={centerY} r={4} fill={accentColor} filter={filter} />
    </g>
  );
}

export default SacredGeometry;