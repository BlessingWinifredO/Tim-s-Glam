'use client'

import { useEffect, useState } from 'react'
import { useAdminAuth } from '@/context/AdminAuthContext'
import Image from 'next/image'
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

const ageGroups = ['adults', 'kids']
const audiences = [
  { value: 'men', label: 'Men' },
  { value: 'women', label: 'Women' },
  { value: 'boys', label: 'Boys' },
  { value: 'girls', label: 'Girls' },
  { value: 'unisex', label: 'Unisex' }
]
const traditionalTypeValues = new Set(['saree', 'lehenga', 'kurta', 'wrapper', 'agbada'])
const traditionalWearGroups = [
  { id: 'adults-men', label: 'Adults: Men', category: 'adults', audience: 'men' },
  { id: 'adults-women', label: 'Adults: Women', category: 'adults', audience: 'women' },
  { id: 'kids-boys', label: 'Kids: Boys', category: 'kids', audience: 'boys' },
  { id: 'kids-girls', label: 'Kids: Girls', category: 'kids', audience: 'girls' }
]
const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size']

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const { adminUser } = useAdminAuth()
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
  const [selectedTraditionalGroup, setSelectedTraditionalGroup] = useState('none')
  const isTraditionalMode = selectedTraditionalGroup !== 'none'
  const [colorInput, setColorInput] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'adults',
    audience: 'men',
    subcategory: 'tshirt',
    sizes: [],
    colors: [],
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
          category: data.category || 'adults',
          audience: data.audience || 'men',
          subcategory: data.subcategory || 'tshirt',
          sizes: data.sizes || [],
          colors: data.colors || [],
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

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB')
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    setUploading(true)
    setError('')

    try {
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)

      // Upload to our API endpoint
      const formDataCloud = new FormData()
      formDataCloud.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'x-admin-session': 'true',
          'x-admin-email': adminUser?.email || '',
        },
        body: formDataCloud,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload image')
      }

      if (!data.secure_url) {
        throw new Error('No image URL received from server')
      }

      setImageUrl(data.secure_url)
      setError('')
    } catch (err) {
      console.error('Image upload error:', err)
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

  const applyTraditionalGroup = (groupId) => {
    setSelectedTraditionalGroup(groupId)

    if (groupId === 'none') return

    const selectedGroup = traditionalWearGroups.find(group => group.id === groupId)
    if (!selectedGroup) return

    setFormData(prev => ({
      ...prev,
      category: selectedGroup.category,
      audience: selectedGroup.audience,
      subcategory: traditionalTypeValues.has(prev.subcategory) ? prev.subcategory : 'kurta'
    }))
  }

  useEffect(() => {
    if (!traditionalTypeValues.has(formData.subcategory)) {
      setSelectedTraditionalGroup('none')
      return
    }

    const matchedGroup = traditionalWearGroups.find(
      group => group.category === formData.category && group.audience === formData.audience
    )
    setSelectedTraditionalGroup(matchedGroup ? matchedGroup.id : 'none')
  }, [formData.category, formData.audience, formData.subcategory])

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
        audience: formData.audience,
        subcategory: formData.subcategory,
        sizes: formData.sizes,
        colors: formData.colors,
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
      const message =
        err?.code === 'permission-denied'
          ? 'Failed to update product: Firestore permission denied. Ensure admin is signed in and Firestore rules allow authenticated writes to products.'
          : `Failed to update product: ${err.message}`
      setError(message)
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
      const message =
        err?.code === 'permission-denied'
          ? 'Failed to delete product: Firestore permission denied. Ensure admin is signed in and Firestore rules allow authenticated writes to products.'
          : `Failed to delete product: ${err.message}`
      setError(message)
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
          onClick={() => router.push('/admin/products')}
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
        {/* Two Column Layout: Form Left, Image Right */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Form Fields */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
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
                      Age Group *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      disabled={isTraditionalMode}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      {ageGroups.map(group => (
                        <option key={group} value={group}>
                          {group.charAt(0).toUpperCase() + group.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender/Audience *
                    </label>
                    <select
                      name="audience"
                      value={formData.audience}
                      onChange={handleInputChange}
                      disabled={isTraditionalMode}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      {audiences.map(aud => (
                        <option key={aud.value} value={aud.value}>{aud.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Type *
                    </label>
                    <input
                      type="text"
                      name="subcategory"
                      value={formData.subcategory}
                      onChange={handleInputChange}
                      readOnly={isTraditionalMode}
                      placeholder="e.g., kaftan, gown, blazer"
                      className={`w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        isTraditionalMode ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''
                      }`}
                    />
                    {isTraditionalMode && (
                      <p className="text-xs text-amber-700 mt-1">
                        Traditional mode is active. Edit product type in the Traditional Wear section below.
                      </p>
                    )}
                  </div>
                </div>

                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <h3 className="text-sm font-semibold text-amber-900">Traditional Wear Section</h3>
                    <button
                      type="button"
                      onClick={() => applyTraditionalGroup('none')}
                      className="text-xs font-semibold text-amber-800 hover:text-amber-900"
                    >
                      Clear
                    </button>
                  </div>
                  <p className="text-xs text-amber-800 mb-3">
                    Select where this traditional wear belongs. This keeps Edit Product aligned with shop traditional categories.
                  </p>

                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {traditionalWearGroups.map(group => (
                      <button
                        key={group.id}
                        type="button"
                        onClick={() => applyTraditionalGroup(group.id)}
                        className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all border ${
                          selectedTraditionalGroup === group.id
                            ? 'bg-amber-600 text-white border-amber-600'
                            : 'bg-white text-amber-900 border-amber-200 hover:bg-amber-100'
                        }`}
                      >
                        {group.label}
                      </button>
                    ))}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-amber-900 mb-2">
                      Traditional Product Type
                    </label>
                    <input
                      type="text"
                      name="subcategory"
                      value={formData.subcategory}
                      onChange={handleInputChange}
                      placeholder="e.g., saree, agbada, kaftan"
                      className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing & Stock */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Pricing & Stock</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (₦) *
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

            {/* Colors Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Colors <span className="text-gray-400 text-sm font-normal">(optional)</span></h2>
              <div className="flex flex-wrap gap-2 mb-3">
                {(formData.colors || []).map((color) => (
                  <span key={color} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-50 border border-primary-200 text-primary-700 text-sm">
                    {color}
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, colors: prev.colors.filter(c => c !== color) }))}
                      className="hover:text-red-500 ml-0.5"
                    >
                      <FiX size={12} />
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                value={colorInput}
                onChange={(e) => setColorInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ',') {
                    e.preventDefault()
                    const val = colorInput.trim().replace(/,$/, '')
                    if (val && !(formData.colors || []).includes(val)) {
                      setFormData(prev => ({ ...prev, colors: [...(prev.colors || []), val] }))
                    }
                    setColorInput('')
                  }
                }}
                onBlur={() => {
                  const val = colorInput.trim().replace(/,$/, '')
                  if (val && !(formData.colors || []).includes(val)) {
                    setFormData(prev => ({ ...prev, colors: [...(prev.colors || []), val] }))
                  }
                  setColorInput('')
                }}
                placeholder="e.g. Black, White, Red — press Enter to add"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200"
              />
            </div>
          </div>

          {/* Right Column: Product Image */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 sticky top-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Image</h2>
              
              <div className="space-y-4">
                {imagePreview ? (
                  <div className="relative w-full h-64">
                    <Image
                      src={imagePreview}
                      alt="Product preview"
                      fill
                      unoptimized
                      className="object-cover rounded-lg"
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
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
                    <FiImage className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 font-medium text-sm">No image yet</p>
                    <p className="text-xs text-gray-500">Upload to display</p>
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
                  <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all w-full justify-center text-sm ${
                    imagePreview !== imageUrl
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'bg-primary-600 text-white hover:bg-primary-700'
                  } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    {uploading ? (
                      <>
                        <FiLoader className="h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <FiUpload className="h-4 w-4" />
                        {imagePreview !== imageUrl ? 'Change' : 'Replace'}
                      </>
                    )}
                  </span>
                </label>
              </div>
            </div>
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
              onClick={() => router.push('/admin/products')}
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
