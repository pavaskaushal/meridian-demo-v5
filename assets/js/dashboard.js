/* ============================================================
   MERIDIAN V5 · DASHBOARD
   Screen 1: CFO Command Board — 3-Zone Layout
   ============================================================ */

var ACTIVE_KPI_TAB = 'finance';
var ARPU_VIEW      = 'trend';

/* ── INIT ───────────────────────────────────────────────────── */

function initDashboard() {
    renderMorningBrief();
    renderWatchPanel();
    switchKPITab('finance');
    renderCharts();
    setTimeout(function() {
        if (typeof renderCircleMap === 'function') renderCircleMap();
    }, 200);
    startFreshnessTimer();
}


/* ══════════════════════════════════════════════════════════════
   ZONE 1 — MORNING BRIEF
   5 always-visible headline KPIs at the top of the dashboard.
   ══════════════════════════════════════════════════════════════ */

function renderMorningBrief() {
    var container = document.getElementById('morning-brief');
    if (!container) return;

    var revenue = window.KPI_MASTER && window.KPI_MASTER.find(function(k) { return k.id === 'revenue'; });
    var margin  = window.KPI_MASTER && window.KPI_MASTER.find(function(k) { return k.id === 'ebitda-margin'; });
    var churn   = window.KPI_MASTER && window.KPI_MASTER.find(function(k) { return k.id === 'churn'; });

    var alerts    = window.RAFM_ALERTS || [];
    var critCount = alerts.filter(function(a) { return (a.severity || '').toUpperCase() === 'CRITICAL'; }).length;
    var alertColor = critCount > 0 ? '#FD349C' : '#00C0AE';
    var alertLabel = critCount + ' Critical · ' + alerts.length + ' Total';

    var now     = Date.now();
    var filings = (window.REGULATORY_FILINGS || [])
        .filter(function(f) { return f.status !== 'SUBMITTED'; })
        .sort(function(a, b) { return new Date(a.due) - new Date(b.due); });
    var nextFiling = filings[0];
    var daysToReg  = nextFiling ? Math.ceil((new Date(nextFiling.due) - now) / 86400000) : null;
    var regColor   = daysToReg === null ? '#8A9BB0' : daysToReg <= 7 ? '#FD349C' : daysToReg <= 30 ? '#F59E0B' : '#00C0AE';
    var regTitle   = nextFiling ? nextFiling.title.split('—')[0].split('–')[0].trim() : 'On Track';
    var regSub     = daysToReg !== null ? daysToReg + ' days' : 'All filed';

    var cards = [
        {
            label: 'Total Revenue',
            value: revenue ? revenue.value.toLocaleString('en-IN') : '3,510',
            unit:  revenue ? revenue.unit : '₹ Cr',
            delta: revenue ? revenue.delta + ' YoY' : '+8.4% YoY',
            pct:   revenue ? revenue.pctToTarget : 97.5,
            color: '#1E49E2',
            spark: revenue ? revenue.trend5Q : null
        },
        {
            label: 'EBITDA Margin',
            value: margin ? margin.value : '34.9',
            unit:  margin ? margin.unit : '%',
            delta: margin ? margin.delta + ' YoY' : '+1.6pp YoY',
            pct:   margin ? margin.pctToTarget : 96.9,
            color: '#00C0AE',
            spark: margin ? margin.trend5Q : null
        },
        {
            label: 'Monthly Churn',
            value: churn ? churn.value : '1.42',
            unit:  churn ? churn.unit : '%',
            delta: churn ? churn.delta + ' YoY' : '-0.18pp YoY',
            pct:   churn ? churn.pctToTarget : 88,
            color: (churn && parseFloat(churn.value) < 2) ? '#00C0AE' : '#F59E0B',
            spark: churn ? churn.trend5Q : null
        },
        {
            label: 'RAFM Alerts',
            value: alerts.length,
            unit:  'active',
            delta: alertLabel,
            pct:   null,
            color: alertColor,
            pulse: true,
            spark: null
        },
        {
            label: 'Next Compliance',
            value: regTitle.length > 18 ? regTitle.substring(0, 16) + '…' : regTitle,
            unit:  '',
            delta: regSub,
            pct:   null,
            color: regColor,
            spark: null
        }
    ];

    container.innerHTML = cards.map(function(c) {
        var progressBar = c.pct !== null
            ? '<div style="height:3px;background:var(--border);border-radius:2px;margin-top:8px;">' +
              '<div style="height:3px;background:' + c.color + ';border-radius:2px;width:' + Math.min(c.pct, 100) + '%;transition:width 0.8s ease;"></div>' +
              '</div>'
            : '';

        var pulseEl = c.pulse
            ? '<span style="display:inline-block;width:5px;height:5px;border-radius:50%;background:' + c.color + ';animation:livePulse 1.5s ease-in-out infinite alternate;vertical-align:middle;margin-left:4px;"></span>'
            : '';

        var sparkSvg = c.spark ? buildSparkline(c.spark, c.color) : '';

        return '<div class="brief-card" style="border-top:3px solid ' + c.color + ';">' +
            '<div class="brief-card-label">' + c.label + '</div>' +
            '<div style="display:flex;align-items:flex-end;justify-content:space-between;">' +
                '<div>' +
                    '<div class="brief-card-value" style="color:' + c.color + ';">' +
                        c.value +
                        (c.unit ? '<span style="font-size:11px;color:var(--text-secondary);font-family:var(--font-sans);font-weight:400;margin-left:3px;">' + c.unit + '</span>' : '') +
                    '</div>' +
                    '<div style="font-size:10px;color:var(--text-muted);margin-top:3px;">' + c.delta + pulseEl + '</div>' +
                '</div>' +
                (sparkSvg ? '<div style="opacity:0.85;flex-shrink:0;">' + sparkSvg + '</div>' : '') +
            '</div>' +
            progressBar +
        '</div>';
    }).join('');
}


/* ══════════════════════════════════════════════════════════════
   ZONE 2R — WATCH PANEL
   Populates alerts, AI insight, and readies the Ask input.
   ══════════════════════════════════════════════════════════════ */

function renderWatchPanel() {
    var alertsEl  = document.getElementById('watch-alerts');
    var badgeEl   = document.getElementById('watch-alert-badge');
    var alerts    = window.RAFM_ALERTS || [];
    var critCount = alerts.filter(function(a) { return (a.severity || '').toUpperCase() === 'CRITICAL'; }).length;

    if (badgeEl) badgeEl.textContent = critCount + ' CRITICAL';

    if (alertsEl) {
        alertsEl.innerHTML = alerts.slice(0, 3).map(function(alert) {
            var color = getSeverityColor(alert.severity);
            var sev   = (alert.severity || '').toLowerCase();
            return '<div class="watch-alert-item" onclick="openModal(\'' + alert.id + '\')">' +
                '<div style="width:3px;min-height:36px;background:' + color + ';border-radius:2px;flex-shrink:0;align-self:stretch;"></div>' +
                '<div style="flex:1;min-width:0;">' +
                    '<div style="font-size:11px;font-weight:600;color:var(--text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + alert.title + '</div>' +
                    '<div style="display:flex;align-items:center;gap:6px;margin-top:3px;">' +
                        '<span class="badge badge-' + sev + '" style="font-size:9px;">' + sev.toUpperCase() + '</span>' +
                        '<span style="font-size:10px;color:var(--text-muted);font-family:var(--font-mono);">' + alert.amount + '</span>' +
                    '</div>' +
                '</div>' +
                '<div style="font-size:14px;color:' + color + ';flex-shrink:0;padding-left:4px;">›</div>' +
            '</div>';
        }).join('');
    }

    var riskEl = document.getElementById('watch-insight-risk');
    var oppEl  = document.getElementById('watch-insight-arpu');

    if (riskEl) {
        var topAlert = alerts[0];
        riskEl.innerHTML = topAlert
            ? '<strong>' + topAlert.title + '</strong> — ' + topAlert.amount + ' exposure. ' + topAlert.description.substring(0, 110) + '...'
            : 'Six active RAFM alerts represent <strong>₹9.32 Cr</strong> combined exposure. Priority: ₹4.8 Cr interconnect discrepancy with Jio.';
    }

    if (oppEl) {
        var arpu = window.KPI_MASTER && window.KPI_MASTER.find(function(k) { return k.id === 'arpu'; });
        oppEl.innerHTML = arpu
            ? 'ARPU at <strong>' + arpu.value + ' ' + arpu.unit + '</strong>, ' + arpu.delta + ' YoY. 5G subscribers at 2.4\xd7 blended ARPU — accelerating 5G migration is the highest-value lever.'
            : 'ARPU growing steadily. 5G ARPU of ₹312 (2.4\xd7 blended) makes 5G migration the primary growth lever for FY26.';
    }
}


/* ══════════════════════════════════════════════════════════════
   SPARKLINES — tiny inline SVG trend chart for KPI cards
   ══════════════════════════════════════════════════════════════ */

function buildSparkline(data, color) {
    if (!data || data.length < 2) return '';
    var min = Math.min.apply(null, data);
    var max = Math.max.apply(null, data);
    var range = max - min || 1;
    var W = 60, H = 28, P = 3;

    var pts = data.map(function(v, i) {
        var x = P + (i / (data.length - 1)) * (W - P * 2);
        var y = H - P - ((v - min) / range) * (H - P * 2);
        return x.toFixed(1) + ',' + y.toFixed(1);
    });

    var lastPt = pts[pts.length - 1].split(',');
    var area   = P.toFixed(1) + ',' + H + ' ' + pts.join(' ') + ' ' + (W - P).toFixed(1) + ',' + H;

    return '<svg width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '" style="display:block;overflow:visible;">' +
        '<polygon points="' + area + '" fill="' + color + '" opacity="0.12"/>' +
        '<polyline points="' + pts.join(' ') + '" fill="none" stroke="' + color + '" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<circle cx="' + lastPt[0] + '" cy="' + lastPt[1] + '" r="2.5" fill="' + color + '"/>' +
    '</svg>';
}


/* ══════════════════════════════════════════════════════════════
   ZONE 2L — KPI EXPLORER — tab switching + card rendering
   ══════════════════════════════════════════════════════════════ */

function switchKPITab(tab) {
    ACTIVE_KPI_TAB = tab;

    document.querySelectorAll('.kpi-tab').forEach(function(btn) {
        btn.classList.toggle('active', btn.getAttribute('data-tab') === tab);
    });

    var subtitles = {
        finance:     'Finance & Treasury \xb7 SAP ERP \xb7 Oracle Financials',
        commercial:  'Commercial & Revenue \xb7 Siebel CRM \xb7 BSS',
        network:     'Network & Technology \xb7 Huawei OSS \xb7 Nokia NetAct',
        rafm:        'Revenue Assurance & Fraud \xb7 Subex RAID',
        hr:          'HR & Workforce \xb7 Workday HCM',
        procurement: 'Procurement & Vendor \xb7 SAP Ariba',
        regulatory:  'Regulatory & Compliance \xb7 Internal GRC',
        cx:          'Customer Experience \xb7 Genesys CX',
        favourites:  'Your pinned KPIs \xb7 Saved to this device'
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
    if (tab === 'favourites') {
        var favIds = getFavourites();
        kpis = window.KPI_MASTER.filter(function(k) { return favIds.indexOf(k.id) > -1; });
        if (kpis.length === 0) {
            grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:48px;color:var(--text-muted);">' +
                '<div style="font-size:32px;margin-bottom:12px;">★</div>' +
                '<div style="font-size:14px;font-weight:600;color:var(--text-secondary);margin-bottom:8px;">No favourites yet</div>' +
                '<div style="font-size:12px;">Click the ★ on any KPI card to pin it here</div>' +
            '</div>';
            return;
        }
    } else {
        kpis = window.KPI_MASTER.filter(function(k) { return k.businessLine === tab; });
    }

    var favIds = getFavourites();

    grid.innerHTML = kpis.map(function(kpi) {
        var isUp   = kpi.trend === 'up';
        var isDown = kpi.trend === 'down';
        var deltaClass = isUp ? 'kpi-delta positive' : isDown ? 'kpi-delta negative' : 'kpi-delta neutral';
        var isFav  = favIds.indexOf(kpi.id) > -1;
        var pct    = kpi.pctToTarget;
        var color  = pct >= 95 ? '#00C0AE' : pct >= 75 ? '#00B8F5' : pct >= 50 ? '#F59E0B' : pct >= 30 ? '#F97316' : '#FD349C';
        var spark  = kpi.trend5Q ? buildSparkline(kpi.trend5Q, color) : '';

        return '<div class="kpi-card" style="cursor:pointer;position:relative;" onclick="openKPIDetail(\'' + kpi.id + '\')">' +
            '<div class="kpi-card-accent" style="background:' + color + '"></div>' +

            '<div style="position:absolute;top:8px;right:26px;font-size:13px;cursor:pointer;color:' + (isFav ? '#F59E0B' : 'var(--text-muted)') + ';opacity:' + (isFav ? '1' : '0.35') + ';" ' +
                'onclick="event.stopPropagation();toggleFavourite(\'' + kpi.id + '\')" title="Pin to Favourites">★</div>' +
            '<div style="position:absolute;top:8px;right:8px;opacity:0.25;font-size:10px;color:var(--text-muted);">↗</div>' +

            '<div style="font-size:9px;font-weight:700;letter-spacing:1px;color:' + color + ';opacity:0.8;margin-bottom:3px;text-transform:uppercase;">' + (kpi.system || '') + '</div>' +

            '<div class="kpi-label">' + kpi.label + '</div>' +

            '<div style="display:flex;align-items:flex-end;justify-content:space-between;margin:4px 0 2px;">' +
                '<div>' +
                    '<div class="kpi-value">' +
                        '<span id="kpi-val-' + kpi.id + '">' + kpi.value + '</span>' +
                        '<span style="font-size:13px;color:var(--text-secondary);font-weight:400;margin-left:2px;">' + kpi.unit + '</span>' +
                    '</div>' +
                    '<div class="' + deltaClass + '">' + kpi.delta + ' <span class="kpi-delta-label">YoY</span></div>' +
                '</div>' +
                (spark ? '<div style="flex-shrink:0;opacity:0.9;">' + spark + '</div>' : '') +
            '</div>' +

            '<div style="margin-top:6px;">' +
                '<div style="display:flex;justify-content:space-between;margin-bottom:2px;">' +
                    '<span style="font-size:9px;color:var(--text-muted);">To Target</span>' +
                    '<span style="font-size:9px;font-weight:700;color:' + color + ';">' + pct + '%</span>' +
                '</div>' +
                '<div style="height:3px;background:var(--border);border-radius:2px;">' +
                    '<div style="height:3px;background:' + color + ';border-radius:2px;width:' + Math.min(pct, 100) + '%;transition:width 0.6s ease;"></div>' +
                '</div>' +
            '</div>' +

            '<div style="margin-top:6px;display:flex;justify-content:space-between;align-items:center;">' +
                '<span style="font-size:9px;color:var(--text-muted);">vs ' + (kpi.benchmarkLabel || 'Benchmark') + '</span>' +
                '<span style="font-size:9px;font-weight:700;color:var(--text-muted);">' + kpi.benchmark + (kpi.unit ? ' ' + kpi.unit : '') + '</span>' +
            '</div>' +

            '<div style="position:absolute;bottom:8px;right:8px;display:flex;align-items:center;gap:4px;">' +
                '<div style="width:4px;height:4px;border-radius:50%;background:#00C0AE;animation:livePulse 1.5s ease-in-out infinite alternate;"></div>' +
                '<span class="kpi-freshness" style="font-size:9px;color:var(--text-muted);">Live</span>' +
            '</div>' +

        '</div>';
    }).join('');
}


/* ══════════════════════════════════════════════════════════════
   ZONE 3 — ARPU CHART TOGGLE
   ══════════════════════════════════════════════════════════════ */

function toggleARPUView(view) {
    ARPU_VIEW = view;
    var trendCanvas = document.getElementById('arpu-chart');
    var compCanvas  = document.getElementById('competitor-chart');
    var trendBtn    = document.getElementById('arpu-view-trend');
    var compBtn     = document.getElementById('arpu-view-comp');
    var subtitle    = document.getElementById('arpu-chart-subtitle');
    if (!trendCanvas || !compCanvas) return;

    if (view === 'trend') {
        trendCanvas.style.display = 'block';
        compCanvas.style.display  = 'none';
        if (trendBtn) { trendBtn.style.background = 'var(--kpmg-cyan)'; trendBtn.style.color = '#0A0F1E'; trendBtn.style.fontWeight = '700'; }
        if (compBtn)  { compBtn.style.background  = 'transparent'; compBtn.style.color = 'var(--text-muted)'; compBtn.style.fontWeight = '400'; }
        if (subtitle) subtitle.textContent = 'Historical Jul\'24–Jun\'25 \xb7 AI Forecast Jul–Sep\'25';
    } else {
        trendCanvas.style.display = 'none';
        compCanvas.style.display  = 'block';
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
   DATA FRESHNESS INDICATOR
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
   AI — ASK MERIDIAN
   ══════════════════════════════════════════════════════════════ */

function handleQuery() {
    var input = document.getElementById('ai-query-input');
    var resp  = document.getElementById('ai-response');
    var query = input ? input.value.trim() : '';
    if (!query || !resp) return;

    showApiKeyPrompt(function() {
        resp.style.display = 'block';
        resp.innerHTML =
            '<div style="padding:12px;background:var(--bg);border-radius:var(--radius-sm);border:1px solid var(--border-light);display:flex;align-items:center;gap:10px;">' +
                '<div class="loading-spinner" style="width:16px;height:16px;border-width:2px;flex-shrink:0;"></div>' +
                '<span style="color:var(--text-muted);font-size:12px;">Meridian AI is analysing…</span>' +
            '</div>';

        callGroq(query, null,
            function(response) {
                resp.innerHTML =
                    '<div style="padding:12px;background:var(--bg);border-radius:var(--radius-sm);border:1px solid var(--border-light);border-left:3px solid var(--kpmg-cyan);">' +
                        '<div style="font-size:9px;font-weight:700;letter-spacing:1.5px;color:var(--kpmg-cyan);margin-bottom:8px;text-transform:uppercase;">Meridian AI Response</div>' +
                        '<div style="font-size:12px;color:var(--text-secondary);line-height:1.7;">' + formatAIResponse(response) + '</div>' +
                        '<div style="font-size:10px;color:var(--text-muted);margin-top:10px;padding-top:10px;border-top:1px solid var(--border);">Apex Telecom \xb7 Q1 FY26 \xb7 Powered by Groq AI</div>' +
                    '</div>';
            },
            function(error) {
                resp.innerHTML =
                    '<div style="padding:12px;background:var(--bg);border-radius:var(--radius-sm);border:1px solid rgba(253,52,156,0.3);border-left:3px solid #FD349C;">' +
                        '<div style="font-size:12px;color:#FD349C;">Error: ' + error + '</div>' +
                        '<div style="font-size:11px;color:var(--text-muted);margin-top:6px;">Check your API key or try again.</div>' +
                    '</div>';
            }
        );
    });
}

function setQuery(text) {
    var input = document.getElementById('ai-query-input');
    if (input) input.value = text;
    handleQuery();
}


/* ══════════════════════════════════════════════════════════════
   KPI DETAIL MODAL
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
                '<button onclick="toggleFavourite(\'' + id + '\');openKPIDetail(\'' + id + '\')" style="background:transparent;border:1px solid var(--border);border-radius:6px;padding:4px 10px;cursor:pointer;font-size:14px;color:' + (isFav ? '#F59E0B' : 'var(--text-muted)') + ';">★</button>' +
                '<button onclick="closeModal()" style="background:transparent;border:1px solid var(--border);border-radius:6px;padding:4px 10px;cursor:pointer;font-size:16px;color:var(--text-muted);">✕</button>' +
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
            insightCard('💡 INSIGHT', kpi.insight, '#00B8F5') +
            insightCard('⚠ RISK', kpi.risk, '#FD349C') +
            insightCard('🎯 OPPORTUNITY', kpi.opportunity, '#00C0AE') +
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
   WIDGET EDITOR MODAL
   ══════════════════════════════════════════════════════════════ */

var ACTIVE_KPIS = window.KPI_LIBRARY
    ? window.KPI_LIBRARY.filter(function(k) { return k.default; }).map(function(k) { return k.id; })
    : ['arpu', 'churn', 'ebitda', 'spectrum', 'fcf', 'subscribers'];

function openWidgetEditor() {
    var modal = document.getElementById('modal-box');
    modal.innerHTML =
        '<div class="modal-header">' +
            '<div>' +
                '<div style="font-size:10px;font-weight:700;letter-spacing:1.5px;color:var(--kpmg-cyan);margin-bottom:6px;text-transform:uppercase;">Dashboard Customisation</div>' +
                '<div class="modal-title">Manage KPI Widgets</div>' +
            '</div>' +
            '<div class="modal-close" onclick="closeModal()">✕</div>' +
        '</div>' +
        '<div style="font-size:12px;color:var(--text-muted);margin-bottom:20px;">Select which KPIs to display. Choose up to 12.</div>' +
        '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:20px;">' +
            window.KPI_LIBRARY.map(function(kpi) {
                var isActive = ACTIVE_KPIS.indexOf(kpi.id) !== -1;
                return '<div onclick="toggleWidget(\'' + kpi.id + '\')" id="widget-toggle-' + kpi.id + '" ' +
                    'style="background:' + (isActive ? 'rgba(0,192,174,0.1)' : 'var(--bg)') + ';' +
                    'border:1px solid ' + (isActive ? '#00C0AE' : 'var(--border)') + ';' +
                    'border-radius:8px;padding:12px;cursor:pointer;transition:all 0.15s;">' +
                    '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px;">' +
                        '<div style="width:8px;height:8px;border-radius:50%;background:' + kpi.accentColor + ';margin-top:3px;"></div>' +
                        '<div style="width:16px;height:16px;border-radius:50%;background:' + (isActive ? '#00C0AE' : 'var(--border)') + ';display:flex;align-items:center;justify-content:center;" id="widget-check-' + kpi.id + '">' +
                            (isActive ? '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>' : '') +
                        '</div>' +
                    '</div>' +
                    '<div style="font-size:11px;font-weight:600;color:var(--text-primary);">' + kpi.label + '</div>' +
                    '<div style="font-family:var(--font-mono);font-size:14px;font-weight:700;color:' + kpi.accentColor + ';margin-top:2px;">' + kpi.value + kpi.unit + '</div>' +
                '</div>';
            }).join('') +
        '</div>' +
        '<div style="display:flex;gap:12px;align-items:center;">' +
            '<button class="btn btn-primary" onclick="applyWidgets()">Apply Changes</button>' +
            '<button class="btn btn-secondary" onclick="closeModal()">Cancel</button>' +
            '<span style="font-size:11px;color:var(--text-muted);margin-left:auto;" id="widget-count">' + ACTIVE_KPIS.length + ' of 18 selected</span>' +
        '</div>';

    document.getElementById('modal-overlay').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function toggleWidget(kpiId) {
    var idx = ACTIVE_KPIS.indexOf(kpiId);
    if (idx === -1) {
        if (ACTIVE_KPIS.length >= 12) { alert('Maximum 12 KPIs allowed. Remove one first.'); return; }
        ACTIVE_KPIS.push(kpiId);
    } else {
        if (ACTIVE_KPIS.length <= 1) { alert('At least 1 KPI must be selected.'); return; }
        ACTIVE_KPIS.splice(idx, 1);
    }
    var isNow  = ACTIVE_KPIS.indexOf(kpiId) !== -1;
    var card   = document.getElementById('widget-toggle-' + kpiId);
    var check  = document.getElementById('widget-check-' + kpiId);
    card.style.background = isNow ? 'rgba(0,192,174,0.1)' : 'var(--bg)';
    card.style.border     = '1px solid ' + (isNow ? '#00C0AE' : 'var(--border)');
    check.style.background = isNow ? '#00C0AE' : 'var(--border)';
    check.innerHTML = isNow ? '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>' : '';
    document.getElementById('widget-count').textContent = ACTIVE_KPIS.length + ' of 18 selected';
}

function applyWidgets() {
    closeModal();
    switchKPITab(ACTIVE_KPI_TAB);
}


/* ══════════════════════════════════════════════════════════════
   LEGACY COMPAT — keep old callers from throwing
   ══════════════════════════════════════════════════════════════ */

function renderAlertList()    { /* superseded by renderWatchPanel */ }
function generateAutoInsight(){ /* superseded by renderWatchPanel */ }

function animateCounter(elementId, targetStr) {
    var el = document.getElementById(elementId);
    if (!el) return;
    var clean  = String(targetStr).replace(/[₹,]/g, '');
    var target = parseFloat(clean);
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
