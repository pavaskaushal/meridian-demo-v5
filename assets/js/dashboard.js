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

function initDashboard() {
    renderAIBrief();
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

function renderAIBrief() {
    var el = document.getElementById('ai-brief-text');
    if (!el) return;

    // Build a static data-driven brief from KPI_MASTER
    var revenue  = findKPI('revenue');
    var margin   = findKPI('ebitda-margin');
    var arpu     = findKPI('arpu');
    var churn    = findKPI('churn');
    var fcf      = findKPI('fcf');
    var alerts   = window.RAFM_ALERTS || [];
    var critCount = alerts.filter(function(a) { return (a.severity||'').toUpperCase() === 'CRITICAL'; }).length;

    var revTxt  = revenue ? 'Revenue at <strong>₹' + revenue.value.toLocaleString('en-IN') + ' Cr</strong> — ' +
        (parseFloat(revenue.delta) >= 0 ? '<span class="brief-pos">' : '<span class="brief-neg">') +
        revenue.delta + ' YoY</span>, tracking at ' + revenue.pctToTarget + '% of quarterly target.' : '';

    var mrgTxt  = margin ? ' EBITDA margin <strong>' + margin.value + '%</strong> ' +
        (parseFloat(margin.deltaQoQ) >= 0 ? '<span class="brief-pos">+' + margin.deltaQoQ + ' QoQ</span>' : '<span class="brief-neg">' + margin.deltaQoQ + ' QoQ</span>') +
        ' — 130bps below Airtel benchmark.' : '';

    var fcfTxt  = fcf ? ' Free cash flow at record <strong>₹' + fcf.value + ' Cr</strong> with capex discipline sustaining conversion.' : '';

    var riskTxt = critCount > 0
        ? ' <span class="brief-risk">⚠ ' + critCount + ' critical RAFM alert' + (critCount > 1 ? 's' : '') + ' require immediate attention — ' + (alerts[0] ? alerts[0].amount + ' exposure' : '') + '.</span>'
        : ' RAFM risk posture stable — ' + alerts.length + ' active alerts, none critical.';

    el.innerHTML = revTxt + mrgTxt + fcfTxt + riskTxt;
    updateBriefTimestamp();
}

function generateAIBrief() {
    var el  = document.getElementById('ai-brief-text');
    var btn = document.getElementById('ai-brief-btn');
    if (!el) return;

    // Build context from data
    var kpiSummary = (window.KPI_MASTER || []).slice(0, 12).map(function(k) {
        return k.label + ': ' + k.value + ' ' + k.unit + ' (' + k.delta + ' YoY, ' + k.pctToTarget + '% to target)';
    }).join('; ');

    var alertSummary = (window.RAFM_ALERTS || []).slice(0, 3).map(function(a) {
        return a.severity + ': ' + a.title + ' — ' + a.amount;
    }).join('; ');

    var prompt = 'You are a CFO intelligence assistant for Apex Telecom, an Indian telco with 22 circles and 312M subscribers. ' +
        'Write a concise 2-sentence executive brief (max 60 words) covering: financial performance, key risk, and one opportunity. ' +
        'Use specific numbers. Tone: direct, board-room ready. KPIs: ' + kpiSummary + '. Alerts: ' + alertSummary;

    if (btn) { btn.disabled = true; btn.textContent = 'Generating…'; }
    el.innerHTML = '<span style="color:var(--text-muted);font-style:italic;">Analysing with Meridian AI…</span>';

    showApiKeyPrompt(function() {
        callGroq(prompt, null,
            function(response) {
                el.innerHTML = '<span style="color:var(--text-secondary);line-height:1.8;">' + response + '</span>';
                updateBriefTimestamp();
                if (btn) { btn.disabled = false; btn.innerHTML = '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg> Regenerate'; }
            },
            function(err) {
                renderAIBrief(); // fall back to static
                if (btn) { btn.disabled = false; btn.innerHTML = 'Regenerate'; }
            }
        );
    });
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
    var filled      = Math.round(pct / 10); // blocks out of 10

    var barBlocks = '';
    for (var i = 0; i < 10; i++) {
        barBlocks += '<div class="qtd-block' + (i < filled ? ' filled' : '') + '"></div>';
    }

    el.innerHTML =
        '<span style="font-size:10px;font-weight:700;color:var(--text-secondary);letter-spacing:0.5px;">' + fyLabel + '</span>' +
        '<div class="qtd-bar">' + barBlocks + '</div>' +
        '<span style="font-size:10px;font-weight:700;color:var(--kpmg-cyan);">' + pct + '%</span>' +
        '<span style="font-size:10px;color:var(--text-muted);">Day ' + elapsed + ' of ' + totalDays + '</span>';
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
    if (fab)   fab.classList.toggle('active', ASK_PANEL_OPEN);
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
