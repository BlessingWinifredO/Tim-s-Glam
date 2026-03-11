'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { isProductSold } from '@/lib/productAvailability'
import { 
  FiPackage, 
  FiPlus, 
  FiSearch, 
  FiEdit2, 
  FiTrash2,
  FiLoader
} from 'react-icons/fi'

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState(null)

  // Fetch products from Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const querySnapshot = await getDocs(collection(db, 'products'))
        const productsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setProducts(productsData)
        setError('')
      } catch (err) {
        setError(`Failed to load products: ${err.message}`)
        console.error('Error fetching products:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return

    setDeleting(id)
    try {
      await deleteDoc(doc(db, 'products', id))
      setProducts(products.filter(p => p.id !== id))
    } catch (err) {
      setError(`Failed to delete product: ${err.message}`)
    } finally {
      setDeleting(null)
    }
  }

  const filteredProducts = products.filter(product =>
    product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FiPackage className="text-primary-600" />
            Products Management
          </h1>
          <p className="text-gray-500 mt-1">Manage your product inventory</p>
        </div>
        <Link
          href="/admin/products/add"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium shadow-sm"
        >
          <FiPlus className="h-5 w-5" />
          Add New Product
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Total Products</p>
          <p className="text-3xl font-bold text-gray-900">{products.length}</p>
          <p className="text-xs text-green-600 mt-2">+{products.length > 0 ? products.length : 0} added</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Active</p>
          <p className="text-3xl font-bold text-green-600">
            {products.filter(p => p.status === 'Active' || (p.inStock !== false && !p.status)).length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Out of Stock</p>
          <p className="text-3xl font-bold text-red-600">
            {products.filter(p => {
              // Check if product is explicitly out of stock
              if (p.stock !== undefined && p.stock !== null) {
                return Number(p.stock) === 0
              }
              // Check inStock boolean (only count as out of stock if explicitly false)
              if (p.inStock !== undefined && p.inStock !== null) {
                return p.inStock === false
              }
              // If no stock info, assume in stock
              return false
            }).length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Total Value</p>
          <p className="text-3xl font-bold text-primary-600">
            ₦{(products.reduce((sum, p) => {
              const stock = p.stock !== undefined ? parseInt(p.stock) : (p.inStock ? 1 : 0);
              return sum + (parseFloat(p.price || 0) * stock);
            }, 0)).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex gap-3 items-center">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search products by name or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <FiLoader className="h-8 w-8 text-primary-600 animate-spin" />
          <p className="ml-3 text-gray-600">Loading products...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-gray-100">
          <FiPackage className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {products.length === 0 ? 'No products yet' : 'No results found'}
          </h3>
          <p className="text-gray-600 mb-6">
            {products.length === 0 
              ? 'Start by adding your first product to your inventory.'
              : 'Try adjusting your search criteria.'}
          </p>
          {products.length === 0 && (
            <Link
              href="/admin/products/add"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              <FiPlus className="h-5 w-5" />
              Add Your First Product
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {product.image ? (
                          <Image
                            src={product.image}
                            alt={product.name}
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-lg object-cover bg-gray-200"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                            <FiPackage className="text-gray-500 h-5 w-5" />
                          </div>
                        )}
                        <span className="font-medium text-gray-900">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">
                      ₦{parseFloat(product.price || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {product.stock !== undefined ? product.stock : (product.inStock ? '∞' : '0')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        (product.status === 'Active' || (product.inStock && !product.status))
                          ? 'bg-green-100 text-green-800'
                          : product.status === 'Draft'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.status || (product.inStock ? 'Active' : 'Out of Stock')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        >
                          <FiEdit2 className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          disabled={deleting === product.id}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {deleting === product.id ? (
                            <FiLoader className="h-4 w-4 animate-spin" />
                          ) : (
                            <FiTrash2 className="h-4 w-4" />
                          )}
                        </button>
                        {isProductSold(product) && (
                          <span className="text-xs font-semibold text-red-600 uppercase">Sold</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Info */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <p className="text-sm text-gray-600">
              Showing <span className="font-medium">{filteredProducts.length}</span> of{' '}
              <span className="font-medium">{products.length}</span> products
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
