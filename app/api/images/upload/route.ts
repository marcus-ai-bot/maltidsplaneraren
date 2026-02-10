import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { processRecipeImage, createThumbnail } from '@/lib/image-processing'

export const runtime = 'nodejs' // Sharp requires Node.js runtime

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('image') as File | null
    const recipeId = formData.get('recipeId') as string | null

    if (!file) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      )
    }

    if (!recipeId) {
      return NextResponse.json(
        { error: 'Recipe ID required' },
        { status: 400 }
      )
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Process images
    const processed = await processRecipeImage(buffer, file.name)
    const thumbnail = await createThumbnail(buffer)

    // Upload to Supabase Storage
    const supabase = createServerClient()
    const timestamp = Date.now()
    const basePath = `recipes/${recipeId}`

    // Upload all versions
    const uploads = await Promise.all([
      supabase.storage
        .from('images')
        .upload(`${basePath}/${timestamp}-original.webp`, processed.original, {
          contentType: 'image/webp',
          upsert: true,
        }),
      supabase.storage
        .from('images')
        .upload(`${basePath}/${timestamp}-elegant.webp`, processed.elegant, {
          contentType: 'image/webp',
          upsert: true,
        }),
      supabase.storage
        .from('images')
        .upload(`${basePath}/${timestamp}-thumb.webp`, thumbnail, {
          contentType: 'image/webp',
          upsert: true,
        }),
    ])

    // Check for errors
    const errors = uploads.filter(u => u.error)
    if (errors.length > 0) {
      console.error('Upload errors:', errors.map(e => e.error))
      return NextResponse.json(
        { error: 'Failed to upload images', details: errors.map(e => e.error?.message) },
        { status: 500 }
      )
    }

    // Get public URLs
    const { data: { publicUrl: originalUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(`${basePath}/${timestamp}-original.webp`)

    const { data: { publicUrl: elegantUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(`${basePath}/${timestamp}-elegant.webp`)

    const { data: { publicUrl: thumbUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(`${basePath}/${timestamp}-thumb.webp`)

    // Update recipe with image URLs
    const { error: updateError } = await supabase
      .from('recipes')
      .update({
        image_url: elegantUrl, // Use elegant as main
        original_image_url: originalUrl,
        thumbnail_url: thumbUrl,
      })
      .eq('id', recipeId)

    if (updateError) {
      console.error('Failed to update recipe:', updateError)
      // Images uploaded successfully, just log the error
    }

    return NextResponse.json({
      success: true,
      urls: {
        original: originalUrl,
        elegant: elegantUrl,
        thumbnail: thumbUrl,
      },
    })
  } catch (error) {
    console.error('Image upload error:', error)
    return NextResponse.json(
      { error: 'Failed to process image', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Health check
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    endpoint: '/api/images/upload',
    method: 'POST',
    accepts: 'multipart/form-data',
    fields: {
      image: 'File (required)',
      recipeId: 'string (required)',
    },
    returns: {
      urls: {
        original: 'Original image (optimized)',
        elegant: 'Filtered version (sober, elegant)',
        thumbnail: 'Small preview',
      },
    },
  })
}
