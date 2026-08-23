/* ████████████████████████████████████████████████████████████
                  SIDEBAR & ADMIN SYSTEM
████████████████████████████████████████████████████████████ */

// ⚙️ 1. EASY CONFIGURATION (CHANGE LINKS & PASSWORD HERE)
const ADMIN_PASSWORD = "Rukmani";
const LINK_INSTA = "https://www.instagram.com/ankesh_2427?igsh=MWIzODMyeHl3bXRkMQ==";
const LINK_TELEGRAM = "https://t.me/ankesh2427";
const LINK_YOUTUBE = "https://youtube.com/@airaiderff?si=iBkDqki4TZpWeMMn";
const LINK_PORTFOLIO = "https://anru-editz.netlify.app/";

// ⚙️ Set Links on Load
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
    // Update User Info in Sidebar
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
    if(typeof playSfx === 'function') playSfx('click');
}

function closeSidebar() {
    document.getElementById('sidebarOverlay').classList.remove('active');
    document.getElementById('sidebarMenu').classList.remove('active');
}

// ==========================================
// 2. SIDEBAR CONTROLS & NEW FEATURES
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
    if(typeof playSfx === 'function') playSfx('click');
}

function closeSidebar() {
    document.getElementById('sidebarOverlay').classList.remove('active');
    document.getElementById('sidebarMenu').classList.remove('active');
}

// 🔥 SMART SHARE (With Copy Clipboard Fallback)
function shareApp() {
    const shareData = {
        title: 'AnRu Focus App',
        text: 'Bhai, main AnRu Focus app par padhai kar raha hu. Backlogs crush karne ka best AI tool hai! Tu bhi try kar 🚀',
        url: "https://ankesh908280-gif.github.io/AnRu-focus/" 
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        // Mobile ka asli share menu kholega
        navigator.share(shareData).catch((error) => console.log('Sharing cancelled', error));
    } else {
        // Agar share kaam nahi karega, toh link copy ho jayega!
        navigator.clipboard.writeText(shareData.text + "\n" + shareData.url);
        if(typeof playSfx === 'function') playSfx('success');
        if(typeof showToast === 'function') showToast("Link Copied! Paste in WhatsApp 📋", "success");
    }
}

// 🌟 NEW: Rate App & Privacy
function rateApp() {
    closeSidebar();
    if(typeof playSfx === 'function') playSfx('success');
    if(typeof showToast === 'function') showToast("Thanks! Rating page will open here ⭐", "success");
}

function showPrivacy() {
    closeSidebar();
    if(typeof playSfx === 'function') playSfx('click');
    if(typeof showToast === 'function') showToast("🔒 Your data is 100% encrypted & safe.");
}

// ==========================================
// 3. IN-APP FEEDBACK SYSTEM
// ==========================================
function openFeedbackModal() {
    closeSidebar();
    document.getElementById('fbMessage').value = '';
    document.getElementById('feedbackModal').classList.add('open');
}

async function submitFeedback() {
    const msg = document.getElementById('fbMessage').value.trim();
    if(!msg) {
        if(typeof playSfx === 'function') playSfx('error');
        if(typeof showToast === 'function') showToast("Bhai pehle message toh likh!", "error");
        return;
    }
    
    if(typeof showToast === 'function') showToast("Sending to Developer... 🚀");
    
    const userEmail = (typeof S !== 'undefined' && S.session) ? S.session.email : "Guest";
    const userName = (typeof S !== 'undefined' && S.session) ? S.session.name : "Guest User";
    
    try {
        await db.collection('feedbacks').add({
            name: userName,
            email: userEmail,
            message: msg,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            date: new Date().toLocaleDateString('en-IN')
        });
        
        document.getElementById('feedbackModal').classList.remove('open');
        if(typeof playSfx === 'function') playSfx('success');
        if(typeof showToast === 'function') showToast("Feedback Sent! Thank you 💖", "success");
    } catch (error) {
        console.error("Feedback Error:", error);
        if(typeof playSfx === 'function') playSfx('error');
        if(typeof showToast === 'function') showToast("Network Error! Try again.", "error");
    }
}

// ==========================================
// 4. SECRET ADMIN SYSTEM (JAMES BOND MODE)
// ==========================================
let tapCount = 0;
let tapTimer = null;

function handleSecretTap() {
    tapCount++;
    if(tapTimer) clearTimeout(tapTimer);
    
    tapTimer = setTimeout(() => {
        tapCount = 0; // Reset if user is too slow
    }, 2000); // 2 seconds window
    
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
        if(typeof playSfx === 'function') playSfx('success');
        openAdminDashboard();
    } else {
        if(typeof playSfx === 'function') playSfx('error');
        if(typeof showToast === 'function') showToast("❌ Access Denied: Wrong Password", "error");
        document.getElementById('adminPassModal').classList.remove('open');
    }
}

async function openAdminDashboard() {
    document.getElementById('adminDashModal').classList.add('open');
    const listDiv = document.getElementById('adminFeedbackList');
    listDiv.innerHTML = '<div style="text-align:center; color:#888; font-size:12px; margin-top:20px;">Fetching logs from cloud... ☁️</div>';
    
    try {
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
        listDiv.innerHTML = '<div style="text-align:center; color:var(--danger); font-size:13px; margin-top:20px;">Error fetching data!</div>';
        console.error("Admin Fetch Error:", error);
    }
}
