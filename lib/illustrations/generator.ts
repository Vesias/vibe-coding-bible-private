/**
 * Sacred Illustration Generator for the Vibe Coding Bible
 * 
 * This system generates stunning visual assets that combine:
 * - Biblical/mystical aesthetics with modern tech design
 * - Sacred geometry and divine proportions
 * - Rich color palettes (deep blues, electric purples, golden accents)
 * - Professional illustration quality suitable for enterprise presentations
 */

import { DesignTokens } from '../sacred-design/visual-system';

export interface IllustrationConfig {
  type: 'commandment' | 'tool' | 'process' | 'sacred-geometry' | 'hero';
  commandmentNumber?: number;
  toolName?: string;
  theme: 'dark' | 'light' | 'mystical';
  size: 'small' | 'medium' | 'large' | 'hero';
  format: 'svg' | 'webp' | 'avif' | 'png';
  responsive: boolean;
}

export interface CommandmentTheme {
  id: number;
  name: string;
  germanName: string;
  primaryColor: string;
  accentColor: string;
  symbolElements: string[];
  visualMetaphors: string[];
  aiPromptKeywords: string[];
}

/**
 * The 10 Sacred Commandments with their visual themes
 */
export const COMMANDMENT_THEMES: CommandmentTheme[] = [
  {
    id: 1,
    name: "The Sacred Vision",
    germanName: "Die Heilige Vision",
    primaryColor: "#F9A826", // Tech Gold
    accentColor: "#6610F2", // Electric Indigo
    symbolElements: ["crystal ball", "holographic projection", "divine eye", "golden compass"],
    visualMetaphors: ["architect's blueprint", "mystical oracle", "lighthouse beacon", "guiding star"],
    aiPromptKeywords: ["prophetic vision", "holographic blueprints", "golden divine light", "mystical foresight"]
  },
  {
    id: 2,
    name: "The Right Stack",
    germanName: "Der Rechte Stack",
    primaryColor: "#6610F2", // Electric Indigo
    accentColor: "#00FF41", // Matrix Green
    symbolElements: ["temple pillars", "tech stack towers", "digital foundation", "architectural blueprint"],
    visualMetaphors: ["divine temple", "tech cathedral", "foundation stones", "sacred architecture"],
    aiPromptKeywords: ["temple architecture", "tech stack visualization", "digital foundations", "sacred geometry"]
  },
  {
    id: 3,
    name: "The Art of Prompting",
    germanName: "Die Prompt-Kunst",
    primaryColor: "#00FF41", // Matrix Green
    accentColor: "#F9A826", // Tech Gold
    symbolElements: ["wizard staff", "magical incantations", "spell scrolls", "mystical runes"],
    visualMetaphors: ["sorcerer casting spells", "ancient incantations", "magical formulas", "mystical communion"],
    aiPromptKeywords: ["wizard summoning code", "magical incantations", "mystical spell casting", "ancient runes"]
  },
  {
    id: 4,
    name: "Multi-Context Programming",
    germanName: "Multi-Context Programming",
    primaryColor: "#F9A826", // Tech Gold
    accentColor: "#6610F2", // Electric Indigo
    symbolElements: ["multiple dimensions", "parallel universes", "interconnected webs", "quantum fields"],
    visualMetaphors: ["dimensional portals", "parallel realities", "quantum entanglement", "cosmic web"],
    aiPromptKeywords: ["multiple dimensions", "parallel coding universes", "quantum programming", "dimensional portals"]
  },
  {
    id: 5,
    name: "Sacred Iteration",
    germanName: "Die Heilige Iteration",
    primaryColor: "#6610F2", // Electric Indigo
    accentColor: "#00FF41", // Matrix Green
    symbolElements: ["spiral galaxies", "fibonacci spirals", "iterative cycles", "evolutionary chains"],
    visualMetaphors: ["spiral evolution", "divine cycles", "endless refinement", "golden spirals"],
    aiPromptKeywords: ["spiral evolution", "divine iteration cycles", "golden ratio spirals", "continuous refinement"]
  },
  {
    id: 6,
    name: "The Sacred Tools",
    germanName: "Die Heiligen Werkzeuge",
    primaryColor: "#00FF41", // Matrix Green
    accentColor: "#F9A826", // Tech Gold
    symbolElements: ["divine instruments", "tech relics", "sacred artifacts", "power tools"],
    visualMetaphors: ["holy reliquaries", "divine instruments", "sacred artifacts", "blessed tools"],
    aiPromptKeywords: ["sacred digital relics", "holy tech instruments", "divine coding tools", "blessed artifacts"]
  },
  {
    id: 7,
    name: "The Flow State",
    germanName: "Der Flow-Zustand",
    primaryColor: "#F9A826", // Tech Gold
    accentColor: "#6610F2", // Electric Indigo
    symbolElements: ["flowing rivers", "energy streams", "zen meditation", "divine focus"],
    visualMetaphors: ["river of consciousness", "energy flow", "meditative state", "divine concentration"],
    aiPromptKeywords: ["flowing energy streams", "meditative coding zen", "divine focus state", "consciousness flow"]
  },
  {
    id: 8,
    name: "Community Wisdom",
    germanName: "Die Gemeinschaftsweisheit",
    primaryColor: "#6610F2", // Electric Indigo
    accentColor: "#00FF41", // Matrix Green
    symbolElements: ["connected networks", "community circles", "wisdom trees", "collective mind"],
    visualMetaphors: ["hive mind", "wisdom circles", "collective consciousness", "network effects"],
    aiPromptKeywords: ["collective wisdom networks", "community hive mind", "shared consciousness", "collaborative enlightenment"]
  },
  {
    id: 9,
    name: "Continuous Learning",
    germanName: "Das Ewige Lernen",
    primaryColor: "#00FF41", // Matrix Green
    accentColor: "#F9A826", // Tech Gold
    symbolElements: ["infinite loops", "knowledge trees", "learning spirals", "wisdom paths"],
    visualMetaphors: ["tree of knowledge", "endless journey", "learning spiral", "wisdom accumulation"],
    aiPromptKeywords: ["infinite learning tree", "knowledge spiral paths", "eternal wisdom journey", "continuous enlightenment"]
  },
  {
    id: 10,
    name: "The Legacy Code",
    germanName: "Das Vermächtnis-Programm",
    primaryColor: "#F9A826", // Tech Gold
    accentColor: "#6610F2", // Electric Indigo
    symbolElements: ["eternal flames", "legacy monuments", "timeless code", "immortal creation"],
    visualMetaphors: ["eternal monument", "timeless legacy", "immortal creation", "lasting impact"],
    aiPromptKeywords: ["eternal code monument", "timeless digital legacy", "immortal programming", "lasting tech impact"]
  }
];

/**
 * Tool Mascot Configurations
 */
export interface ToolMascot {
  name: string;
  germanTitle: string;
  primaryColor: string;
  personality: string;
  visualStyle: string;
  symbolElements: string[];
  aiPromptKeywords: string[];
}

export const TOOL_MASCOTS: ToolMascot[] = [
  {
    name: "Claude",
    germanTitle: "Sankt Claude der Allwissende",
    primaryColor: "#F9A826",
    personality: "wise, all-knowing, benevolent guide",
    visualStyle: "divine scholar with golden aura",
    symbolElements: ["golden halo", "ancient scrolls", "divine wisdom", "enlightened presence"],
    aiPromptKeywords: ["divine AI sage", "golden wisdom aura", "all-knowing oracle", "benevolent tech deity"]
  },
  {
    name: "Cline",
    germanTitle: "Cline der Mächtige",
    primaryColor: "#6610F2",
    personality: "powerful, decisive, action-oriented",
    visualStyle: "tech warrior with electric energy",
    symbolElements: ["electric lightning", "power symbols", "commanding presence", "tech armor"],
    aiPromptKeywords: ["electric tech warrior", "powerful coding force", "lightning command energy", "digital champion"]
  },
  {
    name: "Cursor",
    germanTitle: "Cursor der Präzise",
    primaryColor: "#00FF41",
    personality: "precise, focused, surgical accuracy",
    visualStyle: "precise technician with laser focus",
    symbolElements: ["laser beams", "precision instruments", "focused energy", "surgical tools"],
    aiPromptKeywords: ["precision laser focus", "surgical code accuracy", "focused tech mastery", "precise digital surgeon"]
  },
  {
    name: "GitHub Copilot",
    germanTitle: "Copilot der Begleiter",
    primaryColor: "#24292e",
    personality: "supportive, collaborative, helpful companion",
    visualStyle: "friendly companion with collaborative spirit",
    symbolElements: ["partnership symbols", "helping hands", "collaborative tools", "friendly guidance"],
    aiPromptKeywords: ["collaborative coding companion", "helpful tech partnership", "supportive AI buddy", "friendly coding guide"]
  }
];

/**
 * AI Image Generation Prompts
 */
export class AIPromptGenerator {
  
  /**
   * Generate DALL-E/Midjourney prompt for a specific commandment
   */
  static generateCommandmentPrompt(commandment: CommandmentTheme, style: 'realistic' | 'artistic' | 'mystical' = 'mystical'): string {
    const baseStyle = style === 'mystical' 
      ? "mystical digital art, sacred tech aesthetic, glowing divine energy"
      : style === 'artistic'
      ? "professional illustration, clean modern design, premium quality"
      : "photorealistic render, cinematic lighting, high detail";

    return [
      `${commandment.germanName} - ${commandment.name}:`,
      `${baseStyle},`,
      `Color palette: deep midnight blue (#0A1128), electric indigo (${commandment.accentColor}), tech gold (${commandment.primaryColor}),`,
      `Visual elements: ${commandment.symbolElements.join(', ')},`,
      `Metaphors: ${commandment.visualMetaphors.join(', ')},`,
      `Keywords: ${commandment.aiPromptKeywords.join(', ')},`,
      "Sacred geometry patterns, divine proportions, professional quality,",
      "Suitable for enterprise presentations, modern tech aesthetic,",
      "16:9 aspect ratio, high resolution, premium illustration style"
    ].join(' ');
  }

  /**
   * Generate prompt for tool mascot illustration
   */
  static generateToolMascotPrompt(mascot: ToolMascot, style: 'character' | 'icon' | 'portrait' = 'character'): string {
    const baseStyle = style === 'character'
      ? "character design, mascot illustration, friendly tech personality"
      : style === 'icon'
      ? "minimalist icon design, clean symbol, professional logo style"
      : "portrait illustration, professional tech leader, inspiring presence";

    return [
      `${mascot.germanTitle} - ${mascot.name}:`,
      `${baseStyle},`,
      `Personality: ${mascot.personality},`,
      `Visual style: ${mascot.visualStyle},`,
      `Primary color: ${mascot.primaryColor},`,
      `Elements: ${mascot.symbolElements.join(', ')},`,
      `Keywords: ${mascot.aiPromptKeywords.join(', ')},`,
      "Sacred tech aesthetic, divine digital presence,",
      "Professional quality, suitable for enterprise use,",
      "Modern illustration style, premium design"
    ].join(' ');
  }

  /**
   * Generate hero image prompt for the book cover
   */
  static generateHeroImagePrompt(): string {
    return [
      "Vibe Coding Bible - Epic Hero Image:",
      "Mystical tech cathedral with glowing code streams,",
      "Ancient stone tablets with modern holographic displays,",
      "Deep midnight blue background (#0A1128),",
      "Electric indigo lighting (#6610F2), golden accents (#F9A826),",
      "Sacred geometry patterns, divine proportions,",
      "Matrix code flowing like divine light,",
      "10 floating commandment tablets with tech symbols,",
      "Majestic, inspiring, professional quality,",
      "Suitable for premium book cover,",
      "16:9 aspect ratio, high resolution, cinematic lighting"
    ].join(' ');
  }
}

/**
 * SVG Pattern Generator for Sacred Geometry
 */
export class SacredGeometryGenerator {
  
  /**
   * Generate golden ratio spiral SVG
   */
  static generateGoldenSpiral(size: number = 400, color: string = "#F9A826"): string {
    const phi = (1 + Math.sqrt(5)) / 2;
    let path = "";
    let x = size / 2;
    let y = size / 2;
    let radius = 5;
    
    for (let i = 0; i < 4; i++) {
      const startAngle = i * Math.PI / 2;
      const endAngle = (i + 1) * Math.PI / 2;
      
      path += `M ${x} ${y} `;
      path += `A ${radius} ${radius} 0 0 1 `;
      
      const endX = x + radius * Math.cos(endAngle);
      const endY = y + radius * Math.sin(endAngle);
      path += `${endX} ${endY} `;
      
      radius *= phi;
    }
    
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="goldenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${color};stop-opacity:0.3" />
          </linearGradient>
        </defs>
        <path d="${path}" stroke="url(#goldenGradient)" stroke-width="2" fill="none" 
              opacity="0.8" filter="drop-shadow(0 0 10px ${color}40)"/>
      </svg>
    `;
  }

  /**
   * Generate flower of life pattern
   */
  static generateFlowerOfLife(size: number = 400, color: string = "#6610F2"): string {
    const centerX = size / 2;
    const centerY = size / 2;
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
    
    const circleElements = circles.map(circle => 
      `<circle cx="${circle.x}" cy="${circle.y}" r="${radius * 0.8}" 
               stroke="${color}" stroke-width="1.5" fill="none" opacity="0.6"/>`
    ).join('');
    
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <g filter="url(#glow)">
          ${circleElements}
        </g>
      </svg>
    `;
  }
}

/**
 * Responsive Image Generator
 */
export class ResponsiveImageGenerator {
  
  static generateSrcSet(baseName: string, sizes: number[]): string {
    return sizes.map(size => `${baseName}-${size}w.webp ${size}w`).join(', ');
  }
  
  static generateSizes(breakpoints: {[key: string]: string}): string {
    return Object.entries(breakpoints)
      .map(([media, size]) => `${media} ${size}`)
      .join(', ');
  }
  
  /**
   * Generate responsive image configuration
   */
  static generateResponsiveConfig(imageName: string): {
    srcSet: string;
    sizes: string;
    src: string;
  } {
    const standardSizes = [400, 800, 1200, 1600, 2000];
    const breakpoints = {
      '(max-width: 768px)': '400px',
      '(max-width: 1024px)': '800px',
      '(max-width: 1440px)': '1200px',
      '': '1600px'
    };
    
    return {
      srcSet: this.generateSrcSet(`/assets/illustrations/generated/${imageName}`, standardSizes),
      sizes: this.generateSizes(breakpoints),
      src: `/assets/illustrations/generated/${imageName}-800w.webp`
    };
  }
}

/**
 * Main Illustration Generator Class
 */
export class IllustrationGenerator {
  
  /**
   * Generate all commandment illustrations
   */
  static async generateCommandmentIllustrations(): Promise<void> {
    const prompts = COMMANDMENT_THEMES.map(theme => ({
      commandment: theme,
      prompt: AIPromptGenerator.generateCommandmentPrompt(theme),
      filename: `commandment-${theme.id}-${theme.name.toLowerCase().replace(/\s+/g, '-')}`
    }));
    
    // Output prompts for external AI generation
    console.log("=== COMMANDMENT ILLUSTRATION PROMPTS ===");
    prompts.forEach(({ commandment, prompt, filename }) => {
      console.log(`\n## ${commandment.germanName} (${filename})`);
      console.log(prompt);
      console.log("---");
    });
  }
  
  /**
   * Generate all tool mascot illustrations
   */
  static async generateToolMascots(): Promise<void> {
    const prompts = TOOL_MASCOTS.map(mascot => ({
      mascot,
      prompt: AIPromptGenerator.generateToolMascotPrompt(mascot),
      filename: `tool-${mascot.name.toLowerCase()}`
    }));
    
    console.log("\n=== TOOL MASCOT PROMPTS ===");
    prompts.forEach(({ mascot, prompt, filename }) => {
      console.log(`\n## ${mascot.germanTitle} (${filename})`);
      console.log(prompt);
      console.log("---");
    });
  }
  
  /**
   * Generate hero image prompt
   */
  static async generateHeroImage(): Promise<void> {
    const prompt = AIPromptGenerator.generateHeroImagePrompt();
    
    console.log("\n=== HERO IMAGE PROMPT ===");
    console.log(prompt);
    console.log("---");
  }
}

export default IllustrationGenerator;