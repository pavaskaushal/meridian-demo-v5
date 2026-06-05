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
        document.getElementById('kpmg-logo').src = 'assets/kpmg-blue.svg';
    } else {
        label.textContent = 'LIGHT MODE';
        updateChartsTheme(false);
        document.getElementById('kpmg-logo').src = 'assets/kpmg-white.svg';
    }
}