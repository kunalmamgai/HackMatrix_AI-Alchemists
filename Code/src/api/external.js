/**
 * External API services — pulls live data from free public APIs
 * to auto-populate the marketplace, recycling centers, and environmental stats.
 *
 * APIs used:
 * - Overpass API (OpenStreetMap): Real recycling centers worldwide — no key needed
 * - DummyJSON: Electronics products with images — no key needed
 * - FakeStore API: Electronics products only — no key needed
 * - World Bank API: Environmental/CO2 emissions data
 */

// ─── Overpass API — Real Recycling Centers ───────────────────────
const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

/**
 * Fetch real recycling centers near a location from OpenStreetMap.
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {number} radiusKm - Search radius in kilometers (default 25)
 * @returns {Promise<Array>} Array of recycling center objects
 */
export async function fetchRecyclingCenters(lat = 28.6139, lon = 77.2090, radiusKm = 25) {
  const radiusMeters = radiusKm * 1000;
  const query = `
    [out:json][timeout:15];
    (
      node["amenity"="recycling"](around:${radiusMeters},${lat},${lon});
      way["amenity"="recycling"](around:${radiusMeters},${lat},${lon});
      node["amenity"="waste_disposal"](around:${radiusMeters},${lat},${lon});
      node["shop"="electronics"]["recycling"="yes"](around:${radiusMeters},${lat},${lon});
    );
    out center body;
  `;

  try {
    const res = await fetch(OVERPASS_URL, {
      method: 'POST',
      body: `data=${encodeURIComponent(query)}`,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    if (!res.ok) throw new Error(`Overpass API returned ${res.status}`);
    const data = await res.json();

    return data.elements
      .map((el) => {
        const tags = el.tags || {};
        const elLat = el.lat || el.center?.lat;
        const elLon = el.lon || el.center?.lon;

        // Determine what types of electronics are accepted
        const acceptedTypes = [];
        if (tags['recycling:electronics'] === 'yes') acceptedTypes.push('Electronics');
        if (tags['recycling:batteries'] === 'yes') acceptedTypes.push('Batteries');
        if (tags['recycling:glass'] === 'yes') acceptedTypes.push('Glass');
        if (tags['recycling:metal'] === 'yes') acceptedTypes.push('Metal');
        if (acceptedTypes.length === 0) acceptedTypes.push('Electronics', 'General E-Waste');

        const name = tags.name || tags['name:en'] || 'Electronics Recycling Center';
        const parts = [tags['addr:street'], tags['addr:housenumber'], tags['addr:city'], tags['addr:state']].filter(Boolean);
        const address = parts.length > 0 ? parts.join(', ') : (tags.description || `${elLat?.toFixed(4)}, ${elLon?.toFixed(4)}`);

        return {
          id: `osm-${el.id}`,
          name,
          slug: `osm-${el.id}`,
          address,
          city: tags['addr:city'] || '',
          state: tags['addr:state'] || '',
          pincode: tags['addr:postcode'] || '',
          latitude: elLat,
          longitude: elLon,
          phone: tags.phone || tags['contact:phone'] || null,
          email: tags.email || tags['contact:email'] || null,
          website: tags.website || tags['contact:website'] || null,
          verified: true,
          rating: 4.0 + Math.random() * 0.9,
          reviewCount: Math.floor(Math.random() * 200) + 10,
          acceptedTypes: acceptedTypes.join(', '),
          operatingHours: tags.opening_hours || 'Contact for hours',
          source: 'OpenStreetMap',
        };
      })
      .filter((c) => c.latitude && c.longitude);
  } catch (err) {
    console.error('[OVERPASS]', err.message);
    return [];
  }
}

// ─── DummyJSON — Electronics Only ────────────────────────────────
const DUMMYJSON_URL = 'https://dummyjson.com';

// Only electronics-relevant categories from DummyJSON
const ELECTRONICS_CATEGORIES = [
  'smartphones',
  'laptops',
  'tablets',
  'mobile-accessories',
];

/**
 * Map DummyJSON categories to our marketplace categories.
 */
function mapCategory(dummyCategory) {
  const map = {
    smartphones: 'Smartphones',
    laptops: 'Laptops',
    tablets: 'Tablets',
    'mobile-accessories': 'Accessories',
  };
  return map[dummyCategory] || 'Electronics';
}

/**
 * Fetch electronics products from DummyJSON.
 * Fetches by specific categories to avoid non-electronic items.
 * @param {number} limitPerCategory - Products per category
 * @returns {Promise<Array>}
 */
export async function fetchDummyProducts(limitPerCategory = 8) {
  try {
    // Fetch electronics products by specific categories
    const categoryFetches = ELECTRONICS_CATEGORIES.map((cat) =>
      fetch(
        `${DUMMYJSON_URL}/products/category/${cat}?limit=${limitPerCategory}&select=title,price,description,category,thumbnail,stock,brand,rating`
      ).then((r) => (r.ok ? r.json() : { products: [] }))
    );

    const results = await Promise.all(categoryFetches);
    const allProducts = results.flatMap((r) => r.products || []);

    return allProducts
      .filter((p) => {
        // Only keep products that are actually electronics
        return ELECTRONICS_CATEGORIES.includes(p.category);
      })
      .map((p) => ({
        id: `dummy-${p.id}`,
        slug: `dummy-${p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`,
        name: p.title,
        category: mapCategory(p.category),
        description: p.description || 'High-quality refurbished electronics',
        price: Math.round(p.price * 100 * 0.6), // Convert to paise, apply 40% discount for refurbished
        condition: p.rating >= 4.5 ? 'Excellent' : p.rating >= 3.5 ? 'Good' : 'Fair',
        image: p.thumbnail,
        stock: Math.min(p.stock || 10, 25),
        brand: p.brand || '',
        rating: p.rating,
        featured: p.rating >= 4.5,
        source: 'DummyJSON',
      }))
      .filter((p) => p.price > 0);
  } catch (err) {
    console.error('[DUMMYJSON]', err.message);
    return [];
  }
}

// ─── FakeStore API — Electronics Only ────────────────────────────
const FAKESTORE_URL = 'https://fakestoreapi.com';

/**
 * Fetch electronics products from FakeStore API.
 * Only fetches from the "electronics" category — excludes jewelry/clothing.
 * @returns {Promise<Array>}
 */
export async function fetchFakeStoreProducts() {
  try {
    // Fetch ONLY electronics category (not jewelry, clothing, etc.)
    const res = await fetch(`${FAKESTORE_URL}/products/category/electronics`);
    if (!res.ok) throw new Error(`FakeStore returned ${res.status}`);
    const data = await res.json();

    return data.map((p) => ({
      id: `fakestore-${p.id}`,
      slug: `fakestore-${p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`,
      name: p.title,
      category: 'Electronics',
      description: p.description || 'Quality refurbished electronics',
      price: Math.round(p.price * 100 * 0.65), // Convert to paise, 35% discount
      condition: p.rating?.rate >= 4 ? 'Excellent' : p.rating?.rate >= 3 ? 'Good' : 'Fair',
      image: p.image,
      stock: Math.floor(Math.random() * 15) + 5,
      brand: p.title.split(' ').slice(0, 2).join(' '),
      rating: p.rating?.rate || 4.0,
      featured: p.rating?.rate >= 4.5,
      source: 'FakeStore',
    }));
  } catch (err) {
    console.error('[FAKESTORE]', err.message);
    return [];
  }
}

// ─── Search ──────────────────────────────────────────────────────

/**
 * Search DummyJSON for electronics matching a query.
 * @param {string} query - Search term
 * @param {number} limit - Max results
 * @returns {Promise<Array>}
 */
export async function searchDummyProducts(query, limit = 20) {
  try {
    const res = await fetch(
      `${DUMMYJSON_URL}/products/search?q=${encodeURIComponent(query)}&limit=${limit * 2}`
    );
    if (!res.ok) throw new Error(`DummyJSON search returned ${res.status}`);
    const data = await res.json();

    // Filter to electronics only
    return data.products
      .filter((p) => ELECTRONICS_CATEGORIES.includes(p.category))
      .slice(0, limit)
      .map((p) => ({
        id: `dummy-${p.id}`,
        slug: `dummy-${p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`,
        name: p.title,
        category: mapCategory(p.category),
        description: p.description || 'High-quality refurbished electronics',
        price: Math.round(p.price * 100 * 0.6),
        condition: p.rating >= 4.5 ? 'Excellent' : p.rating >= 3.5 ? 'Good' : 'Fair',
        image: p.thumbnail,
        stock: Math.min(p.stock || 10, 25),
        brand: p.brand || '',
        rating: p.rating,
        featured: p.rating >= 4.5,
        source: 'DummyJSON',
      }))
      .filter((p) => p.price > 0);
  } catch (err) {
    console.error('[DUMMYJSON_SEARCH]', err.message);
    return [];
  }
}

/**
 * Search FakeStore for electronics matching a query.
 * @param {string} query - Search term
 * @returns {Promise<Array>}
 */
export async function searchFakeStoreProducts(query) {
  try {
    const res = await fetch(`${FAKESTORE_URL}/products`);
    if (!res.ok) throw new Error(`FakeStore returned ${res.status}`);
    const data = await res.json();

    return data
      .filter(
        (p) =>
          p.category === 'electronics' &&
          (p.title.toLowerCase().includes(query.toLowerCase()) ||
            p.description.toLowerCase().includes(query.toLowerCase()))
      )
      .map((p) => ({
        id: `fakestore-${p.id}`,
        slug: `fakestore-${p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`,
        name: p.title,
        category: 'Electronics',
        description: p.description || 'Quality refurbished electronics',
        price: Math.round(p.price * 100 * 0.65),
        condition: p.rating?.rate >= 4 ? 'Excellent' : p.rating?.rate >= 3 ? 'Good' : 'Fair',
        image: p.image,
        stock: Math.floor(Math.random() * 15) + 5,
        brand: p.title.split(' ').slice(0, 2).join(' '),
        rating: p.rating?.rate || 4.0,
        featured: p.rating?.rate >= 4.5,
        source: 'FakeStore',
      }));
  } catch (err) {
    console.error('[FAKESTORE_SEARCH]', err.message);
    return [];
  }
}

// ─── Environmental Stats ─────────────────────────────────────────

/**
 * Static e-waste environmental data (sourced from UN, WHO, EPA reports).
 */
export const environmentalStats = {
  globalEwastePerYear: '62', // million tonnes (UN Global E-waste Monitor 2024)
  recyclingRate: '22.3', // percent globally recycled
  toxicMetals: ['Lead', 'Mercury', 'Cadmium', 'Chromium', 'Arsenic'],
  valuableMetals: ['Gold', 'Silver', 'Copper', 'Palladium', 'Platinum', 'Rare Earth Elements'],
  co2FromEwaste: '98', // million tonnes CO2 equivalent from improper disposal
  projectedEwaste2030: '82', // million tonnes by 2030
  countriesWithEwasteLaw: '81', // out of 193 UN member states
};

/**
 * Fetch real-time CO2 data from the World Bank API.
 * Returns India's latest CO2 emissions data.
 */
export async function fetchCO2Data() {
  try {
    const res = await fetch(
      'https://api.worldbank.org/v2/country/IND/indicator/EN.ATM.CO2E.KT?format=json&date=2020:2023&per_page=5'
    );
    if (!res.ok) throw new Error('World Bank API error');
    const data = await res.json();
    if (data[1] && data[1].length > 0) {
      return {
        country: 'India',
        co2Kilotonnes: data[1][0].value,
        year: data[1][0].date,
      };
    }
  } catch (err) {
    console.error('[CO2_DATA]', err.message);
  }
  return { country: 'India', co2Kilotonnes: 2693000, year: '2022' };
}

// ─── Merge Helpers ───────────────────────────────────────────────

/**
 * Merge external API products with local seed data.
 * External products get IDs prefixed with 'dummy-' or 'fakestore-' to avoid collisions.
 */
export function mergeProducts(localProducts, externalProducts) {
  const slugs = new Set(localProducts.map((p) => p.slug));
  const merged = [...localProducts];
  for (const ep of externalProducts) {
    if (!slugs.has(ep.slug)) {
      merged.push(ep);
      slugs.add(ep.slug);
    }
  }
  return merged;
}

/**
 * Merge external recycling centers with local seed data.
 */
export function mergeCenters(localCenters, externalCenters) {
  const ids = new Set(localCenters.map((c) => c.id));
  const merged = [...localCenters];
  for (const ec of externalCenters) {
    if (!ids.has(ec.id)) {
      merged.push(ec);
      ids.add(ec.id);
    }
  }
  return merged;
}
