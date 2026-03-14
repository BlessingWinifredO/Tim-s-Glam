'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { blogPosts as staticBlogPosts } from '@/data/blog'
import { FiClock, FiUser, FiTag, FiArrowLeft, FiShare2 } from 'react-icons/fi'

function renderPostContent(content) {
  const lines = String(content || '')
    .split('\n')
    .map((line) => line.trim())

  const elements = []
  let bulletBuffer = []

  const flushBullets = () => {
    if (!bulletBuffer.length) return
    elements.push(
      <ul key={`ul-${elements.length}`} className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
        {bulletBuffer.map((item, index) => (
          <li key={`${item}-${index}`}>{item}</li>
        ))}
      </ul>
    )
    bulletBuffer = []
  }

  lines.forEach((line) => {
    if (!line) {
      flushBullets()
      return
    }

    if (line.startsWith('## ')) {
      flushBullets()
      elements.push(
        <h2 key={`h2-${elements.length}`} className="text-2xl font-playfair font-bold text-gray-800 mt-8 mb-4">
          {line.replace(/^##\s+/, '')}
        </h2>
      )
      return
    }

    if (line.startsWith('- ')) {
      bulletBuffer.push(line.replace(/^-\s+/, ''))
      return
    }

    flushBullets()
    elements.push(
      <p key={`p-${elements.length}`} className="text-gray-700 leading-relaxed mb-6">
        {line}
      </p>
    )
  })

  flushBullets()
  return elements
}

export default function BlogPost() {
  const params = useParams()
  const router = useRouter()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  const getShareUrl = () => {
    if (typeof window !== 'undefined') return window.location.href
    return `${process.env.NEXT_PUBLIC_APP_URL || 'https://tims-glam.com'}/blog/${params?.id}`
  }

  const handleShare = async () => {
    const url = getShareUrl()
    const title = post?.title || "TIM'S GLAM Blog"
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title, url })
        return
      } catch (_) {
        // user cancelled or browser blocked — fall through to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch (_) {
      // clipboard unavailable
    }
  }

  const shareTo = (platform) => {
    const url = encodeURIComponent(getShareUrl())
    const text = encodeURIComponent(post?.title || "TIM'S GLAM Blog")
    const links = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      pinterest: `https://pinterest.com/pin/create/button/?url=${url}&description=${text}`,
    }
    window.open(links[platform], '_blank', 'noopener,noreferrer,width=600,height=400')
  }

  const relatedPosts = useMemo(() => {
    if (!post) return []
    return staticBlogPosts
      .filter((p) => p.id !== post.id && p.category === post.category)
      .slice(0, 3)
  }, [post])

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true)
        const id = String(params.id || '')
        const snapshot = await getDoc(doc(db, 'blogPosts', id))

        if (snapshot.exists()) {
          const data = snapshot.data()
          if (data.status === 'published') {
            setPost({
              id: snapshot.id,
              ...data,
              date:
                data.publishedAt?.toDate?.()?.toLocaleDateString() ||
                data.updatedAt?.toDate?.()?.toLocaleDateString() ||
                data.createdAt?.toDate?.()?.toLocaleDateString() ||
                'N/A',
            })
            return
          }
        }

        const fallbackPost = staticBlogPosts.find((p) => p.id === parseInt(id, 10)) || null
        setPost(fallbackPost)
      } catch {
        const fallbackPost = staticBlogPosts.find((p) => p.id === parseInt(params.id, 10)) || null
        setPost(fallbackPost)
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading article...</p>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Post Not Found</h2>
          <Link href="/blog" className="btn-primary">
            Back to Blog
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container-custom py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-gold-500">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-gold-500">Blog</Link>
            <span>/</span>
            <span className="text-gray-800 font-semibold line-clamp-1">{post.title}</span>
          </div>
        </div>
      </div>

      {/* Article */}
      <article className="section-padding">
        <div className="container-custom max-w-4xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gold-500 mb-6 transition-colors"
          >
            <FiArrowLeft size={20} />
            Back to Blog
          </button>

          {/* Post Header */}
          <header className="mb-8">
            <span className="inline-block bg-gold-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
              {post.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-playfair font-bold text-gray-800 mb-6">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-gray-600">
              <span className="flex items-center gap-2">
                <FiUser size={18} />
                <span className="font-semibold">{post.author}</span>
              </span>
              <span className="flex items-center gap-2">
                <FiClock size={18} />
                {post.readTime}
              </span>
              <span>{post.date}</span>
              <button
                onClick={handleShare}
                className="ml-auto flex items-center gap-2 text-gold-500 hover:text-gold-600 transition-colors"
              >
                <FiShare2 size={18} />
                {copied ? 'Link Copied!' : 'Share'}
              </button>
            </div>
          </header>

          {/* Featured Image */}
          <div className="relative h-96 md:h-[500px] rounded-lg overflow-hidden mb-8">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Post Content */}
          <div className="bg-white p-8 rounded-lg shadow-md mb-12">
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-gray-700 leading-relaxed mb-6">
                {post.excerpt}
              </p>

              {renderPostContent(post.content)}
            </div>
          </div>

          {/* Share Section */}
          <div className="bg-gradient-to-r from-primary-50 to-gold-50 p-8 rounded-lg mb-12 text-center">
            <h3 className="text-2xl font-playfair font-bold text-primary-500 mb-4">
              Enjoyed this article?
            </h3>
            <p className="text-gray-600 mb-6">Share it with your friends and family!</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => shareTo('facebook')}
                className="bg-white px-6 py-3 rounded-md shadow-md hover:shadow-lg transition-all hover:bg-blue-50 text-blue-700 font-medium"
              >
                Facebook
              </button>
              <button
                onClick={() => shareTo('twitter')}
                className="bg-white px-6 py-3 rounded-md shadow-md hover:shadow-lg transition-all hover:bg-sky-50 text-sky-600 font-medium"
              >
                Twitter
              </button>
              <button
                onClick={() => shareTo('pinterest')}
                className="bg-white px-6 py-3 rounded-md shadow-md hover:shadow-lg transition-all hover:bg-red-50 text-red-600 font-medium"
              >
                Pinterest
              </button>
            </div>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div>
              <h2 className="text-3xl font-playfair font-bold text-gray-800 mb-8">
                Related Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map(relatedPost => (
                  <Link key={relatedPost.id} href={`/blog/${relatedPost.id}`}>
                    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1">
                      <div className="relative h-48">
                        <Image
                          src={relatedPost.image}
                          alt={relatedPost.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-gray-800 mb-2 hover:text-gold-500 transition-colors line-clamp-2">
                          {relatedPost.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {relatedPost.excerpt}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </div>
  )
}
