// API endpoint for uploading images to Cloudinary
// This is a server-side endpoint that avoids CORS issues

export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')

    if (!file) {
      return Response.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return Response.json(
        { error: 'File must be an image' },
        { status: 400 }
      )
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return Response.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      )
    }

    // Create FormData for Cloudinary
    const cloudinaryFormData = new FormData()
    cloudinaryFormData.append('file', file)
    cloudinaryFormData.append('upload_preset', 'tims_glam_unsigned')

    // Upload to Cloudinary
    const response = await fetch(
      'https://api.cloudinary.com/v1_1/dwzlhdakm/image/upload',
      {
        method: 'POST',
        body: cloudinaryFormData,
      }
    )

    const data = await response.json()

    if (!response.ok) {
      console.error('Cloudinary error:', {
        status: response.status,
        message: data.error?.message || data.error || 'Unknown error',
        fullResponse: data,
      })
      return Response.json(
        {
          error: data.error?.message || data.error || 'Failed to upload to Cloudinary',
          details: process.env.NODE_ENV === 'development' ? data : undefined,
        },
        { status: 400 }
      )
    }

    if (!data.secure_url) {
      return Response.json(
        { error: 'No URL returned from Cloudinary' },
        { status: 400 }
      )
    }

    return Response.json({
      success: true,
      secure_url: data.secure_url,
      public_id: data.public_id,
    })
  } catch (error) {
    console.error('Upload endpoint error:', error)
    return Response.json(
      {
        error: error.message || 'Upload failed',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    )
  }
}

