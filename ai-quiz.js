/* ████████████████████████████████████████████████████████████
      AI COMBAT QUIZ ENGINE + POWER-UPS + LEADERBOARD (FIXED)
████████████████████████████████████████████████████████████ */

// ⚠️ ध्यान दें: यहाँ अपनी असली Gemini API Key डालें 
const ai_part1 = "AQ.Ab8RN6LVKzjnCCH";
const ai_part2 = "SDFpTyX7LKA7JwxLFg6AqiNMPi7siqdJGKg";
const AI_GEMINI_KEY = ai_part1 + ai_part2;

// --- STATE VARIABLES ---
let ai_QuizData = [];
let ai_QIdx = 0;
let ai_Score = 0;
let ai_TimerInt;
let ai_TimeLeft = 60;
let ai_IsAnswered = false;

// --- POWER-UP INVENTORY ---
let ai_Inventory = {
    '5050': 0,
    'freeze': 0,
    'hint': 0,
    'skip': 0,
    'revive': 0
};

// 🔥 FIX 1: पेज लोड होते ही फोन की मेमोरी (localStorage) से खरीदे गए आइटम्स निकालो
const savedInv = localStorage.getItem('ai_combat_inventory');
if(savedInv) {
    try { ai_Inventory = JSON.parse(savedInv); } catch(e) {}
}

// 🔥 FIX 2: आइटम्स को परमानेंट फोन में सेव करने का फंक्शन
function saveInventory() {
    localStorage.setItem('ai_combat_inventory', JSON.stringify(ai_Inventory));
}

// ==========================================
// 1. LEADERBOARD & XP SYNC
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    fetchLeaderboard();
    updateInventoryUI();
    
    // 🔥 FIX 3: Live XP Radar - हर 1 सेकंड में मेन ऐप से XP चेक करेगा 
    // (इससे Firebase के लोड होने वाले 0 XP बग की प्रॉब्लम सॉल्व हो जाएगी)
    setInterval(updateArenaXP, 1000); 
});

window.updateArenaXP = function() {
    const xpDisplay = document.getElementById('combatXpDisplay');
    if(xpDisplay) {
        let currentXp = (typeof S !== 'undefined' && S.xp !== undefined) ? S.xp : 0;
        xpDisplay.textContent = currentXp + ' XP';
    }
};

async function fetchLeaderboard() {
    const listUI = document.getElementById('leaderboardList');
    if(!listUI) return;
    
    try {
        const snapshot = await db.collection('users').orderBy('xp', 'desc').limit(10).get();
        let html = '';
        let rank = 1;
        
        snapshot.forEach(doc => {
            const data = doc.data();
            let medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '🎖️';
            
            let isMe = (typeof S !== 'undefined' && S.session && !S.session.isGuest && doc.id === S.session.email);
            const meStyle = isMe ? 'background: linear-gradient(90deg, rgba(251,191,36,0.15), transparent); border-left: 3px solid var(--warn);' : '';
            
            html += `
            <div class="rank-item" style="${meStyle}">
                <div class="rank-name"><span style="font-size:16px;">${medal}</span> ${data.profile.name} ${isMe ? '(You)' : ''}</div>
                <div class="rank-xp">${data.xp} XP</div>
            </div>`;
            rank++;
        });
        
        listUI.innerHTML = html || '<div style="text-align:center; font-size:12px; color:#aaa;">No warriors found yet.</div>';
    } catch(e) {
        listUI.innerHTML = '<div style="text-align:center; font-size:12px; color:var(--danger);">Error loading ranks.</div>';
    }
}

function syncXpToMainApp(amount) {
    if(typeof S === 'undefined' || !S.session || S.session.isGuest) return;
    
    S.xp += amount; // Main App के डेटाबेस में XP जोड़ो/घटाओ
    
    if(typeof saveData === 'function') saveData(); // Cloud (Firebase) पर सेव करो
    
    updateArenaXP(); // हेडर तुरंत अपडेट करो
    if(typeof renderDashboard === 'function') renderDashboard();
    
    fetchLeaderboard(); 
}

// ==========================================
// 2. BLACK MARKET (SHOP LOGIC)
// ==========================================

window.buyAIPowerUp = function(type, cost) {
    if(typeof S === 'undefined' || !S.session || S.session.isGuest) {
        if(typeof showToast === 'function') showToast("XP इस्तेमाल करने के लिए लॉगिन करें!", "error");
        else alert("Login required!");
        return;
    }

    if(S.xp >= cost) {
        syncXpToMainApp(-cost); // मेन ऐप से XP काटो
        ai_Inventory[type]++;
        saveInventory(); // 🔥 FIX 4: खरीदते ही आइटम फोन में हमेशा के लिए सेव करो
        updateInventoryUI();
        if(typeof showToast === 'function') showToast(`Item Purchased! -${cost} XP`, "success");
    } else {
        if(typeof showToast === 'function') showToast("आपके पास पर्याप्त XP नहीं हैं!", "error");
        else alert("Not enough XP!");
    }
};

function updateInventoryUI() {
    ['5050', 'freeze', 'hint', 'skip', 'revive'].forEach(item => {
        const invEl = document.getElementById(`inv${item.charAt(0).toUpperCase() + item.slice(1)}`);
        const trayEl = document.getElementById(`tray${item.charAt(0).toUpperCase() + item.slice(1)}`);
        if(invEl) invEl.textContent = `Owned: ${ai_Inventory[item]}`;
        if(trayEl) trayEl.textContent = ai_Inventory[item];
    });
}

// ==========================================
// 3. AI QUESTION GENERATOR (HINDI SETTINGS)
// ==========================================

window.startAIMatch = async function() {
    const userClass = document.getElementById('selClass').value;
    const subj = document.getElementById('selSubject').value;
    const chap = document.getElementById('selChapter').value.trim();
    const customTopic = document.getElementById('selCustomTopic').value.trim();
    const count = parseInt(document.getElementById('selCount').value);
    const level = document.getElementById('selLevel').value;

    let finalTopic = "";
    let finalSubject = subj;

    if (customTopic !== "") {
        finalTopic = customTopic;
        finalSubject = "General/Custom Topic";
    } else {
        finalTopic = chap;
    }

    if(!finalTopic || finalTopic === "Select Chapter...") {
        if(typeof showToast === 'function') showToast("Chapter का नाम या Custom Topic भरें!", "error");
        else alert("Chapter name or custom topic required!");
        return;
    }

    document.getElementById('aiLoadingOverlay').style.display = 'flex';

    try {
        ai_QuizData = await fetchAIQuestions(userClass, finalSubject, finalTopic, level, count);
        
        if(!ai_QuizData || !Array.isArray(ai_QuizData) || ai_QuizData.length === 0) {
            throw new Error("Invalid response format.");
        }
        
        ai_QIdx = 0;
        ai_Score = 0;
        document.getElementById('aiLoadingOverlay').style.display = 'none';
        
        switchQScreen('screenCombat');
        loadAIQuestion();

    } catch (e) {
        document.getElementById('aiLoadingOverlay').style.display = 'none';
        console.error(e);
        if(typeof showToast === 'function') showToast("⚠️ Server Error: AI could not generate questions. Try again!", "error");
        else alert("⚠️ Server Error. Try again!");
    }
};

async function fetchAIQuestions(userClass, subject, topic, level, count) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${AI_GEMINI_KEY}`;
    
    // 🔥 UP Board Hindi Medium Prompt
    const systemPrompt = `You are an expert exam creator for UP Board (Hindi Medium) students. 
    Generate exactly ${count} multiple-choice questions based strictly on:
    - Target Audience: ${userClass} (UP Board)
    - Subject context: '${subject}'
    - Main Topic: '${topic}'
    - Difficulty Level: '${level}'
    
    CRITICAL INSTRUCTIONS: 
    1. The questions, options, and hints MUST be entirely in HINDI language (Devanagari script).
    2. Your entire response MUST be ONLY a valid raw JSON array. DO NOT use markdown code blocks (\`\`\`json\`). No text outside the JSON.
    3. Use LaTeX like $equation$ for math/science formulas if needed.
    
    Format:
    [
      {
        "q": "बल का SI मात्रक क्या है?",
        "options": ["जूल", "न्यूटन", "पास्कल", "वाट"],
        "correct": 1,
        "hint": "यह सर आइजैक न्यूटन के नाम पर है। सूत्र F=ma है।"
      }
    ]`;

    const payload = { contents: [{ parts: [{ text: systemPrompt }] }] };

    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    const data = await response.json();
    let rawText = data.candidates[0].content.parts[0].text;
    rawText = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
    
    return JSON.parse(rawText); 
}

// ==========================================
// 4. COMBAT ARENA LOGIC & POWER-UPS
// ==========================================

function switchQScreen(id) {
    document.querySelectorAll('.q-screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

function loadAIQuestion() {
    ai_IsAnswered = false;
    clearInterval(ai_TimerInt);
    ai_TimeLeft = 60; 
    
    const qData = ai_QuizData[ai_QIdx];
    
    document.getElementById('currentQNum').textContent = ai_QIdx + 1;
    document.getElementById('totalQNum').textContent = ai_QuizData.length;
    document.getElementById('combatProgressBar').style.width = `${((ai_QIdx) / ai_QuizData.length) * 100}%`;
    
    document.getElementById('questionText').innerHTML = qData.q;
    
    const optsBox = document.getElementById('optionsContainer');
    optsBox.innerHTML = '';
    
    const letters = ['A', 'B', 'C', 'D'];
    qData.options.forEach((opt, idx) => {
        const optDiv = document.createElement('div');
        optDiv.className = 'q-option hover-scale';
        optDiv.id = `opt-${idx}`;
        optDiv.onclick = () => checkAIAnswer(idx, qData.correct);
        optDiv.innerHTML = `
            <div class="q-option-label">${letters[idx]}</div>
            <div style="flex:1">${opt}</div>
        `;
        optsBox.appendChild(optDiv);
    });

    document.getElementById('explanationBox').style.display = 'none';
    document.getElementById('explanationText').innerHTML = qData.hint || 'No hint provided.';
    document.getElementById('btnNext').style.display = 'none';

    if(window.MathJax) MathJax.typesetPromise();

    startAITimer();
}

function startAITimer() {
    document.getElementById('qTimerText').innerHTML = `${ai_TimeLeft}`;
    ai_TimerInt = setInterval(() => {
        ai_TimeLeft--;
        document.getElementById('qTimerText').innerHTML = `${ai_TimeLeft}`;
        if(ai_TimeLeft <= 0) {
            clearInterval(ai_TimerInt);
            checkAIAnswer(-1, ai_QuizData[ai_QIdx].correct); 
        }
    }, 1000);
}

// 🔥 IN-GAME POWER-UP USAGE
window.useAIPowerUp = function(type) {
    if(ai_Inventory[type] <= 0) {
        if(typeof showToast === 'function') showToast(`तुम्हारे पास ${type} पावर-अप नहीं है! Black Market से खरीदो।`, "error");
        else alert(`No ${type} power-ups left!`);
        return;
    }
    
    if(type === '5050' && !ai_IsAnswered) {
        ai_Inventory[type]--;
        let correctIdx = ai_QuizData[ai_QIdx].correct;
        let removed = 0;
        for(let i=0; i<4; i++) {
            if(i !== correctIdx && removed < 2) {
                document.getElementById(`opt-${i}`).style.opacity = '0.2';
                document.getElementById(`opt-${i}`).style.pointerEvents = 'none';
                removed++;
            }
        }
    } 
    else if(type === 'freeze' && !ai_IsAnswered) {
        ai_Inventory[type]--;
        clearInterval(ai_TimerInt);
        document.getElementById('qTimerText').innerHTML = "❄️ Freeze!";
        setTimeout(startAITimer, 10000); // 10 seconds freeze
    }
    else if(type === 'hint' && !ai_IsAnswered) {
        ai_Inventory[type]--;
        document.getElementById('explanationBox').style.display = 'block';
    }
    else if(type === 'skip' && !ai_IsAnswered) {
        ai_Inventory[type]--;
        ai_Score++; 
        nextAIQuestion();
    }
    else if(type === 'revive' && ai_IsAnswered) {
        const correctIdx = ai_QuizData[ai_QIdx].correct;
        const wrongElement = document.querySelector('.q-option.wrong');
        
        if(wrongElement) {
            ai_Inventory[type]--;
            ai_IsAnswered = false; 
            wrongElement.classList.remove('wrong');
            document.getElementById(`opt-${correctIdx}`).classList.remove('correct');
            startAITimer(); 
            if(typeof showToast === 'function') showToast("Second Chance Activated! 💖", "success");
        } else {
            alert("Revive is only used when you select a wrong answer!");
            return;
        }
    } else {
        return; 
    }

    saveInventory(); // 🔥 FIX 5: इस्तेमाल करने के बाद भी बची हुई संख्या को सेव करो
    updateInventoryUI();
};

window.checkAIAnswer = function(selectedIdx, correctIdx) {
    if(ai_IsAnswered) return;
    ai_IsAnswered = true;
    clearInterval(ai_TimerInt);
    
    document.getElementById(`opt-${correctIdx}`).classList.add('correct');
    
    if (selectedIdx === correctIdx) {
        ai_Score++;
        if(typeof confetti === 'function') confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 }, zIndex: 9999 });
    } else if (selectedIdx !== -1) {
        document.getElementById(`opt-${selectedIdx}`).classList.add('wrong');
    }

    document.getElementById('explanationBox').style.display = 'block';
    document.getElementById('btnNext').style.display = 'flex';
};

window.nextAIQuestion = function() {
    ai_QIdx++;
    if(ai_QIdx < ai_QuizData.length) {
        loadAIQuestion();
    } else {
        endAIMatch();
    }
};

function endAIMatch() {
    switchQScreen('screenResult');
    
    const total = ai_QuizData.length;
    const accuracy = Math.round((ai_Score / total) * 100);
    const earnedXP = ai_Score * 30; // 30 XP per correct answer!

    document.getElementById('resultAccuracy').textContent = accuracy + "%";
    document.getElementById('resCorrect').textContent = ai_Score;
    document.getElementById('resWrong').textContent = total - ai_Score;
    document.getElementById('resXpEarned').textContent = earnedXP;
    
    const resTitle = document.getElementById('resultTitle');
    const resEmoji = document.getElementById('resultEmoji');
    
    if(accuracy >= 80) {
        resTitle.textContent = "Legendary Win! 👑";
        resEmoji.textContent = "🏅";
        if(typeof confetti === 'function') confetti({ particleCount: 200, spread: 100, zIndex: 9999 });
    } else if(accuracy >= 50) {
        resTitle.textContent = "Mission Passed! 🚀";
        resEmoji.textContent = "👍";
    } else {
        resTitle.textContent = "Needs Practice! 📚";
        resEmoji.textContent = "⚠️";
    }

    // Push XP directly to app.js and Firebase
    syncXpToMainApp(earnedXP);
}
