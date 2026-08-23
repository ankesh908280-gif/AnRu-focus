/* ████████████████████████████████████████████████████████████
      AI VISION SCANNER (VIDYAKUL TO TASK AUTO-GENERATOR)
      🔥 GEMINI 3.6 FLASH STRICT UPDATE 🔥
████████████████████████████████████████████████████████████ */

const ai_part1 = "AQ.Ab8RN6Jifj2Wi7C7lqN4";
const ai_part2 = "blnc2NWzicoY9CoVIjj6Qv34npFIvQ";
const AI_GEMINI_KEY = ai_part1 + ai_part2;

let pendingScannedClasses = [];

window.handleClassScan = function(event) {
    const file = event.target.files[0];
    if(!file) return;

    const reader = new FileReader();
    reader.onload = async function(e) {
        const base64Data = e.target.result.split(',')[1]; 
        const mimeType = file.type;
        
        const loader = document.getElementById('aiScanLoader');
        if(loader) loader.style.display = 'flex'; // लोडर चालू
        
        if(typeof playSfx === 'function') playSfx('click');
        
        try {
            await extractClassesWithAI(base64Data, mimeType);
        } catch (error) {
            console.error("Scanner Error:", error);
            if(loader) loader.style.display = 'none'; // एरर आने पर लोडर बंद
            if(typeof showToast === 'function') showToast("⚠️ Error: " + error.message, "error");
            else alert("⚠️ Error: " + error.message);
        }
        
        // फाइल इनपुट को रीसेट करो ताकि दोबारा वही फोटो चुन सको
        const inputEl = document.getElementById('aiVisionInput');
        if(inputEl) inputEl.value = ''; 
    };
    reader.readAsDataURL(file);
};

async function extractClassesWithAI(base64Image, mimeType) {
    // 🚀 STRICTLY SET TO GEMINI 3.6 FLASH
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${VISION_API_KEY}`;
    
    // 🧠 SMART PROMPT
    const systemPrompt = `Analyze this screenshot from an online class app. Find all the distinct classes/lectures listed.
    
    For each class, extract:
    1. 'taskName': The full lecture name (e.g. "L-2 || 6.2 एकबीजपत्री...").
    2. 'subject': Match it STRICTLY to one of these: "Physics", "Maths", "Hindi", "English", "Chemistry". If it's Biology or something else, write "Other".
    3. 'date': Convert the given date (like Aug 21, 2026) to "YYYY-MM-DD" format (e.g. "2026-08-21").

    RETURN STRICTLY A JSON OBJECT matching this format exactly, with no extra text or markdown:
    {
      "classes": [
        { "taskName": "lecture name here", "subject": "Maths", "date": "2026-08-21" }
      ]
    }`;

    const payload = { 
        contents: [{ 
            parts: [
                { text: systemPrompt },
                { inlineData: { mimeType: mimeType, data: base64Image } }
            ] 
        }],
        generationConfig: { responseMimeType: "application/json" }
    };

    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    const data = await response.json();
    
    // 🚨 SMART ERROR HANDLING
    if (!response.ok) {
        let errorMsg = data.error?.message || "Vision API Error";
        if(errorMsg.includes("not found")) errorMsg = "Gemini 3.6 Server Not Found. (Check your Google API Account)";
        else if(errorMsg.includes("quota")) errorMsg = "API Free Quota Exceeded!";
        throw new Error(errorMsg);
    }

    if (!data.candidates || data.candidates.length === 0) {
        throw new Error("AI ने फोटो से कोई जानकारी नहीं दी।");
    }

    let rawText = data.candidates[0].content.parts[0].text;
    let parsedData;
    
    try {
        // AI कभी-कभी markdown लगा देता है, उसे साफ करना ज़रूरी है
        rawText = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
        parsedData = JSON.parse(rawText);
    } catch(err) {
        console.error("JSON Error:", rawText);
        throw new Error("AI का जवाब सही फॉर्मेट में नहीं था।");
    }
    
    pendingScannedClasses = parsedData.classes || [];
    
    const loader = document.getElementById('aiScanLoader');
    if(loader) loader.style.display = 'none'; // स्कैन पूरा होने पर लोडर बंद
    
    if(pendingScannedClasses.length === 0) {
        if(typeof showToast === 'function') showToast("AI को इस फोटो में कोई क्लास नहीं मिली!", "error");
    } else {
        if(typeof playSfx === 'function') playSfx('success');
        showApprovalModal();
    }
}

function showApprovalModal() {
    const listDiv = document.getElementById('aiClassesList');
    if(!listDiv) return;
    listDiv.innerHTML = '';
    
    pendingScannedClasses.forEach((cls, idx) => {
        // Biology (Other) को automatically un-tick रखेगा
        const isChecked = cls.subject === "Other" ? "" : "checked";
        const subColor = cls.subject === "Other" ? "color: var(--danger);" : "color: var(--warn);";
        
        listDiv.innerHTML += `
            <div class="scanned-class-item hover-scale">
                <input type="checkbox" id="scan-chk-${idx}" value="${idx}" ${isChecked}>
                <div class="sci-details">
                    <div class="sci-name">${cls.taskName}</div>
                    <div class="sci-meta">
                        <span style="${subColor}">📁 ${cls.subject}</span>
                        <span style="color: var(--textSub);">📅 ${cls.date}</span>
                    </div>
                </div>
            </div>
        `;
    });
    
    const modal = document.getElementById('aiScannerModal');
    if(modal) modal.classList.add('open');
}

window.closeAIModal = function() {
    const modal = document.getElementById('aiScannerModal');
    if(modal) modal.classList.remove('open');
};

// ✨ AUTO-ADD TO YOUR MAIN APP (app.js)
window.approveAndAddClasses = function() {
    if(typeof S === 'undefined' || !S.tasks) {
        alert("App state not found! Please wait for app to load."); return;
    }

    let selectedClasses = [];
    pendingScannedClasses.forEach((cls, idx) => {
        const checkbox = document.getElementById(`scan-chk-${idx}`);
        if(checkbox && checkbox.checked) selectedClasses.push(cls);
    });

    if(selectedClasses.length === 0) {
        if(typeof showToast === 'function') showToast("Please select at least one class!", "error");
        if(typeof playSfx === 'function') playSfx('error');
        return;
    }

    // Add directly to global 'S.tasks' array 
    selectedClasses.forEach(cls => {
        S.tasks.unshift({
            id: Date.now() + Math.floor(Math.random() * 1000),
            name: cls.taskName,
            date: cls.date,
            note: "🤖 Auto-added via AI Scanner",
            subj: cls.subject === "Other" ? "" : cls.subject,
            priority: "high", 
            isDone: false,
            isTwoStep: true,  
            watched: false,
            notesMade: false,
            subtasks: [],
            repScheduled: false,
            isRevision: false,
            isBacklog: false
        });
        S.xp += 15; // Give XP for adding tasks!
    });

    // Save and refresh UI instantly
    if(typeof saveData === 'function') saveData();
    if(typeof renderAll === 'function') renderAll();
    
    closeAIModal();
    if(typeof playSfx === 'function') playSfx('task_complete');
    if(typeof showToast === 'function') showToast(`🔥 Success! ${selectedClasses.length} tasks synced!`, "success");
};
