// -------------------------------------------------------------
// All Around Forsyth - Real Data Module
// Coded and developed by Jordan Daniels & DJ Reddish for FBLA Competition 2026
// Verified real data for Forsyth County, Georgia
// -------------------------------------------------------------

export interface Park {
  id: string;
  name: string;
  category: string;
  address: string;
  lat: number;
  lng: number;
  amenities: string[];
  highlight: string;
  image?: string;
  hours?: string;
  phone?: string;
  acreage?: string;
}

export interface Business {
  id: string;
  rank: number;
  name: string;
  category: string;
  address: string;
  lat: number;
  lng: number;
  badge: string;
  description: string;
  image?: string;
  hours?: string;
  phone?: string;
  price?: string;
  website?: string;
}

export interface EventItem {
  id: string;
  title: string;
  location: string;
  date: string;
  time?: string;
  category: string;
  description: string;
  admission?: string;
  image?: string;
}

export interface HistoryEvent {
  year: string;
  title: string;
  description: string;
  image: string;
  category: string;
}

export interface ForsythDataset {
  county: string;
  history: HistoryEvent[];
  parks: Park[];
  businesses: Business[];
  events: EventItem[];
}

export const INITIAL_DATA: ForsythDataset = {
  county: "Forsyth County, Georgia",
  history: [
    {
      year: "1832",
      title: "Establishment of Forsyth County",
      description: "Forsyth County was created by the Georgia General Assembly from Cherokee County territory, named in honor of John Forsyth, 33rd Governor of Georgia and U.S. Secretary of State.",
      image: "/images/Forsyth_County_courthouse.jpg",
      category: "Civic History"
    },
    {
      year: "1901",
      title: "Construction of Poole's Mill Covered Bridge",
      description: "The iconic Town lattice-truss covered bridge was built across Settendown Creek by Bud Gentry. It remains a cherished historical landmark in Ball Ground / Forsyth County.",
      image: "/images/pooles-mill-covered-bridge-1-forsyth-county-ga-photograph-copyright-brian-brown-vanishing-georgia-usa-2022.webp",
      category: "Historical Landmark"
    },
    {
      year: "1956",
      title: "Creation of Lake Lanier & Buford Dam",
      description: "The US Army Corps of Engineers completed Buford Dam on the Chattahoochee River, forming Lake Lanier with nearly 38,000 acres of water surface and 692 miles of shoreline.",
      image: "/images/lake-lanier-boating-fishing_240591beeb8.jpg",
      category: "Geography & Recreation"
    },
    {
      year: "2018 - 2026",
      title: "Modern Commercial & Cultural Growth",
      description: "The opening of Halcyon (2018) and the new Cumming City Center provided Forsyth County with vibrant pedestrian villages, outdoor amphitheaters, and thriving local business hubs.",
      image: "/images/interior-hero.jpg",
      category: "Modern Development"
    }
  ],
  parks: [
    {
      id: "sawnee-mountain",
      name: "Sawnee Mountain Preserve",
      category: "Nature & Hiking",
      address: "4075 Spot Rd, Cumming, GA 30040",
      lat: 34.2403,
      lng: -84.1481,
      amenities: ["Hiking Trails", "Indian Seats Overlook", "Visitor Center", "Climbing Tower", "Tree Canopy"],
      highlight: "960-acre preserve featuring panoramic views of the Blue Ridge Mountains from the Indian Seats.",
      image: "/images/sawnee-mountain.jpg",
      hours: "6:00 AM - 9:30 PM",
      phone: "(770) 781-2217",
      acreage: "963 Acres"
    },
    {
      id: "pooles-mill",
      name: "Poole's Mill Park",
      category: "Historic Landmark & Park",
      address: "7725 Poole's Mill Rd, Ball Ground, GA 30107",
      lat: 34.2921,
      lng: -84.2415,
      amenities: ["Covered Bridge (1901)", "Playground", "Pavilion", "Settendown Creek Access", "Memorial Rock"],
      highlight: "Historic 1901 lattice-truss covered bridge crossing Settendown Creek with nature trails.",
      image: "/images/pooles-mill-covered-bridge-1-forsyth-county-ga-photograph-copyright-brian-brown-vanishing-georgia-usa-2022.webp",
      hours: "Dawn to Dusk",
      phone: "(770) 781-2215",
      acreage: "10 Acres"
    },
    {
      id: "big-creek-greenway",
      name: "Big Creek Greenway",
      category: "Trails & Cycling",
      address: "4110 Carolene Way, Cumming, GA 30040",
      lat: 34.1294,
      lng: -84.2102,
      amenities: ["Paved Multi-use Trail", "Biking", "Running", "Boardwalks", "Wildlife Viewing"],
      highlight: "11+ mile continuous scenic paved trail connecting South Forsyth through wetlands to Alpharetta.",
      image: "/images/greenway.jpg",
      hours: "6:00 AM - 9:30 PM",
      phone: "(770) 781-2215",
      acreage: "11+ Miles"
    },
    {
      id: "central-park",
      name: "Central Park Complex",
      category: "Sports & Recreation",
      address: "2300 Keith Bridge Rd, Cumming, GA 30040",
      lat: 34.2389,
      lng: -84.1132,
      amenities: ["Disc Golf Course", "Dog Park", "Tennis Courts", "Rec Center", "Baseball Fields", "Batting Cages"],
      highlight: "Major 160-acre sports complex featuring 18-hole disc golf, indoor recreation center, and dog park.",
      image: "/images/central-park.jpg",
      hours: "6:00 AM - 10:00 PM",
      phone: "(770) 781-2215",
      acreage: "160 Acres"
    },
    {
      id: "mary-alice-park",
      name: "Mary Alice Park (Lake Lanier)",
      category: "Lake & Water Sports",
      address: "1820 Mary Alice Park Rd, Cumming, GA 30040",
      lat: 34.1951,
      lng: -84.0921,
      amenities: ["Beach & Swimming", "Boat Ramps", "Picnic Pavilions", "Lake Views", "Grills"],
      highlight: "Premier public access park on Lake Lanier with sandy beach, boat ramps, and sunset vistas.",
      image: "/images/mary-alice.jpg",
      hours: "8:00 AM - 9:00 PM",
      phone: "(770) 781-2010",
      acreage: "24 Acres"
    },
    {
      id: "fowler-park",
      name: "Fowler Park",
      category: "Sports & Recreation",
      address: "4110 Carolene Way, Cumming, GA 30040",
      lat: 34.1287,
      lng: -84.2144,
      amenities: ["Skate Park", "Synthetic Turf Fields", "Indoor Gym", "Dog Park", "Track & Greenway Link"],
      highlight: "85-acre mega-park with premier concrete skate park, multi-sport turf fields, and rec center.",
      image: "/images/fowler-park.jpg",
      hours: "6:00 AM - 10:00 PM",
      phone: "(770) 781-2152",
      acreage: "85 Acres"
    },
    {
      id: "shakerag-park",
      name: "Shakerag Park",
      category: "Nature & Athletic",
      address: "10945 Rogers Bridge Rd, Suwanee, GA 30024",
      lat: 34.0543,
      lng: -84.1451,
      amenities: ["3.5-Acre Fishing Lake", "Nature Trails", "Picnic Pavilion", "Cricket Pitch", "Playground"],
      highlight: "Picturesque park with a peaceful fishing lake, shaded woodland trails, and athletic fields.",
      image: "/images/shakerag-park.jpg",
      hours: "Dawn to Dusk",
      phone: "(770) 781-2215",
      acreage: "66 Acres"
    },
    {
      id: "midway-park",
      name: "Midway Park",
      category: "Sports & Community",
      address: "5100 Post Rd, Cumming, GA 30040",
      lat: 34.1528,
      lng: -84.2251,
      amenities: ["Baseball Diamonds", "Tennis Courts", "Walking Track", "Playground", "Community Building"],
      highlight: "Classic community park with lighted tennis and baseball complexes and soft walking track.",
      image: "/images/midway-park.jpg",
      hours: "6:00 AM - 10:00 PM",
      phone: "(770) 781-2215",
      acreage: "42 Acres"
    },
    {
      id: "caney-creek-preserve",
      name: "Caney Creek Preserve",
      category: "Nature & Conservation",
      address: "2755 Caney Rd, Cumming, GA 30040",
      lat: 34.1162,
      lng: -84.1953,
      amenities: ["1.2-Mile Woodland Trail", "Dog Park", "Natural Amphitheater", "Archaeology Walk"],
      highlight: "Quiet passive preserve with scenic bridges, native wildflower gardens, and off-leash dog run.",
      image: "/images/caney-creek.jpg",
      hours: "Dawn to Dusk",
      phone: "(770) 781-2215",
      acreage: "63 Acres"
    },
    {
      id: "charleston-park",
      name: "Charleston Park (Lake Lanier)",
      category: "Boating & Lake Recreation",
      address: "5850 Charleston Park Rd, Cumming, GA 30041",
      lat: 34.2589,
      lng: -84.0412,
      amenities: ["Deep Water Boat Ramp", "Mountain Bike Trails", "Fishing Docks", "Picnic Area"],
      highlight: "Popular boat launch on northern Lake Lanier with challenging single-track mountain bike loops.",
      image: "/images/charleston-park.jpg",
      hours: "24/7 Boat Launch Access",
      phone: "(770) 781-2215",
      acreage: "40 Acres"
    }
  ],
  businesses: [
    {
      id: "halcyon",
      rank: 1,
      name: "Halcyon Forsyth",
      category: "Mixed-Use / Dining & Retail",
      address: "6365 Halcyon Way, Alpharetta, GA 30005",
      lat: 34.1118,
      lng: -84.2235,
      badge: "Top Destination",
      description: "135-acre village featuring 30+ restaurants, Market Hall, local boutiques, dog friendly patios, and direct Big Creek Greenway access.",
      image: "/images/interior-hero.jpg",
      hours: "Mon-Sat 10AM-10PM, Sun 11AM-7PM",
      phone: "(770) 410-6000",
      price: "$$",
      website: "https://visithalcyon.com"
    },
    {
      id: "cumming-city-center",
      rank: 2,
      name: "Cumming City Center",
      category: "Downtown Civic & Dining Hub",
      address: "435 Canton Rd, Cumming, GA 30040",
      lat: 34.2081,
      lng: -84.1432,
      badge: "New Civic Landmark",
      description: "Downtown Cumming's vibrant centerpiece featuring the Lou Sobh Amphitheater, local dining (Tam's Backstage, Village Italian), fountains, and miniature golf.",
      image: "/images/cumming-city-center.jpg",
      hours: "Daily 8AM-11PM",
      phone: "(770) 781-2010",
      price: "$$",
      website: "https://cummingcitycenter.com"
    },
    {
      id: "dutch-monkey-doughnuts",
      rank: 3,
      name: "Dutch Monkey Doughnuts",
      category: "Bakery & Café",
      address: "3075 Ronald Reagan Blvd, Cumming, GA 30041",
      lat: 34.1362,
      lng: -84.1528,
      badge: "Food Network Champion",
      description: "Nationally acclaimed scratch bakery featured on Food Network's Donut Showdown, serving handcrafted artisan doughnuts, cinnamon buns, and locally roasted espresso.",
      image: "/images/dutch-monkey-doughnuts.jpg",
      hours: "Wed-Fri 7AM-12PM, Sat-Sun 7AM-2PM",
      phone: "(770) 418-0801",
      price: "$",
      website: "https://dutchmonkeydoughnuts.com"
    },
    {
      id: "cherry-street-brewing",
      rank: 4,
      name: "Cherry Street Brewing",
      category: "Craft Brewery & Taproom",
      address: "5810 Bond St, Cumming, GA 30040 (Vickery Village)",
      lat: 34.1521,
      lng: -84.2095,
      badge: "Award Winning",
      description: "Homegrown Forsyth brewpub and culinary kitchen named U.S. Open Beer Championship Best Small Brewery, serving farm-fresh pub favorites.",
      hours: "Mon-Thu 11AM-10PM, Fri-Sat 11AM-11PM",
      phone: "(770) 205-5544",
      price: "$$",
      website: "https://cherrystreetbrewing.com"
    },
    {
      id: "collection-at-forsyth",
      rank: 5,
      name: "The Collection at Forsyth",
      category: "Shopping & Entertainment",
      address: "410 Peachtree Pkwy, Cumming, GA 30041",
      lat: 34.1512,
      lng: -84.1554,
      badge: "Premier Retail",
      description: "Open-air lifestyle shopping center featuring AMC 12 Theatres, outdoor concert pavilion, Barnes & Noble, and dining spots like Taco Mac and Ted's Montana Grill.",
      image: "/images/collection-at-forsyth.jpg",
      hours: "Mon-Sat 10AM-9PM, Sun 12PM-6PM",
      phone: "(770) 781-0555",
      price: "$$",
      website: "https://collectionforsyth.com"
    },
    {
      id: "maries-italian-deli",
      rank: 6,
      name: "Marie's Italian Deli & Market",
      category: "Authentic Italian Deli",
      address: "580 Atlanta Rd, Cumming, GA 30040",
      lat: 34.1985,
      lng: -84.1412,
      badge: "Locals' Favorite",
      description: "Family-owned landmark serving authentic New York-style hot subs, imported Italian meats, handmade cannolis, and homemade lasagna for over two decades.",
      image: "/images/maries-deli.jpg",
      hours: "Mon-Thu 7AM-8PM, Fri-Sat 7AM-9PM, Sun Closed",
      phone: "(770) 886-0084",
      price: "$",
      website: "https://mariesitaliandeli.com"
    },
    {
      id: "tams-backstage",
      rank: 7,
      name: "Tam's Backstage",
      category: "Historic Fine Dining",
      address: "215 Ingram Ave, Cumming, GA 30040",
      lat: 34.2045,
      lng: -84.1390,
      badge: "Historic Landmark Dining",
      description: "Fine dining located in Cumming's historic 1923 Schoolhouse, known for prime steaks, fresh seafood, pasta dishes, and warm Southern hospitality.",
      image: "/images/tams-backstage.jpg",
      hours: "Mon-Thu 11AM-9PM, Fri-Sat 11AM-9:30PM, Sun Closed",
      phone: "(678) 455-8310",
      price: "$$$",
      website: "https://tamsbackstage.com"
    },
    {
      id: "vickery-village",
      rank: 8,
      name: "Vickery Village",
      category: "Pedestrian Town Center",
      address: "5920 Post Rd, Cumming, GA 30040",
      lat: 34.1531,
      lng: -84.2105,
      badge: "Charming Architecture",
      description: "Charming European-inspired pedestrian village with local boutique retail, fitness studios, independent restaurants, and seasonal outdoor movie nights.",
      hours: "Daily 9AM-10PM",
      phone: "(770) 656-1188",
      price: "$$",
      website: "https://vickeryvillageshops.com"
    },
    {
      id: "giorgios-kitchen",
      rank: 9,
      name: "Giorgio's Family Kitchen",
      category: "Greek & Italian Cuisine",
      address: "558 Lakeland Plaza, Cumming, GA 30040",
      lat: 34.2041,
      lng: -84.1287,
      badge: "Family Owned",
      description: "Hearty Greek and Italian family recipes including souvlaki platters, gyro wraps, baked ziti, and warm spanakopita served in generous portions.",
      image: "/images/giorgios.jpg",
      hours: "Mon-Sat 11AM-9PM",
      phone: "(770) 781-4525",
      price: "$$",
      website: "https://eatatgiorgios.com"
    },
    {
      id: "atlanta-motorsports-park",
      rank: 10,
      name: "Atlanta Motorsports Park",
      category: "Automotive & Kart Racing",
      address: "20 Duck Thurmond Rd, Dawsonville, GA 30534",
      lat: 34.3685,
      lng: -84.1751,
      badge: "F1-Designed Circuit",
      description: "World-class motorsports club designed by Formula 1 architect Hermann Tilke featuring high-speed outdoor rental karting, track days, and driving schools.",
      hours: "Tue-Sun 9AM-6PM",
      phone: "(678) 381-8527",
      price: "$$$",
      website: "https://atlantamotorsportspark.com"
    }
  ],
  events: [
    {
      id: "cumming-fair",
      title: "Cumming Country Fair & Festival",
      location: "Cumming Fairgrounds (235 Castleberry Rd, Cumming)",
      date: "October 8 - 18, 2026",
      time: "Gates Open 4:00 PM Daily (10:00 AM Weekends)",
      category: "Community Festival",
      admission: "$10 Adults, Kids Under 10 Free",
      image: "/images/cumming-fairgrounds.jpg",
      description: "11 days of carnival rides, national concert headliners, historic Heritage Village living exhibits, petting zoo, and agricultural competitions."
    },
    {
      id: "tastes-of-forsyth",
      title: "Tastes of Forsyth Annual Food Festival",
      location: "Cumming Fairgrounds Arena",
      date: "April 18, 2027",
      time: "11:00 AM - 5:00 PM",
      category: "Culinary & Family",
      admission: "Free Admission (Tasting tickets $1-$5)",
      image: "/images/cumming-fairgrounds.jpg",
      description: "Over 35 Forsyth County restaurants and food trucks serve sample tastings alongside live local acoustic bands and children's inflatables."
    },
    {
      id: "halcyon-farmers-market",
      title: "Halcyon Weekly Community Farmers Market",
      location: "Halcyon Event Green (6365 Halcyon Way)",
      date: "Every Tuesday (April - November)",
      time: "4:00 PM - 7:00 PM",
      category: "Farmers Market",
      admission: "Free Admission",
      image: "/images/interior-hero.jpg",
      description: "Over 40 regional vendors with fresh organic produce, artisanal cheeses, wildflower honey, homemade sourdough, flowers, and live music."
    },
    {
      id: "steam-engine-parade",
      title: "Cumming 4th of July Historic Steam Engine Parade",
      location: "Downtown Cumming Courthouse to Fairgrounds",
      date: "July 4, 2027",
      time: "Parade 10:00 AM | Fireworks at 9:30 PM",
      category: "Independence Day Civic",
      admission: "Free Admission",
      image: "/images/Forsyth_County_courthouse.jpg",
      description: "Historic annual tradition featuring antique steam engines, classic cars, marching bands, food vendors, and massive fireworks display."
    },
    {
      id: "city-center-concerts",
      title: "Cumming City Center Live Concert Series",
      location: "Lou Sobh Amphitheater (435 Canton Rd)",
      date: "3rd Saturday of Each Month (May - October)",
      time: "7:00 PM - 10:00 PM",
      category: "Concerts & Music",
      admission: "Free (Lawn Seating)",
      image: "/images/cumming-city-center.jpg",
      description: "Free outdoor concerts under the stars featuring tribute bands, Southern rock, and jazz ensembles. Food trucks and cold beverages on site."
    },
    {
      id: "sawnee-trail-run",
      title: "Sawnee Mountain Indian Seats 5K & Eco-Festival",
      location: "Sawnee Mountain Preserve (Spot Rd Access)",
      date: "September 19, 2026",
      time: "8:00 AM - 1:00 PM",
      category: "Outdoors & Athletics",
      admission: "$30 Registration (Proceeds benefit conservation)",
      image: "/images/sawnee-mountain.jpg",
      description: "Challenging trail run winding up to the summit of the Indian Seats followed by guided tree-canopy walks and wildlife demonstrations."
    },
    {
      id: "fbla-leadership-rally",
      title: "Forsyth County FBLA Business Leadership Summit",
      location: "Alliance Academy for Innovation Auditorium",
      date: "November 14, 2026",
      time: "9:00 AM - 3:00 PM",
      category: "FBLA & Youth Leadership",
      admission: "FBLA Members & Guests",
      description: "County-wide student business conference bringing together chapter leaders from across Forsyth County for case competitions and keynote speakers."
    },
    {
      id: "lake-lanier-holiday-parade",
      title: "Lake Lanier Holiday Lighted Boat Parade",
      location: "Mary Alice Park Overlook & Margaritaville",
      date: "December 5, 2026",
      time: "5:30 PM - 8:30 PM",
      category: "Holiday Tradition",
      admission: "Free Public Viewing at Shoreline",
      image: "/images/mary-alice.jpg",
      description: "Dozens of festively illuminated yachts, pontoons, and cruisers sail past the shoreline to celebrate the holidays on Lake Lanier."
    }
  ]
};

// Local storage helper functions for Admin Panel persistence
export function getStoredData(): ForsythDataset {
  if (typeof window === "undefined") return INITIAL_DATA;
  try {
    const data = localStorage.getItem("all_around_forsyth_data");
    if (data) {
      const parsed = JSON.parse(data);
      // Ensure all lists exist
      if (parsed.parks && parsed.businesses && parsed.events) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Error reading local storage", e);
  }
  return INITIAL_DATA;
}

export function saveStoredData(data: ForsythDataset) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("all_around_forsyth_data", JSON.stringify(data));
  } catch (e) {
    console.error("Error saving local storage", e);
  }
}

export function resetToDefaultData(): ForsythDataset {
  if (typeof window !== "undefined") {
    localStorage.removeItem("all_around_forsyth_data");
  }
  return INITIAL_DATA;
}
