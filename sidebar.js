/* ████████████████████████████████████████████████████████████
                  SIDEBAR & ADMIN SYSTEM (PURE FIREBASE)
████████████████████████████████████████████████████████████ */

// ⚙️ 1. EASY CONFIGURATION 
const ADMIN_PASSWORD = "Rukmani";
const LINK_INSTA = "https://www.instagram.com/ankesh_2427?igsh=MWIzODMyeHl3bXRkMQ==";
const LINK_TELEGRAM = "https://t.me/ankesh2427";
const LINK_YOUTUBE = "https://youtube.com/@airaiderff?si=iBkDqki4TZpWeMMn";
const LINK_PORTFOLIO = "https://anru-editz.netlify.app/";

// 🔥 MAIN APP SHARE LINK
const LINK_APP_SHARE = "https://ankesh908280-gif.github.io/AnRu-focus/"; 

document.addEventListener("DOMContentLoaded", () => {
    const iLink = document.getElementById('linkInsta'); if(iLink) iLink.href = LINK_INSTA;
    const tLink = document.getElementById('linkTele'); if(tLink) tLink.href = LINK_TELEGRAM;
    const yLink = document.getElementById('linkYt'); if(yLink) yLink.href = LINK_YOUTUBE;
    const pLink = document.getElementById('linkPort'); if(pLink) pLink.href = LINK_PORTFOLIO;
});

// ==========================================
// 2. SIDEBAR CONTROLS
// ==========================================
function openSidebar() {
    if(typeof S !== 'undefined' && S.session) {
        document.getElementById('sbName').textContent = S.session.name || "Champion";
        const init = (S.session.name || "C").charAt(0).toUpperCase();
        const av = document.getElementById('sbAv');
        if(S.session.pfp) { av.textContent=''; av.style.backgroundImage=`url(${S.session.pfp})`; } 
        else { av.textContent=init; av.style.backgroundImage=''; }
        
        let rank = "Rookie 🌟";
        if(typeof getRank === 'function') rank = getRank(S.xp);
        if (S.unlocks?.badge_legend) rank = "👑 Legend Focus CEO";
        else if (S.unlocks?.badge_scholar) rank = "🎓 Elite Scholar";
        else if (S.unlocks?.badge_ninja) rank = "🥷 Silent Ninja";
        document.getElementById('sbRank').textContent = rank;
    }
    document.getElementById('sidebarOverlay').classList.add('active');
    document.getElementById('sidebarMenu').classList.add('active');
    try { if(typeof playSfx === 'function') playSfx('click'); } catch(e){}
}

function closeSidebar() {
    document.getElementById('sidebarOverlay').classList.remove('active');
    document.getElementById('sidebarMenu').classList.remove('active');
}

// 🔥 SMART SHARE (Native Web Share API)
function shareApp() {
    const shareData = {
        title: 'AnRu Focus App',
        text: 'Bhai, main AnRu Focus app par padhai kar raha hu. Backlogs crush karne ka best AI tool hai! Tu bhi try kar 🚀',
        url: LINK_APP_SHARE
    };

    if (navigator.share) {
        navigator.share(shareData).catch((error) => console.log('Sharing cancelled', error));
    } else {
        navigator.clipboard.writeText(shareData.text + "\n" + shareData.url).then(() => {
            try { if(typeof playSfx === 'function') playSfx('success'); } catch(e){}
            if(typeof showToast === 'function') showToast("App Link Copied! Paste in WhatsApp 📋", "success");
        }).catch(err => {
            if(typeof showToast === 'function') showToast("Share failed. Please copy link manually.", "error");
        });
    }
}

function rateApp() {
    closeSidebar();
    try { if(typeof playSfx === 'function') playSfx('success'); } catch(e){}
    if(typeof showToast === 'function') showToast("Thanks! Rating page will open here ⭐", "success");
}

function showPrivacy() {
    closeSidebar();
    try { if(typeof playSfx === 'function') playSfx('click'); } catch(e){}
    if(typeof showToast === 'function') showToast("🔒 Your data is 100% encrypted & safe.");
}

// ==========================================
// 3. PURE FIREBASE FEEDBACK SYSTEM
// ==========================================
function openFeedbackModal() {
    closeSidebar();
    const fbInput = document.getElementById('fbMessage');
    if(fbInput) fbInput.value = '';
    
    const fbModal = document.getElementById('feedbackModal');
    if(fbModal) fbModal.classList.add('open');
}

async function submitFeedback() {
    const msgEl = document.getElementById('fbMessage');
    const msg = msgEl ? msgEl.value.trim() : '';
    
    if(!msg) {
        try { if(typeof playSfx === 'function') playSfx('error'); } catch(e){}
        if(typeof showToast === 'function') showToast("Bhai pehle message toh likh!", "error");
        return;
    }
    
    if(typeof showToast === 'function') showToast("Sending to Cloud... 🚀");
    
    const userEmail = (typeof S !== 'undefined' && S.session && S.session.email) ? S.session.email : "Guest";
    const userName = (typeof S !== 'undefined' && S.session && S.session.name) ? S.session.name : "Guest User";
    
    try {
        if (typeof db === 'undefined' || typeof firebase === 'undefined') {
            throw new Error("Firebase is not initialized in your app.js");
        }

        // ORIGINAL FIREBASE PUSH
        await db.collection('feedbacks').add({
            name: userName,
            email: userEmail,
            message: msg,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            date: new Date().toLocaleDateString('en-IN')
        });
        
        const fbModal = document.getElementById('feedbackModal');
        if(fbModal) fbModal.classList.remove('open');
        
        try { if(typeof playSfx === 'function') playSfx('success'); } catch(e){}
        if(typeof showToast === 'function') showToast("Report Sent Successfully! 💖", "success");

    } catch (error) {
        console.error("Firebase Error:", error);
        try { if(typeof playSfx === 'function') playSfx('error'); } catch(e){}
        // 🔥 Now you will see the exact Firebase error on your screen
        if(typeof showToast === 'function') showToast("Error: " + error.message, "error");
    }
}

// ==========================================
// 4. SECRET ADMIN SYSTEM 
// ==========================================
let tapCount = 0;
let tapTimer = null;

function handleSecretTap() {
    tapCount++;
    if(tapTimer) clearTimeout(tapTimer);
    
    tapTimer = setTimeout(() => {
        tapCount = 0; 
    }, 2000); 
    
    if(tapCount >= 5) {
        tapCount = 0;
        clearTimeout(tapTimer);
        openAdminAuth();
    }
}

function openAdminAuth() {
    closeSidebar();
    document.getElementById('adminPassInput').value = '';
    document.getElementById('adminPassModal').classList.add('open');
}

function verifyAdmin() {
    const inputPass = document.getElementById('adminPassInput').value;
    if(inputPass === ADMIN_PASSWORD) {
        document.getElementById('adminPassModal').classList.remove('open');
        try { if(typeof playSfx === 'function') playSfx('success'); } catch(e){}
        openAdminDashboard();
    } else {
        try { if(typeof playSfx === 'function') playSfx('error'); } catch(e){}
        if(typeof showToast === 'function') showToast("❌ Access Denied: Wrong Password", "error");
        document.getElementById('adminPassModal').classList.remove('open');
    }
}

async function openAdminDashboard() {
    const adminModal = document.getElementById('adminDashModal');
    if(adminModal) adminModal.classList.add('open');
    
    const listDiv = document.getElementById('adminFeedbackList');
    if(!listDiv) return;
    
    listDiv.innerHTML = '<div style="text-align:center; color:#888; font-size:12px; margin-top:20px;">Fetching logs from cloud... ☁️</div>';
    
    try {
        if (typeof db === 'undefined') throw new Error("Firebase DB not initialized.");
        
        const snapshot = await db.collection('feedbacks').orderBy('timestamp', 'desc').limit(50).get();
        if(snapshot.empty) {
            listDiv.innerHTML = '<div style="text-align:center; color:var(--success); font-size:13px; margin-top:20px;">No bugs reported. System is clean! ✨</div>';
            return;
        }
        
        let html = '';
        snapshot.forEach(doc => {
            const data = doc.data();
            html += `
                <div class="admin-fb-card">
                    <div class="admin-fb-header">
                        <span>📅 ${data.date || 'N/A'}</span>
                        <span style="color:var(--textMuted)">${data.email || 'Unknown'}</span>
                    </div>
                    <div class="admin-fb-user">👤 ${data.name || 'User'}</div>
                    <div class="admin-fb-msg">${data.message}</div>
                </div>
            `;
        });
        listDiv.innerHTML = html;
        
    } catch(error) {
        listDiv.innerHTML = `<div style="text-align:center; color:var(--danger); font-size:13px; margin-top:20px; line-height:1.4;">Error Fetching Data! <br><br> ${error.message}</div>`;
        console.error("Admin Fetch Error:", error);
    }
}
