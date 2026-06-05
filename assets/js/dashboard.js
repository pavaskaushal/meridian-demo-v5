/* ============================================================
   MERIDIAN V2 · DASHBOARD
   Screen 1: CFO Command Board
   ============================================================ */

function initDashboard() {
    renderKPICards();
    renderAlertList();
    renderCharts();
}

function renderKPICards() {
    var grid = document.getElementById('kpi-grid');
    if (!grid) return;

    grid.innerHTML = KPI_DATA.map(function(kpi) {
        var deltaClass = getDeltaClass(kpi.delta, kpi.id === 'churn');
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

    resp.style.display = 'block';
    resp.innerHTML = '<div style="padding:16px;background:var(--bg);border-radius:var(--radius-sm);border:1px solid var(--border-light);display:flex;align-items:center;gap:12px;"><div class="loading-spinner" style="width:20px;height:20px;border-width:2px;"></div><span style="color:var(--text-muted);font-size:13px;">Meridian is analysing...</span></div>';

    setTimeout(function() {
        var q = query.toLowerCase();
        var r = '';
        if (q.includes('arpu') && q.includes('competitor')) {
            r = '<strong>ARPU vs Competitors</strong><br><br>Apex Telecom ARPU of ₹181/month ranks 2nd, behind Airtel (₹194) but ahead of Jio (₹168), Vi (₹156), and BSNL (₹98). The ₹13 gap vs Airtel represents a postpaid pricing opportunity.';
        } else if (q.includes('risk') || q.includes('rafm')) {
            r = '<strong>Revenue Risk — June 2025</strong><br><br>Six RAFM alerts total <strong>₹9.32 Cr exposure</strong>. Priority: ₹4.8 Cr interconnect discrepancy with Jio (Mumbai-Delhi) and ₹1.92 Cr split-PO fraud at CloudHost Infra.';
        } else if (q.includes('ebitda')) {
            r = '<strong>EBITDA Forecast Q1 FY26</strong><br><br>Current margin 34.6% = ₹1,183 Cr. Q1 FY26 projection: ₹1,225 Cr (34.9%) driven by operating leverage and spectrum efficiency gains.';
        } else if (q.includes('churn')) {
            r = '<strong>Churn Analysis</strong><br><br>Monthly churn 1.42% is down 18bps YoY. Bihar (2.1%), UP East (1.9%) are highest risk circles. Targeted retention in these 2 circles could recover 0.3% churn = ~₹180 Cr annual revenue.';
        } else if (q.includes('5g')) {
            r = '<strong>5G Performance</strong><br><br>38M 5G subscribers across 12 circles. 5G ARPU is 2.4× blended ARPU (₹312 vs ₹181). Speed: 187.3 Mbps average. Accelerating 5G device migration is the highest-value ARPU lever available.';
        } else {
            r = '<strong>Meridian Summary</strong><br><br>Apex Telecom: ARPU ₹181 (+6.5% YoY), EBITDA 34.6%, Churn 1.42% (improving), FCF ₹2,340 Cr, 312M subscribers. 6 RAFM alerts totalling ₹9.32 Cr exposure. Ask about ARPU, churn, EBITDA, 5G, or RAFM risks.';
        }
        resp.innerHTML = '<div style="padding:16px;background:var(--bg);border-radius:var(--radius-sm);border:1px solid var(--border-light);border-left:3px solid var(--kpmg-cyan);"><div style="font-size:10px;font-weight:700;letter-spacing:1.5px;color:var(--kpmg-cyan);margin-bottom:10px;text-transform:uppercase;">Meridian Response</div><div style="font-size:13px;color:var(--text-secondary);line-height:1.7;">' + r + '</div><div style="font-size:10px;color:var(--text-muted);margin-top:12px;padding-top:12px;border-top:1px solid var(--border);">Apex Telecom · June 2025 · Meridian AI</div></div>';
    }, 1200);
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