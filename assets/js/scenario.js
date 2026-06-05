/* ============================================================
   MERIDIAN V2 · SCENARIO STUDIO
   Screen 3: AI Scenario Studio
   ============================================================ */

function initScenario() {
    renderSliders();
    renderWaterfallChart();
}

function renderSliders() {
    var container = document.getElementById('slider-container');
    if (!container) return;

    container.innerHTML = SCENARIO_SLIDERS.map(function(s) {
        return '<div style="margin-bottom:20px;">' +
            '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">' +
                '<span style="font-size:13px;font-weight:600;color:var(--text-primary);">' + s.label + '</span>' +
                '<span id="val-' + s.id + '" style="font-family:var(--font-mono);font-size:13px;font-weight:700;color:var(--kpmg-cyan);">' + s.default + s.unit + '</span>' +
            '</div>' +
            '<input type="range" id="slider-' + s.id + '" min="' + s.min + '" max="' + s.max + '" step="' + s.step + '" value="' + s.default + '" ' +
                'style="width:100%;accent-color:var(--kpmg-cyan);" oninput="updateScenario()">' +
            '<div style="display:flex;justify-content:space-between;margin-top:2px;">' +
                '<span style="font-size:10px;color:var(--text-muted);">' + s.min + s.unit + '</span>' +
                '<span style="font-size:10px;color:var(--text-muted);">' + s.max + s.unit + '</span>' +
            '</div>' +
        '</div>';
    }).join('');
}

function updateScenario() {
    var arpu     = parseFloat(document.getElementById('slider-arpu-change').value);
    var churn    = parseFloat(document.getElementById('slider-churn-change').value);
    var spectrum = parseFloat(document.getElementById('slider-spectrum-cost').value);
    var price    = parseFloat(document.getElementById('slider-price-increase').value);

    document.getElementById('val-arpu-change').textContent    = (arpu >= 0 ? '+' : '') + arpu + '%';
    document.getElementById('val-churn-change').textContent   = (churn >= 0 ? '+' : '') + churn + '%';
    document.getElementById('val-spectrum-cost').textContent  = (spectrum >= 0 ? '+' : '') + spectrum + '%';
    document.getElementById('val-price-increase').textContent = '+' + price + '%';

    var result = calculateScenario(arpu, churn, spectrum, price);

    document.getElementById('scenario-revenue').textContent = '₹' + result.scenarioRevenue.toLocaleString('en-IN') + ' Cr';
    document.getElementById('scenario-ebitda').textContent  = '₹' + result.scenarioEbitda.toLocaleString('en-IN') + ' Cr';
    document.getElementById('scenario-margin').textContent  = result.ebitdaPct + '%';

    var impactEl    = document.getElementById('revenue-impact');
    var impactValue = result.revenueImpact;
    impactEl.textContent = (impactValue >= 0 ? '+' : '') + '₹' + Math.abs(impactValue).toLocaleString('en-IN') + ' Cr';
    impactEl.style.color = impactValue >= 0 ? 'var(--positive)' : 'var(--danger)';

    renderWaterfallChart(arpu, churn, spectrum, price);
}

function handleScenarioQuery() {
    var input = document.getElementById('scenario-query');
    var resp  = document.getElementById('scenario-response');
    var query = input.value.trim();
    if (!query) return;

    resp.style.display = 'block';
    resp.innerHTML = '<div style="padding:16px;background:var(--bg);border-radius:var(--radius-sm);border:1px solid var(--border-light);display:flex;align-items:center;gap:12px;"><div class="loading-spinner" style="width:20px;height:20px;border-width:2px;"></div><span style="color:var(--text-muted);font-size:13px;">Modelling scenario...</span></div>';

    setTimeout(function() {
        resp.innerHTML = '<div style="padding:16px;background:var(--bg);border-radius:var(--radius-sm);border:1px solid var(--border-light);border-left:3px solid var(--kpmg-cyan);"><div style="font-size:10px;font-weight:700;letter-spacing:1.5px;color:var(--kpmg-cyan);margin-bottom:10px;text-transform:uppercase;">Scenario Analysis</div><div style="font-size:13px;color:var(--text-secondary);line-height:1.7;">If Jio cuts ARPU by 15% to ₹143, competitive pressure would likely force Apex to respond with a 6–8% reduction (₹167–170 range). This reduces quarterly revenue by <strong style="color:var(--danger);">₹205–275 Cr</strong> and compresses EBITDA margin by <strong style="color:var(--danger);">180–220 bps</strong>. Recommend a targeted postpaid retention campaign (est. ₹40–60 Cr) before implementing any price response.</div></div>';
    }, 1500);
}