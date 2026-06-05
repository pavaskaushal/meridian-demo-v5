/* ============================================================
   MERIDIAN V2 · AUTH
   Splash screen · PIN login · Logout
   PIN: 2025
   ============================================================ */

var AUTH = {
    pin:       '2025',
    entered:   '',
    unlocked:  false
};

/* ── INJECT SPLASH + LOGIN HTML ─────────────────────────── */

function injectAuthScreens() {
    var div = document.createElement('div');
    div.id  = 'auth-wrapper';
    div.innerHTML = `

    <!-- ═══════════ SPLASH SCREEN ═══════════ -->
    <div id="splash-screen" style="
        position:fixed;inset:0;z-index:9999;
        background:#0A0A0A;
        display:flex;flex-direction:column;
        align-items:center;justify-content:center;
        gap:0;
    ">
        <!-- Top accent -->
        <div style="position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,#1E49E2,#00B8F5,#00C0AE);"></div>

        <!-- KPMG Logo -->
        <img src="assets/kpmg-white.svg" style="height:28px;width:auto;margin-bottom:24px;opacity:0;animation:fadeUp 0.6s ease 0.3s forwards;">

        <!-- Meridian wordmark -->
        <div style="opacity:0;animation:fadeUp 0.6s ease 0.6s forwards;text-align:center;">
            <div style="font-family:'DM Sans',sans-serif;font-size:42px;font-weight:700;color:#FFFFFF;letter-spacing:3px;text-transform:uppercase;line-height:1;">Meridian</div>
            <div style="font-family:'DM Sans',sans-serif;font-size:14px;font-style:italic;color:#00C0AE;margin-top:4px;letter-spacing:1px;">CFO Intelligence Platform</div>
        </div>

        <!-- Divider -->
        <div style="width:60px;height:1px;background:rgba(0,192,174,0.4);margin:28px 0;opacity:0;animation:fadeUp 0.6s ease 0.9s forwards;"></div>

        <!-- Operator -->
        <div style="opacity:0;animation:fadeUp 0.6s ease 1.1s forwards;text-align:center;">
            <div style="font-family:'DM Sans',sans-serif;font-size:15px;font-weight:600;color:#FFFFFF;">Apex Telecom Limited</div>
            <div style="font-family:'DM Sans',sans-serif;font-size:12px;color:#8A9BB0;margin-top:4px;">22 Circles · 312M Subscribers · Mumbai</div>
        </div>

        <!-- Loading bar -->
        <div style="position:absolute;bottom:0;left:0;right:0;height:3px;background:rgba(255,255,255,0.05);">
            <div id="splash-progress" style="height:3px;background:linear-gradient(90deg,#1E49E2,#00C0AE);width:0%;transition:width 1.8s ease;"></div>
        </div>

        
    </div>

    <!-- ═══════════ PIN SCREEN ═══════════ -->
    <div id="pin-screen" style="
        position:fixed;inset:0;z-index:9998;
        background:#0A0A0A;
        display:none;
        flex-direction:column;
        align-items:center;justify-content:center;
    ">
        <!-- Top accent -->
        <div style="position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,#1E49E2,#00B8F5,#00C0AE);"></div>

        <!-- Card -->
        <div style="
            background:#111111;
            border:1px solid #222222;
            border-radius:16px;
            padding:48px 40px;
            width:360px;
            text-align:center;
            box-shadow:0 24px 80px rgba(0,0,0,0.6);
        ">
            <!-- Logo -->
            <img src="assets/kpmg-white.svg" style="height:22px;width:auto;margin-bottom:20px;">

            <!-- Title -->
            <div style="font-family:'DM Sans',sans-serif;font-size:22px;font-weight:700;color:#FFFFFF;letter-spacing:3px;text-transform:uppercase;margin-bottom:4px;">Meridian</div>
            <div style="font-family:'DM Sans',sans-serif;font-size:12px;color:#8A9BB0;margin-bottom:32px;font-style:italic;">Secure Access</div>

            <!-- PIN dots -->
            <div id="pin-dots" style="display:flex;gap:16px;justify-content:center;margin-bottom:32px;">
                <div class="pin-dot" id="dot-0"></div>
                <div class="pin-dot" id="dot-1"></div>
                <div class="pin-dot" id="dot-2"></div>
                <div class="pin-dot" id="dot-3"></div>
            </div>

            <!-- Error message -->
            <div id="pin-error" style="font-family:'DM Sans',sans-serif;font-size:12px;color:#FD349C;margin-bottom:16px;height:16px;"></div>

            <!-- Numpad -->
            <div id="pin-pad" style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;">
                <button class="pin-btn" onclick="pinPress('1')">1</button>
                <button class="pin-btn" onclick="pinPress('2')">2</button>
                <button class="pin-btn" onclick="pinPress('3')">3</button>
                <button class="pin-btn" onclick="pinPress('4')">4</button>
                <button class="pin-btn" onclick="pinPress('5')">5</button>
                <button class="pin-btn" onclick="pinPress('6')">6</button>
                <button class="pin-btn" onclick="pinPress('7')">7</button>
                <button class="pin-btn" onclick="pinPress('8')">8</button>
                <button class="pin-btn" onclick="pinPress('9')">9</button>
                <button class="pin-btn pin-btn-clear" onclick="pinClear()" style="font-size:11px;">CLEAR</button>
                <button class="pin-btn" onclick="pinPress('0')">0</button>
                <button class="pin-btn pin-btn-del" onclick="pinDelete()">⌫</button>
            </div>

            <!-- Hint -->
            <div style="font-family:'DM Sans',sans-serif;font-size:10px;color:#4A5568;margin-top:24px;letter-spacing:1px;">CONFIDENTIAL · AUTHORISED ACCESS ONLY</div>
        </div>

        </div>

    <!-- ═══════════ STYLES ═══════════ -->
    <style>
        #modal-overlay { z-index: 9000 !important; }
        @keyframes fadeUp {
            from { opacity:0; transform:translateY(12px); }
            to   { opacity:1; transform:translateY(0); }
        }
        @keyframes shake {
            0%,100% { transform:translateX(0); }
            20%     { transform:translateX(-8px); }
            40%     { transform:translateX(8px); }
            60%     { transform:translateX(-6px); }
            80%     { transform:translateX(6px); }
        }
        @keyframes pinSuccess {
            0%   { transform:scale(1); }
            50%  { transform:scale(1.08); }
            100% { transform:scale(1); }
        }

        .pin-dot {
            width:14px; height:14px;
            border-radius:50%;
            border:2px solid #333333;
            background:transparent;
            transition:all 0.15s ease;
        }
        .pin-dot.filled {
            background:#00C0AE;
            border-color:#00C0AE;
            box-shadow:0 0 8px rgba(0,192,174,0.5);
        }
        .pin-dot.error {
            background:#FD349C;
            border-color:#FD349C;
            box-shadow:0 0 8px rgba(253,52,156,0.5);
        }

        .pin-btn {
            font-family:'DM Sans',sans-serif;
            font-size:18px;
            font-weight:600;
            color:#FFFFFF;
            background:#1A1A1A;
            border:1px solid #2A2A2A;
            border-radius:10px;
            padding:16px;
            cursor:pointer;
            transition:all 0.1s ease;
            user-select:none;
        }
        .pin-btn:hover {
            background:#222222;
            border-color:#00C0AE;
            color:#00C0AE;
        }
        .pin-btn:active {
            transform:scale(0.94);
            background:#00C0AE22;
        }
        .pin-btn-clear {
            font-size:10px !important;
            color:#8A9BB0 !important;
            letter-spacing:1px;
        }
        .pin-btn-del {
            font-size:16px !important;
        }

        /* Light mode overrides for auth screens */
        body.light-mode #pin-screen { background:#F8F9FA; }
        body.light-mode #pin-screen > div:nth-child(2) {
            background:#FFFFFF;
            border-color:#E2E8F0;
            box-shadow:0 24px 80px rgba(0,0,0,0.12);
        }
        body.light-mode .pin-btn {
            background:#F8F9FA;
            border-color:#E2E8F0;
            color:#0F172A;
        }
        body.light-mode .pin-btn:hover {
            border-color:#00C0AE;
            color:#00C0AE;
        }
        body.light-mode #pin-screen .pin-dot {
            border-color:#CBD5E1;
        }
    </style>
    `;

    document.body.insertBefore(div, document.body.firstChild);
}

/* ── SPLASH LOGIC ───────────────────────────────────────── */

function runSplash() {
    // Start progress bar
    setTimeout(function() {
        var bar = document.getElementById('splash-progress');
        if (bar) bar.style.width = '100%';
    }, 100);

    // Transition to PIN after 2.2 seconds
    setTimeout(function() {
        var splash = document.getElementById('splash-screen');
        var pin    = document.getElementById('pin-screen');
        if (!splash || !pin) return;

        splash.style.transition = 'opacity 0.4s ease';
        splash.style.opacity    = '0';

        setTimeout(function() {
            splash.style.display = 'none';
            pin.style.display    = 'flex';
            pin.style.opacity    = '0';
            pin.style.transition = 'opacity 0.4s ease';
            setTimeout(function() { pin.style.opacity = '1'; }, 50);
        }, 400);
    }, 3000);
}

/* ── PIN LOGIC ──────────────────────────────────────────── */

function pinPress(digit) {
    if (AUTH.entered.length >= 4) return;
    AUTH.entered += digit;
    updateDots();
    if (AUTH.entered.length === 4) {
        setTimeout(checkPin, 150);
    }
}

function pinDelete() {
    AUTH.entered = AUTH.entered.slice(0, -1);
    updateDots();
}

function pinClear() {
    AUTH.entered = '';
    updateDots();
    document.getElementById('pin-error').textContent = '';
}

function updateDots() {
    for (var i = 0; i < 4; i++) {
        var dot = document.getElementById('dot-' + i);
        if (!dot) continue;
        dot.className = 'pin-dot' + (i < AUTH.entered.length ? ' filled' : '');
    }
}

function checkPin() {
    if (AUTH.entered === AUTH.pin) {
        pinSuccess();
    } else {
        pinError();
    }
}

function pinSuccess() {
    // Turn dots green and animate
    for (var i = 0; i < 4; i++) {
        var dot = document.getElementById('dot-' + i);
        if (dot) {
            dot.className = 'pin-dot filled';
            dot.style.background = '#00C0AE';
        }
    }

    var card = document.querySelector('#pin-screen > div:nth-child(2)');
    if (card) {
        card.style.animation = 'pinSuccess 0.3s ease';
        card.style.borderColor = '#00C0AE';
    }

    setTimeout(function() {
        var pinScreen = document.getElementById('pin-screen');
        pinScreen.style.transition = 'opacity 0.4s ease';
        pinScreen.style.opacity    = '0';
        setTimeout(function() {
            pinScreen.style.display = 'none';
            AUTH.unlocked = true;

            // Show main app
            var app = document.querySelector('.app-wrapper');
            if (app) {
                app.style.visibility = 'visible';
                app.style.opacity    = '0';
                app.style.transition = 'opacity 0.4s ease';
                setTimeout(function() { app.style.opacity = '1'; }, 50);
            }
        }, 400);
    }, 500);
}

function pinError() {
    // Turn dots pink
    for (var i = 0; i < 4; i++) {
        var dot = document.getElementById('dot-' + i);
        if (dot) dot.className = 'pin-dot error';
    }

    // Shake the card
    var card = document.querySelector('#pin-screen > div:nth-child(2)');
    if (card) {
        card.style.animation = 'shake 0.4s ease';
        setTimeout(function() { card.style.animation = ''; }, 400);
    }

    // Show error message
    document.getElementById('pin-error').textContent = 'Incorrect PIN — please try again';

    // Reset after 600ms
    setTimeout(function() {
        AUTH.entered = '';
        updateDots();
    }, 600);
}

/* ── KEYBOARD SUPPORT ───────────────────────────────────── */

document.addEventListener('keydown', function(e) {
    if (AUTH.unlocked) return;
    if (e.key >= '0' && e.key <= '9') pinPress(e.key);
    if (e.key === 'Backspace') pinDelete();
    if (e.key === 'Escape') pinClear();
});

/* ── LOGOUT ─────────────────────────────────────────────── */

function logout() {
    if (!confirm('Log out of Meridian?')) return;

    AUTH.entered  = '';
    AUTH.unlocked = false;

    // Hide app
    var app = document.querySelector('.app-wrapper');
    if (app) {
        app.style.transition = 'opacity 0.3s ease';
        app.style.opacity    = '0';
    }

    setTimeout(function() {
        // Reset PIN screen
        updateDots();
        document.getElementById('pin-error').textContent = '';

        // Show PIN screen
        var pin = document.getElementById('pin-screen');
        pin.style.opacity    = '0';
        pin.style.display    = 'flex';
        pin.style.transition = 'opacity 0.3s ease';
        setTimeout(function() { pin.style.opacity = '1'; }, 50);
    }, 300);
}

/* ── INIT ───────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', function() {
    injectAuthScreens();

    // Hide main app initially
    var app = document.querySelector('.app-wrapper');
    if (app) {
        app.style.opacity    = '0';
        app.style.visibility = 'hidden';
    }

    runSplash();
});