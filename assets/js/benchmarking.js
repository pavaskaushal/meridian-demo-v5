/* ============================================================
   MERIDIAN V3 · BENCHMARKING SCREEN
   Industry KPI comparison · Indian Telecom · June 2025
   ============================================================ */

var BENCHMARK_DATA = [
    {
        metric:     'ARPU (₹/month)',
        apex:       181,  airtel: 194,  jio: 168,  vi: 156,  bsnl: 98,
        unit:       '₹',  higherBetter: true,  format: 'currency'
    },
    {
        metric:     'Monthly Churn (%)',
        apex:       1.42, airtel: 1.28, jio: 1.15, vi: 2.10, bsnl: 1.80,
        unit:       '%',  higherBetter: false, format: 'percent'
    },
    {
        metric:     'EBITDA Margin (%)',
        apex:       34.6, airtel: 36.2, jio: 38.1, vi: 18.4, bsnl: null,
        unit:       '%',  higherBetter: true,  format: 'percent'
    },
    {
        metric:     '4G Data Speed (Mbps)',
        apex:       22.4, airtel: 24.1, jio: 19.8, vi: 14.2, bsnl: 8.4,
        unit:       '',   higherBetter: true,  format: 'number'
    },
    {
        metric:     'Call Drop Rate (%)',
        apex:       1.42, airtel: 1.31, jio: 1.18, vi: 1.96, bsnl: 2.84,
        unit:       '%',  higherBetter: false, format: 'percent'
    },
    {
        metric:     'Network Uptime (%)',
        apex:       99.94, airtel: 99.96, jio: 99.92, vi: 99.81, bsnl: 99.62,
        unit:       '%',  higherBetter: true,  format: 'percent'
    },
    {
        metric:     'VoLTE Penetration (%)',
        apex:       68.4, airtel: 74.2, jio: 89.1, vi: 52.3, bsnl: 12.1,
        unit:       '%',  higherBetter: true,  format: 'percent'
    },
    {
        metric:     'Market Share (%)',
        apex:       22.4, airtel: 26.4, jio: 34.5, vi: 14.2, bsnl: 2.5,
        unit:       '%',  higherBetter: true,  format: 'percent'
    }
];

var OPERATORS = ['apex', 'airtel', 'jio', 'vi', 'bsnl'];

function getRank(row) {
    var vals = OPERATORS
        .filter(function(op) { return row[op] !== null; })
        .map(function(op) { return { op: op, val: row[op] }; });

    vals.sort(function(a, b) {
        return row.higherBetter ? b.val - a.val : a.val - b.val;
    });

    var rank = vals.findIndex(function(v) { return v.op === 'apex'; }) + 1;
    return { rank: rank, total: vals.length };
}

function getRankBadge(rank, total) {
    var colors = { 1: '#00C0AE', 2: '#1E49E2', 3: '#F59E0B', 4: '#FD349C', 5: '#6B7280' };
    var labels = { 1: '1st', 2: '2nd', 3: '3rd', 4: '4th', 5: '5th' };
    var color = colors[rank] || '#6B7280';
    var label = labels[rank] || rank + 'th';
    return '<span style="background:' + color + '22;color:' + color + ';padding:2px 10px;border-radius:20px;font-size:11px;font-weight:700;">' + label + ' / ' + total + '</span>';
}

function formatVal(val, row) {
    if (val === null) return '<span style="color:var(--text-muted);">N/A</span>';
    if (row.format === 'currency') return '₹' + val;
    if (row.format === 'percent') return val + '%';
    return val;
}

function initBenchmarking() {
    renderBenchmarkScores();
    renderBenchmarkTable();
    renderBenchmarkCharts();
    renderBenchmarkAnalysis();
}

function renderBenchmarkScores() {
    var grid = document.getElementById('benchmark-score-grid');
    if (!grid) return;

    var scores = [
        { label: 'Overall Rank', value: '2nd', unit: '/ 5 operators', color: '#1E49E2' },
        { label: 'ARPU Rank', value: '2nd', unit: '₹181 vs ₹194 Airtel', color: '#00C0AE' },
        { label: 'Network Quality', value: '2nd', unit: 'Behind Airtel only', color: '#00B8F5' },
        { label: 'EBITDA Margin', value: '3rd', unit: '34.6% vs 38.1% Jio', color: '#F59E0B' },
        { label: 'Churn Performance', value: '3rd', unit: '1.42% monthly', color: '#B497FF' },
        { label: 'Market Share', value: '3rd', unit: '22.4% of market', color: '#63EBDA' }
    ];

    grid.innerHTML = scores.map(function(s) {
        return '<div class="kpi-card">' +
            '<div class="kpi-card-accent" style="background:' + s.color + '"></div>' +
            '<div class="kpi-label">' + s.label + '</div>' +
            '<div class="kpi-value" style="font-size:28px;">' + s.value +
                '<span style="font-size:12px;color:var(--text-secondary);font-weight:400;margin-left:4px;">' + s.unit + '</span>' +
            '</div>' +
        '</div>';
    }).join('');
}

function renderBenchmarkTable() {
    var tbody = document.getElementById('benchmark-tbody');
    if (!tbody) return;

    tbody.innerHTML = BENCHMARK_DATA.map(function(row) {
        var r = getRank(row);
        var avg = OPERATORS
            .filter(function(op) { return row[op] !== null; })
            .reduce(function(sum, op) { return sum + row[op]; }, 0) /
            OPERATORS.filter(function(op) { return row[op] !== null; }).length;

        var apexColor = r.rank === 1 ? '#00C0AE' : r.rank === 2 ? '#1E49E2' : r.rank <= 3 ? '#F59E0B' : '#FD349C';

        return '<tr style="border-bottom:1px solid var(--border);transition:background 0.15s;" onmouseover="this.style.background=\'var(--bg-hover)\'" onmouseout="this.style.background=\'\'">'+
            '<td style="padding:12px 24px;font-size:13px;color:var(--text-primary);font-weight:500;">' + row.metric + '</td>' +
            '<td style="padding:12px 16px;text-align:right;font-size:13px;font-weight:700;color:' + apexColor + ';">' + formatVal(row.apex, row) + '</td>' +
            '<td style="padding:12px 16px;text-align:right;font-size:13px;color:var(--text-secondary);">' + formatVal(row.airtel, row) + '</td>' +
            '<td style="padding:12px 16px;text-align:right;font-size:13px;color:var(--text-secondary);">' + formatVal(row.jio, row) + '</td>' +
            '<td style="padding:12px 16px;text-align:right;font-size:13px;color:var(--text-secondary);">' + formatVal(row.vi, row) + '</td>' +
            '<td style="padding:12px 16px;text-align:right;font-size:13px;color:var(--text-muted);">' + formatVal(Math.round(avg * 10) / 10, row) + '</td>' +
            '<td style="padding:12px 24px;text-align:center;">' + getRankBadge(r.rank, r.total) + '</td>' +
        '</tr>';
    }).join('');
}

function renderBenchmarkCharts() {
    var BLUE  = '#1E49E2';
    var CYAN  = '#00C0AE';
    var TEAL  = '#00B8F5';
    var PINK  = '#FD349C';
    var GREY  = '#6B7280';

    // ARPU Bar Chart
    var arpuCtx = document.getElementById('benchmark-arpu-chart');
    if (arpuCtx) {
        new Chart(arpuCtx, {
            type: 'bar',
            data: {
                labels: ['Apex', 'Airtel', 'Jio', 'Vi', 'BSNL'],
                datasets: [{
                    data: [181, 194, 168, 156, 98],
                    backgroundColor: [CYAN, BLUE + '99', TEAL + '99', PINK + '99', GREY + '99'],
                    borderColor: [CYAN, BLUE, TEAL, PINK, GREY],
                    borderWidth: 2,
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8A9BB0' } },
                    y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8A9BB0', callback: function(v) { return '₹' + v; } } }
                }
            }
        });
    }

    // Radar Chart
    var radarCtx = document.getElementById('benchmark-radar-chart');
    if (radarCtx) {
        new Chart(radarCtx, {
            type: 'radar',
            data: {
                labels: ['ARPU', 'Churn', 'EBITDA', 'Data Speed', 'Uptime', 'VoLTE'],
                datasets: [
                    {
                        label: 'Apex',
                        data: [93, 78, 85, 88, 90, 77],
                        borderColor: CYAN, backgroundColor: CYAN + '22', pointBackgroundColor: CYAN, borderWidth: 2
                    },
                    {
                        label: 'Airtel',
                        data: [100, 85, 90, 95, 95, 85],
                        borderColor: BLUE, backgroundColor: BLUE + '22', pointBackgroundColor: BLUE, borderWidth: 2
                    },
                    {
                        label: 'Jio',
                        data: [87, 90, 95, 78, 88, 100],
                        borderColor: TEAL, backgroundColor: TEAL + '11', pointBackgroundColor: TEAL, borderWidth: 2
                    }
                ]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { labels: { color: '#8A9BB0', font: { size: 11 } } } },
                scales: {
                    r: {
                        grid: { color: 'rgba(255,255,255,0.08)' },
                        ticks: { display: false },
                        pointLabels: { color: '#8A9BB0', font: { size: 11 } },
                        min: 0, max: 100
                    }
                }
            }
        });
    }

    // Market Share Doughnut
    var shareCtx = document.getElementById('benchmark-share-chart');
    if (shareCtx) {
        new Chart(shareCtx, {
            type: 'doughnut',
            data: {
                labels: ['Apex 22.4%', 'Airtel 26.4%', 'Jio 34.5%', 'Vi 14.2%', 'BSNL 2.5%'],
                datasets: [{
                    data: [22.4, 26.4, 34.5, 14.2, 2.5],
                    backgroundColor: [CYAN, BLUE, TEAL, PINK, GREY],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'right', labels: { color: '#8A9BB0', font: { size: 11 }, padding: 12 } }
                },
                cutout: '65%'
            }
        });
    }
}

function renderBenchmarkAnalysis() {
    var el = document.getElementById('benchmark-analysis');
    if (!el) return;

    var insights = [
        {
            color: '#00C0AE', badge: 'STRENGTH',
            text: 'Network uptime of 99.94% and call drop rate of 1.42% place Apex 2nd in quality — behind Airtel only. This is a key differentiator vs Jio and Vi.'
        },
        {
            color: '#1E49E2', badge: 'OPPORTUNITY',
            text: 'ARPU gap of ₹13 vs Airtel (₹194) represents a postpaid pricing opportunity. Closing half this gap would add ~₹240 Cr quarterly revenue.'
        },
        {
            color: '#F59E0B', badge: 'WATCH',
            text: 'VoLTE penetration at 68.4% trails Jio (89.1%) significantly. Accelerating VoLTE adoption is critical to defending against Jio\'s data-led strategy.'
        },
        {
            color: '#FD349C', badge: 'RISK',
            text: 'EBITDA margin of 34.6% trails Jio (38.1%) by 350bps. Jio\'s cost advantage from network-sharing and digital-only operations creates structural pressure.'
        }
    ];

    el.innerHTML = insights.map(function(i) {
        return '<div style="padding:16px;border-left:3px solid ' + i.color + ';margin-bottom:12px;background:var(--bg);border-radius:0 var(--radius-sm) var(--radius-sm) 0;">' +
            '<div style="font-size:10px;font-weight:700;letter-spacing:1.5px;color:' + i.color + ';margin-bottom:6px;">' + i.badge + '</div>' +
            '<div style="font-size:13px;color:var(--text-secondary);line-height:1.6;">' + i.text + '</div>' +
        '</div>';
    }).join('');
}