/* ============================================================
   MERIDIAN V2 · REGULATORY CALENDAR
   Screen 4: Regulatory Calendar
   ============================================================ */

function initRegulatory() {
    var container = document.getElementById('regulatory-cards');
    if (!container) return;

    container.innerHTML = REGULATORY_FILINGS.map(function(filing) {
        var daysText  = formatDaysUntil(filing.dueDate);
        var cardColor = filing.readiness < 40 ? '#FD349C'
                      : filing.readiness < 70 ? '#F59E0B'
                      : '#00C0AE';

        return '<div class="data-card" style="border-left:3px solid ' + cardColor + '44;">' +
            '<div class="card-header">' +
                '<div>' +
                    '<div class="card-title" style="display:flex;align-items:center;gap:10px;">' +
                        '<div style="width:4px;height:20px;background:' + cardColor + ';border-radius:2px;"></div>' +
                        filing.title +
                    '</div>' +
                    '<div class="card-subtitle">' + filing.authority + ' · Due ' + formatDate(filing.dueDate) + '</div>' +
                '</div>' +
                '<div style="display:flex;align-items:center;gap:12px;">' +
                    '<span style="font-size:11px;font-weight:600;color:' + cardColor + ';background:' + cardColor + '18;border:1px solid ' + cardColor + '44;border-radius:4px;padding:3px 10px;">' + daysText.toUpperCase() + '</span>' +
                    '<span style="font-family:var(--font-mono);font-size:22px;font-weight:700;color:' + cardColor + ';">' + filing.readiness + '%</span>' +
                '</div>' +
            '</div>' +
            '<div class="card-body">' +
                '<div style="margin-bottom:16px;">' +
                    '<div class="progress-track"><div class="progress-bar" style="width:' + filing.readiness + '%;background:' + cardColor + ';"></div></div>' +
                '</div>' +
                '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">' +
                    '<div>' +
                        '<div style="font-size:10px;color:var(--text-muted);margin-bottom:8px;font-weight:600;letter-spacing:1px;text-transform:uppercase;">Description</div>' +
                        '<div style="font-size:12px;color:var(--text-secondary);line-height:1.5;">' + filing.description + '</div>' +
                    '</div>' +
                    '<div>' +
                        '<div style="font-size:10px;color:var(--text-muted);margin-bottom:8px;font-weight:600;letter-spacing:1px;text-transform:uppercase;">Pending Items</div>' +
                        filing.pendingItems.map(function(item) {
                            return '<div style="font-size:12px;color:var(--text-secondary);margin-bottom:4px;display:flex;gap:6px;"><span style="color:' + cardColor + ';">•</span>' + item + '</div>';
                        }).join('') +
                    '</div>' +
                '</div>' +
                '<div style="margin-top:16px;padding:12px;background:var(--bg);border-radius:var(--radius-sm);display:flex;justify-content:space-between;align-items:center;">' +
                    '<div style="display:flex;align-items:center;gap:6px;">' +
                        '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#FD349C" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>' +
                        '<span style="font-size:12px;color:var(--text-muted);">Penalty: <strong style="color:#FD349C;font-family:var(--font-mono);">' + filing.penalty + '</strong></span>' +
                    '</div>' +
                    '<button class="btn btn-secondary" style="font-size:11px;border-color:' + cardColor + '44;color:' + cardColor + ';" onclick="draftSummary(\'' + filing.id + '\')">' +
                        '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:3px;"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>' +
                        ' Draft Summary' +
                    '</button>' +
                '</div>' +
            '</div>' +
        '</div>';
    }).join('');
}

function draftSummary(filingId) {
    var filing = REGULATORY_FILINGS.find(function(f) { return f.id === filingId; });
    if (!filing) return;
    openSummaryModal(filing);
}