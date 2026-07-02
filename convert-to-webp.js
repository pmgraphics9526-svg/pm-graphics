const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function convertToWebP() {
  const inputPath = path.join(__dirname, 'public', 'learning-tools', 'learning-hero-section.png');
  const outputPath = path.join(__dirname, 'public', 'learning-tools', 'learning-hero-section.webp');
  
  try {
    const metadata = await sharp(inputPath).metadata();
    console.log(`Original image: ${metadata.width}x${metadata.height}, ${metadata.format}`);
    
    await sharp(inputPath)
      .webp({ 
        quality: 75,
        effort: 6,
        smartSubsample: true
      })
      .toFile(outputPath);
    
    const stats = fs.statSync(outputPath);
    const originalSize = fs.statSync(inputPath).size;
    const savings = ((1 - stats.size / originalSize) * 100).toFixed(1);
    
    console.log(`✓ Converted to WebP successfully`);
    console.log(`  Original: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  WebP: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  Savings: ${savings}%`);
    
    if (stats.size > 250 * 1024) {
      console.log(`\n⚠ Warning: WebP file is ${(stats.size / 1024).toFixed(0)}KB, target was <250KB`);
      console.log('  Consider reducing quality or dimensions further');
    } else {
      console.log(`✓ File size is under 250KB target`);
    }
    
  } catch (error) {
    console.error('Error converting image:', error);
    process.exit(1);
  }
}

convertToWebP();