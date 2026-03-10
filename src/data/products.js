export const products = [
  // Adult Collection
  {
    id: 1,
    name: "Premium Cotton T-Shirt",
    category: "adults",
    subcategory: "tops",
    audience: "unisex",
    price: 45.99,
    description: "Ultra-soft premium cotton t-shirt perfect for everyday wear. Unisex design with a modern fit.",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Black", "White", "Navy", "Gray", "Purple"],
    image: "/products/p1.jpg",
    featured: true,
    inStock: true
  },
  {
    id: 2,
    name: "Classic Denim Jacket",
    category: "adults",
    subcategory: "outerwear",
    audience: "men",
    price: 129.99,
    description: "Timeless denim jacket with a contemporary twist. Perfect for layering in any season.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Light Blue", "Dark Blue", "Black"],
    image: "/products/p2.jpg",
    featured: true,
    inStock: true
  },
  {
    id: 3,
    name: "Slim Fit Chino Pants",
    category: "adults",
    subcategory: "bottoms",
    audience: "men",
    price: 79.99,
    description: "Versatile chino pants with a modern slim fit. Comfortable and stylish for any occasion.",
    sizes: ["28", "30", "32", "34", "36", "38", "40"],
    colors: ["Khaki", "Navy", "Black", "Olive"],
    image: "/products/p3.jpg",
    featured: true,
    inStock: true
  },
  {
    id: 4,
    name: "Luxury Hoodie",
    category: "adults",
    subcategory: "tops",
    audience: "unisex",
    price: 89.99,
    description: "Premium quality hoodie with fleece lining. Perfect blend of comfort and style.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "White", "Gray", "Purple", "Navy"],
    image: "/products/p4.jpg",
    featured: true,
    inStock: true
  },
  {
    id: 5,
    name: "Designer Sneakers",
    category: "adults",
    subcategory: "shoes",
    audience: "unisex",
    price: 149.99,
    description: "Contemporary sneakers with premium materials. Perfect for casual or athleisure looks.",
    sizes: ["6", "7", "8", "9", "10", "11", "12"],
    colors: ["White", "Black", "White/Black"],
    image: "/products/p5.jpg",
    featured: true,
    inStock: true
  },
  {
    id: 6,
    name: "Leather Crossbody Bag",
    category: "adults",
    subcategory: "accessories",
    audience: "women",
    price: 119.99,
    description: "Genuine leather crossbody bag with adjustable strap. Stylish and functional.",
    sizes: ["One Size"],
    colors: ["Black", "Brown", "Tan"],
    image: "/products/p6.jpg",
    featured: true,
    inStock: true
  },

  // Kids Collection
  {
    id: 7,
    name: "Kids Cotton T-Shirt Set",
    category: "kids",
    subcategory: "tops",
    audience: "unisex",
    price: 34.99,
    description: "Pack of 2 premium cotton t-shirts for kids. Soft, comfortable, and durable.",
    sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-11Y", "12-13Y"],
    colors: ["Multi-color Pack"],
    image: "/products/p7.jpg",
    featured: true,
    inStock: true
  },
  {
    id: 8,
    name: "Kids Denim Jacket",
    category: "kids",
    subcategory: "outerwear",
    audience: "boys",
    price: 69.99,
    description: "Classic denim jacket sized perfectly for kids. Durable and stylish.",
    sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-11Y", "12-13Y"],
    colors: ["Light Blue", "Dark Blue"],
    image: "/products/p2.jpg",
    featured: false,
    inStock: true
  },
  {
    id: 9,
    name: "Kids Jogger Pants",
    category: "kids",
    subcategory: "bottoms",
    audience: "boys",
    price: 44.99,
    description: "Comfortable jogger pants with elastic waistband. Perfect for active kids.",
    sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-11Y", "12-13Y"],
    colors: ["Black", "Gray", "Navy", "Purple"],
    image: "/products/p8.jpg",
    featured: false,
    inStock: true
  },
  {
    id: 10,
    name: "Kids Hoodie",
    category: "kids",
    subcategory: "tops",
    audience: "girls",
    price: 54.99,
    description: "Cozy hoodie for kids with soft fleece lining. Available in fun colors.",
    sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-11Y", "12-13Y"],
    colors: ["Purple", "Pink", "Blue", "Black", "Gray"],
    image: "/products/p9.jpg",
    featured: true,
    inStock: true
  },
  {
    id: 11,
    name: "Kids Sneakers",
    category: "kids",
    subcategory: "shoes",
    audience: "unisex",
    price: 79.99,
    description: "Comfortable and durable sneakers for active kids. Easy to put on and take off.",
    sizes: ["10C", "11C", "12C", "13C", "1Y", "2Y", "3Y", "4Y", "5Y", "6Y"],
    colors: ["White", "Black", "Pink", "Blue"],
    image: "/products/p5.jpg",
    featured: false,
    inStock: true
  },
  {
    id: 12,
    name: "Kids Backpack",
    category: "kids",
    subcategory: "accessories",
    audience: "girls",
    price: 49.99,
    description: "Durable and stylish backpack perfect for school or adventures.",
    sizes: ["One Size"],
    colors: ["Purple", "Blue", "Pink", "Black"],
    image: "/products/p10.jpg",
    featured: false,
    inStock: true
  },

  // Additional Premium Items
  {
    id: 13,
    name: "Signature Blazer",
    category: "adults",
    subcategory: "outerwear",
    audience: "men",
    price: 199.99,
    description: "Elegant tailored blazer for a sophisticated look. Perfect for formal occasions.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Navy", "Charcoal"],
    image: "/products/p11.jpg",
    featured: false,
    inStock: true
  },
  {
    id: 14,
    name: "Sport Performance Shirt",
    category: "adults",
    subcategory: "activewear",
    audience: "men",
    price: 59.99,
    description: "Moisture-wicking performance shirt for active lifestyles. Breathable and comfortable.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Navy", "Red", "Purple"],
    image: "/products/p12.jpg",
    featured: false,
    inStock: true
  },
  {
    id: 15,
    name: "Kids Sport Set",
    category: "kids",
    subcategory: "activewear",
    audience: "unisex",
    price: 64.99,
    description: "Complete sports outfit including top and shorts. Perfect for active kids.",
    sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-11Y", "12-13Y"],
    colors: ["Purple/White", "Navy/White", "Black/Gold"],
    image: "/products/p13.jpg",
    featured: false,
    inStock: true
  },

  // Women's Collection
  {
    id: 16,
    name: "Elegant Floral Dress",
    category: "adults",
    subcategory: "tops",
    audience: "women",
    price: 109.99,
    description: "Stunning floral print dress with flowing silhouette. Perfect for any special occasion or everyday elegance.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Floral Blue", "Floral Pink", "Floral Purple"],
    image: "/products/p14.jpg",
    featured: true,
    inStock: true
  },
  {
    id: 17,
    name: "Silk Blend Blouse",
    category: "adults",
    subcategory: "tops",
    audience: "women",
    price: 79.99,
    description: "Luxurious silk blend blouse with elegant draping. Sophisticated and versatile for work or evening.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Champagne", "Blush Pink", "Navy", "Black", "White"],
    image: "/products/p15.jpg",
    featured: true,
    inStock: true
  },
  {
    id: 18,
    name: "High-Waist Midi Skirt",
    category: "adults",
    subcategory: "bottoms",
    audience: "women",
    price: 69.99,
    description: "Flattering high-waist midi skirt with elegant pleating. Classic piece that pairs with everything.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "Navy", "Burgundy", "Beige"],
    image: "/products/p16.jpg",
    featured: true,
    inStock: true
  },
  {
    id: 19,
    name: "Cashmere Blend Cardigan",
    category: "adults",
    subcategory: "outerwear",
    audience: "women",
    price: 139.99,
    description: "Soft cashmere blend cardigan with delicate buttons. Ultimate comfort meets timeless style.",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Cream", "Dusty Rose", "Gray", "Camel", "Black"],
    image: "/products/p17.jpg",
    featured: true,
    inStock: true
  }
];

export const categories = [
  {
    id: "adults",
    name: "Adults Collection",
    description: "Premium unisex fashion for adults",
    image: "/products/p15.jpg",
    subcategories: ["tops", "bottoms", "outerwear", "shoes", "accessories", "activewear"]
  },
  {
    id: "kids",
    name: "Kids Collection",
    description: "Stylish and comfortable wear for children",
    image: "/products/p8.jpg",
    subcategories: ["tops", "bottoms", "outerwear", "shoes", "accessories", "activewear"]
  }
];

export const subcategoryNames = {
  tops: "Tops",
  bottoms: "Bottoms",
  outerwear: "Outerwear",
  shoes: "Shoes",
  accessories: "Caps & Accessories",
  activewear: "Activewear"
};
