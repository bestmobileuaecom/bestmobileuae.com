/**
 * Demo data for testing the new Product Detail UX
 * Following the 8-section flow with realistic UAE-focused content
 */
export const demoPhone = [
  {
    id: "demo-1",
    slug: "samsung-galaxy-a35-5g",
    name: "Samsung Galaxy A35 5G",
    brand: "Samsung",
    image: "/mobile1.jpg",
    priceRange: "AED 1,199",

    // Storage options available
    storageOptions: ["128GB", "256GB"],

    // Available colors with hex for dots
    colorOptions: [
      { name: "Awesome Navy", hex: "#1a365d" },
      { name: "Awesome Lilac", hex: "#c4b5fd" },
      { name: "Awesome Iceblue", hex: "#bae6fd" },
      { name: "Awesome Graphite", hex: "#374151" },
    ],

    // Overall Score - Authority + Summary (RIGHT SIDE)
    overallScore: {
      rating: 8.1,
      outOf: 10,
      label: "Very Good",
      summary: "Perfect everyday phone at this price",
    },

    // Identity - One-line description (RIGHT SIDE)
    identity:
      "The Samsung Galaxy A35 5G is a popular mid-range smartphone in the UAE, known for its AMOLED display, long battery life, and reliable software updates. This page covers its latest UAE price, real-world performance, pros and cons, and whether it’s worth buying in 2026",

    // Trust Signals - Decision shortcuts (RIGHT SIDE)
    trustSignals: [
      { icon: "🔋", label: "All-day battery" },
      { icon: "🔄", label: "4 years updates" },
      { icon: "📱", label: "AMOLED 120Hz" },
      { icon: "📶", label: "UAE 5G ready" },
    ],

    // Store Prices - Where to buy (NEW - IMPORTANT)
    storePrices: [
      { store: "Noon", price: "AED 1,179", region: "UAE" },
      { store: "Amazon", price: "AED 1,199", region: "UAE" },
      { store: "Sharaf DG", price: "AED 1,229", region: "UAE" },
      { store: "Jumbo", price: "AED 1,249", region: "UAE" },
    ],

    // 2. Quick Verdict - Direct and honest
    verdict:
      "Yes, if you want a phone with excellent battery life, smooth daily use, and guaranteed updates. No, if camera quality or heavy gaming matters most to you.",

    // 3. Score Strip - Glanceable ratings
    scores: [
      {
        label: "Value",
        icon: "💰",
        rating: 4,
      },
      {
        label: "Daily Use",
        icon: "📱",
        rating: 5,
      },
      {
        label: "Camera",
        icon: "📸",
        rating: 3,
      },
      {
        label: "Gaming",
        icon: "🎮",
        rating: 2,
      },
      {
        label: "Battery",
        icon: "🔋",
        rating: 5,
      },
    ],

    // 4. Price Comparison - THE DECISION ANCHOR
    priceComparison: [
      {
        type: "better",
        label: "Better battery life",
        text: "than most phones in this range",
      },
      {
        type: "average",
        label: "Camera is average",
        text: "compared to Redmi / Pixel options",
      },
      {
        type: "better",
        label: "Software updates are more reliable",
        text: "than Chinese brands",
      },
    ],

    // 5. Buy/Skip Box - User-focused language
    buyReasons: [
      "All-day battery that lasts 1.5 days with normal use",
      "Smooth for WhatsApp, Instagram, and daily browsing",
      "4 years of software updates guaranteed",
    ],

    skipReasons: [
      "Heavy games like Genshin Impact will struggle",
      "Night photos are just okay, not flagship quality",
      "Plastic build feels less premium than competitors",
    ],

    // 5. Key Differences - Experience focused (max 3 short lines each)
    keyDifferences: [
      {
        icon: "⚡",
        title: "Performance",
        points: [
          "Smooth for daily apps",
          "Not for heavy gaming",
          "No lag for videos and browsing",
        ],
      },
      {
        icon: "📷",
        title: "Camera",
        points: [
          "Good in daylight",
          "Night photos can be grainy",
          "Perfect for social media",
        ],
      },
      {
        icon: "🔋",
        title: "Battery Life",
        points: [
          "Full day easily",
          "1.5 days with light use",
          "50% charge in 30 minutes",
        ],
      },
      {
        icon: "🎨",
        title: "Display",
        points: [
          "Bright AMOLED screen",
          "Smooth 120Hz scrolling",
          "Great in sunlight",
        ],
      },
    ],

    // Final Recommendation - Decision Closure (NEW)
    finalRecommendation:
      "Buy the Samsung Galaxy A35 if your priority is battery life, smooth daily use, and long software support. If camera quality or gaming performance matters more, consider the alternatives below.",

    // Related Links - Internal linking for SEO
    relatedLinks: [
      {
        href: "/phones?price=under-1500",
        label: "Best Phones Under AED 1,500",
      },
      { href: "/phones?brand=samsung", label: "All Samsung Phones" },
      {
        href: "/compare?phones=samsung-galaxy-a35-5g,xiaomi-redmi-note-13-pro",
        label: "Compare with Redmi Note 13 Pro",
      },
      { href: "/phones?feature=5g", label: "5G Phones in UAE" },
      {
        href: "/phones?feature=best-battery",
        label: "Best Battery Life Phones",
      },
    ],

    // 6. Best Alternatives - Decision continuation
    alternatives: [
      {
        name: "Xiaomi Redmi Note 13 Pro",
        slug: "xiaomi-redmi-note-13-pro",
        image: "/mobile1.jpg",
        reason: "Better camera for AED 200 less",
      },
      {
        name: "Nothing Phone (2a)",
        slug: "nothing-phone-2a",
        image: "/mobile1.jpg",
        reason: "Better gaming at similar price",
      },
      {
        name: "Google Pixel 7a",
        slug: "google-pixel-7a",
        image: "/mobile1.jpg",
        reason: "Flagship camera experience",
      },
    ],

    // 7. Specs - Collapsed by default
    specs: {
      Display: {
        Size: "6.6 inches",
        Type: "Super AMOLED",
        Resolution: "1080 x 2340 pixels",
        "Refresh Rate": "120Hz",
      },
      Performance: {
        Processor: "Exynos 1380",
        RAM: "8GB",
        Storage: "128GB / 256GB",
        Expandable: "Yes, up to 1TB",
      },
      Camera: {
        Main: "50MP, f/1.8",
        "Ultra Wide": "8MP, f/2.2",
        Macro: "5MP",
        Front: "13MP, f/2.2",
        Video: "4K@30fps",
      },
      Battery: {
        Capacity: "5000mAh",
        Charging: "25W Fast Charging",
        Wireless: "No",
      },
      Network: {
        "5G": "Yes",
        "Dual SIM": "Yes",
        "UAE Bands": "Fully supported",
      },
      Build: {
        Material: "Plastic frame and back",
        "Water Resistance": "IP67",
        Weight: "209g",
      },
      Software: {
        OS: "Android 14",
        UI: "One UI 6.0",
        Updates: "4 years of OS updates, 5 years security",
      },
    },

    // 8. FAQ - Real buyer questions
    faqs: [
      {
        question: "Does it support UAE 5G networks?",
        answer:
          "Yes, the Samsung Galaxy A35 5G supports all major UAE 5G bands including Etisalat and du networks. You'll get full 5G connectivity across the Emirates.",
      },
      {
        question: "Can it run PUBG or Call of Duty Mobile smoothly?",
        answer:
          "PUBG Mobile runs well on medium settings with stable 60fps. For heavy games like Genshin Impact, expect some frame drops on high settings. It's good for casual gaming but not ideal for competitive mobile gaming.",
      },
      {
        question: "How long will Samsung provide software updates?",
        answer:
          "Samsung guarantees 4 years of major Android OS updates and 5 years of security patches. This means you'll get updates until at least 2028, making it a solid long-term investment.",
      },
      {
        question: "Is it dual SIM? Can I use two numbers?",
        answer:
          "Yes, it has dual SIM support. You can use two physical SIM cards simultaneously, which is perfect if you have separate work and personal numbers or travel frequently.",
      },
      {
        question: "Is the water resistance enough for daily protection?",
        answer:
          "The IP67 rating means it can survive being submerged in 1 meter of water for 30 minutes. It's protected against rain, splashes, and accidental drops in water, but it's not meant for swimming or diving.",
      },
      {
        question: "Where can I get the best price in UAE?",
        answer:
          "Check the price comparison section above to see current offers from major UAE retailers like Sharaf DG, Jumbo Electronics, and Amazon.ae. Prices typically range from AED 1,099 to AED 1,299 depending on storage.",
      },
    ],
  },
];
