/* ============================================================
   MERIDIAN V2 · REGULATORY CALENDAR
   Screen 4: Regulatory Calendar
   ============================================================ */

function renderRegulatorySummaryStrip() {
    var el = document.getElementById('regulatory-summary-strip');
    if (!el) return;
    var filings = window.REGULATORY_FILINGS || [];
    var overdue  = filings.filter(function(f) { return (f.daysUntil || 0) < 0; }).length;
    var dueSoon  = filings.filter(function(f) { var d = f.daysUntil || 0; return d >= 0 && d <= 30; }).length;
    var submitted = filings.filter(function(f) { return (f.status||'').toUpperCase() === 'SUBMITTED' || (f.readiness||0) === 100; }).length;
    var avgReady = filings.length ? Math.round(filings.reduce(function(s,f){ return s + (f.readiness||0); }, 0) / filings.length) : 0;
    var metrics = [
        { label: 'OVERDUE',       value: overdue,       color: '#FD349C' },
        { label: 'DUE IN 30 DAYS',value: dueSoon,       color: '#F59E0B' },
        { label: 'SUBMITTED',     value: submitted,     color: '#00C0AE' },
        { label: 'AVG READINESS', value: avgReady + '%', color: '#00B8F5' },
    ];
    el.innerHTML = metrics.map(function(m) {
        return '<div style="flex:1;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-sm);padding:12px 16px;">' +
            '<div style="font-family:var(--font-mono);font-size:9px;font-weight:700;letter-spacing:1px;color:var(--text-muted);margin-bottom:6px;">' + m.label + '</div>' +
            '<div style="font-family:var(--font-mono);font-size:22px;font-weight:700;color:' + m.color + ';">' + m.value + '</div>' +
        '</div>';
    }).join('');
}

function initRegulatory() {
    renderRegulatorySummaryStrip();
    var container = document.getElementById('regulatory-cards');
    if (!container) return;

    container.innerHTML = REGULATORY_FILINGS.map(function(filing) {
        var dueField  = filing.dueDate || filing.due;
        var readiness = filing.readiness != null ? filing.readiness
                      : filing.status === 'SUBMITTED' ? 100
                      : filing.status === 'PENDING'   ? 45
                      : filing.status === 'DUE'       ? 20
                      : 60;
        var daysText  = formatDaysUntil(dueField);
        var cardColor = readiness < 40 ? '#FD349C'
                      : readiness < 70 ? '#F59E0B'
                      : '#00C0AE';

        var authority    = filing.authority    || filing.category || 'Regulatory';
        var description  = filing.description  || filing.title;
        var penalty      = filing.penalty      || 'See filing';
        var pendingItems = filing.pendingItems  || [];

        return '<div class="data-card" style="padding:14px 16px;cursor:pointer;" onclick="openRegulatoryModal(\'' + filing.id + '\')">' +
            '<div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:8px;">' +
                '<div>' +
                    '<div style="font-size:13px;font-weight:700;color:var(--text-primary);margin-bottom:3px;">' + filing.title + '</div>' +
                    '<div style="font-family:var(--font-mono);font-size:10px;color:var(--text-muted);">' + authority + ' · Due ' + formatDate(dueField) + '</div>' +
                '</div>' +
                '<div style="display:flex;align-items:center;gap:10px;flex-shrink:0;">' +
                    '<span style="font-family:var(--font-mono);font-size:10px;font-weight:700;color:var(--text-muted);border:1px solid var(--border-light);border-radius:var(--radius-sm);padding:2px 8px;">' + daysText.toUpperCase() + '</span>' +
                    '<span style="font-family:var(--font-mono);font-size:16px;font-weight:700;color:' + cardColor + ';">' + readiness + '%</span>' +
                    '<button class="btn btn-secondary" style="font-size:10px;padding:2px 10px;" onclick="event.stopPropagation();draftSummary(\'' + filing.id + '\')">' +
                        '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:3px;"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>' +
                        'Draft' +
                    '</button>' +
                '</div>' +
            '</div>' +
            '<div style="display:flex;align-items:baseline;gap:16px;margin-bottom:10px;">' +
                '<span style="font-size:12px;color:var(--text-muted);flex:1;">' + description + '</span>' +
                (pendingItems.length ? '<span style="font-family:var(--font-mono);font-size:10px;color:#F59E0B;">' + pendingItems.length + ' pending</span>' : '') +
                '<span style="font-family:var(--font-mono);font-size:10px;color:var(--text-muted);">Penalty: ' + penalty + '</span>' +
            '</div>' +
            '<div style="height:2px;background:var(--border);border-radius:2px;">' +
                '<div style="height:2px;background:' + cardColor + ';border-radius:2px;width:' + readiness + '%;transition:width 0.6s ease;"></div>' +
            '</div>' +
        '</div>';
    }).join('');
}

function draftSummary(filingId) {
    var filing = REGULATORY_FILINGS.find(function(f) { return f.id === filingId; });
    if (!filing) return;
    openSummaryModal(filing);
}

function openRegulatoryModal(filingId) {
    var filing = REGULATORY_FILINGS.find(function(f) { return f.id === filingId; });
    if (!filing) return;

    var dueField  = filing.dueDate || filing.due;
    var readiness = filing.readiness != null ? filing.readiness : 60;
    var cardColor = readiness < 40 ? '#FD349C' : readiness < 70 ? '#F59E0B' : '#00C0AE';
    var daysText  = formatDaysUntil(dueField);
    var authority = filing.authority || filing.category || 'Regulatory';
    var penalty   = filing.penalty || 'See filing';
    var pendingItems = filing.pendingItems || [];
    var keyMetrics   = filing.keyMetrics   || [];
    var filingHistory = filing.filingHistory || [];
    var box = document.getElementById('modal-box');
    if (!box) return;

    box.innerHTML =
        '<div class="modal-header">' +
            '<div>' +
                '<div style="font-family:var(--font-mono);font-size:10px;font-weight:700;letter-spacing:1.5px;color:' + cardColor + ';margin-bottom:6px;text-transform:uppercase;">' + authority + ' · ' + filing.category + ' · ' + daysText.toUpperCase() + '</div>' +
                '<div class="modal-title">' + filing.title + '</div>' +
                '<div style="font-size:12px;color:var(--text-muted);margin-top:2px;">Due ' + formatDate(dueField) + ' · Owner: ' + (filing.owner || '—') + '</div>' +
            '</div>' +
            '<div class="modal-close" onclick="closeModal()">✕</div>' +
        '</div>' +

        // Readiness + description
        '<div style="display:flex;gap:16px;margin-bottom:16px;">' +
            '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;background:var(--bg);border-radius:var(--radius-sm);padding:16px 20px;flex-shrink:0;">' +
                '<div style="font-family:var(--font-mono);font-size:32px;font-weight:700;color:' + cardColor + ';line-height:1;">' + readiness + '%</div>' +
                '<div style="font-size:9px;color:var(--text-muted);margin-top:4px;letter-spacing:1px;">READINESS</div>' +
                '<div style="height:3px;width:60px;background:var(--border);border-radius:2px;margin-top:8px;">' +
                    '<div style="height:3px;background:' + cardColor + ';border-radius:2px;width:' + readiness + '%;"></div>' +
                '</div>' +
            '</div>' +
            '<div style="background:var(--bg);border-radius:var(--radius-sm);padding:14px;flex:1;">' +
                '<div style="font-family:var(--font-mono);font-size:9px;font-weight:700;letter-spacing:1px;color:var(--text-muted);margin-bottom:6px;">DESCRIPTION</div>' +
                '<div style="font-size:12px;color:var(--text-secondary);line-height:1.6;">' + (filing.description || filing.title) + '</div>' +
            '</div>' +
        '</div>' +

        // Key metrics
        (keyMetrics.length ?
            '<div style="margin-bottom:16px;">' +
                '<div style="font-family:var(--font-mono);font-size:9px;font-weight:700;letter-spacing:1px;color:var(--text-muted);margin-bottom:8px;">KEY COMPLIANCE METRICS</div>' +
                '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;">' +
                keyMetrics.map(function(m) {
                    var mc = m.status === 'PASS' ? '#00C0AE' : '#FD349C';
                    return '<div style="background:var(--bg);border-radius:var(--radius-sm);padding:10px 12px;border-left:2px solid ' + mc + ';">' +
                        '<div style="font-size:10px;color:var(--text-muted);margin-bottom:4px;">' + m.label + '</div>' +
                        '<div style="font-family:var(--font-mono);font-size:14px;font-weight:700;color:' + mc + ';">' + m.value + '</div>' +
                        '<div style="font-size:10px;color:var(--text-muted);margin-top:2px;">Benchmark: ' + m.benchmark + '</div>' +
                    '</div>';
                }).join('') +
                '</div>' +
            '</div>'
        : '') +

        // Pending items
        (pendingItems.length ?
            '<div style="margin-bottom:16px;">' +
                '<div style="font-family:var(--font-mono);font-size:9px;font-weight:700;letter-spacing:1px;color:var(--text-muted);margin-bottom:8px;">PENDING ITEMS (' + pendingItems.length + ')</div>' +
                pendingItems.map(function(item) {
                    return '<div style="display:flex;align-items:baseline;gap:8px;padding:6px 0;border-bottom:1px solid var(--border);">' +
                        '<span style="color:#F59E0B;font-size:10px;flex-shrink:0;">▸</span>' +
                        '<span style="font-size:12px;color:var(--text-secondary);">' + item + '</span>' +
                    '</div>';
                }).join('') +
            '</div>'
        : '') +

        // Filing history
        (filingHistory.length ?
            '<div style="margin-bottom:16px;">' +
                '<div style="font-family:var(--font-mono);font-size:9px;font-weight:700;letter-spacing:1px;color:var(--text-muted);margin-bottom:8px;">FILING HISTORY</div>' +
                filingHistory.map(function(h) {
                    var hc = h.score >= 90 ? '#00C0AE' : h.score >= 70 ? '#00B8F5' : '#F59E0B';
                    return '<div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid var(--border);">' +
                        '<span style="font-family:var(--font-mono);font-size:11px;color:var(--text-muted);">' + h.quarter + '</span>' +
                        '<span style="font-size:11px;color:var(--text-muted);">' + h.date + '</span>' +
                        '<span style="font-family:var(--font-mono);font-size:11px;font-weight:700;color:' + hc + ';">' + h.score + '%</span>' +
                        '<span style="font-family:var(--font-mono);font-size:10px;color:#00C0AE;">✓ ' + h.status + '</span>' +
                    '</div>';
                }).join('') +
            '</div>'
        : '') +

        // Penalty + next due + actions
        '<div style="display:flex;gap:12px;padding:12px;background:var(--bg);border-radius:var(--radius-sm);margin-bottom:16px;">' +
            '<div style="flex:1;">' +
                '<div style="font-family:var(--font-mono);font-size:9px;color:var(--text-muted);margin-bottom:3px;">PENALTY</div>' +
                '<div style="font-size:12px;color:var(--text-secondary);">' + penalty + '</div>' +
            '</div>' +
            '<div style="width:1px;background:var(--border);"></div>' +
            '<div style="flex:1;">' +
                '<div style="font-family:var(--font-mono);font-size:9px;color:var(--text-muted);margin-bottom:3px;">NEXT DUE</div>' +
                '<div style="font-size:12px;color:var(--text-secondary);">' + (filing.nextDue || '—') + '</div>' +
            '</div>' +
        '</div>' +

        '<div style="display:flex;gap:12px;">' +
            '<button class="btn btn-primary" onclick="closeModal()">Acknowledge</button>' +
            '<button class="btn btn-secondary" onclick="closeModal();draftSummary(\'' + filing.id + '\')">Draft Summary</button>' +
        '</div>';

    document.getElementById('modal-overlay').classList.add('active');
    document.body.style.overflow = 'hidden';
}