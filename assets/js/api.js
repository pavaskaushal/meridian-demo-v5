/* ============================================================
   MERIDIAN V2 · API
   Gemini AI integration
   ============================================================ */

var APEX_CONTEXT = function() {
    return [
        "You are Meridian, an AI-powered CFO intelligence platform built by KPMG GRCS.",
        "You are analysing data for Apex Telecom, an Indian telecom operator.",
        "ARPU: ₹181/month | Churn: 1.42% | EBITDA: 34.6% | Subscribers: 312M | Circles: 22",
        "FCF: ₹2,340 Cr | Quarterly Revenue: ₹3,420 Cr | Market Share: 22.4%",
        "Competitors: Airtel ₹194 ARPU, Jio ₹168, Vi ₹156, BSNL ₹98",
        "RAFM exposure: ₹9.32 Cr across 6 active alerts",
        "Answer professionally in 3-5 sentences. Use actual numbers. Speak to the CFO directly."
    ].join("\n");
};

function callGemini(prompt, context, callback, onError) {
    var apiKey = window.GEMINI_API_KEY;
    if (!apiKey) { onError("No API key."); return; }

    var fullPrompt = APEX_CONTEXT() + "\n\n" +
        (context ? context + "\n\n" : "") +
        "USER QUESTION: " + prompt;

    fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: fullPrompt }] }],
                generationConfig: { temperature: 0.7, maxOutputTokens: 512 }
            })
        }
    )
    .then(function(r) {
        if (!r.ok) return r.json().then(function(e) { throw new Error(e.error.message); });
        return r.json();
    })
    .then(function(d) { callback(d.candidates[0].content.parts[0].text); })
    .catch(function(e) { onError(e.message); });
}

function formatGeminiResponse(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/^- (.*)/gm, '<div style="display:flex;gap:8px;margin-bottom:4px;"><span style="color:var(--kpmg-cyan);">•</span><span>$1</span></div>')
        .replace(/\n\n/g, '</p><p style="margin-top:10px;">')
        .replace(/\n/g, '<br>');
}

function showApiKeyPrompt(callback) {
    if (window.GEMINI_API_KEY) { callback(); return; }

    var modal = document.getElementById('modal-box');
    modal.innerHTML =
        '<div class="modal-header">' +
            '<div><div class="modal-title">Enter Gemini API Key</div></div>' +
        '</div>' +
        '<p style="font-size:13px;color:var(--text-secondary);line-height:1.6;margin-bottom:20px;">Enter your Google Gemini API key to enable AI responses. Stored in memory only.</p>' +
        '<input type="password" id="api-key-input" placeholder="AIzaSy..." ' +
            'style="width:100%;background:var(--bg);border:1px solid var(--border-light);border-radius:var(--radius-sm);padding:10px 16px;font-size:13px;color:var(--text-primary);margin-bottom:16px;box-sizing:border-box;">' +
        '<div style="display:flex;gap:12px;">' +
            '<button class="btn btn-primary" onclick="saveApiKey()">Connect</button>' +
            '<button class="btn btn-secondary" onclick="closeModal()">Skip</button>' +
        '</div>';

    document.getElementById('modal-overlay').classList.add('active');
    document.body.style.overflow = 'hidden';
    window._apiKeyCallback = callback;
}

function saveApiKey() {
    var key = document.getElementById('api-key-input').value.trim();
    if (!key) return;
    window.GEMINI_API_KEY = key;
    closeModal();
    if (window._apiKeyCallback) { window._apiKeyCallback(); window._apiKeyCallback = null; }
}