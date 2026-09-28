/* ==========================================================================
   🧠 AnRu Focus Pro - 60-Second Daily Flash Recall (Study Warmup Engine)
   ========================================================================== */

const FlashRecall = (function() {
  const QUESTIONS = [
    { q: "nवें सेकंड में चली गई दूरी का सूत्र क्या है?", a: "Sₙ = u + ½ a(2n - 1)", subj: "Physics 11th" },
    { q: "1 kgf में कितने Newton होते हैं?", a: "1 kgf = 9.8 N (तथा 1 gf = 980 Dyne)", subj: "Physics 11th" },
    { q: "गोस्वामी तुलसीदास जी का जन्म स्थान कहाँ है?", a: "राजापुर (बांदा, उत्तर प्रदेश)", subj: "Hindi Sahitya" },
    { q: "करुण रस का स्थायी भाव क्या है?", a: "शोक (उदा. देखि सुदामा की दीन दशा...)", subj: "Hindi Grammar" },
    { q: "0! (Zero Factorial) का मान क्या होता है?", a: "0! = 1", subj: "Maths 11th" },
    { q: "गिब्स मुक्त ऊर्जा (Gibbs Energy) का सूत्र क्या है?", a: "ΔG = ΔH - TΔS (यदि ΔG < 0 तो प्रक्रम स्वतः)", subj: "Chemistry 11th" },
    { q: "प्रक्षेप्य गति में अधिकतम परास (R_max) किस कोण पर मिलती है?", a: "θ = 45° पर (R_max = u² / g)", subj: "Physics 11th" },
    { q: "महाकवि कबीरदास जी के गुरु का नाम क्या था?", a: "स्वामी रामानंद जी", subj: "Hindi Sahitya" }
  ];

  let currentIdx = 0;
  let timerInterval = null;
  let timeLeft = 60;
  let isRevealed = false;

  function openModal() {
    currentIdx = Math.floor(Math.random() * QUESTIONS.length);
    timeLeft = 60;
    isRevealed = false;
    clearInterval(timerInterval);

    const mc = document.getElementById('modalContent');
    const ov = document.getElementById('modalOverlay');
    if (!mc || !ov) return;

    renderWarmupUI();
    ov.classList.add('open');
    if (typeof playSfx === 'function') playSfx('click');

    timerInterval = setInterval(() => {
      timeLeft--;
      const timeEl = document.getElementById('warmupTimeLeft');
      if (timeEl) timeEl.textContent = timeLeft + "s";
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        revealAnswer();
      }
    }, 1000);
  }

  function renderWarmupUI() {
    const item = QUESTIONS[currentIdx];
    const mc = document.getElementById('modalContent');
    if (!mc) return;

    mc.innerHTML = `
      <div style="text-align:center;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <span style="font-size:10px; font-weight:800; background:rgba(168,85,247,0.2); border:1px solid #a855f7; color:#c084fc; padding:3px 10px; border-radius:12px;">
            ${item.subj}
          </span>
          <span style="font-size:13px; font-weight:900; color:#fbbf24;" id="warmupTimeLeft">
            <i class="fa-solid fa-stopwatch"></i> ${timeLeft}s
          </span>
        </div>

        <h3 style="font-size:16px; font-weight:800; color:#fff; margin-bottom:16px; line-height:1.4;">
          ${item.q}
        </h3>

        <div id="warmupAnswerBox" style="background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.12); border-radius:16px; padding:18px; margin-bottom:18px; min-height:60px; display:flex; align-items:center; justify-content:center;">
          ${isRevealed ? `
            <div style="font-size:15px; font-weight:800; color:#4ade80;">${item.a}</div>
          ` : `
            <div style="font-size:13px; color:rgba(255,255,255,0.5); font-style:italic;">
              <i class="fa-solid fa-brain"></i> Dimag par zor daalo... Click to Reveal
            </div>
          `}
        </div>

        <div style="display:flex; gap:10px;">
          ${!isRevealed ? `
            <button class="btn btn-grad" style="flex:1; border-radius:12px;" onclick="FlashRecall.revealAnswer()">
              Reveal Answer 👁️
            </button>
          ` : `
            <button class="btn-sm" style="flex:1; background:rgba(74,222,128,0.2); border:1px solid #4ade80; color:#4ade80; border-radius:12px; padding:12px;" onclick="FlashRecall.claimed(true)">
              I Knew It! (+25 XP) 🎯
            </button>
            <button class="btn-sm" style="flex:1; background:rgba(248,113,113,0.15); border:1px solid #f87171; color:#f87171; border-radius:12px; padding:12px;" onclick="FlashRecall.claimed(false)">
              Forgot (+10 XP) 📚
            </button>
          `}
        </div>
      </div>
    `;
  }

  function revealAnswer() {
    isRevealed = true;
    clearInterval(timerInterval);
    renderWarmupUI();
    if (typeof playSfx === 'function') playSfx('click');
  }

  function claimed(remembered) {
    clearInterval(timerInterval);
    const earned = remembered ? 25 : 10;
    if (typeof S !== 'undefined') {
      S.xp = (S.xp || 0) + earned;
      if (typeof saveData === 'function') saveData();
      if (typeof renderAll === 'function') renderAll();
    }
    if (typeof playSfx === 'function') playSfx('success');
    if (typeof showToast === 'function') showToast(`🧠 Warmup complete! +${earned} XP`, 'success');
    if (typeof closeModal === 'function') closeModal();
  }

  return {
    openModal,
    revealAnswer,
    claimed
  };
})();

window.FlashRecall = FlashRecall;
