/**
 * AI Prompt Generation Script
 * 
 * Runs the illustration generator to output all AI prompts
 * for external image generation tools like DALL-E and Midjourney.
 */

import { IllustrationGenerator, AIPromptGenerator, COMMANDMENT_THEMES, TOOL_MASCOTS } from './generator';

/**
 * Generate and display all AI prompts
 */
async function generateAllPrompts() {
  console.log('🎨 SACRED ILLUSTRATION MASTER - AI PROMPT GENERATOR');
  console.log('=' .repeat(80));
  console.log('');
  console.log('This script generates professional AI prompts for creating all');
  console.log('visual assets for the Vibe Coding Bible using DALL-E, Midjourney,');
  console.log('or other AI image generation tools.');
  console.log('');
  console.log('🎯 TARGET AESTHETIC: Sacred-Tech Mysticism');
  console.log('🎨 COLOR PALETTE: Deep Blues, Electric Purples, Golden Accents');
  console.log('⚡ QUALITY: Enterprise-grade professional illustrations');
  console.log('');
  console.log('=' .repeat(80));

  // Generate Commandment Illustrations
  console.log('\n\n📜 SACRED COMMANDMENT ILLUSTRATIONS');
  console.log('=' .repeat(50));
  
  COMMANDMENT_THEMES.forEach((theme, index) => {
    console.log(`\n## ${index + 1}. ${theme.germanName} (${theme.name})`);
    console.log('-' .repeat(60));
    
    // Main mystical style
    console.log('\n### 🔮 MYSTICAL STYLE (Recommended)');
    console.log('```');
    console.log(AIPromptGenerator.generateCommandmentPrompt(theme, 'mystical'));
    console.log('```');
    
    // Alternative artistic style
    console.log('\n### 🎨 ARTISTIC STYLE (Alternative)');
    console.log('```');
    console.log(AIPromptGenerator.generateCommandmentPrompt(theme, 'artistic'));
    console.log('```');
    
    // Realistic style
    console.log('\n### 📸 REALISTIC STYLE (Alternative)');
    console.log('```');
    console.log(AIPromptGenerator.generateCommandmentPrompt(theme, 'realistic'));
    console.log('```');
    
    console.log(`\n🎯 **Suggested Filename**: commandment-${index + 1}-${theme.name.toLowerCase().replace(/\s+/g, '-')}`);
    console.log(`🎨 **Primary Color**: ${theme.primaryColor}`);
    console.log(`⚡ **Accent Color**: ${theme.accentColor}`);
    console.log(`🔑 **Key Elements**: ${theme.symbolElements.join(', ')}`);
    console.log('');
  });

  // Generate Tool Mascot Illustrations
  console.log('\n\n🛠️ SACRED TOOL MASCOT ILLUSTRATIONS');
  console.log('=' .repeat(50));
  
  TOOL_MASCOTS.forEach((mascot, index) => {
    console.log(`\n## ${index + 1}. ${mascot.germanTitle}`);
    console.log('-' .repeat(60));
    
    // Character design style
    console.log('\n### 👤 CHARACTER DESIGN (Recommended)');
    console.log('```');
    console.log(AIPromptGenerator.generateToolMascotPrompt(mascot, 'character'));
    console.log('```');
    
    // Icon style
    console.log('\n### 🎯 ICON STYLE (Alternative)');
    console.log('```');
    console.log(AIPromptGenerator.generateToolMascotPrompt(mascot, 'icon'));
    console.log('```');
    
    // Portrait style
    console.log('\n### 🖼️ PORTRAIT STYLE (Alternative)');
    console.log('```');
    console.log(AIPromptGenerator.generateToolMascotPrompt(mascot, 'portrait'));
    console.log('```');
    
    console.log(`\n🎯 **Suggested Filename**: tool-${mascot.name.toLowerCase()}`);
    console.log(`🎨 **Primary Color**: ${mascot.primaryColor}`);
    console.log(`👤 **Personality**: ${mascot.personality}`);
    console.log(`⚡ **Visual Style**: ${mascot.visualStyle}`);
    console.log(`🔑 **Key Elements**: ${mascot.symbolElements.join(', ')}`);
    console.log('');
  });

  // Generate Hero Images
  console.log('\n\n🌟 HERO IMAGES & BOOK COVERS');
  console.log('=' .repeat(50));
  
  console.log('\n## Epic Book Cover');
  console.log('-' .repeat(30));
  console.log('```');
  console.log(AIPromptGenerator.generateHeroImagePrompt());
  console.log('```');
  console.log('\n🎯 **Suggested Filename**: vibe-coding-bible-hero');
  console.log('📐 **Aspect Ratio**: 16:9 (cinematic)');
  console.log('🎨 **Usage**: Main book cover, hero sections');

  // Special variations
  console.log('\n\n🎨 SPECIAL VARIATIONS & COMPOSITIONS');
  console.log('=' .repeat(50));
  
  const specialPrompts = [
    {
      name: 'Chapter Opener Template',
      prompt: 'Mystical chapter opener with sacred geometry background, floating commandment number in golden divine light, deep midnight blue (#0A1128) atmosphere, electric indigo (#6610F2) mystical elements, professional chapter header design, inspiring and focused mood, 16:9 aspect ratio'
    },
    {
      name: 'Process Flow Diagram',
      prompt: 'Sacred coding workflow visualization, divine development process steps, mystical programming methodology flowchart, tech gold (#F9A826) process flows, electric indigo (#6610F2) decision points, matrix green (#00FF41) success indicators, professional diagram design, clear sacred-tech aesthetic'
    },
    {
      name: 'Community Network Visualization',
      prompt: 'Sacred community network with glowing developer nodes, mystical tech collaboration visualization, divine wisdom sharing network, electric indigo (#6610F2) connection lines, tech gold (#F9A826) knowledge nodes, inspiring collaborative atmosphere, professional network illustration'
    },
    {
      name: 'Sacred Code Visualization',
      prompt: 'Mystical code streams flowing like divine light, sacred programming energy visualization, luminous syntax highlighting in mystical colors, matrix green (#00FF41) code flows, electric indigo (#6610F2) structure, tech gold (#F9A826) highlights, magical coding atmosphere'
    }
  ];

  specialPrompts.forEach((special, index) => {
    console.log(`\n## ${index + 1}. ${special.name}`);
    console.log('-' .repeat(40));
    console.log('```');
    console.log(special.prompt);
    console.log('```');
    console.log(`\n🎯 **Suggested Filename**: ${special.name.toLowerCase().replace(/\s+/g, '-')}`);
    console.log('');
  });

  // Usage Instructions
  console.log('\n\n📋 USAGE INSTRUCTIONS');
  console.log('=' .repeat(50));
  console.log(`
🎯 **HOW TO USE THESE PROMPTS:**

1. **Copy & Paste**: Select any prompt above and paste into your AI tool
2. **Customize**: Adjust colors, styles, or elements as needed
3. **Generate**: Create 3-4 variations per concept for best results
4. **Optimize**: Use the suggested filenames for organization

🛠️ **RECOMMENDED AI TOOLS:**
- DALL-E 3 (OpenAI) - Best for detailed, realistic imagery
- Midjourney v6 - Excellent for artistic, stylized illustrations  
- Stable Diffusion XL - Good for batch generation and customization
- Adobe Firefly - Professional quality with commercial licensing

🎨 **STYLE CONSISTENCY TIPS:**
- Always include the specific hex color codes
- Maintain "sacred-tech" aesthetic across all images
- Use "professional illustration quality" in every prompt
- Specify "suitable for enterprise presentations"

📐 **TECHNICAL SPECIFICATIONS:**
- Resolution: Minimum 2000x2000px for detailed work
- Format: PNG with transparency for overlays, JPG for backgrounds
- Aspect Ratios: 16:9 for headers, 1:1 for icons, 3:4 for portraits
- Quality: Maximum quality settings for professional use

🎯 **BATCH GENERATION STRATEGY:**
1. Start with commandment illustrations (highest priority)
2. Generate tool mascots for brand consistency
3. Create hero images for marketing materials
4. Develop special variations for specific use cases

💡 **PRO TIPS:**
- Generate multiple variations and select the best
- Test different AI tools for different styles
- Keep a consistent color palette across all images
- Save raw files and create optimized versions for web use
`);

  console.log('\n\n✨ SACRED ILLUSTRATION MASTER COMPLETE');
  console.log('=' .repeat(80));
  console.log('');
  console.log('All prompts generated successfully! 🎨✨');
  console.log('');
  console.log('Ready to create the divine visual identity for the Vibe Coding Bible.');
  console.log('May your illustrations be blessed with sacred-tech magnificence! 🙏⚡');
  console.log('');
  console.log('=' .repeat(80));
}

// Run the generator
if (require.main === module) {
  generateAllPrompts().catch(console.error);
}

export { generateAllPrompts };