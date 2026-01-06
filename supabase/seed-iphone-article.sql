-- =====================================================
-- SEED IPHONE 15 + DEMO ARTICLE
-- Run this to add iPhone 15 and a demo article
-- =====================================================

-- =====================================================
-- PART 1: IPHONE 15 DEMO PHONE
-- =====================================================
DO $$
DECLARE
  apple_brand_id UUID;
  phone_id UUID;
BEGIN
  -- Get or create Apple brand
  SELECT id INTO apple_brand_id FROM brands WHERE slug = 'apple';
  
  IF apple_brand_id IS NULL THEN
    INSERT INTO brands (name, slug, logo_url, is_active)
    VALUES ('Apple', 'apple', '/brands/apple.png', true)
    RETURNING id INTO apple_brand_id;
    RAISE NOTICE 'Created Apple brand with ID: %', apple_brand_id;
  END IF;

  -- Insert iPhone 15
  INSERT INTO phones (
    slug,
    name,
    brand_id,
    image_url,
    price,
    price_range,
    category,
    badge,
    badge_color,
    why_pick,
    identity,
    overall_score_rating,
    overall_score_label,
    score_camera,
    score_battery,
    score_performance,
    score_display,
    score_value,
    verdict,
    final_recommendation,
    trust_signals,
    storage_options,
    color_options,
    buy_reasons,
    skip_reasons,
    key_differences,
    price_comparison,
    related_links,
    alternatives,
    specs,
    faqs,
    status,
    published_at
  ) VALUES (
    'apple-iphone-15',
    'Apple iPhone 15',
    apple_brand_id,
    'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-finish-select-202309-6-1inch-blue?wid=800&hei=800&fmt=jpeg&qlt=90&.v=1692923777972',
    3299,
    'AED 3,299',
    'flagship',
    'Best Camera',
    'blue',
    'Best iPhone value with flagship camera',
    'The Apple iPhone 15 brings the Dynamic Island to the standard iPhone lineup, along with a 48MP main camera, USB-C charging, and the powerful A16 Bionic chip. It offers a true flagship experience at a more accessible price point than the Pro models.',
    8.7,
    'Excellent',
    9,
    7,
    9,
    8,
    7,
    'Yes, if you want the best iPhone experience without paying Pro prices. The 48MP camera and Dynamic Island make this a significant upgrade. No, if you need ProMotion 120Hz display or want the telephoto lens for zoom photos.',
    'Buy the iPhone 15 if you want a premium smartphone with excellent camera quality, long software support, and seamless Apple ecosystem integration. Consider the Pro model only if you need 120Hz display or telephoto camera.',
    -- Trust Signals
    '[
      {"icon": "📸", "label": "48MP Main Camera"},
      {"icon": "🔌", "label": "USB-C Finally"},
      {"icon": "🛡️", "label": "6+ Years Updates"},
      {"icon": "🏝️", "label": "Dynamic Island"}
    ]'::jsonb,
    -- Storage Options
    ARRAY['128GB', '256GB', '512GB'],
    -- Color Options
    '[
      {"name": "Blue", "hex": "#6BA4D1"},
      {"name": "Pink", "hex": "#F4D1D9"},
      {"name": "Yellow", "hex": "#F9E87C"},
      {"name": "Green", "hex": "#D1E8D5"},
      {"name": "Black", "hex": "#3B3B3D"}
    ]'::jsonb,
    -- Buy Reasons
    ARRAY[
      '48MP camera takes stunning photos in any light',
      'USB-C means one cable for all your devices',
      'Dynamic Island makes notifications actually useful',
      '6+ years of iOS updates guaranteed'
    ],
    -- Skip Reasons
    ARRAY[
      '60Hz display feels outdated at this price',
      'No telephoto lens for proper zoom photos',
      'Base 128GB fills up fast with 4K videos',
      'Price is high compared to Android flagships'
    ],
    -- Key Differences
    '[
      {
        "icon": "📷",
        "title": "Camera",
        "points": ["48MP main sensor is excellent", "2x zoom using sensor crop", "Best video quality on any phone"]
      },
      {
        "icon": "⚡",
        "title": "Performance",
        "points": ["A16 Bionic still beats most Android", "Handles any game at max settings", "Smooth iOS 18 experience"]
      },
      {
        "icon": "🔋",
        "title": "Battery Life",
        "points": ["Full day with normal use", "20W charging is slow in 2026", "MagSafe wireless at 15W"]
      },
      {
        "icon": "📱",
        "title": "Display",
        "points": ["Super Retina XDR is gorgeous", "2000 nits outdoor brightness", "Only 60Hz refresh rate"]
      }
    ]'::jsonb,
    -- Price Comparison
    '[
      {"type": "better", "label": "Camera quality", "text": "beats most phones including iPhone 14 Pro"},
      {"type": "worse", "label": "60Hz display", "text": "feels dated compared to any mid-range Android"},
      {"type": "better", "label": "Software support", "text": "6+ years vs 4 years on Samsung"},
      {"type": "average", "label": "Battery life", "text": "similar to other flagships, charging is slower"}
    ]'::jsonb,
    -- Related Links
    '[
      {"href": "/phones?brand=apple", "label": "All Apple iPhones"},
      {"href": "/phones?price=3000-4000", "label": "Flagships AED 3,000-4,000"},
      {"href": "/compare?phones=apple-iphone-15,samsung-galaxy-s24", "label": "Compare with Galaxy S24"},
      {"href": "/phones?category=flagship", "label": "All Flagship Phones"},
      {"href": "/blogs/iphone-15-vs-15-pro-which-to-buy", "label": "iPhone 15 vs 15 Pro Guide"}
    ]'::jsonb,
    -- Alternatives
    '[
      {"name": "Samsung Galaxy S24", "slug": "samsung-galaxy-s24", "image": "/mobile1.jpg", "reason": "120Hz display and better zoom camera"},
      {"name": "iPhone 15 Pro", "slug": "apple-iphone-15-pro", "image": "/mobile1.jpg", "reason": "ProMotion display and Action Button"},
      {"name": "Google Pixel 8", "slug": "google-pixel-8", "image": "/mobile1.jpg", "reason": "Best AI features and photo editing"}
    ]'::jsonb,
    -- Specs
    '{
      "Display": {
        "Size": "6.1 inches",
        "Type": "Super Retina XDR OLED",
        "Resolution": "2556 x 1179 pixels",
        "Refresh Rate": "60Hz",
        "Brightness": "2000 nits (peak outdoor)"
      },
      "Performance": {
        "Processor": "Apple A16 Bionic",
        "RAM": "6GB",
        "Storage": "128GB / 256GB / 512GB",
        "Expandable": "No"
      },
      "Camera": {
        "Main": "48MP, f/1.6, OIS",
        "Ultra Wide": "12MP, f/2.4",
        "Front": "12MP, f/1.9, autofocus",
        "Video": "4K@60fps, Cinematic mode"
      },
      "Battery": {
        "Capacity": "3349mAh",
        "Charging": "20W Wired, 15W MagSafe",
        "Wireless": "Yes (Qi2/MagSafe)"
      },
      "Network": {
        "5G": "Yes (Sub-6GHz)",
        "Dual SIM": "Yes (nano + eSIM)",
        "UAE Bands": "Fully supported"
      },
      "Build": {
        "Material": "Aluminum frame, Ceramic Shield glass",
        "Water Resistance": "IP68",
        "Weight": "171g"
      },
      "Software": {
        "OS": "iOS 18",
        "Updates": "6+ years of iOS updates",
        "Features": "Dynamic Island, Always-On (limited)"
      }
    }'::jsonb,
    -- FAQs
    '[
      {
        "question": "Is iPhone 15 worth buying in UAE in 2026?",
        "answer": "Yes, the iPhone 15 remains an excellent choice. The 48MP camera, USB-C port, and guaranteed 6+ years of updates make it a solid long-term investment. Prices have also dropped from launch."
      },
      {
        "question": "Does iPhone 15 support 5G in UAE?",
        "answer": "Yes, iPhone 15 fully supports 5G networks in UAE including Etisalat and du. You will get fast 5G speeds across Dubai, Abu Dhabi, and other major cities."
      },
      {
        "question": "Why is the display only 60Hz?",
        "answer": "Apple reserves ProMotion (120Hz) for Pro models. While 60Hz is fine for most users, if you have used a 120Hz phone before, you may notice the difference in scrolling smoothness."
      },
      {
        "question": "Can I use my old charger with iPhone 15?",
        "answer": "iPhone 15 uses USB-C, so Lightning cables will not work. You will need a USB-C cable. However, you can now use the same charger as your MacBook, iPad, or Android devices."
      },
      {
        "question": "iPhone 15 vs iPhone 15 Pro - which should I buy?",
        "answer": "Get iPhone 15 if you want great value and do not need 120Hz display or telephoto zoom. Get iPhone 15 Pro if you want the best camera system, Action Button, and smoother display."
      },
      {
        "question": "What is Dynamic Island?",
        "answer": "Dynamic Island replaces the notch with an interactive pill-shaped cutout. It shows live activities like music, timers, Uber tracking, and sports scores without opening apps."
      }
    ]'::jsonb,
    'published',
    NOW()
  )
  RETURNING id INTO phone_id;

  -- Insert store prices for iPhone 15
  INSERT INTO phone_store_prices (phone_id, store_name, price, price_value, url, is_active) VALUES
    (phone_id, 'Apple Store', 'AED 3,299', 3299, 'https://www.apple.com/ae/', true),
    (phone_id, 'Noon', 'AED 3,149', 3149, 'https://www.noon.com', true),
    (phone_id, 'Amazon', 'AED 3,099', 3099, 'https://www.amazon.ae', true),
    (phone_id, 'Sharaf DG', 'AED 3,199', 3199, 'https://www.sharafdg.com', true),
    (phone_id, 'Virgin Megastore', 'AED 3,249', 3249, 'https://www.virginmegastore.ae', true);

  RAISE NOTICE 'iPhone 15 created with ID: %', phone_id;
END $$;


-- =====================================================
-- PART 2: DEMO ARTICLE
-- =====================================================
INSERT INTO articles (
  slug,
  title,
  excerpt,
  content,
  image_url,
  category,
  author,
  read_time,
  status,
  published_at
) VALUES (
  'best-phones-under-2000-aed-uae-2026',
  'Best Phones Under AED 2,000 in UAE (2026) - Complete Buying Guide',
  'Looking for the best smartphone under AED 2,000 in UAE? We tested and compared the top options for camera, battery, gaming, and value. Here are our top picks for 2026.',
  '## Best Phones Under AED 2,000 in UAE (2026)

Finding the perfect smartphone under AED 2,000 in the UAE can be overwhelming with so many options available. We have spent weeks testing the top contenders to help you make the right choice.

### Quick Recommendations

| Best For | Phone | Price |
|----------|-------|-------|
| **Overall** | Samsung Galaxy A55 5G | AED 1,699 |
| **Camera** | Google Pixel 7a | AED 1,499 |
| **Gaming** | Poco X6 Pro | AED 1,299 |
| **Battery** | Samsung Galaxy A35 5G | AED 1,199 |
| **Value** | Xiaomi Redmi Note 13 Pro | AED 1,099 |

---

## 1. Samsung Galaxy A55 5G - Best Overall

The Samsung Galaxy A55 5G is our top pick for most people. It offers the best balance of features, build quality, and long-term software support.

### Why We Recommend It:
- **Display:** Stunning 6.6" Super AMOLED with 120Hz
- **Performance:** Exynos 1480 handles everything smoothly
- **Camera:** 50MP main sensor with OIS
- **Battery:** 5000mAh with 25W charging
- **Updates:** 4 years of OS updates guaranteed

### Who Should Buy:
Anyone who wants a reliable daily driver with excellent display and guaranteed updates.

---

## 2. Google Pixel 7a - Best Camera

If photography is your priority, the Pixel 7a punches way above its weight.

### Camera Highlights:
- 64MP main sensor with Google AI magic
- Best night mode in this price range
- Magic Eraser and Photo Unblur features
- Excellent video stabilization

### Trade-offs:
- Average battery life (one day max)
- No expandable storage

---

## 3. Poco X6 Pro - Best for Gaming

For mobile gamers on a budget, the Poco X6 Pro is hard to beat.

### Gaming Performance:
- Dimensity 8300 Ultra processor
- 6.67" 120Hz AMOLED display
- Liquid cooling for sustained performance
- PUBG and Genshin run smoothly on high settings

---

## 4. Samsung Galaxy A35 5G - Best Battery Life

Need a phone that lasts two days? The A35 delivers.

### Battery Stats:
- 5000mAh battery
- 1.5 days with normal use
- 2 days with light use
- 25W fast charging

[Read our full Samsung Galaxy A35 5G review →](/phones/samsung-galaxy-a35-5g)

---

## 5. Xiaomi Redmi Note 13 Pro - Best Value

Maximum features at minimum price.

### What You Get for AED 1,099:
- 200MP main camera
- 6.67" 120Hz AMOLED
- 5100mAh battery
- 67W turbo charging

---

## Buying Tips for UAE

1. **Check warranty:** Buy from authorized retailers for valid UAE warranty
2. **5G compatibility:** All phones listed support UAE 5G bands
3. **Storage:** Consider 256GB if you shoot lots of 4K video
4. **Compare prices:** Noon and Amazon often have better deals than official stores

---

## Final Verdict

For most people, we recommend the **Samsung Galaxy A55 5G**. It offers the best combination of display quality, performance, camera, and long-term software support.

If budget is tight, the **Xiaomi Redmi Note 13 Pro** offers incredible value at just AED 1,099.

---

*Last updated: January 2026. Prices may vary by retailer.*',
  '/blogs/best-phones-2000.jpg',
  'Guide',
  'Tech Team',
  '8 min',
  'published',
  NOW()
),
(
  'iphone-15-vs-samsung-s24-which-to-buy-uae',
  'iPhone 15 vs Samsung Galaxy S24: Which Should You Buy in UAE?',
  'Comparing the two most popular flagship smartphones in UAE. We break down camera, performance, battery, and value to help you decide between iPhone 15 and Samsung Galaxy S24.',
  '## iPhone 15 vs Samsung Galaxy S24: The Ultimate Comparison

Both the iPhone 15 and Samsung Galaxy S24 are excellent flagship smartphones, but they cater to different types of users. Here is our detailed comparison to help you choose.

### Quick Comparison

| Feature | iPhone 15 | Galaxy S24 |
|---------|-----------|------------|
| **Price** | AED 3,299 | AED 3,199 |
| **Display** | 6.1" 60Hz OLED | 6.2" 120Hz AMOLED |
| **Processor** | A16 Bionic | Snapdragon 8 Gen 3 |
| **Main Camera** | 48MP | 50MP |
| **Battery** | 3349mAh | 4000mAh |
| **Charging** | 20W | 25W |

---

## Display: Samsung Wins

The Galaxy S24 display is simply better:
- **120Hz vs 60Hz:** Much smoother scrolling on Samsung
- **Brighter outdoors:** 2600 nits vs 2000 nits
- **Size:** Slightly larger 6.2" vs 6.1"

The iPhone 15 60Hz display feels dated in 2026, especially at this price point.

**Winner: Samsung Galaxy S24** 🏆

---

## Camera: Close Call

### iPhone 15 Strengths:
- Best video recording quality
- More natural skin tones
- Cinematic mode is excellent
- Consistent processing

### Galaxy S24 Strengths:
- 3x optical zoom (vs 2x digital on iPhone)
- More versatile night mode
- Better ultra-wide camera
- AI photo editing features

**Winner: Tie** 🤝 (iPhone for video, Samsung for photos)

---

## Performance: Both Excellent

Both phones handle everything you throw at them:
- Social media: Flawless on both
- Gaming: Both run PUBG and Genshin at high settings
- Multitasking: No issues on either

The A16 Bionic and Snapdragon 8 Gen 3 are both incredibly powerful.

**Winner: Tie** 🤝

---

## Battery Life: Samsung Wins

- **Galaxy S24:** 4000mAh, lasts full day with heavy use
- **iPhone 15:** 3349mAh, full day with normal use

Samsung also charges faster (25W vs 20W) and has reverse wireless charging.

**Winner: Samsung Galaxy S24** 🏆

---

## Software & Updates

### iPhone 15:
- 6+ years of iOS updates
- Seamless ecosystem with Mac, iPad, Watch
- AirDrop, iMessage, FaceTime

### Galaxy S24:
- 7 years of updates promised
- Samsung DeX for desktop mode
- Galaxy AI features

**Winner: Tie** 🤝 (depends on your ecosystem)

---

## Who Should Buy What?

### Buy iPhone 15 if:
- You have other Apple devices
- Video recording is important
- You prefer iOS simplicity
- You want proven long-term support

### Buy Galaxy S24 if:
- You want 120Hz smooth display
- Zoom photography matters
- Customization is important
- You prefer USB-C fast charging

---

## Final Verdict

**For most UAE buyers: Samsung Galaxy S24**

The 120Hz display alone makes the S24 worth choosing over the iPhone 15. Add better zoom camera and larger battery, and Samsung wins this round.

**Exception:** If you are deep in the Apple ecosystem or prioritize video recording, stick with iPhone 15.

---

*Prices as of January 2026. Available at major UAE retailers.*',
  '/blogs/iphone-vs-samsung.jpg',
  'Comparison',
  'Tech Team',
  '10 min',
  'published',
  NOW()
);

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Seed data created successfully!';
  RAISE NOTICE '   - iPhone 15 phone with store prices';
  RAISE NOTICE '   - 2 demo articles (buying guide + comparison)';
END $$;
