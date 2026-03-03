# TIM'S GLAM

A modern, professional online fashion brand for premium unisex styles for adults and kids.

![TIM'S GLAM Logo](public/logo.png)

## 🌟 Features

### Core Functionality
- ✅ **Full Online Fashion Experience** - Browse, filter, and purchase products
- ✅ **Shopping Cart** - Add/remove products, update quantities, persistent cart storage
- ✅ **Product Catalog** - 15+ products with filtering by category, subcategory, and price
- ✅ **Product Details** - Individual product pages with size/color selection
- ✅ **Responsive Design** - Perfect on mobile, tablet, and desktop
- ✅ **Modern UI/UX** - Clean, professional design with smooth animations

### Pages Included
1. **Home** (`/`) - Hero section, featured products, collections, latest blog posts
2. **Shop** (`/shop`) - Full product catalog with advanced filters and sorting
3. **Product Detail** (`/shop/[id]`) - Individual product pages with related products
4. **About** (`/about`) - Company story, mission, values, team, and sustainability
5. **Blog** (`/blog`) - Fashion articles with categories and search
6. **Blog Post** (`/blog/[id]`) - Individual blog post pages
7. **Contact** (`/contact`) - Contact form with validation and social media links
8. **Checkout** (`/checkout`) - Secure checkout page with order summary

### Design Elements
- 🎨 **Purple (#4a1d75) & Gold (#d4af37)** color scheme matching brand
- 🖼️ **High-quality images** from Unsplash with parallax effects
- ✨ **Smooth animations** and hover effects with glass-morphism
- 📱 **Mobile-first** responsive design - fully optimized
- 🔤 **Beautiful typography** with Playfair Display & Inter fonts
- 💎 **Premium UI/UX** with gradient overlays and micro-interactions

### Recent UI/UX Enhancements (March 2026)
- ✅ **About Page:** Team member photos, comprehensive sustainability section with 6 pillars
- ✅ **Blog Page:** Parallax hero, featured articles, newsletter section, enhanced search/filters
- ✅ **Contact Page:** Advanced form with icon labels, custom dropdown, character counter, company showcase
- ✅ **All Pages:** Full mobile optimization with responsive text, padding, and spacing

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Navigate to project directory**
```bash
cd <your-project-folder>
```

2. **Install dependencies**
```bash
npm install
```

3. **Run development server**
```bash
npm run dev
```

4. **Open browser**
Navigate to: `http://localhost:3000`

### Build for Production
```bash
npm run build
npm start
```

---

## 🛠️ Technology Stack

- **Framework:** Next.js 14 (React)
- **Styling:** Tailwind CSS 3.4
- **Icons:** React Icons (Feather Icons)
- **Animations:** Framer Motion
- **State Management:** React Context API
- **HTTP Client:** Axios
- **Fonts:** Google Fonts (Playfair Display, Inter)

---

## 📁 Project Structure

```
tims-glam/
├── src/
│   ├── app/                    # Next.js 14 app directory
│   │   ├── page.js            # Home page
│   │   ├── layout.js          # Root layout with providers
│   │   ├── globals.css        # Global styles & animations
│   │   ├── about/             # About page
│   │   ├── blog/              # Blog pages
│   │   │   ├── page.js        # Blog listing
│   │   │   └── [id]/          # Individual blog posts
│   │   ├── shop/              # Shop pages
│   │   │   ├── page.js        # Product catalog
│   │   │   └── [id]/          # Product details
│   │   ├── contact/           # Contact page
│   │   └── checkout/          # Checkout page
│   │
│   ├── components/            # React components
│   │   ├── Header.js          # Navigation header
│   │   ├── Footer.js          # Site footer
│   │   ├── Cart.js            # Shopping cart sidebar
│   │   └── ProductCard.js     # Product card component
│   │
│   ├── context/               # React Context
│   │   └── CartContext.js     # Shopping cart state management
│   │
│   └── data/                  # Static data
│       ├── products.js        # Product catalog data
│       └── blog.js            # Blog posts data
│
├── public/                    # Static assets
├── tailwind.config.js         # Tailwind configuration
├── next.config.js             # Next.js configuration
└── package.json               # Dependencies
```

---

## 🎯 Key Features Explained

### Shopping Cart
- Persistent storage using localStorage
- Add/remove products with size and color selection
- Quantity management
- Real-time cart total calculation
- Slide-out cart sidebar

### Product Filtering
- Filter by category (Adults/Kids)
- Filter by subcategory (Tops, Bottoms, Outerwear, etc.)
- Price range slider
- Sort by: Featured, Price (Low-High, High-Low), Name
- Search functionality

### Responsive Design
- Mobile menu for navigation
- Optimized layouts for all screen sizes
- Touch-friendly interactions
- Fast page loads with Next.js optimization

---

## 🎨 Color Palette

- **Primary Purple:** #4a1d75
- **Gold Accent:** #d4af37
- **White:** #ffffff
- **Black:** #000000
- **Gray Scale:** Various shades for text and backgrounds

---

## 📝 Future Enhancements

- [ ] User authentication and accounts
- [ ] Payment gateway integration (Stripe/PayPal)
- [ ] Order tracking
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Advanced search with autocomplete
- [ ] Size guide modal
- [ ] Product zoom on hover
- [ ] Social media integration
- [ ] Email marketing integration

---

## 🤝 Support

For questions or support, please contact:
- **Email:** info@timsglam.com
- **Phone:** +1 (555) 123-4567

---

## 📄 License

This project is created for TIM'S GLAM. All rights reserved.

---

## 🙏 Acknowledgments

- Images from [Unsplash](https://unsplash.com)
- Icons from [Feather Icons](https://feathericons.com) via React Icons
- Fonts from [Google Fonts](https://fonts.google.com)

---

## 📚 Documentation

- **README.md** - This file (project overview and quick start)
- **PROJECT_DEVELOPMENT_LOG.md** - Detailed development history and all changes made
- **QUICKSTART.md** - Detailed setup instructions

---

**Built with ❤️ for TIM'S GLAM**


**Need help?** Check QUICKSTART.md for detailed instructions.
