/* ============================================================
   MERIDIAN V5 · THEME + LAYOUT CONTROLS
   Dark/Light mode · Sidebar collapse · Compact mode
   ============================================================ */

/* ── DARK / LIGHT MODE ────────────────────────────────────── */

function setTheme(mode) {
    var body = document.body;
    var logo = document.getElementById('kpmg-logo');

    body.classList.remove('light-mode', 'mid-mode');
    if (mode === 'mid') body.classList.add('mid-mode');
    if (mode === 'light') body.classList.add('light-mode');

    var isLight = mode === 'light';
    updateChartsTheme(isLight);
    if (logo) logo.src = isLight ? 'assets/kpmg-blue.svg' : 'assets/kpmg-white.svg';

    ['dark','mid','light'].forEach(function(m) {
        var btn = document.getElementById('theme-btn-' + m);
        if (btn) {
            btn.style.background = (m === mode) ? 'var(--active-bg)' : 'transparent';
            btn.style.color = (m === mode) ? 'var(--text-primary)' : 'var(--text-muted)';
        }
    });

    try { localStorage.setItem('meridian-theme', mode); } catch(e) {}
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

        // Compact is always on — it's the default layout
        document.body.classList.add('compact');

        // Theme
        setTheme(themePref === 'light' ? 'light' : themePref === 'mid' ? 'mid' : 'dark');

    } catch(e) {}
}
