/* ████████████████████████████████████████████████████████████
                  SYLLABUS ROADMAP ENGINE 
████████████████████████████████████████████████████████████ */

// 🛠️ EDIT YOUR SYLLABUS HERE (तुम इसे अपने हिसाब से कभी भी बदल सकते हो)
const SYLLABUS_DATA = {
    "Class 11": {
        "Physics": [
            "Ch 1: Physical World",
            "Ch 2: Units and Measurements",
            "Ch 3: Motion in a Straight Line",
            "Ch 4: Motion in a Plane",
            "Ch 5: Laws of Motion",
            "Ch 6: Work, Energy and Power"
        ],
        "Chemistry": [
            "Ch 1: Some Basic Concepts of Chemistry",
            "Ch 2: Structure of Atom",
            "Ch 3: Classification of Elements",
            "Ch 4: Chemical Bonding"
        ],
        "Maths": [
            "Ch 1: Sets",
            "Ch 2: Relations and Functions",
            "Ch 3: Trigonometric Functions"
        ]
    },
    "Class 12": {
        "Physics": [
            "Ch 1: Electric Charges and Fields",
            "Ch 2: Electrostatic Potential",
            "Ch 3: Current Electricity"
        ],
        "Chemistry": [
            "Ch 1: The Solid State",
            "Ch 2: Solutions",
            "Ch 3: Electrochemistry"
        ]
    },
    "Class 10": {
        "Science": [
            "Ch 1: Chemical Reactions and Equations",
            "Ch 2: Acids, Bases and Salts",
            "Ch 3: Metals and Non-metals"
        ]
    }
    // तुम यहाँ Class 6, 7, 8, 9 भी जोड़ सकते हो...
};

/* --------------------------------------------------------- */

const roadmapRef = db.collection('users_roadmap');
let roadmapProgress = {}; // Stores user's checkmarks
let currentClass = Object.keys(SYLLABUS_DATA)[0];
let currentSubject = Object.keys(SYLLABUS_DATA[currentClass])[0];

function playClickSound() { const sfx = document.getElementById('sfxClick'); if(sfx) { sfx.currentTime = 0; sfx.volume = 0.5; sfx.play().catch(e=>{}); } }
function playSuccessSound() { const sfx = document.getElementById('sfxSuccess'); if(sfx) { sfx.currentTime = 0; sfx.volume = 0.6; sfx.play().catch(e=>{}); } if(navigator.vibrate) navigator.vibrate([30, 50, 30]); }

setTimeout(async () => {
    S.session = JSON.parse(localStorage.getItem('mceo_sess') || 'null');
    if (!S.session || S.session.isGuest) {
        alert("🔒 Please login to save your syllabus progress!");
        window.location.href = "index.html";
        return;
    }

    // Load Local Progress
    roadmapProgress = JSON.parse(localStorage.getItem('mceo_roadmap_' + S.session.email)) || {};
    
    // Fetch from Firebase for cross-device sync
    try {
        const doc = await roadmapRef.doc(S.session.email).get();
        if(doc.exists) {
            roadmapProgress = doc.data().progress || {};
            localStorage.setItem('mceo_roadmap_' + S.session.email, JSON.stringify(roadmapProgress));
        }
    } catch(e) { console.log("Offline mode active."); }

    initSelectors();
}, 500);

function initSelectors() {
    renderClassTabs();
    renderSubjectTabs();
    renderChapters();
}

function renderClassTabs() {
    const container = document.getElementById('classSelector');
    container.innerHTML = Object.keys(SYLLABUS_DATA).map(cls => 
        `<button class="pill-btn ${cls === currentClass ? 'active' : ''}" onclick="selectClass('${cls}')">${cls}</button>`
    ).join('');
}

function renderSubjectTabs() {
    const container = document.getElementById('subjectSelector');
    const subjects = Object.keys(SYLLABUS_DATA[currentClass]);
    
    // If current subject doesn't exist in newly selected class, pick the first one
    if(!subjects.includes(currentSubject)) currentSubject = subjects[0];

    container.innerHTML = subjects.map(sub => 
        `<button class="pill-btn ${sub === currentSubject ? 'active' : ''}" onclick="selectSubject('${sub}')">${sub}</button>`
    ).join('');
}

function selectClass(cls) {
    playClickSound();
    currentClass = cls;
    renderClassTabs();
    renderSubjectTabs();
    renderChapters();
}

function selectSubject(sub) {
    playClickSound();
    currentSubject = sub;
    renderSubjectTabs();
    renderChapters();
}

function renderChapters() {
    const container = document.getElementById('roadmapArea');
    const chapters = SYLLABUS_DATA[currentClass][currentSubject] || [];
    
    if(chapters.length === 0) {
        container.innerHTML = `<div style="text-align:center; color:var(--textMuted); margin-top:40px;">No chapters added yet.</div>`;
        updateProgress(0, 0);
        return;
    }

    let completedCount = 0;

    container.innerHTML = chapters.map((ch, index) => {
        // Unique ID for tracking (e.g., "Class 11_Physics_Ch 1")
        const chId = `${currentClass}_${currentSubject}_${ch}`;
        const isCompleted = roadmapProgress[chId] === true;
        if(isCompleted) completedCount++;

        return `
        <div class="chapter-item ${isCompleted ? 'completed' : ''}" onclick="toggleChapter('${chId}')" style="animation: popIn 0.3s ease forwards; animation-delay: ${index * 0.05}s; opacity:0;">
            <div class="ch-check"><i class="fa-solid fa-check"></i></div>
            <div class="ch-card">
                <div class="ch-title">${ch}</div>
            </div>
        </div>`;
    }).join('');

    updateProgress(completedCount, chapters.length);
}

window.toggleChapter = async function(chId) {
    // Toggle state
    if (roadmapProgress[chId]) {
        roadmapProgress[chId] = false;
        playClickSound();
    } else {
        roadmapProgress[chId] = true;
        playSuccessSound();
    }

    // Save locally
    localStorage.setItem('mceo_roadmap_' + S.session.email, JSON.stringify(roadmapProgress));
    
    // Re-render UI to show animation
    renderChapters();

    // Sync to Cloud silently
    try {
        await roadmapRef.doc(S.session.email).set({
            progress: roadmapProgress,
            lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
        });
    } catch(e) { console.error("Cloud Sync failed"); }
}

function updateProgress(done, total) {
    const pct = total === 0 ? 0 : Math.round((done / total) * 100);
    document.getElementById('progPercentage').textContent = pct + '%';
    document.getElementById('progLabel').textContent = `${done} out of ${total} Chapters Completed`;
    document.getElementById('progBarFill').style.width = pct + '%';
}
