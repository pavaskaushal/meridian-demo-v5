/* ============================================================
   MERIDIAN V2 · SCENARIO STUDIO
   Screen 3: AI Scenario Studio
   ============================================================ */

function initScenario() {
    renderSliders();
    renderWaterfallChart();
    setTimeout(renderPLChart, 300);
}

function renderSliders() {
    var container = document.getElementById('slider-container');
    if (!container) return;

    container.innerHTML = SCENARIO_SLIDERS.map(function(s) {
        return '<div style="margin-bottom:20px;">' +
            '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">' +
                '<span style="font-size:13px;font-weight:600;color:var(--text-primary);">' + s.label + '</span>' +
                '<span id="val-' + s.id + '" style="font-family:var(--font-mono);font-size:13px;font-weight:700;color:var(--kpmg-cyan);">' + s.default + s.unit + '</span>' +
            '</div>' +
            '<input type="range" id="slider-' + s.id + '" min="' + s.min + '" max="' + s.max + '" step="' + s.step + '" value="' + s.default + '" ' +
                'style="width:100%;accent-color:var(--kpmg-cyan);" oninput="updateScenario()">' +
            '<div style="display:flex;justify-content:space-between;margin-top:2px;">' +
                '<span style="font-size:10px;color:var(--text-muted);">' + s.min + s.unit + '</span>' +
                '<span style="font-size:10px;color:var(--text-muted);">' + s.max + s.unit + '</span>' +
            '</div>' +
        '</div>';
    }).join('');
}

function updateScenario() {
    var arpu     = parseFloat(document.getElementById('slider-arpu-change').value);
    var churn    = parseFloat(document.getElementById('slider-churn-change').value);
    var spectrum = parseFloat(document.getElementById('slider-spectrum-cost').value);
    var price    = parseFloat(document.getElementById('slider-price-increase').value);

    document.getElementById('val-arpu-change').textContent    = (arpu >= 0 ? '+' : '') + arpu + '%';
    document.getElementById('val-churn-change').textContent   = (churn >= 0 ? '+' : '') + churn + '%';
    document.getElementById('val-spectrum-cost').textContent  = (spectrum >= 0 ? '+' : '') + spectrum + '%';
    document.getElementById('val-price-increase').textContent = '+' + price + '%';

    var result = calculateScenario(arpu, churn, spectrum, price);

    document.getElementById('scenario-revenue').textContent = '₹' + result.scenarioRevenue.toLocaleString('en-IN') + ' Cr';
    document.getElementById('scenario-ebitda').textContent  = '₹' + result.scenarioEbitda.toLocaleString('en-IN') + ' Cr';
    document.getElementById('scenario-margin').textContent  = result.ebitdaPct + '%';

    var impactEl    = document.getElementById('revenue-impact');
    var impactValue = result.revenueImpact;
    impactEl.textContent = (impactValue >= 0 ? '+' : '') + '₹' + Math.abs(impactValue).toLocaleString('en-IN') + ' Cr';
    impactEl.style.color = impactValue >= 0 ? 'var(--positive)' : 'var(--danger)';

    renderWaterfallChart(arpu, churn, spectrum, price);
}

function handleScenarioQuery() {
    var input = document.getElementById('scenario-query');
    var resp  = document.getElementById('scenario-response');
    var query = input.value.trim();
    if (!query) return;

    var sliderContext = '';
    var arpuEl     = document.getElementById('slider-arpu-change');
    var churnEl    = document.getElementById('slider-churn-change');
    var spectrumEl = document.getElementById('slider-spectrum-cost');
    var priceEl    = document.getElementById('slider-price-increase');

    if (arpuEl) {
        sliderContext = 'CURRENT SCENARIO SLIDERS: ARPU Change: ' + arpuEl.value + '%, Churn Change: ' + churnEl.value + '%, Spectrum Cost: ' + spectrumEl.value + '%, Price Increase: ' + priceEl.value + '%. Factor these into your analysis.';
    }

    showApiKeyPrompt(function() {
        resp.style.display = 'block';
        resp.innerHTML = '<div style="padding:16px;background:var(--bg);border-radius:var(--radius-sm);border:1px solid var(--border-light);display:flex;align-items:center;gap:12px;"><div class="loading-spinner" style="width:20px;height:20px;border-width:2px;"></div><span style="color:var(--text-muted);font-size:13px;">Modelling scenario with Groq AI...</span></div>';

        callGemini(query, sliderContext,
            function(response) {
                resp.innerHTML =
                    '<div style="padding:16px;background:var(--bg);border-radius:var(--radius-sm);border:1px solid var(--border-light);border-left:3px solid var(--kpmg-cyan);">' +
                        '<div style="font-size:10px;font-weight:700;letter-spacing:1.5px;color:var(--kpmg-cyan);margin-bottom:10px;text-transform:uppercase;">Scenario Analysis · Groq AI</div>' +
                        '<div style="font-size:13px;color:var(--text-secondary);line-height:1.7;">' + formatGeminiResponse(response) + '</div>' +
                        '<div style="font-size:10px;color:var(--text-muted);margin-top:12px;padding-top:12px;border-top:1px solid var(--border);">Apex Telecom · Powered by Groq AI</div>' +
                    '</div>';
            },
            function(error) {
                resp.innerHTML =
                    '<div style="padding:16px;background:var(--bg);border-radius:var(--radius-sm);border:1px solid rgba(253,52,156,0.3);border-left:3px solid #FD349C;">' +
                        '<div style="font-size:13px;color:#FD349C;">Error: ' + error + '</div>' +
                    '</div>';
            }
        );
    });
}

/* ── QUARTERLY P&L CHART ────────────────────────────────── */

var PL_ACTIVE_METRICS = { revenue: true, ebitda: true, capex: false, fcf: true };
var PL_CHART = null;

var SCENARIO_QUARTERLY_PL = [
    { quarter: 'Q1 FY25', revenue: 3180, ebitda: 1060, margin: 33.3, capex: 420, fcf: 640  },
    { quarter: 'Q2 FY25', revenue: 3280, ebitda: 1115, margin: 34.0, capex: 380, fcf: 735  },
    { quarter: 'Q3 FY25', revenue: 3350, ebitda: 1152, margin: 34.4, capex: 360, fcf: 792  },
    { quarter: 'Q4 FY25', revenue: 3420, ebitda: 1183, margin: 34.6, capex: 340, fcf: 843  },
    { quarter: 'Q1 FY26', revenue: 3510, ebitda: 1225, margin: 34.9, capex: 320, fcf: 905  }
];

function togglePLMetric(metric) {
    PL_ACTIVE_METRICS[metric] = !PL_ACTIVE_METRICS[metric];
    renderPLChart();
}

function renderPLChart() {
    var ctx = document.getElementById('pl-trend-chart');
    if (!ctx) return;

    if (PL_CHART) { PL_CHART.destroy(); PL_CHART = null; }

    var labels   = SCENARIO_QUARTERLY_PL.map(function(q) { return q.quarter; });
    var datasets = [];

    if (PL_ACTIVE_METRICS.revenue) {
        datasets.push({
            label: 'Revenue',
            data: SCENARIO_QUARTERLY_PL.map(function(q) { return q.revenue; }),
            borderColor: '#00C0AE', backgroundColor: '#00C0AE22',
            borderWidth: 2, pointRadius: 4, tension: 0.3, fill: true
        });
    }
    if (PL_ACTIVE_METRICS.ebitda) {
        datasets.push({
            label: 'EBITDA',
            data: SCENARIO_QUARTERLY_PL.map(function(q) { return q.ebitda; }),
            borderColor: '#1E49E2', backgroundColor: '#1E49E222',
            borderWidth: 2, pointRadius: 4, tension: 0.3, fill: true
        });
    }
    if (PL_ACTIVE_METRICS.capex) {
        datasets.push({
            label: 'Capex',
            data: SCENARIO_QUARTERLY_PL.map(function(q) { return q.capex; }),
            borderColor: '#F59E0B', backgroundColor: '#F59E0B22',
            borderWidth: 2, pointRadius: 4, tension: 0.3, fill: false
        });
    }
    if (PL_ACTIVE_METRICS.fcf) {
        datasets.push({
            label: 'FCF',
            data: SCENARIO_QUARTERLY_PL.map(function(q) { return q.fcf; }),
            borderColor: '#B497FF', backgroundColor: '#B497FF22',
            borderWidth: 2, pointRadius: 4, tension: 0.3, fill: false
        });
    }

    PL_CHART = new Chart(ctx, {
        type: 'line',
        data: { labels: labels, datasets: datasets },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: {
                legend: { labels: { color: '#8A9BB0', font: { size: 11 } } },
                tooltip: {
                    callbacks: {
                        label: function(c) { return c.dataset.label + ': ₹' + c.raw + ' Cr'; }
                    }
                }
            },
            scales: {
                x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8A9BB0' } },
                y: {
                    grid: { color: 'rgba(255,255,255,0.05)' },
                    ticks: { color: '#8A9BB0', callback: function(v) { return '₹' + v + ' Cr'; } }
                }
            }
        }
    });

    renderPLTable();
}

function renderPLTable() {
    var tbody = document.getElementById('pl-table-body');
    if (!tbody) return;

    var metrics = [
        { label: 'Revenue (₹ Cr)',      key: 'revenue', color: '#00C0AE' },
        { label: 'EBITDA (₹ Cr)',       key: 'ebitda',  color: '#1E49E2' },
        { label: 'EBITDA Margin (%)',   key: 'margin',  color: '#00B8F5', suffix: '%' },
        { label: 'Capex (₹ Cr)',        key: 'capex',   color: '#F59E0B' },
        { label: 'FCF (₹ Cr)',          key: 'fcf',     color: '#B497FF' }
    ];

    tbody.innerHTML = metrics.map(function(m) {
        var cells = SCENARIO_QUARTERLY_PL.map(function(q, i) {
            var isLatest = i === QUARTERLY_PL.length - 1;
            var val = m.suffix ? q[m.key] + m.suffix : '₹' + q[m.key];
            return '<td style="padding:12px ' + (isLatest ? '24' : '16') + 'px;text-align:right;font-size:13px;' +
                (isLatest ? 'font-weight:700;color:' + m.color + ';' : 'color:var(--text-secondary);') + '">' + val + '</td>';
        }).join('');

        return '<tr style="border-bottom:1px solid var(--border);">' +
            '<td style="padding:12px 24px;font-size:13px;color:var(--text-primary);font-weight:500;">' + m.label + '</td>' +
            cells +
        '</tr>';
    }).join('');
}