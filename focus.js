/* ████████████████████████████████████████████████████████████
                  NEON FOCUS ENGINE (120 FPS ULTRA-SMOOTH)
████████████████████████████████████████████████████████████ */

// State Management
let durationSecs = 25 * 60;
let leftSecs = 25 * 60;
let cMode = 'focus'; 
let isRun = false;
let startTime = 0;
let endTime = 0;
let rafId = null; 

// Database Sync Keys (Connected to your Main App)
const sessionStr = localStorage.getItem('mceo_sess');
const userSession = sessionStr ? JSON.parse(sessionStr) : null;
const uid = userSession && !userSession.isGuest ? userSession.email : 'guest';
const logsKey = `mceo_${uid}_logs`;
const xpKey = `mceo_${uid}_xp`;

// DOM Elements
const elTime = document.getElementById('main-time-display');
const elRing = document.getElementById('main-timer-ring');
const elPlayBtn = document.getElementById('main-play-btn');
const elBrain = document.querySelector('.f-timer-icon');

// Circle Math: SVG Radius is 150 -> 2 * Math.PI * 150 ≈ 942.48
const RING_CIRCUMFERENCE = 942.48; 

// ================= INITIALIZATION =================

document.addEventListener("DOMContentLoaded", () => {
    // Set Exact Avatar from Main App
    if(userSession && userSession.pfp) {
        const avImg = document.getElementById('user-avatar-img');
        if(avImg) avImg.src = userSession.pfp;
    }
    
    // Disable CSS transition for JS Animation to prevent lag and enable 120FPS
    if(elRing) elRing.style.transition = 'none'; 
    
    updateDisplay();
    renderAnalytics();
});

// Helper: Get India Date String (YYYY-MM-DD)
function getIndiaDate(d = new Date()) {
    const l = new Date(d);
    l.setMinutes(l.getMinutes() - l.getTimezoneOffset());
    return l.toISOString().split('T')[0];
}

// ================= 120FPS TIMER LOGIC =================

function updateDisplay(exactLeft = leftSecs) {
    let m = Math.floor(exactLeft / 60);
    let s = Math.floor(exactLeft % 60);
    
    if(cMode === 'stopwatch') {
        m = Math.floor(exactLeft / 60);
        s = Math.floor(exactLeft % 60);
    }
    
    elTime.textContent = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    
    let pct = durationSecs > 0 ? exactLeft / durationSecs : 0;
    if(cMode === 'stopwatch') pct = 1; // Stopwatch keeps a full ring
    
    let offset = RING_CIRCUMFERENCE * (1 - pct);
    elRing.style.strokeDashoffset = offset;
}

// Ultra-smooth loop using browser repaint cycle (Syncs to 60/90/120Hz displays)
function timerLoop() {
    if(!isRun) return;
    
    // Using performance.now() for microsecond precision instead of Date.now()
    let now = performance.now();
    let exactLeft;

    if(cMode === 'stopwatch') {
        exactLeft = (now - startTime) / 1000;
        leftSecs = exactLeft;
    } else {
        exactLeft = (endTime - now) / 1000;
        leftSecs = exactLeft;
        
        if(exactLeft <= 0) {
            isRun = false;
            leftSecs = 0;
            updateDisplay(0);
            
            // Reset UI
            elPlayBtn.innerHTML = '<i class="fa-solid fa-play"></i> Start Focus';
            elPlayBtn.classList.add('paused');
            if(elBrain) elBrain.classList.remove('pulse-anim');
            
            finishSession();
            return;
        }
    }
    
    updateDisplay(exactLeft);
    rafId = requestAnimationFrame(timerLoop);
}

function toggleTimer() {
    if(isRun) {
        // Pause
        isRun = false;
        cancelAnimationFrame(rafId);
        elPlayBtn.innerHTML = '<i class="fa-solid fa-play"></i> Resume Focus';
        elPlayBtn.classList.add('paused');
        if(elBrain) elBrain.classList.remove('pulse-anim');
    } else {
        // Start
        if(leftSecs <= 0 && cMode !== 'stopwatch') {
            leftSecs = durationSecs;
        }
        isRun = true;
        
        if(cMode === 'stopwatch') {
            startTime = performance.now() - (leftSecs * 1000);
        } else {
            endTime = performance.now() + (leftSecs * 1000);
        }
        
        elPlayBtn.innerHTML = '<i class="fa-solid fa-pause"></i> Pause Timer';
        elPlayBtn.classList.remove('paused');
        if(elBrain) elBrain.classList.add('pulse-anim');
        
        // Start the 120FPS loop
        rafId = requestAnimationFrame(timerLoop);
    }
}

// ================= MODES & PRESETS =================

function setMode(mode, el) {
    if(isRun) toggleTimer(); // Auto-pause if switching
    cMode = mode;
    
    document.querySelectorAll('.f-tab').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
    
    let m = 25;
    if(mode === 'short') m = 5;
    if(mode === 'long') m = 15;
    if(mode === 'stopwatch') { m = 0; leftSecs = 0; durationSecs = 0; }
    
    if(mode !== 'stopwatch') {
        durationSecs = m * 60; 
        leftSecs = durationSecs;
    }
    
    document.querySelectorAll('.f-preset-card').forEach(b => b.classList.remove('active'));
    updateDisplay(mode === 'stopwatch' ? 0 : leftSecs);
}

function setPreset(m, el, type) {
    if(isRun) toggleTimer();
    cMode = type || 'focus';
    
    document.querySelectorAll('.f-preset-card').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
    
    // Auto-switch to "Focus" tab
    document.querySelectorAll('.f-tab').forEach(b => b.classList.remove('active'));
    document.querySelector('.f-tab[data-mode="focus"]').classList.add('active');

    durationSecs = m * 60; 
    leftSecs = durationSecs;
    updateDisplay();
}

function customTimer(el) {
    if(isRun) toggleTimer();
    let val = prompt("Enter focus minutes (e.g. 60):", "60");
    let m = parseInt(val);
    if(!isNaN(m) && m > 0) {
        cMode = 'custom';
        document.querySelectorAll('.f-preset-card').forEach(b => b.classList.remove('active'));
        el.classList.add('active');
        
        // Reset Top Tabs
        document.querySelectorAll('.f-tab').forEach(b => b.classList.remove('active'));
        document.querySelector('.f-tab[data-mode="focus"]').classList.add('active');
        
        durationSecs = m * 60; 
        leftSecs = durationSecs;
        updateDisplay();
    }
}

// ================= DATA SYNC & FINISH =================

function finishSession() {
    let dMins = cMode === 'stopwatch' ? Math.floor(leftSecs / 60) : Math.floor(durationSecs / 60);
    if(dMins < 1) return;

    let logs = JSON.parse(localStorage.getItem(logsKey) || '[]');
    let todayStr = getIndiaDate();
    let todayCount = logs.filter(l => l.dateStr === todayStr).length + 1;

    // Save to Data Array
    let log = {
        id: Date.now(),
        dateStr: todayStr,
        time: new Date().toLocaleTimeString('en-IN', {hour:'2-digit', minute:'2-digit'}),
        duration: dMins,
        mode: cMode, 
        session: todayCount
    };
    
    logs.unshift(log);
    if(logs.length > 100) logs.pop(); 
    localStorage.setItem(logsKey, JSON.stringify(logs));
    
    // Add XP to Global Profile (+8 XP per minute)
    let currentXp = parseInt(localStorage.getItem(xpKey) || '0');
    currentXp += (dMins * 8); 
    localStorage.setItem(xpKey, currentXp.toString());
    
    alert(`🎉 MISSION COMPLETE! +${dMins * 8} XP ADDED TO PROFILE.`);
    
    // Reset Timer Display
    leftSecs = durationSecs;
    updateDisplay();
    renderAnalytics();
}

// ================= ANALYTICS & UI RENDERING =================

function renderAnalytics() {
    let logs = JSON.parse(localStorage.getItem(logsKey) || '[]');
    let todayStr = getIndiaDate();
    
    let yestDate = new Date(); yestDate.setDate(yestDate.getDate() - 1);
    let yestStr = getIndiaDate(yestDate);

    let todayLogs = logs.filter(l => l.dateStr === todayStr);
    let yestLogs = logs.filter(l => l.dateStr === yestStr);
    
    let todayMins = todayLogs.reduce((a, curr) => a + curr.duration, 0);
    let yestMins = yestLogs.reduce((a, curr) => a + curr.duration, 0);

    // 1. Bottom Left Progress (Target: 6 Sessions)
    let sessCount = todayLogs.length;
    document.getElementById('ui-sess-count').textContent = `${sessCount} / 6 Sessions`;
    let bpct = Math.min(100, Math.round((sessCount / 6) * 100));
    document.getElementById('ui-sess-fill').style.width = bpct + '%';
    document.getElementById('ui-sess-pct').textContent = bpct + '%';

    // 2. Today's Focus Card (Right Side)
    document.getElementById('ui-today-time').textContent = `${Math.floor(todayMins/60)}h ${todayMins%60}m`;
    
    // Vs Yesterday Percentage
    let diffUI = document.getElementById('ui-today-diff');
    if (yestMins === 0) {
        diffUI.innerHTML = `<i class="fa-solid fa-caret-up" style="color:#4ade80"></i> <span style="color:#4ade80">100%</span> vs yesterday`;
    } else {
        let diffPct = Math.round(((todayMins - yestMins) / yestMins) * 100);
        if(diffPct >= 0) {
            diffUI.innerHTML = `<i class="fa-solid fa-caret-up" style="color:#4ade80"></i> <span style="color:#4ade80">${diffPct}%</span> vs yesterday`;
        } else {
            diffUI.innerHTML = `<i class="fa-solid fa-caret-down" style="color:#f87171"></i> <span style="color:#f87171">${Math.abs(diffPct)}%</span> vs yesterday`;
        }
    }

    // Goal Ring (Target: 4 hours = 240 mins)
    let goalPct = Math.min(100, Math.round((todayMins / 240) * 100));
    document.getElementById('ui-goal-pct').textContent = goalPct + '%';
    
    // Circle Math: SVG Radius is 34 -> Circumference ≈ 213.6
    document.getElementById('ui-goal-ring').style.strokeDashoffset = 213.6 - (213.6 * goalPct / 100);

    // 3. Mini Stats Row (This Week)
    let weekLogs = logs.filter(l => {
        let ld = new Date(l.dateStr);
        let td = new Date(todayStr);
        return (td - ld) / (1000 * 60 * 60 * 24) <= 7;
    });
    
    let bestLog = weekLogs.reduce((max, log) => log.duration > (max.duration || 0) ? log : max, {});
    let bestMins = bestLog.duration || 0;
    
    document.getElementById('ui-best-time').textContent = bestMins + 'm';
    
    if(bestLog.dateStr) {
        let bd = new Date(bestLog.dateStr);
        document.getElementById('ui-best-date').textContent = `${bd.toLocaleDateString('en-IN', {weekday:'short'})}, ${bd.toLocaleDateString('en-IN', {month:'short', day:'numeric'})}`;
    } else {
        document.getElementById('ui-best-date').textContent = '--';
    }
    
    document.getElementById('ui-total-sess').textContent = weekLogs.length;

    // 4. Dynamic Animated Bar Chart (Last 7 Days)
    let chartHtml = '';
    let maxMins = 120; // Default baseline for visual scaling
    
    // Find the maximum minutes in the last 7 days to scale properly
    for(let i=6; i>=0; i--) {
        let d = new Date(); d.setDate(d.getDate() - i);
        let dMins = logs.filter(l => l.dateStr === getIndiaDate(d)).reduce((a, curr) => a + curr.duration, 0);
        if(dMins > maxMins) maxMins = dMins;
    }

    // Generate Bars
    for(let i=6; i>=0; i--) {
        let d = new Date(); d.setDate(d.getDate() - i);
        let dStr = getIndiaDate(d);
        let dayLbl = d.toLocaleDateString('en-IN', {weekday:'short'});
        let dMins = logs.filter(l => l.dateStr === dStr).reduce((a, curr) => a + curr.duration, 0);
        
        let hPct = Math.min(100, Math.max(5, Math.round((dMins / maxMins) * 100))); 
        let formattedTime = dMins > 60 ? `${Math.floor(dMins/60)}h ${dMins%60}m` : `${dMins}m`;
        
        let barColor = (i === 0) ? 'linear-gradient(180deg, #ec4899, rgba(236,72,153,0.1))' : 'linear-gradient(180deg, var(--neon-purple), rgba(168,85,247,0.1))';
        let shadowColor = (i === 0) ? 'rgba(236,72,153,0.4)' : 'rgba(168,85,247,0.4)';

        chartHtml += `
            <div class="chart-col">
              <div class="chart-bar-bg">
                <div class="chart-bar-fill" style="height:${hPct}%; background:${barColor}; box-shadow:0 0 12px ${shadowColor};" data-tooltip="${formattedTime}"></div>
              </div>
              <div class="chart-day" style="${i===0 ? 'color:#fff;' : ''}">${dayLbl}</div>
            </div>
        `;
    }
    document.getElementById('ui-weekly-chart').innerHTML = chartHtml;

    // 5. Smart Session History List
    let histHtml = '';
    let displayLogs = todayLogs.slice(0, 5); 
    
    // Fallback to previous days if no logs today
    if(displayLogs.length === 0) displayLogs = logs.slice(0, 4);

    if(displayLogs.length === 0) {
        histHtml = '<div style="text-align:center; padding:20px; color:var(--text-muted); font-size:12px;">No sessions yet. Time to focus! 🚀</div>';
    } else {
        displayLogs.forEach(l => {
            let iconClass = 'purple';
            let faIcon = 'fa-bullseye';
            let title = 'Focus Session';
            
            // Map exact icons & colors based on your mode
            if(l.mode === 'deepwork') { iconClass = 'blue'; faIcon = 'fa-laptop'; title = 'Deep Work'; }
            else if(l.mode === 'study') { iconClass = 'purple'; faIcon = 'fa-book-open'; title = 'Study Session'; }
            else if(l.mode === 'short' || l.mode === 'long') { iconClass = 'blue'; faIcon = 'fa-mug-hot'; title = 'Break Time'; }
            else if(l.mode === 'custom') { iconClass = 'purple'; faIcon = 'fa-gear'; title = 'Custom Focus'; }
            
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
    document.getElementById('ui-history-list').innerHTML = histHtml;
}
