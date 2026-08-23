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
const elBrain = document.querySelector('.f-timer-icon');

// Circle Math: SVG Radius is 150 -> 2 * Math.PI * 150 ≈ 942.48
const RING_CIRCUMFERENCE = 942.48; 

// ================= INITIALIZATION =================

document.addEventListener("DOMContentLoaded", () => {
    // 1. Sync Avatar from Main App
    if (userSession && userSession.pfp) {
        const avImg = document.getElementById('user-avatar-img');
        if (avImg) avImg.src = userSession.pfp;
    }
    
    // 2. Disable CSS transition on SVG to enable 120FPS JS smoothness
    if (elRing) elRing.style.transition = 'none'; 
    
    // 3. 🔥 APP-LIKE FEEL: Disable Text Selection via JS (No CSS change needed)
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
    document.body.style.msUserSelect = 'none';

    updateDisplay();
    renderAnalytics();
});

// Helper: Get Local Date String (YYYY-MM-DD)
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

// Ultra-smooth loop using performance.now()
function timerLoop() {
    if (!isRun) return;
    
    let now = performance.now();
    let exactLeft;

    if (cMode === 'stopwatch') {
        exactLeft = (now - startTime) / 1000;
        leftSecs = exactLeft;
    } else {
        exactLeft = (endTime - now) / 1000;
        
        // 🔥 BUG FIX: Prevent negative values causing ring glitches at 120fps
        exactLeft = Math.max(0, exactLeft); 
        leftSecs = exactLeft;
        
        if (exactLeft <= 0) {
            isRun = false;
            leftSecs = 0;
            updateDisplay(0);
            
            // Reset UI
            elPlayBtn.innerHTML = '<i class="fa-solid fa-play"></i> Start Focus';
            elPlayBtn.classList.add('paused');
            if (elBrain) elBrain.classList.remove('pulse-anim');
            
            finishSession();
            return;
        }
    }
    
    updateDisplay(exactLeft);
    rafId = requestAnimationFrame(timerLoop);
}

function toggleTimer() {
    if (isRun) {
        // Pause
        isRun = false;
        cancelAnimationFrame(rafId);
        elPlayBtn.innerHTML = '<i class="fa-solid fa-play"></i> Resume Focus';
        elPlayBtn.classList.add('paused');
        if (elBrain) elBrain.classList.remove('pulse-anim');
    } else {
        // Start
        if (leftSecs <= 0 && cMode !== 'stopwatch') {
            leftSecs = durationSecs;
        }
        isRun = true;
        
        if (cMode === 'stopwatch') {
            startTime = performance.now() - (leftSecs * 1000);
        } else {
            endTime = performance.now() + (leftSecs * 1000);
        }
        
        elPlayBtn.innerHTML = '<i class="fa-solid fa-pause"></i> Pause Timer';
        elPlayBtn.classList.remove('paused');
        if (elBrain) elBrain.classList.add('pulse-anim');
        
        rafId = requestAnimationFrame(timerLoop);
    }
}

// ================= MODES & PRESETS =================

function setMode(mode, el) {
    if (isRun) toggleTimer(); 
    cMode = mode;
    
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
    let dMins = cMode === 'stopwatch' ? Math.floor(leftSecs / 60) : Math.floor(durationSecs / 60);
    if (dMins < 1) return;

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
    
    // Prevent bloated storage (cap at 2000 sessions)
    if (logs.length > 2000) logs.pop(); 
    localStorage.setItem(logsKey, JSON.stringify(logs));
    
    let currentXp = parseInt(localStorage.getItem(xpKey) || '0', 10);
    currentXp += (dMins * 8); 
    localStorage.setItem(xpKey, currentXp.toString());
    
    alert(`🎉 MISSION COMPLETE! +${dMins * 8} XP ADDED TO PROFILE.`);
    
    leftSecs = durationSecs;
    updateDisplay();
    renderAnalytics();
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

    // 1. Bottom Left Progress (Target: 6 Sessions)
    let sessCount = todayLogs.length;
    document.getElementById('ui-sess-count').textContent = `${sessCount} / 6 Sessions`;
    let bpct = Math.min(100, Math.round((sessCount / 6) * 100));
    document.getElementById('ui-sess-fill').style.width = bpct + '%';
    document.getElementById('ui-sess-pct').textContent = bpct + '%';

    // 2. Today's Focus Card
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

    // Goal Ring (Target: 4 hours = 240 mins)
    let goalPct = Math.min(100, Math.round((todayMins / 240) * 100));
    document.getElementById('ui-goal-pct').textContent = goalPct + '%';
    document.getElementById('ui-goal-ring').style.strokeDashoffset = 213 - (213 * goalPct / 100);

    // ==========================================
    // 3. 🔥 WEEKLY / MONTHLY / YEARLY CHART LOGIC FIX
    // ==========================================
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

    // Dynamic Y-Axis Adjustment
    if (maxMins < 60) maxMins = 60; 
    let ySteps = [maxMins, maxMins*0.66, maxMins*0.33, 0];
    if(yAxisEl) {
        yAxisEl.innerHTML = ySteps.map(m => `<span>${m >= 60 ? Math.floor(m/60)+'h' : Math.floor(m)+'m'}</span>`).join('');
    }

    // Generate Chart Bars
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

    // 4. Update Mini Stats based on Dropdown Timeframe 
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

    // 5. Smart Session History List (Fixed Icons)
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
