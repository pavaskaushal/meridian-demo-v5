/* ============================================================
   MERIDIAN · UTILS
   Helper functions used across all screens.
   Define once here, call anywhere by function name.
   ============================================================ */


/* ══════════════════════════════════════════════════════════
   1. NUMBER FORMATTING
   ══════════════════════════════════════════════════════════ */

/*
   formatCrore
   ───────────
   Converts a raw number into a display-ready crore string.

   WHAT IT DOES:
   Takes a number like 2340 and returns "₹2,340 Cr"
   Takes a number like 4.8  and returns "₹4.8 Cr"

   PARAMETERS:
   - value:      the number to format
   - showSymbol: whether to include ₹ (default: true)

   EXAMPLES:
   formatCrore(2340)       → "₹2,340 Cr"
   formatCrore(4.8)        → "₹4.8 Cr"
   formatCrore(2340, false)→ "2,340 Cr"
*/
function formatCrore(value, showSymbol = true) {

    // toLocaleString formats a number with commas
    // "en-IN" means Indian number format
    // Indian format uses commas differently to Western:
    // Western: 1,000,000
    // Indian:  10,00,000 (lakhs system)
    const formatted = value.toLocaleString("en-IN", {
        maximumFractionDigits: 1
        // show at most 1 decimal place
        // 4.8 stays as 4.8
        // 4.0 becomes 4 (trailing zero removed)
    });

    const symbol = showSymbol ? "₹" : "";
    return `${symbol}${formatted} Cr`;
    // backtick strings let you embed variables with ${}
    // this is called a "template literal"
}


/*
   formatPercent
   ─────────────
   Formats a decimal as a percentage string.

   EXAMPLES:
   formatPercent(34.6)  → "34.6%"
   formatPercent(1.42)  → "1.42%"
   formatPercent(100)   → "100%"
*/
function formatPercent(value, decimals = 1) {
    return `${parseFloat(value).toFixed(decimals)}%`;
    // toFixed(1) forces exactly 1 decimal place
    // parseFloat handles the case where value is a string
}


/*
   formatNumber
   ────────────
   Formats a number with Indian-style commas.

   EXAMPLES:
   formatNumber(312000000) → "31,20,00,000"
   formatNumber(312)       → "312"
*/
function formatNumber(value) {
    return value.toLocaleString("en-IN");
}


/* ══════════════════════════════════════════════════════════
   2. DATE AND TIME HELPERS
   ══════════════════════════════════════════════════════════ */

/*
   getDaysUntil
   ────────────
   Calculates how many days remain until a given date.
   Used in the Regulatory Calendar for deadline countdowns.

   PARAMETERS:
   - dateString: a date in "YYYY-MM-DD" format
                 e.g. "2025-06-30"

   RETURNS:
   - A positive number if the date is in the future
   - 0 if today
   - A negative number if the date has passed

   HOW IT WORKS:
   JavaScript Date objects store time as milliseconds
   since 1 January 1970 (Unix timestamp).
   Subtract today from target, convert ms to days.
*/
function getDaysUntil(dateString) {
    const today      = new Date();
    const targetDate = new Date(dateString);

    // Set both times to midnight so we compare dates,
    // not exact times (avoids off-by-one errors)
    today.setHours(0, 0, 0, 0);
    targetDate.setHours(0, 0, 0, 0);

    // Difference in milliseconds
    const diffMs = targetDate - today;

    // Convert milliseconds to days
    // 1000ms = 1 second
    // × 60 = 1 minute
    // × 60 = 1 hour
    // × 24 = 1 day
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    return diffDays;
}


/*
   formatDaysUntil
   ───────────────
   Human-readable version of getDaysUntil.

   EXAMPLES:
   formatDaysUntil("2025-06-30") → "27 days"
   formatDaysUntil("2025-06-15") → "Today"
   formatDaysUntil("2025-06-14") → "1 day ago"
*/
function formatDaysUntil(dateString) {
    const days = getDaysUntil(dateString);

    if (days < 0)  return `${Math.abs(days)} days overdue`;
    if (days === 0) return "Due today";
    if (days === 1) return "Due tomorrow";
    return `${days} days`;
}


/*
   formatDate
   ──────────
   Converts "2025-06-30" to "30 Jun 2025" — readable format.

   PARAMETERS:
   - dateString: "YYYY-MM-DD" format

   RETURNS:
   - "DD Mon YYYY" format
*/
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
        day:   "numeric",
        month: "short",
        year:  "numeric"
    });
    // "en-IN" with these options gives: "30 Jun 2025"
}


/*
   getTimestamp
   ────────────
   Returns current date and time as a formatted string.
   Used in the topbar to show "last updated" time.

   RETURNS: e.g. "15 Jun 2025 · 09:14 IST"
*/
function getTimestamp() {
    const now = new Date();

    const date = now.toLocaleDateString("en-IN", {
        day:   "numeric",
        month: "short",
        year:  "numeric"
    });

    const time = now.toLocaleTimeString("en-IN", {
        hour:   "2-digit",
        minute: "2-digit",
        hour12: false
        // 24-hour format — professional/financial standard
    });

    return `${date} · ${time} IST`;
}


/* ══════════════════════════════════════════════════════════
   3. COLOUR HELPERS
   Return the right CSS colour variable based on a value.
   ══════════════════════════════════════════════════════════ */

/*
   getSeverityColor
   ────────────────
   Returns a CSS colour string for a severity level.
   Used to colour alert bars, badges, and amounts.

   PARAMETERS:
   - severity: "critical", "high", "medium", or "low"
*/
function getSeverityColor(severity) {
    const colors = {
        critical: "#FD349C",   // --kpmg-pink
        high:     "#F59E0B",   // --warning (amber)
        medium:   "#00B8F5",   // --kpmg-cyan
        low:      "#00C0AE"    // --positive (teal)
    };

    // Return the matching colour, or grey if unknown severity
    return colors[severity] || "#4B5563";
}


/*
   getProgressColor
   ────────────────
   Returns a colour based on how complete something is.
   Used for regulatory filing progress bars.

   Logic:
   - Below 40% → danger (pink) — needs urgent attention
   - 40% to 70% → warning (amber) — needs attention
   - Above 70% → positive (teal) — on track
*/
function getProgressColor(percentage) {
    if (percentage < 40) return "#FD349C";   // danger
    if (percentage < 70) return "#F59E0B";   // warning
    return "#00C0AE";                         // positive
}


/*
   getDeltaClass
   ─────────────
   Returns the CSS class name for a KPI delta indicator.
   Handles the special case of churn — where going DOWN is good.

   PARAMETERS:
   - delta:     the change value (e.g. "+12" or "-0.18")
   - isInverse: true if LOWER is better (e.g. churn rate)

   RETURNS: "positive", "negative", or "neutral"

   EXAMPLES:
   getDeltaClass("+12", false)  → "positive"  (revenue up = good)
   getDeltaClass("-0.18", true) → "positive"  (churn down = good)
   getDeltaClass("+2", true)    → "negative"  (churn up = bad)
*/
function getDeltaClass(delta, isInverse = false) {
    // Check if the delta string starts with + or -
    const isPositive = String(delta).startsWith("+");
    const isNegative = String(delta).startsWith("-");

    if (!isPositive && !isNegative) return "neutral";

    // For normal metrics: up = good
    if (!isInverse) {
        return isPositive ? "positive" : "negative";
    }

    // For inverse metrics (like churn): down = good
    return isNegative ? "positive" : "negative";
}


/* ══════════════════════════════════════════════════════════
   4. SCENARIO CALCULATOR
   The core math behind the Scenario Studio sliders.
   ══════════════════════════════════════════════════════════ */

/*
   calculateScenario
   ─────────────────
   Takes the four slider values and calculates the
   resulting P&L impact compared to the base case.

   PARAMETERS:
   - arpuChange:     % change in ARPU          (e.g. -10 means -10%)
   - churnChange:    % change in churn rate     (e.g. +8 means +8%)
   - spectrumChange: % change in spectrum cost  (e.g. +20 means +20%)
   - priceIncrease:  % price increase offset    (e.g. +5 means +5%)

   RETURNS an object with:
   - scenarioRevenue:  calculated revenue in ₹ Cr
   - scenarioEbitda:   calculated EBITDA in ₹ Cr
   - revenueImpact:    change vs base in ₹ Cr
   - ebitdaImpact:     change vs base in ₹ Cr
   - ebitdaPct:        new EBITDA margin %

   THE MATH EXPLAINED:
   ───────────────────
   Base revenue = ₹3,420 Cr (quarterly)

   ARPU impact:
   If ARPU drops 10%, revenue drops 10% proportionally.
   Revenue × (1 + arpuChange/100)

   Churn impact:
   Higher churn = fewer subscribers.
   A churn increase of 8% means the churn RATE goes from
   1.42% to 1.42% × 1.08 = 1.53%.
   The extra subscribers lost reduce revenue further.
   We approximate: 1% extra churn ≈ 0.7% revenue impact
   (not 1:1 because new acquisitions partially offset churn)

   Price increase:
   A 5% price increase on remaining subscribers adds revenue.
   Applied after churn — you can only increase price on
   subscribers who haven't already left.

   Spectrum cost:
   This is an OpEx item — it affects EBITDA but not revenue.
   Spectrum cost is approximately 8% of revenue in India.
   A 20% increase in spectrum cost = 20% × 8% = 1.6% EBITDA hit.
*/
function calculateScenario(arpuChange, churnChange, spectrumChange, priceIncrease) {

    const base = window.SCENARIO_BASE;
    // Access the base data we defined in data.js

    // ── Step 1: ARPU impact on revenue
    const arpuMultiplier = 1 + (arpuChange / 100);
    let scenarioRevenue = base.revenue * arpuMultiplier;

    // ── Step 2: Churn impact on revenue
    // Extra churn reduces subscriber base
    // Each 1% increase in churn rate ≈ 0.7% revenue reduction
    const churnMultiplier = 1 - (Math.max(0, churnChange) / 100 * 0.7);
    scenarioRevenue = scenarioRevenue * churnMultiplier;

    // ── Step 3: Price increase offset
    // Applied to remaining subscribers after churn
    const priceMultiplier = 1 + (priceIncrease / 100);
    scenarioRevenue = scenarioRevenue * priceMultiplier;

    // ── Step 4: Calculate EBITDA
    // Spectrum cost is ~8% of base revenue
    // A % change in spectrum cost changes this absolute amount
    const baseSpectrumCost = base.revenue * 0.08;
    const spectrumImpact   = baseSpectrumCost * (spectrumChange / 100);
    // Positive spectrum change = higher cost = lower EBITDA

    // EBITDA = Revenue × margin% − extra spectrum cost
    let scenarioEbitda = (scenarioRevenue * (base.ebitdaPct / 100)) - spectrumImpact;

    // ── Step 5: Calculate impacts vs base
    const revenueImpact = scenarioRevenue - base.revenue;
    const ebitdaImpact  = scenarioEbitda  - base.ebitda;
    const ebitdaPct     = (scenarioEbitda / scenarioRevenue) * 100;

    return {
        scenarioRevenue:  Math.round(scenarioRevenue),
        scenarioEbitda:   Math.round(scenarioEbitda),
        revenueImpact:    Math.round(revenueImpact),
        ebitdaImpact:     Math.round(ebitdaImpact),
        ebitdaPct:        parseFloat(ebitdaPct.toFixed(1))
        // parseFloat removes trailing zeros after rounding
    };
}


/* ══════════════════════════════════════════════════════════
   5. DOM HELPERS
   Small functions that make working with HTML elements easier.
   "DOM" = Document Object Model — the browser's
   representation of all HTML elements on the page.
   ══════════════════════════════════════════════════════════ */

/*
   getEl
   ─────
   Shorthand for document.getElementById.
   Saves typing the full thing every time.

   EXAMPLE:
   Instead of: document.getElementById("arpu-value")
   We write:   getEl("arpu-value")
*/
function getEl(id) {
    return document.getElementById(id);
}


/*
   setText
   ───────
   Sets the text content of an element.
   Safer than innerHTML for plain text
   (innerHTML can execute scripts — security risk).
*/
function setText(id, text) {
    const el = getEl(id);
    if (el) el.textContent = text;
    // "if (el)" check prevents errors if element doesn't exist yet
}


/*
   setHTML
   ───────
   Sets the inner HTML of an element.
   Used when we need to insert HTML tags, not just text.
   Only use this when you control the content being inserted.
*/
function setHTML(id, html) {
    const el = getEl(id);
    if (el) el.innerHTML = html;
}


/* ══════════════════════════════════════════════════════════
   EXPORT TO WINDOW
   Makes all functions available globally.
   ══════════════════════════════════════════════════════════ */

window.formatCrore       = formatCrore;
window.formatPercent     = formatPercent;
window.formatNumber      = formatNumber;
window.getDaysUntil      = getDaysUntil;
window.formatDaysUntil   = formatDaysUntil;
window.formatDate        = formatDate;
window.getTimestamp      = getTimestamp;
window.getSeverityColor  = getSeverityColor;
window.getProgressColor  = getProgressColor;
window.getDeltaClass     = getDeltaClass;
window.calculateScenario = calculateScenario;
window.getEl             = getEl;
window.setText           = setText;
window.setHTML           = setHTML;

/* ── NOTIFICATION BELL ──────────────────────────────────── */

function toggleNotifications() {
    var dd = document.getElementById('notification-dropdown');
    if (!dd) return;
    var isOpen = dd.style.display === 'block';
    dd.style.display = isOpen ? 'none' : 'block';
    if (!isOpen) renderNotifications();

    // Close on outside click
    if (!isOpen) {
        setTimeout(function() {
            document.addEventListener('click', closeNotificationsOutside);
        }, 10);
    }
}

function closeNotificationsOutside(e) {
    var wrapper = document.getElementById('notification-bell-wrapper');
    if (wrapper && !wrapper.contains(e.target)) {
        var dd = document.getElementById('notification-dropdown');
        if (dd) dd.style.display = 'none';
        document.removeEventListener('click', closeNotificationsOutside);
    }
}

function renderNotifications() {
    var list = document.getElementById('notification-list');
    if (!list) return;

    var items = [];

    // Critical + High RAFM alerts — need action
    (window.RAFM_ALERTS || []).filter(function(a) {
        return a.severity === 'CRITICAL' || a.severity === 'HIGH';
    }).slice(0, 3).forEach(function(a) {
        items.push({
            type: 'ALERT',
            title: a.title,
            meta: a.amount + ' · ' + (a.age||0) + 'd open · ' + (a.circle||''),
            action: 'View in RAFM',
            screen: 'rafm',
            urgent: a.severity === 'CRITICAL'
        });
    });

    // Regulatory deadlines — due soon
    (window.REGULATORY_FILINGS || []).filter(function(r) {
        return r.status === 'DUE' || r.status === 'PENDING';
    }).slice(0, 2).forEach(function(r) {
        items.push({
            type: 'REGULATORY',
            title: r.title,
            meta: 'Due ' + r.due,
            action: 'View Calendar',
            screen: 'regulatory',
            urgent: r.status === 'DUE'
        });
    });

    // Vendor flags
    (window.VENDOR_DATA || []).filter(function(v) {
        return v.flag === true;
    }).slice(0, 1).forEach(function(v) {
        items.push({
            type: 'VENDOR',
            title: v.name + ' — Risk Flag',
            meta: 'Score ' + (100 - (v.risk||50)) + ' · ₹' + v.spend + ' Cr exposure',
            action: 'View RAFM',
            screen: 'rafm',
            urgent: v.risk > 80
        });
    });

    if (items.length === 0) {
        list.innerHTML = '<div style="padding:24px;text-align:center;color:var(--text-muted);font-size:12px;">No pending actions</div>';
        return;
    }

    // Update badge count
    var badge = document.getElementById('notif-badge');
    if (badge) { badge.textContent = items.length; badge.style.display = 'flex'; }

    list.innerHTML = items.map(function(item) {
        var typeColor = item.type === 'ALERT' ? (item.urgent ? '#FD349C' : '#F59E0B') : item.type === 'REGULATORY' ? '#00B8F5' : '#F59E0B';
        return '<div style="padding:12px 16px;border-bottom:1px solid var(--border);cursor:pointer;transition:background 0.15s;" ' +
            'onclick="showScreen(\'' + item.screen + '\',document.querySelector(\'[data-screen=' + item.screen + ']\'));toggleNotifications();" ' +
            'onmouseover="this.style.background=\'var(--bg-hover)\'" onmouseout="this.style.background=\'\'">' +
            '<div style="display:flex;align-items:center;gap:6px;margin-bottom:5px;">' +
                '<span style="font-family:var(--font-mono);font-size:8px;font-weight:700;letter-spacing:0.8px;color:' + typeColor + ';background:' + typeColor + '15;border:1px solid ' + typeColor + '33;border-radius:2px;padding:1px 5px;">' + item.type + '</span>' +
                (item.urgent ? '<span style="width:5px;height:5px;border-radius:50%;background:#FD349C;flex-shrink:0;"></span>' : '') +
            '</div>' +
            '<div style="font-size:12px;font-weight:600;color:var(--text-primary);margin-bottom:3px;">' + item.title + '</div>' +
            '<div style="font-family:var(--font-mono);font-size:10px;color:var(--text-muted);">' + item.meta + '</div>' +
        '</div>';
    }).join('');
}

function markAllRead() {
    var badge = document.getElementById('notif-badge');
    if (badge) badge.style.display = 'none';
    var dd = document.getElementById('notification-dropdown');
    if (dd) dd.style.display = 'none';
}

/* ── GLOBAL SEARCH ──────────────────────────────────────── */

var SEARCH_INDEX = [
    // KPIs
    { type: 'KPI', label: 'ARPU', value: '₹181/month', screen: 'dashboard', color: '#00C0AE' },
    { type: 'KPI', label: 'Monthly Churn', value: '1.42%', screen: 'dashboard', color: '#FD349C' },
    { type: 'KPI', label: 'EBITDA Margin', value: '34.6%', screen: 'dashboard', color: '#00B8F5' },
    { type: 'KPI', label: 'Free Cash Flow', value: '₹2,340 Cr', screen: 'dashboard', color: '#63EBDA' },
    { type: 'KPI', label: 'Active Subscribers', value: '312M', screen: 'dashboard', color: '#1E49E2' },
    { type: 'KPI', label: 'Spectrum Coverage', value: '2.8×', screen: 'dashboard', color: '#B497FF' },

    // RAFM Alerts
    { type: 'ALERT', label: 'Interconnect Billing Discrepancy', value: '₹4.8 Cr · CRITICAL', screen: 'rafm', color: '#FD349C' },
    { type: 'ALERT', label: 'TAP File Leakage Zone 3', value: '₹1.2 Cr · HIGH', screen: 'rafm', color: '#F59E0B' },
    { type: 'ALERT', label: 'Prepaid Credit Leakage', value: '₹0.8 Cr · HIGH', screen: 'rafm', color: '#F59E0B' },
    { type: 'ALERT', label: 'SIM Box Fraud UP East', value: '₹0.6 Cr · HIGH', screen: 'rafm', color: '#F59E0B' },
    { type: 'ALERT', label: 'Split PO CloudHost Infra', value: '₹1.92 Cr · CRITICAL', screen: 'rafm', color: '#FD349C' },

    // Circles
    { type: 'CIRCLE', label: 'Mumbai', value: 'ARPU ₹198 · Churn 1.1%', screen: 'dashboard', color: '#00C0AE' },
    { type: 'CIRCLE', label: 'Delhi NCR', value: 'ARPU ₹192 · Churn 1.2%', screen: 'dashboard', color: '#1E49E2' },
    { type: 'CIRCLE', label: 'Maharashtra', value: 'ARPU ₹184 · Churn 1.3%', screen: 'dashboard', color: '#00B8F5' },
    { type: 'CIRCLE', label: 'Bihar', value: 'ARPU ₹154 · Churn 2.1%', screen: 'dashboard', color: '#FD349C' },
    { type: 'CIRCLE', label: 'UP East', value: 'ARPU ₹158 · Churn 1.9%', screen: 'dashboard', color: '#F59E0B' },
    { type: 'CIRCLE', label: 'Karnataka', value: 'ARPU ₹181 · Churn 1.4%', screen: 'dashboard', color: '#00C0AE' },

    // Screens
    { type: 'SCREEN', label: 'RAFM Risk Monitor', value: 'Revenue assurance & fraud', screen: 'rafm', color: '#1E49E2' },
    { type: 'SCREEN', label: 'AI Scenario Studio', value: 'What-if modelling', screen: 'scenario', color: '#00C0AE' },
    { type: 'SCREEN', label: 'Regulatory Calendar', value: 'TRAI filing tracker', screen: 'regulatory', color: '#F59E0B' },
    { type: 'SCREEN', label: 'Connector Status', value: 'System health monitoring', screen: 'connectors', color: '#00B8F5' },
    { type: 'SCREEN', label: 'Industry Benchmarking', value: 'Apex vs Airtel vs Jio', screen: 'benchmarking', color: '#B497FF' },
    { type: 'SCREEN', label: 'DCF Valuation Studio', value: 'Monte Carlo simulation', screen: 'dcf', color: '#63EBDA' },

    // Vendors
    { type: 'VENDOR', label: 'CloudHost Infra Ltd', value: 'Risk Score 14 · OFAC flag', screen: 'rafm', color: '#FD349C' },
    { type: 'VENDOR', label: 'TowerCo Solutions', value: 'Risk Score 38 · ₹28.1 Cr', screen: 'rafm', color: '#F59E0B' }
];

var SEARCH_RESULTS_CACHE = [];

function handleSearch(query) {
    var dd = document.getElementById('search-dropdown');
    if (!dd) return;

    if (!query || query.length < 2) {
        dd.style.display = 'none';
        return;
    }

    var q = query.toLowerCase();
    SEARCH_RESULTS_CACHE = SEARCH_INDEX.filter(function(item) {
        return item.label.toLowerCase().includes(q) || item.value.toLowerCase().includes(q) || item.type.toLowerCase().includes(q);
    }).slice(0, 8);

    if (SEARCH_RESULTS_CACHE.length === 0) {
        dd.style.display = 'none';
        return;
    }

    var typeColors = { KPI: '#00C0AE', ALERT: '#FD349C', CIRCLE: '#1E49E2', SCREEN: '#B497FF', VENDOR: '#F59E0B' };

    dd.innerHTML = SEARCH_RESULTS_CACHE.map(function(r, i) {
        return '<div data-search-idx="' + i + '" style="padding:10px 16px;cursor:pointer;border-bottom:1px solid var(--border);transition:background 0.15s;" ' +
            'onmouseover="this.style.background=\'var(--bg-hover)\'" onmouseout="this.style.background=\'\'">' +
            '<div style="display:flex;justify-content:space-between;align-items:center;">' +
                '<div style="font-size:12px;font-weight:600;color:var(--text-primary);">' + r.label + '</div>' +
                '<div style="font-size:10px;font-weight:700;color:' + (typeColors[r.type] || '#8A9BB0') + ';background:' + (typeColors[r.type] || '#8A9BB0') + '22;padding:2px 8px;border-radius:20px;">' + r.type + '</div>' +
            '</div>' +
            '<div style="font-size:11px;color:var(--text-muted);margin-top:2px;">' + r.value + '</div>' +
        '</div>';
    }).join('');

    // Event delegation on dropdown
    dd.onmousedown = function(e) {
        e.preventDefault(); // Prevent input blur
        var item = e.target.closest('[data-search-idx]');
        if (!item) return;
        var idx = parseInt(item.getAttribute('data-search-idx'));
        var result = SEARCH_RESULTS_CACHE[idx];
        if (result) selectSearchResult(result.screen, result.label);
    };

    dd.style.display = 'block';
}

function selectSearchResult(screen, label) {
    var dd = document.getElementById('search-dropdown');
    if (dd) dd.style.display = 'none';
    document.getElementById('global-search').value = '';
    CURRENT_SCREEN = null; // Force reload even if same screen
    var navEl = document.querySelector('[data-screen="' + screen + '"]');
    showScreen(screen, navEl);
}

function closeSearch() {
    var dd = document.getElementById('search-dropdown');
    if (dd) dd.style.display = 'none';
}
// Close search on outside click
document.addEventListener('click', function(e) {
    var wrapper = document.getElementById('global-search');
    var dd = document.getElementById('search-dropdown');
    if (wrapper && dd && !wrapper.contains(e.target) && !dd.contains(e.target)) {
        closeSearch();
    }
});