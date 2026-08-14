/* ████████████████████████████████████████████████████████████
                  LIVE DOUBT ROOM - BULLETPROOF FIREBASE ENGINE 
████████████████████████████████████████████████████████████ */

const ADMIN_EMAIL = "ankesh908280@gmail.com"; 
const BAD_WORDS = ["gali", "badword", "stupid", "idiot", "pagal", "fakegali1", "fakegali2"]; 
const chatRef = db.collection('doubt_room_chats');

let doubtToastTimer;
window.showToast = function(msg, type='') {
    const t = document.getElementById('toast');
    if(!t) return;
    t.textContent = msg;
    t.className = 'toast show' + (type ? ' ' + type : '');
    clearTimeout(doubtToastTimer);
    doubtToastTimer = setTimeout(() => t.className = 'toast', 2800);
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

setTimeout(async () => {
    S.session = JSON.parse(localStorage.getItem('mceo_sess') || 'null');
    if (!S.session || S.session.isGuest) {
        alert("🔒 Only Registered Students can enter Doubt Room!");
        window.location.href = "index.html";
        return;
    }
    loadDataLocal();
    if (S.session.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
        document.getElementById('godModeBadge').style.display = 'block';
    } else {
        document.getElementById('godModeBadge').style.display = 'none';
    }
    checkMuteStatus();
    setupChatInput();
    listenToChats();
}, 500); 

function filterMessage(text) {
    let safeText = text;
    let violationCount = 0;
    BAD_WORDS.forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        if (regex.test(safeText)) { safeText = safeText.replace(regex, "***"); violationCount++; }
    });
    return { safeText, violationCount };
}

function checkMuteStatus() {
    const muteUntil = localStorage.getItem('chat_mute_until');
    const inputField = document.getElementById('msgInput');
    const sendBtn = document.querySelector('.send-btn');
    if (muteUntil && Date.now() < parseInt(muteUntil)) {
        if(inputField) { inputField.disabled = true; inputField.placeholder = "🚫 You are muted for 24 hours!"; }
        if(sendBtn) { sendBtn.style.opacity = '0.5'; sendBtn.onclick = null; }
    } else if (muteUntil && Date.now() >= parseInt(muteUntil)) {
        localStorage.setItem('chat_strikes', '0');
        localStorage.removeItem('chat_mute_until');
        if(inputField) { inputField.disabled = false; inputField.placeholder = "Type your doubt here... (Profanity blocked)"; }
        if(sendBtn) { sendBtn.style.opacity = '1'; sendBtn.onclick = mockSendMessage; }
    }
}

function handleStrike() {
    let strikes = parseInt(localStorage.getItem('chat_strikes') || '0');
    strikes++;
    localStorage.setItem('chat_strikes', strikes.toString());
    if (strikes >= 3) {
        const muteTime = Date.now() + (24 * 60 * 60 * 1000);
        localStorage.setItem('chat_mute_until', muteTime.toString());
        playSfx('error');
        alert("🚫 3 Strikes Reached! You are muted for 24 Hours.");
        checkMuteStatus();
    } else {
        playSfx('error');
        alert(`⚠️ Warning: Inappropriate language detected! Strike ${strikes}/3.`);
    }
}

function setupChatInput() {
    const tx = document.getElementById('msgInput');
    if(!tx) return;
    tx.addEventListener("input", function() {
        this.style.height = 'auto'; this.style.height = (this.scrollHeight) + 'px';
        if(this.scrollHeight > 100) this.style.overflowY = 'auto';
    }, false);
    tx.addEventListener("keypress", function(e) {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendRealMessage(false); }
    });
}

async function sendRealMessage(isPhoto = false, photoUrl = null) {
    const input = document.getElementById('msgInput');
    const text = input.value.trim();
    if (!text && !isPhoto) return;
    const { safeText, violationCount } = filterMessage(text);
    if (violationCount > 0) handleStrike();
    const muteUntil = localStorage.getItem('chat_mute_until');
    if (muteUntil && Date.now() < parseInt(muteUntil)) return;

    const userLevel = Math.floor(S.xp / 1000) + 1;
    try {
        await chatRef.add({
            text: safeText,
            senderName: S.session.name || "Student",
            senderEmail: S.session.email.toLowerCase() || "unknown",
            senderLevel: userLevel,
            isPhoto: isPhoto,
            photoUrl: photoUrl || "",
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            reports: 0
        });
        playSendSound();
        input.value = '';
        input.style.height = 'auto';
    } catch (e) { alert("❌ Firebase Upload Error: " + e.message); }
}

window.mockSendMessage = function() { sendRealMessage(false); }

window.tryAttachPhoto = function() {
    playClickSound();
    const userLevel = Math.floor(S.xp / 1000) + 1;
    if (userLevel < 5 && S.xp < 500) {
        alert("🔒 Photo Sharing Locked!\n\nYou need Level 5 or 500 XP to share photos.");
        return;
    }
    document.getElementById('chatPhotoInput').click();
}

window.handleChatPhotoUpload = async function(e) {
    try {
        const file = e.target.files[0];
        if (!file) return;
        if (typeof showToast === 'function') showToast("Processing HD Image... ⏳");

        const reader = new FileReader();
        reader.readAsDataURL(file);
        
        reader.onload = function(event) {
            const img = new Image();
            img.src = event.target.result;
            
            img.onload = async function() {
                try {
                    const canvas = document.createElement("canvas");
                    // 🚀 Fix 1: HD Quality - MAX_SIZE increased to 1200px
                    const MAX_SIZE = 1200;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_SIZE) { height *= MAX_SIZE / width; width = MAX_SIZE; }
                    } else {
                        if (height > MAX_SIZE) { width *= MAX_SIZE / height; height = MAX_SIZE; }
                    }

                    canvas.width = width; canvas.height = height;
                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0, width, height);

                    // 🚀 Quality increased to 0.85 (Clear readable text)
                    const compressedUrl = canvas.toDataURL("image/jpeg", 0.85);

                    document.getElementById("msgInput").value = "Shared a Concept Note 📸";
                    if (typeof showToast === 'function') showToast("Uploading to Cloud... ☁️");
                    
                    await sendRealMessage(true, compressedUrl);
                    document.getElementById("chatPhotoInput").value = "";
                } catch (err) { alert("❌ Processing Error: " + err.message); }
            };
        };
    } catch (globalErr) { alert("❌ Upload Error: " + globalErr.message); }
};

/* --- 🖼️ FULLSCREEN ZOOM & BLOB DOWNLOAD FIX --- */
let currentZoom = 1;

window.handlePhotoClick = function(element, url) {
    const img = element.querySelector('.chat-photo');
    if (!img.classList.contains('revealed')) {
        img.classList.add('revealed');
        playClickSound();
    } else {
        // 🚀 Fix 3: Opens Fullscreen Image viewer
        const viewer = document.getElementById('imageViewer');
        const fsImg = document.getElementById('fullscreenImg');
        fsImg.src = url;
        currentZoom = 1;
        fsImg.style.transform = `scale(${currentZoom})`;
        viewer.style.display = 'flex';
    }
}

window.closeImageViewer = function() {
    document.getElementById('imageViewer').style.display = 'none';
}

window.zoomImg = function(amount) {
    const img = document.getElementById('fullscreenImg');
    currentZoom += amount;
    if(currentZoom < 0.5) currentZoom = 0.5; // Min zoom out
    if(currentZoom > 4) currentZoom = 4;     // Max zoom in
    img.style.transform = `scale(${currentZoom})`;
}

// 🚀 Fix 2: Blob Download Method (Force saves to gallery on mobile)
window.downloadImage = function(base64Data, filename) {
    try {
        if(typeof showToast === 'function') showToast("Downloading to Gallery... 📥");
        
        const arr = base64Data.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while(n--){ u8arr[n] = bstr.charCodeAt(n); }
        
        const blob = new Blob([u8arr], {type: mime});
        const url = window.URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        
        setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            if(typeof showToast === 'function') showToast("✅ Saved to Gallery!", "success");
        }, 100);
    } catch(e) {
        alert("❌ Download Failed: " + e.message);
    }
};

/* --- 📡 LIVE CHAT LISTENER --- */
function listenToChats() {
    const chatContainer = document.getElementById('chatContainer');
    if(!chatContainer) return;

    chatRef.orderBy('timestamp', 'asc').limitToLast(50).onSnapshot(snapshot => {
        chatContainer.innerHTML = `<div style="text-align:center; margin: 10px 0;"><span style="background:rgba(255,255,255,0.05); padding:4px 12px; border-radius:12px; font-size:10px; color:var(--textMuted); border:1px solid var(--glassBorder);">🔒 End-to-End Moderated. Profanity is strictly blocked.</span></div>`;

        snapshot.forEach(doc => {
            const msg = doc.data();
            const msgId = doc.id;
            if (msg.reports >= 3 && S.session.email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) return; 

            const isMe = msg.senderEmail === S.session.email.toLowerCase();
            const alignClass = isMe ? 'right' : 'left';
            const isAdminMsg = msg.senderEmail === ADMIN_EMAIL.toLowerCase();
            let nameTag = `${msg.senderName} <span class="msg-level">Lvl ${msg.senderLevel}</span>`;
            if (isAdminMsg) nameTag = `You <span class="msg-level" style="background:rgba(0,0,0,0.3); color:var(--danger);">👑 Admin</span>`;
            const timeStr = msg.timestamp ? msg.timestamp.toDate().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'Sending...';

            let contentHtml = msg.text;
            if (msg.isPhoto) {
                // 🚀 Added handling for new Zoom & Download logic
                contentHtml = `
                <div class="chat-photo-container" onclick="handlePhotoClick(this, '${msg.photoUrl}')">
                  <img src="${msg.photoUrl}" class="chat-photo" alt="Notes">
                  <div class="photo-overlay"><i class="fa-solid fa-eye-slash"></i><span>Tap to View Notes</span></div>
                </div>
                <div style="padding: 6px 8px; display: flex; justify-content: space-between; align-items: center;">
                  <span style="font-size: 13px;">${msg.text}</span>
                  <button onclick="downloadImage('${msg.photoUrl}', 'AnRu_Notes_${Date.now()}.jpg')" style="background: var(--p1); color: #fff; border:none; cursor:pointer; padding: 6px 12px; border-radius: 8px; font-size: 11px; font-weight: 700; display: flex; align-items: center; gap: 6px; box-shadow: 0 4px 10px rgba(102,126,234,0.3);">
                     <i class="fa-solid fa-download"></i> Save
                  </button>
                </div>
                `;
            }

            const isAdminUser = S.session.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
            const reportHtml = !isMe ? `<button class="action-btn report" title="Report" onclick="reportMsg('${msgId}')"><i class="fa-solid fa-flag"></i></button>` : '';
            const banHtml = isAdminUser ? `<button class="action-btn ban" title="Delete & Ban" onclick="adminDeleteMsg('${msgId}')"><i class="fa-solid fa-gavel"></i></button>` : '';

            const msgHtml = `
                <div class="msg-wrap ${alignClass}">
                  <div class="msg-sender" style="${isMe ? 'justify-content:flex-end;' : ''}">${nameTag}</div>
                  <div class="msg-bubble" style="${msg.isPhoto ? 'padding: 8px;' : ''} ${msg.reports >= 3 ? 'border: 1px solid red; opacity:0.5;' : ''}">
                    ${msg.reports >= 3 ? '<div style="font-size:10px;color:red;margin-bottom:4px;">🚩 Hidden by Community</div>' : ''}
                    ${contentHtml}
                    <span class="msg-time">${timeStr}</span>
                  </div>
                  <div class="msg-actions">${reportHtml}${banHtml}</div>
                </div>
            `;
            chatContainer.insertAdjacentHTML('beforeend', msgHtml);
        });
        chatContainer.scrollTop = chatContainer.scrollHeight;
    });
}

window.reportMsg = async function(msgId) {
    if (!confirm("Are you sure you want to report this message?")) return;
    playClickSound();
    try {
        await chatRef.doc(msgId).update({ reports: firebase.firestore.FieldValue.increment(1) });
        alert("🚩 Message Reported! Thanks for keeping the community safe.");
    } catch (e) { console.error(e); }
}

window.adminDeleteMsg = async function(msgId) {
    playSfx('error');
    if (!confirm("👑 ADMIN: Delete this message?")) return;
    try {
        await chatRef.doc(msgId).delete();
        alert("🔨 Message Destroyed by Admin.");
    } catch (e) { console.error(e); }
}
