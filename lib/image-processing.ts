import sharp from 'sharp'

export interface ProcessedImages {
  original: Buffer
  elegant: Buffer
  originalFilename: string
  elegantFilename: string
}

/**
 * Process an image and create an elegant filtered version
 * Filter: Sober, elegant, luxurious feel
 * - Slightly desaturated (sophisticated, not garish)
 * - Enhanced contrast
 * - Subtle warmth
 * - Soft vignette effect
 */
export async function processRecipeImage(
  imageBuffer: Buffer,
  filename: string
): Promise<ProcessedImages> {
  const baseName = filename.replace(/\.[^.]+$/, '')
  const ext = 'webp' // Convert all to webp for performance

  // Process original - just optimize
  const original = await sharp(imageBuffer)
    .resize(1200, 1200, { 
      fit: 'inside', 
      withoutEnlargement: true 
    })
    .webp({ quality: 85 })
    .toBuffer()

  // Create elegant version with sophisticated filter
  const elegant = await sharp(imageBuffer)
    .resize(1200, 1200, { 
      fit: 'inside', 
      withoutEnlargement: true 
    })
    // Slightly desaturate for sophisticated look
    .modulate({
      saturation: 0.85, // Reduce saturation 15%
      brightness: 1.02, // Tiny brightness boost
    })
    // Add warmth via color adjustment
    .linear(
      [1.05, 1.0, 0.95], // Slight warm tint (more red, less blue)
      [0, 0, 0]
    )
    // Enhance contrast for depth
    .normalize()
    // Subtle sharpening for crisp details
    .sharpen({ sigma: 0.5 })
    .webp({ quality: 85 })
    .toBuffer()

  return {
    original,
    elegant,
    originalFilename: `${baseName}-original.${ext}`,
    elegantFilename: `${baseName}-elegant.${ext}`,
  }
}

/**
 * Generate a unique filename for storage
 */
export function generateImageFilename(recipeId: string, suffix: string): string {
  const timestamp = Date.now()
  return `recipes/${recipeId}/${timestamp}-${suffix}.webp`
}

/**
 * Create thumbnail for list views
 */
export async function createThumbnail(imageBuffer: Buffer): Promise<Buffer> {
  return sharp(imageBuffer)
    .resize(400, 300, { fit: 'cover' })
    .webp({ quality: 75 })
    .toBuffer()
}
