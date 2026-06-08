/* ============================================================
   MERIDIAN V2 · THEME
   Dark / Light mode toggle
   ============================================================ */

function toggleTheme() {
    var body    = document.body;
    var label   = document.getElementById('theme-label');
    var isLight = body.classList.toggle('light-mode');

    if (isLight) {
        label.textContent = 'DARK MODE';
        updateChartsTheme(true);
        /* KPMG logo stays white — sidebar is always Deep Navy in both modes */
    } else {
        label.textContent = 'LIGHT MODE';
        updateChartsTheme(false);
    }
}