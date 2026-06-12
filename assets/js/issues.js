/* ============================================================
   MERIDIAN V2 · ISSUES
   Screen 6: Raise Issue + Issues Log
   ============================================================ */

function initIssues() {
    renderIssuesLog();
}

function renderIssuesLog() {
    var container = document.getElementById('issues-list');
    if (!container) return;

    var issues = window.ISSUES_LOG || [];

    var open     = issues.filter(function(i) { return i.status === 'open'; }).length;
    var inprog   = issues.filter(function(i) { return i.status === 'in-progress'; }).length;
    var resolved = issues.filter(function(i) { return i.status === 'resolved'; }).length;

    // Summary
    var summary = document.getElementById('issues-summary');
    if (summary) {
        var summaryMetrics = [
            { label: 'OPEN', value: open, color: '#FD349C' },
            { label: 'IN PROGRESS', value: inprog, color: '#F59E0B' },
            { label: 'RESOLVED', value: resolved, color: '#00C0AE' },
            { label: 'TOTAL', value: issues.length, color: 'var(--text-primary)' }
        ];
        summary.innerHTML = summaryMetrics.map(function(m) {
            return '<div style="flex:1;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-sm);padding:12px 16px;">' +
                '<div style="font-family:var(--font-mono);font-size:9px;font-weight:700;letter-spacing:1px;color:var(--text-muted);margin-bottom:6px;">' + m.label + '</div>' +
                '<div style="font-family:var(--font-mono);font-size:22px;font-weight:700;color:' + m.color + ';">' + m.value + '</div>' +
            '</div>';
        }).join('');
    }

    // Issues table
    container.innerHTML = issues.map(function(issue) {
        var priorityColor = issue.priority === 'critical' ? '#FD349C' : issue.priority === 'high' ? '#F59E0B' : '#00C0AE';
        var statusColor   = issue.status === 'resolved' ? '#00C0AE' : 'var(--text-muted)';
        var statusLabel   = issue.status === 'open' ? 'OPEN' : issue.status === 'in-progress' ? 'IN PROGRESS' : 'RESOLVED';
        var slaColor      = issue.slaRemaining === 'OVERDUE' ? '#FD349C' : issue.slaRemaining === 'Resolved' ? '#00C0AE' : '#F59E0B';

        return '<div class="data-card" style="margin-bottom:8px;cursor:pointer;padding:14px 16px;" onclick="openIssueModal(\'' + issue.id + '\')">' +
            '<div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:8px;">' +
                '<div>' +
                    '<div style="display:flex;align-items:center;gap:10px;margin-bottom:3px;">' +
                        '<span style="font-family:var(--font-mono);font-size:11px;color:var(--text-muted);">' + issue.id + '</span>' +
                        '<span style="font-size:10px;font-weight:700;color:' + priorityColor + ';border:1px solid ' + priorityColor + '44;border-radius:var(--radius-sm);padding:2px 8px;text-transform:uppercase;">' + issue.priority + '</span>' +
                        '<span style="font-family:var(--font-mono);font-size:10px;font-weight:700;color:' + statusColor + ';border:1px solid var(--border-light);border-radius:var(--radius-sm);padding:2px 8px;text-transform:uppercase;">' + statusLabel + '</span>' +
                    '</div>' +
                    '<div style="font-size:13px;font-weight:700;color:var(--text-primary);">' + issue.source + '</div>' +
                    '<div style="font-family:var(--font-mono);font-size:10px;color:var(--text-muted);margin-top:2px;">' + issue.type + ' · Raised ' + issue.raisedAt + '</div>' +
                '</div>' +
                '<div style="text-align:right;flex-shrink:0;">' +
                    '<div style="font-size:10px;color:var(--text-muted);margin-bottom:2px;">SLA Remaining</div>' +
                    '<div style="font-family:var(--font-mono);font-size:14px;font-weight:700;color:' + slaColor + ';">' + issue.slaRemaining + '</div>' +
                '</div>' +
            '</div>' +
            '<div style="display:flex;align-items:baseline;gap:16px;">' +
                '<span style="font-size:12px;color:var(--text-muted);flex:1;">' + issue.description + '</span>' +
                '<span style="font-family:var(--font-mono);font-size:10px;color:var(--text-muted);">Assigned: ' + issue.assignedTo + '</span>' +
            '</div>' +
        '</div>';
    }).join('');
}

function openIssueModal(issueId) {
    var issue = (window.ISSUES_LOG || []).find(function(i) { return i.id === issueId; });
    if (!issue) return;

    var priorityColor = issue.priority === 'critical' ? '#FD349C' : issue.priority === 'high' ? '#F59E0B' : '#00C0AE';
    var statusColor   = issue.status === 'open' ? '#FD349C' : issue.status === 'in-progress' ? '#F59E0B' : '#00C0AE';
    var statusLabel   = issue.status === 'open' ? 'OPEN' : issue.status === 'in-progress' ? 'IN PROGRESS' : 'RESOLVED';
    var modal = document.getElementById('modal-box');

    modal.innerHTML =
        '<div class="modal-header">' +
            '<div>' +
                '<div style="font-size:10px;font-weight:700;letter-spacing:1.5px;color:' + priorityColor + ';margin-bottom:6px;text-transform:uppercase;">' + issue.type + ' · ' + issue.priority.toUpperCase() + '</div>' +
                '<div class="modal-title">' + issue.source + '</div>' +
            '</div>' +
            '<div class="modal-close" onclick="closeModal()">✕</div>' +
        '</div>' +
        '<div class="modal-row"><span class="modal-row-label">Issue ID</span><span class="modal-row-value" style="font-family:var(--font-mono);">' + issue.id + '</span></div>' +
        '<div class="modal-row"><span class="modal-row-label">Status</span><span class="modal-row-value" style="color:' + statusColor + ';font-weight:700;">' + statusLabel + '</span></div>' +
        '<div class="modal-row"><span class="modal-row-label">Raised By</span><span class="modal-row-value">' + issue.raisedBy + '</span></div>' +
        '<div class="modal-row"><span class="modal-row-label">Raised At</span><span class="modal-row-value">' + issue.raisedAt + '</span></div>' +
        '<div class="modal-row"><span class="modal-row-label">Assigned To</span><span class="modal-row-value">' + issue.assignedTo + '</span></div>' +
        '<div class="modal-row"><span class="modal-row-label">SLA Remaining</span><span class="modal-row-value" style="color:' + (issue.slaRemaining === 'OVERDUE' ? '#FD349C' : '#F59E0B') + ';font-family:var(--font-mono);font-weight:700;">' + issue.slaRemaining + '</span></div>' +
        '<div style="margin-top:16px;padding:16px;background:var(--bg);border-radius:var(--radius-sm);border-left:3px solid ' + priorityColor + ';">' +
            '<div style="font-size:10px;font-weight:700;letter-spacing:1.5px;color:' + priorityColor + ';margin-bottom:8px;text-transform:uppercase;">Description</div>' +
            '<div style="font-size:13px;color:var(--text-secondary);line-height:1.6;">' + issue.description + '</div>' +
        '</div>' +
        '<div style="display:flex;gap:12px;margin-top:20px;">' +
            '<button class="btn btn-primary" onclick="closeModal()">Close</button>' +
            (issue.status !== 'resolved' ? '<button class="btn btn-secondary" onclick="resolveIssue(\'' + issue.id + '\')">Mark Resolved</button>' : '') +
        '</div>';

    document.getElementById('modal-overlay').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function resolveIssue(issueId) {
    var issue = (window.ISSUES_LOG || []).find(function(i) { return i.id === issueId; });
    if (!issue) return;
    issue.status       = 'resolved';
    issue.slaRemaining = 'Resolved';
    closeModal();
    renderIssuesLog();
}

function raiseIssue(type, source, description, priority) {
    priority    = priority || 'high';
    var newId   = 'ISS-2025-0' + (39 + (window.ISSUES_LOG || []).length);
    var now     = new Date();
    var timeStr = now.toLocaleDateString('en-IN', {day:'2-digit',month:'short',year:'numeric'}) + ' · ' +
                  now.toLocaleTimeString('en-IN', {hour:'2-digit',minute:'2-digit',hour12:false}) + ' IST';

    var issue = {
        id:           newId,
        type:         type,
        source:       source,
        priority:     priority,
        status:       'open',
        raisedBy:     'CFO Dashboard',
        raisedAt:     timeStr,
        assignedTo:   'KPMG GRCS — Managed Services',
        slaHours:     priority === 'critical' ? 2 : priority === 'high' ? 4 : 8,
        slaRemaining: priority === 'critical' ? '2h 00m' : priority === 'high' ? '4h 00m' : '8h 00m',
        description:  description
    };

    if (!window.ISSUES_LOG) window.ISSUES_LOG = [];
    window.ISSUES_LOG.unshift(issue);

    closeModal();
    showScreen('issues', document.querySelector('[data-screen="issues"]'));
}

function openRaiseIssueModal(type, source, defaultDescription, priority) {
    var modal = document.getElementById('modal-box');
    var priorityColor = priority === 'critical' ? '#FD349C' : '#F59E0B';

    modal.innerHTML =
        '<div class="modal-header">' +
            '<div>' +
                '<div style="font-size:10px;font-weight:700;letter-spacing:1.5px;color:' + priorityColor + ';margin-bottom:6px;text-transform:uppercase;">RAISE ISSUE · ' + type.toUpperCase() + '</div>' +
                '<div class="modal-title">' + source + '</div>' +
            '</div>' +
            '<div class="modal-close" onclick="closeModal()">✕</div>' +
        '</div>' +
        '<div style="margin-bottom:16px;">' +
            '<div style="font-size:11px;font-weight:600;color:var(--text-secondary);margin-bottom:6px;text-transform:uppercase;letter-spacing:1px;">Priority</div>' +
            '<div style="display:flex;gap:8px;">' +
                '<button onclick="selectPriority(\'critical\')" id="pri-critical" class="btn ' + (priority === 'critical' ? 'btn-primary' : 'btn-secondary') + '" style="font-size:11px;">Critical</button>' +
                '<button onclick="selectPriority(\'high\')" id="pri-high" class="btn ' + (priority === 'high' ? 'btn-primary' : 'btn-secondary') + '" style="font-size:11px;">High</button>' +
                '<button onclick="selectPriority(\'medium\')" id="pri-medium" class="btn btn-secondary" style="font-size:11px;">Medium</button>' +
            '</div>' +
        '</div>' +
        '<div style="margin-bottom:16px;">' +
            '<div style="font-size:11px;font-weight:600;color:var(--text-secondary);margin-bottom:6px;text-transform:uppercase;letter-spacing:1px;">Description</div>' +
            '<textarea id="issue-description" rows="4" ' +
                'style="width:100%;background:var(--bg);border:1px solid var(--border-light);border-radius:var(--radius-sm);padding:10px 16px;font-size:13px;color:var(--text-primary);resize:vertical;box-sizing:border-box;">' +
                defaultDescription +
            '</textarea>' +
        '</div>' +
        '<div style="display:flex;gap:12px;">' +
            '<button class="btn btn-primary" onclick="submitIssue(\'' + type + '\',\'' + source + '\')">Submit Issue</button>' +
            '<button class="btn btn-secondary" onclick="closeModal()">Cancel</button>' +
        '</div>';

    window._selectedPriority = priority;
    document.getElementById('modal-overlay').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function selectPriority(priority) {
    window._selectedPriority = priority;
    ['critical','high','medium'].forEach(function(p) {
        var btn = document.getElementById('pri-' + p);
        if (btn) btn.className = 'btn ' + (p === priority ? 'btn-primary' : 'btn-secondary');
        if (btn) btn.style.fontSize = '11px';
    });
}

function submitIssue(type, source) {
    var desc     = document.getElementById('issue-description').value.trim();
    var priority = window._selectedPriority || 'high';
    if (!desc) return;
    raiseIssue(type, source, desc, priority);
}