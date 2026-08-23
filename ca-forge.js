/* ████████████████████████████████████████████████████████████
             DAILY CURRENT AFFAIRS FORGE - JS ENGINE (PRO FIX)
████████████████████████████████████████████████████████████ */

// ✅ NEW GOOGLE UPDATE API KEY 
const ai_part1 = "AQ.Ab8RN6Jifj2Wi7C7lqN4";
const ai_part2 = "blnc2NWzicoY9CoVIjj6Qv34npFIvQ";
const AI_GEMINI_KEY = ai_part1 + ai_part2;

// --- STATE VARIABLES ---
let ca_QuizData = [];
let ca_Brief = [];
let ca_QIdx = 0;
let ca_Score = 0;
let ca_IsAnswered = false;
let currentCategory = "";

// --- LOCAL STORAGE (VAULT) ---
let ca_History = JSON.parse(localStorage.getItem('ca_history')) || [];
let ca_Starred = JSON.parse(localStorage.getItem('ca_starred')) || [];

// ==========================================
// 1. INITIALIZATION & XP SYNC
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(updateArenaXP, 500); 
});

window.updateArenaXP = function() {
    const xpDisplay = document.getElementById('combatXpDisplay');
    if(xpDisplay) {
        let currentXp = (typeof S !== 'undefined' && S.xp !== undefined) ? S.xp : 0;
        xpDisplay.textContent = currentXp + ' XP';
    }
};

function syncXpToMainApp(amount) {
    if(typeof S === 'undefined' || !S.session || S.session.isGuest) return;
    S.xp += amount;
    if(typeof saveData === 'function') saveData();
    updateArenaXP(); 
    if(typeof renderDashboard === 'function') renderDashboard();
}

// ==========================================
// 2. AI GENERATION (WITH AUTO-FALLBACK)
// ==========================================

window.generateCA = async function() {
    const categorySel = document.getElementById('caCategory');
    const countSel = document.getElementById('caCount');
    
    currentCategory = categorySel.options[categorySel.selectedIndex].text;
    const count = parseInt(countSel.value);
    
    const today = new Date().toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' });

    document.getElementById('aiLoadingOverlay').style.display = 'flex';

    try {
        const payload = await fetchLiveNewsAPI(currentCategory, count, today);
        
        ca_Brief = payload.brief;
        ca_QuizData = payload.quiz;
        
        if(!ca_QuizData || ca_QuizData.length === 0) {
            throw new Error("AI ने खाली डेटा भेजा है।");
        }
        
        document.getElementById('aiLoadingOverlay').style.display = 'none';
        
        renderNewsBrief();
        switchQScreen('screenBrief');

    } catch (e) {
        document.getElementById('aiLoadingOverlay').style.display = 'none';
        console.error("Forge Error:", e);
        alert(`⚠️ Error: ${e.message}\n\nकृपया 1 मिनट बाद दोबारा कोशिश करें!`);
    }
};

async function fetchLiveNewsAPI(category, count, dateStr) {
    // User requested 3.6-flash, we try that first.
    let aiModel = "gemini-3.6-flash"; 
    let url = `https://generativelanguage.googleapis.com/v1beta/models/${aiModel}:generateContent?key=${AI_GEMINI_KEY}`;
    
    const systemPrompt = `आज तारीख है: ${dateStr}।
    तुम SSC, Railway, UPSC और Banking के एक एक्सपर्ट Current Affairs टीचर हो।
    पिछले कुछ दिनों की "${category}" से जुड़ी सबसे ताज़ा और महत्वपूर्ण ख़बरों के आधार पर एक टेस्ट बनाओ।

    JSON Format बिल्कुल ऐसा होना चाहिए:
    {
      "brief": [
        "आज की पहली महत्वपूर्ण खबर की 1 लाइन की समरी।",
        "दूसरी खबर की समरी।",
        "तीसरी खबर की समरी।",
        "चौथी खबर की समरी।",
        "पांचवीं खबर की समरी।"
      ],
      "quiz": [
        {
          "q": "हाल ही में किसे नया अध्यक्ष चुना गया है?",
          "options": ["ऑप्शन A", "ऑप्शन B", "ऑप्शन C", "ऑप्शन D"],
          "correct": 0,
          "hint": "यह व्यक्ति पहले इस विभाग में काम कर चुके हैं।"
        }
      ]
    }
    
    नियम: 'brief' array में ठीक 5 पॉइंट्स होने चाहिए। 'quiz' array में ठीक ${count} सवाल होने चाहिए। भाषा HINDI होनी चाहिए।`;

    const payload = { 
        contents: [{ parts: [{ text: systemPrompt }] }],
        generationConfig: { responseMimeType: "application/json" } 
    };

    let response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    // 🔥 SMART FALLBACK: Agar 3.6 model server par nahi mila (404 error), to chupchap 1.5-flash use karo
    if (!response.ok) {
        const tempCheck = await response.clone().json();
        if(tempCheck.error && tempCheck.error.code === 404) {
            console.warn("Gemini 3.6 Server Busy/Not Found. Switching to Gemini 1.5 Flash... ⚡");
            aiModel = "gemini-1.5-flash";
            url = `https://generativelanguage.googleapis.com/v1beta/models/${aiModel}:generateContent?key=${AI_GEMINI_KEY}`;
            response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
        }
    }

    const data = await response.json();

    // Error Handling
    if (!response.ok) {
        let errorMsg = data.error?.message || "Unknown Server Error";
        if(errorMsg.includes("API key not valid")) errorMsg = "API Key काम नहीं कर रही है। (Invalid Key)";
        else if(errorMsg.includes("quota")) errorMsg = "API की फ्री लिमिट खत्म हो गई है! (Quota Exceeded)";
        throw new Error(errorMsg);
    }

    if (!data.candidates || data.candidates.length === 0) {
        throw new Error("AI ने कोई जवाब नहीं दिया।");
    }

    let rawText = data.candidates[0].content.parts[0].text;
    
    try {
        return JSON.parse(rawText); 
    } catch(err) {
        console.error("JSON Parse Failed:", rawText);
        throw new Error("AI का आउटपुट गलत फॉर्मेट में था।");
    }
}

// ==========================================
// 3. 60-SEC BRIEF & QUIZ LOGIC
// ==========================================

function switchQScreen(id) {
    document.querySelectorAll('.q-screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

function renderNewsBrief() {
    const list = document.getElementById('newsBriefList');
    list.innerHTML = '';
    ca_Brief.forEach(point => {
        list.innerHTML += `<li>${point}</li>`;
    });
}

window.startCAQuiz = function() {
    ca_QIdx = 0;
    ca_Score = 0;
    switchQScreen('screenCombat');
    loadCAQuestion();
};

function loadCAQuestion() {
    ca_IsAnswered = false;
    const qData = ca_QuizData[ca_QIdx];
    
    document.getElementById('currentQNum').textContent = ca_QIdx + 1;
    document.getElementById('totalQNum').textContent = ca_QuizData.length;
    document.getElementById('combatProgressBar').style.width = `${((ca_QIdx) / ca_QuizData.length) * 100}%`;
    
    document.getElementById('questionText').innerHTML = qData.q;
    
    // Check if already starred
    const starBtn = document.getElementById('btnStar');
    const isStarred = ca_Starred.some(sq => sc(sq.q) === sc(qData.q));
    if(isStarred) starBtn.classList.add('active');
    else starBtn.classList.remove('active');
    
    const optsBox = document.getElementById('optionsContainer');
    optsBox.innerHTML = '';
    
    const letters = ['A', 'B', 'C', 'D'];
    qData.options.forEach((opt, idx) => {
        optsBox.innerHTML += `
            <div class="q-option hover-scale" id="opt-${idx}" onclick="checkCAAnswer(${idx}, ${qData.correct})">
                <div class="q-option-label">${letters[idx]}</div>
                <div style="flex:1">${opt}</div>
            </div>
        `;
    });

    document.getElementById('explanationBox').style.display = 'none';
    document.getElementById('explanationText').innerHTML = qData.hint || 'कोई अतिरिक्त जानकारी उपलब्ध नहीं है।';
    document.getElementById('btnNext').style.display = 'none';
}

window.checkCAAnswer = function(selectedIdx, correctIdx) {
    if(ca_IsAnswered) return;
    ca_IsAnswered = true;
    
    document.getElementById(`opt-${correctIdx}`).classList.add('correct');
    
    if (selectedIdx === correctIdx) {
        ca_Score++;
        if(typeof confetti === 'function') confetti({ particleCount: 40, spread: 50, origin: { y: 0.8 }, zIndex: 9999 });
    } else {
        document.getElementById(`opt-${selectedIdx}`).classList.add('wrong');
    }

    document.getElementById('explanationBox').style.display = 'block';
    document.getElementById('btnNext').style.display = 'flex';
};

window.nextCAQuestion = function() {
    ca_QIdx++;
    if(ca_QIdx < ca_QuizData.length) {
        loadCAQuestion();
    } else {
        endCAMatch();
    }
};

function endCAMatch() {
    switchQScreen('screenResult');
    
    const total = ca_QuizData.length;
    const accuracy = Math.round((ca_Score / total) * 100);
    const earnedXP = ca_Score * 15; // 15 XP per CA question

    document.getElementById('resultAccuracy').textContent = accuracy + "%";
    document.getElementById('resCorrect').textContent = ca_Score;
    document.getElementById('resWrong').textContent = total - ca_Score;
    document.getElementById('resXpEarned').textContent = earnedXP;
    
    const resTitle = document.getElementById('resultTitle');
    const resEmoji = document.getElementById('resultEmoji');
    
    if(accuracy >= 80) { resTitle.textContent = "Current Affairs Master! 👑"; resEmoji.textContent = "📰"; if(typeof confetti === 'function') confetti({ particleCount: 200, zIndex: 9999 }); }
    else if(accuracy >= 50) { resTitle.textContent = "Good Knowledge! 🚀"; resEmoji.textContent = "👍"; }
    else { resTitle.textContent = "Keep Reading News! 📚"; resEmoji.textContent = "⚠️"; }

    syncXpToMainApp(earnedXP);
    saveToHistory(total);
}

// ==========================================
// 4. VAULT SYSTEM (HISTORY & BOOKMARKS)
// ==========================================

function sc(str) { return str.replace(/\s+/g,'').toLowerCase(); }

window.toggleStar = function() {
    const qData = ca_QuizData[ca_QIdx];
    const starBtn = document.getElementById('btnStar');
    
    const existsIdx = ca_Starred.findIndex(sq => sc(sq.q) === sc(qData.q));
    
    if(existsIdx > -1) {
        ca_Starred.splice(existsIdx, 1);
        starBtn.classList.remove('active');
    } else {
        ca_Starred.unshift(qData); 
        starBtn.classList.add('active');
    }
    
    localStorage.setItem('ca_starred', JSON.stringify(ca_Starred));
};

function saveToHistory(totalQs) {
    const today = new Date().toLocaleDateString('hi-IN', { day: 'numeric', month: 'short' });
    const record = {
        date: today,
        topic: currentCategory,
        score: ca_Score,
        total: totalQs
    };
    ca_History.unshift(record);
    if(ca_History.length > 50) ca_History.pop(); 
    localStorage.setItem('ca_history', JSON.stringify(ca_History));
}

window.openVault = function() {
    switchQScreen('screenVault');
    switchVaultTab('history');
};

window.switchVaultTab = function(tabName) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('vaultHistoryContainer').style.display = 'none';
    document.getElementById('vaultStarredContainer').style.display = 'none';
    
    if(tabName === 'history') {
        document.getElementById('tabHistory').classList.add('active');
        renderVaultHistory();
    } else {
        document.getElementById('tabStarred').classList.add('active');
        renderVaultStarred();
    }
};

function renderVaultHistory() {
    const container = document.getElementById('vaultHistoryContainer');
    container.style.display = 'flex';
    
    if(ca_History.length === 0) {
        container.innerHTML = '<div style="text-align:center; color:#aaa; font-size:13px; margin-top:20px;">कोई पुराना टेस्ट रिकॉर्ड नहीं मिला।</div>';
        return;
    }
    
    let html = '';
    ca_History.forEach(item => {
        html += `
        <div class="vault-item">
            <div>
                <div class="vi-date">🗓️ ${item.date}</div>
                <div class="vi-topic">${item.topic}</div>
            </div>
            <div class="vi-score">${item.score} / ${item.total}</div>
        </div>`;
    });
    container.innerHTML = html;
}

function renderVaultStarred() {
    const container = document.getElementById('vaultStarredContainer');
    container.style.display = 'flex';
    
    if(ca_Starred.length === 0) {
        container.innerHTML = '<div style="text-align:center; color:#aaa; font-size:13px; margin-top:20px;">कोई सवाल बुकमार्क (⭐) नहीं किया गया है।</div>';
        return;
    }
    
    let html = '';
    ca_Starred.forEach((q, idx) => {
        html += `
        <div class="star-card">
            <div class="sc-q">Q. ${q.q}</div>
            <div class="sc-ans">✅ उत्तर: ${q.options[q.correct]}</div>
            <div class="sc-hint">💡 ${q.hint}</div>
        </div>`;
    });
    container.innerHTML = html;
}
