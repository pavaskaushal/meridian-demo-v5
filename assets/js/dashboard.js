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