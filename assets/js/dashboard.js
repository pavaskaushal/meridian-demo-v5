/* ============================================================
   MERIDIAN V5 · DASHBOARD
   CFO Command Board — New Layout
   1. AI Executive Brief
   2. Alert / QTD Strip
   3. KPI Explorer (tabs + 4×2 grid)
   4. ARPU Trend Chart (full width)
   5. Circle Map (full width)
   6. Floating Ask Meridian panel
   ============================================================ */

var ACTIVE_KPI_TAB = 'favourites';
var ARPU_VIEW      = 'trend';

/* ── INIT ───────────────────────────────────────────────────── */

function injectDashboardHTML() {
    var container = document.getElementById('screen-container');
    if (!container) return;
    container.innerHTML = '<div style="display:flex;gap:12px;"><div class="ai-brief-card" id="ai-brief-card" style="flex:1;"><div class="ai-brief-header"><div style="display:flex;align-items:center;gap:9px;"><img src="assets/meridianlogo.svg" width="18" height="18" style="filter:invert(1);vertical-align:middle;"><span style="font-family:var(--font-mono);font-size:11px;font-weight:700;letter-spacing:1.5px;color:var(--text-primary);text-transform:uppercase;">Meridian Intelligence</span><span style="font-family:var(--font-mono);font-size:9px;font-weight:700;letter-spacing:0.8px;color:var(--kpmg-cyan);background:rgba(0,184,245,0.08);border:1px solid rgba(0,184,245,0.20);border-radius:2px;padding:2px 6px;margin-left:4px;">GROQ</span></div><div style="display:flex;align-items:center;gap:10px;"><span id="ai-brief-timestamp" style="font-size:10px;color:var(--text-muted);font-family:var(--font-mono);"></span><button class="btn btn-secondary" onclick="generateAIBrief()" id="ai-brief-btn" style="font-size:9px;padding:3px 10px;font-family:var(--font-mono);letter-spacing:1px;font-weight:700;">&#8635; REFRESH</button></div></div><div class="ai-brief-body"><div id="ai-brief-text" class="ai-brief-text"></div></div></div><div class="ai-brief-card" style="flex:1;min-width:260px;" id="live-feed-card"></div></div><div style="display:flex;gap:12px;margin-top:20px;"><div class="alert-strip-left" id="alert-strip-left" style="display:inline-flex;align-items:center;gap:8px;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-sm);padding:0 16px;height:44px;width:fit-content;"></div><div class="alert-strip-right" id="alert-strip-right" style="display:flex;align-items:center;gap:16px;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-sm);padding:0 24px;height:44px;white-space:nowrap;flex:1;"></div></div><div class="kpi-explorer" style="margin-top:20px;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-sm);padding:14px 16px 0 16px;"><div style="font-family:var(--font-mono);font-size:9px;font-weight:700;letter-spacing:1.5px;color:var(--text-muted);margin-bottom:10px;">BUSINESS LINES</div><div class="kpi-tab-bar" id="kpi-tab-bar"><button class="kpi-tab active" onclick="switchKPITab(\'favourites\')" data-tab="favourites"><svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" style="vertical-align:middle;margin-right:4px;"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>Favourites</button><button class="kpi-tab" onclick="switchKPITab(\'finance\')" data-tab="finance"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:4px;"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>Finance</button><button class="kpi-tab" onclick="switchKPITab(\'commercial\')" data-tab="commercial"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:4px;"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>Commercial</button><button class="kpi-tab" onclick="switchKPITab(\'network\')" data-tab="network"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:4px;"><circle cx="12" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><line x1="12" y1="7" x2="5" y2="17"/><line x1="12" y1="7" x2="19" y2="17"/></svg>Network</button><button class="kpi-tab" onclick="switchKPITab(\'rafm\')" data-tab="rafm"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:4px;"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>RAFM</button><button class="kpi-tab" onclick="switchKPITab(\'hr\')" data-tab="hr"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:4px;"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>HR</button><button class="kpi-tab" onclick="switchKPITab(\'procurement\')" data-tab="procurement"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:4px;"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg>Procurement</button><button class="kpi-tab" onclick="switchKPITab(\'regulatory\')" data-tab="regulatory"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:4px;"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>Regulatory</button><button class="kpi-tab" onclick="switchKPITab(\'cx\')" data-tab="cx"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:4px;"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>Customer</button></div><div class="kpi-tab-subtitle" id="kpi-tab-subtitle">Your pinned KPIs · Saved to this device</div><div class="grid-kpi" id="kpi-grid"></div></div></div><div class="data-card" style="margin-top:24px;margin-bottom:var(--space-2xl);"><div class="card-header"><div><div class="card-title">ARPU Trend - 15 Month View</div><div class="card-subtitle" id="arpu-chart-subtitle">Historical · AI Forecast</div></div><div style="display:flex;align-items:center;gap:8px;"><div style="display:flex;border:1px solid var(--border);border-radius:var(--radius-sm);overflow:hidden;"><button id="arpu-view-trend" onclick="toggleARPUView(\'trend\')" style="font-size:10px;padding:4px 12px;background:var(--kpmg-cyan);color:#0A0F1E;border:none;cursor:pointer;font-weight:700;">Trend</button><button id="arpu-view-comp" onclick="toggleARPUView(\'competitors\')" style="font-size:10px;padding:4px 12px;background:transparent;color:var(--text-muted);border:none;cursor:pointer;">vs Peers</button></div><div class="badge badge-live">AI FORECAST</div></div></div><div class="card-body" style="height:320px;position:relative;padding:12px 8px 8px 8px;"><div id="arpu-chart-container" style="width:100%;height:100%;"></div></div></div>';
}

function initDashboard() {
    injectDashboardHTML();
    autoGenerateBriefOnce();
    renderAlertStrip();

    // Start on saved tab, favourites if any, else finance
    var savedTab = null;
    try { savedTab = localStorage.getItem('meridian-active-tab'); } catch(e) {}
    var startTab = savedTab || (getFavourites().length > 0 ? 'favourites' : 'finance');
    switchKPITab(startTab);

    // Charts and circle map run independently — a failure in one doesn't block the other
    setTimeout(function() {
        try {
            renderCharts();
        } catch(e) {
            console.error('[Meridian] renderCharts error:', e);
            var chartBody = document.getElementById('arpu-chart-container');
            if (chartBody) {
                chartBody.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#FD349C;font-size:11px;font-family:monospace;">Chart error: ' + e.message + '</div>';
            }
        }
    }, 150);
    startFreshnessTimer();
}


/* ══════════════════════════════════════════════════════════════
   SECTION 1 — AI EXECUTIVE BRIEF
   Shows a smart static summary on load; calls Groq on demand.
   ══════════════════════════════════════════════════════════════ */

function highlightNumbers(text) {
    text = text.replace(/(₹[\d,]+\.?\d*\s*(Cr|L|K|M|B)?)/g, '<strong style="color:#00B8F5;font-weight:700;">$1</strong>');
    text = text.replace(/([+][\d]+\.?\d*%)/g, '<strong style="color:#00C0AE;font-weight:700;">$1</strong>');
    text = text.replace(/(-[\d]+\.?\d*%)/g, '<strong style="color:#FD349C;font-weight:700;">$1</strong>');
    text = text.replace(/\b(\d+\.?\d*%)\b/g, '<strong style="color:#00B8F5;font-weight:700;">$1</strong>');
    text = text.replace(/(\d+\.?\d*\s*(bps|pts))/g, '<strong style="color:#00B8F5;font-weight:700;">$1</strong>');
    return text;
}

function buildLiveFeed() {
    var now = new Date();
    var fmt = function(m) { var t = new Date(now - m*60000); return t.toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'}); };
    var arpu = findKPI('arpu'), churn = findKPI('churn');
    var alerts = window.RAFM_ALERTS || [], topAlert = alerts[0];
    var updates = [
        { time: fmt(2),  source: 'BILLING_ERP', text: arpu  ? 'ARPU revised +₹2 → ₹' + arpu.value + ' following reconciliation.' : 'ARPU data refreshed.' },
        { time: fmt(7),  source: 'CRM_LIVE',    text: churn ? 'Churn updated to ' + churn.value + '% (' + churn.delta + ' YoY). Maharashtra circle flagged.' : 'Churn data refreshed.' },
        { time: fmt(14), source: topAlert ? 'RAFM_ENGINE' : 'REGULATORY_DB', text: topAlert ? 'Alert escalated: ' + topAlert.title + ' — ' + topAlert.amount + ' exposure detected.' : 'Spectrum fee liability recalculated. No variance from prior period.' }
    ];
    return '<div style="padding-top:4px;">' +
        updates.map(function(u) {
            return '<div style="display:flex;align-items:baseline;gap:8px;padding:2px 0;">' +
                '<span style="font-family:var(--font-mono);font-size:9px;color:var(--text-muted);flex-shrink:0;min-width:40px;">' + u.time + '</span>' +
                '<span style="font-family:var(--font-mono);font-size:9px;font-weight:600;color:var(--text-muted);flex-shrink:0;">[' + u.source + ']</span>' +
                '<span style="font-size:11px;color:var(--text-muted);line-height:1.5;">' + highlightNumbers(u.text) + '</span></div>';
        }).join('') + '</div>';
}

function renderBriefZones(line1, line2) {
    return '<div style="display:flex;flex-direction:column;gap:6px;padding-bottom:0;">' +
        '<div style="font-size:13px;color:var(--text-secondary);line-height:1.7;">' + highlightNumbers(line1) + '</div>' +
        '<div style="font-size:13px;color:var(--text-secondary);line-height:1.7;">' + highlightNumbers(line2) + '</div>' +
        '</div>';
}

function renderAIBrief() {
    var el = document.getElementById('ai-brief-text');
    if (!el) return;
    // Populate live feed card separately
    var feedCard = document.getElementById('live-feed-card');
    if (feedCard) feedCard.innerHTML =
        '<div class="ai-brief-header">' +
            '<div style="display:flex;align-items:center;gap:9px;">' +
                '<span style="font-family:var(--font-mono);font-size:11px;font-weight:700;letter-spacing:1.5px;color:var(--text-primary);text-transform:uppercase;">Live Updates</span>' +
            '</div>' +
        '</div>' +
        '<div class="ai-brief-body">' + buildLiveFeed() + '</div>';
    var revenue = findKPI('revenue'), margin = findKPI('ebitda-margin'), arpu = findKPI('arpu'), fcf = findKPI('fcf'), churn = findKPI('churn');
    var alerts = window.RAFM_ALERTS || [];
    var critCount = alerts.filter(function(a) { return (a.severity||'').toUpperCase() === 'CRITICAL'; }).length;
    var line1 = '';
    if (revenue) line1 += 'Revenue ₹' + revenue.value.toLocaleString('en-IN') + ' Cr (' + revenue.delta + ' YoY), ';
    if (margin)  line1 += 'EBITDA margin ' + margin.value + '% (' + (parseFloat(margin.deltaQoQ) >= 0 ? '+' : '') + margin.deltaQoQ + ' QoQ), ';
    if (arpu)    line1 += 'ARPU ₹' + arpu.value + '.';
    if (fcf)     line1 += ' Free cash flow at ₹' + fcf.value + ' Cr with capex discipline sustaining conversion.';
    var line2 = critCount > 0
        ? '⚠ ' + critCount + ' critical alert' + (critCount > 1 ? 's' : '') + ' active — ' + (alerts[0] ? alerts[0].amount : '') + ' exposure. RAFM posture requires immediate review.'
        : 'RAFM posture stable — ' + alerts.length + ' active alerts, none critical. Pipeline conversion tracking above target.';
    el.innerHTML = renderBriefZones(line1, line2);
    updateBriefTimestamp();
}

var _briefGenerated = false;

function autoGenerateBriefOnce() {
    var key = null;
    try { key = localStorage.getItem('meridian-groq-key') || window.GROQ_API_KEY; } catch(e) {}
    if (key && !_briefGenerated) { generateAIBrief(true); } else { renderAIBrief(); }
}

function generateAIBrief(silent) {
    var el  = document.getElementById('ai-brief-text');
    var btn = document.getElementById('ai-brief-btn');
    if (!el) return;
    var kpiSummary = (window.KPI_MASTER || []).slice(0, 12).map(function(k) {
        return k.label + ': ' + k.value + ' ' + k.unit + ' (' + k.delta + ' YoY, ' + k.pctToTarget + '% to target)';
    }).join('; ');
    var alertSummary = (window.RAFM_ALERTS || []).slice(0, 3).map(function(a) {
        return a.severity + ': ' + a.title + ' — ' + a.amount;
    }).join('; ');
    var prompt = 'You are a CFO intelligence assistant for Apex Telecom, an Indian telco with 22 circles and 312M subscribers. ' +
        'Write exactly 2 sentences, max 60 words total. Sentence 1: financial performance with specific numbers for revenue, EBITDA margin, ARPU. ' +
        'Sentence 2: key risk or opportunity, be direct. Plain prose only, no bullet points, no markdown. ' +
        'KPIs: ' + kpiSummary + '. Alerts: ' + alertSummary;
    if (btn) { btn.disabled = true; btn.innerHTML = '… RUNNING'; }
    renderAIBrief();
    var doCall = function() {
        callGroq(prompt, null,
            function(response) {
                var clean = response.replace(/\n+/g, ' ').trim();
                var parts = clean.match(/[^.!?]+[.!?]+\s*/g) || [clean];
                var line1 = (parts[0] || clean).trim();
                var line2 = parts.slice(1).join('').trim() || line1;
                el.innerHTML = renderBriefZones(line1, line2);
                _briefGenerated = true;
                updateBriefTimestamp();
                if (btn) { btn.disabled = false; btn.innerHTML = '&#8635; REFRESH'; }
            },
            function() {
                renderAIBrief();
                if (btn) { btn.disabled = false; btn.innerHTML = '&#8635; REFRESH'; }
            }
        );
    };
    if (silent) {
        var key = null;
        try { key = localStorage.getItem('meridian-groq-key') || window.GROQ_API_KEY; } catch(e) {}
        if (key) { doCall(); } else { renderAIBrief(); if (btn) { btn.disabled = false; btn.innerHTML = '&#8635; REFRESH'; } }
    } else {
        showApiKeyPrompt(doCall);
    }
}

function updateBriefTimestamp() {
    var ts = document.getElementById('ai-brief-timestamp');
    if (ts) {
        var now = new Date();
        ts.textContent = 'Generated ' + now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    }
}

function findKPI(id) {
    return window.KPI_MASTER && window.KPI_MASTER.find(function(k) { return k.id === id; });
}


/* ══════════════════════════════════════════════════════════════
   SECTION 2 — ALERT / QTD STRIP
   ══════════════════════════════════════════════════════════════ */

function renderAlertStrip() {
    renderAlertStripLeft();
    renderAlertStripRight();
}

function renderAlertStripLeft() {
    var el = document.getElementById('alert-strip-left');
    if (!el) return;

    var alerts    = window.RAFM_ALERTS || [];
    var critical  = alerts.filter(function(a) { return (a.severity||'').toUpperCase() === 'CRITICAL'; }).length;
    var high      = alerts.filter(function(a) { return (a.severity||'').toUpperCase() === 'HIGH'; }).length;
    var total     = alerts.length;

    el.innerHTML =
        '<span style="font-size:10px;color:var(--text-muted);font-weight:600;letter-spacing:0.5px;margin-right:4px;">ALERTS</span>' +
        (critical > 0
            ? '<span class="strip-badge strip-badge-critical">' + critical + ' CRITICAL</span>'
            : '') +
        (high > 0
            ? '<span class="strip-badge strip-badge-high">' + high + ' HIGH</span>'
            : '') +
        '<span class="strip-badge strip-badge-open">' + total + ' OPEN</span>' +
        '<span style="font-size:10px;color:var(--text-muted);margin-left:6px;cursor:pointer;" ' +
            'onclick="showScreen(\'rafm\', document.querySelector(\'[data-screen=rafm]\'))" ' +
            'title="View all alerts">View all →</span>';
}

function renderAlertStripRight() {
    var el = document.getElementById('alert-strip-right');
    if (!el) return;

    var now   = new Date();
    var month = now.getMonth(); // 0-based
    var year  = now.getFullYear();

    var quarter, qStart, qEnd, fyLabel;
    if (month >= 3 && month <= 5) {
        quarter = 1; qStart = new Date(year, 3, 1); qEnd = new Date(year, 5, 30);
        fyLabel = 'Q1 FY' + String(year + 1).slice(2);
    } else if (month >= 6 && month <= 8) {
        quarter = 2; qStart = new Date(year, 6, 1); qEnd = new Date(year, 8, 30);
        fyLabel = 'Q2 FY' + String(year + 1).slice(2);
    } else if (month >= 9 && month <= 11) {
        quarter = 3; qStart = new Date(year, 9, 1); qEnd = new Date(year, 11, 31);
        fyLabel = 'Q3 FY' + String(year + 1).slice(2);
    } else {
        quarter = 4; qStart = new Date(year, 0, 1); qEnd = new Date(year, 2, 31);
        fyLabel = 'Q4 FY' + String(year).slice(2);
    }

    var totalDays   = Math.round((qEnd - qStart) / 86400000) + 1;
    var elapsed     = Math.min(Math.round((now - qStart) / 86400000) + 1, totalDays);
    var pct         = Math.round((elapsed / totalDays) * 100);
    var filled      = Math.round(pct / 5); // blocks out of 20

    var barBlocks = '';
    for (var i = 0; i < 20; i++) {
        barBlocks += '<div class="qtd-block' + (i < filled ? ' filled' : '') + '"></div>';
    }

    var remaining = totalDays - elapsed;

    el.innerHTML =
        '<span style="font-size:10px;font-weight:700;color:var(--text-secondary);letter-spacing:0.5px;">' + fyLabel + '</span>' +
        '<div class="qtd-bar">' + barBlocks + '</div>' +
        '<span style="font-size:10px;font-weight:700;color:var(--kpmg-cyan);">' + pct + '%</span>' +
        '<span style="font-size:10px;color:var(--text-muted);">Day ' + elapsed + ' of ' + totalDays + '</span>' +
        '<span style="font-size:10px;color:var(--border-light);margin:0 2px;">·</span>' +
        '<span style="font-size:10px;color:var(--text-muted);">' + remaining + ' days left</span>';
}


/* ══════════════════════════════════════════════════════════════
   SPARKLINES — inline SVG
   Pass fullWidth=true for card-bottom full-width sparkline
   ══════════════════════════════════════════════════════════════ */

function buildSparkline(data, color, fullWidth) {
    if (!data || data.length < 2) return '';
    var min   = Math.min.apply(null, data);
    var max   = Math.max.apply(null, data);
    var range = max - min || 1;
    var W = fullWidth ? 200 : 60;
    var H = fullWidth ? 36 : 28;
    var P = 3;

    var pts = data.map(function(v, i) {
        var x = P + (i / (data.length - 1)) * (W - P * 2);
        var y = H - P - ((v - min) / range) * (H - P * 2);
        return x.toFixed(1) + ',' + y.toFixed(1);
    });

    var lastPt = pts[pts.length - 1].split(',');
    var area   = P.toFixed(1) + ',' + H + ' ' + pts.join(' ') + ' ' + (W - P).toFixed(1) + ',' + H;
    var wAttr  = fullWidth ? 'width="100%"' : 'width="' + W + '"';

    return '<svg ' + wAttr + ' height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '" style="display:block;overflow:visible;">' +
        '<polygon points="' + area + '" fill="' + color + '" opacity="0.12"/>' +
        '<polyline points="' + pts.join(' ') + '" fill="none" stroke="' + color + '" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<circle cx="' + lastPt[0] + '" cy="' + lastPt[1] + '" r="2.5" fill="' + color + '"/>' +
    '</svg>';
}


/* ══════════════════════════════════════════════════════════════
   SECTION 3+4 — KPI EXPLORER
   ══════════════════════════════════════════════════════════════ */

function switchKPITab(tab) {
    ACTIVE_KPI_TAB = tab;

    document.querySelectorAll('.kpi-tab').forEach(function(btn) {
        btn.classList.toggle('active', btn.getAttribute('data-tab') === tab);
    });

    var subtitles = {
        favourites:  'Your pinned KPIs \xb7 Saved to this device',
        finance:     'Finance & Treasury \xb7 SAP ERP \xb7 Oracle Financials',
        commercial:  'Commercial & Revenue \xb7 Siebel CRM \xb7 BSS',
        network:     'Network & Technology \xb7 Huawei OSS \xb7 Nokia NetAct',
        rafm:        'Revenue Assurance & Fraud \xb7 Subex RAID',
        hr:          'HR & Workforce \xb7 Workday HCM',
        procurement: 'Procurement & Vendor \xb7 SAP Ariba',
        regulatory:  'Regulatory & Compliance \xb7 Internal GRC',
        cx:          'Customer Experience \xb7 Genesys CX'
    };
    var subEl = document.getElementById('kpi-tab-subtitle');
    if (subEl) subEl.textContent = subtitles[tab] || '';

    try { localStorage.setItem('meridian-active-tab', tab); } catch(e) {}
    renderKPITab(tab);
}

function renderKPITab(tab) {
    var grid = document.getElementById('kpi-grid');
    if (!grid) return;

    var kpis;
    var favIds = getFavourites();

    if (tab === 'favourites') {
        kpis = (window.KPI_MASTER || []).filter(function(k) { return favIds.indexOf(k.id) > -1; });
        if (kpis.length === 0) {
            grid.innerHTML =
                '<div style="grid-column:1/-1;text-align:center;padding:56px 24px;color:var(--text-muted);">' +
                    '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin:0 auto 14px;display:block;opacity:0.3;"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>' +
                    '<div style="font-size:14px;font-weight:600;color:var(--text-secondary);margin-bottom:8px;">No favourites yet</div>' +
                    '<div style="font-size:12px;">Click the ★ on any KPI card to pin it here</div>' +
                '</div>';
            return;
        }
    } else {
        // Limit to 8 per business line
        kpis = (window.KPI_MASTER || []).filter(function(k) { return k.businessLine === tab; }).slice(0, 8);
    }

    grid.innerHTML = kpis.map(function(kpi) {
        return buildKPICard(kpi, favIds.indexOf(kpi.id) > -1);
    }).join('');
}

function buildKPICard(kpi, isFav) {
    var pct        = kpi.pctToTarget || 0;
    var color      = pct >= 95 ? '#00C0AE' : pct >= 75 ? '#00B8F5' : pct >= 50 ? '#F59E0B' : '#FD349C';
    var statusLabel = pct >= 95 ? 'ON TRACK' : pct >= 75 ? 'WATCH' : pct >= 50 ? 'AT RISK' : 'CRITICAL';
    var spark      = kpi.trend5Q ? buildSparkline(kpi.trend5Q, color, true) : '';

    // vs-target calculation — sign flip handled by pctToTarget color
    var vtNum     = kpi.target ? ((parseFloat(kpi.value) / parseFloat(kpi.target) - 1) * 100) : null;
    var vtStr     = vtNum !== null ? (vtNum >= 0 ? '+' : '') + vtNum.toFixed(1) + '% vs target' : null;
    var vtColor   = pct >= 95 ? '#00C0AE' : pct >= 75 ? '#00B8F5' : pct >= 50 ? '#F59E0B' : '#FD349C';

    var yoyColor  = kpi.trend === 'up' ? '#00C0AE' : kpi.trend === 'down' ? '#FD349C' : '#8A9BB0';
    var yoyArrow  = kpi.trend === 'up' ? '▲' : kpi.trend === 'down' ? '▼' : '–';

    return '<div class="kpi-card" onclick="openKPIDetail(\'' + kpi.id + '\')">' +

        // ── Top row: label + status badge
        '<div class="kpi-card-header">' +
            '<div class="kpi-label">' + kpi.label + '</div>' +
            '<div style="display:flex;align-items:center;gap:5px;flex-shrink:0;">' +
                '<span class="kpi-status-badge" style="color:' + color + ';border-color:' + color + '30;background:' + color + '12;">' + statusLabel + '</span>' +
                '<span class="kpi-fav-btn' + (isFav ? ' active' : '') + '" ' +
                    'onclick="event.stopPropagation();toggleFavourite(\'' + kpi.id + '\')" ' +
                    'style="color:' + (isFav ? '#F59E0B' : 'var(--text-muted)') + ';opacity:' + (isFav ? '1' : '0.4') + ';" ' +
                    'title="Pin to Favourites">★</span>' +
            '</div>' +
        '</div>' +

        // ── Value
        '<div class="kpi-value-row">' +
            '<span class="kpi-value">' + kpi.value + '</span>' +
            '<span class="kpi-unit">' + kpi.unit + '</span>' +
        '</div>' +

        // ── Delta lines
        (vtStr ? '<div class="kpi-delta-line" style="color:' + vtColor + ';">' + vtStr + '</div>' : '') +
        '<div class="kpi-delta-line kpi-delta-yoy" style="color:' + yoyColor + ';">' +
            yoyArrow + ' ' + kpi.delta + ' YoY' +
        '</div>' +

        // ── Sparkline — full width
        (spark ? '<div class="kpi-sparkline-wrap">' + spark + '</div>' : '') +

        // ── Footer
        '<div class="kpi-card-footer">' +
            '<div style="display:flex;align-items:center;gap:4px;">' +
                '<div style="width:4px;height:4px;border-radius:50%;background:#00C0AE;animation:livePulse 1.5s ease-in-out infinite alternate;"></div>' +
                '<span class="kpi-freshness" style="font-size:9px;color:var(--text-muted);">Live</span>' +
            '</div>' +
            '<span style="font-size:9px;color:var(--text-muted);opacity:0.5;">↗</span>' +
        '</div>' +

    '</div>';
}


/* ══════════════════════════════════════════════════════════════
   ARPU CHART TOGGLE
   ══════════════════════════════════════════════════════════════ */

function toggleARPUView(view) {
    ARPU_VIEW = view;
    var trendBtn = document.getElementById('arpu-view-trend');
    var compBtn  = document.getElementById('arpu-view-comp');
    var subtitle = document.getElementById('arpu-chart-subtitle');

    if (view === 'trend') {
        if (typeof renderTrendSVG === 'function') renderTrendSVG();
        if (trendBtn) { trendBtn.style.background = 'var(--kpmg-cyan)'; trendBtn.style.color = '#0A0F1E'; trendBtn.style.fontWeight = '700'; }
        if (compBtn)  { compBtn.style.background  = 'transparent'; compBtn.style.color = 'var(--text-muted)'; compBtn.style.fontWeight = '400'; }
        if (subtitle) subtitle.textContent = 'Historical Jul\'24–Jun\'25 \xb7 AI Forecast Jul–Sep\'25';
    } else {
        if (typeof renderCompetitorSVG === 'function') renderCompetitorSVG();
        if (compBtn)  { compBtn.style.background  = 'var(--kpmg-cyan)'; compBtn.style.color = '#0A0F1E'; compBtn.style.fontWeight = '700'; }
        if (trendBtn) { trendBtn.style.background = 'transparent'; trendBtn.style.color = 'var(--text-muted)'; trendBtn.style.fontWeight = '400'; }
        if (subtitle) subtitle.textContent = 'Indian telecom operators \xb7 Blended ARPU ₹/month';
    }
}


/* ══════════════════════════════════════════════════════════════
   FAVOURITES
   ══════════════════════════════════════════════════════════════ */

function getFavourites() {
    try { return JSON.parse(localStorage.getItem('meridian-favourites') || '[]'); } catch(e) { return []; }
}

function toggleFavourite(id) {
    var favs = getFavourites();
    var idx  = favs.indexOf(id);
    if (idx > -1) favs.splice(idx, 1); else favs.push(id);
    try { localStorage.setItem('meridian-favourites', JSON.stringify(favs)); } catch(e) {}
    renderKPITab(ACTIVE_KPI_TAB);
}


/* ══════════════════════════════════════════════════════════════
   KPI DETAIL MODAL — kept from V5 original
   ══════════════════════════════════════════════════════════════ */

function openKPIDetail(id) {
    var kpi = window.KPI_MASTER && window.KPI_MASTER.find(function(k) { return k.id === id; });
    if (!kpi) return;

    var bl         = (window.BUSINESS_LINES && window.BUSINESS_LINES.find(function(b) { return b.id === kpi.businessLine; })) || {};
    var pct        = kpi.pctToTarget;
    var color      = pct >= 95 ? '#00C0AE' : pct >= 75 ? '#00B8F5' : pct >= 50 ? '#F59E0B' : pct >= 30 ? '#F97316' : '#FD349C';
    var isFav      = getFavourites().indexOf(id) > -1;
    var deltaColor = kpi.trend === 'up' ? '#00C0AE' : kpi.trend === 'down' ? '#FD349C' : '#8A9BB0';

    var box = document.getElementById('modal-box');
    if (!box) return;

    box.innerHTML =
        '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px;">' +
            '<div>' +
                '<div style="font-size:10px;font-weight:700;letter-spacing:1.5px;color:' + color + ';text-transform:uppercase;margin-bottom:4px;">' + (bl.label || kpi.businessLine) + ' \xb7 ' + kpi.system + '</div>' +
                '<div style="font-size:22px;font-weight:700;color:var(--text-primary);">' + kpi.label + '</div>' +
                '<div style="font-size:12px;color:var(--text-muted);margin-top:2px;">' + (kpi.period || '') + ' \xb7 ' + (kpi.systemFull || '') + '</div>' +
            '</div>' +
            '<div style="display:flex;gap:8px;align-items:center;">' +
                '<button onclick="toggleFavourite(\'' + id + '\');openKPIDetail(\'' + id + '\')" style="background:transparent;border:1px solid var(--border);border-radius:4px;padding:4px 10px;cursor:pointer;font-size:14px;color:' + (isFav ? '#F59E0B' : 'var(--text-muted)') + ';">★</button>' +
                '<button onclick="closeModal()" style="background:transparent;border:1px solid var(--border);border-radius:4px;padding:4px 10px;cursor:pointer;font-size:16px;color:var(--text-muted);">✕</button>' +
            '</div>' +
        '</div>' +

        '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-bottom:20px;">' +
            '<div style="background:var(--bg);border-radius:var(--radius-sm);padding:16px;border:1px solid var(--border);">' +
                '<div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">Current Value</div>' +
                '<div style="font-size:32px;font-weight:700;color:var(--text-primary);font-family:var(--font-mono);">' + kpi.value + '<span style="font-size:14px;color:var(--text-secondary);margin-left:4px;">' + kpi.unit + '</span></div>' +
                '<div style="font-size:12px;color:' + deltaColor + ';margin-top:4px;font-weight:600;">' + kpi.delta + ' YoY</div>' +
            '</div>' +
            '<div style="background:var(--bg);border-radius:var(--radius-sm);padding:16px;border:1px solid var(--border);">' +
                '<div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">FY26 Target</div>' +
                '<div style="font-size:14px;font-weight:700;color:var(--text-primary);margin-bottom:8px;">' + (kpi.targetFY || kpi.target) + '</div>' +
                '<div style="height:4px;background:var(--border);border-radius:2px;"><div style="height:4px;background:' + color + ';border-radius:2px;width:' + Math.min(pct, 100) + '%;"></div></div>' +
                '<div style="font-size:11px;color:' + color + ';font-weight:700;margin-top:4px;">' + pct + '% to target</div>' +
            '</div>' +
            '<div style="background:var(--bg);border-radius:var(--radius-sm);padding:16px;border:1px solid var(--border);">' +
                '<div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">Benchmark</div>' +
                '<div style="font-size:14px;font-weight:700;color:var(--text-primary);margin-bottom:4px;">' + kpi.benchmark + ' ' + kpi.unit + '</div>' +
                '<div style="font-size:11px;color:var(--text-muted);">' + (kpi.benchmarkLabel || '') + '</div>' +
                '<div style="font-size:11px;font-weight:700;margin-top:4px;color:' + (kpi.rank === 1 ? '#00C0AE' : kpi.rank <= 2 ? '#00B8F5' : kpi.rank <= 3 ? '#F59E0B' : '#FD349C') + ';">Rank ' + kpi.rank + ' of ' + kpi.rankOf + ' operators</div>' +
            '</div>' +
        '</div>' +

        '<div style="background:var(--bg);border-radius:var(--radius-sm);padding:16px;border:1px solid var(--border);margin-bottom:16px;">' +
            '<div style="font-size:11px;font-weight:700;letter-spacing:1px;color:var(--text-muted);text-transform:uppercase;margin-bottom:12px;">5-Quarter Trend</div>' +
            '<div style="height:120px;position:relative;"><canvas id="kpi-modal-trend"></canvas></div>' +
        '</div>' +

        '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:16px;">' +
            insightCard('INSIGHT', kpi.insight, '#00B8F5') +
            insightCard('RISK', kpi.risk, '#FD349C') +
            insightCard('OPPORTUNITY', kpi.opportunity, '#00C0AE') +
        '</div>' +

        '<div style="background:var(--bg);border-radius:var(--radius-sm);padding:14px;border:1px solid var(--border);margin-bottom:10px;">' +
            '<div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">Formula</div>' +
            '<div style="font-size:12px;color:var(--text-secondary);font-family:var(--font-mono);line-height:1.6;">' + (kpi.formula || 'N/A') + '</div>' +
        '</div>' +

        '<div style="background:var(--bg);border-radius:var(--radius-sm);padding:14px;border:1px solid var(--border);display:flex;gap:24px;">' +
            '<div style="flex:1;">' +
                '<div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Source System</div>' +
                '<div style="font-size:12px;color:var(--text-secondary);">' + (kpi.systemFull || kpi.system) + '</div>' +
            '</div>' +
            '<div style="width:1px;background:var(--border);"></div>' +
            '<div>' +
                '<div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Tags</div>' +
                '<div style="display:flex;gap:4px;flex-wrap:wrap;">' +
                (kpi.tags || []).map(function(t) {
                    return '<span style="font-size:10px;background:var(--border);color:var(--text-muted);padding:2px 8px;border-radius:20px;">' + t + '</span>';
                }).join('') +
                '</div>' +
            '</div>' +
        '</div>';

    var overlay = document.getElementById('modal-overlay');
    if (overlay) { overlay.classList.add('active'); document.body.style.overflow = 'hidden'; }

    setTimeout(function() {
        var ctx = document.getElementById('kpi-modal-trend');
        if (!ctx || !kpi.trend5Q) return;
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Q1 FY25', 'Q2 FY25', 'Q3 FY25', 'Q4 FY25', 'Q1 FY26'],
                datasets: [{ data: kpi.trend5Q, borderColor: color, backgroundColor: color + '22', borderWidth: 2, pointRadius: 4, pointBackgroundColor: color, tension: 0.3, fill: true }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8A9BB0', font: { size: 10 } } },
                    y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8A9BB0', font: { size: 10 } } }
                }
            }
        });
    }, 100);
}

function insightCard(title, text, color) {
    return '<div style="background:var(--bg);border-radius:var(--radius-sm);padding:14px;border:1px solid var(--border);border-top:2px solid ' + color + ';">' +
        '<div style="font-size:10px;font-weight:700;letter-spacing:1px;color:' + color + ';margin-bottom:8px;">' + title + '</div>' +
        '<div style="font-size:12px;color:var(--text-secondary);line-height:1.6;">' + (text || 'N/A') + '</div>' +
    '</div>';
}


/* ══════════════════════════════════════════════════════════════
   FLOATING ASK MERIDIAN PANEL
   ══════════════════════════════════════════════════════════════ */

var ASK_PANEL_OPEN = false;

function toggleAskPanel() {
    ASK_PANEL_OPEN = !ASK_PANEL_OPEN;
    var panel = document.getElementById('ask-meridian-panel');
    var fab   = document.getElementById('ask-meridian-fab');
    if (panel) panel.classList.toggle('open', ASK_PANEL_OPEN);
    if (fab)   fab.style.display = ASK_PANEL_OPEN ? 'none' : 'flex';
    if (ASK_PANEL_OPEN) {
        setTimeout(function() {
            var input = document.getElementById('ai-query-input');
            if (input) input.focus();
        }, 260);
    }
}

function handleQuery() {
    var input = document.getElementById('ai-query-input');
    var resp  = document.getElementById('ai-response');
    var query = input ? input.value.trim() : '';
    if (!query || !resp) return;

    showApiKeyPrompt(function() {
        var emptyState = document.getElementById('ask-panel-empty');
        if (emptyState) emptyState.style.display = 'none';
        resp.style.display = 'block';
        resp.innerHTML =
            '<div style="padding:12px;background:var(--bg);border-radius:var(--radius-sm);border:1px solid var(--border-light);display:flex;align-items:center;gap:10px;">' +
                '<div class="loading-spinner" style="width:14px;height:14px;border-width:2px;flex-shrink:0;"></div>' +
                '<span style="color:var(--text-muted);font-size:12px;">Analysing…</span>' +
            '</div>';

        callGroq(query, null,
            function(response) {
                resp.innerHTML =
                    '<div style="padding:12px;background:var(--bg);border-radius:var(--radius-sm);border:1px solid var(--border-light);border-left:3px solid var(--kpmg-purple);">' +
                        '<div style="font-size:9px;font-weight:700;letter-spacing:1.5px;color:var(--kpmg-purple);margin-bottom:8px;text-transform:uppercase;">Meridian AI</div>' +
                        '<div style="font-size:12px;color:var(--text-secondary);line-height:1.7;">' + formatAIResponse(response) + '</div>' +
                        '<div style="font-size:10px;color:var(--text-muted);margin-top:10px;padding-top:10px;border-top:1px solid var(--border);">Apex Telecom \xb7 Q1 FY26 \xb7 Groq AI</div>' +
                    '</div>';
            },
            function(error) {
                resp.innerHTML =
                    '<div style="padding:12px;background:var(--bg);border-radius:var(--radius-sm);border-left:3px solid #FD349C;">' +
                        '<div style="font-size:12px;color:#FD349C;">Error: ' + error + '</div>' +
                    '</div>';
            }
        );
    });
}

function setQuery(text) {
    var input = document.getElementById('ai-query-input');
    if (input) input.value = text;
    if (!ASK_PANEL_OPEN) toggleAskPanel();
    setTimeout(handleQuery, 50);
}


/* ══════════════════════════════════════════════════════════════
   DATA FRESHNESS
   ══════════════════════════════════════════════════════════════ */

var FRESHNESS_START = Date.now();
var FRESHNESS_TIMER = null;

function startFreshnessTimer() {
    FRESHNESS_START = Date.now();
    if (FRESHNESS_TIMER) clearInterval(FRESHNESS_TIMER);
    FRESHNESS_TIMER = setInterval(function() {
        var mins = Math.floor((Date.now() - FRESHNESS_START) / 60000);
        var text = mins === 0 ? 'Live' : 'Live \xb7 ' + mins + 'm';
        document.querySelectorAll('.kpi-freshness').forEach(function(el) { el.textContent = text; });
    }, 30000);
}


/* ══════════════════════════════════════════════════════════════
   LEGACY / COMPAT
   ══════════════════════════════════════════════════════════════ */

function animateCounter(elementId, targetStr) {
    var el = document.getElementById(elementId);
    if (!el) return;
    var clean   = String(targetStr).replace(/[₹,]/g, '');
    var target  = parseFloat(clean);
    if (isNaN(target)) { el.textContent = targetStr; return; }
    var isDecimal = clean.indexOf('.') !== -1;
    var decimals  = isDecimal ? (clean.split('.')[1] || '').length : 0;
    var hasRupee  = String(targetStr).indexOf('₹') !== -1;
    var steps = 60, current = 0, step = 0;
    var timer = setInterval(function() {
        step++;
        current = step >= steps ? target : current + (target / steps);
        var display = isDecimal ? current.toFixed(decimals) : Math.round(current).toLocaleString('en-IN');
        if (hasRupee) display = '₹' + display;
        el.textContent = display;
        if (step >= steps) clearInterval(timer);
    }, 1000 / steps);
}

// Stubs so any lingering callers don't throw
function renderMorningBrief()    {}
function renderWatchPanel()      {}
function renderAlertList()       {}
function generateAutoInsight()   {}
function openWidgetEditor()      {}
