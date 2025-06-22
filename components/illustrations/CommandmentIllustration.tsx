/**
 * Sacred Commandment Illustration Component
 * 
 * Creates beautiful SVG illustrations for each of the 10 commandments
 * with mystical tech aesthetics and sacred geometry patterns.
 */

import React from 'react';
import { DesignTokens } from '../../lib/sacred-design/visual-system';
import { COMMANDMENT_THEMES } from '../../lib/illustrations/generator';

interface CommandmentIllustrationProps {
  commandmentNumber: number;
  size?: 'small' | 'medium' | 'large' | 'hero';
  theme?: 'dark' | 'light' | 'mystical';
  animated?: boolean;
  className?: string;
}

export const CommandmentIllustration: React.FC<CommandmentIllustrationProps> = ({
  commandmentNumber,
  size = 'medium',
  theme = 'mystical',
  animated = true,
  className = ''
}) => {
  const commandment = COMMANDMENT_THEMES[commandmentNumber - 1];
  if (!commandment) return null;

  const sizeMap = {
    small: 200,
    medium: 400,
    large: 600,
    hero: 800
  };

  const svgSize = sizeMap[size];

  // Generate unique IDs for gradients and filters
  const gradientId = `gradient-${commandmentNumber}-${theme}`;
  const glowId = `glow-${commandmentNumber}-${theme}`;
  const patternId = `pattern-${commandmentNumber}-${theme}`;

  return (
    <div className={`commandment-illustration ${className}`}>
      <svg
        width={svgSize}
        height={svgSize}
        viewBox={`0 0 ${svgSize} ${svgSize}`}
        xmlns="http://www.w3.org/2000/svg"
        className={animated ? 'animate-sacred-glow' : ''}
      >
        <defs>
          {/* Sacred Gradient */}
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={commandment.primaryColor} stopOpacity="0.8" />
            <stop offset="50%" stopColor={commandment.accentColor} stopOpacity="0.6" />
            <stop offset="100%" stopColor={DesignTokens.colors.primary.deepMidnightBlue} stopOpacity="0.9" />
          </linearGradient>

          {/* Divine Glow Filter */}
          <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Sacred Geometry Pattern */}
          <pattern id={patternId} x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="15" stroke={commandment.accentColor} strokeWidth="0.5" fill="none" opacity="0.1"/>
            <circle cx="20" cy="20" r="8" stroke={commandment.primaryColor} strokeWidth="0.3" fill="none" opacity="0.2"/>
          </pattern>
        </defs>

        {/* Background with Sacred Pattern */}
        <rect width="100%" height="100%" fill={DesignTokens.colors.primary.deepMidnightBlue} />
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />

        {/* Commandment-specific Illustration */}
        {renderCommandmentContent(commandmentNumber, svgSize, commandment, gradientId, glowId)}

        {/* Commandment Number */}
        <text
          x={svgSize / 2}
          y={svgSize - 40}
          textAnchor="middle"
          fontSize={size === 'hero' ? '3rem' : size === 'large' ? '2rem' : '1.5rem'}
          fontFamily={DesignTokens.typography.fonts.heading.family}
          fill={commandment.primaryColor}
          filter={`url(#${glowId})`}
        >
          {commandmentNumber}
        </text>

        {/* Animated Sacred Aura */}
        {animated && (
          <circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={svgSize * 0.4}
            stroke={commandment.primaryColor}
            strokeWidth="1"
            fill="none"
            opacity="0.3"
            className="animate-pulse"
          />
        )}
      </svg>
    </div>
  );
};

/**
 * Render specific content for each commandment
 */
function renderCommandmentContent(
  commandmentNumber: number,
  size: number,
  commandment: any,
  gradientId: string,
  glowId: string
): JSX.Element {
  const centerX = size / 2;
  const centerY = size / 2;

  switch (commandmentNumber) {
    case 1: // Die Heilige Vision
      return (
        <g>
          {/* Crystal Ball */}
          <circle
            cx={centerX}
            cy={centerY - 50}
            r={size * 0.15}
            fill={`url(#${gradientId})`}
            filter={`url(#${glowId})`}
          />
          {/* Holographic Projection Lines */}
          {[...Array(8)].map((_, i) => (
            <line
              key={i}
              x1={centerX}
              y1={centerY - 50}
              x2={centerX + Math.cos(i * Math.PI / 4) * size * 0.3}
              y2={centerY - 50 + Math.sin(i * Math.PI / 4) * size * 0.3}
              stroke={commandment.accentColor}
              strokeWidth="2"
              opacity="0.6"
            />
          ))}
          {/* Divine Eye */}
          <ellipse
            cx={centerX}
            cy={centerY - 50}
            rx={size * 0.08}
            ry={size * 0.05}
            fill={commandment.primaryColor}
          />
          <circle
            cx={centerX}
            cy={centerY - 50}
            r={size * 0.03}
            fill={DesignTokens.colors.primary.deepMidnightBlue}
          />
        </g>
      );

    case 2: // Der Rechte Stack
      return (
        <g>
          {/* Tech Stack Towers */}
          {[...Array(3)].map((_, i) => (
            <rect
              key={i}
              x={centerX - 60 + i * 40}
              y={centerY - 100 + i * 20}
              width={30}
              height={120 - i * 15}
              fill={`url(#${gradientId})`}
              filter={`url(#${glowId})`}
              rx="5"
            />
          ))}
          {/* Temple Pillars */}
          <rect
            x={centerX - 80}
            y={centerY + 50}
            width={160}
            height={20}
            fill={commandment.primaryColor}
            opacity="0.8"
          />
        </g>
      );

    case 3: // Die Prompt-Kunst
      return (
        <g>
          {/* Wizard Staff */}
          <line
            x1={centerX - 50}
            y1={centerY + 80}
            x2={centerX - 30}
            y2={centerY - 80}
            stroke={commandment.accentColor}
            strokeWidth="4"
            filter={`url(#${glowId})`}
          />
          {/* Magical Orb */}
          <circle
            cx={centerX - 30}
            cy={centerY - 80}
            r={20}
            fill={`url(#${gradientId})`}
            filter={`url(#${glowId})`}
          />
          {/* Spell Particles */}
          {[...Array(12)].map((_, i) => (
            <circle
              key={i}
              cx={centerX + Math.cos(i * Math.PI / 6) * 80}
              cy={centerY + Math.sin(i * Math.PI / 6) * 80}
              r={3}
              fill={commandment.primaryColor}
              opacity="0.7"
            />
          ))}
        </g>
      );

    case 4: // Multi-Context Programming
      return (
        <g>
          {/* Dimensional Portals */}
          {[...Array(4)].map((_, i) => (
            <g key={i}>
              <circle
                cx={centerX + Math.cos(i * Math.PI / 2) * 60}
                cy={centerY + Math.sin(i * Math.PI / 2) * 60}
                r={30}
                stroke={commandment.accentColor}
                strokeWidth="3"
                fill="none"
                opacity="0.6"
              />
              <circle
                cx={centerX + Math.cos(i * Math.PI / 2) * 60}
                cy={centerY + Math.sin(i * Math.PI / 2) * 60}
                r={15}
                fill={`url(#${gradientId})`}
                filter={`url(#${glowId})`}
              />
            </g>
          ))}
          {/* Quantum Web */}
          {[...Array(4)].map((_, i) => (
            <line
              key={i}
              x1={centerX}
              y1={centerY}
              x2={centerX + Math.cos(i * Math.PI / 2) * 60}
              y2={centerY + Math.sin(i * Math.PI / 2) * 60}
              stroke={commandment.primaryColor}
              strokeWidth="1"
              opacity="0.4"
            />
          ))}
        </g>
      );

    case 5: // Die Heilige Iteration
      return (
        <g>
          {/* Fibonacci Spiral */}
          <path
            d={generateFibonacciSpiral(centerX, centerY, size * 0.3)}
            stroke={commandment.primaryColor}
            strokeWidth="3"
            fill="none"
            filter={`url(#${glowId})`}
          />
          {/* Evolution Circles */}
          {[...Array(5)].map((_, i) => (
            <circle
              key={i}
              cx={centerX + i * 15 - 30}
              cy={centerY}
              r={5 + i * 3}
              fill={commandment.accentColor}
              opacity={0.6 + i * 0.1}
            />
          ))}
        </g>
      );

    case 6: // Die Heiligen Werkzeuge
      return (
        <g>
          {/* Sacred Artifacts */}
          <rect
            x={centerX - 40}
            y={centerY - 60}
            width={80}
            height={120}
            fill={`url(#${gradientId})`}
            filter={`url(#${glowId})`}
            rx="10"
          />
          {/* Divine Inscription */}
          <text
            x={centerX}
            y={centerY}
            textAnchor="middle"
            fontSize="16"
            fontFamily={DesignTokens.typography.fonts.code.family}
            fill={commandment.primaryColor}
          >
            {'{ }'}
          </text>
        </g>
      );

    case 7: // Der Flow-Zustand
      return (
        <g>
          {/* Energy Flow */}
          <path
            d={`M ${centerX - 100} ${centerY} Q ${centerX} ${centerY - 50} ${centerX + 100} ${centerY} Q ${centerX} ${centerY + 50} ${centerX - 100} ${centerY}`}
            stroke={commandment.accentColor}
            strokeWidth="4"
            fill="none"
            filter={`url(#${glowId})`}
          />
          {/* Zen Circle */}
          <circle
            cx={centerX}
            cy={centerY}
            r={40}
            stroke={commandment.primaryColor}
            strokeWidth="2"
            fill="none"
            opacity="0.8"
          />
        </g>
      );

    case 8: // Die Gemeinschaftsweisheit
      return (
        <g>
          {/* Network Nodes */}
          {[...Array(6)].map((_, i) => (
            <circle
              key={i}
              cx={centerX + Math.cos(i * Math.PI / 3) * 60}
              cy={centerY + Math.sin(i * Math.PI / 3) * 60}
              r={15}
              fill={`url(#${gradientId})`}
              filter={`url(#${glowId})`}
            />
          ))}
          {/* Central Hub */}
          <circle
            cx={centerX}
            cy={centerY}
            r={25}
            fill={commandment.primaryColor}
            filter={`url(#${glowId})`}
          />
          {/* Connections */}
          {[...Array(6)].map((_, i) => (
            <line
              key={i}
              x1={centerX}
              y1={centerY}
              x2={centerX + Math.cos(i * Math.PI / 3) * 60}
              y2={centerY + Math.sin(i * Math.PI / 3) * 60}
              stroke={commandment.accentColor}
              strokeWidth="2"
              opacity="0.6"
            />
          ))}
        </g>
      );

    case 9: // Das Ewige Lernen
      return (
        <g>
          {/* Knowledge Tree */}
          <line
            x1={centerX}
            y1={centerY + 80}
            x2={centerX}
            y2={centerY - 80}
            stroke={commandment.accentColor}
            strokeWidth="6"
            filter={`url(#${glowId})`}
          />
          {/* Branches */}
          {[...Array(6)].map((_, i) => (
            <line
              key={i}
              x1={centerX}
              y1={centerY - 20 + i * 15}
              x2={centerX + (i % 2 === 0 ? 40 : -40)}
              y2={centerY - 40 + i * 10}
              stroke={commandment.primaryColor}
              strokeWidth="3"
              opacity="0.7"
            />
          ))}
          {/* Wisdom Fruits */}
          {[...Array(8)].map((_, i) => (
            <circle
              key={i}
              cx={centerX + (i % 2 === 0 ? 40 : -40)}
              cy={centerY - 40 + i * 10}
              r={5}
              fill={commandment.accentColor}
              opacity="0.8"
            />
          ))}
        </g>
      );

    case 10: // Das Vermächtnis-Programm
      return (
        <g>
          {/* Eternal Flame */}
          <ellipse
            cx={centerX}
            cy={centerY - 20}
            rx={30}
            ry={60}
            fill={`url(#${gradientId})`}
            filter={`url(#${glowId})`}
          />
          {/* Monument Base */}
          <rect
            x={centerX - 50}
            y={centerY + 40}
            width={100}
            height={30}
            fill={commandment.primaryColor}
            opacity="0.8"
          />
          {/* Eternal Spark */}
          <circle
            cx={centerX}
            cy={centerY - 60}
            r={8}
            fill={commandment.accentColor}
            filter={`url(#${glowId})`}
          />
        </g>
      );

    default:
      return <></>;
  }
}

/**
 * Generate Fibonacci spiral path
 */
function generateFibonacciSpiral(centerX: number, centerY: number, scale: number): string {
  const phi = 1.618;
  let path = `M ${centerX} ${centerY}`;
  let x = centerX;
  let y = centerY;
  let radius = scale * 0.1;

  for (let i = 0; i < 3; i++) {
    const startAngle = i * Math.PI / 2;
    const endAngle = (i + 1) * Math.PI / 2;
    
    const endX = x + radius * Math.cos(endAngle);
    const endY = y + radius * Math.sin(endAngle);
    
    path += ` A ${radius} ${radius} 0 0 1 ${endX} ${endY}`;
    
    x = endX;
    y = endY;
    radius *= phi;
  }

  return path;
}

export default CommandmentIllustration;