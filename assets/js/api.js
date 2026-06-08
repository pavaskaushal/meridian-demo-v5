/* ============================================================
   MERIDIAN V4 · API
   Groq AI integration — llama-3.3-70b-versatile
   ============================================================ */

/* Optionally hard-code a key here so the prompt never appears */
var GROQ_API_KEY_PRESET = '';

var APEX_CONTEXT = function() {
    return [
        "You are Meridian, an AI-powered CFO intelligence platform built by KPMG GRCS.",
        "You are analysing data for Apex Telecom, an Indian telecom operator.",
        "ARPU: ₹181/month | Churn: 1.42% | EBITDA: 34.6% | Subscribers: 312M | Circles: 22",
        "FCF: ₹2,340 Cr | Quarterly Revenue: ₹3,420 Cr | Market Share: 22.4%",
        "Competitors: Airtel ₹194 ARPU, Jio ₹168, Vi ₹156, BSNL ₹98",
        "RAFM exposure: ₹9.32 Cr across 6 active alerts",
        "Answer professionally in 3-5 sentences. Use actual numbers.",
        "CRITICAL: Never start with greetings like 'Dear CFO', 'Hello', 'Hi', or any salutation.",
        "Jump straight into the answer. No preamble. No sign-off. Just the insight."
    ].join("\n");
};

/* Load persisted key on startup */
(function() {
    if (GROQ_API_KEY_PRESET) {
        window.GROQ_API_KEY = GROQ_API_KEY_PRESET;
    } else {
        var stored = localStorage.getItem('meridian_groq_key');
        if (stored) window.GROQ_API_KEY = stored;
    }
})();

function callGroq(prompt, context, callback, onError) {
    var apiKey = window.GROQ_API_KEY;
    if (!apiKey) { onError("No API key — click the AI button to add one."); return; }

    var fullPrompt = APEX_CONTEXT() + "\n\n" +
        (context ? context + "\n\n" : "") +
        "USER QUESTION: " + prompt;

    fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + apiKey
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [{ role: "user", content: fullPrompt }],
                temperature: 0.7,
                max_tokens: 512
            })
        }
    )
    .then(function(r) {
        if (!r.ok) return r.json().then(function(e) { throw new Error(e.error.message || 'API error'); });
        return r.json();
    })
    .then(function(d) { callback(d.choices[0].message.content); })
    .catch(function(e) { onError(e.message); });
}

function formatAIResponse(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/^- (.*)/gm, '<div style="display:flex;gap:8px;margin-bottom:4px;"><span style="color:var(--kpmg-cyan);">•</span><span>$1</span></div>')
        .replace(/\n\n/g, '</p><p style="margin-top:10px;">')
        .replace(/\n/g, '<br>');
}

function showApiKeyPrompt(callback) {
    if (window.GROQ_API_KEY) { callback(); return; }

    var modal = document.getElementById('modal-box');
    modal.innerHTML =
        '<div class="modal-header">' +
            '<div><div class="modal-title">Connect Groq AI</div></div>' +
            '<div class="modal-close" onclick="closeModal()">✕</div>' +
        '</div>' +
        '<p style="font-size:13px;color:var(--text-secondary);line-height:1.6;margin-bottom:20px;">Enter your Groq API key to enable AI responses. Saved to browser storage — never sent to KPMG servers.</p>' +
        '<input type="password" id="api-key-input" placeholder="gsk_..." ' +
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
    window.GROQ_API_KEY = key;
    localStorage.setItem('meridian_groq_key', key);
    closeModal();
    if (window._apiKeyCallback) { window._apiKeyCallback(); window._apiKeyCallback = null; }
}

function forgetApiKey() {
    window.GROQ_API_KEY = null;
    localStorage.removeItem('meridian_groq_key');
}
