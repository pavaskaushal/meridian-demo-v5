/* ============================================================
   MERIDIAN V2 · PDF BOARD PACK GENERATOR
   Generates a full CFO board pack using jsPDF
   ============================================================ */

function generateBoardPack() {
    if (typeof window.jspdf === 'undefined') {
        alert('PDF library not loaded. Please check your internet connection.');
        return;
    }

    var doc = new window.jspdf.jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    var W  = 210; // page width mm
    var H  = 297; // page height mm
    var ml = 20;  // margin left
    var mr = 20;  // margin right
    var cw = W - ml - mr; // content width

    /* ── COLOUR PALETTE ──────────────────────────────────── */
    var NAVY   = [10,  12,  20];
    var CYAN   = [0,   192, 174];
    var BLUE   = [30,  73,  226];
    var PINK   = [253, 52,  156];
    var AMBER  = [245, 158, 11];
    var WHITE  = [255, 255, 255];
    var LGREY  = [245, 245, 245];
    var MGREY  = [180, 180, 180];
    var DGREY  = [60,  60,  60];
    var BLACK  = [20,  20,  20];

    var pageNum = 0;

    /* ── HELPERS ─────────────────────────────────────────── */

    function newPage() {
        if (pageNum > 0) doc.addPage();
        pageNum++;

        // Footer on every page except cover
        if (pageNum > 1) {
            doc.setFillColor.apply(doc, NAVY);
            doc.rect(0, H - 12, W, 12, 'F');
            doc.setTextColor.apply(doc, MGREY);
            doc.setFontSize(7);
            doc.setFont('helvetica', 'normal');
            doc.text('CONFIDENTIAL · KPMG GRCS · Lucid™ · Apex Telecom CFO Intelligence Report · ' + getTimestamp(), ml, H - 4);
            doc.text('Page ' + pageNum, W - mr, H - 4, { align: 'right' });
        }

        return 30; // starting Y position
    }

    function sectionHeader(y, title, color) {
        color = color || CYAN;
        doc.setFillColor.apply(doc, color);
        doc.rect(ml, y, 3, 6, 'F');
        doc.setTextColor.apply(doc, BLACK);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text(title, ml + 6, y + 4.5);
        doc.setDrawColor.apply(doc, LGREY);
        doc.setLineWidth(0.3);
        doc.line(ml, y + 8, W - mr, y + 8);
        return y + 14;
    }

    function kv(doc, y, label, value, valueColor) {
        valueColor = valueColor || BLACK;
        doc.setTextColor.apply(doc, DGREY);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text(label, ml, y);
        doc.setTextColor.apply(doc, valueColor);
        doc.setFont('helvetica', 'bold');
        doc.text(String(value), ml + 55, y);
        return y + 5.5;
    }

    function tableRow(y, cols, widths, isHeader, rowColor) {
        var x = ml;
        if (rowColor) {
            doc.setFillColor.apply(doc, rowColor);
            doc.rect(ml, y - 4, cw, 6.5, 'F');
        }
        cols.forEach(function(col, i) {
            doc.setFontSize(isHeader ? 7.5 : 8);
            doc.setFont('helvetica', isHeader ? 'bold' : 'normal');
            doc.setTextColor.apply(doc, isHeader ? DGREY : BLACK);
            var align = (i > 0) ? 'right' : 'left';
            var tx = align === 'right' ? x + widths[i] - 2 : x + 2;
            doc.text(String(col || ''), tx, y, { align: align });
            x += widths[i];
        });
        return y + 7;
    }

    function badge(x, y, text, color) {
        var tw = doc.getTextWidth(text) + 4;
        doc.setFillColor(color[0] + 30, color[1] + 30, color[2] + 30);
        doc.roundedRect(x, y - 3.5, tw, 5, 1, 1, 'F');
        doc.setTextColor.apply(doc, color);
        doc.setFontSize(7);
        doc.setFont('helvetica', 'bold');
        doc.text(text, x + 2, y);
        return x + tw + 3;
    }

    function checkPage(y, needed) {
        if (y + needed > H - 20) {
            return newPage();
        }
        return y;
    }

    /* ══════════════════════════════════════════════════════
       PAGE 1 — COVER
    ══════════════════════════════════════════════════════ */
    newPage();

    // Full dark background
    doc.setFillColor.apply(doc, NAVY);
    doc.rect(0, 0, W, H, 'F');

    // Top accent bar
    doc.setFillColor.apply(doc, CYAN);
    doc.rect(0, 0, W, 3, 'F');

    // KPMG label
    doc.setTextColor.apply(doc, MGREY);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('KPMG GRCS · TMT Practice', ml, 30);

    // Main title
    doc.setTextColor.apply(doc, WHITE);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text('Meridian', ml, 75);

    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor.apply(doc, CYAN);
    doc.text('CFO Intelligence Board Pack', ml, 87);

    // Divider
    doc.setFillColor.apply(doc, CYAN);
    doc.rect(ml, 95, 40, 0.8, 'F');

    // Operator info
    doc.setTextColor.apply(doc, WHITE);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Apex Telecom Limited', ml, 108);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor.apply(doc, MGREY);
    doc.text('22 Licensed Circles · 312M Subscribers · Mumbai', ml, 116);

    // Report details box
    doc.setFillColor(20, 25, 40);
    doc.roundedRect(ml, 130, cw, 40, 3, 3, 'F');

    doc.setTextColor.apply(doc, MGREY);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    var details = [
        ['Report Period',  'June 2025 · Q4 FY2025'],
        ['Generated',      getTimestamp()],
        ['Platform',       'Meridian v2 · Lucid™'],
        ['Prepared by',    'KPMG GRCS — Revenue Assurance & CFO Advisory'],
        ['Classification', 'CONFIDENTIAL — Client Use Only']
    ];
    var dy = 140;
    details.forEach(function(d) {
        doc.setTextColor.apply(doc, MGREY);
        doc.text(d[0], ml + 6, dy);
        doc.setTextColor.apply(doc, WHITE);
        doc.text(d[1], ml + 50, dy);
        dy += 6;
    });

    // Bottom accent
    doc.setFillColor.apply(doc, BLUE);
    doc.rect(0, H - 3, W, 3, 'F');

    /* ══════════════════════════════════════════════════════
       PAGE 2 — EXECUTIVE SUMMARY
    ══════════════════════════════════════════════════════ */
    var y = newPage();

    doc.setTextColor.apply(doc, BLACK);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Executive Summary', ml, y - 10);

    y = sectionHeader(y, 'Financial Performance Highlights');

    var highlights = [
        'ARPU of \u20B9181/month represents 6.5% YoY growth — 2nd highest in Indian telecom market behind Airtel (\u20B9194).',
        'EBITDA margin expanded 130bps over 4 quarters to 34.6%, driven by operating leverage and spectrum efficiency.',
        'Free Cash Flow of \u20B92,340 Cr reflects strong operational execution with Capex/Revenue ratio improving to 9.9%.',
        '312M active subscribers with net adds of 18M YoY. 5G penetration at 12.2% (38M subscribers) across 12 circles.',
        'Monthly churn improved 18bps YoY to 1.42% — Bihar (2.1%) and UP East (1.9%) remain highest-risk circles.'
    ];

    highlights.forEach(function(h) {
        doc.setFillColor.apply(doc, CYAN);
        doc.circle(ml + 1.5, y - 1, 1, 'F');
        doc.setTextColor.apply(doc, DGREY);
        doc.setFontSize(8.5);
        doc.setFont('helvetica', 'normal');
        var lines = doc.splitTextToSize(h, cw - 8);
        doc.text(lines, ml + 6, y);
        y += lines.length * 5 + 3;
    });

    y += 4;
    y = sectionHeader(y, 'Key Risks Requiring CFO Attention', PINK);

    var risks = [
        { sev: 'CRITICAL', text: '\u20B94.8 Cr interconnect billing discrepancy with Jio on Mumbai-Delhi route — 847,000 CDRs affected. Formal dispute required.' },
        { sev: 'CRITICAL', text: '\u20B91.92 Cr split-PO fraud detected at CloudHost Infra Ltd — 4 consecutive POs just below \u20B950L approval threshold. OFAC flag active.' },
        { sev: 'HIGH',     text: 'Annual Subscriber Verification due 15 Aug 2025 at only 15% readiness. Penalty risk: \u20B92 Cr + disconnection.' },
        { sev: 'HIGH',     text: '\u20B90.8 Cr prepaid credit leakage in Maharashtra — VoLTE rate plan misconfiguration affecting 18,400 subscribers.' }
    ];

    risks.forEach(function(r) {
        var col = r.sev === 'CRITICAL' ? PINK : AMBER;
        badge(ml, y, r.sev, col);
        doc.setTextColor.apply(doc, DGREY);
        doc.setFontSize(8.5);
        doc.setFont('helvetica', 'normal');
        var lines = doc.splitTextToSize(r.text, cw - 22);
        doc.text(lines, ml + 20, y);
        y += lines.length * 5 + 4;
    });

    /* ══════════════════════════════════════════════════════
       PAGE 3 — TIER 1 KPIs
    ══════════════════════════════════════════════════════ */
    y = newPage();

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor.apply(doc, BLACK);
    doc.text('Tier 1 KPIs', ml, y - 10);

    y = sectionHeader(y, 'Key Performance Indicators · June 2025');

    var kpis = window.KPI_LIBRARY || KPI_DATA;
    var activeKpis = (window.ACTIVE_KPIS || ['arpu','churn','ebitda','spectrum','fcf','subscribers'])
        .map(function(id) { return kpis.find(function(k) { return k.id === id; }); })
        .filter(Boolean);

    // KPI cards — 2 per row
    var cardW = (cw - 8) / 2;
    var cardH = 28;
    var col   = 0;
    var rowY  = y;

    activeKpis.forEach(function(kpi) {
        var cx = ml + col * (cardW + 8);

        doc.setFillColor.apply(doc, LGREY);
        doc.roundedRect(cx, rowY, cardW, cardH, 2, 2, 'F');

        // Accent bar
        var ac = hexToRgb(kpi.accentColor);
        doc.setFillColor.apply(doc, ac);
        doc.rect(cx, rowY, 2.5, cardH, 'F');

        // Label
        doc.setTextColor.apply(doc, DGREY);
        doc.setFontSize(7);
        doc.setFont('helvetica', 'bold');
        doc.text(kpi.label.toUpperCase(), cx + 6, rowY + 7);

        // Value
        doc.setTextColor.apply(doc, BLACK);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text(kpi.value + kpi.unit, cx + 6, rowY + 17);

        // Delta
        var isNeg = kpi.delta.startsWith('-') && kpi.id !== 'churn' && kpi.id !== 'calldrop' && kpi.id !== 'capexratio';
        var deltaCol = kpi.delta.startsWith('+') ? [0, 160, 100] : (kpi.id === 'churn' || kpi.id === 'calldrop' ? [0, 160, 100] : PINK);
        doc.setTextColor.apply(doc, deltaCol);
        doc.setFontSize(7.5);
        doc.setFont('helvetica', 'normal');
        doc.text(kpi.delta + ' ' + kpi.deltaLabel, cx + 6, rowY + 23);

        col++;
        if (col === 2) {
            col  = 0;
            rowY += cardH + 6;
        }
    });

    if (col !== 0) rowY += cardH + 6;
    y = rowY + 4;

    /* ══════════════════════════════════════════════════════
       PAGE 4 — REVENUE ANALYSIS
    ══════════════════════════════════════════════════════ */
    y = newPage();

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor.apply(doc, BLACK);
    doc.text('Revenue Analysis', ml, y - 10);

    y = sectionHeader(y, 'Revenue Breakdown by Segment · Q4 FY25');

    var headers = ['Segment', 'Revenue', 'Share %'];
    var widths  = [90, 50, 30];
    y = tableRow(y, headers, widths, true, LGREY);

    REVENUE_BREAKDOWN.forEach(function(r, i) {
        y = checkPage(y, 10);
        var bg = i % 2 === 0 ? null : [250, 250, 250];
        y = tableRow(y, [r.segment, 'Rs.' + r.revenue + ' Cr', r.pct + '%'], widths, false, bg);
    });

    y += 8;
    y = checkPage(y, 40);
    y = sectionHeader(y, 'ARPU Trend · Jul 2024 – Sep 2025');

    var arpuHeaders = ['Month', 'ARPU (₹)', 'Type'];
    var arpuWidths  = [60, 60, 50];
    y = tableRow(y, arpuHeaders, arpuWidths, true, LGREY);

    ARPU_CHART_DATA.months.forEach(function(m, i) {
        y = checkPage(y, 10);
        var val  = i < 12 ? ARPU_CHART_DATA.historical[i] : ARPU_CHART_DATA.forecast[i - 12];
        var type = i < 12 ? 'Historical' : 'AI Forecast';
        var bg   = i % 2 === 0 ? null : [250, 250, 250];
        y = tableRow(y, [m, 'Rs.' + val + '/mo', type], arpuWidths, false, bg);
    });

    /* ══════════════════════════════════════════════════════
       PAGE 5 — CIRCLE PERFORMANCE
    ══════════════════════════════════════════════════════ */
    y = newPage();

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor.apply(doc, BLACK);
    doc.text('Circle Performance', ml, y - 10);

    y = sectionHeader(y, 'Top 10 Circles by Revenue · June 2025');

    var cHeaders = ['Circle', 'Revenue', 'ARPU', 'Churn %', 'Subscribers'];
    var cWidths  = [50, 35, 30, 30, 25];
    y = tableRow(y, cHeaders, cWidths, true, LGREY);

    CIRCLE_DATA.forEach(function(c, i) {
        y = checkPage(y, 10);
        var bg       = i % 2 === 0 ? null : [250, 250, 250];
        var churnCol = c.churn > 1.8 ? PINK : c.churn > 1.4 ? AMBER : null;
        y = tableRow(y, [
            c.circle,
            'Rs.' + c.revenue + ' Cr',
            'Rs.' + c.arpu,
            c.churn + '%',
            c.subscribers + 'M'
        ], cWidths, false, bg);

        
    });

    /* ══════════════════════════════════════════════════════
       PAGE 6 — COMPETITOR BENCHMARKING
    ══════════════════════════════════════════════════════ */
    y = newPage();

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor.apply(doc, BLACK);
    doc.text('Competitor Benchmarking', ml, y - 10);

    y = sectionHeader(y, 'Indian Telecom Operator ARPU Comparison · June 2025');

    var compHeaders = ['Operator', 'ARPU (₹/mo)', 'Subscribers', 'Market Share'];
    var compWidths  = [55, 40, 40, 35];
    y = tableRow(y, compHeaders, compWidths, true, LGREY);

    COMPETITOR_DATA.forEach(function(c, i) {
        y = checkPage(y, 10);
        var bg = c.isUs ? [230, 250, 248] : (i % 2 === 0 ? null : [250, 250, 250]);
        y = tableRow(y, [
            c.isUs ? c.name + ' (us)' : c.name,
            'Rs.' + c.arpu,
            c.subscribers + 'M',
            c.marketShare + '%'
        ], compWidths, false, bg);
    });

    y += 8;
    y = sectionHeader(y, 'Competitive Position Analysis');

    var insights = [
        'Apex ranks 2nd in ARPU at Rs.181 — a Rs.13 gap vs Airtel (Rs.194) represents a postpaid pricing opportunity.',
        'Jio ARPU of Rs.168 with 34.5% market share indicates aggressive price-led growth strategy.',
        'Vi declining subscriber base (198M) at Rs.156 ARPU creates an opportunity for targeted acquisition.',
        '5G ARPU of Rs.312 (2.4x blended) makes network investment the primary ARPU improvement lever.'
    ];

    insights.forEach(function(ins) {
        doc.setFillColor.apply(doc, BLUE);
        doc.circle(ml + 1.5, y - 1, 1, 'F');
        doc.setTextColor.apply(doc, DGREY);
        doc.setFontSize(8.5);
        doc.setFont('helvetica', 'normal');
        var lines = doc.splitTextToSize(ins, cw - 8);
        doc.text(lines, ml + 6, y);
        y += lines.length * 5 + 3;
    });

    /* ══════════════════════════════════════════════════════
       PAGE 7 — QUARTERLY P&L
    ══════════════════════════════════════════════════════ */
    y = newPage();

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor.apply(doc, BLACK);
    doc.text('Quarterly P&L Trend', ml, y - 10);

    y = sectionHeader(y, 'Revenue · EBITDA · Capex · FCF · FY2025–FY2026');

    var plHeaders = ['Quarter', 'Revenue', 'EBITDA', 'Margin %', 'Capex', 'FCF'];
    var plWidths  = [32, 32, 32, 28, 28, 18];
    y = tableRow(y, plHeaders, plWidths, true, LGREY);

    QUARTERLY_PL.forEach(function(q, i) {
        y = checkPage(y, 10);
        var bg = i % 2 === 0 ? null : [250, 250, 250];
        y = tableRow(y, [
            q.quarter,
            'Rs.' + q.revenue + ' Cr',
            'Rs.' + q.ebitda + ' Cr',
            q.ebitdaPct + '%',
            'Rs.' + q.capex + ' Cr',
            'Rs.' + q.fcf + ' Cr'
        ], plWidths, false, bg);
    });

    y += 8;
    y = sectionHeader(y, 'P&L Analysis');

    var plInsights = [
        'Revenue grew from \u20B93,180 Cr (Q1 FY25) to \u20B93,510 Cr (Q1 FY26) — a 10.4% improvement over 5 quarters.',
        'EBITDA margin expanded 160bps from 33.3% to 34.9% driven by operating leverage on network costs.',
        'Capex declining from \u20B9420 Cr to \u20B9320 Cr as 5G rollout matures — improving FCF conversion.',
        'FCF of \u20B9905 Cr in Q1 FY26 represents 41% improvement vs Q1 FY25 (\u20B9640 Cr).'
    ];

    plInsights.forEach(function(ins) {
        doc.setFillColor.apply(doc, CYAN);
        doc.circle(ml + 1.5, y - 1, 1, 'F');
        doc.setTextColor.apply(doc, DGREY);
        doc.setFontSize(8.5);
        doc.setFont('helvetica', 'normal');
        var lines = doc.splitTextToSize(ins, cw - 8);
        doc.text(lines, ml + 6, y);
        y += lines.length * 5 + 3;
    });

    /* ══════════════════════════════════════════════════════
       PAGE 8 — RAFM ALERT SUMMARY
    ══════════════════════════════════════════════════════ */
    y = newPage();

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor.apply(doc, BLACK);
    doc.text('RAFM Alert Summary', ml, y - 10);

    // Total exposure box
    doc.setFillColor(253, 52, 156, 0.1);
    doc.setFillColor(255, 235, 245);
    doc.roundedRect(ml, y - 6, cw, 16, 2, 2, 'F');
    doc.setFillColor.apply(doc, PINK);
    doc.rect(ml, y - 6, 2.5, 16, 'F');
    doc.setTextColor.apply(doc, DGREY);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Total Revenue at Risk', ml + 6, y + 1);
    doc.setTextColor.apply(doc, PINK);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('\u20B99.32 Cr', ml + 6, y + 9);
    doc.setTextColor.apply(doc, DGREY);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('6 active alerts across RAFM, Fraud, PPP, and Regulatory categories', ml + 50, y + 5);
    y += 22;

    y = sectionHeader(y, 'Active Alerts · Ranked by Financial Exposure');

    RAFM_ALERTS.forEach(function(alert, i) {
        y = checkPage(y, 35);

        var sevColor = alert.severity === 'critical' ? PINK : alert.severity === 'high' ? AMBER : CYAN;

        doc.setFillColor.apply(doc, LGREY);
        doc.roundedRect(ml, y - 2, cw, 28, 2, 2, 'F');
        doc.setFillColor.apply(doc, sevColor);
        doc.rect(ml, y - 2, 2.5, 28, 'F');

        // Alert header
        doc.setTextColor.apply(doc, DGREY);
        doc.setFontSize(7);
        doc.setFont('helvetica', 'bold');
        doc.text(alert.type + ' · ' + alert.severity.toUpperCase(), ml + 6, y + 3);

        doc.setTextColor.apply(doc, BLACK);
        doc.setFontSize(9);
        doc.text(alert.title, ml + 6, y + 9);

        // Amount
        doc.setTextColor.apply(doc, sevColor);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(alert.amount, W - mr, y + 9, { align: 'right' });

        // Description
        doc.setTextColor.apply(doc, DGREY);
        doc.setFontSize(7.5);
        doc.setFont('helvetica', 'normal');
        var descLines = doc.splitTextToSize(alert.description, cw - 12);
        doc.text(descLines.slice(0, 2), ml + 6, y + 15);

        // Action
        doc.setTextColor.apply(doc, BLUE);
        doc.setFontSize(7);
        var actionLines = doc.splitTextToSize('Action: ' + alert.action, cw - 12);
        doc.text(actionLines.slice(0, 1), ml + 6, y + 24);

        y += 33;
    });

    /* ══════════════════════════════════════════════════════
       PAGE 9 — VENDOR RISK
    ══════════════════════════════════════════════════════ */
    y = newPage();

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor.apply(doc, BLACK);
    doc.text('Vendor Risk Highlights', ml, y - 10);

    y = sectionHeader(y, 'High & Critical Risk Vendors · CIBIL · GST · OFAC · MCA21');

    var riskVendors = VENDOR_DATA.filter(function(v) { return v.score < 55; });

    var vHeaders = ['Vendor', 'Risk Score', 'Exposure', 'Issues Flagged'];
    var vWidths  = [55, 25, 30, 60];
    y = tableRow(y, vHeaders, vWidths, true, LGREY);

    riskVendors.forEach(function(v, i) {
        y = checkPage(y, 12);
        var scoreCol = v.score < 31 ? PINK : AMBER;
        var bg = i % 2 === 0 ? null : [250, 250, 250];
        y = tableRow(y, [v.name, v.score + ' / 100', v.exposure, v.issue || 'None'], vWidths, false, bg);

        // Colour the score
        doc.setTextColor.apply(doc, scoreCol);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.text(String(v.score) + ' / 100', ml + vWidths[0] + vWidths[1] - 2, y - 3, { align: 'right' });
        doc.setTextColor.apply(doc, BLACK);
    });

    y += 8;
    y = sectionHeader(y, 'Vendor Risk Summary');
    y = kv(doc, y, 'Critical risk vendors (score < 31)', '3 vendors', PINK);
    y = kv(doc, y, 'Elevated risk vendors (score 31-55)', '5 vendors', AMBER);
    y = kv(doc, y, 'Healthy vendors (score > 55)', '24 vendors', [0, 160, 100]);
    y = kv(doc, y, 'Total vendor exposure', '₹900+ Cr', BLACK);
    y = kv(doc, y, 'OFAC flags active', '1 vendor (CloudHost Infra)', PINK);

    /* ══════════════════════════════════════════════════════
       PAGE 10 — REGULATORY CALENDAR
    ══════════════════════════════════════════════════════ */
    y = newPage();

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor.apply(doc, BLACK);
    doc.text('Regulatory Calendar', ml, y - 10);

    y = sectionHeader(y, 'TRAI & DoT Filing Tracker · June–August 2025');

    REGULATORY_FILINGS.forEach(function(filing) {
        y = checkPage(y, 45);

        var readColor = filing.readiness < 40 ? PINK : filing.readiness < 70 ? AMBER : CYAN;

        doc.setFillColor.apply(doc, LGREY);
        doc.roundedRect(ml, y - 2, cw, 38, 2, 2, 'F');
        doc.setFillColor.apply(doc, readColor);
        doc.rect(ml, y - 2, 2.5, 38, 'F');

        // Title and authority
        doc.setTextColor.apply(doc, BLACK);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(filing.title, ml + 6, y + 5);

        doc.setTextColor.apply(doc, DGREY);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text(filing.authority + ' · Due ' + formatDate(filing.dueDate), ml + 6, y + 11);

        // Readiness score
        doc.setTextColor.apply(doc, readColor);
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text(filing.readiness + '%', W - mr, y + 9, { align: 'right' });

        // Progress bar
        doc.setFillColor(220, 220, 220);
        doc.roundedRect(ml + 6, y + 14, cw - 12, 3, 1, 1, 'F');
        doc.setFillColor.apply(doc, readColor);
        doc.roundedRect(ml + 6, y + 14, (cw - 12) * filing.readiness / 100, 3, 1, 1, 'F');

        // Description
        doc.setTextColor.apply(doc, DGREY);
        doc.setFontSize(7.5);
        doc.setFont('helvetica', 'normal');
        var descLines = doc.splitTextToSize(filing.description, cw - 12);
        doc.text(descLines.slice(0, 1), ml + 6, y + 22);

        // Penalty
        doc.setTextColor.apply(doc, PINK);
        doc.setFontSize(7.5);
        doc.setFont('helvetica', 'bold');
        doc.text('Penalty: ' + filing.penalty, ml + 6, y + 29);

        // Pending items
        doc.setTextColor.apply(doc, DGREY);
        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.text('Pending: ' + filing.pendingItems.slice(0, 2).join(' · '), ml + 6, y + 35);

        y += 44;
    });

    /* ══════════════════════════════════════════════════════
       PAGE 11 — NETWORK KPIs
    ══════════════════════════════════════════════════════ */
    y = newPage();

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor.apply(doc, BLACK);
    doc.text('Network KPIs', ml, y - 10);

    y = sectionHeader(y, 'Network Performance Metrics · June 2025');

    var networkKpis = [
        ['Call Drop Rate',       NETWORK_KPIS.callDropRate + '%',              'Target < 2.0%'],
        ['4G Data Speed',        NETWORK_KPIS.dataSpeed4G + ' Mbps',           'National average: 18.2 Mbps'],
        ['5G Data Speed',        NETWORK_KPIS.dataSpeed5G + ' Mbps',           '12 circles deployed'],
        ['Network Uptime',       NETWORK_KPIS.networkUptime + '%',             'Industry standard: 99.9%'],
        ['VoLTE Penetration',    NETWORK_KPIS.voLTEPenetration + '%',          'Target: 75% by Dec 2025'],
        ['5G Circles',           NETWORK_KPIS.fiveGCircles + ' of 22',        'Phase 2: 18 circles by Mar 2026'],
        ['Total Sites',          NETWORK_KPIS.totalSites.toLocaleString(),     'Tenancy ratio: 1.42'],
        ['Fibered Sites',        NETWORK_KPIS.fiberedSites.toLocaleString(),   '44.7% fiberisation rate']
    ];

    var nHeaders = ['Metric', 'Value', 'Context'];
    var nWidths  = [55, 40, 75];
    y = tableRow(y, nHeaders, nWidths, true, LGREY);

    networkKpis.forEach(function(n, i) {
        y = checkPage(y, 10);
        var bg = i % 2 === 0 ? null : [250, 250, 250];
        y = tableRow(y, n, nWidths, false, bg);
    });

    /* ══════════════════════════════════════════════════════
       PAGE 12 — DISCLAIMER
    ══════════════════════════════════════════════════════ */
    y = newPage();

    doc.setFillColor.apply(doc, NAVY);
    doc.rect(0, 0, W, H, 'F');

    doc.setFillColor.apply(doc, CYAN);
    doc.rect(0, 0, W, 3, 'F');

    doc.setTextColor.apply(doc, WHITE);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Confidentiality & Disclaimer', ml, 40);

    doc.setFillColor.apply(doc, CYAN);
    doc.rect(ml, 45, 40, 0.8, 'F');

    var disclaimer = [
        'This report has been prepared by KPMG Global Services Private Limited ("KPMG") for the exclusive use of Apex Telecom Limited ("the Client"). The information contained in this report is confidential and has been prepared solely for the purpose of providing CFO-level financial intelligence and risk advisory services.',
        '',
        'This report is based on data available as of June 2025 and generated through the Meridian platform (Lucid™) developed by KPMG GRCS — Revenue Assurance, Compliance & Special Investigations — Technology, Media & Telecommunications Practice.',
        '',
        'The findings, conclusions, and recommendations expressed in this report are those of KPMG based on the information provided and available at the time of preparation. KPMG does not assume any responsibility for the accuracy or completeness of the information provided by third parties.',
        '',
        'This report may not be reproduced, distributed, or disclosed to any third party without the prior written consent of KPMG. Any unauthorised use, reproduction, or distribution of this report or any portion thereof may be unlawful.',
        '',
        'KPMG Global Services Private Limited is registered in India and is a member firm of KPMG International Limited, a private English company limited by guarantee.',
    ];

    var dy2 = 55;
    disclaimer.forEach(function(para) {
        if (para === '') { dy2 += 4; return; }
        doc.setTextColor.apply(doc, MGREY);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        var lines = doc.splitTextToSize(para, cw);
        doc.text(lines, ml, dy2);
        dy2 += lines.length * 5 + 3;
    });

    doc.setTextColor.apply(doc, WHITE);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('KPMG GRCS · Lucid™ · Meridian v2', ml, H - 30);
    doc.setTextColor.apply(doc, MGREY);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Generated: ' + getTimestamp(), ml, H - 24);
    doc.text('© 2025 KPMG Global Services Private Limited', ml, H - 18);

    doc.setFillColor.apply(doc, BLUE);
    doc.rect(0, H - 3, W, 3, 'F');

    /* ── SAVE ────────────────────────────────────────────── */
    var filename = 'Meridian_BoardPack_ApexTelecom_' + new Date().toISOString().slice(0, 10) + '.pdf';
    doc.save(filename);
}

/* ── HELPER: hex to rgb array ───────────────────────────── */
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
        : [0, 0, 0];
}