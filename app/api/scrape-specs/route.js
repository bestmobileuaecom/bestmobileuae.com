import { NextResponse } from "next/server";

/**
 * GSMArena Specs Scraper API
 * Scrapes phone specifications from GSMArena and formats them
 */

// Map GSMArena spec names to our format
const SPEC_MAPPINGS = {
  // Display
  "Size": "Size",
  "Type": "Type",
  "Resolution": "Resolution",
  "Protection": "Protection",
  
  // Performance
  "Chipset": "Processor",
  "CPU": "CPU",
  "GPU": "GPU",
  "Internal": "Storage",
  
  // Camera
  "Single": "Main",
  "Dual": "Main",
  "Triple": "Main", 
  "Quad": "Main",
  "Features": "Features",
  "Video": "Video",
  
  // Battery - Note: "Type" is duplicate, handled in parsing logic
  "Charging": "Charging",
  
  // Build
  "Weight": "Weight",
  "Build": "Material",
  "SIM": "SIM",
  "Dimensions": "Dimensions",
  
  // Network
  "Technology": "Network",
  "2G bands": "2G",
  "3G bands": "3G",
  "4G bands": "4G",
  "5G bands": "5G",
  
  // Software
  "OS": "OS",
};

// Categories we want to extract
const TARGET_CATEGORIES = {
  "Display": "Display",
  "Platform": "Performance", 
  "Memory": "Performance",
  "Main Camera": "Camera",
  "Selfie camera": "Camera",
  "Battery": "Battery",
  "Body": "Build",
  "Network": "Network",
  "Launch": "Software",
  "Misc": "Software",
};

export async function POST(request) {
  try {
    const { url } = await request.json();

    if (!url || !url.includes("gsmarena.com")) {
      return NextResponse.json(
        { error: "Please provide a valid GSMArena URL" },
        { status: 400 }
      );
    }

    // Fetch the page
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch page: ${response.status}` },
        { status: 500 }
      );
    }

    const html = await response.text();
    
    // Parse specs from HTML
    const specs = parseGSMArenaSpecs(html);
    
    return NextResponse.json({ specs, success: true });
  } catch (error) {
    console.error("Scrape error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to scrape specs" },
      { status: 500 }
    );
  }
}

function parseGSMArenaSpecs(html) {
  const specs = {
    Display: {},
    Performance: {},
    Camera: {},
    Battery: {},
    Build: {},
    Network: {},
    Software: {},
  };

  try {
    // Find all spec tables
    // GSMArena uses <table> with class "specs-brief" or within specs-list
    
    // Extract spec rows using regex patterns
    // Pattern for spec category headers: <th>Category</th>
    // Pattern for spec rows: <td class="ttl"><a>Label</a></td><td class="nfo">Value</td>
    
    // Display specs
    const displayMatch = html.match(/<h2>Display<\/h2>[\s\S]*?<table[\s\S]*?<\/table>/i);
    if (displayMatch) {
      parseSpecTable(displayMatch[0], specs.Display);
    }
    
    // Platform/Performance specs
    const platformMatch = html.match(/<h2>Platform<\/h2>[\s\S]*?<table[\s\S]*?<\/table>/i);
    if (platformMatch) {
      parseSpecTable(platformMatch[0], specs.Performance);
    }
    
    // Memory specs (add to Performance)
    const memoryMatch = html.match(/<h2>Memory<\/h2>[\s\S]*?<table[\s\S]*?<\/table>/i);
    if (memoryMatch) {
      parseSpecTable(memoryMatch[0], specs.Performance);
    }
    
    // Main Camera specs
    const mainCameraMatch = html.match(/<h2>Main Camera<\/h2>[\s\S]*?<table[\s\S]*?<\/table>/i);
    if (mainCameraMatch) {
      parseSpecTable(mainCameraMatch[0], specs.Camera, "main");
    }
    
    // Selfie Camera specs  
    const selfieCameraMatch = html.match(/<h2>Selfie camera<\/h2>[\s\S]*?<table[\s\S]*?<\/table>/i);
    if (selfieCameraMatch) {
      parseSpecTable(selfieCameraMatch[0], specs.Camera, "front");
    }
    
    // Battery specs
    const batteryMatch = html.match(/<h2>Battery<\/h2>[\s\S]*?<table[\s\S]*?<\/table>/i);
    if (batteryMatch) {
      parseSpecTable(batteryMatch[0], specs.Battery);
    }
    
    // Body/Build specs
    const bodyMatch = html.match(/<h2>Body<\/h2>[\s\S]*?<table[\s\S]*?<\/table>/i);
    if (bodyMatch) {
      parseSpecTable(bodyMatch[0], specs.Build);
    }
    
    // Network specs
    const networkMatch = html.match(/<h2>Network<\/h2>[\s\S]*?<table[\s\S]*?<\/table>/i);
    if (networkMatch) {
      parseSpecTable(networkMatch[0], specs.Network);
    }
    
    // Misc/Software specs
    const miscMatch = html.match(/<h2>Misc<\/h2>[\s\S]*?<table[\s\S]*?<\/table>/i);
    if (miscMatch) {
      parseSpecTable(miscMatch[0], specs.Software);
    }

    // Alternative parsing if h2 method didn't work
    // Try to find specs-list div
    if (Object.values(specs).every(cat => Object.keys(cat).length === 0)) {
      parseAlternativeFormat(html, specs);
    }

    // Clean up and format the specs
    return formatSpecs(specs);
  } catch (error) {
    console.error("Parse error:", error);
    return specs;
  }
}

function parseSpecTable(tableHtml, targetObj, prefix = "") {
  // Extract rows: <td class="ttl">...</td><td class="nfo">...</td>
  const rowPattern = /<tr[^>]*>[\s\S]*?<td[^>]*class="[^"]*ttl[^"]*"[^>]*>([\s\S]*?)<\/td>[\s\S]*?<td[^>]*class="[^"]*nfo[^"]*"[^>]*>([\s\S]*?)<\/td>[\s\S]*?<\/tr>/gi;
  
  let match;
  while ((match = rowPattern.exec(tableHtml)) !== null) {
    let label = cleanText(match[1]);
    let value = cleanText(match[2]);
    
    if (label && value) {
      // Apply prefix for camera specs
      if (prefix === "main" && (label.includes("Single") || label.includes("Dual") || label.includes("Triple") || label.includes("Quad"))) {
        targetObj["Main"] = value;
      } else if (prefix === "main" && label === "Video") {
        targetObj["Video"] = value;
      } else if (prefix === "front" && (label.includes("Single") || label.includes("Dual"))) {
        targetObj["Front"] = value;
      } else if (prefix === "main" && label.includes("Wide")) {
        targetObj["Ultra Wide"] = value;
      } else {
        // Map common labels
        const mappedLabel = mapLabel(label);
        targetObj[mappedLabel] = value;
      }
    }
  }
}

function parseAlternativeFormat(html, specs) {
  // Try parsing from specs-list structure
  const specListMatch = html.match(/<div id="specs-list"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/i);
  if (!specListMatch) return;
  
  const specListHtml = specListMatch[0];
  
  // Find all table rows with ttl and nfo classes
  const pattern = /<tr[^>]*>[\s\S]*?<td[^>]*class="[^"]*ttl[^"]*"[^>]*>[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>[\s\S]*?<\/td>[\s\S]*?<td[^>]*class="[^"]*nfo[^"]*"[^>]*>([\s\S]*?)<\/td>[\s\S]*?<\/tr>/gi;
  
  let match;
  let currentCategory = "Build";
  
  while ((match = pattern.exec(specListHtml)) !== null) {
    const label = cleanText(match[1]);
    const value = cleanText(match[2]);
    
    if (label && value) {
      // Determine category based on label
      if (["Size", "Type", "Resolution", "Protection", "Refresh rate"].some(k => label.includes(k))) {
        currentCategory = "Display";
      } else if (["Chipset", "CPU", "GPU", "Internal", "Card slot"].some(k => label.includes(k))) {
        currentCategory = "Performance";
      } else if (["Battery", "Charging", "Type"].some(k => label.includes(k)) && !specs.Battery[label]) {
        currentCategory = "Battery";
      } else if (["Weight", "Dimensions", "Build", "SIM"].some(k => label.includes(k))) {
        currentCategory = "Build";
      } else if (["5G", "4G", "3G", "2G", "Technology", "bands"].some(k => label.includes(k))) {
        currentCategory = "Network";
      } else if (["OS", "Features", "Sensors"].some(k => label.includes(k))) {
        currentCategory = "Software";
      }
      
      const mappedLabel = mapLabel(label);
      if (specs[currentCategory]) {
        specs[currentCategory][mappedLabel] = value;
      }
    }
  }
}

function mapLabel(label) {
  // Clean and map labels to our format
  const cleanLabel = label.replace(/<[^>]*>/g, "").trim();
  
  const mappings = {
    "Chipset": "Processor",
    "Internal": "Storage",
    "Card slot": "Expandable",
    "Dimensions": "Dimensions",
    "Weight": "Weight",
    "Build": "Material",
    "SIM": "SIM",
    "Refresh rate": "Refresh Rate",
    "Peak brightness": "Brightness",
    "Announced": "Announced",
    "Status": "Status",
    "OS": "OS",
    "5G bands": "5G",
    "Speed": "Speed",
  };
  
  return mappings[cleanLabel] || cleanLabel;
}

function cleanText(html) {
  if (!html) return "";
  
  return html
    .replace(/<br\s*\/?>/gi, ", ")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function formatSpecs(specs) {
  const formatted = {};
  
  // Build section
  if (Object.keys(specs.Build).length > 0) {
    formatted.Build = {};
    if (specs.Build.Weight) formatted.Build.Weight = specs.Build.Weight;
    if (specs.Build.Material) formatted.Build.Material = specs.Build.Material;
    if (specs.Build.Dimensions) formatted.Build.Dimensions = specs.Build.Dimensions;
    if (specs.Build.SIM) formatted.Build.SIM = specs.Build.SIM;
    // Check for water resistance in build or elsewhere
    const waterRes = findWaterResistance(specs);
    if (waterRes) formatted.Build["Water Resistance"] = waterRes;
  }
  
  // Camera section
  if (Object.keys(specs.Camera).length > 0) {
    formatted.Camera = {};
    if (specs.Camera.Main) formatted.Camera.Main = specs.Camera.Main;
    if (specs.Camera.Front) formatted.Camera.Front = specs.Camera.Front;
    if (specs.Camera.Video) formatted.Camera.Video = specs.Camera.Video;
    if (specs.Camera["Ultra Wide"]) formatted.Camera["Ultra Wide"] = specs.Camera["Ultra Wide"];
    if (specs.Camera.Features) formatted.Camera.Features = specs.Camera.Features;
  }
  
  // Battery section
  if (Object.keys(specs.Battery).length > 0) {
    formatted.Battery = {};
    // Extract capacity from Type field
    const batteryType = specs.Battery.Type || specs.Battery.Capacity || "";
    const capacityMatch = batteryType.match(/(\d+)\s*mAh/i);
    if (capacityMatch) {
      formatted.Battery.Capacity = capacityMatch[1] + "mAh";
    } else if (batteryType) {
      formatted.Battery.Capacity = batteryType;
    }
    if (specs.Battery.Charging) formatted.Battery.Charging = specs.Battery.Charging;
    // Check for wireless charging
    const hasWireless = (specs.Battery.Charging || "").toLowerCase().includes("wireless");
    formatted.Battery.Wireless = hasWireless ? "Yes" : "No";
  }
  
  // Display section
  if (Object.keys(specs.Display).length > 0) {
    formatted.Display = {};
    if (specs.Display.Size) formatted.Display.Size = specs.Display.Size;
    if (specs.Display.Type) formatted.Display.Type = specs.Display.Type;
    if (specs.Display.Resolution) formatted.Display.Resolution = specs.Display.Resolution;
    if (specs.Display.Brightness) formatted.Display.Brightness = specs.Display.Brightness;
    if (specs.Display["Refresh Rate"]) formatted.Display["Refresh Rate"] = specs.Display["Refresh Rate"];
    if (specs.Display.Protection) formatted.Display.Protection = specs.Display.Protection;
  }
  
  // Network section
  if (Object.keys(specs.Network).length > 0) {
    formatted.Network = {};
    if (specs.Network["5G"]) formatted.Network["5G"] = "Yes (" + specs.Network["5G"].substring(0, 50) + (specs.Network["5G"].length > 50 ? "..." : "") + ")";
    else formatted.Network["5G"] = "No";
    if (specs.Build.SIM) formatted.Network["Dual SIM"] = specs.Build.SIM.toLowerCase().includes("dual") ? "Yes" : specs.Build.SIM;
    formatted.Network["UAE Bands"] = "Check compatibility";
  }
  
  // Software section
  if (Object.keys(specs.Software).length > 0 || specs.Performance.OS) {
    formatted.Software = {};
    if (specs.Performance.OS) formatted.Software.OS = specs.Performance.OS;
    else if (specs.Software.OS) formatted.Software.OS = specs.Software.OS;
    formatted.Software.Updates = "Check manufacturer website";
  }
  
  // Performance section
  if (Object.keys(specs.Performance).length > 0) {
    formatted.Performance = {};
    if (specs.Performance.Processor) formatted.Performance.Processor = specs.Performance.Processor;
    if (specs.Performance.CPU) formatted.Performance.CPU = specs.Performance.CPU;
    if (specs.Performance.GPU) formatted.Performance.GPU = specs.Performance.GPU;
    if (specs.Performance.Storage) {
      const storage = specs.Performance.Storage;
      // Try to extract RAM
      const ramMatch = storage.match(/(\d+)\s*GB\s*RAM/i);
      if (ramMatch) formatted.Performance.RAM = ramMatch[1] + "GB";
      // Extract storage options
      const storageMatch = storage.match(/(\d+GB(?:\s*\/\s*\d+GB)*)/i);
      if (storageMatch) formatted.Performance.Storage = storageMatch[1];
      else formatted.Performance.Storage = storage;
    }
    if (specs.Performance.Expandable) {
      formatted.Performance.Expandable = specs.Performance.Expandable.toLowerCase().includes("no") ? "No" : specs.Performance.Expandable;
    } else {
      formatted.Performance.Expandable = "No";
    }
  }
  
  // Remove empty categories
  Object.keys(formatted).forEach(key => {
    if (Object.keys(formatted[key]).length === 0) {
      delete formatted[key];
    }
  });
  
  return formatted;
}

function findWaterResistance(specs) {
  // Look for IP rating in various places
  const allText = JSON.stringify(specs);
  const ipMatch = allText.match(/IP\d{2}/i);
  if (ipMatch) return ipMatch[0];
  
  // Check Build material/body for water resistance
  if (specs.Build.Material && specs.Build.Material.toLowerCase().includes("water")) {
    return "Water resistant";
  }
  
  return null;
}
