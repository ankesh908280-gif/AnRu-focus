/* ████████████████████████████████████████████████████████████
      NEON FOCUS ENGINE - FINAL PRODUCTION BUILD (120 FPS)
      Data strictly synced with Main App (GitHub / Firebase Safe)
████████████████████████████████████████████████████████████ */

// State Management
let durationSecs = 25 * 60;
let leftSecs = 25 * 60;
let cMode = 'focus'; 
let isRun = false;
let startTime = 0;
let endTime = 0;
let rafId = null; 

// 🔥 Database Sync Keys (Connected to Main App LocalStorage)
const sessionStr = localStorage.getItem('mceo_sess');
const userSession = sessionStr ? JSON.parse(sessionStr) : null;
const uid = userSession && !userSession.isGuest ? userSession.email : 'guest';
const logsKey = `mceo_${uid}_logs`;
const xpKey = `mceo_${uid}_xp`;

// DOM Elements
const elTime = document.getElementById('main-time-display');
const elRing = document.getElementById('main-timer-ring');
const elPlayBtn = document.getElementById('main-play-btn');
const elSaveBtn = document.getElementById('main-save-btn');
const elBrain = document.querySelector('.f-timer-icon');

// Circle Math: SVG Radius is 150 -> 2 * Math.PI * 150 ≈ 942.48
const RING_CIRCUMFERENCE = 942.48; 

// ================= INITIALIZATION =================

document.addEventListener("DOMContentLoaded", () => {
    if (userSession && userSession.pfp) {
        const avImg = document.getElementById('user-avatar-img');
        if (avImg) avImg.src = userSession.pfp;
    }
    if (elRing) elRing.style.transition = 'none'; 
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
    document.body.style.msUserSelect = 'none';

    updateDisplay();
    renderAnalytics();

    // Auto-inject PiP button if missing in focus.html
    const existingPipBtn = document.getElementById('pipTimerBtn');
    if (!existingPipBtn) {
        const playBtn = document.getElementById('main-play-btn');
        if (playBtn && playBtn.parentElement) {
            const btnHtml = `
                <button class="f-timer-btn" id="pipTimerBtn" onclick="togglePipTimer()" style="margin-top:12px; width:100%; border-radius:14px; font-size:13px; font-weight:600; display:flex; align-items:center; justify-content:center; gap:8px; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.12); color:#cbd5e1; padding:12px 18px; cursor:pointer; transition:0.3s;" title="Watch online class with a floating timer on screen">
                  <i class="fa-solid fa-clone" style="color:var(--p1);"></i> <span>Floating PiP Timer (Live Class)</span>
                </button>
            `;
            playBtn.parentElement.insertAdjacentHTML('afterend', btnHtml);
        }
    }

});

function getIndiaDate(d = new Date()) {
    const l = new Date(d);
    l.setMinutes(l.getMinutes() - l.getTimezoneOffset());
    return l.toISOString().split('T')[0];
}

// ================= 120FPS TIMER LOGIC =================

function updateDisplay(exactLeft = leftSecs) {
    let m = Math.floor(exactLeft / 60);
    let s = Math.floor(exactLeft % 60);
    
    if (cMode === 'stopwatch') {
        m = Math.floor(exactLeft / 60);
        s = Math.floor(exactLeft % 60);
    }
    
    elTime.textContent = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    
    let pct = durationSecs > 0 ? exactLeft / durationSecs : 0;
    if (cMode === 'stopwatch') pct = 1; 
    
    let offset = RING_CIRCUMFERENCE * (1 - pct);
    elRing.style.strokeDashoffset = offset;
}

function timerLoop() {
    if (!isRun) return;
    
    let now = Date.now();
    let exactLeft;

    if (cMode === 'stopwatch') {
        exactLeft = (now - startTime) / 1000;
        leftSecs = exactLeft;
    } else {
        exactLeft = (endTime - now) / 1000;
        exactLeft = Math.max(0, exactLeft); 
        leftSecs = exactLeft;
        
        if (exactLeft <= 0) {
            isRun = false;
            leftSecs = 0;
            updateDisplay(0);
            
            elPlayBtn.innerHTML = '<i class="fa-solid fa-play"></i> Start Focus';
            elPlayBtn.classList.remove('paused');
            if (elBrain) elBrain.classList.remove('pulse-anim');
            if (elSaveBtn) elSaveBtn.style.display = 'none';
            
            stopBackgroundAudio();
            updateMediaSession(false);
            finishSession();
            return;
        }
    }
    
    updateDisplay(exactLeft);
    updatePipCanvas(exactLeft);
    
    // Throttle MediaSession metadata updates
    let secFloor = Math.floor(exactLeft);
    if (secFloor !== lastSecNotified) {
        lastSecNotified = secFloor;
        updateMediaSession(true);
    }
    
    rafId = requestAnimationFrame(timerLoop);
}

function toggleTimer() {
    if (isRun) {
        // Pause
        isRun = false;
        cancelAnimationFrame(rafId);
        if (bgTimerInterval) clearInterval(bgTimerInterval);
        
        elPlayBtn.innerHTML = '<i class="fa-solid fa-play"></i> Resume';
        elPlayBtn.classList.add('paused');
        if (elBrain) elBrain.classList.remove('pulse-anim');
        
        stopBackgroundAudio();
        updateMediaSession(false);
        updatePipCanvas();
    } else {
        // Start
        if (leftSecs <= 0 && cMode !== 'stopwatch') {
            leftSecs = durationSecs;
        }
        isRun = true;
        
        if (elSaveBtn) elSaveBtn.style.display = 'flex'; // 🔥 Show Save Button
        
        const now = Date.now();
        if (cMode === 'stopwatch') {
            startTime = now - (leftSecs * 1000);
        } else {
            endTime = now + (leftSecs * 1000);
        }
        
        elPlayBtn.innerHTML = '<i class="fa-solid fa-pause"></i> Pause';
        elPlayBtn.classList.remove('paused');
        if (elBrain) elBrain.classList.remove('pulse-anim');
        
        startBackgroundAudio();
        setupMediaSessionHandlers();
        updateMediaSession(true);
        startBackgroundTimer();
        
        rafId = requestAnimationFrame(timerLoop);
    }
}

// 🔥 Manual Finish Logic
function manualFinish() {
    let studiedSecs = cMode === 'stopwatch' ? leftSecs : (durationSecs - leftSecs);
    
    if (studiedSecs < 60) {
        alert("Study for at least 1 minute to save this session!");
        return;
    }
    
    if (!confirm("Are you sure you want to Save & Finish this session now?")) return;
    
    isRun = false;
    cancelAnimationFrame(rafId);
    
    elPlayBtn.innerHTML = '<i class="fa-solid fa-play"></i> Start Focus';
    elPlayBtn.classList.remove('paused');
    if (elBrain) elBrain.classList.remove('pulse-anim');
    if (elSaveBtn) elSaveBtn.style.display = 'none';
    
    finishSession(); 
}

// ================= MODES & PRESETS =================

function hideSaveBtn() { if (elSaveBtn) elSaveBtn.style.display = 'none'; }

function setMode(mode, el) {
    if (isRun) toggleTimer(); 
    cMode = mode;
    hideSaveBtn();
    
    document.querySelectorAll('.f-tab').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
    
    let m = 25;
    if (mode === 'short') m = 5;
    if (mode === 'long') m = 15;
    if (mode === 'stopwatch') { m = 0; leftSecs = 0; durationSecs = 0; }
    
    if (mode !== 'stopwatch') {
        durationSecs = m * 60; 
        leftSecs = durationSecs;
    }
    
    document.querySelectorAll('.f-preset-card').forEach(b => b.classList.remove('active'));
    updateDisplay(mode === 'stopwatch' ? 0 : leftSecs);
}

function setPreset(m, el, type) {
    if (isRun) toggleTimer();
    cMode = type || 'focus';
    hideSaveBtn();
    
    document.querySelectorAll('.f-preset-card').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
    
    document.querySelectorAll('.f-tab').forEach(b => b.classList.remove('active'));
    const focusTab = document.querySelector('.f-tab[data-mode="focus"]');
    if (focusTab) focusTab.classList.add('active');

    durationSecs = m * 60; 
    leftSecs = durationSecs;
    updateDisplay();
}

function customTimer(el) {
    if (isRun) toggleTimer();
    let val = prompt("Enter focus minutes (e.g. 60):", "60");
    let m = parseInt(val, 10);
    if (!isNaN(m) && m > 0) {
        cMode = 'custom';
        hideSaveBtn();
        document.querySelectorAll('.f-preset-card').forEach(b => b.classList.remove('active'));
        el.classList.add('active');
        
        document.querySelectorAll('.f-tab').forEach(b => b.classList.remove('active'));
        const focusTab = document.querySelector('.f-tab[data-mode="focus"]');
        if (focusTab) focusTab.classList.add('active');
        
        durationSecs = m * 60; 
        leftSecs = durationSecs;
        updateDisplay();
    }
}

// ================= DATA SYNC & FINISH =================

function finishSession() {
    if (bgTimerInterval) clearInterval(bgTimerInterval);
    stopBackgroundAudio();
    updateMediaSession(false);
    updatePipCanvas(0);
    // Calculate EXACT minutes studied
    let studiedSecs = cMode === 'stopwatch' ? leftSecs : (durationSecs - leftSecs);
    let dMins = Math.floor(studiedSecs / 60);
    
    if (dMins < 1) return; // Silent abort if under 1 minute

    let logs = JSON.parse(localStorage.getItem(logsKey) || '[]');
    let todayStr = getIndiaDate();
    let todayCount = logs.filter(l => l.dateStr === todayStr).length + 1;

    let log = {
        id: Date.now(),
        dateStr: todayStr,
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        duration: dMins,
        mode: cMode, 
        session: todayCount
    };
    
    logs.unshift(log); 
    if (logs.length > 2000) logs.pop(); 
    localStorage.setItem(logsKey, JSON.stringify(logs));
    
    const earnedXP = dMins * 8;
    if (window.AnRuSync && typeof window.AnRuSync.addXP === 'function') {
        window.AnRuSync.addXP(earnedXP);
        window.AnRuSync.saveUserData({ logs: logs });
    } else {
        let currentXp = parseInt(localStorage.getItem(xpKey) || '0', 10);
        currentXp += earnedXP; 
        localStorage.setItem(xpKey, currentXp.toString());
    }
    
    showFocusToast(`🎉 MISSION COMPLETE! +${earnedXP} XP Synced to Cloud ☁️`);
    
    // Reset Timer values after save
    if (cMode === 'stopwatch') {
        leftSecs = 0;
        durationSecs = 0;
    } else {
        leftSecs = durationSecs; // Reset Pomodoro back to original
    }
    
    updateDisplay();
    renderAnalytics();

    // Auto-inject PiP button if missing in focus.html
    const existingPipBtn = document.getElementById('pipTimerBtn');
    if (!existingPipBtn) {
        const playBtn = document.getElementById('main-play-btn');
        if (playBtn && playBtn.parentElement) {
            const btnHtml = `
                <button class="f-timer-btn" id="pipTimerBtn" onclick="togglePipTimer()" style="margin-top:12px; width:100%; border-radius:14px; font-size:13px; font-weight:600; display:flex; align-items:center; justify-content:center; gap:8px; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.12); color:#cbd5e1; padding:12px 18px; cursor:pointer; transition:0.3s;" title="Watch online class with a floating timer on screen">
                  <i class="fa-solid fa-clone" style="color:var(--p1);"></i> <span>Floating PiP Timer (Live Class)</span>
                </button>
            `;
            playBtn.parentElement.insertAdjacentHTML('afterend', btnHtml);
        }
    }

}

// ================= DYNAMIC ANALYTICS ENGINE =================

function renderAnalytics() {
    let logs = JSON.parse(localStorage.getItem(logsKey) || '[]');
    let todayStr = getIndiaDate();
    let now = new Date();
    
    let yestDate = new Date(); 
    yestDate.setDate(yestDate.getDate() - 1);
    let yestStr = getIndiaDate(yestDate);

    let todayLogs = logs.filter(l => l.dateStr === todayStr);
    let yestLogs = logs.filter(l => l.dateStr === yestStr);
    
    let todayMins = todayLogs.reduce((a, curr) => a + curr.duration, 0);
    let yestMins = yestLogs.reduce((a, curr) => a + curr.duration, 0);

    let sessCount = todayLogs.length;
    document.getElementById('ui-sess-count').textContent = `${sessCount} / 6 Sessions`;
    let bpct = Math.min(100, Math.round((sessCount / 6) * 100));
    document.getElementById('ui-sess-fill').style.width = bpct + '%';
    document.getElementById('ui-sess-pct').textContent = bpct + '%';

    document.getElementById('ui-today-time').textContent = `${Math.floor(todayMins / 60)}h ${todayMins % 60}m`;
    
    let diffUI = document.getElementById('ui-today-diff');
    if (yestMins === 0 && todayMins > 0) {
        diffUI.innerHTML = `<i class="fa-solid fa-caret-up" style="color:#4ade80"></i> <span style="color:#4ade80">100%</span> vs yesterday`;
    } else if (yestMins === 0 && todayMins === 0) {
        diffUI.innerHTML = `<span>0%</span> vs yesterday`;
    } else {
        let diffPct = Math.round(((todayMins - yestMins) / yestMins) * 100);
        if (diffPct >= 0) {
            diffUI.innerHTML = `<i class="fa-solid fa-caret-up" style="color:#4ade80"></i> <span style="color:#4ade80">${diffPct}%</span> vs yesterday`;
        } else {
            diffUI.innerHTML = `<i class="fa-solid fa-caret-down" style="color:#f87171"></i> <span style="color:#f87171">${Math.abs(diffPct)}%</span> vs yesterday`;
        }
    }

    let goalPct = Math.min(100, Math.round((todayMins / 240) * 100));
    document.getElementById('ui-goal-pct').textContent = goalPct + '%';
    document.getElementById('ui-goal-ring').style.strokeDashoffset = 213 - (213 * goalPct / 100);

    const timeframeSelect = document.getElementById('chart-timeframe');
    const timeframe = timeframeSelect ? timeframeSelect.value : 'weekly'; 
    
    const dateRangeEl = document.getElementById('ui-chart-date-range');
    const yAxisEl = document.getElementById('ui-chart-y-axis');
    
    let chartData = [];
    let maxMins = 0;
    let daysToLookBack = 7;
    let uiSubText = 'This Week'; 

    if (timeframe === 'weekly') {
        if(dateRangeEl) dateRangeEl.textContent = "Last 7 Days";
        daysToLookBack = 7;
        uiSubText = 'This Week';
        for (let i = 6; i >= 0; i--) {
            let d = new Date(); d.setDate(now.getDate() - i);
            let dStr = getIndiaDate(d);
            let sum = logs.filter(l => l.dateStr === dStr).reduce((a,c)=>a+c.duration, 0);
            maxMins = Math.max(maxMins, sum);
            chartData.push({ label: d.toLocaleDateString('en-IN', {weekday:'short'}), val: sum, isCurrent: i===0 });
        }
    } else if (timeframe === 'monthly') {
        if(dateRangeEl) dateRangeEl.textContent = now.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
        daysToLookBack = 28;
        uiSubText = 'This Month';
        for (let i = 3; i >= 0; i--) {
            let weekSum = 0;
            for(let j=0; j<7; j++) {
                let d = new Date(); d.setDate(now.getDate() - (i*7 + j));
                let dStr = getIndiaDate(d);
                weekSum += logs.filter(l => l.dateStr === dStr).reduce((a,c)=>a+c.duration, 0);
            }
            maxMins = Math.max(maxMins, weekSum);
            chartData.push({ label: `W${4-i}`, val: weekSum, isCurrent: i===0 });
        }
    } else if (timeframe === 'yearly') {
        if(dateRangeEl) dateRangeEl.textContent = now.getFullYear().toString();
        daysToLookBack = 365;
        uiSubText = 'This Year';
        for (let i = 5; i >= 0; i--) {
            let targetMonth = new Date(now.getFullYear(), now.getMonth() - i, 1);
            let monthSum = logs.filter(l => {
                let ld = new Date(l.dateStr);
                return ld.getMonth() === targetMonth.getMonth() && ld.getFullYear() === targetMonth.getFullYear();
            }).reduce((a,c)=>a+c.duration, 0);
            maxMins = Math.max(maxMins, monthSum);
            chartData.push({ label: targetMonth.toLocaleDateString('en-IN', {month:'short'}), val: monthSum, isCurrent: i===0 });
        }
    }

    if (maxMins < 60) maxMins = 60; 
    let ySteps = [maxMins, maxMins*0.66, maxMins*0.33, 0];
    if(yAxisEl) {
        yAxisEl.innerHTML = ySteps.map(m => `<span>${m >= 60 ? Math.floor(m/60)+'h' : Math.floor(m)+'m'}</span>`).join('');
    }

    let chartHtml = '';
    let formatTime = (mins) => mins >= 60 ? `${Math.floor(mins/60)}h ${Math.floor(mins%60)}m` : `${Math.floor(mins)}m`;

    chartData.forEach(item => {
        let hPct = Math.min(100, Math.max(5, Math.round((item.val / maxMins) * 100)));
        let barColor = item.isCurrent ? 'linear-gradient(180deg, #ec4899, rgba(236,72,153,0.15))' : 'linear-gradient(180deg, var(--neon-purple), rgba(168,85,247,0.15))';
        let shadowColor = item.isCurrent ? 'rgba(236,72,153,0.5)' : 'rgba(168,85,247,0.4)';
        
        chartHtml += `
            <div class="chart-col">
              <div class="chart-bar-bg">
                <div class="chart-bar-fill" style="height:${hPct}%; background:${barColor}; box-shadow:0 0 12px ${shadowColor};" data-tooltip="${formatTime(item.val)}"></div>
              </div>
              <div class="chart-day" style="${item.isCurrent ? 'color:#fff;' : ''}">${item.label}</div>
            </div>
        `;
    });
    const weeklyChartEl = document.getElementById('ui-weekly-chart');
    if(weeklyChartEl) weeklyChartEl.innerHTML = chartHtml;

    let periodLogs = logs.filter(l => {
        let ld = new Date(l.dateStr);
        return (now - ld) / (1000 * 60 * 60 * 24) <= daysToLookBack;
    });
    
    let bestLog = periodLogs.reduce((max, log) => log.duration > (max.duration || 0) ? log : max, {});
    
    document.getElementById('ui-best-time').textContent = (bestLog.duration || 0) + 'm';
    
    if (bestLog.dateStr) {
        let bd = new Date(bestLog.dateStr);
        document.getElementById('ui-best-date').textContent = `${bd.toLocaleDateString('en-IN', { weekday: 'short' })}, ${bd.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}`;
    } else {
        document.getElementById('ui-best-date').textContent = '--';
    }
    
    document.getElementById('ui-total-sess').textContent = periodLogs.length;
    
    const subTextEl = document.getElementById('ui-total-sess-sub');
    if(subTextEl) subTextEl.textContent = uiSubText;

    let histHtml = '';
    let displayLogs = todayLogs.slice(0, 5); 
    
    if (displayLogs.length === 0) displayLogs = logs.slice(0, 4);

    if (displayLogs.length === 0) {
        histHtml = '<div style="text-align:center; padding:20px; color:var(--text-muted); font-size:12px;">No sessions yet. Time to focus! 🚀</div>';
    } else {
        displayLogs.forEach(l => {
            let iconClass = 'purple';
            let faIcon = 'fa-bullseye';
            let title = 'Focus Session';
            
            if (l.mode === 'deepwork') { iconClass = 'blue'; faIcon = 'fa-laptop'; title = 'Deep Work'; }
            else if (l.mode === 'study') { iconClass = 'pink'; faIcon = 'fa-book-open'; title = 'Study Session'; }
            else if (l.mode === 'short' || l.mode === 'long') { iconClass = 'blue'; faIcon = 'fa-mug-hot'; title = 'Break Time'; }
            else if (l.mode === 'custom') { iconClass = 'orange'; faIcon = 'fa-gear'; title = 'Custom Focus'; }
            else if (l.mode === 'focus') { iconClass = 'purple'; faIcon = 'fa-bolt'; title = 'Pomodoro'; } 
            
            let timeStr = l.dateStr === todayStr ? `Today ${l.time}` : `${l.dateStr} ${l.time}`;

            histHtml += `
            <div class="history-item">
              <div class="hi-left">
                <div class="hi-icon ${iconClass}"><i class="fa-solid ${faIcon}"></i></div>
                <div>
                  <div class="hi-title">${title}</div>
                  <div class="hi-desc">${l.duration}m • Completed</div>
                </div>
              </div>
              <div class="hi-right">${timeStr} <i class="fa-solid fa-chevron-right"></i></div>
            </div>`;
        });
    }
    const historyListEl = document.getElementById('ui-history-list');
    if(historyListEl) historyListEl.innerHTML = histHtml;
}

function showFocusToast(msg) {
    const t = document.getElementById('focusToast');
    if (t) {
        t.innerHTML = msg;
        t.style.display = 'block';
        setTimeout(() => { t.style.display = 'none'; }, 3500);
    } else {
        alert(msg);
    }
}

/* =========================================================
   🚀 BACKGROUND NOTIFICATION (MEDIASESSION) & FLOATING PiP ENGINE
   ========================================================= */
let silentAudioEl = null;
let lastSecNotified = -1;
let bgTimerInterval = null;

function getSilentAudio() {
    if (!silentAudioEl) {
        silentAudioEl = document.createElement('audio');
        silentAudioEl.loop = true;
        // 1-second silent WAV base64
        silentAudioEl.src = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA";
    }
    return silentAudioEl;
}

function startBackgroundAudio() {
    try {
        const audio = getSilentAudio();
        audio.play().catch(e => {
            console.log("Silent background audio waiting for user gesture:", e);
        });
    } catch(e) {}
}

function stopBackgroundAudio() {
    try {
        if (silentAudioEl) {
            silentAudioEl.pause();
        }
    } catch(e) {}
}

function startBackgroundTimer() {
    if (bgTimerInterval) clearInterval(bgTimerInterval);
    bgTimerInterval = setInterval(() => {
        if (!isRun) return;
        let now = Date.now();
        if (cMode === 'stopwatch') {
            leftSecs = (now - startTime) / 1000;
        } else {
            leftSecs = Math.max(0, (endTime - now) / 1000);
            if (leftSecs <= 0) {
                isRun = false;
                clearInterval(bgTimerInterval);
                stopBackgroundAudio();
                updateMediaSession(false);
                finishSession();
                return;
            }
        }
        updateMediaSession(isRun);
        updatePipCanvas(leftSecs);
    }, 1000);
}

function updateMediaSession(running = isRun) {
    if (!('mediaSession' in navigator)) return;
    
    let m = Math.floor(leftSecs / 60);
    let s = Math.floor(leftSecs % 60);
    const timeStr = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    const modeTitle = cMode === 'stopwatch' ? `⏱️ Studying: ${timeStr}` : `⏳ Focus: ${timeStr} left`;
    
    navigator.mediaSession.metadata = new MediaMetadata({
        title: modeTitle,
        artist: "AnRu Focus • Online Class Mode",
        album: "Live Lecture Tracker",
        artwork: [
            { src: "https://img.icons8.com/fluency/96/brain.png", sizes: "96x96", type: "image/png" },
            { src: "https://img.icons8.com/fluency/192/brain.png", sizes: "192x192", type: "image/png" }
        ]
    });
    
    navigator.mediaSession.playbackState = running ? "playing" : "paused";
}

function setupMediaSessionHandlers() {
    if (!('mediaSession' in navigator)) return;
    
    try {
        navigator.mediaSession.setActionHandler('play', () => {
            if (!isRun) toggleTimer();
        });
        navigator.mediaSession.setActionHandler('pause', () => {
            if (isRun) toggleTimer();
        });
        navigator.mediaSession.setActionHandler('stop', () => {
            manualFinish();
        });
        navigator.mediaSession.setActionHandler('seekbackward', () => {
            if (!isRun) toggleTimer();
        });
        navigator.mediaSession.setActionHandler('seekforward', () => {
            manualFinish();
        });
    } catch(e) {
        console.warn("MediaSession action error:", e);
    }
}

// Background tab visibility recovery (Instant resync when returning to app)
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && isRun) {
        let now = Date.now();
        if (cMode === 'stopwatch') {
            leftSecs = (now - startTime) / 1000;
        } else {
            leftSecs = Math.max(0, (endTime - now) / 1000);
            if (leftSecs <= 0) {
                isRun = false;
                updateDisplay(0);
                finishSession();
                return;
            }
        }
        updateDisplay(leftSecs);
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(timerLoop);
    }
});

// ================= FLOATING PiP (PICTURE-IN-PICTURE) TIMER =================
let pipVideo = null;
let pipCanvas = null;
let pipCtx = null;
let isPipActive = false;

function initPipElements() {
    if (!pipCanvas) {
        pipCanvas = document.createElement('canvas');
        pipCanvas.width = 340;
        pipCanvas.height = 180;
        pipCtx = pipCanvas.getContext('2d');
    }
    if (!pipVideo) {
        pipVideo = document.createElement('video');
        pipVideo.muted = true;
        pipVideo.playsInline = true;
        pipVideo.style.display = 'none';
        document.body.appendChild(pipVideo);
        
        pipVideo.addEventListener('enterpictureinpicture', () => {
            isPipActive = true;
            updatePipBtnUI(true);
            showFocusToast("📺 Floating Timer Active! Switch to your online class now.", "success");
        });
        pipVideo.addEventListener('leavepictureinpicture', () => {
            isPipActive = false;
            updatePipBtnUI(false);
        });
    }
}

function updatePipCanvas(exactLeft = leftSecs) {
    if (!pipCanvas || !pipCtx) return;
    
    let m = Math.floor(exactLeft / 60);
    let s = Math.floor(exactLeft % 60);
    const timeStr = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    
    // Dark Futuristic Glass Gradient
    const grad = pipCtx.createLinearGradient(0, 0, 340, 180);
    grad.addColorStop(0, '#0c071e');
    grad.addColorStop(1, '#1b0d36');
    pipCtx.fillStyle = grad;
    pipCtx.fillRect(0, 0, 340, 180);
    
    // Glowing Neon Border
    pipCtx.strokeStyle = isRun ? '#10b981' : '#a855f7';
    pipCtx.lineWidth = 4;
    pipCtx.strokeRect(2, 2, 336, 176);
    
    // Status Header
    pipCtx.fillStyle = isRun ? '#10b981' : '#fbbf24';
    pipCtx.font = 'bold 16px sans-serif';
    pipCtx.textAlign = 'center';
    const statusText = cMode === 'stopwatch' ? '⏱️ STOPWATCH' : (isRun ? '🔥 FOCUSING' : '⏸️ PAUSED');
    pipCtx.fillText(statusText, 170, 42);
    
    // Timer Digits
    pipCtx.fillStyle = '#ffffff';
    pipCtx.font = 'bold 54px monospace';
    pipCtx.fillText(timeStr, 170, 112);
    
    // Footer Tag
    pipCtx.fillStyle = '#94a3b8';
    pipCtx.font = '13px sans-serif';
    pipCtx.fillText('AnRu Focus • Live Class', 170, 150);
}

async function togglePipTimer() {
    if (!document.pictureInPictureEnabled) {
        showFocusToast("⚠️ Picture-in-Picture is not supported in this browser.", "error");
        return;
    }
    
    initPipElements();
    updatePipCanvas();
    
    try {
        if (document.pictureInPictureElement) {
            await document.exitPictureInPicture();
        } else {
            const stream = pipCanvas.captureStream(12);
            pipVideo.srcObject = stream;
            await pipVideo.play();
            await pipVideo.requestPictureInPicture();
        }
    } catch(err) {
        console.error("PiP Error:", err);
        showFocusToast("⚠️ Pehle 'Start Focus' par click karein!", "error");
    }
}

function updatePipBtnUI(active) {
    const btn = document.getElementById('pipTimerBtn');
    if (!btn) return;
    if (active) {
        btn.innerHTML = '<i class="fa-solid fa-compress" style="color:#10b981"></i> <span>Close Floating Timer</span>';
        btn.style.borderColor = '#10b981';
        btn.style.color = '#10b981';
    } else {
        btn.innerHTML = '<i class="fa-solid fa-clone" style="color:var(--p1)"></i> <span>Floating PiP Timer (Live Class)</span>';
        btn.style.borderColor = 'rgba(255,255,255,0.12)';
        btn.style.color = '#cbd5e1';
    }
}
