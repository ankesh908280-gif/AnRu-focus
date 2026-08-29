/* ████████████████████████████████████████████████████████████
      AI VISION SCANNER (100% PLUG & PLAY MODULE)
      🔥 GEMINI 3.6 FLASH + NEW API KEY SECURE UPDATE 🔥
████████████████████████████████████████████████████████████ */

(function() {
    // 🛑 1. NATIVE APP FEEL: Prevent Text Selection
    document.addEventListener('selectstart', (e) => {
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') e.preventDefault();
    });
    document.addEventListener('contextmenu', (e) => {
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') e.preventDefault();
    });
    document.documentElement.style.webkitTouchCallout = 'none';
    document.documentElement.style.webkitUserSelect = 'none';

    // 🛑 2. NEW API CREDENTIALS (Split into 2 parts for security)
    const ai_part1 = "AQ.Ab8RN6IlUONYn6ITf-";
    const ai_part2 = "JrcNkOXAD1VAtBa5KYH1f_-RxAtuIO4w";
    const AI_GEMINI_KEY = ai_part1 + ai_part2;
    
    let pendingScannedClasses = [];

    // 🎨 3. AUTO-INJECT CSS (Design)
    const style = document.createElement('style');
    style.innerHTML = `
        .ai-scan-btn { width: 100%; margin-top: 15px; padding: 14px 20px; border: 1px solid rgba(168, 85, 247, 0.5); border-radius: 12px; background: linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(99, 102, 241, 0.15)); color: #fff; font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 15px; cursor: pointer; box-shadow: 0 4px 15px rgba(168, 85, 247, 0.2); display: flex; justify-content: center; align-items: center; gap: 10px; transition: 0.3s; }
        .ai-scan-btn:hover { background: linear-gradient(135deg, rgba(168, 85, 247, 0.3), rgba(99, 102, 241, 0.3)); transform: translateY(-2px); }
        .scanned-class-item { background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); padding: 12px; border-radius: 10px; display: flex; gap: 12px; align-items: flex-start; transition: 0.2s; margin-bottom: 10px; }
        .scanned-class-item:hover { background: rgba(255,255,255,0.05); }
        .scanned-class-item input[type="checkbox"] { width: 18px; height: 18px; margin-top: 4px; accent-color: #4ade80; cursor: pointer; }
        .sci-details { flex: 1; text-align: left; }
        .sci-name { font-size: 13px; font-weight: 700; color: #fff; line-height: 1.3; margin-bottom: 6px; }
        .sci-meta { font-size: 11px; display: flex; justify-content: space-between; font-weight: 600;}
        #aiScanLoader { display:none; position:fixed; inset:0; background:rgba(0,0,0,0.85); z-index:999999; justify-content:center; align-items:center; flex-direction:column; backdrop-filter:blur(15px); }
    `;
    document.head.appendChild(style);

    // 🏗️ 4. AUTO-INJECT HTML UI
    function injectUI() {
        // A. Create Loader
        const loaderDiv = document.createElement('div');
        loaderDiv.id = "aiScanLoader";
        loaderDiv.innerHTML = `
            <div style="font-size:60px; color:#4ade80; animation:bounceIcon 1s infinite;"><i class="fa-solid fa-expand fa-spin"></i></div>
            <h3 style="color:#4ade80; margin-top:20px; font-family:'Playfair Display', serif;">AI is Reading Screenshot...</h3>
            <p style="color:#aaa; font-size:13px; margin-top:5px;">Extracting dates, subjects & chapters!</p>
        `;
        document.body.appendChild(loaderDiv);

        // B. Create Approval Modal
        const modalDiv = document.createElement('div');
        modalDiv.className = "modal-overlay";
        modalDiv.id = "aiScannerModal";
        modalDiv.innerHTML = `
          <div class="modal-box glass2" style="max-width:400px; padding: 20px; text-align: center;">
            <button class="modal-close" onclick="window.aiPlugin.closeModal()"><i class="fa-solid fa-xmark"></i></button>
            <div class="modal-title" style="color: #4ade80; font-size: 20px;"><i class="fa-solid fa-robot"></i> AI Found These!</div>
            <p style="font-size: 12px; color: rgba(255,255,255,0.55); margin-bottom: 15px;">Uncheck classes you don't want (e.g., Biology).</p>
            <div id="aiClassesList" class="scroll-hide" style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; max-height: 250px; overflow-y: auto; text-align: left;">
            </div>
            <button class="btn btn-grad" style="width: 100%; background: linear-gradient(135deg, #10b981, #059669);" onclick="window.aiPlugin.approve()">Approve & Add <i class="fa-solid fa-check-double"></i></button>
          </div>
        `;
        document.body.appendChild(modalDiv);

        // C. Inject 'Scan' Button into Tasks Tab
        const taskAddCard = document.querySelector('#page-tasks .add-card');
        if(taskAddCard) {
            const btnHtml = `
                <button class="ai-scan-btn hover-glow anim-pulse" onclick="document.getElementById('aiVisionInput').click()">
                    <i class="fa-solid fa-camera-retro"></i> Scan to add Online Class (AI)
                </button>
                <input type="file" id="aiVisionInput" accept="image/*" style="display:none;" onchange="window.aiPlugin.handleScan(event)">
            `;
            taskAddCard.insertAdjacentHTML('beforeend', btnHtml);
        }
    }

    // Wait for DOM to load before injecting
    if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', injectUI); } 
    else { injectUI(); }

    // 🧠 5. CORE LOGIC (Anti-Crash Image Engine + 3.6 Flash)
    window.aiPlugin = {
        handleScan: function(event) {
            const file = event.target.files[0];
            if(!file) return;

            const loader = document.getElementById('aiScanLoader');
            if(loader) loader.style.display = 'flex';
            
            try { if(typeof playSfx === 'function') playSfx('click'); } catch(e){}

            const img = new Image();
            const url = URL.createObjectURL(file);

            img.onload = async function() {
                try {
                    const canvas = document.createElement('canvas');
                    let w = img.width; let h = img.height;
                    const maxDim = 800; // Compress heavy images

                    if (w > h && w > maxDim) { h *= maxDim / w; w = maxDim; } 
                    else if (h > maxDim) { w *= maxDim / h; h = maxDim; }

                    canvas.width = w; canvas.height = h;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, w, h);

                    const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6).split(',')[1];
                    await window.aiPlugin.extractAI(compressedBase64, 'image/jpeg');

                } catch (error) {
                    console.error("Scanner Error:", error);
                    if(typeof showToast === 'function') showToast("⚠️ Error: " + error.message, "error");
                    else alert("⚠️ Error: " + error.message);
                } finally {
                    if(loader) loader.style.display = 'none'; 
                    const inputEl = document.getElementById('aiVisionInput');
                    if(inputEl) inputEl.value = ''; 
                    URL.revokeObjectURL(url);
                }
            };

            img.onerror = function() {
                alert("Image load failed! Is it a valid photo?");
                if(loader) loader.style.display = 'none';
            };

            img.src = url;
        },

        extractAI: async function(base64Image, mimeType) {
            // 🔥 UPDATED TO GEMINI 3.6 FLASH AS PER DASHBOARD
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${AI_GEMINI_KEY}`;
            
            const systemPrompt = `Analyze this screenshot from an online class app. Find all the distinct classes/lectures listed.
            For each class, extract:
            1. 'taskName': The full lecture name (e.g. "L-2 || 6.2 एकबीजपत्री...").
            2. 'subject': Match it STRICTLY to one of these: "Physics", "Maths", "Hindi", "English", "Chemistry". If it's Biology or something else, write "Other".
            3. 'date': Convert the given date (like Aug 21, 2026) to "YYYY-MM-DD" format (e.g. "2026-08-21").
            RETURN STRICTLY A JSON OBJECT matching this format exactly, with no extra text or markdown:
            { "classes": [ { "taskName": "lecture name here", "subject": "Maths", "date": "2026-08-21" } ] }`;

            const payload = { 
                contents: [{ parts: [ { text: systemPrompt }, { inlineData: { mimeType: mimeType, data: base64Image } } ] }],
                generationConfig: { responseMimeType: "application/json" }
            };

            const response = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });

            let data;
            try { data = await response.json(); } 
            catch(e) { throw new Error("Google API Server se response nahi mila."); }
            
            if (!response.ok) throw new Error(data.error?.message || "Vision API Error");

            if (!data.candidates || data.candidates.length === 0 || !data.candidates[0].content) {
                throw new Error("AI ne photo se koi info nahi di (Photo clear nahi hai).");
            }

            let rawText = data.candidates[0].content.parts[0].text;
            let parsedData;
            
            try {
                rawText = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
                parsedData = JSON.parse(rawText);
            } catch(err) { throw new Error("AI ka format galat tha. Dubara scan karo."); }
            
            pendingScannedClasses = parsedData.classes || [];
            
            if(pendingScannedClasses.length === 0) {
                throw new Error("Is photo mein koi class nahi mili!");
            } else {
                try { if(typeof playSfx === 'function') playSfx('success'); } catch(e){}
                window.aiPlugin.showModal();
            }
        },

        showModal: function() {
            const listDiv = document.getElementById('aiClassesList');
            if(!listDiv) return;
            listDiv.innerHTML = '';
            
            pendingScannedClasses.forEach((cls, idx) => {
                const isChecked = cls.subject === "Other" ? "" : "checked";
                const subColor = cls.subject === "Other" ? "color: #f87171;" : "color: #fbbf24;";
                
                listDiv.innerHTML += `
                    <div class="scanned-class-item">
                        <input type="checkbox" id="scan-chk-${idx}" value="${idx}" ${isChecked}>
                        <div class="sci-details">
                            <div class="sci-name">${cls.taskName}</div>
                            <div class="sci-meta">
                                <span style="${subColor}">📁 ${cls.subject}</span>
                                <span style="color: rgba(255,255,255,0.75);">📅 ${cls.date}</span>
                            </div>
                        </div>
                    </div>
                `;
            });
            
            const modal = document.getElementById('aiScannerModal');
            if(modal) modal.classList.add('open');
        },

        closeModal: function() {
            const modal = document.getElementById('aiScannerModal');
            if(modal) modal.classList.remove('open');
        },

        approve: function() {
            if(typeof S === 'undefined' || !S.tasks) { alert("App state not found! Wait for app to load."); return; }

            let selectedClasses = [];
            pendingScannedClasses.forEach((cls, idx) => {
                const checkbox = document.getElementById(`scan-chk-${idx}`);
                if(checkbox && checkbox.checked) selectedClasses.push(cls);
            });

            if(selectedClasses.length === 0) {
                if(typeof showToast === 'function') showToast("Kam se kam ek class select karo!", "error");
                return;
            }

            selectedClasses.forEach(cls => {
                S.tasks.unshift({
                    id: Date.now() + Math.floor(Math.random() * 1000),
                    name: cls.taskName,
                    date: cls.date,
                    note: "🤖 Auto-added via AI Scanner",
                    subj: cls.subject === "Other" ? "" : cls.subject,
                    priority: "high", isDone: false, isTwoStep: true, watched: false, notesMade: false, subtasks: [], repScheduled: false, isRevision: false, isBacklog: false
                });
                S.xp += 15; 
            });

            if(typeof saveData === 'function') saveData();
            if(typeof renderAll === 'function') renderAll();
            
            window.aiPlugin.closeModal();
            try { if(typeof playSfx === 'function') playSfx('task_complete'); } catch(e){}
            if(typeof showToast === 'function') showToast(`🔥 Success! ${selectedClasses.length} tasks synced!`, "success");
        }
    };
})();
