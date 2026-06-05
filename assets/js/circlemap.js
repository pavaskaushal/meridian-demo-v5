/* ============================================================
   MERIDIAN V3 · INDIA CIRCLE MAP — BUBBLE CHART
   Bubble size = subscribers · Colour = metric · Click for detail
   ============================================================ */

var CIRCLE_MAP_METRIC = 'arpu';

var CIRCLE_DATA_FULL = [
    { id: 'MH', name: 'Maharashtra',      arpu: 184, churn: 1.3, revenue: 380, subscribers: 22.3 },
    { id: 'MU', name: 'Mumbai',           arpu: 198, churn: 1.1, revenue: 520, subscribers: 28.4 },
    { id: 'DL', name: 'Delhi NCR',        arpu: 192, churn: 1.2, revenue: 480, subscribers: 26.8 },
    { id: 'KA', name: 'Karnataka',        arpu: 181, churn: 1.4, revenue: 340, subscribers: 20.4 },
    { id: 'TN', name: 'Tamil Nadu',       arpu: 178, churn: 1.4, revenue: 310, subscribers: 18.9 },
    { id: 'AP', name: 'Andhra Pradesh',   arpu: 175, churn: 1.5, revenue: 290, subscribers: 17.9 },
    { id: 'GJ', name: 'Gujarat',          arpu: 174, churn: 1.5, revenue: 270, subscribers: 16.8 },
    { id: 'RJ', name: 'Rajasthan',        arpu: 162, churn: 1.8, revenue: 180, subscribers: 12.0 },
    { id: 'UP', name: 'UP West',          arpu: 161, churn: 1.8, revenue: 170, subscribers: 11.4 },
    { id: 'UE', name: 'UP East',          arpu: 158, churn: 1.9, revenue: 160, subscribers: 10.9 },
    { id: 'BR', name: 'Bihar',            arpu: 154, churn: 2.1, revenue: 140, subscribers: 9.8  },
    { id: 'WB', name: 'West Bengal',      arpu: 168, churn: 1.6, revenue: 220, subscribers: 14.2 },
    { id: 'OR', name: 'Odisha',           arpu: 159, churn: 1.7, revenue: 150, subscribers: 10.2 },
    { id: 'MP', name: 'Madhya Pradesh',   arpu: 163, churn: 1.7, revenue: 185, subscribers: 12.3 },
    { id: 'KL', name: 'Kerala',           arpu: 176, churn: 1.4, revenue: 240, subscribers: 14.8 },
    { id: 'PB', name: 'Punjab',           arpu: 171, churn: 1.5, revenue: 195, subscribers: 12.4 },
    { id: 'HR', name: 'Haryana',          arpu: 169, churn: 1.6, revenue: 188, subscribers: 12.1 },
    { id: 'HP', name: 'Himachal Pradesh', arpu: 158, churn: 1.8, revenue: 98,  subscribers: 6.7  },
    { id: 'JK', name: 'J&K',             arpu: 152, churn: 2.0, revenue: 82,  subscribers: 5.8  },
    { id: 'NE', name: 'North East',       arpu: 148, churn: 2.2, revenue: 76,  subscribers: 5.5  },
    { id: 'AS', name: 'Assam',            arpu: 151, churn: 2.1, revenue: 88,  subscribers: 6.3  },
    { id: 'CH', name: 'Chhattisgarh',     arpu: 157, churn: 1.9, revenue: 112, subscribers: 7.7  }
];

function getMetricValue(circle, metric) {
    if (metric === 'arpu')    return circle.arpu;
    if (metric === 'churn')   return circle.churn;
    if (metric === 'revenue') return circle.revenue;
    return circle.arpu;
}

function getColor(value, metric) {
    if (metric === 'arpu') {
        if (value >= 185) return '#00C0AE';
        if (value >= 175) return '#1E49E2';
        if (value >= 165) return '#00B8F5';
        if (value >= 155) return '#F59E0B';
        return '#FD349C';
    }
    if (metric === 'churn') {
        if (value <= 1.3) return '#00C0AE';
        if (value <= 1.5) return '#1E49E2';
        if (value <= 1.7) return '#F59E0B';
        if (value <= 1.9) return '#F97316';
        return '#FD349C';
    }
    if (metric === 'revenue') {
        if (value >= 400) return '#00C0AE';
        if (value >= 250) return '#1E49E2';
        if (value >= 150) return '#00B8F5';
        if (value >= 100) return '#F59E0B';
        return '#FD349C';
    }
    return '#1E49E2';
}

function getLegend(metric) {
    if (metric === 'arpu') return [
        { color: '#00C0AE', label: '₹185+' },
        { color: '#1E49E2', label: '₹175–184' },
        { color: '#00B8F5', label: '₹165–174' },
        { color: '#F59E0B', label: '₹155–164' },
        { color: '#FD349C', label: '<₹155' }
    ];
    if (metric === 'churn') return [
        { color: '#00C0AE', label: '≤1.3%' },
        { color: '#1E49E2', label: '1.4–1.5%' },
        { color: '#F59E0B', label: '1.6–1.7%' },
        { color: '#F97316', label: '1.8–1.9%' },
        { color: '#FD349C', label: '≥2.0%' }
    ];
    return [
        { color: '#00C0AE', label: '₹400+ Cr' },
        { color: '#1E49E2', label: '₹250–400 Cr' },
        { color: '#00B8F5', label: '₹150–250 Cr' },
        { color: '#F59E0B', label: '₹100–150 Cr' },
        { color: '#FD349C', label: '<₹100 Cr' }
    ];
}

function circleMapMetric(metric) {
    CIRCLE_MAP_METRIC = metric;
    renderCircleMap();
}

function renderCircleMap() {
    var container = document.getElementById('india-circle-map');
    if (!container) return;

    var metric    = CIRCLE_MAP_METRIC;
    var legend    = getLegend(metric);
    var svgW      = 620;
    var svgH      = 480;

    // Sort by metric value descending for layout
    var sorted = CIRCLE_DATA_FULL.slice().sort(function(a, b) {
        return getMetricValue(b, metric) - getMetricValue(a, metric);
    });

    // Scale bubble radius by subscribers (min 18, max 48)
    var minSub = Math.min.apply(null, sorted.map(function(c) { return c.subscribers; }));
    var maxSub = Math.max.apply(null, sorted.map(function(c) { return c.subscribers; }));

    function bubbleR(sub) {
        return 18 + ((sub - minSub) / (maxSub - minSub)) * 30;
    }

    // Layout: pack into rows by sorted order
    var positions = [];
    var padding   = 8;
    var x = 0, y = 0, rowH = 0;
    var margin = 24;

    sorted.forEach(function(c) {
        var r = bubbleR(c.subscribers);
        if (x + r * 2 + margin > svgW && x > 0) {
            x = 0;
            y += rowH + padding;
            rowH = 0;
        }
        positions.push({ c: c, cx: x + r + margin, cy: y + r + margin, r: r });
        x += r * 2 + padding + margin;
        rowH = Math.max(rowH, r * 2);
    });

    var bubbles = positions.map(function(p) {
        var val   = getMetricValue(p.c, metric);
        var color = getColor(val, metric);
        var label = metric === 'arpu' ? '₹' + val : metric === 'churn' ? val + '%' : '₹' + val;
        var fs    = p.r > 30 ? 10 : p.r > 24 ? 9 : 8;

        return '<g style="cursor:pointer;" onclick="showCircleDetail(\'' + p.c.id + '\')">' +
            '<circle cx="' + p.cx + '" cy="' + p.cy + '" r="' + p.r + '" ' +
                'fill="' + color + '18" stroke="' + color + '" stroke-width="2" ' +
                'style="transition:all 0.2s ease;"/>' +
            '<text x="' + p.cx + '" y="' + (p.cy - 5) + '" text-anchor="middle" ' +
                'font-size="' + fs + '" font-weight="700" fill="' + color + '" font-family="DM Sans,sans-serif">' + p.c.id + '</text>' +
            '<text x="' + p.cx + '" y="' + (p.cy + 7) + '" text-anchor="middle" ' +
                'font-size="' + (fs - 1) + '" fill="' + color + '" font-family="DM Sans,sans-serif">' + label + '</text>' +
        '</g>';
    }).join('');

    // Legend
    var legendItems = legend.map(function(l, i) {
        return '<g transform="translate(' + (i * 110) + ',0)">' +
            '<circle cx="7" cy="7" r="6" fill="' + l.color + '33" stroke="' + l.color + '" stroke-width="1.5"/>' +
            '<text x="18" y="11" font-size="10" fill="#8A9BB0" font-family="DM Sans,sans-serif">' + l.label + '</text>' +
        '</g>';
    }).join('');

    // Size legend
    var sizeLegend =
        '<g transform="translate(0,20)">' +
            '<circle cx="8" cy="8" r="6" fill="none" stroke="#4A5568" stroke-width="1" stroke-dasharray="2"/>' +
            '<circle cx="30" cy="8" r="10" fill="none" stroke="#4A5568" stroke-width="1" stroke-dasharray="2"/>' +
            '<circle cx="58" cy="8" r="14" fill="none" stroke="#4A5568" stroke-width="1" stroke-dasharray="2"/>' +
            '<text x="75" y="12" font-size="10" fill="#4A5568" font-family="DM Sans,sans-serif">Bubble size = Subscribers</text>' +
        '</g>';

    var lastY = Math.max.apply(null, positions.map(function(p) { return p.cy + p.r; })) + 20;

    container.innerHTML =
        '<svg viewBox="0 0 ' + svgW + ' ' + (lastY + 60) + '" style="width:100%;">' +
            bubbles +
            '<g transform="translate(0,' + (lastY + 4) + ')">' + legendItems + '</g>' +
            '<g transform="translate(0,' + (lastY + 28) + ')">' + sizeLegend + '</g>' +
        '</svg>';

    showCircleDetail('MU');
}

function showCircleDetail(id) {
    var circle = CIRCLE_DATA_FULL.find(function(c) { return c.id === id; });
    if (!circle) return;

    var panel = document.getElementById('circle-detail-panel');
    if (!panel) return;

    var churnColor = circle.churn <= 1.3 ? '#00C0AE' : circle.churn <= 1.5 ? '#1E49E2' : circle.churn <= 1.7 ? '#F59E0B' : '#FD349C';
    var arpuColor  = circle.arpu >= 185 ? '#00C0AE' : circle.arpu >= 175 ? '#1E49E2' : circle.arpu >= 165 ? '#00B8F5' : '#F59E0B';

    panel.innerHTML =
        '<div style="background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-sm);padding:16px;">' +
            '<div style="font-size:11px;font-weight:700;letter-spacing:1.5px;color:var(--text-muted);text-transform:uppercase;margin-bottom:4px;">Selected Circle</div>' +
            '<div style="font-size:16px;font-weight:700;color:var(--text-primary);margin-bottom:16px;">' + circle.name + '</div>' +
            kpiRow('ARPU', '₹' + circle.arpu + '/mo', arpuColor) +
            kpiRow('Monthly Churn', circle.churn + '%', churnColor) +
            kpiRow('Revenue', '₹' + circle.revenue + ' Cr', '#00B8F5') +
            kpiRow('Subscribers', circle.subscribers + 'M', '#B497FF') +
        '</div>' +
        '<div style="margin-top:12px;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius-sm);padding:12px;">' +
            '<div style="font-size:10px;font-weight:700;letter-spacing:1.5px;color:var(--text-muted);text-transform:uppercase;margin-bottom:8px;">vs National Average</div>' +
            vsRow('ARPU', circle.arpu, 170, '₹') +
            vsRow('Churn', circle.churn, 1.65, '%', true) +
        '</div>';
}

function vsRow(label, val, avg, unit, lowerBetter) {
    var diff    = val - avg;
    var good    = lowerBetter ? diff < 0 : diff > 0;
    var color   = good ? '#00C0AE' : '#FD349C';
    var sign    = diff > 0 ? '+' : '';
    return '<div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid var(--border);">' +
        '<span style="font-size:11px;color:var(--text-muted);">' + label + '</span>' +
        '<span style="font-size:12px;font-weight:700;color:' + color + ';">' + sign + Math.round(diff * 10) / 10 + unit + ' vs avg</span>' +
    '</div>';
}

function kpiRow(label, value, color) {
    return '<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--border);">' +
        '<span style="font-size:11px;color:var(--text-muted);">' + label + '</span>' +
        '<span style="font-size:13px;font-weight:700;color:' + color + ';">' + value + '</span>' +
    '</div>';
}