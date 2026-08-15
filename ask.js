/* ████████████████████████████████████████████████████████████
                  ANONYMOUS ASK & RESOLVE ENGINE 
████████████████████████████████████████████████████████████ */

// 👑 1. ADMIN CONFIGURATION (यहाँ अपना और टीचर्स का ईमेल डालो)
const ADMIN_EMAILS = [
    "ankesh908280@gmail.com", 
    "teacher1@gmail.com",     
    "teacher2@gmail.com"      
];

// 🤬 2. PROFANITY FILTER 
const BAD_WORDS = ["gali", "badword", "stupid", "idiot", "pagal"]; 

// ☁️ FIREBASE REFERENCE
const askRef = db.collection('anonymous_doubts');

let askToastTimer;
window.showToast = function(msg, type='') {
    const t = document.getElementById('toast');
    if(!t) return;
    t.textContent = msg;
    t.className = 'toast show' + (type ? ' ' + type : '');
    clearTimeout(askToastTimer);
    askToastTimer = setTimeout(() => t.className = 'toast', 2800);
};

function playClickSound() { const sfx = document.getElementById('sfxClick'); if(sfx) { sfx.currentTime = 0; sfx.volume = 0.5; sfx.play().catch(e=>{}); } if(navigator.vibrate) navigator.vibrate(20); }
function playSendSound() { const sfx = document.getElementById('sfxSend'); if(sfx) { sfx.currentTime = 0; sfx.volume = 0.4; sfx.play().catch(e=>{}); } if(navigator.vibrate) navigator.vibrate([30, 50, 30]); }

// 🚀 APP LOAD
let isUserAdmin = false;

setTimeout(() => {
    S.session = JSON.parse(localStorage.getItem('mceo_sess') || 'null');
    if (!S.session || S.session.isGuest) {
        alert("🔒 Only Registered Students can use this feature!");
        window.location.href = "index.html";
        return;
    }

    // Admin Check
    isUserAdmin = ADMIN_EMAILS.includes(S.session.email.toLowerCase());
    if (isUserAdmin) document.getElementById('adminBadge').style.display = 'block';

    listenToDoubts();
}, 500);

/* --- 🛡️ FILTER QUESTION --- */
function filterText(text) {
    let safeText = text;
    BAD_WORDS.forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        safeText = safeText.replace(regex, "***");
    });
    return safeText;
}

/* --- 🙋‍♀️ POST QUESTION (Student) --- */
window.postQuestion = async function() {
    const qInput = document.getElementById('qInput');
    const question = qInput.value.trim();

    if (!question) {
        playClickSound(); showToast("⚠️ Write your doubt first!", "error"); return;
    }

    const safeQuestion = filterText(question);

    try {
        showToast("Sending Anonymously... ⏳");
        await askRef.add({
            question: safeQuestion,
            status: "pending",
            answer: "",
            answeredBy: "",
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });

        playSendSound();
        qInput.value = '';
        showToast("🤫 Doubt sent! Wait for teachers to resolve it.", "success");
    } catch (e) { alert("❌ Error: " + e.message); }
}

/* --- 📡 LISTEN TO DOUBTS FEED --- */
function listenToDoubts() {
    const container = document.getElementById('doubtsContainer');

    askRef.orderBy('timestamp', 'desc').onSnapshot(snapshot => {
        if (snapshot.empty) {
            container.innerHTML = `<div style="text-align:center; margin-top:50px; opacity:0.5;"><i class="fa-solid fa-user-secret" style="font-size:40px; margin-bottom:10px;"></i><p>No doubts asked yet.</p></div>`;
            return;
        }

        container.innerHTML = ''; 

        snapshot.forEach(doc => {
            const data = doc.data();
            const dId = doc.id;
            
            // Only show Pending doubts if you are an ADMIN. 
            // Students only see Resolved doubts (to prevent feed spam).
            if (data.status === "pending" && !isUserAdmin) return;

            let statusHtml = data.status === "pending" ? `<span class="d-status">⏳ Pending</span>` : `<span class="d-status">✅ Resolved</span>`;
            
            let answerHtml = '';
            if (data.status === "resolved") {
                answerHtml = `
                    <div class="d-answer-box">
                        <div class="teacher-name"><i class="fa-solid fa-check-circle"></i> Resolved by ${data.answeredBy}</div>
                        <div class="answer-text">${data.answer}</div>
                    </div>`;
            }

            // Admin buttons
            let adminActions = '';
            if (isUserAdmin) {
                let resolveBtn = data.status === "pending" ? `<button class="btn-sm" style="background:var(--success); color:#000;" onclick="openReplyModal('${dId}', \`${data.question.replace(/'/g, "\\'")}\`)">✏️ Reply</button>` : '';
                adminActions = `<div class="d-admin-actions">${resolveBtn} <button class="btn-sm" style="background:rgba(248,113,113,0.2); color:var(--danger);" onclick="deleteDoubt('${dId}')"><i class="fa-solid fa-trash"></i> Delete</button></div>`;
            }

            const cardHtml = `
                <div class="doubt-card ${data.status}">
                    ${statusHtml}
                    <div class="d-question">${data.question}</div>
                    ${answerHtml}
                    ${adminActions}
                </div>
            `;
            container.insertAdjacentHTML('beforeend', cardHtml);
        });
    }, error => {
        container.innerHTML = `<div style="text-align:center; color: var(--danger); margin-top: 50px;">❌ Network Error.</div>`;
    });
}

/* --- 👨‍🏫 ADMIN CONTROLS (Resolve & Delete) --- */
window.openReplyModal = function(id, questionText) {
    playClickSound();
    document.getElementById('replyQId').value = id;
    document.getElementById('replyQText').textContent = "Q: " + questionText;
    document.getElementById('rInput').value = '';
    document.getElementById('replyModal').classList.add('open');
}

window.closeReplyModal = function() {
    document.getElementById('replyModal').classList.remove('open');
}

window.submitResolution = async function() {
    const id = document.getElementById('replyQId').value;
    const answerText = document.getElementById('rInput').value.trim();

    if (!answerText) { showToast("⚠️ Write an answer first!", "error"); return; }

    try {
        await askRef.doc(id).update({
            status: "resolved",
            answer: answerText,
            answeredBy: S.session.name || "Admin"
        });
        
        playSendSound();
        closeReplyModal();
        showToast("✅ Resolution Published!", "success");
    } catch (e) { alert("❌ Error: " + e.message); }
}

window.deleteDoubt = async function(id) {
    playClickSound();
    if (!confirm("👑 ADMIN: Delete this doubt?")) return;
    try {
        await askRef.doc(id).delete();
        showToast("🗑️ Deleted!", "success");
    } catch (e) { alert("❌ Delete Error: " + e.message); }
}
