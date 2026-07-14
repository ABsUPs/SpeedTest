/* ================================================================
   THEME SYSTEM
   ================================================================ */
const THEMES = {
    cyberpunk: { label: 'Cyberpunk' },
    matrix:    { label: 'Matrix' },
    hacker:    { label: 'Hacker' }
};

let currentTheme = 'cyberpunk';
let isLightMode = false;
let animationsEnabled = true;

function setTheme(name) {
    currentTheme = name;
    applyTheme();
    document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('.theme-btn[data-theme="' + name + '"]').classList.add('active');
    document.getElementById('themeLabel').textContent = THEMES[name].label + (isLightMode ? ' (Light)' : ' (Dark)');
    localStorage.setItem('abxspeed-theme', name);

    if (name === 'matrix' && !isLightMode && animationsEnabled) { initMatrix(); }
    else { stopMatrix(); }
}

function toggleMode() {
    isLightMode = !isLightMode;
    applyTheme();
    document.getElementById('themeLabel').textContent = THEMES[currentTheme].label + (isLightMode ? ' (Light)' : ' (Dark)');
    localStorage.setItem('abxspeed-light', isLightMode ? '1' : '0');

    if (currentTheme === 'matrix' && !isLightMode && animationsEnabled) { initMatrix(); }
    else { stopMatrix(); }
}

function toggleAnimations() {
    animationsEnabled = !animationsEnabled;
    applyTheme();
    localStorage.setItem('abxspeed-anim', animationsEnabled ? '1' : '0');
    showAnimStatus(animationsEnabled ? 'Animations ON' : 'Animations OFF');

    if (animationsEnabled && currentTheme === 'matrix' && !isLightMode) {
        initMatrix();
    } else {
        stopMatrix();
    }
}

function setAnimations(val) {
    animationsEnabled = val;
    applyTheme();
    localStorage.setItem('abxspeed-anim', animationsEnabled ? '1' : '0');

    if (animationsEnabled && currentTheme === 'matrix' && !isLightMode) {
        initMatrix();
    } else {
        stopMatrix();
    }
}

function showAnimStatus(text) {
    const el = document.getElementById('animStatus');
    el.textContent = text;
    el.classList.add('show');
    clearTimeout(el._timer);
    el._timer = setTimeout(() => el.classList.remove('show'), 2000);
}

function applyTheme() {
    let cls = 'theme-' + currentTheme;
    if (isLightMode) cls += ' light-mode';
    if (!animationsEnabled) cls += ' no-animations';
    document.body.className = cls;
}

(function() {
    const saved = localStorage.getItem('abxspeed-theme');
    const savedLight = localStorage.getItem('abxspeed-light');
    const savedAnim = localStorage.getItem('abxspeed-anim');
    if (saved && THEMES[saved]) currentTheme = saved;
    if (savedLight === '1') isLightMode = true;
    if (savedAnim !== null) animationsEnabled = savedAnim === '1';
    applyTheme();
    document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
    const activeBtn = document.querySelector('.theme-btn[data-theme="' + currentTheme + '"]');
    if (activeBtn) activeBtn.classList.add('active');
    document.getElementById('themeLabel').textContent = THEMES[currentTheme].label + (isLightMode ? ' (Light)' : ' (Dark)');

    if (currentTheme === 'matrix' && !isLightMode && animationsEnabled) {
        initMatrix();
    }
})();

/* ================================================================
   MATRIX RAIN ENGINE
   ================================================================ */
let matrixActive = false;
let matrixInited = false;
const matrixCanvas = document.getElementById('matrixCanvas');
const mCtx = matrixCanvas.getContext('2d');
let mColumns = [];
let mFontSize = 14;
let mAnimId = null;

const MATRIX_CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF';

function initMatrix() {
    if (!matrixInited) {
        matrixInited = true;
        resizeMatrix();
        window.addEventListener('resize', resizeMatrix);
        for (let i = 0; i < mColumns.length; i++) {
            mColumns[i] = Math.random() * -100;
        }
    }
    matrixActive = true;
    drawMatrix();
}

function stopMatrix() {
    matrixActive = false;
    if (mAnimId) { cancelAnimationFrame(mAnimId); mAnimId = null; }
    mCtx.clearRect(0, 0, matrixCanvas.width, matrixCanvas.height);
}

function resizeMatrix() {
    matrixCanvas.width = window.innerWidth;
    matrixCanvas.height = window.innerHeight;
    const cols = Math.floor(matrixCanvas.width / mFontSize);
    while (mColumns.length < cols) mColumns.push(Math.random() * -100);
    mColumns.length = cols;
}

function drawMatrix() {
    if (!matrixActive) { mCtx.clearRect(0, 0, matrixCanvas.width, matrixCanvas.height); mAnimId = null; return; }
    mCtx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    mCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
    mCtx.font = mFontSize + 'px monospace';

    for (let i = 0; i < mColumns.length; i++) {
        const char = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
        const x = i * mFontSize;
        const y = mColumns[i] * mFontSize;

        mCtx.fillStyle = 'rgba(180, 255, 180, 0.95)';
        mCtx.fillText(char, x, y);

        if (mColumns[i] > 1) {
            const prevChar = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
            mCtx.fillStyle = 'rgba(0, 255, 65, 0.6)';
            mCtx.fillText(prevChar, x, y - mFontSize);
        }

        if (y > matrixCanvas.height && Math.random() > 0.975) {
            mColumns[i] = 0;
        }
        mColumns[i] += 0.5 + Math.random() * 0.5;
    }
    mAnimId = requestAnimationFrame(drawMatrix);
}

/* Pause when hidden */
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        if (mAnimId) { cancelAnimationFrame(mAnimId); mAnimId = null; }
    } else if (matrixActive) {
        drawMatrix();
    }
});

/* ================================================================
   SPEED TEST LOGIC
   ================================================================ */
let testHistory = JSON.parse(localStorage.getItem('netHistory') || '[]');
let connType = 'unknown';
let dataConsent = localStorage.getItem('mobileConsent');
updateHistory();

function updateOnline() {
    const dot = document.getElementById('statusDot');
    const txt = document.getElementById('statusText');
    if (navigator.onLine) {
        dot.className = 'status-dot online';
        txt.textContent = 'Online';
    } else {
        dot.className = 'status-dot offline';
        txt.textContent = 'Offline';
    }
}
window.addEventListener('online', updateOnline);
window.addEventListener('offline', updateOnline);
updateOnline();

fetch('https://api.ipify.org?format=json').then(r=>r.json()).then(d=>{
    document.getElementById('currentIP').textContent = d.ip;
}).catch(()=>{});

async function detectConnection() {
    let wifi = 0, mobile = 0, eth = 0;

    if (navigator.connection && navigator.connection.type) {
        const t = navigator.connection.type;
        if (t === 'wifi') wifi += 100;
        else if (t === 'ethernet') eth += 100;
        else if (t === 'cellular' || t === 'wimax') mobile += 100;
    }

    if (navigator.connection) {
        const c = navigator.connection;
        if (c.effectiveType === '4g' || c.effectiveType === '3g' || c.effectiveType === '2g' || c.effectiveType === 'slow-2g') {
            mobile += 40;
        }
        if (c.rtt !== undefined) {
            if (c.rtt > 100) mobile += 20;
            else if (c.rtt < 20) wifi += 30;
        }
        if (c.downlink !== undefined) {
            if (c.downlink >= 10) wifi += 30;
            else if (c.downlink < 2) mobile += 20;
        }
    }

    try {
        const t0 = performance.now();
        await fetch('https://www.google.com/favicon.ico?t='+Date.now(), {mode:'no-cors', cache:'no-store'});
        const lat = performance.now() - t0;
        if (lat < 20) wifi += 40;
        else if (lat > 80) mobile += 30;
    } catch(e) {}

    if (navigator.deviceMemory && navigator.deviceMemory <= 4) mobile += 10;
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency >= 8) wifi += 10;

    if (eth > wifi && eth > mobile) return 'ethernet';
    if (wifi > mobile) return 'wifi';
    if (mobile > wifi) return 'mobile';
    return 'unknown';
}

async function startDetection() {
    const btn = document.getElementById('mainBtn');
    const status = document.getElementById('detectStatus');

    btn.disabled = true;
    btn.className = 'detect-btn testing';
    btn.innerHTML = '<span class="spinner" style="display:inline-block;width:20px;height:20px;border:3px solid rgba(255,255,255,0.3);border-radius:50%;border-top-color:#fff;animation:spin 1s linear infinite;"></span> Detecting...';
    status.textContent = 'Checking your connection type...';

    connType = await detectConnection();

    document.getElementById('connectionType').textContent =
        connType === 'wifi' ? '📡 WiFi' :
        connType === 'mobile' ? '📱 Mobile Data' :
        connType === 'ethernet' ? '🔌 Ethernet' : '❓ Unknown';

    const dot = document.getElementById('statusDot');
    dot.className = 'status-dot ' + (connType === 'mobile' ? 'mobile' : 'wifi');

    if (connType === 'mobile') {
        setAnimations(false);
        showAnimStatus('Animations OFF (Mobile Data)');
    } else if (connType === 'wifi' || connType === 'ethernet') {
        setAnimations(true);
    }

    if (connType === 'wifi' || connType === 'ethernet') {
        status.textContent = `Detected: ${connType.toUpperCase()} — Starting tests automatically...`;
        btn.innerHTML = '⚡ Testing...';
        await runAllTests();
        btn.className = 'detect-btn done';
        btn.innerHTML = '✅ Done — Click to Test Again';
        btn.disabled = false;
        status.textContent = 'All tests complete! Click button to test again.';
    } else if (connType === 'mobile') {
        btn.disabled = false;
        btn.className = 'detect-btn';
        btn.innerHTML = '🔍 Detect & Test';
        status.textContent = 'Mobile data detected';

        if (dataConsent === 'approved') {
            status.textContent = 'Mobile data — Running tests...';
            btn.innerHTML = '⚡ Testing...';
            btn.disabled = true;
            await runAllTests();
            btn.className = 'detect-btn done';
            btn.innerHTML = '✅ Done — Click to Test Again';
            btn.disabled = false;
            status.textContent = 'All tests complete!';
        } else {
            document.getElementById('mobileModal').classList.add('active');
        }
    } else {
        btn.disabled = false;
        btn.className = 'detect-btn';
        btn.innerHTML = '🔍 Detect & Test';
        document.getElementById('manualModal').classList.add('active');
    }
}

function manualSelect(type) {
    document.getElementById('manualModal').classList.remove('active');
    connType = type;
    localStorage.setItem('manualConn', type);

    document.getElementById('connectionType').textContent =
        type === 'wifi' ? '📡 WiFi' : type === 'mobile' ? '📱 Mobile Data' : '🔌 Ethernet';

    if (type === 'mobile') {
        setAnimations(false);
        showAnimStatus('Animations OFF (Mobile Data)');
    } else {
        setAnimations(true);
    }

    if (type === 'mobile' && dataConsent !== 'approved') {
        document.getElementById('mobileModal').classList.add('active');
    } else {
        startTestsDirectly();
    }
}

async function startTestsDirectly() {
    const btn = document.getElementById('mainBtn');
    const status = document.getElementById('detectStatus');
    btn.disabled = true;
    btn.className = 'detect-btn testing';
    btn.innerHTML = '⚡ Testing...';
    status.textContent = 'Running speed tests...';
    await runAllTests();
    btn.className = 'detect-btn done';
    btn.innerHTML = '✅ Done — Click to Test Again';
    btn.disabled = false;
    status.textContent = 'All tests complete!';
}

function closeMobileModal(approved) {
    document.getElementById('mobileModal').classList.remove('active');
    if (approved) {
        localStorage.setItem('mobileConsent', 'approved');
        dataConsent = 'approved';
        startTestsDirectly();
    }
}

async function runAllTests() {
    await testPing();
    await testDownload();
    await testUpload();
    fillNetworkInfo();
}

async function testPing() {
    const viz = document.getElementById('pingViz');
    viz.innerHTML = '';
    const pings = [];

    for (let i = 0; i < 10; i++) {
        try {
            const t0 = performance.now();
            await fetch('https://www.google.com/favicon.ico?t='+Date.now(), {mode:'no-cors'});
            const p = Math.round(performance.now() - t0);
            pings.push(p);

            const bar = document.createElement('div');
            bar.className = 'ping-bar';
            const fill = document.createElement('div');
            fill.className = 'ping-bar-fill';
            fill.style.height = Math.min(p, 100) + '%';
            fill.style.background = p < 50 ? 'var(--success)' : p < 100 ? 'var(--accent)' : p < 200 ? 'var(--warning)' : 'var(--danger)';
            bar.appendChild(fill);
            viz.appendChild(bar);
        } catch(e) { pings.push(0); }
    }

    const avg = Math.round(pings.reduce((a,b)=>a+b,0)/pings.length);
    const jitter = Math.round(Math.max(...pings) - Math.min(...pings));

    document.getElementById('pingValue').textContent = avg + ' ms';
    document.getElementById('jitterValue').textContent = jitter + ' ms';

    const r = avg < 20 ? {t:'Excellent',c:'good'} : avg < 50 ? {t:'Good',c:'good'} : avg < 100 ? {t:'Average',c:'warning'} : {t:'Poor',c:'bad'};
    const el = document.getElementById('pingRating');
    el.textContent = r.t; el.className = 'metric-value ' + r.c;
    document.getElementById('pingValue').className = 'metric-value ' + r.c;

    addResult('ping', avg + ' ms');
}

async function testDownload() {
    const bar = document.getElementById('dlBar');
    const valueEl = document.getElementById('dlValue');
    const mbsEl = document.getElementById('dlMBs');
    const ratingEl = document.getElementById('dlRating');
    const gaugeEl = document.getElementById('dlProgress');

    const testFiles = [
        { url: 'https://speed.cloudflare.com/__down?bytes=1048576', label: '1MB' },
        { url: 'https://speed.cloudflare.com/__down?bytes=10485760', label: '10MB' },
        { url: 'https://speed.cloudflare.com/__down?bytes=26214400', label: '25MB' },
        { url: 'https://speed.cloudflare.com/__down?bytes=52428800', label: '50MB' },
        { url: 'https://speed.cloudflare.com/__down?bytes=104857600', label: '100MB' },
    ];

    let totalBytes = 0;
    let totalTime = 0;
    let lastSpeed = 0;

    valueEl.textContent = '...';
    mbsEl.textContent = '...';
    ratingEl.textContent = 'Testing';
    ratingEl.className = 'metric-value';

    const filesToTest = testFiles.slice(0, 3);

    for (let i = 0; i < filesToTest.length; i++) {
        const file = filesToTest[i];
        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 30000);

            const t0 = performance.now();
            const response = await fetch(file.url + '&t=' + Date.now(), {
                signal: controller.signal,
                cache: 'no-store'
            });

            if (!response.ok) throw new Error('HTTP ' + response.status);

            const reader = response.body.getReader();
            let received = 0;
            let streamStartTime = performance.now();
            let lastChunkTime = streamStartTime;
            let bytesSinceLastUpdate = 0;

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                received += value.length;
                bytesSinceLastUpdate += value.length;

                const now = performance.now();
                const timeSinceLastChunk = (now - lastChunkTime) / 1000;

                if (timeSinceLastChunk >= 0.2) {
                    const instantSpeed = ((bytesSinceLastUpdate * 8) / (timeSinceLastChunk * 1000000));
                    lastSpeed = instantSpeed;
                    valueEl.textContent = instantSpeed.toFixed(1);
                    mbsEl.textContent = ((bytesSinceLastUpdate / 1048576) / timeSinceLastChunk).toFixed(1);

                    updateGauge(gaugeEl, instantSpeed);

                    bytesSinceLastUpdate = 0;
                    lastChunkTime = now;
                }
            }

            clearTimeout(timeout);
            const elapsed = (performance.now() - t0) / 1000;

            totalBytes += received;
            totalTime += elapsed;

            bar.style.width = ((i + 1) / filesToTest.length * 100) + '%';

            const currentSpeed = ((received * 8) / (elapsed * 1000000));
            if (currentSpeed > 100 && i === filesToTest.length - 1 && filesToTest.length < testFiles.length) {
                filesToTest.push(testFiles[filesToTest.length]);
            }

        } catch (e) {
            console.log('Download chunk ' + (i+1) + ' failed:', e.message);
        }
    }

    if (totalTime > 0 && totalBytes > 0) {
        const finalMbps = ((totalBytes * 8) / (totalTime * 1000000)).toFixed(2);
        const finalMBs = (totalBytes / (totalTime * 1048576)).toFixed(2);

        valueEl.textContent = finalMbps;
        mbsEl.textContent = finalMBs;

        const r = getSpeedRating(parseFloat(finalMbps));
        ratingEl.textContent = r.t;
        ratingEl.className = 'metric-value ' + r.c;

        updateGauge(gaugeEl, parseFloat(finalMbps));
        addResult('download', finalMbps + ' Mbps');
    } else {
        valueEl.textContent = 'Failed';
        mbsEl.textContent = '--';
        ratingEl.textContent = 'Error';
        ratingEl.className = 'metric-value bad';
    }

    bar.style.width = '0%';
}

function updateGauge(el, mbps) {
    let degrees;
    if (mbps <= 100) {
        degrees = (mbps / 100) * 150;
    } else if (mbps <= 500) {
        degrees = 150 + ((mbps - 100) / 400) * 100;
    } else {
        degrees = 250 + Math.min((mbps - 500) / 1000, 1) * 50;
    }
    el.style.setProperty('--progress', Math.min(degrees, 300) + 'deg');
}

function getSpeedRating(mbps) {
    if (mbps >= 500) return { t: 'Gigabit', c: 'good' };
    if (mbps >= 100) return { t: 'Excellent', c: 'good' };
    if (mbps >= 50) return { t: 'Good', c: 'good' };
    if (mbps >= 20) return { t: 'Average', c: 'warning' };
    return { t: 'Slow', c: 'bad' };
}

async function testUpload() {
    const bar = document.getElementById('ulBar');
    const valueEl = document.getElementById('ulValue');
    const mbsEl = document.getElementById('ulMBs');
    const ratingEl = document.getElementById('ulRating');
    const gaugeEl = document.getElementById('ulProgress');

    const chunkSizes = [1048576, 2097152, 5242880, 10485760];
    let totalBytes = 0;
    let totalTime = 0;
    let chunkIndex = 0;
    let iterations = 0;
    const maxIterations = 8;

    valueEl.textContent = '...';
    mbsEl.textContent = '...';
    ratingEl.textContent = 'Testing';
    ratingEl.className = 'metric-value';

    while (iterations < maxIterations) {
        const chunkSize = chunkSizes[Math.min(chunkIndex, chunkSizes.length - 1)];

        try {
            const data = new Blob([new ArrayBuffer(chunkSize)]);
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 15000);

            const t0 = performance.now();
            await fetch('https://httpbin.org/post', {
                method: 'POST',
                body: data,
                signal: controller.signal
            });
            clearTimeout(timeout);

            const elapsed = (performance.now() - t0) / 1000;
            totalBytes += chunkSize;
            totalTime += elapsed;
            iterations++;

            const liveMbps = ((chunkSize * 8) / (elapsed * 1000000));
            valueEl.textContent = liveMbps.toFixed(1);
            mbsEl.textContent = ((chunkSize / 1048576) / elapsed).toFixed(1);

            updateGauge(gaugeEl, liveMbps);
            bar.style.width = (iterations / maxIterations * 100) + '%';

            if (liveMbps > 50 && chunkIndex < chunkSizes.length - 1) {
                chunkIndex++;
            }

        } catch (e) {
            console.log('Upload chunk failed:', e.message);
            iterations++;
        }
    }

    if (totalTime > 0 && totalBytes > 0) {
        const finalMbps = ((totalBytes * 8) / (totalTime * 1000000)).toFixed(2);
        const finalMBs = (totalBytes / (totalTime * 1048576)).toFixed(2);

        valueEl.textContent = finalMbps;
        mbsEl.textContent = finalMBs;

        const r = getUploadRating(parseFloat(finalMbps));
        ratingEl.textContent = r.t;
        ratingEl.className = 'metric-value ' + r.c;

        updateGauge(gaugeEl, parseFloat(finalMbps));
        addResult('upload', finalMbps + ' Mbps');
    } else {
        valueEl.textContent = 'Failed';
        mbsEl.textContent = '--';
        ratingEl.textContent = 'Error';
        ratingEl.className = 'metric-value bad';
    }

    bar.style.width = '0%';
}

function getUploadRating(mbps) {
    if (mbps >= 100) return { t: 'Excellent', c: 'good' };
    if (mbps >= 50) return { t: 'Good', c: 'good' };
    if (mbps >= 20) return { t: 'Average', c: 'warning' };
    return { t: 'Slow', c: 'bad' };
}

function fillNetworkInfo() {
    if (navigator.connection) {
        const c = navigator.connection;
        document.getElementById('infoConn').textContent = c.type || c.effectiveType || 'Unknown';
        document.getElementById('infoDown').textContent = c.downlink ? c.downlink + ' Mbps' : '--';
        document.getElementById('infoUp').textContent = c.uplink ? c.uplink + ' Mbps' : '--';
        document.getElementById('infoRTT').textContent = c.rtt ? c.rtt + ' ms' : '--';
        document.getElementById('infoSave').textContent = c.saveData ? 'Yes' : 'No';
    }
}

function addResult(type, val) {
    const now = new Date();
    let entry = testHistory.find(t => new Date(t.date).toDateString() === now.toDateString());
    if (!entry) {
        entry = {date: now, download:'--', upload:'--', ping:'--'};
        testHistory.unshift(entry);
    }
    entry[type] = val;
    localStorage.setItem('netHistory', JSON.stringify(testHistory));
    updateHistory();
}

function updateHistory() {
    const tb = document.getElementById('historyBody');
    if (!testHistory.length) {
        tb.innerHTML = '<tr><td colspan="4" style="text-align:center;color:var(--text-secondary)">No tests yet</td></tr>';
        return;
    }
    tb.innerHTML = testHistory.slice(0,8).map(t => {
        return `<tr>
            <td>${new Date(t.date).toLocaleTimeString()}</td>
            <td>${t.download}</td>
            <td>${t.upload}</td>
            <td>${t.ping}</td>
        </tr>`;
    }).join('');
}

function clearHistory() {
    testHistory = [];
    localStorage.removeItem('netHistory');
    updateHistory();
}

function exportResults() {
    const blob = new Blob([JSON.stringify(testHistory, null, 2)], {type:'application/json'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'network-test-results.json';
    a.click();
}
