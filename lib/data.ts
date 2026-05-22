import type { Campaign, Lead } from "@/types";

export type SmartScaleIssueType =
  | "missing_item_risk"
  | "wrong_item_risk"
  | "extra_item_risk"
  | "drink_missing"
  | "sauce_or_side_missing"
  | "customization_weight_variance"
  | "scale_not_used"
  | "device_offline"
  | "calibration_issue"
  | "staff_override"
  | "false_positive"
  | "dasher_wait_delay"
  | "order_ready_signal_failure";

export type SmartScaleSeverity = "low" | "medium" | "high" | "critical";
export type SmartScaleResult = "pass" | "review" | "fail" | "skipped";
export type SmartScaleDeviceStatus = "online" | "offline" | "maintenance";
export type SmartScaleCheckStatus = "open" | "investigating" | "resolved" | "dismissed";

export type SmartScaleStore = {
  id: string;
  store: string;
  market: string;
  adoptionScore: number;
  smartscaleEnabled: boolean;
};

export type SmartScaleDevice = {
  id: string;
  storeId: string;
  name: string;
  status: SmartScaleDeviceStatus;
  calibrationStatus: "current" | "due" | "overdue" | "failed";
  lastCheckIn: string;
};

export type SmartScaleCheck = {
  id: string;
  orderId: string;
  storeId: string;
  deviceId: string;
  expectedWeight: number;
  actualWeight: number;
  toleranceRange: number;
  difference: number;
  result: SmartScaleResult;
  issueType: SmartScaleIssueType;
  severity: SmartScaleSeverity;
  aiRecommendation: string;
  status: SmartScaleCheckStatus;
  staffAction: string;
  dasherWaitTime: number;
  orderReadySignalAccurate: boolean;
  customizations: string[];
  date: string;
};

export type SmartScaleFraudRecord = {
  id: string;
  storeId: string;
  deviceId: string;
  fraudRiskScore: number;
  repeatedStaffOverrides: number;
  suspiciousWeightPatterns: string;
  fakeOrderReadySignals: number;
  repeatedMissingItemClaims: number;
  abnormalRefundRate: number;
  suspiciousActivitySummary: string;
  merchantAbuseAlerts: string[];
  operationalRecommendations: string[];
  riskLevel: "low" | "medium" | "high" | "critical";
};

export type ExecutiveTrendPoint = {
  week: string;
  fleetUptime: number;
  deliverySuccessRate: number;
  operationalCostSavings: number;
  customerSatisfaction: number;
};

export type ExecutiveForecastPoint = {
  period: string;
  fleetUptime: number;
  deliverySuccessRate: number;
  operationalCostSavings: number;
  customerSatisfaction: number;
};

export type ExecutiveMarketComparison = {
  market: string;
  fleetUptime: number;
  deliverySuccessRate: number;
  smartscaleImpact: number;
  robotEfficiency: number;
  customerSatisfaction: number;
};

export type ExecutiveOperationsSnapshot = {
  fleetUptime: number;
  deliverySuccessRate: number;
  operationalCostSavings: string;
  missingItemReduction: number;
  smartscaleImpact: string;
  aiEscalationReduction: number;
  robotEfficiency: number;
  customerSatisfaction: number;
  weeklyTrends: ExecutiveTrendPoint[];
  operationalForecasts: ExecutiveForecastPoint[];
  marketComparisons: ExecutiveMarketComparison[];
  executiveSummaries: string[];
};

export type SupervisorAgentStatus = {
  id: string;
  name: "Fleet Agent" | "SmartScale Agent" | "Dispatch Agent" | "Merchant Agent" | "Customer Agent" | "Maintenance Agent";
  status: "active" | "monitoring" | "escalated";
  currentTask: string;
  confidenceScore: number;
  recommendation: string;
};

export type SupervisorQueueItem = {
  id: string;
  priority: "low" | "medium" | "high" | "critical";
  incidentTitle: string;
  ownerAgent: string;
  conflictingRecommendation: string;
  supervisorDecision: string;
  escalationTarget: string;
};

export type MultiAgentSupervisorSnapshot = {
  activeAgents: SupervisorAgentStatus[];
  operationalQueue: SupervisorQueueItem[];
  supervisorSummary: string;
  efficiencyStatus: string;
};

export type PredictiveIncidentPrediction = {
  id: string;
  entityName: string;
  city: string;
  historicalIncidents: number;
  robotTelemetry: string;
  batteryTrend: string;
  routeCongestion: string;
  weather: string;
  deliveryDelays: string;
  smartscaleMismatchRate: number;
  storeAccuracyRate: number;
  networkReliability: number;
  riskScore: number;
  predictedIssue: string;
  confidence: number;
  recommendedPreventionAction: string;
  estimatedOperationalImpact: string;
  deliveryFailureProbability: number;
  robotRecoveryRisk: "low" | "medium" | "high";
  etaDegradationMinutes: number;
  customerDissatisfactionRisk: number;
};

export type RemoteAssistanceIncident = {
  id: string;
  robotName: string;
  city: string;
  cameraSnapshotLabel: string;
  localizationConfidence: number;
  gps: string;
  robotSpeed: number;
  nearbyObstacles: string[];
  pedestrianDensity: "low" | "medium" | "high";
  operationalSummary: string;
  interventionRecommendation: string;
  safetyConcerns: string[];
  escalationUrgency: "low" | "medium" | "high" | "critical";
  suggestedOperatorCommands: string[];
  priorityRank: number;
};

export type MerchantPerformanceRecord = {
  id: string;
  storeId: string;
  storeName: string;
  market: string;
  orderAccuracy: number;
  smartscaleUsage: number;
  prepDelayMinutes: number;
  dasherWaitTime: number;
  customerComplaints: number;
  refundRate: number;
  issueRecurrence: number;
  storeScore: number;
  mainOperationalIssue: string;
  riskLevel: "low" | "medium" | "high" | "critical";
  recommendedStoreActions: string[];
  trendDirection: "improving" | "stable" | "declining";
};

export type DasherOperationsRecord = {
  id: string;
  storeName: string;
  market: string;
  pickupDelays: number;
  waitTimeMinutes: number;
  failedHandoffs: number;
  wrongOrders: number;
  restaurantCongestion: number;
  difficultParkingZone: boolean;
  repeatedMerchantIssues: number;
  dasherFrictionScore: number;
  pickupEfficiency: number;
  operationalRecommendations: string[];
  zoneName: string;
};

export type PickupZoneHeatmapPoint = {
  id: string;
  zoneName: string;
  market: string;
  x: number;
  y: number;
  intensity: number;
  primaryCause: string;
};

export type SimulationRoutePoint = {
  x: number;
  y: number;
  eventTime: number;
  label: string;
};

export type SimulationIncidentOverlay = {
  id: string;
  time: number;
  type: string;
  severity: "low" | "medium" | "high" | "critical";
  x: number;
  y: number;
  description: string;
};

export type DeliverySimulationScenario = {
  id: string;
  name: string;
  market: string;
  durationMinutes: number;
  pedestrianDensity: "low" | "medium" | "high";
  weatherImpact: string;
  merchantDelayMinutes: number;
  dasherArrivalOffset: number;
  smartscaleIssue: string;
  robotFailureMode: string;
  routePoints: SimulationRoutePoint[];
  incidentOverlays: SimulationIncidentOverlay[];
  recoveryActions: string[];
  dispatchDecisions: string[];
  aiSummary: string;
};

export type VoiceOpsCommandExample = {
  id: string;
  command: string;
  category: "incidents" | "smartscale" | "robot" | "stores";
};

export type DispatchOptimizationRecommendation = {
  id: string;
  orderGroup: string;
  market: string;
  robotCandidates: string[];
  batteryConstraint: string;
  robotHealth: string;
  merchantReadiness: string;
  customerEtaTarget: string;
  trafficConditions: string;
  batchingDecision: string;
  chargingSchedule: string;
  routeEfficiencyScore: number;
  congestionAvoidanceNote: string;
  recommendedRobot: string;
  optimizedRoute: string[];
  estimatedTimeSaved: string;
  batteryImpact: string;
  priorityLevel: "low" | "medium" | "high" | "critical";
};

export type CustomerRecoveryCase = {
  id: string;
  issueType: "delayed_delivery" | "missing_item" | "wrong_item" | "robot_failure" | "canceled_order";
  orderId: string;
  storeName: string;
  market: string;
  customerExplanation: string;
  refundRecommendation: string;
  supportEscalation: string;
  recoveryCouponSuggestion: string;
  etaUpdate: string;
  satisfactionPriority: number;
  estimatedRecoveryCost: string;
};

export type FleetHealthPrediction = {
  id: string;
  robotName: string;
  market: string;
  motorTemperatureC: number;
  batteryDegradation: number;
  sensorHealth: number;
  networkReliability: number;
  cpuUsage: number;
  brakingAnomalies: number;
  wheelResistance: number;
  likelyComponentFailure: string;
  maintenanceUrgency: "low" | "medium" | "high" | "critical";
  fleetDowntimeRisk: number;
  maintenanceRecommendations: string[];
  recommendedMaintenanceWindow: string;
};

export type IncidentReplayTelemetry = {
  minute: number;
  speed: number;
  battery: number;
  localizationConfidence: number;
  networkReliability: number;
  motorTemperatureC: number;
};

export type IncidentReplayEvent = {
  id: string;
  minute: number;
  type: "route_event" | "incident" | "ai_decision" | "operator_action";
  title: string;
  detail: string;
  severity: "low" | "medium" | "high" | "critical";
  x: number;
  y: number;
};

export type IncidentReplayRecord = {
  id: string;
  incidentId: string;
  robotName: string;
  market: string;
  incidentType: string;
  durationMinutes: number;
  summary: string;
  rootCauseAnalysis: string;
  exportLabel: string;
  routePoints: SimulationRoutePoint[];
  telemetry: IncidentReplayTelemetry[];
  aiDecisions: string[];
  operatorActions: string[];
  timeline: IncidentReplayEvent[];
};

export const leads: Lead[] = [
  {
    id: "lead_001",
    company: "Northstar BioSystems",
    domain: "northstarbio.io",
    segment: "Healthcare AI",
    location: "Boston, MA",
    employees: 420,
    revenue: "$84M",
    score: 94,
    intent: "Hiring RevOps + evaluating data enrichment",
    status: "Qualified",
    owner: "Maya",
    saved: true,
    signals: ["Series C", "New CRO", "HubSpot migration"],
    summary: "Fast-growing healthtech operator adding commercial analytics and looking to unify scattered account data."
  },
  {
    id: "lead_002",
    company: "AtlasGrid Energy",
    domain: "atlasgrid.energy",
    segment: "Climate SaaS",
    location: "Austin, TX",
    employees: 260,
    revenue: "$38M",
    score: 88,
    intent: "Expanded enterprise SDR team",
    status: "Researching",
    owner: "Noah",
    saved: false,
    signals: ["Funding", "G2 spike", "Outbound roles"],
    summary: "Grid analytics platform moving upmarket after a new utility partnership and higher demand-gen spend."
  },
  {
    id: "lead_003",
    company: "Quantora Finance",
    domain: "quantora.capital",
    segment: "Fintech",
    location: "New York, NY",
    employees: 780,
    revenue: "$140M",
    score: 82,
    intent: "Salesforce data hygiene initiative",
    status: "Contacted",
    owner: "Iris",
    saved: true,
    signals: ["New VP Sales", "Data quality posts", "SOC2 refresh"],
    summary: "Fintech team with complex buying groups and visible CRM cleanup pressure across revenue teams."
  },
  {
    id: "lead_004",
    company: "LuminaWorks",
    domain: "luminaworks.ai",
    segment: "B2B AI",
    location: "San Francisco, CA",
    employees: 150,
    revenue: "$22M",
    score: 76,
    intent: "Building founder-led outbound motion",
    status: "Nurture",
    owner: "Elle",
    saved: false,
    signals: ["Product launch", "Founder posts", "Clay stack"],
    summary: "Early GTM team testing persona-specific outbound after releasing a workflow automation suite."
  },
  {
    id: "lead_005",
    company: "Keystone Logistics",
    domain: "keystonelogistics.com",
    segment: "Supply Chain",
    location: "Chicago, IL",
    employees: 940,
    revenue: "$210M",
    score: 91,
    intent: "Target account expansion into manufacturing",
    status: "Qualified",
    owner: "Maya",
    saved: true,
    signals: ["Territory launch", "ABM agency", "Hiring AEs"],
    summary: "Established logistics provider with fresh enterprise territories and need for account intelligence at scale."
  }
];

export const campaigns: Campaign[] = [
  { name: "Healthcare AI CFOs", sent: 1280, replies: 164, pipeline: "$610K", conversion: 12.8 },
  { name: "Climate SaaS RevOps", sent: 840, replies: 112, pipeline: "$392K", conversion: 13.3 },
  { name: "Fintech Data Hygiene", sent: 1125, replies: 97, pipeline: "$455K", conversion: 8.6 },
  { name: "Supply Chain Expansion", sent: 690, replies: 89, pipeline: "$520K", conversion: 12.9 }
];

export const chartData = [
  { month: "Jan", leads: 180, pipeline: 240 },
  { month: "Feb", leads: 250, pipeline: 330 },
  { month: "Mar", leads: 310, pipeline: 380 },
  { month: "Apr", leads: 420, pipeline: 510 },
  { month: "May", leads: 520, pipeline: 760 },
  { month: "Jun", leads: 610, pipeline: 920 }
];

export const navItems = [
  "Dashboard",
  "Multi-Agent Supervisor",
  "Executive Ops",
  "SmartScale Operations",
  "SmartScale Fraud",
  "Merchant Intelligence",
  "Dasher Operations",
  "Simulation Lab",
  "Incident Replay",
  "Voice Ops",
  "Dispatch Optimizer",
  "Fleet Health",
  "Customer Recovery",
  "Lead Explorer",
  "Company Intelligence",
  "Outreach",
  "Campaigns",
  "Analytics",
  "Settings"
] as const;

export const smartscaleStores: SmartScaleStore[] = [
  { id: "store_sf_01", store: "Mission Taqueria 18th St", market: "San Francisco", adoptionScore: 91, smartscaleEnabled: true },
  { id: "store_la_02", store: "BurgerCraft Sunset", market: "Los Angeles", adoptionScore: 74, smartscaleEnabled: true },
  { id: "store_sea_03", store: "Green Bowl Capitol Hill", market: "Seattle", adoptionScore: 82, smartscaleEnabled: true },
  { id: "store_atx_04", store: "NoodleWorks South Congress", market: "Austin", adoptionScore: 38, smartscaleEnabled: false },
  { id: "store_den_05", store: "DashMart LoDo", market: "Denver", adoptionScore: 57, smartscaleEnabled: true }
];

export const smartscaleDevices: SmartScaleDevice[] = [
  { id: "device_01", storeId: "store_sf_01", name: "Scale A - Expo Line", status: "online", calibrationStatus: "current", lastCheckIn: "2026-05-21T15:58:00.000Z" },
  { id: "device_02", storeId: "store_la_02", name: "Scale B - Pickup Shelf", status: "online", calibrationStatus: "due", lastCheckIn: "2026-05-21T15:54:00.000Z" },
  { id: "device_03", storeId: "store_sea_03", name: "Scale A - Salad Station", status: "maintenance", calibrationStatus: "overdue", lastCheckIn: "2026-05-21T15:12:00.000Z" },
  { id: "device_04", storeId: "store_atx_04", name: "Scale Pilot - Front Counter", status: "offline", calibrationStatus: "failed", lastCheckIn: "2026-05-21T12:40:00.000Z" },
  { id: "device_05", storeId: "store_den_05", name: "Scale C - Handoff Shelf", status: "offline", calibrationStatus: "current", lastCheckIn: "2026-05-21T14:21:00.000Z" }
];

export const smartscaleChecks: SmartScaleCheck[] = [
  {
    id: "ssc_001",
    orderId: "DD-883104",
    storeId: "store_sf_01",
    deviceId: "device_01",
    expectedWeight: 842,
    actualWeight: 846,
    toleranceRange: 30,
    difference: 4,
    result: "pass",
    issueType: "false_positive",
    severity: "low",
    aiRecommendation: "Release order. Weight within tolerance after double-check.",
    status: "resolved",
    staffAction: "accepted",
    dasherWaitTime: 2,
    orderReadySignalAccurate: true,
    customizations: ["extra salsa"],
    date: "2026-05-21T15:25:00.000Z"
  },
  {
    id: "ssc_002",
    orderId: "DD-883219",
    storeId: "store_la_02",
    deviceId: "device_02",
    expectedWeight: 1180,
    actualWeight: 940,
    toleranceRange: 45,
    difference: -240,
    result: "fail",
    issueType: "missing_item_risk",
    severity: "high",
    aiRecommendation: "Reopen bag, verify fries and sealed side, then reweigh before release.",
    status: "investigating",
    staffAction: "repacked",
    dasherWaitTime: 11,
    orderReadySignalAccurate: true,
    customizations: [],
    date: "2026-05-21T15:32:00.000Z"
  },
  {
    id: "ssc_003",
    orderId: "DD-883244",
    storeId: "store_la_02",
    deviceId: "device_02",
    expectedWeight: 640,
    actualWeight: 812,
    toleranceRange: 25,
    difference: 172,
    result: "fail",
    issueType: "extra_item_risk",
    severity: "medium",
    aiRecommendation: "Check for duplicate side or wrong bag assignment at pickup shelf.",
    status: "open",
    staffAction: "manager_review",
    dasherWaitTime: 8,
    orderReadySignalAccurate: false,
    customizations: [],
    date: "2026-05-21T15:06:00.000Z"
  },
  {
    id: "ssc_004",
    orderId: "DD-883276",
    storeId: "store_sea_03",
    deviceId: "device_03",
    expectedWeight: 705,
    actualWeight: 762,
    toleranceRange: 35,
    difference: 57,
    result: "review",
    issueType: "customization_weight_variance",
    severity: "medium",
    aiRecommendation: "Manual verify modifiers and update expected profile for extra protein bowl.",
    status: "resolved",
    staffAction: "marked_customization",
    dasherWaitTime: 6,
    orderReadySignalAccurate: true,
    customizations: ["double chicken", "extra avocado"],
    date: "2026-05-21T15:41:00.000Z"
  },
  {
    id: "ssc_005",
    orderId: "DD-883301",
    storeId: "store_atx_04",
    deviceId: "device_04",
    expectedWeight: 990,
    actualWeight: 0,
    toleranceRange: 40,
    difference: -990,
    result: "skipped",
    issueType: "device_offline",
    severity: "critical",
    aiRecommendation: "Move to manual checklist, reboot device, and coach shift lead on fallback flow.",
    status: "open",
    staffAction: "manager_review",
    dasherWaitTime: 14,
    orderReadySignalAccurate: false,
    customizations: [],
    date: "2026-05-21T15:48:00.000Z"
  },
  {
    id: "ssc_006",
    orderId: "DD-883318",
    storeId: "store_atx_04",
    deviceId: "device_04",
    expectedWeight: 420,
    actualWeight: 0,
    toleranceRange: 20,
    difference: -420,
    result: "skipped",
    issueType: "scale_not_used",
    severity: "high",
    aiRecommendation: "Pause handoff, run backup weigh check, and log missed SmartScale step.",
    status: "investigating",
    staffAction: "staff_override",
    dasherWaitTime: 9,
    orderReadySignalAccurate: false,
    customizations: [],
    date: "2026-05-21T14:52:00.000Z"
  },
  {
    id: "ssc_007",
    orderId: "DD-883355",
    storeId: "store_den_05",
    deviceId: "device_05",
    expectedWeight: 520,
    actualWeight: 520,
    toleranceRange: 20,
    difference: 0,
    result: "review",
    issueType: "order_ready_signal_failure",
    severity: "medium",
    aiRecommendation: "Mark ready status from kitchen tablet and release order to waiting Dasher.",
    status: "resolved",
    staffAction: "accepted",
    dasherWaitTime: 12,
    orderReadySignalAccurate: false,
    customizations: [],
    date: "2026-05-21T13:37:00.000Z"
  },
  {
    id: "ssc_008",
    orderId: "DD-883401",
    storeId: "store_sf_01",
    deviceId: "device_01",
    expectedWeight: 356,
    actualWeight: 214,
    toleranceRange: 18,
    difference: -142,
    result: "fail",
    issueType: "drink_missing",
    severity: "high",
    aiRecommendation: "Add fountain drink, confirm lid seal, then reweigh bag and carrier.",
    status: "open",
    staffAction: "repacked",
    dasherWaitTime: 5,
    orderReadySignalAccurate: true,
    customizations: [],
    date: "2026-05-21T11:55:00.000Z"
  },
  {
    id: "ssc_009",
    orderId: "DD-883447",
    storeId: "store_sea_03",
    deviceId: "device_03",
    expectedWeight: 610,
    actualWeight: 690,
    toleranceRange: 22,
    difference: 80,
    result: "review",
    issueType: "false_positive",
    severity: "low",
    aiRecommendation: "Modifier-driven overage. Confirm receipt stickers and release order.",
    status: "dismissed",
    staffAction: "marked_customization",
    dasherWaitTime: 3,
    orderReadySignalAccurate: true,
    customizations: ["extra tofu", "double sauce"],
    date: "2026-05-21T10:42:00.000Z"
  },
  {
    id: "ssc_010",
    orderId: "DD-883489",
    storeId: "store_den_05",
    deviceId: "device_05",
    expectedWeight: 882,
    actualWeight: 0,
    toleranceRange: 28,
    difference: -882,
    result: "skipped",
    issueType: "calibration_issue",
    severity: "critical",
    aiRecommendation: "Take device offline, swap to backup scale, and notify engineering with error logs.",
    status: "investigating",
    staffAction: "escalated",
    dasherWaitTime: 16,
    orderReadySignalAccurate: true,
    customizations: [],
    date: "2026-05-21T09:18:00.000Z"
  },
  {
    id: "ssc_011",
    orderId: "DD-883512",
    storeId: "store_la_02",
    deviceId: "device_02",
    expectedWeight: 744,
    actualWeight: 612,
    toleranceRange: 26,
    difference: -132,
    result: "fail",
    issueType: "sauce_or_side_missing",
    severity: "medium",
    aiRecommendation: "Add side cup and sauce kit, then hand off immediately to waiting Dasher.",
    status: "resolved",
    staffAction: "repacked",
    dasherWaitTime: 7,
    orderReadySignalAccurate: true,
    customizations: [],
    date: "2026-05-21T08:47:00.000Z"
  },
  {
    id: "ssc_012",
    orderId: "DD-883540",
    storeId: "store_sf_01",
    deviceId: "device_01",
    expectedWeight: 690,
    actualWeight: 878,
    toleranceRange: 24,
    difference: 188,
    result: "fail",
    issueType: "wrong_item_risk",
    severity: "high",
    aiRecommendation: "Verify bag label against order screen. Likely wrong entree in handoff queue.",
    status: "open",
    staffAction: "manager_review",
    dasherWaitTime: 10,
    orderReadySignalAccurate: false,
    customizations: [],
    date: "2026-05-20T20:13:00.000Z"
  }
];

export const smartscaleFraudRecords: SmartScaleFraudRecord[] = [
  {
    id: "ssf_001",
    storeId: "store_sf_01",
    deviceId: "scale_sf_01",
    fraudRiskScore: 79,
    repeatedStaffOverrides: 8,
    suspiciousWeightPatterns: "Frequent underweight passes followed by manual override during dinner rush.",
    fakeOrderReadySignals: 5,
    repeatedMissingItemClaims: 7,
    abnormalRefundRate: 6.9,
    suspiciousActivitySummary: "Mission Taqueria is showing clustered overrides and early ready signals on orders later tied to missing-item claims.",
    merchantAbuseAlerts: [
      "Override rate is 2.4x market average.",
      "Order-ready signals are firing before verification completion on multiple high-claim orders.",
      "Refund volume is rising faster than order volume."
    ],
    operationalRecommendations: [
      "Require supervisor confirmation for SmartScale overrides on this shift.",
      "Audit ready-signal workflow against SmartScale verify step.",
      "Review top staff override cohort and compare against refund claims."
    ],
    riskLevel: "high"
  },
  {
    id: "ssf_002",
    storeId: "store_la_02",
    deviceId: "scale_la_02",
    fraudRiskScore: 91,
    repeatedStaffOverrides: 13,
    suspiciousWeightPatterns: "Identical weight values repeated across distinct basket sizes, suggesting bypassed or staged checks.",
    fakeOrderReadySignals: 9,
    repeatedMissingItemClaims: 11,
    abnormalRefundRate: 8.4,
    suspiciousActivitySummary: "BurgerCraft Sunset shows the strongest abuse signal, with repeated static weights, heavy override use, and abnormal refund clustering.",
    merchantAbuseAlerts: [
      "Suspicious flat weight pattern repeats across incompatible orders.",
      "Missing-item claims remain elevated after staff overrides.",
      "Refund behavior exceeds brand baseline by 3.1 percentage points."
    ],
    operationalRecommendations: [
      "Escalate merchant to trust and merchant operations review.",
      "Inspect device placement and staff workflow for staged weigh-ins.",
      "Temporarily block ready signal before successful scale verification."
    ],
    riskLevel: "critical"
  },
  {
    id: "ssf_003",
    storeId: "store_sea_03",
    deviceId: "scale_sea_03",
    fraudRiskScore: 52,
    repeatedStaffOverrides: 4,
    suspiciousWeightPatterns: "Occasional overweight anomalies concentrated on modifier-heavy orders.",
    fakeOrderReadySignals: 2,
    repeatedMissingItemClaims: 3,
    abnormalRefundRate: 4.1,
    suspiciousActivitySummary: "Green Bowl has moderate fraud risk, but most anomalies are still consistent with customization drift rather than clear abuse.",
    merchantAbuseAlerts: [
      "Modifier-heavy bowls are inflating mismatch noise.",
      "A smaller override cluster is emerging on late-night shifts."
    ],
    operationalRecommendations: [
      "Tune tolerance ranges for high-customization bowls.",
      "Monitor late-night override patterns for escalation.",
      "Coach staff to attach modifier verification notes."
    ],
    riskLevel: "medium"
  },
  {
    id: "ssf_004",
    storeId: "store_atx_04",
    deviceId: "scale_atx_04",
    fraudRiskScore: 67,
    repeatedStaffOverrides: 6,
    suspiciousWeightPatterns: "High variance on bagged combos with intermittent no-scale flow followed by ready signal.",
    fakeOrderReadySignals: 6,
    repeatedMissingItemClaims: 5,
    abnormalRefundRate: 5.5,
    suspiciousActivitySummary: "NoodleWorks South Congress is showing process abuse risk centered on skipped checks and early release behavior.",
    merchantAbuseAlerts: [
      "Ready signals occasionally arrive while scale status is still skipped.",
      "Refund rate is trending upward on late handoffs."
    ],
    operationalRecommendations: [
      "Block order-ready signal when scale status is skipped.",
      "Review skipped-check root cause with store manager.",
      "Trigger spot audits on combo packing line."
    ],
    riskLevel: "high"
  },
  {
    id: "ssf_005",
    storeId: "store_den_05",
    deviceId: "scale_den_05",
    fraudRiskScore: 28,
    repeatedStaffOverrides: 1,
    suspiciousWeightPatterns: "Normal variance within expected claim and refund bands.",
    fakeOrderReadySignals: 0,
    repeatedMissingItemClaims: 1,
    abnormalRefundRate: 2.2,
    suspiciousActivitySummary: "DashMart LoDo is operating inside normal SmartScale behavior and does not show coordinated abuse patterns.",
    merchantAbuseAlerts: [
      "No active merchant abuse alert."
    ],
    operationalRecommendations: [
      "Maintain current verification workflow.",
      "Keep passive monitoring active."
    ],
    riskLevel: "low"
  }
];

export const executiveOperationsSnapshot: ExecutiveOperationsSnapshot = {
  fleetUptime: 98.7,
  deliverySuccessRate: 96.4,
  operationalCostSavings: "$184K this quarter",
  missingItemReduction: 31,
  smartscaleImpact: "24% fewer remake events",
  aiEscalationReduction: 19,
  robotEfficiency: 88,
  customerSatisfaction: 92,
  weeklyTrends: [
    { week: "W1", fleetUptime: 96.9, deliverySuccessRate: 94.8, operationalCostSavings: 32, customerSatisfaction: 88 },
    { week: "W2", fleetUptime: 97.4, deliverySuccessRate: 95.1, operationalCostSavings: 36, customerSatisfaction: 89 },
    { week: "W3", fleetUptime: 97.9, deliverySuccessRate: 95.5, operationalCostSavings: 39, customerSatisfaction: 90 },
    { week: "W4", fleetUptime: 98.2, deliverySuccessRate: 95.8, operationalCostSavings: 43, customerSatisfaction: 91 },
    { week: "W5", fleetUptime: 98.5, deliverySuccessRate: 96.1, operationalCostSavings: 47, customerSatisfaction: 91 },
    { week: "W6", fleetUptime: 98.7, deliverySuccessRate: 96.4, operationalCostSavings: 51, customerSatisfaction: 92 }
  ],
  operationalForecasts: [
    { period: "Next week", fleetUptime: 98.8, deliverySuccessRate: 96.6, operationalCostSavings: 54, customerSatisfaction: 92 },
    { period: "2 weeks", fleetUptime: 99.0, deliverySuccessRate: 96.9, operationalCostSavings: 58, customerSatisfaction: 93 },
    { period: "30 days", fleetUptime: 99.1, deliverySuccessRate: 97.2, operationalCostSavings: 64, customerSatisfaction: 93 }
  ],
  marketComparisons: [
    { market: "San Francisco", fleetUptime: 99.1, deliverySuccessRate: 97.0, smartscaleImpact: 28, robotEfficiency: 91, customerSatisfaction: 93 },
    { market: "Los Angeles", fleetUptime: 97.8, deliverySuccessRate: 95.2, smartscaleImpact: 19, robotEfficiency: 84, customerSatisfaction: 89 },
    { market: "Seattle", fleetUptime: 98.4, deliverySuccessRate: 96.1, smartscaleImpact: 22, robotEfficiency: 87, customerSatisfaction: 91 },
    { market: "Austin", fleetUptime: 96.9, deliverySuccessRate: 94.6, smartscaleImpact: 14, robotEfficiency: 81, customerSatisfaction: 87 },
    { market: "Denver", fleetUptime: 98.9, deliverySuccessRate: 96.8, smartscaleImpact: 24, robotEfficiency: 89, customerSatisfaction: 92 }
  ],
  executiveSummaries: [
    "Fleet uptime and delivery success are both improving week over week, with the strongest gains coming from reduced robot downtime and fewer late-stage dispatch interventions.",
    "SmartScale adoption is cutting missing-item fallout and remake cost, especially in San Francisco and Denver where verification discipline is highest.",
    "Austin and Los Angeles remain the main drag on network efficiency because of lower SmartScale impact, higher friction at handoff, and weaker robot utilization."
  ]
};

export const multiAgentSupervisorSnapshot: MultiAgentSupervisorSnapshot = {
  activeAgents: [
    {
      id: "sup_agent_01",
      name: "Fleet Agent",
      status: "active",
      currentTask: "Prioritizing robot slowdown incidents in San Francisco and Austin.",
      confidenceScore: 93,
      recommendation: "Shift spare robots toward downtown zones and cap route density for overheated units."
    },
    {
      id: "sup_agent_02",
      name: "SmartScale Agent",
      status: "active",
      currentTask: "Reviewing repeated override clusters and missing-item risk spikes at BurgerCraft Sunset.",
      confidenceScore: 89,
      recommendation: "Hold ready signal until verified weight pass completes and trigger supervisor override approval."
    },
    {
      id: "sup_agent_03",
      name: "Dispatch Agent",
      status: "monitoring",
      currentTask: "Balancing robot assignment and Dasher arrivals against congestion in Los Angeles.",
      confidenceScore: 85,
      recommendation: "Delay low-priority batch grouping and release single-order dispatches for tighter ETA control."
    },
    {
      id: "sup_agent_04",
      name: "Merchant Agent",
      status: "active",
      currentTask: "Ranking stores with prep delays, low SmartScale adoption, and repeat handoff friction.",
      confidenceScore: 87,
      recommendation: "Escalate Austin merchant workflow audit before evening rush."
    },
    {
      id: "sup_agent_05",
      name: "Customer Agent",
      status: "monitoring",
      currentTask: "Preparing recovery options for late or at-risk deliveries with higher satisfaction exposure.",
      confidenceScore: 82,
      recommendation: "Use lower-cost credits first unless ETA breach exceeds customer promise window."
    },
    {
      id: "sup_agent_06",
      name: "Maintenance Agent",
      status: "escalated",
      currentTask: "Assessing brake controller risk on R305 and motor temperature spikes on R102.",
      confidenceScore: 95,
      recommendation: "Pull R305 immediately and shift work to backup fleet before downtown demand spike."
    }
  ],
  operationalQueue: [
    {
      id: "sup_queue_01",
      priority: "critical",
      incidentTitle: "R305 brake controller overheating during active dispatch",
      ownerAgent: "Maintenance Agent",
      conflictingRecommendation: "Dispatch Agent wants to preserve coverage; Maintenance Agent wants immediate pull from service.",
      supervisorDecision: "Remove R305 from fleet now and reassign nearby orders to backup robots plus Dashers.",
      escalationTarget: "fleet_ops"
    },
    {
      id: "sup_queue_02",
      priority: "high",
      incidentTitle: "BurgerCraft Sunset override cluster with fake ready-signal suspicion",
      ownerAgent: "SmartScale Agent",
      conflictingRecommendation: "Merchant Agent prefers coaching first; SmartScale Agent recommends workflow lock.",
      supervisorDecision: "Apply temporary ready-signal lock and open merchant ops review in parallel.",
      escalationTarget: "merchant_ops"
    },
    {
      id: "sup_queue_03",
      priority: "high",
      incidentTitle: "Austin route congestion causing ETA drift and customer recovery risk",
      ownerAgent: "Dispatch Agent",
      conflictingRecommendation: "Fleet Agent recommends route throttling; Customer Agent recommends faster expensive recovery actions.",
      supervisorDecision: "Throttle route density first, reserve recovery credits only for orders breaching promise window.",
      escalationTarget: "none"
    },
    {
      id: "sup_queue_04",
      priority: "medium",
      incidentTitle: "Los Angeles merchant prep delays reducing batching efficiency",
      ownerAgent: "Merchant Agent",
      conflictingRecommendation: "Dispatch Agent wants smaller batches; Merchant Agent wants delayed release for cleaner handoff.",
      supervisorDecision: "Use smaller batches during peak hour while merchant audit stays active.",
      escalationTarget: "merchant_ops"
    }
  ],
  supervisorSummary: "Supervisor is actively balancing maintenance safety, SmartScale integrity, merchant flow, and dispatch efficiency to reduce incident spillover while protecting delivery quality.",
  efficiencyStatus: "Operational efficiency is stable, but Austin congestion and Los Angeles SmartScale abuse remain the main coordination pressure points."
};

export const predictiveIncidentPredictions: PredictiveIncidentPrediction[] = [
  {
    id: "pred_001",
    entityName: "Robot R-204 / Mission Taqueria 18th St",
    city: "San Francisco",
    historicalIncidents: 4,
    robotTelemetry: "thermal variance and braking spikes on downhill corridor",
    batteryTrend: "faster than baseline drain after 3 pm",
    routeCongestion: "heavy curbside double-park pattern",
    weather: "coastal wind gusts",
    deliveryDelays: "moderate pickup queueing",
    smartscaleMismatchRate: 18,
    storeAccuracyRate: 94,
    networkReliability: 97,
    riskScore: 78,
    predictedIssue: "ETA degradation from route congestion and stop-go telemetry instability",
    confidence: 86,
    recommendedPreventionAction: "Reroute around Mission curb cluster, reduce payload batch size, and pre-stage handoff 4 minutes earlier.",
    estimatedOperationalImpact: "8-12 minute delay risk across next 6 deliveries if unchanged.",
    deliveryFailureProbability: 34,
    robotRecoveryRisk: "medium",
    etaDegradationMinutes: 11,
    customerDissatisfactionRisk: 62
  },
  {
    id: "pred_002",
    entityName: "Robot R-118 / BurgerCraft Sunset",
    city: "Los Angeles",
    historicalIncidents: 7,
    robotTelemetry: "pickup dwell spikes and repeated manual assist near alley exit",
    batteryTrend: "stable",
    routeCongestion: "dense dinner rush traffic",
    weather: "clear",
    deliveryDelays: "high store-side wait",
    smartscaleMismatchRate: 29,
    storeAccuracyRate: 81,
    networkReliability: 93,
    riskScore: 84,
    predictedIssue: "delivery failure risk driven by pickup delay plus repeated SmartScale mismatch rework",
    confidence: 91,
    recommendedPreventionAction: "Shift orders to alternate handoff lane, force manager review on next mismatch, and throttle robot dispatch cadence by 1 trip.",
    estimatedOperationalImpact: "1-2 likely failed handoffs and 14 minute ETA slip during next hour.",
    deliveryFailureProbability: 47,
    robotRecoveryRisk: "medium",
    etaDegradationMinutes: 14,
    customerDissatisfactionRisk: 74
  },
  {
    id: "pred_003",
    entityName: "Robot R-331 / NoodleWorks South Congress",
    city: "Austin",
    historicalIncidents: 9,
    robotTelemetry: "low-confidence motor health and repeated idle reconnects",
    batteryTrend: "steep post-60% voltage drop",
    routeCongestion: "moderate",
    weather: "humid heat",
    deliveryDelays: "high due to offline SmartScale fallback",
    smartscaleMismatchRate: 36,
    storeAccuracyRate: 72,
    networkReliability: 88,
    riskScore: 92,
    predictedIssue: "robot recovery failure after battery sag and device-offline store delays",
    confidence: 94,
    recommendedPreventionAction: "Pull robot for battery swap, use backup scale checklist, and route upcoming orders to nearest healthy unit.",
    estimatedOperationalImpact: "High chance of aborted trip and 2-3 late deliveries in next 45 minutes.",
    deliveryFailureProbability: 63,
    robotRecoveryRisk: "high",
    etaDegradationMinutes: 19,
    customerDissatisfactionRisk: 83
  }
];

export const remoteAssistanceIncidents: RemoteAssistanceIncident[] = [
  {
    id: "ra_001",
    robotName: "Robot R-204",
    city: "San Francisco",
    cameraSnapshotLabel: "Crosswalk edge with double-parked van narrowing exit lane",
    localizationConfidence: 72,
    gps: "37.7615, -122.4241",
    robotSpeed: 1.8,
    nearbyObstacles: ["double-parked van", "bollard", "open car door"],
    pedestrianDensity: "high",
    operationalSummary: "Robot paused at constrained crosswalk exit after obstacle cluster reduced usable path width.",
    interventionRecommendation: "Hold position, widen localization bounds, and request low-speed reverse before rerouting around curb blockage.",
    safetyConcerns: ["pedestrians crossing behind robot", "door swing risk from parked vehicle"],
    escalationUrgency: "high",
    suggestedOperatorCommands: ["pause_and_hold", "camera_pan_left", "reverse_0_5m", "reroute_curbside_avoidance"],
    priorityRank: 1
  },
  {
    id: "ra_002",
    robotName: "Robot R-118",
    city: "Los Angeles",
    cameraSnapshotLabel: "Alley pickup exit with scooter blocking forward lane",
    localizationConfidence: 84,
    gps: "34.0972, -118.3276",
    robotSpeed: 0.9,
    nearbyObstacles: ["parked scooter", "trash bin", "delivery cart"],
    pedestrianDensity: "medium",
    operationalSummary: "Robot moving slowly but repeated stop-start behavior suggests uncertain clearance near pickup exit.",
    interventionRecommendation: "Reduce speed cap, steer 15 degrees right, and reattempt exit after confirming scooter gap remains stable.",
    safetyConcerns: ["tight turning radius near cart", "possible blind corner pedestrian"],
    escalationUrgency: "medium",
    suggestedOperatorCommands: ["slow_mode", "steer_right_15deg", "forward_1m", "resume_autonomy"],
    priorityRank: 2
  },
  {
    id: "ra_003",
    robotName: "Robot R-331",
    city: "Austin",
    cameraSnapshotLabel: "Sidewalk segment with standing water and low-confidence curb map",
    localizationConfidence: 58,
    gps: "30.2498, -97.7492",
    robotSpeed: 0.4,
    nearbyObstacles: ["standing water", "temporary sign", "uneven curb ramp"],
    pedestrianDensity: "low",
    operationalSummary: "Localization drift plus wet surface is increasing recovery risk on approach to curb ramp.",
    interventionRecommendation: "Stop autonomous advance, switch to remote crawl, and route around flooded ramp before resuming mission.",
    safetyConcerns: ["traction loss on wet paint", "uncertain curb boundary mapping"],
    escalationUrgency: "critical",
    suggestedOperatorCommands: ["full_stop", "remote_crawl_mode", "route_recompute", "dispatch_field_check"],
    priorityRank: 3
  }
];

export const merchantPerformanceRecords: MerchantPerformanceRecord[] = [
  {
    id: "mpi_001",
    storeId: "store_sf_01",
    storeName: "Mission Taqueria 18th St",
    market: "San Francisco",
    orderAccuracy: 96,
    smartscaleUsage: 92,
    prepDelayMinutes: 4,
    dasherWaitTime: 5,
    customerComplaints: 3,
    refundRate: 1.2,
    issueRecurrence: 1,
    storeScore: 91,
    mainOperationalIssue: "Minor drink and side misses during peak lunch batching.",
    riskLevel: "low",
    recommendedStoreActions: [
      "Keep beverage checklist at expo",
      "Maintain current SmartScale compliance",
      "Review lunch rush side-station refill timing"
    ],
    trendDirection: "improving"
  },
  {
    id: "mpi_002",
    storeId: "store_la_02",
    storeName: "BurgerCraft Sunset",
    market: "Los Angeles",
    orderAccuracy: 83,
    smartscaleUsage: 76,
    prepDelayMinutes: 11,
    dasherWaitTime: 9,
    customerComplaints: 12,
    refundRate: 3.8,
    issueRecurrence: 5,
    storeScore: 68,
    mainOperationalIssue: "Repeated missing-item rework is creating pickup delay and refund pressure.",
    riskLevel: "high",
    recommendedStoreActions: [
      "Enforce manager review on mismatch retries",
      "Split pickup shelf from final bagging line",
      "Coach closing crew on fries and side verification"
    ],
    trendDirection: "declining"
  },
  {
    id: "mpi_003",
    storeId: "store_sea_03",
    storeName: "Green Bowl Capitol Hill",
    market: "Seattle",
    orderAccuracy: 89,
    smartscaleUsage: 88,
    prepDelayMinutes: 6,
    dasherWaitTime: 6,
    customerComplaints: 5,
    refundRate: 1.9,
    issueRecurrence: 2,
    storeScore: 82,
    mainOperationalIssue: "Customization weight variance still creates manual review overhead.",
    riskLevel: "medium",
    recommendedStoreActions: [
      "Tune modifier weight profiles for high-variance bowls",
      "Refresh calibration schedule on salad station scale",
      "Route flagged custom orders to trained expo lead"
    ],
    trendDirection: "stable"
  },
  {
    id: "mpi_004",
    storeId: "store_atx_04",
    storeName: "NoodleWorks South Congress",
    market: "Austin",
    orderAccuracy: 74,
    smartscaleUsage: 42,
    prepDelayMinutes: 14,
    dasherWaitTime: 13,
    customerComplaints: 16,
    refundRate: 5.1,
    issueRecurrence: 7,
    storeScore: 49,
    mainOperationalIssue: "Offline SmartScale and skipped checks are driving repeat accuracy failures.",
    riskLevel: "critical",
    recommendedStoreActions: [
      "Replace offline scale and require backup checklist immediately",
      "Escalate shift-lead overrides to merchant ops",
      "Run daily readiness audit before dinner rush"
    ],
    trendDirection: "declining"
  },
  {
    id: "mpi_005",
    storeId: "store_den_05",
    storeName: "DashMart LoDo",
    market: "Denver",
    orderAccuracy: 81,
    smartscaleUsage: 69,
    prepDelayMinutes: 8,
    dasherWaitTime: 10,
    customerComplaints: 9,
    refundRate: 2.7,
    issueRecurrence: 4,
    storeScore: 64,
    mainOperationalIssue: "Calibration instability plus order-ready signal misses are slowing handoff.",
    riskLevel: "high",
    recommendedStoreActions: [
      "Recalibrate handoff shelf device before next wave",
      "Audit order-ready signal timing against kitchen completion",
      "Push hourly device health checks to supervisor tablet"
    ],
    trendDirection: "stable"
  }
];

export const dasherOperationsRecords: DasherOperationsRecord[] = [
  {
    id: "dor_001",
    storeName: "Mission Taqueria 18th St",
    market: "San Francisco",
    pickupDelays: 6,
    waitTimeMinutes: 5,
    failedHandoffs: 1,
    wrongOrders: 1,
    restaurantCongestion: 42,
    difficultParkingZone: true,
    repeatedMerchantIssues: 1,
    dasherFrictionScore: 46,
    pickupEfficiency: 88,
    operationalRecommendations: [
      "Reserve curbside handoff shelf during lunch wave",
      "Text Dasher when bag reaches final seal step",
      "Move drinks closer to pickup counter"
    ],
    zoneName: "Mission curb lane"
  },
  {
    id: "dor_002",
    storeName: "BurgerCraft Sunset",
    market: "Los Angeles",
    pickupDelays: 14,
    waitTimeMinutes: 11,
    failedHandoffs: 4,
    wrongOrders: 3,
    restaurantCongestion: 78,
    difficultParkingZone: true,
    repeatedMerchantIssues: 5,
    dasherFrictionScore: 86,
    pickupEfficiency: 54,
    operationalRecommendations: [
      "Split Dasher queue from in-store guest line",
      "Assign runner during dinner rush",
      "Escalate repeat missing-item stores to merchant ops"
    ],
    zoneName: "Sunset alley pickup"
  },
  {
    id: "dor_003",
    storeName: "Green Bowl Capitol Hill",
    market: "Seattle",
    pickupDelays: 8,
    waitTimeMinutes: 6,
    failedHandoffs: 1,
    wrongOrders: 1,
    restaurantCongestion: 51,
    difficultParkingZone: false,
    repeatedMerchantIssues: 2,
    dasherFrictionScore: 52,
    pickupEfficiency: 79,
    operationalRecommendations: [
      "Pre-stage customization orders on separate rack",
      "Add pickup-ready chime for Dashers",
      "Tune SmartScale modifier thresholds"
    ],
    zoneName: "Capitol Hill shelf"
  },
  {
    id: "dor_004",
    storeName: "NoodleWorks South Congress",
    market: "Austin",
    pickupDelays: 17,
    waitTimeMinutes: 13,
    failedHandoffs: 5,
    wrongOrders: 4,
    restaurantCongestion: 72,
    difficultParkingZone: true,
    repeatedMerchantIssues: 7,
    dasherFrictionScore: 93,
    pickupEfficiency: 48,
    operationalRecommendations: [
      "Deploy manual checklist until SmartScale restored",
      "Open temporary curb runner position",
      "Throttle order-ready signals until bag verification completes"
    ],
    zoneName: "South Congress frontage"
  },
  {
    id: "dor_005",
    storeName: "DashMart LoDo",
    market: "Denver",
    pickupDelays: 12,
    waitTimeMinutes: 9,
    failedHandoffs: 3,
    wrongOrders: 2,
    restaurantCongestion: 66,
    difficultParkingZone: true,
    repeatedMerchantIssues: 4,
    dasherFrictionScore: 74,
    pickupEfficiency: 63,
    operationalRecommendations: [
      "Stabilize order-ready signaling before handoff push",
      "Add Dasher-only parking guidance in app notes",
      "Trigger supervisor check after second failed handoff"
    ],
    zoneName: "LoDo loading strip"
  }
];

export const pickupZoneHeatmap: PickupZoneHeatmapPoint[] = [
  { id: "zone_001", zoneName: "Mission curb lane", market: "San Francisco", x: 18, y: 46, intensity: 58, primaryCause: "double parking" },
  { id: "zone_002", zoneName: "Sunset alley pickup", market: "Los Angeles", x: 12, y: 66, intensity: 92, primaryCause: "queue spillover" },
  { id: "zone_003", zoneName: "Capitol Hill shelf", market: "Seattle", x: 17, y: 18, intensity: 49, primaryCause: "custom order dwell" },
  { id: "zone_004", zoneName: "South Congress frontage", market: "Austin", x: 52, y: 68, intensity: 96, primaryCause: "offline verification" },
  { id: "zone_005", zoneName: "LoDo loading strip", market: "Denver", x: 41, y: 39, intensity: 74, primaryCause: "parking friction" },
  { id: "zone_006", zoneName: "Belltown curb pocket", market: "Seattle", x: 14, y: 13, intensity: 63, primaryCause: "handoff crowding" },
  { id: "zone_007", zoneName: "Hollywood side street", market: "Los Angeles", x: 15, y: 63, intensity: 81, primaryCause: "parking scarcity" }
];

export const deliverySimulationScenarios: DeliverySimulationScenario[] = [
  {
    id: "sim_001",
    name: "Mission lunch rush replay",
    market: "San Francisco",
    durationMinutes: 22,
    pedestrianDensity: "high",
    weatherImpact: "wind gusts near crosswalk",
    merchantDelayMinutes: 4,
    dasherArrivalOffset: -2,
    smartscaleIssue: "drink_missing",
    robotFailureMode: "localization drift at curb pinch",
    routePoints: [
      { x: 12, y: 72, eventTime: 0, label: "Dispatch" },
      { x: 24, y: 63, eventTime: 4, label: "Merchant pickup" },
      { x: 42, y: 51, eventTime: 9, label: "Crosswalk queue" },
      { x: 58, y: 39, eventTime: 14, label: "SmartScale rework" },
      { x: 76, y: 21, eventTime: 22, label: "Customer handoff" }
    ],
    incidentOverlays: [
      { id: "sim_inc_001", time: 7, type: "pedestrian_surge", severity: "medium", x: 36, y: 56, description: "Pedestrian density spike slows crosswalk traversal." },
      { id: "sim_inc_002", time: 12, type: "smartscale_mismatch", severity: "high", x: 55, y: 41, description: "Missing drink triggers merchant rework and Dasher wait." },
      { id: "sim_inc_003", time: 15, type: "robot_recovery", severity: "medium", x: 63, y: 34, description: "Robot pauses to recover from curbside localization drift." }
    ],
    recoveryActions: ["reroute_crosswalk", "manual_drink_check", "slow_mode_resume"],
    dispatchDecisions: ["hold_dispatch_2min", "send_backup_runner", "resequence_handoff_queue"],
    aiSummary: "Simulation shows merchant-side rework plus curb congestion drives 9-minute ETA drift. Best prevention path is pre-handoff drink verification and temporary crosswalk reroute."
  },
  {
    id: "sim_002",
    name: "Sunset dinner congestion stress test",
    market: "Los Angeles",
    durationMinutes: 28,
    pedestrianDensity: "medium",
    weatherImpact: "clear, no direct weather penalty",
    merchantDelayMinutes: 7,
    dasherArrivalOffset: 3,
    smartscaleIssue: "missing_item_risk",
    robotFailureMode: "pickup alley deadlock",
    routePoints: [
      { x: 15, y: 68, eventTime: 0, label: "Dispatch" },
      { x: 29, y: 61, eventTime: 6, label: "Parking search" },
      { x: 47, y: 52, eventTime: 11, label: "Pickup alley queue" },
      { x: 66, y: 37, eventTime: 19, label: "Recovery path" },
      { x: 82, y: 24, eventTime: 28, label: "Dropoff" }
    ],
    incidentOverlays: [
      { id: "sim_inc_004", time: 5, type: "parking_delay", severity: "high", x: 25, y: 63, description: "Dasher arrival collides with parking scarcity near pickup." },
      { id: "sim_inc_005", time: 13, type: "merchant_delay", severity: "high", x: 49, y: 50, description: "Burger line backs up and pickup queue spills into alley." },
      { id: "sim_inc_006", time: 17, type: "failed_handoff_risk", severity: "critical", x: 61, y: 42, description: "Wrong bag risk forces dispatch decision before release." }
    ],
    recoveryActions: ["open_alt_pickup_lane", "manager_review_release", "dispatch_hold_then_resume"],
    dispatchDecisions: ["reassign_dasher", "delay_release_signal", "throttle_store_dispatch"],
    aiSummary: "Simulation shows failed handoff risk becomes critical when parking delay overlaps merchant congestion. Best test outcome is alternate pickup lane plus dispatch throttling."
  }
];

export const voiceOpsCommandExamples: VoiceOpsCommandExample[] = [
  { id: "voice_cmd_001", command: "Show all critical incidents.", category: "incidents" },
  { id: "voice_cmd_002", command: "Which stores have the highest SmartScale mismatch rates?", category: "smartscale" },
  { id: "voice_cmd_003", command: "Summarize robot R102 status.", category: "robot" },
  { id: "voice_cmd_004", command: "Which merchants are causing the most Dasher friction?", category: "stores" }
];

export const dispatchOptimizationRecommendations: DispatchOptimizationRecommendation[] = [
  {
    id: "disp_001",
    orderGroup: "Batch SF-12",
    market: "San Francisco",
    robotCandidates: ["Robot R-204", "Robot R-118", "Robot R-331"],
    batteryConstraint: "R-204 at 68%, enough for 2-stop batch with reserve",
    robotHealth: "R-204 nominal, R-118 thermal watch, R-331 battery sag risk",
    merchantReadiness: "Mission Taqueria ready in 4 min, second merchant ready now",
    customerEtaTarget: "22 min max",
    trafficConditions: "Mission crosswalk congestion moderate",
    batchingDecision: "Keep 2-stop batch, avoid 3rd order until after handoff",
    chargingSchedule: "Send R-118 to charge after current trip; hold R-331 in reserve",
    routeEfficiencyScore: 89,
    congestionAvoidanceNote: "Reroute around Mission curb cluster and skip alley merge",
    recommendedRobot: "Robot R-204",
    optimizedRoute: ["Mission Taqueria pickup", "Valencia handoff", "16th Street customer drop"],
    estimatedTimeSaved: "7 minutes",
    batteryImpact: "-18% battery vs baseline -24%",
    priorityLevel: "high"
  },
  {
    id: "disp_002",
    orderGroup: "Batch LA-07",
    market: "Los Angeles",
    robotCandidates: ["Robot R-118", "Robot R-501", "Robot R-222"],
    batteryConstraint: "R-501 at 54%, enough only for single drop if congestion persists",
    robotHealth: "R-118 stable, R-501 healthy, R-222 wheel vibration warning",
    merchantReadiness: "BurgerCraft delayed 8 min",
    customerEtaTarget: "26 min max",
    trafficConditions: "Dinner traffic heavy, alley parking friction high",
    batchingDecision: "Break batch. Assign highest-priority order first and defer secondary pickup",
    chargingSchedule: "Queue R-501 for fast charge after single drop",
    routeEfficiencyScore: 76,
    congestionAvoidanceNote: "Use side-street approach and avoid Sunset alley pickup queue",
    recommendedRobot: "Robot R-118",
    optimizedRoute: ["Side-street staging", "BurgerCraft pickup", "Hollywood Hills drop"],
    estimatedTimeSaved: "11 minutes",
    batteryImpact: "-14% battery vs baseline -19%",
    priorityLevel: "critical"
  },
  {
    id: "disp_003",
    orderGroup: "Batch ATX-03",
    market: "Austin",
    robotCandidates: ["Robot R-331", "Robot R-204", "Robot R-611"],
    batteryConstraint: "R-611 at 82%, best reserve for longer corridor run",
    robotHealth: "R-611 healthy, R-331 unstable after battery sag",
    merchantReadiness: "NoodleWorks not ready for 6 min due to manual checklist",
    customerEtaTarget: "30 min max",
    trafficConditions: "Frontage road moderate, curb access clear",
    batchingDecision: "Delay dispatch 4 min and send single high-priority order first",
    chargingSchedule: "Pull R-331 from dispatch and charge immediately",
    routeEfficiencyScore: 84,
    congestionAvoidanceNote: "Use frontage bypass and stage near pickup exit",
    recommendedRobot: "Robot R-611",
    optimizedRoute: ["South Congress staging", "NoodleWorks pickup", "Riverside customer drop"],
    estimatedTimeSaved: "9 minutes",
    batteryImpact: "-16% battery vs baseline -23%",
    priorityLevel: "high"
  }
];

export const customerRecoveryCases: CustomerRecoveryCase[] = [
  {
    id: "cr_001",
    issueType: "delayed_delivery",
    orderId: "DD-900142",
    storeName: "Mission Taqueria 18th St",
    market: "San Francisco",
    customerExplanation: "Your order is taking longer than expected because pickup traffic and crosswalk congestion slowed the final handoff route.",
    refundRecommendation: "Offer $5 credit if ETA slips past 10 additional minutes.",
    supportEscalation: "No immediate escalation unless delay exceeds 15 minutes.",
    recoveryCouponSuggestion: "15% off next lunch order",
    etaUpdate: "Updated arrival in 9 minutes",
    satisfactionPriority: 78,
    estimatedRecoveryCost: "$5 credit"
  },
  {
    id: "cr_002",
    issueType: "missing_item",
    orderId: "DD-900188",
    storeName: "BurgerCraft Sunset",
    market: "Los Angeles",
    customerExplanation: "We found that one item was missing during verification and are correcting the order before completion.",
    refundRecommendation: "Full item refund plus optional redelivery credit.",
    supportEscalation: "Escalate to support if customer declines partial refund.",
    recoveryCouponSuggestion: "Free side on next order",
    etaUpdate: "Updated arrival in 14 minutes",
    satisfactionPriority: 91,
    estimatedRecoveryCost: "$9 refund + coupon"
  },
  {
    id: "cr_003",
    issueType: "wrong_item",
    orderId: "DD-900214",
    storeName: "Green Bowl Capitol Hill",
    market: "Seattle",
    customerExplanation: "Our team detected an incorrect item assignment and is swapping your order to the correct bag now.",
    refundRecommendation: "Provide 50% order credit if swap delays delivery beyond ETA window.",
    supportEscalation: "Support review if customer has repeat wrong-order history.",
    recoveryCouponSuggestion: "$8 comeback coupon",
    etaUpdate: "Updated arrival in 11 minutes",
    satisfactionPriority: 86,
    estimatedRecoveryCost: "$8 credit"
  },
  {
    id: "cr_004",
    issueType: "robot_failure",
    orderId: "DD-900277",
    storeName: "NoodleWorks South Congress",
    market: "Austin",
    customerExplanation: "Your delivery hit a robot routing issue, and we are rerouting the order to keep it moving safely.",
    refundRecommendation: "Offer 25% refund plus expedited redelivery option.",
    supportEscalation: "Immediate support escalation if reroute fails or ETA exceeds 20 minutes.",
    recoveryCouponSuggestion: "Free delivery on next 2 orders",
    etaUpdate: "Updated arrival in 18 minutes",
    satisfactionPriority: 95,
    estimatedRecoveryCost: "25% refund + waived delivery fee"
  },
  {
    id: "cr_005",
    issueType: "canceled_order",
    orderId: "DD-900301",
    storeName: "DashMart LoDo",
    market: "Denver",
    customerExplanation: "We had to cancel this order because we could not safely complete fulfillment within the promised window.",
    refundRecommendation: "Issue full refund immediately.",
    supportEscalation: "Immediate support escalation with apology outreach.",
    recoveryCouponSuggestion: "$15 recovery coupon",
    etaUpdate: "Order canceled and refund processing now",
    satisfactionPriority: 99,
    estimatedRecoveryCost: "Full refund + $15 coupon"
  }
];

export const fleetHealthPredictions: FleetHealthPrediction[] = [
  {
    id: "fh_001",
    robotName: "R102",
    market: "San Francisco",
    motorTemperatureC: 86,
    batteryDegradation: 31,
    sensorHealth: 84,
    networkReliability: 93,
    cpuUsage: 67,
    brakingAnomalies: 2,
    wheelResistance: 19,
    likelyComponentFailure: "Left drive motor bearing wear",
    maintenanceUrgency: "high",
    fleetDowntimeRisk: 62,
    maintenanceRecommendations: [
      "Inspect left motor housing after current shift.",
      "Reduce steep-hill assignments until motor temperature normalizes.",
      "Schedule bearing replacement within 24 hours."
    ],
    recommendedMaintenanceWindow: "Tonight 9:30 PM - 11:00 PM"
  },
  {
    id: "fh_002",
    robotName: "R118",
    market: "Los Angeles",
    motorTemperatureC: 72,
    batteryDegradation: 44,
    sensorHealth: 79,
    networkReliability: 88,
    cpuUsage: 74,
    brakingAnomalies: 1,
    wheelResistance: 14,
    likelyComponentFailure: "Battery pack efficiency decline",
    maintenanceUrgency: "medium",
    fleetDowntimeRisk: 48,
    maintenanceRecommendations: [
      "Move to shorter lunch routes to reduce deep discharge cycles.",
      "Run battery health calibration during next charging window.",
      "Plan pack swap if degradation rises above 50%."
    ],
    recommendedMaintenanceWindow: "Tomorrow 6:00 AM - 7:00 AM"
  },
  {
    id: "fh_003",
    robotName: "R207",
    market: "Seattle",
    motorTemperatureC: 69,
    batteryDegradation: 18,
    sensorHealth: 61,
    networkReliability: 82,
    cpuUsage: 58,
    brakingAnomalies: 3,
    wheelResistance: 11,
    likelyComponentFailure: "Front lidar alignment drift",
    maintenanceUrgency: "high",
    fleetDowntimeRisk: 57,
    maintenanceRecommendations: [
      "Pause dense-pedestrian routes until sensor alignment check completes.",
      "Recalibrate lidar and validate localization confidence.",
      "Review brake response logs for correlated obstacle stops."
    ],
    recommendedMaintenanceWindow: "Today 4:15 PM - 5:00 PM"
  },
  {
    id: "fh_004",
    robotName: "R305",
    market: "Austin",
    motorTemperatureC: 91,
    batteryDegradation: 37,
    sensorHealth: 76,
    networkReliability: 77,
    cpuUsage: 89,
    brakingAnomalies: 4,
    wheelResistance: 23,
    likelyComponentFailure: "Brake controller overheating",
    maintenanceUrgency: "critical",
    fleetDowntimeRisk: 81,
    maintenanceRecommendations: [
      "Pull robot from active dispatch immediately.",
      "Inspect brake controller and cooling path before redeployment.",
      "Route nearby orders to backup fleet to avoid cascading downtime."
    ],
    recommendedMaintenanceWindow: "Immediate pull from service"
  },
  {
    id: "fh_005",
    robotName: "R412",
    market: "Denver",
    motorTemperatureC: 66,
    batteryDegradation: 22,
    sensorHealth: 91,
    networkReliability: 95,
    cpuUsage: 49,
    brakingAnomalies: 0,
    wheelResistance: 9,
    likelyComponentFailure: "No immediate component failure predicted",
    maintenanceUrgency: "low",
    fleetDowntimeRisk: 18,
    maintenanceRecommendations: [
      "Keep standard preventive maintenance cycle.",
      "Continue weekly wheel resistance checks.",
      "No route restrictions needed."
    ],
    recommendedMaintenanceWindow: "Next scheduled preventive service"
  }
];

export const incidentReplayRecords: IncidentReplayRecord[] = [
  {
    id: "ir_001",
    incidentId: "INC-22041",
    robotName: "R102",
    market: "San Francisco",
    incidentType: "robot_failure",
    durationMinutes: 18,
    summary: "Robot R102 slowed after repeated curbside stops, lost braking smoothness near a dense crosswalk, and required operator-assisted reroute to finish safely.",
    rootCauseAnalysis: "Primary cause was thermal brake controller stress after repeated stop-start cycles on a steep corridor. Secondary factors were high pedestrian density and a late manual reroute decision.",
    exportLabel: "r102_brake_replay_report",
    routePoints: [
      { x: 12, y: 72, eventTime: 0, label: "Store" },
      { x: 26, y: 60, eventTime: 4, label: "Crosswalk" },
      { x: 43, y: 48, eventTime: 8, label: "Hill rise" },
      { x: 62, y: 40, eventTime: 12, label: "Intervention" },
      { x: 84, y: 26, eventTime: 18, label: "Dropoff" }
    ],
    telemetry: [
      { minute: 0, speed: 4.2, battery: 84, localizationConfidence: 96, networkReliability: 95, motorTemperatureC: 71 },
      { minute: 4, speed: 3.8, battery: 80, localizationConfidence: 94, networkReliability: 94, motorTemperatureC: 75 },
      { minute: 8, speed: 2.9, battery: 76, localizationConfidence: 92, networkReliability: 92, motorTemperatureC: 81 },
      { minute: 12, speed: 1.7, battery: 72, localizationConfidence: 89, networkReliability: 88, motorTemperatureC: 88 },
      { minute: 18, speed: 3.5, battery: 68, localizationConfidence: 93, networkReliability: 91, motorTemperatureC: 79 }
    ],
    aiDecisions: [
      "Flagged brake anomaly cluster after three abrupt deceleration events.",
      "Recommended temporary speed cap and alternate sidewalk segment.",
      "Held customer ETA steady until operator reroute was confirmed."
    ],
    operatorActions: [
      "Reviewed live camera and telemetry feed at minute 11.",
      "Issued remote slow-roll command and confirmed pedestrian clearance.",
      "Approved assisted reroute around the crowded crosswalk."
    ],
    timeline: [
      { id: "ir1_ev1", minute: 2, type: "route_event", title: "Route enters dense curb lane", detail: "Traffic and foot traffic begin compressing path width.", severity: "medium", x: 20, y: 64 },
      { id: "ir1_ev2", minute: 7, type: "incident", title: "Braking anomaly detected", detail: "Robot logs inconsistent deceleration profile on downhill segment.", severity: "high", x: 39, y: 50 },
      { id: "ir1_ev3", minute: 9, type: "ai_decision", title: "AI recommends speed cap", detail: "Copilot lowers target speed and suggests alternate path.", severity: "medium", x: 47, y: 46 },
      { id: "ir1_ev4", minute: 12, type: "operator_action", title: "Operator reroute approved", detail: "Remote operator confirms safer corridor and continues mission.", severity: "high", x: 62, y: 40 },
      { id: "ir1_ev5", minute: 16, type: "route_event", title: "Robot resumes normal pace", detail: "Pedestrian density falls and braking normalizes.", severity: "low", x: 77, y: 30 }
    ]
  },
  {
    id: "ir_002",
    incidentId: "INC-22067",
    robotName: "R207",
    market: "Seattle",
    incidentType: "network_reliability",
    durationMinutes: 22,
    summary: "Robot R207 encountered repeated network drops near a covered corridor, reducing localization confidence and forcing human confirmation before final handoff.",
    rootCauseAnalysis: "Primary cause was unreliable wireless coverage in a covered retail passage. Secondary contributor was delayed failover to a stronger route segment.",
    exportLabel: "r207_network_replay_report",
    routePoints: [
      { x: 10, y: 78, eventTime: 0, label: "Merchant" },
      { x: 24, y: 66, eventTime: 5, label: "Arcade" },
      { x: 42, y: 54, eventTime: 10, label: "Signal loss" },
      { x: 61, y: 45, eventTime: 15, label: "Operator review" },
      { x: 86, y: 29, eventTime: 22, label: "Customer" }
    ],
    telemetry: [
      { minute: 0, speed: 4.6, battery: 79, localizationConfidence: 95, networkReliability: 94, motorTemperatureC: 66 },
      { minute: 5, speed: 4.1, battery: 76, localizationConfidence: 93, networkReliability: 88, motorTemperatureC: 68 },
      { minute: 10, speed: 2.4, battery: 72, localizationConfidence: 81, networkReliability: 63, motorTemperatureC: 70 },
      { minute: 15, speed: 1.8, battery: 68, localizationConfidence: 78, networkReliability: 59, motorTemperatureC: 71 },
      { minute: 22, speed: 3.7, battery: 64, localizationConfidence: 91, networkReliability: 86, motorTemperatureC: 69 }
    ],
    aiDecisions: [
      "Detected network reliability collapse below safe autonomous threshold.",
      "Recommended pause near storefront edge and operator localization check.",
      "Suggested alternate path with stronger mesh coverage for final block."
    ],
    operatorActions: [
      "Confirmed safe idle position during signal recovery.",
      "Validated map alignment against storefront landmarks.",
      "Released robot onto alternate corridor after connectivity stabilized."
    ],
    timeline: [
      { id: "ir2_ev1", minute: 4, type: "route_event", title: "Robot enters covered arcade", detail: "Signal strength begins tapering under dense overhead structure.", severity: "medium", x: 22, y: 67 },
      { id: "ir2_ev2", minute: 9, type: "incident", title: "Network degradation spike", detail: "Packet loss causes localization confidence to drop sharply.", severity: "high", x: 40, y: 55 },
      { id: "ir2_ev3", minute: 11, type: "ai_decision", title: "AI requests safety pause", detail: "System pauses forward motion and requests operator review.", severity: "high", x: 46, y: 51 },
      { id: "ir2_ev4", minute: 15, type: "operator_action", title: "Manual localization confirmation", detail: "Operator verifies position against curb and storefront anchors.", severity: "medium", x: 61, y: 45 },
      { id: "ir2_ev5", minute: 19, type: "route_event", title: "Alternate path selected", detail: "Robot rejoins route on higher-reliability corridor.", severity: "low", x: 74, y: 37 }
    ]
  }
];
