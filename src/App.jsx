import { useEffect, useMemo, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './styles.css';

const coreBathrooms = [
  {
    id: '1',
    name: 'Main Library Restroom',
    address: '100 Larkin St, San Francisco, CA',
    latitude: 37.7793,
    longitude: -122.4159,
    cleanlinessRating: 4,
    accessType: 'Public',
    notes: 'Near lobby. Usually clean daytime.',
    hasChangingTable: true,
    isWheelchairAccessible: true,
    isFavorite: true,
    openHours: 'Mon-Sat 9:00 AM-6:00 PM · Sun 12:00 PM-5:00 PM',
  },
  {
    id: '2',
    name: 'Ferry Building Bathroom',
    address: '1 Ferry Building, San Francisco, CA',
    latitude: 37.7955,
    longitude: -122.3937,
    cleanlinessRating: 5,
    accessType: 'Public',
    notes: 'Busy weekends, easy to find.',
    hasChangingTable: true,
    isWheelchairAccessible: true,
    isFavorite: false,
    openHours: 'Daily 7:00 AM-10:00 PM',
  },
  {
    id: '3',
    name: 'Coffee Corner',
    address: 'Market St, San Francisco, CA',
    latitude: 37.7858,
    longitude: -122.4064,
    cleanlinessRating: 3,
    accessType: 'Customer only',
    notes: 'Ask staff for code.',
    hasChangingTable: false,
    isWheelchairAccessible: false,
    isFavorite: false,
    openHours: 'Daily 8:00 AM-6:00 PM',
  },
  {
    id: '4',
    name: 'Blue Bottle Coffee Hayes Valley',
    address: '315 Linden St, San Francisco, CA',
    latitude: 37.7764,
    longitude: -122.4231,
    cleanlinessRating: 4,
    accessType: 'Customer only',
    notes: 'Best in mornings.',
    hasChangingTable: false,
    isWheelchairAccessible: true,
    isFavorite: false,
    openHours: 'Daily 7:00 AM-6:00 PM',
  },
  {
    id: '5',
    name: 'Sightglass Coffee Mission',
    address: '3014 20th St, San Francisco, CA',
    latitude: 37.7597,
    longitude: -122.4115,
    cleanlinessRating: 4,
    accessType: 'Customer only',
    notes: 'Ask at counter.',
    hasChangingTable: false,
    isWheelchairAccessible: false,
    isFavorite: false,
    openHours: 'Daily 7:00 AM-7:00 PM',
  },
  {
    id: '6',
    name: 'Whole Foods Market SoMa',
    address: '399 4th St, San Francisco, CA',
    latitude: 37.7802,
    longitude: -122.3992,
    cleanlinessRating: 4,
    accessType: 'Public',
    notes: 'Near prepared foods area.',
    hasChangingTable: true,
    isWheelchairAccessible: true,
    isFavorite: true,
    openHours: 'Daily 8:00 AM-9:00 PM',
  },
  {
    id: '7',
    name: "Trader Joe's Nob Hill",
    address: '1095 Hyde St, San Francisco, CA',
    latitude: 37.7908,
    longitude: -122.4173,
    cleanlinessRating: 3,
    accessType: 'Customer only',
    notes: 'Small restroom. Ask staff.',
    hasChangingTable: false,
    isWheelchairAccessible: false,
    isFavorite: false,
    openHours: 'Daily 8:00 AM-9:00 PM',
  },
  {
    id: '8',
    name: 'Berkeley Bowl West',
    address: '920 Heinz Ave, Berkeley, CA',
    latitude: 37.8531,
    longitude: -122.2915,
    cleanlinessRating: 4,
    accessType: 'Public',
    notes: 'Front area signs clear.',
    hasChangingTable: true,
    isWheelchairAccessible: true,
    isFavorite: false,
    openHours: 'Daily 9:00 AM-8:00 PM',
  },
  {
    id: '9',
    name: 'Philz Coffee Rockridge',
    address: '6310 College Ave, Oakland, CA',
    latitude: 37.8499,
    longitude: -122.2523,
    cleanlinessRating: 3,
    accessType: 'Code required',
    notes: 'Code often on receipt.',
    hasChangingTable: false,
    isWheelchairAccessible: true,
    isFavorite: false,
    openHours: 'Daily 6:30 AM-7:00 PM',
  },
  {
    id: '10',
    name: 'Target Stonestown Restroom',
    address: '3251 20th Ave, San Francisco, CA',
    latitude: 37.7287,
    longitude: -122.4762,
    cleanlinessRating: 4,
    accessType: 'Public',
    notes: 'Inside main store near escalators.',
    hasChangingTable: true,
    isWheelchairAccessible: true,
    isFavorite: false,
    openHours: 'Daily 8:00 AM-10:00 PM',
  },
  {
    id: '11',
    name: 'Safeway Marina',
    address: '15 Marina Blvd, San Francisco, CA',
    latitude: 37.8061,
    longitude: -122.4322,
    cleanlinessRating: 3,
    accessType: 'Public',
    notes: 'Back of store.',
    hasChangingTable: false,
    isWheelchairAccessible: true,
    isFavorite: false,
    openHours: 'Daily 6:00 AM-11:00 PM',
  },
  {
    id: '12',
    name: 'Peets Coffee Inner Sunset',
    address: '1240 9th Ave, San Francisco, CA',
    latitude: 37.7642,
    longitude: -122.4661,
    cleanlinessRating: 4,
    accessType: 'Customer only',
    notes: 'Single stall. Fast stop.',
    hasChangingTable: false,
    isWheelchairAccessible: false,
    isFavorite: false,
    openHours: 'Daily 6:00 AM-6:00 PM',
  },
  {
    id: '13',
    name: 'Golden Gate Park Music Concourse',
    address: '50 Hagiwara Tea Garden Dr, San Francisco, CA',
    latitude: 37.7701,
    longitude: -122.4687,
    cleanlinessRating: 3,
    accessType: 'Public',
    notes: 'Outdoor public restroom.',
    hasChangingTable: false,
    isWheelchairAccessible: true,
    isFavorite: false,
    openHours: 'Daily 8:00 AM-6:00 PM',
  },
  {
    id: '14',
    name: 'Starbucks Embarcadero Center',
    address: '2 Embarcadero Center, San Francisco, CA',
    latitude: 37.7948,
    longitude: -122.3971,
    cleanlinessRating: 3,
    accessType: 'Code required',
    notes: 'Ask cashier for code.',
    hasChangingTable: false,
    isWheelchairAccessible: true,
    isFavorite: false,
    openHours: 'Mon-Fri 5:30 AM-7:00 PM · Sat-Sun 6:00 AM-6:00 PM',
  },
  {
    id: '15',
    name: 'Costco South San Francisco',
    address: '1600 El Camino Real, South San Francisco, CA',
    latitude: 37.6637,
    longitude: -122.4399,
    cleanlinessRating: 4,
    accessType: 'Public',
    notes: 'Large restroom near food court.',
    hasChangingTable: true,
    isWheelchairAccessible: true,
    isFavorite: false,
    openHours: 'Mon-Fri 10:00 AM-8:30 PM · Sat-Sun 9:30 AM-7:00 PM',
  },
  {
    id: '16',
    name: 'Oakland Public Library Main',
    address: '125 14th St, Oakland, CA',
    latitude: 37.8033,
    longitude: -122.2708,
    cleanlinessRating: 4,
    accessType: 'Public',
    notes: 'Near first floor lobby.',
    hasChangingTable: true,
    isWheelchairAccessible: true,
    isFavorite: false,
    openHours: 'Tue-Sat 10:00 AM-5:30 PM',
  },
  {
    id: '17',
    name: 'Blue Bottle Coffee Oakland',
    address: '300 Webster St, Oakland, CA',
    latitude: 37.7965,
    longitude: -122.2773,
    cleanlinessRating: 4,
    accessType: 'Customer only',
    notes: 'Clean, one restroom.',
    hasChangingTable: false,
    isWheelchairAccessible: true,
    isFavorite: false,
    openHours: 'Daily 7:00 AM-5:00 PM',
  },
  {
    id: '18',
    name: 'Whole Foods Berkeley',
    address: '1025 Gilman St, Berkeley, CA',
    latitude: 37.8796,
    longitude: -122.2963,
    cleanlinessRating: 4,
    accessType: 'Public',
    notes: 'Near cafe seating.',
    hasChangingTable: true,
    isWheelchairAccessible: true,
    isFavorite: false,
    openHours: 'Daily 8:00 AM-9:00 PM',
  },
  {
    id: '19',
    name: 'Trader Joe’s Berkeley',
    address: '1885 University Ave, Berkeley, CA',
    latitude: 37.8711,
    longitude: -122.2729,
    cleanlinessRating: 3,
    accessType: 'Customer only',
    notes: 'Ask crew if locked.',
    hasChangingTable: false,
    isWheelchairAccessible: true,
    isFavorite: false,
    openHours: 'Daily 8:00 AM-9:00 PM',
  },
  {
    id: '20',
    name: 'Peets Coffee Downtown Berkeley',
    address: '2124 Vine St, Berkeley, CA',
    latitude: 37.8801,
    longitude: -122.2698,
    cleanlinessRating: 3,
    accessType: 'Customer only',
    notes: 'Code on receipt some days.',
    hasChangingTable: false,
    isWheelchairAccessible: false,
    isFavorite: false,
    openHours: 'Daily 6:00 AM-6:00 PM',
  },
  {
    id: '21',
    name: 'Rockridge Market Hall',
    address: '5655 College Ave, Oakland, CA',
    latitude: 37.8433,
    longitude: -122.2519,
    cleanlinessRating: 4,
    accessType: 'Public',
    notes: 'Shared market restroom.',
    hasChangingTable: false,
    isWheelchairAccessible: true,
    isFavorite: false,
    openHours: 'Daily 8:00 AM-8:00 PM',
  },
  {
    id: '22',
    name: 'Temescal Alley Restroom',
    address: '482 49th St, Oakland, CA',
    latitude: 37.8365,
    longitude: -122.2646,
    cleanlinessRating: 3,
    accessType: 'Customer only',
    notes: 'Behind coffee counter area.',
    hasChangingTable: false,
    isWheelchairAccessible: false,
    isFavorite: false,
    openHours: 'Daily 7:00 AM-5:00 PM',
  },
  {
    id: '23',
    name: 'Jack London Square Restroom',
    address: '472 Water St, Oakland, CA',
    latitude: 37.7952,
    longitude: -122.2777,
    cleanlinessRating: 3,
    accessType: 'Paid',
    notes: 'Near ferry and promenade.',
    hasChangingTable: false,
    isWheelchairAccessible: true,
    isFavorite: false,
    openHours: 'Daily 8:00 AM-8:00 PM',
  },
  {
    id: '24',
    name: 'San Leandro Marina Park',
    address: '14001 Monarch Bay Dr, San Leandro, CA',
    latitude: 37.6946,
    longitude: -122.1936,
    cleanlinessRating: 3,
    accessType: 'Public',
    notes: 'Good daytime stop.',
    hasChangingTable: false,
    isWheelchairAccessible: true,
    isFavorite: false,
    openHours: 'Daily 7:00 AM-7:00 PM',
  },
  {
    id: '25',
    name: 'Philz Coffee Downtown San Jose',
    address: '118 Paseo de San Antonio, San Jose, CA',
    latitude: 37.3334,
    longitude: -121.8891,
    cleanlinessRating: 4,
    accessType: 'Customer only',
    notes: 'Quiet mornings.',
    hasChangingTable: false,
    isWheelchairAccessible: true,
    isFavorite: false,
    openHours: 'Daily 6:00 AM-6:00 PM',
  },
  {
    id: '26',
    name: 'Whole Foods Palo Alto',
    address: '774 Emerson St, Palo Alto, CA',
    latitude: 37.4448,
    longitude: -122.1617,
    cleanlinessRating: 4,
    accessType: 'Public',
    notes: 'Back of store, upstairs area.',
    hasChangingTable: true,
    isWheelchairAccessible: true,
    isFavorite: false,
    openHours: 'Daily 8:00 AM-9:00 PM',
  },
  {
    id: '27',
    name: 'Stanford Shopping Center Restroom',
    address: '660 Stanford Shopping Center, Palo Alto, CA',
    latitude: 37.4436,
    longitude: -122.1705,
    cleanlinessRating: 5,
    accessType: 'Public',
    notes: 'Large, clean mall restroom.',
    hasChangingTable: true,
    isWheelchairAccessible: true,
    isFavorite: false,
    openHours: 'Daily 10:00 AM-8:00 PM',
  },
  {
    id: '28',
    name: 'Redwood City Public Library',
    address: '1044 Middlefield Rd, Redwood City, CA',
    latitude: 37.4864,
    longitude: -122.2315,
    cleanlinessRating: 4,
    accessType: 'Public',
    notes: 'Near main entrance.',
    hasChangingTable: true,
    isWheelchairAccessible: true,
    isFavorite: false,
    openHours: 'Mon-Sat 10:00 AM-5:00 PM',
  },
  {
    id: '29',
    name: 'Peets Coffee Walnut Creek',
    address: '1343 Locust St, Walnut Creek, CA',
    latitude: 37.9062,
    longitude: -122.0657,
    cleanlinessRating: 3,
    accessType: 'Customer only',
    notes: 'Single restroom, usually code lock.',
    hasChangingTable: false,
    isWheelchairAccessible: true,
    isFavorite: false,
    openHours: 'Daily 6:00 AM-6:00 PM',
  },
];

const generatedBathroomTemplates = [
  ['McDonalds', 'Customer only', 'Fast food restroom. Ask staff if keypad locked.', 'Daily 5:00 AM-11:00 PM', 3, false, true],
  ['Burger King', 'Customer only', 'Fast food stop with indoor restroom.', 'Daily 6:00 AM-10:00 PM', 3, false, true],
  ['Taco Bell', 'Customer only', 'Restroom near dining area.', 'Daily 7:00 AM-11:00 PM', 3, false, true],
  ['KFC', 'Customer only', 'Counter-service restroom.', 'Daily 10:00 AM-10:00 PM', 3, false, false],
  ['Wendys', 'Customer only', 'Usually open during meal hours.', 'Daily 10:00 AM-10:00 PM', 3, false, true],
  ['Subway', 'Customer only', 'Small restroom, code sometimes needed.', 'Daily 7:00 AM-9:00 PM', 3, false, false],
  ['Chipotle', 'Customer only', 'Restroom inside dining room.', 'Daily 10:45 AM-10:00 PM', 4, false, true],
  ['Panda Express', 'Customer only', 'Quick stop inside restaurant.', 'Daily 10:00 AM-9:30 PM', 3, false, true],
  ['Target', 'Public', 'Store restroom near front or fitting rooms.', 'Daily 8:00 AM-10:00 PM', 4, true, true],
  ['Walmart', 'Public', 'Large store restroom near front.', 'Daily 6:00 AM-11:00 PM', 3, true, true],
  ['Costco', 'Public', 'Large restroom near food court.', 'Mon-Fri 10:00 AM-8:30 PM · Sat-Sun 9:30 AM-7:00 PM', 4, true, true],
  ['Safeway', 'Public', 'Grocery restroom in back half of store.', 'Daily 6:00 AM-11:00 PM', 3, false, true],
  ['Trader Joes', 'Customer only', 'Ask crew if locked.', 'Daily 8:00 AM-9:00 PM', 3, false, true],
  ['Whole Foods', 'Public', 'Market restroom near cafe or prepared foods.', 'Daily 8:00 AM-9:00 PM', 4, true, true],
  ['Westfield Mall', 'Public', 'Mall restroom near food court.', 'Daily 10:00 AM-8:00 PM', 4, true, true],
  ['BART Station', 'Paid', 'Station restroom. Availability can vary.', 'Daily 6:00 AM-9:00 PM', 2, false, true],
  ['Starbucks', 'Code required', 'Ask cashier for code.', 'Daily 5:30 AM-7:00 PM', 3, false, true],
  ['In N Out Burger', 'Customer only', 'Dining room restroom.', 'Daily 10:30 AM-1:00 AM', 4, false, true],
  ['Shake Shack', 'Customer only', 'Modern fast food restroom.', 'Daily 11:00 AM-10:00 PM', 4, false, true],
  ['Macys Mall Restroom', 'Public', 'Department store restroom upstairs.', 'Daily 10:00 AM-8:00 PM', 4, true, true],
];

const generatedBathroomSeeds = [
  ['Mission District', 'San Francisco, CA', 37.7599, -122.4148],
  ['SoMa', 'San Francisco, CA', 37.7785, -122.4056],
  ['Civic Center', 'San Francisco, CA', 37.7793, -122.4175],
  ['Inner Sunset', 'San Francisco, CA', 37.7636, -122.4662],
  ['Richmond District', 'San Francisco, CA', 37.7808, -122.4827],
  ['Stonestown', 'San Francisco, CA', 37.7287, -122.4762],
  ['Embarcadero', 'San Francisco, CA', 37.7952, -122.3939],
  ['Marina', 'San Francisco, CA', 37.803, -122.4368],
  ['Daly City', 'CA', 37.6879, -122.4702],
  ['South San Francisco', 'CA', 37.6547, -122.4077],
  ['San Bruno', 'CA', 37.6305, -122.4111],
  ['Millbrae', 'CA', 37.5985, -122.3868],
  ['Burlingame', 'CA', 37.5779, -122.3481],
  ['San Mateo', 'CA', 37.563, -122.3255],
  ['Redwood City', 'CA', 37.4852, -122.2364],
  ['Palo Alto', 'CA', 37.4419, -122.143],
  ['Mountain View', 'CA', 37.3861, -122.0839],
  ['Sunnyvale', 'CA', 37.3688, -122.0363],
  ['Santa Clara', 'CA', 37.3541, -121.9552],
  ['Downtown San Jose', 'CA', 37.3382, -121.8863],
  ['Cupertino', 'CA', 37.3229, -122.0322],
  ['Fremont', 'CA', 37.5483, -121.9886],
  ['Union City', 'CA', 37.5934, -122.0438],
  ['Hayward', 'CA', 37.6688, -122.0808],
  ['San Leandro', 'CA', 37.7249, -122.1561],
  ['Downtown Oakland', 'CA', 37.8044, -122.2711],
  ['Jack London Square', 'Oakland, CA', 37.7956, -122.277],
  ['Temescal', 'Oakland, CA', 37.837, -122.262],
  ['Rockridge', 'Oakland, CA', 37.8446, -122.2514],
  ['Berkeley', 'CA', 37.8715, -122.273],
  ['El Cerrito', 'CA', 37.9158, -122.3119],
  ['Richmond', 'CA', 37.9358, -122.3477],
  ['Walnut Creek', 'CA', 37.9101, -122.0652],
  ['Pleasant Hill', 'CA', 37.9479, -122.0608],
  ['Concord', 'CA', 37.978, -122.0311],
  ['Martinez', 'CA', 38.0194, -122.1341],
  ['Vallejo', 'CA', 38.1041, -122.2566],
  ['Fairfield', 'CA', 38.2494, -122.039],
  ['Livermore', 'CA', 37.6819, -121.768],
  ['Dublin', 'CA', 37.7021, -121.9358],
];

const generatedBathrooms = generatedBathroomSeeds.flatMap((seed, seedIndex) =>
  generatedBathroomTemplates.slice(0, seedIndex < 20 ? 3 : 2).map((template, templateIndex) => {
    const [name, accessType, notes, openHours, cleanlinessRating, hasChangingTable, isWheelchairAccessible] = template;
    const [district, cityState, latitude, longitude] = seed;
    const offsetLat = latitude + (templateIndex - 1) * 0.0064 + (seedIndex % 3) * 0.0011;
    const offsetLng = longitude + (templateIndex - 1) * 0.0072 - (seedIndex % 4) * 0.0013;

    return {
      id: String(30 + seedIndex * 3 + templateIndex),
      name: `${name} ${district}`,
      address: `${district}, ${cityState}`,
      latitude: Number(offsetLat.toFixed(4)),
      longitude: Number(offsetLng.toFixed(4)),
      cleanlinessRating,
      accessType,
      notes,
      hasChangingTable,
      isWheelchairAccessible,
      isFavorite: false,
      openHours,
    };
  }),
);

const bathroomsSeed = [...coreBathrooms, ...generatedBathrooms];

const baseSearchPlaces = [
  { label: 'San Francisco', latitude: 37.7749, longitude: -122.4194 },
  { label: 'Oakland', latitude: 37.8044, longitude: -122.2711 },
  { label: 'Berkeley', latitude: 37.8715, longitude: -122.273 },
  { label: 'Mission District', latitude: 37.7599, longitude: -122.4148 },
  { label: 'Hayes Valley', latitude: 37.7767, longitude: -122.4233 },
  { label: 'Ferry Building', latitude: 37.7955, longitude: -122.3937 },
  { label: 'SoMa', latitude: 37.7785, longitude: -122.4056 },
  { label: 'Nob Hill', latitude: 37.793, longitude: -122.4161 },
  { label: 'Rockridge', latitude: 37.8446, longitude: -122.2514 },
  { label: 'Palo Alto', latitude: 37.4419, longitude: -122.143 },
  { label: 'San Jose', latitude: 37.3382, longitude: -121.8863 },
  { label: 'Walnut Creek', latitude: 37.9101, longitude: -122.0652 },
];

function distanceInMiles(from, bathroom) {
  if (!from) return null;
  const earthRadiusMiles = 3958.8;
  const toRadians = (value) => (value * Math.PI) / 180;
  const latDistance = toRadians(bathroom.latitude - from.latitude);
  const lonDistance = toRadians(bathroom.longitude - from.longitude);
  const startLat = toRadians(from.latitude);
  const endLat = toRadians(bathroom.latitude);
  const a =
    Math.sin(latDistance / 2) ** 2 +
    Math.cos(startLat) * Math.cos(endLat) * Math.sin(lonDistance / 2) ** 2;

  return earthRadiusMiles * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function getReviewCount(rating) {
  return rating * 24 + 32;
}

function findPlace(query, bathrooms) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return null;

  const exactPlace = baseSearchPlaces.find((place) => place.label.toLowerCase().includes(normalized));
  if (exactPlace) return exactPlace;

  const bathroomMatch = bathrooms.find(
    (bathroom) =>
      bathroom.name.toLowerCase().includes(normalized) ||
      bathroom.address.toLowerCase().includes(normalized),
  );

  if (!bathroomMatch) return null;

  return {
    label: bathroomMatch.name,
    latitude: bathroomMatch.latitude,
    longitude: bathroomMatch.longitude,
  };
}

function Stars({ rating }) {
  return (
    <span className="stars" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, index) => (
        <span key={index}>{index < rating ? '★' : '☆'}</span>
      ))}
    </span>
  );
}

function useDesktop() {
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia('(min-width: 980px)').matches,
  );

  useEffect(() => {
    const query = window.matchMedia('(min-width: 980px)');
    const update = () => setIsDesktop(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return isDesktop;
}

function getMapStyle(theme) {
  if (theme === 'playful') {
    return {
      version: 8,
      sources: {
        light: {
          type: 'raster',
          tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
          tileSize: 256,
          attribution: '© OpenStreetMap contributors',
        },
      },
      layers: [{ id: 'light', type: 'raster', source: 'light' }],
    };
  }

  return {
    version: 8,
    sources: {
      dark: {
        type: 'raster',
        tiles: ['https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'],
        tileSize: 256,
        attribution: '© OpenStreetMap contributors © CARTO',
      },
    },
    layers: [{ id: 'dark', type: 'raster', source: 'dark' }],
  };
}

function BathroomMap({
  bathrooms,
  selectedBathroom,
  searchCenter,
  userLocation,
  mapTheme,
  onSelect,
}) {
  const mapNode = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const userMarkerRef = useRef(null);

  useEffect(() => {
    if (!mapNode.current || mapRef.current) return;

    mapRef.current = new maplibregl.Map({
      container: mapNode.current,
      style: getMapStyle(mapTheme),
      center: [-122.4194, 37.7793],
      zoom: 10.35,
      attributionControl: false,
    });

    mapRef.current.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'bottom-right');

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.setStyle(getMapStyle(mapTheme));
  }, [mapTheme]);

  useEffect(() => {
    if (!mapRef.current) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    bathrooms.forEach((bathroom) => {
      const markerNode = document.createElement('button');
      markerNode.className = `map-marker ${selectedBathroom?.id === bathroom.id ? 'is-selected' : ''}`;
      markerNode.type = 'button';
      markerNode.textContent = '🚽';
      markerNode.setAttribute('aria-label', bathroom.name);
      markerNode.addEventListener('click', () => onSelect(bathroom));

      const popup = new maplibregl.Popup({ offset: 28 }).setHTML(`
        <div class="map-popup">
          <strong>${bathroom.name}</strong>
          <span>${bathroom.address}</span>
          <em>${bathroom.openHours}</em>
        </div>
      `);

      const marker = new maplibregl.Marker({ element: markerNode, anchor: 'bottom' })
        .setLngLat([bathroom.longitude, bathroom.latitude])
        .setPopup(popup)
        .addTo(mapRef.current);

      markersRef.current.push(marker);
    });
  }, [bathrooms, selectedBathroom, onSelect]);

  useEffect(() => {
    if (!mapRef.current) return;

    userMarkerRef.current?.remove();
    userMarkerRef.current = null;

    if (!userLocation) return;

    const userNode = document.createElement('div');
    userNode.className = 'user-marker';
    userNode.innerHTML = '<span></span>';

    userMarkerRef.current = new maplibregl.Marker({ element: userNode })
      .setLngLat([userLocation.longitude, userLocation.latitude])
      .addTo(mapRef.current);
  }, [userLocation]);

  useEffect(() => {
    if (!mapRef.current || bathrooms.length === 0) return;

    const focusPoint = userLocation || searchCenter || selectedBathroom;
    if (focusPoint) {
      mapRef.current.flyTo({
        center: [focusPoint.longitude, focusPoint.latitude],
        zoom: userLocation ? 13.1 : searchCenter ? 12.4 : 11.4,
        speed: 0.85,
        curve: 1.4,
        essential: true,
      });
      return;
    }

    const bounds = new maplibregl.LngLatBounds();
    bathrooms.forEach((bathroom) => bounds.extend([bathroom.longitude, bathroom.latitude]));
    mapRef.current.fitBounds(bounds, {
      padding: 72,
      maxZoom: 10.8,
      duration: 900,
    });
  }, [bathrooms, searchCenter, selectedBathroom, userLocation]);

  return <div className="map" ref={mapNode} />;
}

export default function App() {
  const [bathrooms, setBathrooms] = useState(bathroomsSeed);
  const [selectedBathroom, setSelectedBathroom] = useState(bathroomsSeed[0]);
  const [searchCenter, setSearchCenter] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [searchText, setSearchText] = useState('');
  const defaultNotice = `${bathroomsSeed.length} bathrooms across Bay Area`;
  const [notice, setNotice] = useState(defaultNotice);
  const [activeView, setActiveView] = useState('all');
  const [desktopTheme, setDesktopTheme] = useState('playful');
  useDesktop();
  const isPlayfulTheme = desktopTheme === 'playful';

  const visibleBathrooms = useMemo(() => {
    const source = activeView === 'favorites' ? bathrooms.filter((bathroom) => bathroom.isFavorite) : bathrooms;
    if (!searchCenter && !userLocation) return source;

    const referencePoint = userLocation || searchCenter;
    return source
      .map((bathroom) => ({
        ...bathroom,
        distance: distanceInMiles(referencePoint, bathroom),
      }))
      .sort((first, second) => first.distance - second.distance);
  }, [activeView, bathrooms, searchCenter, userLocation]);

  useEffect(() => {
    if (visibleBathrooms.length === 0) return;
    const hasSelectedVisible = visibleBathrooms.some((bathroom) => bathroom.id === selectedBathroom?.id);
    if (!hasSelectedVisible) setSelectedBathroom(visibleBathrooms[0]);
  }, [visibleBathrooms, selectedBathroom]);

  const selectedVisibleBathroom =
    visibleBathrooms.find((bathroom) => bathroom.id === selectedBathroom?.id) || visibleBathrooms[0] || null;

  function toggleFavorite(id) {
    setBathrooms((current) =>
      current.map((bathroom) =>
        bathroom.id === id ? { ...bathroom, isFavorite: !bathroom.isFavorite } : bathroom,
      ),
    );
  }

  function searchAddress(event) {
    event?.preventDefault();
    const match = findPlace(searchText, bathrooms);

    if (!match) {
      setNotice('Try city, neighborhood, coffee shop, market, or library');
      return;
    }

    setUserLocation(null);
    setSearchCenter(match);
    setActiveView('all');

    const nearest = [...bathrooms]
      .map((bathroom) => ({ ...bathroom, distance: distanceInMiles(match, bathroom) }))
      .sort((first, second) => first.distance - second.distance)[0];

    if (nearest) setSelectedBathroom(nearest);
    setNotice(`Near ${match.label}`);
  }

  function locateUser() {
    if (!navigator.geolocation) {
      setNotice('Location not available in this browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          label: 'Your location',
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        setUserLocation(location);
        setSearchCenter(null);
        setActiveView('all');

        const nearest = [...bathrooms]
          .map((bathroom) => ({ ...bathroom, distance: distanceInMiles(location, bathroom) }))
          .sort((first, second) => first.distance - second.distance)[0];

        if (nearest) setSelectedBathroom(nearest);
        setNotice('Showing bathrooms near you');
      },
      () => setNotice('Location blocked. Search place instead.'),
      { enableHighAccuracy: true, timeout: 12000 },
    );
  }

  function clearMapFocus() {
    setSearchCenter(null);
    setUserLocation(null);
    setNotice(defaultNotice);
  }

  return (
    <main className={`app-shell ${isPlayfulTheme ? 'playful-desktop' : ''}`}>
      <section className="map-stage">
        <header className="topbar">
          <div className="brand">
            <span className="logo">🚽</span>
            <span>Bathroom Buddy</span>
          </div>

          <div className="topbar-actions">
            <button className="round-action theme-action" type="button" onClick={() => setDesktopTheme((current) => (current === 'playful' ? 'dark' : 'playful'))} aria-label="Toggle dark mode">
              <span>{isPlayfulTheme ? '☾' : '☼'}</span>
            </button>
            <button className="locate-button" type="button" onClick={locateUser} aria-label="Locate me">
              <span>◎</span>
              <span>Locate me</span>
            </button>
          </div>
        </header>

        <BathroomMap
          bathrooms={visibleBathrooms}
          selectedBathroom={selectedVisibleBathroom}
          searchCenter={searchCenter}
          userLocation={userLocation}
          mapTheme={isPlayfulTheme ? 'playful' : 'dark'}
          onSelect={setSelectedBathroom}
        />

        <form className="floating-search" onSubmit={searchAddress}>
          <span className="search-icon">⌕</span>
          <input
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Search city, neighborhood, or place"
            aria-label="Search city, neighborhood, or place"
          />
          <button type="button" aria-label="Clear search" onClick={clearMapFocus}>
            ⟲
          </button>
        </form>
      </section>

      <aside className="nearby-drawer">
        <div className="drawer-handle" />
        <div className="drawer-title-row">
          <div>
            <h1>{activeView === 'favorites' ? 'Favorite bathrooms' : 'Nearby bathrooms'}</h1>
            <p>{notice}</p>
          </div>
          <button
            type="button"
            className="filter-chip"
            aria-label="Show favorite bathrooms"
            onClick={() => setActiveView((current) => (current === 'favorites' ? 'all' : 'favorites'))}
          >
            {activeView === 'favorites' ? '♥' : '♡'}
          </button>
        </div>

        {selectedVisibleBathroom ? (
          <div className="selected-card">
            <div className="bathroom-drop">💧</div>
            <div>
              <h2>{selectedVisibleBathroom.name}</h2>
              <p>{selectedVisibleBathroom.address}</p>
              <strong>{selectedVisibleBathroom.openHours}</strong>
              <div className="meta-line">
                <Stars rating={selectedVisibleBathroom.cleanlinessRating} />
                <span>({getReviewCount(selectedVisibleBathroom.cleanlinessRating)})</span>
                <span className="badge">{selectedVisibleBathroom.accessType}</span>
              </div>
            </div>
            <button
              className="heart-button icon-button"
              type="button"
              aria-label="Favorite bathroom"
              onClick={() => toggleFavorite(selectedVisibleBathroom.id)}
            >
              {selectedVisibleBathroom.isFavorite ? '♥' : '♡'}
            </button>
          </div>
        ) : null}

        <div className="nearby-list">
          {visibleBathrooms.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">🚽</span>
              <strong>No favorites yet</strong>
              <p>Tap heart on bathroom to save it here.</p>
            </div>
          ) : (
            visibleBathrooms.map((bathroom) => (
              <div
                className={`bathroom-row ${selectedBathroom?.id === bathroom.id ? 'active' : ''}`}
                key={bathroom.id}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedBathroom(bathroom)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    setSelectedBathroom(bathroom);
                  }
                }}
              >
                <span className="bathroom-drop small">💧</span>
                <span className="row-main">
                  <span className="row-title">{bathroom.name}</span>
                  <span className="row-address">{bathroom.address}</span>
                  <span className="row-hours">
                    {bathroom.distance ? `${bathroom.distance.toFixed(1)} mi · ` : ''}
                    {bathroom.openHours}
                  </span>
                  <span className="row-rating">
                    <Stars rating={bathroom.cleanlinessRating} />
                    <span>({getReviewCount(bathroom.cleanlinessRating)})</span>
                  </span>
                </span>
                <span className="row-side">
                  <button
                    className="heart icon-button"
                    type="button"
                    aria-label={`Favorite ${bathroom.name}`}
                    onClick={(event) => {
                      event.stopPropagation();
                      toggleFavorite(bathroom.id);
                    }}
                  >
                    {bathroom.isFavorite ? '♥' : '♡'}
                  </button>
                  <span className="badge">{bathroom.accessType}</span>
                </span>
              </div>
            ))
          )}
        </div>

        <nav className="bottom-nav" aria-label="Primary">
          <button
            className={activeView === 'all' && !searchCenter && !userLocation ? 'active' : ''}
            type="button"
            onClick={() => {
              setActiveView('all');
              clearMapFocus();
            }}
          >
            <span>▰</span>
            <span className="nav-label">Map</span>
          </button>
          <button className={activeView === 'all' ? 'active' : ''} type="button" onClick={() => setActiveView('all')}>
            <span>☷</span>
            <span className="nav-label">List</span>
          </button>
          <button
            className={activeView === 'favorites' ? 'active' : ''}
            type="button"
            onClick={() => setActiveView('favorites')}
          >
            <span>♡</span>
            <span className="nav-label">Saved</span>
          </button>
        </nav>
      </aside>
    </main>
  );
}
