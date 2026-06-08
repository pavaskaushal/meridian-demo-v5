/* ============================================================
   MERIDIAN V2 · MODALS
   All modal open/close functions
   ============================================================ */

function openModal(alertId) {
    var alert = RAFM_ALERTS.find(function(a) { return a.id === alertId; });
    if (!alert) return;

    var color = getSeverityColor(alert.severity);
    var modal = document.getElementById('modal-box');

    modal.innerHTML =
        '<div class="modal-header">' +
            '<div>' +
                '<div style="font-size:10px;font-weight:700;letter-spacing:1.5px;color:' + color + ';margin-bottom:6px;text-transform:uppercase;">' + alert.type + '</div>' +
                '<div class="modal-title">' + alert.title + '</div>' +
            '</div>' +
            '<div class="modal-close" onclick="closeModal()">✕</div>' +
        '</div>' +
        '<p style="font-size:13px;color:var(--text-secondary);line-height:1.6;margin-bottom:20px;">' + alert.description + '</p>' +
        '<div class="modal-row"><span class="modal-row-label">Amount at Risk</span><span class="modal-row-value" style="color:' + color + ';font-size:18px;">' + alert.amount + '</span></div>' +
        '<div class="modal-row"><span class="modal-row-label">Counterparty</span><span class="modal-row-value">' + alert.operator + '</span></div>' +
        '<div class="modal-row"><span class="modal-row-label">Scope</span><span class="modal-row-value">' + alert.route + '</span></div>' +
        '<div class="modal-row"><span class="modal-row-label">Records Affected</span><span class="modal-row-value">' + alert.cdrCount + '</span></div>' +
        '<div class="modal-row"><span class="modal-row-label">Detected</span><span class="modal-row-value">' + alert.detectedAt + '</span></div>' +
        '<div style="margin-top:20px;padding:16px;background:var(--bg);border-radius:var(--radius-sm);border-left:3px solid ' + color + ';">' +
            '<div style="font-size:10px;font-weight:700;letter-spacing:1.5px;color:' + color + ';margin-bottom:8px;text-transform:uppercase;">Recommended Action</div>' +
            '<div style="font-size:13px;color:var(--text-secondary);line-height:1.6;">' + alert.action + '</div>' +
        '</div>' +
        '<div style="display:flex;gap:12px;margin-top:20px;">' +
            '<button class="btn btn-primary" onclick="closeModal()">Acknowledge</button>' +
            '<button class="btn btn-secondary" onclick="closeModal()">Escalate</button>' +
        '</div>';

    document.getElementById('modal-overlay').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function openVendorModal(name, score, exposure, issue) {
    var color  = score < 31 ? '#FD349C' : score < 51 ? '#F59E0B' : '#00C0AE';
    var status = score < 31 ? 'CRITICAL RISK' : score < 51 ? 'ELEVATED RISK' : 'HEALTHY';
    var modal  = document.getElementById('modal-box');

    modal.innerHTML =
        '<div class="modal-header">' +
            '<div>' +
                '<div style="font-size:10px;font-weight:700;letter-spacing:1.5px;color:' + color + ';margin-bottom:6px;text-transform:uppercase;">VENDOR RISK · ' + status + '</div>' +
                '<div class="modal-title">' + name + '</div>' +
            '</div>' +
            '<div class="modal-close" onclick="closeModal()">✕</div>' +
        '</div>' +
        '<div class="modal-row"><span class="modal-row-label">Risk Score</span><span class="modal-row-value" style="color:' + color + ';font-size:22px;">' + score + ' / 100</span></div>' +
        '<div class="modal-row"><span class="modal-row-label">Exposure</span><span class="modal-row-value">' + exposure + '</span></div>' +
        '<div class="modal-row"><span class="modal-row-label">Issues Detected</span><span class="modal-row-value" style="color:' + color + ';">' + (issue || 'None — all checks passed') + '</span></div>' +
        '<div style="display:flex;gap:12px;margin-top:20px;">' +
            '<button class="btn btn-primary" onclick="closeModal()">Acknowledge</button>' +
            '<button class="btn btn-secondary" onclick="closeModal()">View Full Report</button>' +
        '</div>';

    document.getElementById('modal-overlay').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function openKPIModal(kpiId) {
    var kpi = KPI_DATA.find(function(k) { return k.id === kpiId; });
    if (!kpi) return;

    var modal = document.getElementById('modal-box');
    var color = kpi.accentColor;

    var detail = getKPIDetail(kpiId);

    modal.innerHTML =
        '<div class="modal-header">' +
            '<div>' +
                '<div style="font-size:10px;font-weight:700;letter-spacing:1.5px;color:' + color + ';margin-bottom:6px;text-transform:uppercase;">KPI DEEP DIVE</div>' +
                '<div class="modal-title">' + kpi.label + '</div>' +
            '</div>' +
            '<div class="modal-close" onclick="closeModal()">✕</div>' +
        '</div>' +
        '<div style="display:flex;align-items:baseline;gap:8px;margin-bottom:20px;">' +
            '<div style="font-family:var(--font-mono);font-size:36px;font-weight:700;color:' + color + ';">' + kpi.value + kpi.unit + '</div>' +
            '<div style="font-size:13px;color:var(--positive);font-weight:600;">' + kpi.delta + ' ' + kpi.deltaLabel + '</div>' +
        '</div>' +
        detail +
        '<div style="display:flex;gap:12px;margin-top:20px;">' +
            '<button class="btn btn-secondary" onclick="closeModal()">Close</button>' +
        '</div>';

    document.getElementById('modal-overlay').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function getKPIDetail(kpiId) {
    var details = {
        arpu: [
            '<div style="margin-bottom:16px;">',
                '<div style="font-size:10px;font-weight:700;letter-spacing:1.5px;color:var(--kpmg-cyan);margin-bottom:12px;text-transform:uppercase;">Circle-wise ARPU Breakdown</div>',
                '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">',
                    CIRCLE_DATA.slice(0,6).map(function(c) {
                        return '<div style="background:var(--bg);border-radius:6px;padding:10px 12px;border-left:3px solid ' + c.color + ';">' +
                            '<div style="font-size:11px;color:var(--text-muted);">' + c.circle + '</div>' +
                            '<div style="font-family:var(--font-mono);font-size:16px;font-weight:700;color:var(--text-primary);">₹' + c.arpu + '</div>' +
                        '</div>';
                    }).join(''),
                '</div>',
            '</div>',
            '<div style="padding:12px;background:var(--bg);border-radius:6px;border-left:3px solid var(--kpmg-cyan);">',
                '<div style="font-size:10px;font-weight:700;color:var(--kpmg-cyan);margin-bottom:6px;text-transform:uppercase;">AI Insight</div>',
                '<div style="font-size:12px;color:var(--text-secondary);line-height:1.6;">Mumbai and Delhi NCR circles drive premium ARPU at ₹198 and ₹192 respectively. The ₹44 gap between best (Mumbai ₹198) and worst (Bihar ₹154) circles represents a ₹180 Cr annual revenue opportunity through targeted ARPU improvement programs.</div>',
            '</div>'
        ].join(''),

        churn: [
            '<div style="margin-bottom:16px;">',
                '<div style="font-size:10px;font-weight:700;letter-spacing:1.5px;color:#FD349C;margin-bottom:12px;text-transform:uppercase;">Churn by Circle — High Risk</div>',
                '<div style="display:flex;flex-direction:column;gap:8px;">',
                    CIRCLE_DATA.slice(0,5).map(function(c) {
                        var w = Math.min(100, (c.churn / 2.5) * 100);
                        var col = c.churn > 1.8 ? '#FD349C' : c.churn > 1.4 ? '#F59E0B' : '#00C0AE';
                        return '<div>' +
                            '<div style="display:flex;justify-content:space-between;margin-bottom:3px;">' +
                                '<span style="font-size:12px;color:var(--text-secondary);">' + c.circle + '</span>' +
                                '<span style="font-family:var(--font-mono);font-size:12px;font-weight:700;color:' + col + ';">' + c.churn + '%</span>' +
                            '</div>' +
                            '<div style="background:var(--border);border-radius:4px;height:4px;">' +
                                '<div style="width:' + w + '%;background:' + col + ';height:4px;border-radius:4px;"></div>' +
                            '</div>' +
                        '</div>';
                    }).join(''),
                '</div>',
            '</div>',
            '<div style="padding:12px;background:var(--bg);border-radius:6px;border-left:3px solid #FD349C;">',
                '<div style="font-size:10px;font-weight:700;color:#FD349C;margin-bottom:6px;text-transform:uppercase;">AI Insight</div>',
                '<div style="font-size:12px;color:var(--text-secondary);line-height:1.6;">Bihar (2.1%) and UP East (1.9%) are the highest churn circles. Primary drivers: Jio promotional offers in prepaid segment and network quality gaps. Recommend targeted retention spend of ₹40-60 Cr in these circles to recover ~0.3% churn improvement.</div>',
            '</div>'
        ].join(''),

        ebitda: [
            '<div style="margin-bottom:16px;">',
                '<div style="font-size:10px;font-weight:700;letter-spacing:1.5px;color:#76D2FF;margin-bottom:12px;text-transform:uppercase;">Quarterly EBITDA Trend</div>',
                '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;">',
                    QUARTERLY_PL.slice(0,4).map(function(q) {
                        return '<div style="background:var(--bg);border-radius:6px;padding:10px;text-align:center;">' +
                            '<div style="font-size:10px;color:var(--text-muted);">' + q.quarter + '</div>' +
                            '<div style="font-family:var(--font-mono);font-size:14px;font-weight:700;color:#76D2FF;">' + q.ebitdaPct + '%</div>' +
                            '<div style="font-size:10px;color:var(--text-muted);">₹' + q.ebitda + ' Cr</div>' +
                        '</div>';
                    }).join(''),
                '</div>',
            '</div>',
            '<div style="padding:12px;background:var(--bg);border-radius:6px;border-left:3px solid #76D2FF;">',
                '<div style="font-size:10px;font-weight:700;color:#76D2FF;margin-bottom:6px;text-transform:uppercase;">AI Insight</div>',
                '<div style="font-size:12px;color:var(--text-secondary);line-height:1.6;">EBITDA margin has expanded 130bps over 4 quarters from 33.3% to 34.6%, driven by operating leverage on network costs and improved spectrum utilisation. Q1 FY26 projection: 34.9-35.2% assuming stable spectrum costs.</div>',
            '</div>'
        ].join(''),

        fcf: [
            '<div style="margin-bottom:16px;">',
                '<div style="font-size:10px;font-weight:700;letter-spacing:1.5px;color:#63EBDA;margin-bottom:12px;text-transform:uppercase;">FCF Bridge — FY25</div>',
                '<div style="display:flex;flex-direction:column;gap:8px;">',
                    [
                        {label:'EBITDA', value:'₹4,510 Cr', positive:true},
                        {label:'Less: Capex', value:'-₹1,500 Cr', positive:false},
                        {label:'Less: Interest', value:'-₹420 Cr', positive:false},
                        {label:'Less: Tax', value:'-₹250 Cr', positive:false},
                        {label:'Free Cash Flow', value:'₹2,340 Cr', positive:true}
                    ].map(function(r) {
                        return '<div style="display:flex;justify-content:space-between;padding:8px 12px;background:var(--bg);border-radius:4px;">' +
                            '<span style="font-size:12px;color:var(--text-secondary);">' + r.label + '</span>' +
                            '<span style="font-family:var(--font-mono);font-size:12px;font-weight:700;color:' + (r.positive ? '#63EBDA' : '#FD349C') + ';">' + r.value + '</span>' +
                        '</div>';
                    }).join(''),
                '</div>',
            '</div>'
        ].join(''),

        subscribers: [
            '<div style="margin-bottom:16px;">',
                '<div style="font-size:10px;font-weight:700;letter-spacing:1.5px;color:#1E49E2;margin-bottom:12px;text-transform:uppercase;">Subscriber Mix</div>',
                '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">',
                    [
                        {label:'Prepaid', value:'248M', pct:'79.5%'},
                        {label:'Postpaid', value:'64M', pct:'20.5%'},
                        {label:'4G', value:'224M', pct:'71.8%'},
                        {label:'5G', value:'38M', pct:'12.2%'}
                    ].map(function(s) {
                        return '<div style="background:var(--bg);border-radius:6px;padding:10px 12px;">' +
                            '<div style="font-size:10px;color:var(--text-muted);">' + s.label + '</div>' +
                            '<div style="font-family:var(--font-mono);font-size:18px;font-weight:700;color:#1E49E2;">' + s.value + '</div>' +
                            '<div style="font-size:10px;color:var(--text-muted);">' + s.pct + ' of base</div>' +
                        '</div>';
                    }).join(''),
                '</div>',
            '</div>',
            '<div style="padding:12px;background:var(--bg);border-radius:6px;border-left:3px solid #1E49E2;">',
                '<div style="font-size:10px;font-weight:700;color:#1E49E2;margin-bottom:6px;text-transform:uppercase;">AI Insight</div>',
                '<div style="font-size:12px;color:var(--text-secondary);line-height:1.6;">5G subscriber base of 38M represents 12.2% penetration across 12 5G circles. 5G subscribers show 2.4× higher ARPU (₹312 vs ₹181 blended) — accelerating 5G device migration is the single highest-value ARPU lever available.</div>',
            '</div>'
        ].join(''),

        spectrum: [
            '<div style="margin-bottom:16px;">',
                '<div style="font-size:10px;font-weight:700;letter-spacing:1.5px;color:#B497FF;margin-bottom:12px;text-transform:uppercase;">Spectrum Holdings by Band</div>',
                '<div style="display:flex;flex-direction:column;gap:8px;">',
                    [
                        {band:'700 MHz',   holding:'10 MHz',  util:'78%', use:'Rural 4G coverage'},
                        {band:'1800 MHz',  holding:'35 MHz',  util:'92%', use:'Urban 4G voice+data'},
                        {band:'2100 MHz',  holding:'20 MHz',  util:'88%', use:'Urban 4G capacity'},
                        {band:'2300 MHz',  holding:'40 MHz',  util:'71%', use:'4G/5G data capacity'},
                        {band:'3500 MHz',  holding:'100 MHz', util:'64%', use:'5G NSA/SA (12 circles)'}
                    ].map(function(s) {
                        return '<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 12px;background:var(--bg);border-radius:4px;">' +
                            '<div>' +
                                '<div style="font-size:12px;font-weight:600;color:var(--text-primary);">' + s.band + '</div>' +
                                '<div style="font-size:10px;color:var(--text-muted);">' + s.use + '</div>' +
                            '</div>' +
                            '<div style="text-align:right;">' +
                                '<div style="font-family:var(--font-mono);font-size:12px;color:#B497FF;">' + s.holding + '</div>' +
                                '<div style="font-size:10px;color:var(--text-muted);">' + s.util + ' utilised</div>' +
                            '</div>' +
                        '</div>';
                    }).join(''),
                '</div>',
            '</div>'
        ].join('')
    };

    return details[kpiId] || '<p style="color:var(--text-muted);">Detail view coming soon.</p>';
}

function openSummaryModal(filing) {
    var modal = document.getElementById('modal-box');
    modal.innerHTML =
        '<div class="modal-header">' +
            '<div><div class="modal-title">Draft Summary — ' + filing.title + '</div></div>' +
            '<div class="modal-close" onclick="closeModal()">✕</div>' +
        '</div>' +
        '<div style="padding:16px;background:var(--bg);border-radius:var(--radius-sm);border-left:3px solid ' + filing.accentColor + ';margin-bottom:16px;">' +
            '<div style="font-size:10px;font-weight:700;letter-spacing:1.5px;color:' + filing.accentColor + ';margin-bottom:8px;text-transform:uppercase;">AI Generated Draft</div>' +
            '<div style="font-size:13px;color:var(--text-secondary);line-height:1.7;">' +
                'To: ' + filing.authority + '<br>' +
                'Subject: ' + filing.title + ' Submission — Apex Telecom<br><br>' +
                'This submission covers the ' + filing.title.toLowerCase() + ' for Apex Telecom Limited for all 22 licensed service areas. ' +
                'Current data readiness stands at ' + filing.readiness + '%. ' +
                filing.description + '<br><br>' +
                '<strong>Pending items requiring resolution:</strong><br>' +
                filing.pendingItems.map(function(i) { return '• ' + i; }).join('<br>') +
            '</div>' +
        '</div>' +
        '<div style="display:flex;gap:12px;">' +
            '<button class="btn btn-primary" onclick="closeModal()">✓ Looks Good</button>' +
            '<button class="btn btn-secondary" onclick="closeModal()">Edit Draft</button>' +
        '</div>';

    document.getElementById('modal-overlay').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(event) {
    if (event && event.target !== event.currentTarget) return;
    var overlay = document.getElementById('modal-overlay');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
}