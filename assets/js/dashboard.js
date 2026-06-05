/* ============================================================
   MERIDIAN V2 · DASHBOARD
   Screen 1: CFO Command Board
   ============================================================ */

function initDashboard() {
    renderKPICards();
    renderAlertList();
    renderCharts();
    generateAutoInsight();
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
        'Give me exactly 2 insights for the CFO morning briefing. First: the single biggest revenue risk right now in one sentence. Second: the single biggest revenue opportunity in one sentence. Be specific with numbers.',
        null,
        function(response) {
            var lines = response.split('\n').filter(function(l) { return l.trim().length > 10; });
            riskEl.innerHTML = formatGeminiResponse(lines[0] || response.substring(0, 200));
            arpuEl.innerHTML = formatGeminiResponse(lines[1] || '');
        },
        function() {
            // Silently fail — show static insight instead
        }

function renderKPICards() {
    var grid = document.getElementById('kpi-grid');
    if (!grid) return;

    grid.innerHTML = KPI_DATA.map(function(kpi) {
        var deltaClass = getDeltaClass(kpi.delta, kpi.id === 'churn');
        return '<div class="kpi-card" onclick="openKPIModal(\'' + kpi.id + '\')" style="cursor:pointer;" title="Click to expand">' +
            '<div class="kpi-card-accent" style="background:' + kpi.accentColor + '"></div>' +
            '<div class="kpi-label">' + kpi.label + '</div>' +
            '<div class="kpi-value">' +
                '<span id="kpi-val-' + kpi.id + '">0</span>' +
                '<span style="font-size:14px;color:var(--text-secondary);font-weight:400;">' + kpi.unit + '</span>' +
            '</div>' +
            '<div class="kpi-delta ' + deltaClass + '">' + kpi.delta +
                ' <span class="kpi-delta-label">' + kpi.deltaLabel + '</span>' +
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

        callGemini(query, null,
            function(response) {
                resp.innerHTML =
                    '<div style="padding:16px;background:var(--bg);border-radius:var(--radius-sm);border:1px solid var(--border-light);border-left:3px solid var(--kpmg-cyan);">' +
                        '<div style="font-size:10px;font-weight:700;letter-spacing:1.5px;color:var(--kpmg-cyan);margin-bottom:10px;text-transform:uppercase;">Meridian AI Response</div>' +
                        '<div style="font-size:13px;color:var(--text-secondary);line-height:1.7;">' + formatGeminiResponse(response) + '</div>' +
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
            '<div class="kpi-card-accent" style="background:' + kpi.accentColor + '"></div>' +
            '<div class="kpi-label">' + kpi.label + '</div>' +
            '<div class="kpi-value">' + kpi.value +
                '<span style="font-size:14px;color:var(--text-secondary);font-weight:400;">' + kpi.unit + '</span>' +
            '</div>' +
            '<div class="kpi-delta ' + deltaClass + '">' + kpi.delta +
                ' <span class="kpi-delta-label">' + kpi.deltaLabel + '</span>' +
            '</div>' +
            '<div style="position:absolute;top:8px;right:8px;opacity:0.3;font-size:10px;color:var(--text-muted);">↗</div>' +
        '</div>';
    }).join('');

    // Update grid columns based on count
    var count = ACTIVE_KPIS.length;
    var cols = count <= 3 ? count : count <= 6 ? 3 : count <= 8 ? 4 : count <= 12 ? 6 : 6;
    grid.style.gridTemplateColumns = 'repeat(' + cols + ', 1fr)';
}