/* ████████████████████████████████████████████████████████████
                  PREMIUM NOTES VAULT ENGINE 
████████████████████████████████████████████████████████████ */

const UNLOCK_COST = 100; // 💰 एक चैप्टर अनलॉक करने की कीमत 100 XP

// 🛠️ EDIT YOUR SYLLABUS HERE: 
// यहाँ अपनी क्लासेज, सब्जेक्ट्स, चैप्टर्स और Google Drive Folder ID डालो।
// जो चैप्टर फ्री देना है, उसके आगे isFree: true लगा देना!
const NOTES_DATA = {
    "Class 11": {
        "Physics": [
            { id: "11_phy_1", title: "Ch 1: Physical World", desc: "Basic introduction & history.", driveId: "YOUR_DRIVE_FOLDER_ID_1", isFree: true }, // 👈 FREE
            { id: "11_phy_2", title: "Ch 2: Units & Measurements", desc: "Dimensions and error analysis.", driveId: "YOUR_DRIVE_FOLDER_ID_2" },
            { id: "11_phy_3", title: "Ch 3: Motion in a Straight Line", desc: "Kinematics equations & graphs.", driveId: "YOUR_DRIVE_FOLDER_ID_3" }
        ],
        "Chemistry": [
            { id: "11_chem_1", title: "Ch 1: रसायन विज्ञान की कुछ मूल अवधारणाएँ " ,desc: "Mole concept & stoichiometry.", driveId: "1wGhIaF-qD8NZXEOnVynUhUktx4hrO6uT", isFree: true }, // 👈 FREE
            { id: "11_chem_2", title: "Ch 2: Structure of Atom", desc: "Quantum models & configurations.", driveId: "YOUR_DRIVE_FOLDER_ID_5" }
        ],
"Maths": [
            { 
                id: "11_math_1", 
                title: "Ch 1: Sets", 
                desc: "Handwritten notes for Sets and Venn Diagrams.", 
                driveId: "1cseEDwpYQBL68HdLTYEfpaCojF0XX-QX", 
                isFree: true  // 👈 Chapter 1 सबके लिए FREE रहेगा
            },
            { 
                id: "11_math_2", 
                title: "Ch 2: Relations & Functions", 
                desc: "Domain, Range and Function Types.", 
                driveId: "1ibXb4eIysKtUeO4ftdq81dkR7q_oDMyL" 
                // 👈 यह 100 XP से अनलॉक होगा
            },
            { 
                id: "11_math_3", 
                title: "Ch 3: Trigonometric Functions", 
                desc: "Trig Ratios, Identities & Graphs.", 
                driveId: "10LKRx_2OH1d8OHE1pYgpN3BVcUJYuYeA" 
                // 👈 यह भी 100 XP से अनलॉक होगा
            }
        ]
    },
    "Class 12": {
        "Physics": [
            { id: "12_phy_1", title: "Ch 1: Electric Charges & Fields", desc: "Electrostatics part 1.", driveId: "YOUR_DRIVE_FOLDER_ID_8", isFree: true }, // 👈 FREE
            { id: "12_phy_2", title: "Ch 2: Electrostatic Potential", desc: "Capacitance and energy.", driveId: "YOUR_DRIVE_FOLDER_ID_9" }
        ]
    }
};

/* --------------------------------------------------------- */

const notesDbRef = db.collection('unlocked_notes');
let unlockedNotes = []; 
let currentClass = "";
let currentSubject = "";
let userXp = 0;
let userEmail = "";

let vaultToastTimer;
window.showToast = function(msg, type='') {
    const t = document.getElementById('toast');
    if(!t) return;
    t.textContent = msg; t.className = 'toast show ' + type;
    clearTimeout(vaultToastTimer);
    vaultToastTimer = setTimeout(() => t.className = 'toast', 2800);
};

// 🔊 Sound & Haptic Effects
function playClick() { const sfx = document.getElementById('sfxClick'); if(sfx) { sfx.currentTime=0; sfx.play().catch(e=>{}); } }
function playCoin() { const sfx = document.getElementById('sfxCoin'); if(sfx) { sfx.currentTime=0; sfx.play().catch(e=>{}); } if(navigator.vibrate) navigator.vibrate([50, 100, 50]); }
function playError() { const sfx = document.getElementById('sfxError'); if(sfx) { sfx.currentTime=0; sfx.play().catch(e=>{}); } if(navigator.vibrate) navigator.vibrate(200); }

// 🚀 APP LOAD & MAIN XP SYNC (100% Crash-Proof)
async function initVault() {
    let sessStr = localStorage.getItem('mceo_sess');
    if (!sessStr) {
        alert("🔒 Please login to access Premium Notes!");
        window.location.href = "index.html"; return;
    }
    
    let session = JSON.parse(sessStr);
    if (session.isGuest) {
        alert("🔒 Guest users cannot access Premium Notes. Please Register!");
        window.location.href = "index.html"; return;
    }

    userEmail = session.email;

    // 🔄 Sync XP securely from Main App Memory
    userXp = parseInt(localStorage.getItem(`mceo_${userEmail}_xp`) || "0");
    
    // Fallback: If S.xp is loaded from app.js, use it
    if(typeof S !== 'undefined' && S.xp !== undefined) {
        userXp = S.xp; 
    }
    document.getElementById('vaultXpDisplay').innerHTML = userXp + " XP";

    // 📥 Load Unlocked Data from Cloud & Local
    unlockedNotes = JSON.parse(localStorage.getItem('mceo_unlocked_notes_' + userEmail)) || [];
    try {
        const doc = await notesDbRef.doc(userEmail).get();
        if(doc.exists) {
            unlockedNotes = doc.data().unlocked || [];
            localStorage.setItem('mceo_unlocked_notes_' + userEmail, JSON.stringify(unlockedNotes));
        }
    } catch(e) { console.log("Offline mode or sync delay"); }

    // Initialize Selectors
    currentClass = Object.keys(NOTES_DATA)[0] || "";
    if(currentClass) currentSubject = Object.keys(NOTES_DATA[currentClass])[0] || "";
    
    initSelectors();
}

// 800ms delay to ensure Firebase and app.js are fully initialized
setTimeout(initVault, 800); 

function initSelectors() {
    if(!currentClass) {
        document.getElementById('notesArea').innerHTML = `<div style="text-align:center; color:var(--textMuted); margin-top:40px;">No syllabus data found.</div>`;
        return;
    }
    renderClassTabs(); renderSubjectTabs(); renderNotes();
}

function renderClassTabs() {
    const container = document.getElementById('classSelector');
    container.innerHTML = Object.keys(NOTES_DATA).map(cls => 
        `<button class="pill-btn ${cls === currentClass ? 'active' : ''}" onclick="selectClass('${cls}')">${cls}</button>`
    ).join('');
}

function renderSubjectTabs() {
    const container = document.getElementById('subjectSelector');
    const subjects = Object.keys(NOTES_DATA[currentClass]);
    if(!subjects.includes(currentSubject)) currentSubject = subjects[0];
    container.innerHTML = subjects.map(sub => 
        `<button class="pill-btn ${sub === currentSubject ? 'active' : ''}" onclick="selectSubject('${sub}')">${sub}</button>`
    ).join('');
}

window.selectClass = function(cls) { playClick(); currentClass = cls; renderClassTabs(); renderSubjectTabs(); renderNotes(); }
window.selectSubject = function(sub) { playClick(); currentSubject = sub; renderSubjectTabs(); renderNotes(); }

function renderNotes() {
    const container = document.getElementById('notesArea');
    const notesList = NOTES_DATA[currentClass][currentSubject] || [];
    
    if(notesList.length === 0) {
        container.innerHTML = `<div style="text-align:center; color:var(--textMuted); margin-top:40px;">Notes uploading soon... ⏳</div>`; return;
    }

    container.innerHTML = notesList.map(note => {
        // Check if Free or already Bought
        const isUnlocked = note.isFree || unlockedNotes.includes(note.id);
        
        // Show 🎉 FREE badge if chapter is free
        const freeBadgeHtml = note.isFree ? `<div class="free-badge">🎉 FREE</div>` : ``;

        return `
        <div class="note-card ${isUnlocked ? 'unlocked' : ''}" onclick="openNotes('${note.id}', '${note.title.replace(/'/g, "\\'")}', '${note.driveId}', ${note.isFree || false})">
            
            ${freeBadgeHtml}

            <div class="locked-overlay">
                <i class="fa-solid fa-lock lock-icon"></i>
                <div style="font-size:14px; font-weight:700; color:#fff; margin-bottom: 4px;">Locked Chapter</div>
                <button class="unlock-btn" onclick="event.stopPropagation(); buyNote('${note.id}')">
                    Unlock for ${UNLOCK_COST} XP <i class="fa-solid fa-bolt"></i>
                </button>
            </div>

            <div class="note-icon"><i class="fa-solid fa-file-signature"></i></div>
            <div class="note-title">${note.title}</div>
            <div class="note-desc">${note.desc}</div>
            
            ${isUnlocked ? `<div style="margin-top:12px; font-size:11px; font-weight:700; color:var(--success);"><i class="fa-solid fa-check-circle"></i> Unlocked. Tap to Read.</div>` : ''}
        </div>`;
    }).join('');
}

window.buyNote = async function(noteId) {
    if (userXp < UNLOCK_COST) {
        playError();
        showToast(`❌ Not enough XP! You need ${UNLOCK_COST} XP. Complete tasks to earn!`, "error");
        return;
    }

    if(confirm(`Spend ${UNLOCK_COST} XP to permanently unlock this chapter?`)) {
        // 💰 Deduct XP via Unified Cloud Sync
        if (window.AnRuSync && typeof window.AnRuSync.deductXP === 'function') {
            await window.AnRuSync.deductXP(UNLOCK_COST);
            userXp = window.AnRuSync.getXP();
        } else {
            userXp -= UNLOCK_COST;
            if(typeof S !== 'undefined') S.xp = userXp; 
            localStorage.setItem(`mceo_${userEmail}_xp`, userXp.toString());
        }
        
        unlockedNotes.push(noteId);
        
        // 🔄 Update DOM
        document.getElementById('vaultXpDisplay').innerHTML = userXp + " XP";

        // ☁️ Save Unlock Data locally & to Firebase Cloud
        localStorage.setItem('mceo_unlocked_notes_' + userEmail, JSON.stringify(unlockedNotes));
        try {
            await notesDbRef.doc(userEmail).set({ unlocked: unlockedNotes }, { merge: true });
        } catch(e) { console.log("Unlock saved locally due to offline mode."); }

        playCoin();
        showToast("🎉 Chapter Unlocked Successfully!", "success");
        renderNotes();
    }
}

window.openNotes = function(noteId, title, driveId, isFree) {
    // Extra security layer
    if (!isFree && !unlockedNotes.includes(noteId)) {
        playError(); showToast("⚠️ Please unlock the chapter first!", "error"); return;
    }
    
    playClick();
    document.getElementById('dvTitle').textContent = title;
    
    if (!driveId || driveId.startsWith('YOUR_DRIVE_FOLDER_ID')) {
        showToast("📌 Yeh chapter jald hi upload hoga! Stay tuned.", "warn");
        return;
    }
    
    const driveLink = `https://drive.google.com/embeddedfolderview?id=${driveId}#grid`;
    document.getElementById('driveIframe').src = driveLink;
    document.getElementById('driveViewer').classList.add('open');
}

window.closeNotes = function() {
    playClick();
    document.getElementById('driveViewer').classList.remove('open');
    document.getElementById('driveIframe').src = ""; // Clear iframe so it stops playing in background
}
