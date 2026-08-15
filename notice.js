/* ████████████████████████████████████████████████████████████
                  DIGITAL NOTICE BOARD ENGINE 
████████████████████████████████████████████████████████████ */

// 👑 1. ADMIN CONFIGURATION (यहाँ अपने और टीचर्स के असली ईमेल डालना)
const ADMIN_EMAILS = [
    "ankesh908280@gmail.com", // तुम्हारा ईमेल (Main Admin)
    "teacher1@gmail.com",     // Principal Sir का ईमेल (बाद में बदल देना)
    "teacher2@gmail.com",     // Teacher 2 का ईमेल
    "teacher3@gmail.com"      // Teacher 3 का ईमेल
];

// ☁️ FIREBASE REFERENCE
const noticeRef = db.collection('school_notices');

let noticeToastTimer;
window.showToast = function(msg, type='') {
    const t = document.getElementById('toast');
    if(!t) return;
    t.textContent = msg;
    t.className = 'toast show' + (type ? ' ' + type : '');
    clearTimeout(noticeToastTimer);
    noticeToastTimer = setTimeout(() => t.className = 'toast', 2800);
};

function playClickSound() {
    const sfx = document.getElementById('sfxClick');
    if(sfx) { sfx.currentTime = 0; sfx.volume = 0.5; sfx.play().catch(e=>{}); }
    if(navigator.vibrate) navigator.vibrate(20);
}

function playSendSound() {
    const sfx = document.getElementById('sfxSend');
    if(sfx) { sfx.currentTime = 0; sfx.volume = 0.4; sfx.play().catch(e=>{}); }
    if(navigator.vibrate) navigator.vibrate([30, 50, 30]);
}

// 🚀 APP LOAD & ADMIN CHECK
setTimeout(() => {
    S.session = JSON.parse(localStorage.getItem('mceo_sess') || 'null');
    if (!S.session || S.session.isGuest) {
        alert("🔒 Only Registered Students can view the Notice Board!");
        window.location.href = "index.html";
        return;
    }

    // Check if logged-in user's email exists in our ADMIN_EMAILS list
    const userEmail = S.session.email.toLowerCase();
    const isAdmin = ADMIN_EMAILS.includes(userEmail);
    
    if (isAdmin) {
        document.getElementById('adminBadge').style.display = 'block';
        document.getElementById('adminInputArea').style.display = 'flex'; // Show input box for admins
    }

    listenToNotices(isAdmin);
}, 500);

/* --- 📝 POST A NEW NOTICE (Admin Only) --- */
window.postNotice = async function() {
    const title = document.getElementById('nTitle').value.trim();
    const desc = document.getElementById('nDesc').value.trim();
    const category = document.getElementById('nCategory').value;

    if (!title || !desc) {
        playClickSound();
        showToast("⚠️ Please fill both Title and Description!", "error");
        return;
    }

    try {
        showToast("Posting Notice... ⏳");
        await noticeRef.add({
            title: title,
            description: desc,
            category: category,
            authorName: S.session.name || "School Admin",
            authorEmail: S.session.email.toLowerCase(),
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });

        playSendSound();
        document.getElementById('nTitle').value = '';
        document.getElementById('nDesc').value = '';
        showToast("📢 Notice Published Successfully!", "success");

    } catch (e) {
        alert("❌ Firebase Error: " + e.message);
    }
}

/* --- 📡 LISTEN TO REAL-TIME NOTICES --- */
function listenToNotices(isAdmin) {
    const container = document.getElementById('noticeContainer');

    noticeRef.orderBy('timestamp', 'desc').onSnapshot(snapshot => {
        if (snapshot.empty) {
            container.innerHTML = `
                <div style="text-align:center; margin-top: 50px; opacity: 0.5;">
                  <i class="fa-regular fa-clipboard" style="font-size: 40px; margin-bottom: 10px;"></i>
                  <p style="font-size: 14px;">No notices yet.</p>
                </div>`;
            return;
        }

        container.innerHTML = ''; // Clear loading text

        snapshot.forEach(doc => {
            const notice = doc.data();
            const noticeId = doc.id;
            
            let dateStr = "Just now";
            if (notice.timestamp) {
                const dateObj = notice.timestamp.toDate();
                dateStr = dateObj.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
            }

            const catIcons = { "general": "📢 General", "homework": "📝 Homework", "exam": "🚨 Exam", "holiday": "🌴 Holiday" };
            
            // Delete button HTML (Only visible to Admins)
            const delBtnHtml = isAdmin ? `<button class="del-btn" onclick="deleteNotice('${noticeId}')" style="display:block;" title="Delete Notice"><i class="fa-solid fa-trash"></i></button>` : '';

            const cardHtml = `
                <div class="notice-card cat-${notice.category}">
                    <div class="n-header">
                        <span class="n-cat">${catIcons[notice.category] || "📢 Notice"}</span>
                        <span class="n-date">${dateStr}</span>
                    </div>
                    <div class="n-title">${notice.title}</div>
                    <div class="n-desc">${notice.description}</div>
                    <div class="n-author">
                        <i class="fa-solid fa-user-tie"></i> By: ${notice.authorName}
                    </div>
                    ${delBtnHtml}
                </div>
            `;
            
            container.insertAdjacentHTML('beforeend', cardHtml);
        });
    }, error => {
        container.innerHTML = `<div style="text-align:center; color: var(--danger); margin-top: 50px;">❌ Network Error. Make sure Firebase rules are updated.</div>`;
        console.error(error);
    });
}

/* --- 🗑️ DELETE NOTICE (Admin Only) --- */
window.deleteNotice = async function(noticeId) {
    playClickSound();
    if (!confirm("👑 ADMIN: Are you sure you want to delete this notice?")) return;
    
    try {
        await noticeRef.doc(noticeId).delete();
        showToast("🗑️ Notice Deleted!", "success");
    } catch (e) {
        alert("❌ Delete Error: " + e.message);
    }
}
