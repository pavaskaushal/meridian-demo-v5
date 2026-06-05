// DEV ONLY — remove before sharing publicly

/* ============================================================
   MERIDIAN · DATA
   Expanded dataset for Apex Telecom demo
   ============================================================ */

/* ══════════════════════════════════════════════════════════
   1. OPERATOR PROFILE
   ══════════════════════════════════════════════════════════ */

const OPERATOR = {
    name:          "Apex Telecom",
    shortName:     "APEX",
    hq:            "Mumbai",
    circles:       22,
    subscribers:   312,
    currency:      "₹",
    currencyUnit:  "Cr",
    reportingDate: "June 2025",
    fyEnd:         "March 2026",
    founded:       1995,
    employees:     48000,
    spectrum:      "700MHz · 1800MHz · 2100MHz · 2300MHz · 3500MHz",
    networkType:   "4G · 5G NSA · 5G SA (12 circles)",
    marketShare:   "22.4%",
    stockCode:     "APXTLCM.NSE"
};


/* ══════════════════════════════════════════════════════════
   2. KPI DATA
   ══════════════════════════════════════════════════════════ */

const KPI_DATA = [
    {
        id:          "arpu",
        label:       "ARPU (Blended)",
        value:       "₹181",
        unit:        "/mo",
        delta:       "+₹12",
        deltaLabel:  "vs last year",
        trend:       "up",
        accentColor: "#00C0AE"
    },
    {
        id:          "churn",
        label:       "Monthly Churn",
        value:       "1.42",
        unit:        "%",
        delta:       "-0.18%",
        deltaLabel:  "vs last year",
        trend:       "up",
        accentColor: "#FD349C"
    },
    {
        id:          "ebitda",
        label:       "EBITDA Margin",
        value:       "34.6",
        unit:        "%",
        delta:       "+2.1%",
        deltaLabel:  "vs last year",
        trend:       "up",
        accentColor: "#76D2FF"
    },
    {
        id:          "spectrum",
        label:       "Spectrum Coverage",
        value:       "2.8",
        unit:        "×",
        delta:       "+0.3×",
        deltaLabel:  "vs last year",
        trend:       "up",
        accentColor: "#B497FF"
    },
    {
        id:          "fcf",
        label:       "Free Cash Flow",
        value:       "₹2,340",
        unit:        " Cr",
        delta:       "+₹340 Cr",
        deltaLabel:  "vs last year",
        trend:       "up",
        accentColor: "#63EBDA"
    },
    {
        id:          "subscribers",
        label:       "Active Subscribers",
        value:       "312",
        unit:        "M",
        delta:       "+18M",
        deltaLabel:  "vs last year",
        trend:       "up",
        accentColor: "#1E49E2"
    }
];


/* ══════════════════════════════════════════════════════════
   3. ARPU CHART DATA
   ══════════════════════════════════════════════════════════ */

const CHART_MONTHS = [
    "Jul'24","Aug'24","Sep'24","Oct'24","Nov'24","Dec'24",
    "Jan'25","Feb'25","Mar'25","Apr'25","May'25","Jun'25",
    "Jul'25","Aug'25","Sep'25"
];

const ARPU_HISTORICAL = [170, 171, 172, 173, 175, 174, 176, 177, 178, 179, 180, 181];
const ARPU_FORECAST   = [182, 183, 185];

const ARPU_CHART_DATA = {
    months:             CHART_MONTHS,
    historical:         ARPU_HISTORICAL,
    forecast:           ARPU_FORECAST,
    forecastStartIndex: 12
};


/* ══════════════════════════════════════════════════════════
   4. CHURN TREND DATA
   ══════════════════════════════════════════════════════════ */

const CHURN_TREND = {
    months:    CHART_MONTHS.slice(0, 12),
    values:    [1.62, 1.60, 1.58, 1.57, 1.55, 1.54, 1.52, 1.50, 1.48, 1.46, 1.44, 1.42],
    forecast:  [1.40, 1.38, 1.36]
};


/* ══════════════════════════════════════════════════════════
   5. REVENUE BREAKDOWN
   ══════════════════════════════════════════════════════════ */

const REVENUE_BREAKDOWN = [
    { segment: "Prepaid Mobile",    revenue: 1540, pct: 45.0, color: "#00C0AE" },
    { segment: "Postpaid Mobile",   revenue: 820,  pct: 24.0, color: "#1E49E2" },
    { segment: "Broadband (FBB)",   revenue: 480,  pct: 14.0, color: "#76D2FF" },
    { segment: "Enterprise B2B",    revenue: 390,  pct: 11.4, color: "#B497FF" },
    { segment: "Roaming & ILD",     revenue: 120,  pct: 3.5,  color: "#FFA3DA" },
    { segment: "Other Services",    revenue: 70,   pct: 2.1,  color: "#63EBDA" }
];


/* ══════════════════════════════════════════════════════════
   6. CIRCLE PERFORMANCE DATA
   Top 10 circles by revenue
   ══════════════════════════════════════════════════════════ */

const CIRCLE_DATA = [
    { circle: "Mumbai",          revenue: 520, arpu: 198, churn: 1.1, subscribers: 28.4, color: "#00C0AE" },
    { circle: "Delhi NCR",       revenue: 480, arpu: 192, churn: 1.2, subscribers: 26.8, color: "#00C0AE" },
    { circle: "Maharashtra",     revenue: 380, arpu: 184, churn: 1.3, subscribers: 22.3, color: "#00C0AE" },
    { circle: "Karnataka",       revenue: 340, arpu: 181, churn: 1.4, subscribers: 20.4, color: "#1E49E2" },
    { circle: "Tamil Nadu",      revenue: 310, arpu: 178, churn: 1.4, subscribers: 18.9, color: "#1E49E2" },
    { circle: "Andhra Pradesh",  revenue: 290, arpu: 175, churn: 1.5, subscribers: 17.9, color: "#1E49E2" },
    { circle: "Gujarat",         revenue: 270, arpu: 174, churn: 1.5, subscribers: 16.8, color: "#76D2FF" },
    { circle: "Rajasthan",       revenue: 180, arpu: 162, churn: 1.8, subscribers: 12.0, color: "#F59E0B" },
    { circle: "UP East",         revenue: 160, arpu: 158, churn: 1.9, subscribers: 10.9, color: "#F59E0B" },
    { circle: "Bihar",           revenue: 140, arpu: 154, churn: 2.1, subscribers: 9.8,  color: "#FD349C" }
];


/* ══════════════════════════════════════════════════════════
   7. COMPETITOR DATA
   ══════════════════════════════════════════════════════════ */

const COMPETITOR_DATA = [
    { name: "Apex Telecom", arpu: 181, subscribers: 312, marketShare: 22.4, color: "#00C0AE", isUs: true  },
    { name: "Airtel",       arpu: 194, subscribers: 368, marketShare: 26.4, color: "#4B5563", isUs: false },
    { name: "Jio",          arpu: 168, subscribers: 480, marketShare: 34.5, color: "#4B5563", isUs: false },
    { name: "Vi",           arpu: 156, subscribers: 198, marketShare: 14.2, color: "#4B5563", isUs: false },
    { name: "BSNL",         arpu: 98,  subscribers: 36,  marketShare: 2.5,  color: "#4B5563", isUs: false }
];


/* ══════════════════════════════════════════════════════════
   8. QUARTERLY P&L
   ══════════════════════════════════════════════════════════ */

const QUARTERLY_PL = [
    { quarter: "Q1 FY25", revenue: 3180, ebitda: 1060, ebitdaPct: 33.3, capex: 420, fcf: 640  },
    { quarter: "Q2 FY25", revenue: 3280, ebitda: 1115, ebitdaPct: 34.0, capex: 380, fcf: 735  },
    { quarter: "Q3 FY25", revenue: 3350, ebitda: 1152, ebitdaPct: 34.4, capex: 360, fcf: 792  },
    { quarter: "Q4 FY25", revenue: 3420, ebitda: 1183, ebitdaPct: 34.6, capex: 340, fcf: 843  },
    { quarter: "Q1 FY26", revenue: 3510, ebitda: 1225, ebitdaPct: 34.9, capex: 320, fcf: 905  }
];


/* ══════════════════════════════════════════════════════════
   9. RAFM ALERTS — EXPANDED
   ══════════════════════════════════════════════════════════ */

const RAFM_ALERTS = [
    {
        id:          "rafm-001",
        type:        "RAFM · INTERCONNECT",
        title:       "Interconnect Billing Discrepancy",
        description: "CDR reconciliation flagged a billing discrepancy with Jio on the Mumbai-Delhi interconnect route. 847,000 CDRs show settlement variance of ₹5.67/CDR on average.",
        amount:      "₹4.8 Cr",
        amountRaw:   4.8,
        severity:    "critical",
        operator:    "Jio Networks Ltd",
        route:       "Mumbai ↔ Delhi",
        cdrCount:    "8,47,000 CDRs",
        detectedAt:  "Today, 09:14 IST",
        detectionMethod: "CDR Reconciliation Engine v4.2",
        agingDays:   25,
        action:      "Initiate formal dispute with Jio interconnect team. Request CDR dump for period 01-Jun to 25-Jun 2025. Escalate to VP Networks within 24 hours."
    },
    {
        id:          "rafm-002",
        type:        "RAFM · ROAMING",
        title:       "TAP File Leakage — Zone 3",
        description: "Transfer Account Procedure file analysis shows unbilled roaming events in South India zone. Mismatch between IOT and TAP records across Karnataka and Tamil Nadu.",
        amount:      "₹1.2 Cr",
        amountRaw:   1.2,
        severity:    "high",
        operator:    "Multiple (Zone 3)",
        route:       "South India — Karnataka, TN, Kerala",
        cdrCount:    "1,23,400 records",
        detectedAt:  "Today, 07:52 IST",
        detectionMethod: "TAP File Analyser · IOT Reconciliation",
        agingDays:   3,
        action:      "Trigger TAP file re-transmission request. Escalate to roaming operations team for Zone 3 audit. Expected recovery timeline: 7-10 days."
    },
    {
        id:          "rafm-003",
        type:        "REGULATORY · TRAI",
        title:       "QoS Submission — 78% Ready",
        description: "TRAI Quality of Service submission due 30 June 2025. Data collection 78% complete. Circle-wise KPI compilation pending for 5 circles.",
        amount:      "Due 30 Jun",
        amountRaw:   0,
        severity:    "medium",
        operator:    "TRAI",
        route:       "All 22 Circles",
        cdrCount:    "5 circles pending",
        detectedAt:  "Updated today, 06:00 IST",
        detectionMethod: "Regulatory Compliance Engine",
        agingDays:   0,
        action:      "Escalate to circle heads for Rajasthan, UP East, UP West, Bihar, and Jharkhand. Deadline: 29 June EOD."
    },
    {
        id:          "rafm-004",
        type:        "RAFM · REVENUE ASSURANCE",
        title:       "Prepaid Credit Leakage Detected",
        description: "Automated revenue assurance engine detected prepaid balance leakage on VoLTE calls in Maharashtra circle. Affects ~18,400 subscribers with incorrect rate plan application.",
        amount:      "₹0.8 Cr",
        amountRaw:   0.8,
        severity:    "high",
        operator:    "Internal · Maharashtra Circle",
        route:       "Maharashtra · VoLTE",
        cdrCount:    "18,400 subscribers",
        detectedAt:  "Yesterday, 22:31 IST",
        detectionMethod: "Revenue Assurance Engine · Rate Plan Audit",
        agingDays:   1,
        action:      "Suspend affected rate plan configuration. Initiate credit reversal for impacted subscribers. Root cause: billing platform patch deployed 24-Jun applied incorrect VoLTE rate."
    },
    {
        id:          "rafm-005",
        type:        "RAFM · FRAUD",
        title:       "SIM Box Fraud — UP East",
        description: "Traffic analysis engine detected potential SIM box activity in UP East circle. 847 SIMs showing atypical international-to-local call conversion patterns consistent with SIM box operation.",
        amount:      "₹0.6 Cr",
        amountRaw:   0.6,
        severity:    "high",
        operator:    "Unknown · UP East",
        route:       "UP East · International Termination",
        cdrCount:    "847 SIMs flagged",
        detectedAt:  "Yesterday, 18:44 IST",
        detectionMethod: "Fraud Management System · Pattern Analysis",
        agingDays:   1,
        action:      "Block flagged SIMs pending investigation. Coordinate with UP East circle security team. File FIR if confirmed. Estimated revenue protection: ₹0.6 Cr/month."
    },
    {
        id:          "rafm-006",
        type:        "PPP · PROCUREMENT",
        title:       "Split PO Detected — Tower Vendor",
        description: "Procurement policy engine flagged 4 consecutive purchase orders to CloudHost Infra Ltd, each valued at ₹48L — just below the ₹50L approval threshold requiring CFO sign-off.",
        amount:      "₹1.92 Cr",
        amountRaw:   1.92,
        severity:    "critical",
        operator:    "CloudHost Infra Ltd",
        route:       "Procurement · Tower Infrastructure",
        cdrCount:    "4 POs flagged",
        detectedAt:  "2 days ago, 14:22 IST",
        detectionMethod: "PPP Policy Engine · Split-PO Detection",
        agingDays:   2,
        action:      "Freeze all pending payments to CloudHost Infra Ltd. Escalate to CFO and Internal Audit immediately. Initiate vendor investigation. This vendor also has an active OFAC match flag."
    }
];


/* ══════════════════════════════════════════════════════════
   10. VENDOR DATA — EXPANDED TO 32
   ══════════════════════════════════════════════════════════ */

const VENDOR_DATA = [
    { name: "CloudHost Infra Ltd",    score: 14, exposure: "₹12.4 Cr", issue: "OFAC match · GST lapsed · Split-PO flag" },
    { name: "SubCon Partners Pvt",    score: 22, exposure: "₹8.6 Cr",  issue: "CIBIL: 31 · 4 GST defaults · Late payment" },
    { name: "NetBridge Systems",      score: 28, exposure: "₹6.2 Cr",  issue: "MCA21 default · Director disqualified" },
    { name: "TowerCo Solutions",      score: 38, exposure: "₹28.1 Cr", issue: "Concentration: 42% · BB− rating" },
    { name: "Fibernet Services",      score: 41, exposure: "₹15.2 Cr", issue: "Late payments · 3 active disputes" },
    { name: "DataCentre One",         score: 45, exposure: "₹19.8 Cr", issue: "Credit watch · Pending audit" },
    { name: "RuralNet Pvt Ltd",       score: 48, exposure: "₹9.4 Cr",  issue: "GST mismatch · 2 pending TDS defaults" },
    { name: "SpeedFibre Ltd",         score: 52, exposure: "₹11.2 Cr", issue: "Minor: 1 late payment in 12 months" },
    { name: "Ericsson India",         score: 91, exposure: "₹142 Cr",  issue: "" },
    { name: "Nokia Solutions",        score: 88, exposure: "₹98 Cr",   issue: "" },
    { name: "Huawei Tech India",      score: 72, exposure: "₹86 Cr",   issue: "" },
    { name: "Cisco Systems India",    score: 85, exposure: "₹54 Cr",   issue: "" },
    { name: "IBM India",              score: 82, exposure: "₹38 Cr",   issue: "" },
    { name: "TCS Network Svcs",       score: 90, exposure: "₹67 Cr",   issue: "" },
    { name: "Infosys BPM",            score: 87, exposure: "₹32 Cr",   issue: "" },
    { name: "Wipro Networks",         score: 79, exposure: "₹28 Cr",   issue: "" },
    { name: "HCL Technologies",       score: 83, exposure: "₹41 Cr",   issue: "" },
    { name: "Tech Mahindra",          score: 76, exposure: "₹35 Cr",   issue: "" },
    { name: "L&T Technology",         score: 81, exposure: "₹22 Cr",   issue: "" },
    { name: "Sterlite Tech Ltd",      score: 69, exposure: "₹48 Cr",   issue: "" },
    { name: "HFCL Limited",           score: 74, exposure: "₹31 Cr",   issue: "" },
    { name: "Tejas Networks",         score: 77, exposure: "₹18 Cr",   issue: "" },
    { name: "Amdocs India",           score: 84, exposure: "₹26 Cr",   issue: "" },
    { name: "Oracle India",           score: 89, exposure: "₹62 Cr",   issue: "" },
    { name: "SAP India",              score: 92, exposure: "₹44 Cr",   issue: "" },
    { name: "Microsoft India",        score: 94, exposure: "₹38 Cr",   issue: "" },
    { name: "Amazon AWS India",       score: 88, exposure: "₹52 Cr",   issue: "" },
    { name: "Google Cloud India",     score: 91, exposure: "₹29 Cr",   issue: "" },
    { name: "Razorpay Payments",      score: 78, exposure: "₹8 Cr",    issue: "" },
    { name: "Juspay Tech",            score: 73, exposure: "₹6 Cr",    issue: "" },
    { name: "National Fibre Net",     score: 66, exposure: "₹24 Cr",   issue: "" },
    { name: "Reliance Jio Infra",     score: 55, exposure: "₹18 Cr",   issue: "" }
];


/* ══════════════════════════════════════════════════════════
   11. SCENARIO BASE DATA
   ══════════════════════════════════════════════════════════ */

const SCENARIO_BASE = {
    revenue:     3420,
    ebitda:      1183,
    ebitdaPct:   34.6,
    arpu:        181,
    churn:       1.42,
    subscribers: 312
};

const SCENARIO_SLIDERS = [
    {
        id:      "arpu-change",
        label:   "ARPU Change",
        unit:    "%",
        min:     -30,
        max:     30,
        step:    1,
        default: 0,
        impact:  "revenue"
    },
    {
        id:      "churn-change",
        label:   "Churn Rate Change",
        unit:    "%",
        min:     -50,
        max:     100,
        step:    1,
        default: 0,
        impact:  "subscribers"
    },
    {
        id:      "spectrum-cost",
        label:   "Spectrum Cost Change",
        unit:    "%",
        min:     -20,
        max:     50,
        step:    1,
        default: 0,
        impact:  "ebitda"
    },
    {
        id:      "price-increase",
        label:   "Price Increase Offset",
        unit:    "%",
        min:     0,
        max:     20,
        step:    0.5,
        default: 0,
        impact:  "revenue"
    }
];


/* ══════════════════════════════════════════════════════════
   12. REGULATORY FILINGS
   ══════════════════════════════════════════════════════════ */

const REGULATORY_FILINGS = [
    {
        id:           "reg-001",
        title:        "TRAI QoS Report",
        description:  "Quality of Service parameters — all 22 circles. Circle-wise KPI data including call drop rate, data speed, and network availability.",
        dueDate:      "2025-06-30",
        readiness:    78,
        authority:    "TRAI",
        penalty:      "₹50 Lakh per day",
        pendingItems: [
            "Circle KPI data — 5 circles pending",
            "Network availability report — UP East",
            "Customer complaint data — Bihar circle"
        ],
        accentColor: "#FD349C"
    },
    {
        id:           "reg-002",
        title:        "AGR Reconciliation Statement",
        description:  "Adjusted Gross Revenue reconciliation for FY2024-25. Revenue share calculation for spectrum and licence fee payments to DoT.",
        dueDate:      "2025-07-15",
        readiness:    45,
        authority:    "DoT",
        penalty:      "Interest at 12% p.a. on shortfall",
        pendingItems: [
            "Interconnect revenue verification",
            "Roaming revenue reconciliation",
            "Other operating income classification",
            "Auditor sign-off pending"
        ],
        accentColor: "#F59E0B"
    },
    {
        id:           "reg-003",
        title:        "Spectrum Usage Certificate",
        description:  "Quarterly spectrum utilisation report across all bands — 700MHz, 1800MHz, 2100MHz, 2300MHz, 3500MHz.",
        dueDate:      "2025-07-31",
        readiness:    30,
        authority:    "WPC / DoT",
        penalty:      "Show cause notice",
        pendingItems: [
            "3500MHz band utilisation data",
            "700MHz rural coverage metrics",
            "Circle-wise spectrum efficiency ratios",
            "Technical team certification pending",
            "Legal review pending"
        ],
        accentColor: "#76D2FF"
    },
    {
        id:           "reg-004",
        title:        "Annual Subscriber Verification",
        description:  "Annual verification of active subscriber base, SIM registration status, and KYC compliance across all 22 circles.",
        dueDate:      "2025-08-15",
        readiness:    15,
        authority:    "TRAI / DoT",
        penalty:      "₹2 Crore + disconnection risk",
        pendingItems: [
            "KYC audit — 8 circles pending",
            "SIM registration verification",
            "Biometric re-verification backlog",
            "Subscriber count audit",
            "Foreign national SIM compliance",
            "Third party KYC vendor audit"
        ],
        accentColor: "#B497FF"
    }
];


/* ══════════════════════════════════════════════════════════
   13. NETWORK KPIs
   ══════════════════════════════════════════════════════════ */

const NETWORK_KPIS = {
    callDropRate:      1.42,
    dataSpeed4G:       22.4,
    dataSpeed5G:       187.3,
    networkUptime:     99.94,
    voLTEPenetration:  68.4,
    fiveGCircles:      12,
    totalSites:        184200,
    fiberedSites:      82400
};


/* ══════════════════════════════════════════════════════════
   EXPORT
   ══════════════════════════════════════════════════════════ */

window.OPERATOR            = OPERATOR;
window.KPI_DATA            = KPI_DATA;
window.ARPU_CHART_DATA     = ARPU_CHART_DATA;
window.CHURN_TREND         = CHURN_TREND;
window.REVENUE_BREAKDOWN   = REVENUE_BREAKDOWN;
window.CIRCLE_DATA         = CIRCLE_DATA;
window.COMPETITOR_DATA     = COMPETITOR_DATA;
window.QUARTERLY_PL        = QUARTERLY_PL;
window.RAFM_ALERTS         = RAFM_ALERTS;
window.VENDOR_DATA         = VENDOR_DATA;
window.SCENARIO_BASE       = SCENARIO_BASE;
window.SCENARIO_SLIDERS    = SCENARIO_SLIDERS;
window.REGULATORY_FILINGS  = REGULATORY_FILINGS;
window.NETWORK_KPIS        = NETWORK_KPIS;

/* ══════════════════════════════════════════════════════════
   14. CONNECTOR STATUS DATA
   ══════════════════════════════════════════════════════════ */

const CONNECTOR_DATA_LIST = [
    { name: "SAP S/4HANA",           type: "ERP",          status: "live",    lastSync: "2 min ago",  records: "4,218,442",  latency: "14ms",  uptime: "99.98%" },
    { name: "Oracle ERP Cloud",       type: "ERP",          status: "live",    lastSync: "4 min ago",  records: "2,841,203",  latency: "18ms",  uptime: "99.94%" },
    { name: "Microsoft Dynamics",     type: "ERP",          status: "live",    lastSync: "3 min ago",  records: "1,204,887",  latency: "22ms",  uptime: "99.91%" },
    { name: "Workday",                type: "HRIS",         status: "live",    lastSync: "1 min ago",  records: "312,441",    latency: "9ms",   uptime: "99.99%" },
    { name: "Salesforce CRM",         type: "CRM",          status: "live",    lastSync: "3 min ago",  records: "891,204",    latency: "16ms",  uptime: "99.96%" },
    { name: "Ariba / Coupa",          type: "Procurement",  status: "warning", lastSync: "18 min ago", records: "204,118",    latency: "142ms", uptime: "98.84%" },
    { name: "Banking APIs",           type: "Treasury",     status: "live",    lastSync: "1 min ago",  records: "48,204",     latency: "8ms",   uptime: "99.99%" },
    { name: "TRAI Data Feed",         type: "Regulatory",   status: "live",    lastSync: "6 min ago",  records: "12,441",     latency: "24ms",  uptime: "99.87%" },
    { name: "GST Portal",             type: "Tax",          status: "live",    lastSync: "8 min ago",  records: "88,204",     latency: "31ms",  uptime: "99.82%" },
    { name: "OFAC Sanctions List",    type: "Compliance",   status: "live",    lastSync: "12 min ago", records: "1,204",      latency: "11ms",  uptime: "100%"   },
    { name: "Market Data Feed",       type: "External",     status: "live",    lastSync: "30 sec ago", records: "204,887",    latency: "6ms",   uptime: "99.99%" },
    { name: "MCA21 Registry",         type: "Compliance",   status: "live",    lastSync: "15 min ago", records: "42,118",     latency: "28ms",  uptime: "99.76%" }
];

const ENGINE_DATA = [
    { name: "Golden Record Engine",   uptime: "99.94%", latency: "12ms",  throughput: "48,204/s", status: "live"    },
    { name: "RAFM Rules Engine",      uptime: "99.87%", latency: "8ms",   throughput: "22,118/s", status: "live"    },
    { name: "AI Forecast Engine",     uptime: "99.91%", latency: "240ms", throughput: "1,204/s",  status: "live"    },
    { name: "Reconciliation Engine",  uptime: "99.88%", latency: "18ms",  throughput: "12,441/s", status: "live"    },
    { name: "PPP Policy Engine",      uptime: "99.76%", latency: "14ms",  throughput: "8,204/s",  status: "live"    },
    { name: "NLP Query Processor",    uptime: "99.82%", latency: "380ms", throughput: "204/s",    status: "live"    },
    { name: "KPI Computation Layer",  uptime: "98.84%", latency: "22ms",  throughput: "4,118/s",  status: "warning" },
    { name: "Data Lineage Tracker",   uptime: "99.94%", latency: "9ms",   throughput: "48,887/s", status: "live"    },
    { name: "Anomaly Detection ML",   uptime: "99.71%", latency: "180ms", throughput: "2,204/s",  status: "live"    }
];

const ACTIVITY_LOG = [
    { time: "21:42:08", connector: "SAP S/4HANA",        event: "Full sync completed",             type: "success" },
    { time: "21:40:14", connector: "Workday",             event: "Delta sync — 241 new records",    type: "success" },
    { time: "21:38:22", connector: "Ariba / Coupa",       event: "Latency spike detected — 142ms",  type: "warning" },
    { time: "21:36:11", connector: "Banking APIs",        event: "Real-time feed active",           type: "success" },
    { time: "21:34:08", connector: "RAFM Rules Engine",   event: "Rule set updated — v4.2.1",       type: "info"    },
    { time: "21:32:44", connector: "Oracle ERP Cloud",    event: "Delta sync — 1,204 records",      type: "success" },
    { time: "21:30:18", connector: "Golden Record",       event: "Conflict resolution — 48 merged", type: "info"    },
    { time: "21:28:04", connector: "Salesforce CRM",      event: "Delta sync — 88 new records",     type: "success" },
    { time: "21:24:11", connector: "OFAC List",           event: "Sanctions list refreshed",        type: "success" },
    { time: "21:18:44", connector: "Ariba / Coupa",       event: "Retry attempt 1 of 3",            type: "warning" }
];

window.CONNECTOR_DATA_LIST = CONNECTOR_DATA_LIST;
window.ENGINE_DATA         = ENGINE_DATA;
window.ACTIVITY_LOG        = ACTIVITY_LOG;

/* ══════════════════════════════════════════════════════════
   15. EXTENDED KPI LIBRARY
   ══════════════════════════════════════════════════════════ */

const KPI_LIBRARY = [
    { id: "arpu",         label: "ARPU (Blended)",      value: "₹181",   unit: "/mo",   delta: "+₹12",    deltaLabel: "vs last year", accentColor: "#00C0AE", default: true  },
    { id: "churn",        label: "Monthly Churn",        value: "1.42",   unit: "%",     delta: "-0.18%",  deltaLabel: "vs last year", accentColor: "#FD349C", default: true  },
    { id: "ebitda",       label: "EBITDA Margin",        value: "34.6",   unit: "%",     delta: "+2.1%",   deltaLabel: "vs last year", accentColor: "#76D2FF", default: true  },
    { id: "spectrum",     label: "Spectrum Coverage",    value: "2.8",    unit: "×",     delta: "+0.3×",   deltaLabel: "vs last year", accentColor: "#B497FF", default: true  },
    { id: "fcf",          label: "Free Cash Flow",       value: "₹2,340", unit: " Cr",   delta: "+₹340 Cr",deltaLabel: "vs last year", accentColor: "#63EBDA", default: true  },
    { id: "subscribers",  label: "Active Subscribers",   value: "312",    unit: "M",     delta: "+18M",    deltaLabel: "vs last year", accentColor: "#1E49E2", default: true  },
    { id: "netrevenue",   label: "Net Revenue",          value: "₹3,420", unit: " Cr",   delta: "+₹240 Cr",deltaLabel: "vs last year", accentColor: "#00B8F5", default: false },
    { id: "grossadds",    label: "Monthly Gross Adds",   value: "5.1",    unit: "M",     delta: "+0.4M",   deltaLabel: "vs last year", accentColor: "#00C0AE", default: false },
    { id: "prepaidarpu",  label: "Prepaid ARPU",         value: "₹162",   unit: "/mo",   delta: "+₹8",     deltaLabel: "vs last year", accentColor: "#63EBDA", default: false },
    { id: "postpaidarpu", label: "Postpaid ARPU",        value: "₹312",   unit: "/mo",   delta: "+₹24",    deltaLabel: "vs last year", accentColor: "#B497FF", default: false },
    { id: "fiveg",        label: "5G Subscribers",       value: "38",     unit: "M",     delta: "+12M",    deltaLabel: "vs last year", accentColor: "#1E49E2", default: false },
    { id: "volte",        label: "VoLTE Penetration",    value: "68.4",   unit: "%",     delta: "+8.2%",   deltaLabel: "vs last year", accentColor: "#76D2FF", default: false },
    { id: "calldrop",     label: "Call Drop Rate",       value: "1.42",   unit: "%",     delta: "-0.24%",  deltaLabel: "vs last year", accentColor: "#F59E0B", default: false },
    { id: "datarevenue",  label: "Data Revenue %",       value: "58.4",   unit: "%",     delta: "+4.2%",   deltaLabel: "vs last year", accentColor: "#00B8F5", default: false },
    { id: "uptime",       label: "Network Uptime",       value: "99.94",  unit: "%",     delta: "+0.02%",  deltaLabel: "vs last year", accentColor: "#00C0AE", default: false },
    { id: "b2brevenue",   label: "B2B Revenue",          value: "₹390",   unit: " Cr",   delta: "+₹48 Cr", deltaLabel: "vs last year", accentColor: "#B497FF", default: false },
    { id: "capexratio",   label: "Capex / Revenue",      value: "9.9",    unit: "%",     delta: "-1.2%",   deltaLabel: "vs last year", accentColor: "#F59E0B", default: false },
    { id: "fcfyield",     label: "FCF Yield",            value: "68.4",   unit: "%",     delta: "+4.1%",   deltaLabel: "vs last year", accentColor: "#63EBDA", default: false }
];

window.KPI_LIBRARY = KPI_LIBRARY;

/* ══════════════════════════════════════════════════════════
   16. ISSUES / MAINTENANCE REQUESTS
   Pre-seeded sample issues for demo
   ══════════════════════════════════════════════════════════ */

var ISSUES_LOG = [
    {
        id:          "ISS-2025-0038",
        type:        "RAFM Alert",
        source:      "Interconnect Billing Discrepancy — Jio",
        priority:    "critical",
        status:      "in-progress",
        raisedBy:    "CFO Dashboard",
        raisedAt:    "05 Jun 2025 · 09:22 IST",
        assignedTo:  "KPMG GRCS — Revenue Assurance Team",
        slaHours:    4,
        slaRemaining:"1h 42m",
        description: "CDR reconciliation flagged ₹4.8 Cr billing discrepancy with Jio on Mumbai-Delhi route. Requires urgent investigation and formal dispute filing."
    },
    {
        id:          "ISS-2025-0037",
        type:        "Connector Warning",
        source:      "Ariba / Coupa — Latency Spike",
        priority:    "high",
        status:      "open",
        raisedBy:    "System Monitor",
        raisedAt:    "05 Jun 2025 · 07:38 IST",
        assignedTo:  "KPMG GRCS — Managed Services",
        slaHours:    8,
        slaRemaining:"4h 18m",
        description: "Procurement connector latency spiked to 142ms — 10× normal. Sync delays affecting PO approval workflows."
    },
    {
        id:          "ISS-2025-0036",
        type:        "PPP Violation",
        source:      "Split PO — CloudHost Infra Ltd",
        priority:    "critical",
        status:      "open",
        raisedBy:    "PPP Policy Engine",
        raisedAt:    "03 Jun 2025 · 14:22 IST",
        assignedTo:  "KPMG GRCS — Internal Audit",
        slaHours:    2,
        slaRemaining:"OVERDUE",
        description: "4 consecutive POs to CloudHost Infra Ltd each valued at ₹48L — just below ₹50L CFO approval threshold. Potential split-PO fraud."
    },
    {
        id:          "ISS-2025-0035",
        type:        "RAFM Alert",
        source:      "TAP File Leakage — Zone 3",
        priority:    "high",
        status:      "resolved",
        raisedBy:    "CFO Dashboard",
        raisedAt:    "02 Jun 2025 · 11:14 IST",
        assignedTo:  "KPMG GRCS — Roaming Operations",
        slaHours:    8,
        slaRemaining:"Resolved",
        description: "TAP file mismatch in South India zone. ₹1.2 Cr unbilled roaming events identified and recovered."
    }
];

window.ISSUES_LOG = ISSUES_LOG;