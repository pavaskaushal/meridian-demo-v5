/* ============================================================
   MERIDIAN V2 · DASHBOARD
   Screen 1: CFO Command Board
   ============================================================ */

var ACTIVE_KPI_TAB = 'finance';

function initDashboard() {
    switchKPITab('finance');
    renderAlertList();
    renderCharts();
    generateAutoInsight();
    setTimeout(function() {
        if (typeof renderCircleMap === 'function') renderCircleMap();
    }, 200);
    startFreshnessTimer();
}

function switchKPITab(tab) {
    ACTIVE_KPI_TAB = tab;

    // Update tab buttons
    document.querySelectorAll('.kpi-tab').forEach(function(btn) {
        btn.classList.toggle('active', btn.getAttribute('data-tab') === tab);
    });

    // Update subtitle
    var subtitles = {
        finance:     'Finance & Treasury · SAP ERP · Oracle Financials',
        commercial:  'Commercial & Revenue · Siebel CRM · BSS',
        network:     'Network & Technology · Huawei OSS · Nokia NetAct',
        rafm:        'Revenue Assurance & Fraud · Subex RAID',
        hr:          'HR & Workforce · Workday HCM',
        procurement: 'Procurement & Vendor · SAP Ariba',
        regulatory:  'Regulatory & Compliance · Internal GRC',
        cx:          'Customer Experience · Genesys CX',
        favourites:  'Your pinned KPIs · Saved to this device'
    };
    var subEl = document.getElementById('kpi-tab-subtitle');
    if (subEl) subEl.textContent = subtitles[tab] || '';

    // Save to localStorage
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
        var isUp      = kpi.trend === 'up';
        var isDown    = kpi.trend === 'down';
        var deltaClass = isUp ? 'kpi-delta positive' : isDown ? 'kpi-delta negative' : 'kpi-delta neutral';
        var isFav     = favIds.indexOf(kpi.id) > -1;
        var pct       = kpi.pctToTarget;
        var lineColor = pct >= 95 ? '#00C0AE' : pct >= 75 ? '#00B8F5' : pct >= 50 ? '#F59E0B' : pct >= 30 ? '#F97316' : '#FD349C';
        var sys       = window.SOURCE_SYSTEMS[kpi.system] || {};

        return '<div class="kpi-card" style="cursor:pointer;position:relative;" onclick="openKPIDetail(\'' + kpi.id + '\')">' +
            '<div class="kpi-card-accent" style="background:' + lineColor + '"></div>' +

            // Favourite star
            '<div style="position:absolute;top:8px;right:28px;font-size:14px;cursor:pointer;color:' + (isFav ? '#F59E0B' : 'var(--text-muted)') + ';opacity:' + (isFav ? '1' : '0.4') + ';" ' +
                'onclick="event.stopPropagation();toggleFavourite(\'' + kpi.id + '\')" title="Pin to Favourites">★</div>' +

            // Expand icon
            '<div style="position:absolute;top:8px;right:8px;opacity:0.3;font-size:10px;color:var(--text-muted);">↗</div>' +

            // System tag
            '<div style="font-size:9px;font-weight:700;letter-spacing:1px;color:' + lineColor + ';opacity:0.8;margin-bottom:4px;text-transform:uppercase;">' + (kpi.system || '') + '</div>' +

            '<div class="kpi-label">' + kpi.label + '</div>' +

            '<div class="kpi-value">' +
                '<span id="kpi-val-' + kpi.id + '">' + kpi.value + '</span>' +
                '<span style="font-size:14px;color:var(--text-secondary);font-weight:400;margin-left:2px;">' + kpi.unit + '</span>' +
            '</div>' +

            '<div class="' + deltaClass + '">' + kpi.delta + ' <span class="kpi-delta-label">YoY</span></div>' +

            // Target progress
            '<div style="margin-top:8px;">' +
                '<div style="display:flex;justify-content:space-between;margin-bottom:3px;">' +
                    '<span style="font-size:9px;color:var(--text-muted);">To Target</span>' +
                    '<span style="font-size:9px;font-weight:700;color:' + lineColor + ';">' + kpi.pctToTarget + '%</span>' +
                '</div>' +
                '<div style="height:3px;background:var(--border);border-radius:2px;">' +
                    '<div style="height:3px;background:' + lineColor + ';border-radius:2px;width:' + Math.min(kpi.pctToTarget, 100) + '%;transition:width 0.6s ease;"></div>' +
                '</div>' +
            '</div>' +

            // Benchmark
            '<div style="margin-top:8px;display:flex;justify-content:space-between;align-items:center;">' +
                '<span style="font-size:9px;color:var(--text-muted);">vs ' + (kpi.benchmarkLabel || 'Benchmark') + '</span>' +
                '<span style="font-size:9px;font-weight:700;color:var(--text-muted);">' + kpi.benchmark + (kpi.unit ? ' ' + kpi.unit : '') + '</span>' +
            '</div>' +

            // Freshness
            '<div style="position:absolute;bottom:8px;right:10px;display:flex;align-items:center;gap:5px;">' +
                '<div style="width:5px;height:5px;border-radius:50%;background:#00C0AE;animation:livePulse 1.5s ease-in-out infinite alternate;"></div>' +
                '<span class="kpi-freshness" style="font-size:9px;color:var(--text-muted);">Live</span>' +
            '</div>' +

        '</div>';
    }).join('');
}

/* ── FAVOURITES ─────────────────────────────────────────── */
function getFavourites() {
    try { return JSON.parse(localStorage.getItem('meridian-favourites') || '[]'); } catch(e) { return []; }
}

function toggleFavourite(id) {
    var favs = getFavourites();
    var idx  = favs.indexOf(id);
    if (idx > -1) favs.splice(idx, 1);
    else favs.push(id);
    try { localStorage.setItem('meridian-favourites', JSON.stringify(favs)); } catch(e) {}
    renderKPITab(ACTIVE_KPI_TAB);
}

function generateAutoInsight() {
    var riskEl = document.getElementById('auto-insight-risk');
    var arpuEl = document.getElementById('auto-insight-arpu');
    if (!riskEl || !arpuEl) return;

    // Find top risk from RAFM alerts
    var topAlert = window.RAFM_ALERTS ? window.RAFM_ALERTS[0] : null;
    var riskText = topAlert
        ? '<strong>' + topAlert.title + '</strong> — ' + topAlert.amount + ' exposure. ' + topAlert.description.substring(0, 120) + '...'
        : 'Six active RAFM alerts represent <strong>₹9.32 Cr</strong> in combined revenue exposure. Priority: ₹4.8 Cr interconnect discrepancy with Jio.';

    // Build ARPU opportunity insight from KPI data
    var arpu = window.KPI_DATA ? window.KPI_DATA.find(function(k) { return k.id === 'arpu'; }) : null;
    var arpuText = arpu
        ? 'ARPU at <strong>' + arpu.value + arpu.unit + '</strong> growing ' + arpu.delta + ' YoY. 5G subscribers generating 2.4× blended ARPU (₹312). Accelerating 5G migration is the highest-value revenue lever available.'
        : 'ARPU grown <strong>₹11/month over 12 months</strong> — 6.5% improvement. 5G ARPU of ₹312 (2.4× blended) makes 5G migration the primary growth lever.';

    riskEl.innerHTML = riskText;
    arpuEl.innerHTML = arpuText;
}

function renderKPICards() {
    var grid = document.getElementById('kpi-grid');
    if (!grid) return;

    grid.innerHTML = KPI_DATA.map(function(kpi) {
        var deltaClass = getDeltaClass(kpi.delta, kpi.id === 'churn');
        return '<div class="kpi-card" onclick="openKPIModal(\'' + kpi.id + '\')" style="cursor:pointer;" title="Click to expand">' +
            '<div class="kpi-card-accent" style="background:' + lineColor + '"></div>' +
            '<div class="kpi-label">' + kpi.label + '</div>' +
            '<div class="kpi-value">' +
                '<span id="kpi-val-' + kpi.id + '">0</span>' +
                '<span style="font-size:14px;color:var(--text-secondary);font-weight:400;">' + kpi.unit + '</span>' +
            '</div>' +
            '<div class="kpi-delta ' + deltaClass + '">' + kpi.delta +
                ' <span class="kpi-delta-label">' + kpi.deltaLabel + '</span>' +
            '</div>' +
            '<div style="position:absolute;bottom:8px;right:10px;display:flex;align-items:center;gap:5px;">' +
                '<div style="width:5px;height:5px;border-radius:50%;background:#00C0AE;animation:livePulse 1.5s ease-in-out infinite alternate;"></div>' +
                '<span class="kpi-freshness" style="font-size:9px;color:var(--text-muted);">Live · just now</span>' +
            '</div>' +
            '<div style="position:absolute;top:8px;right:8px;opacity:0.3;font-size:10px;color:var(--text-muted);">↗</div>' +
        '</div>';
    }).join('');

    // Animate counters after cards render
    setTimeout(function() {
        KPI_DATA.forEach(function(kpi) {
            animateCounter('kpi-val-' + kpi.id, kpi.value);
        });
    }, 100);
}

/*
   animateCounter
   ──────────────
   Counts up from 0 to target value over 1 second.
   Handles values like "181", "1,183", "34.6", "2,340"
   Strips currency symbols and commas before parsing.
*/
function animateCounter(elementId, targetStr) {
    var el = document.getElementById(elementId);
    if (!el) return;

    // Extract numeric value — strip ₹ and commas
    var clean  = String(targetStr).replace(/[₹,]/g, '');
    var target = parseFloat(clean);
    if (isNaN(target)) { el.textContent = targetStr; return; }

    var isDecimal  = clean.indexOf('.') !== -1;
    var decimals   = isDecimal ? (clean.split('.')[1] || '').length : 0;
    var hasComma   = String(targetStr).replace(/[₹]/g, '').indexOf(',') !== -1;
    var hasRupee   = String(targetStr).indexOf('₹') !== -1;
    var duration   = 1000; // ms
    var steps      = 60;
    var increment  = target / steps;
    var current    = 0;
    var step       = 0;

    var timer = setInterval(function() {
        step++;
        current = step >= steps ? target : current + increment;

        var display = isDecimal
            ? current.toFixed(decimals)
            : Math.round(current).toLocaleString('en-IN');

        if (hasRupee) display = '₹' + display;
        el.textContent = display;

        if (step >= steps) clearInterval(timer);
    }, duration / steps);
}

function renderAlertList() {
    var list = document.getElementById('alert-list');
    if (!list) return;

    list.innerHTML = RAFM_ALERTS.slice(0, 3).map(function(alert) {
        var color = getSeverityColor(alert.severity);
        return '<div class="alert-item" onclick="openModal(\'' + alert.id + '\')">' +
            '<div class="alert-severity-bar" style="background:' + color + '"></div>' +
            '<div class="alert-content">' +
                '<div class="alert-title">' + alert.title + '</div>' +
                '<div class="alert-description">' + alert.description.substring(0, 80) + '...</div>' +
                '<div class="alert-meta">' +
                    '<span class="badge badge-' + alert.severity + '">' + alert.severity.toUpperCase() + '</span>' +
                    '<span>' + alert.type + '</span>' +
                '</div>' +
            '</div>' +
            '<div class="alert-amount" style="color:' + color + '">' + alert.amount + '</div>' +
            '<div class="alert-arrow">›</div>' +
        '</div>';
    }).join('');
}

function handleQuery() {
    var input = document.getElementById('ai-query-input');
    var resp  = document.getElementById('ai-response');
    var query = input.value.trim();
    if (!query) return;

    showApiKeyPrompt(function() {
        resp.style.display = 'block';
        resp.innerHTML = '<div style="padding:16px;background:var(--bg);border-radius:var(--radius-sm);border:1px solid var(--border-light);display:flex;align-items:center;gap:12px;"><div class="loading-spinner" style="width:20px;height:20px;border-width:2px;"></div><span style="color:var(--text-muted);font-size:13px;">Meridian AI is analysing...</span></div>';

        callGroq(query, null,
            function(response) {
                resp.innerHTML =
                    '<div style="padding:16px;background:var(--bg);border-radius:var(--radius-sm);border:1px solid var(--border-light);border-left:3px solid var(--kpmg-cyan);">' +
                        '<div style="font-size:10px;font-weight:700;letter-spacing:1.5px;color:var(--kpmg-cyan);margin-bottom:10px;text-transform:uppercase;">Meridian AI Response</div>' +
                        '<div style="font-size:13px;color:var(--text-secondary);line-height:1.7;">' + formatAIResponse(response) + '</div>' +
                        '<div style="font-size:10px;color:var(--text-muted);margin-top:12px;padding-top:12px;border-top:1px solid var(--border);">Apex Telecom · June 2025 · Powered by Groq AI</div>' +
                    '</div>';
            },
            function(error) {
                resp.innerHTML =
                    '<div style="padding:16px;background:var(--bg);border-radius:var(--radius-sm);border:1px solid rgba(253,52,156,0.3);border-left:3px solid #FD349C;">' +
                        '<div style="font-size:13px;color:#FD349C;">Error: ' + error + '</div>' +
                        '<div style="font-size:11px;color:var(--text-muted);margin-top:8px;">Check your API key or try again.</div>' +
                    '</div>';
            }
        );
    });
}

function setQuery(text) {
    document.getElementById('ai-query-input').value = text;
    handleQuery();
}

/* ── WIDGET EDITOR ─────────────────────────────────────────
   Allows CFO to customise which KPIs appear on dashboard
*/

// Track which KPIs are currently active
var ACTIVE_KPIS = window.KPI_LIBRARY
    ? window.KPI_LIBRARY.filter(function(k) { return k.default; }).map(function(k) { return k.id; })
    : ['arpu','churn','ebitda','spectrum','fcf','subscribers'];

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
        '<div style="font-size:12px;color:var(--text-muted);margin-bottom:20px;">Select which KPIs to display on your dashboard. Choose up to 12.</div>' +
        '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:20px;">' +
            window.KPI_LIBRARY.map(function(kpi) {
                var isActive = ACTIVE_KPIS.indexOf(kpi.id) !== -1;
                return '<div onclick="toggleWidget(\'' + kpi.id + '\')" id="widget-toggle-' + kpi.id + '" ' +
                    'style="background:' + (isActive ? 'rgba(0,192,174,0.1)' : 'var(--bg)') + ';' +
                    'border:1px solid ' + (isActive ? '#00C0AE' : 'var(--border)') + ';' +
                    'border-radius:8px;padding:12px;cursor:pointer;transition:all 0.15s;position:relative;">' +
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
        if (ACTIVE_KPIS.length >= 12) {
            alert('Maximum 12 KPIs allowed. Remove one first.');
            return;
        }
        ACTIVE_KPIS.push(kpiId);
    } else {
        if (ACTIVE_KPIS.length <= 1) {
            alert('At least 1 KPI must be selected.');
            return;
        }
        ACTIVE_KPIS.splice(idx, 1);
    }

    var isNowActive = ACTIVE_KPIS.indexOf(kpiId) !== -1;
    var card  = document.getElementById('widget-toggle-' + kpiId);
    var check = document.getElementById('widget-check-' + kpiId);
    var kpi   = window.KPI_LIBRARY.find(function(k) { return k.id === kpiId; });

    card.style.background = isNowActive ? 'rgba(0,192,174,0.1)' : 'var(--bg)';
    card.style.border     = '1px solid ' + (isNowActive ? '#00C0AE' : 'var(--border)');
    check.style.background = isNowActive ? '#00C0AE' : 'var(--border)';
    check.innerHTML = isNowActive
        ? '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>'
        : '';

    document.getElementById('widget-count').textContent = ACTIVE_KPIS.length + ' of 18 selected';
}

function applyWidgets() {
    closeModal();
    var grid = document.getElementById('kpi-grid');
    if (!grid) return;

    grid.innerHTML = ACTIVE_KPIS.map(function(kpiId) {
        var kpi = window.KPI_LIBRARY.find(function(k) { return k.id === kpiId; });
        if (!kpi) return '';
        var deltaClass = getDeltaClass(kpi.delta, kpi.id === 'churn' || kpi.id === 'calldrop' || kpi.id === 'capexratio');
        return '<div class="kpi-card" onclick="openKPIModal(\'' + kpi.id + '\')" style="cursor:pointer;" title="Click to expand">' +
            '<div class="kpi-card-accent" style="background:' + lineColor + '"></div>' +
            '<div class="kpi-label">' + kpi.label + '</div>' +
            '<div class="kpi-value">' + kpi.value +
                '<span style="font-size:14px;color:var(--text-secondary);font-weight:400;">' + kpi.unit + '</span>' +
            '</div>' +
            '<div class="kpi-delta ' + deltaClass + '">' + kpi.delta +
                ' <span class="kpi-delta-label">' + kpi.deltaLabel + '</span>' +
            '</div>' +
            '<div style="position:absolute;bottom:8px;right:10px;display:flex;align-items:center;gap:5px;">' +
                '<div style="width:5px;height:5px;border-radius:50%;background:#00C0AE;animation:livePulse 1.5s ease-in-out infinite alternate;"></div>' +
                '<span class="kpi-freshness" style="font-size:9px;color:var(--text-muted);">Live · just now</span>' +
            '</div>' +
            '<div style="position:absolute;top:8px;right:8px;opacity:0.3;font-size:10px;color:var(--text-muted);">↗</div>' +
        '</div>';
    }).join('');

    // Update grid columns based on count
    var count = ACTIVE_KPIS.length;
    var cols = count <= 3 ? count : count <= 6 ? 3 : count <= 8 ? 4 : count <= 12 ? 6 : 6;
    grid.style.gridTemplateColumns = 'repeat(' + cols + ', 1fr)';
}

/* ── DATA FRESHNESS INDICATORS ──────────────────────────── */

var FRESHNESS_START = Date.now();
var FRESHNESS_TIMER = null;

function startFreshnessTimer() {
    FRESHNESS_START = Date.now();
    if (FRESHNESS_TIMER) clearInterval(FRESHNESS_TIMER);

    FRESHNESS_TIMER = setInterval(function() {
        var mins = Math.floor((Date.now() - FRESHNESS_START) / 60000);
        var text = mins === 0 ? 'Live · just now' : 'Live · ' + mins + ' min ago';
        document.querySelectorAll('.kpi-freshness').forEach(function(el) {
            el.textContent = text;
        });
    }, 30000);
}

/* ── KPI DETAIL MODAL ───────────────────────────────────── */

function openKPIDetail(id) {
    var kpi = window.KPI_MASTER.find(function(k) { return k.id === id; });
    if (!kpi) return;

    var bl       = window.BUSINESS_LINES.find(function(b) { return b.id === kpi.businessLine; }) || {};
    var sys      = window.SOURCE_SYSTEMS[kpi.system] || {};
    var pct      = kpi.pctToTarget;
    var color    = pct >= 95 ? '#00C0AE' : pct >= 75 ? '#00B8F5' : pct >= 50 ? '#F59E0B' : pct >= 30 ? '#F97316' : '#FD349C';
    var isFav    = getFavourites().indexOf(id) > -1;
    var deltaClass = kpi.trend === 'up' ? '#00C0AE' : kpi.trend === 'down' ? '#FD349C' : '#8A9BB0';

    var box = document.getElementById('modal-box');
    if (!box) return;

    box.innerHTML =
        '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px;">' +
            '<div>' +
                '<div style="font-size:10px;font-weight:700;letter-spacing:1.5px;color:' + color + ';text-transform:uppercase;margin-bottom:4px;">' + (bl.label || kpi.businessLine) + ' · ' + kpi.system + '</div>' +
                '<div style="font-size:22px;font-weight:700;color:var(--text-primary);">' + kpi.label + '</div>' +
                '<div style="font-size:12px;color:var(--text-muted);margin-top:2px;">' + (kpi.period || '') + ' · ' + (kpi.systemFull || '') + '</div>' +
            '</div>' +
            '<div style="display:flex;gap:8px;align-items:center;">' +
                '<button onclick="toggleFavourite(\'' + id + '\');openKPIDetail(\'' + id + '\')" style="background:transparent;border:1px solid var(--border);border-radius:6px;padding:4px 10px;cursor:pointer;font-size:14px;color:' + (isFav ? '#F59E0B' : 'var(--text-muted)') + ';">★</button>' +
                '<button onclick="closeModal()" style="background:transparent;border:1px solid var(--border);border-radius:6px;padding:4px 10px;cursor:pointer;font-size:16px;color:var(--text-muted);">✕</button>' +
            '</div>' +
        '</div>' +

        // Primary metric row
        '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-bottom:20px;">' +
            '<div style="background:var(--bg);border-radius:var(--radius-sm);padding:16px;border:1px solid var(--border);">' +
                '<div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">Current Value</div>' +
                '<div style="font-size:32px;font-weight:700;color:var(--text-primary);font-family:var(--font-mono);">' + kpi.value + '<span style="font-size:14px;color:var(--text-secondary);margin-left:4px;">' + kpi.unit + '</span></div>' +
                '<div style="font-size:12px;color:' + deltaClass + ';margin-top:4px;font-weight:600;">' + kpi.delta + ' YoY</div>' +
            '</div>' +
            '<div style="background:var(--bg);border-radius:var(--radius-sm);padding:16px;border:1px solid var(--border);">' +
                '<div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">FY26 Target</div>' +
                '<div style="font-size:14px;font-weight:700;color:var(--text-primary);margin-bottom:8px;">' + (kpi.targetFY || kpi.target) + '</div>' +
                '<div style="height:4px;background:var(--border);border-radius:2px;">' +
                    '<div style="height:4px;background:' + color + ';border-radius:2px;width:' + Math.min(pct, 100) + '%;"></div>' +
                '</div>' +
                '<div style="font-size:11px;color:' + color + ';font-weight:700;margin-top:4px;">' + pct + '% to target</div>' +
            '</div>' +
            '<div style="background:var(--bg);border-radius:var(--radius-sm);padding:16px;border:1px solid var(--border);">' +
                '<div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">Benchmark</div>' +
                '<div style="font-size:14px;font-weight:700;color:var(--text-primary);margin-bottom:4px;">' + kpi.benchmark + ' ' + kpi.unit + '</div>' +
                '<div style="font-size:11px;color:var(--text-muted);">' + (kpi.benchmarkLabel || '') + '</div>' +
                '<div style="font-size:11px;font-weight:700;margin-top:4px;color:' + (kpi.rank === 1 ? '#00C0AE' : kpi.rank <= 2 ? '#00B8F5' : kpi.rank <= 3 ? '#F59E0B' : '#FD349C') + ';">Rank ' + kpi.rank + ' of ' + kpi.rankOf + ' operators</div>' +
            '</div>' +
        '</div>' +

        // Trend chart
        '<div style="background:var(--bg);border-radius:var(--radius-sm);padding:16px;border:1px solid var(--border);margin-bottom:16px;">' +
            '<div style="font-size:11px;font-weight:700;letter-spacing:1px;color:var(--text-muted);text-transform:uppercase;margin-bottom:12px;">5-Quarter Trend</div>' +
            '<div style="height:120px;position:relative;"><canvas id="kpi-modal-trend"></canvas></div>' +
        '</div>' +

        // Insight, Risk, Opportunity
        '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:16px;">' +
            insightCard('💡 INSIGHT', kpi.insight, '#00B8F5') +
            insightCard('⚠ RISK', kpi.risk, '#FD349C') +
            insightCard('🎯 OPPORTUNITY', kpi.opportunity, '#00C0AE') +
        '</div>' +

        // Formula bar
        '<div style="background:var(--bg);border-radius:var(--radius-sm);padding:14px;border:1px solid var(--border);margin-bottom:10px;">' +
            '<div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">Formula</div>' +
            '<div style="font-size:12px;color:var(--text-secondary);font-family:var(--font-mono);line-height:1.6;">' + (kpi.formula || 'N/A') + '</div>' +
        '</div>' +

        // Source system and tags
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

    // Show modal
    var overlay = document.getElementById('modal-overlay');
    if (overlay) {
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Render trend chart
    setTimeout(function() {
        var ctx = document.getElementById('kpi-modal-trend');
        if (!ctx || !kpi.trend5Q) return;
        var quarters = ['Q1 FY25', 'Q2 FY25', 'Q3 FY25', 'Q4 FY25', 'Q1 FY26'];
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: quarters,
                datasets: [{
                    data: kpi.trend5Q,
                    borderColor: color,
                    backgroundColor: color + '22',
                    borderWidth: 2,
                    pointRadius: 4,
                    pointBackgroundColor: color,
                    tension: 0.3,
                    fill: true
                }]
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