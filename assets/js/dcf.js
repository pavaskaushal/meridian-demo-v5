/* ============================================================
   MERIDIAN V3 · DCF VALUATION STUDIO
   Monte Carlo simulation · 10,000 runs · Apex Telecom
   ============================================================ */

var DCF_RESULTS = null;

function initDCF() {
    updateAllDCFLabels();
}

function updateAllDCFLabels() {
    updateDCFLabel('growth');
    updateDCFLabel('ebitda');
    updateDCFLabel('wacc');
    updateDCFLabel('tgr');
    updateDCFLabel('years');
    updateDCFLabel('gvol');
    updateDCFLabel('mvol');
    updateDCFLabel('wvol');
    updateDCFLabel('mktcap');
    updateDCFLabel('debt');
}

function updateDCFLabel(id) {
    var input = document.getElementById('inp-' + id);
    var label = document.getElementById('lbl-' + id);
    if (!input || !label) return;
    var val = parseFloat(input.value);
    if (id === 'years')  label.textContent = val + ' yrs';
    else if (id === 'mktcap') label.textContent = '₹' + val.toLocaleString('en-IN') + ' Cr';
    else if (id === 'debt')   label.textContent = '₹' + val.toLocaleString('en-IN') + ' Cr';
    else if (id === 'gvol' || id === 'mvol' || id === 'wvol') label.textContent = '±' + val + '%';
    else label.textContent = val + '%';
}

/* ── MONTE CARLO ENGINE ─────────────────────────────────── */

function randn() {
    var u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

function runSingleDCF(growth, ebitda, wacc, tgr, years, debt) {
    var BASE_REVENUE = 13740; // Q4 FY25 annualised ₹Cr
    var CAPEX_RATIO  = 0.085; // Capex as % of revenue
    var TAX_RATE     = 0.25;

    var fcfs = [];
    var rev  = BASE_REVENUE;

    for (var y = 1; y <= years; y++) {
        rev = rev * (1 + growth / 100);
        var ebit   = rev * (ebitda / 100) * 0.7; // EBIT approx
        var nopat  = ebit * (1 - TAX_RATE);
        var capex  = rev * CAPEX_RATIO;
        var da     = rev * 0.08;
        var fcf    = nopat + da - capex;
        var pv     = fcf / Math.pow(1 + wacc / 100, y);
        fcfs.push(pv);
    }

    var lastFCF   = fcfs[fcfs.length - 1] * (1 + wacc / 100);
    var termVal   = lastFCF * (1 + tgr / 100) / ((wacc - tgr) / 100);
    var pvTermVal = termVal / Math.pow(1 + wacc / 100, years);

    var enterpriseVal = fcfs.reduce(function(a, b) { return a + b; }, 0) + pvTermVal;
    var equityVal     = enterpriseVal - debt;

    return Math.max(equityVal, 0);
}

function runMonteCarlo() {
    var growth = parseFloat(document.getElementById('inp-growth').value);
    var ebitda = parseFloat(document.getElementById('inp-ebitda').value);
    var wacc   = parseFloat(document.getElementById('inp-wacc').value);
    var tgr    = parseFloat(document.getElementById('inp-tgr').value);
    var years  = parseInt(document.getElementById('inp-years').value);
    var gvol   = parseFloat(document.getElementById('inp-gvol').value);
    var mvol   = parseFloat(document.getElementById('inp-mvol').value);
    var wvol   = parseFloat(document.getElementById('inp-wvol').value);
    var mktcap = parseFloat(document.getElementById('inp-mktcap').value);
    var debt   = parseFloat(document.getElementById('inp-debt').value);

    var status = document.getElementById('dcf-status');
    if (status) status.style.display = 'flex';

    setTimeout(function() {
        var N       = 10000;
        var results = [];

        for (var i = 0; i < N; i++) {
            var g  = growth + randn() * gvol;
            var m  = ebitda + randn() * mvol;
            var w  = wacc   + randn() * wvol;
            var t  = Math.max(tgr, 0.5);
            w = Math.max(w, t + 1);
            var val = runSingleDCF(g, m, w, t, years, debt);
            results.push(val);
        }

        results.sort(function(a, b) { return a - b; });
        DCF_RESULTS = results;

        if (status) status.style.display = 'none';

        renderDCFOutput(results, mktcap);
        renderDCFHistogram(results, mktcap);
        renderDCFScenarios(growth, ebitda, wacc, tgr, years, debt, mktcap);
        renderDCFSensitivity(growth, ebitda, tgr, years, debt, mktcap);

    }, 50);
}

/* ── OUTPUT SUMMARY ─────────────────────────────────────── */

function renderDCFOutput(results, mktcap) {
    var n    = results.length;
    var p10  = results[Math.floor(n * 0.10)];
    var p25  = results[Math.floor(n * 0.25)];
    var p50  = results[Math.floor(n * 0.50)];
    var p75  = results[Math.floor(n * 0.75)];
    var p90  = results[Math.floor(n * 0.90)];
    var mean = results.reduce(function(a, b) { return a + b; }, 0) / n;

    var upside   = ((p50 - mktcap) / mktcap * 100).toFixed(1);
    var upsideColor = p50 > mktcap ? '#00C0AE' : '#FD349C';
    var upsideLabel = p50 > mktcap ? 'UNDERVALUED' : 'OVERVALUED';

    var el = document.getElementById('dcf-output');
    if (!el) return;

    el.innerHTML =
        '<div style="text-align:center;padding:16px 0 24px;border-bottom:1px solid var(--border);margin-bottom:20px;">' +
            '<div style="font-size:11px;font-weight:700;letter-spacing:1.5px;color:var(--text-muted);text-transform:uppercase;margin-bottom:8px;">Median Intrinsic Value</div>' +
            '<div style="font-size:40px;font-weight:700;color:var(--text-primary);">₹' + Math.round(p50).toLocaleString('en-IN') + ' Cr</div>' +
            '<div style="font-size:13px;color:' + upsideColor + ';font-weight:600;margin-top:4px;">' +
                (p50 > mktcap ? '▲' : '▼') + ' ' + Math.abs(upside) + '% vs Market Cap · ' + upsideLabel +
            '</div>' +
        '</div>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px;">' +
            dcfStatCard('P10 (Bear)', p10, '#FD349C') +
            dcfStatCard('P25', p25, '#F59E0B') +
            dcfStatCard('P50 (Base)', p50, '#00C0AE') +
            dcfStatCard('P75', p75, '#1E49E2') +
            dcfStatCard('P90 (Bull)', p90, '#B497FF') +
            dcfStatCard('Mean', mean, '#00B8F5') +
        '</div>' +
        '<div style="background:var(--bg);border-radius:var(--radius-sm);padding:12px;border:1px solid var(--border);">' +
            '<div style="font-size:10px;font-weight:700;letter-spacing:1.5px;color:var(--text-muted);text-transform:uppercase;margin-bottom:8px;">Market Cap</div>' +
            '<div style="display:flex;justify-content:space-between;align-items:center;">' +
                '<span style="font-size:20px;font-weight:700;color:var(--text-secondary);">₹' + mktcap.toLocaleString('en-IN') + ' Cr</span>' +
                '<span style="font-size:11px;padding:4px 12px;border-radius:20px;background:' + upsideColor + '22;color:' + upsideColor + ';font-weight:700;">' + upsideLabel + '</span>' +
            '</div>' +
        '</div>';
}

function dcfStatCard(label, val, color) {
    return '<div style="background:var(--bg);border-radius:var(--radius-sm);padding:10px;border:1px solid var(--border);">' +
        '<div style="font-size:10px;color:var(--text-muted);margin-bottom:4px;">' + label + '</div>' +
        '<div style="font-size:15px;font-weight:700;color:' + color + ';">₹' + Math.round(val).toLocaleString('en-IN') + ' Cr</div>' +
    '</div>';
}

/* ── HISTOGRAM ──────────────────────────────────────────── */

function renderDCFHistogram(results, mktcap) {
    var ctx = document.getElementById('dcf-histogram');
    if (!ctx) return;

    // Destroy existing chart
    if (ctx._chart) { ctx._chart.destroy(); }

    var bins   = 40;
    var min    = results[0];
    var max    = results[results.length - 1];
    var width  = (max - min) / bins;
    var counts = new Array(bins).fill(0);
    var labels = [];

    results.forEach(function(v) {
        var b = Math.min(Math.floor((v - min) / width), bins - 1);
        counts[b]++;
    });

    for (var i = 0; i < bins; i++) {
        labels.push(Math.round(min + i * width).toLocaleString('en-IN'));
    }

    var colors = counts.map(function(_, i) {
        var midVal = min + (i + 0.5) * width;
        return midVal < mktcap ? '#FD349C99' : '#00C0AE99';
    });

    ctx._chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                data: counts,
                backgroundColor: colors,
                borderWidth: 0,
                borderRadius: 2
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(c) { return c.raw + ' scenarios'; }
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { color: '#8A9BB0', maxTicksLimit: 8, font: { size: 10 } }
                },
                y: {
                    grid: { color: 'rgba(255,255,255,0.05)' },
                    ticks: { color: '#8A9BB0', font: { size: 10 } }
                }
            }
        }
    });
}

/* ── SCENARIO COMPARISON ────────────────────────────────── */

function renderDCFScenarios(growth, ebitda, wacc, tgr, years, debt, mktcap) {
    var el = document.getElementById('dcf-scenarios');
    if (!el) return;

    var scenarios = [
        { name: 'Bear Case',  color: '#FD349C', g: growth - 4, m: ebitda - 3, w: wacc + 2 },
        { name: 'Base Case',  color: '#00C0AE', g: growth,     m: ebitda,     w: wacc     },
        { name: 'Bull Case',  color: '#1E49E2', g: growth + 4, m: ebitda + 3, w: wacc - 2 }
    ];

    el.innerHTML = scenarios.map(function(s) {
        var val    = runSingleDCF(s.g, s.m, s.w, tgr, years, debt);
        var upside = ((val - mktcap) / mktcap * 100).toFixed(1);
        var sign   = val > mktcap ? '▲' : '▼';

        return '<div style="padding:16px;border-left:3px solid ' + s.color + ';margin-bottom:12px;background:var(--bg);border-radius:0 var(--radius-sm) var(--radius-sm) 0;">' +
            '<div style="display:flex;justify-content:space-between;align-items:flex-start;">' +
                '<div>' +
                    '<div style="font-size:10px;font-weight:700;letter-spacing:1.5px;color:' + s.color + ';text-transform:uppercase;margin-bottom:4px;">' + s.name + '</div>' +
                    '<div style="font-size:11px;color:var(--text-muted);">Growth ' + s.g.toFixed(1) + '% · Margin ' + s.m.toFixed(1) + '% · WACC ' + s.w.toFixed(1) + '%</div>' +
                '</div>' +
                '<div style="text-align:right;">' +
                    '<div style="font-size:18px;font-weight:700;color:' + s.color + ';">₹' + Math.round(val).toLocaleString('en-IN') + ' Cr</div>' +
                    '<div style="font-size:11px;color:' + s.color + ';">' + sign + ' ' + Math.abs(upside) + '% vs mkt cap</div>' +
                '</div>' +
            '</div>' +
        '</div>';
    }).join('');
}

/* ── SENSITIVITY TABLE ──────────────────────────────────── */

function renderDCFSensitivity(growth, ebitda, tgr, years, debt, mktcap) {
    var el = document.getElementById('dcf-sensitivity');
    if (!el) return;

    var waccs   = [9, 10, 11, 12, 13];
    var growths = [6, 8, 10, 12, 14];

    var header = '<tr><th style="padding:8px 12px;font-size:10px;color:var(--text-muted);text-align:left;">WACC \\ Growth</th>' +
        growths.map(function(g) {
            return '<th style="padding:8px 12px;font-size:10px;color:var(--text-muted);text-align:right;">' + g + '%</th>';
        }).join('') + '</tr>';

    var rows = waccs.map(function(w) {
        return '<tr>' +
            '<td style="padding:8px 12px;font-size:11px;color:var(--text-muted);">' + w + '%</td>' +
            growths.map(function(g) {
                var val    = runSingleDCF(g, ebitda, w, tgr, years, debt);
                var upside = (val - mktcap) / mktcap * 100;
                var color  = upside > 20 ? '#00C0AE' : upside > 0 ? '#1E49E2' : upside > -20 ? '#F59E0B' : '#FD349C';
                return '<td style="padding:8px 12px;text-align:right;font-size:11px;font-weight:700;color:' + color + ';">₹' + Math.round(val / 1000) + 'K</td>';
            }).join('') +
        '</tr>';
    }).join('');

    el.innerHTML =
        '<div style="font-size:11px;color:var(--text-muted);margin-bottom:12px;">Values in ₹ Crore (K = thousands). Colour = upside vs market cap.</div>' +
        '<table style="width:100%;border-collapse:collapse;">' +
            '<thead style="border-bottom:1px solid var(--border);">' + header + '</thead>' +
            '<tbody>' + rows + '</tbody>' +
        '</table>';
}