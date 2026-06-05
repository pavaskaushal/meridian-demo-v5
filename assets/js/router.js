/* ============================================================
   MERIDIAN V2 · ROUTER
   Navigation between screens
   ============================================================ */

function showScreen(screenId, navEl) {
    document.querySelectorAll('.screen').forEach(function(s) {
        s.style.display = 'none';
    });
    document.querySelectorAll('.nav-item').forEach(function(n) {
        n.classList.remove('active');
    });

    var screen = document.getElementById('screen-' + screenId);
    if (screen) screen.style.display = 'block';
    if (navEl)  navEl.classList.add('active');

    var titles = {
        dashboard:  ['CFO Command Board',   'Real-time financial intelligence · Apex Telecom'],
        rafm:       ['RAFM Risk Monitor',    'Revenue Assurance & Fraud Management · Live detection'],
        scenario:   ['AI Scenario Studio',   'What-if modelling · Live P&L cascade'],
        regulatory: ['Regulatory Calendar',  'TRAI filing tracker · Auto-readiness scoring'],
        connectors: ['Connector Status',     'System health · Data source monitoring · Platform engines'],
        issues:     ['Issues & Requests',    'Maintenance requests · SLA tracking · KPMG GRCS Managed Services']
    };

    if (titles[screenId]) {
        document.getElementById('topbar-title').textContent    = titles[screenId][0];
        document.getElementById('topbar-subtitle').textContent = titles[screenId][1];
    }

    if (screenId === 'rafm')       initRafm();
    if (screenId === 'scenario')   initScenario();
    if (screenId === 'regulatory') initRegulatory();
    if (screenId === 'connectors') initConnectors();
    if (screenId === 'issues')     initIssues();
}