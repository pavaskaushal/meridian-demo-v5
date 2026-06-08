/* ============================================================
   MERIDIAN V2 · CONNECTOR STATUS
   Screen 5: System Health & Connectors
   ============================================================ */

function initConnectors() {
    renderConnectorSummary();
    renderConnectorTable();
    renderEngineGrid();
    renderActivityLog();
    renderVolumeChart();
    renderConnectorKPIMap();
}

function renderConnectorSummary() {
    var live    = window.CONNECTOR_DATA_LIST.filter(function(c) { return c.status === 'live'; }).length;
    var warning = window.CONNECTOR_DATA_LIST.filter(function(c) { return c.status === 'warning'; }).length;
    var error   = window.CONNECTOR_DATA_LIST.filter(function(c) { return c.status === 'error'; }).length;

    var el = document.getElementById('connector-summary');
    if (!el) return;

    el.innerHTML =
        '<div style="background:rgba(0,192,174,0.1);border:1px solid rgba(0,192,174,0.3);border-radius:8px;padding:12px 20px;display:flex;flex-direction:column;gap:2px;">' +
            '<div style="font-family:var(--font-mono);font-size:28px;font-weight:700;color:#00C0AE;">' + live + '</div>' +
            '<div style="font-size:11px;color:var(--text-muted);font-weight:600;letter-spacing:1px;text-transform:uppercase;">Live</div>' +
        '</div>' +
        '<div style="background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.3);border-radius:8px;padding:12px 20px;display:flex;flex-direction:column;gap:2px;">' +
            '<div style="font-family:var(--font-mono);font-size:28px;font-weight:700;color:#F59E0B;">' + warning + '</div>' +
            '<div style="font-size:11px;color:var(--text-muted);font-weight:600;letter-spacing:1px;text-transform:uppercase;">Warning</div>' +
        '</div>' +
        '<div style="background:rgba(253,52,156,0.1);border:1px solid rgba(253,52,156,0.3);border-radius:8px;padding:12px 20px;display:flex;flex-direction:column;gap:2px;">' +
            '<div style="font-family:var(--font-mono);font-size:28px;font-weight:700;color:#FD349C;">' + error + '</div>' +
            '<div style="font-size:11px;color:var(--text-muted);font-weight:600;letter-spacing:1px;text-transform:uppercase;">Error</div>' +
        '</div>' +
        '<div style="background:rgba(30,73,226,0.1);border:1px solid rgba(30,73,226,0.3);border-radius:8px;padding:12px 20px;display:flex;flex-direction:column;gap:2px;">' +
            '<div style="font-family:var(--font-mono);font-size:28px;font-weight:700;color:#1E49E2;">' + window.CONNECTOR_DATA_LIST.length + '</div>' +
            '<div style="font-size:11px;color:var(--text-muted);font-weight:600;letter-spacing:1px;text-transform:uppercase;">Total</div>' +
        '</div>' +
        '<div style="margin-left:auto;display:flex;flex-direction:column;align-items:flex-end;gap:4px;">' +
            '<div style="display:flex;align-items:center;gap:8px;">' +
                '<div style="width:8px;height:8px;border-radius:50%;background:#00C0AE;animation:livePulse 1.5s ease-in-out infinite alternate;"></div>' +
                '<span style="font-size:12px;font-weight:600;color:#00C0AE;">' + (warning > 0 ? warning + ' warning · ' + live + ' live' : 'All ' + live + ' connectors live') + '</span>' +
            '</div>' +
            '<div style="font-size:10px;color:var(--text-muted);font-family:var(--font-mono);">Last sync · ' + new Date().toLocaleTimeString("en-IN", {hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:false}) + ' IST</div>' +
            '<div style="font-size:10px;color:var(--text-muted);">Total records · <strong style="color:var(--text-secondary);font-family:var(--font-mono);">8.2M+</strong></div>' +
        '</div>';
}

function renderConnectorTable() {
    var tbody = document.getElementById('connector-tbody');
    if (!tbody) return;

    tbody.innerHTML = window.CONNECTOR_DATA_LIST.map(function(c) {
        var statusColor  = c.status === 'live' ? '#00C0AE' : c.status === 'warning' ? '#F59E0B' : '#FD349C';
        var statusLabel  = c.status === 'live' ? 'LIVE' : c.status === 'warning' ? 'WARNING' : 'ERROR';
        var latencyColor = parseInt(c.latency) > 100 ? '#F59E0B' : '#00C0AE';

        var raiseBtn = c.status !== 'live'
            ? '<button onclick="openRaiseIssueModal(\'Connector Warning\',\'' + c.name + '\',\'Connector ' + c.name + ' is showing ' + c.status + ' status. Last sync: ' + c.lastSync + '. Latency: ' + c.latency + '.\',\'' + (c.status === 'error' ? 'critical' : 'high') + '\')" style="font-size:10px;padding:3px 10px;background:' + statusColor + '18;border:1px solid ' + statusColor + '44;border-radius:4px;color:' + statusColor + ';cursor:pointer;">Raise Issue</button>'
            : '';

        return '<tr style="border-bottom:1px solid var(--border);transition:background 0.15s;" ' +
            'onmouseover="this.style.background=\'var(--bg-hover)\'" onmouseout="this.style.background=\'transparent\'">' +
            '<td style="padding:12px 24px;"><div style="font-size:13px;font-weight:600;color:var(--text-primary);">' + c.name + '</div></td>' +
            '<td style="padding:12px 16px;"><span style="font-size:11px;color:var(--text-muted);background:var(--bg);border:1px solid var(--border);border-radius:4px;padding:2px 8px;">' + c.type + '</span></td>' +
            '<td style="padding:12px 16px;"><div style="display:flex;align-items:center;gap:6px;"><div style="width:7px;height:7px;border-radius:50%;background:' + statusColor + ';' + (c.status === 'live' ? 'animation:livePulse 1.5s ease-in-out infinite alternate;' : '') + '"></div><span style="font-size:11px;font-weight:700;color:' + statusColor + ';letter-spacing:0.5px;">' + statusLabel + '</span></div></td>' +
            '<td style="padding:12px 16px;font-size:12px;color:var(--text-secondary);font-family:var(--font-mono);">' + c.lastSync + '</td>' +
            '<td style="padding:12px 16px;text-align:right;font-size:12px;color:var(--text-primary);font-family:var(--font-mono);">' + c.records + '</td>' +
            '<td style="padding:12px 16px;text-align:right;font-family:var(--font-mono);font-size:12px;font-weight:600;color:' + latencyColor + ';">' + c.latency + '</td>' +
            '<td style="padding:12px 24px;text-align:right;font-family:var(--font-mono);font-size:12px;color:var(--text-secondary);">' + c.uptime + '</td>' +
            '<td style="padding:12px 24px;text-align:right;">' + raiseBtn + '</td>' +
        '</tr>';
    }).join('');
}

function renderEngineGrid() {
    var grid = document.getElementById('engine-grid');
    if (!grid) return;

    grid.innerHTML = window.ENGINE_DATA.map(function(e) {
        var color = e.status === 'live' ? '#00C0AE' : '#F59E0B';
        return '<div style="background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:16px;border-left:3px solid ' + color + ';">' +
            '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;">' +
                '<div style="font-size:12px;font-weight:600;color:var(--text-primary);">' + e.name + '</div>' +
                '<div style="width:7px;height:7px;border-radius:50%;background:' + color + ';margin-top:3px;' + (e.status === 'live' ? 'animation:livePulse 1.5s ease-in-out infinite alternate;' : '') + '"></div>' +
            '</div>' +
            '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;">' +
                '<div><div style="font-size:9px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:2px;">Uptime</div><div style="font-family:var(--font-mono);font-size:13px;font-weight:700;color:' + color + ';">' + e.uptime + '</div></div>' +
                '<div><div style="font-size:9px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:2px;">Latency</div><div style="font-family:var(--font-mono);font-size:13px;font-weight:700;color:var(--text-primary);">' + e.latency + '</div></div>' +
                '<div><div style="font-size:9px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:2px;">Throughput</div><div style="font-family:var(--font-mono);font-size:11px;font-weight:700;color:var(--text-primary);">' + e.throughput + '</div></div>' +
            '</div>' +
        '</div>';
    }).join('');
}

function renderActivityLog() {
    var log = document.getElementById('activity-log');
    if (!log) return;

    log.innerHTML = window.ACTIVITY_LOG.map(function(entry) {
        var color = entry.type === 'success' ? '#00C0AE' : entry.type === 'warning' ? '#F59E0B' : '#00B8F5';
        return '<div style="display:flex;align-items:flex-start;gap:12px;padding:10px 20px;border-bottom:1px solid var(--border);transition:background 0.15s;" ' +
            'onmouseover="this.style.background=\'var(--bg-hover)\'" onmouseout="this.style.background=\'transparent\'">' +
            '<div style="font-family:var(--font-mono);font-size:11px;color:var(--text-muted);flex-shrink:0;padding-top:1px;">' + entry.time + '</div>' +
            '<div style="width:6px;height:6px;border-radius:50%;background:' + color + ';flex-shrink:0;margin-top:4px;"></div>' +
            '<div><div style="font-size:12px;font-weight:600;color:var(--text-primary);">' + entry.connector + '</div><div style="font-size:11px;color:var(--text-secondary);">' + entry.event + '</div></div>' +
        '</div>';
    }).join('');
}

/* ── CONNECTOR → KPI MAPPING ────────────────────────────── */

var EXPANDED_CONNECTOR = null;

function renderConnectorKPIMap() {
    var el = document.getElementById('connector-kpi-map');
    if (!el || !window.CONNECTOR_DATA_LIST) return;

    el.innerHTML = window.CONNECTOR_DATA_LIST.map(function(conn, i) {
        var statusColor = conn.status === 'live' ? '#00C0AE' : conn.status === 'warning' ? '#F59E0B' : '#FD349C';
        var sys = window.SOURCE_SYSTEMS ? (window.SOURCE_SYSTEMS[conn.id] || {}) : {};
        var isExpanded = EXPANDED_CONNECTOR === conn.id;

        var kpiCards = '';
        if (isExpanded && conn.kpis) {
            var kpis = conn.kpis.map(function(kpiId) {
                return window.KPI_MASTER ? window.KPI_MASTER.find(function(k) { return k.id === kpiId; }) : null;
            }).filter(Boolean);

            kpiCards = '<div style="padding:16px 24px;background:var(--bg);border-top:1px solid var(--border);">' +
                '<div style="font-size:10px;font-weight:700;letter-spacing:1.5px;color:var(--text-muted);text-transform:uppercase;margin-bottom:12px;">KPIs fed by ' + conn.name + ' · ' + kpis.length + ' metrics</div>' +
                '<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:10px;">' +
                kpis.map(function(kpi) {
                    var pct = kpi.pctToTarget;
                    var color = pct >= 95 ? '#00C0AE' : pct >= 75 ? '#00B8F5' : pct >= 50 ? '#F59E0B' : pct >= 30 ? '#F97316' : '#FD349C';
                    return '<div onclick="openKPIDetail(\'' + kpi.id + '\')" style="background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-sm);padding:12px;cursor:pointer;border-top:2px solid ' + color + ';transition:all 0.15s;" onmouseover="this.style.borderColor=\'' + color + '\'" onmouseout="this.style.borderTopColor=\'' + color + '\';this.style.borderBottomColor=\'var(--border)\';this.style.borderLeftColor=\'var(--border)\';this.style.borderRightColor=\'var(--border)\'">' +
                        '<div style="font-size:9px;font-weight:700;letter-spacing:1px;color:' + color + ';text-transform:uppercase;margin-bottom:4px;">' + kpi.system + '</div>' +
                        '<div style="font-size:11px;font-weight:600;color:var(--text-primary);margin-bottom:6px;">' + kpi.label + '</div>' +
                        '<div style="font-size:16px;font-weight:700;color:var(--text-primary);font-family:var(--font-mono);">' + kpi.value + '<span style="font-size:10px;color:var(--text-muted);margin-left:2px;">' + kpi.unit + '</span></div>' +
                        '<div style="font-size:10px;color:' + (kpi.trend === 'up' ? '#00C0AE' : '#FD349C') + ';margin-top:2px;">' + kpi.delta + ' YoY</div>' +
                        '<div style="margin-top:6px;height:2px;background:var(--border);border-radius:1px;">' +
                            '<div style="height:2px;background:' + color + ';border-radius:1px;width:' + Math.min(pct, 100) + '%;"></div>' +
                        '</div>' +
                    '</div>';
                }).join('') +
                '</div></div>';
        }

        return '<div style="border-bottom:1px solid var(--border);">' +
            '<div onclick="toggleConnectorKPI(\'' + conn.id + '\')" style="display:flex;align-items:center;justify-content:space-between;padding:14px 24px;cursor:pointer;transition:background 0.15s;" onmouseover="this.style.background=\'var(--bg-hover)\'" onmouseout="this.style.background=\'\'">' +
                '<div style="display:flex;align-items:center;gap:16px;">' +
                    '<div style="width:8px;height:8px;border-radius:50%;background:' + statusColor + ';box-shadow:0 0 6px ' + statusColor + ';"></div>' +
                    '<div>' +
                        '<div style="font-size:13px;font-weight:600;color:var(--text-primary);">' + conn.name + '</div>' +
                        '<div style="font-size:11px;color:var(--text-muted);">Last sync: ' + conn.lastSync + ' · ' + conn.records + ' records</div>' +
                    '</div>' +
                '</div>' +
                '<div style="display:flex;align-items:center;gap:16px;">' +
                    '<div style="font-size:11px;font-weight:700;color:' + statusColor + ';background:' + statusColor + '22;padding:3px 10px;border-radius:20px;text-transform:uppercase;">' + conn.status + '</div>' +
                    '<div style="font-size:11px;color:var(--text-muted);">' + (conn.kpis ? conn.kpis.length : 0) + ' KPIs</div>' +
                    '<div style="font-size:14px;color:var(--text-muted);transition:transform 0.2s;transform:rotate(' + (isExpanded ? '90' : '0') + 'deg);">›</div>' +
                '</div>' +
            '</div>' +
            kpiCards +
        '</div>';
    }).join('');
}

function toggleConnectorKPI(id) {
    EXPANDED_CONNECTOR = EXPANDED_CONNECTOR === id ? null : id;
    renderConnectorKPIMap();
}