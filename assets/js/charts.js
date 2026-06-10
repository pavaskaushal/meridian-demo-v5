/* ============================================================
   MERIDIAN V5 · CHARTS
   Chart.js interactive charts — hover tooltips, trackable points
   ============================================================ */

var _arpuChartInstance = null;
var _compChartInstance = null;

function _destroyARPUChart() {
    if (_arpuChartInstance) { _arpuChartInstance.destroy(); _arpuChartInstance = null; }
    if (_compChartInstance) { _compChartInstance.destroy(); _compChartInstance = null; }
}

/* ── ARPU TREND LINE CHART (Chart.js) ───────────────────── */
function renderTrendSVG() {
    var container = document.getElementById('arpu-chart-container');
    if (!container) return;

    _destroyARPUChart();

    var months = ARPU_CHART_DATA.months;       // 15 labels
    var hist   = ARPU_CHART_DATA.historical;   // 12 values
    var fore   = ARPU_CHART_DATA.forecast;     // 3 values

    // Historical dataset: 12 real + 3 nulls
    var histData = hist.concat([null, null, null]);
    // Forecast dataset: 11 nulls + last historical point (join) + 3 forecast
    var foreData = [];
    for (var i = 0; i < hist.length - 1; i++) foreData.push(null);
    foreData.push(hist[hist.length - 1]);
    foreData = foreData.concat(fore);

    // Forecast background plugin — shades the forecast zone
    var forecastZonePlugin = {
        id: 'forecastZone',
        beforeDraw: function(chart) {
            var ctx  = chart.ctx;
            var xAxis = chart.scales.x;
            var yAxis = chart.scales.y;
            var startX = xAxis.getPixelForValue(hist.length - 1);
            var endX   = xAxis.right;
            ctx.save();
            ctx.fillStyle = 'rgba(0, 184, 245, 0.04)';
            ctx.fillRect(startX, yAxis.top, endX - startX, yAxis.bottom - yAxis.top);
            // Vertical divider line
            ctx.beginPath();
            ctx.moveTo(startX, yAxis.top);
            ctx.lineTo(startX, yAxis.bottom);
            ctx.strokeStyle = 'rgba(0, 184, 245, 0.25)';
            ctx.lineWidth = 1;
            ctx.setLineDash([4, 4]);
            ctx.stroke();
            ctx.setLineDash([]);
            // "AI FORECAST" label
            ctx.font = '600 9px DM Sans, sans-serif';
            ctx.fillStyle = '#00B8F5';
            ctx.letterSpacing = '1px';
            ctx.fillText('AI FORECAST', startX + 8, yAxis.top + 14);
            ctx.restore();
        }
    };

    container.innerHTML = '<canvas id="arpu-trend-canvas" style="width:100%;height:100%;"></canvas>';
    var canvas = document.getElementById('arpu-trend-canvas');
    if (!canvas) return;

    var isLight = document.body.classList.contains('light-mode');
    var gridColor  = isLight ? 'rgba(0,0,0,0.06)'  : 'rgba(255,255,255,0.06)';
    var tickColor  = isLight ? '#475569'            : '#6B7280';
    var tooltipBg  = isLight ? '#FFFFFF'            : '#111111';
    var tooltipTxt = isLight ? '#0F172A'            : '#F9FAFB';

    _arpuChartInstance = new Chart(canvas, {
        type: 'line',
        plugins: [forecastZonePlugin],
        data: {
            labels: months,
            datasets: [
                {
                    label: 'Historical ARPU',
                    data: histData,
                    borderColor: '#00C0AE',
                    backgroundColor: function(ctx) {
                        var chart = ctx.chart;
                        var _a = chart.ctx, chartArea = chart.chartArea;
                        if (!chartArea) return 'transparent';
                        var gradient = _a.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                        gradient.addColorStop(0,   'rgba(0, 192, 174, 0.18)');
                        gradient.addColorStop(1,   'rgba(0, 192, 174, 0.00)');
                        return gradient;
                    },
                    borderWidth: 2.5,
                    pointRadius: 4,
                    pointHoverRadius: 7,
                    pointBackgroundColor: '#00C0AE',
                    pointBorderColor: '#0D0D0D',
                    pointBorderWidth: 1.5,
                    pointHoverBackgroundColor: '#00C0AE',
                    pointHoverBorderColor: '#FFFFFF',
                    pointHoverBorderWidth: 2,
                    fill: true,
                    tension: 0.35,
                    spanGaps: false
                },
                {
                    label: 'AI Forecast',
                    data: foreData,
                    borderColor: '#00B8F5',
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    borderDash: [6, 4],
                    pointRadius: 4,
                    pointHoverRadius: 7,
                    pointBackgroundColor: '#00B8F5',
                    pointBorderColor: '#0D0D0D',
                    pointBorderWidth: 1.5,
                    pointHoverBackgroundColor: '#00B8F5',
                    pointHoverBorderColor: '#FFFFFF',
                    pointHoverBorderWidth: 2,
                    fill: false,
                    tension: 0.35,
                    spanGaps: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            animation: { duration: 600, easing: 'easeInOutQuart' },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    align: 'end',
                    labels: {
                        color: tickColor,
                        font: { size: 11, family: 'DM Sans, sans-serif' },
                        boxWidth: 24,
                        boxHeight: 2,
                        padding: 16,
                        usePointStyle: false
                    }
                },
                tooltip: {
                    backgroundColor: tooltipBg,
                    titleColor: tickColor,
                    bodyColor: tooltipTxt,
                    borderColor: 'rgba(255,255,255,0.12)',
                    borderWidth: 1,
                    padding: 12,
                    titleFont: { size: 11, family: 'DM Sans, sans-serif', weight: '600' },
                    bodyFont: { size: 13, family: 'IBM Plex Mono, monospace', weight: '700' },
                    callbacks: {
                        title: function(items) { return items[0].label; },
                        label: function(item) {
                            if (item.raw === null) return null;
                            return ' ' + item.dataset.label + ':  ₹' + item.raw;
                        },
                        afterBody: function(items) {
                            var idx = items[0].dataIndex;
                            if (idx > 0 && histData[idx] !== null && histData[idx-1] !== null) {
                                var delta = (histData[idx] - histData[idx-1]).toFixed(1);
                                return [delta >= 0 ? ' ▲ +₹' + delta + ' MoM' : ' ▼ ₹' + delta + ' MoM'];
                            }
                            return [];
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { color: gridColor, lineWidth: 1 },
                    ticks: {
                        color: function(ctx) {
                            return ctx.index >= hist.length ? '#00B8F5' : tickColor;
                        },
                        font: { size: 10, family: 'DM Sans, sans-serif' },
                        maxRotation: 0
                    },
                    border: { color: 'transparent' }
                },
                y: {
                    min: 155,
                    max: 200,
                    grid: { color: gridColor, lineWidth: 1 },
                    ticks: {
                        color: tickColor,
                        font: { size: 10, family: 'IBM Plex Mono, monospace' },
                        callback: function(v) { return '₹' + v; },
                        stepSize: 5
                    },
                    border: { color: 'transparent' }
                }
            }
        }
    });
}

/* ── COMPETITOR HORIZONTAL BAR CHART (Chart.js) ─────────── */
function renderCompetitorSVG() {
    var container = document.getElementById('arpu-chart-container');
    if (!container) return;

    _destroyARPUChart();

    var data = COMPETITOR_DATA.slice().sort(function(a, b) { return b.arpu - a.arpu; });

    container.innerHTML = '<canvas id="arpu-comp-canvas" style="width:100%;height:100%;"></canvas>';
    var canvas = document.getElementById('arpu-comp-canvas');
    if (!canvas) return;

    var isLight   = document.body.classList.contains('light-mode');
    var gridColor = isLight ? 'rgba(0,0,0,0.06)'  : 'rgba(255,255,255,0.06)';
    var tickColor = isLight ? '#475569'            : '#6B7280';
    var tooltipBg = isLight ? '#FFFFFF'            : '#111111';
    var tooltipTxt= isLight ? '#0F172A'            : '#F9FAFB';

    var bgColors    = data.map(function(d) { return d.isUs ? 'rgba(0,192,174,0.20)' : 'rgba(55,65,81,0.25)'; });
    var borderColors= data.map(function(d) { return d.isUs ? '#00C0AE' : '#374151'; });

    _compChartInstance = new Chart(canvas, {
        type: 'bar',
        data: {
            labels: data.map(function(d) { return d.name; }),
            datasets: [{
                label: 'Blended ARPU (₹/month)',
                data: data.map(function(d) { return d.arpu; }),
                backgroundColor: bgColors,
                borderColor: borderColors,
                borderWidth: 1.5,
                borderRadius: 3,
                hoverBackgroundColor: data.map(function(d) { return d.isUs ? 'rgba(0,192,174,0.40)' : 'rgba(55,65,81,0.45)'; })
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 500, easing: 'easeInOutQuart' },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: tooltipBg,
                    titleColor: tickColor,
                    bodyColor: tooltipTxt,
                    borderColor: 'rgba(255,255,255,0.12)',
                    borderWidth: 1,
                    padding: 12,
                    titleFont: { size: 11, family: 'DM Sans, sans-serif' },
                    bodyFont: { size: 13, family: 'IBM Plex Mono, monospace', weight: '700' },
                    callbacks: {
                        label: function(item) {
                            var d = data[item.dataIndex];
                            return '  ARPU: ₹' + item.raw + (d.isUs ? '  ← Apex Telecom' : '');
                        }
                    }
                }
            },
            scales: {
                x: {
                    min: 0, max: 220,
                    grid: { color: gridColor },
                    ticks: {
                        color: tickColor,
                        font: { size: 10, family: 'IBM Plex Mono, monospace' },
                        callback: function(v) { return '₹' + v; },
                        stepSize: 50
                    },
                    border: { color: 'transparent' }
                },
                y: {
                    grid: { display: false },
                    ticks: {
                        color: function(ctx) {
                            return data[ctx.index] && data[ctx.index].isUs ? '#00C0AE' : tickColor;
                        },
                        font: { size: 12, family: 'DM Sans, sans-serif', weight: '600' }
                    },
                    border: { color: 'transparent' }
                }
            }
        }
    });
}

/* ── ENTRY POINT called by initDashboard ────────────────── */
function renderCharts() {
    renderTrendSVG();
    // Competitor view rendered lazily via toggleARPUView()
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