/* ============================================================
   MERIDIAN V2 · CHARTS
   All Chart.js drawing functions.
   ============================================================ */

function renderCharts() {
    var arpu    = document.getElementById('arpu-chart');
    var compete = document.getElementById('competitor-chart');
    if (!arpu || !compete) return;

    var existing1 = Chart.getChart(arpu);
    var existing2 = Chart.getChart(compete);
    if (existing1) existing1.destroy();
    if (existing2) existing2.destroy();

    var months = ARPU_CHART_DATA.months;
    var hist   = ARPU_CHART_DATA.historical;
    var fore   = ARPU_CHART_DATA.forecast;

    var histData = hist.concat([null, null, null]);
    var foreData = [];
    for (var i = 0; i < 11; i++) foreData.push(null);
    foreData.push(hist[11]);
    foreData = foreData.concat(fore);

    new Chart(arpu, {
        type: 'line',
        data: {
            labels: months,
            datasets: [
                {
                    label: 'ARPU (Historical)',
                    data: histData,
                    borderColor: '#00C0AE',
                    backgroundColor: 'rgba(0,192,174,0.08)',
                    borderWidth: 2.5,
                    pointRadius: 3,
                    tension: 0.3,
                    fill: true,
                    spanGaps: false
                },
                {
                    label: 'AI Forecast',
                    data: foreData,
                    borderColor: '#00B8F5',
                    borderWidth: 2,
                    borderDash: [6, 4],
                    pointRadius: 3,
                    tension: 0.3,
                    fill: false,
                    spanGaps: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            resizeDelay: 200,
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end',
                    labels: {
                        boxWidth: 8,
                        boxHeight: 8,
                        borderRadius: 4,
                        color: '#C0C8D8',
                        font: { size: 11 },
                        padding: 16,
                        usePointStyle: true,
                        pointStyle: 'circle'
                    },
                    margin: 16
                },
                tooltip: {
                    backgroundColor: '#111827',
                    callbacks: {
                        label: function(c) {
                            return c.raw === null ? null : ' ₹' + c.raw + '/mo';
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { color: 'rgba(31,41,55,0.6)' },
                    ticks: { maxRotation: 0, color: '#9CA3AF' }
                },
                y: {
                    min: 160,
                    max: 195,
                    grid: { color: 'rgba(31,41,55,0.6)' },
                    ticks: {
                        color: '#9CA3AF',
                        callback: function(v) { return '₹' + v; }
                    }
                }
            }
        }
    });

    new Chart(compete, {
        type: 'bar',
        data: {
            labels: COMPETITOR_DATA.map(function(d) { return d.name; }),
            datasets: [{
                data: COMPETITOR_DATA.map(function(d) { return d.arpu; }),
                backgroundColor: COMPETITOR_DATA.map(function(d) {
                    return d.isUs ? 'rgba(0,192,174,0.8)' : 'rgba(75,85,99,0.5)';
                }),
                borderColor: COMPETITOR_DATA.map(function(d) {
                    return d.isUs ? '#00C0AE' : '#4B5563';
                }),
                borderWidth: 1,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            resizeDelay: 200,
            indexAxis: 'y',
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#111827',
                    callbacks: {
                        label: function(c) { return ' ₹' + c.raw + '/month'; }
                    }
                }
            },
            scales: {
                x: {
                    min: 0,
                    max: 220,
                    grid: { color: 'rgba(31,41,55,0.6)' },
                    ticks: {
                        color: '#9CA3AF',
                        callback: function(v) { return '₹' + v; }
                    }
                },
                y: {
                    grid: { display: false },
                    ticks: { color: '#9CA3AF' }
                }
            }
        }
    });
}

function renderWaterfallChart(arpu, churn, spectrum, price) {
    arpu     = arpu     || 0;
    churn    = churn    || 0;
    spectrum = spectrum || 0;
    price    = price    || 0;

    var base        = SCENARIO_BASE.revenue;
    var arpuImpact  = Math.round(base * (arpu / 100));
    var churnImpact = Math.round(base * -(Math.max(0, churn) / 100) * 0.7);
    var priceImpact = Math.round(base * (price / 100));
    var specImpact  = Math.round(-(base * 0.08) * (spectrum / 100));
    var net         = base + arpuImpact + churnImpact + priceImpact + specImpact;

    var canvas = document.getElementById('waterfall-chart');
    if (!canvas) return;

    var existing = Chart.getChart(canvas);
    if (existing) existing.destroy();

    new Chart(canvas, {
        type: 'bar',
        data: {
            labels: ['Base', 'ARPU', 'Churn', 'Price', 'Spectrum', 'Net'],
            datasets: [{
                data: [base, arpuImpact, churnImpact, priceImpact, specImpact, net],
                backgroundColor: [
                    'rgba(30,73,226,0.7)',
                    arpuImpact  >= 0 ? 'rgba(0,192,174,0.7)'  : 'rgba(253,52,156,0.7)',
                    churnImpact >= 0 ? 'rgba(0,192,174,0.7)'  : 'rgba(253,52,156,0.7)',
                    priceImpact >= 0 ? 'rgba(0,192,174,0.7)'  : 'rgba(253,52,156,0.7)',
                    specImpact  >= 0 ? 'rgba(0,192,174,0.7)'  : 'rgba(253,52,156,0.7)',
                    'rgba(245,158,11,0.8)'
                ],
                borderRadius: 4,
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#111827',
                    callbacks: {
                        label: function(c) {
                            return ' ₹' + c.raw.toLocaleString('en-IN') + ' Cr';
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { color: '#9CA3AF' }
                },
                y: {
                    grid: { color: 'rgba(31,41,55,0.6)' },
                    ticks: {
                        color: '#9CA3AF',
                        callback: function(v) { return '₹' + v; }
                    }
                }
            }
        }
    });
}

function renderVolumeChart() {
    var canvas = document.getElementById('volume-chart');
    if (!canvas) return;

    var existing = Chart.getChart(canvas);
    if (existing) existing.destroy();

    var hours   = ['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23'];
    var volumes = [1.2,0.8,0.6,0.5,0.4,0.6,1.8,3.2,4.8,5.4,5.8,5.6,5.2,5.4,5.8,6.1,6.4,6.2,5.8,5.4,4.8,4.2,3.6,3.1];

    new Chart(canvas, {
        type: 'bar',
        data: {
            labels: hours.map(function(h) { return h + ':00'; }),
            datasets: [{
                label: 'Records (M)',
                data: volumes,
                backgroundColor: 'rgba(0,184,245,0.4)',
                borderColor: '#00B8F5',
                borderWidth: 1,
                borderRadius: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            resizeDelay: 200,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#111111',
                    callbacks: {
                        label: function(c) { return ' ' + c.raw + 'M records'; }
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { color: '#9CA3AF', maxRotation: 0, maxTicksLimit: 8 }
                },
                y: {
                    grid: { color: 'rgba(31,41,55,0.6)' },
                    ticks: {
                        color: '#9CA3AF',
                        callback: function(v) { return v + 'M'; }
                    }
                }
            }
        }
    });
}

function updateChartsTheme(isLight) {
    var gridColor     = isLight ? 'rgba(0,0,0,0.08)'  : 'rgba(31,41,55,0.6)';
    var tickColor     = isLight ? '#475569'            : '#9CA3AF';
    var tooltipBg     = isLight ? '#FFFFFF'            : '#111111';

    var arpuCanvas = document.getElementById('arpu-chart');
    if (arpuCanvas) {
        var c1 = Chart.getChart(arpuCanvas);
        if (c1) {
            c1.options.scales.x.grid.color  = gridColor;
            c1.options.scales.y.grid.color  = gridColor;
            c1.options.scales.x.ticks.color = tickColor;
            c1.options.scales.y.ticks.color = tickColor;
            c1.options.plugins.tooltip.backgroundColor = tooltipBg;
            c1.options.plugins.legend.labels.color = tickColor;
            c1.update();
        }
    }

    var compCanvas = document.getElementById('competitor-chart');
    if (compCanvas) {
        var c2 = Chart.getChart(compCanvas);
        if (c2) {
            c2.options.scales.x.grid.color  = gridColor;
            c2.options.scales.x.ticks.color = tickColor;
            c2.options.scales.y.ticks.color = tickColor;
            c2.options.plugins.tooltip.backgroundColor = tooltipBg;
            c2.update();
        }
    }
}
