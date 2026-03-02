'use client'

import Link from 'next/link'
import Image from 'next/image'
import { FiTruck, FiShield, FiRefreshCw, FiAward, FiArrowRight } from 'react-icons/fi'
import { products } from '@/data/products'
import { blogPosts } from '@/data/blog'
import ProductCard from '@/components/ProductCard'
import ImageSlider from '@/components/ImageSlider'
import FeaturedProductSlider from '@/components/FeaturedProductSlider'
import TestimonialsSlider from '@/components/TestimonialsSlider'

export default function Home() {
  const featuredProducts = products.filter(p => p.featured).slice(0, 12)
  const latestBlogs = blogPosts.slice(0, 3)

  return (
    <div>
      {/* Hero Section with Image Slider */}
      <section className="relative">
        <ImageSlider />
        
        {/* Hero Content Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-start pt-16 md:pt-24 lg:pt-32 px-4 md:px-8">
          <div className="container-custom relative z-10 text-center text-white w-full">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-playfair font-bold mb-4 md:mb-6 animate-fade-in leading-tight">
              Your Style. Your Signature.
              <br />
              <span className="text-gold-400">Your Glam.</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-12 md:mb-16 max-w-2xl mx-auto leading-relaxed">
              Discover premium unisex fashion for adults and kids. Elevate your wardrobe with TIM&apos;S GLAM.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
              <Link href="/shop" className="btn-primary">
                Shop Now
              </Link>
              <Link href="/about" className="btn-outline bg-white bg-opacity-10 backdrop-blur-sm border-white text-white hover:bg-white hover:text-primary-500">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-primary-600">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center transform hover:scale-105 transition-transform">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gold-500 text-white rounded-full mb-4 shadow-lg">
                <FiTruck size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Free Shipping</h3>
              <p className="text-gray-200">On orders over $100</p>
            </div>
            <div className="text-center transform hover:scale-105 transition-transform">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gold-500 text-white rounded-full mb-4 shadow-lg">
                <FiShield size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Secure Payment</h3>
              <p className="text-gray-200">100% secure transactions</p>
            </div>
            <div className="text-center transform hover:scale-105 transition-transform">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gold-500 text-white rounded-full mb-4 shadow-lg">
                <FiRefreshCw size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Easy Returns</h3>
              <p className="text-gray-200">30-day return policy</p>
            </div>
            <div className="text-center transform hover:scale-105 transition-transform">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gold-500 text-white rounded-full mb-4 shadow-lg">
                <FiAward size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Premium Quality</h3>
              <p className="text-gray-200">Handpicked materials</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="section-padding bg-gradient-to-br from-gray-50 via-white to-purple-50 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-200 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-200 rounded-full opacity-10 blur-3xl"></div>
        
        <div className="container-custom relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <p className="text-gold-500 font-semibold mb-3 tracking-widest uppercase text-sm">About TIM&apos;S GLAM</p>
            <h2 className="heading-md mb-4">Redefining Fashion Excellence</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary-600 to-gold-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-16">
            {/* Content */}
            <div className="space-y-6 order-2 lg:order-1">
              <div className="space-y-4">
                <p className="text-lg text-gray-700 leading-relaxed">
                  At <span className="font-bold text-primary-600">TIM&apos;S GLAM</span>, we don&apos;t just sell fashion—we craft experiences. Our mission is to bring you premium unisex collections that speak to your unique style, whether you&apos;re dressing yourself or your little ones.
                </p>
                
                <p className="text-lg text-gray-700 leading-relaxed">
                  Every piece in our collection is carefully selected to meet the highest standards of quality, comfort, and contemporary design. We believe everyone deserves to look and feel exceptional, every single day.
                </p>
              </div>

              {/* Core Values */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <FiAward className="text-primary-600" size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Premium Quality</h4>
                    <p className="text-sm text-gray-600">Handpicked materials for lasting elegance</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex-shrink-0 w-10 h-10 bg-gold-100 rounded-lg flex items-center justify-center">
                    <FiShield className="text-gold-600" size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Trusted Brand</h4>
                    <p className="text-sm text-gray-600">Loved by thousands of families</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <FiTruck className="text-primary-600" size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Fast Delivery</h4>
                    <p className="text-sm text-gray-600">Quick shipping to your doorstep</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex-shrink-0 w-10 h-10 bg-gold-100 rounded-lg flex items-center justify-center">
                    <FiRefreshCw className="text-gold-600" size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Easy Returns</h4>
                    <p className="text-sm text-gray-600">30-day hassle-free returns</p>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Link href="/about" className="btn-primary group">
                  <span>Discover Our Story</span>
                  <FiArrowRight className="inline-block ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                </Link>
                <Link href="/shop" className="btn-outline group">
                  <span>Browse Collection</span>
                  <FiArrowRight className="inline-block ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                </Link>
              </div>
            </div>

            {/* Images Grid */}
            <div className="order-1 lg:order-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="relative h-64 rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600"
                    alt="Fashion Store"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="relative h-64 rounded-2xl overflow-hidden shadow-lg mt-8">
                  <Image
                    src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=600"
                    alt="Fashion Collection"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="relative h-64 rounded-2xl overflow-hidden shadow-lg -mt-8">
                  <Image
                    src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600"
                    alt="Premium Fashion"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="relative h-64 rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600"
                    alt="Style Collection"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Bar */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 md:p-12 shadow-xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="space-y-2">
                <h3 className="text-4xl md:text-5xl font-bold text-white">10K+</h3>
                <p className="text-primary-100 font-medium">Happy Customers</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-4xl md:text-5xl font-bold text-white">500+</h3>
                <p className="text-primary-100 font-medium">Premium Products</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-4xl md:text-5xl font-bold text-white">98%</h3>
                <p className="text-primary-100 font-medium">Satisfaction Rate</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-4xl md:text-5xl font-bold text-white">24/7</h3>
                <p className="text-primary-100 font-medium">Customer Support</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Slider */}
      <section className="section-padding bg-gradient-to-b from-white via-purple-50 to-white relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-gold-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-200 rounded-full opacity-20 blur-3xl"></div>
        
        <div className="container-custom relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <p className="text-gold-500 font-semibold mb-3 tracking-widest uppercase text-sm">Our Selection</p>
            <h2 className="heading-md mb-4">Featured Collection</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary-600 to-gold-500 mx-auto rounded-full mb-4"></div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our handpicked selection of premium pieces that define contemporary elegance
            </p>
          </div>
          
          {/* Product Slider */}
          <div className="mb-12">
            <FeaturedProductSlider products={featuredProducts} />
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <Link href="/shop" className="btn-primary inline-flex items-center gap-2 group shadow-lg hover:shadow-xl transition-shadow">
              <span>Explore Full Collection</span>
              <FiArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section-padding bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        <div className="absolute -top-10 -left-10 w-64 h-64 bg-primary-100 rounded-full opacity-40 blur-3xl"></div>
        <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-gold-100 rounded-full opacity-40 blur-3xl"></div>

        <div className="container-custom relative z-10">
          <div className="text-center mb-14">
            <p className="text-gold-500 font-semibold mb-3 tracking-widest uppercase text-sm">Curated Categories</p>
            <h2 className="heading-md mb-4">Shop by Collection</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary-600 to-gold-500 mx-auto rounded-full mb-4"></div>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Explore premium collections tailored for adults and kids, designed with comfort and style in mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Adults Collection */}
            <Link href="/shop?category=adults" className="group focus:outline-none">
              <article className="relative h-[420px] rounded-2xl overflow-hidden border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500">
                <Image
                  src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900"
                  alt="Adults Collection"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent"></div>

                <div className="absolute top-6 left-6 bg-white/90 text-primary-700 text-xs font-semibold tracking-wide uppercase px-3 py-1.5 rounded-full backdrop-blur-sm">
                  Adults Collection
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
                  <h3 className="text-2xl md:text-3xl font-playfair font-bold mb-2">Refined Everyday Wear</h3>
                  <p className="text-sm md:text-base text-gray-200 mb-5 max-w-md">
                    Discover premium unisex fashion with timeless silhouettes and modern details.
                  </p>
                  <span className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/30 text-white font-semibold px-5 py-2.5 rounded-full transition-all duration-300">
                    Shop Adults
                    <FiArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </article>
            </Link>

            {/* Kids Collection */}
            <Link href="/shop?category=kids" className="group focus:outline-none">
              <article className="relative h-[420px] rounded-2xl overflow-hidden border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500">
                <Image
                  src="https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=900"
                  alt="Kids Collection"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent"></div>

                <div className="absolute top-6 left-6 bg-white/90 text-primary-700 text-xs font-semibold tracking-wide uppercase px-3 py-1.5 rounded-full backdrop-blur-sm">
                  Kids Collection
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
                  <h3 className="text-2xl md:text-3xl font-playfair font-bold mb-2">Comfort for Every Adventure</h3>
                  <p className="text-sm md:text-base text-gray-200 mb-5 max-w-md">
                    Stylish and durable pieces created to keep kids comfortable and confident all day.
                  </p>
                  <span className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/30 text-white font-semibold px-5 py-2.5 rounded-full transition-all duration-300">
                    Shop Kids
                    <FiArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </article>
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Blog Posts */}
      <section className="section-padding bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-200 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-200 rounded-full opacity-10 blur-3xl"></div>

        <div className="container-custom relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <p className="text-gold-500 font-semibold mb-3 tracking-widest uppercase text-sm">From The Blog</p>
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-gray-900 mb-4">Latest Trends & Inspiration</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary-600 to-gold-500 mx-auto rounded-full mb-6"></div>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Fashion tips, style guides, and inspiration to elevate your wardrobe
            </p>
          </div>

          {/* Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12">
            {latestBlogs.map((post, index) => (
              <Link key={post.id} href={`/blog/${post.id}`} className="group focus:outline-none">
                <article className="h-full bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 flex flex-col">
                  {/* Image Container */}
                  <div className="relative h-64 md:h-72 overflow-hidden bg-gray-100">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-gold-500 to-gold-600 text-white px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg">
                      {post.category}
                    </div>

                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* Content Container */}
                  <div className="flex flex-col flex-grow p-6 md:p-8">
                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4 pb-4 border-b border-gray-100">
                      <span className="font-medium">{post.author}</span>
                      <span className="text-gray-300">•</span>
                      <span>{post.date}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl md:text-2xl font-playfair font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors">
                      {post.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-5 line-clamp-2 flex-grow">
                      {post.excerpt}
                    </p>

                    {/* CTA Button */}
                    <div className="inline-flex items-center gap-2 text-primary-600 font-semibold group/cta">
                      <span className="group-hover/cta:text-gold-500 transition-colors">Read Article</span>
                      <FiArrowRight size={18} className="group-hover/cta:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center pt-4">
            <Link href="/blog" className="btn-primary inline-flex items-center gap-2 group shadow-lg hover:shadow-xl transition-shadow">
              <span>Explore All Articles</span>
              <FiArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-padding bg-gradient-to-b from-gray-50 via-white to-gray-50 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-10 right-0 w-96 h-96 bg-gold-200 rounded-full opacity-5 blur-3xl"></div>
        <div className="absolute bottom-10 left-0 w-96 h-96 bg-primary-200 rounded-full opacity-5 blur-3xl"></div>

        <div className="container-custom relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <p className="text-gold-500 font-semibold mb-3 tracking-widest uppercase text-sm">Customer Love</p>
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-gray-900 mb-4">What Our Customers Say</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary-600 to-gold-500 mx-auto rounded-full mb-6"></div>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of happy customers who have transformed their style with TIM&apos;S GLAM
            </p>
          </div>

          {/* Testimonials Slider */}
          <TestimonialsSlider />
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white relative overflow-hidden">
        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-center">
            {/* Left Images - Staggered Layout */}
            <div className="hidden lg:flex flex-col gap-4 justify-center">
              {/* Image 1 */}
              <div className="relative h-32 rounded-2xl overflow-hidden shadow-xl group">
                <Image
                  src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400"
                  alt="Fashion Collection 1"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent group-hover:from-black/60 transition-all duration-300"></div>
                <div className="absolute bottom-3 left-3 text-white font-semibold text-xs">Premium Quality</div>
              </div>

              {/* Image 2 */}
              <div className="relative h-28 rounded-2xl overflow-hidden shadow-xl group">
                <Image
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400"
                  alt="Fashion Collection 2"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent group-hover:from-black/60 transition-all duration-300"></div>
              </div>

              {/* Image 3 */}
              <div className="relative h-32 rounded-2xl overflow-hidden shadow-xl group">
                <Image
                  src="https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400"
                  alt="Fashion Collection 3"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent group-hover:from-black/60 transition-all duration-300"></div>
              </div>
            </div>

            {/* Center Content */}
            <div className="space-y-5 flex flex-col justify-center">
              {/* Label Badge */}
              <div className="inline-block self-start lg:self-center">
                <div className="px-4 py-2 bg-gradient-to-r from-gold-400/20 to-gold-500/20 backdrop-blur-md border border-gold-300/40 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                  <p className="text-xs font-bold tracking-widest uppercase text-gold-200">✨ Join Our Community</p>
                </div>
              </div>

              {/* Headline */}
              <div className="space-y-2">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-playfair font-bold leading-tight">
                  <span className="block text-white">Welcome to</span>
                  <span className="block bg-gradient-to-r from-gold-300 to-gold-100 bg-clip-text text-transparent">TIM&apos;S GLAM</span>
                </h2>
                <div className="h-1 w-16 bg-gradient-to-r from-gold-400 to-gold-300 rounded-full"></div>
              </div>

              {/* Description */}
              <p className="text-sm lg:text-base text-white/85 leading-relaxed">
                Discover your signature style with our premium, unisex fashion collections designed for everyone—adults and kids alike.
                <span className="block text-gold-300 font-semibold text-sm mt-2">
                  ✓ Free shipping on orders over $100!
                </span>
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                {/* Primary Button */}
                <Link href="/shop" className="group relative px-6 py-3.5 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-300 hover:to-gold-400 text-primary-900 font-bold rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 inline-flex items-center justify-center gap-3 text-base">
                  <span>Start Shopping</span>
                  <FiArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
                </Link>

                {/* Secondary Button */}
                <Link href="/contact" className="group relative px-6 py-3.5 bg-white/10 hover:bg-white/20 border-2 border-white/60 hover:border-white text-white font-bold rounded-xl transition-all duration-300 backdrop-blur-md shadow-lg hover:shadow-xl transform hover:scale-105 inline-flex items-center justify-center gap-3 text-base">
                  <span>Contact Us</span>
                  <FiArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 space-y-2">
                <p className="text-xs uppercase tracking-widest text-white/60 font-semibold">Why choose us?</p>
                <div className="grid grid-cols-3 gap-2">
                  <div className="px-3 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg hover:bg-white/10 transition-all duration-300 group">
                    <FiShield size={18} className="text-gold-300 mb-1.5 group-hover:scale-110 transition-transform" />
                    <p className="text-xs font-semibold text-white/80">Secure</p>
                  </div>
                  <div className="px-3 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg hover:bg-white/10 transition-all duration-300 group">
                    <FiTruck size={18} className="text-gold-300 mb-1.5 group-hover:scale-110 transition-transform" />
                    <p className="text-xs font-semibold text-white/80">Fast</p>
                  </div>
                  <div className="px-3 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg hover:bg-white/10 transition-all duration-300 group">
                    <FiRefreshCw size={18} className="text-gold-300 mb-1.5 group-hover:scale-110 transition-transform" />
                    <p className="text-xs font-semibold text-white/80">Easy</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Images - Staggered Layout */}
            <div className="hidden lg:flex flex-col gap-4 justify-center">
              {/* Image 1 */}
              <div className="relative h-32 rounded-2xl overflow-hidden shadow-xl group">
                <Image
                  src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=400"
                  alt="Fashion Collection 4"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent group-hover:from-black/60 transition-all duration-300"></div>
              </div>

              {/* Image 2 */}
              <div className="relative h-28 rounded-2xl overflow-hidden shadow-xl group">
                <Image
                  src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400"
                  alt="Fashion Collection 5"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent group-hover:from-black/60 transition-all duration-300"></div>
              </div>

              {/* Image 3 */}
              <div className="relative h-32 rounded-2xl overflow-hidden shadow-xl group">
                <Image
                  src="https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=400"
                  alt="Fashion Collection 6"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent group-hover:from-black/60 transition-all duration-300"></div>
                <div className="absolute bottom-3 right-3 text-white font-semibold text-xs">Stylish Designs</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
