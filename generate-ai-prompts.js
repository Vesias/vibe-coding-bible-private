/**
 * AI Prompt Generation Script for Vibe Coding Bible
 * Simple Node.js script to generate all illustration prompts
 */

// Commandment Themes
const COMMANDMENT_THEMES = [
  {
    id: 1,
    name: "The Sacred Vision",
    germanName: "Die Heilige Vision",
    primaryColor: "#F9A826",
    accentColor: "#6610F2",
    symbolElements: ["crystal ball", "holographic projection", "divine eye", "golden compass"],
    visualMetaphors: ["architect's blueprint", "mystical oracle", "lighthouse beacon", "guiding star"],
    aiPromptKeywords: ["prophetic vision", "holographic blueprints", "golden divine light", "mystical foresight"]
  },
  {
    id: 2,
    name: "The Right Stack",
    germanName: "Der Rechte Stack",
    primaryColor: "#6610F2",
    accentColor: "#00FF41",
    symbolElements: ["temple pillars", "tech stack towers", "digital foundation", "architectural blueprint"],
    visualMetaphors: ["divine temple", "tech cathedral", "foundation stones", "sacred architecture"],
    aiPromptKeywords: ["temple architecture", "tech stack visualization", "digital foundations", "sacred geometry"]
  },
  {
    id: 3,
    name: "The Art of Prompting",
    germanName: "Die Prompt-Kunst",  
    primaryColor: "#00FF41",
    accentColor: "#F9A826",
    symbolElements: ["wizard staff", "magical incantations", "spell scrolls", "mystical runes"],
    visualMetaphors: ["sorcerer casting spells", "ancient incantations", "magical formulas", "mystical communion"],
    aiPromptKeywords: ["wizard summoning code", "magical incantations", "mystical spell casting", "ancient runes"]
  },
  {
    id: 4,
    name: "Multi-Context Programming",
    germanName: "Multi-Context Programming",
    primaryColor: "#F9A826",
    accentColor: "#6610F2", 
    symbolElements: ["multiple dimensions", "parallel universes", "interconnected webs", "quantum fields"],
    visualMetaphors: ["dimensional portals", "parallel realities", "quantum entanglement", "cosmic web"],
    aiPromptKeywords: ["multiple dimensions", "parallel coding universes", "quantum programming", "dimensional portals"]
  },
  {
    id: 5,
    name: "Sacred Iteration",
    germanName: "Die Heilige Iteration",
    primaryColor: "#6610F2",
    accentColor: "#00FF41",
    symbolElements: ["spiral galaxies", "fibonacci spirals", "iterative cycles", "evolutionary chains"],
    visualMetaphors: ["spiral evolution", "divine cycles", "endless refinement", "golden spirals"],
    aiPromptKeywords: ["spiral evolution", "divine iteration cycles", "golden ratio spirals", "continuous refinement"]
  }
];

// Tool Mascots
const TOOL_MASCOTS = [
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
  }
];

function generateCommandmentPrompt(commandment, style = 'mystical') {
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

function generateToolMascotPrompt(mascot, style = 'character') {
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

function generateHeroImagePrompt() {
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

// Generate all prompts
function generateAllPrompts() {
  console.log('🎨 SACRED ILLUSTRATION MASTER - AI PROMPT GENERATOR');
  console.log('='.repeat(80));
  console.log('');
  console.log('This script generates professional AI prompts for creating all');
  console.log('visual assets for the Vibe Coding Bible using DALL-E, Midjourney,');
  console.log('or other AI image generation tools.');
  console.log('');
  console.log('🎯 TARGET AESTHETIC: Sacred-Tech Mysticism');
  console.log('🎨 COLOR PALETTE: Deep Blues, Electric Purples, Golden Accents');
  console.log('⚡ QUALITY: Enterprise-grade professional illustrations');
  console.log('');
  console.log('='.repeat(80));

  // Generate Commandment Illustrations
  console.log('\n\n📜 SACRED COMMANDMENT ILLUSTRATIONS');
  console.log('='.repeat(50));
  
  COMMANDMENT_THEMES.forEach((theme, index) => {
    console.log(`\n## ${index + 1}. ${theme.germanName} (${theme.name})`);
    console.log('-'.repeat(60));
    
    console.log('\n### 🔮 MYSTICAL STYLE (Recommended)');
    console.log('```');
    console.log(generateCommandmentPrompt(theme, 'mystical'));
    console.log('```');
    
    console.log('\n### 🎨 ARTISTIC STYLE (Alternative)');
    console.log('```');
    console.log(generateCommandmentPrompt(theme, 'artistic'));
    console.log('```');
    
    console.log(`\n🎯 **Suggested Filename**: commandment-${index + 1}-${theme.name.toLowerCase().replace(/\s+/g, '-')}`);
    console.log(`🎨 **Primary Color**: ${theme.primaryColor}`);
    console.log(`⚡ **Accent Color**: ${theme.accentColor}`);
    console.log(`🔑 **Key Elements**: ${theme.symbolElements.join(', ')}`);
    console.log('');
  });

  // Generate Tool Mascot Illustrations
  console.log('\n\n🛠️ SACRED TOOL MASCOT ILLUSTRATIONS');
  console.log('='.repeat(50));
  
  TOOL_MASCOTS.forEach((mascot, index) => {
    console.log(`\n## ${index + 1}. ${mascot.germanTitle}`);
    console.log('-'.repeat(60));
    
    console.log('\n### 👤 CHARACTER DESIGN (Recommended)');
    console.log('```');
    console.log(generateToolMascotPrompt(mascot, 'character'));
    console.log('```');
    
    console.log('\n### 🎯 ICON STYLE (Alternative)');
    console.log('```');
    console.log(generateToolMascotPrompt(mascot, 'icon'));
    console.log('```');
    
    console.log(`\n🎯 **Suggested Filename**: tool-${mascot.name.toLowerCase()}`);
    console.log(`🎨 **Primary Color**: ${mascot.primaryColor}`);
    console.log(`👤 **Personality**: ${mascot.personality}`);
    console.log(`⚡ **Visual Style**: ${mascot.visualStyle}`);
    console.log('');
  });

  // Generate Hero Images
  console.log('\n\n🌟 HERO IMAGES & BOOK COVERS');
  console.log('='.repeat(50));
  
  console.log('\n## Epic Book Cover');
  console.log('-'.repeat(30));
  console.log('```');
  console.log(generateHeroImagePrompt());
  console.log('```');
  console.log('\n🎯 **Suggested Filename**: vibe-coding-bible-hero');
  console.log('📐 **Aspect Ratio**: 16:9 (cinematic)');
  console.log('🎨 **Usage**: Main book cover, hero sections');

  console.log('\n\n📋 QUICK USAGE GUIDE');
  console.log('='.repeat(50));
  console.log(`
🎯 **HOW TO USE THESE PROMPTS:**
1. Copy any prompt above and paste into DALL-E, Midjourney, etc.
2. Generate 3-4 variations per concept for best results
3. Use suggested filenames for organization
4. Maintain color consistency across all images

🛠️ **RECOMMENDED AI TOOLS:**
- DALL-E 3: Best for detailed, realistic imagery
- Midjourney v6: Excellent for artistic illustrations  
- Stable Diffusion XL: Good for batch generation

🎨 **STYLE CONSISTENCY:**
- Always include specific hex color codes
- Maintain "sacred-tech" aesthetic
- Use "professional illustration quality" 
- Specify "enterprise presentations"
`);

  console.log('\n✨ SACRED ILLUSTRATION MASTER COMPLETE! 🎨✨');
  console.log('='.repeat(80));
}

// Run the generator
generateAllPrompts();