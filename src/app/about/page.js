import Image from 'next/image'
import Link from 'next/link'
import { FiAward, FiUsers, FiHeart, FiTrendingUp, FiShield, FiStar, FiPackage, FiGlobe, FiCheck } from 'react-icons/fi'

export default function About() {
  const values = [
    {
      icon: FiHeart,
      title: 'Passion for Fashion',
      description: 'We live and breathe fashion, bringing you the latest trends with timeless elegance.'
    },
    {
      icon: FiUsers,
      title: 'Inclusivity',
      description: 'Fashion for everyone. Our unisex designs celebrate diversity and individual expression.'
    },
    {
      icon: FiAward,
      title: 'Premium Quality',
      description: 'Handpicked materials and exceptional craftsmanship in every piece we offer.'
    },
    {
      icon: FiShield,
      title: 'Trust & Transparency',
      description: 'Honest pricing, clear policies, and a commitment to your satisfaction.'
    }
  ]

  const stats = [
    { number: '10K+', label: 'Happy Customers' },
    { number: '500+', label: 'Products' },
    { number: '50+', label: 'Countries Served' },
    { number: '4.9', label: 'Average Rating' }
  ]

  const team = [
    {
      name: 'Tim Johnson',
      role: 'Founder & Creative Director',
      description: 'With over 15 years in fashion, Tim brings vision and expertise to every collection.',
      focus: 'Brand Vision & Creative Leadership',
      image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=900&q=80'
    },
    {
      name: 'Sarah Chen',
      role: 'Head of Design',
      description: 'Sarah\'s innovative designs blend contemporary style with timeless elegance.',
      focus: 'Collection Design & Trend Direction',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80'
    },
    {
      name: 'Marcus Williams',
      role: 'Operations Director',
      description: 'Marcus ensures seamless operations and exceptional customer service.',
      focus: 'Operations & Customer Experience',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=80'
    }
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden text-white py-20">
        <div className="about-parallax-hero absolute inset-0"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/85 via-primary-800/75 to-primary-700/85"></div>
        <div className="container-custom relative z-10 text-center">
          <h1 className="heading-xl text-white mb-4">About TIM&apos;S GLAM</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Redefining fashion with style, quality, and inclusivity. Where your unique personality meets glamorous design.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-50 text-primary-700 text-sm font-semibold tracking-wide">
                Since 2020 • Built for Everyone
              </div>
              <div>
                <h2 className="heading-md mb-4">Our Story</h2>
                <div className="h-1 w-20 bg-gradient-to-r from-primary-600 to-gold-500 rounded-full"></div>
              </div>
              <div className="space-y-4 text-gray-700 text-base md:text-lg leading-relaxed">
                <p>
                  Founded in 2020, TIM&apos;S GLAM emerged from a simple yet powerful belief: fashion should be 
                  accessible, inclusive, and expressive for everyone. What started as a small boutique in 
                  the heart of New York has grown into a beloved brand serving families worldwide.
                </p>
                <p>
                  We specialize in premium unisex clothing for both adults and children, breaking traditional 
                  fashion barriers and celebrating individual style. Every piece in our collection is carefully 
                  curated to ensure it meets our high standards of quality, comfort, and design.
                </p>
                <p>
                  Our mission is to empower individuals to express their unique style with confidence. Whether 
                  you&apos;re dressing for a special occasion or everyday comfort, TIM&apos;S GLAM has something 
                  special for you and your family.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-br from-primary-200 to-gold-200 rounded-2xl opacity-60 blur-sm"></div>
              <div className="relative bg-white p-7 md:p-8 rounded-2xl shadow-xl border border-gray-100">
                <h3 className="text-2xl font-playfair font-bold text-primary-600 mb-3">Our Mission</h3>
                <p className="text-gray-700 text-base md:text-lg mb-6 leading-relaxed">
                  To provide high-quality, stylish, and inclusive fashion that empowers individuals 
                  to express their authentic selves while making sustainable and ethical choices.
                </p>

                <div className="grid grid-cols-3 gap-3 mb-6">
                  {stats.slice(0, 3).map((stat, index) => (
                    <div key={index} className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-center">
                      <p className="text-lg font-bold text-primary-600">{stat.number}</p>
                      <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 text-gold-500">
                  <FiStar size={20} />
                  <FiStar size={20} />
                  <FiStar size={20} />
                  <FiStar size={20} />
                  <FiStar size={20} />
                  <span className="text-sm text-gray-600 ml-2">Trusted by families worldwide</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding relative overflow-hidden text-white">
        <div className="impact-parallax-hero absolute inset-0"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/85 via-primary-800/75 to-primary-700/85"></div>
        <div className="container-custom relative z-10">
          <h2 className="text-3xl md:text-4xl font-playfair font-bold text-center mb-12">Our Impact</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-5 md:p-6">
                <div className="text-4xl md:text-5xl font-bold text-gold-300 mb-2">{stat.number}</div>
                <div className="text-sm md:text-base text-white/90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding relative overflow-hidden">
        <div className="values-parallax-hero absolute inset-0"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/88 via-primary-800/78 to-primary-700/88"></div>

        <div className="container-custom relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold text-white mb-4">Our Values</h2>
            <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              The principles that guide everything we do at TIM&apos;S GLAM
            </p>
            <div className="h-1 w-24 bg-gradient-to-r from-gold-300 to-gold-500 rounded-full mx-auto mt-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-2xl hover:bg-white/15 hover:border-gold-300/60 transition-all duration-300 group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gold-500 text-white rounded-full mb-5 shadow-lg group-hover:scale-105 transition-transform">
                  <value.icon size={28} />
                </div>
                <h3 className="text-2xl font-playfair font-bold text-white mb-3 leading-tight">{value.title}</h3>
                <p className="text-white/85 text-lg leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-primary-50 text-primary-700 text-sm font-semibold tracking-wide mb-5">
              Leadership Team
            </span>
            <h2 className="heading-md mb-4">Meet Our Team</h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              The passionate people behind TIM&apos;S GLAM
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300">
                <div className="relative h-72 overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-900/55 via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="inline-flex bg-white/90 text-primary-700 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                      {member.role}
                    </p>
                  </div>
                </div>
                <div className="p-6 md:p-7">
                  <h3 className="text-2xl font-playfair font-bold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-sm font-semibold text-gold-600 mb-4">{member.focus}</p>
                  <p className="text-gray-600 leading-relaxed">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sustainability Section */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=2000&q=80"
            alt="Sustainability"
            fill
            className="object-cover"
            style={{ backgroundAttachment: 'fixed' }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900/90 via-primary-800/85 to-primary-700/90"></div>
        </div>

        <div className="container-custom relative z-10">
          {/* Header */}
          <div className="text-center mb-10 md:mb-16">
            <span className="inline-flex items-center px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-gold-500/20 backdrop-blur-sm border border-gold-300/30 text-gold-300 text-xs md:text-sm font-semibold tracking-wide mb-4 md:mb-5">
              Our Commitment
            </span>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-playfair font-bold text-white mb-3 md:mb-5 px-4">Committed to Sustainability</h2>
            <p className="text-base md:text-lg lg:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed px-4">
              Fashion that doesn&apos;t cost the earth. We&apos;re committed to sustainable practices across every aspect of our business.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-10 md:mb-16">
            <div className="text-center bg-white/10 backdrop-blur-md border border-white/20 rounded-xl md:rounded-2xl p-4 md:p-6">
              <p className="text-2xl md:text-4xl font-bold text-gold-300 mb-1 md:mb-2">85%</p>
              <p className="text-xs md:text-base text-white/90 leading-tight">Sustainable Materials</p>
            </div>
            <div className="text-center bg-white/10 backdrop-blur-md border border-white/20 rounded-xl md:rounded-2xl p-4 md:p-6">
              <p className="text-2xl md:text-4xl font-bold text-gold-300 mb-1 md:mb-2">100%</p>
              <p className="text-xs md:text-base text-white/90 leading-tight">Carbon Neutral</p>
            </div>
            <div className="text-center bg-white/10 backdrop-blur-md border border-white/20 rounded-xl md:rounded-2xl p-4 md:p-6">
              <p className="text-2xl md:text-4xl font-bold text-gold-300 mb-1 md:mb-2">50+</p>
              <p className="text-xs md:text-base text-white/90 leading-tight">Eco Partners</p>
            </div>
            <div className="text-center bg-white/10 backdrop-blur-md border border-white/20 rounded-xl md:rounded-2xl p-4 md:p-6">
              <p className="text-2xl md:text-4xl font-bold text-gold-300 mb-1 md:mb-2">Zero</p>
              <p className="text-xs md:text-base text-white/90 leading-tight">Waste Goal 2027</p>
            </div>
          </div>

          {/* Sustainability Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
            {/* Eco-Friendly Materials */}
            <div className="group bg-white/10 backdrop-blur-md border border-white/20 rounded-xl md:rounded-2xl p-5 md:p-8 hover:bg-white/15 hover:border-gold-300/40 transition-all duration-300">
              <div className="inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full mb-4 md:mb-5 shadow-lg group-hover:scale-110 transition-transform">
                <FiHeart size={20} className="text-white md:hidden" />
                <FiHeart size={24} className="text-white hidden md:block" />
              </div>
              <h3 className="text-lg md:text-2xl font-playfair font-bold text-white mb-2 md:mb-3">Eco-Friendly Materials</h3>
              <p className="text-sm md:text-base text-white/80 leading-relaxed mb-3 md:mb-4">
                We prioritize organic cotton, recycled polyester, and other sustainable fabrics that minimize environmental impact.
              </p>
              <ul className="space-y-2 text-white/70 text-xs md:text-sm">
                <li className="flex items-start gap-2">
                  <FiCheck size={16} className="text-gold-300 mt-0.5 flex-shrink-0" />
                  <span>85% sustainable materials by 2026</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheck size={16} className="text-gold-300 mt-0.5 flex-shrink-0" />
                  <span>Certified organic cotton sourcing</span>
                </li>
              </ul>
            </div>

            {/* Ethical Production */}
            <div className="group bg-white/10 backdrop-blur-md border border-white/20 rounded-xl md:rounded-2xl p-5 md:p-8 hover:bg-white/15 hover:border-gold-300/40 transition-all duration-300">
              <div className="inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full mb-4 md:mb-5 shadow-lg group-hover:scale-110 transition-transform">
                <FiUsers size={20} className="text-white md:hidden" />
                <FiUsers size={24} className="text-white hidden md:block" />
              </div>
              <h3 className="text-lg md:text-2xl font-playfair font-bold text-white mb-2 md:mb-3">Ethical Production</h3>
              <p className="text-sm md:text-base text-white/80 leading-relaxed mb-3 md:mb-4">
                Fair wages, safe working conditions, and transparency throughout our supply chain are non-negotiable.
              </p>
              <ul className="space-y-2 text-white/70 text-xs md:text-sm">
                <li className="flex items-start gap-2">
                  <FiCheck size={16} className="text-gold-300 mt-0.5 flex-shrink-0" />
                  <span>Fair Trade certified facilities</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheck size={16} className="text-gold-300 mt-0.5 flex-shrink-0" />
                  <span>Regular audits & worker wellness programs</span>
                </li>
              </ul>
            </div>

            {/* Carbon Neutral Shipping */}
            <div className="group bg-white/10 backdrop-blur-md border border-white/20 rounded-xl md:rounded-2xl p-5 md:p-8 hover:bg-white/15 hover:border-gold-300/40 transition-all duration-300">
              <div className="inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full mb-4 md:mb-5 shadow-lg group-hover:scale-110 transition-transform">
                <FiPackage size={20} className="text-white md:hidden" />
                <FiPackage size={24} className="text-white hidden md:block" />
              </div>
              <h3 className="text-lg md:text-2xl font-playfair font-bold text-white mb-2 md:mb-3">Carbon Neutral Shipping</h3>
              <p className="text-sm md:text-base text-white/80 leading-relaxed mb-3 md:mb-4">
                Every delivery is carbon-offset through verified environmental projects worldwide.
              </p>
              <ul className="space-y-2 text-white/70 text-xs md:text-sm">
                <li className="flex items-start gap-2">
                  <FiCheck size={16} className="text-gold-300 mt-0.5 flex-shrink-0" />
                  <span>100% carbon-neutral deliveries</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheck size={16} className="text-gold-300 mt-0.5 flex-shrink-0" />
                  <span>Plastic-free packaging initiatives</span>
                </li>
              </ul>
            </div>

            {/* Circular Fashion */}
            <div className="group bg-white/10 backdrop-blur-md border border-white/20 rounded-xl md:rounded-2xl p-5 md:p-8 hover:bg-white/15 hover:border-gold-300/40 transition-all duration-300">
              <div className="inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full mb-4 md:mb-5 shadow-lg group-hover:scale-110 transition-transform">
                <FiTrendingUp size={20} className="text-white md:hidden" />
                <FiTrendingUp size={24} className="text-white hidden md:block" />
              </div>
              <h3 className="text-lg md:text-2xl font-playfair font-bold text-white mb-2 md:mb-3">Circular Fashion</h3>
              <p className="text-sm md:text-base text-white/80 leading-relaxed mb-3 md:mb-4">
                Take-back programs and recycling initiatives ensure products have a second life beyond your wardrobe.
              </p>
              <ul className="space-y-2 text-white/70 text-xs md:text-sm">
                <li className="flex items-start gap-2">
                  <FiCheck size={16} className="text-gold-300 mt-0.5 flex-shrink-0" />
                  <span>Garment recycling program</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheck size={16} className="text-gold-300 mt-0.5 flex-shrink-0" />
                  <span>Repair & care guides for longevity</span>
                </li>
              </ul>
            </div>

            {/* Water Conservation */}
            <div className="group bg-white/10 backdrop-blur-md border border-white/20 rounded-xl md:rounded-2xl p-5 md:p-8 hover:bg-white/15 hover:border-gold-300/40 transition-all duration-300">
              <div className="inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full mb-4 md:mb-5 shadow-lg group-hover:scale-110 transition-transform">
                <FiShield size={20} className="text-white md:hidden" />
                <FiShield size={24} className="text-white hidden md:block" />
              </div>
              <h3 className="text-lg md:text-2xl font-playfair font-bold text-white mb-2 md:mb-3">Water Conservation</h3>
              <p className="text-sm md:text-base text-white/80 leading-relaxed mb-3 md:mb-4">
                Advanced dyeing techniques and water-saving processes reduce our water footprint significantly.
              </p>
              <ul className="space-y-2 text-white/70 text-xs md:text-sm">
                <li className="flex items-start gap-2">
                  <FiCheck size={16} className="text-gold-300 mt-0.5 flex-shrink-0" />
                  <span>60% less water in production</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheck size={16} className="text-gold-300 mt-0.5 flex-shrink-0" />
                  <span>Waterless dyeing technology</span>
                </li>
              </ul>
            </div>

            {/* Global Impact */}
            <div className="group bg-white/10 backdrop-blur-md border border-white/20 rounded-xl md:rounded-2xl p-5 md:p-8 hover:bg-white/15 hover:border-gold-300/40 transition-all duration-300">
              <div className="inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full mb-4 md:mb-5 shadow-lg group-hover:scale-110 transition-transform">
                <FiGlobe size={20} className="text-white md:hidden" />
                <FiGlobe size={24} className="text-white hidden md:block" />
              </div>
              <h3 className="text-lg md:text-2xl font-playfair font-bold text-white mb-2 md:mb-3">Global Impact</h3>
              <p className="text-sm md:text-base text-white/80 leading-relaxed mb-3 md:mb-4">
                Partnering with environmental organizations to support reforestation and ocean cleanup initiatives.
              </p>
              <ul className="space-y-2 text-white/70 text-xs md:text-sm">
                <li className="flex items-start gap-2">
                  <FiCheck size={16} className="text-gold-300 mt-0.5 flex-shrink-0" />
                  <span>1% for the Planet member</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheck size={16} className="text-gold-300 mt-0.5 flex-shrink-0" />
                  <span>Tree planting with every purchase</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-8 md:mt-12 text-center px-4">
            <p className="text-white/80 text-sm md:text-lg mb-4 md:mb-6">Together, we can make fashion sustainable</p>
            <Link href="/shop" className="inline-flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-600 text-white font-semibold px-6 py-3 md:px-8 md:py-4 rounded-lg transition-all shadow-lg hover:shadow-xl text-sm md:text-base w-full sm:w-auto">
              Shop Sustainable Fashion
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-padding bg-gradient-to-r from-primary-500 to-primary-700 text-white text-center">
        <div className="container-custom max-w-3xl mx-auto">
          <h2 className="text-4xl font-playfair font-bold mb-6">Join the TIM&apos;S GLAM Family</h2>
          <p className="text-xl mb-8">
            Experience fashion that celebrates you. Shop our collection and discover your signature style.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop" className="btn-primary">
              Shop Now
            </Link>
            <Link href="/contact" className="bg-white bg-opacity-10 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-primary-500 font-semibold py-3 px-8 rounded-md transition-all">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
