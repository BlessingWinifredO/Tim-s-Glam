'use client'

import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { blogPosts } from '@/data/blog'
import { FiClock, FiUser, FiTag, FiArrowLeft, FiShare2 } from 'react-icons/fi'

export default function BlogPost() {
  const params = useParams()
  const router = useRouter()
  
  const post = blogPosts.find(p => p.id === parseInt(params.id))

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

  const relatedPosts = blogPosts
    .filter(p => p.id !== post.id && p.category === post.category)
    .slice(0, 3)

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
              <button className="ml-auto flex items-center gap-2 text-gold-500 hover:text-gold-600 transition-colors">
                <FiShare2 size={18} />
                Share
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
              
              <p className="text-gray-700 leading-relaxed mb-6">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt 
                ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco 
                laboris nisi ut aliquip ex ea commodo consequat.
              </p>

              <h2 className="text-2xl font-playfair font-bold text-gray-800 mt-8 mb-4">Key Takeaways</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat 
                nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia 
                deserunt mollit anim id est laborum.
              </p>

              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                <li>Understanding current fashion trends and how to incorporate them</li>
                <li>Building a versatile wardrobe that works for any occasion</li>
                <li>Choosing sustainable and ethical fashion options</li>
                <li>Expressing your personal style with confidence</li>
              </ul>

              <h2 className="text-2xl font-playfair font-bold text-gray-800 mt-8 mb-4">Final Thoughts</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque 
                laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi 
                architecto beatae vitae dicta sunt explicabo.
              </p>

              <p className="text-gray-700 leading-relaxed">
                Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia 
                consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
              </p>
            </div>
          </div>

          {/* Share Section */}
          <div className="bg-gradient-to-r from-primary-50 to-gold-50 p-8 rounded-lg mb-12 text-center">
            <h3 className="text-2xl font-playfair font-bold text-primary-500 mb-4">
              Enjoyed this article?
            </h3>
            <p className="text-gray-600 mb-6">Share it with your friends and family!</p>
            <div className="flex justify-center gap-4">
              <button className="bg-white px-6 py-3 rounded-md shadow-md hover:shadow-lg transition-all">
                Facebook
              </button>
              <button className="bg-white px-6 py-3 rounded-md shadow-md hover:shadow-lg transition-all">
                Twitter
              </button>
              <button className="bg-white px-6 py-3 rounded-md shadow-md hover:shadow-lg transition-all">
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
