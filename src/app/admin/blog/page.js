'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { collection, deleteDoc, doc, getDocs, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { FiEdit3, FiEye, FiLoader, FiPlus, FiSearch, FiTrash2 } from 'react-icons/fi'

export default function AdminBlogPage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [savingId, setSavingId] = useState('')

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const snapshot = await getDocs(collection(db, 'blogPosts'))
      const all = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))
      all.sort((a, b) => {
        const aTime = a.updatedAt?.toDate?.()?.getTime() || 0
        const bTime = b.updatedAt?.toDate?.()?.getTime() || 0
        return bTime - aTime
      })
      setPosts(all)
      setError('')
    } catch (err) {
      setError(err?.message || 'Failed to load blog posts.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const term = search.toLowerCase()
      const matchesSearch =
        post.title?.toLowerCase().includes(term) ||
        post.excerpt?.toLowerCase().includes(term) ||
        post.category?.toLowerCase().includes(term)
      const matchesStatus = statusFilter === 'all' || post.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [posts, search, statusFilter])

  const setPublishState = async (post, nextStatus) => {
    setSavingId(post.id)
    setError('')

    try {
      await updateDoc(doc(db, 'blogPosts', post.id), {
        status: nextStatus,
        publishedAt: nextStatus === 'published' ? serverTimestamp() : null,
        updatedAt: serverTimestamp(),
      })
      await fetchPosts()
    } catch (err) {
      setError(err?.message || 'Failed to update post status.')
    } finally {
      setSavingId('')
    }
  }

  const toggleFeatured = async (post) => {
    setSavingId(post.id)
    setError('')

    try {
      await updateDoc(doc(db, 'blogPosts', post.id), {
        featured: !post.featured,
        updatedAt: serverTimestamp(),
      })
      await fetchPosts()
    } catch (err) {
      setError(err?.message || 'Failed to update featured state.')
    } finally {
      setSavingId('')
    }
  }

  const handleDelete = async (post) => {
    if (!window.confirm(`Delete post \"${post.title}\"?`)) return

    setSavingId(post.id)
    setError('')

    try {
      await deleteDoc(doc(db, 'blogPosts', post.id))
      setPosts((prev) => prev.filter((item) => item.id !== post.id))
    } catch (err) {
      setError(err?.message || 'Failed to delete post.')
    } finally {
      setSavingId('')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Blog Management</h1>
          <p className="text-gray-500 mt-1">Publish trends, product updates, and fashion editorial content.</p>
        </div>
        <Link
          href="/admin/blog/add"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold"
        >
          <FiPlus className="h-4 w-4" />
          New Post
        </Link>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, excerpt, or category"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      {loading ? (
        <div className="flex items-center gap-3 py-10">
          <FiLoader className="h-5 w-5 animate-spin text-primary-600" />
          <span className="text-gray-600">Loading posts...</span>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-xl p-10 text-center text-gray-500">
          No posts found.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Post</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Category</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Featured</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-gray-900">{post.title}</p>
                      <p className="text-sm text-gray-500 line-clamp-1">{post.excerpt}</p>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-700">{post.category || '-'}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                        post.status === 'published'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {post.status || 'draft'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => toggleFeatured(post)}
                        disabled={savingId === post.id}
                        className={`text-xs px-2.5 py-1 rounded-full border ${
                          post.featured
                            ? 'bg-primary-50 text-primary-700 border-primary-200'
                            : 'bg-gray-50 text-gray-600 border-gray-200'
                        }`}
                      >
                        {post.featured ? 'Featured' : 'Not Featured'}
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/blog/${post.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm"
                        >
                          <FiEye className="h-4 w-4" />
                          View
                        </Link>
                        <Link
                          href={`/admin/blog/${post.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm"
                        >
                          <FiEdit3 className="h-4 w-4" />
                          Edit
                        </Link>
                        {post.status === 'published' ? (
                          <button
                            onClick={() => setPublishState(post, 'draft')}
                            disabled={savingId === post.id}
                            className="px-3 py-1.5 rounded-md bg-amber-100 text-amber-700 hover:bg-amber-200 text-sm"
                          >
                            Unpublish
                          </button>
                        ) : (
                          <button
                            onClick={() => setPublishState(post, 'published')}
                            disabled={savingId === post.id}
                            className="px-3 py-1.5 rounded-md bg-green-100 text-green-700 hover:bg-green-200 text-sm"
                          >
                            Publish
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(post)}
                          disabled={savingId === post.id}
                          className="px-3 py-1.5 rounded-md bg-red-100 text-red-700 hover:bg-red-200 text-sm inline-flex items-center gap-1"
                        >
                          <FiTrash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
