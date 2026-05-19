import React, { useEffect, useMemo, useState } from 'react';
import { MapcnMap } from './MapcnMap.jsx';
import { supabase, supabaseEnabled } from './supabaseClient.js';

const version = 'v2.5.0';

const navItems = [
  ['Command Board', 'grid'],
  ['Incidents', 'alert'],
  ['Fleet Health', 'pulse'],
  ['Assets', 'car'],
  ['Troubleshooting', 'tool'],
  ['Tickets Map', 'pin'],
  ['Weather', 'cloud'],
  ['Finance', 'wallet'],
  ['Milestones', 'flag'],
  ['Settings', 'settings'],
];

const locationsSeed = [
  { city: 'San Francisco', state: 'CA', issues: 42, severity: 'Critical', x: 16, y: 52, lng: -122.4194, lat: 37.7749, cost: 18420, open: 7 },
  { city: 'Los Angeles', state: 'CA', issues: 33, severity: 'High', x: 20, y: 66, lng: -118.2437, lat: 34.0522, cost: 14280, open: 6 },
  { city: 'Seattle', state: 'WA', issues: 21, severity: 'Medium', x: 18, y: 22, lng: -122.3321, lat: 47.6062, cost: 9820, open: 4 },
  { city: 'Denver', state: 'CO', issues: 18, severity: 'Low', x: 43, y: 42, lng: -104.9903, lat: 39.7392, cost: 7640, open: 3 },
  { city: 'Austin', state: 'TX', issues: 24, severity: 'Medium', x: 51, y: 66, lng: -97.7431, lat: 30.2672, cost: 11240, open: 4 },
  { city: 'Miami', state: 'FL', issues: 13, severity: 'Low', x: 72, y: 78, lng: -80.1918, lat: 25.7617, cost: 5420, open: 2 },
  { city: 'New York', state: 'NY', issues: 29, severity: 'High', x: 82, y: 36, lng: -74.006, lat: 40.7128, cost: 13310, open: 5 },
];

const incidentSeed = [
  { id: 'AVT-9421', title: 'Hard brake near protected bike lane', city: 'San Francisco', owner: 'Planning', severity: 'S1', age: '07m', state: 'Live triage' },
  { id: 'AVT-9418', title: 'Thermal camera dropout at dusk', city: 'Los Angeles', owner: 'Sensors', severity: 'S1', age: '13m', state: 'Owner assigned' },
  { id: 'AVT-9414', title: 'Late cone classification in work zone', city: 'Seattle', owner: 'Perception', severity: 'S2', age: '19m', state: 'Replay queued' },
  { id: 'AVT-9409', title: 'Stale closure map on frontage road', city: 'Austin', owner: 'Maps', severity: 'S2', age: '41m', state: 'Monitoring' },
  { id: 'AVT-9402', title: 'Remote assist latency over threshold', city: 'Miami', owner: 'Operations', severity: 'S3', age: '1h', state: 'Waiting vendor' },
];

const ticketTypes = ['Planning', 'Sensors', 'Perception', 'Operations', 'Maps', 'Compute'];

const ticketSeed = [
  { id: 'TM-3012', city: 'San Francisco', severity: 'S1', type: 'Perception', title: 'Pedestrian misclass near curb cut' },
  { id: 'TM-3016', city: 'San Francisco', severity: 'S2', type: 'Sensors', title: 'Camera exposure swing at sunset' },
  { id: 'TM-3019', city: 'San Francisco', severity: 'S3', type: 'Maps', title: 'Workzone lanelet mismatch' },
  { id: 'TM-3021', city: 'Los Angeles', severity: 'S1', type: 'Planning', title: 'Aggressive merge fallback' },
  { id: 'TM-3024', city: 'Los Angeles', severity: 'S2', type: 'Sensors', title: 'Radar dropout burst' },
  { id: 'TM-3029', city: 'Seattle', severity: 'S2', type: 'Operations', title: 'Remote assist call volume spike' },
  { id: 'TM-3031', city: 'Seattle', severity: 'S3', type: 'Compute', title: 'GPU thermal throttling warning' },
  { id: 'TM-3034', city: 'Denver', severity: 'S3', type: 'Maps', title: 'Speed limit data stale' },
  { id: 'TM-3039', city: 'Austin', severity: 'S2', type: 'Perception', title: 'Cone tracking drift in construction' },
  { id: 'TM-3044', city: 'Austin', severity: 'S1', type: 'Planning', title: 'Hard brake near crosswalk' },
  { id: 'TM-3048', city: 'Miami', severity: 'S3', type: 'Sensors', title: 'LiDAR reflectivity noise in rain' },
  { id: 'TM-3052', city: 'Miami', severity: 'S2', type: 'Operations', title: 'Dispatch handoff delay' },
  { id: 'TM-3056', city: 'New York', severity: 'S1', type: 'Operations', title: 'Blocked lane incident escalation' },
  { id: 'TM-3059', city: 'New York', severity: 'S2', type: 'Perception', title: 'Occlusion confidence drop downtown' },
];

const weatherSeed = [
  {
    city: 'San Francisco',
    state: 'CA',
    now: { tempF: 62, cond: 'Fog', windMph: 12, precip: 0, icon: 'fog' },
    next: [
      { day: 'Mon', hi: 64, lo: 54, cond: 'Fog' },
      { day: 'Tue', hi: 66, lo: 55, cond: 'Clouds' },
      { day: 'Wed', hi: 68, lo: 56, cond: 'Sun' },
      { day: 'Thu', hi: 65, lo: 55, cond: 'Wind' },
      { day: 'Fri', hi: 67, lo: 56, cond: 'Sun' },
      { day: 'Sat', hi: 63, lo: 54, cond: 'Fog' },
      { day: 'Sun', hi: 64, lo: 55, cond: 'Clouds' },
    ],
  },
  {
    city: 'Los Angeles',
    state: 'CA',
    now: { tempF: 73, cond: 'Sun', windMph: 9, precip: 0, icon: 'sun' },
    next: [
      { day: 'Mon', hi: 76, lo: 60, cond: 'Sun' },
      { day: 'Tue', hi: 77, lo: 61, cond: 'Sun' },
      { day: 'Wed', hi: 75, lo: 60, cond: 'Clouds' },
      { day: 'Thu', hi: 74, lo: 59, cond: 'Sun' },
      { day: 'Fri', hi: 78, lo: 61, cond: 'Sun' },
      { day: 'Sat', hi: 79, lo: 62, cond: 'Sun' },
      { day: 'Sun', hi: 76, lo: 60, cond: 'Wind' },
    ],
  },
  {
    city: 'Seattle',
    state: 'WA',
    now: { tempF: 58, cond: 'Rain', windMph: 15, precip: 40, icon: 'rain' },
    next: [
      { day: 'Mon', hi: 61, lo: 49, cond: 'Rain' },
      { day: 'Tue', hi: 60, lo: 48, cond: 'Clouds' },
      { day: 'Wed', hi: 62, lo: 49, cond: 'Showers' },
      { day: 'Thu', hi: 63, lo: 50, cond: 'Clouds' },
      { day: 'Fri', hi: 64, lo: 50, cond: 'Sun' },
      { day: 'Sat', hi: 62, lo: 49, cond: 'Clouds' },
      { day: 'Sun', hi: 60, lo: 48, cond: 'Rain' },
    ],
  },
  {
    city: 'Denver',
    state: 'CO',
    now: { tempF: 66, cond: 'Wind', windMph: 19, precip: 10, icon: 'wind' },
    next: [
      { day: 'Mon', hi: 70, lo: 45, cond: 'Wind' },
      { day: 'Tue', hi: 72, lo: 46, cond: 'Sun' },
      { day: 'Wed', hi: 68, lo: 44, cond: 'Storms' },
      { day: 'Thu', hi: 65, lo: 43, cond: 'Clouds' },
      { day: 'Fri', hi: 69, lo: 44, cond: 'Sun' },
      { day: 'Sat', hi: 71, lo: 46, cond: 'Sun' },
      { day: 'Sun', hi: 67, lo: 44, cond: 'Wind' },
    ],
  },
  {
    city: 'Austin',
    state: 'TX',
    now: { tempF: 81, cond: 'Heat', windMph: 11, precip: 0, icon: 'heat' },
    next: [
      { day: 'Mon', hi: 84, lo: 66, cond: 'Heat' },
      { day: 'Tue', hi: 86, lo: 67, cond: 'Heat' },
      { day: 'Wed', hi: 83, lo: 65, cond: 'Storms' },
      { day: 'Thu', hi: 82, lo: 64, cond: 'Clouds' },
      { day: 'Fri', hi: 85, lo: 66, cond: 'Heat' },
      { day: 'Sat', hi: 86, lo: 67, cond: 'Sun' },
      { day: 'Sun', hi: 84, lo: 66, cond: 'Sun' },
    ],
  },
  {
    city: 'Miami',
    state: 'FL',
    now: { tempF: 84, cond: 'Storms', windMph: 14, precip: 55, icon: 'storm' },
    next: [
      { day: 'Mon', hi: 86, lo: 74, cond: 'Storms' },
      { day: 'Tue', hi: 85, lo: 74, cond: 'Showers' },
      { day: 'Wed', hi: 86, lo: 75, cond: 'Sun' },
      { day: 'Thu', hi: 87, lo: 75, cond: 'Showers' },
      { day: 'Fri', hi: 86, lo: 74, cond: 'Storms' },
      { day: 'Sat', hi: 85, lo: 74, cond: 'Sun' },
      { day: 'Sun', hi: 84, lo: 73, cond: 'Showers' },
    ],
  },
  {
    city: 'New York',
    state: 'NY',
    now: { tempF: 64, cond: 'Clouds', windMph: 10, precip: 15, icon: 'clouds' },
    next: [
      { day: 'Mon', hi: 66, lo: 52, cond: 'Clouds' },
      { day: 'Tue', hi: 68, lo: 54, cond: 'Showers' },
      { day: 'Wed', hi: 70, lo: 55, cond: 'Sun' },
      { day: 'Thu', hi: 67, lo: 54, cond: 'Clouds' },
      { day: 'Fri', hi: 65, lo: 53, cond: 'Rain' },
      { day: 'Sat', hi: 69, lo: 55, cond: 'Sun' },
      { day: 'Sun', hi: 66, lo: 54, cond: 'Clouds' },
    ],
  },
];

const assetsSeed = [
  { tag: 'AV-204', city: 'San Francisco', health: 87, miles: 118420, status: 'Investigate', battery: 71 },
  { tag: 'AV-118', city: 'Los Angeles', health: 93, miles: 91480, status: 'On route', battery: 84 },
  { tag: 'AV-077', city: 'Seattle', health: 91, miles: 96510, status: 'Ready', battery: 88 },
  { tag: 'AV-331', city: 'Austin', health: 79, miles: 73680, status: 'Service bay', battery: 64 },
  { tag: 'AV-419', city: 'Miami', health: 96, miles: 62410, status: 'Ready', battery: 91 },
];

const milestonesSeed = [
  { name: 'Q2 2025 Safety Milestone', detail: 'Reduce critical incidents by 15%', due: 'May 10, 2025', progress: 100, state: 'Completed', tone: 'green' },
  { name: 'LA Expansion Phase 2', detail: 'Deploy 50 additional vehicles', due: 'Jun 04, 2025', progress: 68, state: 'In progress', tone: 'cyan' },
  { name: 'System Uptime Target', detail: 'Achieve 99.9% uptime', due: 'Jun 11, 2025', progress: 92, state: 'In progress', tone: 'amber' },
  { name: 'Q2 Cost Optimization', detail: 'Reduce cost per mile by 8%', due: 'Jun 28, 2025', progress: 0, state: 'Pending', tone: 'muted' },
];

const financeRows = [
  { label: 'Energy', cost: 24850, delta: '-3.1%', tone: 'green' },
  { label: 'Maintenance', cost: 18420, delta: '+6.2%', tone: 'red' },
  { label: 'Operations', cost: 28960, delta: '-2.8%', tone: 'green' },
  { label: 'Overhead', cost: 14420, delta: '-7.0%', tone: 'green' },
];

const ticketStates = [
  ['In Progress', 47, 'amber'],
  ['Active', 23, 'blue'],
];

const troubleshootingRuns = [
  { step: 'Replay bundle', system: 'Perception', owner: 'M. Chen', status: 'Ready', eta: '2 min', confidence: 96 },
  { step: 'Sensor drift scan', system: 'Sensors', owner: 'A. Reed', status: 'Running', eta: '8 min', confidence: 84 },
  { step: 'Route trace compare', system: 'Planning', owner: 'S. Patel', status: 'Queued', eta: '13 min', confidence: 78 },
  { step: 'Map diff review', system: 'Maps', owner: 'J. Torres', status: 'Blocked', eta: 'Needs owner', confidence: 61 },
];

const financeTrends = [
  { day: 'Mon', cost: 79200, miles: 212000, cpm: 0.37 },
  { day: 'Tue', cost: 81400, miles: 224000, cpm: 0.36 },
  { day: 'Wed', cost: 83800, miles: 238000, cpm: 0.35 },
  { day: 'Thu', cost: 82100, miles: 231000, cpm: 0.36 },
  { day: 'Fri', cost: 86650, miles: 249000, cpm: 0.35 },
];

const metrics = [
  { label: 'Critical', value: 12, delta: '+3', tone: 'red', points: '0,34 8,20 16,36 24,31 32,38 40,22 48,26 56,14 64,25 72,8 80,18 88,12 96,24' },
  { label: 'High', value: 28, delta: '+5', tone: 'orange', points: '0,39 8,25 16,33 24,28 32,32 40,18 48,28 56,15 64,22 72,10 80,17 88,6 96,22' },
  { label: 'Medium', value: 43, delta: '-2', tone: 'amber', points: '0,34 8,30 16,27 24,18 32,24 40,12 48,19 56,8 64,15 72,23 80,28 88,33 96,38' },
  { label: 'Low', value: 67, delta: '-8', tone: 'blue', points: '0,32 8,20 16,31 24,16 32,24 40,12 48,8 56,18 64,22 72,17 80,26 88,21 96,25' },
  { label: 'Total Incidents', value: 150, delta: '+2', tone: 'slate', points: '0,39 8,35 16,37 24,30 32,34 40,26 48,29 56,20 64,15 72,19 80,10 88,16 96,20' },
];

function formatClock(date) {
  return {
    time: new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(date),
    date: new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date),
  };
}

function formatIncidentAge(ageMinutes) {
  if (ageMinutes >= 60) return `${Math.round(ageMinutes / 60)}h`;
  return `${String(ageMinutes).padStart(2, '0')}m`;
}

function toIncidentView(row) {
  return {
    id: row.ticket_id,
    title: row.title,
    city: row.city,
    owner: row.owner,
    severity: row.severity,
    age: formatIncidentAge(row.age_minutes),
    state: row.status,
    aiSummary: row.ai_summary,
    recommendedActions: Array.isArray(row.recommended_actions) ? row.recommended_actions : [],
  };
}

async function getDashboardData() {
  if (!supabaseEnabled || !supabase) return null;

  const [locationResult, assetResult, milestoneResult, incidentResult, ticketResult] = await Promise.all([
    supabase.from('center_console_locations').select('city,state,issue_count,severity,daily_cost,map_x,map_y').order('issue_count', { ascending: false }),
    supabase.from('center_console_assets').select('asset_tag,health_score,mileage,status,center_console_locations(city)').order('health_score', { ascending: true }),
    supabase.from('center_console_milestones').select('name,milestone_type,due_on,progress').order('due_on', { ascending: true }),
    supabase.from('center_console_incidents').select('ticket_id,title,city,owner,severity,status,age_minutes,ai_summary,recommended_actions').order('created_at', { ascending: false }),
    supabase.from('center_console_tickets').select('ticket_id,city,severity,ticket_type,title,status').order('created_at', { ascending: false }),
  ]);

  const firstError = [locationResult, assetResult, milestoneResult, incidentResult, ticketResult].find((result) => result.error)?.error;
  if (firstError) throw firstError;

  return {
    locations: locationResult.data || [],
    assets: assetResult.data || [],
    milestones: milestoneResult.data || [],
    incidents: incidentResult.data || [],
    tickets: ticketResult.data || [],
  };
}

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [sessionReady, setSessionReady] = useState(!supabaseEnabled);
  const [authStatus, setAuthStatus] = useState('Demo mode active');
  const [authEmail, setAuthEmail] = useState('ops-admin@avfleet.com');
  const [authPassword, setAuthPassword] = useState('center-console-demo');
  const [registerDraft, setRegisterDraft] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [accountDraft, setAccountDraft] = useState({
    password: '',
    confirmPassword: '',
  });
  const [active, setActive] = useState('Command Board');
  const [theme, setTheme] = useState('dark');
  const [now, setNow] = useState(() => new Date());
  const [settingsTab, setSettingsTab] = useState('Updates');
  const [updates, setUpdates] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(locationsSeed[0]);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [feedbackStatus, setFeedbackStatus] = useState('Ready');
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [locations, setLocations] = useState(locationsSeed);
  const [assets, setAssets] = useState(assetsSeed);
  const [milestones, setMilestones] = useState(milestonesSeed);
  const [incidents, setIncidents] = useState(incidentSeed);
  const [tickets, setTickets] = useState(ticketSeed);
  const [aiSummary, setAiSummary] = useState('AI is correlating ticket velocity, fleet drift, maintenance cost, and milestone risk across all active AV locations.');

  useEffect(() => {
    let mounted = true;
    async function hydrateFromSupabase() {
      if (!supabaseEnabled) {
        setFeedbackStatus('Demo data online');
        return;
      }

      try {
        const data = await getDashboardData();

        if (!mounted) return;
        if (data?.locations?.length) {
          const nextLocations = data.locations.map((row) => ({
            city: row.city,
            state: row.state,
            issues: row.issue_count,
            severity: row.severity,
            x: row.map_x,
            y: row.map_y,
            lng: locationsSeed.find((item) => item.city === row.city)?.lng,
            lat: locationsSeed.find((item) => item.city === row.city)?.lat,
            cost: Number(row.daily_cost),
            open: Math.max(1, Math.round(row.issue_count / 7)),
          }));
          setLocations(nextLocations);
          setSelectedLocation(nextLocations[0]);
        }
        if (data?.assets?.length) {
          setAssets(data.assets.map((row) => ({
            tag: row.asset_tag,
            city: row.center_console_locations?.city || 'Unassigned',
            health: row.health_score,
            miles: row.mileage,
            status: row.status,
            battery: Math.min(98, Math.max(42, row.health_score - 4)),
          })));
        }
        if (data?.milestones?.length) {
          setMilestones(data.milestones.map((row) => ({
            name: row.name,
            detail: row.milestone_type === 'Mileage' ? 'Mileage accumulation target' : `${row.milestone_type} program target`,
            due: new Date(`${row.due_on}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            progress: row.progress,
            state: row.progress === 100 ? 'Completed' : row.progress > 0 ? 'In progress' : 'Pending',
            tone: row.progress === 100 ? 'green' : row.milestone_type === 'Finance' ? 'amber' : 'cyan',
          })));
        }
        if (data?.incidents?.length) {
          setIncidents(data.incidents.map(toIncidentView));
        }
        if (data?.tickets?.length) {
          setTickets(data.tickets.map((row) => ({
            id: row.ticket_id,
            city: row.city,
            severity: row.severity,
            type: row.ticket_type,
            title: row.title,
            status: row.status,
          })));
        }
        setFeedbackStatus('Supabase live');
      } catch {
        setFeedbackStatus('Demo data online');
      }
    }

    hydrateFromSupabase();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!supabaseEnabled || !supabase) return undefined;

    let subscribed = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!subscribed) return;
      setLoggedIn(Boolean(data.session));
      setAuthEmail(data.session?.user?.email || 'ops-admin@avfleet.com');
      setSessionReady(true);
      setAuthStatus(data.session ? 'Signed in with Supabase' : 'Sign in with Supabase');
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoggedIn(Boolean(session));
      setAuthEmail(session?.user?.email || 'ops-admin@avfleet.com');
      setSessionReady(true);
    });

    return () => {
      subscribed = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const clock = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(clock);
  }, []);

  const dailyCost = financeRows.reduce((sum, item) => sum + item.cost, 0);
  const totalMileage = assets.reduce((sum, asset) => sum + asset.miles, 0);
  const hotspot = useMemo(() => [...locations].sort((a, b) => b.issues - a.issues)[0], [locations]);
  const operationalCount = assets.filter((asset) => asset.health >= 90).length * 49 + 52;
  const clock = formatClock(now);
  const pageProps = {
    active,
    assets,
    dailyCost,
    feedbackStatus,
    financeRows,
    hotspot,
    incidents,
    locations,
    milestones,
    operationalCount,
    selectedLocation,
    setActive,
    setAssets,
    setIncidents,
    setSelectedLocation,
    setSettingsTab,
    tickets,
    setTheme,
    setUpdates,
    settingsTab,
    theme,
    totalMileage,
    updates,
  };

  const alerts = useMemo(() => ([
    { tone: 'red', title: 'S1 hard brake flagged', meta: 'San Francisco • 7m ago' },
    { tone: 'amber', title: 'Maintenance queue growing', meta: 'Austin • 22m ago' },
    { tone: 'green', title: 'Remote assist latency normal', meta: 'All regions • 41m ago' },
    { tone: 'blue', title: 'Map update deployed', meta: 'Phoenix • 1h ago' },
  ]), []);

  function runAiBrief() {
    const expensive = [...financeRows].sort((a, b) => b.cost - a.cost)[0];
    const riskMilestone = [...milestones].filter((item) => item.progress < 100).sort((a, b) => a.progress - b.progress)[0];
    setAiSummary(
      `AI brief: ${hotspot.city} is the highest issue cluster with ${hotspot.issues} open signals. ${expensive.label} is the largest daily fleet cost at $${expensive.cost.toLocaleString()}. Move replay review to ${hotspot.city}, inspect degraded assets below 85 health, and unblock "${riskMilestone.name}" before the next shift.`
    );
  }

  function openAccount() {
    setActive('Settings');
    setSettingsTab('Account');
    setAccountOpen(true);
    setAlertsOpen(false);
  }

  async function logout() {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setAccountOpen(false);
    setAlertsOpen(false);
    setFeedbackOpen(false);
    setRegisterOpen(false);
    setActive('Command Board');
    setSettingsTab('Updates');
    setLoggedIn(false);
  }

  useEffect(() => {
    setMobileNavOpen(false);
  }, [active]);

  async function signIn(event) {
    event.preventDefault();
    if (!supabaseEnabled || !supabase) {
      setLoggedIn(true);
      return;
    }

    setAuthStatus('Signing in...');
    const { error } = await supabase.auth.signInWithPassword({
      email: authEmail.trim(),
      password: authPassword,
    });

    if (error) {
      setAuthStatus(error.message);
      return;
    }

    setAuthStatus('Signed in with Supabase');
  }

  async function registerAccount(event) {
    event.preventDefault();
    if (registerDraft.password !== registerDraft.confirmPassword) {
      setAuthStatus('Passwords do not match');
      return;
    }

    if (!supabaseEnabled || !supabase) {
      setRegisterOpen(false);
      setLoggedIn(true);
      return;
    }

    setAuthStatus('Creating account...');
    const { error } = await supabase.auth.signUp({
      email: registerDraft.email.trim(),
      password: registerDraft.password,
      options: {
        data: { full_name: registerDraft.fullName.trim() },
      },
    });

    if (error) {
      setAuthStatus(error.message);
      return;
    }

    setRegisterOpen(false);
    setAuthEmail(registerDraft.email.trim());
    setAuthPassword('');
    setRegisterDraft({ fullName: '', email: '', password: '', confirmPassword: '' });
    setAuthStatus('Account created. Check email if confirmation is enabled.');
  }

  async function updatePassword(event) {
    event.preventDefault();
    if (accountDraft.password !== accountDraft.confirmPassword) {
      setAuthStatus('Passwords do not match');
      return;
    }

    if (!supabaseEnabled || !supabase) {
      setAccountOpen(false);
      setAuthStatus('Demo password updated');
      return;
    }

    setAuthStatus('Updating password...');
    const { error } = await supabase.auth.updateUser({ password: accountDraft.password });
    if (error) {
      setAuthStatus(error.message);
      return;
    }

    setAccountDraft({ password: '', confirmPassword: '' });
    setAccountOpen(false);
    setAuthStatus('Password updated');
  }

  async function sendPasswordReset() {
    if (!supabaseEnabled || !supabase || !authEmail.trim()) {
      setAuthStatus('Enter your email to reset password');
      return;
    }

    setAuthStatus('Sending reset email...');
    const { error } = await supabase.auth.resetPasswordForEmail(authEmail.trim());
    setAuthStatus(error ? error.message : 'Password reset email sent');
  }

  async function submitFeedback(event) {
    event.preventDefault();
    if (!feedback.trim()) return;
    setFeedbackStatus('Sending feedback...');
    try {
      if (supabaseEnabled && supabase) {
        const { error } = await supabase.from('center_console_feedback').insert({
          message: feedback.trim(),
          page: active,
          user_email: authEmail,
        });
        if (error) throw error;
        setFeedbackStatus('Feedback sent to Supabase');
      } else {
        setFeedbackStatus('Feedback captured in demo mode');
      }
    } catch (error) {
      setFeedbackStatus(error?.message ? `Feedback save failed: ${error.message}` : 'Feedback save failed');
      return;
    }
    setFeedback('');
    setFeedbackOpen(false);
  }

  if (!loggedIn) {
    return (
      <main className="login-page" data-theme={theme}>
        <section className="login-hero">
          <Brand />
          <div className="login-copy">
            <h1>Center Console Board</h1>
            <p>Autonomous vehicle triage operations, fleet health, finance, ticket hotspots, and project milestones in one AI-powered command surface.</p>
            <span className="secure">{sessionReady ? authStatus : 'Checking session...'}</span>
          </div>
          <LoginOperationsMap locations={locations} />
        </section>
        <form className="login-card" onSubmit={signIn}>
          <Brand compact />
          <h2>Welcome Back</h2>
          <p>Sign in to continue to your dashboard</p>
          <label>Email<input value={authEmail} onChange={(event) => setAuthEmail(event.target.value)} type="email" /></label>
          <label>Password<input value={authPassword} onChange={(event) => setAuthPassword(event.target.value)} type="password" /></label>
          <div className="login-options"><label><input defaultChecked type="checkbox" /> Remember me</label><button type="button" onClick={sendPasswordReset}>Forgot password?</button></div>
          <button className="primary" type="submit" disabled={!sessionReady}>Sign In</button>
          <button className="demo-button" onClick={(e) => { e.preventDefault(); setLoggedIn(true); }} type="button">Enter Demo</button>
          <button className="register-link" onClick={(e) => { e.preventDefault(); setRegisterOpen(true); }} type="button">Create an account</button>
          <span className="secure">Secured with enterprise SSO</span>
        </form>
        {registerOpen && (
          <div className="modal-backdrop" role="presentation" onClick={() => setRegisterOpen(false)}>
            <form
              className="register-modal"
              onClick={(e) => e.stopPropagation()}
              onSubmit={registerAccount}
              role="dialog"
              aria-modal="true"
              aria-label="Register account"
            >
              <h2>Create Account</h2>
              <p>{supabaseEnabled ? 'Register with Supabase Auth.' : 'Demo registration creates a local session.'}</p>
              <label>Full name<input type="text" placeholder="Ops user" required value={registerDraft.fullName} onChange={(e) => setRegisterDraft((current) => ({ ...current, fullName: e.target.value }))} /></label>
              <label>Email<input type="email" placeholder="name@company.com" required value={registerDraft.email} onChange={(e) => setRegisterDraft((current) => ({ ...current, email: e.target.value }))} /></label>
              <label>Password<input type="password" placeholder="Create password" required value={registerDraft.password} onChange={(e) => setRegisterDraft((current) => ({ ...current, password: e.target.value }))} /></label>
              <label>Confirm password<input type="password" placeholder="Confirm password" required value={registerDraft.confirmPassword} onChange={(e) => setRegisterDraft((current) => ({ ...current, confirmPassword: e.target.value }))} /></label>
              <div className="account-actions">
                <button type="button" onClick={() => setRegisterOpen(false)}>Cancel</button>
                <button className="primary" type="submit">Register</button>
              </div>
            </form>
          </div>
        )}
      </main>
    );
  }

  return (
    <main className="app-shell" data-theme={theme}>
      <aside className="sidebar">
        <Brand />
        <div className="mobile-tab-picker">
          <button
            aria-expanded={mobileNavOpen}
            aria-haspopup="listbox"
            className={`mobile-tab-trigger ${mobileNavOpen ? 'open' : ''}`}
            onClick={() => setMobileNavOpen((current) => !current)}
            type="button"
          >
            <span className="mobile-tab-trigger-copy">
              <small>View</small>
              <strong>{active}</strong>
            </span>
            <Icon name="chevron" />
          </button>
          {mobileNavOpen && (
            <div className="mobile-tab-menu" role="listbox" aria-label="Select dashboard tab">
              {navItems.map(([label, icon]) => (
                <button
                  aria-selected={active === label}
                  className={active === label ? 'selected' : ''}
                  key={label}
                  onClick={() => {
                    setActive(label);
                    setMobileNavOpen(false);
                  }}
                  type="button"
                >
                  <Icon name={icon} />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <nav aria-label="Primary">
          {navItems.map(([label, icon]) => (
            <button aria-label={label} className={active === label ? 'active' : ''} key={label} onClick={() => setActive(label)} type="button">
              <Icon name={icon} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
        <div className="system-card">
          <Icon name="brain" />
          <div><span>AI system status</span><strong>Operational</strong></div>
          <i />
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <h1>{active}</h1>
            <p>Autonomous Vehicle Triage Operations Dashboard</p>
          </div>
          <div className="topbar-actions">
            <button className="ai-assistant" onClick={runAiBrief} type="button"><Icon name="brain" />AI <b>Online</b></button>
            <button aria-expanded={alertsOpen} aria-haspopup="dialog" aria-label="Notifications" className="icon-button" onClick={() => { setAlertsOpen(!alertsOpen); setAccountOpen(false); }} type="button"><Icon name="bell" /><sup>12</sup></button>
            <time dateTime={now.toISOString()}>{clock.time}<span>{clock.date}</span></time>
            <button className="profile" onClick={openAccount} type="button"><span>OP</span><strong>Ops Admin</strong></button>
          </div>
        </header>

        {alertsOpen && (
          <div className="modal-backdrop" role="presentation" onClick={() => setAlertsOpen(false)}>
            <div className="alerts-popover" role="dialog" aria-modal="true" aria-label="Notifications" onClick={(e) => e.stopPropagation()}>
              <header>
                <strong>Notifications</strong>
                <button aria-label="Close notifications" onClick={() => setAlertsOpen(false)} type="button">Close</button>
              </header>
              <div className="alerts-list">
                {alerts.map((item) => (
                  <article key={item.title}>
                    <i className={item.tone} />
                    <div><strong>{item.title}</strong><span>{item.meta}</span></div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        )}

        <section className="metric-row" aria-label="Incident summary">
          {metrics.map((metric) => <Metric key={metric.label} {...metric} />)}
        </section>

        <section className="insight-strip">
          <div><Icon name="spark" /><strong>AI operations brief</strong></div>
          <p>{aiSummary}</p>
        </section>

        <PageRouter {...pageProps} />
      </section>

      <button className="feedback-button" onClick={() => setFeedbackOpen(true)} type="button"><Icon name="message" />Feedback</button>
      {feedbackOpen && (
        <div className="modal-backdrop" role="presentation">
          <form className="feedback-modal" onSubmit={submitFeedback} role="dialog" aria-modal="true" aria-label="Submit feedback">
            <h2>Submit feedback</h2>
            <p>Send product feedback to the Center Console operations team.</p>
            <textarea value={feedback} onChange={(event) => setFeedback(event.target.value)} placeholder="What would make this board better for your shift?" />
            <p className="feedback-status">{feedbackStatus}</p>
            <div><button type="button" onClick={() => setFeedbackOpen(false)}>Cancel</button><button className="primary" type="submit">Send feedback</button></div>
          </form>
        </div>
      )}

      {accountOpen && (
        <div className="modal-backdrop" role="presentation" onClick={() => setAccountOpen(false)}>
          <form className="account-modal" onSubmit={updatePassword} role="dialog" aria-modal="true" aria-label="Account settings" onClick={(e) => e.stopPropagation()}>
            <h2>Account</h2>
            <p>Manage your Center Console operator session.</p>
            <label>New password<input type="password" placeholder="Enter new password" value={accountDraft.password} onChange={(e) => setAccountDraft((current) => ({ ...current, password: e.target.value }))} /></label>
            <label>Confirm password<input type="password" placeholder="Confirm new password" value={accountDraft.confirmPassword} onChange={(e) => setAccountDraft((current) => ({ ...current, confirmPassword: e.target.value }))} /></label>
            <div className="account-actions">
              <button type="button" onClick={() => setAccountOpen(false)}>Cancel</button>
              <button className="primary" type="submit">Update password</button>
              <button className="danger" type="button" onClick={logout}>Logout</button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}

function Brand({ compact = false }) {
  return (
    <div className={`brand ${compact ? 'compact' : ''}`}>
      <span className="brand-mark">C</span>
      <strong>Center Console<br />Board</strong>
    </div>
  );
}

	function Icon({ name }) {
	  const paths = {
	    grid: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
	    alert: 'M12 3 2 21h20L12 3Zm0 6v5m0 3h.01',
	    pulse: 'M3 12h4l2-7 4 14 2-7h6',
	    car: 'M5 13 7 7h10l2 6M5 13h14v5H5zM7 18h.01M17 18h.01',
	    tool: 'M14 7a4 4 0 0 0 5 5l-7 7-5-5 7-7ZM5 5l5 5',
	    pin: 'M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11Zm0-8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
	    cloud: 'M7 18a4 4 0 0 1 0-8 5 5 0 0 1 9.8 1.2A3.5 3.5 0 1 1 17.5 18H7Z',
	    wallet: 'M3 7h18v12H3zM16 12h5M6 7V5h12v2',
	    flag: 'M5 21V4h10l1 3h4v9h-9l-1-3H5',
	    settings: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm8 4h2M2 12h2m12.9-6.9 1.4-1.4M5.7 18.3l1.4-1.4m0-11.8L5.7 3.7m12.6 14.6-1.4-1.4',
	    brain: 'M8 6a3 3 0 0 1 5-2 3 3 0 0 1 5 2v10a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V6Zm0 5h10M9 15h3m2-8h3',
	    bell: 'M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Zm-8 12h4',
	    spark: 'm12 3 2.3 6.7L21 12l-6.7 2.3L12 21l-2.3-6.7L3 12l6.7-2.3L12 3Z',
	    search: 'M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Zm6-2 4 4',
	    expand: 'M8 3H3v5m13-5h5v5M8 21H3v-5m18 0v5h-5',
	    target: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-5a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0-14v3m0 14v3m10-10h-3M5 12H2',
	    message: 'M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z',
	    chevron: 'm6 9 6 6 6-6',
	  };
	  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d={paths[name]} /></svg>;
	}

function Metric({ label, value, delta, tone, points }) {
  const areaPoints = `0,48 ${points} 96,48`;
  return (
    <article className={`metric ${tone}`}>
      <div><Icon name={label === 'Total Incidents' ? 'pulse' : 'alert'} /><span>{label}</span></div>
      <strong>{value}</strong>
      <p><b>{delta}</b> vs yesterday</p>
      <svg viewBox="0 0 96 48" preserveAspectRatio="none" aria-hidden="true">
        <polygon points={areaPoints} />
        <polyline points={points} />
      </svg>
    </article>
  );
}

function Panel({ title, action, onAction, children, className = '' }) {
  return (
    <section className={`panel ${className}`}>
      <header>
        <h2>{title}</h2>
        <button
          className={`panel-action ${onAction ? 'clickable' : ''}`}
          type="button"
          onClick={onAction}
          disabled={!onAction}
        >
          {action}
        </button>
      </header>
      {children}
    </section>
  );
}

function LoginOperationsMap() {
  return (
    <div className="login-preview photo-map" aria-label="United States operations photo map">
      <img src="/operations-map-photo.png" alt="Operations map with United States vehicle locations and incident status" />
    </div>
  );
}

function PageRouter(props) {
  const pages = {
    'Command Board': <CommandBoardPage {...props} />,
    Incidents: <IncidentsPage incidents={props.incidents} setIncidents={props.setIncidents} />,
    'Fleet Health': <FleetHealthPage {...props} />,
    Assets: <AssetsPage assets={props.assets} locations={props.locations} setAssets={props.setAssets} />,
    Troubleshooting: <TroubleshootingPage assets={props.assets} hotspot={props.hotspot} />,
    'Tickets Map': <TicketsMapPage {...props} />,
    Weather: <WeatherPage {...props} />,
    Finance: <FinancePage {...props} />,
    Milestones: <MilestonesPage {...props} />,
    Settings: <SettingsPage {...props} />,
  };

  return pages[props.active] || pages['Command Board'];
}

function CommandBoardPage(props) {
  return (
    <section className="dashboard-grid">
      <TicketMapPanel {...props} className="map-panel" />
      <FleetHealthPanel {...props} />
      <FinancePanel {...props} />
      <IncidentsPanel incidents={props.incidents} setActive={props.setActive} active={props.active} />
      <AssetsPanel assets={props.assets} setActive={props.setActive} />
      <MilestonesPanel milestones={props.milestones} setActive={props.setActive} active={props.active} className="wide-panel" />
      <TroubleshootingPanel hotspot={props.hotspot} className="milestone-panel" />
      <MileagePanel totalMileage={props.totalMileage} className="mileage-panel" />
    </section>
  );
}

function IncidentsPage({ incidents, setIncidents }) {
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [incidentStatusDraft, setIncidentStatusDraft] = useState('');

  function openIncident(incident) {
    setSelectedIncident(incident);
    setIncidentStatusDraft(incident.state);
    setDetailOpen(true);
  }

  function closeIncident() {
    setDetailOpen(false);
    setSelectedIncident(null);
  }

  async function saveIncidentStatus() {
    if (!selectedIncident) return;

    if (supabaseEnabled && supabase) {
      const { error } = await supabase
        .from('center_console_incidents')
        .update({ status: incidentStatusDraft })
        .eq('ticket_id', selectedIncident.id);

      if (error) return;
    }

    setIncidents((current) => current.map((incident) => (
      incident.id === selectedIncident.id
        ? { ...incident, state: incidentStatusDraft }
        : incident
    )));
    setSelectedIncident((current) => (current ? { ...current, state: incidentStatusDraft } : current));
  }

  return (
    <section className="page-grid incidents-page">
      <Panel className="wide-panel" title="Incident Command Queue" action="Simulated live data">
        <div className="table-list">
          <div className="table-head"><span>Ticket</span><span>Issue</span><span>Location</span><span>Owner</span><span>Status</span><span>Age</span></div>
          {incidents.map((incident) => (
            <article
              key={incident.id}
              className="click-row"
              role="button"
              tabIndex={0}
              onClick={() => openIncident(incident)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') openIncident(incident);
              }}
              aria-label={`Open ticket ${incident.id}`}
            >
              <span className={`severity ${incident.severity}`}>{incident.severity}</span>
              <strong>{incident.title}</strong>
              <span>{incident.city}</span>
              <span>{incident.owner}</span>
              <span>{incident.state}</span>
              <b>{incident.age}</b>
            </article>
          ))}
        </div>
      </Panel>
      {detailOpen && selectedIncident && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Ticket details" onMouseDown={closeIncident}>
          <div className="incident-modal" onMouseDown={(e) => e.stopPropagation()}>
            <header className="incident-modal-head">
              <div>
                <strong>{selectedIncident.id}</strong>
                <span className="incident-sub">{selectedIncident.city} • {selectedIncident.owner} • {selectedIncident.severity}</span>
              </div>
              <button type="button" onClick={closeIncident}>Close</button>
            </header>
            <div className="incident-modal-body">
              <h3>{selectedIncident.title}</h3>
              <div className="incident-kv">
                <article><span>Status</span><strong>{selectedIncident.state}</strong></article>
                <article><span>Age</span><strong>{selectedIncident.age}</strong></article>
                <article><span>Priority</span><strong>{selectedIncident.severity}</strong></article>
              </div>
              <label className="incident-status-field">
                Ticket status
                <select value={incidentStatusDraft} onChange={(event) => setIncidentStatusDraft(event.target.value)}>
                  <option value="Live triage">Live triage</option>
                  <option value="Owner assigned">Owner assigned</option>
                  <option value="Replay queued">Replay queued</option>
                  <option value="Monitoring">Monitoring</option>
                  <option value="Waiting vendor">Waiting vendor</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </label>
              <div className="incident-detail-grid">
                <section>
                  <h4>AI Summary</h4>
                  <p className="page-note">
                    {selectedIncident.aiSummary || 'Simulated triage suggests this event is driven by a localized edge-case. Prioritize replay capture, sensor health verification, then validate planning fallback behavior before releasing the vehicle back to route.'}
                  </p>
                </section>
                <section>
                  <h4>Recommended Actions</h4>
                  <ol className="playbook compact">
                    {(selectedIncident.recommendedActions?.length
                      ? selectedIncident.recommendedActions
                      : [
                          `Pull replay bundle and log snapshot for ${selectedIncident.city}.`,
                          'Confirm sensor health and calibration signals (camera, lidar, radar).',
                          `Assign owner handoff to ${selectedIncident.owner} with evidence + next check time.`,
                        ]).map((step) => <li key={step}>{step}</li>)}
                  </ol>
                </section>
              </div>
              <div className="account-actions">
                <button type="button" onClick={saveIncidentStatus}>Save status</button>
              </div>
            </div>
          </div>
        </div>
      )}
      <Panel title="AI Triage Summary" action="Next action">
        <div className="brief-list">
          <article><strong>Highest risk</strong><span>2 S1 incidents need owner confirmation before shift close.</span></article>
          <article><strong>Repeat signal</strong><span>Camera and planning issues are clustered in California routes.</span></article>
          <article><strong>Recommended move</strong><span>Assign replay review to Planning and Sensors, then update customer ops.</span></article>
        </div>
      </Panel>
      <Panel title="Severity Mix" action="Today">
        <div className="stack-bars">
          <span style={{ height: '72%' }} className="red" />
          <span style={{ height: '58%' }} className="orange" />
          <span style={{ height: '82%' }} className="amber" />
          <span style={{ height: '44%' }} className="blue" />
        </div>
      </Panel>
    </section>
  );
}

function FleetHealthPage(props) {
  return (
    <section className="page-grid">
      <FleetHealthPanel {...props} />
      <Panel title="Health by Subsystem" action="Last 24h">
        <div className="subsystem-grid">
          {[
            ['Perception', 91],
            ['Planning', 86],
            ['Sensors', 82],
            ['Controls', 94],
            ['Localization', 89],
            ['Remote Assist', 77],
          ].map(([label, value]) => <article key={label}><span>{label}</span><Meter value={value} /><strong>{value}%</strong></article>)}
        </div>
      </Panel>
      <Panel className="wide-panel" title="Fleet Watchlist" action="Service priority">
        <div className="asset-list detailed">
          {props.assets.map((asset) => (
            <article key={asset.tag}>
              <div><strong>{asset.tag}</strong><span>{asset.city} / {asset.status}</span></div>
              <Meter value={asset.health} tone={asset.health < 85 ? 'amber' : 'cyan'} />
              <b>{asset.health}%</b>
            </article>
          ))}
        </div>
      </Panel>
    </section>
  );
}

function AssetsPage({ assets, locations, setAssets }) {
  const [editOpen, setEditOpen] = useState(false);
  const [editMode, setEditMode] = useState('add'); // add | edit
  const [draft, setDraft] = useState({
    tag: '',
    city: 'San Francisco',
    status: 'Ready',
    miles: 52000,
    health: 90,
    battery: 92,
  });

  function nextDraft() {
    const nextNumber = 420 + assets.length;
    const health = 78 + ((assets.length * 7) % 21);
    const city = ['San Francisco', 'Los Angeles', 'Seattle', 'Austin', 'Miami'][assets.length % 5];
    const miles = 52000 + assets.length * 8420;
    const status = health > 90 ? 'Ready' : health > 84 ? 'On route' : 'Investigate';
    const battery = Math.min(96, health + 2);
    return { tag: `AV-${nextNumber}`, city, status, miles, health, battery };
  }

  function openAdd() {
    setEditMode('add');
    setDraft(nextDraft());
    setEditOpen(true);
  }

  function openEdit(asset) {
    setEditMode('edit');
    setDraft({
      tag: asset.tag,
      city: asset.city,
      status: asset.status,
      miles: asset.miles,
      health: asset.health,
      battery: asset.battery,
    });
    setEditOpen(true);
  }

  async function saveDraft(event) {
    event.preventDefault();
    const cleaned = {
      tag: String(draft.tag || '').trim(),
      city: String(draft.city || '').trim(),
      status: String(draft.status || '').trim(),
      miles: Number(draft.miles) || 0,
      health: Math.max(0, Math.min(100, Number(draft.health) || 0)),
      battery: Math.max(0, Math.min(100, Number(draft.battery) || 0)),
    };

    if (!cleaned.tag || !cleaned.city || !cleaned.status) return;

    if (supabaseEnabled && supabase) {
      const locationRow = locations.find((item) => item.city === cleaned.city);
      const locationLookup = locationRow
        ? await supabase.from('center_console_locations').select('id').eq('city', locationRow.city).maybeSingle()
        : { data: null, error: null };

      if (locationLookup.error) {
        return;
      }

      const { error } = await supabase.from('center_console_assets').upsert({
        asset_tag: cleaned.tag,
        location_id: locationLookup.data?.id || null,
        health_score: cleaned.health,
        mileage: cleaned.miles,
        status: cleaned.status,
      });

      if (error) {
        return;
      }
    }

    if (editMode === 'add') {
      setAssets((currentAssets) => {
        const exists = currentAssets.some((asset) => asset.tag === cleaned.tag);
        if (exists) return currentAssets;
        return [...currentAssets, cleaned];
      });
    } else {
      setAssets((currentAssets) => currentAssets.map((asset) => (asset.tag === cleaned.tag ? cleaned : asset)));
    }

    setEditOpen(false);
  }

  async function removeAsset(tag) {
    const ok = window.confirm(`Remove ${tag} from fleet assets?`);
    if (!ok) return;

    if (supabaseEnabled && supabase) {
      const { error } = await supabase.from('center_console_assets').delete().eq('asset_tag', tag);
      if (error) return;
    }

    setAssets((currentAssets) => currentAssets.filter((asset) => asset.tag !== tag));
  }

  return (
    <section className="page-grid assets-page">
      <Panel className="wide-panel" title="Asset Registry" action={`${assets.length} demo assets`}>
        <div className="asset-actions">
          <button className="primary small-action" onClick={openAdd} type="button">Add demo asset</button>
          <span>{supabaseEnabled ? 'Fleet records write through to Supabase.' : 'Simulated fleet records update locally for this session.'}</span>
        </div>
        <div className="asset-table">
          <div className="table-head"><span>Vehicle</span><span>Location</span><span>Status</span><span>Health</span><span>Battery</span><span>Mileage</span><span>Action</span></div>
          {assets.map((asset) => (
            <article key={asset.tag}>
              <strong>{asset.tag}</strong>
              <span>{asset.city}</span>
              <span>{asset.status}</span>
              <Meter value={asset.health} tone={asset.health < 85 ? 'amber' : 'cyan'} />
              <b>{asset.battery}%</b>
              <span>{asset.miles.toLocaleString()} mi</span>
              <div className="asset-row-actions">
                <button className="edit-asset" onClick={() => openEdit(asset)} type="button">Edit</button>
                <button aria-label={`Remove ${asset.tag}`} className="remove-asset" onClick={() => removeAsset(asset.tag)} type="button">Remove</button>
              </div>
            </article>
          ))}
        </div>
      </Panel>
      {editOpen && (
        <div className="modal-backdrop" role="presentation" onClick={() => setEditOpen(false)}>
          <form className="asset-edit-modal" onClick={(e) => e.stopPropagation()} onSubmit={saveDraft} role="dialog" aria-modal="true" aria-label="Edit asset">
            <h2>{editMode === 'add' ? 'Add Asset' : 'Edit Asset'}</h2>
            <p>{supabaseEnabled ? 'Asset changes save to Supabase and update the dashboard.' : 'Simulated asset editor updates local demo data.'}</p>
            <label>Vehicle tag<input value={draft.tag} onChange={(e) => setDraft((d) => ({ ...d, tag: e.target.value }))} disabled={editMode === 'edit'} /></label>
            <label>Location<input value={draft.city} onChange={(e) => setDraft((d) => ({ ...d, city: e.target.value }))} /></label>
            <label>Status
              <select value={draft.status} onChange={(e) => setDraft((d) => ({ ...d, status: e.target.value }))}>
                <option value="Ready">Ready</option>
                <option value="On route">On route</option>
                <option value="Investigate">Investigate</option>
                <option value="Service bay">Service bay</option>
              </select>
            </label>
            <div className="asset-edit-grid">
              <label>Mileage<input type="number" min="0" value={draft.miles} onChange={(e) => setDraft((d) => ({ ...d, miles: e.target.value }))} /></label>
              <label>Health<input type="number" min="0" max="100" value={draft.health} onChange={(e) => setDraft((d) => ({ ...d, health: e.target.value }))} /></label>
              <label>Battery<input type="number" min="0" max="100" value={draft.battery} onChange={(e) => setDraft((d) => ({ ...d, battery: e.target.value }))} /></label>
            </div>
            <div className="account-actions">
              <button type="button" onClick={() => setEditOpen(false)}>Cancel</button>
              <button className="primary" type="submit">{editMode === 'add' ? 'Add asset' : 'Save changes'}</button>
            </div>
          </form>
        </div>
      )}
      <Panel title="Inventory Signals" action="AI score">
        <div className="brief-list">
          <article><strong>Ready for route</strong><span>{assets.filter((asset) => asset.health >= 90).length} vehicles above 90% health.</span></article>
          <article><strong>Needs attention</strong><span>{assets.filter((asset) => asset.health < 85).length} vehicle needs service bay follow-up.</span></article>
          <article><strong>Mileage leader</strong><span>{assets.length ? `${[...assets].sort((a, b) => b.miles - a.miles)[0].tag} has the highest accumulated mileage.` : 'Add a demo asset to restart fleet comparisons.'}</span></article>
        </div>
      </Panel>
    </section>
  );
}

function TroubleshootingPage({ hotspot, assets }) {
  const [query, setQuery] = useState('');
  const [connectedTag, setConnectedTag] = useState('');
  const [connectHint, setConnectHint] = useState('');
  const [vehicleOnline, setVehicleOnline] = useState(false);
  const [stack, setStack] = useState({
    drivers: true,
    cameras: true,
    lidar: true,
    radars: true,
    perception: true,
    emu: false,
  });
  const [logsStatus, setLogsStatus] = useState('Idle');
  const [logsText, setLogsText] = useState('');

  const assetTags = useMemo(() => assets.map((a) => a.tag), [assets]);
  const connectedAsset = useMemo(() => assets.find((a) => a.tag === connectedTag) || null, [assets, connectedTag]);

  async function persistTroubleshootingEvent(actionType, overrides = {}) {
    if (!supabaseEnabled || !supabase) return;
    await supabase.from('center_console_troubleshooting_logs').insert({
      asset_tag: overrides.assetTag || connectedTag || query.trim().toUpperCase(),
      city: overrides.city || connectedAsset?.city || null,
      online: typeof overrides.online === 'boolean' ? overrides.online : vehicleOnline,
      stack_state: overrides.stackState || stack,
      action_type: actionType,
      logs_text: overrides.logsText || null,
    });
  }

  function connect() {
    const clean = query.trim().toUpperCase();
    if (!clean) return;
    const match = assetTags.find((tag) => tag.toUpperCase() === clean) || clean;
    const isKnown = assetTags.some((tag) => tag.toUpperCase() === clean);
    setConnectedTag(match);
    setLogsStatus('Connected');
    setLogsText('');
    setConnectHint(isKnown ? '' : 'Connected in demo mode (not in current asset list).');
    // Simulated reachability check: most vehicles are online, some are offline.
    const nextOnline = Math.random() > 0.18;
    setVehicleOnline(nextOnline);
    persistTroubleshootingEvent('connect', {
      assetTag: match,
      city: assets.find((asset) => asset.tag === match)?.city || null,
      online: nextOnline,
    });
  }

  function disconnect() {
    persistTroubleshootingEvent('disconnect');
    setConnectedTag('');
    setLogsStatus('Idle');
    setLogsText('');
    setConnectHint('');
    setVehicleOnline(false);
  }

  function requestLogs() {
    if (!connectedTag) return;
    setLogsStatus('Requesting logs...');
    const base = connectedAsset ? `${connectedAsset.tag} ${connectedAsset.city} ${connectedAsset.status}` : connectedTag;
    window.setTimeout(() => {
      const now = new Date();
      const ts = now.toISOString().replace('T', ' ').slice(0, 19);
      const enabled = Object.entries(stack).filter(([, v]) => v).map(([k]) => k).join(', ');
      setLogsText(
        [
          `${ts} vehicle=${base}`,
          `stack: ${enabled || 'none'}`,
          `sensors: cam=ok lidar=ok radar=ok`,
          `planner: route=active assist=standby`,
          `perception: fps=18.7 latency_p95=74ms`,
          `health: cpu=62% gpu=48% temp=71C`,
        ].join('\n')
      );
      setLogsStatus('Logs ready');
      persistTroubleshootingEvent('request_logs', {
        logsText: [
          `${ts} vehicle=${base}`,
          `stack: ${enabled || 'none'}`,
          `sensors: cam=ok lidar=ok radar=ok`,
          `planner: route=active assist=standby`,
          `perception: fps=18.7 latency_p95=74ms`,
          `health: cpu=62% gpu=48% temp=71C`,
        ].join('\n'),
      });
    }, 700);
  }

  return (
    <section className="page-grid">
      <Panel className="wide-panel" title="AI Troubleshooting Playbook" action={hotspot.city}>
        <div className="runbook-list">
          {troubleshootingRuns.map((run) => (
            <article key={run.step}>
              <div><strong>{run.step}</strong><span>{run.system} / {run.owner}</span></div>
              <span>{run.status}</span>
              <span>{run.eta}</span>
              <Meter value={run.confidence} tone={run.confidence < 70 ? 'amber' : 'cyan'} />
            </article>
          ))}
        </div>
      </Panel>
      <Panel title="Vehicle Controls" action={connectedTag ? `Connected: ${connectedTag}` : 'Demo'}>
        <div className="vehicle-control">
          <div className="vehicle-search">
            <label>
              Vehicle tag
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search vehicle (e.g., AV-204)"
                list="asset-tags"
              />
            </label>
            <datalist id="asset-tags">
              {assetTags.map((tag) => <option key={tag} value={tag} />)}
            </datalist>
            <div className="vehicle-actions">
              <button className="primary small-action" type="button" onClick={connect} disabled={!query.trim()}>Connect</button>
              <button type="button" onClick={disconnect} disabled={!connectedTag}>Disconnect</button>
            </div>
            {connectHint ? <span className="logs-status">{connectHint}</span> : null}
          </div>

          <div className="vehicle-status-row" aria-label="Vehicle connectivity status">
            <div className={`status-pill ${connectedTag ? (vehicleOnline ? 'online' : 'offline') : 'idle'}`}>
              <span className="status-dot" aria-hidden="true" />
              <b>{connectedTag ? (vehicleOnline ? 'ONLINE' : 'OFFLINE') : 'NOT CONNECTED'}</b>
            </div>
            <button
              type="button"
              className="small-action"
              onClick={() => setVehicleOnline((v) => !v)}
              disabled={!connectedTag}
              aria-label="Toggle simulated online status"
              title="Demo: toggle vehicle online/offline"
            >
              Simulate
            </button>
          </div>

          {connectedAsset && (
            <div className="vehicle-summary">
              <div><strong>{connectedAsset.tag}</strong><span>{connectedAsset.city} / {connectedAsset.status}</span></div>
              <div className="meter-wrap"><Meter value={connectedAsset.health} tone={connectedAsset.health < 85 ? 'amber' : 'cyan'} /><b>{connectedAsset.health}%</b></div>
            </div>
          )}

          <div className="stack-toggles">
            <strong>Vehicle stack</strong>
            <div className="toggle-grid">
              {[
                ['drivers', 'Drivers'],
                ['cameras', 'Cameras'],
                ['lidar', 'LiDAR'],
                ['radars', 'Radars'],
                ['perception', 'Perception'],
                ['emu', 'EMU'],
              ].map(([key, label]) => (
                <label className="stack-toggle" key={key}>
                  <input
                    type="checkbox"
                    checked={Boolean(stack[key])}
                    onChange={() => {
                      setStack((current) => {
                        const nextState = { ...current, [key]: !current[key] };
                        persistTroubleshootingEvent('toggle', { stackState: nextState });
                        return nextState;
                      });
                    }}
                    disabled={!connectedTag}
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
            <button className="primary" type="button" onClick={requestLogs} disabled={!connectedTag || !vehicleOnline}>Request Vehicle Logs</button>
            <span className="logs-status">{logsStatus}</span>
          </div>

          {logsText && (
            <pre className="log-box" aria-label="Vehicle logs">{logsText}</pre>
          )}
        </div>
      </Panel>

      <TroubleshootingPanel hotspot={hotspot} />
      <Panel title="Generated Hypothesis" action="AI powered">
        <p className="page-note">The current hotspot is likely driven by route-specific perception confidence drops and delayed planning fallback decisions. Simulated AI recommends replay-first diagnosis, sensor alignment checks, and route holdout validation.</p>
      </Panel>
    </section>
  );
}

function TicketsMapPage(props) {
  return (
    <section className="page-grid">
      <TicketMapPanel {...props} className="wide-panel tall-map-panel" />
      <Panel title="Location Ranking" action="Most issues">
        <div className="ranking-list">
          {[...props.locations].sort((a, b) => b.issues - a.issues).map((place, index) => (
            <article key={place.city}>
              <b>{index + 1}</b>
              <div><strong>{place.city}</strong><span>{place.severity} severity cluster</span></div>
              <span>{place.issues} issues</span>
            </article>
          ))}
        </div>
      </Panel>
    </section>
  );
}

function FinancePage(props) {
  return (
    <section className="page-grid finance-page">
      <FinancePanel {...props} />
      <Panel title="Weekly Run Cost" action="Cost per mile">
        <div className="finance-table">
          <div className="table-head"><span>Day</span><span>Cost</span><span>Miles</span><span>Cost / mi</span></div>
          {financeTrends.map((row) => (
            <article key={row.day}><strong>{row.day}</strong><span>${row.cost.toLocaleString()}</span><span>{row.miles.toLocaleString()} mi</span><b>${row.cpm.toFixed(2)}</b></article>
          ))}
        </div>
      </Panel>
      <Panel className="wide-panel" title="Cost Drivers" action="Daily impact">
        <div className="cost-driver-grid">
          {props.financeRows.map((row) => <FinanceItem key={row.label} {...row} />)}
        </div>
      </Panel>
    </section>
  );
}

function MilestonesPage(props) {
  return (
    <section className="page-grid">
      <MilestonesPanel milestones={props.milestones} setActive={props.setActive} active={props.active} className="wide-panel" />
      <MileagePanel totalMileage={props.totalMileage} />
      <Panel title="Milestone Risk" action="AI forecast">
        <div className="brief-list">
          <article><strong>On track</strong><span>Safety milestone is complete and uptime is within threshold.</span></article>
          <article><strong>Watch</strong><span>LA expansion needs vehicle readiness and city permit signoff.</span></article>
          <article><strong>At risk</strong><span>Cost optimization has not started and needs finance owner assignment.</span></article>
        </div>
      </Panel>
    </section>
  );
}

function WeatherPage() {
  const rainAlerts = useMemo(() => {
    return weatherSeed
      .map((row) => {
        const patternBoost = row.next.reduce((m, d) => {
          const cond = String(d.cond).toLowerCase();
          const wet = cond.includes('rain') || cond.includes('storm') || cond.includes('shower');
          return wet ? Math.max(m, 55) : m;
        }, 0);
        const chance = Math.min(95, Math.max(row.now.precip, patternBoost));
        const impact = chance >= 60 ? 'High' : chance >= 35 ? 'Medium' : 'Low';
        const tone = chance >= 60 ? 'red' : chance >= 35 ? 'amber' : 'green';
        const note =
          chance >= 60
            ? 'Expect slower dispatch + higher sensor occlusion. Pre-stage ops support.'
            : chance >= 35
              ? 'Monitor route readiness and camera cleaning intervals.'
              : 'No material weather constraint expected.';
        return { city: row.city, state: row.state, chance, impact, tone, note };
      })
      .sort((a, b) => b.chance - a.chance);
  }, []);

  return (
    <section className="page-grid weather-page">
      <Panel className="wide-panel" title="Weather Forecast" action="Simulated operations feed">
        <div className="weather-grid">
          {weatherSeed.map((row) => (
            <article className="weather-card" key={row.city}>
              <header>
                <div>
                  <strong>{row.city}, {row.state}</strong>
                  <span className="weather-sub">Current conditions</span>
                </div>
                <div className="weather-now">
                  <b>{row.now.tempF}°F</b>
                  <span>{row.now.cond}</span>
                </div>
              </header>
              <div className="weather-meta">
                <span><i className="blue" />Wind <b>{row.now.windMph} mph</b></span>
                <span><i className="amber" />Precip <b>{row.now.precip}%</b></span>
              </div>
              <div className="weather-ai">
                <span className="weather-ai-label">AI rain risk</span>
                {(() => {
                  const alert = rainAlerts.find((a) => a.city === row.city);
                  const tone = alert?.tone || 'green';
                  const isAlert = Boolean(alert && alert.chance >= 60);
                  return (
                    <div className={`rain-pill ${tone} ${isAlert ? 'alerting' : ''}`}>
                      <i className="status-dot" aria-hidden="true" />
                      <b>{alert?.chance ?? row.now.precip}%</b>
                      <span>{isAlert ? 'Alerting ops' : 'Monitoring'}</span>
                    </div>
                  );
                })()}
              </div>
              <div className="weather-next" aria-label={`7 day forecast for ${row.city}`}>
                {row.next.map((d) => (
                  <div key={d.day} className="weather-day">
                    <span>{d.day}</span>
                    <b>{d.hi}°</b>
                    <em>{d.lo}°</em>
                    <small>{d.cond}</small>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </Panel>
      <Panel title="AI Weather Brief" action="AI powered">
        <div className="brief-list">
          <article><strong>Highest rain risk</strong><span>{rainAlerts[0]?.city} and {rainAlerts[1]?.city} show the highest simulated precipitation likelihood in the next 24h.</span></article>
          <article><strong>Ops impact</strong><span>When rain risk is high, expect slower dispatch and increased camera occlusion and perception confidence variance.</span></article>
          <article><strong>Recommendation</strong><span>Pre-stage response teams in high-risk regions and increase cleaning/health checks for camera and lidar surfaces.</span></article>
        </div>
      </Panel>
      <Panel title="Rain Alerts" action={`${rainAlerts.filter((a) => a.chance >= 60).length} active`}>
        <div className="alerts-list">
          {rainAlerts.slice(0, 6).map((alert) => (
            <article key={alert.city}>
              <i className={alert.tone} />
              <div>
                <strong>{alert.city}, {alert.state} • {alert.chance}%</strong>
                <span>{alert.note}</span>
              </div>
            </article>
          ))}
        </div>
      </Panel>
    </section>
  );
}

function SettingsPage(props) {
  return (
    <section className="page-grid settings-page">
      <Panel className="wide-panel" title="Settings" action={`Center Console Board ${version}`}>
        <div className="settings-tabs">
          {['Updates', 'Appearance', 'Supabase', 'Account'].map((tab) => <button className={props.settingsTab === tab ? 'selected' : ''} key={tab} onClick={() => props.setSettingsTab(tab)} type="button">{tab}</button>)}
        </div>
        {props.settingsTab === 'Updates' && <SettingsUpdates updates={props.updates} setUpdates={props.setUpdates} version={version} status={props.feedbackStatus} />}
        {props.settingsTab === 'Appearance' && <SettingsAppearance theme={props.theme} setTheme={props.setTheme} />}
        {props.settingsTab === 'Supabase' && <SettingsSupabase />}
        {props.settingsTab === 'Account' && (
          <div className="settings-body">
            <div className="setting-line"><span>User</span><strong>Ops Admin</strong></div>
            <div className="setting-line"><span>Role</span><strong>Operations</strong></div>
            <p className="note">Use profile menu (top right) to change password or logout.</p>
          </div>
        )}
      </Panel>
      <Panel title="Console Preferences" action="Demo mode">
        <div className="brief-list">
          <article><strong>Alerts</strong><span>Critical and high severity notifications enabled.</span></article>
          <article><strong>Map default</strong><span>Issue density and route overlays visible.</span></article>
          <article><strong>AI assistant</strong><span>Briefs generated from simulated fleet data.</span></article>
        </div>
      </Panel>
    </section>
  );
}

function TicketMapPanel({ locations, selectedLocation, setSelectedLocation, setActive, active, theme, tickets, className = '' }) {
  const [severityFilter, setSeverityFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      if (severityFilter !== 'All' && t.severity !== severityFilter) return false;
      if (typeFilter !== 'All' && t.type !== typeFilter) return false;
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        if (!t.city.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [severityFilter, tickets, typeFilter, search]);

  const openByCity = useMemo(() => {
    const map = new Map();
    for (const ticket of filteredTickets) {
      map.set(ticket.city, (map.get(ticket.city) || 0) + 1);
    }
    return map;
  }, [filteredTickets]);

  const visibleLocations = useMemo(() => {
    if (!search.trim() && severityFilter === 'All' && typeFilter === 'All') return locations;
    const q = search.trim().toLowerCase();
    return locations.filter((place) => {
      if (q && !place.city.toLowerCase().includes(q)) return false;
      const open = openByCity.get(place.city) || 0;
      return open > 0;
    });
  }, [locations, openByCity, search, severityFilter, typeFilter]);

  return (
    <Panel
      className={className}
      title="Ticket Monitoring Map"
      action="View all tickets"
      onAction={setActive && active !== 'Tickets Map' ? () => setActive('Tickets Map') : undefined}
    >
      <div className="map-toolbar">
        <label className="map-filter">
          <span className="sr-only">Severity</span>
          <select value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)} aria-label="Severity filter">
            <option value="All">All Severity</option>
            <option value="S1">S1</option>
            <option value="S2">S2</option>
            <option value="S3">S3</option>
          </select>
        </label>
        <label className="map-filter">
          <span className="sr-only">Type</span>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} aria-label="Type filter">
            <option value="All">All Types</option>
            {ticketTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </label>
        <label className="map-search">
          <Icon name="search" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search location" />
        </label>
        <button aria-label="Expand map" type="button"><Icon name="expand" /></button>
      </div>
      <div className="monitor-map">
        <div className="ticket-legend">
          {ticketStates.map(([label, value, tone]) => <span key={label}><i className={tone} />{label}<b>{value}</b></span>)}
        </div>
        <div className="mapcn-wrap" aria-label="Interactive map">
          <MapcnMap
            theme={theme}
            locations={visibleLocations.map((place) => ({
              ...place,
              open: openByCity.get(place.city) || place.open,
            }))}
            selectedCity={selectedLocation.city}
            onSelect={setSelectedLocation}
            className="mapcn-fill"
          />
        </div>
      </div>
      <div className="location-card">
        <strong>{selectedLocation.city}, {selectedLocation.state}</strong>
        <span>{selectedLocation.issues} active issues</span>
        <span>${selectedLocation.cost.toLocaleString()} daily issue cost</span>
      </div>
      <div className="location-list-cards" aria-label="Other locations">
        {locations
          .filter((place) => place.city !== selectedLocation.city)
          .sort((a, b) => b.issues - a.issues)
          .map((place) => (
            <button
              key={place.city}
              type="button"
              className="location-card mini"
              onClick={() => setSelectedLocation(place)}
              title={`Open ${place.city}`}
            >
              <strong>{place.city}, {place.state}</strong>
              <span>{place.issues} active issues</span>
              <span>${place.cost.toLocaleString()} daily issue cost</span>
            </button>
          ))}
      </div>
    </Panel>
  );
}

function FleetHealthPanel({ operationalCount, setActive, active }) {
  return (
    <Panel
      title="Fleet Health Overview"
      action="View all assets"
      onAction={setActive && active !== 'Assets' ? () => setActive('Assets') : undefined}
    >
      <div className="fleet-health">
        <div className="donut">
          <div className="donut-center">
            <span>Total Fleet</span>
            <strong>312</strong>
            <small>Vehicles</small>
          </div>
        </div>
        <div className="health-list">
          <HealthRow color="green" label="Operational" value={operationalCount} percent="79%" />
          <HealthRow color="amber" label="Maintenance" value={38} percent="12%" />
          <HealthRow color="orange" label="Degraded" value={16} percent="5%" />
          <HealthRow color="red" label="Offline" value={10} percent="4%" />
          <div className="utilization"><span>Utilization Rate</span><strong>78%</strong></div>
        </div>
      </div>
    </Panel>
  );
}

function FinancePanel({ dailyCost, financeRows, setActive, active }) {
  return (
    <Panel
      title="Finance - Daily Fleet Run Cost"
      action="View report"
      onAction={setActive && active !== 'Finance' ? () => setActive('Finance') : undefined}
    >
      <div className="finance-card">
        <span>Today's Cost</span>
        <strong>${dailyCost.toLocaleString()}</strong>
        <em>+4.3% vs yesterday</em>
        <svg viewBox="0 0 260 74" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 58 C38 50 58 46 82 37 S126 30 150 21 184 25 208 15 238 9 260 7 L260 74 L0 74Z" />
          <polyline points="0,58 42,48 82,37 122,28 150,21 180,25 208,15 238,9 260,7" />
        </svg>
      </div>
      <div className="finance-breakdown">
        {financeRows.map((row) => <FinanceItem key={row.label} {...row} />)}
      </div>
    </Panel>
  );
}

function IncidentsPanel({ incidents, setActive, active }) {
  return (
    <Panel
      title="Incidents"
      action="Live queue"
      onAction={setActive && active !== 'Incidents' ? () => setActive('Incidents') : undefined}
    >
      <div className="incident-list">
        {incidents.map((incident) => (
          <article key={incident.id}>
            <span className={`severity ${incident.severity}`}>{incident.severity}</span>
            <div><strong>{incident.title}</strong><p>{incident.id} / {incident.city} / {incident.owner}</p></div>
            <small>{incident.age}</small>
          </article>
        ))}
      </div>
    </Panel>
  );
}

function AssetsPanel({ assets, setActive }) {
  return (
    <Panel title="Assets" action="Fleet detail" onAction={() => setActive('Assets')}>
      <div className="asset-list">
        {assets.map((asset) => (
          <article key={asset.tag}>
            <div><strong>{asset.tag}</strong><span>{asset.city} / {asset.status}</span></div>
            <Meter value={asset.health} />
            <b>{asset.health}%</b>
          </article>
        ))}
      </div>
    </Panel>
  );
}

function TroubleshootingPanel({ hotspot, className = '' }) {
  return (
    <Panel className={className} title="Troubleshooting" action="AI playbook">
      <ol className="playbook">
        <li>Pull replay bundle, route trace, and sensor health for {hotspot.city}.</li>
        <li>Compare perception, prediction, planning, controls, localization, map, and remote assist logs.</li>
        <li>Create owner handoff with evidence, cost impact, rollback advice, and next check time.</li>
      </ol>
    </Panel>
  );
}

function MilestonesPanel({ milestones, setActive, active, className = '' }) {
  return (
    <Panel
      className={className}
      title="Milestone Tracker"
      action="View all milestones"
      onAction={setActive && active !== 'Milestones' ? () => setActive('Milestones') : undefined}
    >
      <div className="milestones">
        {milestones.map((item) => (
          <article key={item.name}>
            <span className={`milestone-dot ${item.tone}`} />
            <div><strong>{item.name}</strong><p>{item.detail}</p></div>
            <div className="milestone-status"><b>{item.state}</b><span>{item.progress}%</span></div>
            <Meter value={item.progress} tone={item.tone} />
          </article>
        ))}
      </div>
    </Panel>
  );
}

function MileagePanel({ totalMileage, className = '' }) {
  return (
    <Panel className={className} title="Mileage Accumulation" action="7D">
      <div className="mileage-chart">
        <div className="mileage-copy"><span>Total Mileage</span><strong>{(totalMileage / 1000000).toFixed(2)}M mi</strong><em>+7.6% vs last 7 days</em></div>
        <svg viewBox="0 0 640 260" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 212 C82 190 132 166 190 158 S298 136 360 116 456 122 520 94 594 62 640 42 L640 260 L0 260Z" />
          <polyline points="0,212 84,184 190,158 278,140 360,116 456,122 520,94 594,62 640,42" />
          {[0, 84, 190, 278, 360, 456, 520, 594, 640].map((x, index) => <circle key={x} cx={x} cy={[212, 184, 158, 140, 116, 122, 94, 62, 42][index]} r="5" />)}
        </svg>
      </div>
    </Panel>
  );
}

function MapArtwork() {
  return (
    <svg className="map-art" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <path className="district a" d="M7 18 23 8l16 8 4 17-10 12 6 15-20 7L5 51 3 30Z" />
      <path className="district b" d="M42 14 61 9l13 13-6 17 9 14-22 8-17-13 5-18Z" />
      <path className="district c" d="M72 19 88 10l10 12-4 18 4 14-16 12-17-12 2-19Z" />
      <path className="route" d="M12 48 C24 38 34 58 43 53 54 48 59 56 68 67 76 78 84 73 91 82" />
      <path className="route" d="M18 18 C26 31 41 28 50 35 59 42 68 33 77 23" />
      <path className="route" d="M25 78 C34 66 40 65 48 70 56 76 62 72 68 67" />
      <path className="route" d="M68 67 C72 54 76 44 85 36" />
    </svg>
  );
}

function HealthRow({ color, label, value, percent }) {
  return <div><span><i className={color} />{label}</span><strong>{value}</strong><b>{percent}</b></div>;
}

function FinanceItem({ label, cost, delta, tone }) {
  return (
    <article>
      <span className={tone}>{label}</span>
      <strong>${cost.toLocaleString()}</strong>
      <em className={tone}>{delta}</em>
    </article>
  );
}

function Meter({ value, tone = 'cyan' }) {
  return <div className={`meter ${tone}`}><span style={{ width: `${value}%` }} /></div>;
}

function SettingsUpdates({ updates, setUpdates, version, status }) {
  return (
    <div className="settings-body">
      <label className="switch"><input checked={updates} onChange={() => setUpdates(!updates)} type="checkbox" /><span />Automatic updates</label>
      <div className="setting-line"><span>Current version</span><strong>{version}</strong></div>
      <div className="setting-line"><span>Release channel</span><strong>Stable operations</strong></div>
      <div className="setting-line"><span>Feedback status</span><strong>{status}</strong></div>
    </div>
  );
}

function SettingsAppearance({ theme, setTheme }) {
  return (
    <div className="settings-body">
      <label className="switch"><input checked={theme === 'dark'} onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')} type="checkbox" /><span />Dark mode</label>
      <div className="theme-options">
        <button className={theme === 'dark' ? 'selected' : ''} onClick={() => setTheme('dark')} type="button">Dark</button>
        <button className={theme === 'light' ? 'selected' : ''} onClick={() => setTheme('light')} type="button">Light</button>
      </div>
    </div>
  );
}

function SettingsSupabase() {
  const configured = supabaseEnabled;
  return (
    <div className="settings-body">
      <div className="setting-line"><span>Data source</span><strong>{configured ? 'Supabase connected' : 'Demo fallback'}</strong></div>
      <div className="setting-line"><span>Tables</span><strong>locations, assets, milestones, incidents, tickets, troubleshooting_logs, feedback</strong></div>
      <p className="note">Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`, then run `supabase-schema.sql` to enable auth, live reads, and write actions.</p>
    </div>
  );
}

export default App;
