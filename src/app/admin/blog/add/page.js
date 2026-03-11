'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { FiArrowLeft, FiCheck, FiImage, FiLoader, FiUpload, FiX } from 'react-icons/fi'

const categories = ['Trends', 'Product Updates', 'Style Guide', 'Sustainability', 'Events', 'News']

function renderPreviewContent(content) {
  const lines = String(content || '')
    .split('\n')
    .map((line) => line.trim())

  const blocks = []
  let bullets = []

  const flushBullets = () => {
    if (!bullets.length) return
    blocks.push(
      <ul key={`ul-${blocks.length}`} className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
        {bullets.map((item, index) => (
          <li key={`${item}-${index}`}>{item}</li>
        ))}
      </ul>
    )
    bullets = []
  }

  lines.forEach((line) => {
    if (!line) {
      flushBullets()
      return
    }

    if (line.startsWith('## ')) {
      flushBullets()
      blocks.push(
        <h3 key={`h3-${blocks.length}`} className="text-xl font-playfair font-bold text-gray-900 mt-6 mb-3">
          {line.replace(/^##\s+/, '')}
        </h3>
      )
      return
    }

    if (line.startsWith('- ')) {
      bullets.push(line.replace(/^-\s+/, ''))
      return
    }

    flushBullets()
    blocks.push(
      <p key={`p-${blocks.length}`} className="text-gray-700 leading-relaxed mb-4">
        {line}
      </p>
    )
  })

  flushBullets()
  return blocks
}

export default function AddBlogPostPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [imagePreview, setImagePreview] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'Trends',
    author: 'TIM\'S GLAM Editorial Team',
    readTime: '5 min read',
    tags: '',
    status: 'draft',
    featured: false,
  })

  const slug = useMemo(() => {
    return formData.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
  }, [formData.title])

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file.')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB.')
      return
    }

    setUploading(true)
    setError('')

    try {
      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result)
      reader.readAsDataURL(file)

      const uploadData = new FormData()
      uploadData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
      })

      const result = await response.json()

      if (!response.ok || !result.secure_url) {
        throw new Error(result.error || 'Failed to upload image')
      }

      setImageUrl(result.secure_url)
    } catch (err) {
      setImagePreview('')
      setImageUrl('')
      setError(err?.message || 'Image upload failed.')
    } finally {
      setUploading(false)
    }
  }

  const validateForm = () => {
    if (!formData.title.trim()) return 'Title is required.'
    if (!formData.excerpt.trim()) return 'Excerpt is required.'
    if (!formData.content.trim()) return 'Content is required.'
    if (!imageUrl) return 'Cover image is required.'
    return ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setSaving(true)

    try {
      const now = serverTimestamp()
      const blogPayload = {
        title: formData.title.trim(),
        slug,
        excerpt: formData.excerpt.trim(),
        content: formData.content.trim(),
        image: imageUrl,
        category: formData.category,
        author: formData.author.trim() || 'TIM\'S GLAM Editorial Team',
        readTime: formData.readTime.trim() || '5 min read',
        tags: formData.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
        status: formData.status,
        featured: Boolean(formData.featured),
        publishedAt: formData.status === 'published' ? now : null,
        createdAt: now,
        updatedAt: now,
      }
      const blogRef = await addDoc(collection(db, 'blogPosts'), blogPayload)

      if (blogPayload.status === 'published') {
        try {
          await fetch('/api/notify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'newBlogBroadcast',
              blogId: blogRef.id,
              title: blogPayload.title,
              excerpt: blogPayload.excerpt,
            }),
          })
        } catch {
          // Do not block blog publishing if email broadcast fails.
        }
      }

      setSuccess(true)
      setTimeout(() => router.push('/admin/blog'), 1200)
    } catch (err) {
      setError(err?.message || 'Failed to create blog post.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <button
          onClick={() => router.push('/admin/blog')}
          className="flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-4 font-medium"
        >
          <FiArrowLeft className="h-5 w-5" />
          Back to Blog
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Add Blog Post</h1>
        <p className="text-gray-500 mt-1">Create trend updates, product launches, and editorial content.</p>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
          <FiCheck className="text-green-600 h-5 w-5" />
          <p className="text-green-700">Blog post created successfully. Redirecting...</p>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <FiX className="text-red-600 h-5 w-5" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Cover Image</h2>

          {imagePreview ? (
            <div className="relative w-full max-w-xl h-64 mb-4">
              <Image src={imagePreview} alt="Blog preview" fill unoptimized className="object-cover rounded-lg" />
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">
              <FiImage className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 font-medium">Upload blog cover image</p>
              <p className="text-sm text-gray-500">PNG, JPG up to 5MB</p>
            </div>
          )}

          <label className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium ${uploading ? 'bg-gray-400' : 'bg-primary-600 hover:bg-primary-700'} cursor-pointer transition-colors`}>
            {uploading ? <FiLoader className="h-4 w-4 animate-spin" /> : <FiUpload className="h-4 w-4" />}
            {uploading ? 'Uploading...' : 'Select Image'}
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
          </label>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-5">
          <h2 className="text-lg font-semibold text-gray-900">Post Details</h2>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="e.g. Latest Trends: Ankara Revival 2026"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Slug (auto-generated)</label>
            <input type="text" value={slug} readOnly className="w-full px-4 py-2 border border-gray-200 bg-gray-50 rounded-lg text-gray-500" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Excerpt</label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Short summary shown on blog cards"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Content</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
              rows={14}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder={'Write the full article content here...\n\nUse "##" for section headings and "-" for bullet points.\nExample:\n## Key Takeaways\n- Trend insight 1\n- Trend insight 2'}
            />
            <p className="text-xs text-gray-500 mt-2">Tip: Use <span className="font-semibold">##</span> for section headings and <span className="font-semibold">-</span> for bullet points.</p>

            <div className="mt-5 border border-gray-200 rounded-xl p-5 bg-gray-50">
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">Live Preview</h3>
              <h2 className="text-2xl font-playfair font-bold text-gray-900 mb-2">
                {formData.title.trim() || 'Post title preview'}
              </h2>
              <p className="text-gray-600 mb-6">
                {formData.excerpt.trim() || 'Post excerpt preview will appear here.'}
              </p>
              <div className="border-t border-gray-200 pt-4">
                {formData.content.trim() ? (
                  <div>{renderPreviewContent(formData.content)}</div>
                ) : (
                  <p className="text-sm text-gray-500">Start writing content to preview the article body.</p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Read Time</label>
              <input
                type="text"
                value={formData.readTime}
                onChange={(e) => setFormData((prev) => ({ ...prev, readTime: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="5 min read"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Author</label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData((prev) => ({ ...prev, author: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tags (comma-separated)</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData((prev) => ({ ...prev, tags: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="trends, new-arrivals, style"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            <label className="inline-flex items-center gap-2 mt-6 md:mt-0">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData((prev) => ({ ...prev, featured: e.target.checked }))}
                className="h-4 w-4"
              />
              <span className="text-sm font-medium text-gray-700">Feature this post</span>
            </label>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving || uploading}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold disabled:opacity-50"
          >
            {saving ? <FiLoader className="h-4 w-4 animate-spin" /> : <FiCheck className="h-4 w-4" />}
            {saving ? 'Saving...' : 'Create Post'}
          </button>

          <button
            type="button"
            onClick={() => router.push('/admin/blog')}
            className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
