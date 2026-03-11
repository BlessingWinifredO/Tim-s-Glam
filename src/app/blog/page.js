'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { blogPosts as staticBlogPosts, categories as staticCategories } from '@/data/blog'
import { FiClock, FiUser, FiTag, FiSearch, FiTrendingUp, FiBookOpen, FiArrowRight } from 'react-icons/fi'

export default function Blog() {
  const [blogPosts, setBlogPosts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
        const snapshot = await getDocs(query(collection(db, 'blogPosts'), where('status', '==', 'published')))
        const firestorePosts = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .map((post) => ({
            ...post,
            date:
              post.publishedAt?.toDate?.()?.toLocaleDateString() ||
              post.updatedAt?.toDate?.()?.toLocaleDateString() ||
              post.createdAt?.toDate?.()?.toLocaleDateString() ||
              'N/A',
          }))
          .sort((a, b) => {
            const aTime = a.publishedAt?.toDate?.()?.getTime() || a.updatedAt?.toDate?.()?.getTime() || 0
            const bTime = b.publishedAt?.toDate?.()?.getTime() || b.updatedAt?.toDate?.()?.getTime() || 0
            return bTime - aTime
          })

        if (firestorePosts.length > 0) {
          setBlogPosts(firestorePosts)
        } else {
          setBlogPosts(staticBlogPosts)
        }
        setLoadError('')
      } catch {
        setBlogPosts(staticBlogPosts)
        setLoadError('Could not load latest blog posts from server. Showing fallback content.')
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  const categories = useMemo(() => {
    const fromPosts = Array.from(new Set(blogPosts.map((post) => post.category).filter(Boolean)))
    return fromPosts.length ? ['All', ...fromPosts] : staticCategories
  }, [blogPosts])

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const featuredPost = blogPosts.find((post) => post.featured) || blogPosts[0]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading blog content...</p>
      </div>
    )
  }

  if (!featuredPost) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">No blog posts available yet.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Parallax Background */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=2000&q=80"
            alt="Blog Hero"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900/90 via-primary-800/85 to-primary-700/90"></div>
        </div>
        
        <div className="container-custom relative z-10 text-center">
          <span className="inline-flex items-center px-4 py-2 rounded-full bg-gold-500/20 backdrop-blur-sm border border-gold-300/30 text-gold-300 text-sm font-semibold tracking-wide mb-6">
            Fashion & Style Inspiration
          </span>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-playfair font-bold text-white mb-5">Fashion Blog</h1>
          <p className="text-base md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed px-4">
            Style inspiration, fashion tips, and the latest trends from our experts
          </p>
          
          {/* Quick Stats */}
          <div className="mt-10 flex flex-wrap justify-center gap-6 md:gap-12">
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-gold-300 mb-1">{blogPosts.length}+</p>
              <p className="text-sm md:text-base text-white/80">Articles</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-gold-300 mb-1">10K+</p>
              <p className="text-sm md:text-base text-white/80">Readers</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-gold-300 mb-1">Weekly</p>
              <p className="text-sm md:text-base text-white/80">Updates</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="flex items-center gap-3 mb-10">
            <div className="h-1 w-12 bg-gradient-to-r from-gold-400 to-gold-600 rounded-full"></div>
            <h2 className="text-2xl md:text-3xl font-playfair font-bold text-primary-600">Featured Article</h2>
          </div>
          
          <div className="group relative bg-white rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              {/* Image Section */}
              <div className="relative h-80 md:h-96 lg:h-auto lg:col-span-7 overflow-hidden">
                <Image
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                <span className="absolute top-6 left-6 bg-gold-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                  {featuredPost.category}
                </span>
              </div>
              
              {/* Content Section */}
              <div className="lg:col-span-5 p-8 md:p-10 flex flex-col justify-center bg-gradient-to-br from-primary-50/50 to-gold-50/30">
                <div className="inline-flex items-center gap-2 text-gold-600 text-sm font-semibold mb-4">
                  <FiTrendingUp size={18} />
                  <span>Most Popular</span>
                </div>
                
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-playfair font-bold text-gray-900 mb-4 leading-tight">
                  {featuredPost.title}
                </h3>
                
                <p className="text-gray-600 text-base md:text-lg mb-6 leading-relaxed">
                  {featuredPost.excerpt}
                </p>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-200">
                  <span className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {featuredPost.author.charAt(0)}
                    </div>
                    <span className="font-medium text-gray-700">{featuredPost.author}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FiClock size={16} className="text-gold-500" />
                    {featuredPost.readTime}
                  </span>
                  <span className="text-gray-400">{featuredPost.date}</span>
                </div>
                
                <Link 
                  href={`/blog/${featuredPost.id}`} 
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold px-8 py-4 rounded-lg transition-all shadow-lg hover:shadow-xl group w-full md:w-auto"
                >
                  Read Full Article
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="section-padding bg-gradient-to-b from-gray-50 to-white">
        <div className="container-custom">
          {loadError && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-sm">
              {loadError}
            </div>
          )}

          {/* Search and Filter */}
          <div className="mb-12 bg-white rounded-2xl p-6 md:p-8 shadow-lg">
            {/* Search Bar */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Search Articles</label>
              <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by title or topic..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all text-gray-800 placeholder-gray-400"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Filter by Category</label>
              <div className="flex flex-wrap gap-3">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-5 py-2.5 rounded-full font-semibold transition-all duration-300 ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-white shadow-lg scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center gap-3 mb-8">
            <FiBookOpen className="text-gold-500" size={24} />
            <p className="text-gray-700 text-lg">
              Found <span className="font-bold text-primary-600">{filteredPosts.length}</span> {filteredPosts.length === 1 ? 'article' : 'articles'}
            </p>
          </div>

          {/* Blog Posts Grid */}
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredPosts.map(post => (
                <article key={post.id} className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                  <Link href={`/blog/${post.id}`}>
                    {/* Image */}
                    <div className="relative h-56 md:h-64 overflow-hidden bg-gray-200">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <span className="absolute top-4 left-4 bg-gold-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-md">
                        {post.category}
                      </span>
                    </div>
                    
                    {/* Content */}
                    <div className="p-6">
                      {/* Author & Time */}
                      <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                        <span className="flex items-center gap-1.5">
                          <div className="w-6 h-6 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                            {post.author.charAt(0)}
                          </div>
                          <span className="font-medium">{post.author}</span>
                        </span>
                        <span className="text-gray-300">•</span>
                        <span className="flex items-center gap-1">
                          <FiClock size={12} />
                          {post.readTime}
                        </span>
                      </div>
                      
                      {/* Title */}
                      <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 group-hover:text-gold-600 transition-colors line-clamp-2 leading-tight">
                        {post.title}
                      </h3>
                      
                      {/* Excerpt */}
                      <p className="text-gray-600 text-sm md:text-base mb-4 line-clamp-3 leading-relaxed">
                        {post.excerpt}
                      </p>
                      
                      {/* Read More */}
                      <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-xs text-gray-500">{post.date}</span>
                        <span className="inline-flex items-center gap-1.5 text-gold-600 font-semibold text-sm group-hover:gap-2.5 transition-all">
                          Read More
                          <FiArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-gold-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiSearch className="text-gold-600" size={32} />
              </div>
              <h3 className="text-2xl font-playfair font-bold text-gray-800 mb-3">No Articles Found</h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                We couldn&apos;t find any articles matching your search. Try adjusting your filters or search terms.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('All')
                  setSearchTerm('')
                }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold px-8 py-4 rounded-lg transition-all shadow-lg hover:shadow-xl"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2000&q=80"
            alt="Newsletter"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900/95 via-primary-800/90 to-primary-700/95"></div>
        </div>
        
        <div className="container-custom max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gold-500/20 backdrop-blur-sm border border-gold-300/30 rounded-full mb-6">
              <FiBookOpen className="text-gold-300" size={28} />
            </div>
            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-white mb-4">
              Subscribe to Our Newsletter
            </h2>
            <p className="text-base md:text-lg text-white/90 max-w-2xl mx-auto leading-relaxed px-4">
              Get the latest fashion tips, style inspiration, and exclusive content delivered straight to your inbox every week!
            </p>
          </div>
          
          <div className="max-w-xl mx-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 md:p-8">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-grow px-5 py-4 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-500 border-2 border-transparent"
              />
              <button className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white px-8 py-4 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl whitespace-nowrap">
                Subscribe Now
              </button>
            </div>
            <p className="text-white/70 text-xs mt-4 text-center">
              Join 10,000+ fashion enthusiasts. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
