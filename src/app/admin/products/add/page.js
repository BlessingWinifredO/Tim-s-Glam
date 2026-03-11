'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { 
  FiArrowLeft, 
  FiUpload, 
  FiLoader,
  FiCheck,
  FiX,
  FiImage
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

export default function AddProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [imagePreview, setImagePreview] = useState('')
  const [selectedTraditionalGroup, setSelectedTraditionalGroup] = useState('none')
  const isTraditionalMode = selectedTraditionalGroup !== 'none'

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'adults',
    audience: 'men',
    subcategory: 'tshirt',
    sizes: [],
    stock: '',
    sku: '',
    status: 'Active',
  })

  // Handle image upload to Cloudinary
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
      setImagePreview('')
      setImageUrl('')
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!validateForm()) return

    setLoading(true)

    try {
      // Check if product with same SKU already exists
      if (formData.sku) {
        const q = query(
          collection(db, 'products'),
          where('sku', '==', formData.sku)
        )
        const querySnapshot = await getDocs(q)
        if (!querySnapshot.empty) {
          setError('Product with this SKU already exists')
          setLoading(false)
          return
        }
      }

      // Add product to Firestore
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        audience: formData.audience,
        subcategory: formData.subcategory,
        sizes: formData.sizes,
        stock: parseInt(formData.stock),
        sku: formData.sku || `SKU-${Date.now()}`,
        image: imageUrl,
        status: formData.status,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }
      const docRef = await addDoc(collection(db, 'products'), productData)

      if (productData.status === 'Active') {
        try {
          await fetch('/api/notify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'newProductBroadcast',
              productId: docRef.id,
              productName: productData.name,
              price: productData.price,
            }),
          })
        } catch {
          // Do not block product creation if email broadcast fails.
        }
      }

      setSuccess(true)
      // Redirect to products page after 2 seconds
      setTimeout(() => {
        router.push('/admin/products')
      }, 2000)
    } catch (err) {
      const message =
        err?.code === 'permission-denied'
          ? 'Failed to add product: Firestore permission denied. Ensure admin is signed in and Firestore rules allow authenticated writes to products.'
          : `Failed to add product: ${err.message}`
      setError(message)
    } finally {
      setLoading(false)
    }
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
        <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
        <p className="text-gray-500 mt-1">Fill in the product details below</p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
          <FiCheck className="text-green-600 h-5 w-5" />
          <div>
            <p className="font-medium text-green-900">Product added successfully!</p>
            <p className="text-sm text-green-700">Redirecting to products page...</p>
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

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Image Upload Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Image</h2>
          
          <div className="space-y-4">
            {imagePreview ? (
              <div className="relative w-full max-w-sm h-64">
                <Image
                  src={imagePreview}
                  alt="Product preview"
                  fill
                  unoptimized
                  className="object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview('')
                    setImageUrl('')
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-500 transition-colors">
                <FiImage className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 font-medium">Upload Product Image</p>
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
                imageUrl
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
                    {imageUrl ? 'Change Image' : 'Choose Image'}
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
                placeholder="e.g., Premium Cotton T-Shirt"
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
                placeholder="Describe your product..."
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
                  placeholder="e.g., TSHIRT-001"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <p className="text-xs text-gray-500 mt-1">Optional - auto-generated if empty</p>
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
                Select where this traditional wear belongs. This auto-maps Age Group and Gender to match the shop dropdown.
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

        {/* Pricing & Stock Section */}
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
                placeholder="29.99"
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
                placeholder="100"
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
          {formData.sizes.length === 0 && (
            <p className="text-sm text-orange-600 mt-2">Select at least one size</p>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex gap-4 justify-end">
          <button
            type="button"
              onClick={() => router.push('/admin/products')}
            className="px-6 py-3 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || uploading}
            className={`inline-flex items-center gap-2 px-8 py-3 rounded-lg font-medium text-white transition-all ${
              loading || uploading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-primary-600 hover:bg-primary-700'
            }`}
          >
            {loading ? (
              <>
                <FiLoader className="h-5 w-5 animate-spin" />
                Adding Product...
              </>
            ) : (
              <>
                <FiCheck className="h-5 w-5" />
                Add Product
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
