/* =========================================================
   🌟 1. OFFLINE BACKUP VOCAB (अगर इंटरनेट न हो तो यह काम आएगा)
   ========================================================= */
const vocabList = [
    { hi: "ज्ञान", en: "KNOWLEDGE" }, { hi: "खतरनाक", en: "DANGEROUS" },
    { hi: "सुंदर", en: "BEAUTIFUL" }, { hi: "पर्यावरण", en: "ENVIRONMENT" },
    { hi: "सफलता", en: "SUCCESS" }, { hi: "ईमानदारी", en: "HONESTY" },
    { hi: "शिक्षा", en: "EDUCATION" }, { hi: "समाज", en: "SOCIETY" },
    { hi: "भ्रष्टाचार", en: "CORRUPTION" }, { hi: "प्रदूषण", en: "POLLUTION" }
];

/* =========================================================
   🌟 2. APP STATE & LOCAL STORAGE
   ========================================================= */
let score = 0;
let masteredWords = []; 
let wrongWords = [];    

let currentMode = "dashboard"; 
let currentWordObj = null;
let lettersBank = [];
let selectedLetters = [];

// DOM Elements
const viewDashboard = document.getElementById("dashboard-view");
const viewGame = document.getElementById("game-view");
const viewHistory = document.getElementById("history-view");

const statMastered = document.getElementById("stat-mastered");
const statMistakes = document.getElementById("stat-mistakes");
const totalCoins = document.getElementById("total-coins");

const hindiText = document.getElementById("target-hindi");
const ansZone = document.getElementById("answer-zone");
const bankZone = document.getElementById("letter-bank");
const btnCheck = document.getElementById("check-btn");
const btnShowAnswer = document.getElementById("show-answer-btn");
const btnClear = document.getElementById("clear-btn");
const gameTitle = document.getElementById("game-mode-title");
const wordCounter = document.getElementById("word-counter");

// 🟢 Load Data on App Start
window.onload = () => {
    loadData();
    updateDashboard();
};

function loadData() {
    if(localStorage.getItem("anru_vocab_score")) score = parseInt(localStorage.getItem("anru_vocab_score"));
    if(localStorage.getItem("anru_vocab_mastered")) masteredWords = JSON.parse(localStorage.getItem("anru_vocab_mastered"));
    if(localStorage.getItem("anru_vocab_wrong")) wrongWords = JSON.parse(localStorage.getItem("anru_vocab_wrong"));
}

function saveData() {
    localStorage.setItem("anru_vocab_score", score);
    localStorage.setItem("anru_vocab_mastered", JSON.stringify(masteredWords));
    localStorage.setItem("anru_vocab_wrong", JSON.stringify(wrongWords));
    updateDashboard();
}

function updateDashboard() {
    totalCoins.innerText = score;
    statMastered.innerText = masteredWords.length;
    statMistakes.innerText = wrongWords.length;
}

/* =========================================================
   🌟 3. NAVIGATION
   ========================================================= */
function handleBackButton() {
    triggerVibration();
    if (currentMode === "dashboard") window.location.href = 'index.html'; 
    else goHome();
}

function goHome() {
    currentMode = "dashboard";
    viewDashboard.classList.remove("hidden");
    viewGame.classList.add("hidden");
    viewHistory.classList.add("hidden");
    updateDashboard();
}

/* =========================================================
   🌟 4. GAME MODES
   ========================================================= */
function startEndlessMode() {
    triggerVibration();
    currentMode = "endless";
    viewDashboard.classList.add("hidden");
    viewGame.classList.remove("hidden");
    gameTitle.innerText = "Endless Mode ♾️";
    wordCounter.innerText = "Fetching new words from Internet...";
    nextWord();
}

function startRevisionMode() {
    triggerVibration();
    if (wrongWords.length === 0) {
        alert("🎉 You have no mistakes to revise! Play Endless Mode.");
        return;
    }
    currentMode = "revision";
    viewDashboard.classList.add("hidden");
    viewGame.classList.remove("hidden");
    gameTitle.innerText = "Revision Mode 🧠";
    wordCounter.innerText = "Fix your past mistakes";
    nextWord();
}

function playSpecificWord(hi, en) {
    triggerVibration();
    currentMode = "practice_specific";
    viewHistory.classList.add("hidden");
    viewGame.classList.remove("hidden");
    gameTitle.innerText = "Practice Word 🎯";
    wordCounter.innerText = "Nail this spelling!";
    setupGameForWord({ hi: hi, en: en });
}

/* =========================================================
   🌟 5. ONLINE API INTEGRATION (UNLIMITED WORDS) 🚀
   ========================================================= */
async function fetchRandomWordOnline() {
    try {
        // Step 1: 5 से 8 अक्षर वाला एक रैंडम इंग्लिश वर्ड लाओ
        const wordRes = await fetch('https://random-word-api.herokuapp.com/word?length=' + (Math.floor(Math.random() * 4) + 5));
        const wordData = await wordRes.json();
        const enWord = wordData[0].toUpperCase();

        // Step 2: MyMemory API से उसका हिंदी अनुवाद (Translation) निकालो
        const transRes = await fetch(`https://api.mymemory.translated.net/get?q=${enWord}&langpair=en|hi`);
        const transData = await transRes.json();
        const hiWord = transData.responseData.translatedText;

        // अगर API कोई गड़बड़ करे, तो ऑफलाइन वर्ड भेज दो
        if(hiWord.includes("MYMEMORY") || hiWord.toUpperCase() === enWord) {
            throw new Error("Translation failed");
        }

        return { hi: hiWord, en: enWord };
    } catch (error) {
        console.log("Internet Error or API limit reached. Using Offline Dictionary.");
        return null;
    }
}

async function nextWord() {
    let nextWordObj;
    
    if (currentMode === "endless") {
        // लोडिंग इफ़ेक्ट दिखाएं
        hindiText.innerHTML = '<i class="fa-solid fa-spinner fa-spin" style="color:#00d2ff; font-size:1.2rem;"></i> Loading from Server...';
        ansZone.innerHTML = "";
        bankZone.innerHTML = "";
        
        // API से वर्ड मंगाएं
        let onlineWord = await fetchRandomWordOnline();
        
        if(onlineWord) {
            nextWordObj = onlineWord; // इंटरनेट वाला वर्ड
            wordCounter.innerText = "Unlimited Words Mode Active 🌍";
        } else {
            // अगर नेट बंद है, तो ऑफलाइन वर्ड यूज़ करें
            nextWordObj = vocabList[Math.floor(Math.random() * vocabList.length)];
            wordCounter.innerText = "Offline Mode Active 📡";
        }
    } else if (currentMode === "revision") {
        if(wrongWords.length === 0) {
            alert("All mistakes fixed! Awesome!");
            goHome();
            return;
        }
        nextWordObj = wrongWords[Math.floor(Math.random() * wrongWords.length)];
    }
    
    setupGameForWord(nextWordObj);
}

/* =========================================================
   🌟 6. CORE GAME ENGINE
   ========================================================= */
function setupGameForWord(wordObj) {
    currentWordObj = wordObj;
    hindiText.innerText = currentWordObj.hi;

    // Reset Buttons
    btnShowAnswer.style.display = "flex";
    btnClear.style.display = "flex";
    btnCheck.innerHTML = 'Check Spelling <i class="fa-solid fa-check-double"></i>';
    btnCheck.style.background = "linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)";
    btnCheck.setAttribute("onclick", "checkSpelling()");

    let letters = currentWordObj.en.split("");
    
    // Add Dummy Letters
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    letters.push(alphabet[Math.floor(Math.random() * alphabet.length)]);
    letters.push(alphabet[Math.floor(Math.random() * alphabet.length)]);
    
    lettersBank = shuffleArray(letters);
    selectedLetters = [];
    renderGameUI();
}

function renderGameUI() {
    ansZone.innerHTML = "";
    bankZone.innerHTML = "";
    ansZone.style.borderColor = "";
    ansZone.style.background = "";

    selectedLetters.forEach((char, index) => {
        const chip = document.createElement("div");
        chip.className = "letter-chip gradient-purple fade-in";
        chip.innerText = char;
        chip.onclick = () => returnToBank(index);
        ansZone.appendChild(chip);
    });

    lettersBank.forEach((char, index) => {
        const chip = document.createElement("div");
        chip.className = "letter-chip";
        chip.innerText = char;
        chip.onclick = () => selectLetter(index);
        bankZone.appendChild(chip);
    });

    if(selectedLetters.length > 0) ansZone.classList.add("active");
    else ansZone.classList.remove("active");
}

function selectLetter(index) {
    playTapSound();
    selectedLetters.push(lettersBank.splice(index, 1)[0]);
    renderGameUI();
}

function returnToBank(index) {
    playTapSound();
    lettersBank.push(selectedLetters.splice(index, 1)[0]);
    renderGameUI();
}

function clearLetters() {
    triggerVibration(30);
    if(selectedLetters.length === 0) return;
    lettersBank.push(...selectedLetters);
    selectedLetters = [];
    renderGameUI();
}

/* =========================================================
   🌟 7. CHECKING & DATA UPDATING
   ========================================================= */
function checkSpelling() {
    if(selectedLetters.length === 0) return;

    let userWord = selectedLetters.join("");
    let correctWord = currentWordObj.en;

    if(userWord === correctWord) {
        // ✅ CORRECT
        document.getElementById("sound-correct").play().catch(e=>{});
        triggerVibration(50);
        ansZone.style.borderColor = "#05c46b";
        ansZone.style.background = "rgba(5, 196, 107, 0.2)";
        
        score += 10;
        addToMastered(currentWordObj);
        removeFromWrong(currentWordObj);
        saveData();
        
        btnCheck.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Loading Next...';
        if(Math.random() > 0.7) fireConfetti();

        setTimeout(() => {
            if(currentMode === "practice_specific") goHome();
            else nextWord();
        }, 1200);

    } else {
        // ❌ WRONG
        document.getElementById("sound-wrong").play().catch(e=>{});
        triggerVibration([50, 100, 50]);
        ansZone.style.borderColor = "#ff4757";
        ansZone.style.background = "rgba(255, 71, 87, 0.2)";
        ansZone.classList.add("shake-anim");
        
        addToWrong(currentWordObj);
        saveData();

        setTimeout(() => {
            ansZone.style.borderColor = "";
            ansZone.style.background = "";
            ansZone.classList.remove("shake-anim");
        }, 800);
    }
}

function showAnswer() {
    triggerVibration();
    ansZone.innerHTML = `<div class="fade-in" style="width: 100%; text-align: center; color: #fbc531; font-size: 1.1rem; padding: 5px;">
        💡 <b>सही स्पेलिंग:</b><br><br><span style="color:#fff; font-size: 1.8rem; font-weight:bold; letter-spacing:3px;">${currentWordObj.en}</span>
    </div>`;
    
    ansZone.style.borderColor = "#fbc531";
    ansZone.style.background = "rgba(251, 197, 49, 0.1)";
    
    bankZone.innerHTML = "";
    btnShowAnswer.style.display = "none";
    btnClear.style.display = "none";
    
    addToWrong(currentWordObj);
    saveData();
    
    btnCheck.innerHTML = 'Next Word <i class="fa-solid fa-arrow-right"></i>';
    btnCheck.style.background = "linear-gradient(135deg, #f39c12 0%, #d35400 100%)";
    btnCheck.setAttribute("onclick", "currentMode === 'practice_specific' ? goHome() : nextWord()");
}

/* =========================================================
   🌟 8. HISTORY VIEW & UTILS
   ========================================================= */
function addToMastered(wordObj) { if (!masteredWords.find(w => w.en === wordObj.en)) masteredWords.push(wordObj); }
function removeFromWrong(wordObj) { wrongWords = wrongWords.filter(w => w.en !== wordObj.en); }
function addToWrong(wordObj) { if (!wrongWords.find(w => w.en === wordObj.en)) wrongWords.push(wordObj); }

function openHistoryView() {
    triggerVibration();
    currentMode = "history";
    viewDashboard.classList.add("hidden");
    viewHistory.classList.remove("hidden");
    switchTab('wrong');
}

function switchTab(tab) {
    triggerVibration(20);
    const wrongList = document.getElementById("wrong-words-list");
    const correctList = document.getElementById("correct-words-list");
    const tabs = document.querySelectorAll(".tab-btn");
    
    tabs[0].classList.remove("active");
    tabs[1].classList.remove("active");

    if (tab === 'wrong') {
        tabs[0].classList.add("active");
        wrongList.classList.remove("hidden");
        correctList.classList.add("hidden");
        renderList(wrongWords, wrongList, "No mistakes yet! Keep playing.");
    } else {
        tabs[1].classList.add("active");
        correctList.classList.remove("hidden");
        wrongList.classList.add("hidden");
        renderList(masteredWords, correctList, "No mastered words yet. You can do it!");
    }
}

function renderList(listArray, container, emptyMsg) {
    container.innerHTML = "";
    if(listArray.length === 0) { container.innerHTML = `<div class="empty-state">${emptyMsg}</div>`; return; }

    listArray.forEach(word => {
        container.innerHTML += `
        <div class="history-item fade-in">
            <div><div class="hi-word">${word.hi}</div><div class="en-word">${word.en}</div></div>
            <button class="play-again-btn" onclick="playSpecificWord('${word.hi}', '${word.en}')">
                <i class="fa-solid fa-play"></i>
            </button>
        </div>`;
    });
}

function playTapSound() { document.getElementById("sound-tap").currentTime = 0; document.getElementById("sound-tap").play().catch(e=>{}); triggerVibration(15); }
function triggerVibration(ms = 50) { if (navigator.vibrate) navigator.vibrate(ms); }

function shuffleArray(array) {
    let curId = array.length, ranId;
    while (curId != 0) {
        ranId = Math.floor(Math.random() * curId); curId--;
        [array[curId], array[ranId]] = [array[ranId], array[curId]];
    }
    return array;
}

function fireConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    canvas.classList.remove('hidden'); canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');
    let pieces = [];
    const colors = ['#fbc531', '#00d2ff', '#ff4757', '#05c46b', '#8e2de2'];
    for(let i=0; i<80; i++) pieces.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height - canvas.height, w: Math.random() * 8 + 5, h: Math.random() * 8 + 5, c: colors[Math.floor(Math.random() * colors.length)], s: Math.random() * 4 + 2, rot: Math.random() * 360, rs: Math.random() * 5 - 2.5 });
    let frame = 0;
    function animate() {
        if(frame > 150) { canvas.classList.add('hidden'); return; }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        pieces.forEach(p => { p.y += p.s; p.rot += p.rs; if(p.y > canvas.height) p.y = -10; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot * Math.PI / 180); ctx.fillStyle = p.c; ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h); ctx.restore(); });
        frame++; requestAnimationFrame(animate);
    } animate();
}
