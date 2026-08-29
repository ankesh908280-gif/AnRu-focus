/* ████████████████████████████████████████████████████████████
      TRAIN YOUR BRAIN - CORE LOGIC (ANRU FOCUS)
      🔥 ADVANCED MATH ENGINE & DYNAMIC TIMERS 🔥
████████████████████████████████████████████████████████████ */

// --- STATE MANAGEMENT ---
let tbSetup = { diff: 'Easy', qCount: 5, topics: ['+'] };
let tbGame = { currentQ: 0, score: 0, timerInterval: null, timeLeft: 7.0, baseTime: 7.0, isAnswering: false, correctIdx: -1, secondChanceActive: false, multiplierActive: false };

// --- MAGIC SHOP & INVENTORY ---
const MAGIC_ITEMS = {
    'time_freeze': { id: 'time_freeze', name: 'Time Freeze', icon: 'fa-stopwatch', color: '#60a5fa', cost: 50, desc: '+5 Seconds extra time for one question.' },
    'fifty_fifty': { id: 'fifty_fifty', name: '50/50 Strike', icon: 'fa-scissors', color: '#ec4899', cost: 80, desc: 'Removes 2 incorrect options.' },
    'second_chance':{ id: 'second_chance', name: 'Second Chance', icon: 'fa-shield-heart', color: '#4ade80', cost: 100, desc: 'If you click wrong, try again without penalty.' },
    'skip_master': { id: 'skip_master', name: 'Skip Master', icon: 'fa-forward-step', color: '#a855f7', cost: 60, desc: 'Skip current question & get a new one.' },
    'multiplier':  { id: 'multiplier', name: 'Star Multiplier', icon: 'fa-star', color: '#fbbf24', cost: 120, desc: 'Next correct answer gives 3 Stars instead of 1.' }
};

let inventory = JSON.parse(localStorage.getItem('mceo_tb_inv')) || { time_freeze: 0, fifty_fifty: 0, second_chance: 0, skip_master: 0, multiplier: 0 };
let localStats = JSON.parse(localStorage.getItem('mceo_brain_stats')) || { stars: 0, questions: 0 };

// Helper to access Main App XP securely
function getMainKey(suffix) {
    const sess = JSON.parse(localStorage.getItem('mceo_sess'));
    const id = (sess && sess.isGuest) ? 'guest' : (sess ? sess.email : 'guest');
    return `mceo_${id}_${suffix}`;
}
function getMainXp() { return parseInt(localStorage.getItem(getMainKey('xp')) || '0'); }
function setMainXp(val) { localStorage.setItem(getMainKey('xp'), val.toString()); }

// --- SOUND EFFECTS ---
const sfxClick = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-sci-fi-click-900.mp3');
const sfxCorrect = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-correct-answer-reward-952.mp3');
const sfxWrong = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-wrong-answer-fail-notification-946.mp3');
const sfxMagic = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-magical-coin-win-1936.mp3');
function playS(aud) { try { aud.currentTime = 0; aud.volume = 0.5; aud.play().catch(e=>{}); } catch(e){} }

// --- INIT ---
window.addEventListener('load', () => {
    document.getElementById('tbGlobalStars').textContent = localStats.stars;
    setTimeout(() => { switchTbScreen('screen-setup'); }, 2000);
});

function switchTbScreen(id) {
    document.querySelectorAll('.tb-screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

// --- SETUP ACTIONS ---
function selectOpt(type, val) {
    playS(sfxClick);
    if(type === 'diff') {
        tbSetup.diff = val;
        document.querySelectorAll('#diffGroup .opt-btn').forEach(b => b.classList.toggle('active', b.textContent === val));
    } else {
        tbSetup.qCount = val;
        document.querySelectorAll('#qGroup .opt-btn').forEach(b => b.classList.toggle('active', parseInt(b.textContent) === val));
    }
}
function toggleTopic(op) {
    playS(sfxClick);
    const idx = tbSetup.topics.indexOf(op);
    if(idx > -1) {
        if(tbSetup.topics.length > 1) tbSetup.topics.splice(idx, 1);
        else return showToast("Kam se kam 1 topic rakhna padega!", "error");
    } else { tbSetup.topics.push(op); }
    
    document.querySelectorAll('.topic-btn').forEach(b => {
        let btnOp = b.textContent; if(btnOp==='×') btnOp='*'; if(btnOp==='÷') btnOp='/';
        b.classList.toggle('active', tbSetup.topics.includes(btnOp));
    });
}

// --- MAGIC SHOP ---
function openMagicShop() {
    playS(sfxClick);
    document.getElementById('userXpDisplay').textContent = `${getMainXp()} XP`;
    renderShopItems();
    document.getElementById('magicShopModal').classList.add('open');
}
function renderShopItems() {
    const list = document.getElementById('shopList');
    list.innerHTML = Object.values(MAGIC_ITEMS).map(item => `
        <div class="m-shop-item">
            <div class="m-shop-icon" style="color:${item.color}"><i class="fa-solid ${item.icon}"></i></div>
            <div class="m-shop-details">
                <div class="m-shop-title">${item.name} <span style="font-size:10px; opacity:0.6;">(Owned: ${inventory[item.id]})</span></div>
                <div class="m-shop-desc">${item.desc}</div>
            </div>
            <button class="btn-sm" style="background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.2);" onclick="buyMagicItem('${item.id}')">${item.cost} XP</button>
        </div>
    `).join('');
}
function buyMagicItem(id) {
    const item = MAGIC_ITEMS[id]; let xp = getMainXp();
    if(xp < item.cost) return showToast(`Not enough XP! Need ${item.cost} XP`, "error");
    
    setMainXp(xp - item.cost);
    inventory[id]++;
    localStorage.setItem('mceo_tb_inv', JSON.stringify(inventory));
    
    playS(sfxMagic);
    document.getElementById('userXpDisplay').textContent = `${getMainXp()} XP`;
    renderShopItems();
    showToast(`<i class="fa-solid ${item.icon}"></i> ${item.name} Purchased!`, "success");
}

// --- GAME LOGIC ---
function startTraining() {
    playS(sfxClick);
    tbGame.currentQ = 0; tbGame.score = 0;
    tbGame.secondChanceActive = false; tbGame.multiplierActive = false;
    
    switchTbScreen('screen-arena');
    renderArenaInventory();
    loadNextQuestion();
}

function renderArenaInventory() {
    const invDiv = document.getElementById('arenaInventory');
    invDiv.innerHTML = Object.values(MAGIC_ITEMS).map(item => `
        <button class="inv-item-btn ${inventory[item.id] > 0 ? '' : 'used'}" id="inv-btn-${item.id}" onclick="useMagicItem('${item.id}')" style="color:${item.color}">
            <i class="fa-solid ${item.icon}"></i>
            <span class="inv-badge" id="badge-${item.id}">${inventory[item.id]}</span>
        </button>
    `).join('');
}

function useMagicItem(id) {
    if(tbGame.isAnswering || inventory[id] <= 0) return;
    playS(sfxMagic);
    inventory[id]--; localStorage.setItem('mceo_tb_inv', JSON.stringify(inventory));
    
    const badge = document.getElementById(`badge-${id}`); if(badge) badge.textContent = inventory[id];
    if(inventory[id] === 0) document.getElementById(`inv-btn-${id}`).classList.add('used');

    if(id === 'time_freeze') { tbGame.timeLeft += 5.0; showToast("⏳ +5 Seconds Added!", "success"); }
    else if(id === 'fifty_fifty') { applyFiftyFifty(); showToast("✂️ 2 Wrong Options Removed!", "success"); }
    else if(id === 'second_chance') { tbGame.secondChanceActive = true; showToast("🛡️ Second Chance Active!", "success"); }
    else if(id === 'skip_master') { showToast("⏭️ Question Skipped!", "success"); loadNextQuestion(true); }
    else if(id === 'multiplier') { tbGame.multiplierActive = true; showToast("🌟 Star Multiplier (3x) Active!", "success"); }
}

function applyFiftyFifty() {
    let hidden = 0;
    for(let i=0; i<4; i++) {
        if(i !== tbGame.correctIdx && hidden < 2) {
            document.getElementById(`opt${i}`).style.visibility = 'hidden';
            hidden++;
        }
    }
}

function loadNextQuestion(isSkip = false) {
    if(!isSkip) tbGame.currentQ++;
    if(tbGame.currentQ > tbSetup.qCount) return endGame();

    tbGame.isAnswering = false;
    document.getElementById('currentRunStars').textContent = tbGame.score;
    document.getElementById('qCounter').textContent = `${tbGame.currentQ} / ${tbSetup.qCount}`;
    
    // Reset Buttons
    for(let i=0; i<4; i++) {
        let btn = document.getElementById(`opt${i}`);
        btn.className = 'ans-btn glass';
        btn.style.visibility = 'visible';
    }

    // 🔥 SMART MATH ENGINE (Strict Digit & Time Rules)
    let minNum, maxNum;
    if (tbSetup.diff === 'Easy') {
        minNum = 10; maxNum = 99; // 2 Digits
        tbGame.baseTime = 7.0;    // 7 Sec
    } else if (tbSetup.diff === 'Medium') {
        minNum = 10; maxNum = 999; // 2 & 3 Digits
        tbGame.baseTime = 5.0;     // 5 Sec
    } else if (tbSetup.diff === 'Hard') {
        minNum = 100; maxNum = 9999; // 3 & 4 Digits
        tbGame.baseTime = 6.0;       // 6 Sec
    }

    const op = tbSetup.topics[Math.floor(Math.random() * tbSetup.topics.length)];
    let n1, n2, ans;

    if(op === '+') { 
        n1 = rnd(minNum, maxNum); n2 = rnd(minNum, maxNum); ans = n1 + n2; 
    }
    else if(op === '-') { 
        n1 = rnd(minNum, maxNum); n2 = rnd(10, n1); ans = n1 - n2; 
    }
    else if(op === '*') { 
        // Multiplication kept slightly reasonable so it can be solved in 5-6s
        let multMax = tbSetup.diff === 'Easy' ? 9 : (tbSetup.diff === 'Medium' ? 15 : 25);
        n1 = rnd(minNum, maxNum); n2 = rnd(2, multMax); ans = n1 * n2; 
    }
    else if(op === '/') { 
        let divMax = tbSetup.diff === 'Easy' ? 9 : (tbSetup.diff === 'Medium' ? 15 : 25);
        n2 = rnd(2, divMax); ans = rnd(minNum, maxNum); n1 = n2 * ans; 
    }
    else if(op === '%') {
        let tens = [10, 20, 25, 30, 40, 50, 75]; n2 = tens[Math.floor(Math.random()*tens.length)];
        let base = rnd(minNum, maxNum); n1 = Math.round(base / 100) * 100; if(n1 === 0) n1 = 100;
        ans = Math.round((n2 / 100) * n1);
    }

    let opSign = op; if(op==='*') opSign='×'; if(op==='/') opSign='÷'; if(op==='%') opSign='% of';
    document.getElementById('questionText').textContent = `${op==='%' ? n2 : n1} ${opSign} ${op==='%' ? n1 : n2} = ?`;

    // 🔥 SMART OPTIONS GENERATOR (Creates confusing fake options)
    tbGame.correctIdx = Math.floor(Math.random() * 4);
    let options = [];
    let variance = Math.max(5, Math.floor(ans * 0.15)); // Fake options will be ~15% close to real answer
    
    for(let i=0; i<4; i++) {
        if(i === tbGame.correctIdx) { options[i] = ans; } 
        else {
            let fake;
            do { fake = ans + rnd(-variance, variance); } 
            while(fake === ans || options.includes(fake) || fake < 0);
            options[i] = fake;
        }
        document.getElementById(`opt${i}`).textContent = options[i];
    }

    // Start Timer
    tbGame.timeLeft = tbGame.secondChanceActive ? (tbGame.baseTime + 2.0) : tbGame.baseTime; 
    document.getElementById('timerBar').className = 'timer-fill';
    clearInterval(tbGame.timerInterval);
    tbGame.timerInterval = setInterval(updateTimer, 50);
}

function updateTimer() {
    if(tbGame.isAnswering) return;
    tbGame.timeLeft -= 0.05;
    if(tbGame.timeLeft <= 0) {
        tbGame.timeLeft = 0;
        checkAnswer(-1); // Auto Fail if Time Runs Out
    }
    
    document.getElementById('timeText').textContent = tbGame.timeLeft.toFixed(1) + 's';
    
    // Smooth Timer Bar Calculation
    let maxT = Math.max(tbGame.baseTime, tbGame.timeLeft);
    const pct = Math.max(0, (tbGame.timeLeft / maxT) * 100);
    
    const tBar = document.getElementById('timerBar');
    tBar.style.width = `${pct}%`;
    if(pct < 30) tBar.classList.add('danger'); else tBar.classList.remove('danger');
}

function checkAnswer(idx) {
    if(tbGame.isAnswering) return;
    clearInterval(tbGame.timerInterval);
    
    // SECOND CHANCE LOGIC
    if(tbGame.secondChanceActive && idx !== tbGame.correctIdx && idx !== -1) {
        playS(sfxWrong);
        document.getElementById(`opt${idx}`).classList.add('wrong');
        showToast("🛡️ Second Chance saved you! Try again.", "success");
        tbGame.secondChanceActive = false; // consume it
        tbGame.timeLeft = tbGame.baseTime; // reset timer
        tbGame.timerInterval = setInterval(updateTimer, 50);
        return;
    }

    tbGame.isAnswering = true;
    
    if(idx === tbGame.correctIdx) {
        playS(sfxCorrect);
        document.getElementById(`opt${idx}`).classList.add('correct');
        let pts = tbGame.multiplierActive ? 3 : 1;
        tbGame.score += pts;
        if(tbGame.multiplierActive) { showToast("🌟 3x Stars Earned!", "success"); tbGame.multiplierActive = false; }
    } else {
        playS(sfxWrong);
        if(idx !== -1) document.getElementById(`opt${idx}`).classList.add('wrong');
        document.getElementById(`opt${tbGame.correctIdx}`).classList.add('correct');
    }

    setTimeout(() => { loadNextQuestion(); }, 1200);
}

// --- RESULT & FIREBASE LEADERBOARD ---
function endGame() {
    switchTbScreen('screen-result');
    document.getElementById('resScore').textContent = `${tbGame.score} Stars`;
    syncFirebaseLeaderboard(tbGame.score, tbSetup.qCount);
}

function goToSetup() { playS(sfxClick); switchTbScreen('screen-setup'); }

function rnd(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function showToast(msg, type='') {
    const t = document.getElementById('toast');
    t.innerHTML = msg; t.className = 'toast show ' + type;
    setTimeout(() => t.classList.remove('show'), 2800);
}

// 🔥 FIREBASE SYNC & LEADERBOARD FETCH
async function syncFirebaseLeaderboard(newStars, qAnswered) {
    localStats.stars += newStars; localStats.questions += qAnswered;
    localStorage.setItem('mceo_brain_stats', JSON.stringify(localStats));
    document.getElementById('tbGlobalStars').textContent = localStats.stars;

    const listDiv = document.getElementById('leaderboardList');
    listDiv.innerHTML = '<div style="text-align:center; padding:20px; color:var(--textMuted);"><i class="fa-solid fa-circle-notch fa-spin"></i> Fetching Global Ranks...</div>';

    const sess = JSON.parse(localStorage.getItem('mceo_sess'));
    if(!sess || sess.isGuest || typeof db === 'undefined') {
        listDiv.innerHTML = '<div style="text-align:center; padding:20px; color:var(--warn); font-size:12px;">Login with Cloud Account to compete on the Global Leaderboard!</div>';
        return;
    }

    try {
        const email = sess.email; const name = sess.name;
        const ref = db.collection('brain_players').doc(email);
        const doc = await ref.get();
        
        if(doc.exists) {
            await ref.update({
                stars: firebase.firestore.FieldValue.increment(newStars),
                questions: firebase.firestore.FieldValue.increment(qAnswered),
                name: name
            });
        } else {
            await ref.set({ stars: localStats.stars, questions: localStats.questions, name: name, email: email });
        }

        const snapshot = await db.collection('brain_players').orderBy('stars', 'desc').limit(20).get();
        let html = ''; let rank = 1;
        
        snapshot.forEach(player => {
            const data = player.data();
            let rClass = ``; let rIcon = rank;
            if(rank === 1) { rClass = 'rank-1'; rIcon = '<i class="fa-solid fa-medal"></i>'; }
            else if(rank === 2) { rClass = 'rank-2'; rIcon = '<i class="fa-solid fa-medal"></i>'; }
            else if(rank === 3) { rClass = 'rank-3'; rIcon = '<i class="fa-solid fa-medal"></i>'; }

            html += `
                <div class="lb-item ${rClass}">
                    <div class="lb-rank">${rIcon}</div>
                    <div class="lb-name">
                        <div style="font-size:15px; color:${rank<=3 ? '#fff' : 'var(--p1)'};">${data.name}</div>
                        <div style="font-size:10px; color:var(--textMuted); font-weight:500;">${data.questions} questions answered</div>
                    </div>
                    <div class="lb-score">${data.stars} <span style="font-size:10px; color:var(--textMuted);">PTS</span></div>
                </div>
            `;
            rank++;
        });
        
        listDiv.innerHTML = html;

    } catch(e) {
        console.error(e);
        listDiv.innerHTML = '<div style="text-align:center; padding:20px; color:var(--danger); font-size:12px;">Network Error! Ranks not loaded.</div>';
    }
}
