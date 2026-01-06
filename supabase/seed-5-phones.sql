-- =====================================================
-- SEED 5 DEMO PHONES
-- Xiaomi, Google Pixel, OnePlus, Nothing, Realme
-- =====================================================

-- =====================================================
-- 1. XIAOMI REDMI NOTE 13 PRO (Budget King)
-- =====================================================
DO $$
DECLARE
  brand_id UUID;
  phone_id UUID;
BEGIN
  SELECT id INTO brand_id FROM brands WHERE slug = 'xiaomi';
  IF brand_id IS NULL THEN
    INSERT INTO brands (name, slug, logo_url, is_active) VALUES ('Xiaomi', 'xiaomi', '/brands/xiaomi.png', true) RETURNING id INTO brand_id;
  END IF;

  INSERT INTO phones (
    slug, name, brand_id, image_url, price, price_range, category, badge, badge_color,
    why_pick, identity, overall_score_rating, overall_score_label,
    score_camera, score_battery, score_performance, score_display, score_value,
    verdict, final_recommendation,
    trust_signals, storage_options, color_options,
    buy_reasons, skip_reasons, key_differences, price_comparison,
    related_links, alternatives, specs, faqs, status, published_at
  ) VALUES (
    'xiaomi-redmi-note-13-pro',
    'Xiaomi Redmi Note 13 Pro',
    brand_id,
    'https://i02.appmifile.com/220_operator_sg/10/01/2024/90e8aa5e22d5a94c4f8e33e2d1e0b1e2.png',
    1099,
    'AED 1,099',
    'mid-range',
    'Best Value',
    'amber',
    'Maximum features at minimum price',
    'The Xiaomi Redmi Note 13 Pro offers an incredible 200MP camera, stunning AMOLED display, and 67W fast charging at an unbeatable price. It is the best value smartphone in UAE for 2026.',
    7.9,
    'Very Good',
    8, 8, 7, 8, 10,
    'Yes, if you want flagship features without flagship price. The 200MP camera and 67W charging are incredible at this price. No, if you want premium build quality or need the best gaming performance.',
    'Buy the Redmi Note 13 Pro if value is your priority. You get more features per dirham than any other phone in UAE. Consider Samsung A35 if software updates matter more.',
    '[{"icon": "📷", "label": "200MP Camera"}, {"icon": "⚡", "label": "67W Turbo Charge"}, {"icon": "📱", "label": "120Hz AMOLED"}, {"icon": "💰", "label": "Best Value"}]'::jsonb,
    ARRAY['128GB', '256GB'],
    '[{"name": "Midnight Black", "hex": "#1a1a1a"}, {"name": "Aurora Purple", "hex": "#9333ea"}, {"name": "Ocean Teal", "hex": "#14b8a6"}]'::jsonb,
    ARRAY['200MP camera takes incredibly detailed photos', '67W charging: 0-100% in 45 minutes', 'Premium AMOLED display at budget price', 'Great for daily apps and light gaming'],
    ARRAY['MIUI ads can be annoying', 'Plastic build feels less premium', 'Only 2 years of major updates', 'Gaming performance is average'],
    '[{"icon": "📷", "title": "Camera", "points": ["200MP main sensor", "Great daylight photos", "Night mode is decent"]}, {"icon": "⚡", "title": "Charging", "points": ["67W turbo charging", "Full charge in 45 mins", "5100mAh battery"]}, {"icon": "📱", "title": "Display", "points": ["6.67 inch AMOLED", "120Hz smooth scrolling", "Bright outdoor visibility"]}, {"icon": "🎮", "title": "Gaming", "points": ["PUBG on medium settings", "Some frame drops on high", "Good for casual games"]}]'::jsonb,
    '[{"type": "better", "label": "Camera resolution", "text": "200MP vs 50MP on competitors"}, {"type": "better", "label": "Charging speed", "text": "67W vs 25W on Samsung"}, {"type": "worse", "label": "Software updates", "text": "2 years vs 4 years on Samsung"}, {"type": "average", "label": "Build quality", "text": "plastic vs glass on others"}]'::jsonb,
    '[{"href": "/phones?price=under-1500", "label": "Phones Under AED 1,500"}, {"href": "/phones?brand=xiaomi", "label": "All Xiaomi Phones"}]'::jsonb,
    '[{"name": "Samsung Galaxy A35 5G", "slug": "samsung-galaxy-a35-5g", "image": "/mobile1.jpg", "reason": "Better updates, similar price"}, {"name": "Poco X6 Pro", "slug": "poco-x6-pro", "image": "/mobile1.jpg", "reason": "Better gaming performance"}]'::jsonb,
    '{"Display": {"Size": "6.67 inches", "Type": "AMOLED", "Resolution": "2400 x 1080", "Refresh Rate": "120Hz"}, "Performance": {"Processor": "Snapdragon 7s Gen 2", "RAM": "8GB / 12GB", "Storage": "128GB / 256GB"}, "Camera": {"Main": "200MP, f/1.65, OIS", "Ultra Wide": "8MP", "Macro": "2MP", "Front": "16MP"}, "Battery": {"Capacity": "5100mAh", "Charging": "67W Turbo", "Wireless": "No"}, "Network": {"5G": "Yes", "Dual SIM": "Yes"}, "Build": {"Material": "Glass front, plastic back", "Water Resistance": "IP54", "Weight": "187g"}}'::jsonb,
    '[{"question": "Is 200MP camera really better?", "answer": "For daylight photos with lots of detail, yes. But in low light, pixel-binning makes it similar to 50MP sensors. Great for cropping and printing large photos."}, {"question": "How long will Xiaomi update this phone?", "answer": "Xiaomi promises 2 major Android updates and 3 years of security patches. Less than Samsung (4 years) but acceptable at this price."}]'::jsonb,
    'published', NOW()
  ) RETURNING id INTO phone_id;

  INSERT INTO phone_store_prices (phone_id, store_name, price, price_value, url, is_active) VALUES
    (phone_id, 'Noon', 'AED 1,049', 1049, 'https://www.noon.com', true),
    (phone_id, 'Amazon', 'AED 1,099', 1099, 'https://www.amazon.ae', true),
    (phone_id, 'Sharaf DG', 'AED 1,129', 1129, 'https://www.sharafdg.com', true);

  RAISE NOTICE '✅ Xiaomi Redmi Note 13 Pro created';
END $$;


-- =====================================================
-- 2. GOOGLE PIXEL 8 (Best Camera)
-- =====================================================
DO $$
DECLARE
  brand_id UUID;
  phone_id UUID;
BEGIN
  SELECT id INTO brand_id FROM brands WHERE slug = 'google';
  IF brand_id IS NULL THEN
    INSERT INTO brands (name, slug, logo_url, is_active) VALUES ('Google', 'google', '/brands/google.png', true) RETURNING id INTO brand_id;
  END IF;

  INSERT INTO phones (
    slug, name, brand_id, image_url, price, price_range, category, badge, badge_color,
    why_pick, identity, overall_score_rating, overall_score_label,
    score_camera, score_battery, score_performance, score_display, score_value,
    verdict, final_recommendation,
    trust_signals, storage_options, color_options,
    buy_reasons, skip_reasons, key_differences, price_comparison,
    related_links, alternatives, specs, faqs, status, published_at
  ) VALUES (
    'google-pixel-8',
    'Google Pixel 8',
    brand_id,
    'https://lh3.googleusercontent.com/HCLhDpMOJHdLA4mkkTvoP8WBk_l1nSbVvVvD8h0s5A3dDUczu5Iv8_L0IgX7xpPvlJZr_xQmGIXoShN7F10m1A',
    2699,
    'AED 2,699',
    'flagship',
    'Best Camera',
    'rose',
    'AI-powered photography perfection',
    'The Google Pixel 8 delivers the best camera experience in its price range, powered by Google AI. Magic Eraser, Photo Unblur, and Best Take make every photo perfect. 7 years of updates guaranteed.',
    8.5,
    'Excellent',
    10, 7, 8, 8, 8,
    'Yes, if photography is your priority. No phone under AED 3,000 takes better photos, especially in low light. No, if you need all-day battery or prefer Samsung/Apple ecosystem.',
    'Buy the Pixel 8 if camera quality matters most. The AI photo features are unmatched. Consider Samsung S24 if you want better battery and more features.',
    '[{"icon": "📸", "label": "Best-in-class Camera"}, {"icon": "🤖", "label": "Google AI Magic"}, {"icon": "🛡️", "label": "7 Years Updates"}, {"icon": "✨", "label": "Pure Android"}]'::jsonb,
    ARRAY['128GB', '256GB'],
    '[{"name": "Obsidian", "hex": "#1a1a1a"}, {"name": "Hazel", "hex": "#8b9a7c"}, {"name": "Rose", "hex": "#e8c4c4"}]'::jsonb,
    ARRAY['Best camera in this price range, period', 'Magic Eraser removes unwanted objects instantly', '7 years of Android updates guaranteed', 'Clean Android experience with no bloatware'],
    ARRAY['Battery barely lasts a full day', 'No expandable storage', 'Slower charging than competitors', 'Limited availability in UAE'],
    '[{"icon": "📷", "title": "Camera", "points": ["50MP with Google AI", "Best night mode ever", "Magic Eraser is amazing"]}, {"icon": "🤖", "title": "AI Features", "points": ["Call screening", "Live translate", "Photo Unblur magic"]}, {"icon": "🔋", "title": "Battery", "points": ["Gets through the day", "No wireless charging", "Slower 27W charging"]}, {"icon": "📱", "title": "Software", "points": ["Cleanest Android", "7 years of updates", "First to get new features"]}]'::jsonb,
    '[{"type": "better", "label": "Camera quality", "text": "best photos in any lighting"}, {"type": "better", "label": "Software updates", "text": "7 years beats everyone"}, {"type": "worse", "label": "Battery life", "text": "shorter than Samsung/iPhone"}, {"type": "average", "label": "Performance", "text": "smooth but not gaming champion"}]'::jsonb,
    '[{"href": "/phones?brand=google", "label": "All Google Phones"}, {"href": "/phones?feature=best-camera", "label": "Best Camera Phones"}]'::jsonb,
    '[{"name": "Samsung Galaxy S24", "slug": "samsung-galaxy-s24", "image": "/mobile1.jpg", "reason": "Better battery and zoom"}, {"name": "iPhone 15", "slug": "apple-iphone-15", "image": "/mobile1.jpg", "reason": "Better video recording"}]'::jsonb,
    '{"Display": {"Size": "6.2 inches", "Type": "OLED", "Resolution": "2400 x 1080", "Refresh Rate": "120Hz"}, "Performance": {"Processor": "Google Tensor G3", "RAM": "8GB", "Storage": "128GB / 256GB"}, "Camera": {"Main": "50MP, f/1.68, OIS", "Ultra Wide": "12MP", "Front": "10.5MP"}, "Battery": {"Capacity": "4575mAh", "Charging": "27W Wired", "Wireless": "Yes"}, "Network": {"5G": "Yes", "Dual SIM": "Yes (eSIM)"}, "Build": {"Material": "Aluminum + Gorilla Glass", "Water Resistance": "IP68", "Weight": "187g"}}'::jsonb,
    '[{"question": "Is Pixel 8 officially available in UAE?", "answer": "Yes, Google Pixel 8 is available through authorized retailers in UAE including Amazon.ae and select electronics stores. Warranty is valid in UAE."}, {"question": "What is Magic Eraser?", "answer": "Magic Eraser uses AI to remove unwanted objects or people from your photos. Just tap on what you want to remove and Google AI makes it disappear naturally."}]'::jsonb,
    'published', NOW()
  ) RETURNING id INTO phone_id;

  INSERT INTO phone_store_prices (phone_id, store_name, price, price_value, url, is_active) VALUES
    (phone_id, 'Amazon', 'AED 2,599', 2599, 'https://www.amazon.ae', true),
    (phone_id, 'Noon', 'AED 2,699', 2699, 'https://www.noon.com', true),
    (phone_id, 'Virgin Megastore', 'AED 2,749', 2749, 'https://www.virginmegastore.ae', true);

  RAISE NOTICE '✅ Google Pixel 8 created';
END $$;


-- =====================================================
-- 3. ONEPLUS 12 (Flagship Killer)
-- =====================================================
DO $$
DECLARE
  brand_id UUID;
  phone_id UUID;
BEGIN
  SELECT id INTO brand_id FROM brands WHERE slug = 'oneplus';
  IF brand_id IS NULL THEN
    INSERT INTO brands (name, slug, logo_url, is_active) VALUES ('OnePlus', 'oneplus', '/brands/oneplus.png', true) RETURNING id INTO brand_id;
  END IF;

  INSERT INTO phones (
    slug, name, brand_id, image_url, price, price_range, category, badge, badge_color,
    why_pick, identity, overall_score_rating, overall_score_label,
    score_camera, score_battery, score_performance, score_display, score_value,
    verdict, final_recommendation,
    trust_signals, storage_options, color_options,
    buy_reasons, skip_reasons, key_differences, price_comparison,
    related_links, alternatives, specs, faqs, status, published_at
  ) VALUES (
    'oneplus-12',
    'OnePlus 12',
    brand_id,
    'https://image01.oneplus.net/ebp/202401/09/1-m00-52-d1-ckt_1_1704791773_0_750_750.png',
    3499,
    'AED 3,499',
    'flagship',
    'Flagship Killer',
    'red',
    'Top specs at lower flagship price',
    'The OnePlus 12 packs Snapdragon 8 Gen 3, 100W charging, Hasselblad cameras, and a stunning 2K display. It delivers flagship performance at hundreds less than Samsung and Apple.',
    8.8,
    'Excellent',
    9, 9, 10, 10, 9,
    'Yes, if you want the fastest Android phone without paying iPhone Pro prices. Performance, display, and charging are all top-tier. No, if brand prestige or Apple ecosystem matters to you.',
    'Buy the OnePlus 12 if you want maximum performance and features for your money. It outperforms phones costing AED 1,000 more. Only skip if you need iPhone/Samsung ecosystem.',
    '[{"icon": "🚀", "label": "Snapdragon 8 Gen 3"}, {"icon": "⚡", "label": "100W SUPERVOOC"}, {"icon": "📸", "label": "Hasselblad Camera"}, {"icon": "🖥️", "label": "2K 120Hz Display"}]'::jsonb,
    ARRAY['256GB', '512GB'],
    '[{"name": "Silky Black", "hex": "#1a1a1a"}, {"name": "Flowy Emerald", "hex": "#047857"}]'::jsonb,
    ARRAY['Fastest Android processor available', '100W charging: full battery in 25 minutes', 'Stunning 2K 120Hz AMOLED display', 'Hasselblad-tuned cameras look cinematic'],
    ARRAY['OxygenOS has some bugs occasionally', 'No wireless charging on base model', 'Less brand recognition than Samsung', 'Software updates slower than Pixel'],
    '[{"icon": "🚀", "title": "Performance", "points": ["Snapdragon 8 Gen 3", "16GB RAM option", "Fastest Android gaming"]}, {"icon": "⚡", "title": "Charging", "points": ["100W wired charging", "Full in 25 minutes", "5400mAh battery"]}, {"icon": "📷", "title": "Camera", "points": ["Hasselblad tuning", "50MP main + 64MP tele", "Great portraits"]}, {"icon": "🖥️", "title": "Display", "points": ["6.82 inch 2K AMOLED", "120Hz ProXDR", "4500 nits peak"]}]'::jsonb,
    '[{"type": "better", "label": "Performance", "text": "faster than S24 Ultra in benchmarks"}, {"type": "better", "label": "Charging", "text": "100W vs 45W on Samsung"}, {"type": "average", "label": "Camera", "text": "great but not quite Pixel/iPhone level"}, {"type": "better", "label": "Value", "text": "AED 1000 less than comparable Samsung"}]'::jsonb,
    '[{"href": "/phones?brand=oneplus", "label": "All OnePlus Phones"}, {"href": "/phones?category=flagship", "label": "All Flagship Phones"}]'::jsonb,
    '[{"name": "Samsung Galaxy S24 Ultra", "slug": "samsung-galaxy-s24-ultra", "image": "/mobile1.jpg", "reason": "S Pen and better zoom"}, {"name": "iPhone 15 Pro", "slug": "apple-iphone-15-pro", "image": "/mobile1.jpg", "reason": "Best video and ecosystem"}]'::jsonb,
    '{"Display": {"Size": "6.82 inches", "Type": "LTPO AMOLED", "Resolution": "3168 x 1440 (2K)", "Refresh Rate": "120Hz"}, "Performance": {"Processor": "Snapdragon 8 Gen 3", "RAM": "12GB / 16GB", "Storage": "256GB / 512GB"}, "Camera": {"Main": "50MP, f/1.6, OIS", "Telephoto": "64MP, 3x zoom", "Ultra Wide": "48MP", "Front": "32MP"}, "Battery": {"Capacity": "5400mAh", "Charging": "100W SUPERVOOC", "Wireless": "50W (Pro only)"}, "Network": {"5G": "Yes", "Dual SIM": "Yes"}, "Build": {"Material": "Aluminum + Ceramic/Glass", "Water Resistance": "IP65", "Weight": "220g"}}'::jsonb,
    '[{"question": "Is OnePlus 12 good for gaming?", "answer": "The OnePlus 12 is arguably the best Android gaming phone. Snapdragon 8 Gen 3, up to 16GB RAM, and excellent cooling mean Genshin Impact runs at max settings with stable 60fps."}, {"question": "How fast is 100W charging really?", "answer": "With the included 100W charger, you get 0-100% in about 25 minutes. A quick 10-minute charge gives you 50% battery - enough for a full day."}]'::jsonb,
    'published', NOW()
  ) RETURNING id INTO phone_id;

  INSERT INTO phone_store_prices (phone_id, store_name, price, price_value, url, is_active) VALUES
    (phone_id, 'OnePlus Store', 'AED 3,499', 3499, 'https://www.oneplus.com/ae', true),
    (phone_id, 'Amazon', 'AED 3,399', 3399, 'https://www.amazon.ae', true),
    (phone_id, 'Noon', 'AED 3,449', 3449, 'https://www.noon.com', true);

  RAISE NOTICE '✅ OnePlus 12 created';
END $$;


-- =====================================================
-- 4. NOTHING PHONE (2a) (Unique Design)
-- =====================================================
DO $$
DECLARE
  brand_id UUID;
  phone_id UUID;
BEGIN
  SELECT id INTO brand_id FROM brands WHERE slug = 'nothing';
  IF brand_id IS NULL THEN
    INSERT INTO brands (name, slug, logo_url, is_active) VALUES ('Nothing', 'nothing', '/brands/nothing.png', true) RETURNING id INTO brand_id;
  END IF;

  INSERT INTO phones (
    slug, name, brand_id, image_url, price, price_range, category, badge, badge_color,
    why_pick, identity, overall_score_rating, overall_score_label,
    score_camera, score_battery, score_performance, score_display, score_value,
    verdict, final_recommendation,
    trust_signals, storage_options, color_options,
    buy_reasons, skip_reasons, key_differences, price_comparison,
    related_links, alternatives, specs, faqs, status, published_at
  ) VALUES (
    'nothing-phone-2a',
    'Nothing Phone (2a)',
    brand_id,
    'https://nothing.tech/cdn/shop/files/Phone_2a_-_Black.png',
    1299,
    'AED 1,299',
    'mid-range',
    'Unique Design',
    'gray',
    'Stand out with Glyph interface',
    'The Nothing Phone (2a) combines unique transparent design with Glyph LED notifications, clean software, and solid mid-range performance. Perfect for those tired of boring phone designs.',
    7.8,
    'Very Good',
    7, 8, 8, 8, 8,
    'Yes, if you want a phone that looks different and offers clean software. The Glyph lights are genuinely useful for notifications. No, if camera quality is your top priority.',
    'Buy the Nothing Phone (2a) if you value unique design and clean software. Great conversation starter. Skip if you need the best camera or dont care about aesthetics.',
    '[{"icon": "💡", "label": "Glyph Interface"}, {"icon": "🎨", "label": "Transparent Design"}, {"icon": "📱", "label": "Clean Nothing OS"}, {"icon": "🎮", "label": "Solid Gaming"}]'::jsonb,
    ARRAY['128GB', '256GB'],
    '[{"name": "Black", "hex": "#1a1a1a"}, {"name": "White", "hex": "#f5f5f5"}]'::jsonb,
    ARRAY['Unique transparent back design stands out', 'Glyph LEDs for useful notifications', 'Clean Nothing OS with no bloatware', 'Good gaming performance at this price'],
    ARRAY['Camera is average, not for photography fans', 'Glyph lights can be gimmicky for some', 'Limited service centers in UAE', 'No telephoto or macro camera'],
    '[{"icon": "💡", "title": "Glyph Interface", "points": ["Unique LED notifications", "Custom patterns per contact", "Progress indicators"]}, {"icon": "🎨", "title": "Design", "points": ["Transparent back is stunning", "Premium feel despite price", "Lightweight build"]}, {"icon": "📱", "title": "Software", "points": ["Nothing OS is clean", "Near-stock Android", "3 years of updates"]}, {"icon": "⚡", "title": "Performance", "points": ["Dimensity 7200 Pro", "Handles most games", "Smooth daily use"]}]'::jsonb,
    '[{"type": "better", "label": "Design", "text": "most unique looking phone available"}, {"type": "better", "label": "Software", "text": "cleanest Android after Pixel"}, {"type": "average", "label": "Camera", "text": "fine but not standout"}, {"type": "better", "label": "Value", "text": "flagship feel at mid-range price"}]'::jsonb,
    '[{"href": "/phones?brand=nothing", "label": "All Nothing Phones"}, {"href": "/phones?price=1000-1500", "label": "Phones AED 1,000-1,500"}]'::jsonb,
    '[{"name": "Samsung Galaxy A35 5G", "slug": "samsung-galaxy-a35-5g", "image": "/mobile1.jpg", "reason": "Better camera and updates"}, {"name": "Poco X6 Pro", "slug": "poco-x6-pro", "image": "/mobile1.jpg", "reason": "Better gaming performance"}]'::jsonb,
    '{"Display": {"Size": "6.7 inches", "Type": "AMOLED", "Resolution": "2412 x 1084", "Refresh Rate": "120Hz"}, "Performance": {"Processor": "MediaTek Dimensity 7200 Pro", "RAM": "8GB / 12GB", "Storage": "128GB / 256GB"}, "Camera": {"Main": "50MP, f/1.88, OIS", "Ultra Wide": "50MP", "Front": "32MP"}, "Battery": {"Capacity": "5000mAh", "Charging": "45W", "Wireless": "No"}, "Network": {"5G": "Yes", "Dual SIM": "Yes"}, "Build": {"Material": "Plastic + Recycled Aluminum", "Water Resistance": "IP54", "Weight": "190g"}}'::jsonb,
    '[{"question": "What are Glyph lights actually useful for?", "answer": "Glyph lights show notifications without checking your screen, indicate charging progress, work as a fill light for selfies, and can be set to unique patterns for different contacts. More useful than expected!"}, {"question": "Is Nothing a reliable brand?", "answer": "Nothing is founded by Carl Pei (OnePlus co-founder). They have been consistently updating their phones and building a loyal fanbase. Service availability in UAE is limited but growing."}]'::jsonb,
    'published', NOW()
  ) RETURNING id INTO phone_id;

  INSERT INTO phone_store_prices (phone_id, store_name, price, price_value, url, is_active) VALUES
    (phone_id, 'Amazon', 'AED 1,249', 1249, 'https://www.amazon.ae', true),
    (phone_id, 'Noon', 'AED 1,299', 1299, 'https://www.noon.com', true),
    (phone_id, 'Virgin Megastore', 'AED 1,349', 1349, 'https://www.virginmegastore.ae', true);

  RAISE NOTICE '✅ Nothing Phone (2a) created';
END $$;


-- =====================================================
-- 5. REALME GT 5 PRO (Gaming Beast)
-- =====================================================
DO $$
DECLARE
  brand_id UUID;
  phone_id UUID;
BEGIN
  SELECT id INTO brand_id FROM brands WHERE slug = 'realme';
  IF brand_id IS NULL THEN
    INSERT INTO brands (name, slug, logo_url, is_active) VALUES ('Realme', 'realme', '/brands/realme.png', true) RETURNING id INTO brand_id;
  END IF;

  INSERT INTO phones (
    slug, name, brand_id, image_url, price, price_range, category, badge, badge_color,
    why_pick, identity, overall_score_rating, overall_score_label,
    score_camera, score_battery, score_performance, score_display, score_value,
    verdict, final_recommendation,
    trust_signals, storage_options, color_options,
    buy_reasons, skip_reasons, key_differences, price_comparison,
    related_links, alternatives, specs, faqs, status, published_at
  ) VALUES (
    'realme-gt-5-pro',
    'Realme GT 5 Pro',
    brand_id,
    'https://image.oppo.com/content/dam/oppo/product-asset-library/realme/gt5-pro/v1/assets/image/overview-gallery-1.png',
    2299,
    'AED 2,299',
    'flagship',
    'Gaming Beast',
    'yellow',
    'Best gaming under AED 2,500',
    'The Realme GT 5 Pro delivers Snapdragon 8 Gen 3 flagship performance with 240W charging and excellent gaming cooling. Best choice for mobile gamers who want flagship specs without flagship price.',
    8.4,
    'Excellent',
    8, 8, 10, 9, 9,
    'Yes, if gaming is your priority. Snapdragon 8 Gen 3 runs everything at max settings. 240W charging means never waiting for battery. No, if camera quality matters more than gaming.',
    'Buy the Realme GT 5 Pro if you want the best mobile gaming experience under AED 2,500. Flagship performance, incredible charging. Skip only if you prioritize camera over gaming.',
    '[{"icon": "🎮", "label": "Gaming Champion"}, {"icon": "⚡", "label": "240W Charging"}, {"icon": "🚀", "label": "Snapdragon 8 Gen 3"}, {"icon": "❄️", "label": "Ice-cool Gaming"}]'::jsonb,
    ARRAY['256GB', '512GB'],
    '[{"name": "Nebula Silver", "hex": "#c0c0c0"}, {"name": "Pioneer Green", "hex": "#22c55e"}]'::jsonb,
    ARRAY['Snapdragon 8 Gen 3 runs every game maxed out', '240W charging: 0-100% in just 10 minutes', 'Advanced cooling keeps phone cool during gaming', 'Great value for flagship specs'],
    ARRAY['Camera good but not class-leading', 'Realme UI has some bloatware', 'Build quality not quite premium feel', 'Limited brand service in UAE'],
    '[{"icon": "🎮", "title": "Gaming", "points": ["Every game at max settings", "Stable 120fps in most titles", "GT Mode for extra boost"]}, {"icon": "⚡", "title": "Charging", "points": ["240W world fastest", "Full charge in 10 mins", "Even 2 mins gives hours"]}, {"icon": "❄️", "title": "Cooling", "points": ["9-layer ice cooling", "Stays cool under load", "Sustained performance"]}, {"icon": "📷", "title": "Camera", "points": ["50MP Sony IMX890", "Good all-around", "8K video recording"]}]'::jsonb,
    '[{"type": "better", "label": "Gaming performance", "text": "matches phones costing AED 1000 more"}, {"type": "better", "label": "Charging speed", "text": "240W is fastest in the world"}, {"type": "average", "label": "Camera", "text": "good but not Pixel/iPhone level"}, {"type": "better", "label": "Value", "text": "flagship specs at mid-range price"}]'::jsonb,
    '[{"href": "/phones?brand=realme", "label": "All Realme Phones"}, {"href": "/phones?feature=gaming", "label": "Best Gaming Phones"}]'::jsonb,
    '[{"name": "OnePlus 12", "slug": "oneplus-12", "image": "/mobile1.jpg", "reason": "Better overall camera"}, {"name": "ASUS ROG Phone 8", "slug": "asus-rog-phone-8", "image": "/mobile1.jpg", "reason": "Ultimate gaming features"}]'::jsonb,
    '{"Display": {"Size": "6.78 inches", "Type": "LTPO AMOLED", "Resolution": "2780 x 1264", "Refresh Rate": "144Hz"}, "Performance": {"Processor": "Snapdragon 8 Gen 3", "RAM": "12GB / 16GB", "Storage": "256GB / 512GB"}, "Camera": {"Main": "50MP Sony IMX890", "Telephoto": "64MP, 3x zoom", "Ultra Wide": "8MP", "Front": "32MP"}, "Battery": {"Capacity": "5400mAh", "Charging": "240W SuperVOOC", "Wireless": "No"}, "Network": {"5G": "Yes", "Dual SIM": "Yes"}, "Build": {"Material": "Aluminum + Glass", "Water Resistance": "IP64", "Weight": "218g"}}'::jsonb,
    '[{"question": "Is 240W charging safe for the battery?", "answer": "Yes, Realme uses dual-cell battery technology that splits the power between two cells. The phone also has smart charging algorithms that slow down when optimal temperature is reached. Battery health is well protected."}, {"question": "Can it really charge in 10 minutes?", "answer": "Yes, with the included 240W charger, you get 0-100% in about 10 minutes. Even a 2-minute charge gives you enough for several hours of use. Perfect for gamers who forgot to charge."}]'::jsonb,
    'published', NOW()
  ) RETURNING id INTO phone_id;

  INSERT INTO phone_store_prices (phone_id, store_name, price, price_value, url, is_active) VALUES
    (phone_id, 'Amazon', 'AED 2,199', 2199, 'https://www.amazon.ae', true),
    (phone_id, 'Noon', 'AED 2,299', 2299, 'https://www.noon.com', true),
    (phone_id, 'Carrefour', 'AED 2,249', 2249, 'https://www.carrefouruae.com', true);

  RAISE NOTICE '✅ Realme GT 5 Pro created';
END $$;


-- =====================================================
-- SUMMARY
-- =====================================================
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '🎉 5 Demo Phones Created Successfully!';
  RAISE NOTICE '   1. Xiaomi Redmi Note 13 Pro (Budget - AED 1,099)';
  RAISE NOTICE '   2. Google Pixel 8 (Camera - AED 2,699)';
  RAISE NOTICE '   3. OnePlus 12 (Flagship - AED 3,499)';
  RAISE NOTICE '   4. Nothing Phone 2a (Design - AED 1,299)';
  RAISE NOTICE '   5. Realme GT 5 Pro (Gaming - AED 2,299)';
  RAISE NOTICE '';
  RAISE NOTICE '   Each phone includes:';
  RAISE NOTICE '   ✅ Full specs, scores, and FAQs';
  RAISE NOTICE '   ✅ 3 UAE store prices';
  RAISE NOTICE '   ✅ Buy/Skip reasons';
  RAISE NOTICE '   ✅ Alternatives and comparisons';
END $$;
