/**
 * Sacred Illustration System - Main Exports
 * 
 * Central export point for all illustration components and utilities
 * used throughout the Vibe Coding Bible.
 */

// Core Illustration Components
export { CommandmentIllustration } from './CommandmentIllustration';
export { ToolMascot } from './ToolMascot';
export { SacredGeometry } from './SacredGeometry';

// Illustration Generator and Utilities
export {
  IllustrationGenerator,
  AIPromptGenerator,
  SacredGeometryGenerator,
  ResponsiveImageGenerator,
  COMMANDMENT_THEMES,
  TOOL_MASCOTS,
  type IllustrationConfig,
  type CommandmentTheme,
  type ToolMascot
} from '../lib/illustrations/generator';

// Design System
export {
  DesignTokens,
  DesignUtils
} from '../lib/sacred-design/visual-system';

// Responsive Image System
export {
  ResponsiveImageGenerator as ImageGenerator,
  ImageLoadingUtils,
  ImagePerformanceUtils,
  useResponsiveImage,
  IMAGE_CONFIGS,
  type ResponsiveImageConfig,
  type OptimizedImage,
  type ImageFormat,
  type ImageSize
} from '../lib/illustrations/responsive-images';

// Re-export types for convenience
export type {
  IllustrationConfig,
  CommandmentTheme,
  ToolMascot,
  ResponsiveImageConfig,
  OptimizedImage,
  ImageFormat,
  ImageSize
} from '../lib/illustrations/generator';

/**
 * Predefined illustration configurations for common use cases
 */
export const ILLUSTRATION_PRESETS = {
  // Commandment Cards
  commandmentCard: {
    type: 'commandment' as const,
    theme: 'mystical' as const,
    size: 'medium' as const,
    format: 'svg' as const,
    responsive: true
  },
  
  // Tool Mascots
  toolMascotHero: {
    type: 'tool' as const,
    theme: 'dark' as const,
    size: 'large' as const,
    format: 'svg' as const,
    responsive: true
  },
  
  // Sacred Geometry Backgrounds
  geometryBackground: {
    type: 'sacred-geometry' as const,
    theme: 'mystical' as const,
    size: 'large' as const,
    format: 'svg' as const,
    responsive: false
  },
  
  // Hero Images
  heroImage: {
    type: 'hero' as const,
    theme: 'dark' as const,
    size: 'hero' as const,
    format: 'webp' as const,
    responsive: true
  }
} as const;

/**
 * Quick access functions for common illustration tasks
 */
export const IllustrationHelpers = {
  /**
   * Get commandment illustration with optimal settings
   */
  getCommandmentIllustration: (commandmentNumber: number, size: 'small' | 'medium' | 'large' | 'hero' = 'medium') => ({
    component: 'CommandmentIllustration',
    props: {
      commandmentNumber,
      size,
      theme: 'mystical',
      animated: true,
      className: `commandment-${commandmentNumber}`
    }
  }),

  /**
   * Get tool mascot with optimal settings
   */
  getToolMascot: (toolName: string, size: 'small' | 'medium' | 'large' | 'hero' = 'medium') => ({
    component: 'ToolMascot',
    props: {
      toolName,
      size,
      style: 'character',
      animated: true,
      showTitle: true,
      className: `tool-${toolName.toLowerCase()}`
    }
  }),

  /**
   * Get sacred geometry pattern with optimal settings
   */
  getSacredGeometry: (pattern: string, size: number = 400) => ({
    component: 'SacredGeometry',
    props: {
      pattern,
      size,
      animated: true,
      glowEffect: true,
      className: `geometry-${pattern}`
    }
  })
};

/**
 * CSS Classes for illustration styling
 */
export const ILLUSTRATION_CLASSES = {
  // Animation classes
  'animate-sacred-glow': 'animate-pulse',
  'animate-sacred-rotation': 'animate-spin',
  'animate-mascot-float': 'animate-bounce',
  'animate-spin-slow': 'animate-spin',
  'animate-spin-reverse': 'animate-spin',
  
  // Layout classes
  'responsive-image': 'w-full h-auto object-cover',
  'commandment-layout': 'flex flex-col items-center justify-center',
  'tool-layout': 'flex items-center gap-4',
  'geometry-background': 'absolute inset-0 opacity-10 z-0',
  
  // Theme classes
  'mystical-theme': 'filter drop-shadow-lg',
  'dark-theme': 'brightness-90 contrast-110',
  'light-theme': 'brightness-110 contrast-90'
} as const;

export default {
  CommandmentIllustration,
  ToolMascot,
  SacredGeometry,
  IllustrationGenerator,
  AIPromptGenerator,
  DesignTokens,
  ResponsiveImageGenerator,
  COMMANDMENT_THEMES,
  TOOL_MASCOTS,
  ILLUSTRATION_PRESETS,
  IllustrationHelpers,
  ILLUSTRATION_CLASSES
};