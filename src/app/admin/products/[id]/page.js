'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { doc, getDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { 
  FiArrowLeft, 
  FiUpload, 
  FiLoader,
  FiCheck,
  FiX,
  FiImage,
  FiTrash
} from 'react-icons/fi'

const categories = ['Men', 'Women', 'Kids', 'Unisex']
const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size']

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params.id

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [imagePreview, setImagePreview] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Men',
    sizes: [],
    stock: '',
    sku: '',
    status: 'Active',
  })

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const docRef = doc(db, 'products', productId)
        const docSnap = await getDoc(docRef)

        if (!docSnap.exists()) {
          setError('Product not found')
          return
        }

        const data = docSnap.data()
        setFormData({
          name: data.name || '',
          description: data.description || '',
          price: data.price || '',
          category: data.category || 'Men',
          sizes: data.sizes || [],
          stock: data.stock || '',
          sku: data.sku || '',
          status: data.status || 'Active',
        })
        setImageUrl(data.image || '')
        setImagePreview(data.image || '')
      } catch (err) {
        setError(`Failed to load product: ${err.message}`)
      } finally {
        setLoading(false)
      }
    }

    if (productId) {
      fetchProduct()
    }
  }, [productId])

  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError('')

    try {
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)

      // Upload to Cloudinary
      const formDataCloud = new FormData()
      formDataCloud.append('file', file)
      formDataCloud.append('upload_preset', 'tims_glam_unsigned')

      const response = await fetch(
        'https://api.cloudinary.com/v1_1/dh8gvxcqf/image/upload',
        {
          method: 'POST',
          body: formDataCloud,
        }
      )

      if (!response.ok) throw new Error('Failed to upload image')

      const data = await response.json()
      setImageUrl(data.secure_url)
      setError('')
    } catch (err) {
      setError(`Image upload failed: ${err.message}`)
      setImagePreview(imageUrl)
    } finally {
      setUploading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const toggleSize = (size) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }))
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Product name is required')
      return false
    }
    if (!formData.description.trim()) {
      setError('Product description is required')
      return false
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError('Valid price is required')
      return false
    }
    if (!formData.stock || parseFloat(formData.stock) < 0) {
      setError('Valid stock quantity is required')
      return false
    }
    if (!imageUrl) {
      setError('Product image is required')
      return false
    }
    if (formData.sizes.length === 0) {
      setError('Select at least one size')
      return false
    }
    return true
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setError('')

    if (!validateForm()) return

    setSaving(true)

    try {
      const docRef = doc(db, 'products', productId)
      await updateDoc(docRef, {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        sizes: formData.sizes,
        stock: parseInt(formData.stock),
        sku: formData.sku,
        image: imageUrl,
        status: formData.status,
        updatedAt: serverTimestamp(),
      })

      setSuccess(true)
      setTimeout(() => {
        router.push('/admin/products')
      }, 2000)
    } catch (err) {
      setError(`Failed to update product: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    setError('')

    try {
      await deleteDoc(doc(db, 'products', productId))
      setSuccess(true)
      setTimeout(() => {
        router.push('/admin/products')
      }, 1500)
    } catch (err) {
      setError(`Failed to delete product: ${err.message}`)
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <FiLoader className="h-8 w-8 text-primary-600 animate-spin" />
        <p className="ml-3 text-gray-600">Loading product...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-4 font-medium transition-colors"
        >
          <FiArrowLeft className="h-5 w-5" />
          Back to Products
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
        <p className="text-gray-500 mt-1">Update product details and information</p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
          <FiCheck className="text-green-600 h-5 w-5" />
          <div>
            <p className="font-medium text-green-900">
              {deleting ? 'Product deleted successfully!' : 'Product updated successfully!'}
            </p>
            <p className="text-sm text-green-700">Redirecting...</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <FiX className="text-red-600 h-5 w-5" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleUpdate} className="space-y-8">
        {/* Image Upload Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Image</h2>
          
          <div className="space-y-4">
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Product preview"
                  className="w-full max-w-sm h-64 object-cover rounded-lg"
                />
                {imagePreview !== imageUrl && (
                  <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">
                    New Image
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(imageUrl)
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-500 transition-colors">
                <FiImage className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 font-medium">Replace Product Image</p>
                <p className="text-sm text-gray-500">PNG, JPG up to 5MB</p>
              </div>
            )}

            <label className={`block cursor-pointer ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="hidden"
              />
              <span className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                imagePreview !== imageUrl
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  : 'bg-primary-600 text-white hover:bg-primary-700'
              } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                {uploading ? (
                  <>
                    <FiLoader className="h-5 w-5 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <FiUpload className="h-5 w-5" />
                    {imagePreview !== imageUrl ? 'Change Image' : 'Replace Image'}
                  </>
                )}
              </span>
            </label>
          </div>
        </div>

        {/* Basic Info Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Basic Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SKU
                </label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing & Stock Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Pricing & Stock</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price ($) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Quantity *
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                min="0"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="Active">Active</option>
                <option value="Draft">Draft</option>
                <option value="Discontinued">Discontinued</option>
              </select>
            </div>
          </div>
        </div>

        {/* Sizes Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Sizes *</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {sizes.map(size => (
              <button
                key={size}
                type="button"
                onClick={() => toggleSize(size)}
                className={`p-3 rounded-lg font-medium transition-all border-2 ${
                  formData.sizes.includes(size)
                    ? 'bg-primary-100 border-primary-500 text-primary-700'
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex gap-4 justify-between">
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium border border-red-200"
            disabled={saving || deleting}
          >
            <FiTrash className="h-5 w-5" />
            Delete Product
          </button>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || uploading}
              className={`inline-flex items-center gap-2 px-8 py-3 rounded-lg font-medium text-white transition-all ${
                saving || uploading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-primary-600 hover:bg-primary-700'
              }`}
            >
              {saving ? (
                <>
                  <FiLoader className="h-5 w-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <FiCheck className="h-5 w-5" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Product?</h3>
            <p className="text-gray-600 mb-6">
              This action cannot be undone. The product will be permanently deleted from your store.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className={`flex-1 px-4 py-2 rounded-lg font-medium text-white transition-all inline-flex items-center justify-center gap-2 ${
                  deleting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {deleting ? (
                  <>
                    <FiLoader className="h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <FiTrash className="h-4 w-4" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
