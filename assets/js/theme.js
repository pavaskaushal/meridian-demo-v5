/* ============================================================
   MERIDIAN V5 · THEME + LAYOUT CONTROLS
   Dark/Light mode · Sidebar collapse · Compact mode
   ============================================================ */

/* ── DARK / LIGHT MODE ────────────────────────────────────── */

function toggleTheme() {
    var body    = document.body;
    var label   = document.getElementById('theme-label');
    var isLight = body.classList.toggle('light-mode');

    var logo = document.getElementById('kpmg-logo');
    if (isLight) {
        label.textContent = 'DARK MODE';
        updateChartsTheme(true);
        if (logo) logo.src = 'assets/kpmg-blue.svg';
    } else {
        label.textContent = 'LIGHT MODE';
        updateChartsTheme(false);
        if (logo) logo.src = 'assets/kpmg-white.svg';
    }

    try { localStorage.setItem('meridian-theme', isLight ? 'light' : 'dark'); } catch(e) {}
}


/* ── SIDEBAR COLLAPSE ─────────────────────────────────────── */

function toggleSidebar() {
    var sidebar = document.querySelector('.sidebar');
    if (!sidebar) return;

    // If auto-collapsed by CSS media query (has no manual class yet),
    // force-open first; otherwise toggle the collapsed class.
    var isForced = sidebar.classList.contains('force-open') || sidebar.classList.contains('collapsed');

    if (sidebar.classList.contains('force-open')) {
        // Was manually opened — go back to collapsed
        sidebar.classList.remove('force-open');
        sidebar.classList.add('collapsed');
        try { localStorage.setItem('meridian-sidebar', 'collapsed'); } catch(e) {}
    } else if (sidebar.classList.contains('collapsed')) {
        // Manually collapsed — expand
        sidebar.classList.remove('collapsed');
        sidebar.classList.add('force-open');
        try { localStorage.setItem('meridian-sidebar', 'open'); } catch(e) {}
    } else {
        // No manual state — currently open (large screen). Collapse it.
        sidebar.classList.add('collapsed');
        try { localStorage.setItem('meridian-sidebar', 'collapsed'); } catch(e) {}
    }
}


/* ── COMPACT MODE ─────────────────────────────────────────── */

function toggleCompact() {
    var isCompact = document.body.classList.toggle('compact');
    var label     = document.getElementById('compact-label');
    if (label) label.textContent = isCompact ? 'Normal' : 'Compact';
    try { localStorage.setItem('meridian-compact', isCompact ? '1' : '0'); } catch(e) {}
}


/* ── STARTUP — RESTORE PERSISTED PREFERENCES ─────────────── */
/*
   Runs after DOMContentLoaded (called from the inline script
   in index.html). Restores sidebar state, compact mode, and
   theme from localStorage. Auto-collapses sidebar on narrow
   screens if no preference has been saved yet.
*/
function initLayoutPreferences() {
    var sidebar = document.querySelector('.sidebar');
    if (!sidebar) return;

    try {
        var sidebarPref = localStorage.getItem('meridian-sidebar');
        var compactPref = localStorage.getItem('meridian-compact');
        var themePref   = localStorage.getItem('meridian-theme');

        // Sidebar
        if (sidebarPref === 'open') {
            sidebar.classList.add('force-open');
        } else if (sidebarPref === 'collapsed') {
            sidebar.classList.add('collapsed');
        } else if (window.innerWidth < 1400) {
            // No saved preference + small screen → auto-collapse
            sidebar.classList.add('collapsed');
        }

        // Compact mode
        if (compactPref === '1') {
            document.body.classList.add('compact');
            var label = document.getElementById('compact-label');
            if (label) label.textContent = 'Normal';
        }

        // Compact auto-apply on very small screens
        if (!compactPref && window.innerWidth < 1300) {
            document.body.classList.add('compact');
            var label2 = document.getElementById('compact-label');
            if (label2) label2.textContent = 'Normal';
        }

        // Theme
        if (themePref === 'light') {
            document.body.classList.add('light-mode');
            var themeLabel = document.getElementById('theme-label');
            if (themeLabel) themeLabel.textContent = 'DARK MODE';
            var logo = document.getElementById('kpmg-logo');
            if (logo) logo.src = 'assets/kpmg-blue.svg';
        }

    } catch(e) {}
}
