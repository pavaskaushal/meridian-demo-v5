/* ============================================================
   MERIDIAN V5 · RAFM RISK MONITOR
   ============================================================ */

function initRafm() {
    renderRafmSummaryStrip();

    var interconnect = document.getElementById('interconnect-list');
    var roaming      = document.getElementById('roaming-list');
    if (!interconnect || !roaming) return;

    interconnect.innerHTML = RAFM_ALERTS.filter(function(a) {
        var cat = (a.category || a.type || '').toUpperCase();
        return cat.includes('INTERCONNECT');
    }).map(buildAlertCard).join('') ||
        '<div style="padding:24px;text-align:center;color:var(--text-muted);font-size:12px;">No active alerts</div>';

    roaming.innerHTML = RAFM_ALERTS.filter(function(a) {
        var cat = (a.category || a.type || '').toUpperCase();
        return cat.includes('ROAMING');
    }).map(buildAlertCard).join('') ||
        '<div style="padding:24px;text-align:center;color:var(--text-muted);font-size:12px;">No active alerts</div>';

    renderVendorHeatmap();
}

/* ── Summary strip — 4 headline numbers ───────────────────── */
function renderRafmSummaryStrip() {
    var el = document.getElementById('rafm-summary-strip');
    if (!el) return;

    var alerts    = window.RAFM_ALERTS || [];
    var critical  = alerts.filter(function(a) { return (a.severity||'').toUpperCase() === 'CRITICAL'; });
    var high      = alerts.filter(function(a) { return (a.severity||'').toUpperCase() === 'HIGH'; });

    var totalExp  = alerts.reduce(function(sum, a) {
        var n = parseFloat((a.amount||'').replace(/[₹,Cr\s]/g,''));
        return sum + (isNaN(n) ? 0 : n);
    }, 0).toFixed(1);

    var avgAge    = alerts.length
        ? Math.round(alerts.reduce(function(s,a){ return s + (a.age||0); }, 0) / alerts.length)
        : 0;

    var metrics = [
        { label: 'TOTAL EXPOSURE',   value: '₹' + totalExp + ' Cr', color: '#FD349C' },
        { label: 'CRITICAL ALERTS',  value: critical.length,          color: '#FD349C' },
        { label: 'HIGH ALERTS',      value: high.length,              color: '#F59E0B' },
        { label: 'AVG AGE (DAYS)',    value: avgAge + 'd',             color: '#00B8F5' },
    ];

    el.innerHTML = metrics.map(function(m) {
        return '<div style="flex:1;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-sm);padding:12px 16px;">' +
            '<div style="font-family:var(--font-mono);font-size:9px;font-weight:700;letter-spacing:1px;color:var(--text-muted);margin-bottom:6px;">' + m.label + '</div>' +
            '<div style="font-family:var(--font-mono);font-size:22px;font-weight:700;color:' + m.color + ';">' + m.value + '</div>' +
        '</div>';
    }).join('');
}

/* ── Enriched alert card ───────────────────────────────────── */
function buildAlertCard(alert) {
    var sev   = (alert.severity || '').toLowerCase();
    var color = getSeverityColor(sev);

    // Exposure bar width
    var expNum = parseFloat((alert.amount||'').replace(/[₹,Cr\s]/g,'')) || 0;
    var maxExp = 5; // Cr — scale bar against 5 Cr max
    var barW   = Math.min(Math.round((expNum / maxExp) * 100), 100);

    return '<div class="alert-item" style="flex-direction:column;align-items:stretch;padding:0;margin-bottom:8px;border-radius:var(--radius-sm);border:1px solid var(--border);">' +
        // Header row
        '<div style="display:flex;align-items:flex-start;gap:12px;padding:14px 16px 10px;">' +
            
            '<div style="flex:1;min-width:0;">' +
                '<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">' +
                    '<div class="alert-title" onclick="openModal(\'' + alert.id + '\')" style="cursor:pointer;flex:1;">' + alert.title + '</div>' +
                    '<div style="font-family:var(--font-mono);font-size:16px;font-weight:700;color:' + color + ';flex-shrink:0;">' + alert.amount + '</div>' +
                '</div>' +
                '<div class="alert-description">' + alert.description.substring(0, 100) + '...</div>' +
            '</div>' +
        '</div>' +
        // Exposure bar
        '<div style="padding:6px 16px;border-top:1px solid var(--border);">' +
            '<div style="display:flex;justify-content:space-between;margin-bottom:3px;">' +
                '<span style="font-family:var(--font-mono);font-size:9px;color:var(--text-muted);">EXPOSURE</span>' +
                '<span style="font-family:var(--font-mono);font-size:9px;color:' + color + ';">' + alert.amount + '</span>' +
            '</div>' +
            '<div style="height:2px;background:var(--border);border-radius:2px;">' +
                '<div style="height:2px;background:' + color + ';border-radius:2px;width:' + barW + '%;transition:width 0.6s ease;"></div>' +
            '</div>' +
        '</div>' +
        // Meta row
        '<div style="display:flex;align-items:center;gap:12px;padding:8px 16px;border-top:1px solid var(--border);background:rgba(255,255,255,0.02);">' +
            '<span style="font-family:var(--font-mono);font-size:9px;font-weight:700;color:var(--text-muted);letter-spacing:0.5px;">' + sev.toUpperCase() + '</span>' +
            '<span style="font-family:var(--font-mono);font-size:9px;color:var(--text-muted);">⏱ ' + (alert.age||0) + 'd open</span>' +
            '<span style="font-family:var(--font-mono);font-size:9px;color:var(--text-muted);">⊙ ' + (alert.circle||'—') + '</span>' +
            '<span style="font-family:var(--font-mono);font-size:9px;color:var(--text-muted);">👤 ' + (alert.owner||'—') + '</span>' +
            '<div style="flex:1;"></div>' +
            '<button onclick="openRaiseIssueModal(\'RAFM Alert\',\'' + alert.title.replace(/'/g,"\\'") + '\',\'' + alert.description.substring(0,100).replace(/'/g,"\\'") + '\',\'' + alert.severity + '\')" ' +
                'style="font-size:10px;padding:3px 10px;background:transparent;border:1px solid var(--border-light);border-radius:4px;color:var(--text-muted);cursor:pointer;white-space:nowrap;font-family:var(--font-mono);">Raise Issue</button>' +
        '</div>' +
        '</div>';
}

/* ── Vendor heatmap — enriched tiles ──────────────────────── */
function renderVendorHeatmap() {
    var heatmap = document.getElementById('vendor-heatmap');
    if (!heatmap) return;

    heatmap.innerHTML = VENDOR_DATA.map(function(v) {
        var score    = v.score != null ? v.score : (100 - (v.risk || 50));
        var exposure = v.exposure || (v.spend != null ? '₹' + v.spend + ' Cr' : '');
        var issue    = v.issue || v.status || v.category || '';
        var color    = score < 31 ? '#FD349C' : score < 51 ? '#F59E0B' : '#00C0AE';
        var bg       = score < 31 ? 'rgba(253,52,156,0.08)' : score < 51 ? 'rgba(245,158,11,0.08)' : 'rgba(0,192,174,0.06)';
        var tier     = score < 31 ? 'CRITICAL' : score < 51 ? 'MEDIUM' : score < 71 ? 'LOW' : 'SAFE';
        var trend    = score < 50 ? '↓' : '↑';

        return '<div onclick="openVendorModal(\'' + v.name + '\',' + score + ',\'' + exposure + '\',\'' + issue + '\')" ' +
            'style="background:' + bg + ';border:1px solid ' + color + '33;border-radius:var(--radius-sm);padding:12px 8px;cursor:pointer;transition:all 0.15s;" ' +
            'onmouseover="this.style.borderColor=\'' + color + '\';" onmouseout="this.style.borderColor=\'' + color + '33\';">' +
            // Score + trend
            '<div style="display:flex;align-items:baseline;justify-content:center;gap:3px;margin-bottom:3px;">' +
                '<div style="font-family:var(--font-mono);font-size:20px;font-weight:700;color:' + color + ';">' + score + '</div>' +
                '<div style="font-size:11px;color:' + color + ';opacity:0.7;">' + trend + '</div>' +
            '</div>' +
            // Vendor name
            '<div style="font-size:9px;color:var(--text-secondary);text-align:center;margin-bottom:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="' + v.name + '">' + v.name.split(' ')[0] + '</div>' +
            // Exposure
            '<div style="font-family:var(--font-mono);font-size:9px;color:var(--text-muted);text-align:center;margin-bottom:5px;">' + exposure + '</div>' +
            // Tier badge
            '<div style="font-family:var(--font-mono);font-size:8px;font-weight:700;color:' + color + ';background:' + color + '18;border:1px solid ' + color + '33;border-radius:2px;text-align:center;padding:1px 4px;letter-spacing:0.5px;">' + tier + '</div>' +
        '</div>';
    }).join('');
}