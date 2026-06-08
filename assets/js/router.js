/* ============================================================
   MERIDIAN V3 · ROUTER
   Dynamic screen loading via fetch()
   ============================================================ */

var SCREEN_CACHE = {};
var CURRENT_SCREEN = null;

function showScreen(screenId, navEl) {
    if (CURRENT_SCREEN === screenId) return;

    document.querySelectorAll('.nav-item').forEach(function(n) {
        n.classList.remove('active');
    });
    if (navEl) navEl.classList.add('active');

    var titles = {
        dashboard:  ['CFO Command Board',   'Real-time financial intelligence · Apex Telecom'],
        rafm:       ['RAFM Risk Monitor',    'Revenue Assurance & Fraud Management · Live detection'],
        scenario:   ['AI Scenario Studio',   'What-if modelling · Live P&L cascade'],
        regulatory: ['Regulatory Calendar',  'TRAI filing tracker · Auto-readiness scoring'],
        connectors: ['Connector Status',     'System health · Data source monitoring · Platform engines'],
        issues:        ['Issues & Requests',      'Maintenance requests · SLA tracking · KPMG GRCS Managed Services'],
        benchmarking:  ['Industry Benchmarking',  'Apex Telecom vs TRAI benchmarks · Airtel · Jio · Vi · BSNL'],
        dcf:           ['DCF Valuation Studio',    'Monte Carlo simulation · 10,000 runs · Intrinsic value range']
    };

    if (titles[screenId]) {
        document.getElementById('topbar-title').textContent    = titles[screenId][0];
        document.getElementById('topbar-subtitle').textContent = titles[screenId][1];
    }

    loadScreen(screenId, function() {
        runInit(screenId, function() {
            if (screenId === 'dashboard')    initDashboard();
            if (screenId === 'rafm')         initRafm();
            if (screenId === 'scenario')     initScenario();
            if (screenId === 'regulatory')   initRegulatory();
            if (screenId === 'connectors')   initConnectors();
            if (screenId === 'issues')       initIssues();
            if (screenId === 'benchmarking') initBenchmarking();
            if (screenId === 'dcf')          initDCF();
        });
        CURRENT_SCREEN = screenId;
    });
}

function runInit(screenId, callback) {
    try {
        callback();
    } catch(e) {
        console.error('[Meridian] ' + screenId + ' init error:', e);
        var container = document.getElementById('screen-container');
        container.innerHTML =
            '<div style="padding:40px;text-align:center;color:var(--text-muted);">' +
                '<div style="font-size:14px;margin-bottom:8px;color:#FD349C;">Screen initialisation error</div>' +
                '<div style="font-family:monospace;font-size:12px;background:var(--bg);padding:12px;border-radius:8px;border:1px solid var(--border);margin-bottom:12px;text-align:left;">' + e.message + '</div>' +
                '<div style="font-size:11px;color:var(--text-muted);">Open DevTools (F12) for the full stack trace.</div>' +
            '</div>';
    }
}

function loadScreen(screenId, callback) {
    var container = document.getElementById('screen-container');

    // Show loading spinner
    container.innerHTML =
        '<div style="display:flex;align-items:center;justify-content:center;height:200px;gap:12px;">' +
            '<div class="loading-spinner"></div>' +
            '<span style="color:var(--text-muted);font-size:13px;">Loading...</span>' +
        '</div>';

    // Use cache if available
    if (SCREEN_CACHE[screenId]) {
        container.innerHTML = SCREEN_CACHE[screenId];
        if (callback) callback();
        return;
    }

    // Fetch screen HTML
    fetch('screens/' + screenId + '.html')
        .then(function(r) {
            if (!r.ok) throw new Error('HTTP ' + r.status + ' — screen not found: ' + screenId);
            return r.text();
        })
        .then(function(html) {
            SCREEN_CACHE[screenId] = html;
            container.innerHTML    = html;
            if (callback) callback();
        })
        .catch(function(err) {
            container.innerHTML =
                '<div style="padding:40px;text-align:center;color:var(--text-muted);">' +
                    '<div style="font-size:14px;margin-bottom:8px;">Failed to load screen</div>' +
                    '<div style="font-size:12px;">' + err.message + '</div>' +
                '</div>';
        });
}