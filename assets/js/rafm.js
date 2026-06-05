/* ============================================================
   MERIDIAN V2 · RAFM
   Screen 2: RAFM Risk Monitor
   ============================================================ */

function initRafm() {
    var interconnect = document.getElementById('interconnect-list');
    var roaming      = document.getElementById('roaming-list');
    if (!interconnect || !roaming) return;

    interconnect.innerHTML = RAFM_ALERTS.filter(function(a) {
        return a.type.includes('INTERCONNECT');
    }).map(function(alert) {
        return buildAlertItemWithRaise(alert);
    }).join('') || '<div style="padding:24px;text-align:center;color:var(--text-muted);">No active alerts</div>';

    roaming.innerHTML = RAFM_ALERTS.filter(function(a) {
        return a.type.includes('ROAMING');
    }).map(function(alert) {
        return buildAlertItemWithRaise(alert);
    }).join('') || '<div style="padding:24px;text-align:center;color:var(--text-muted);">No active alerts</div>';

    renderVendorHeatmap();
}

function buildAlertItem(alert) {
    var color = getSeverityColor(alert.severity);
    return '<div class="alert-item" onclick="openModal(\'' + alert.id + '\')">' +
        '<div class="alert-severity-bar" style="background:' + color + '"></div>' +
        '<div class="alert-content">' +
            '<div class="alert-title">' + alert.title + '</div>' +
            '<div class="alert-description">' + alert.description.substring(0, 90) + '...</div>' +
            '<div class="alert-meta"><span class="badge badge-' + alert.severity + '">' + alert.severity.toUpperCase() + '</span><span>' + alert.detectedAt + '</span></div>' +
        '</div>' +
        '<div class="alert-amount" style="color:' + color + '">' + alert.amount + '</div>' +
        '<div class="alert-arrow">›</div>' +
    '</div>';
}

function buildAlertItemWithRaise(alert) {
    var color = getSeverityColor(alert.severity);
    return '<div class="alert-item">' +
        '<div class="alert-severity-bar" style="background:' + color + '"></div>' +
        '<div class="alert-content" onclick="openModal(\'' + alert.id + '\')" style="cursor:pointer;flex:1;">' +
            '<div class="alert-title">' + alert.title + '</div>' +
            '<div class="alert-description">' + alert.description.substring(0, 90) + '...</div>' +
            '<div class="alert-meta"><span class="badge badge-' + alert.severity + '">' + alert.severity.toUpperCase() + '</span><span>' + alert.detectedAt + '</span></div>' +
        '</div>' +
        '<div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px;padding:12px;">' +
            '<div class="alert-amount" style="color:' + color + '">' + alert.amount + '</div>' +
            '<button onclick="openRaiseIssueModal(\'RAFM Alert\',\'' + alert.title.replace(/'/g,"\\'") + '\',\'' + alert.description.substring(0,100).replace(/'/g,"\\'") + '\',\'' + alert.severity + '\')" ' +
                'style="font-size:10px;padding:3px 10px;background:' + color + '18;border:1px solid ' + color + '44;border-radius:4px;color:' + color + ';cursor:pointer;white-space:nowrap;">Raise Issue</button>' +
        '</div>' +
    '</div>';
}

function renderVendorHeatmap() {
    var heatmap = document.getElementById('vendor-heatmap');
    if (!heatmap) return;

    heatmap.innerHTML = VENDOR_DATA.map(function(v) {
        var color = v.score < 31 ? '#FD349C' : v.score < 51 ? '#F59E0B' : '#00C0AE';
        var bg    = v.score < 31 ? 'rgba(253,52,156,0.1)' : v.score < 51 ? 'rgba(245,158,11,0.1)' : 'rgba(0,192,174,0.08)';
        return '<div onclick="openVendorModal(\'' + v.name + '\',' + v.score + ',\'' + v.exposure + '\',\'' + v.issue + '\')" ' +
            'style="background:' + bg + ';border:1px solid ' + color + '44;border-radius:8px;padding:10px 8px;cursor:pointer;transition:all 0.15s;" ' +
            'onmouseover="this.style.transform=\'translateY(-2px)\'" onmouseout="this.style.transform=\'none\'">' +
            '<div style="font-family:var(--font-mono);font-size:18px;font-weight:700;color:' + color + ';text-align:center;">' + v.score + '</div>' +
            '<div style="font-size:9px;color:var(--text-secondary);text-align:center;margin-top:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="' + v.name + '">' + v.name.split(' ')[0] + '</div>' +
            '<div style="font-size:10px;color:var(--text-secondary);text-align:center;font-family:var(--font-mono);">' + v.exposure + '</div>' +
        '</div>';
    }).join('');
}