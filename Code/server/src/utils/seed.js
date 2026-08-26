import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Seed products (marketplace items)
  const products = [
    {
      name: 'Refurbished iPhone 13',
      slug: 'refurbished-iphone-13',
      category: 'Smartphones',
      description: 'Professionally refurbished iPhone 13 in excellent condition. Battery health 90%+. Includes charger and 6-month warranty.',
      price: 3299900, // ₹32,999 in paise
      condition: 'Excellent',
      image: '/images/devices/smartphone.jpg',
      stock: 15,
      featured: true,
    },
    {
      name: 'Refurbished MacBook Air M1',
      slug: 'refurbished-macbook-air-m1',
      category: 'Laptops',
      description: 'Apple MacBook Air M1, 8GB RAM, 256GB SSD. Professionally refurbished with full diagnostic testing.',
      price: 5499900, // ₹54,999
      condition: 'Good',
      image: '/images/devices/laptop.jpg',
      stock: 8,
      featured: true,
    },
    {
      name: 'Samsung Galaxy Tab S7',
      slug: 'samsung-galaxy-tab-s7',
      category: 'Tablets',
      description: 'Samsung Galaxy Tab S7 11" display, 128GB. Excellent condition with S Pen included.',
      price: 2499900,
      condition: 'Excellent',
      image: '/images/devices/tablet.jpg',
      stock: 12,
    },
    {
      name: 'Sony WH-1000XM4 Headphones',
      slug: 'sony-wh1000xm4',
      category: 'Audio',
      description: 'Industry-leading noise cancelling headphones. Refurbished, tested, and certified.',
      price: 1499900,
      condition: 'Good',
      image: '/images/devices/headphones.jpg',
      stock: 20,
    },
    {
      name: 'Dell 27" LED Monitor',
      slug: 'dell-27-led-monitor',
      category: 'Monitors',
      description: 'Dell S2722QC 27" 4K USB-C monitor. Excellent for work from home setup.',
      price: 1899900,
      condition: 'Excellent',
      image: '/images/devices/monitor.jpg',
      stock: 6,
    },
    {
      name: 'iPad Air 4th Gen',
      slug: 'ipad-air-4th-gen',
      category: 'Tablets',
      description: 'Apple iPad Air 4, 64GB Wi-Fi. Good condition with minor cosmetic wear.',
      price: 2999900,
      condition: 'Good',
      image: '/images/devices/tablet.jpg',
      stock: 10,
    },
    {
      name: 'Logitech MX Master 3 Mouse',
      slug: 'logitech-mx-master-3',
      category: 'Accessories',
      description: 'Premium wireless mouse. Refurbished with new scroll wheel.',
      price: 499900,
      condition: 'Good',
      image: '/images/devices/mouse.jpg',
      stock: 25,
    },
    {
      name: 'Canon EOS M50 Mark II',
      slug: 'canon-eos-m50-mark-ii',
      category: 'Cameras',
      description: 'Mirrorless camera with 15-45mm kit lens. Professionally refurbished.',
      price: 3499900,
      condition: 'Good',
      image: '/images/devices/camera.jpg',
      stock: 4,
    },
    {
      name: 'JBL Charge 5 Speaker',
      slug: 'jbl-charge-5',
      category: 'Audio',
      description: 'Portable Bluetooth speaker with IP67 waterproof rating. Refurbished and tested.',
      price: 999900,
      condition: 'Excellent',
      image: '/images/devices/speaker.jpg',
      stock: 18,
    },
    {
      name: 'HP LaserJet Pro Printer',
      slug: 'hp-laserjet-pro',
      category: 'Printers',
      description: 'HP LaserJet Pro M404dn monochrome printer. Refurbished with new toner.',
      price: 1299900,
      condition: 'Good',
      image: '/images/devices/printer.jpg',
      stock: 7,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    });
  }
  console.log(`✅ Seeded ${products.length} products`);

  // Seed recycling centers
  const centers = [
    {
      name: 'GreenTech E-Waste Solutions',
      slug: 'greentech-e-waste',
      address: '42 Industrial Area, Phase 1',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110020',
      latitude: 28.6139,
      longitude: 77.2090,
      phone: '+91-11-23456789',
      email: 'info@greentech-ewaste.in',
      verified: true,
      rating: 4.5,
      reviewCount: 128,
      acceptedTypes: 'Electronics, Hazardous, Batteries',
      operatingHours: 'Mon-Sat: 9AM-6PM',
    },
    {
      name: 'EcoRecycle Hub',
      slug: 'ecorecycle-hub',
      address: '15 MG Road, Koramangala',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560034',
      latitude: 12.9716,
      longitude: 77.5946,
      phone: '+91-80-98765432',
      email: 'hello@ecorecycle.in',
      verified: true,
      rating: 4.8,
      reviewCount: 256,
      acceptedTypes: 'Electronics, Hazardous, Batteries, Cables',
      operatingHours: 'Mon-Sun: 8AM-8PM',
    },
    {
      name: 'Mumbai Green Center',
      slug: 'mumbai-green-center',
      address: '78 Andheri East, MIDC',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400093',
      latitude: 19.0760,
      longitude: 72.8777,
      phone: '+91-22-45678901',
      verified: true,
      rating: 4.2,
      reviewCount: 89,
      acceptedTypes: 'Electronics, Batteries',
      operatingHours: 'Mon-Sat: 10AM-7PM',
    },
    {
      name: 'Chennai Tech Recyclers',
      slug: 'chennai-tech-recyclers',
      address: '23 T. Nagar, Usman Road',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600017',
      latitude: 13.0827,
      longitude: 80.2707,
      phone: '+91-44-23456789',
      verified: true,
      rating: 4.6,
      reviewCount: 167,
      acceptedTypes: 'Electronics, Hazardous, Batteries, Cables, Printers',
      operatingHours: 'Mon-Sat: 9AM-6PM',
    },
    {
      name: 'Kolkata EcoPoint',
      slug: 'kolkata-ecopoint',
      address: '56 Salt Lake Sector V',
      city: 'Kolkata',
      state: 'West Bengal',
      pincode: '700091',
      latitude: 22.5726,
      longitude: 88.3639,
      phone: '+91-33-67890123',
      email: 'support@kolkataecopoint.in',
      verified: false,
      rating: 3.9,
      reviewCount: 42,
      acceptedTypes: 'Electronics, Batteries',
      operatingHours: 'Mon-Fri: 10AM-5PM',
    },
  ];

  for (const center of centers) {
    await prisma.recyclingCenter.upsert({
      where: { slug: center.slug },
      update: center,
      create: center,
    });
  }
  console.log(`✅ Seeded ${centers.length} recycling centers`);

  console.log('🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
